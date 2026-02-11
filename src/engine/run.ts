import { resolveConfig } from './provider-config'
import { PROVIDER_ID } from './provider-types'
import type { ProduktProvider } from './provider-types'
import { geminiProvider } from './providers/gemini'
import { openaiProvider } from './providers/openai'
import { anthropicProvider } from './providers/anthropic'
import { PRODUKT_RESPONSE_SCHEMA } from './response-schema'
import { fileToBase64 } from './utils'
import { SYSTEM_INSTRUCTION } from './prompt-builder'

const PROVIDERS: Record<string, ProduktProvider> = {
  [PROVIDER_ID.Gemini]: geminiProvider,
  [PROVIDER_ID.OpenAI]: openaiProvider,
  [PROVIDER_ID.Anthropic]: anthropicProvider,
}

export async function runProduktEngine(
  prompt: string,
  imageFile: File,
): Promise<string> {
  const config = resolveConfig()
  const provider = PROVIDERS[config.providerId]
  if (!provider) throw new Error(`Unknown provider: ${config.providerId}`)

  const imageBase64 = await fileToBase64(imageFile)

  return provider.generate(
    {
      systemInstruction: SYSTEM_INSTRUCTION,
      prompt,
      imageBase64,
      imageMimeType: imageFile.type,
      schema: PRODUKT_RESPONSE_SCHEMA,
      temperature: 0.2,
    },
    config,
  )
}
