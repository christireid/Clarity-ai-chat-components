import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback } from 'react';
import { EnhancedErrorBoundary } from './EnhancedErrorBoundary';
import { RetryCountdown } from './RetryCountdown';
import { ApiError, ApiErrorCode } from '../errors/api-error';
import { StreamingError } from '../errors/streaming-error';
import { ProviderError } from '../errors/provider-error';
const meta = {
    title: 'Components/EnhancedErrorBoundary',
    component: EnhancedErrorBoundary,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        enableLogging: {
            control: 'boolean',
            description: 'Enable console logging of errors',
        },
    },
};
export default meta;
// Component that throws an error
function ThrowError({ error }) {
    throw error || new Error('Something went wrong!');
}
// Component with button to trigger error
function ErrorTrigger({ errorFactory }) {
    const [shouldThrow, setShouldThrow] = useState(false);
    if (shouldThrow) {
        throw errorFactory?.() || new Error('User triggered error');
    }
    return (_jsxs("div", { style: { padding: '2rem', textAlign: 'center' }, children: [_jsx("h3", { style: { marginBottom: '1rem' }, children: "Click to trigger error" }), _jsx("button", { onClick: () => setShouldThrow(true), style: {
                    padding: '0.5rem 1rem',
                    fontSize: '1rem',
                    cursor: 'pointer',
                }, children: "Throw Error" })] }));
}
// Component that can trigger errors on demand with type selection
function InteractiveErrorTrigger({ errorType, shouldThrow, }) {
    if (shouldThrow) {
        switch (errorType) {
            case 'api-429':
                throw new ApiError('Rate limit exceeded', {
                    code: ApiErrorCode.RATE_LIMITED,
                    statusCode: 429,
                });
            case 'api-500':
                throw new ApiError('Internal server error', {
                    code: ApiErrorCode.SERVER_ERROR,
                    statusCode: 500,
                });
            case 'api-403':
                throw new ApiError('Access forbidden', {
                    code: ApiErrorCode.FORBIDDEN,
                    statusCode: 403,
                });
            case 'streaming-lost':
                throw StreamingError.connectionLost('sse', 'Partial message before disconnect...');
            case 'streaming-timeout':
                throw StreamingError.timeout('sse', 30000);
            case 'provider-rate':
                throw ProviderError.rateLimit('openai', 30, 'gpt-4');
            case 'provider-context':
                throw ProviderError.contextLengthExceeded('anthropic', 100000, 200000);
            case 'provider-filter':
                throw ProviderError.contentFiltered('openai', 'gpt-4');
            case 'generic':
            default:
                throw new Error('Something went wrong!');
        }
    }
    return (_jsx("div", { style: {
            padding: '2rem',
            backgroundColor: '#f0fdf4',
            borderRadius: '0.5rem',
            textAlign: 'center',
        }, children: _jsx("p", { style: { color: '#16a34a', fontWeight: 500 }, children: "\u2713 Component is working normally" }) }));
}
// Interactive story with full controls
function InteractiveErrorBoundaryDemo() {
    const [shouldThrow, setShouldThrow] = useState(false);
    const [errorType, setErrorType] = useState('generic');
    const [key, setKey] = useState(0);
    const [lastError, setLastError] = useState(null);
    const [errorCount, setErrorCount] = useState(0);
    const handleError = useCallback((error) => {
        setLastError(error.message);
        setErrorCount((c) => c + 1);
    }, []);
    const handleReset = useCallback(() => {
        setShouldThrow(false);
        setLastError(null);
    }, []);
    const triggerError = () => {
        setKey((k) => k + 1);
        setShouldThrow(true);
    };
    const reset = () => {
        setKey((k) => k + 1);
        setShouldThrow(false);
        setLastError(null);
    };
    return (_jsxs("div", { style: { width: '450px' }, children: [_jsxs("div", { style: {
                    marginBottom: '1rem',
                    padding: '1rem',
                    backgroundColor: '#1f2937',
                    borderRadius: '0.5rem',
                    color: 'white',
                }, children: [_jsx("h4", { style: {
                            margin: '0 0 0.75rem 0',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                        }, children: "\uD83C\uDFAE Error Boundary Controls" }), _jsxs("div", { style: { marginBottom: '0.75rem' }, children: [_jsx("label", { style: {
                                    display: 'block',
                                    marginBottom: '0.25rem',
                                    fontSize: '0.75rem',
                                    color: '#9ca3af',
                                }, children: "Error Type:" }), _jsxs("select", { value: errorType, onChange: (e) => setErrorType(e.target.value), style: {
                                    width: '100%',
                                    padding: '0.5rem',
                                    borderRadius: '0.25rem',
                                    border: '1px solid #374151',
                                    backgroundColor: '#374151',
                                    color: 'white',
                                    fontSize: '0.875rem',
                                }, children: [_jsx("optgroup", { label: "Generic", children: _jsx("option", { value: "generic", children: "Generic Error" }) }), _jsxs("optgroup", { label: "API Errors", children: [_jsx("option", { value: "api-429", children: "API: Rate Limited (429)" }), _jsx("option", { value: "api-500", children: "API: Server Error (500)" }), _jsx("option", { value: "api-403", children: "API: Forbidden (403)" })] }), _jsxs("optgroup", { label: "Streaming Errors", children: [_jsx("option", { value: "streaming-lost", children: "Streaming: Connection Lost" }), _jsx("option", { value: "streaming-timeout", children: "Streaming: Timeout" })] }), _jsxs("optgroup", { label: "Provider Errors", children: [_jsx("option", { value: "provider-rate", children: "Provider: Rate Limit" }), _jsx("option", { value: "provider-context", children: "Provider: Context Length" }), _jsx("option", { value: "provider-filter", children: "Provider: Content Filter" })] })] })] }), _jsxs("div", { style: { display: 'flex', gap: '0.5rem' }, children: [_jsx("button", { onClick: triggerError, style: {
                                    flex: 1,
                                    padding: '0.5rem',
                                    backgroundColor: '#ef4444',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '0.25rem',
                                    cursor: 'pointer',
                                    fontWeight: 500,
                                    fontSize: '0.875rem',
                                }, children: "\uD83D\uDD25 Trigger Error" }), _jsx("button", { onClick: reset, style: {
                                    flex: 1,
                                    padding: '0.5rem',
                                    backgroundColor: '#3b82f6',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '0.25rem',
                                    cursor: 'pointer',
                                    fontWeight: 500,
                                    fontSize: '0.875rem',
                                }, children: "\uD83D\uDD04 Reset" })] })] }), _jsxs("div", { style: {
                    marginBottom: '1rem',
                    padding: '0.75rem',
                    backgroundColor: '#fef3c7',
                    borderRadius: '0.5rem',
                    fontSize: '0.75rem',
                }, children: [_jsxs("div", { style: {
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gap: '0.5rem',
                        }, children: [_jsxs("div", { children: [_jsx("strong", { children: "Status:" }), " ", shouldThrow ? '❌ Error' : '✅ OK'] }), _jsxs("div", { children: [_jsx("strong", { children: "Total Errors:" }), " ", errorCount] })] }), lastError && (_jsxs("div", { style: { marginTop: '0.5rem', color: '#b45309' }, children: [_jsx("strong", { children: "Last:" }), " ", lastError.substring(0, 50), lastError.length > 50 ? '...' : ''] }))] }), _jsx(EnhancedErrorBoundary, { onError: handleError, onReset: handleReset, enableLogging: true, children: _jsx(InteractiveErrorTrigger, { errorType: errorType, shouldThrow: shouldThrow }) }, key)] }));
}
export const Interactive = {
    render: () => _jsx(InteractiveErrorBoundaryDemo, {}),
    parameters: {
        docs: {
            description: {
                story: 'Interactive demo with controls to trigger different error types and observe the error boundary behavior.',
            },
        },
    },
};
// Retry Countdown demo
function RetryCountdownDemo() {
    const [isRetrying, setIsRetrying] = useState(false);
    const [retryMs, setRetryMs] = useState(5000);
    const [showProgress, setShowProgress] = useState(true);
    const [size, setSize] = useState('md');
    const [completedCount, setCompletedCount] = useState(0);
    return (_jsxs("div", { style: { width: '400px' }, children: [_jsxs("div", { style: {
                    marginBottom: '1.5rem',
                    padding: '1rem',
                    backgroundColor: '#1f2937',
                    borderRadius: '0.5rem',
                    color: 'white',
                }, children: [_jsx("h4", { style: {
                            margin: '0 0 0.75rem 0',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                        }, children: "\u23F1\uFE0F Countdown Controls" }), _jsxs("div", { style: { marginBottom: '0.75rem' }, children: [_jsxs("label", { style: {
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: '0.25rem',
                                    fontSize: '0.75rem',
                                    color: '#9ca3af',
                                }, children: [_jsx("span", { children: "Retry Delay:" }), _jsxs("span", { children: [retryMs / 1000, "s"] })] }), _jsx("input", { type: "range", min: "1000", max: "10000", step: "1000", value: retryMs, onChange: (e) => setRetryMs(Number(e.target.value)), style: { width: '100%' } })] }), _jsxs("div", { style: { display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }, children: [_jsxs("div", { style: { flex: 1 }, children: [_jsx("label", { style: {
                                            display: 'block',
                                            marginBottom: '0.25rem',
                                            fontSize: '0.75rem',
                                            color: '#9ca3af',
                                        }, children: "Size:" }), _jsxs("select", { value: size, onChange: (e) => setSize(e.target.value), style: {
                                            width: '100%',
                                            padding: '0.5rem',
                                            borderRadius: '0.25rem',
                                            border: '1px solid #374151',
                                            backgroundColor: '#374151',
                                            color: 'white',
                                            fontSize: '0.875rem',
                                        }, children: [_jsx("option", { value: "sm", children: "Small" }), _jsx("option", { value: "md", children: "Medium" }), _jsx("option", { value: "lg", children: "Large" })] })] }), _jsx("div", { style: { flex: 1, display: 'flex', alignItems: 'flex-end' }, children: _jsxs("label", { style: {
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        fontSize: '0.75rem',
                                        padding: '0.5rem',
                                        color: '#9ca3af',
                                    }, children: [_jsx("input", { type: "checkbox", checked: showProgress, onChange: (e) => setShowProgress(e.target.checked) }), "Show Progress"] }) })] }), _jsx("button", { onClick: () => setIsRetrying(true), disabled: isRetrying, style: {
                            width: '100%',
                            padding: '0.5rem',
                            backgroundColor: isRetrying ? '#6b7280' : '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.25rem',
                            cursor: isRetrying ? 'not-allowed' : 'pointer',
                            fontWeight: 500,
                            fontSize: '0.875rem',
                        }, children: isRetrying ? '⏳ Running...' : '▶️ Start Countdown' })] }), _jsxs("div", { style: {
                    marginBottom: '1rem',
                    padding: '0.75rem',
                    backgroundColor: '#dbeafe',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    textAlign: 'center',
                }, children: ["Countdown completed: ", _jsx("strong", { children: completedCount }), " times"] }), _jsx("div", { style: {
                    padding: '2rem',
                    backgroundColor: isRetrying ? '#fef2f2' : '#f9fafb',
                    borderRadius: '0.5rem',
                    minHeight: '180px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: isRetrying ? '2px solid #fecaca' : '2px solid #e5e7eb',
                }, children: isRetrying ? (_jsx(RetryCountdown, { remainingMs: retryMs, showProgress: showProgress, size: size, onComplete: () => {
                        setIsRetrying(false);
                        setCompletedCount((c) => c + 1);
                    }, onRetryNow: () => {
                        setIsRetrying(false);
                        setCompletedCount((c) => c + 1);
                    } })) : (_jsxs("div", { style: { textAlign: 'center', color: '#6b7280' }, children: [_jsx("p", { style: { marginBottom: '0.5rem' }, children: "Click \"Start Countdown\" to see the retry timer" }), _jsx("p", { style: { fontSize: '0.75rem' }, children: "This component shows users when automatic retry will occur" })] })) })] }));
}
export const RetryCountdownInteractive = {
    render: () => _jsx(RetryCountdownDemo, {}),
    parameters: {
        docs: {
            description: {
                story: 'Interactive demo of the RetryCountdown component with adjustable delay, size, and progress ring visibility.',
            },
        },
    },
};
// Static stories for documentation
export const Default = {
    args: {
        children: _jsx(ThrowError, {}),
        enableLogging: true,
    },
};
export const WithRecoverableApiError = {
    args: {
        children: (_jsx(ThrowError, { error: new ApiError('Rate limit exceeded', {
                code: ApiErrorCode.RATE_LIMITED,
                statusCode: 429,
            }) })),
        enableLogging: true,
    },
};
export const WithNonRecoverableError = {
    args: {
        children: (_jsx(ThrowError, { error: new ApiError('Forbidden', {
                code: ApiErrorCode.FORBIDDEN,
                statusCode: 403,
            }) })),
        enableLogging: true,
    },
};
export const WithStreamingError = {
    args: {
        children: (_jsx(ThrowError, { error: StreamingError.connectionLost('sse', 'The answer to your question is...') })),
        enableLogging: true,
    },
};
export const WithProviderError = {
    args: {
        children: (_jsx(ThrowError, { error: ProviderError.rateLimit('openai', 30, 'gpt-4') })),
        enableLogging: true,
    },
};
export const InteractiveTrigger = {
    args: {
        children: _jsx(ErrorTrigger, {}),
        enableLogging: true,
    },
};
export const WithResetKeys = {
    render: () => {
        const [key, setKey] = useState(0);
        return (_jsxs("div", { children: [_jsx("div", { style: { marginBottom: '1rem' }, children: _jsxs("button", { onClick: () => setKey((k) => k + 1), children: ["Change Reset Key (Current: ", key, ")"] }) }), _jsx(EnhancedErrorBoundary, { resetKeys: [key], enableLogging: true, children: _jsx(ErrorTrigger, {}) })] }));
    },
};
export const CustomFallbackComponent = {
    args: {
        children: _jsx(ThrowError, {}),
        enableLogging: true,
        FallbackComponent: ({ error, resetErrorBoundary }) => (_jsxs("div", { style: {
                padding: '2rem',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '12px',
                color: 'white',
                textAlign: 'center',
                maxWidth: '400px',
            }, children: [_jsx("h2", { style: { marginBottom: '1rem' }, children: "\uD83C\uDFA8 Custom Error UI" }), _jsx("p", { style: { opacity: 0.9 }, children: error.message }), _jsx("button", { onClick: resetErrorBoundary, style: {
                        marginTop: '1rem',
                        padding: '0.75rem 1.5rem',
                        background: 'white',
                        color: '#764ba2',
                        border: 'none',
                        borderRadius: '6px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                    }, children: "Try Again" })] })),
    },
};
//# sourceMappingURL=EnhancedErrorBoundary.stories.js.map