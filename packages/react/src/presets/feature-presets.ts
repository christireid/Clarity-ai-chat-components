/**
 * Feature Presets - Pre-configured feature sets for different scenarios
 *
 * Provides feature presets for Basic (essential features), Standard (common),
 * Advanced (professional), and Enterprise (full suite) use cases.
 *
 * @example
 * ```tsx
 * import { basicFeaturePreset, enterpriseFeaturePreset } from './presets'
 *
 * // Use basic features
 * <ChatApp features={basicFeaturePreset} />
 *
 * // Use enterprise features
 * <ChatApp features={enterpriseFeaturePreset} />
 *
 * // Create custom feature set
 * const myFeatures = createCustomFeaturePreset({
 *   name: 'My Features',
 *   features: ['messaging', 'voice', 'video']
 * })
 * ```
 */

// ============================================================================
// Types
// ============================================================================

/** Feature configuration */
export interface FeatureConfig {
  /** Feature identifier */
  id: string
  /** Feature name */
  name: string
  /** Feature description */
  description: string
  /** Whether feature is enabled */
  enabled: boolean
  /** Feature category */
  category: 'core' | 'communication' | 'content' | 'collaboration' | 'analytics' | 'integration' | 'admin'
  /** Minimum tier required (if tier-based) */
  minTier?: 'basic' | 'standard' | 'advanced' | 'enterprise'
  /** Feature options/configuration */
  options?: Record<string, any>
  /** Whether feature requires backend support */
  requiresBackend?: boolean
}

/** Complete feature preset */
export interface FeaturePreset {
  /** Preset name */
  name: string
  /** Preset description */
  description: string
  /** Tier level */
  tier: 'basic' | 'standard' | 'advanced' | 'enterprise'
  /** Array of feature configurations */
  features: FeatureConfig[]
  /** Maximum number of users/conversations */
  maxCapacity?: number
  /** Rate limits */
  rateLimits?: {
    messagesPerMinute?: number
    requestsPerSecond?: number
  }
}

/** Options for creating custom feature presets */
export interface CreateCustomFeaturePresetOptions {
  name: string
  description?: string
  tier?: 'basic' | 'standard' | 'advanced' | 'enterprise'
  features: FeatureConfig[]
  maxCapacity?: number
  rateLimits?: {
    messagesPerMinute?: number
    requestsPerSecond?: number
  }
}

// ============================================================================
// Basic Feature Preset
// ============================================================================

export const basicFeaturePreset: FeaturePreset = {
  name: 'Basic',
  description: 'Essential chat features for simple applications',
  tier: 'basic',
  maxCapacity: 1000,
  rateLimits: {
    messagesPerMinute: 60,
    requestsPerSecond: 10,
  },
  features: [
    {
      id: 'messaging',
      name: 'Text Messaging',
      description: 'Send and receive text messages',
      category: 'core',
      enabled: true,
      minTier: 'basic',
    },
    {
      id: 'message-history',
      name: 'Message History',
      description: 'View chat history',
      category: 'core',
      enabled: true,
      minTier: 'basic',
      options: {
        retentionDays: 30,
        maxMessages: 1000,
      },
    },
    {
      id: 'basic-markdown',
      name: 'Basic Markdown',
      description: 'Support for basic text formatting',
      category: 'content',
      enabled: true,
      minTier: 'basic',
      options: {
        bold: true,
        italic: true,
        code: true,
      },
    },
    {
      id: 'typing-indicator',
      name: 'Typing Indicator',
      description: 'Show when user is typing',
      category: 'core',
      enabled: true,
      minTier: 'basic',
    },
    {
      id: 'timestamps',
      name: 'Message Timestamps',
      description: 'Show when messages were sent',
      category: 'core',
      enabled: true,
      minTier: 'basic',
    },
    {
      id: 'user-presence',
      name: 'User Presence',
      description: 'Show if users are online/offline',
      category: 'core',
      enabled: true,
      minTier: 'basic',
      requiresBackend: true,
    },
  ],
}

// ============================================================================
// Standard Feature Preset
// ============================================================================

