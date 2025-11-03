import type { LicenseTier, LicenseFeatures } from './types'

/**
 * Get features available for a license tier
 */
export function getLicenseFeatures(tier: LicenseTier): LicenseFeatures {
  switch (tier) {
    case 'free':
      return FREE_FEATURES
    case 'pro-individual':
      return PRO_INDIVIDUAL_FEATURES
    case 'pro-team':
      return PRO_TEAM_FEATURES
    case 'enterprise':
      return ENTERPRISE_FEATURES
    default:
      return FREE_FEATURES
  }
}

/**
 * Check if a feature is available for a tier
 */
export function hasFeature(tier: LicenseTier, feature: string): boolean {
  const features = getLicenseFeatures(tier)

  // Check in all feature arrays
  if (features.components.includes(feature)) return true
  if (features.themes.includes(feature)) return true
  if (features.aiProviders.includes(feature)) return true
  if (features.analyticsProviders.includes(feature)) return true
  if (features.errorProviders.includes(feature)) return true

  // Check boolean features
  if (feature === 'enterprise' && features.enterpriseFeatures) return true
  if (feature === 'white-label' && features.whiteLabelAllowed) return true
  if (feature === 'saas' && features.saasAllowed) return true

  return false
}

/**
 * Free tier features (MIT License)
 */
const FREE_FEATURES: LicenseFeatures = {
  components: [
    // Primitives (all free)
    'Button',
    'Input',
    'Textarea',
    'Card',
    'Avatar',
    'Badge',
    'Tooltip',
    'Dialog',
    'Dropdown',
    'Popover',
    'ScrollArea',

    // Basic chat components
    'Message',
    'MessageList',
    'ChatInput',
    'ChatWindow',
  ],
  themes: ['default', 'dark', 'minimal'],
  aiProviders: [],
  analyticsProviders: [],
  errorProviders: [],
  enterpriseFeatures: false,
  supportLevel: 'community',
  whiteLabelAllowed: false,
  saasAllowed: false,
}

/**
 * Pro Individual features
 */
const PRO_INDIVIDUAL_FEATURES: LicenseFeatures = {
  components: [
    ...FREE_FEATURES.components,

    // Advanced chat
    'AdvancedChatInput',
    'StreamingMessage',
    'VoiceInput',
    'FileUpload',
    'CommandPalette',
    'ContextMenu',
    'Draggable',
    'ThemeSwitcher',

    // AI Features
    'ModelSelector',
    'TokenCounter',
    'ToolInvocationCard',
    'CitationCard',
    'ThinkingIndicator',

    // Context & Management
    'ContextCard',
    'ContextManager',
    'ContextVisualizer',
    'ProjectSidebar',
    'PromptLibrary',

    // Utilities
    'CopyButton',
    'RetryButton',
    'NetworkStatus',
    'ErrorBoundary',
    'Skeleton',
    'Toast',
    'Progress',

    // Advanced Features
    'ExportDialog',
    'MessageSearch',
    'FollowUpSuggestions',
    'PersonaPanel',
    'ConversationTimeline',
    'ConversationList',
    'MemoryInspector',
    'SafetyStatusCard',
    'ResponseQualityMeter',
    'MultiModalPreview',
    'SessionSummaryCard',
    'WorkflowSuggestionList',
    'VirtualizedMessageList',
    'SettingsPanel',
    'KnowledgeBaseViewer',

    // Animations & Interactions
    'AnimatedList',
    'FeedbackAnimation',
    'InteractiveCard',
    'KeyboardHint',
    'Ripple',
  ],
  themes: [
    ...FREE_FEATURES.themes,
    'ocean',
    'glassmorphism',
    'sunset',
    'forest',
    'corporate',
    'neon',
    'warm',
    'cool',
  ],
  aiProviders: ['openai', 'anthropic', 'azure', 'google'],
  analyticsProviders: ['googleAnalytics'], // 1 provider
  errorProviders: ['sentry'], // 1 provider
  enterpriseFeatures: false,
  supportLevel: 'email',
  whiteLabelAllowed: false,
  saasAllowed: false,
}

