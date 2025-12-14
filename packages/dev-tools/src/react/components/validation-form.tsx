/**
 * Validation Form Component
 * Premium configuration validation with visual feedback
 * React 19 component with client-side form state management
 */

'use client'

import * as React from 'react'
import {
  useEnvValidation,
  useAPIKeyValidation,
  useChatConfigValidation,
} from '../hooks/use-validation'
import {
  ShieldIcon,
  CheckIcon,
  AlertTriangleIcon,
  XCircleIcon,
  CheckCircleIcon,
  InfoIcon,
  KeyIcon,
  SettingsIcon,
  GlobeIcon,
} from './icons'

export interface ValidationFormProps {
  /** Additional CSS classes */
  className?: string
  /** Type of validation to perform */
  type?: 'env' | 'api-key' | 'chat-config'
  /** Show validation hints */
  showHints?: boolean
  /** Auto-validate on mount */
  autoValidate?: boolean
}

/**
 * Validation Form Component
 * Uses client-side state management for form submission state
 */
export function ValidationForm({
  className,
  type = 'env',
  showHints = true,
  autoValidate = false,
}: ValidationFormProps) {
  const envValidation = useEnvValidation()
  const apiKeyValidation = useAPIKeyValidation()
  const chatConfigValidation = useChatConfigValidation()

  // Auto-validate on mount if enabled
  React.useEffect(() => {
    if (autoValidate && type === 'env') {
      envValidation.validate()
    }
  }, [autoValidate, type])

  const typeConfig = {
    env: {
      icon: <GlobeIcon />,
      title: 'Environment Validation',
      description: 'Validate your environment variables and configuration',
    },
    'api-key': {
      icon: <KeyIcon />,
      title: 'API Key Validation',
      description: 'Verify your AI provider API keys are correctly configured',
    },
    'chat-config': {
      icon: <SettingsIcon />,
      title: 'Chat Configuration',
      description: 'Validate your chat settings and model parameters',
    },
  }

  const config = typeConfig[type]

  return (
    <div
      className={`validation-form ${className || ''}`}
      data-testid="validation-form"
    >
      <header className="validation-header">
        <div className="validation-title">
          {config.icon}
          <h2>{config.title}</h2>
        </div>
        <p className="validation-description">{config.description}</p>
      </header>

      <div className="validation-content">
        {type === 'env' && (
          <EnvValidationForm validation={envValidation} showHints={showHints} />
        )}
        {type === 'api-key' && (
          <APIKeyValidationForm
            validation={apiKeyValidation}
            showHints={showHints}
          />
        )}
        {type === 'chat-config' && (
          <ChatConfigValidationForm
            validation={chatConfigValidation}
            showHints={showHints}
          />
        )}
      </div>
    </div>
  )
}

/**
 * Environment validation form
 */
interface EnvValidationFormProps {
  validation: ReturnType<typeof useEnvValidation>
  showHints: boolean
}

