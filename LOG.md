# Produkt - Log

> Product photography tool that transforms product photos into professional-grade shots for advertisers.

## Overview
- **Target Audience:** Advertisers
- **Core:** Gemini 2.5 Flash + prompt engineering → product photo → professional product photography
- **Key Feature:** Production-grade, consistent, standardized visual output
- **Status:** Released on Streamlit — Modular build complete
- **Stack:** Python + Gemini 2.5 Flash + Streamlit
- **Port:** 8502

## Changelog

### 2026-02-09 — Initial Standalone Build
- Extracted Product Studio from `repo-reference/` CineLab Suite and rebuilt as independent app
- Follows Cinelab's modular architecture pattern
- `config.py` — API key (`GOOGLE_API_KEY`), library loading
- `engine/produkt_engine.py` — Prompt builder + Gemini call
- `styles/theme.py` — Dark theme CSS (#222121, accent #F7BE14), header/footer/menu hidden
- `ui/panel_reference.py` — Product image upload (left column)
- `ui/panel_context.py` — Context description + photographer style selector (right column)
- `ui/panel_output.py` — Generated prompt display + TXT/JSON download
- `data/library.json` — Fashion + Product/Still Life photographers (21 total)
- Model: `gemini-2.5-flash-preview-05-20`
- Tested locally on port 8502, working

---
