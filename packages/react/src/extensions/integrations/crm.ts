/**
 * CRM & Customer Support Extensions
 *
 * Integrate chat with customer support platforms.
 * Enable seamless handoff between AI and human agents.
 *
 * @packageDocumentation
 */

import { defineExtension } from '../builder'
import type { Extension } from '../types'

// ============================================
// Security Helpers
// ============================================

/**
 * Validates that an ID contains only safe characters (alphanumeric, hyphens, underscores)
 * Prevents script injection via malicious config values
 */
function validateSafeId(value: string, fieldName: string): string {
  if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
    throw new Error(
      `Invalid ${fieldName}: must contain only alphanumeric characters, hyphens, and underscores`
    )
  }
  return value
}

// ============================================
// Types
// ============================================

export interface IntercomConfig {
  appId: string
  apiKey?: string
  identityVerificationSecret?: string
}

export interface ZendeskConfig {
  subdomain: string
  apiToken?: string
  email?: string
  chatKey?: string
}

export interface HubSpotConfig {
  portalId: string
  accessToken?: string
  privateAppToken?: string
}

export interface FreshDeskConfig {
  domain: string
  apiKey: string
}

export interface CrispConfig {
  websiteId: string
  tokenId?: string
  tokenKey?: string
}

export interface DriftConfig {
  embedId: string
  apiToken?: string
}

// ============================================
// CRM Interface
// ============================================

interface CRMAdapter {
  identify(user: CRMUser): Promise<void>
  track(event: string, properties?: Record<string, unknown>): Promise<void>
  createTicket(ticket: SupportTicket): Promise<TicketResult>
  updateTicket(ticketId: string, updates: Partial<SupportTicket>): Promise<void>
  getTicket(ticketId: string): Promise<SupportTicket | null>
  sendMessage(conversationId: string, message: string): Promise<void>
  startConversation(userId: string, initialMessage: string): Promise<string>
}

interface CRMUser {
  id: string
  email?: string
  name?: string
  phone?: string
  company?: string
  customAttributes?: Record<string, unknown>
  createdAt?: Date
}

interface SupportTicket {
  id?: string
  subject: string
  description: string
  priority?: 'low' | 'normal' | 'high' | 'urgent'
  status?: 'new' | 'open' | 'pending' | 'resolved' | 'closed'
  requester?: {
    email: string
    name?: string
  }
  tags?: string[]
  customFields?: Record<string, unknown>
}

interface TicketResult {
  id: string
  url?: string
}

// ============================================
// Extension Factories
// ============================================

/**
 * Create Intercom extension
 */
export function createIntercomExtension(
  config?: Partial<IntercomConfig>
): Extension<IntercomConfig> {
  return defineExtension<IntercomConfig>({
    id: 'crm-intercom',
    name: 'Intercom',
    category: 'crm',
    description: 'Customer messaging platform with AI',
    author: 'Clarity Chat',
    tags: ['crm', 'chat', 'support', 'ai'],
    homepage: 'https://intercom.com',

    configSchema: {
      version: '1.0',
      required: ['appId'],
      properties: {
        appId: { type: 'string', label: 'App ID', envVar: 'INTERCOM_APP_ID' },
        apiKey: {
          type: 'secret',
          label: 'API Key',
          envVar: 'INTERCOM_API_KEY',
        },
        identityVerificationSecret: {
          type: 'secret',
          label: 'Identity Verification Secret',
        },
      },
    },

    defaultConfig: config as IntercomConfig,

    initialize: async (ctx) => {
      ctx.logger.info('Intercom extension initialized')

      // Validate appId to prevent script injection
      const safeAppId = validateSafeId(ctx.config.appId, 'Intercom App ID')

      // Load Intercom widget using safe DOM API
      if (typeof window !== 'undefined') {
        // Set up Intercom settings safely via window object
        const win = window as unknown as {
          intercomSettings?: { app_id: string }
        }
        win.intercomSettings = { app_id: safeAppId }

        // Load the Intercom SDK from their CDN
        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.async = true
        script.src = `https://widget.intercom.io/widget/${encodeURIComponent(safeAppId)}`
        document.head.appendChild(script)
      }

      // Type-safe helper for Intercom global
      const getIntercom = () =>
        typeof window !== 'undefined'
          ? (window as unknown as { Intercom?: (...args: unknown[]) => void })
              .Intercom
          : undefined

      const adapter: CRMAdapter = {
        async identify(user) {
          ctx.logger.debug('Identifying user in Intercom')
          getIntercom()?.('update', {
            user_id: user.id,
            email: user.email,
            name: user.name,
            phone: user.phone,
            company: user.company ? { name: user.company } : undefined,
            ...user.customAttributes,
          })
        },

        async track(event, properties) {
          ctx.logger.debug(`Tracking event: ${event}`)
          getIntercom()?.('trackEvent', event, properties)
        },

        async createTicket(ticket) {
          ctx.logger.debug('Creating ticket in Intercom')
          // Would use Intercom API
          return { id: `intercom_${Date.now()}` }
        },

        async updateTicket(ticketId, updates) {
          ctx.logger.debug(`Updating ticket: ${ticketId}`)
        },

        async getTicket(ticketId) {
          return null
        },

        async sendMessage(conversationId, message) {
          ctx.logger.debug(`Sending message to conversation: ${conversationId}`)
        },

        async startConversation(userId, initialMessage) {
          ctx.logger.debug('Starting Intercom conversation')
          getIntercom()?.('showNewMessage', initialMessage)
          return `conv_${Date.now()}`
        },
      }

      ctx.services.register('crm', adapter)
      ctx.events.emit('crm:initialized', { provider: 'intercom' })
    },

    dispose: async () => {
      const getIntercom = () =>
        typeof window !== 'undefined'
          ? (window as unknown as { Intercom?: (...args: unknown[]) => void })
              .Intercom
          : undefined
      getIntercom()?.('shutdown')
    },
  })
}

