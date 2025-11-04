/**
 * Message for context visualization
 */
export interface ContextVisualizerMessage {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    tokens?: number;
    timestamp?: number;
    /** Whether this message is included in context */
    isIncluded: boolean;
    /** Reason for exclusion if not included */
    exclusionReason?: 'token_limit' | 'pruned' | 'too_old' | 'manual';
}
/**
 * Context visualizer props
 */
export interface ContextVisualizerProps {
    /** All messages in conversation */
    messages: ContextVisualizerMessage[];
    /** Maximum tokens for context */
    maxTokens: number;
    /** Current token count */
    currentTokens: number;
    /** Show token counts for each message */
    showTokens?: boolean;
    /** Highlight included messages */
    highlightIncluded?: boolean;
    /** Callback when prune is requested */
    onPrune?: (messageIds: string[]) => void;
    /** Callback when message is toggled */
    onToggleMessage?: (messageId: string, include: boolean) => void;
    /** Show prune suggestions */
    showPruneSuggestions?: boolean;
    /** View mode */
    viewMode?: 'compact' | 'detailed';
    /** Custom CSS class */
    className?: string;
}
/**
 * Production-ready Context Visualizer component.
 *
 * **Features:**
 * - Visual display of included/excluded messages
 * - Token counts per message
 * - Exclusion reasons
 * - Manual message inclusion toggle
 * - Prune suggestions
 * - Compact and detailed view modes
 * - Token usage progress bar
 *
 * **Use Cases:**
 * - Show users what AI "sees" in context
 * - Help debug context issues
 * - Allow manual context control
 * - Visualize token usage per message
 *
 * @example
 * ```tsx
 * // Basic usage
 * <ContextVisualizer
 *   messages={messages}
 *   maxTokens={8192}
 *   currentTokens={6200}
 * />
 *
 * // With pruning
 * <ContextVisualizer
 *   messages={messages}
 *   maxTokens={8192}
 *   currentTokens={7500}
 *   showPruneSuggestions={true}
 *   onPrune={(ids) => {
 *     ids.forEach(id => deleteMessage(id))
 *   }}
 * />
 *
 * // With manual control
 * <ContextVisualizer
 *   messages={messages}
 *   maxTokens={8192}
 *   currentTokens={6200}
 *   onToggleMessage={(id, include) => {
 *     updateMessageInclusion(id, include)
 *   }}
 * />
 *
 * // Detailed view with tokens
 * <ContextVisualizer
 *   messages={messages}
 *   maxTokens={8192}
 *   currentTokens={6200}
 *   viewMode="detailed"
 *   showTokens={true}
 *   highlightIncluded={true}
 * />
 * ```
 */
export declare function ContextVisualizer({ messages, maxTokens, currentTokens, showTokens, highlightIncluded, onPrune, onToggleMessage, showPruneSuggestions, viewMode, className, }: ContextVisualizerProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=context-visualizer.d.ts.map