export const standardFeaturePreset: FeaturePreset = {
  name: 'Standard',
  description: 'Common features for typical chat applications',
  tier: 'standard',
  maxCapacity: 10000,
  rateLimits: {
    messagesPerMinute: 300,
    requestsPerSecond: 50,
  },
  features: [
    ...basicFeaturePreset.features,
    {
      id: 'rich-text',
      name: 'Rich Text Editor',
      description: 'Advanced text editing with formatting toolbar',
      category: 'content',
      enabled: true,
      minTier: 'standard',
      options: {
        bold: true,
        italic: true,
        underline: true,
        strikethrough: true,
        lists: true,
        code: true,
      },
    },
    {
      id: 'emoji-support',
      name: 'Emoji Support',
      description: 'Send and render emojis and emoji picker',
      category: 'content',
      enabled: true,
      minTier: 'standard',
      options: {
        emojiPicker: true,
        emojiSearchable: true,
      },
    },
    {
      id: 'file-upload',
      name: 'File Uploads',
      description: 'Upload and share files',
      category: 'content',
      enabled: true,
      minTier: 'standard',
      requiresBackend: true,
      options: {
        maxFileSize: 10485760, // 10MB
        allowedTypes: ['image/*', 'application/pdf', 'text/*'],
      },
    },
    {
      id: 'search',
      name: 'Message Search',
      description: 'Search through chat history',
      category: 'core',
      enabled: true,
      minTier: 'standard',
      options: {
        searchWithinDays: 90,
      },
    },
    {
      id: 'mentions',
      name: 'User Mentions',
      description: 'Mention and tag specific users',
      category: 'collaboration',
      enabled: true,
      minTier: 'standard',
      requiresBackend: true,
      options: {
        enableNotifications: true,
      },
    },
    {
      id: 'reactions',
      name: 'Message Reactions',
      description: 'React to messages with emojis',
      category: 'collaboration',
      enabled: true,
      minTier: 'standard',
      requiresBackend: true,
    },
    {
      id: 'read-receipts',
      name: 'Read Receipts',
      description: 'Show when messages are read',
      category: 'core',
      enabled: true,
      minTier: 'standard',
      requiresBackend: true,
    },
    {
      id: 'user-profiles',
      name: 'User Profiles',
      description: 'View and edit user profiles',
      category: 'collaboration',
      enabled: true,
      minTier: 'standard',
      requiresBackend: true,
    },
    {
      id: 'basic-analytics',
      name: 'Basic Analytics',
      description: 'Track basic chat metrics',
      category: 'analytics',
      enabled: true,
      minTier: 'standard',
      options: {
        trackMessages: true,
        trackUsers: true,
      },
    },
  ],
}

// ============================================================================
// Advanced Feature Preset
// ============================================================================

