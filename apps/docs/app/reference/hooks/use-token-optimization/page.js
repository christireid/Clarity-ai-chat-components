import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs';
export const dynamic = 'force-dynamic';
export const metadata = {
    title: 'useTokenOptimization Hook | Clarity Chat',
    description: 'Coordinate token budgeting, compression, caching, and routing for cost-efficient AI conversations.',
};
const secondaryHooks = [
    { name: 'useTokenTracker', description: 'Live token + cost tracking UI (documented separately).' },
    { name: 'usePromptCompression', description: 'Compress prompts and histories using heuristic + semantic strategies.' },
    { name: 'useSmartCache', description: 'Cache LLM responses and embeddings to avoid duplicate calls.' },
    { name: 'useSmartThrottle', description: 'Back off high-volume requests to avoid rate limits.' },
    { name: 'useRequestBatcher', description: 'Batch small requests to reduce HTTP overhead.' },
    { name: 'useModelRouter', description: 'Route requests to the cheapest provider meeting quality thresholds.' },
    { name: 'useResponseLimiter', description: 'Limit output tokens or streaming duration dynamically.' },
];
export default function UseTokenOptimizationPage() {
    return (_jsxs(_Fragment, { children: [_jsx(Breadcrumbs, {}), _jsxs("div", { className: "max-w-5xl mx-auto px-4 py-8 space-y-12", children: [_jsxs("header", { children: [_jsx("h1", { className: "text-4xl font-bold mb-3", children: "useTokenOptimization" }), _jsx("p", { className: "text-lg text-muted-foreground", children: "Central coordinator for Clarity Chat\u2019s token optimization suite. Automatically balances context window allocation, compression, caching, throttling, and provider routing." })] }), _jsxs("section", { children: [_jsx("h2", { className: "text-2xl font-semibold mb-3", children: "Usage" }), _jsx("div", { className: "bg-muted p-6 rounded-lg", children: _jsx("pre", { className: "text-sm overflow-x-auto", children: _jsx("code", { children: `import {
  useTokenOptimization,
  useTokenTracker,
  usePromptCompression,
  useModelRouter,
} from '@clarity-chat/react'

const { optimizeContext, recommendation, state } = useTokenOptimization({
  maxContextWindow: 128_000,
  budgetUsd: 25,
  targets: {
    latencyMs: 4_000,
    accuracy: 0.92,
    costSavings: 0.6,
  },
})` }) }) })] }), _jsxs("section", { children: [_jsx("h2", { className: "text-2xl font-semibold mb-3", children: "What It Does" }), _jsxs("ul", { className: "list-disc list-inside space-y-2 text-muted-foreground", children: [_jsx("li", { children: "Evaluates conversation state (token counts, roles, metadata) and returns optimized context bundles." }), _jsxs("li", { children: ["Triggers compression pipelines (", _jsx("code", { children: "usePromptCompression" }), ") when nearing budget thresholds."] }), _jsxs("li", { children: ["Advises provider/model selection via ", _jsx("code", { children: "useModelRouter" }), " based on price/performance goals."] }), _jsxs("li", { children: ["Integrates with ", _jsx("code", { children: "useSmartCache" }), " to reuse previous completions or embeddings."] }), _jsxs("li", { children: ["Feeds ", _jsx("code", { children: "useTokenTracker" }), " so the UI reflects savings in real time."] })] })] }), _jsxs("section", { children: [_jsx("h2", { className: "text-2xl font-semibold mb-3", children: "Return Value" }), _jsxs("ul", { className: "list-disc list-inside space-y-2 text-muted-foreground", children: [_jsxs("li", { children: [_jsx("code", { children: "optimizeContext(input)" }), " \u2013 Accepts ", `{ systemPrompt, userPreferences, recentMessages, semanticMemories }`, " and returns trimmed segments respecting budgets."] }), _jsxs("li", { children: [_jsx("code", { children: "recommendation" }), " \u2013 Suggested model/provider + rationale."] }), _jsxs("li", { children: [_jsx("code", { children: "state" }), " \u2013 Current budget, savings, compression ratios, and throttling status."] })] })] }), _jsxs("section", { children: [_jsx("h2", { className: "text-2xl font-semibold mb-3", children: "Related Hooks" }), _jsx("ul", { className: "list-disc list-inside space-y-2 text-muted-foreground", children: secondaryHooks.map((hook) => (_jsxs("li", { children: [_jsx("code", { children: hook.name }), " \u2013 ", hook.description] }, hook.name))) })] })] })] }));
}
//# sourceMappingURL=page.js.map