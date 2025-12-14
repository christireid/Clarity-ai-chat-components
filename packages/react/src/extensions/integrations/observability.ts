/**
 * Observability & Monitoring Extensions
 *
 * Comprehensive observability integrations for production chat applications.
 * Tracks performance, errors, and usage across your AI chat infrastructure.
 *
 * @packageDocumentation
 */

import { defineExtension } from '../builder'
import type { Extension } from '../types'

// ============================================
// Types
// ============================================

export interface DataDogConfig {
  clientToken: string
  applicationId: string
  site?: string
  service?: string
  env?: string
  version?: string
  sampleRate?: number
  trackInteractions?: boolean
  trackResources?: boolean
  trackLongTasks?: boolean
}

export interface OpenTelemetryConfig {
  serviceName: string
  endpoint: string
  headers?: Record<string, string>
  enableTracing?: boolean
  enableMetrics?: boolean
  enableLogs?: boolean
  sampleRate?: number
}

export interface NewRelicConfig {
  licenseKey: string
  accountId: string
  applicationId?: string
  trustKey?: string
}

export interface HoneycombConfig {
  apiKey: string
  dataset: string
  serviceName?: string
  sampleRate?: number
}

export interface GrafanaConfig {
  url: string
  apiKey?: string
  appName?: string
  environment?: string
}

export interface LogflareConfig {
  apiKey: string
  sourceToken: string
}

export interface AxiomConfig {
  token: string
  orgId: string
  dataset: string
}

export interface BetterStackConfig {
  sourceToken: string
  endpoint?: string
}

// ============================================
// Observability Interface
// ============================================

interface ObservabilityAdapter {
  // Tracing
  startSpan(name: string, attributes?: Record<string, unknown>): Span
  // Metrics
  recordMetric(name: string, value: number, tags?: Record<string, string>): void
  incrementCounter(name: string, tags?: Record<string, string>): void
  recordHistogram(
    name: string,
    value: number,
    tags?: Record<string, string>
  ): void
  // Logging
  log(level: LogLevel, message: string, context?: Record<string, unknown>): void
  // Errors
  captureError(error: Error, context?: Record<string, unknown>): void
  // User
  setUser(userId: string, traits?: Record<string, unknown>): void
}

interface Span {
  setAttributes(attributes: Record<string, unknown>): void
  setStatus(status: 'ok' | 'error', message?: string): void
  end(): void
}

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

// ============================================
// Extension Factories
// ============================================

/**
 * Create DataDog extension
 */
