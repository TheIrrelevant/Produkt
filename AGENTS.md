# Produkt — Multi-Agent Quickstart

## For Claude Code
1. Read CLAUDE.md first
2. `StartEngine!` to launch dev server
3. Engine layer: src/engine/ (no React dependency)
4. UI layer: src/components/ (React + Tailwind)

## For Gemini (Antigravity)
1. Read GEMINI.md first
2. Same structure, same rules

## Key Files
- Types: src/types/wizard.ts, src/types/library.ts
- State: src/components/useWizardReducer.ts
- Engine: src/engine/run.ts (single entry point)
- Prompt: src/engine/prompt-builder.ts
- Schema: src/engine/response-schema.ts