export const advancedFeaturePreset: FeaturePreset = {
  name: 'Advanced',
  description: 'Professional features for advanced applications',
  tier: 'advanced',
  maxCapacity: 100000,
  rateLimits: {
    messagesPerMinute: 1000,
    requestsPerSecond: 200,
  },
  features: [
    ...standardFeaturePreset.features,
    {
      id: 'video-calls',
      name: 'Video Calls',
      description: 'Peer-to-peer video calling',
      category: 'communication',
      enabled: true,
      minTier: 'advanced',
      requiresBackend: true,
      options: {
        maxParticipants: 2,
        enableScreenShare: false,
        enableRecording: false,
      },
    },
    {
      id: 'audio-calls',
      name: 'Audio Calls',
      description: 'Voice calling functionality',
      category: 'communication',
      enabled: true,
      minTier: 'advanced',
      requiresBackend: true,
      options: {
        maxParticipants: 2,
        enableVoiceMessages: true,
      },
    },
    {
      id: 'voice-messages',
      name: 'Voice Messages',
      description: 'Send voice messages and transcription',
      category: 'communication',
      enabled: true,
      minTier: 'advanced',
      requiresBackend: true,
      options: {
        maxDuration: 600, // 10 minutes
        autoTranscribe: false,
      },
    },
    {
      id: 'message-edit',
      name: 'Message Editing',
      description: 'Edit previously sent messages',
      category: 'core',
      enabled: true,
      minTier: 'advanced',
      requiresBackend: true,
      options: {
        editWindow: 3600, // 1 hour
        showEditHistory: true,
      },
    },
    {
      id: 'message-delete',
      name: 'Message Deletion',
      description: 'Delete messages with soft-delete option',
      category: 'core',
      enabled: true,
      minTier: 'advanced',
      requiresBackend: true,
      options: {
        deleteWindow: 3600, // 1 hour
      },
    },
    {
      id: 'thread-support',
      name: 'Message Threads',
      description: 'Threaded conversations and replies',
      category: 'collaboration',
      enabled: true,
      minTier: 'advanced',
      requiresBackend: true,
    },
    {
      id: 'polls',
      name: 'Polls and Surveys',
      description: 'Create and run polls in chat',
      category: 'collaboration',
      enabled: true,
      minTier: 'advanced',
      requiresBackend: true,
    },
    {
      id: 'code-blocks',
      name: 'Advanced Code Blocks',
      description: 'Syntax highlighted code blocks with copy',
      category: 'content',
      enabled: true,
      minTier: 'advanced',
      options: {
        enableSyntaxHighlight: true,
        enableCopyButton: true,
        enableLanguageSelector: true,
      },
    },
    {
      id: 'rich-media',
      name: 'Rich Media Embeds',
      description: 'Embed videos, images, and links',
      category: 'content',
      enabled: true,
      minTier: 'advanced',
      options: {
        enableYoutubeEmbed: true,
        enableTwitterEmbed: true,
        enableLinkPreview: true,
      },
    },
    {
      id: 'channels',
      name: 'Channels',
      description: 'Organize conversations into channels',
      category: 'collaboration',
      enabled: true,
      minTier: 'advanced',
      requiresBackend: true,
    },
    {
      id: 'permissions',
      name: 'Channel Permissions',
      description: 'Fine-grained access control',
      category: 'admin',
      enabled: true,
      minTier: 'advanced',
      requiresBackend: true,
    },
    {
      id: 'advanced-analytics',
      name: 'Advanced Analytics',
      description: 'Detailed usage and engagement analytics',
      category: 'analytics',
      enabled: true,
      minTier: 'advanced',
      options: {
        trackMessages: true,
        trackUsers: true,
        trackEngagement: true,
        trackPerformance: true,
      },
    },
    {
      id: 'integrations',
      name: 'Third-party Integrations',
      description: 'Connect with external services',
      category: 'integration',
      enabled: true,
      minTier: 'advanced',
      requiresBackend: true,
      options: {
        enableSlack: true,
        enableDiscord: true,
        enableWebhooks: true,
      },
    },
    {
      id: 'bots',
      name: 'Chat Bots',
      description: 'Add and manage chatbots',
      category: 'integration',
      enabled: true,
      minTier: 'advanced',
      requiresBackend: true,
    },
  ],
}

// ============================================================================
// Enterprise Feature Preset
// ============================================================================

