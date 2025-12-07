'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Badge, Button, cn, } from '@clarity-chat/primitives';
/**
 * Extract topics using simple keyword clustering
 */
function extractTopics(messages) {
    const allContent = messages.map(m => m.content.toLowerCase()).join(' ');
    // Common stopwords to ignore
    const stopwords = new Set([
        'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
        'of', 'with', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
        'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
        'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those',
        'i', 'you', 'he', 'she', 'it', 'we', 'they', 'what', 'which', 'who',
        'when', 'where', 'why', 'how', 'all', 'each', 'every', 'both', 'few',
    ]);
    // Extract words and count frequency
    const wordFreq = new Map();
    const words = allContent.match(/\b\w{4,}\b/g) || [];
    words.forEach(word => {
        if (!stopwords.has(word)) {
            wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
        }
    });
    // Get top keywords
    const topKeywords = Array.from(wordFreq.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20)
        .map(([word]) => word);
    // Simple topic clustering based on keyword co-occurrence
    const topics = [];
    // Predefined topic patterns (in production, use LLM or ML clustering)
    const topicPatterns = [
        { name: 'Programming', keywords: ['code', 'function', 'program', 'debug', 'error', 'bug'] },
        { name: 'Design', keywords: ['design', 'interface', 'user', 'experience', 'layout'] },
        { name: 'Data', keywords: ['data', 'database', 'query', 'analysis', 'chart'] },
        { name: 'Help/Support', keywords: ['help', 'question', 'issue', 'problem', 'solve'] },
        { name: 'Planning', keywords: ['plan', 'schedule', 'timeline', 'task', 'project'] },
    ];
    topicPatterns.forEach(pattern => {
        const matchingKeywords = topKeywords.filter(kw => pattern.keywords.some(pk => kw.includes(pk) || pk.includes(kw)));
        if (matchingKeywords.length > 0) {
            const messageCount = messages.filter(m => matchingKeywords.some(kw => m.content.toLowerCase().includes(kw))).length;
            topics.push({
                name: pattern.name,
                confidence: Math.min(matchingKeywords.length / pattern.keywords.length, 1),
                messageCount,
                keywords: matchingKeywords.slice(0, 5),
            });
        }
    });
    return topics.sort((a, b) => b.messageCount - a.messageCount);
}
/**
 * Analyze sentiment over time
 */
function analyzeSentiment(messages) {
    const timeline = [];
    // Simple sentiment lexicon
    const positiveWords = new Set([
        'good', 'great', 'excellent', 'perfect', 'amazing', 'wonderful', 'fantastic',
        'helpful', 'thanks', 'thank', 'appreciate', 'love', 'best', 'awesome',
        'brilliant', 'impressive', 'outstanding',
    ]);
    const negativeWords = new Set([
        'bad', 'terrible', 'awful', 'horrible', 'wrong', 'error', 'issue', 'problem',
        'fail', 'broken', 'bug', 'difficult', 'hard', 'confusing', 'frustrated',
        'disappointed', 'poor', 'worst',
    ]);
    messages.forEach((message, index) => {
        const content = message.content.toLowerCase();
        const words = content.split(/\s+/);
        let positiveCount = 0;
        let negativeCount = 0;
        words.forEach(word => {
            if (positiveWords.has(word))
                positiveCount++;
            if (negativeWords.has(word))
                negativeCount++;
        });
        const total = positiveCount + negativeCount;
        const score = total === 0 ? 0 : (positiveCount - negativeCount) / total;
        let label = 'neutral';
        if (score > 0.2)
            label = 'positive';
        if (score < -0.2)
            label = 'negative';
        timeline.push({
            timestamp: Date.now() - (messages.length - index) * 60000, // Mock timestamps
            score,
            label,
        });
    });
    // Calculate overall sentiment
    const avgScore = timeline.reduce((sum, point) => sum + point.score, 0) / timeline.length;
    const overall = avgScore > 0.2 ? 'positive' : avgScore < -0.2 ? 'negative' : 'neutral';
    return {
        timeline,
        overall,
        confidence: Math.abs(avgScore),
    };
}
/**
 * Calculate conversation quality metrics
 */