export function createDataDogExtension(
  config?: Partial<DataDogConfig>
): Extension<DataDogConfig> {
  return defineExtension<DataDogConfig>({
    id: 'observability-datadog',
    name: 'DataDog',
    category: 'observability',
    description: 'Monitoring, APM, and log management',
    author: 'Clarity Chat',
    tags: ['observability', 'monitoring', 'apm', 'logs', 'enterprise'],
    homepage: 'https://datadoghq.com',

    configSchema: {
      version: '1.0',
      required: ['clientToken', 'applicationId'],
      properties: {
        clientToken: {
          type: 'string',
          label: 'Client Token',
          envVar: 'DD_CLIENT_TOKEN',
        },
        applicationId: {
          type: 'string',
          label: 'Application ID',
          envVar: 'DD_APPLICATION_ID',
        },
        site: { type: 'string', label: 'Site', default: 'datadoghq.com' },
        service: { type: 'string', label: 'Service Name' },
        env: { type: 'string', label: 'Environment', default: 'production' },
        version: { type: 'string', label: 'Version' },
        sampleRate: {
          type: 'number',
          label: 'Sample Rate',
          default: 100,
          min: 0,
          max: 100,
        },
        trackInteractions: {
          type: 'boolean',
          label: 'Track Interactions',
          default: true,
        },
        trackResources: {
          type: 'boolean',
          label: 'Track Resources',
          default: true,
        },
        trackLongTasks: {
          type: 'boolean',
          label: 'Track Long Tasks',
          default: true,
        },
      },
    },

    defaultConfig: {
      site: 'datadoghq.com',
      env: 'production',
      sampleRate: 100,
      trackInteractions: true,
      trackResources: true,
      trackLongTasks: true,
      ...config,
    } as DataDogConfig,

    initialize: async (ctx) => {
      ctx.logger.info('DataDog extension initialized')

      // Would use @datadog/browser-rum and @datadog/browser-logs
      if (typeof window !== 'undefined') {
        // Initialize RUM
        const script = document.createElement('script')
        script.src = 'https://www.datadoghq-browser-agent.com/datadog-rum-v4.js'
        script.onload = () => {
          const DD_RUM = (
            window as {
              DD_RUM?: { init: (config: Record<string, unknown>) => void }
            }
          ).DD_RUM
          DD_RUM?.init({
            clientToken: ctx.config.clientToken,
            applicationId: ctx.config.applicationId,
            site: ctx.config.site,
            service: ctx.config.service,
            env: ctx.config.env,
            version: ctx.config.version,
            sampleRate: ctx.config.sampleRate,
            trackInteractions: ctx.config.trackInteractions,
            trackResources: ctx.config.trackResources,
            trackLongTasks: ctx.config.trackLongTasks,
          })
        }
        document.head.appendChild(script)
      }

      const adapter: ObservabilityAdapter = {
        startSpan(name, attributes) {
          const start = performance.now()
          ctx.logger.debug(`Starting span: ${name}`)
          return {
            setAttributes(attrs) {
              Object.assign(attributes || {}, attrs)
            },
            setStatus(status, message) {
              ctx.logger.debug(
                `Span ${name} status: ${status}${message ? ` - ${message}` : ''}`
              )
            },
            end() {
              const duration = performance.now() - start
              ctx.logger.debug(`Span ${name} ended: ${duration.toFixed(2)}ms`)
            },
          }
        },

        recordMetric(name, value, tags) {
          ctx.logger.debug(`Metric ${name}: ${value}`)
        },

        incrementCounter(name, tags) {
          ctx.logger.debug(`Counter ${name} incremented`)
        },

        recordHistogram(name, value, tags) {
          ctx.logger.debug(`Histogram ${name}: ${value}`)
        },

        log(level, message, context) {
          const DD_LOGS = (
            window as {
              DD_LOGS?: {
                logger: {
                  [key: string]: (
                    msg: string,
                    ctx?: Record<string, unknown>
                  ) => void
                }
              }
            }
          ).DD_LOGS
          if (typeof window !== 'undefined' && DD_LOGS) {
            DD_LOGS.logger[level](message, context)
          }
        },

        captureError(error, context) {
          const DD_RUM = (
            window as {
              DD_RUM?: {
                addError: (err: Error, ctx?: Record<string, unknown>) => void
              }
            }
          ).DD_RUM
          if (typeof window !== 'undefined' && DD_RUM) {
            DD_RUM.addError(error, context)
          }
        },

        setUser(userId, traits) {
          const DD_RUM = (
            window as {
              DD_RUM?: { setUser: (user: Record<string, unknown>) => void }
            }
          ).DD_RUM
          if (typeof window !== 'undefined' && DD_RUM) {
            DD_RUM.setUser({ id: userId, ...traits })
          }
        },
      }

      ctx.services.register('observability', adapter)
      ctx.events.emit('observability:initialized', { provider: 'datadog' })
    },
  })
}

/**
 * Create OpenTelemetry extension
 */
export function createOpenTelemetryExtension(
  config?: Partial<OpenTelemetryConfig>
): Extension<OpenTelemetryConfig> {
  return defineExtension<OpenTelemetryConfig>({
    id: 'observability-opentelemetry',
    name: 'OpenTelemetry',
    category: 'observability',
    description: 'Vendor-neutral observability framework',
    author: 'Clarity Chat',
    tags: [
      'observability',
      'tracing',
      'metrics',
      'open-source',
      'vendor-neutral',
    ],
    homepage: 'https://opentelemetry.io',

    configSchema: {
      version: '1.0',
      required: ['serviceName', 'endpoint'],
      properties: {
        serviceName: {
          type: 'string',
          label: 'Service Name',
          envVar: 'OTEL_SERVICE_NAME',
        },
        endpoint: {
          type: 'string',
          label: 'OTLP Endpoint',
          envVar: 'OTEL_EXPORTER_OTLP_ENDPOINT',
        },
        enableTracing: {
          type: 'boolean',
          label: 'Enable Tracing',
          default: true,
        },
        enableMetrics: {
          type: 'boolean',
          label: 'Enable Metrics',
          default: true,
        },
        enableLogs: { type: 'boolean', label: 'Enable Logs', default: true },
        sampleRate: {
          type: 'number',
          label: 'Sample Rate',
          default: 1,
          min: 0,
          max: 1,
        },
      },
    },

    defaultConfig: {
      enableTracing: true,
      enableMetrics: true,
      enableLogs: true,
      sampleRate: 1,
      ...config,
    } as OpenTelemetryConfig,

    initialize: async (ctx) => {
      ctx.logger.info('OpenTelemetry extension initialized')

      // Would use @opentelemetry/sdk-trace-web and related packages
      const adapter: ObservabilityAdapter = {
        startSpan(name, attributes) {
          const start = performance.now()
          const spanAttributes = { ...attributes }
          let spanStatus: 'ok' | 'error' = 'ok'

          return {
            setAttributes(attrs) {
              Object.assign(spanAttributes, attrs)
            },
            setStatus(status, message) {
              spanStatus = status
              if (message) spanAttributes['status.message'] = message
            },
            end() {
              const duration = performance.now() - start
              // Would send to OTLP endpoint
              ctx.logger.debug(
                `OTel span: ${name} [${spanStatus}] ${duration.toFixed(2)}ms`
              )
            },
          }
        },

        recordMetric(name, value, tags) {
          ctx.logger.debug(`OTel metric: ${name} = ${value}`)
        },

        incrementCounter(name, tags) {
          ctx.logger.debug(`OTel counter: ${name}++`)
        },

        recordHistogram(name, value, tags) {
          ctx.logger.debug(`OTel histogram: ${name} = ${value}`)
        },

        log(level, message, context) {
          ctx.logger.debug(`OTel log [${level}]: ${message}`)
        },

        captureError(error, context) {
          ctx.logger.error(`OTel error: ${error.message}`)
        },

        setUser(userId, traits) {
          ctx.state.set('user', { id: userId, ...traits })
        },
      }

      ctx.services.register('observability', adapter)
    },
  })
}

