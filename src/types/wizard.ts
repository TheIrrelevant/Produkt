import type { Photographer } from './library'

/** Wizard steps — const object (not enum, erasableSyntaxOnly) */
export const WizardStep = {
  Reference: 0,
  Context: 1,
  Output: 2,
} as const

export type WizardStep = (typeof WizardStep)[keyof typeof WizardStep]

/** Step labels for display */
export const STEP_LABELS: Record<WizardStep, string> = {
  [WizardStep.Reference]: 'Reference',
  [WizardStep.Context]: 'Context',
  [WizardStep.Output]: 'Output',
} as const

/** Total number of steps */
export const STEP_COUNT = 3

/** Wizard state shape */
export interface WizardState {
  readonly currentStep: WizardStep

  // Step 1 — Reference
  readonly referenceImage: File | null
  readonly referencePreview: string | null

  // Step 2 — Context
  readonly contextText: string
  readonly usePhotographer: boolean
  readonly selectedGenre: string | null
  readonly selectedPhotographerName: string | null
  readonly selectedPhotographerInfo: Photographer | null

  // Step 3 — Output
  readonly generatedPrompt: string | null
  readonly isGenerating: boolean
  readonly generateError: string | null
  readonly elapsedMs: number
}

/** All possible wizard actions (discriminated union) */
export type WizardAction =
  | { readonly type: 'SET_STEP'; readonly step: WizardStep }
  | { readonly type: 'SET_REFERENCE'; readonly file: File; readonly preview: string }
  | { readonly type: 'CLEAR_REFERENCE' }
  | { readonly type: 'SET_CONTEXT_TEXT'; readonly text: string }
  | { readonly type: 'SET_USE_PHOTOGRAPHER'; readonly enabled: boolean }
  | { readonly type: 'SET_GENRE'; readonly genre: string }
  | { readonly type: 'SET_PHOTOGRAPHER'; readonly name: string; readonly info: Photographer }
  | { readonly type: 'CLEAR_PHOTOGRAPHER' }
  | { readonly type: 'START_GENERATE' }
  | { readonly type: 'SET_GENERATED_PROMPT'; readonly prompt: string }
  | { readonly type: 'SET_GENERATE_ERROR'; readonly error: string }
  | { readonly type: 'SET_ELAPSED'; readonly ms: number }
  | { readonly type: 'RESET' }

/** Initial state */
export const INITIAL_WIZARD_STATE: WizardState = {
  currentStep: WizardStep.Reference,
  referenceImage: null,
  referencePreview: null,
  contextText: '',
  usePhotographer: false,
  selectedGenre: null,
  selectedPhotographerName: null,
  selectedPhotographerInfo: null,
  generatedPrompt: null,
  isGenerating: false,
  generateError: null,
  elapsedMs: 0,
}