/**
 * Create Zendesk extension
 */
export function createZendeskExtension(
  config?: Partial<ZendeskConfig>
): Extension<ZendeskConfig> {
  return defineExtension<ZendeskConfig>({
    id: 'crm-zendesk',
    name: 'Zendesk',
    category: 'crm',
    description: 'Customer service and support platform',
    author: 'Clarity Chat',
    tags: ['crm', 'support', 'ticketing', 'enterprise'],
    homepage: 'https://zendesk.com',

    configSchema: {
      version: '1.0',
      required: ['subdomain'],
      properties: {
        subdomain: {
          type: 'string',
          label: 'Subdomain',
          envVar: 'ZENDESK_SUBDOMAIN',
        },
        apiToken: {
          type: 'secret',
          label: 'API Token',
          envVar: 'ZENDESK_API_TOKEN',
        },
        email: { type: 'string', label: 'Email' },
        chatKey: { type: 'string', label: 'Chat Key' },
      },
    },

    defaultConfig: config as ZendeskConfig,

    initialize: async (ctx) => {
      ctx.logger.info('Zendesk extension initialized')

      // Load Zendesk Chat widget if chatKey provided
      if (typeof window !== 'undefined' && ctx.config.chatKey) {
        // Validate chatKey to prevent script injection
        const safeChatKey = validateSafeId(
          ctx.config.chatKey,
          'Zendesk Chat Key'
        )
        const script = document.createElement('script')
        script.id = 'ze-snippet'
        script.src = `https://static.zdassets.com/ekr/snippet.js?key=${encodeURIComponent(safeChatKey)}`
        document.head.appendChild(script)
      }

      const adapter: CRMAdapter = {
        async identify(user) {
          ctx.logger.debug('Identifying user in Zendesk')
        },

        async track(event, properties) {
          ctx.logger.debug(`Tracking event: ${event}`)
        },

        async createTicket(ticket) {
          ctx.logger.debug('Creating ticket in Zendesk')
          const response = await fetch(
            `https://${ctx.config.subdomain}.zendesk.com/api/v2/tickets.json`,
            {
              method: 'POST',
              headers: {
                Authorization: `Basic ${btoa(`${ctx.config.email}/token:${ctx.config.apiToken}`)}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                ticket: {
                  subject: ticket.subject,
                  description: ticket.description,
                  priority: ticket.priority,
                  requester: ticket.requester,
                  tags: ticket.tags,
                  custom_fields: ticket.customFields
                    ? Object.entries(ticket.customFields).map(
                        ([id, value]) => ({ id, value })
                      )
                    : undefined,
                },
              }),
            }
          )
          const data = await response.json()
          return {
            id: String(data.ticket?.id),
            url: `https://${ctx.config.subdomain}.zendesk.com/agent/tickets/${data.ticket?.id}`,
          }
        },

        async updateTicket(ticketId, updates) {
          ctx.logger.debug(`Updating ticket: ${ticketId}`)
          await fetch(
            `https://${ctx.config.subdomain}.zendesk.com/api/v2/tickets/${ticketId}.json`,
            {
              method: 'PUT',
              headers: {
                Authorization: `Basic ${btoa(`${ctx.config.email}/token:${ctx.config.apiToken}`)}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ ticket: updates }),
            }
          )
        },

        async getTicket(ticketId) {
          const response = await fetch(
            `https://${ctx.config.subdomain}.zendesk.com/api/v2/tickets/${ticketId}.json`,
            {
              headers: {
                Authorization: `Basic ${btoa(`${ctx.config.email}/token:${ctx.config.apiToken}`)}`,
              },
            }
          )
          const data = await response.json()
          return data.ticket
            ? {
                id: String(data.ticket.id),
                subject: data.ticket.subject,
                description: data.ticket.description,
                status: data.ticket.status,
                priority: data.ticket.priority,
              }
            : null
        },

        async sendMessage(conversationId, message) {
          ctx.logger.debug(`Sending message to conversation: ${conversationId}`)
        },

        async startConversation(userId, initialMessage) {
          return `conv_${Date.now()}`
        },
      }

      ctx.services.register('crm', adapter)
    },
  })
}

/**
 * Create HubSpot extension
 */
export function createHubSpotExtension(
  config?: Partial<HubSpotConfig>
): Extension<HubSpotConfig> {
  return defineExtension<HubSpotConfig>({
    id: 'crm-hubspot',
    name: 'HubSpot',
    category: 'crm',
    description: 'CRM, marketing, and sales platform',
    author: 'Clarity Chat',
    tags: ['crm', 'marketing', 'sales', 'enterprise'],
    homepage: 'https://hubspot.com',

    configSchema: {
      version: '1.0',
      required: ['portalId'],
      properties: {
        portalId: {
          type: 'string',
          label: 'Portal ID',
          envVar: 'HUBSPOT_PORTAL_ID',
        },
        accessToken: {
          type: 'secret',
          label: 'Access Token',
          envVar: 'HUBSPOT_ACCESS_TOKEN',
        },
        privateAppToken: { type: 'secret', label: 'Private App Token' },
      },
    },

    defaultConfig: config as HubSpotConfig,

    initialize: async (ctx) => {
      ctx.logger.info('HubSpot extension initialized')

      // Validate portalId to prevent script injection
      const safePortalId = validateSafeId(
        ctx.config.portalId,
        'HubSpot Portal ID'
      )

      // Load HubSpot tracking code
      if (typeof window !== 'undefined') {
        const script = document.createElement('script')
        script.id = 'hs-script-loader'
        script.src = `//js.hs-scripts.com/${encodeURIComponent(safePortalId)}.js`
        script.async = true
        script.defer = true
        document.head.appendChild(script)
      }

      const token = ctx.config.privateAppToken || ctx.config.accessToken

      const adapter: CRMAdapter = {
        async identify(user) {
          ctx.logger.debug('Identifying user in HubSpot')
          if (typeof window !== 'undefined') {
            const _hsq = ((window as { _hsq?: unknown[][] })._hsq =
              (window as { _hsq?: unknown[][] })._hsq || [])
            _hsq.push([
              'identify',
              { email: user.email, ...user.customAttributes },
            ])
          }
        },

        async track(event, properties) {
          ctx.logger.debug(`Tracking event: ${event}`)
          if (typeof window !== 'undefined') {
            const _hsq = ((window as { _hsq?: unknown[][] })._hsq =
              (window as { _hsq?: unknown[][] })._hsq || [])
            _hsq.push([
              'trackCustomBehavioralEvent',
              { name: event, properties },
            ])
          }
        },

        async createTicket(ticket) {
          ctx.logger.debug('Creating ticket in HubSpot')
          const response = await fetch(
            'https://api.hubapi.com/crm/v3/objects/tickets',
            {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                properties: {
                  subject: ticket.subject,
                  content: ticket.description,
                  hs_ticket_priority: ticket.priority?.toUpperCase(),
                },
              }),
            }
          )
          const data = await response.json()
          return { id: data.id }
        },

        async updateTicket(ticketId, updates) {
          ctx.logger.debug(`Updating ticket: ${ticketId}`)
        },

        async getTicket(ticketId) {
          return null
        },

        async sendMessage(conversationId, message) {},

        async startConversation(userId, initialMessage) {
          return `conv_${Date.now()}`
        },
      }

      ctx.services.register('crm', adapter)
    },
  })
}

/**
 * Create Freshdesk extension
 */
export function createFreshDeskExtension(
  config?: Partial<FreshDeskConfig>
): Extension<FreshDeskConfig> {
  return defineExtension<FreshDeskConfig>({
    id: 'crm-freshdesk',
    name: 'Freshdesk',
    category: 'crm',
    description: 'Customer support software',
    author: 'Clarity Chat',
    tags: ['crm', 'support', 'ticketing'],
    homepage: 'https://freshdesk.com',

    configSchema: {
      version: '1.0',
      required: ['domain', 'apiKey'],
      properties: {
        domain: { type: 'string', label: 'Domain', envVar: 'FRESHDESK_DOMAIN' },
        apiKey: {
          type: 'secret',
          label: 'API Key',
          envVar: 'FRESHDESK_API_KEY',
        },
      },
    },

    defaultConfig: config as FreshDeskConfig,

    initialize: async (ctx) => {
      ctx.logger.info('Freshdesk extension initialized')

      const adapter: CRMAdapter = {
        async identify(user) {},
        async track(event, properties) {},

        async createTicket(ticket) {
          ctx.logger.debug('Creating ticket in Freshdesk')
          const response = await fetch(
            `https://${ctx.config.domain}.freshdesk.com/api/v2/tickets`,
            {
              method: 'POST',
              headers: {
                Authorization: `Basic ${btoa(`${ctx.config.apiKey}:X`)}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                subject: ticket.subject,
                description: ticket.description,
                priority: { low: 1, normal: 2, high: 3, urgent: 4 }[
                  ticket.priority || 'normal'
                ],
                email: ticket.requester?.email,
                tags: ticket.tags,
              }),
            }
          )
          const data = await response.json()
          return {
            id: String(data.id),
            url: `https://${ctx.config.domain}.freshdesk.com/a/tickets/${data.id}`,
          }
        },

        async updateTicket(ticketId, updates) {},
        async getTicket(ticketId) {
          return null
        },
        async sendMessage(conversationId, message) {},
        async startConversation(userId, initialMessage) {
          return `conv_${Date.now()}`
        },
      }

      ctx.services.register('crm', adapter)
    },
  })
}

/**
 * Create Crisp extension
 */
export function createCrispExtension(
  config?: Partial<CrispConfig>
): Extension<CrispConfig> {
  return defineExtension<CrispConfig>({
    id: 'crm-crisp',
    name: 'Crisp',
    category: 'crm',
    description: 'Customer messaging platform',
    author: 'Clarity Chat',
    tags: ['crm', 'chat', 'messaging'],
    homepage: 'https://crisp.chat',

    configSchema: {
      version: '1.0',
      required: ['websiteId'],
      properties: {
        websiteId: {
          type: 'string',
          label: 'Website ID',
          envVar: 'CRISP_WEBSITE_ID',
        },
        tokenId: { type: 'string', label: 'Token ID' },
        tokenKey: { type: 'secret', label: 'Token Key' },
      },
    },

    defaultConfig: config as CrispConfig,

    initialize: async (ctx) => {
      ctx.logger.info('Crisp extension initialized')

      // Type-safe helper for Crisp global
      type CrispWindow = { $crisp?: unknown[]; CRISP_WEBSITE_ID?: string }
      const getCrisp = () =>
        typeof window !== 'undefined'
          ? (window as unknown as CrispWindow).$crisp
          : undefined

      // Load Crisp widget
      if (typeof window !== 'undefined') {
        const win = window as unknown as CrispWindow
        win.$crisp = []
        win.CRISP_WEBSITE_ID = ctx.config.websiteId

        const script = document.createElement('script')
        script.src = 'https://client.crisp.chat/l.js'
        script.async = true
        document.head.appendChild(script)
      }

      const adapter: CRMAdapter = {
        async identify(user) {
          const $crisp = getCrisp()
          if ($crisp) {
            $crisp.push(['set', 'user:email', [user.email]])
            if (user.name) $crisp.push(['set', 'user:nickname', [user.name]])
            if (user.phone) $crisp.push(['set', 'user:phone', [user.phone]])
          }
        },
        async track(event, properties) {
          getCrisp()?.push(['set', 'session:event', [[event, properties]]])
        },
        async createTicket(ticket) {
          return { id: `crisp_${Date.now()}` }
        },
        async updateTicket() {},
        async getTicket() {
          return null
        },
        async sendMessage(conversationId, message) {
          getCrisp()?.push(['do', 'message:send', ['text', message]])
        },
        async startConversation(userId, initialMessage) {
          const $crisp = getCrisp()
          if ($crisp) {
            $crisp.push(['do', 'chat:open'])
            $crisp.push(['do', 'message:send', ['text', initialMessage]])
          }
          return `conv_${Date.now()}`
        },
      }

      ctx.services.register('crm', adapter)
    },
  })
}

/**
 * Create Drift extension
 */
export function createDriftExtension(
  config?: Partial<DriftConfig>
): Extension<DriftConfig> {
  return defineExtension<DriftConfig>({
    id: 'crm-drift',
    name: 'Drift',
    category: 'crm',
    description: 'Conversational marketing platform',
    author: 'Clarity Chat',
    tags: ['crm', 'chat', 'marketing', 'sales'],
    homepage: 'https://drift.com',

    configSchema: {
      version: '1.0',
      required: ['embedId'],
      properties: {
        embedId: {
          type: 'string',
          label: 'Embed ID',
          envVar: 'DRIFT_EMBED_ID',
        },
        apiToken: { type: 'secret', label: 'API Token' },
      },
    },

    defaultConfig: config as DriftConfig,

    initialize: async (ctx) => {
      ctx.logger.info('Drift extension initialized')

      // Validate embedId to prevent script injection
      const safeEmbedId = validateSafeId(ctx.config.embedId, 'Drift Embed ID')

      // Load Drift widget using safe DOM API
      if (typeof window !== 'undefined') {
        // Initialize Drift API stub safely
        type DriftStub = unknown[] & {
          invoked?: boolean
          methods?: string[]
          factory?: (e: string) => (...args: unknown[]) => DriftStub
          load?: (embedId: string) => void
          SNIPPET_VERSION?: string
          [key: string]: unknown
        }
        const win = window as unknown as {
          driftt?: DriftStub
          drift?: DriftStub
        }

        const t: DriftStub = (win.driftt = win.drift = win.driftt || [])
        if (!t.load) {
          if (t.invoked) {
            logger.error('Drift snippet included twice.')
          } else {
            t.invoked = true
            t.methods = [
              'identify',
              'config',
              'track',
              'reset',
              'debug',
              'show',
              'ping',
              'page',
              'hide',
              'off',
              'on',
            ]
            t.factory = function (e: string) {
              return function (...args: unknown[]) {
                args.unshift(e)
                t.push(args)
                return t
              }
            }
            t.methods.forEach(function (e) {
              t[e] = t.factory?.(e)
            })
            t.load = function (embedId: string) {
              const e = 3e5
              const n = Math.ceil(Date.now() / e) * e
              const o = document.createElement('script')
              o.type = 'text/javascript'
              o.async = true
              o.crossOrigin = 'anonymous'
              o.src = `https://js.driftt.com/include/${n}/${encodeURIComponent(embedId)}.js`
              const i = document.getElementsByTagName('script')[0]
              i.parentNode?.insertBefore(o, i)
            }
          }
        }
        t.SNIPPET_VERSION = '0.3.1'
        t.load?.(safeEmbedId)
      }

      // Type-safe helper for Drift global
      type DriftAPI = {
        identify: (id: string, attrs: Record<string, unknown>) => void
        track: (event: string, props?: Record<string, unknown>) => void
      }
      const getDrift = () =>
        typeof window !== 'undefined'
          ? (window as unknown as { drift?: DriftAPI }).drift
          : undefined

      const adapter: CRMAdapter = {
        async identify(user) {
          getDrift()?.identify(user.id, {
            email: user.email,
            name: user.name,
            ...user.customAttributes,
          })
        },
        async track(event, properties) {
          getDrift()?.track(event, properties)
        },
        async createTicket(ticket) {
          return { id: `drift_${Date.now()}` }
        },
        async updateTicket() {},
        async getTicket() {
          return null
        },
        async sendMessage() {},
        async startConversation(userId, initialMessage) {
          return `conv_${Date.now()}`
        },
      }

      ctx.services.register('crm', adapter)
    },
  })
}
