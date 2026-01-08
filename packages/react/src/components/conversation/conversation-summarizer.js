'use client';
import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription, Badge, cn, } from '@clarity-chat/primitives';
import { Skeleton, SkeletonText } from '../ui/skeleton';
import { DURATION_SECONDS as durations } from '../../animations/constants';
const defaultConfig = {
    trigger: 'manual',
    interval: 10, // Every 10 messages
    levels: ['brief', 'detailed', 'comprehensive'],
    provider: {
        type: 'openai',
        model: 'gpt-4o',
    },
    includeActionItems: true,
    includeKeyTopics: true,
    includeCodeSnippets: false,
    maxLength: {
        brief: 50,
        detailed: 200,
        comprehensive: 500,
    },
};
/**
 * ConversationSummarizer Component
 *
 * Generates AI-powered summaries of conversations at different detail levels.
 * Supports automatic, interval-based, and manual summary generation.
 *
 * Features:
 * - Multi-level summaries (brief, detailed, comprehensive)
 * - Key topics extraction
 * - Action items identification
 * - Code snippet extraction
 * - Summary history tracking
 * - Export functionality
 *
 * @example
 * ```tsx
 * <ConversationSummarizer
 *   messages={messages}
 *   config={{
 *     trigger: 'manual',
 *     provider: { type: 'openai', model: 'gpt-4o' },
 *     includeActionItems: true,
 *     includeKeyTopics: true,
 *   }}
 *   onSummaryGenerated={(summary) => {
 *     console.log('Summary:', summary.content)
 *   }}
 * />
 * ```
 */
