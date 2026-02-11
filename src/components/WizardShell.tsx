import { useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'
import type { WizardState, WizardStep } from '../types/wizard'
import { isStepComplete } from '../engine/validation'
import { StepIndicator } from './StepIndicator'

interface Props {
  state: WizardState
  onNext: () => void
  onBack: () => void
  onStepClick: (step: WizardStep) => void
  children: ReactNode
}

export function WizardShell({ state, onNext, onBack, onStepClick, children }: Props) {
  const canGoBack = state.currentStep > 0
  const canGoNext = state.currentStep < 2 && isStepComplete(state, state.currentStep)

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter' && canGoNext) {
        const tag = (e.target as HTMLElement).tagName
        if (tag === 'TEXTAREA' || tag === 'INPUT') return
        onNext()
      }
    },
    [canGoNext, onNext],
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <div className="h-screen flex flex-col bg-obsidian text-bone">
      {/* Header */}
      <header className="px-4 sm:px-6 py-4 border-b border-ash/10">
        <div className="border-l-4 border-ash pl-3">
          <span className="text-ash font-black text-sm uppercase tracking-[4px]">
            Produkt
          </span>
          <span className="text-ash/30 text-[10px] ml-2">
            Product Context Engine v2.0
          </span>
        </div>
      </header>

      {/* Step Indicator */}
      <StepIndicator state={state} onStepClick={onStepClick} />

      {/* Main Content */}
      <main className="flex-1 min-h-0 overflow-auto px-4 sm:px-6 py-4">
        <div className="step-enter" key={state.currentStep}>
          {children}
        </div>
      </main>

      {/* Footer Navigation */}
      <footer className="px-4 sm:px-6 py-4 border-t border-ash/10 flex justify-between">
        {canGoBack ? (
          <button
            onClick={onBack}
            className="px-5 py-2 text-sm text-ash/60 hover:text-bone transition-colors"
          >
            ← Back
          </button>
        ) : (
          <div />
        )}

        {canGoNext && (
          <button
            onClick={onNext}
            className="px-6 py-2 bg-ash text-obsidian rounded-default font-medium text-sm uppercase tracking-wider hover:bg-bone transition-colors"
          >
            Next →
          </button>
        )}
      </footer>
    </div>
  )
}
