import { describe, it, expect } from 'vitest'
import { canGenerate } from '../validation'
import { INITIAL_STATE } from '../../types/state'
import type { ProduktState } from '../../types/state'

describe('canGenerate', () => {
  it('returns false with initial state', () => {
    expect(canGenerate(INITIAL_STATE)).toBe(false)
  })

  it('returns false with only referenceImage', () => {
    const state: ProduktState = {
      ...INITIAL_STATE,
      referenceImage: new File([''], 'test.jpg', { type: 'image/jpeg' }),
    }
    expect(canGenerate(state)).toBe(false)
  })

  it('returns false with only productType', () => {
    const state: ProduktState = {
      ...INITIAL_STATE,
      selectedProductTypeId: 'jewelry',
    }
    expect(canGenerate(state)).toBe(false)
  })

  it('returns true with referenceImage + productType (context optional)', () => {
    const state: ProduktState = {
      ...INITIAL_STATE,
      referenceImage: new File([''], 'test.jpg', { type: 'image/jpeg' }),
      selectedProductTypeId: 'jewelry',
    }
    expect(canGenerate(state)).toBe(true)
  })

  it('returns true with referenceImage + productType + context', () => {
    const state: ProduktState = {
      ...INITIAL_STATE,
      referenceImage: new File([''], 'test.jpg', { type: 'image/jpeg' }),
      selectedProductTypeId: 'jewelry',
      contextText: 'Luxury setting',
    }
    expect(canGenerate(state)).toBe(true)
  })
})