export const enterpriseFeaturePreset: FeaturePreset = {
  name: 'Enterprise',
  description: 'Complete feature set for enterprise applications',
  tier: 'enterprise',
  maxCapacity: 1000000,
  rateLimits: {
    messagesPerMinute: 10000,
    requestsPerSecond: 1000,
  },
  features: [
    ...advancedFeaturePreset.features,
    {
      id: 'group-video',
      name: 'Group Video Calls',
      description: 'Multi-participant video conferencing',
      category: 'communication',
      enabled: true,
      minTier: 'enterprise',
      requiresBackend: true,
      options: {
        maxParticipants: 100,
        enableScreenShare: true,
        enableRecording: true,
        enableTranscription: true,
      },
    },
    {
      id: 'ai-features',
      name: 'AI Features',
      description: 'AI-powered features like summarization',
      category: 'core',
      enabled: true,
      minTier: 'enterprise',
      requiresBackend: true,
      options: {
        enableSummarization: true,
        enableTranslation: true,
        enableSentimentAnalysis: true,
      },
    },
    {
      id: 'moderation',
      name: 'Content Moderation',
      description: 'Automated content moderation',
      category: 'admin',
      enabled: true,
      minTier: 'enterprise',
      requiresBackend: true,
      options: {
        enableAutoModeration: true,
        enableSpamDetection: true,
        enableNSFWDetection: true,
      },
    },
    {
      id: 'audit-logs',
      name: 'Audit Logging',
      description: 'Comprehensive audit trail',
      category: 'admin',
      enabled: true,
      minTier: 'enterprise',
      requiresBackend: true,
      options: {
        logAllEvents: true,
        logDuration: 365, // 1 year
      },
    },
    {
      id: 'sso',
      name: 'Single Sign-On',
      description: 'SSO integration with SAML/OAuth',
      category: 'admin',
      enabled: true,
      minTier: 'enterprise',
      requiresBackend: true,
      options: {
        enableSAML: true,
        enableOAuth: true,
      },
    },
    {
      id: 'encryption',
      name: 'End-to-End Encryption',
      description: 'E2E encrypted messages',
      category: 'core',
      enabled: true,
      minTier: 'enterprise',
      requiresBackend: true,
    },
    {
      id: 'compliance',
      name: 'Compliance Tools',
      description: 'GDPR, HIPAA, SOC2 compliance features',
      category: 'admin',
      enabled: true,
      minTier: 'enterprise',
      requiresBackend: true,
      options: {
        enableGDPR: true,
        enableHIPAA: true,
        enableSOC2: true,
        enableDataExport: true,
      },
    },
    {
      id: 'backup-recovery',
      name: 'Backup & Recovery',
      description: 'Automated backup and disaster recovery',
      category: 'admin',
      enabled: true,
      minTier: 'enterprise',
      requiresBackend: true,
      options: {
        automaticBackups: true,
        backupFrequency: 'hourly',
        retentionDays: 90,
      },
    },
    {
      id: 'custom-branding',
      name: 'Custom Branding',
      description: 'Full white-label customization',
      category: 'core',
      enabled: true,
      minTier: 'enterprise',
      options: {
        customLogo: true,
        customColors: true,
        customDomain: true,
      },
    },
    {
      id: 'api-access',
      name: 'API Access',
      description: 'Full REST API access',
      category: 'integration',
      enabled: true,
      minTier: 'enterprise',
      requiresBackend: true,
      options: {
        rateLimitPerMin: 100000,
        enableWebsocket: true,
      },
    },
    {
      id: 'webhooks',
      name: 'Advanced Webhooks',
      description: 'Custom webhook handlers',
      category: 'integration',
      enabled: true,
      minTier: 'enterprise',
      requiresBackend: true,
      options: {
        maxWebhooks: 1000,
        retryAttempts: 5,
      },
    },
    {
      id: 'custom-fields',
      name: 'Custom Fields',
      description: 'Add custom metadata fields',
      category: 'core',
      enabled: true,
      minTier: 'enterprise',
      requiresBackend: true,
    },
    {
      id: 'advanced-search',
      name: 'Advanced Search',
      description: 'Full-text search with filters',
      category: 'core',
      enabled: true,
      minTier: 'enterprise',
      options: {
        enableRegex: true,
        enableDateFilter: true,
        enableUserFilter: true,
      },
    },
    {
      id: 'enterprise-analytics',
      name: 'Enterprise Analytics',
      description: 'Advanced analytics and reporting',
      category: 'analytics',
      enabled: true,
      minTier: 'enterprise',
      requiresBackend: true,
      options: {
        customReports: true,
        dataExport: true,
        predictiveAnalytics: true,
      },
    },
    {
      id: 'performance-optimization',
      name: 'Performance Optimization',
      description: 'Advanced caching and optimization',
      category: 'core',
      enabled: true,
      minTier: 'enterprise',
      options: {
        enableCaching: true,
        enableCDN: true,
        enableCompression: true,
      },
    },
    {
      id: 'dedicated-support',
      name: 'Dedicated Support',
      description: 'Priority support with SLA',
      category: 'admin',
      enabled: true,
      minTier: 'enterprise',
      options: {
        sla: '4hours',
        dedicatedAccount: true,
      },
    },
  ],
}

// ============================================================================
// Feature Preset Map
// ============================================================================

export const FEATURE_PRESETS = {
  basic: basicFeaturePreset,
  standard: standardFeaturePreset,
  advanced: advancedFeaturePreset,
  enterprise: enterpriseFeaturePreset,
} as const

export type FeaturePresetName = keyof typeof FEATURE_PRESETS

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Get a feature preset by name
 */
export function getFeaturePreset(name: FeaturePresetName): FeaturePreset | undefined {
  return FEATURE_PRESETS[name]
}

/**
 * List all available feature preset names
 */
export function listFeaturePresets(): FeaturePresetName[] {
  return Object.keys(FEATURE_PRESETS) as FeaturePresetName[]
}

/**
 * Enable a feature in a preset by ID
 */
export function enableFeature(preset: FeaturePreset, featureId: string): FeaturePreset {
  return {
    ...preset,
    features: preset.features.map((f) => (f.id === featureId ? { ...f, enabled: true } : f)),
  }
}

/**
 * Disable a feature in a preset by ID
 */
export function disableFeature(preset: FeaturePreset, featureId: string): FeaturePreset {
  return {
    ...preset,
    features: preset.features.map((f) => (f.id === featureId ? { ...f, enabled: false } : f)),
  }
}

