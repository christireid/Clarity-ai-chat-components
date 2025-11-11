/**
 * Validation Form Component
 * React 19 component using useFormStatus and Actions
 */

'use client'

import * as React from 'react'
import { useFormStatus } from 'react-dom'
import { useEnvValidation, useAPIKeyValidation, useChatConfigValidation } from '../hooks/use-validation'

export interface ValidationFormProps {
  className?: string
  type?: 'env' | 'api-key' | 'chat-config'
}

/**
 * Validation Form Component
 * Uses React 19 useFormStatus for form state management
 */
export function ValidationForm({ className, type = 'env' }: ValidationFormProps) {
  const envValidation = useEnvValidation()
  const apiKeyValidation = useAPIKeyValidation()
  const chatConfigValidation = useChatConfigValidation()

  const validation = type === 'env' 
    ? envValidation 
    : type === 'api-key' 
    ? apiKeyValidation 
    : chatConfigValidation

  return (
    <div className={className} data-testid="validation-form">
      <h2>Configuration Validation</h2>
      
      {type === 'env' && (
        <EnvValidationForm validation={envValidation} />
      )}
      
      {type === 'api-key' && (
        <APIKeyValidationForm validation={apiKeyValidation} />
      )}
      
      {type === 'chat-config' && (
        <ChatConfigValidationForm validation={chatConfigValidation} />
      )}
    </div>
  )
}

interface EnvValidationFormProps {
  validation: ReturnType<typeof useEnvValidation>
}

function EnvValidationForm({ validation }: EnvValidationFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    validation.validate()
  }

  return (
    <form onSubmit={handleSubmit}>
      <SubmitButton isPending={validation.isPending} />
      
      {validation.result && (
        <ValidationResults
          valid={validation.isValid}
          errors={validation.errors}
          warnings={validation.warnings}
        />
      )}
    </form>
  )
}

interface APIKeyValidationFormProps {
  validation: ReturnType<typeof useAPIKeyValidation>
}

function APIKeyValidationForm({ validation }: APIKeyValidationFormProps) {
  const [provider, setProvider] = React.useState<'openai' | 'anthropic' | 'google'>('openai')
  const [apiKey, setApiKey] = React.useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    validation.validate(provider, apiKey || undefined)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>
          Provider:
          <select value={provider} onChange={(e) => setProvider(e.target.value as any)}>
            <option value="openai">OpenAI</option>
            <option value="anthropic">Anthropic</option>
            <option value="google">Google</option>
          </select>
        </label>
      </div>
      
      <div className="form-group">
        <label>
          API Key:
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Optional - uses environment variable if not provided"
          />
        </label>
      </div>

      <SubmitButton isPending={validation.isPending} />
      
      {validation.result && (
        <ValidationResults
          valid={validation.isValid}
          errors={validation.errors}
          warnings={validation.warnings}
        />
      )}
    </form>
  )
}

interface ChatConfigValidationFormProps {
  validation: ReturnType<typeof useChatConfigValidation>
}

function ChatConfigValidationForm({ validation }: ChatConfigValidationFormProps) {
  const [config, setConfig] = React.useState({
    provider: 'openai',
    model: 'gpt-4-turbo',
    temperature: '',
    maxTokens: '',
    topP: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    validation.validate({
      provider: config.provider,
      model: config.model,
      temperature: config.temperature ? parseFloat(config.temperature) : undefined,
      maxTokens: config.maxTokens ? parseInt(config.maxTokens) : undefined,
      topP: config.topP ? parseFloat(config.topP) : undefined,
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>
          Provider:
          <select
            value={config.provider}
            onChange={(e) => setConfig({ ...config, provider: e.target.value })}
          >
            <option value="openai">OpenAI</option>
            <option value="anthropic">Anthropic</option>
            <option value="google">Google</option>
          </select>
        </label>
      </div>

      <div className="form-group">
        <label>
          Model:
          <input
            type="text"
            value={config.model}
            onChange={(e) => setConfig({ ...config, model: e.target.value })}
            required
          />
        </label>
      </div>

      <div className="form-group">
        <label>
          Temperature (0-2):
          <input
            type="number"
            min="0"
            max="2"
            step="0.1"
            value={config.temperature}
            onChange={(e) => setConfig({ ...config, temperature: e.target.value })}
          />
        </label>
      </div>

      <div className="form-group">
        <label>
          Max Tokens:
          <input
            type="number"
            min="1"
            value={config.maxTokens}
            onChange={(e) => setConfig({ ...config, maxTokens: e.target.value })}
          />
        </label>
      </div>

      <div className="form-group">
        <label>
          Top P (0-1):
          <input
            type="number"
            min="0"
            max="1"
            step="0.1"
            value={config.topP}
            onChange={(e) => setConfig({ ...config, topP: e.target.value })}
          />
        </label>
      </div>

      <SubmitButton isPending={validation.isPending} />
      
      {validation.result && (
        <ValidationResults
          valid={validation.isValid}
          errors={validation.errors}
          warnings={validation.warnings}
        />
      )}
    </form>
  )
}

function SubmitButton({ isPending }: { isPending: boolean }) {
  const { pending } = useFormStatus()
  
  return (
    <button type="submit" disabled={pending || isPending}>
      {pending || isPending ? 'Validating...' : 'Validate'}
    </button>
  )
}

interface ValidationResultsProps {
  valid: boolean
  errors: Array<{ field: string; message: string; severity?: 'error' | 'warning' }>
  warnings: Array<{ field: string; message: string }>
}

function ValidationResults({ valid, errors, warnings }: ValidationResultsProps) {
  if (valid && warnings.length === 0) {
    return (
      <div className="validation-results success">
        <p>✅ All validations passed</p>
      </div>
    )
  }

  return (
    <div className={`validation-results ${valid ? 'warning' : 'error'}`}>
      {errors.length > 0 && (
        <div className="errors">
          <h4>Errors:</h4>
          <ul>
            {errors.map((error, index) => (
              <li key={index}>
                <strong>{error.field}:</strong> {error.message}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {warnings.length > 0 && (
        <div className="warnings">
          <h4>Warnings:</h4>
          <ul>
            {warnings.map((warning, index) => (
              <li key={index}>
                <strong>{warning.field}:</strong> {warning.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
