/**
 * Extension UI Components
 *
 * Beautiful, accessible components for managing extensions.
 * Includes marketplace, configuration wizards, and status displays.
 *
 * @packageDocumentation
 */

import * as React from 'react'
import {
  useExtensions,
  useExtension,
  useExtensionHealth,
  useExtensionsByCategory,
} from './react'
import type {
  Extension,
  ExtensionCategory,
  ExtensionHealthStatus,
  ExtensionRegistration,
  ExtensionState,
} from './types'

// ============================================
// Styles (CSS-in-JS compatible)
// ============================================

const styles = {
  container: {
    fontFamily: 'system-ui, -apple-system, sans-serif',
    color: '#1a1a1a',
  },
  card: {
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '16px',
    backgroundColor: '#ffffff',
    transition: 'box-shadow 0.2s ease, transform 0.2s ease',
    cursor: 'pointer',
  },
  cardHover: {
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    transform: 'translateY(-2px)',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '2px 8px',
    borderRadius: '9999px',
    fontSize: '12px',
    fontWeight: 500,
  },
  button: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 500,
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease, opacity 0.2s ease',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  },
  grid: {
    display: 'grid',
    gap: '16px',
  },
}

// ============================================
// Status Badge Component
// ============================================

const statusColors: Record<ExtensionState, { bg: string; text: string }> = {
  unregistered: { bg: '#f3f4f6', text: '#6b7280' },
  registered: { bg: '#dbeafe', text: '#1d4ed8' },
  initializing: { bg: '#fef3c7', text: '#d97706' },
  active: { bg: '#d1fae5', text: '#059669' },
  paused: { bg: '#e5e7eb', text: '#4b5563' },
  error: { bg: '#fee2e2', text: '#dc2626' },
  disabled: { bg: '#f3f4f6', text: '#9ca3af' },
}

export function ExtensionStatusBadge({
  state,
  size = 'md',
}: {
  state: ExtensionState
  size?: 'sm' | 'md' | 'lg'
}): React.ReactElement {
  const colors = statusColors[state]
  const sizeStyles = {
    sm: { fontSize: '10px', padding: '1px 6px' },
    md: { fontSize: '12px', padding: '2px 8px' },
    lg: { fontSize: '14px', padding: '4px 12px' },
  }

  return (
    <span
      style={{
        ...styles.badge,
        ...sizeStyles[size],
        backgroundColor: colors.bg,
        color: colors.text,
      }}
    >
      {state === 'active' && (
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: colors.text,
            marginRight: '6px',
            animation: 'pulse 2s infinite',
          }}
        />
      )}
      {state.charAt(0).toUpperCase() + state.slice(1)}
    </span>
  )
}

// ============================================
// Health Indicator Component
// ============================================

