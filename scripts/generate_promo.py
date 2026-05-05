"""
Sunnah Umrah deep-dive promo video generator.

Produces /app/frontend/public/promo/sunnah-umrah-deep-dive.mp4 — a ~1:12
walkthrough composed of 6 Sora-2 clips with Onyx TTS narration overlay.

Run:
    cd /app && python scripts/generate_promo.py
"""
import asyncio
import os
import sys
import subprocess
import tempfile
from pathlib import Path
from dotenv import load_dotenv

sys.path.insert(0, "/app")
load_dotenv("/app/backend/.env")

from emergentintegrations.llm.openai.video_generation import OpenAIVideoGeneration
from emergentintegrations.llm.openai import OpenAITextToSpeech

API_KEY = os.environ["EMERGENT_LLM_KEY"]
OUT_DIR = Path("/app/frontend/public/promo")
WORK = Path(tempfile.mkdtemp(prefix="promo_"))
OUT_DIR.mkdir(parents=True, exist_ok=True)
print(f"working dir: {WORK}")

# Six 12-second scenes. Visuals are all "calm, cinematic, vertical phone or
# clean app mockup" so the AI has minimal chance to draw the wrong UI.
# Narration is timed to fit comfortably inside 12 seconds at speed=1.0
# (~28-32 English words per clip).
SCENES = [
    {
        "id": "01_intro",
        "visual": (
            "Cinematic slow zoom on the Holy Kaʿbah in Makkah at golden hour, "
            "soft warm light, white-robed pilgrims circling peacefully, "
            "shallow depth of field, calm reverent mood, no on-screen text."
        ),
        "narration": (
            "Sunnah Umrah. A step-by-step companion for performing Umrah "
            "according to the authentic Sunnah. Free, simple, and built for "
            "every pilgrim."
        ),
    },
    {
        "id": "02_steps",
        "visual": (
            "Close-up of a person's hands holding a smartphone in a quiet, "
            "warm-lit room, screen showing a clean minimalist Islamic app "
            "interface with a numbered list. Soft beige and gold colour palette. "
            "No readable text, just the impression of an elegant guide."
        ),
        "narration": (
            "Fifteen clear steps from Mīqāt to Tahalul. Each step shows what "
            "to do, what to say, and the authentic duʿaa, with audio recitation "
            "you can listen to and repeat."
        ),
    },
    {
        "id": "03_tawaf",
        "visual": (
            "Slow overhead shot of the Mataf around the Kaʿbah at twilight, "
            "white-robed pilgrims flowing in a circle, calm and orderly, "
            "soft glow from the surrounding lights, cinematic and reverent."
        ),
        "narration": (
            "An interactive Tawaf and Saʿi counter helps you keep track of "
            "every circuit, so you can focus your heart on worship instead "
            "of counting."
        ),
    },
    {
        "id": "04_lost",
        "visual": (
            "Aerial view of the Masjid al-Haram complex at night, glowing white "
            "and gold, with subtle softly animated pathways radiating from the "
            "mosque toward surrounding hotels. Dreamy, peaceful, no text."
        ),
        "narration": (
            "Lost in Makkah? Open the app, and it walks you safely back to "
            "the Haram, gate by gate, on a clear offline-friendly map."
        ),
    },
    {
        "id": "05_companion",
        "visual": (
            "A serene close-up of a pilgrim in white iḥrām holding a phone in "
            "a softly lit hotel room, eyes calm, gentle warm light from a window. "
            "Atmospheric, hopeful, peaceful. No on-screen text."
        ),
        "narration": (
            "Have a fiqh question on the spot? Ask the in-app companion. It "
            "answers from authentic Salafi sources, in plain English or Arabic."
        ),
    },
    {
        "id": "06_outro",
        "visual": (
            "Wide cinematic shot of the Kaʿbah at the blue hour, gentle drift "
            "of pilgrims in white, glowing minarets in the background, deeply "
            "reverent and calm. Slow push-in. No on-screen text."
        ),
        "narration": (
            "Sunnah Umrah dot app. Built with care, free forever. May Allah "
            "accept your Umrah."
        ),
    },
]


