'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * PreviewPane Component
 *
 * Right pane showing the chat preview and debug views.
 */
import * as React from 'react';
import { AnimatePresence } from 'framer-motion';
import { cn } from '../../../../utils/cn';
import { PreviewMessage } from './PreviewMessage';
import { DebugView } from './DebugView';
/**
 * Preview pane with messages and debug view
 */
export function PreviewPane({ messages, isStreaming, streamingContent, error, showDebugView, debugViewMode, onDebugModeChange, onToggleDebugView, systemPromptTemplate, userPromptTemplate, compiledSystemPrompt, compiledUserPrompt, variableValues, messagesArray, className, }) {
    const messagesEndRef = React.useRef(null);
    // Auto-scroll to bottom when streaming
    React.useEffect(() => {
        if (isStreaming && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [isStreaming, streamingContent]);
    return (_jsxs("div", { className: cn('flex flex-col h-full', className), children: [_jsxs("div", { className: "flex items-center justify-between px-4 py-3 border-b border-border", children: [_jsx("h3", { className: "text-sm font-medium text-foreground", children: "Preview" }), _jsx("button", { type: "button", onClick: onToggleDebugView, "aria-pressed": showDebugView, "aria-label": showDebugView ? 'Hide debug view' : 'Show debug view', className: cn('px-3 py-1 text-xs font-medium rounded-md', 'transition-colors duration-200', 'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50', showDebugView
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground hover:text-foreground'), children: showDebugView ? 'Hide Debug' : 'Show Debug' })] }), _jsx("div", { className: "flex-1 overflow-auto p-4", children: showDebugView ? (_jsx(DebugView, { mode: debugViewMode, onModeChange: onDebugModeChange, systemPromptTemplate: systemPromptTemplate, userPromptTemplate: userPromptTemplate, compiledSystemPrompt: compiledSystemPrompt, compiledUserPrompt: compiledUserPrompt, variableValues: variableValues, messagesArray: messagesArray })) : (_jsxs("div", { className: "space-y-4", children: [messages.length === 0 && !isStreaming && (_jsxs("div", { className: "flex flex-col items-center justify-center h-64 text-center", children: [_jsx("div", { className: "text-4xl mb-4", children: "\uD83D\uDE80" }), _jsx("h4", { className: "text-lg font-medium text-foreground mb-2", children: "Ready to Run" }), _jsx("p", { className: "text-sm text-muted-foreground max-w-xs", children: "Click \"Run Prompt\" to see the compiled messages and get a response from the AI." })] })), _jsx("div", { "aria-live": "polite", "aria-atomic": "false", children: _jsxs(AnimatePresence, { mode: "popLayout", children: [messages.map((message) => (_jsx(PreviewMessage, { message: message }, message.id))), isStreaming && streamingContent && (_jsx(PreviewMessage, { message: {
                                            id: 'streaming',
                                            role: 'assistant',
                                            content: streamingContent,
                                            isCompiled: true,
                                            timestamp: new Date(),
                                        }, isStreaming: true, streamingContent: streamingContent }, "streaming"))] }) }), error && (_jsxs("div", { role: "alert", "aria-live": "assertive", className: "p-4 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm", children: [_jsx("strong", { children: "Error:" }), " ", error] })), _jsx("div", { ref: messagesEndRef })] })) })] }));
}
export default PreviewPane;
//# sourceMappingURL=PreviewPane.js.map