function calculateQuality(messages) {
    if (messages.length === 0) {
        return {
            score: 0,
            factors: { engagement: 0, coherence: 0, depth: 0, efficiency: 0 },
        };
    }
    // Engagement: based on message frequency and length
    const avgMessageLength = messages.reduce((sum, m) => sum + m.content.length, 0) / messages.length;
    const engagement = Math.min((avgMessageLength / 100) * 100, 100);
    // Coherence: based on keyword continuity
    const coherence = messages.length > 1 ? 75 : 50; // Simplified
    // Depth: based on message length and question count
    const questionCount = messages.filter(m => m.content.includes('?')).length;
    const depth = Math.min((questionCount / messages.length) * 200 + 30, 100);
    // Efficiency: based on conversation flow
    const efficiency = Math.min((messages.length / 10) * 100, 100);
    const score = (engagement + coherence + depth + efficiency) / 4;
    return {
        score,
        factors: { engagement, coherence, depth, efficiency },
    };
}
/**
 * Detect key moments in conversation
 */
function detectKeyMoments(messages) {
    const moments = [];
    messages.forEach((message, index) => {
        const content = message.content.toLowerCase();
        // Detect questions (potential confusion or request for clarity)
        if (content.includes('?')) {
            moments.push({
                timestamp: Date.now() - (messages.length - index) * 60000,
                messageId: message.id,
                type: 'question',
                description: 'Question asked',
                importance: 0.6,
            });
        }
        // Detect breakthroughs (positive language + length)
        if (message.content.length > 200 &&
            (content.includes('understand') || content.includes('got it') || content.includes('makes sense'))) {
            moments.push({
                timestamp: Date.now() - (messages.length - index) * 60000,
                messageId: message.id,
                type: 'breakthrough',
                description: 'Understanding achieved',
                importance: 0.8,
            });
        }
        // Detect decisions
        if (content.includes('decided') || content.includes('will do') || content.includes('going to')) {
            moments.push({
                timestamp: Date.now() - (messages.length - index) * 60000,
                messageId: message.id,
                type: 'decision',
                description: 'Decision made',
                importance: 0.9,
            });
        }
    });
    return moments.sort((a, b) => b.importance - a.importance).slice(0, 5);
}
/**
 * Generate conversation summary
 */