export function ExtensionHealthIndicator({
  health,
  showDetails = false,
}: {
  health?: ExtensionHealthStatus
  showDetails?: boolean
}): React.ReactElement {
  if (!health) {
    return (
      <span
        style={{
          ...styles.badge,
          backgroundColor: '#f3f4f6',
          color: '#9ca3af',
        }}
      >
        Unknown
      </span>
    )
  }

  const color = health.healthy ? '#059669' : '#dc2626'
  const bgColor = health.healthy ? '#d1fae5' : '#fee2e2'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <span style={{ ...styles.badge, backgroundColor: bgColor, color }}>
        {health.healthy ? '● Healthy' : '● Unhealthy'}
      </span>
      {showDetails && health.message && (
        <span style={{ fontSize: '12px', color: '#6b7280' }}>
          {health.message}
        </span>
      )}
      {showDetails && health.warnings && health.warnings.length > 0 && (
        <ul
          style={{
            margin: 0,
            padding: '0 0 0 16px',
            fontSize: '12px',
            color: '#d97706',
          }}
        >
          {health.warnings.map((w, i) => (
            <li key={i}>{w}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

// ============================================
// Extension Card Component
// ============================================

export interface ExtensionCardProps {
  extension: Extension
  registration?: ExtensionRegistration
  onInstall?: () => void
  onUninstall?: () => void
  onConfigure?: () => void
  onToggle?: (enabled: boolean) => void
  showActions?: boolean
}

export function ExtensionCard({
  extension,
  registration,
  onInstall,
  onUninstall,
  onConfigure,
  onToggle,
  showActions = true,
}: ExtensionCardProps): React.ReactElement {
  const [isHovered, setIsHovered] = React.useState(false)
  const { metadata } = extension
  const isInstalled = !!registration
  const isActive = registration?.state === 'active'

  return (
    <div
      style={{
        ...styles.card,
        ...(isHovered ? styles.cardHover : {}),
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{ display: 'flex', gap: '12px' }}>
        {/* Icon */}
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '10px',
            backgroundColor: '#f3f4f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            flexShrink: 0,
          }}
        >
          {typeof metadata.icon === 'string' ? (
            <img
              src={metadata.icon}
              alt={metadata.name}
              style={{ width: '32px', height: '32px', borderRadius: '6px' }}
            />
          ) : (
            getCategoryIcon(metadata.category)
          )}
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              flexWrap: 'wrap',
            }}
          >
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>
              {metadata.name}
            </h3>
            {metadata.official && (
              <span
                style={{
                  ...styles.badge,
                  backgroundColor: '#dbeafe',
                  color: '#1d4ed8',
                  fontSize: '10px',
                }}
              >
                Official
              </span>
            )}
            {metadata.verified && (
              <span
                style={{
                  ...styles.badge,
                  backgroundColor: '#d1fae5',
                  color: '#059669',
                  fontSize: '10px',
                }}
              >
                ✓ Verified
              </span>
            )}
            {registration && (
              <ExtensionStatusBadge state={registration.state} size="sm" />
            )}
          </div>

          <p
            style={{
              margin: '4px 0 0',
              fontSize: '14px',
              color: '#6b7280',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {metadata.description}
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginTop: '8px',
              fontSize: '12px',
              color: '#9ca3af',
            }}
          >
            <span>v{metadata.version}</span>
            <span>by {metadata.author}</span>
            <span
              style={{
                ...styles.badge,
                backgroundColor: '#f3f4f6',
                color: '#6b7280',
                fontSize: '10px',
              }}
            >
              {formatCategory(metadata.category)}
            </span>
          </div>
        </div>
      </div>

      {/* Tags */}
      {metadata.tags && metadata.tags.length > 0 && (
        <div
          style={{
            display: 'flex',
            gap: '4px',
            marginTop: '12px',
            flexWrap: 'wrap',
          }}
        >
          {metadata.tags.slice(0, 5).map((tag) => (
            <span
              key={tag}
              style={{
                ...styles.badge,
                backgroundColor: '#f3f4f6',
                color: '#6b7280',
                fontSize: '10px',
              }}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      {showActions && (
        <div
          style={{
            display: 'flex',
            gap: '8px',
            marginTop: '16px',
            paddingTop: '16px',
            borderTop: '1px solid #f3f4f6',
          }}
        >
          {isInstalled ? (
            <>
              <button
                style={{
                  ...styles.button,
                  backgroundColor: isActive ? '#fee2e2' : '#d1fae5',
                  color: isActive ? '#dc2626' : '#059669',
                  flex: 1,
                }}
                onClick={() => onToggle?.(!isActive)}
              >
                {isActive ? 'Disable' : 'Enable'}
              </button>
              {onConfigure && (
                <button
                  style={{
                    ...styles.button,
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                  }}
                  onClick={onConfigure}
                >
                  ⚙️
                </button>
              )}
              {onUninstall && (
                <button
                  style={{
                    ...styles.button,
                    backgroundColor: '#f3f4f6',
                    color: '#dc2626',
                  }}
                  onClick={onUninstall}
                >
                  🗑️
                </button>
              )}
            </>
          ) : (
            <button
              style={{
                ...styles.button,
                backgroundColor: '#2563eb',
                color: '#ffffff',
                flex: 1,
              }}
              onClick={onInstall}
            >
              Install
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// ============================================
// Extension Marketplace Component
// ============================================

export interface ExtensionMarketplaceProps {
  extensions: Extension[]
  onInstall?: (extension: Extension) => void
  onUninstall?: (extensionId: string) => void
  onConfigure?: (extensionId: string) => void
  categories?: ExtensionCategory[]
}

export function ExtensionMarketplace({
  extensions,
  onInstall,
  onUninstall,
  onConfigure,
  categories,
}: ExtensionMarketplaceProps): React.ReactElement {
  const { extensions: installed, enable, disable } = useExtensions()
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedCategory, setSelectedCategory] = React.useState<
    ExtensionCategory | 'all'
  >('all')

  const filteredExtensions = React.useMemo(() => {
    return extensions.filter((ext) => {
      const matchesSearch =
        searchQuery === '' ||
        ext.metadata.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ext.metadata.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        ext.metadata.tags?.some((t) =>
          t.toLowerCase().includes(searchQuery.toLowerCase())
        )

      const matchesCategory =
        selectedCategory === 'all' || ext.metadata.category === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [extensions, searchQuery, selectedCategory])

  const availableCategories = categories || [
    'ai-provider',
    'vector-store',
    'authentication',
    'analytics',
    'storage',
    'realtime',
    'notification',
    'search',
    'crm',
    'observability',
    'utility',
  ]

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: '0 0 8px', fontSize: '24px', fontWeight: 700 }}>
          Extension Marketplace
        </h2>
        <p style={{ margin: 0, color: '#6b7280' }}>
          Discover and install extensions to enhance your chat application
        </p>
      </div>

      {/* Search and Filters */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '24px',
          flexWrap: 'wrap',
        }}
      >
        <input
          type="text"
          placeholder="Search extensions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ ...styles.input, flex: 1, minWidth: '200px' }}
        />
        <select
          value={selectedCategory}
          onChange={(e) =>
            setSelectedCategory(e.target.value as ExtensionCategory | 'all')
          }
          style={{
            ...styles.input,
            width: 'auto',
            minWidth: '150px',
            cursor: 'pointer',
          }}
        >
          <option value="all">All Categories</option>
          {availableCategories.map((cat) => (
            <option key={cat} value={cat}>
              {formatCategory(cat)}
            </option>
          ))}
        </select>
      </div>

      {/* Results */}
      <div
        style={{
          ...styles.grid,
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        }}
      >
        {filteredExtensions.map((ext) => {
          const registration = installed.find(
            (r) => r.extension.metadata.id === ext.metadata.id
          )
          return (
            <ExtensionCard
              key={ext.metadata.id}
              extension={ext}
              registration={registration}
              onInstall={() => onInstall?.(ext)}
              onUninstall={() => onUninstall?.(ext.metadata.id)}
              onConfigure={() => onConfigure?.(ext.metadata.id)}
              onToggle={(enabled) =>
                enabled ? enable(ext.metadata.id) : disable(ext.metadata.id)
              }
            />
          )
        })}
      </div>

      {filteredExtensions.length === 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: '48px 24px',
            color: '#9ca3af',
          }}
        >
          <p style={{ margin: 0, fontSize: '16px' }}>No extensions found</p>
          <p style={{ margin: '8px 0 0', fontSize: '14px' }}>
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  )
}

// ============================================
// Extension Manager Component
// ============================================

export interface ExtensionManagerProps {
  showHealth?: boolean
  onConfigure?: (extensionId: string) => void
}

export function ExtensionManager({
  showHealth = true,
  onConfigure,
}: ExtensionManagerProps): React.ReactElement {
  const { extensions, enable, disable, unregister } = useExtensions()
  const { health, checkHealth, isChecking } = useExtensionHealth()

  return (
    <div style={styles.container}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
        }}
      >
        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 600 }}>
          Installed Extensions ({extensions.length})
        </h2>
        {showHealth && (
          <button
            style={{
              ...styles.button,
              backgroundColor: '#f3f4f6',
              color: '#374151',
              opacity: isChecking ? 0.6 : 1,
            }}
            onClick={checkHealth}
            disabled={isChecking}
          >
            {isChecking ? 'Checking...' : '🔄 Check Health'}
          </button>
        )}
      </div>

      {extensions.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '48px 24px',
            backgroundColor: '#f9fafb',
            borderRadius: '12px',
            color: '#6b7280',
          }}
        >
          <p style={{ margin: 0, fontSize: '16px' }}>No extensions installed</p>
          <p style={{ margin: '8px 0 0', fontSize: '14px' }}>
            Visit the marketplace to discover extensions
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {extensions.map((reg) => (
            <div
              key={reg.extension.metadata.id}
              style={{
                ...styles.card,
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              <div style={{ flex: 1 }}>
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <span style={{ fontWeight: 600 }}>
                    {reg.extension.metadata.name}
                  </span>
                  <ExtensionStatusBadge state={reg.state} size="sm" />
                </div>
                <p
                  style={{
                    margin: '4px 0 0',
                    fontSize: '13px',
                    color: '#6b7280',
                  }}
                >
                  {reg.extension.metadata.description}
                </p>
              </div>

              {showHealth && health instanceof Map && (
                <ExtensionHealthIndicator
                  health={health.get(reg.extension.metadata.id)}
                />
              )}

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  style={{
                    ...styles.button,
                    backgroundColor:
                      reg.state === 'active' ? '#fee2e2' : '#d1fae5',
                    color: reg.state === 'active' ? '#dc2626' : '#059669',
                    padding: '6px 12px',
                    fontSize: '13px',
                  }}
                  onClick={() =>
                    reg.state === 'active'
                      ? disable(reg.extension.metadata.id)
                      : enable(reg.extension.metadata.id)
                  }
                >
                  {reg.state === 'active' ? 'Disable' : 'Enable'}
                </button>
                {onConfigure && (
                  <button
                    style={{
                      ...styles.button,
                      backgroundColor: '#f3f4f6',
                      color: '#374151',
                      padding: '6px 10px',
                    }}
                    onClick={() => onConfigure(reg.extension.metadata.id)}
                  >
                    ⚙️
                  </button>
                )}
                <button
                  style={{
                    ...styles.button,
                    backgroundColor: '#f3f4f6',
                    color: '#dc2626',
                    padding: '6px 10px',
                  }}
                  onClick={() => unregister(reg.extension.metadata.id)}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ============================================
// Configuration Wizard Component
// ============================================

export interface ExtensionConfigWizardProps {
  extension: Extension
  currentConfig?: Record<string, unknown>
  onSave: (config: Record<string, unknown>) => void
  onCancel: () => void
}

export function ExtensionConfigWizard({
  extension,
  currentConfig = {},
  onSave,
  onCancel,
}: ExtensionConfigWizardProps): React.ReactElement {
  const [config, setConfig] =
    React.useState<Record<string, unknown>>(currentConfig)
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  const schema = extension.configSchema

  const handleChange = (key: string, value: unknown) => {
    setConfig((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => {
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {}

    if (schema?.required) {
      for (const field of schema.required) {
        if (config[field] === undefined || config[field] === '') {
          newErrors[field] = 'This field is required'
        }
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onSave(config)
  }

  if (!schema) {
    return (
      <div style={styles.container}>
        <p style={{ color: '#6b7280' }}>
          This extension has no configurable options.
        </p>
        <button
          style={{
            ...styles.button,
            backgroundColor: '#f3f4f6',
            color: '#374151',
          }}
          onClick={onCancel}
        >
          Close
        </button>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <h3 style={{ margin: '0 0 16px', fontSize: '18px', fontWeight: 600 }}>
        Configure {extension.metadata.name}
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {Object.entries(schema.properties).map(([key, field]) => (
          <div key={key}>
            <label
              style={{
                display: 'block',
                marginBottom: '4px',
                fontSize: '14px',
                fontWeight: 500,
              }}
            >
              {field.label}
              {schema.required?.includes(key) && (
                <span style={{ color: '#dc2626' }}> *</span>
              )}
            </label>
            {field.description && (
              <p
                style={{
                  margin: '0 0 8px',
                  fontSize: '12px',
                  color: '#6b7280',
                }}
              >
                {field.description}
              </p>
            )}
            {renderConfigField(key, field, config[key], handleChange)}
            {errors[key] && (
              <p
                style={{
                  margin: '4px 0 0',
                  fontSize: '12px',
                  color: '#dc2626',
                }}
              >
                {errors[key]}
              </p>
            )}
          </div>
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          gap: '12px',
          marginTop: '24px',
          paddingTop: '16px',
          borderTop: '1px solid #e5e7eb',
        }}
      >
        <button
          style={{
            ...styles.button,
            backgroundColor: '#2563eb',
            color: '#ffffff',
            flex: 1,
          }}
          onClick={handleSubmit}
        >
          Save Configuration
        </button>
        <button
          style={{
            ...styles.button,
            backgroundColor: '#f3f4f6',
            color: '#374151',
          }}
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

// ============================================
// Helper Functions
// ============================================

function getCategoryIcon(category: ExtensionCategory): string {
  const icons: Record<ExtensionCategory, string> = {
    'ai-provider': '🤖',
    'vector-store': '🗃️',
    authentication: '🔐',
    analytics: '📊',
    storage: '💾',
    realtime: '⚡',
    notification: '🔔',
    search: '🔍',
    crm: '💬',
    observability: '👁️',
    security: '🛡️',
    utility: '🔧',
    ui: '🎨',
    custom: '⚙️',
  }
  return icons[category] || '📦'
}

function formatCategory(category: ExtensionCategory): string {
  return category
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function renderConfigField(
  key: string,
  field: {
    type: string
    placeholder?: string
    enum?: unknown[]
    default?: unknown
  },
  value: unknown,
  onChange: (key: string, value: unknown) => void
): React.ReactElement {
  const inputStyle = styles.input

  if (field.enum) {
    return (
      <select
        value={String(value ?? field.default ?? '')}
        onChange={(e) => onChange(key, e.target.value)}
        style={{ ...inputStyle, cursor: 'pointer' }}
      >
        <option value="">Select...</option>
        {field.enum.map((opt) => (
          <option key={String(opt)} value={String(opt)}>
            {String(opt)}
          </option>
        ))}
      </select>
    )
  }

  switch (field.type) {
    case 'boolean':
      return (
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
          }}
        >
          <input
            type="checkbox"
            checked={Boolean(value ?? field.default)}
            onChange={(e) => onChange(key, e.target.checked)}
            style={{ width: '18px', height: '18px' }}
          />
          <span style={{ fontSize: '14px' }}>Enabled</span>
        </label>
      )

    case 'number':
      return (
        <input
          type="number"
          value={String(value ?? field.default ?? '')}
          onChange={(e) => onChange(key, Number(e.target.value))}
          placeholder={field.placeholder}
          style={inputStyle}
        />
      )

    case 'secret':
      return (
        <input
          type="password"
          value={String(value ?? '')}
          onChange={(e) => onChange(key, e.target.value)}
          placeholder={field.placeholder || '••••••••'}
          style={inputStyle}
        />
      )

    default:
      return (
        <input
          type="text"
          value={String(value ?? field.default ?? '')}
          onChange={(e) => onChange(key, e.target.value)}
          placeholder={field.placeholder}
          style={inputStyle}
        />
      )
  }
}

// ============================================
// Exports
// ============================================

export default {
  ExtensionStatusBadge,
  ExtensionHealthIndicator,
  ExtensionCard,
  ExtensionMarketplace,
  ExtensionManager,
  ExtensionConfigWizard,
}
