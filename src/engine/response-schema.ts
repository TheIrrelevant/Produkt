export const PRODUKT_RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    product_context_prompt: {
      type: 'object',
      properties: {
        product_identification: {
          type: 'string',
          description:
            'Exact product description: type, precise colors, materials, finish, size, logos, distinctive features. 100% fidelity to reference image.',
        },
        context_transformation: {
          type: 'string',
          description:
            'New setting, product positioning, focal point treatment, background description, environmental elements.',
        },
        technical_photography: {
          type: 'string',
          description:
            'Shot type, lighting setup, depth of field, camera angle, perspective, background treatment.',
        },
        artistic_direction: {
          type: 'string',
          description:
            'Photographer style influence (if selected), visual DNA application, color science, mood.',
        },
        final_prompt: {
          type: 'string',
          description:
            'Complete, unified photography prompt ready for image generation. Ultra realistic, photorealistic, commercial quality.',
        },
      },
      required: [
        'product_identification',
        'context_transformation',
        'technical_photography',
        'artistic_direction',
        'final_prompt',
      ],
    },
  },
  required: ['product_context_prompt'],
} as const

export type ProduktResponseSchema = typeof PRODUKT_RESPONSE_SCHEMA
