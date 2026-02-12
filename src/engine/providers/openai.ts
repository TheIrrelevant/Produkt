import type { ProduktProvider, ProduktRequest, ProviderConfig } from '../provider-types'

export const openaiProvider: ProduktProvider = {
  name: 'OpenAI',

  async generate(request: ProduktRequest, config: ProviderConfig): Promise<string> {
    const isNode = !('window' in globalThis)
    const baseUrl = isNode ? 'https://api.openai.com' : '/api/openai'

    const body = {
      model: config.model,
      messages: [
        { role: 'system', content: request.systemInstruction },
        {
          role: 'user',
          content: [
            { type: 'text', text: request.prompt },
            {
              type: 'image_url',
              image_url: {
                url: `data:${request.imageMimeType};base64,${request.imageBase64}`,
              },
            },
          ],
        },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'product_context_prompt',
          strict: true,
          schema: request.schema,
        },
      },
      temperature: request.temperature,
    }

    const res = await fetch(`${baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const err = await res.text()
      throw new Error(`OpenAI API error (${res.status}): ${err}`)
    }

    const data = await res.json()

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('OpenAI returned empty response')
    }

    return data.choices[0].message.content
  },
}
