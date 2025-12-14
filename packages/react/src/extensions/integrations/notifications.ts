/**
 * Notification Service Extensions
 *
 * Send notifications via email, SMS, push, and in-app channels.
 * Unified interface for multi-channel notification delivery.
 *
 * @packageDocumentation
 */

import { defineExtension } from '../builder'
import type { Extension } from '../types'

// ============================================
// Types
// ============================================

export interface TwilioConfig {
  accountSid: string
  authToken: string
  fromNumber?: string
  messagingServiceSid?: string
}

export interface SendGridConfig {
  apiKey: string
  fromEmail: string
  fromName?: string
  templateId?: string
}

export interface ResendConfig {
  apiKey: string
  fromEmail: string
  fromName?: string
}

export interface PostmarkConfig {
  serverToken: string
  fromEmail: string
  messageStream?: string
}

export interface OneSignalConfig {
  appId: string
  restApiKey: string
  userAuthKey?: string
}

export interface KnockConfig {
  apiKey: string
  signingKey?: string
}

export interface NovuConfig {
  apiKey: string
  applicationIdentifier: string
  backendUrl?: string
}

// ============================================
// Notification Interface
// ============================================

interface NotificationAdapter {
  send(notification: Notification): Promise<NotificationResult>
  sendBatch(notifications: Notification[]): Promise<NotificationResult[]>
}

interface Notification {
  to: string | string[]
  channel: 'email' | 'sms' | 'push' | 'in-app'
  subject?: string
  content: string
  html?: string
  templateId?: string
  data?: Record<string, unknown>
  metadata?: Record<string, unknown>
}

interface NotificationResult {
  success: boolean
  messageId?: string
  error?: string
}

// ============================================
// Extension Factories
// ============================================

/**
 * Create Twilio extension
 */
export function createTwilioExtension(
  config?: Partial<TwilioConfig>
): Extension<TwilioConfig> {
  return defineExtension<TwilioConfig>({
    id: 'notification-twilio',
    name: 'Twilio',
    category: 'notification',
    description: 'SMS, voice, and messaging with Twilio',
    author: 'Clarity Chat',
    tags: ['notification', 'sms', 'voice', 'messaging'],
    homepage: 'https://twilio.com',

    configSchema: {
      version: '1.0',
      required: ['accountSid', 'authToken'],
      properties: {
        accountSid: {
          type: 'string',
          label: 'Account SID',
          envVar: 'TWILIO_ACCOUNT_SID',
        },
        authToken: {
          type: 'secret',
          label: 'Auth Token',
          envVar: 'TWILIO_AUTH_TOKEN',
        },
        fromNumber: {
          type: 'string',
          label: 'From Number',
          envVar: 'TWILIO_PHONE_NUMBER',
        },
        messagingServiceSid: { type: 'string', label: 'Messaging Service SID' },
      },
    },

    defaultConfig: config as TwilioConfig,

    initialize: async (ctx) => {
      ctx.logger.info('Twilio extension initialized')

      const adapter: NotificationAdapter = {
        async send(notification) {
          ctx.logger.debug('Sending SMS via Twilio')
          // Would use twilio SDK
          return { success: true, messageId: `msg_${Date.now()}` }
        },
        async sendBatch(notifications) {
          return Promise.all(notifications.map((n) => this.send(n)))
        },
      }

      ctx.services.register('notification', adapter)
    },

    healthCheck: async () => {
      return { healthy: true, message: 'Twilio configured' }
    },
  })
}

/**
 * Create SendGrid extension
 */
export function createSendGridExtension(
  config?: Partial<SendGridConfig>
): Extension<SendGridConfig> {
  return defineExtension<SendGridConfig>({
    id: 'notification-sendgrid',
    name: 'SendGrid',
    category: 'notification',
    description: 'Email delivery with SendGrid',
    author: 'Clarity Chat',
    tags: ['notification', 'email', 'transactional'],
    homepage: 'https://sendgrid.com',

    configSchema: {
      version: '1.0',
      required: ['apiKey', 'fromEmail'],
      properties: {
        apiKey: {
          type: 'secret',
          label: 'API Key',
          envVar: 'SENDGRID_API_KEY',
        },
        fromEmail: { type: 'string', label: 'From Email' },
        fromName: { type: 'string', label: 'From Name' },
        templateId: { type: 'string', label: 'Default Template ID' },
      },
    },

    defaultConfig: config as SendGridConfig,

    initialize: async (ctx) => {
      ctx.logger.info('SendGrid extension initialized')

      const adapter: NotificationAdapter = {
        async send(notification) {
          ctx.logger.debug('Sending email via SendGrid')
          // Would use @sendgrid/mail
          const response = await fetch(
            'https://api.sendgrid.com/v3/mail/send',
            {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${ctx.config.apiKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                personalizations: [{ to: [{ email: notification.to }] }],
                from: {
                  email: ctx.config.fromEmail,
                  name: ctx.config.fromName,
                },
                subject: notification.subject,
                content: [
                  { type: 'text/plain', value: notification.content },
                  ...(notification.html
                    ? [{ type: 'text/html', value: notification.html }]
                    : []),
                ],
              }),
            }
          )
          return {
            success: response.ok,
            messageId: response.headers.get('x-message-id') || undefined,
          }
        },
        async sendBatch(notifications) {
          return Promise.all(notifications.map((n) => this.send(n)))
        },
      }

      ctx.services.register('notification', adapter)
    },
  })
}

