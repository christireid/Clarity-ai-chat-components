/**
 * Model Comparison Panel Component
 * React 19 component using useOptimistic for real-time comparisons
 */
'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { useModelComparison } from '../hooks/use-model-comparison';
/**
 * Model Comparison Panel Component
 * Displays model comparison results with optimistic updates
 */
export function ModelComparisonPanel({ className, promptId }) {
    const { addResponse, compare, clear, getComparison, getResponses, allComparisons, stats, } = useModelComparison();
    const [prompt, setPrompt] = React.useState('');
    const [currentPromptId, setCurrentPromptId] = React.useState(promptId || 'prompt-1');
    const comparison = promptId ? getComparison(promptId) : getComparison(currentPromptId);
    const responses = promptId ? getResponses(promptId) : getResponses(currentPromptId);
    const handleAddResponse = React.useCallback((response) => {
        addResponse(currentPromptId, response);
    }, [addResponse, currentPromptId]);
    const handleCompare = React.useCallback(() => {
        if (prompt) {
            compare(currentPromptId, prompt);
        }
    }, [compare, currentPromptId, prompt]);
    const handleClear = React.useCallback(() => {
        clear(currentPromptId);
    }, [clear, currentPromptId]);
    return (_jsxs("div", { className: className, "data-testid": "model-comparison-panel", children: [_jsxs("div", { className: "comparison-header", children: [_jsx("h2", { children: "Model Comparison" }), _jsxs("div", { className: "comparison-controls", children: [_jsx("input", { type: "text", value: prompt, onChange: (e) => setPrompt(e.target.value), placeholder: "Enter prompt...", className: "prompt-input" }), _jsx("button", { onClick: handleCompare, disabled: !prompt, children: "Compare" }), _jsx("button", { onClick: handleClear, children: "Clear" })] })] }), stats.totalPrompts > 0 && (_jsxs("div", { className: "comparison-stats", children: [_jsxs("div", { className: "stat", children: [_jsx("span", { className: "stat-label", children: "Total Prompts:" }), _jsx("span", { className: "stat-value", children: stats.totalPrompts })] }), _jsxs("div", { className: "stat", children: [_jsx("span", { className: "stat-label", children: "Total Responses:" }), _jsx("span", { className: "stat-value", children: stats.totalResponses })] }), _jsxs("div", { className: "stat", children: [_jsx("span", { className: "stat-label", children: "Avg Latency:" }), _jsxs("span", { className: "stat-value", children: [stats.averageLatency.toFixed(2), "ms"] })] }), _jsxs("div", { className: "stat", children: [_jsx("span", { className: "stat-label", children: "Total Cost:" }), _jsxs("span", { className: "stat-value", children: ["$", stats.totalCost.toFixed(4)] })] })] })), comparison ? (_jsxs("div", { className: "comparison-results", children: [_jsx("h3", { children: "Comparison Results" }), _jsxs("div", { className: "analysis", children: [_jsxs("div", { className: "analysis-item", children: [_jsx("span", { children: "Fastest:" }), _jsx("span", { children: comparison.analysis.fastest })] }), _jsxs("div", { className: "analysis-item", children: [_jsx("span", { children: "Cheapest:" }), _jsx("span", { children: comparison.analysis.cheapest })] }), _jsxs("div", { className: "analysis-item", children: [_jsx("span", { children: "Most Tokens:" }), _jsx("span", { children: comparison.analysis.mostTokens })] }), _jsxs("div", { className: "analysis-item", children: [_jsx("span", { children: "Average Latency:" }), _jsxs("span", { children: [comparison.analysis.averageLatency.toFixed(2), "ms"] })] }), _jsxs("div", { className: "analysis-item", children: [_jsx("span", { children: "Total Cost:" }), _jsxs("span", { children: ["$", comparison.analysis.totalCost.toFixed(4)] })] })] }), comparison.analysis.recommendations.length > 0 && (_jsxs("div", { className: "recommendations", children: [_jsx("h4", { children: "Recommendations:" }), _jsx("ul", { children: comparison.analysis.recommendations.map((rec, i) => (_jsx("li", { children: rec }, i))) })] })), _jsxs("div", { className: "responses-list", children: [_jsxs("h4", { children: ["Responses (", comparison.responses.length, "):"] }), comparison.responses.map((response, i) => (_jsx(ResponseCard, { response: response }, i)))] })] })) : responses.length > 0 ? (_jsxs("div", { className: "responses-list", children: [_jsxs("h3", { children: ["Responses (", responses.length, ")"] }), responses.map((response, i) => (_jsx(ResponseCard, { response: response }, i))), _jsx("button", { onClick: handleCompare, disabled: !prompt, children: "Compare Responses" })] })) : (_jsx("div", { className: "empty-state", children: _jsx("p", { children: "No responses yet. Add responses to compare models." }) })), allComparisons.length > 0 && (_jsxs("div", { className: "all-comparisons", children: [_jsxs("h3", { children: ["All Comparisons (", allComparisons.length, ")"] }), allComparisons.map((comp, i) => (_jsxs("div", { className: "comparison-summary", children: [_jsxs("h4", { children: [comp.prompt.substring(0, 50), "..."] }), _jsxs("p", { children: ["Fastest: ", comp.analysis.fastest, " | Cheapest: ", comp.analysis.cheapest] })] }, i)))] }))] }));
}
function ResponseCard({ response }) {
    return (_jsxs("div", { className: "response-card", children: [_jsxs("div", { className: "response-header", children: [_jsxs("span", { className: "model-name", children: [response.provider, "/", response.model] }), _jsx("span", { className: "timestamp", children: response.timestamp.toLocaleTimeString() })] }), _jsx("div", { className: "response-content", children: response.content }), _jsxs("div", { className: "response-metadata", children: [_jsxs("span", { children: ["Tokens: ", response.metadata.totalTokens] }), _jsxs("span", { children: ["Latency: ", response.metadata.latency.toFixed(2), "ms"] }), _jsxs("span", { children: ["Cost: $", response.metadata.cost.toFixed(4)] })] })] }));
}
//# sourceMappingURL=model-comparison-panel.js.map