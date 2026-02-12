import type { ProduktState } from '../types/state'

/** Check if all required fields are filled for generation */
export function canGenerate(state: ProduktState): boolean {
  return (
    state.referenceImage !== null &&
    state.selectedProductTypeId !== null
  )
}