/**
 * Create New Relic extension
 */
export function createNewRelicExtension(
  config?: Partial<NewRelicConfig>
): Extension<NewRelicConfig> {
  return defineExtension<NewRelicConfig>({
    id: 'observability-newrelic',
    name: 'New Relic',
    category: 'observability',
    description: 'Full-stack observability platform',
    author: 'Clarity Chat',
    tags: ['observability', 'apm', 'monitoring', 'enterprise'],
    homepage: 'https://newrelic.com',

    configSchema: {
      version: '1.0',
      required: ['licenseKey', 'accountId'],
      properties: {
        licenseKey: {
          type: 'secret',
          label: 'License Key',
          envVar: 'NEW_RELIC_LICENSE_KEY',
        },
        accountId: {
          type: 'string',
          label: 'Account ID',
          envVar: 'NEW_RELIC_ACCOUNT_ID',
        },
        applicationId: { type: 'string', label: 'Application ID' },
        trustKey: { type: 'string', label: 'Trust Key' },
      },
    },

    defaultConfig: config as NewRelicConfig,

    initialize: async (ctx) => {
      ctx.logger.info('New Relic extension initialized')

      // Would use @newrelic/browser-agent
      const adapter: ObservabilityAdapter = {
        startSpan(name, attributes) {
          const start = performance.now()
          return {
            setAttributes() {},
            setStatus() {},
            end() {
              const duration = performance.now() - start
              ctx.logger.debug(
                `New Relic span: ${name} ${duration.toFixed(2)}ms`
              )
            },
          }
        },
        recordMetric(name, value, tags) {
          ctx.logger.debug(`New Relic metric: ${name} = ${value}`)
        },
        incrementCounter(name, tags) {},
        recordHistogram(name, value, tags) {},
        log(level, message, context) {},
        captureError(error, context) {
          const newrelic = (
            window as {
              newrelic?: {
                noticeError: (
                  err: Error,
                  attrs?: Record<string, unknown>
                ) => void
              }
            }
          ).newrelic
          if (typeof window !== 'undefined' && newrelic) {
            newrelic.noticeError(error, context)
          }
        },
        setUser(userId, traits) {
          const newrelic = (
            window as {
              newrelic?: {
                setCustomAttribute: (key: string, value: unknown) => void
              }
            }
          ).newrelic
          if (typeof window !== 'undefined' && newrelic) {
            newrelic.setCustomAttribute('userId', userId)
          }
        },
      }

      ctx.services.register('observability', adapter)
    },
  })
}

/**
 * Create Honeycomb extension
 */
