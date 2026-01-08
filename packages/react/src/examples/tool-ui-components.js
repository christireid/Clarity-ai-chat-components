import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
/**
 * Tool UI Component Examples
 *
 * Reusable tool result components that can be registered in the tool UI registry.
 * These components demonstrate best practices for rendering different types of tool results.
 */
import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, Badge, Button, } from '@clarity-chat/primitives';
/**
 * Weather Tool Result Component
 *
 * Renders weather information in a visually appealing card.
 */
export function WeatherToolResult({ data, }) {
    return (_jsxs(Card, { className: "border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/50", children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "text-base flex items-center gap-2", children: [data.icon || '🌤️', " Weather in ", data.location] }) }), _jsxs(CardContent, { className: "space-y-3", children: [_jsxs("div", { className: "flex items-baseline gap-2", children: [_jsxs("div", { className: "text-4xl font-bold text-blue-600", children: [data.temperature, "\u00B0F"] }), data.feelsLike && (_jsxs("div", { className: "text-sm text-muted-foreground", children: ["Feels like ", data.feelsLike, "\u00B0F"] }))] }), _jsx("div", { className: "text-sm font-medium text-foreground", children: data.condition }), _jsxs("div", { className: "flex gap-4 text-xs text-muted-foreground", children: [_jsxs("span", { children: ["\uD83D\uDCA7 Humidity: ", data.humidity, "%"] }), _jsxs("span", { children: ["\uD83D\uDCA8 Wind: ", data.windSpeed, " mph"] })] })] })] }));
}
/**
 * Search Tool Result Component
 *
 * Renders search results with relevance scores.
 */
export function SearchToolResult({ data, }) {
    return (_jsxs(Card, { className: "border-green-200 bg-green-50/50", children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { className: "text-base flex items-center gap-2", children: "\uD83D\uDD0D Search Results" }), data.totalResults !== undefined && (_jsxs("div", { className: "text-xs text-muted-foreground", children: ["Found ", data.totalResults, " results for \"", data.query, "\""] }))] }), _jsx(CardContent, { className: "space-y-3", children: data.results.map((result, index) => (_jsxs("div", { className: "space-y-1 border-t pt-3 first:border-t-0 first:pt-0", children: [_jsxs("div", { className: "flex items-start justify-between gap-2", children: [_jsx("a", { href: result.url, target: "_blank", rel: "noopener noreferrer", className: "font-medium text-sm text-primary hover:underline", children: result.title }), result.relevance !== undefined && (_jsxs(Badge, { variant: "secondary", className: "text-xs", children: [Math.round(result.relevance * 100), "% match"] }))] }), _jsx("div", { className: "text-sm text-muted-foreground line-clamp-2", children: result.snippet })] }, index))) })] }));
}
/**
 * Calculator Tool Result Component
 *
 * Renders calculation results with the expression.
 */
