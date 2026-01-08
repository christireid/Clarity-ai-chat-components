/**
 * Model Comparison Panel Component
 * Premium model comparison with visual charts and insights
 * React 19 component using useOptimistic for real-time comparisons
 */
'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import * as React from 'react';
import { useModelComparison } from '../hooks/use-model-comparison';
import { ScaleIcon, ZapIcon, DollarSignIcon, HashIcon, ClockIcon, TrophyIcon, LightbulbIcon, TrashIcon, BarChartIcon, ArrowRightIcon, } from './icons';
/**
 * Model Comparison Panel Component
 * Displays model comparison results with optimistic updates
 */
export function ModelComparisonPanel({ className, promptId, showCharts = true, enableCostTracking = true, }) {
    const { addResponse, compare, clear, getComparison, getResponses, allComparisons, stats, } = useModelComparison();
    const [prompt, setPrompt] = React.useState('');
    const [currentPromptId, setCurrentPromptId] = React.useState(promptId || 'prompt-1');
    const [isComparing, setIsComparing] = React.useState(false);
    const comparison = promptId
        ? getComparison(promptId)
        : getComparison(currentPromptId);
    const responses = promptId
        ? getResponses(promptId)
        : getResponses(currentPromptId);
    const handleCompare = React.useCallback(async () => {
        if (prompt) {
            setIsComparing(true);
            try {
                compare(currentPromptId, prompt);
            }
            finally {
                setIsComparing(false);
            }
        }
    }, [compare, currentPromptId, prompt]);
    const handleClear = React.useCallback(() => {
        clear(currentPromptId);
    }, [clear, currentPromptId]);
    // Calculate max values for bar chart scaling
    const maxLatency = comparison?.responses.length
        ? Math.max(...comparison.responses.map((r) => r.metadata.latency))
        : 1;
    const maxCost = comparison?.responses.length
        ? Math.max(...comparison.responses.map((r) => r.metadata.cost))
        : 1;
    const maxTokens = comparison?.responses.length
        ? Math.max(...comparison.responses.map((r) => r.metadata.totalTokens))
        : 1;
    return (_jsxs("div", { className: `model-comparison-panel ${className || ''}`, "data-testid": "model-comparison-panel", children: [_jsxs("header", { className: "comparison-header", children: [_jsxs("h2", { children: [_jsx(ScaleIcon, { size: "lg" }), "Model Comparison"] }), _jsxs("div", { className: "comparison-controls", children: [_jsx("input", { type: "text", value: prompt, onChange: (e) => setPrompt(e.target.value), placeholder: "Enter prompt to compare models...", className: "prompt-input", "aria-label": "Prompt for model comparison" }), _jsx("button", { className: "dt-btn dt-btn-primary", onClick: handleCompare, disabled: !prompt || isComparing, children: isComparing ? (_jsxs(_Fragment, { children: [_jsx("span", { className: "loading-spinner small" }), "Comparing..."] })) : (_jsxs(_Fragment, { children: [_jsx(ScaleIcon, { size: "lg" }), "Compare"] })) }), _jsx("button", { className: "dt-btn dt-btn-ghost dt-btn-icon", onClick: handleClear, "aria-label": "Clear comparison", title: "Clear", children: _jsx(TrashIcon, {}) })] })] }), stats.totalPrompts > 0 && (_jsxs("div", { className: "comparison-stats", role: "region", "aria-label": "Comparison statistics", children: [_jsxs("div", { className: "stat", children: [_jsx("span", { className: "stat-label", children: "Prompts" }), _jsx("span", { className: "stat-value", children: stats.totalPrompts })] }), _jsxs("div", { className: "stat", children: [_jsx("span", { className: "stat-label", children: "Responses" }), _jsx("span", { className: "stat-value", children: stats.totalResponses })] }), _jsxs("div", { className: "stat", children: [_jsx("span", { className: "stat-label", children: "Avg Latency" }), _jsxs("span", { className: "stat-value", children: [stats.averageLatency.toFixed(0), "ms"] })] }), enableCostTracking && (_jsxs("div", { className: "stat", children: [_jsx("span", { className: "stat-label", children: "Total Cost" }), _jsxs("span", { className: "stat-value", children: ["$", stats.totalCost.toFixed(4)] })] }))] })), _jsx("div", { className: "comparison-content", children: comparison ? (_jsx(ComparisonResults, { comparison: comparison, showCharts: showCharts, enableCostTracking: enableCostTracking, maxLatency: maxLatency, maxCost: maxCost, maxTokens: maxTokens })) : responses.length > 0 ? (_jsxs("div", { className: "responses-preview", children: [_jsxs("h3", { children: ["Collected Responses (", responses.length, ")"] }), _jsx("p", { className: "responses-hint", children: "Enter a prompt and click Compare to analyze these responses." }), _jsx("div", { className: "responses-grid", children: responses.map((response, i) => (_jsx(ResponseCard, { response: response, compact: true }, i))) })] })) : (_jsx(EmptyState, {})) }), allComparisons.length > 1 && (_jsxs("div", { className: "previous-comparisons", role: "region", "aria-label": "Previous comparisons", children: [_jsx("h3", { children: "Previous Comparisons" }), _jsx("div", { className: "comparisons-list", children: allComparisons
                            .filter((c) => c.prompt !== comparison?.prompt)
                            .slice(0, 3)
                            .map((comp, i) => (_jsx(ComparisonSummary, { comparison: comp }, i))) })] }))] }));
}
/**
 * Empty state component
 */
