import type { WizardState } from '../types/wizard'
import { WizardStep } from '../types/wizard'

/** Check if a specific step has all required data */
export function isStepComplete(state: WizardState, step: WizardStep): boolean {
  switch (step) {
    case WizardStep.Reference:
      return state.referenceImage !== null

    case WizardStep.Context:
      return state.contextText.trim().length > 0

    case WizardStep.Output:
      return state.generatedPrompt !== null

    default:
      return false
  }
}

/** Can user navigate to a given step? All previous steps must be complete. */
export function canNavigateToStep(state: WizardState, targetStep: WizardStep): boolean {
  for (let i = 0; i < targetStep; i++) {
    if (!isStepComplete(state, i as WizardStep)) return false
  }
  return true
}
