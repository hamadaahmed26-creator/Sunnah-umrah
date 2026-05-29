"""Flights API — TravelPayouts / Aviasales Data API proxy.

Keeps the API token strictly server-side. Exposes:
  GET /api/flights/cheapest?destination=JED   → single cheapest fare (for home banner)
  GET /api/flights/search?origin=LON&destination=JED&month=2026-03  → list of fares

Currency defaults to GBP (the app's UK audience). Affiliate marker is embedded
in the returned `book_url` so commission attributes back to the user.

NOTE: Aviasales prices are CACHED (last 48h of user searches), not live
GDS inventory. They're accurate enough for "from £X" teasers and price
comparison, but the final price on Aviasales may differ slightly.
"""
from __future__ import annotations

import os
import time
from datetime import datetime, timedelta, timezone
from typing import Optional
from urllib.parse import urlencode

import httpx
from fastapi import APIRouter, HTTPException, Query

router = APIRouter(prefix="/flights", tags=["flights"])

TP_TOKEN  = os.environ.get("TRAVELPAYOUTS_TOKEN", "")
TP_MARKER = os.environ.get("TRAVELPAYOUTS_MARKER", "")
TP_BASE   = "https://api.travelpayouts.com"

# tiny in-memory cache so we don't burn rate-limits on the home banner
# (cheapest_LON_JED → (timestamp, payload))
_CACHE: dict[str, tuple[float, dict]] = {}
_CACHE_TTL = 60 * 30  # 30 minutes — fares barely change inside that window


async def _tp_get(client: httpx.AsyncClient, path: str, params: dict) -> dict:
    if not TP_TOKEN:
        raise HTTPException(status_code=503, detail="TravelPayouts not configured")
    try:
        r = await client.get(
            f"{TP_BASE}{path}",
            params=params,
            headers={"X-Access-Token": TP_TOKEN, "Accept": "application/json"},
            timeout=10.0,
        )
    except httpx.RequestError as e:
        raise HTTPException(status_code=502, detail=f"TravelPayouts unreachable: {e}")
    if r.status_code == 429:
        raise HTTPException(status_code=429, detail="Flight search rate-limited — try again shortly")
    if not r.is_success:
        raise HTTPException(status_code=r.status_code, detail=r.text[:300])
    return r.json()


def _build_book_url(origin: str, destination: str, depart_date: str,
                    return_date: Optional[str] = None, sub_id: Optional[str] = None) -> str:
    """Aviasales search URL with affiliate marker."""
    # depart_date / return_date are YYYY-MM-DD → Aviasales uses DDMM in path
    def _ddmm(d: str) -> str:
        dt = datetime.strptime(d, "%Y-%m-%d")
        return f"{dt.day:02d}{dt.month:02d}"

    parts = f"{origin}{_ddmm(depart_date)}{destination}"
    if return_date:
        parts += _ddmm(return_date)
    parts += "1"  # 1 adult
    qs = {"currency": "gbp", "locale": "en"}
    if TP_MARKER: qs["marker"] = TP_MARKER
    if sub_id:    qs["sub_id"] = sub_id
    return f"https://www.aviasales.com/search/{parts}?{urlencode(qs)}"


@router.get("/cheapest")
async def cheapest(
    origin: str = Query("LON", min_length=3, max_length=3),
    destination: str = Query("JED", min_length=3, max_length=3),
    currency: str = Query("gbp", min_length=3, max_length=3),
):
    """Single cheapest fare for the home banner.
    Returns: {price, currency, airline, depart_date, return_date, book_url} or {empty: true}.
    """
    cache_key = f"cheapest_{origin}_{destination}_{currency}"
    now = time.time()
    hit = _CACHE.get(cache_key)
    if hit and (now - hit[0]) < _CACHE_TTL:
        return hit[1]

    # search the next 3 months — pick whichever month has the cheapest result
    out: Optional[dict] = None
    async with httpx.AsyncClient() as client:
        for offset in (0, 1, 2):
            target = (datetime.now(timezone.utc).replace(day=1) + timedelta(days=32 * offset)).strftime("%Y-%m")
            try:
                data = await _tp_get(client, "/aviasales/v3/prices_for_dates", {
                    "origin": origin, "destination": destination,
                    "departure_at": target, "currency": currency,
                    "sorting": "price", "direct": "false", "limit": 1,
                    "one_way": "true", "unique": "false",
                })
            except HTTPException:
                continue
            rows = data.get("data") or []
            if not rows:
                continue
            row = rows[0]
            price = row.get("price")
            if price is None:
                continue
            if out is None or price < out["price"]:
                out = {
                    "price":        int(price),
                    "currency":     (data.get("currency") or currency).upper(),
                    "airline":      row.get("airline"),
                    "depart_date":  row.get("departure_at", "")[:10] or row.get("depart_date"),
                    "return_date":  (row.get("return_at") or "")[:10] or None,
                    "transfers":    row.get("transfers", 0),
                }
    if not out:
        payload = {"empty": True}
    else:
        out["book_url"] = _build_book_url(
            origin, destination,
            out["depart_date"],
            out.get("return_date"),
            sub_id="home-banner",
        )
        payload = out
    _CACHE[cache_key] = (now, payload)
    return payload


@router.get("/search")
async def search(
    origin: str = Query("LON", min_length=3, max_length=3),
    destination: str = Query("JED", min_length=3, max_length=3),
    departure_at: Optional[str] = Query(None, description="YYYY-MM or YYYY-MM-DD"),
    return_at: Optional[str] = Query(None, description="YYYY-MM-DD"),
    one_way: bool = Query(True),
    direct: bool = Query(False),
    currency: str = Query("gbp"),
    limit: int = Query(15, ge=1, le=30),
    sub_id: str = Query("flights-page"),
):
    """Up to `limit` cheap fares, sorted by price. Each row has a `book_url`."""
    if not departure_at:
        departure_at = (datetime.now(timezone.utc) + timedelta(days=30)).strftime("%Y-%m")
    params = {
        "origin":       origin,
        "destination":  destination,
        "departure_at": departure_at,
        "currency":     currency,
        "sorting":      "price",
        "direct":       str(direct).lower(),
        "limit":        limit,
        "one_way":      str(one_way).lower(),
        "unique":       "false",
    }
    if return_at and not one_way:
        params["return_at"] = return_at

    async with httpx.AsyncClient() as client:
        data = await _tp_get(client, "/aviasales/v3/prices_for_dates", params)

    rows = data.get("data") or []
    results = []
    for row in rows:
        depart = (row.get("departure_at") or "")[:10] or row.get("depart_date")
        ret    = (row.get("return_at") or "")[:10] or None
        if not depart:
            continue
        results.append({
            "price":        int(row["price"]),
            "currency":     (data.get("currency") or currency).upper(),
            "airline":      row.get("airline"),
            "flight_number": row.get("flight_number"),
            "depart_date":  depart,
            "return_date":  ret,
            "transfers":    row.get("transfers", 0),
            "duration":     row.get("duration"),
            "book_url":     _build_book_url(origin, destination, depart, ret, sub_id=sub_id),
        })
    return {"origin": origin, "destination": destination, "count": len(results), "results": results}
