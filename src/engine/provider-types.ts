import type { ProduktResponseSchema } from './response-schema'

/** Provider IDs — const object (not enum) */
export const PROVIDER_ID = {
  Gemini: 'gemini',
  OpenAI: 'openai',
  Anthropic: 'anthropic',
} as const

export type ProviderId = (typeof PROVIDER_ID)[keyof typeof PROVIDER_ID]

/** Request payload sent to any provider */
export interface ProduktRequest {
  readonly systemInstruction: string
  readonly prompt: string
  readonly imageBase64: string
  readonly imageMimeType: string
  readonly schema: ProduktResponseSchema
  readonly temperature: number
}

/** Provider adapter interface */
export interface ProduktProvider {
  readonly name: string
  generate(request: ProduktRequest, config: ProviderConfig): Promise<string>
}

/** Resolved provider configuration */
export interface ProviderConfig {
  readonly providerId: ProviderId
  readonly model: string
  readonly apiKey: string
}