def gen_clip(scene):
    out = WORK / f"{scene['id']}.mp4"
    if out.exists() and out.stat().st_size > 0:
        print(f"  ✓ cached: {out.name}")
        return out
    print(f"  → generating Sora clip: {scene['id']} (12s)")
    vg = OpenAIVideoGeneration(api_key=API_KEY)
    video_bytes = vg.text_to_video(
        prompt=scene["visual"],
        model="sora-2",
        size="1280x720",
        duration=12,
        max_wait_time=900,
    )
    if not video_bytes:
        raise RuntimeError(f"Sora returned empty bytes for {scene['id']}")
    vg.save_video(video_bytes, str(out))
    return out


async def gen_voice(scene):
    out = WORK / f"{scene['id']}.mp3"
    if out.exists() and out.stat().st_size > 0:
        print(f"  ✓ cached: {out.name}")
        return out
    print(f"  → generating TTS: {scene['id']}")
    tts = OpenAITextToSpeech(api_key=API_KEY)
    audio = await tts.generate_speech(
        text=scene["narration"],
        model="tts-1-hd",
        voice="onyx",
        speed=1.0,
    )
    out.write_bytes(audio)
    return out


def merge_clip(video_path, audio_path, out_path):
    """Overlay the TTS audio onto the silent Sora clip, padding/trimming
    audio to exactly match the 12-second video length. Strips any audio
    Sora may have included so we don't double-up."""
    cmd = [
        "ffmpeg", "-y",
        "-i", str(video_path),
        "-i", str(audio_path),
        "-map", "0:v:0",
        "-map", "1:a:0",
        "-c:v", "copy",
        "-c:a", "aac", "-b:a", "192k",
        "-shortest",
        str(out_path),
    ]
    subprocess.run(cmd, check=True, capture_output=True)


def concat_clips(merged_paths, out_path):
    """ffmpeg concat demuxer: clean cut between scenes, no re-encode of
    matched-spec inputs. We re-encode here to be safe across Sora outputs."""
    list_file = WORK / "concat.txt"
    list_file.write_text("\n".join(f"file '{p}'" for p in merged_paths))
    cmd = [
        "ffmpeg", "-y",
        "-f", "concat", "-safe", "0",
        "-i", str(list_file),
        "-c:v", "libx264", "-preset", "medium", "-crf", "20",
        "-c:a", "aac", "-b:a", "192k",
        "-pix_fmt", "yuv420p",
        "-movflags", "+faststart",
        str(out_path),
    ]
    subprocess.run(cmd, check=True, capture_output=True)


async def main():
    print("Step 1/4 — generating 6 Sora-2 visual clips (this is the slow part)…")
    video_paths = [gen_clip(s) for s in SCENES]

    print("Step 2/4 — generating TTS narration tracks…")
    audio_paths = []
    for s in SCENES:
        audio_paths.append(await gen_voice(s))

    print("Step 3/4 — merging audio onto video (per scene)…")
    merged = []
    for s, v, a in zip(SCENES, video_paths, audio_paths):
        m = WORK / f"{s['id']}_merged.mp4"
        merge_clip(v, a, m)
        merged.append(m)
        print(f"  ✓ {m.name}")

    print("Step 4/4 — concatenating into final video…")
    final = OUT_DIR / "sunnah-umrah-deep-dive.mp4"
    # Back up old file so we can roll back if something looks wrong.
    if final.exists():
        backup = OUT_DIR / "sunnah-umrah-deep-dive.OLD.mp4"
        if backup.exists():
            backup.unlink()
        final.rename(backup)
        print(f"  ✓ old video backed up to: {backup.name}")
    concat_clips(merged, final)
    print(f"\n✅ DONE: {final}  ({final.stat().st_size / 1024 / 1024:.1f} MB)")


if __name__ == "__main__":
    asyncio.run(main())
