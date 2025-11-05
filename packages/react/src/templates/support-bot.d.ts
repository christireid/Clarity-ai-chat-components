/**
 * Support bot configuration
 */
export interface SupportBotConfig {
    /** Bot name */
    botName?: string;
    /** Bot avatar URL */
    botAvatar?: string;
    /** Welcome message */
    welcomeMessage?: string;
    /** Quick replies/suggested actions */
    quickReplies?: Array<{
        text: string;
        action: string;
    }>;
    /** Knowledge base for FAQ */
    knowledgeBase?: Array<{
        question: string;
        answer: string;
        keywords: string[];
    }>;
    /** Escalation threshold (messages before offering human agent) */
    escalationThreshold?: number;
    /** Callback when escalating to human agent */
    onEscalate?: () => void;
    /** Custom CSS class */
    className?: string;
}
/**
 * Production-ready Support Bot Template.
 *
 * **Features:**
 * - Pre-configured for customer support use cases
 * - Built-in knowledge base with FAQ matching
 * - Quick reply buttons for common actions
 * - Smart escalation to human agents
 * - Typing indicators and friendly responses
 * - Tracks conversation context
 *
 * **Use Cases:**
 * - E-commerce customer support
 * - SaaS help desk
 * - Service chatbots
 * - FAQ automation
 *
 * @example
 * ```tsx
 * // Basic usage
 * <SupportBot
 *   onEscalate={() => {
 *     // Connect to human agent
 *     connectToAgent()
 *   }}
 * />
 *
 * // Custom configuration
 * <SupportBot
 *   botName="ShopBot"
 *   botAvatar="/bot-avatar.png"
 *   welcomeMessage="Hi! I'm ShopBot. How can I help you today?"
 *   quickReplies={[
 *     { text: 'Check order status', action: 'track' },
 *     { text: 'Start return', action: 'return' },
 *   ]}
 *   escalationThreshold={5}
 *   onEscalate={() => transferToAgent()}
 * />
 *
 * // With custom knowledge base
 * <SupportBot
 *   knowledgeBase={[
 *     {
 *       question: 'What is your pricing?',
 *       answer: 'We offer 3 plans: Basic ($9/mo), Pro ($29/mo), Enterprise (custom)',
 *       keywords: ['price', 'cost', 'plan', 'subscription']
 *     }
 *   ]}
 * />
 * ```
 */
export declare function SupportBot({ botName: _botName, // Reserved for future use
botAvatar: _botAvatar, // Reserved for future use
welcomeMessage, quickReplies, knowledgeBase, escalationThreshold, onEscalate, className, }: SupportBotConfig): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=support-bot.d.ts.map