/**
 * Configuration Manager Utilities
 * Export/import and validation utilities
 */

import type {
  ChatConfiguration,
  ExportFormat,
  ImportResult,
  ValidationError,
} from './types'

// ============================================================================
// VALIDATION
// ============================================================================

export function validateConfiguration(
  config: any
): { valid: boolean; errors: ValidationError[] } {
  const errors: ValidationError[] = []

  // Check required fields
  if (!config.id) {
    errors.push({
      field: 'id',
      message: 'Configuration ID is required',
      severity: 'error',
    })
  }

  if (!config.name) {
    errors.push({
      field: 'name',
      message: 'Configuration name is required',
      severity: 'error',
    })
  }

  if (!config.version) {
    errors.push({
      field: 'version',
      message: 'Configuration version is required',
      severity: 'error',
    })
  }

  // Validate theme
  if (config.theme) {
    if (
      !['light', 'dark', 'auto'].includes(config.theme.mode)
    ) {
      errors.push({
        field: 'theme.mode',
        message: 'Invalid theme mode',
        severity: 'error',
      })
    }
  }

  // Validate model
  if (config.model) {
    if (config.model.temperature < 0 || config.model.temperature > 2) {
      errors.push({
        field: 'model.temperature',
        message: 'Temperature must be between 0 and 2',
        severity: 'error',
      })
    }

    if (config.model.maxTokens < 1) {
      errors.push({
        field: 'model.maxTokens',
        message: 'Max tokens must be positive',
        severity: 'error',
      })
    }

    if (config.model.topP < 0 || config.model.topP > 1) {
      errors.push({
        field: 'model.topP',
        message: 'Top P must be between 0 and 1',
        severity: 'error',
      })
    }
  }

  return {
    valid: errors.filter((e) => e.severity === 'error').length === 0,
    errors,
  }
}

// ============================================================================
// EXPORT UTILITIES
// ============================================================================

export function exportToJSON(
  config: ChatConfiguration,
  prettify: boolean = true
): string {
  return JSON.stringify(config, null, prettify ? 2 : 0)
}

export function exportToTypeScript(config: ChatConfiguration): string {
  return `import type { ChatConfiguration } from './types'

export const config: ChatConfiguration = ${JSON.stringify(config, null, 2)}
`
}

export function exportToYAML(config: ChatConfiguration): string {
  // Simple YAML serializer
  const indent = (level: number) => '  '.repeat(level)

  function serializeValue(value: any, level: number = 0): string {
    if (value === null) return 'null'
    if (typeof value === 'boolean') return value.toString()
    if (typeof value === 'number') return value.toString()
    if (typeof value === 'string') return `"${value}"`

    if (Array.isArray(value)) {
      if (value.length === 0) return '[]'
      return '\n' + value.map(item =>
        indent(level) + '- ' + serializeValue(item, level + 1).trim()
      ).join('\n')
    }

    if (typeof value === 'object') {
      return '\n' + Object.entries(value).map(([key, val]) =>
        indent(level) + key + ': ' + serializeValue(val, level + 1).trim()
      ).join('\n')
    }

    return String(value)
  }

  return Object.entries(config).map(([key, value]) =>
    key + ': ' + serializeValue(value, 1).trim()
  ).join('\n')
}

export function exportToURL(config: ChatConfiguration): string {
  const compressed = JSON.stringify(config)
  const encoded = btoa(compressed)
  return `${window.location.origin}${window.location.pathname}?config=${encodeURIComponent(encoded)}`
}

export function downloadFile(
  content: string,
  filename: string,
  mimeType: string = 'application/json'
) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// ============================================================================
// IMPORT UTILITIES
// ============================================================================

export function importFromJSON(jsonString: string): ImportResult {
  try {
    const config = JSON.parse(jsonString)
    const validation = validateConfiguration(config)

    if (!validation.valid) {
      return {
        success: false,
        errors: validation.errors.map(e => `${e.field}: ${e.message}`),
      }
    }

    return {
      success: true,
      config: config as ChatConfiguration,
      warnings: validation.errors
        .filter(e => e.severity === 'warning')
        .map(e => `${e.field}: ${e.message}`),
    }
  } catch (error) {
    return {
      success: false,
      errors: ['Invalid JSON format: ' + (error as Error).message],
    }
  }
}

export function importFromURL(url: string): ImportResult {
  try {
    const urlObj = new URL(url)
    const configParam = urlObj.searchParams.get('config')

    if (!configParam) {
      return {
        success: false,
        errors: ['No configuration found in URL'],
      }
    }

    const decoded = atob(decodeURIComponent(configParam))
    return importFromJSON(decoded)
  } catch (error) {
    return {
      success: false,
      errors: ['Invalid URL format: ' + (error as Error).message],
    }
  }
}

