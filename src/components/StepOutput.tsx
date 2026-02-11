import { useState, useEffect, useCallback } from 'react'
import type { Dispatch } from 'react'
import type { WizardState, WizardAction } from '../types/wizard'
import type { Library } from '../types/library'
import { buildPrompt } from '../engine/prompt-builder'
import { runProduktEngine } from '../engine/run'

interface Props {
  state: WizardState
  dispatch: Dispatch<WizardAction>
  lib: Library
}

function formatPrompt(raw: string): string {
  try {
    const parsed = JSON.parse(raw)
    return JSON.stringify(parsed, null, 2)
  } catch {
    return raw
  }
}

function download(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function StepOutput({ state, dispatch }: Props) {
  const [copied, setCopied] = useState(false)

  // Elapsed timer
  useEffect(() => {
    if (!state.isGenerating) return
    const start = Date.now()
    const interval = setInterval(() => {
      dispatch({ type: 'SET_ELAPSED', ms: Date.now() - start })
    }, 100)
    return () => clearInterval(interval)
  }, [state.isGenerating, dispatch])

  const handleGenerate = useCallback(async () => {
    dispatch({ type: 'START_GENERATE' })
    try {
      const prompt = buildPrompt(state)
      const result = await runProduktEngine(prompt, state.referenceImage!)
      dispatch({ type: 'SET_GENERATED_PROMPT', prompt: result })
    } catch (err) {
      dispatch({
        type: 'SET_GENERATE_ERROR',
        error: err instanceof Error ? err.message : 'Unknown error',
      })
    }
  }, [state, dispatch])

  async function handleCopy() {
    await navigator.clipboard.writeText(state.generatedPrompt!)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // ── State B: Loading ──────────────────────────────────────────
  if (state.isGenerating) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-4">
        <p className="text-ash/60 text-lg">Analyzing product...</p>
        <div className="w-48 h-1 bg-ash/10 rounded-full overflow-hidden">
          <div className="h-full bg-ash rounded-full pulse-bar" />
        </div>
        <p className="text-ash/30 text-sm">
          {(state.elapsedMs / 1000).toFixed(1)}s elapsed
        </p>
      </div>
    )
  }

  // ── State C: Result ───────────────────────────────────────────
  if (state.generatedPrompt) {
    return (
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        <h2 className="font-warbler text-2xl text-bone">Generated Prompt</h2>

        {/* Prompt display */}
        <div className="bg-ash/5 border border-ash/10 rounded-card p-6 max-h-96 overflow-y-auto">
          <pre className="text-bone text-sm font-avenir whitespace-pre-wrap break-words">
            {formatPrompt(state.generatedPrompt)}
          </pre>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={handleCopy}
            className={`px-4 py-2.5 text-sm rounded-default border transition-colors ${
              copied
                ? 'bg-bone/10 border-bone/20 text-bone'
                : 'border-ash/20 text-ash/60 hover:text-bone hover:border-ash/40'
            }`}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>

          <button
            onClick={() => download(state.generatedPrompt!, 'produkt_prompt.txt', 'text/plain')}
            className="px-4 py-2.5 text-sm rounded-default border border-ash/20
                       text-ash/60 hover:text-bone hover:border-ash/40 transition-colors"
          >
            Download TXT
          </button>

          <button
            onClick={() =>
              download(
                state.generatedPrompt!,
                `produkt_prompt_${Date.now()}.json`,
                'application/json',
              )
            }
            className="px-4 py-2.5 text-sm rounded-default border border-ash/20
                       text-ash/60 hover:text-bone hover:border-ash/40 transition-colors"
          >
            Download JSON
          </button>

          <button
            onClick={handleGenerate}
            className="px-4 py-2.5 text-sm rounded-default border border-ash/20
                       text-ash/60 hover:text-bone hover:border-ash/40 transition-colors"
          >
            Regenerate
          </button>
        </div>

        {/* Reset */}
        <button
          onClick={() => dispatch({ type: 'RESET' })}
          className="w-full py-3 text-sm text-ash/40 hover:text-bone
                     border border-ash/10 rounded-default transition-colors"
        >
          RESET
        </button>
      </div>
    )
  }

  // ── State A: Before Generation ────────────────────────────────
  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6">
      <h2 className="font-warbler text-2xl text-bone">Output</h2>

      {/* Summary cards */}
      <div
        className={`grid gap-4 ${
          state.selectedPhotographerName
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            : 'grid-cols-1 sm:grid-cols-2'
        }`}
      >
        {/* Reference card */}
        <div className="bg-ash/5 border border-ash/10 rounded-card p-4 flex flex-col gap-2">
          <span className="text-ash/40 text-xs uppercase tracking-wider">Reference</span>
          {state.referencePreview && (
            <img
              src={state.referencePreview}
              alt="Product reference"
              className="w-full h-24 object-contain rounded-default"
            />
          )}
        </div>

        {/* Context card */}
        <div className="bg-ash/5 border border-ash/10 rounded-card p-4 flex flex-col gap-2">
          <span className="text-ash/40 text-xs uppercase tracking-wider">Context</span>
          <p className="text-bone text-sm line-clamp-3">
            {state.contextText.length > 100
              ? state.contextText.slice(0, 100) + '...'
              : state.contextText}
          </p>
        </div>

        {/* Photographer card (conditional) */}
        {state.selectedPhotographerName && state.selectedPhotographerInfo && (
          <div className="bg-ash/5 border border-ash/10 rounded-card p-4 flex flex-col gap-2">
            <span className="text-ash/40 text-xs uppercase tracking-wider">Photographer</span>
            <p className="text-bone text-sm font-medium">{state.selectedPhotographerName}</p>
            <p className="text-ash/40 text-xs">{state.selectedPhotographerInfo.style}</p>
          </div>
        )}
      </div>

      {/* Error display */}
      {state.generateError && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-default p-4 text-sm">
          <p className="text-red-400 font-medium">Generation failed</p>
          <p className="text-red-400/60 mt-1">{state.generateError}</p>
        </div>
      )}

      {/* Generate button */}
      <button
        onClick={handleGenerate}
        disabled={state.isGenerating}
        className="w-full py-4 bg-ash text-obsidian font-bold text-sm
                   uppercase tracking-wider rounded-default
                   hover:bg-bone transition-colors
                   disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {state.generateError ? 'TRY AGAIN' : 'GENERATE PRODUCT PROMPT'}
      </button>
    </div>
  )
}