/**
 * Add a feature to a preset
 */
export function addFeature(preset: FeaturePreset, feature: FeatureConfig): FeaturePreset {
  return {
    ...preset,
    features: [...preset.features, feature],
  }
}

/**
 * Remove a feature from a preset by ID
 */
export function removeFeature(preset: FeaturePreset, featureId: string): FeaturePreset {
  return {
    ...preset,
    features: preset.features.filter((f) => f.id !== featureId),
  }
}

/**
 * Get a specific feature from a preset
 */
export function getFeature(preset: FeaturePreset, featureId: string): FeatureConfig | undefined {
  return preset.features.find((f) => f.id === featureId)
}

/**
 * Update feature options in a preset
 */
export function updateFeatureOptions(
  preset: FeaturePreset,
  featureId: string,
  options: Record<string, any>
): FeaturePreset {
  return {
    ...preset,
    features: preset.features.map((f) =>
      f.id === featureId
        ? {
            ...f,
            options: {
              ...f.options,
              ...options,
            },
          }
        : f
    ),
  }
}

/**
 * Get all enabled features in a preset
 */
export function getEnabledFeatures(preset: FeaturePreset): FeatureConfig[] {
  return preset.features.filter((f) => f.enabled)
}

/**
 * Get all disabled features in a preset
 */
export function getDisabledFeatures(preset: FeaturePreset): FeatureConfig[] {
  return preset.features.filter((f) => !f.enabled)
}

/**
 * Get features by category
 */
export function getFeaturesByCategory(
  preset: FeaturePreset,
  category: FeatureConfig['category']
): FeatureConfig[] {
  return preset.features.filter((f) => f.category === category)
}

/**
 * Merge multiple feature presets
 */
export function mergeFeaturePresets(...presets: FeaturePreset[]): FeaturePreset {
  if (presets.length === 0) {
    return basicFeaturePreset
  }

  const mergedFeatures: Map<string, FeatureConfig> = new Map()

  for (const preset of presets) {
    for (const feature of preset.features) {
      mergedFeatures.set(feature.id, feature)
    }
  }

  // Use highest capacity and rate limits
  const maxCapacity = Math.max(...presets.map((p) => p.maxCapacity ?? 0))
  const rateLimits = {
    messagesPerMinute: Math.max(...presets.map((p) => p.rateLimits?.messagesPerMinute ?? 0)),
    requestsPerSecond: Math.max(...presets.map((p) => p.rateLimits?.requestsPerSecond ?? 0)),
  }

  return {
    name: 'Merged',
    description: 'Merged feature preset',
    tier: 'enterprise',
    features: Array.from(mergedFeatures.values()),
    maxCapacity,
    rateLimits,
  }
}

/**
 * Clone a feature preset with optional modifications
 */
export function cloneFeaturePreset(
  preset: FeaturePreset,
  overrides: Partial<FeaturePreset> = {}
): FeaturePreset {
  return {
    name: overrides.name ?? preset.name,
    description: overrides.description ?? preset.description,
    tier: overrides.tier ?? preset.tier,
    features: overrides.features ? [...overrides.features] : [...preset.features],
    maxCapacity: overrides.maxCapacity ?? preset.maxCapacity,
    rateLimits: overrides.rateLimits ? { ...overrides.rateLimits } : preset.rateLimits,
  }
}

/**
 * Create a custom feature preset
 */
export function createCustomFeaturePreset(options: CreateCustomFeaturePresetOptions): FeaturePreset {
  return {
    name: options.name,
    description: options.description || 'Custom feature preset',
    tier: options.tier || 'standard',
    features: options.features,
    maxCapacity: options.maxCapacity,
    rateLimits: options.rateLimits,
  }
}

/**
 * Get a summary of a feature preset
 */
export function getFeaturePresetSummary(preset: FeaturePreset): string {
  const enabledCount = getEnabledFeatures(preset).length
  const totalCount = preset.features.length
  return `${preset.name} (${preset.tier}): ${enabledCount}/${totalCount} features enabled`
}

/**
 * Check if preset requires backend support
 */
export function requiresBackendSupport(preset: FeaturePreset): boolean {
  return getEnabledFeatures(preset).some((f) => f.requiresBackend)
}

/**
 * Get all backend-required features
 */
export function getBackendRequiredFeatures(preset: FeaturePreset): FeatureConfig[] {
  return getEnabledFeatures(preset).filter((f) => f.requiresBackend)
}