export async function importFromFile(file: File): Promise<ImportResult> {
  return new Promise((resolve) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      const content = e.target?.result as string
      resolve(importFromJSON(content))
    }

    reader.onerror = () => {
      resolve({
        success: false,
        errors: ['Failed to read file'],
      })
    }

    reader.readAsText(file)
  })
}

// ============================================================================
// LOCALSTORAGE UTILITIES
// ============================================================================

const STORAGE_KEY = 'clarity-chat-configs'
const CURRENT_CONFIG_KEY = 'clarity-chat-current-config'

export function saveToLocalStorage(config: ChatConfiguration): void {
  try {
    const configs = getAllFromLocalStorage()
    const existingIndex = configs.findIndex(c => c.id === config.id)

    if (existingIndex >= 0) {
      configs[existingIndex] = config
    } else {
      configs.push(config)
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(configs))
  } catch (error) {
    console.error('Failed to save to localStorage:', error)
  }
}

export function getAllFromLocalStorage(): ChatConfiguration[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Failed to load from localStorage:', error)
    return []
  }
}

export function getFromLocalStorage(id: string): ChatConfiguration | null {
  const configs = getAllFromLocalStorage()
  return configs.find(c => c.id === id) || null
}

export function deleteFromLocalStorage(id: string): void {
  try {
    const configs = getAllFromLocalStorage()
    const filtered = configs.filter(c => c.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
  } catch (error) {
    console.error('Failed to delete from localStorage:', error)
  }
}

export function setCurrentConfig(id: string): void {
  try {
    localStorage.setItem(CURRENT_CONFIG_KEY, id)
  } catch (error) {
    console.error('Failed to set current config:', error)
  }
}

export function getCurrentConfig(): ChatConfiguration | null {
  try {
    const id = localStorage.getItem(CURRENT_CONFIG_KEY)
    return id ? getFromLocalStorage(id) : null
  } catch (error) {
    console.error('Failed to get current config:', error)
    return null
  }
}

// ============================================================================
// DEFAULT CONFIGURATIONS
// ============================================================================

export function getDefaultConfiguration(): ChatConfiguration {
  return {
    id: generateId(),
    name: 'Default Configuration',
    description: 'A basic chat configuration',
    version: '1.0.0',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),

    theme: {
      mode: 'auto',
      primaryColor: '#6366f1',
      accentColor: '#8b5cf6',
      borderRadius: 'md',
      fontFamily: 'system-ui',
    },

    features: {
      memory: true,
      streaming: true,
      tools: false,
      voiceInput: false,
      fileAttachments: true,
      codeExecution: false,
      webSearch: false,
      citations: false,
      tokenOptimization: true,
      rateLimiting: true,
    },

    model: {
      provider: 'openai',
      name: 'gpt-4',
      temperature: 0.7,
      maxTokens: 2000,
      topP: 1.0,
      frequencyPenalty: 0,
      presencePenalty: 0,
    },

    layout: {
      variant: 'default',
      showSidebar: true,
      showHeader: true,
      showFooter: true,
      messageLayout: 'bubbles',
    },

    advanced: {
      maxHistoryLength: 50,
      autoSave: true,
      debugMode: false,
      analytics: false,
    },
  }
}

export function generateId(): string {
  return `config-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// ============================================================================
// CONFIGURATION TEMPLATES
// ============================================================================

export const CONFIGURATION_TEMPLATES = [
  {
    id: 'basic-chat',
    name: 'Basic Chat',
    description: 'Simple chat with minimal features',
    category: 'basic' as const,
    config: {
      features: {
        memory: false,
        streaming: true,
        tools: false,
        voiceInput: false,
        fileAttachments: false,
        codeExecution: false,
        webSearch: false,
        citations: false,
        tokenOptimization: false,
        rateLimiting: true,
      },
    },
  },
  {
    id: 'advanced-assistant',
    name: 'Advanced Assistant',
    description: 'Full-featured AI assistant with tools',
    category: 'advanced' as const,
    config: {
      features: {
        memory: true,
        streaming: true,
        tools: true,
        voiceInput: true,
        fileAttachments: true,
        codeExecution: true,
        webSearch: true,
        citations: true,
        tokenOptimization: true,
        rateLimiting: true,
      },
    },
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Enterprise-grade configuration with security',
    category: 'enterprise' as const,
    config: {
      features: {
        memory: true,
        streaming: true,
        tools: true,
        voiceInput: false,
        fileAttachments: true,
        codeExecution: false,
        webSearch: true,
        citations: true,
        tokenOptimization: true,
        rateLimiting: true,
      },
      advanced: {
        maxHistoryLength: 100,
        autoSave: true,
        debugMode: false,
        analytics: true,
      },
    },
  },
]
