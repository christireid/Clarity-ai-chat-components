/**
 * Webhook Types
 *
 * Event-driven webhooks for real-time notifications.
 * Bring your own delivery mechanism (HTTP, queue, etc.)
 */

export interface WebhookEvent {
  /** Event ID */
  id: string
  /** Event type */
  type: string
  /** Event data */
  data: Record<string, any>
  /** Timestamp */
  timestamp: number
  /** Source identifier */
  source?: string
  /** User/session ID */
  userId?: string
  /** Metadata */
  metadata?: Record<string, any>
}

export interface WebhookEndpoint {
  /** Endpoint ID */
  id: string
  /** Endpoint URL */
  url: string
  /** Events this endpoint subscribes to */
  events: string[]
  /** Secret for signature verification */
  secret?: string
  /** Headers to include in requests */
  headers?: Record<string, string>
  /** Whether endpoint is active */
  enabled?: boolean
  /** Metadata */
  metadata?: Record<string, any>
}

export interface WebhookDelivery {
  /** Delivery ID */
  id: string
  /** Event ID */
  eventId: string
  /** Endpoint ID */
  endpointId: string
  /** HTTP status code */
  status?: number
  /** Response body */
  response?: string
  /** Number of delivery attempts */
  attempts: number
  /** Next retry time */
  nextRetry?: number
  /** Delivery status */
  deliveryStatus: 'pending' | 'delivered' | 'failed' | 'retrying'
  /** Error message if failed */
  error?: string
  /** Timestamp */
  timestamp: number
}

export interface WebhookConfig {
  /** Maximum retry attempts */
  maxRetries?: number
  /** Retry delay in ms */
  retryDelay?: number
  /** Timeout for webhook requests */
  timeout?: number
  /** Whether to verify signatures */
  verifySignatures?: boolean
}

export interface WebhookHandler {
  /**
   * Deliver webhook event
   */
  deliver(event: WebhookEvent, endpoint: WebhookEndpoint): Promise<WebhookDelivery>

  /**
   * Verify webhook signature
   */
  verifySignature?(payload: string, signature: string, secret: string): boolean
}