function EnvValidationForm({ validation, showHints }: EnvValidationFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    validation.validate()
  }

  return (
    <form onSubmit={handleSubmit} className="validation-form-inner">
      {showHints && (
        <div className="form-hint">
          <InfoIcon size="sm" />
          <span>
            This will validate environment variables like API keys and
            configuration settings.
          </span>
        </div>
      )}

      <SubmitButton
        isPending={validation.isPending}
        label="Validate Environment"
      />

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

/**
 * API key validation form
 */
interface APIKeyValidationFormProps {
  validation: ReturnType<typeof useAPIKeyValidation>
  showHints: boolean
}

function APIKeyValidationForm({
  validation,
  showHints,
}: APIKeyValidationFormProps) {
  const [provider, setProvider] = React.useState<
    'openai' | 'anthropic' | 'google'
  >('openai')
  const [apiKey, setApiKey] = React.useState('')
  const [showKey, setShowKey] = React.useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    validation.validate(provider, apiKey || undefined)
  }

  const providerOptions = [
    { value: 'openai', label: 'OpenAI', color: '#10a37f' },
    { value: 'anthropic', label: 'Anthropic', color: '#d97706' },
    { value: 'google', label: 'Google AI', color: '#4285f4' },
  ]

  return (
    <form onSubmit={handleSubmit} className="validation-form-inner">
      {showHints && (
        <div className="form-hint">
          <InfoIcon size="sm" />
          <span>
            Leave the API key field empty to use the environment variable.
          </span>
        </div>
      )}

      <div className="form-group">
        <label htmlFor="provider">Provider</label>
        <div className="provider-select-wrapper">
          <select
            id="provider"
            value={provider}
            onChange={(e) => setProvider(e.target.value as any)}
            className="provider-select"
          >
            {providerOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <span
            className="provider-indicator"
            style={{
              backgroundColor: providerOptions.find((p) => p.value === provider)
                ?.color,
            }}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="apiKey">API Key</label>
        <div className="api-key-input-wrapper">
          <input
            id="apiKey"
            type={showKey ? 'text' : 'password'}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Optional - uses environment variable if empty"
            className="api-key-input"
            autoComplete="off"
          />
          <button
            type="button"
            className="toggle-visibility-btn"
            onClick={() => setShowKey(!showKey)}
            aria-label={showKey ? 'Hide API key' : 'Show API key'}
          >
            {showKey ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>

      <SubmitButton isPending={validation.isPending} label="Validate API Key" />

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

/**
 * Chat config validation form
 */
interface ChatConfigValidationFormProps {
  validation: ReturnType<typeof useChatConfigValidation>
  showHints: boolean
}

function ChatConfigValidationForm({
  validation,
  showHints,
}: ChatConfigValidationFormProps) {
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
      temperature: config.temperature
        ? parseFloat(config.temperature)
        : undefined,
      maxTokens: config.maxTokens ? parseInt(config.maxTokens) : undefined,
      topP: config.topP ? parseFloat(config.topP) : undefined,
    })
  }

  const updateConfig = (key: string, value: string) => {
    setConfig((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="validation-form-inner">
      {showHints && (
        <div className="form-hint">
          <InfoIcon size="sm" />
          <span>Configure model settings and validate the configuration.</span>
        </div>
      )}

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="config-provider">Provider</label>
          <select
            id="config-provider"
            value={config.provider}
            onChange={(e) => updateConfig('provider', e.target.value)}
          >
            <option value="openai">OpenAI</option>
            <option value="anthropic">Anthropic</option>
            <option value="google">Google AI</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="config-model">Model</label>
          <input
            id="config-model"
            type="text"
            value={config.model}
            onChange={(e) => updateConfig('model', e.target.value)}
            placeholder="e.g., gpt-4-turbo"
            required
          />
        </div>
      </div>

      <div className="form-row form-row-3">
        <div className="form-group">
          <label htmlFor="config-temperature">
            Temperature
            <span className="label-hint">(0-2)</span>
          </label>
          <input
            id="config-temperature"
            type="number"
            min="0"
            max="2"
            step="0.1"
            value={config.temperature}
            onChange={(e) => updateConfig('temperature', e.target.value)}
            placeholder="0.7"
          />
        </div>

        <div className="form-group">
          <label htmlFor="config-maxTokens">Max Tokens</label>
          <input
            id="config-maxTokens"
            type="number"
            min="1"
            value={config.maxTokens}
            onChange={(e) => updateConfig('maxTokens', e.target.value)}
            placeholder="4096"
          />
        </div>

        <div className="form-group">
          <label htmlFor="config-topP">
            Top P<span className="label-hint">(0-1)</span>
          </label>
          <input
            id="config-topP"
            type="number"
            min="0"
            max="1"
            step="0.1"
            value={config.topP}
            onChange={(e) => updateConfig('topP', e.target.value)}
            placeholder="1.0"
          />
        </div>
      </div>

      <SubmitButton
        isPending={validation.isPending}
        label="Validate Configuration"
      />

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

/**
 * Submit button component
 */
function SubmitButton({
  isPending,
  label,
}: {
  isPending: boolean
  label: string
}) {
  return (
    <button
      type="submit"
      className="dt-btn dt-btn-primary submit-btn"
      disabled={isPending}
    >
      {isPending ? (
        <>
          <span className="loading-spinner small" aria-hidden="true" />
          <span>Validating...</span>
        </>
      ) : (
        <>
          <ShieldIcon size="lg" />
          <span>{label}</span>
        </>
      )}
    </button>
  )
}

/**
 * Validation results component
 */
interface ValidationResultsProps {
  valid: boolean
  errors: Array<{
    field: string
    message: string
    severity?: 'error' | 'warning'
  }>
  warnings: Array<{ field: string; message: string }>
}

function ValidationResults({
  valid,
  errors,
  warnings,
}: ValidationResultsProps) {
  const hasIssues = errors.length > 0 || warnings.length > 0

  if (valid && !hasIssues) {
    return (
      <div className="validation-results success" role="alert">
        <div className="result-header">
          <CheckCircleIcon />
          <span>All validations passed</span>
        </div>
        <p className="result-description">
          Your configuration is valid and ready to use.
        </p>
      </div>
    )
  }

  return (
    <div
      className={`validation-results ${valid ? 'warning' : 'error'}`}
      role="alert"
    >
      <div className="result-header">
        {valid ? <AlertTriangleIcon /> : <XCircleIcon />}
        <span>
          {valid ? 'Validation passed with warnings' : 'Validation failed'}
        </span>
      </div>

      {errors.length > 0 && (
        <div className="result-section errors">
          <h4>
            <XCircleIcon />
            Errors ({errors.length})
          </h4>
          <ul className="issues-list">
            {errors.map((error, index) => (
              <li key={index} className="issue-item error">
                <span className="issue-field">{error.field}</span>
                <span className="issue-message">{error.message}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {warnings.length > 0 && (
        <div className="result-section warnings">
          <h4>
            <AlertTriangleIcon />
            Warnings ({warnings.length})
          </h4>
          <ul className="issues-list">
            {warnings.map((warning, index) => (
              <li key={index} className="issue-item warning">
                <span className="issue-field">{warning.field}</span>
                <span className="issue-message">{warning.message}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
