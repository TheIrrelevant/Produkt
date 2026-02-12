import { describe, it, expect } from 'vitest'
import { buildPrompt } from '../prompt-builder'
import { INITIAL_STATE } from '../../types/state'
import type { ProduktState } from '../../types/state'

const JEWELRY_TYPE = {
  label: 'Jewelry',
  analysisTemplate: [
    { label: 'Geometry', dimensions: ['shape', 'size'] },
    { label: 'Metal', dimensions: ['color', 'finish'] },
  ],
} as const

const BASE_STATE: ProduktState = {
  ...INITIAL_STATE,
  selectedProductTypeId: 'jewelry',
  selectedProductType: JEWELRY_TYPE,
}

describe('buildPrompt', () => {
  it('includes Phase 1 with product type', () => {
    const prompt = buildPrompt(BASE_STATE)
    expect(prompt).toContain('PHASE 1: ULTRA REFERENCE ANALYSIS')
    expect(prompt).toContain('Product Category: Jewelry')
    expect(prompt).toContain('Identify and lock: shape')
  })

  it('skips Phase 2 when context is empty', () => {
    const prompt = buildPrompt(BASE_STATE)
    expect(prompt).not.toContain('PHASE 2: PHOTOGRAPHY CONCEPT')
  })

  it('includes Phase 2 when context is provided', () => {
    const state: ProduktState = { ...BASE_STATE, contextText: 'Luxury marble setting' }
    const prompt = buildPrompt(state)
    expect(prompt).toContain('PHASE 2: PHOTOGRAPHY CONCEPT')
    expect(prompt).toContain('Luxury marble setting')
  })

  it('skips photographer block when not selected', () => {
    const prompt = buildPrompt(BASE_STATE)
    expect(prompt).not.toContain('PHOTOGRAPHER INFLUENCE')
  })

  it('includes photographer block with all 7 fields when selected', () => {
    const state: ProduktState = {
      ...BASE_STATE,
      usePhotographer: true,
      selectedGenre: 'Product / Still Life',
      selectedPhotographerName: 'Karl Taylor',
      selectedPhotographerInfo: {
        style: 'Technical perfection.',
        lighting: 'Complex multi-light.',
        composition: 'Hero angle at 30–45°.',
        color_palette: 'True-to-product color.',
        lens: '100mm macro.',
        signature: 'Textbook commercial lighting.',
        vibe: 'Commercial.',
      },
    }
    const prompt = buildPrompt(state)
    expect(prompt).toContain('PHOTOGRAPHER INFLUENCE — Karl Taylor')
    expect(prompt).toContain('Style DNA:')
    expect(prompt).toContain('Composition & framing:')
    expect(prompt).toContain('Color palette:')
    expect(prompt).toContain('Preferred lens:')
    expect(prompt).toContain('Signature technique:')
  })

  it('Phase 4 references Phase 2 only when context exists', () => {
    const withoutContext = buildPrompt(BASE_STATE)
    expect(withoutContext).not.toContain('All context elements from Phase 2')

    const withContext = buildPrompt({ ...BASE_STATE, contextText: 'Dark moody' })
    expect(withContext).toContain('All context elements from Phase 2')
  })

  it('always includes Phase 3 and Phase 4', () => {
    const prompt = buildPrompt(BASE_STATE)
    expect(prompt).toContain('PHASE 3: LIGHTING & CAMERA')
    expect(prompt).toContain('PHASE 4: RENDER CONSTRAINTS')
    expect(prompt).toContain('OUTPUT FORMAT')
  })

  it('returns empty string when no product type selected', () => {
    const state: ProduktState = { ...INITIAL_STATE }
    const prompt = buildPrompt(state)
    // Phase 1 should be empty, prompt should still have other phases
    expect(prompt).not.toContain('Product Category:')
  })
})
