import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ClarityChatError } from '../errors';
/**
 * Default error fallback UI component
 */
function ErrorFallback({ error, resetError, }) {
    return (_jsxs("div", { style: {
            padding: '2rem',
            backgroundColor: '#fee',
            border: '1px solid #fcc',
            borderRadius: '8px',
            margin: '1rem 0',
        }, children: [_jsx("h2", { style: { color: '#c00', marginTop: 0 }, children: "Oops! Something went wrong" }), _jsx("p", { style: { color: '#600' }, children: error.message }), error instanceof ClarityChatError && error.solution && (_jsxs("div", { style: {
                    marginTop: '1rem',
                    padding: '1rem',
                    backgroundColor: '#fff',
                    borderRadius: '4px',
                }, children: [_jsx("strong", { children: "\uD83D\uDCA1 Solution:" }), _jsx("p", { children: error.solution })] })), _jsx("button", { onClick: resetError, style: {
                    marginTop: '1rem',
                    padding: '0.5rem 1rem',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                }, children: "Try Again" }), process.env['NODE_ENV'] === 'development' && (_jsxs("details", { style: { marginTop: '1rem' }, children: [_jsx("summary", { style: { cursor: 'pointer', color: '#666' }, children: "Stack trace" }), _jsx("pre", { style: {
                            marginTop: '0.5rem',
                            padding: '1rem',
                            backgroundColor: '#f5f5f5',
                            borderRadius: '4px',
                            overflow: 'auto',
                            fontSize: '0.875rem',
                        }, children: error.stack })] }))] }));
}
/**
 * Error boundary class component (required by React)
 * Internal implementation wrapped by functional component
 */
class ErrorBoundaryClass extends Component {
    constructor(props) {
        super(props);
        this.state = { error: null, errorInfo: null };
    }
    static getDerivedStateFromError(error) {
        return { error };
    }
    componentDidCatch(error, errorInfo) {
        this.setState({ errorInfo });
        this.props.onError?.(error, errorInfo);
        // Log error details in development
        if (process.env['NODE_ENV'] === 'development') {
            console.group('🚨 Clarity Chat Error');
            console.error('Error:', error);
            if (error instanceof ClarityChatError) {
                console.error('\n' + error.toString());
            }
            console.error('Component Stack:', errorInfo.componentStack);
            console.groupEnd();
        }
    }
    reset = () => {
        this.props.onReset?.();
        this.setState({ error: null, errorInfo: null });
    };
    render() {
        if (this.state.error) {
            if (this.props.fallback) {
                return this.props.fallback({
                    error: this.state.error,
                    resetError: this.reset,
                });
            }
            return _jsx(ErrorFallback, { error: this.state.error, resetError: this.reset });
        }
        return this.props.children;
    }
}
/**
 * Error Boundary component - catches errors in child components
 *
 * Modern functional wrapper around required class component
 *
 * @example
 * ```tsx
 * <ErrorBoundary
 *   fallback={({ error, resetError }) => (
 *     <div>
 *       <h1>Error: {error.message}</h1>
 *       <button onClick={resetError}>Try Again</button>
 *     </div>
 *   )}
 *   onError={(error, errorInfo) => {
 *     // Log to error tracking service
 *     logErrorToService(error, errorInfo)
 *   }}
 * >
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 */
export function ErrorBoundary(props) {
    return _jsx(ErrorBoundaryClass, { ...props, children: props.children });
}
//# sourceMappingURL=ErrorBoundary.js.map