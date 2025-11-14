import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const metadata = {
    title: 'Token Counter Utility | Clarity Chat',
    description: 'Utility functions for accurate token counting across different AI models.'
};
export default function TokenCounterUtilPage() {
    return (_jsxs("div", { className: "max-w-5xl mx-auto px-4 py-8", children: [_jsx("h1", { className: "text-4xl font-bold mb-4", children: "Token Counter Utility" }), _jsx("p", { className: "text-xl text-muted-foreground mb-8", children: "Accurate token counting utilities for OpenAI, Anthropic, and Google AI models with cost estimation." }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Features" }), _jsxs("ul", { className: "list-disc list-inside space-y-2 text-muted-foreground", children: [_jsx("li", { children: "Model-specific token counting (GPT, Claude, Gemini)" }), _jsx("li", { children: "Cost estimation per model" }), _jsx("li", { children: "Batch message token counting" }), _jsx("li", { children: "Context window calculations" }), _jsx("li", { children: "Token budget management" })] })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Usage" }), _jsx("div", { className: "bg-muted p-6 rounded-lg", children: _jsx("pre", { className: "text-sm overflow-x-auto", children: _jsx("code", { children: `import { countTokens, estimateCost } from '@clarity-chat/react/utils'

const tokens = countTokens('Hello world', 'gpt-4')
const cost = estimateCost(tokens, 'gpt-4')
console.log(\`\${tokens} tokens = $\${cost}\`)` }) }) })] })] }));
}
//# sourceMappingURL=page.js.map