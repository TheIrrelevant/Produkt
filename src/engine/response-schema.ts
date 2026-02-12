export const PRODUKT_RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    product_context_prompt: {
      type: 'object',
      properties: {
        reference_analysis: {
          type: 'string',
          description:
            'Phase 1: Complete product analysis — geometry, materials, details, distinguishing features. Forensic-level fidelity to reference image.',
        },
        photography_concept: {
          type: 'string',
          description:
            'Phase 2: Scene design, product placement, environment, focal strategy, and mood. Context transformation based on user request.',
        },
        lighting_and_camera: {
          type: 'string',
          description:
            'Phase 3: Complete technical setup — key/fill/rim lighting, camera lens/aperture/angle, photographer style influence, color science.',
        },
        render_constraints: {
          type: 'object',
          properties: {
            must_include: {
              type: 'array',
              items: { type: 'string' },
              description: 'Non-negotiable elements that must appear in the final render.',
            },
            must_not_include: {
              type: 'array',
              items: { type: 'string' },
              description: 'Hard exclusions — elements that must never appear.',
            },
          },
          required: ['must_include', 'must_not_include'],
        },
        final_prompt: {
          type: 'string',
          description:
            'Complete, unified photography prompt combining all four phases. Ready for direct image generation. Ultra realistic, photorealistic, commercial quality.',
        },
      },
      required: [
        'reference_analysis',
        'photography_concept',
        'lighting_and_camera',
        'render_constraints',
        'final_prompt',
      ],
    },
  },
  required: ['product_context_prompt'],
} as const

export type ProduktResponseSchema = typeof PRODUKT_RESPONSE_SCHEMA
