/**
 * Combined Structured Output & Tools Example
 *
 * Demonstrates using both useClarityObject and tool UI registry together
 * in a real-world scenario: an e-commerce assistant that generates product
 * recommendations and uses tools for additional information.
 *
 * @example
 * ```tsx
 * import { ECommerceAssistantExample } from '@clarity-chat/react/examples/combined-structured-tools-example'
 *
 * export default function Page() {
 *   return <ECommerceAssistantExample />
 * }
 * ```
 */
'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { useClarityChatWithTools, useClarityObject, ChatWindow, convertCoreMessagesToMessages, ClarityToolResult, createToolUIRegistry, } from '@clarity-chat/react';
import { Card, CardContent, CardHeader, CardTitle, Badge, Button, Input } from '@clarity-chat/primitives';
/**
 * Price Comparison Tool Result Component
 */
function PriceComparisonToolResult({ data }) {
    const cheapest = data.comparisons.reduce((min, curr) => curr.price < min.price ? curr : min);
    return (_jsxs(Card, { className: "border-green-200 bg-green-50/50", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-base flex items-center gap-2", children: "\uD83D\uDCB0 Price Comparison" }) }), _jsx(CardContent, { className: "space-y-3", children: data.comparisons.map((comparison, idx) => (_jsxs("div", { className: `flex items-center justify-between p-2 rounded ${comparison.store === cheapest.store
                        ? 'bg-green-100 border border-green-300'
                        : 'bg-muted/50'}`, children: [_jsxs("div", { className: "flex-1", children: [_jsx("div", { className: "font-medium text-sm", children: comparison.store }), _jsx("div", { className: "text-xs text-muted-foreground", children: comparison.availability ? 'In Stock' : 'Out of Stock' })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("div", { className: `text-lg font-bold ${comparison.store === cheapest.store
                                        ? 'text-green-600'
                                        : 'text-foreground'}`, children: ["$", comparison.price.toFixed(2)] }), comparison.store === cheapest.store && (_jsx(Badge, { variant: "success", className: "text-xs", children: "Best Price" }))] })] }, idx))) })] }));
}
/**
 * Review Summary Tool Result Component
 */
function ReviewSummaryToolResult({ data }) {
    return (_jsxs(Card, { className: "border-blue-200 bg-blue-50/50", children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { className: "text-base flex items-center gap-2", children: "\u2B50 Review Summary" }), _jsxs("div", { className: "flex items-center gap-2 text-sm", children: [_jsx("span", { className: "text-2xl font-bold", children: data.averageRating.toFixed(1) }), _jsxs("span", { className: "text-muted-foreground", children: ["(", data.totalReviews, " reviews)"] })] })] }), _jsxs(CardContent, { className: "space-y-3", children: [_jsx("p", { className: "text-sm text-muted-foreground", children: data.summary }), data.topPros.length > 0 && (_jsxs("div", { className: "space-y-1", children: [_jsx("div", { className: "text-xs font-medium text-green-600", children: "Pros:" }), _jsx("ul", { className: "text-xs text-muted-foreground space-y-1", children: data.topPros.map((pro, idx) => (_jsxs("li", { className: "flex items-start gap-1", children: [_jsx("span", { className: "text-green-600", children: "\u2713" }), _jsx("span", { children: pro })] }, idx))) })] })), data.topCons.length > 0 && (_jsxs("div", { className: "space-y-1", children: [_jsx("div", { className: "text-xs font-medium text-red-600", children: "Cons:" }), _jsx("ul", { className: "text-xs text-muted-foreground space-y-1", children: data.topCons.map((con, idx) => (_jsxs("li", { className: "flex items-start gap-1", children: [_jsx("span", { className: "text-red-600", children: "\u2717" }), _jsx("span", { children: con })] }, idx))) })] }))] })] }));
}
/**
 * Create tool registry
 */
const toolRegistry = createToolUIRegistry({
    price_comparison: PriceComparisonToolResult,
    review_summary: ReviewSummaryToolResult,
});
/**
 * E-Commerce Assistant Example
 *
 * Combines structured product recommendations with tool-based
 * price comparison and review summaries.
 */
export function ECommerceAssistantExample() {
    const [searchQuery, setSearchQuery] = React.useState('gaming laptop');
    // Structured object generation for product recommendations
    const productRecommendation = useClarityObject({
        api: '/api/generate-products',
        initialInput: { query: searchQuery },
    });
    // Chat with tools for follow-up questions
    const { messages, append, isLoading, toolResults } = useClarityChatWithTools({
        api: '/api/chat-with-tools',
        toolRegistry,
    });
    const chatMessages = React.useMemo(() => convertCoreMessagesToMessages(messages), [messages]);
    const handleGenerateRecommendations = React.useCallback(async () => {
        await productRecommendation.run({ query: searchQuery });
    }, [searchQuery, productRecommendation]);
    const handleSendMessage = React.useCallback(async (content) => {
        await append({
            role: 'user',
            content,
        });
    }, [append]);
    // Group tool results by message
    const toolResultsByMessage = React.useMemo(() => {
        const grouped = new Map();
        toolResults.forEach((tr) => {
            const existing = grouped.get(tr.messageId) || [];
            grouped.set(tr.messageId, [...existing, tr]);
        });
        return grouped;
    }, [toolResults]);
    return (_jsxs("div", { className: "flex h-screen w-full", children: [_jsxs("div", { className: "w-96 border-r bg-muted/20 p-4 space-y-4 overflow-y-auto", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("h2", { className: "text-lg font-semibold", children: "Product Recommendations" }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Input, { value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), placeholder: "Search products...", onKeyDown: (e) => {
                                            if (e.key === 'Enter' && !productRecommendation.isLoading) {
                                                handleGenerateRecommendations();
                                            }
                                        } }), _jsx(Button, { onClick: handleGenerateRecommendations, disabled: productRecommendation.isLoading, children: productRecommendation.isLoading ? 'Generating...' : 'Generate' })] })] }), productRecommendation.error && (_jsxs("div", { className: "rounded-lg border border-destructive bg-destructive/10 p-3 text-sm text-destructive", children: ["Error: ", productRecommendation.error.message] })), productRecommendation.object && (_jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "text-sm text-muted-foreground", children: ["Found ", productRecommendation.object.totalResults, " products"] }), productRecommendation.object.products.map((product, idx) => (_jsxs(Card, { className: "hover:shadow-md transition-shadow", children: [_jsxs(CardHeader, { children: [_jsxs("div", { className: "flex items-start justify-between", children: [_jsx(CardTitle, { className: "text-sm", children: product.name }), _jsxs("div", { className: "text-lg font-bold text-primary", children: ["$", product.price.toFixed(2)] })] }), product.rating && (_jsxs("div", { className: "text-xs text-muted-foreground", children: ["\u2B50 ", product.rating.toFixed(1), "/5.0"] }))] }), _jsxs(CardContent, { children: [_jsx("p", { className: "text-xs text-muted-foreground line-clamp-2", children: product.description }), _jsx("div", { className: "mt-2 flex items-center gap-2", children: _jsx(Badge, { variant: "secondary", className: "text-xs", children: product.category }) })] })] }, idx)))] }))] }), _jsxs("div", { className: "flex-1 flex flex-col", children: [_jsx(ChatWindow, { messages: chatMessages, onSendMessage: handleSendMessage, isLoading: isLoading, showHeader: true, sessionTitle: "E-Commerce Assistant", sessionSubtitle: "Ask about products, prices, and reviews" }), toolResults.length > 0 && (_jsxs("div", { className: "border-t bg-muted/30 p-4 space-y-4 max-h-64 overflow-y-auto", children: [_jsxs("div", { className: "text-sm font-medium text-muted-foreground", children: ["Tool Results (", toolResults.length, ")"] }), Array.from(toolResultsByMessage.entries()).map(([messageId, results]) => (_jsx("div", { className: "space-y-2", children: results.map(({ toolCall, result }, idx) => (_jsx(ClarityToolResult, { registry: toolRegistry, toolCall: toolCall, result: result, messages: chatMessages }, `${messageId}-${idx}`))) }, messageId)))] }))] })] }));
}
//# sourceMappingURL=combined-structured-tools-example.js.map