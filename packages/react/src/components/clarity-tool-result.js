import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Card, CardContent, CardHeader } from '@clarity-chat/primitives';
import { ErrorBoundary } from './error-boundary';
/**
 * Default fallback component for unregistered tools
 */
function DefaultToolResult({ toolCall, result }) {
    return (_jsxs(Card, { className: "mt-2", children: [_jsx(CardHeader, { children: _jsxs("div", { className: "text-sm font-semibold", children: ["Tool: ", toolCall.name] }) }), _jsx(CardContent, { children: _jsx("pre", { className: "text-xs overflow-auto max-h-64 bg-muted p-2 rounded", children: JSON.stringify(result, null, 2) }) })] }));
}
/**
 * Renders tool results using registered UI components
 */
export function ClarityToolResult({ registry, toolCall, result, messages, fallback = DefaultToolResult, componentProps = {}, showHeader = false, className, enableErrorBoundary, errorFallback, }) {
    const Component = registry[toolCall.name];
    if (!Component) {
        // No registered component, use fallback
        const FallbackComponent = fallback || DefaultToolResult;
        return _jsx(FallbackComponent, { toolCall: toolCall, result: result });
    }
    const props = {
        data: result,
        messages,
        toolCall: {
            name: toolCall.name,
            args: toolCall.args || {},
        },
        ...componentProps,
    };
    const ToolComponentWrapper = () => (_jsxs(_Fragment, { children: [showHeader && (_jsxs("div", { className: "text-xs text-muted-foreground mb-2", children: ["Tool: ", toolCall.name] })), _jsx(Component, { ...props })] }));
    // Wrap in error boundary if enabled (default: true)
    if (enableErrorBoundary !== false) {
        const ErrorFallback = errorFallback || (({ error, toolCall }) => (_jsxs(Card, { className: "mt-2 border-destructive/20 bg-destructive/5", children: [_jsx(CardHeader, { children: _jsxs("div", { className: "text-sm font-semibold text-destructive", children: ["Error rendering tool: ", toolCall.name] }) }), _jsxs(CardContent, { children: [_jsx("p", { className: "text-xs text-muted-foreground", children: error.message }), _jsx("pre", { className: "text-xs overflow-auto max-h-32 bg-muted p-2 rounded mt-2", children: JSON.stringify(result, null, 2) })] })] })));
        return (_jsx("div", { className: className, children: _jsx(ErrorBoundary, { fallback: (error, resetError) => (_jsx(ErrorFallback, { error: error, toolCall: toolCall })), resetKeys: [toolCall.id ?? toolCall.name, toolCall.name], children: _jsx(ToolComponentWrapper, {}) }) }));
    }
    return (_jsx("div", { className: className, children: _jsx(ToolComponentWrapper, {}) }));
}
//# sourceMappingURL=clarity-tool-result.js.map