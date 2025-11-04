/**
 * Token pricing for popular models
 */
export declare const MODEL_PRICING: Record<string, {
    input: number;
    output: number;
}>;
/**
 * Token limits for popular models
 */
export declare const MODEL_LIMITS: Record<string, number>;
/**
 * Message with token count
 */
export interface MessageWithTokens {
    role: 'user' | 'assistant' | 'system';
    content: string;
    tokens?: number;
}
/**
 * Token tracker options
 */
export interface UseTokenTrackerOptions {
    /** Model name (e.g., 'gpt-4', 'claude-3-opus') */
    modelName: string;
    /** Maximum tokens for model (auto-detected if modelName matches) */
    maxTokens?: number;
    /** Cost per input token in dollars (auto-detected if modelName matches) */
    inputCostPerToken?: number;
    /** Cost per output token in dollars (auto-detected if modelName matches) */
    outputCostPerToken?: number;
    /** Warning threshold as percentage (default: 0.8 = 80%) */
    warningThreshold?: number;
    /** Critical threshold as percentage (default: 0.95 = 95%) */
    criticalThreshold?: number;
    /** Callback when warning threshold exceeded */
    onWarning?: () => void;
    /** Callback when critical threshold exceeded */
    onCritical?: () => void;
}
/**
 * Token tracker return
 */
export interface UseTokenTrackerReturn {
    /** Current total tokens in conversation */
    tokens: number;
    /** Input tokens (user messages) */
    inputTokens: number;
    /** Output tokens (assistant messages) */
    outputTokens: number;
    /** Estimated total cost in dollars */
    estimatedCost: number;
    /** Whether near token limit (warning threshold) */
    isNearLimit: boolean;
    /** Whether at critical token limit */
    isCritical: boolean;
    /** Percentage of limit used (0-100) */
    percentage: number;
    /** Whether can send message without exceeding limit */
    canSend: (estimatedTokens: number) => boolean;
    /** Suggest pruning old messages */
    suggestPruning: boolean;
    /** Add message to tracker */
    addMessage: (message: MessageWithTokens) => void;
    /** Remove message from tracker */
    removeMessage: (index: number) => void;
    /** Clear all messages */
    clear: () => void;
    /** Estimate tokens for text (rough approximation) */
    estimateTokens: (text: string) => number;
}
/**
 * Production-ready Token Tracker hook for cost transparency.
 *
 * **Features:**
 * - Real-time token counting across conversation
 * - Automatic model pricing lookup
 * - Cost estimation for input/output tokens
 * - Warning alerts at configurable thresholds
 * - Context limit validation
 * - Pruning suggestions
 * - Support for popular models (GPT-4, Claude, etc.)
 *
 * **Use Cases:**
 * - Display current conversation token usage
 * - Warn users before hitting context limits
 * - Show estimated API costs
 * - Prevent messages that would exceed limits
 * - Suggest context pruning
 *
 * @example
 * ```tsx
 * // Basic usage with GPT-4
 * const {
 *   tokens,
 *   estimatedCost,
 *   isNearLimit,
 *   canSend,
 *   addMessage,
 * } = useTokenTracker({
 *   modelName: 'gpt-4',
 * })
 *
 * // Add messages
 * addMessage({ role: 'user', content: 'Hello!', tokens: 5 })
 * addMessage({ role: 'assistant', content: 'Hi there!', tokens: 7 })
 *
 * // Check before sending
 * const canSendMessage = canSend(estimatedTokens)
 * if (!canSendMessage) {
 *   alert('Message too long - would exceed context limit')
 * }
 *
 * // With custom model and pricing
 * const tracker = useTokenTracker({
 *   modelName: 'custom-model',
 *   maxTokens: 4096,
 *   inputCostPerToken: 0.00002,
 *   outputCostPerToken: 0.00004,
 *   warningThreshold: 0.7,
 *   onWarning: () => {
 *     console.log('Approaching token limit')
 *   },
 *   onCritical: () => {
 *     showPruneDialog()
 *   },
 * })
 *
 * // With pruning suggestions
 * function ChatUI() {
 *   const { suggestPruning, clear } = useTokenTracker({
 *     modelName: 'gpt-4',
 *   })
 *
 *   return (
 *     <div>
 *       {suggestPruning && (
 *         <button onClick={clear}>
 *           Prune old messages to free up space
 *         </button>
 *       )}
 *     </div>
 *   )
 * }
 * ```
 */
export declare function useTokenTracker(options: UseTokenTrackerOptions): UseTokenTrackerReturn;
//# sourceMappingURL=use-token-tracker.d.ts.map