function EmptyState() {
    return (_jsxs("div", { className: "empty-state", role: "status", children: [_jsx("div", { className: "empty-state-icon", "aria-hidden": "true", children: _jsx(BarChartIcon, { size: "xl" }) }), _jsx("h3", { className: "empty-state-title", children: "No comparisons yet" }), _jsx("p", { className: "empty-state-description", children: "Enter a prompt and compare model responses to see insights on latency, cost, and quality across different AI models." })] }));
}
function ComparisonResults({ comparison, showCharts, enableCostTracking, maxLatency, maxCost, maxTokens, }) {
    return (_jsxs("div", { className: "comparison-results", children: [_jsxs("div", { className: "analysis-section", children: [_jsx("h3", { children: "Analysis Summary" }), _jsxs("div", { className: "analysis-grid", children: [_jsx(AnalysisCard, { icon: _jsx(ZapIcon, {}), label: "Fastest", value: comparison.analysis.fastest, highlight: "success" }), enableCostTracking && (_jsx(AnalysisCard, { icon: _jsx(DollarSignIcon, {}), label: "Most Affordable", value: comparison.analysis.cheapest, highlight: "primary" })), _jsx(AnalysisCard, { icon: _jsx(HashIcon, {}), label: "Most Tokens", value: comparison.analysis.mostTokens, highlight: "warning" }), _jsx(AnalysisCard, { icon: _jsx(ClockIcon, {}), label: "Avg Latency", value: `${comparison.analysis.averageLatency.toFixed(0)}ms` }), enableCostTracking && (_jsx(AnalysisCard, { icon: _jsx(DollarSignIcon, {}), label: "Total Cost", value: `$${comparison.analysis.totalCost.toFixed(4)}` }))] })] }), comparison.analysis.recommendations.length > 0 && (_jsxs("div", { className: "recommendations-section", children: [_jsxs("h3", { children: [_jsx(LightbulbIcon, {}), "Recommendations"] }), _jsx("ul", { className: "recommendations-list", children: comparison.analysis.recommendations.map((rec, i) => (_jsxs("li", { className: "recommendation-item", children: [_jsx(ArrowRightIcon, {}), _jsx("span", { children: rec })] }, i))) })] })), showCharts && comparison.responses.length > 1 && (_jsxs("div", { className: "charts-section", children: [_jsx("h3", { children: "Visual Comparison" }), _jsxs("div", { className: "charts-grid", children: [_jsx(ComparisonChart, { title: "Latency", responses: comparison.responses, getValue: (r) => r.metadata.latency, maxValue: maxLatency, formatValue: (v) => `${v.toFixed(0)}ms`, colorClass: "latency", winner: comparison.analysis.fastest }), enableCostTracking && (_jsx(ComparisonChart, { title: "Cost", responses: comparison.responses, getValue: (r) => r.metadata.cost, maxValue: maxCost, formatValue: (v) => `$${v.toFixed(4)}`, colorClass: "cost", winner: comparison.analysis.cheapest })), _jsx(ComparisonChart, { title: "Tokens", responses: comparison.responses, getValue: (r) => r.metadata.totalTokens, maxValue: maxTokens, formatValue: (v) => v.toLocaleString(), colorClass: "tokens", winner: comparison.analysis.mostTokens })] })] })), _jsxs("div", { className: "responses-section", children: [_jsxs("h3", { children: ["Responses (", comparison.responses.length, ")"] }), _jsx("div", { className: "responses-grid", children: comparison.responses.map((response, i) => (_jsx(ResponseCard, { response: response, isFastest: `${response.provider}/${response.model}` ===
                                comparison.analysis.fastest, isCheapest: `${response.provider}/${response.model}` ===
                                comparison.analysis.cheapest }, i))) })] })] }));
}
function AnalysisCard({ icon, label, value, highlight }) {
    return (_jsxs("div", { className: `analysis-card ${highlight || ''}`, children: [_jsx("div", { className: "analysis-icon", "aria-hidden": "true", children: icon }), _jsxs("div", { className: "analysis-content", children: [_jsx("span", { className: "analysis-label", children: label }), _jsx("span", { className: "analysis-value", children: value })] })] }));
}
function ComparisonChart({ title, responses, getValue, maxValue, formatValue, colorClass, winner, }) {
    return (_jsxs("div", { className: "comparison-chart", children: [_jsx("h4", { children: title }), _jsx("div", { className: "chart-bars", children: responses.map((response, i) => {
                    const value = getValue(response);
                    const barWidth = maxValue > 0 ? (value / maxValue) * 100 : 0;
                    const modelName = `${response.provider}/${response.model}`;
                    const isWinner = modelName === winner;
                    return (_jsxs("div", { className: `chart-bar-item ${isWinner ? 'winner' : ''}`, children: [_jsxs("div", { className: "bar-label", children: [_jsx("span", { className: "model-name", children: response.model }), isWinner && (_jsx("span", { className: "winner-badge", children: _jsx(TrophyIcon, {}) }))] }), _jsx("div", { className: "bar-container", children: _jsx("div", { className: `bar-fill ${colorClass}`, style: { width: `${barWidth}%` }, role: "progressbar", "aria-valuenow": value, "aria-valuemin": 0, "aria-valuemax": maxValue }) }), _jsx("span", { className: "bar-value", children: formatValue(value) })] }, i));
                }) })] }));
}
function ResponseCard({ response, compact = false, isFastest, isCheapest, }) {
    const [expanded, setExpanded] = React.useState(false);
    return (_jsxs("article", { className: `response-card ${compact ? 'compact' : ''}`, children: [_jsxs("header", { className: "response-header", children: [_jsxs("div", { className: "response-model", children: [_jsx("span", { className: `provider-badge ${response.provider.toLowerCase()}`, children: response.provider }), _jsx("span", { className: "model-name", children: response.model })] }), _jsxs("div", { className: "response-badges", children: [isFastest && (_jsxs("span", { className: "badge badge-success", title: "Fastest response", children: [_jsx(ZapIcon, {}), " Fastest"] })), isCheapest && (_jsxs("span", { className: "badge badge-primary", title: "Most affordable", children: [_jsx(DollarSignIcon, {}), " Cheapest"] }))] })] }), _jsxs("div", { className: "response-metrics", children: [_jsxs("div", { className: "metric", children: [_jsx(ClockIcon, {}), _jsxs("span", { children: [response.metadata.latency.toFixed(0), "ms"] })] }), _jsxs("div", { className: "metric", children: [_jsx(HashIcon, {}), _jsxs("span", { children: [response.metadata.totalTokens.toLocaleString(), " tokens"] })] }), _jsxs("div", { className: "metric", children: [_jsx(DollarSignIcon, {}), _jsxs("span", { children: ["$", response.metadata.cost.toFixed(4)] })] })] }), !compact && (_jsxs(_Fragment, { children: [_jsx("div", { className: `response-content ${expanded ? 'expanded' : ''}`, children: _jsx("p", { children: response.content }) }), response.content.length > 200 && (_jsx("button", { className: "expand-button", onClick: () => setExpanded(!expanded), children: expanded ? 'Show less' : 'Show more' }))] })), _jsx("footer", { className: "response-footer", children: _jsx("span", { className: "timestamp", children: response.timestamp.toLocaleTimeString() }) })] }));
}
function ComparisonSummary({ comparison }) {
    return (_jsxs("div", { className: "comparison-summary", children: [_jsxs("div", { className: "summary-prompt", children: [comparison.prompt.substring(0, 60), comparison.prompt.length > 60 ? '...' : ''] }), _jsxs("div", { className: "summary-results", children: [_jsxs("span", { className: "summary-badge fastest", children: [_jsx(ZapIcon, {}), " ", comparison.analysis.fastest.split('/')[1]] }), _jsxs("span", { className: "summary-badge cheapest", children: [_jsx(DollarSignIcon, {}), " ", comparison.analysis.cheapest.split('/')[1]] })] })] }));
}
//# sourceMappingURL=model-comparison-panel.js.map