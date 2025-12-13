/**
 * Payment & Billing Extensions
 *
 * Integrate subscription billing and usage-based pricing.
 * Perfect for monetizing AI chat applications.
 *
 * @packageDocumentation
 */

import { defineExtension } from '../builder'
import type { Extension } from '../types'

// ============================================
// Types
// ============================================

export interface StripeConfig {
  publishableKey: string
  secretKey?: string
  webhookSecret?: string
  apiVersion?: string
}

export interface LemonSqueezyConfig {
  apiKey: string
  storeId: string
  webhookSecret?: string
}

export interface PaddleConfig {
  vendorId: string
  vendorAuthCode?: string
  publicKey?: string
  sandbox?: boolean
}

// ============================================
// Payment Interface
// ============================================

interface PaymentAdapter {
  createCheckoutSession(options: CheckoutOptions): Promise<CheckoutSession>
  createPortalSession(customerId: string): Promise<PortalSession>
  getSubscription(subscriptionId: string): Promise<Subscription | null>
  cancelSubscription(subscriptionId: string): Promise<void>
  recordUsage(
    subscriptionItemId: string,
    quantity: number,
    timestamp?: Date
  ): Promise<void>
}

interface CheckoutOptions {
  priceId: string
  customerId?: string
  customerEmail?: string
  successUrl: string
  cancelUrl: string
  metadata?: Record<string, string>
  trialDays?: number
}

interface CheckoutSession {
  id: string
  url: string
}

interface PortalSession {
  id: string
  url: string
}

interface Subscription {
  id: string
  status: 'active' | 'canceled' | 'past_due' | 'trialing' | 'paused'
  customerId: string
  priceId: string
  currentPeriodStart: Date
  currentPeriodEnd: Date
  cancelAtPeriodEnd: boolean
}

// ============================================
// Extension Factories
// ============================================

/**
 * Create Stripe extension
 */
