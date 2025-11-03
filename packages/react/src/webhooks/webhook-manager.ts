/**
 * Webhook Manager
 *
 * Manage webhook endpoints and deliver events.
 * Simple, flexible, and production-ready.
 */

import type {
  WebhookEvent,
  WebhookEndpoint,
  WebhookDelivery,
  WebhookConfig,
  WebhookHandler,
} from './types'

export class WebhookManager implements WebhookHandler {
  private endpoints = new Map<string, WebhookEndpoint>()
  private config: Required<WebhookConfig>
  private deliveryQueue: WebhookDelivery[] = []

  constructor(config?: WebhookConfig) {
    this.config = {
      maxRetries: config?.maxRetries ?? 3,
      retryDelay: config?.retryDelay ?? 1000,
      timeout: config?.timeout ?? 5000,
      verifySignatures: config?.verifySignatures ?? false,
    }
  }

  /**
   * Register a webhook endpoint
   */
  register(endpoint: WebhookEndpoint): void {
    this.endpoints.set(endpoint.id, { ...endpoint, enabled: endpoint.enabled ?? true })
  }

  /**
   * Unregister a webhook endpoint
   */
  unregister(endpointId: string): boolean {
    return this.endpoints.delete(endpointId)
  }

  /**
   * Get endpoint by ID
   */
  getEndpoint(id: string): WebhookEndpoint | undefined {
    return this.endpoints.get(id)
  }

  /**
   * Get all endpoints
   */
  getAllEndpoints(): WebhookEndpoint[] {
    return Array.from(this.endpoints.values())
  }

  /**
   * Emit an event to all subscribed endpoints
   */
  async emit(event: WebhookEvent): Promise<WebhookDelivery[]> {
    const deliveries: WebhookDelivery[] = []

    for (const endpoint of this.endpoints.values()) {
      if (!endpoint.enabled) continue
      if (!endpoint.events.includes(event.type) && !endpoint.events.includes('*')) {
        continue
      }

      const delivery = await this.deliver(event, endpoint)
      deliveries.push(delivery)
    }

    return deliveries
  }

  /**
   * Deliver event to specific endpoint
   */
  async deliver(event: WebhookEvent, endpoint: WebhookEndpoint): Promise<WebhookDelivery> {
    const delivery: WebhookDelivery = {
      id: this.generateId(),
      eventId: event.id,
      endpointId: endpoint.id,
      attempts: 0,
      deliveryStatus: 'pending',
      timestamp: Date.now(),
    }

    for (let attempt = 0; attempt < this.config.maxRetries; attempt++) {
      delivery.attempts++

      try {
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), this.config.timeout)

        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          'X-Webhook-Event': event.type,
          'X-Webhook-Id': event.id,
          ...endpoint.headers,
        }

        // Add signature if secret provided
        if (endpoint.secret) {
          const signature = this.generateSignature(JSON.stringify(event), endpoint.secret)
          headers['X-Webhook-Signature'] = signature
        }

        const response = await fetch(endpoint.url, {
          method: 'POST',
          headers,
          body: JSON.stringify(event),
          signal: controller.signal,
        })

        clearTimeout(timeout)

        delivery.status = response.status
        delivery.response = await response.text()

        if (response.ok) {
          delivery.deliveryStatus = 'delivered'
          return delivery
        } else {
          delivery.error = `HTTP ${response.status}: ${delivery.response}`
        }
      } catch (error: any) {
        delivery.error = error.message

        if (error.name === 'AbortError') {
          delivery.error = 'Request timeout'
        }
      }

      // Retry with delay
      if (attempt < this.config.maxRetries - 1) {
        delivery.deliveryStatus = 'retrying'
        const delay = this.config.retryDelay * Math.pow(2, attempt)
        delivery.nextRetry = Date.now() + delay
        await this.sleep(delay)
      }
    }

    delivery.deliveryStatus = 'failed'
    return delivery
  }

  /**
   * Generate HMAC signature for webhook payload
   */
  private generateSignature(payload: string, secret: string): string {
    // Simple hash - in production use crypto.createHmac
    let hash = 0
    const str = payload + secret

    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash
    }

    return `sha256=${Math.abs(hash).toString(16)}`
  }

  /**
   * Verify webhook signature
   */
  verifySignature(payload: string, signature: string, secret: string): boolean {
    const expectedSignature = this.generateSignature(payload, secret)
    return signature === expectedSignature
  }

  private generateId(): string {
    return `wh-${Date.now()}-${Math.random().toString(36).substring(7)}`
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  /**
   * Get delivery statistics
   */
  getStats(): {
    totalEndpoints: number
    activeEndpoints: number
    totalDeliveries: number
    failedDeliveries: number
  } {
    return {
      totalEndpoints: this.endpoints.size,
      activeEndpoints: Array.from(this.endpoints.values()).filter((e) => e.enabled).length,
      totalDeliveries: this.deliveryQueue.length,
      failedDeliveries: this.deliveryQueue.filter((d) => d.deliveryStatus === 'failed').length,
    }
  }
}

