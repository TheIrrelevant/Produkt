---
name: produkt
description: >
  AI-powered product context transformation engine. Analyzes a reference product image
  and generates structured JSON prompts that place the product in any new setting while
  preserving 100% product identity. Supports Gemini, OpenAI, and Anthropic as
  interchangeable providers. Optional photographer style influence from 21 curated artists.
license: Apache-2.0
metadata:
  author: Kraftreich
  version: "2.0"
  stack: React 19, TypeScript, Vite 7, Tailwind CSS v4
  status: stable
compatibility: Requires Node.js 20+. At least one AI provider API key (Google Gemini, OpenAI, or Anthropic).
---

# Produkt

**AI-powered product context transformation engine by Kraftreich.**

---

## The Story Behind Produkt

Produkt was born from a simple observation: product photographers spend more time writing AI prompts than composing shots.

Every time you want to place a product in a new context — a watch on a marble surface, a perfume bottle in a misty forest, a sneaker floating mid-air — you end up writing the same kind of prompt from scratch. And every time, the AI forgets a detail. The logo disappears. The material changes. The product loses its identity in the new setting.

Produkt solves this by separating the **product** from the **context**. The reference image locks what the product looks like. The context description defines where it goes. The AI receives both — and the product survives the scene change with every detail intact.

**What started as a Streamlit prototype** (Produkt Studio) became a full React 19 + TypeScript application with provider-agnostic architecture, enforced JSON schemas, photographer style injection, and multi-IDE support — all built through prompts, not sprints.

The 5-field protocol structure wasn't designed on a whiteboard. It emerged from hundreds of failed generations where product identity kept getting lost. Each field exists because its absence caused a specific, repeatable failure mode.

> **Produkt** is a Kraftreich tool.
> Vibe-coded from zero to production — one prompt at a time.

---

Produkt takes a product photograph and a context description — optionally paired with a photographer's visual style — and generates a structured JSON prompt that describes how to place that exact product in a completely new setting while preserving every detail of the original.

## How It Works

```
Reference Image + Context + Style ──► Prompt Builder ──► AI Provider ──► JSON Prompt
```

The wizard walks through three steps:

| Step | Name | What It Does |
|------|------|-------------|
| 1 | **Reference** | Upload a product photograph (drag & drop) |
| 2 | **Context** | Describe the desired setting + optionally select a photographer style |
| 3 | **Output** | Generate the context transformation prompt as structured JSON |

The output is a `product_context_prompt` JSON with five fields:

- **product_identification** — Exact product description: type, colors, materials, finish, logos, features
- **context_transformation** — New setting, product positioning, focal point treatment
- **technical_photography** — Shot type, lighting setup, depth of field, background, camera angle
- **artistic_direction** — Photographer style influence (if selected), visual DNA application
- **final_prompt** — Complete, unified photography prompt ready for image generation

### Using the Output

> **The generated prompt is NOT a standalone prompt.**
> You must submit `final_prompt` **together with the original reference image** to your AI image generator. The reference image is the identity anchor — without it, the AI has no product to preserve and will generate a completely different object.

```
Reference Image + final_prompt ──► AI Image Generator ──► Context-Transformed Result
```

If you paste the prompt alone without the reference image, the AI will hallucinate an entirely new product. The whole point of the protocol is **context transformation, not product generation** — the product already exists in your reference.

## Quick Start

```bash
# 1. Clone and install
cd Produkt
npm install

# 2. Configure your AI provider
cp .env.example .env
# Add at least one API key:
#   VITE_GOOGLE_API_KEY=...    (Gemini — default)
#   VITE_OPENAI_API_KEY=...    (OpenAI)
#   VITE_ANTHROPIC_API_KEY=... (Anthropic)

# 3. Start the wizard
npm run dev
```

Open `http://localhost:3002` and walk through the three steps.

## Provider Auto-Detection

Produkt detects which AI provider to use based on available API keys. No manual `VITE_PROVIDER` needed.

**Priority order:** Gemini → OpenAI → Anthropic (first available key wins).

| Provider | Default Model | Env Variable |
|----------|--------------|-------------|
| Gemini | `gemini-3-flash-preview` | `VITE_GOOGLE_API_KEY` |
| OpenAI | `gpt-4o` | `VITE_OPENAI_API_KEY` |
| Anthropic | `claude-sonnet-4-5-20250929` | `VITE_ANTHROPIC_API_KEY` |

Override the model with `VITE_MODEL=your-model-id` if needed.

## Photographer Library

The built-in `library.json` contains 21 photographers organized by genre:

| Genre | Count | Examples |
|-------|-------|---------|
| Fashion | 8 | Mario Testino, Tim Walker, Viviane Sassen, David LaChapelle, Juergen Teller |
| Product / Still Life | 13 | Irving Penn, Carl Kleiner, Karl Taylor, Aaron Tilley, Jonathan Knowles |

Each photographer carries `style`, `lighting`, and `vibe` metadata that gets injected into the artistic direction field of the generated prompt.

## Architecture