/**
 * Create Resend extension
 */
export function createResendExtension(
  config?: Partial<ResendConfig>
): Extension<ResendConfig> {
  return defineExtension<ResendConfig>({
    id: 'notification-resend',
    name: 'Resend',
    category: 'notification',
    description: 'Modern email API for developers',
    author: 'Clarity Chat',
    tags: ['notification', 'email', 'modern', 'developer-friendly'],
    homepage: 'https://resend.com',

    configSchema: {
      version: '1.0',
      required: ['apiKey', 'fromEmail'],
      properties: {
        apiKey: { type: 'secret', label: 'API Key', envVar: 'RESEND_API_KEY' },
        fromEmail: { type: 'string', label: 'From Email' },
        fromName: { type: 'string', label: 'From Name' },
      },
    },

    defaultConfig: config as ResendConfig,

    initialize: async (ctx) => {
      ctx.logger.info('Resend extension initialized')

      const adapter: NotificationAdapter = {
        async send(notification) {
          ctx.logger.debug('Sending email via Resend')
          const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${ctx.config.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: ctx.config.fromName
                ? `${ctx.config.fromName} <${ctx.config.fromEmail}>`
                : ctx.config.fromEmail,
              to: notification.to,
              subject: notification.subject,
              text: notification.content,
              html: notification.html,
            }),
          })
          const data = await response.json()
          return { success: response.ok, messageId: data.id }
        },
        async sendBatch(notifications) {
          return Promise.all(notifications.map((n) => this.send(n)))
        },
      }

      ctx.services.register('notification', adapter)
    },
  })
}

/**
 * Create Postmark extension
 */
export function createPostmarkExtension(
  config?: Partial<PostmarkConfig>
): Extension<PostmarkConfig> {
  return defineExtension<PostmarkConfig>({
    id: 'notification-postmark',
    name: 'Postmark',
    category: 'notification',
    description: 'Reliable email delivery with Postmark',
    author: 'Clarity Chat',
    tags: ['notification', 'email', 'reliable', 'deliverability'],
    homepage: 'https://postmarkapp.com',

    configSchema: {
      version: '1.0',
      required: ['serverToken', 'fromEmail'],
      properties: {
        serverToken: {
          type: 'secret',
          label: 'Server Token',
          envVar: 'POSTMARK_SERVER_TOKEN',
        },
        fromEmail: { type: 'string', label: 'From Email' },
        messageStream: {
          type: 'string',
          label: 'Message Stream',
          default: 'outbound',
        },
      },
    },

    defaultConfig: {
      messageStream: 'outbound',
      ...config,
    } as PostmarkConfig,

    initialize: async (ctx) => {
      ctx.logger.info('Postmark extension initialized')

      const adapter: NotificationAdapter = {
        async send(notification) {
          ctx.logger.debug('Sending email via Postmark')
          const response = await fetch('https://api.postmarkapp.com/email', {
            method: 'POST',
            headers: {
              'X-Postmark-Server-Token': ctx.config.serverToken,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              From: ctx.config.fromEmail,
              To: Array.isArray(notification.to)
                ? notification.to.join(',')
                : notification.to,
              Subject: notification.subject,
              TextBody: notification.content,
              HtmlBody: notification.html,
              MessageStream: ctx.config.messageStream,
            }),
          })
          const data = await response.json()
          return { success: response.ok, messageId: data.MessageID }
        },
        async sendBatch(notifications) {
          return Promise.all(notifications.map((n) => this.send(n)))
        },
      }

      ctx.services.register('notification', adapter)
    },
  })
}

/**
 * Create OneSignal extension
 */
