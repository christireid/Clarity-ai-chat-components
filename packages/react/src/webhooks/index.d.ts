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
export * from './types';
export * from './webhook-manager';
/**
 * Common webhook event types for AI applications
 */
export declare const WebhookEvents: {
    readonly CHAT_MESSAGE_SENT: "chat.message.sent";
    readonly CHAT_MESSAGE_RECEIVED: "chat.message.received";
    readonly CHAT_COMPLETION: "chat.completion";
    readonly CHAT_ERROR: "chat.error";
    readonly AGENT_STARTED: "agent.started";
    readonly AGENT_TOOL_CALLED: "agent.tool.called";
    readonly AGENT_COMPLETED: "agent.completed";
    readonly AGENT_FAILED: "agent.failed";
    readonly RAG_DOCUMENT_UPLOADED: "rag.document.uploaded";
    readonly RAG_SEARCH_PERFORMED: "rag.search.performed";
    readonly RAG_QUERY_COMPLETED: "rag.query.completed";
    readonly SAFETY_PII_DETECTED: "safety.pii.detected";
    readonly SAFETY_CONTENT_FLAGGED: "safety.content.flagged";
    readonly SAFETY_INJECTION_DETECTED: "safety.injection.detected";
    readonly SYSTEM_ERROR: "system.error";
    readonly SYSTEM_WARNING: "system.warning";
    readonly SYSTEM_RATE_LIMITED: "system.rate_limited";
};
//# sourceMappingURL=index.d.ts.map