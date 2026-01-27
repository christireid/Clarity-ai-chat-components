/**
 * Webhook System
 *
 * Event-driven webhooks for real-time notifications.
 * Perfect for async operations, monitoring, and integrations.
 *
 * @example
 * ```tsx
 * import { WebhookManager } from '@clarity-chat/react'
 *
 * const webhooks = new WebhookManager({
 *   maxRetries: 3,
 *   timeout: 5000,
 * })
 *
 * // Register endpoint
 * webhooks.register({
 *   id: 'my-webhook',
 *   url: 'https://example.com/webhook',
 *   events: ['chat.message', 'chat.completion'],
 *   secret: 'my-secret-key',
 * })
 *
 * // Emit events
 * await webhooks.emit({
 *   id: 'evt-123',
 *   type: 'chat.completion',
 *   data: { messageId: '456', tokens: 100 },
 *   timestamp: Date.now(),
 * })
 * ```
 *
 * @example
 * ```tsx
 * // Subscribe to specific events
 * webhooks.register({
 *   id: 'analytics',
 *   url: 'https://analytics.example.com/events',
 *   events: ['chat.*'], // Wildcard support
 * })
 *
 * // Subscribe to all events
 * webhooks.register({
 *   id: 'monitor',
 *   url: 'https://monitor.example.com/all',
 *   events: ['*'],
 * })
 * ```
 */

export * from './types'
export * from './webhook-manager'

// Note: WebhookManager now includes all enterprise security features by default
// - HMAC-SHA256 signatures (not simple hashing)
// - Replay protection via timestamp validation
// - Rate limiting per endpoint
// - Constant-time comparison to prevent timing attacks
// - Secure defaults (verifySignatures: true)
//
// Backward compatibility: EnhancedWebhookManager is now an alias for WebhookManager

/**
 * Common webhook event types for AI applications
 */
export const WebhookEvents = {
  // Chat events
  CHAT_MESSAGE_SENT: 'chat.message.sent',
  CHAT_MESSAGE_RECEIVED: 'chat.message.received',
  CHAT_COMPLETION: 'chat.completion',
  CHAT_ERROR: 'chat.error',

  // Agent events
  AGENT_STARTED: 'agent.started',
  AGENT_TOOL_CALLED: 'agent.tool.called',
  AGENT_COMPLETED: 'agent.completed',
  AGENT_FAILED: 'agent.failed',

  // RAG events
  RAG_DOCUMENT_UPLOADED: 'rag.document.uploaded',
  RAG_SEARCH_PERFORMED: 'rag.search.performed',
  RAG_QUERY_COMPLETED: 'rag.query.completed',

  // Safety events
  SAFETY_PII_DETECTED: 'safety.pii.detected',
  SAFETY_CONTENT_FLAGGED: 'safety.content.flagged',
  SAFETY_INJECTION_DETECTED: 'safety.injection.detected',

  // System events
  SYSTEM_ERROR: 'system.error',
  SYSTEM_WARNING: 'system.warning',
  SYSTEM_RATE_LIMITED: 'system.rate_limited',
} as const

