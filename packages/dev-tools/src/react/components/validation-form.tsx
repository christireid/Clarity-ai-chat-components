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
 * Icons for the validation form
 */
const Icons = {
  Shield: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  Check: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  AlertTriangle: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  XCircle: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ),
  CheckCircle: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  Info: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
  Key: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4" />
    </svg>
  ),
  Settings: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  Globe: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
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
      icon: <Icons.Globe />,
      title: 'Environment Validation',
      description: 'Validate your environment variables and configuration',
    },
    'api-key': {
      icon: <Icons.Key />,
      title: 'API Key Validation',
      description: 'Verify your AI provider API keys are correctly configured',
    },
    'chat-config': {
      icon: <Icons.Settings />,
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
          <Icons.Info />
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
          <Icons.Info />
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
          <Icons.Info />
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
          <Icons.Shield />
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
          <Icons.CheckCircle />
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
        {valid ? <Icons.AlertTriangle /> : <Icons.XCircle />}
        <span>
          {valid ? 'Validation passed with warnings' : 'Validation failed'}
        </span>
      </div>

      {errors.length > 0 && (
        <div className="result-section errors">
          <h4>
            <Icons.XCircle />
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
            <Icons.AlertTriangle />
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
