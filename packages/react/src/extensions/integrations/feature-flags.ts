/**
 * Feature Flags & Experimentation Extensions
 *
 * A/B testing, feature flags, and gradual rollouts for chat features.
 * Safely test new AI models, prompts, and UI variations.
 *
 * @packageDocumentation
 */

import { defineExtension } from '../builder'
import type { Extension } from '../types'

// ============================================
// Types
// ============================================

export interface LaunchDarklyConfig {
  clientSideId: string
  sdkKey?: string
  streamUri?: string
  eventsUri?: string
}

export interface PostHogFlagsConfig {
  apiKey: string
  host?: string
  personalApiKey?: string
}

export interface UnleashConfig {
  url: string
  clientKey: string
  appName: string
  refreshInterval?: number
}

export interface FlagsmithConfig {
  environmentId: string
  apiUrl?: string
  enableAnalytics?: boolean
}

export interface GrowthBookConfig {
  apiHost: string
  clientKey: string
  enableDevMode?: boolean
  trackingCallback?: (experiment: string, result: string) => void
}

// ============================================
// Feature Flags Interface
// ============================================

interface FeatureFlagsAdapter {
  initialize(user?: FlagUser): Promise<void>
  identify(user: FlagUser): Promise<void>
  isEnabled(flagKey: string, defaultValue?: boolean): boolean
  getVariation<T>(flagKey: string, defaultValue: T): T
  getAllFlags(): Record<string, unknown>
  track(eventKey: string, data?: Record<string, unknown>): void
  onFlagsChanged(callback: () => void): () => void
}

interface FlagUser {
  key: string
  email?: string
  name?: string
  anonymous?: boolean
  custom?: Record<string, unknown>
}

// ============================================
// Extension Factories
// ============================================

/**
 * Create LaunchDarkly extension
 */
export function createLaunchDarklyExtension(
  config?: Partial<LaunchDarklyConfig>
): Extension<LaunchDarklyConfig> {
  return defineExtension<LaunchDarklyConfig>({
    id: 'flags-launchdarkly',
    name: 'LaunchDarkly',
    category: 'utility',
    description: 'Enterprise feature management platform',
    author: 'Clarity Chat',
    tags: ['feature-flags', 'experimentation', 'enterprise'],
    homepage: 'https://launchdarkly.com',

    configSchema: {
      version: '1.0',
      required: ['clientSideId'],
      properties: {
        clientSideId: {
          type: 'string',
          label: 'Client-Side ID',
          envVar: 'LAUNCHDARKLY_CLIENT_SIDE_ID',
        },
        sdkKey: {
          type: 'secret',
          label: 'SDK Key',
          envVar: 'LAUNCHDARKLY_SDK_KEY',
        },
        streamUri: { type: 'string', label: 'Stream URI' },
        eventsUri: { type: 'string', label: 'Events URI' },
      },
    },

    defaultConfig: config as LaunchDarklyConfig,

    initialize: async (ctx) => {
      ctx.console.info('LaunchDarkly extension initialized')

      let flags: Record<string, unknown> = {}
      const changeCallbacks = new Set<() => void>()

      // Would use launchdarkly-js-client-sdk
      const adapter: FeatureFlagsAdapter = {
        async initialize(user) {
          ctx.console.log('Initializing LaunchDarkly client')
          if (user) {
            await this.identify(user)
          }
        },

        async identify(user) {
          ctx.console.log(`Identifying user: ${user.key}`)
          // Would call ldClient.identify()
          changeCallbacks.forEach((cb) => cb())
        },

        isEnabled(flagKey, defaultValue = false) {
          const value = flags[flagKey]
          return typeof value === 'boolean' ? value : defaultValue
        },

        getVariation<T>(flagKey: string, defaultValue: T): T {
          const value = flags[flagKey]
          return value !== undefined ? (value as T) : defaultValue
        },

        getAllFlags() {
          return { ...flags }
        },

        track(eventKey, data) {
          ctx.console.log(`Tracking event: ${eventKey}`)
          // Would call ldClient.track()
        },

        onFlagsChanged(callback) {
          changeCallbacks.add(callback)
          return () => changeCallbacks.delete(callback)
        },
      }

      ctx.services.register('featureFlags', adapter)
      ctx.events.emit('featureFlags:initialized', { provider: 'launchdarkly' })
    },
  })
}

