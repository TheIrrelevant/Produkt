import { useReducer } from 'react'
import type { WizardState, WizardAction } from '../types/wizard'
import { INITIAL_WIZARD_STATE } from '../types/wizard'

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.step }

    case 'SET_REFERENCE':
      return { ...state, referenceImage: action.file, referencePreview: action.preview }

    case 'CLEAR_REFERENCE':
      return { ...state, referenceImage: null, referencePreview: null }

    case 'SET_CONTEXT_TEXT':
      return { ...state, contextText: action.text }

    case 'SET_USE_PHOTOGRAPHER':
      return {
        ...state,
        usePhotographer: action.enabled,
        ...(action.enabled ? {} : {
          selectedGenre: null,
          selectedPhotographerName: null,
          selectedPhotographerInfo: null,
        }),
      }

    case 'SET_GENRE':
      return {
        ...state,
        selectedGenre: action.genre,
        selectedPhotographerName: null,
        selectedPhotographerInfo: null,
      }

    case 'SET_PHOTOGRAPHER':
      return {
        ...state,
        selectedPhotographerName: action.name,
        selectedPhotographerInfo: action.info,
      }

    case 'CLEAR_PHOTOGRAPHER':
      return {
        ...state,
        selectedPhotographerName: null,
        selectedPhotographerInfo: null,
      }

    case 'START_GENERATE':
      return {
        ...state,
        isGenerating: true,
        generateError: null,
        generatedPrompt: null,
        elapsedMs: 0,
      }

    case 'SET_GENERATED_PROMPT':
      return { ...state, generatedPrompt: action.prompt, isGenerating: false }

    case 'SET_GENERATE_ERROR':
      return { ...state, generateError: action.error, isGenerating: false }

    case 'SET_ELAPSED':
      return { ...state, elapsedMs: action.ms }

    case 'RESET':
      return INITIAL_WIZARD_STATE

    default:
      return state
  }
}

export function useWizardReducer() {
  return useReducer(wizardReducer, INITIAL_WIZARD_STATE)
}