export function createHoneycombExtension(
  config?: Partial<HoneycombConfig>
): Extension<HoneycombConfig> {
  return defineExtension<HoneycombConfig>({
    id: 'observability-honeycomb',
    name: 'Honeycomb',
    category: 'observability',
    description: 'Observability for distributed systems',
    author: 'Clarity Chat',
    tags: ['observability', 'tracing', 'debugging', 'distributed'],
    homepage: 'https://honeycomb.io',

    configSchema: {
      version: '1.0',
      required: ['apiKey', 'dataset'],
      properties: {
        apiKey: {
          type: 'secret',
          label: 'API Key',
          envVar: 'HONEYCOMB_API_KEY',
        },
        dataset: {
          type: 'string',
          label: 'Dataset',
          envVar: 'HONEYCOMB_DATASET',
        },
        serviceName: { type: 'string', label: 'Service Name' },
        sampleRate: { type: 'number', label: 'Sample Rate', default: 1 },
      },
    },

    defaultConfig: {
      sampleRate: 1,
      ...config,
    } as HoneycombConfig,

    initialize: async (ctx) => {
      ctx.logger.info('Honeycomb extension initialized')

      const adapter: ObservabilityAdapter = {
        startSpan(name, attributes) {
          const start = performance.now()
          const event = {
            name,
            ...attributes,
            'service.name': ctx.config.serviceName,
          }

          return {
            setAttributes(attrs) {
              Object.assign(event, attrs)
            },
            setStatus(status, message) {
              ;(event as Record<string, unknown>)['status'] = status
              if (message)
                (event as Record<string, unknown>)['status.message'] = message
            },
            end() {
              ;(event as Record<string, unknown>)['duration_ms'] =
                performance.now() - start
              // Would send to Honeycomb API
              ctx.logger.debug(`Honeycomb event: ${name}`)
            },
          }
        },
        recordMetric(name, value) {},
        incrementCounter(name) {},
        recordHistogram(name, value) {},
        log(level, message, context) {},
        captureError(error, context) {},
        setUser(userId) {},
      }

      ctx.services.register('observability', adapter)
    },
  })
}

/**
 * Create Grafana extension
 */
export function createGrafanaExtension(
  config?: Partial<GrafanaConfig>
): Extension<GrafanaConfig> {
  return defineExtension<GrafanaConfig>({
    id: 'observability-grafana',
    name: 'Grafana Faro',
    category: 'observability',
    description: 'Frontend observability with Grafana',
    author: 'Clarity Chat',
    tags: ['observability', 'frontend', 'monitoring', 'open-source'],
    homepage: 'https://grafana.com/oss/faro/',

    configSchema: {
      version: '1.0',
      required: ['url'],
      properties: {
        url: { type: 'string', label: 'Faro URL', envVar: 'GRAFANA_FARO_URL' },
        apiKey: { type: 'secret', label: 'API Key' },
        appName: { type: 'string', label: 'App Name' },
        environment: {
          type: 'string',
          label: 'Environment',
          default: 'production',
        },
      },
    },

    defaultConfig: {
      environment: 'production',
      ...config,
    } as GrafanaConfig,

    initialize: async (ctx) => {
      ctx.logger.info('Grafana Faro extension initialized')

      // Would use @grafana/faro-web-sdk
      const adapter: ObservabilityAdapter = {
        startSpan(name, attributes) {
          const start = performance.now()
          return {
            setAttributes() {},
            setStatus() {},
            end() {
              ctx.logger.debug(
                `Grafana span: ${name} ${(performance.now() - start).toFixed(2)}ms`
              )
            },
          }
        },
        recordMetric(name, value) {},
        incrementCounter(name) {},
        recordHistogram(name, value) {},
        log(level, message, context) {},
        captureError(error, context) {},
        setUser(userId) {},
      }

      ctx.services.register('observability', adapter)
    },
  })
}

/**
 * Create Logflare extension
 */
export function createLogflareExtension(
  config?: Partial<LogflareConfig>
): Extension<LogflareConfig> {
  return defineExtension<LogflareConfig>({
    id: 'observability-logflare',
    name: 'Logflare',
    category: 'observability',
    description: 'Log management for Elixir and JavaScript',
    author: 'Clarity Chat',
    tags: ['observability', 'logs', 'realtime'],
    homepage: 'https://logflare.app',

    configSchema: {
      version: '1.0',
      required: ['apiKey', 'sourceToken'],
      properties: {
        apiKey: {
          type: 'secret',
          label: 'API Key',
          envVar: 'LOGFLARE_API_KEY',
        },
        sourceToken: {
          type: 'string',
          label: 'Source Token',
          envVar: 'LOGFLARE_SOURCE_TOKEN',
        },
      },
    },

    defaultConfig: config as LogflareConfig,

    initialize: async (ctx) => {
      ctx.logger.info('Logflare extension initialized')

      const adapter: ObservabilityAdapter = {
        startSpan(name) {
          const start = performance.now()
          return {
            setAttributes() {},
            setStatus() {},
            end() {
              ctx.logger.debug(`Logflare span: ${name}`)
            },
          }
        },
        recordMetric() {},
        incrementCounter() {},
        recordHistogram() {},
        log(level, message, context) {
          fetch(
            `https://api.logflare.app/logs/json?source=${encodeURIComponent(ctx.config.sourceToken)}`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': ctx.config.apiKey,
              },
              body: JSON.stringify({
                message,
                metadata: { level, ...context },
              }),
            }
          ).catch((err) => {
            console.warn('Logflare logging failed:', err)
          })
        },
        captureError(error, context) {
          this.log('error', error.message, { ...context, stack: error.stack })
        },
        setUser() {},
      }

      ctx.services.register('observability', adapter)
    },
  })
}

