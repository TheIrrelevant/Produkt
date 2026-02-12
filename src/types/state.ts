import type { Photographer, ProductType } from './library'

/** Produkt app state */
export interface ProduktState {
  // Reference
  readonly referenceImage: File | null
  readonly referencePreview: string | null

  // Configuration
  readonly selectedProductTypeId: string | null
  readonly selectedProductType: ProductType | null
  readonly contextText: string
  readonly usePhotographer: boolean
  readonly selectedGenre: string | null
  readonly selectedPhotographerName: string | null
  readonly selectedPhotographerInfo: Photographer | null

  // Output
  readonly generatedPrompt: string | null
  readonly isGenerating: boolean
  readonly generateError: string | null
  readonly elapsedMs: number
}

/** All possible actions */
export type ProduktAction =
  | { readonly type: 'SET_REFERENCE'; readonly file: File; readonly preview: string }
  | { readonly type: 'CLEAR_REFERENCE' }
  | { readonly type: 'SET_PRODUCT_TYPE'; readonly id: string; readonly productType: ProductType }
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
export const INITIAL_STATE: ProduktState = {
  referenceImage: null,
  referencePreview: null,
  selectedProductTypeId: null,
  selectedProductType: null,
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
