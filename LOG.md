# Produkt — Development Log

## v2.0.1 — Code Review Fixes (2026-02-12)
Full code review applied. All critical + medium + low issues fixed.

**Critical Fixes:**
- ✅ API response validation: Gemini + OpenAI providers
  - Previous: assumed response structure always valid
  - Now: optional chaining for `data.candidates?.[0]?.content?.parts?.[0]?.text` (Gemini)
  - Now: optional chaining for `data.choices?.[0]?.message?.content` (OpenAI)
  - Prevents crash on empty/blocked/malformed API responses (`gemini.ts`, `openai.ts`)

**Medium Fixes:**
- ✅ Memory leak (ImageUpload): revoke object URL on new file upload
  - Previous: URL.createObjectURL accumulating on successive uploads
  - Now: revokes previous URL before creating new one (`ImageUpload.tsx`)
- ✅ Memory leak (StepReference): useEffect cleanup for referencePreview
  - Previous: URL not revoked on component unmount
  - Now: cleanup function revokes URL when preview changes (`StepReference.tsx`)

**Low Fixes:**
- ✅ Clipboard error handling: try/catch around `navigator.clipboard.writeText`
  - Previous: unhandled rejection on non-HTTPS or permission denied
  - Now: graceful error handling in StepOutput (`StepOutput.tsx`)

**Security:**
- ✅ SECURITY.md added: production deployment guide + proxy pattern
- ✅ Gemini proxy support: matches OpenAI/Anthropic pattern (`isNode` check + `/api/gemini`)
- ✅ CLAUDE.md: security warning for VITE_ keys exposure

All tests passing:
- `npm run lint` — ✅ no errors
- `npm run build` — ✅ 220.63 KB

2 commits pushed to GitHub: 7520210, 0117d0e

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