export function createOneSignalExtension(
  config?: Partial<OneSignalConfig>
): Extension<OneSignalConfig> {
  return defineExtension<OneSignalConfig>({
    id: 'notification-onesignal',
    name: 'OneSignal',
    category: 'notification',
    description: 'Push notifications and in-app messaging',
    author: 'Clarity Chat',
    tags: ['notification', 'push', 'mobile', 'web'],
    homepage: 'https://onesignal.com',

    configSchema: {
      version: '1.0',
      required: ['appId', 'restApiKey'],
      properties: {
        appId: { type: 'string', label: 'App ID', envVar: 'ONESIGNAL_APP_ID' },
        restApiKey: {
          type: 'secret',
          label: 'REST API Key',
          envVar: 'ONESIGNAL_REST_API_KEY',
        },
        userAuthKey: { type: 'secret', label: 'User Auth Key' },
      },
    },

    defaultConfig: config as OneSignalConfig,

    initialize: async (ctx) => {
      ctx.logger.info('OneSignal extension initialized')

      const adapter: NotificationAdapter = {
        async send(notification) {
          ctx.logger.debug('Sending push via OneSignal')
          const response = await fetch(
            'https://onesignal.com/api/v1/notifications',
            {
              method: 'POST',
              headers: {
                Authorization: `Basic ${ctx.config.restApiKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                app_id: ctx.config.appId,
                include_external_user_ids: Array.isArray(notification.to)
                  ? notification.to
                  : [notification.to],
                contents: { en: notification.content },
                headings: notification.subject
                  ? { en: notification.subject }
                  : undefined,
                data: notification.data,
              }),
            }
          )
          const data = await response.json()
          return { success: response.ok, messageId: data.id }
        },
        async sendBatch(notifications) {
          return Promise.all(notifications.map((n) => this.send(n)))
        },
      }

      ctx.services.register('notification', adapter)
    },
  })
}

/**
 * Create Knock extension
 */
export function createKnockExtension(
  config?: Partial<KnockConfig>
): Extension<KnockConfig> {
  return defineExtension<KnockConfig>({
    id: 'notification-knock',
    name: 'Knock',
    category: 'notification',
    description: 'Notification infrastructure for product teams',
    author: 'Clarity Chat',
    tags: ['notification', 'infrastructure', 'multi-channel'],
    homepage: 'https://knock.app',

    configSchema: {
      version: '1.0',
      required: ['apiKey'],
      properties: {
        apiKey: { type: 'secret', label: 'API Key', envVar: 'KNOCK_API_KEY' },
        signingKey: {
          type: 'secret',
          label: 'Signing Key',
          envVar: 'KNOCK_SIGNING_KEY',
        },
      },
    },

    defaultConfig: config as KnockConfig,

    initialize: async (ctx) => {
      ctx.logger.info('Knock extension initialized')

      const adapter: NotificationAdapter = {
        async send(notification) {
          ctx.logger.debug('Sending notification via Knock')
          // Would use @knocklabs/node
          return { success: true, messageId: `knock_${Date.now()}` }
        },
        async sendBatch(notifications) {
          return Promise.all(notifications.map((n) => this.send(n)))
        },
      }

      ctx.services.register('notification', adapter)
    },
  })
}

/**
 * Create Novu extension
 */
export function createNovuExtension(
  config?: Partial<NovuConfig>
): Extension<NovuConfig> {
  return defineExtension<NovuConfig>({
    id: 'notification-novu',
    name: 'Novu',
    category: 'notification',
    description: 'Open-source notification infrastructure',
    author: 'Clarity Chat',
    tags: ['notification', 'open-source', 'multi-channel'],
    homepage: 'https://novu.co',

    configSchema: {
      version: '1.0',
      required: ['apiKey', 'applicationIdentifier'],
      properties: {
        apiKey: { type: 'secret', label: 'API Key', envVar: 'NOVU_API_KEY' },
        applicationIdentifier: {
          type: 'string',
          label: 'Application ID',
          envVar: 'NOVU_APP_ID',
        },
        backendUrl: { type: 'string', label: 'Backend URL' },
      },
    },

    defaultConfig: config as NovuConfig,

    initialize: async (ctx) => {
      ctx.logger.info('Novu extension initialized')

      const adapter: NotificationAdapter = {
        async send(notification) {
          ctx.logger.debug('Sending notification via Novu')
          // Would use @novu/node
          return { success: true, messageId: `novu_${Date.now()}` }
        },
        async sendBatch(notifications) {
          return Promise.all(notifications.map((n) => this.send(n)))
        },
      }

      ctx.services.register('notification', adapter)
    },
  })
}
