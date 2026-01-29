/**
 * Enterprise Preset - Full-featured compliance-aware configuration
 *
 * Comprehensive configuration with audit logging, compliance tracking,
 * SSO support, and enterprise security features.
 *
 * @example
 * ```tsx
 * import { enterprisePreset, createPreset } from './presets'
 *
 * // Use enterprise preset for enterprise deployments
 * <EnterpriseChat {...enterprisePreset.config} />
 *
 * // Create custom enterprise preset with SSO
 * const customEnterprise = createPreset({
 *   security: { ssoEnabled: true, ssoProvider: 'okta' }
 * })
 * ```
 */

import type { ReactNode } from 'react'

// ============================================================================
// Types
// ============================================================================

export type SSOProvider = 'okta' | 'azure-ad' | 'google' | 'saml' | 'ldap'
export type AuditLevel = 'basic' | 'detailed' | 'comprehensive'
export type ComplianceStandard = 'hipaa' | 'gdpr' | 'sox' | 'pci-dss' | 'iso-27001'

export interface EnterpriseProviderConfig {
  /** Model identifier */
  model: string
  /** Provider name */
  provider: string
  /** Temperature for generation */
  temperature: number
  /** Maximum tokens in response */
  maxTokens: number
  /** Enable streaming responses */
  streaming: boolean
  /** System prompt for enterprise behavior */
  systemPrompt?: string
  /** API key for authentication */
  apiKey?: string
  /** Base URL for API requests */
  apiBase?: string
  /** Request timeout in milliseconds */
  timeout?: number
  /** Retry attempts on failure */
  retryAttempts?: number
  /** Rate limiting per user */
  rateLimit?: {
    requestsPerMinute?: number
    requestsPerDay?: number
  }
}

export interface EnterpriseSecurityConfig {
  /** Enable Single Sign-On */
  ssoEnabled: boolean
  /** SSO provider type */
  ssoProvider?: SSOProvider
  /** SAML metadata URL (if SAML) */
  samlMetadataUrl?: string
  /** OAuth configuration */
  oauth?: {
    clientId: string
    clientSecret?: string
    authorizationUrl?: string
    tokenUrl?: string
  }
  /** Require encrypted connections */
  requireEncryption: boolean
  /** Enable IP whitelisting */
  ipWhitelistEnabled: boolean
  /** Allowed IP addresses */
  ipWhitelist?: string[]
  /** Require multi-factor authentication */
  mfaRequired: boolean
  /** Session timeout in minutes */
  sessionTimeout: number
  /** Enable request signing */
  requestSigning: boolean
}

export interface EnterpriseAuditConfig {
  /** Audit logging level */
  level: AuditLevel
  /** Store audit logs */
  enabled: boolean
  /** Audit storage endpoint */
  storageEndpoint?: string
  /** Retention days */
  retentionDays: number
  /** Log user actions */
  logUserActions: boolean
  /** Log data access */
  logDataAccess: boolean
  /** Log authentication events */
  logAuthEvents: boolean
  /** Encrypt audit logs */
  encryptLogs: boolean
}

export interface EnterpriseComplianceConfig {
  /** Enable compliance mode */
  enabled: boolean
  /** Applicable compliance standards */
  standards: ComplianceStandard[]
  /** Data residency requirement */
  dataResidency?: string
  /** Enable content filtering */
  contentFilteringEnabled: boolean
  /** Enable data anonymization */
  anonymizationEnabled: boolean
  /** Data retention policy */
  dataRetentionDays?: number
  /** Right to be forgotten enabled */
  rightToBeForgettenEnabled: boolean
}

export interface EnterpriseFeatures {
  /** Display thinking process */
  thinking: boolean
  /** Show message citations */
  citations: boolean
  /** Enable suggestions */
  suggestions: boolean
  /** Show audit trail */
  auditTrail: boolean
  /** Enable compliance reports */
  complianceReports: boolean
  /** Show user activity logs */
  activityLogs: boolean
  /** Enable access control list (ACL) */
  accessControl: boolean
  /** Show data classification */
  dataClassification: boolean
  /** Enable encryption indicators */
  encryptionIndicators: boolean
  /** Show compliance status */
  complianceStatus: boolean
}

export interface EnterpriseComponentProps {
  /** Container class name */
  className?: string
  /** Custom header content */
  header?: ReactNode
  /** Custom footer content */
  footer?: ReactNode
  /** Container height */
  height?: string | number
  /** Container width */
  width?: string | number
  /** Show header */
  showHeader: boolean
  /** Show input area */
  showInput: boolean
  /** Show admin panel */
  showAdminPanel: boolean
  /** Show audit panel */
  showAuditPanel: boolean
  /** Admin panel width */
  adminPanelWidth: string | number
  /** Show compliance badge */
  showComplianceBadge: boolean
  /** Show encryption status */
  showEncryptionStatus: boolean
  /** Organization name */
  organizationName?: string
}