/**
 * Create PostHog feature flags extension
 */
export function createPostHogFlagsExtension(
  config?: Partial<PostHogFlagsConfig>
): Extension<PostHogFlagsConfig> {
  return defineExtension<PostHogFlagsConfig>({
    id: 'flags-posthog',
    name: 'PostHog Feature Flags',
    category: 'utility',
    description: 'Feature flags with PostHog analytics',
    author: 'Clarity Chat',
    tags: ['feature-flags', 'analytics', 'open-source'],
    homepage: 'https://posthog.com/feature-flags',

    configSchema: {
      version: '1.0',
      required: ['apiKey'],
      properties: {
        apiKey: {
          type: 'string',
          label: 'API Key',
          envVar: 'NEXT_PUBLIC_POSTHOG_KEY',
        },
        host: {
          type: 'string',
          label: 'Host',
          default: 'https://app.posthog.com',
        },
        personalApiKey: { type: 'secret', label: 'Personal API Key' },
      },
    },

    defaultConfig: {
      host: 'https://app.posthog.com',
      ...config,
    } as PostHogFlagsConfig,

    initialize: async (ctx) => {
      ctx.console.info('PostHog Feature Flags extension initialized')

      // PostHog instance with type-safe API subset
      interface PostHogAPI {
        identify: (id: string, props?: Record<string, unknown>) => void
        isFeatureEnabled: (key: string) => boolean | undefined
        getFeatureFlag: (key: string) => unknown
        getAllFlags: () => Record<string, unknown>
        capture: (event: string, props?: Record<string, unknown>) => void
        onFeatureFlags: (callback: () => void) => void
      }
      let posthog: PostHogAPI | null = null

      // Load PostHog
      if (typeof window !== 'undefined') {
        try {
          const module = await import('posthog-js')
          const ph = module.default as unknown as PostHogAPI
          posthog = ph
          posthog.identify('', {}) // Initialize with anonymous user
        } catch {
          ctx.console.warn('PostHog not available')
        }
      }

      const adapter: FeatureFlagsAdapter = {
        async initialize(user) {
          if (posthog && user) {
            posthog.identify(user.key, {
              email: user.email,
              name: user.name,
              ...user.custom,
            })
          }
        },

        async identify(user) {
          if (posthog) {
            posthog.identify(user.key, {
              email: user.email,
              name: user.name,
              ...user.custom,
            })
          }
        },

        isEnabled(flagKey, defaultValue = false) {
          if (!posthog) return defaultValue
          const result = posthog.isFeatureEnabled(flagKey)
          return result !== undefined ? result : defaultValue
        },

        getVariation<T>(flagKey: string, defaultValue: T): T {
          if (!posthog) return defaultValue
          const value = posthog.getFeatureFlag(flagKey)
          return value !== undefined ? (value as T) : defaultValue
        },

        getAllFlags() {
          return posthog?.getAllFlags() || {}
        },

        track(eventKey, data) {
          posthog?.capture(eventKey, data)
        },

        onFlagsChanged(callback) {
          posthog?.onFeatureFlags(callback)
          return () => {} // PostHog doesn't provide unsubscribe
        },
      }

      ctx.services.register('featureFlags', adapter)
    },
  })
}

/**
 * Create Unleash extension
 */