function generateSummary(messages) {
    const keyPoints = [];
    const nextSteps = [];
    const openQuestions = [];
    messages.forEach(message => {
        const content = message.content;
        // Extract questions
        if (content.includes('?')) {
            const questions = content.split('?').filter(q => q.trim());
            openQuestions.push(...questions.map(q => q.trim() + '?'));
        }
        // Extract action items
        const actionPatterns = [
            /(?:I will|I'll|we should|need to|going to)\s+([^.!?\n]+)/gi,
            /(?:TODO:|Action:)\s+([^.!?\n]+)/gi,
        ];
        actionPatterns.forEach(pattern => {
            const matches = content.matchAll(pattern);
            for (const match of matches) {
                if (match[1])
                    nextSteps.push(match[1].trim());
            }
        });
        // Key points (sentences with important keywords)
        if (content.includes('important') ||
            content.includes('key') ||
            content.includes('main') ||
            content.includes('critical')) {
            const sentences = content.split(/[.!]/).filter(s => s.trim());
            keyPoints.push(...sentences.slice(0, 2).map(s => s.trim()));
        }
    });
    return {
        keyPoints: keyPoints.slice(0, 5),
        nextSteps: nextSteps.slice(0, 5),
        openQuestions: openQuestions.slice(0, 5),
    };
}
/**
 * ConversationAnalyticsDashboard Component
 *
 * Provides AI-powered insights into conversation patterns, topics, sentiment,
 * and quality metrics.
 *
 * Features:
 * - Topic extraction and clustering
 * - Sentiment analysis over time
 * - Conversation quality scoring
 * - Key moment detection
 * - Automatic summarization
 * - Visual analytics dashboard
 *
 * @example
 * ```tsx
 * <ConversationAnalyticsDashboard
 *   messages={messages}
 *   autoGenerate
 *   updateInterval={30000}
 *   onGenerateAnalytics={async (messages) => {
 *     const response = await fetch('/api/analyze', {
 *       method: 'POST',
 *       body: JSON.stringify({ messages }),
 *     })
 *     return response.json()
 *   }}
 * />
 * ```
 */
export function ConversationAnalyticsDashboard({ messages, analytics: externalAnalytics, onGenerateAnalytics, autoGenerate = false, updateInterval = 30000, onAnalyticsGenerated, detailed = false, className, }) {
    const [analytics, setAnalytics] = React.useState(externalAnalytics || null);
    const [isGenerating, setIsGenerating] = React.useState(false);
    const [error, setError] = React.useState(null);
    /**
     * Generate analytics using fallback logic
     */
    const generateAnalyticsFallback = React.useCallback((msgs) => {
        return {
            topics: extractTopics(msgs),
            sentiment: analyzeSentiment(msgs),
            quality: calculateQuality(msgs),
            keyMoments: detectKeyMoments(msgs),
            summary: generateSummary(msgs),
            metadata: {
                totalMessages: msgs.length,
                duration: msgs.length * 60000, // Mock duration
                participantCount: new Set(msgs.map(m => m.role)).size,
                averageMessageLength: msgs.reduce((sum, m) => sum + m.content.length, 0) / msgs.length || 0,
            },
        };
    }, []);
    /**
     * Generate analytics
     */
    const generateAnalytics = React.useCallback(async () => {
        if (messages.length === 0)
            return;
        setIsGenerating(true);
        setError(null);
        try {
            let result;
            if (onGenerateAnalytics) {
                result = await onGenerateAnalytics(messages);
            }
            else {
                result = generateAnalyticsFallback(messages);
            }
            setAnalytics(result);
            onAnalyticsGenerated?.(result);
        }
        catch (err) {
            console.error('Analytics generation error:', err);
            setError(err instanceof Error ? err.message : 'Failed to generate analytics');
        }
        finally {
            setIsGenerating(false);
        }
    }, [messages, onGenerateAnalytics, generateAnalyticsFallback, onAnalyticsGenerated]);
    // Auto-generate on interval
    React.useEffect(() => {
        if (autoGenerate && messages.length > 0) {
            generateAnalytics();
            const interval = setInterval(generateAnalytics, updateInterval);
            return () => clearInterval(interval);
        }
    }, [autoGenerate, messages.length, updateInterval, generateAnalytics]);
    if (messages.length === 0) {
        return (_jsx(Card, { className: cn('shadow-sm', className), children: _jsx(CardContent, { className: "p-8 text-center text-muted-foreground", children: "Start a conversation to see analytics" }) }));
    }
    return (_jsxs("div", { className: cn('space-y-4', className), children: [_jsx(Card, { className: "shadow-sm", children: _jsx(CardHeader, { children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary", children: _jsx("svg", { className: "h-5 w-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" }) }) }), _jsxs("div", { children: [_jsx(CardTitle, { className: "text-base", children: "Conversation Analytics" }), _jsxs(CardDescription, { className: "text-xs", children: ["AI-powered insights from ", messages.length, " messages"] })] })] }), _jsx(Button, { onClick: generateAnalytics, disabled: isGenerating, size: "sm", variant: "outline", children: isGenerating ? 'Analyzing...' : 'Refresh' })] }) }) }), error && (_jsx(Card, { className: "shadow-sm border-destructive", children: _jsx(CardContent, { className: "p-4 text-sm text-destructive", children: error }) })), isGenerating && !analytics ? (_jsx(Card, { className: "shadow-sm", children: _jsxs(CardContent, { className: "p-8 text-center", children: [_jsx(motion.div, { className: "inline-block h-8 w-8 rounded-full border-2 border-primary border-t-transparent", animate: { rotate: 360 }, transition: { duration: 1, repeat: Infinity, ease: 'linear' } }), _jsx("div", { className: "mt-3 text-sm text-muted-foreground", children: "Analyzing conversation..." })] }) })) : analytics ? (_jsx(AnimatePresence, { mode: "wait", children: _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "space-y-4", children: [_jsxs(Card, { className: "shadow-sm", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-sm", children: "Conversation Quality" }) }), _jsx(CardContent, { children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "text-4xl font-bold", children: Math.round(analytics.quality.score) }), _jsxs("div", { className: "flex-1", children: [_jsx("div", { className: "h-2 w-full rounded-full bg-muted overflow-hidden", children: _jsx(motion.div, { className: "h-full bg-primary", initial: { width: 0 }, animate: { width: `${analytics.quality.score}%` }, transition: { duration: 1, ease: 'easeOut' } }) }), _jsx("div", { className: "grid grid-cols-4 gap-2 mt-3 text-xs", children: Object.entries(analytics.quality.factors).map(([key, value]) => (_jsxs("div", { children: [_jsx("div", { className: "text-muted-foreground capitalize", children: key }), _jsx("div", { className: "font-semibold", children: Math.round(value) })] }, key))) })] })] }) })] }), analytics.topics.length > 0 && (_jsxs(Card, { className: "shadow-sm", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-sm", children: "Topics Discussed" }) }), _jsx(CardContent, { className: "space-y-3", children: analytics.topics.map((topic, index) => (_jsxs(motion.div, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { delay: index * 0.1 }, className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx("span", { className: "font-medium text-sm", children: topic.name }), _jsxs(Badge, { variant: "secondary", className: "text-xs", children: [topic.messageCount, " messages"] })] }), _jsx("div", { className: "flex flex-wrap gap-1", children: topic.keywords.map(kw => (_jsx(Badge, { variant: "outline", className: "text-xs", children: kw }, kw))) })] }), _jsxs("div", { className: "text-2xl font-bold text-muted-foreground", children: [Math.round(topic.confidence * 100), "%"] })] }, topic.name))) })] })), _jsxs(Card, { className: "shadow-sm", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-sm", children: "Sentiment Analysis" }) }), _jsxs(CardContent, { children: [_jsxs("div", { className: "flex items-center gap-4 mb-4", children: [_jsx(Badge, { variant: analytics.sentiment.overall === 'positive'
                                                        ? 'success'
                                                        : analytics.sentiment.overall === 'negative'
                                                            ? 'destructive'
                                                            : 'secondary', className: "text-lg px-4 py-2", children: analytics.sentiment.overall }), _jsxs("div", { className: "text-sm text-muted-foreground", children: [Math.round(analytics.sentiment.confidence * 100), "% confidence"] })] }), detailed && (_jsx("div", { className: "h-20 flex items-end gap-1", children: analytics.sentiment.timeline.map((point, index) => (_jsx("div", { className: cn('flex-1 rounded-t', point.label === 'positive' && 'bg-green-500', point.label === 'neutral' && 'bg-gray-400', point.label === 'negative' && 'bg-red-500'), style: {
                                                    height: `${((point.score + 1) / 2) * 100}%`,
                                                }, title: `${point.label}: ${point.score.toFixed(2)}` }, index))) }))] })] }), detailed && analytics.keyMoments.length > 0 && (_jsxs(Card, { className: "shadow-sm", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-sm", children: "Key Moments" }) }), _jsx(CardContent, { className: "space-y-2", children: analytics.keyMoments.map((moment, index) => (_jsxs("div", { className: "flex items-start gap-3 p-2 rounded-lg border", children: [_jsx(Badge, { variant: moment.type === 'breakthrough'
                                                    ? 'success'
                                                    : moment.type === 'decision'
                                                        ? 'default'
                                                        : 'secondary', className: "mt-1", children: moment.type }), _jsx("div", { className: "flex-1 text-sm", children: moment.description }), _jsxs("div", { className: "text-xs text-muted-foreground", children: [Math.round(moment.importance * 100), "%"] })] }, index))) })] })), _jsxs(Card, { className: "shadow-sm", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-sm", children: "Conversation Summary" }) }), _jsxs(CardContent, { className: "space-y-4", children: [analytics.summary.keyPoints.length > 0 && (_jsxs("div", { children: [_jsx("h4", { className: "text-sm font-semibold mb-2", children: "Key Points" }), _jsx("ul", { className: "space-y-1 text-sm", children: analytics.summary.keyPoints.map((point, i) => (_jsxs("li", { className: "flex items-start gap-2", children: [_jsx("span", { className: "text-primary", children: "\u2022" }), _jsx("span", { children: point })] }, i))) })] })), analytics.summary.nextSteps.length > 0 && (_jsxs("div", { children: [_jsx("h4", { className: "text-sm font-semibold mb-2", children: "Next Steps" }), _jsx("ul", { className: "space-y-1 text-sm", children: analytics.summary.nextSteps.map((step, i) => (_jsxs("li", { className: "flex items-start gap-2", children: [_jsx("span", { className: "text-primary", children: "\u2192" }), _jsx("span", { children: step })] }, i))) })] })), analytics.summary.openQuestions.length > 0 && (_jsxs("div", { children: [_jsx("h4", { className: "text-sm font-semibold mb-2", children: "Open Questions" }), _jsx("ul", { className: "space-y-1 text-sm", children: analytics.summary.openQuestions.map((question, i) => (_jsxs("li", { className: "flex items-start gap-2", children: [_jsx("span", { className: "text-primary", children: "?" }), _jsx("span", { children: question })] }, i))) })] }))] })] })] }, "analytics") })) : null] }));
}
ConversationAnalyticsDashboard.displayName = 'ConversationAnalyticsDashboard';
//# sourceMappingURL=conversation-analytics-dashboard.js.map