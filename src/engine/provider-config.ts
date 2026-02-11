import { PROVIDER_ID } from './provider-types'
import type { ProviderId, ProviderConfig } from './provider-types'

/** Default models per provider */
const DEFAULT_MODELS: Record<ProviderId, string> = {
  [PROVIDER_ID.Gemini]: 'gemini-3-flash-preview',
  [PROVIDER_ID.OpenAI]: 'gpt-4o',
  [PROVIDER_ID.Anthropic]: 'claude-sonnet-4-5-20250929',
}

/** Env var name per provider */
const KEY_ENV_VARS: Record<ProviderId, string> = {
  [PROVIDER_ID.Gemini]: 'VITE_GOOGLE_API_KEY',
  [PROVIDER_ID.OpenAI]: 'VITE_OPENAI_API_KEY',
  [PROVIDER_ID.Anthropic]: 'VITE_ANTHROPIC_API_KEY',
}

/** Priority: explicit VITE_PROVIDER > first available key */
function detectProvider(env: Record<string, string | undefined>): {
  providerId: ProviderId
  apiKey: string
} {
  const explicit = env.VITE_PROVIDER as ProviderId | undefined
  if (explicit && env[KEY_ENV_VARS[explicit]]) {
    return { providerId: explicit, apiKey: env[KEY_ENV_VARS[explicit]]! }
  }
  for (const id of [PROVIDER_ID.Gemini, PROVIDER_ID.OpenAI, PROVIDER_ID.Anthropic] as const) {
    const key = env[KEY_ENV_VARS[id]]
    if (key) return { providerId: id, apiKey: key }
  }
  throw new Error(
    'No API key found. Set VITE_GOOGLE_API_KEY, VITE_OPENAI_API_KEY, or VITE_ANTHROPIC_API_KEY in .env',
  )
}

export function resolveConfig(): ProviderConfig {
  const env = import.meta.env as Record<string, string | undefined>
  const { providerId, apiKey } = detectProvider(env)
  const model = (env.VITE_MODEL as string | undefined) ?? DEFAULT_MODELS[providerId]
  return { providerId, model, apiKey }
}