export function CalculatorToolResult({ data, }) {
    return (_jsxs(Card, { className: "border-purple-200 bg-purple-50/50", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-base flex items-center gap-2", children: "\uD83E\uDDEE Calculation Result" }) }), _jsxs(CardContent, { className: "space-y-3", children: [_jsx("div", { className: "text-sm text-muted-foreground font-mono", children: data.expression }), _jsxs("div", { className: "text-3xl font-bold text-purple-600", children: ["= ", data.result] }), data.steps && data.steps.length > 0 && (_jsxs("div", { className: "space-y-1 pt-2 border-t", children: [_jsx("div", { className: "text-xs font-medium text-muted-foreground", children: "Steps:" }), data.steps.map((step, idx) => (_jsx("div", { className: "text-xs text-muted-foreground font-mono", children: step }, idx)))] }))] })] }));
}
/**
 * Database Query Tool Result Component
 *
 * Renders database query results in a table format.
 */
export function DatabaseQueryToolResult({ data, }) {
    const columns = data.columns || (data.rows.length > 0 ? Object.keys(data.rows[0]) : []);
    return (_jsxs(Card, { className: "border-orange-200 bg-orange-50/50", children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { className: "text-base flex items-center gap-2", children: "\uD83D\uDDC4\uFE0F Database Query Results" }), _jsxs("div", { className: "text-xs text-muted-foreground", children: [data.rowCount, " row", data.rowCount !== 1 ? 's' : '', " returned"] })] }), _jsx(CardContent, { children: data.rows.length === 0 ? (_jsx("div", { className: "text-sm text-muted-foreground", children: "No rows returned" })) : (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm border-collapse", children: [_jsx("thead", { children: _jsx("tr", { className: "border-b", children: columns.map((col) => (_jsx("th", { className: "text-left p-2 font-medium text-muted-foreground", children: col }, col))) }) }), _jsx("tbody", { children: data.rows.map((row, idx) => (_jsx("tr", { className: "border-b last:border-b-0", children: columns.map((col) => (_jsx("td", { className: "p-2 text-muted-foreground", children: String(row[col] ?? 'NULL') }, col))) }, idx))) })] }) })) })] }));
}
/**
 * API Call Tool Result Component
 *
 * Renders API response with status code and data.
 */
export function APICallToolResult({ data, }) {
    const isSuccess = data.status >= 200 && data.status < 300;
    return (_jsxs(Card, { className: `border-${isSuccess ? 'green' : 'red'}-200 bg-${isSuccess ? 'green' : 'red'}-50/50`, children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { className: "text-base flex items-center gap-2", children: "\uD83C\uDF10 API Response" }), _jsxs("div", { className: "text-xs text-muted-foreground font-mono", children: [data.method, " ", data.url] })] }), _jsxs(CardContent, { className: "space-y-3", children: [_jsx("div", { className: "flex items-center gap-2", children: _jsxs(Badge, { variant: isSuccess ? 'success' : 'destructive', children: [data.status, " ", data.statusText] }) }), _jsxs("div", { className: "space-y-1", children: [_jsx("div", { className: "text-xs font-medium text-muted-foreground", children: "Response:" }), _jsx("pre", { className: "text-xs bg-muted/50 p-2 rounded overflow-x-auto", children: _jsx("code", { children: JSON.stringify(data.data, null, 2) }) })] }), data.headers && Object.keys(data.headers).length > 0 && (_jsxs("div", { className: "space-y-1 pt-2 border-t", children: [_jsx("div", { className: "text-xs font-medium text-muted-foreground", children: "Headers:" }), _jsx("pre", { className: "text-xs bg-muted/50 p-2 rounded overflow-x-auto", children: _jsx("code", { children: JSON.stringify(data.headers, null, 2) }) })] }))] })] }));
}
/**
 * Code Execution Tool Result Component
 *
 * Renders code execution results with output and errors.
 */
export function CodeExecutionToolResult({ data, }) {
    return (_jsxs(Card, { className: `border-${data.error ? 'red' : 'blue'}-200 bg-${data.error ? 'red' : 'blue'}-50/50`, children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { className: "text-base flex items-center gap-2", children: "\uD83D\uDCBB Code Execution" }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Badge, { variant: "secondary", className: "text-xs", children: data.language }), data.executionTime !== undefined && (_jsxs("div", { className: "text-xs text-muted-foreground", children: [data.executionTime, "ms"] }))] })] }), _jsxs(CardContent, { className: "space-y-3", children: [_jsxs("div", { className: "space-y-1", children: [_jsx("div", { className: "text-xs font-medium text-muted-foreground", children: "Code:" }), _jsx("pre", { className: "text-xs bg-muted/50 p-2 rounded overflow-x-auto", children: _jsx("code", { children: data.code }) })] }), data.error ? (_jsxs("div", { className: "space-y-1", children: [_jsx("div", { className: "text-xs font-medium text-destructive", children: "Error:" }), _jsx("pre", { className: "text-xs bg-destructive/10 p-2 rounded overflow-x-auto text-destructive", children: _jsx("code", { children: data.error }) })] })) : (data.output && (_jsxs("div", { className: "space-y-1", children: [_jsx("div", { className: "text-xs font-medium text-muted-foreground", children: "Output:" }), _jsx("pre", { className: "text-xs bg-muted/50 p-2 rounded overflow-x-auto", children: _jsx("code", { children: data.output }) })] })))] })] }));
}
/**
 * Example registry with all tool components
 */
export const exampleToolRegistry = {
    weather: WeatherToolResult,
    search: SearchToolResult,
    calculator: CalculatorToolResult,
    database_query: DatabaseQueryToolResult,
    api_call: APICallToolResult,
    code_execution: CodeExecutionToolResult,
};
//# sourceMappingURL=tool-ui-components.js.map