/**
 * Pro Team features (same as Pro Individual)
 */
const PRO_TEAM_FEATURES: LicenseFeatures = {
  ...PRO_INDIVIDUAL_FEATURES,
  supportLevel: 'priority',
}

/**
 * Enterprise features
 */
const ENTERPRISE_FEATURES: LicenseFeatures = {
  components: [
    ...PRO_INDIVIDUAL_FEATURES.components,

    // Enterprise-only components
    'SSOConfigWizard',
    'AuthTenantDashboard',
    'ApiTokenManager',
    'SeatInviteDialog',
    'EvaluationDashboard',
    'PromptTestHarness',
    'SafetyReviewConsole',
    'UsageDashboard',
    'PerformanceDashboard',
    'AgentRunFeed',
  ],
  themes: [
    ...PRO_INDIVIDUAL_FEATURES.themes,
    // Can create unlimited custom themes
  ],
  aiProviders: [
    ...PRO_INDIVIDUAL_FEATURES.aiProviders,
    'aws',
    'cohere',
    'huggingface',
    'custom',
  ],
  analyticsProviders: [
    'googleAnalytics',
    'mixpanel',
    'posthog',
    'amplitude',
    'segment',
    'heap',
    'custom',
  ],
  errorProviders: [
    'sentry',
    'rollbar',
    'bugsnag',
    'logrocket',
    'datadog',
    'newrelic',
    'custom',
  ],
  enterpriseFeatures: true,
  supportLevel: 'dedicated',
  whiteLabelAllowed: true,
  saasAllowed: true,
}

/**
 * Check if a component is available for a tier
 */
export function isComponentAvailable(tier: LicenseTier, component: string): boolean {
  const features = getLicenseFeatures(tier)
  return features.components.includes(component)
}

/**
 * Check if a theme is available for a tier
 */
export function isThemeAvailable(tier: LicenseTier, theme: string): boolean {
  const features = getLicenseFeatures(tier)
  return features.themes.includes(theme)
}

/**
 * Check if an AI provider is available for a tier
 */
export function isAIProviderAvailable(tier: LicenseTier, provider: string): boolean {
  const features = getLicenseFeatures(tier)
  return features.aiProviders.includes(provider) || features.aiProviders.includes('custom')
}

/**
 * Get tier name for display
 */
export function getTierDisplayName(tier: LicenseTier): string {
  switch (tier) {
    case 'free':
      return 'Free Tier'
    case 'pro-individual':
      return 'Pro Individual'
    case 'pro-team':
      return 'Pro Team'
    case 'enterprise':
      return 'Enterprise'
    default:
      return 'Unknown Tier'
  }
}

/**
 * Get tier upgrade path
 */
export function getUpgradePath(currentTier: LicenseTier): LicenseTier | null {
  switch (currentTier) {
    case 'free':
      return 'pro-individual'
    case 'pro-individual':
      return 'pro-team'
    case 'pro-team':
      return 'enterprise'
    case 'enterprise':
      return null // Already at highest tier
    default:
      return null
  }
}

/**
 * Calculate upgrade discount
 */
export function getUpgradeDiscount(
  currentTier: LicenseTier,
  targetTier: LicenseTier,
  remainingMonths: number
): number {
  // Credit remaining value toward upgrade
  const tierValues = {
    free: 0,
    'pro-individual': 149,
    'pro-team': 499,
    enterprise: 2499,
  }

  const currentValue = tierValues[currentTier]
  const targetValue = tierValues[targetTier]

  if (currentValue >= targetValue) {
    return 0
  }

  // Prorate current tier value
  const monthlyValue = currentValue / 12
  const remainingValue = monthlyValue * remainingMonths

  return Math.min(remainingValue, targetValue - currentValue)
}