export function createUnleashExtension(
  config?: Partial<UnleashConfig>
): Extension<UnleashConfig> {
  return defineExtension<UnleashConfig>({
    id: 'flags-unleash',
    name: 'Unleash',
    category: 'utility',
    description: 'Open-source feature management',
    author: 'Clarity Chat',
    tags: ['feature-flags', 'open-source', 'self-hosted'],
    homepage: 'https://unleash.io',

    configSchema: {
      version: '1.0',
      required: ['url', 'clientKey', 'appName'],
      properties: {
        url: { type: 'string', label: 'Unleash URL', envVar: 'UNLEASH_URL' },
        clientKey: {
          type: 'secret',
          label: 'Client Key',
          envVar: 'UNLEASH_CLIENT_KEY',
        },
        appName: { type: 'string', label: 'App Name' },
        refreshInterval: {
          type: 'number',
          label: 'Refresh Interval (ms)',
          default: 15000,
        },
      },
    },

    defaultConfig: {
      refreshInterval: 15000,
      ...config,
    } as UnleashConfig,

    initialize: async (ctx) => {
      ctx.console.info('Unleash extension initialized')

      let flags: Record<string, unknown> = {}
      const changeCallbacks = new Set<() => void>()

      // Would use @unleash/proxy-client-react
      const adapter: FeatureFlagsAdapter = {
        async initialize(user) {
          ctx.console.log('Initializing Unleash client')
          // Would connect to Unleash proxy
        },

        async identify(user) {
          ctx.console.log(`Identifying user: ${user.key}`)
          // Would update context
          changeCallbacks.forEach((cb) => cb())
        },

        isEnabled(flagKey, defaultValue = false) {
          const value = flags[flagKey]
          return typeof value === 'boolean' ? value : defaultValue
        },

        getVariation<T>(flagKey: string, defaultValue: T): T {
          const value = flags[flagKey]
          return value !== undefined ? (value as T) : defaultValue
        },

        getAllFlags() {
          return { ...flags }
        },

        track(eventKey, data) {
          ctx.console.log(`Tracking event: ${eventKey}`)
        },

        onFlagsChanged(callback) {
          changeCallbacks.add(callback)
          return () => changeCallbacks.delete(callback)
        },
      }

      ctx.services.register('featureFlags', adapter)
    },
  })
}

/**
 * Create Flagsmith extension
 */
export function createFlagsmithExtension(
  config?: Partial<FlagsmithConfig>
): Extension<FlagsmithConfig> {
  return defineExtension<FlagsmithConfig>({
    id: 'flags-flagsmith',
    name: 'Flagsmith',
    category: 'utility',
    description: 'Open-source feature flag and remote config',
    author: 'Clarity Chat',
    tags: ['feature-flags', 'remote-config', 'open-source'],
    homepage: 'https://flagsmith.com',

    configSchema: {
      version: '1.0',
      required: ['environmentId'],
      properties: {
        environmentId: {
          type: 'string',
          label: 'Environment ID',
          envVar: 'FLAGSMITH_ENVIRONMENT_ID',
        },
        apiUrl: {
          type: 'string',
          label: 'API URL',
          default: 'https://edge.api.flagsmith.com/api/v1/',
        },
        enableAnalytics: {
          type: 'boolean',
          label: 'Enable Analytics',
          default: true,
        },
      },
    },

    defaultConfig: {
      apiUrl: 'https://edge.api.flagsmith.com/api/v1/',
      enableAnalytics: true,
      ...config,
    } as FlagsmithConfig,

    initialize: async (ctx) => {
      ctx.console.info('Flagsmith extension initialized')

      let flags: Record<string, { enabled: boolean; value?: unknown }> = {}
      const changeCallbacks = new Set<() => void>()

      // Fetch flags
      const fetchFlags = async (userId?: string) => {
        const url = new URL(`${ctx.config.apiUrl}flags/`)
        if (userId) url.searchParams.set('identity', userId)

        const response = await fetch(url.toString(), {
          headers: { 'X-Environment-Key': ctx.config.environmentId },
        })
        const data = await response.json()
        flags = {}
        data.forEach(
          (flag: {
            feature: { name: string }
            enabled: boolean
            feature_state_value: unknown
          }) => {
            flags[flag.feature.name] = {
              enabled: flag.enabled,
              value: flag.feature_state_value,
            }
          }
        )
        changeCallbacks.forEach((cb) => cb())
      }

      const adapter: FeatureFlagsAdapter = {
        async initialize(user) {
          await fetchFlags(user?.key)
        },

        async identify(user) {
          await fetchFlags(user.key)
        },

        isEnabled(flagKey, defaultValue = false) {
          return flags[flagKey]?.enabled ?? defaultValue
        },

        getVariation<T>(flagKey: string, defaultValue: T): T {
          const flag = flags[flagKey]
          if (!flag) return defaultValue
          return (flag.value as T) ?? defaultValue
        },

        getAllFlags() {
          const result: Record<string, unknown> = {}
          Object.entries(flags).forEach(([key, val]) => {
            result[key] = val.enabled ? (val.value ?? true) : false
          })
          return result
        },

        track(eventKey, data) {
          if (!ctx.config.enableAnalytics) return
          fetch(`${ctx.config.apiUrl}analytics/flags/`, {
            method: 'POST',
            headers: {
              'X-Environment-Key': ctx.config.environmentId,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ [eventKey]: 1 }),
          }).catch(() => {})
        },

        onFlagsChanged(callback) {
          changeCallbacks.add(callback)
          return () => changeCallbacks.delete(callback)
        },
      }

      ctx.services.register('featureFlags', adapter)
    },
  })
}