export interface EnterpriseTheme {
  /** Primary brand color */
  primary: string
  /** Secondary accent color */
  secondary: string
  /** Background color */
  background: string
  /** Surface/card color */
  surface: string
  /** Text primary color */
  text: string
  /** Text secondary color */
  textSecondary: string
  /** Border color */
  border: string
  /** Success color */
  success: string
  /** Warning color */
  warning: string
  /** Error color */
  error: string
  /** Info color */
  info: string
  /** Compliance color */
  compliance: string
  /** Border radius */
  borderRadius: string
  /** Font family */
  fontFamily: string
  /** Base font size */
  fontSize: string
}

// ============================================================================
// Default Provider Configuration
// ============================================================================

/**
 * Default provider configuration for enterprise preset
 */
export const defaultProviderConfig: EnterpriseProviderConfig = {
  model: 'claude-opus-4.5',
  provider: 'anthropic',
  temperature: 0.7,
  maxTokens: 4096,
  streaming: true,
  timeout: 30000,
  retryAttempts: 3,
  rateLimit: {
    requestsPerMinute: 100,
    requestsPerDay: 10000,
  },
}

// ============================================================================
// Default Security Configuration
// ============================================================================

/**
 * Default security configuration for enterprise preset
 */
export const defaultSecurityConfig: EnterpriseSecurityConfig = {
  ssoEnabled: true,
  ssoProvider: 'okta',
  requireEncryption: true,
  ipWhitelistEnabled: false,
  mfaRequired: true,
  sessionTimeout: 60,
  requestSigning: true,
}

// ============================================================================
// Default Audit Configuration
// ============================================================================

/**
 * Default audit configuration for enterprise preset
 */
export const defaultAuditConfig: EnterpriseAuditConfig = {
  level: 'detailed',
  enabled: true,
  retentionDays: 365,
  logUserActions: true,
  logDataAccess: true,
  logAuthEvents: true,
  encryptLogs: true,
}

// ============================================================================
// Default Compliance Configuration
// ============================================================================

/**
 * Default compliance configuration for enterprise preset
 */
export const defaultComplianceConfig: EnterpriseComplianceConfig = {
  enabled: true,
  standards: ['gdpr', 'hipaa', 'sox'],
  anonymizationEnabled: true,
  dataRetentionDays: 90,
  rightToBeForgettenEnabled: true,
  contentFilteringEnabled: true,
}

// ============================================================================
// Default Features
// ============================================================================

/**
 * Default features for enterprise preset
 */
export const defaultFeatures: EnterpriseFeatures = {
  thinking: true,
  citations: true,
  suggestions: true,
  auditTrail: true,
  complianceReports: true,
  activityLogs: true,
  accessControl: true,
  dataClassification: true,
  encryptionIndicators: true,
  complianceStatus: true,
}

// ============================================================================
// Default Component Props
// ============================================================================

/**
 * Default component props for enterprise preset
 */
export const defaultComponentProps: EnterpriseComponentProps = {
  height: '100vh',
  width: '100%',
  showHeader: true,
  showInput: true,
  showAdminPanel: true,
  showAuditPanel: true,
  adminPanelWidth: '400px',
  showComplianceBadge: true,
  showEncryptionStatus: true,
}

// ============================================================================
// Default Theme Overrides
// ============================================================================

/**
 * Default theme overrides for enterprise preset
 */
export const defaultTheme: EnterpriseTheme = {
  primary: '#003d7a',
  secondary: '#0066cc',
  background: '#f5f7fa',
  surface: '#ffffff',
  text: '#1a1a1a',
  textSecondary: '#666666',
  border: '#d0d7e0',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
  compliance: '#8b5cf6',
  borderRadius: '6px',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontSize: '14px',
}

// ============================================================================
// Preset Interface
// ============================================================================

export interface EnterprisePreset {
  name: string
  description: string
  provider: EnterpriseProviderConfig
  security: EnterpriseSecurityConfig
  audit: EnterpriseAuditConfig
  compliance: EnterpriseComplianceConfig
  features: EnterpriseFeatures
  componentProps: EnterpriseComponentProps
  theme: EnterpriseTheme
}

// ============================================================================
// Main Preset Export
// ============================================================================

/**
 * Enterprise chat preset
 *
 * Comprehensive configuration optimized for:
 * - Large organizations
 * - Compliance requirements (GDPR, HIPAA, SOX, PCI-DSS, ISO 27001)
 * - Enterprise security (SSO, MFA, IP whitelisting)
 * - Audit logging and reporting
 * - Data governance and privacy
 */
