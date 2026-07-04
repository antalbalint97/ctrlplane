"""Extract the reader-facing article sections from the approved source PDFs.

Requires PyMuPDF (`pip install pymupdf`) and writes the static JSON consumed by
the Next.js article routes. Page ranges intentionally exclude research notes,
editorial audits and distribution appendices.
"""

from __future__ import annotations

import json
import re
from pathlib import Path

import fitz


ROOT = Path(__file__).resolve().parents[1]
CONTENT_DIR = ROOT / "content"
OUTPUT_PATH = ROOT / "src" / "data" / "article-bodies.json"

SPECS = {
    "nem-ai-t-kell-bevezetni-mukodest-kell-attervezni": {
        "file": "02_AI_enablement_cikk.pdf",
        "pages": range(0, 4),
        "start": "A vezetőség aláírta",
    },
    "ai-val-gyorsabban-termelunk-kodot-de-ki-fogja-atnezni": {
        "file": "agentic_coding_strategiai_elemzes.pdf",
        "pages": range(4, 8),
        "start": "Egy platform engineer tavaly",
    },
    "nem-az-elso-hullamot-kell-megnyernunk": {
        "file": "AI2027_Europe2031_CEE_cikk.pdf",
        "pages": range(5, 9),
        "start": "Nem biztos, hogy 2027-ben",
    },
    "a-chatablaktol-a-pull-requestig": {
        "file": "ctrlplane-cikk-csomag.pdf",
        "pages": range(1, 6),
        "start": "Egy fejlesztő 2022-ben",
    },
    "nem-a-chatgpt-volt-a-kezdet": {
        "file": "magyar-nlp-tortenet-cikk.pdf",
        "pages": range(0, 5),
        "start": "2025 végén egy alig",
    },
    "nem-az-ai-okozta-a-valsagot-lathatova-tette": {
        "file": "Magyar_IT_piaci_korkep_2026.pdf",
        "pages": range(2, 11),
        "start": "Executive summary",
    },
}

HEADER_PREFIXES = (
    "M E N I V A │ Digital Consultancy",
    "AI-val gyorsabban termelünk kódot · Agentic coding a magyar IT-ban",
    "Nem az első hullámot kell megnyernünk · AI 2027 & Europe 2031",
    "A chatbotoktól az agentic codingig · cikk-csomag",
    "CtrlPlane · Cikk-csomag",
    "A magyar NLP története · CtrlPlane",
    "Piaci körkép - magyar IT-szakma & AI Sorozatindító elemzés",
    "meniva.net │ info@meniva.net CtrlPlane │",
)

CALLOUT_LABELS = {
    "ADAT",
    "ELEMZŐI HIPOTÉZIS",
    "MÓDSZERTANI MEGJEGYZÉS",
    "PIACI JELZÉS + ADAT",
    "AMIT KÜLÖN KELL TARTANI",
    "A KÖZÖS SZÁL",
}


def clean_text(value: str) -> str:
    value = value.replace("\u00ad", "").replace("–", "-").replace("—", "-")
    # Preserve a spaced editorial dash that happens to land at a line break,
    # while keeping real compounds such as "AI-\nhasználat" joined.
    value = re.sub(r"\s+-\s*\n\s*", " - ", value)
    value = re.sub(r"-\s*\n\s*", "-", value)
    value = re.sub(r"\s*\n\s*", " ", value)
    value = re.sub(r"\s+", " ", value).strip()

    # A few source-PDF glyph/typing errors are unambiguous in context.
    corrections = {
        "„lső": "„első",
        "kontéxtusa": "kontextusa",
        "évekig elven": "évekig élhet",
    }
    for source, replacement in corrections.items():
        value = value.replace(source, replacement)

    return value


def is_header_or_footer(text: str) -> bool:
    if not text or re.fullmatch(r"\d+", text):
        return True
    return any(text.startswith(prefix) for prefix in HEADER_PREFIXES)


def block_style(block: dict) -> tuple[float, bool]:
    spans = [span for line in block.get("lines", []) for span in line.get("spans", [])]
    max_size = max((span.get("size", 0) for span in spans), default=0)
    is_bold = any(span.get("flags", 0) & 16 for span in spans)
    return max_size, is_bold


def classify(text: str, max_size: float, is_bold: bool) -> str:
    if text in CALLOUT_LABELS or (text.isupper() and is_bold and len(text) < 90):
        return "label"
    if text == "Executive summary":
        return "heading"
    if re.match(r"^\d+\.\s+", text) and max_size >= 11.5:
        return "heading"
    if max_size >= 11.8 and is_bold and len(text) < 180:
        return "heading"
    return "paragraph"


def should_merge(previous: dict, current: dict, crossed_page: bool) -> bool:
    if not crossed_page or previous["type"] != "paragraph" or current["type"] != "paragraph":
        return False
    return not re.search(r"[.!?…\”\"')\]]$", previous["text"])


def extract(spec: dict) -> list[dict[str, str]]:
    document = fitz.open(CONTENT_DIR / spec["file"])
    result: list[dict[str, str]] = []
    started = False
    previous_page = None

    for page_number in spec["pages"]:
        page = document[page_number]
        for block in page.get_text("dict")["blocks"]:
            if "lines" not in block:
                continue

            raw = "\n".join(
                "".join(span["text"] for span in line["spans"])
                for line in block["lines"]
            )
            text = clean_text(raw)
            if is_header_or_footer(text):
                continue

            if not started:
                if not text.startswith(spec["start"]):
                    continue
                started = True

            max_size, is_bold = block_style(block)
            item = {"type": classify(text, max_size, is_bold), "text": text}
            crossed_page = previous_page is not None and previous_page != page_number

            if result and should_merge(result[-1], item, crossed_page):
                separator = "" if result[-1]["text"].endswith("-") else " "
                result[-1]["text"] += separator + item["text"]
            else:
                result.append(item)

            previous_page = page_number

    return result


def main() -> None:
    payload = {slug: extract(spec) for slug, spec in SPECS.items()}
    OUTPUT_PATH.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )

    for slug, blocks in payload.items():
        words = sum(len(block["text"].split()) for block in blocks)
        print(f"{slug}: {len(blocks)} blocks, {words} words")


if __name__ == "__main__":
    main()
