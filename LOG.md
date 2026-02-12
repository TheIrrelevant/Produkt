# Produkt — Development Log

## v2.0.1 — Bug Fixes (2026-02-12)
- **Critical:** Added API response safety checks (Gemini/OpenAI providers)
- **Critical:** Fixed memory leak in ImageUpload (object URL cleanup)
- Full code review completed — architecture, edge cases, brand compliance verified
- Build: 220.32 KB (+240 bytes for safety checks)

## v2.0 — React Migration (2026-02-11)
- Migrated from Streamlit to React 19 + TypeScript + Vite 7 + Tailwind v4
- 3-step wizard: Reference → Context → Output
- Multi-AI engine: Gemini / OpenAI / Anthropic (adapter pattern, auto-detect)
- Structured JSON output (5-field product_context_prompt)
- Photographer style library: 21 artists, 2 genres
- Drag & drop image upload
- Copy/Download TXT/Download JSON output
- Port: 3002

## v1.0 — Streamlit (2026-02-09)
- Initial release as Produkt Studio
- Streamlit UI with 2-column layout
- Gemini 2.5 Flash model
- Plain text output
- Port: 8502
