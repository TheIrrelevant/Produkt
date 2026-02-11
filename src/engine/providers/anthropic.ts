import type { ProduktProvider, ProduktRequest, ProviderConfig } from '../provider-types'

export const anthropicProvider: ProduktProvider = {
  name: 'Anthropic',

  async generate(request: ProduktRequest, config: ProviderConfig): Promise<string> {
    const isNode = !('window' in globalThis)
    const baseUrl = isNode ? 'https://api.anthropic.com' : '/api/anthropic'

    const body = {
      model: config.model,
      max_tokens: 4096,
      system: request.systemInstruction,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: request.imageMimeType,
                data: request.imageBase64,
              },
            },
            { type: 'text', text: request.prompt },
          ],
        },
      ],
      tools: [
        {
          name: 'product_context_prompt',
          description: 'Generate structured product photography prompt',
          input_schema: request.schema,
        },
      ],
      tool_choice: { type: 'tool', name: 'product_context_prompt' },
    }

    const res = await fetch(`${baseUrl}/v1/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': config.apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const err = await res.text()
      throw new Error(`Anthropic API error (${res.status}): ${err}`)
    }

    const data = await res.json()
    const toolBlock = data.content.find(
      (b: { type: string }) => b.type === 'tool_use',
    )
    if (!toolBlock) throw new Error('No tool_use block in Anthropic response')
    return JSON.stringify(toolBlock.input)
  },
}
