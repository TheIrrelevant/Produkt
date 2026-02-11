import type { WizardState } from '../types/wizard'
import type { Photographer } from '../types/library'

export const SYSTEM_INSTRUCTION = `You are a Professional Product Photographer specializing in context transformation.

OBJECTIVE: Analyze reference product images and generate photorealistic prompts that place the EXACT SAME product into new contexts while maintaining 100% product accuracy.

CRITICAL RULES:
1. PRODUCT IDENTITY: The product must remain 100% identical to the reference image
2. NO DESIGN CHANGES: Never modify the product's design, add features, or alter proportions
3. CONTEXT TRANSFORMATION: Only change the setting, lighting, and presentation style
4. PHOTOREALISM: Generate commercial-quality, realistic product photography descriptions
5. CONSISTENCY: Maintain exact product specifications while adapting context

You always respond with valid JSON matching the requested schema.`

export function buildPrompt(state: WizardState): string {
  const sections: string[] = []

  // 1. Core instruction
  sections.push('ANALYZE the reference product image with extreme precision.')

  // 2. Context transformation
  sections.push(`
CONTEXT TRANSFORMATION REQUEST:
"${state.contextText}"

Transform the product's context based on this description. Change ONLY the setting, lighting, and presentation style.
The product itself must remain 100% identical to the reference image.`)

  // 3. Required output structure
  sections.push(`
GENERATE a structured product photography prompt with these exact sections:

1. PRODUCT IDENTIFICATION (highest priority):
   - Exact product type and description
   - Precise color names (e.g., "translucent bright aqua blue")
   - Material specifications (metal, glass, fabric, etc.)
   - Size and scale indicators
   - Surface finish (matte, glossy, textured, etc.)
   - Logos, patterns, and distinctive features
   - This section must be 100% faithful to the reference image

2. CONTEXT TRANSFORMATION:
   - New setting/environment interpretation
   - Product positioning in new context
   - Product as focal point
   - Background elements and props

3. TECHNICAL PHOTOGRAPHY:
   - Shot type (macro, close-up, medium, wide)
   - Lighting setup (soft, diffused, studio, natural)
   - Depth of field requirements
   - Background treatment
   - Camera angle and perspective

4. ARTISTIC DIRECTION:
   ${buildPhotographerSection(state)}

5. FINAL PROMPT:
   - Combine all above into a single, unified prompt
   - Must include: "ultra realistic product photography"
   - Must include: "photorealistic, high detail"
   - Must include: "commercial photography quality"
   - Must enforce: "product is 1:1 identical to reference, no design changes, no color shifts"`)

  // 4. JSON output instruction
  sections.push(`
OUTPUT: Provide ONLY raw, valid JSON using EXACTLY these keys:
- Root: "product_context_prompt"
- Inside: "product_identification", "context_transformation", "technical_photography", "artistic_direction", "final_prompt"

Each field must be a detailed, descriptive string paragraph.`)

  return sections.join('\n')
}

function buildPhotographerSection(state: WizardState): string {
  if (
    !state.usePhotographer ||
    !state.selectedPhotographerName ||
    !state.selectedPhotographerInfo
  ) {
    return 'Apply clean, commercial product photography aesthetic. No specific photographer influence.'
  }

  const info: Photographer = state.selectedPhotographerInfo
  return `Apply ${state.selectedPhotographerName}'s visual DNA:
   - Style: ${info.style}
   - Lighting approach: ${info.lighting}
   - Overall vibe: ${info.vibe}
   Translate this photographer's aesthetic into the product context while maintaining commercial quality.`
}