export function createStripeExtension(
  config?: Partial<StripeConfig>
): Extension<StripeConfig> {
  return defineExtension<StripeConfig>({
    id: 'payment-stripe',
    name: 'Stripe',
    category: 'utility',
    description: 'Payment processing and subscription billing',
    author: 'Clarity Chat',
    tags: ['payment', 'billing', 'subscription', 'enterprise'],
    homepage: 'https://stripe.com',

    configSchema: {
      version: '1.0',
      required: ['publishableKey'],
      properties: {
        publishableKey: {
          type: 'string',
          label: 'Publishable Key',
          envVar: 'STRIPE_PUBLISHABLE_KEY',
        },
        secretKey: {
          type: 'secret',
          label: 'Secret Key',
          envVar: 'STRIPE_SECRET_KEY',
        },
        webhookSecret: {
          type: 'secret',
          label: 'Webhook Secret',
          envVar: 'STRIPE_WEBHOOK_SECRET',
        },
        apiVersion: {
          type: 'string',
          label: 'API Version',
          default: '2023-10-16',
        },
      },
    },

    defaultConfig: {
      apiVersion: '2023-10-16',
      ...config,
    } as StripeConfig,

    initialize: async (ctx) => {
      ctx.logger.info('Stripe extension initialized')

      // Load Stripe.js
      if (typeof window !== 'undefined') {
        const script = document.createElement('script')
        script.src = 'https://js.stripe.com/v3/'
        script.async = true
        document.head.appendChild(script)
      }

      const makeStripeRequest = async (
        endpoint: string,
        method: string,
        body?: Record<string, unknown>
      ) => {
        if (!ctx.config.secretKey) {
          throw new Error('Stripe secret key required for API calls')
        }
        const response = await fetch(`https://api.stripe.com/v1${endpoint}`, {
          method,
          headers: {
            Authorization: `Bearer ${ctx.config.secretKey}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Stripe-Version': ctx.config.apiVersion || '2023-10-16',
          },
          body: body
            ? new URLSearchParams(body as Record<string, string>).toString()
            : undefined,
        })
        return response.json()
      }

      const adapter: PaymentAdapter = {
        async createCheckoutSession(options) {
          ctx.logger.debug('Creating Stripe checkout session')
          const params: Record<string, unknown> = {
            'line_items[0][price]': options.priceId,
            'line_items[0][quantity]': '1',
            mode: 'subscription',
            success_url: options.successUrl,
            cancel_url: options.cancelUrl,
          }
          if (options.customerId) params.customer = options.customerId
          if (options.customerEmail)
            params.customer_email = options.customerEmail
          if (options.trialDays)
            params.subscription_data = { trial_period_days: options.trialDays }
          if (options.metadata) {
            Object.entries(options.metadata).forEach(([k, v]) => {
              params[`metadata[${k}]`] = v
            })
          }
          const data = await makeStripeRequest(
            '/checkout/sessions',
            'POST',
            params
          )
          return { id: data.id, url: data.url }
        },

        async createPortalSession(customerId) {
          ctx.logger.debug('Creating Stripe portal session')
          const data = await makeStripeRequest(
            '/billing_portal/sessions',
            'POST',
            {
              customer: customerId,
            }
          )
          return { id: data.id, url: data.url }
        },

        async getSubscription(subscriptionId) {
          ctx.logger.debug(`Getting subscription: ${subscriptionId}`)
          const data = await makeStripeRequest(
            `/subscriptions/${subscriptionId}`,
            'GET'
          )
          if (!data.id) return null
          return {
            id: data.id,
            status: data.status,
            customerId: data.customer,
            priceId: data.items?.data?.[0]?.price?.id,
            currentPeriodStart: new Date(data.current_period_start * 1000),
            currentPeriodEnd: new Date(data.current_period_end * 1000),
            cancelAtPeriodEnd: data.cancel_at_period_end,
          }
        },

        async cancelSubscription(subscriptionId) {
          ctx.logger.debug(`Canceling subscription: ${subscriptionId}`)
          await makeStripeRequest(`/subscriptions/${subscriptionId}`, 'DELETE')
        },

        async recordUsage(subscriptionItemId, quantity, timestamp) {
          ctx.logger.debug(
            `Recording usage: ${quantity} for ${subscriptionItemId}`
          )
          await makeStripeRequest(
            `/subscription_items/${subscriptionItemId}/usage_records`,
            'POST',
            {
              quantity: String(quantity),
              timestamp: timestamp
                ? String(Math.floor(timestamp.getTime() / 1000))
                : undefined,
            }
          )
        },
      }

      ctx.services.register('payment', adapter)
      ctx.events.emit('payment:initialized', { provider: 'stripe' })
    },
  })
}

/**
 * Create Lemon Squeezy extension
 */
export function createLemonSqueezyExtension(
  config?: Partial<LemonSqueezyConfig>
): Extension<LemonSqueezyConfig> {
  return defineExtension<LemonSqueezyConfig>({
    id: 'payment-lemonsqueezy',
    name: 'Lemon Squeezy',
    category: 'utility',
    description: 'Simple payment processing for SaaS',
    author: 'Clarity Chat',
    tags: ['payment', 'billing', 'subscription', 'simple'],
    homepage: 'https://lemonsqueezy.com',

    configSchema: {
      version: '1.0',
      required: ['apiKey', 'storeId'],
      properties: {
        apiKey: {
          type: 'secret',
          label: 'API Key',
          envVar: 'LEMONSQUEEZY_API_KEY',
        },
        storeId: {
          type: 'string',
          label: 'Store ID',
          envVar: 'LEMONSQUEEZY_STORE_ID',
        },
        webhookSecret: { type: 'secret', label: 'Webhook Secret' },
      },
    },

    defaultConfig: config as LemonSqueezyConfig,

    initialize: async (ctx) => {
      ctx.logger.info('Lemon Squeezy extension initialized')

      // Load Lemon.js
      if (typeof window !== 'undefined') {
        const script = document.createElement('script')
        script.src = 'https://app.lemonsqueezy.com/js/lemon.js'
        script.defer = true
        document.head.appendChild(script)
      }

      const makeRequest = async (
        endpoint: string,
        method: string,
        body?: Record<string, unknown>
      ) => {
        const response = await fetch(
          `https://api.lemonsqueezy.com/v1${endpoint}`,
          {
            method,
            headers: {
              Authorization: `Bearer ${ctx.config.apiKey}`,
              Accept: 'application/vnd.api+json',
              'Content-Type': 'application/vnd.api+json',
            },
            body: body ? JSON.stringify(body) : undefined,
          }
        )
        return response.json()
      }

      const adapter: PaymentAdapter = {
        async createCheckoutSession(options) {
          ctx.logger.debug('Creating Lemon Squeezy checkout')
          const data = await makeRequest('/checkouts', 'POST', {
            data: {
              type: 'checkouts',
              attributes: {
                checkout_data: {
                  email: options.customerEmail,
                  custom: options.metadata,
                },
              },
              relationships: {
                store: { data: { type: 'stores', id: ctx.config.storeId } },
                variant: { data: { type: 'variants', id: options.priceId } },
              },
            },
          })
          return { id: data.data.id, url: data.data.attributes.url }
        },

        async createPortalSession(customerId) {
          ctx.logger.debug('Creating Lemon Squeezy portal')
          const data = await makeRequest(
            `/customers/${customerId}/customer-portal`,
            'GET'
          )
          return {
            id: customerId,
            url: data.data.attributes.urls.customer_portal,
          }
        },

        async getSubscription(subscriptionId) {
          const data = await makeRequest(
            `/subscriptions/${subscriptionId}`,
            'GET'
          )
          if (!data.data) return null
          const attrs = data.data.attributes
          return {
            id: data.data.id,
            status: attrs.status,
            customerId: attrs.customer_id,
            priceId: attrs.variant_id,
            currentPeriodStart: new Date(attrs.renews_at),
            currentPeriodEnd: new Date(attrs.ends_at || attrs.renews_at),
            cancelAtPeriodEnd: attrs.cancelled,
          }
        },

        async cancelSubscription(subscriptionId) {
          await makeRequest(`/subscriptions/${subscriptionId}`, 'DELETE')
        },

        async recordUsage(subscriptionItemId, quantity) {
          await makeRequest(
            `/subscription-items/${subscriptionItemId}/usage-records`,
            'POST',
            {
              data: {
                type: 'usage-records',
                attributes: { quantity },
              },
            }
          )
        },
      }

      ctx.services.register('payment', adapter)
    },
  })
}

/**
 * Create Paddle extension
 */
export function createPaddleExtension(
  config?: Partial<PaddleConfig>
): Extension<PaddleConfig> {
  return defineExtension<PaddleConfig>({
    id: 'payment-paddle',
    name: 'Paddle',
    category: 'utility',
    description: 'Merchant of record for SaaS billing',
    author: 'Clarity Chat',
    tags: ['payment', 'billing', 'merchant-of-record'],
    homepage: 'https://paddle.com',

    configSchema: {
      version: '1.0',
      required: ['vendorId'],
      properties: {
        vendorId: {
          type: 'string',
          label: 'Vendor ID',
          envVar: 'PADDLE_VENDOR_ID',
        },
        vendorAuthCode: {
          type: 'secret',
          label: 'Vendor Auth Code',
          envVar: 'PADDLE_VENDOR_AUTH_CODE',
        },
        publicKey: { type: 'string', label: 'Public Key' },
        sandbox: { type: 'boolean', label: 'Sandbox Mode', default: false },
      },
    },

    defaultConfig: {
      sandbox: false,
      ...config,
    } as PaddleConfig,

    initialize: async (ctx) => {
      ctx.logger.info('Paddle extension initialized')

      // Load Paddle.js
      if (typeof window !== 'undefined') {
        const script = document.createElement('script')
        script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js'
        script.onload = () => {
          const Paddle = (
            window as {
              Paddle?: {
                Environment: { set: (env: string) => void }
                Initialize: (opts: { token: string }) => void
              }
            }
          ).Paddle
          if (Paddle) {
            if (ctx.config.sandbox) {
              Paddle.Environment.set('sandbox')
            }
            Paddle.Initialize({ token: ctx.config.vendorId })
          }
        }
        document.head.appendChild(script)
      }

      const adapter: PaymentAdapter = {
        async createCheckoutSession(options) {
          ctx.logger.debug('Creating Paddle checkout')
          // Paddle uses client-side checkout
          return { id: `paddle_${Date.now()}`, url: '' }
        },

        async createPortalSession(customerId) {
          return { id: customerId, url: '' }
        },

        async getSubscription(subscriptionId) {
          return null
        },

        async cancelSubscription(subscriptionId) {
          ctx.logger.debug(`Canceling Paddle subscription: ${subscriptionId}`)
        },

        async recordUsage(subscriptionItemId, quantity) {
          ctx.logger.debug(`Recording Paddle usage: ${quantity}`)
        },
      }

      ctx.services.register('payment', adapter)
    },
  })
}