/**
 * Create GrowthBook extension
 */
export function createGrowthBookExtension(
  config?: Partial<GrowthBookConfig>
): Extension<GrowthBookConfig> {
  return defineExtension<GrowthBookConfig>({
    id: 'flags-growthbook',
    name: 'GrowthBook',
    category: 'utility',
    description: 'Open-source feature flags and A/B testing',
    author: 'Clarity Chat',
    tags: ['feature-flags', 'ab-testing', 'open-source'],
    homepage: 'https://growthbook.io',

    configSchema: {
      version: '1.0',
      required: ['apiHost', 'clientKey'],
      properties: {
        apiHost: {
          type: 'string',
          label: 'API Host',
          envVar: 'GROWTHBOOK_API_HOST',
        },
        clientKey: {
          type: 'string',
          label: 'Client Key',
          envVar: 'GROWTHBOOK_CLIENT_KEY',
        },
        enableDevMode: { type: 'boolean', label: 'Dev Mode', default: false },
      },
    },

    defaultConfig: {
      enableDevMode: false,
      ...config,
    } as GrowthBookConfig,

    initialize: async (ctx) => {
      ctx.console.info('GrowthBook extension initialized')

      let features: Record<
        string,
        { defaultValue?: unknown; rules?: unknown[] }
      > = {}
      const changeCallbacks = new Set<() => void>()

      // Fetch features
      const response = await fetch(
        `${ctx.config.apiHost}/api/features/${ctx.config.clientKey}`
      )
      const data = await response.json()
      features = data.features || {}

      const adapter: FeatureFlagsAdapter = {
        async initialize() {
          ctx.console.log('GrowthBook initialized')
        },

        async identify(user) {
          ctx.console.log(`GrowthBook identify: ${user.key}`)
          changeCallbacks.forEach((cb) => cb())
        },

        isEnabled(flagKey, defaultValue = false) {
          const feature = features[flagKey]
          if (!feature) return defaultValue
          // Simplified - real implementation would evaluate rules
          return feature.defaultValue !== undefined
            ? Boolean(feature.defaultValue)
            : defaultValue
        },

        getVariation<T>(flagKey: string, defaultValue: T): T {
          const feature = features[flagKey]
          if (!feature) return defaultValue
          return (feature.defaultValue as T) ?? defaultValue
        },

        getAllFlags() {
          const result: Record<string, unknown> = {}
          Object.entries(features).forEach(([key, val]) => {
            result[key] = val.defaultValue
          })
          return result
        },

        track(eventKey, data) {
          ctx.config.trackingCallback?.(eventKey, JSON.stringify(data))
        },

        onFlagsChanged(callback) {
          changeCallbacks.add(callback)
          return () => changeCallbacks.delete(callback)
        },
      }

      ctx.services.register('featureFlags', adapter)
    },
  })
}
