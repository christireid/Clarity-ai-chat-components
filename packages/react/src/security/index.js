/**
 * Security System (2025)
 *
 * Comprehensive security layer for AI chat applications
 * Based on OWASP LLM Top 10 2025
 *
 * @example
 * ```tsx
 * import { SecurityManager, useSecurity } from '@clarity-chat/react'
 *
 * // Option 1: Use with React hooks
 * function ChatComponent() {
 *   const { validateInput, prepareMessages } = useSecurity({
 *     promptInjection: { enabled: true },
 *     pii: { enabled: true, redactionStrategy: 'synthetic' },
 *     jailbreakPrevention: { enabled: true },
 *   })
 *
 *   const handleSend = async (message: string) => {
 *     const validation = await validateInput(message, { userId: 'user-123' })
 *     if (!validation.allowed) {
 *       alert('Message blocked: ' + validation.reason)
 *       return
 *     }
 *     // Continue with sanitized input...
 *   }
 * }
 *
 * // Option 2: Use SecurityManager directly
 * const security = new SecurityManager({
 *   promptInjection: { enabled: true },
 *   pii: { enabled: true },
 *   contentModeration: { enabled: true },
 *   jailbreakPrevention: { enabled: true },
 *   monitoring: {
 *     enabled: true,
 *     alertHandlers: [new WebhookAlertHandler('https://alerts.example.com')],
 *   },
 * })
 *
 * const result = await security.validateInput(userMessage, { userId: 'user-123' })
 * ```
 */
// Security Manager
export { SecurityManager, WebhookAlertHandler, ConsoleAlertHandler, } from './security-manager';
//# sourceMappingURL=index.js.map