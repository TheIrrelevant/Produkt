import type { WizardState } from '../types/wizard'
import { WizardStep, STEP_LABELS, STEP_COUNT } from '../types/wizard'
import { isStepComplete, canNavigateToStep } from '../engine/validation'

interface Props {
  state: WizardState
  onStepClick: (step: WizardStep) => void
}

export function StepIndicator({ state, onStepClick }: Props) {
  const steps = Array.from({ length: STEP_COUNT }, (_, i) => i as WizardStep)

  return (
    <div className="flex items-center justify-center gap-0 px-6 py-4">
      {steps.map((step, i) => {
        const isCurrent = state.currentStep === step
        const isCompleted = isStepComplete(state, step) && !isCurrent
        const isAccessible = canNavigateToStep(state, step) && !isCurrent
        const isLocked = !isAccessible && !isCurrent

        return (
          <div key={step} className="flex items-center">
            {/* Step circle + label */}
            <button
              type="button"
              onClick={() => !isLocked && onStepClick(step)}
              className={`flex items-center gap-2 transition-colors ${
                isLocked ? 'cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              {/* Circle */}
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                  isCurrent
                    ? 'bg-ash text-obsidian'
                    : isCompleted
                      ? 'bg-ash text-obsidian'
                      : isAccessible
                        ? 'border border-ash/40 text-ash/40'
                        : 'border border-ash/20 text-ash/20'
                }`}
              >
                {step + 1}
              </span>

              {/* Label */}
              <span
                className={`text-sm transition-colors ${
                  isCurrent
                    ? 'text-bone font-medium'
                    : isCompleted
                      ? 'text-ash/60'
                      : isAccessible
                        ? 'text-ash/40'
                        : 'text-ash/20'
                }`}
              >
                {STEP_LABELS[step]}
              </span>
            </button>

            {/* Connector line */}
            {i < STEP_COUNT - 1 && (
              <div
                className={`w-12 h-px mx-3 transition-colors ${
                  isStepComplete(state, step) ? 'bg-ash/40' : 'bg-ash/15'
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
