/**
 * Token counter props
 */
export interface TokenCounterProps {
    /** Current token count in conversation */
    currentTokens: number;
    /** Maximum tokens allowed by model */
    maxTokens: number;
    /** Cost per token in dollars (e.g., 0.000002 for $0.002 per 1K tokens) */
    costPerToken?: number;
    /** Show warning when approaching limit (default: true) */
    showWarning?: boolean;
    /** Warning threshold as percentage (default: 0.8 = 80%) */
    warningThreshold?: number;
    /** Critical threshold as percentage (default: 0.95 = 95%) */
    criticalThreshold?: number;
    /** Show cost estimate (default: true) */
    showCost?: boolean;
    /** Show percentage bar (default: true) */
    showBar?: boolean;
    /** Callback when warning threshold exceeded */
    onWarning?: () => void;
    /** Callback when critical threshold exceeded */
    onCritical?: () => void;
    /** Suggest pruning old messages */
    suggestPruning?: boolean;
    /** Callback when prune suggestion clicked */
    onPruneSuggested?: () => void;
    /** Size variant */
    size?: 'sm' | 'md' | 'lg';
    /** Custom CSS class */
    className?: string;
}
/**
 * Production-ready Token Counter component with cost transparency.
 *
 * **Features:**
 * - Real-time token count display
 * - Cost estimation based on token pricing
 * - Visual progress bar with color-coded thresholds
 * - Warning alerts at 80% and 95% usage
 * - Smart pruning suggestions
 * - Responsive sizing (sm, md, lg)
 * - Accessible (ARIA labels, color contrast)
 *
 * **Use Cases:**
 * - Display current conversation token usage
 * - Warn users before hitting context limits
 * - Show estimated API costs in real-time
 * - Suggest context pruning when approaching limits
 *
 * @example
 * ```tsx
 * // Basic usage
 * <TokenCounter
 *   currentTokens={1250}
 *   maxTokens={4096}
 * />
 *
 * // With cost estimation
 * <TokenCounter
 *   currentTokens={3500}
 *   maxTokens={4096}
 *   costPerToken={0.000002} // $0.002 per 1K tokens
 *   showCost={true}
 * />
 *
 * // With warnings and pruning
 * <TokenCounter
 *   currentTokens={3400}
 *   maxTokens={4096}
 *   showWarning={true}
 *   warningThreshold={0.8}
 *   criticalThreshold={0.95}
 *   suggestPruning={true}
 *   onWarning={() => {
 *     console.log('Approaching token limit')
 *   }}
 *   onCritical={() => {
 *     console.log('Critical token limit!')
 *     showPruneDialog()
 *   }}
 *   onPruneSuggested={() => {
 *     pruneOldMessages()
 *   }}
 * />
 *
 * // Small variant for compact UI
 * <TokenCounter
 *   currentTokens={500}
 *   maxTokens={4096}
 *   size="sm"
 *   showBar={false}
 * />
 * ```
 */
export declare function TokenCounter({ currentTokens, maxTokens, costPerToken, showWarning, warningThreshold, criticalThreshold, showCost, showBar, onWarning, onCritical, suggestPruning, onPruneSuggested, size, className, }: TokenCounterProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=token-counter.d.ts.map