# Pilgrim services and narration

Evidence checked 20 November 2026. Public provider pages establish product availability. Commission attribution requires the owner's partner reports.

## Saudi data eSIM

Yesim's Saudi destination lists fixed and unlimited plans, durations and a checkout control. Its 1 GB offer opens a Saudi-specific plan page. It describes the service as data-only and delivers installation instructions after payment. Prices can change, and tethering depends on the operator. Link to the live price. Check that the device supports eSIM and is unlocked before opening checkout. Regional variants of the same model can differ. No order or payment was made.

- Saudi plans and checkout: https://yesim.app/country/saudi-arabia/
- Specific plan checked: https://yesim.app/country/saudi-arabia/30days-1gb-esim-data-plan/
- Supported devices: https://yesim.app/compatible-devices/
- Compatibility guidance: https://help.yesim.app/which-mobile-phones-support-esim/

Travelpayouts publicly lists an 18% Yesim commission and a 90-day cookie. These figures describe the offer. Account approval, permitted traffic sources, attribution and actual payouts require partner-side evidence. Generate a deep link to the Saudi destination inside the project's approved account; assign a distinct SubID, check that the final destination is Saudi Arabia, and reconcile the SubID with the dashboard click report. A successful redirect alone does not verify a credited order. Use provider-approved test attribution evidence or reconcile a legitimate customer order; no self-purchase. The sample partner marker in the public marketing page belongs to the example. Display an affiliate disclosure next to any commissioned CTA, in the displayed language, including when a provider uses a branded short link.

- Partner programme: https://www.travelpayouts.com/en/offers/yesim-affiliate-program/
- SubID reporting: https://support.travelpayouts.com/hc/en-us/articles/115001389052-How-to-track-the-performance-of-your-affiliate-links-and-QR-codes

## What pilgrims already have

| Existing service | Public offering | Design implication |
| --- | --- | --- |
| Nusuk | Official permit issuance and other Saudi services. | Send pilgrims to Nusuk for permits. Identify Sunnah Umrah as independent. |
| Digital Mutawwif | Government service listing already describes a staged guide, counters and more than 170 supplications in text and audio. | Quantity and a counter alone give little reason to switch. Rehearse, make a mistake, learn the correction, then use familiar controls during the pilgrimage. |
| Umrah Guide | Advertises offline rituals, dua audio and interactive maps. | Test restoration after a closed tab and an interrupted journey. Make the saved next action visible in Easy Mode. |

- https://www.nusuk.sa/service-details/174
- https://my.gov.sa/en/services/2674798
- https://umrah.guide/

Usability test: give an unfamiliar pilgrim the phone. Ask them to practise the first leg of Sa'i, correct an accidental count, switch to the live guide, leave and recover their place in airplane mode. Observe unassisted completion, counter accuracy and recovery time. These are differentiation hypotheses until tested with actual pilgrims.

## ElevenLabs

The US-dollar monthly list price for Starter is $6 excluding taxes with 30,000 credits. Creator lists $22 per month with 121,000 credits. Ignore temporary first-month discounts when budgeting. ElevenLabs documents English and Arabic (Saudi Arabia/UAE) for Multilingual v2. A paid non-beta generation can carry commercial rights indefinitely subject to the service-specific terms, rights to inputs and applicable policies. A later subscription cannot retroactively license a free generation. Check the chosen voice's terms before generation.

Use paid, non-beta offline exports only after cost approval for original English/Arabic navigation and practical instructional narration. Record the script revision, voice/model, generation date, plan evidence and review. For ritual Arabic and Qur'anic recitation, obtain rights to a human recording and a qualified review against the approved text. Matching a filename to an ayah, or loading audio successfully, is insufficient. No audio purchase, generation or subscription was initiated.

- https://elevenlabs.io/pricing
- https://elevenlabs.io/docs/overview/models/
- https://elevenlabs.io/docs/help-center/legal/can-i-publish-the-content-i-generate-on-the-platform

## Existing implementation

The homepage lists eSIM inside the hotels/flights card (frontend/src/pages/Home.jsx). The purchase control on frontend/src/pages/Hotels.jsx and a preparation checklist item both call yesimSaudi(). In frontend/src/lib/affiliate.js this built a generic yesim.tech homepage URL with an optional marker query; it neither selected Saudi Arabia nor used an account-generated Travelpayouts destination link. The same module assumes a marker guarantees commission and advertises a Hotellook partnership. Travelpayouts explicitly records closure of the Hotellook programme on 20 October 2025. Exclude that integration from the preview. The flights proxy requires server credentials and a live provider; avoid promoting unverified booking capability in the isolated preview. The Amazon helper can fall back silently to untagged search links, so the presence of a product button cannot establish attribution. The archived affiliate signup notes and comments do not prove approved partner status.

- https://support.travelpayouts.com/hc/en-us/articles/29534131568530-FAQ-on-the-closure-of-Hotellook
