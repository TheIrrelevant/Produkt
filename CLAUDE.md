# Produkt — Product Context Engine

## Magic Commands
- `StartEngine!` → `npm run dev` (start dev server on port 3002)
- `StopEngine!` → kill port 3002

## Stack
- React 19 + TypeScript + Vite 7 + Tailwind v4
- Port: 3002
- AI: Gemini / OpenAI / Anthropic (auto-detect from .env)
- Default model: gemini-3-flash-preview

## Rules
- ONLY 3 colors: #222121 (obsidian), #F9FEFF (bone), #E2E7E9 (ash) + opacity variations
- No enums — use `as const` objects
- `import type` for type-only imports (verbatimModuleSyntax)
- ErrorBoundary MUST be a class component
- Font: Warbler (headlines) + Avenir (body/UI)
- No light mode
- Engine layer has ZERO React dependency

## Structure
- src/components/ → UI (wizard shell, steps, primitives)
- src/engine/ → AI logic (providers, prompt builder, schema)
- src/data/ → library.json + loader
- src/types/ → TypeScript types

## Environment
- VITE_GOOGLE_API_KEY → Gemini
- VITE_OPENAI_API_KEY → OpenAI
- VITE_ANTHROPIC_API_KEY → Anthropic
- Auto-detects first available key
