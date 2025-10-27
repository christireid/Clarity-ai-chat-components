/**
 * Configuration validator
 * 
 * Validates environment variables, API keys, and configuration files
 */

export interface ValidationResult {
  valid: boolean
  errors: Array<{
    field: string
    message: string
    severity: 'error' | 'warning'
  }>
  warnings: Array<{
    field: string
    message: string
  }>
}

export interface APIKeyConfig {
  name: string
  envVar: string
  required: boolean
  pattern?: RegExp
  testEndpoint?: string
}

const API_KEY_CONFIGS: APIKeyConfig[] = [
  {
    name: 'OpenAI',
    envVar: 'OPENAI_API_KEY',
    required: false,
    pattern: /^sk-[A-Za-z0-9]{48,}$/
  },
  {
    name: 'Anthropic',
    envVar: 'ANTHROPIC_API_KEY',
    required: false,
    pattern: /^sk-ant-[A-Za-z0-9\-_]{95,}$/
  },
  {
    name: 'Google AI',
    envVar: 'GOOGLE_API_KEY',
    required: false,
    pattern: /^[A-Za-z0-9\-_]{39}$/
  }
]

/**
 * Validate environment variables
 */
export function validateEnv(): ValidationResult {
  const errors: ValidationResult['errors'] = []
  const warnings: ValidationResult['warnings'] = []

  // Check Node environment
  if (!process.env.NODE_ENV) {
    warnings.push({
      field: 'NODE_ENV',
      message: 'NODE_ENV is not set, defaulting to "development"'
    })
  }

  // Check API keys
  const hasAtLeastOneKey = API_KEY_CONFIGS.some(config => 
    process.env[config.envVar]
  )

  if (!hasAtLeastOneKey) {
    errors.push({
      field: 'API_KEYS',
      message: 'At least one AI provider API key must be configured (OPENAI_API_KEY, ANTHROPIC_API_KEY, or GOOGLE_API_KEY)',
      severity: 'error'
    })
  }

  // Validate each API key format
  for (const config of API_KEY_CONFIGS) {
    const value = process.env[config.envVar]

    if (!value) {
      if (config.required) {
        errors.push({
          field: config.envVar,
          message: `${config.name} API key is required but not set`,
          severity: 'error'
        })
      }
      continue
    }

    // Validate format
    if (config.pattern && !config.pattern.test(value)) {
      errors.push({
        field: config.envVar,
        message: `${config.name} API key format is invalid`,
        severity: 'error'
      })
    }

    // Check for common mistakes
    if (value.includes(' ')) {
      errors.push({
        field: config.envVar,
        message: `${config.name} API key contains spaces (check for copy-paste errors)`,
        severity: 'error'
      })
    }

    if (value.startsWith('"') || value.endsWith('"')) {
      warnings.push({
        field: config.envVar,
        message: `${config.name} API key has surrounding quotes (they will be included in the key)`
      })
    }
  }

  // Check port
  if (process.env.PORT) {
    const port = parseInt(process.env.PORT)
    if (isNaN(port) || port < 1 || port > 65535) {
      errors.push({
        field: 'PORT',
        message: 'PORT must be a number between 1 and 65535',
        severity: 'error'
      })
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Validate specific API key
 */
export function validateAPIKey(
  provider: 'openai' | 'anthropic' | 'google',
  apiKey?: string
): ValidationResult {
  const errors: ValidationResult['errors'] = []
  const warnings: ValidationResult['warnings'] = []

  const config = API_KEY_CONFIGS.find(c => 
    c.envVar.toLowerCase().includes(provider)
  )

  if (!config) {
    errors.push({
      field: 'provider',
      message: `Unknown provider: ${provider}`,
      severity: 'error'
    })
    return { valid: false, errors, warnings }
  }

  const key = apiKey || process.env[config.envVar]

  if (!key) {
    errors.push({
      field: config.envVar,
      message: `${config.name} API key is not configured`,
      severity: 'error'
    })
    return { valid: false, errors, warnings }
  }

  // Validate format
  if (config.pattern && !config.pattern.test(key)) {
    errors.push({
      field: config.envVar,
      message: `${config.name} API key format is invalid`,
      severity: 'error'
    })
  }

  // Check for common issues
  if (key.includes(' ')) {
    errors.push({
      field: config.envVar,
      message: 'API key contains spaces',
      severity: 'error'
    })
  }

  if (key.length < 10) {
    errors.push({
      field: config.envVar,
      message: 'API key is too short',
      severity: 'error'
    })
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Validate chat configuration
 */
export function validateChatConfig(config: {
  provider: string
  model: string
  temperature?: number
  maxTokens?: number
  topP?: number
}): ValidationResult {
  const errors: ValidationResult['errors'] = []
  const warnings: ValidationResult['warnings'] = []

  // Validate provider
  const validProviders = ['openai', 'anthropic', 'google']
  if (!validProviders.includes(config.provider)) {
    errors.push({
      field: 'provider',
      message: `Invalid provider: ${config.provider}. Must be one of: ${validProviders.join(', ')}`,
      severity: 'error'
    })
  }

  // Validate model
  if (!config.model || config.model.trim() === '') {
    errors.push({
      field: 'model',
      message: 'Model is required',
      severity: 'error'
    })
  }

  // Validate temperature
  if (config.temperature !== undefined) {
    if (config.temperature < 0 || config.temperature > 2) {
      errors.push({
        field: 'temperature',
        message: 'Temperature must be between 0 and 2',
        severity: 'error'
      })
    }

    if (config.temperature > 1.5) {
      warnings.push({
        field: 'temperature',
        message: 'High temperature (>1.5) may produce very random outputs'
      })
    }
  }

  // Validate maxTokens
  if (config.maxTokens !== undefined) {
    if (config.maxTokens < 1) {
      errors.push({
        field: 'maxTokens',
        message: 'maxTokens must be at least 1',
        severity: 'error'
      })
    }

    if (config.maxTokens > 100000) {
      warnings.push({
        field: 'maxTokens',
        message: 'maxTokens is very high and may result in expensive API calls'
      })
    }
  }

  // Validate topP
  if (config.topP !== undefined) {
    if (config.topP < 0 || config.topP > 1) {
      errors.push({
        field: 'topP',
        message: 'topP must be between 0 and 1',
        severity: 'error'
      })
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Validate messages array for chat
 */
export function validateMessages(messages: any[]): ValidationResult {
  const errors: ValidationResult['errors'] = []
  const warnings: ValidationResult['warnings'] = []

  if (!Array.isArray(messages)) {
    errors.push({
      field: 'messages',
      message: 'Messages must be an array',
      severity: 'error'
    })
    return { valid: false, errors, warnings }
  }

  if (messages.length === 0) {
    errors.push({
      field: 'messages',
      message: 'Messages array must not be empty',
      severity: 'error'
    })
    return { valid: false, errors, warnings }
  }

  // Validate each message
  messages.forEach((msg, index) => {
    if (!msg.role) {
      errors.push({
        field: `messages[${index}].role`,
        message: 'Message must have a role',
        severity: 'error'
      })
    }

    const validRoles = ['system', 'user', 'assistant']
    if (msg.role && !validRoles.includes(msg.role)) {
      errors.push({
        field: `messages[${index}].role`,
        message: `Invalid role: ${msg.role}. Must be one of: ${validRoles.join(', ')}`,
        severity: 'error'
      })
    }

    if (!msg.content) {
      errors.push({
        field: `messages[${index}].content`,
        message: 'Message must have content',
        severity: 'error'
      })
    }

    if (typeof msg.content !== 'string' && !Array.isArray(msg.content)) {
      errors.push({
        field: `messages[${index}].content`,
        message: 'Message content must be a string or array',
        severity: 'error'
      })
    }

    // Check content length
    const contentStr = typeof msg.content === 'string' 
      ? msg.content 
      : JSON.stringify(msg.content)

    if (contentStr.length > 100000) {
      warnings.push({
        field: `messages[${index}].content`,
        message: 'Message content is very long and may exceed token limits'
      })
    }
  })

  // Check message order
  const lastMessage = messages[messages.length - 1]
  if (lastMessage.role !== 'user') {
    warnings.push({
      field: 'messages',
      message: 'Last message should typically be from user role'
    })
  }

  // Check for alternating roles
  let hasNonAlternating = false
  for (let i = 1; i < messages.length; i++) {
    if (messages[i].role === messages[i-1].role && messages[i].role !== 'system') {
      hasNonAlternating = true
      break
    }
  }

  if (hasNonAlternating) {
    warnings.push({
      field: 'messages',
      message: 'Messages should typically alternate between user and assistant roles'
    })
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Print validation results
 */
export function printValidationResults(results: ValidationResult, title?: string): void {
  if (title) {
    console.log(`\n${title}`)
    console.log('='.repeat(title.length))
  }

  if (results.valid) {
    console.log('\n✅ All validations passed\n')
    
    if (results.warnings.length > 0) {
      console.log('⚠️  Warnings:')
      results.warnings.forEach(warning => {
        console.log(`   - ${warning.field}: ${warning.message}`)
      })
      console.log()
    }
    
    return
  }

  console.log('\n❌ Validation failed\n')

  console.log('Errors:')
  results.errors.forEach(error => {
    const icon = error.severity === 'error' ? '❌' : '⚠️'
    console.log(`   ${icon} ${error.field}: ${error.message}`)
  })

  if (results.warnings.length > 0) {
    console.log('\nWarnings:')
    results.warnings.forEach(warning => {
      console.log(`   ⚠️  ${warning.field}: ${warning.message}`)
    })
  }

  console.log()
}

/**
 * Validate and throw error if invalid
 */
export function assertValid(results: ValidationResult, context?: string): void {
  if (!results.valid) {
    const errorMessages = results.errors.map(e => `${e.field}: ${e.message}`)
    const error = new Error(
      `${context || 'Configuration validation failed'}:\n${errorMessages.join('\n')}`
    )
    error.name = 'InvalidConfigError'
    throw error
  }
}
