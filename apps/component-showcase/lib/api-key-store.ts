const STORAGE_KEY = 'clarity-showcase-api-key'
const MODEL_KEY = 'clarity-showcase-model'

export function getStoredApiKey(): string {
  if (typeof window === 'undefined') return ''
  try {
    return localStorage.getItem(STORAGE_KEY) || ''
  } catch {
    return ''
  }
}

export function setStoredApiKey(key: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, key)
  } catch {
    // localStorage unavailable
  }
}

export function getStoredModel(): string {
  if (typeof window === 'undefined') return 'claude-sonnet-4-5-20250929'
  try {
    return localStorage.getItem(MODEL_KEY) || 'claude-sonnet-4-5-20250929'
  } catch {
    return 'claude-sonnet-4-5-20250929'
  }
}

export function setStoredModel(model: string): void {
  try {
    localStorage.setItem(MODEL_KEY, model)
  } catch {
    // localStorage unavailable
  }
}
