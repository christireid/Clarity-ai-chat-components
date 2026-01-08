import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * Error Boundary Component
 *
 * A beautifully designed error boundary with:
 * - Helpful error suggestions
 * - Common error patterns recognition
 * - Recovery options
 * - Professional visual design
 * - Copy error functionality
 */
import { Component } from 'react';
import { AlertCircle, RefreshCw, Copy, Check, Lightbulb, Bug, AlertTriangle, ChevronDown, ExternalLink, } from 'lucide-react';
import { copyToClipboard, cn } from '../utils';
// Common error patterns and suggestions
const errorSuggestions = [
    {
        pattern: /is not defined|is not a function/i,
        title: 'Undefined Reference',
        suggestions: [
            'Check if the variable or function is properly imported',
            'Verify the spelling and case sensitivity',
            'Make sure the component is exported correctly',
        ],
    },
    {
        pattern: /cannot read propert|undefined|null/i,
        title: 'Null Reference',
        suggestions: [
            'Add null checks before accessing properties',
            'Use optional chaining (?.) for safer property access',
            'Initialize state with default values',
        ],
    },
    {
        pattern: /invalid hook call|hooks can only be called/i,
        title: 'Invalid Hook Call',
        suggestions: [
            'Hooks must be called at the top level of your component',
            "Don't call hooks inside loops, conditions, or nested functions",
            'Ensure you have only one copy of React in your bundle',
        ],
    },
    {
        pattern: /jsx|unexpected token/i,
        title: 'Syntax Error',
        suggestions: [
            'Check for missing or extra brackets, parentheses, or braces',
            'Ensure JSX elements are properly closed',
            'Verify all imports are correct',
        ],
    },
    {
        pattern: /maximum update depth|infinite loop/i,
        title: 'Infinite Loop',
        suggestions: [
            'Check useEffect dependencies array',
            'Avoid setting state unconditionally in useEffect',
            'Use useCallback for functions passed as dependencies',
        ],
    },
    {
        pattern: /render|component/i,
        title: 'Render Error',
        suggestions: [
            'Check if all required props are passed',
            'Verify conditional rendering logic',
            'Make sure the component returns valid JSX',
        ],
    },
];
function getErrorSuggestion(errorMessage) {
    for (const suggestion of errorSuggestions) {
        if (suggestion.pattern.test(errorMessage)) {
            return suggestion;
        }
    }
    return {
        title: 'Runtime Error',
        suggestions: [
            'Check the console for more details',
            'Review recent code changes',
            'Try resetting to the original template',
        ],
    };
}
export class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
            copied: false,
        };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, errorInfo) {
        this.setState({ errorInfo });
        this.props.onError?.(error, errorInfo);
        // Log to console for debugging
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
    handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
        this.props.onReset?.();
    };
    handleCopyError = async () => {
        const { error, errorInfo } = this.state;
        const errorText = `Error: ${error?.message}\n\nStack:\n${error?.stack}\n\nComponent Stack:\n${errorInfo?.componentStack}`;
        const success = await copyToClipboard(errorText);
        if (success) {
            this.setState({ copied: true });
            setTimeout(() => this.setState({ copied: false }), 2000);
        }
    };
    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }
            const { error, errorInfo, copied } = this.state;
            const suggestion = getErrorSuggestion(error?.message || '');
            return (_jsx("div", { className: "p-6 bg-gradient-to-br from-rose-50 to-orange-50 dark:from-rose-900/20 dark:to-orange-900/20 border border-rose-200 dark:border-rose-800 rounded-2xl animate-fade-in", children: _jsxs("div", { className: "flex items-start gap-4", children: [_jsx("div", { className: "w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center flex-shrink-0", children: _jsx(Bug, { className: "w-6 h-6 text-rose-600 dark:text-rose-400" }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx("h3", { className: "font-bold text-lg text-rose-900 dark:text-rose-100", children: "Something went wrong" }), _jsx("span", { className: "px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 text-xs font-medium", children: suggestion.title })] }), _jsx("p", { className: "text-sm text-rose-800 dark:text-rose-200 mb-4", children: "An error occurred while rendering the component. This might be due to invalid code or a runtime error." }), error && (_jsxs("div", { className: "mb-4 p-4 bg-white/50 dark:bg-gray-900/50 rounded-xl border border-rose-200 dark:border-rose-800", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx(AlertCircle, { className: "w-4 h-4 text-rose-500" }), _jsx("span", { className: "text-sm font-semibold text-rose-900 dark:text-rose-100", children: "Error Message" })] }), _jsx("pre", { className: "text-sm text-rose-700 dark:text-rose-300 bg-rose-100/50 dark:bg-rose-900/30 p-3 rounded-lg overflow-x-auto whitespace-pre-wrap font-mono", children: error.message })] })), _jsxs("div", { className: "mb-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800", children: [_jsxs("div", { className: "flex items-center gap-2 mb-3", children: [_jsx(Lightbulb, { className: "w-4 h-4 text-amber-500" }), _jsx("span", { className: "text-sm font-semibold text-amber-900 dark:text-amber-100", children: "Suggestions" })] }), _jsx("ul", { className: "space-y-2", children: suggestion.suggestions.map((tip, index) => (_jsxs("li", { className: "flex items-start gap-2 text-sm text-amber-800 dark:text-amber-200", children: [_jsx("span", { className: "w-5 h-5 rounded-full bg-amber-200 dark:bg-amber-800 flex items-center justify-center flex-shrink-0 text-xs font-bold text-amber-700 dark:text-amber-300", children: index + 1 }), tip] }, index))) })] }), errorInfo?.componentStack && (_jsxs("details", { className: "mb-4 group", children: [_jsxs("summary", { className: "flex items-center gap-2 text-sm font-medium text-rose-700 dark:text-rose-300 cursor-pointer hover:text-rose-900 dark:hover:text-rose-100 transition-colors", children: [_jsx(ChevronDown, { className: "w-4 h-4 transition-transform group-open:rotate-180" }), "View Component Stack"] }), _jsx("pre", { className: "mt-2 text-xs text-rose-600 dark:text-rose-400 bg-rose-100/50 dark:bg-rose-900/30 p-3 rounded-lg overflow-x-auto whitespace-pre-wrap font-mono max-h-48 overflow-y-auto", children: errorInfo.componentStack })] })), _jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [_jsxs("button", { onClick: this.handleReset, className: "flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium rounded-xl transition-colors shadow-lg shadow-rose-500/25", children: [_jsx(RefreshCw, { className: "w-4 h-4" }), "Try Again"] }), _jsx("button", { onClick: this.handleCopyError, className: cn('flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-colors', copied
                                                ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300'
                                                : 'bg-rose-100 dark:bg-rose-900/40 hover:bg-rose-200 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300'), children: copied ? (_jsxs(_Fragment, { children: [_jsx(Check, { className: "w-4 h-4" }), "Copied!"] })) : (_jsxs(_Fragment, { children: [_jsx(Copy, { className: "w-4 h-4" }), "Copy Error"] })) }), _jsxs("a", { href: "https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary", target: "_blank", rel: "noopener noreferrer", className: "flex items-center gap-2 px-4 py-2 text-sm font-medium text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 transition-colors", children: [_jsx(ExternalLink, { className: "w-4 h-4" }), "Learn More"] })] })] })] }) }));
        }
        return this.props.children;
    }
}
export class PreviewErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, errorInfo) {
        console.error('Preview error:', error, errorInfo);
    }
    handleRetry = () => {
        this.setState({ hasError: false, error: null });
        this.props.onRetry?.();
    };
    render() {
        if (this.state.hasError) {
            const suggestion = getErrorSuggestion(this.state.error?.message || '');
            return (_jsxs("div", { className: "flex flex-col items-center justify-center h-full p-8 text-center animate-fade-in", children: [_jsx("div", { className: "w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-100 to-orange-100 dark:from-rose-900/30 dark:to-orange-900/30 flex items-center justify-center mb-4 shadow-lg", children: _jsx(AlertTriangle, { className: "w-8 h-8 text-rose-500" }) }), _jsx("h3", { className: "text-lg font-bold text-gray-900 dark:text-white mb-2", children: "Preview Error" }), _jsx("span", { className: "px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 text-xs font-medium mb-3", children: suggestion.title }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 mb-4 max-w-sm", children: this.state.error?.message || 'An error occurred in the preview' }), _jsxs("div", { className: "mb-6 px-4 py-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 text-left max-w-sm", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx(Lightbulb, { className: "w-4 h-4 text-amber-500" }), _jsx("span", { className: "text-xs font-semibold text-amber-800 dark:text-amber-200", children: "Quick Tip" })] }), _jsx("p", { className: "text-xs text-amber-700 dark:text-amber-300", children: suggestion.suggestions[0] })] }), _jsxs("button", { onClick: this.handleRetry, className: "flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white text-sm font-medium rounded-xl transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40", children: [_jsx(RefreshCw, { className: "w-4 h-4" }), "Retry"] })] }));
        }
        return this.props.children;
    }
}
export default ErrorBoundary;
//# sourceMappingURL=ErrorBoundary.js.map