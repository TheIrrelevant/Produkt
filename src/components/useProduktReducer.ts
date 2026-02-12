import { useReducer } from 'react'
import type { ProduktState, ProduktAction } from '../types/state'
import { INITIAL_STATE } from '../types/state'

function produktReducer(state: ProduktState, action: ProduktAction): ProduktState {
  switch (action.type) {
    case 'SET_REFERENCE':
      return { ...state, referenceImage: action.file, referencePreview: action.preview }

    case 'CLEAR_REFERENCE':
      return { ...state, referenceImage: null, referencePreview: null }

    case 'SET_PRODUCT_TYPE':
      return { ...state, selectedProductTypeId: action.id, selectedProductType: action.productType }

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
      return INITIAL_STATE

    default:
      return state
  }
}

export function useProduktReducer() {
  return useReducer(produktReducer, INITIAL_STATE)
}