```
src/
├── engine/                     # AI-agnostic core — no UI dependency
│   ├── run.ts                  # Single entry point: runProduktEngine()
│   ├── prompt-builder.ts       # Builds the product context prompt
│   ├── response-schema.ts      # Universal JSON Schema (5-field protocol)
│   ├── provider-types.ts       # ProduktProvider interface + ProduktRequest
│   ├── provider-config.ts      # Auto-detect provider from env
│   ├── validation.ts           # Step validation
│   ├── utils.ts                # fileToBase64 helper
│   └── providers/
│       ├── gemini.ts           # Gemini REST adapter
│       ├── openai.ts           # OpenAI Chat adapter
│       └── anthropic.ts        # Anthropic Messages adapter
├── components/                 # React UI
│   ├── PageLayout.tsx          # Main page container
│   ├── SectionReference.tsx    # Step 1: image upload
│   ├── SectionContext.tsx      # Step 2: context + photographer style
│   ├── SectionConfig.tsx       # Configuration panel
│   ├── SectionOutput.tsx       # Step 3: generate + action buttons
│   ├── ErrorBoundary.tsx       # Branded error fallback
│   ├── useProduktReducer.ts    # useReducer state management
│   └── ui/                     # Shared UI primitives
│       ├── ImageUpload.tsx
│       └── InfoBox.tsx
├── types/
│   ├── state.ts                # WizardState, actions, step config
│   └── library.ts              # Photographer, Genre types
├── data/
│   ├── library.json            # Photographer catalog (21 artists)
│   └── useLibrary.ts           # JSON loader hook
├── App.tsx
├── main.tsx
└── index.css                   # Tailwind + Kraftreich design tokens
```

**Design principle:** The `engine/` layer has zero React dependency. If the UI framework changes, the engine stays untouched.

## Key Design Decisions

### Adapter Pattern for AI Providers

Every provider implements the same `ProduktProvider` interface:

```typescript
interface ProduktProvider {
  readonly name: string
  generate(request: ProduktRequest, config: ProviderConfig): Promise<string>
}
```

The universal `ProduktResponseSchema` is converted to each provider's native format:
- **Gemini** → `responseSchema` with uppercase type names
- **OpenAI** → `response_format.json_schema`
- **Anthropic** → `tool_use` with `input_schema`

### Enforced JSON Schema

The 5-field response schema locks every key name and type. This eliminates the inconsistency problem where AI models generate different key names on every run. The same prompt always returns the same structure.

### Product Identity Preservation

The prompt engineering enforces 100% product fidelity. The AI must identify and preserve every detail of the original product — materials, colors, logos, textures, proportions, finish — across any context change. Only the environment changes, never the product itself.

### Photographer Style Injection

When a photographer is selected, their `style`, `lighting`, and `vibe` metadata is injected into the artistic direction field. This doesn't override the context — it flavors the execution. The same "watch on marble" context looks completely different through Irving Penn's eye versus David LaChapelle's.

## Scripts

| Command | Description |
|---------|------------|
| `npm run dev` | Start Vite dev server on port 3002 |
| `npm run build` | TypeScript check + production build |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run TypeScript type check |
| `npm run start-engine` | Dev server + open browser |
| `npm run stop-engine` | Kill process on port 3002 |
| `npm run test` | Run tests with Vitest |
| `npm run test:watch` | Run tests in watch mode |

### Magic Commands (AI IDE Agents)

If you're using an AI-powered IDE (Claude Code, Cursor, Antigravity), you can use these shorthand commands instead of typing the full npm scripts:

| Command | What It Does |
|---------|-------------|
| `StartEngine!` | Start the dev server and open the browser (`npm run start-engine`) |
| `StopEngine!` | Stop the dev server (`npm run stop-engine`) |

These commands are defined in `CLAUDE.md`, `GEMINI.md`, and `.cursorrules`.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_GOOGLE_API_KEY` | One of three | Google Gemini API key |
| `VITE_OPENAI_API_KEY` | One of three | OpenAI API key |
| `VITE_ANTHROPIC_API_KEY` | One of three | Anthropic API key |
| `VITE_PROVIDER` | No | Force a specific provider (`gemini` / `openai` / `anthropic`) |
| `VITE_MODEL` | No | Override the default model ID |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 |
| Language | TypeScript 5.9 |
| Bundler | Vite 7 |
| Styling | Tailwind CSS v4 |
| Fonts | Warbler (headlines) + Avenir (body) |
| Testing | Vitest |
| Linter | ESLint 9 |

## Roadmap

| Feature | Description | Status |
|---------|------------|--------|
| **Batch Mode** | CLI batch processing for generating prompts across multiple products with shared context settings | Planned |
| **New AI Providers** | Mistral, Grok, and local model support (Ollama) | Planned |
| **IDE Plugins** | Native extensions for VS Code, Cursor, and Antigravity — run Produkt directly from the editor sidebar | Planned |
| **Extended Library** | More photographers across food, automotive, jewelry, and tech product genres | Planned |
| **Context Templates** | Pre-built context presets (lifestyle flat-lay, editorial, e-commerce white, luxury dark) | Planned |
| **FactoryIR Integration** | Direct pipeline to FactoryIR for rendering the generated prompts into final images | Planned |
