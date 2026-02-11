import type { ProduktProvider, ProduktRequest, ProviderConfig } from '../provider-types'

interface SchemaNode {
  readonly type: string
  readonly properties?: Record<string, SchemaNode>
  readonly required?: readonly string[]
  readonly items?: SchemaNode
  readonly enum?: readonly string[]
  readonly description?: string
}

/** Convert standard JSON Schema types to Gemini's uppercase format */
function toGeminiSchema(schema: SchemaNode): Record<string, unknown> {
  const result: Record<string, unknown> = { type: schema.type.toUpperCase() }
  if (schema.properties) {
    result.properties = Object.fromEntries(
      Object.entries(schema.properties).map(([k, v]) => [k, toGeminiSchema(v)]),
    )
  }
  if (schema.required) result.required = schema.required
  if (schema.items) result.items = toGeminiSchema(schema.items)
  if (schema.enum) result.enum = schema.enum
  return result
}

export const geminiProvider: ProduktProvider = {
  name: 'Gemini',

  async generate(request: ProduktRequest, config: ProviderConfig): Promise<string> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${config.model}:generateContent?key=${config.apiKey}`

    const body = {
      systemInstruction: { parts: [{ text: request.systemInstruction }] },
      contents: [
        {
          parts: [
            { text: request.prompt },
            {
              inlineData: {
                mimeType: request.imageMimeType,
                data: request.imageBase64,
              },
            },
          ],
        },
      ],
      generationConfig: {
        temperature: request.temperature,
        responseMimeType: 'application/json',
        responseSchema: toGeminiSchema(request.schema),
      },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
      ],
    }

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const err = await res.text()
      throw new Error(`Gemini API error (${res.status}): ${err}`)
    }

    const data = await res.json()
    return data.candidates[0].content.parts[0].text
  },
}
