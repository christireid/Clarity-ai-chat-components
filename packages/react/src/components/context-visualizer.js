import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
/**
 * Get exclusion reason label
 */
function getExclusionLabel(reason) {
    switch (reason) {
        case 'token_limit':
            return 'Excluded: Token limit';
        case 'pruned':
            return 'Pruned by user';
        case 'too_old':
            return 'Too old';
        case 'manual':
            return 'Manually excluded';
        default:
            return 'Excluded';
    }
}
/**
 * Format timestamp
 */
function formatTimestamp(timestamp) {
    if (!timestamp)
        return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    if (diff < 60000)
        return 'Just now';
    if (diff < 3600000)
        return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000)
        return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
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
export function ContextVisualizer({ messages, maxTokens, currentTokens, showTokens = true, highlightIncluded = true, onPrune, onToggleMessage, showPruneSuggestions = false, viewMode = 'compact', className = '', }) {
    const includedMessages = messages.filter((m) => m.isIncluded);
    const excludedMessages = messages.filter((m) => !m.isIncluded);
    const percentage = Math.min((currentTokens / maxTokens) * 100, 100);
    const isNearLimit = percentage >= 80;
    // Find messages to suggest pruning (oldest excluded)
    const pruneSuggestions = React.useMemo(() => {
        return excludedMessages
            .sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0))
            .slice(0, 5);
    }, [excludedMessages]);
    const handlePruneAll = () => {
        if (pruneSuggestions.length > 0) {
            onPrune?.(pruneSuggestions.map((m) => m.id));
        }
    };
    return (_jsxs("div", { className: `flex flex-col gap-4 p-4 bg-card rounded-lg border border-border shadow-sm ${className}`, role: "region", "aria-label": "Context window visualization", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("svg", { className: "w-5 h-5 text-muted-foreground", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: [_jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z" }), _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" })] }), _jsx("h3", { className: "text-lg font-semibold text-foreground", children: "Context Window" })] }), _jsxs("div", { className: "text-sm text-muted-foreground", children: [includedMessages.length, " of ", messages.length, " messages"] })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { className: "text-muted-foreground", children: "Token Usage" }), _jsxs("span", { className: `font-medium ${isNearLimit ? 'text-[hsl(var(--warning))]' : 'text-foreground'}`, children: [currentTokens.toLocaleString(), " / ", maxTokens.toLocaleString()] })] }), _jsx("div", { className: "relative w-full h-2 bg-muted rounded-full overflow-hidden", children: _jsx("div", { className: `h-full transition-all duration-200 ${percentage >= 95
                                ? 'bg-destructive'
                                : percentage >= 80
                                    ? 'bg-[hsl(var(--warning))]'
                                    : 'bg-[hsl(var(--success))]'}`, style: { width: `${percentage}%` }, role: "progressbar", "aria-valuenow": currentTokens, "aria-valuemin": 0, "aria-valuemax": maxTokens }) }), _jsxs("div", { className: "text-xs text-muted-foreground", children: [percentage.toFixed(1), "% of context window used"] })] }), _jsx("div", { className: "space-y-3 max-h-96 overflow-y-auto", children: messages.map((message) => (_jsx("div", { className: `p-3 rounded-lg border transition-all duration-200 ${message.isIncluded
                        ? highlightIncluded
                            ? 'bg-[hsl(var(--success))]/10 border-[hsl(var(--success))]/20'
                            : 'bg-muted/50 border-border'
                        : 'bg-muted/30 border-border opacity-60'}`, children: _jsxs("div", { className: "flex items-start justify-between gap-2", children: [_jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx("span", { className: `px-2 py-0.5 text-xs font-medium rounded ${message.role === 'user'
                                                    ? 'bg-primary/10 text-primary'
                                                    : message.role === 'assistant'
                                                        ? 'bg-secondary/10 text-secondary-foreground'
                                                        : 'bg-muted text-muted-foreground'}`, children: message.role }), showTokens && message.tokens && (_jsxs("span", { className: "text-xs text-muted-foreground", children: [message.tokens, " tokens"] })), message.timestamp && (_jsx("span", { className: "text-xs text-muted-foreground/70", children: formatTimestamp(message.timestamp) })), message.isIncluded ? (_jsxs("span", { className: "text-xs text-[hsl(var(--success))] flex items-center gap-1", children: [_jsx("svg", { className: "w-3 h-3", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { fillRule: "evenodd", d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z", clipRule: "evenodd" }) }), "Included"] })) : (_jsx("span", { className: "text-xs text-muted-foreground", children: getExclusionLabel(message.exclusionReason) }))] }), viewMode === 'detailed' && (_jsx("p", { className: "text-sm text-muted-foreground line-clamp-2", children: message.content }))] }), onToggleMessage && (_jsx("button", { onClick: () => onToggleMessage(message.id, !message.isIncluded), className: `px-2 py-1 text-xs rounded transition-colors duration-200 ${message.isIncluded
                                    ? 'bg-destructive/10 text-destructive hover:bg-destructive/20'
                                    : 'bg-[hsl(var(--success))]/10 text-[hsl(var(--success))] hover:bg-[hsl(var(--success))]/20'}`, "aria-label": message.isIncluded ? 'Exclude message' : 'Include message', children: message.isIncluded ? 'Exclude' : 'Include' }))] }) }, message.id))) }), showPruneSuggestions && pruneSuggestions.length > 0 && onPrune && (_jsx("div", { className: "p-3 bg-[hsl(var(--warning))]/10 border border-[hsl(var(--warning))]/20 rounded-lg", children: _jsxs("div", { className: "flex items-start gap-2", children: [_jsx("svg", { className: "w-5 h-5 text-[hsl(var(--warning))] flex-shrink-0 mt-0.5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-sm font-medium text-foreground", children: "Consider pruning old messages" }), _jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [pruneSuggestions.length, " old messages are excluded from context. You can permanently delete them to clean up."] }), _jsxs("button", { onClick: handlePruneAll, className: "mt-2 px-3 py-1 bg-[hsl(var(--warning))] hover:opacity-90 text-[hsl(var(--warning-foreground))] text-xs rounded transition-all duration-200", children: ["Prune ", pruneSuggestions.length, " messages"] })] })] }) })), _jsxs("div", { className: "flex gap-4 pt-3 border-t border-border", children: [_jsxs("div", { className: "flex-1 text-center", children: [_jsx("div", { className: "text-2xl font-bold text-[hsl(var(--success))]", children: includedMessages.length }), _jsx("div", { className: "text-xs text-muted-foreground", children: "Included" })] }), _jsxs("div", { className: "flex-1 text-center", children: [_jsx("div", { className: "text-2xl font-bold text-muted-foreground", children: excludedMessages.length }), _jsx("div", { className: "text-xs text-muted-foreground", children: "Excluded" })] }), _jsxs("div", { className: "flex-1 text-center", children: [_jsx("div", { className: "text-2xl font-bold text-primary", children: currentTokens }), _jsx("div", { className: "text-xs text-muted-foreground", children: "Tokens" })] })] })] }));
}
//# sourceMappingURL=context-visualizer.js.map