export function ConversationSummarizer({ messages, config: userConfig, onSummaryGenerated, onGenerateSummary, showHistory = true, defaultLevel = 'detailed', emptyState, className, }) {
    const config = { ...defaultConfig, ...userConfig };
    const [currentSummary, setCurrentSummary] = React.useState(null);
    const [summaryHistory, setSummaryHistory] = React.useState([]);
    const [selectedLevel, setSelectedLevel] = React.useState(defaultLevel);
    const [isGenerating, setIsGenerating] = React.useState(false);
    const [error, setError] = React.useState(null);
    /**
     * Generate summary using built-in logic (fallback)
     */
    const generateSummaryFallback = React.useCallback(async (msgs, level) => {
        // Simple rule-based summarization as fallback
        // In production, this would call an LLM API
        const userMessages = msgs.filter((m) => m.role === 'user');
        const assistantMessages = msgs.filter((m) => m.role === 'assistant');
        // Extract key topics (simple keyword extraction)
        const allContent = msgs.map((m) => m.content.toLowerCase()).join(' ');
        const keywords = allContent
            .split(/\s+/)
            .filter((word) => word.length > 5)
            .reduce((acc, word) => {
            acc[word] = (acc[word] || 0) + 1;
            return acc;
        }, {});
        const keyTopics = Object.entries(keywords)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([word]) => word);
        // Extract action items (simple pattern matching)
        const actionItems = [];
        msgs.forEach((msg) => {
            const content = msg.content;
            const patterns = [
                /(?:I will|I'll|I should|I need to|TODO:|Action:)\s+([^.!?\n]+)/gi,
                /(?:Next step:?|Following:?|Then:?)\s+([^.!?\n]+)/gi,
            ];
            patterns.forEach((pattern) => {
                const matches = content.matchAll(pattern);
                for (const match of matches) {
                    if (match[1])
                        actionItems.push(match[1].trim());
                }
            });
        });
        // Extract code snippets
        const codeSnippets = [];
        if (config.includeCodeSnippets) {
            const codeBlockPattern = /```(\w+)?\n([\s\S]*?)```/g;
            msgs.forEach((msg) => {
                const matches = msg.content.matchAll(codeBlockPattern);
                for (const match of matches) {
                    const codeContent = match[2];
                    if (codeContent) {
                        codeSnippets.push({
                            language: match[1] || 'plaintext',
                            code: codeContent.trim(),
                            description: 'Code snippet from conversation',
                        });
                    }
                }
            });
        }
        // Generate summary content based on level
        let summaryContent = '';
        const maxLength = config.maxLength?.[level] || 200;
        if (level === 'brief') {
            summaryContent = `Conversation with ${userMessages.length} user messages and ${assistantMessages.length} assistant responses. `;
            if (keyTopics.length > 0) {
                summaryContent += `Main topics: ${keyTopics.slice(0, 3).join(', ')}.`;
            }
        }
        else if (level === 'detailed') {
            summaryContent = `This conversation covered ${msgs.length} messages exchanged between the user and assistant. `;
            summaryContent += `The user asked about ${keyTopics.slice(0, 3).join(', ')}. `;
            if (actionItems.length > 0) {
                summaryContent += `Key action items identified: ${actionItems.slice(0, 2).join('; ')}. `;
            }
            summaryContent += `The assistant provided ${assistantMessages.length} detailed responses addressing these topics.`;
        }
        else {
            // comprehensive
            summaryContent = `Comprehensive Summary:\n\n`;
            summaryContent += `This conversation consisted of ${msgs.length} messages (${userMessages.length} from user, ${assistantMessages.length} from assistant).\n\n`;
            summaryContent += `Topics Covered:\n${keyTopics.map((t) => `- ${t}`).join('\n')}\n\n`;
            if (actionItems.length > 0) {
                summaryContent += `Action Items:\n${actionItems.map((a) => `- ${a}`).join('\n')}\n\n`;
            }
            if (codeSnippets.length > 0) {
                summaryContent += `Code Examples: ${codeSnippets.length} code snippets were shared.\n\n`;
            }
            summaryContent += `The conversation explored these topics in depth, with the assistant providing detailed explanations and examples.`;
        }
        // Truncate if needed
        const words = summaryContent.split(/\s+/);
        if (words.length > maxLength) {
            summaryContent = words.slice(0, maxLength).join(' ') + '...';
        }
        return {
            id: `summary-${Date.now()}`,
            level,
            content: summaryContent,
            keyTopics: config.includeKeyTopics ? keyTopics : undefined,
            actionItems: config.includeActionItems
                ? actionItems.slice(0, 5)
                : undefined,
            codeSnippets: config.includeCodeSnippets
                ? codeSnippets.slice(0, 3)
                : undefined,
            messageRange: {
                start: 0,
                end: msgs.length - 1,
                totalMessages: msgs.length,
            },
            timestamp: Date.now(),
            generationTime: 500,
        };
    }, [
        config.maxLength,
        config.includeActionItems,
        config.includeKeyTopics,
        config.includeCodeSnippets,
    ]);
    /**
     * Generate summary
     */
    const generateSummary = React.useCallback(async (level) => {
        if (messages.length === 0) {
            setError('No messages to summarize');
            return;
        }
        setIsGenerating(true);
        setError(null);
        const startTime = Date.now();
        try {
            let summary;
            if (onGenerateSummary) {
                // Use custom summarization logic
                summary = await onGenerateSummary(messages, level);
            }
            else {
                // Use fallback logic
                summary = await generateSummaryFallback(messages, level);
            }
            summary.generationTime = Date.now() - startTime;
            setCurrentSummary(summary);
            setSummaryHistory((prev) => [summary, ...prev].slice(0, 10)); // Keep last 10
            onSummaryGenerated?.(summary);
        }
        catch (err) {
            console.error('Failed to generate summary:', err);
            setError(err instanceof Error ? err.message : 'Failed to generate summary');
        }
        finally {
            setIsGenerating(false);
        }
    }, [messages, onGenerateSummary, generateSummaryFallback, onSummaryGenerated]);
    /**
     * Auto-generate summary based on interval
     */
    React.useEffect(() => {
        if (config.trigger === 'auto' || config.trigger === 'interval') {
            const interval = config.interval || 10;
            const shouldGenerate = messages.length > 0 && messages.length % interval === 0;
            if (shouldGenerate) {
                generateSummary(selectedLevel);
            }
        }
    }, [
        messages.length,
        config.trigger,
        config.interval,
        selectedLevel,
        generateSummary,
    ]);
    /**
     * Export summary
     */
    const exportSummary = React.useCallback((summary) => {
        const text = `
# Conversation Summary (${summary.level})
Generated: ${new Date(summary.timestamp).toLocaleString()}

${summary.content}

${summary.keyTopics && summary.keyTopics.length > 0
            ? `\n## Key Topics\n${summary.keyTopics.map((t) => `- ${t}`).join('\n')}`
            : ''}

${summary.actionItems && summary.actionItems.length > 0
            ? `\n## Action Items\n${summary.actionItems.map((a) => `- ${a}`).join('\n')}`
            : ''}

${summary.codeSnippets && summary.codeSnippets.length > 0
            ? `\n## Code Snippets\n${summary.codeSnippets.map((s, i) => `\n### Snippet ${i + 1} (${s.language})\n\`\`\`${s.language}\n${s.code}\n\`\`\``).join('\n')}`
            : ''}

---
Messages: ${summary.messageRange.totalMessages}
Generation Time: ${summary.generationTime}ms
    `.trim();
        const blob = new Blob([text], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `conversation-summary-${summary.id}.md`;
        a.click();
        URL.revokeObjectURL(url);
    }, []);
    // Empty state
    if (messages.length === 0) {
        if (emptyState)
            return _jsx(_Fragment, { children: emptyState });
        return (_jsx(Card, { className: cn('shadow-sm', className), children: _jsx(CardContent, { className: "p-8 text-center", children: _jsx("p", { className: "text-sm text-muted-foreground", children: "Start a conversation to generate summaries" }) }) }));
    }
    return (_jsxs("div", { className: cn('space-y-4', className), children: [_jsxs(Card, { className: "shadow-sm", children: [_jsx(CardHeader, { children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary", children: _jsx("svg", { className: "h-5 w-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" }) }) }), _jsxs("div", { children: [_jsx(CardTitle, { className: "text-base", children: "Conversation Summary" }), _jsxs(CardDescription, { className: "text-xs", children: [messages.length, " messages \u2022 Generate AI-powered summaries"] })] })] }), _jsx(Badge, { variant: "secondary", children: config.trigger })] }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsx("div", { className: "flex flex-wrap gap-2", children: config.levels.map((level) => (_jsx(Button, { variant: selectedLevel === level ? 'default' : 'outline', size: "sm", onClick: () => setSelectedLevel(level), disabled: isGenerating, children: level.charAt(0).toUpperCase() + level.slice(1) }, level))) }), _jsx(Button, { onClick: () => generateSummary(selectedLevel), disabled: isGenerating || messages.length === 0, className: "w-full", children: isGenerating ? (_jsxs(_Fragment, { children: [_jsx(motion.div, { className: "mr-2 h-4 w-4 rounded-full border-2 border-white border-t-transparent", animate: { rotate: 360 }, transition: {
                                                duration: durations.slower,
                                                repeat: Infinity,
                                                ease: 'linear',
                                            } }), "Generating..."] })) : ('Generate Summary') }), error && (_jsx(motion.div, { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, className: "rounded-lg bg-destructive/10 p-3 text-sm text-destructive", children: error }))] })] }), _jsx(AnimatePresence, { mode: "wait", children: currentSummary && (_jsx(motion.div, { initial: { opacity: 0, y: 20, scale: 0.95 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: -20, scale: 0.95 }, transition: { duration: durations.moderate }, children: _jsxs(Card, { className: "shadow-md", children: [_jsx(CardHeader, { children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsx("div", { className: "flex-1", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Badge, { variant: "default", children: currentSummary.level }), _jsx(Badge, { variant: "outline", children: new Date(currentSummary.timestamp).toLocaleTimeString() }), currentSummary.generationTime && (_jsxs(Badge, { variant: "secondary", children: [currentSummary.generationTime, "ms"] }))] }) }), _jsx(Button, { variant: "ghost", size: "icon", onClick: () => exportSummary(currentSummary), "aria-label": "Export summary", children: _jsx("svg", { className: "h-4 w-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" }) }) })] }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsx("div", { className: "prose prose-sm dark:prose-invert max-w-none", children: _jsx("p", { className: "text-sm leading-relaxed text-foreground", children: currentSummary.content }) }), currentSummary.keyTopics &&
                                        currentSummary.keyTopics.length > 0 && (_jsxs("div", { children: [_jsx("h4", { className: "text-sm font-semibold mb-2 text-foreground", children: "Key Topics" }), _jsx("div", { className: "flex flex-wrap gap-2", children: currentSummary.keyTopics.map((topic, i) => (_jsx(Badge, { variant: "secondary", children: topic }, i))) })] })), currentSummary.actionItems &&
                                        currentSummary.actionItems.length > 0 && (_jsxs("div", { children: [_jsx("h4", { className: "text-sm font-semibold mb-2 text-foreground", children: "Action Items" }), _jsx("ul", { className: "space-y-1 text-sm text-muted-foreground", children: currentSummary.actionItems.map((item, i) => (_jsxs("li", { className: "flex items-start gap-2", children: [_jsx("span", { className: "text-primary", children: "\u2022" }), _jsx("span", { children: item })] }, i))) })] })), currentSummary.codeSnippets &&
                                        currentSummary.codeSnippets.length > 0 && (_jsxs("div", { children: [_jsxs("h4", { className: "text-sm font-semibold mb-2 text-foreground", children: ["Code Snippets (", currentSummary.codeSnippets.length, ")"] }), _jsx("div", { className: "text-xs text-muted-foreground", children: "View code examples in the conversation above" })] })), _jsxs("div", { className: "text-xs text-muted-foreground border-t pt-3", children: ["Summarizes messages ", currentSummary.messageRange.start + 1, " -", ' ', currentSummary.messageRange.end + 1, " of", ' ', currentSummary.messageRange.totalMessages] })] })] }) }, currentSummary.id)) }), isGenerating && !currentSummary && (_jsx(Card, { className: "shadow-sm", children: _jsxs(CardContent, { className: "p-6 space-y-4", children: [_jsx(Skeleton, { width: "100%", height: 20 }), _jsx(SkeletonText, { lines: 4 }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Skeleton, { width: 80, height: 24, rounded: "full" }), _jsx(Skeleton, { width: 80, height: 24, rounded: "full" }), _jsx(Skeleton, { width: 80, height: 24, rounded: "full" })] })] }) })), showHistory && summaryHistory.length > 1 && (_jsxs(Card, { className: "shadow-sm", children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { className: "text-sm", children: "Summary History" }), _jsxs(CardDescription, { className: "text-xs", children: [summaryHistory.length, " previous summaries"] })] }), _jsx(CardContent, { className: "space-y-2", children: summaryHistory.slice(1, 4).map((summary) => (_jsxs(motion.button, { className: "w-full text-left rounded-lg border p-3 hover:bg-accent transition-colors", onClick: () => setCurrentSummary(summary), whileHover: { scale: 1.01 }, whileTap: { scale: 0.99 }, children: [_jsxs("div", { className: "flex items-center justify-between mb-1", children: [_jsx(Badge, { variant: "outline", className: "text-xs", children: summary.level }), _jsx("span", { className: "text-xs text-muted-foreground", children: new Date(summary.timestamp).toLocaleTimeString() })] }), _jsx("p", { className: "text-sm text-muted-foreground line-clamp-2", children: summary.content })] }, summary.id))) })] }))] }));
}
ConversationSummarizer.displayName = 'ConversationSummarizer';
//# sourceMappingURL=conversation-summarizer.js.map