/**
 * Create Axiom extension
 */
export function createAxiomExtension(
  config?: Partial<AxiomConfig>
): Extension<AxiomConfig> {
  return defineExtension<AxiomConfig>({
    id: 'observability-axiom',
    name: 'Axiom',
    category: 'observability',
    description: 'Log management and analytics',
    author: 'Clarity Chat',
    tags: ['observability', 'logs', 'analytics'],
    homepage: 'https://axiom.co',

    configSchema: {
      version: '1.0',
      required: ['token', 'orgId', 'dataset'],
      properties: {
        token: { type: 'secret', label: 'API Token', envVar: 'AXIOM_TOKEN' },
        orgId: { type: 'string', label: 'Org ID', envVar: 'AXIOM_ORG_ID' },
        dataset: { type: 'string', label: 'Dataset', envVar: 'AXIOM_DATASET' },
      },
    },

    defaultConfig: config as AxiomConfig,

    initialize: async (ctx) => {
      ctx.logger.info('Axiom extension initialized')

      const adapter: ObservabilityAdapter = {
        startSpan(name) {
          const start = performance.now()
          return {
            setAttributes() {},
            setStatus() {},
            end() {},
          }
        },
        recordMetric() {},
        incrementCounter() {},
        recordHistogram() {},
        log(level, message, context) {
          fetch(
            `https://api.axiom.co/v1/datasets/${encodeURIComponent(ctx.config.dataset)}/ingest`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${ctx.config.token}`,
              },
              body: JSON.stringify([
                { _time: new Date().toISOString(), level, message, ...context },
              ]),
            }
          ).catch((err) => {
            console.warn('Axiom logging failed:', err)
          })
        },
        captureError(error, context) {
          this.log('error', error.message, { ...context, stack: error.stack })
        },
        setUser() {},
      }

      ctx.services.register('observability', adapter)
    },
  })
}

/**
 * Create Better Stack extension
 */
export function createBetterStackExtension(
  config?: Partial<BetterStackConfig>
): Extension<BetterStackConfig> {
  return defineExtension<BetterStackConfig>({
    id: 'observability-betterstack',
    name: 'Better Stack',
    category: 'observability',
    description: 'Uptime monitoring and log management',
    author: 'Clarity Chat',
    tags: ['observability', 'logs', 'uptime', 'monitoring'],
    homepage: 'https://betterstack.com',

    configSchema: {
      version: '1.0',
      required: ['sourceToken'],
      properties: {
        sourceToken: {
          type: 'secret',
          label: 'Source Token',
          envVar: 'LOGTAIL_SOURCE_TOKEN',
        },
        endpoint: {
          type: 'string',
          label: 'Endpoint',
          default: 'https://in.logtail.com',
        },
      },
    },

    defaultConfig: {
      endpoint: 'https://in.logtail.com',
      ...config,
    } as BetterStackConfig,

    initialize: async (ctx) => {
      ctx.logger.info('Better Stack extension initialized')

      const adapter: ObservabilityAdapter = {
        startSpan(name) {
          return {
            setAttributes() {},
            setStatus() {},
            end() {},
          }
        },
        recordMetric() {},
        incrementCounter() {},
        recordHistogram() {},
        log(level, message, context) {
          fetch(ctx.config.endpoint || 'https://in.logtail.com', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${ctx.config.sourceToken}`,
            },
            body: JSON.stringify({
              dt: new Date().toISOString(),
              level,
              message,
              ...context,
            }),
          }).catch((err) => {
            console.warn('Better Stack logging failed:', err)
          })
        },
        captureError(error, context) {
          this.log('error', error.message, { ...context, stack: error.stack })
        },
        setUser() {},
      }

      ctx.services.register('observability', adapter)
    },
  })
}