export const enterprisePreset: EnterprisePreset = {
  name: 'Enterprise',
  description: 'Full-featured enterprise preset with compliance, audit, and SSO support',
  provider: defaultProviderConfig,
  security: defaultSecurityConfig,
  audit: defaultAuditConfig,
  compliance: defaultComplianceConfig,
  features: defaultFeatures,
  componentProps: defaultComponentProps,
  theme: defaultTheme,
}

// ============================================================================
// Factory Function
// ============================================================================

export interface CreateEnterprisePresetOptions {
  provider?: Partial<EnterpriseProviderConfig>
  security?: Partial<EnterpriseSecurityConfig>
  audit?: Partial<EnterpriseAuditConfig>
  compliance?: Partial<EnterpriseComplianceConfig>
  features?: Partial<EnterpriseFeatures>
  componentProps?: Partial<EnterpriseComponentProps>
  theme?: Partial<EnterpriseTheme>
}

/**
 * Create a custom enterprise preset with optional overrides
 *
 * @param options - Configuration options
 * @returns Custom enterprise preset
 *
 * @example
 * ```tsx
 * const customEnterprise = createPreset({
 *   security: {
 *     ssoProvider: 'azure-ad',
 *     mfaRequired: true
 *   },
 *   compliance: {
 *     standards: ['hipaa', 'pci-dss']
 *   }
 * })
 * ```
 */
export function createPreset(options: CreateEnterprisePresetOptions = {}): EnterprisePreset {
  return {
    name: 'Enterprise (Custom)',
    description: 'Customized enterprise configuration',
    provider: {
      ...defaultProviderConfig,
      ...options.provider,
    },
    security: {
      ...defaultSecurityConfig,
      ...options.security,
    },
    audit: {
      ...defaultAuditConfig,
      ...options.audit,
    },
    compliance: {
      ...defaultComplianceConfig,
      ...options.compliance,
    },
    features: {
      ...defaultFeatures,
      ...options.features,
    },
    componentProps: {
      ...defaultComponentProps,
      ...options.componentProps,
    },
    theme: {
      ...defaultTheme,
      ...options.theme,
    },
  }
}

/**
 * Merge enterprise preset with another configuration
 *
 * @param overrides - Properties to override
 * @returns Merged preset
 */
export function mergePreset(overrides: CreateEnterprisePresetOptions): EnterprisePreset {
  return createPreset(overrides)
}

/**
 * Clone the enterprise preset
 *
 * @returns Cloned preset
 */
export function clonePreset(): EnterprisePreset {
  return {
    ...enterprisePreset,
    provider: { ...enterprisePreset.provider },
    security: { ...enterprisePreset.security },
    audit: { ...enterprisePreset.audit },
    compliance: { ...enterprisePreset.compliance },
    features: { ...enterprisePreset.features },
    componentProps: { ...enterprisePreset.componentProps },
    theme: { ...enterprisePreset.theme },
  }
}

/**
 * Get preset summary
 *
 * @returns Summary string
 */
export function getPresetSummary(): string {
  const standards = defaultComplianceConfig.standards.join(', ')
  return `${enterprisePreset.name}: ${enterprisePreset.description} (${standards})`
}

/**
 * Enable SSO configuration
 *
 * @param provider - SSO provider
 * @param config - Additional configuration
 * @returns Updated preset
 */
export function enableSSO(
  provider: SSOProvider,
  config?: Partial<EnterpriseSecurityConfig['oauth']>
): EnterprisePreset {
  const updated = clonePreset()
  updated.security.ssoEnabled = true
  updated.security.ssoProvider = provider
  if (config) {
    updated.security.oauth = {
      ...updated.security.oauth,
      ...config,
    } as any
  }
  return updated
}

/**
 * Set compliance standards
 *
 * @param standards - Array of compliance standards
 * @returns Updated preset
 */
export function setComplianceStandards(standards: ComplianceStandard[]): EnterprisePreset {
  const updated = clonePreset()
  updated.compliance.standards = standards
  return updated
}

/**
 * Enable audit logging
 *
 * @param level - Audit detail level
 * @returns Updated preset
 */
export function setAuditLevel(level: AuditLevel): EnterprisePreset {
  const updated = clonePreset()
  updated.audit.level = level
  return updated
}

/**
 * Export all utilities as object
 */
export const enterprise = {
  preset: enterprisePreset,
  defaultProviderConfig,
  defaultSecurityConfig,
  defaultAuditConfig,
  defaultComplianceConfig,
  defaultFeatures,
  defaultComponentProps,
  defaultTheme,
  createPreset,
  mergePreset,
  clonePreset,
  getPresetSummary,
  enableSSO,
  setComplianceStandards,
  setAuditLevel,
}
