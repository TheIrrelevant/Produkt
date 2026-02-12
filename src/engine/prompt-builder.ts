import type { ProduktState } from '../types/state'
import type { Photographer, ProductType } from '../types/library'

export const SYSTEM_INSTRUCTION = `You are an Ultra-Precision Product Photography AI specializing in reference-faithful context transformation.

ABSOLUTE RULES:
1. PRODUCT IDENTITY: The product must remain 100% identical to the reference image — zero design changes, zero color shifts, zero proportion alterations.
2. CONTEXT TRANSFORMATION: Only change the setting, lighting, atmosphere, and presentation style.
3. PHOTOREALISM: Generate commercial-quality, photorealistic product photography descriptions.
4. STRUCTURED OUTPUT: Follow the exact 4-phase analysis framework provided.
5. NO HALLUCINATION: Only document what you observe in the reference image. Do not invent features.

You always respond with valid JSON matching the requested schema.`

export function buildPrompt(state: ProduktState): string {
  const sections: string[] = []

  sections.push(buildPhase1(state))
  sections.push(buildPhase2(state))
  sections.push(buildPhase3(state))
  sections.push(buildPhase4(state))
  sections.push(buildOutputInstruction())

  return sections.join('\n\n')
}

function buildPhase1(state: ProduktState): string {
  const productType: ProductType = state.selectedProductType!

  const categories = productType.analysisTemplate.map((cat, i) => {
    const letter = String.fromCharCode(65 + i)
    const dims = cat.dimensions
      .map((d, j) => `   ${letter}${j + 1}. Identify and lock: ${d}`)
      .join('\n')
    return `${letter}. ${cat.label}:\n${dims}`
  }).join('\n\n')

  return `═══ PHASE 1: ULTRA REFERENCE ANALYSIS ═══

Product Category: ${productType.label}

Perform an exhaustive visual analysis of the reference product image using the ${productType.label}-specific inspection matrix below. For EACH dimension, describe exactly what you observe with forensic precision.

${categories}

CRITICAL LOCK INSTRUCTION:
After completing the analysis, LOCK all extracted details as immutable product constraints. The generation must reproduce this product identically — no modifications, no artistic reinterpretation of the product itself.`
}

function buildPhase2(state: ProduktState): string {
  return `═══ PHASE 2: PHOTOGRAPHY CONCEPT ═══

CONTEXT TRANSFORMATION REQUEST:
"${state.contextText}"

Based on this description, design the complete photography concept. Only the WORLD AROUND the product changes — the product itself remains locked from Phase 1.

Define:
- SCENE: Environment, setting, atmosphere, time of day
- PLACEMENT: Product positioning, surface, angle, orientation within scene
- ENVIRONMENT: Background elements, props, complementary objects, negative space
- FOCAL STRATEGY: How composition draws the eye to the product — leading lines, contrast, isolation
- MOOD: Emotional response the image should evoke`
}

function buildPhase3(state: ProduktState): string {
  const photographerBlock = buildPhotographerSection(state)

  return `═══ PHASE 3: LIGHTING & CAMERA ═══

Define the complete technical photography setup:

LIGHTING:
- Key light: type, position, intensity, color temperature
- Fill light: type, ratio to key light
- Rim/accent lights: position and purpose
- Ambient contribution: natural vs artificial balance
- Special effects: controlled reflections, caustics, volumetric light
- Shadow style: soft premium shadows, no harsh black shadows

CAMERA:
- Lens: focal length (e.g. 85mm, 100mm macro), lens type
- Aperture & depth of field requirements
- Shot distance and framing
- Camera angle and height relative to product
- Perspective and distortion considerations

${photographerBlock}

COLOR SCIENCE:
- Overall color temperature (warm/cool/neutral)
- Color grading direction
- Contrast ratio
- Highlight rolloff and shadow treatment
- Dynamic range approach`
}

function buildPhase4(state: ProduktState): string {
  return `═══ PHASE 4: RENDER CONSTRAINTS ═══

Generate two explicit constraint lists:

MUST_INCLUDE (non-negotiable):
- Every physical detail from Phase 1 analysis (product lock)
- "ultra realistic product photography"
- "photorealistic, high detail, commercial photography quality"
- "product is 1:1 identical to reference, no design changes, no color shifts"
- All lighting and camera specs from Phase 3
- All context elements from Phase 2

MUST_NOT_INCLUDE (hard exclusions):
- Any modification to product design, shape, color, or proportions
- Added features, text, or branding not in reference
- Unrealistic scale, floating elements, disconnected parts
- Watermarks, borders, UI elements, text overlays
- Fingerprints, dust, scratches (unless in reference)
- Any element contradicting the Phase 1 analysis

Then combine ALL four phases into a single, unified FINAL PROMPT that a generative AI can execute directly to produce the image.`
}

function buildPhotographerSection(state: ProduktState): string {
  if (
    !state.usePhotographer ||
    !state.selectedPhotographerName ||
    !state.selectedPhotographerInfo
  ) {
    return `PHOTOGRAPHER INFLUENCE:
Apply clean, commercial product photography aesthetic. No specific photographer influence.`
  }

  const info: Photographer = state.selectedPhotographerInfo
  return `PHOTOGRAPHER INFLUENCE — ${state.selectedPhotographerName}:
- Style DNA: ${info.style}
- Lighting approach: ${info.lighting}
- Overall vibe: ${info.vibe}
Translate this photographer's visual identity into the technical setup while maintaining commercial quality.`
}

function buildOutputInstruction(): string {
  return `═══ OUTPUT FORMAT ═══

Respond with valid JSON using the exact schema provided.
- "reference_analysis": Exhaustive Phase 1 product analysis as a detailed paragraph.
- "photography_concept": Complete Phase 2 scene/concept description.
- "lighting_and_camera": Full Phase 3 technical setup including photographer influence.
- "render_constraints": Object with "must_include" array and "must_not_include" array — each containing specific, actionable constraint strings.
- "final_prompt": A single, complete, standalone prompt combining all four phases — ready for direct image generation.`
}
