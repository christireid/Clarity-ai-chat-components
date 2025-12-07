import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { PromptTestHarness, EvaluationDashboard, SafetyReviewConsole, } from '@clarity-chat/react';
/**
 * AI Operations components for testing, monitoring, and improving AI systems.
 *
 * **Features:**
 * - Prompt testing and optimization
 * - Performance evaluation
 * - Safety and compliance monitoring
 * - A/B testing
 */
const meta = {
    title: 'Advanced/AI/AIOperations',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: 'Tools for testing, monitoring, and improving AI performance and safety.',
            },
        },
        layout: 'fullscreen',
    },
};
export default meta;
// ============================================================================
// Prompt Test Harness
// ============================================================================
export const PromptTestHarnessDefault = {
    render: () => (_jsx("div", { style: { width: '100%', height: '800px', padding: '24px' }, children: _jsx(PromptTestHarness, { onTest: (prompt, variables) => {
                console.log('Testing prompt:', prompt, 'with variables:', variables);
                return Promise.resolve({
                    response: 'This is a simulated AI response based on your prompt.',
                    latency: 1234,
                    tokens: 156,
                    cost: 0.0024,
                });
            }, savedPrompts: [
                {
                    id: '1',
                    name: 'Customer Support Template',
                    template: 'You are a helpful customer support agent. User question: {{question}}',
                    variables: ['question'],
                },
                {
                    id: '2',
                    name: 'Code Review',
                    template: 'Review this {{language}} code:\n\n{{code}}\n\nProvide feedback on:',
                    variables: ['language', 'code'],
                },
            ] }) })),
};
export const PromptTestHarnessABTest = {
    render: () => (_jsx("div", { style: { width: '100%', height: '800px', padding: '24px' }, children: _jsx(PromptTestHarness, { mode: "ab-test", onTest: (prompt, variables) => {
                console.log('A/B Testing prompt:', prompt);
                return Promise.resolve({
                    response: 'Variant response',
                    latency: Math.random() * 2000,
                    tokens: Math.floor(Math.random() * 300),
                    cost: Math.random() * 0.01,
                });
            }, variants: [
                {
                    id: 'a',
                    name: 'Variant A - Formal',
                    template: 'Please provide a formal response to: {{query}}',
                },
                {
                    id: 'b',
                    name: 'Variant B - Casual',
                    template: 'Hey! Let me help you with: {{query}}',
                },
            ] }) })),
};
// ============================================================================
// Evaluation Dashboard
// ============================================================================
export const EvaluationDashboardDefault = {
    render: () => (_jsx("div", { style: { width: '100%', height: '800px' }, children: _jsx(EvaluationDashboard, { metrics: {
                accuracy: 0.94,
                latency: 1234,
                throughput: 45,
                errorRate: 0.02,
                userSatisfaction: 4.6,
                costPerRequest: 0.0023,
            }, evaluations: [
                {
                    id: '1',
                    name: 'Customer Support Accuracy',
                    score: 0.92,
                    timestamp: Date.now() - 3600000,
                    details: {
                        precision: 0.91,
                        recall: 0.93,
                        f1: 0.92,
                    },
                },
                {
                    id: '2',
                    name: 'Response Time SLA',
                    score: 0.98,
                    timestamp: Date.now() - 7200000,
                    details: {
                        p50: 850,
                        p95: 1800,
                        p99: 2400,
                    },
                },
                {
                    id: '3',
                    name: 'Content Safety',
                    score: 0.99,
                    timestamp: Date.now() - 1800000,
                    details: {
                        toxicity: 0.01,
                        bias: 0.02,
                        pii: 0.00,
                    },
                },
            ], trends: {
                accuracy: [0.89, 0.91, 0.92, 0.93, 0.94],
                latency: [1500, 1400, 1300, 1250, 1234],
                satisfaction: [4.2, 4.3, 4.4, 4.5, 4.6],
            } }) })),
};
export const EvaluationDashboardComparison = {
    render: () => (_jsx("div", { style: { width: '100%', height: '800px' }, children: _jsx(EvaluationDashboard, { comparisonMode: true, models: [
                {
                    id: 'gpt-4',
                    name: 'GPT-4',
                    metrics: {
                        accuracy: 0.96,
                        latency: 1500,
                        cost: 0.0030,
                    },
                },
                {
                    id: 'gpt-3.5',
                    name: 'GPT-3.5 Turbo',
                    metrics: {
                        accuracy: 0.91,
                        latency: 800,
                        cost: 0.0010,
                    },
                },
                {
                    id: 'claude',
                    name: 'Claude 2',
                    metrics: {
                        accuracy: 0.94,
                        latency: 1200,
                        cost: 0.0025,
                    },
                },
            ] }) })),
};
// ============================================================================
// Safety Review Console
// ============================================================================
export const SafetyReviewConsoleDefault = {
    render: () => (_jsx("div", { style: { width: '100%', height: '800px' }, children: _jsx(SafetyReviewConsole, { flaggedContent: [
                {
                    id: '1',
                    content: 'This message contains potentially sensitive information...',
                    flagType: 'pii',
                    severity: 'high',
                    timestamp: Date.now() - 1800000,
                    context: {
                        userId: 'user-123',
                        sessionId: 'session-456',
                    },
                    status: 'pending',
                },
                {
                    id: '2',
                    content: 'Content that may violate content policy...',
                    flagType: 'policy',
                    severity: 'medium',
                    timestamp: Date.now() - 3600000,
                    context: {
                        userId: 'user-789',
                        sessionId: 'session-012',
                    },
                    status: 'pending',
                },
                {
                    id: '3',
                    content: 'Message with potential bias concerns...',
                    flagType: 'bias',
                    severity: 'low',
                    timestamp: Date.now() - 7200000,
                    context: {
                        userId: 'user-345',
                        sessionId: 'session-678',
                    },
                    status: 'reviewed',
                },
            ], onReview: (id, decision, notes) => {
                console.log('Reviewing:', id, decision, notes);
            }, stats: {
                totalFlags: 156,
                pendingReview: 23,
                resolved: 133,
                escalated: 5,
            } }) })),
};
export const SafetyReviewConsoleFiltered = {
    render: () => (_jsx("div", { style: { width: '100%', height: '800px' }, children: _jsx(SafetyReviewConsole, { flaggedContent: [
                {
                    id: '1',
                    content: 'Message containing PII: email@example.com, phone: 555-0123',
                    flagType: 'pii',
                    severity: 'high',
                    timestamp: Date.now() - 900000,
                    context: {
                        userId: 'user-111',
                        sessionId: 'session-222',
                    },
                    status: 'pending',
                    detectedEntities: ['email', 'phone'],
                },
                {
                    id: '2',
                    content: 'Another PII instance with SSN: XXX-XX-1234',
                    flagType: 'pii',
                    severity: 'critical',
                    timestamp: Date.now() - 1200000,
                    context: {
                        userId: 'user-333',
                        sessionId: 'session-444',
                    },
                    status: 'pending',
                    detectedEntities: ['ssn'],
                },
            ], filterBy: "pii", onReview: (id, decision, notes) => {
                console.log('Reviewing PII:', id, decision);
            }, stats: {
                totalFlags: 45,
                pendingReview: 8,
                resolved: 37,
                escalated: 2,
            } }) })),
};
// ============================================================================
// AI Ops Overview
// ============================================================================
export const AIOperationsOverview = {
    render: () => (_jsxs("div", { className: "max-w-6xl p-8 space-y-8", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-4xl font-bold mb-3", children: "AI Operations Suite" }), _jsx("p", { className: "text-lg text-gray-600", children: "Comprehensive tools for testing, monitoring, and optimizing your AI systems." })] }), _jsxs("div", { className: "grid grid-cols-3 gap-6", children: [_jsxs("div", { className: "p-6 border rounded-lg hover:shadow-lg transition-shadow", children: [_jsxs("div", { className: "flex items-center gap-3 mb-4", children: [_jsx("div", { className: "p-3 bg-blue-100 rounded-xl", children: _jsx("svg", { className: "w-8 h-8 text-blue-600", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" }) }) }), _jsx("h3", { className: "text-xl font-semibold", children: "Prompt Testing" })] }), _jsx("p", { className: "text-gray-600 mb-4", children: "Test and optimize prompts with A/B testing, variable substitution, and performance metrics." }), _jsxs("ul", { className: "space-y-2 text-sm text-gray-600", children: [_jsxs("li", { className: "flex items-center gap-2", children: [_jsx("svg", { className: "w-4 h-4 text-green-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }), "A/B testing"] }), _jsxs("li", { className: "flex items-center gap-2", children: [_jsx("svg", { className: "w-4 h-4 text-green-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }), "Template variables"] }), _jsxs("li", { className: "flex items-center gap-2", children: [_jsx("svg", { className: "w-4 h-4 text-green-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }), "Performance tracking"] })] })] }), _jsxs("div", { className: "p-6 border rounded-lg hover:shadow-lg transition-shadow", children: [_jsxs("div", { className: "flex items-center gap-3 mb-4", children: [_jsx("div", { className: "p-3 bg-purple-100 rounded-xl", children: _jsx("svg", { className: "w-8 h-8 text-purple-600", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" }) }) }), _jsx("h3", { className: "text-xl font-semibold", children: "Evaluation" })] }), _jsx("p", { className: "text-gray-600 mb-4", children: "Monitor AI performance with real-time metrics, trends, and comparative analysis across models." }), _jsxs("ul", { className: "space-y-2 text-sm text-gray-600", children: [_jsxs("li", { className: "flex items-center gap-2", children: [_jsx("svg", { className: "w-4 h-4 text-green-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }), "Real-time metrics"] }), _jsxs("li", { className: "flex items-center gap-2", children: [_jsx("svg", { className: "w-4 h-4 text-green-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }), "Model comparison"] }), _jsxs("li", { className: "flex items-center gap-2", children: [_jsx("svg", { className: "w-4 h-4 text-green-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }), "Trend analysis"] })] })] }), _jsxs("div", { className: "p-6 border rounded-lg hover:shadow-lg transition-shadow", children: [_jsxs("div", { className: "flex items-center gap-3 mb-4", children: [_jsx("div", { className: "p-3 bg-red-100 rounded-xl", children: _jsx("svg", { className: "w-8 h-8 text-red-600", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" }) }) }), _jsx("h3", { className: "text-xl font-semibold", children: "Safety Review" })] }), _jsx("p", { className: "text-gray-600 mb-4", children: "Monitor and review content for safety, compliance, and policy violations with automated flagging." }), _jsxs("ul", { className: "space-y-2 text-sm text-gray-600", children: [_jsxs("li", { className: "flex items-center gap-2", children: [_jsx("svg", { className: "w-4 h-4 text-green-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }), "PII detection"] }), _jsxs("li", { className: "flex items-center gap-2", children: [_jsx("svg", { className: "w-4 h-4 text-green-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }), "Bias monitoring"] }), _jsxs("li", { className: "flex items-center gap-2", children: [_jsx("svg", { className: "w-4 h-4 text-green-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }), "Policy compliance"] })] })] })] }), _jsxs("div", { className: "p-6 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl", children: [_jsxs("h3", { className: "text-xl font-semibold mb-3 flex items-center gap-2", children: [_jsx("svg", { className: "w-6 h-6 text-blue-600", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 10V3L4 14h7v7l9-11h-7z" }) }), "Best Practices"] }), _jsxs("div", { className: "grid grid-cols-2 gap-4 text-sm", children: [_jsxs("div", { children: [_jsx("h4", { className: "font-semibold mb-2", children: "Testing Strategy" }), _jsxs("ul", { className: "space-y-1 text-gray-700", children: [_jsx("li", { children: "\u2022 Test prompts with diverse inputs" }), _jsx("li", { children: "\u2022 Run A/B tests for optimization" }), _jsx("li", { children: "\u2022 Monitor latency and costs" })] })] }), _jsxs("div", { children: [_jsx("h4", { className: "font-semibold mb-2", children: "Safety & Compliance" }), _jsxs("ul", { className: "space-y-1 text-gray-700", children: [_jsx("li", { children: "\u2022 Regular safety audits" }), _jsx("li", { children: "\u2022 Automated PII detection" }), _jsx("li", { children: "\u2022 Content policy enforcement" })] })] })] })] })] })),
};
//# sourceMappingURL=AIOperations.stories.js.map