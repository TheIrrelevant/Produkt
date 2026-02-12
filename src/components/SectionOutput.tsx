import { useState, useEffect, useCallback } from 'react'
import type { Dispatch } from 'react'
import type { ProduktState, ProduktAction } from '../types/state'
import { canGenerate } from '../engine/validation'
import { buildPrompt } from '../engine/prompt-builder'
import { runProduktEngine } from '../engine/run'

interface Props {
  state: ProduktState
  dispatch: Dispatch<ProduktAction>
}

function formatPrompt(raw: string): string {
  try {
    return JSON.stringify(JSON.parse(raw), null, 2)
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

export function SectionOutput({ state, dispatch }: Props) {
  const [copied, setCopied] = useState(false)
  const ready = canGenerate(state)

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
    try {
      await navigator.clipboard.writeText(state.generatedPrompt!)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  function handleDownload() {
    download(
      state.generatedPrompt!,
      `produkt-prompt-${Date.now()}.json`,
      'application/json',
    )
  }

  // Primary button label & action
  const primaryLabel = state.isGenerating
    ? `Generating... ${(state.elapsedMs / 1000).toFixed(1)}s`
    : state.generatedPrompt
      ? copied ? 'Copied!' : 'Copy JSON'
      : 'Generate'

  const primaryAction = state.generatedPrompt && !state.isGenerating
    ? handleCopy
    : handleGenerate

  const primaryDisabled = state.isGenerating || (!state.generatedPrompt && !ready)

  const primaryStyle = state.isGenerating
    ? 'bg-ash/20 text-ash/40 cursor-wait'
    : copied
      ? 'bg-bone text-obsidian'
      : 'bg-ash text-obsidian hover:opacity-90'

  const hasResult = !!state.generatedPrompt && !state.isGenerating

  return (
    <section className="flex flex-col gap-4">
      {/* Error */}
      {state.generateError && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-default p-4 text-sm">
          <p className="text-red-400 font-medium">Generation failed</p>
          <p className="text-red-400/60 mt-1">{state.generateError}</p>
        </div>
      )}

      {/* Loading bar */}
      {state.isGenerating && (
        <div className="w-full h-1 bg-ash/10 rounded-full overflow-hidden">
          <div className="h-full bg-ash rounded-full pulse-bar" />
        </div>
      )}

      {/* Result display */}
      {hasResult && (
        <div className="bg-ash/5 border border-ash/10 rounded-card p-6 max-h-[400px] overflow-y-auto step-enter">
          <pre className="text-bone text-sm font-avenir whitespace-pre-wrap break-words">
            {formatPrompt(state.generatedPrompt!)}
          </pre>
        </div>
      )}

      {/* Button row — Cinelab style */}
      <div className="flex items-center gap-3">
        {/* Primary: Generate / Copy JSON */}
        <button
          onClick={primaryAction}
          disabled={primaryDisabled}
          className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider
                     rounded-default transition-all duration-150
                     disabled:opacity-30 disabled:cursor-not-allowed
                     ${primaryStyle}`}
        >
          {primaryLabel}
        </button>

        {/* Download */}
        <button
          onClick={handleDownload}
          disabled={!hasResult}
          className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider
                     rounded-default transition-all duration-150
                     ${hasResult
                       ? 'bg-ash text-obsidian hover:opacity-90'
                       : 'bg-ash/10 text-ash/20 cursor-not-allowed'
                     }`}
        >
          Download
        </button>

        {/* Regenerate */}
        <button
          onClick={handleGenerate}
          disabled={!hasResult}
          className={`px-6 py-3 text-sm font-medium uppercase tracking-wider
                     rounded-default transition-all duration-150
                     ${hasResult
                       ? 'border border-ash/20 text-ash/60 hover:text-bone hover:border-ash/40'
                       : 'border border-ash/5 text-ash/15 cursor-not-allowed'
                     }`}
        >
          Regenerate
        </button>

        {/* Reset */}
        <button
          onClick={() => dispatch({ type: 'RESET' })}
          className="px-6 py-3 text-sm font-medium uppercase tracking-wider
                     rounded-default border border-ash/20 text-ash/60
                     hover:text-bone hover:border-ash/40 transition-all duration-150"
        >
          Reset
        </button>
      </div>
    </section>
  )
}
