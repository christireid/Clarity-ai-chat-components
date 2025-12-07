import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import { useErrorRecovery } from '@clarity-chat/react';
const meta = {
    title: 'Hooks/Utilities/UseErrorRecovery',
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: `
# useErrorRecovery

Automatic error recovery hook with intelligent retry logic, exponential backoff, and error classification.

## Features

- **Automatic Retries**: Configurable retry attempts with backoff
- **Error Classification**: Categorizes errors (network, rate-limit, server, auth)
- **Exponential Backoff**: Progressive delay between retries
- **Selective Retry**: Determine which errors should be retried
- **User-Friendly Messages**: Converts technical errors to readable messages
- **State Management**: Tracks loading, retry state, and attempt count
- **Manual Retry**: Option to manually retry failed operations

## Use Cases

- **API Calls**: Retry failed HTTP requests
- **Network Issues**: Recover from temporary connection problems
- **Rate Limiting**: Handle 429 responses with backoff
- **Transient Failures**: Retry server errors (500, 502, 503)
- **User Operations**: Retry failed user actions

## Basic Usage

\`\`\`tsx
const { execute, error, isLoading, retry, canRetry } = useErrorRecovery({
  operation: async () => {
    const response = await fetch('/api/data')
    if (!response.ok) throw new Error('Failed to fetch')
    return response.json()
  },
  maxAttempts: 3,
  backoffMs: [1000, 3000, 10000],
})

// Execute with automatic retry
await execute()

// Manual retry if needed
if (error && canRetry) {
  await retry()
}
\`\`\`

## API Reference

### Options

- \`operation\`: Async function to execute
- \`maxAttempts\`: Maximum retry attempts (default: 3)
- \`backoffMs\`: Delays between retries in ms (default: [1000, 3000, 10000])
- \`shouldRetry\`: Function to determine if error is retryable
- \`onRetryStart\`: Called when retry begins
- \`onRetrySuccess\`: Called when retry succeeds
- \`onRetryFail\`: Called when retry fails
- \`onMaxAttemptsReached\`: Called when max attempts exhausted

### Returns

- \`execute()\`: Execute operation with retry logic
- \`retry()\`: Manually retry last failed operation
- \`error\`: Current error object
- \`isLoading\`: Whether operation is executing
- \`isRetrying\`: Whether currently retrying
- \`attemptNumber\`: Current attempt number
- \`canRetry\`: Whether retry is possible
- \`errorMessage\`: User-friendly error message
- \`errorType\`: Error classification
- \`data\`: Last successful result
- \`reset()\`: Reset state
`,
            },
        },
    },
};
export default meta;
// ============================================================================
// Basic Error Recovery
// ============================================================================
export const BasicExample = {
    render: () => {
        const [result, setResult] = React.useState(null);
        const [failureRate, setFailureRate] = React.useState(0.7); // 70% failure rate
        const { execute, error, isLoading, attemptNumber, canRetry, retry, errorMessage } = useErrorRecovery({
            operation: async () => {
                // Simulate API call
                await new Promise((resolve) => setTimeout(resolve, 500));
                if (Math.random() < failureRate) {
                    throw new Error('Network request failed');
                }
                return 'Success! Data loaded.';
            },
            maxAttempts: 3,
            backoffMs: [1000, 2000, 3000],
            onRetryStart: (attempt) => console.log(`Retry attempt ${attempt}`),
            onRetrySuccess: (_, attempt) => console.log(`Succeeded on attempt ${attempt}`),
        });
        const handleExecute = async () => {
            const data = await execute();
            if (data)
                setResult(data);
        };
        return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "p-4 bg-muted rounded-lg space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("span", { className: "text-sm font-medium", children: ["Failure Rate: ", Math.round(failureRate * 100), "%"] }), _jsx("input", { type: "range", min: "0", max: "100", value: failureRate * 100, onChange: (e) => setFailureRate(Number(e.target.value) / 100), className: "w-48" })] }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Adjust slider to simulate different failure rates" })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: handleExecute, disabled: isLoading, className: "px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50", children: isLoading ? 'Loading...' : 'Execute Operation' }), error && canRetry && (_jsx("button", { onClick: retry, className: "px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700", children: "Retry Manually" }))] }), isLoading && (_jsx("div", { className: "p-4 border border-blue-500 bg-blue-50 dark:bg-blue-950/20 rounded-lg", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full" }), _jsxs("span", { children: ["Attempt #", attemptNumber] })] }) })), error && (_jsxs("div", { className: "p-4 border border-red-500 bg-red-50 dark:bg-red-950/20 rounded-lg", children: [_jsx("div", { className: "font-semibold text-red-800 dark:text-red-200", children: "Error" }), _jsx("div", { className: "text-sm mt-1", children: errorMessage }), !canRetry && (_jsx("div", { className: "text-xs mt-2 text-muted-foreground", children: "Max retry attempts reached" }))] })), result && !error && (_jsxs("div", { className: "p-4 border border-green-500 bg-green-50 dark:bg-green-950/20 rounded-lg", children: [_jsx("div", { className: "font-semibold text-green-800 dark:text-green-200", children: "Success!" }), _jsx("div", { className: "text-sm mt-1", children: result })] }))] }));
    },
};
// ============================================================================
// Error Type Classification
// ============================================================================
export const ErrorClassificationExample = {
    render: () => {
        const [selectedError, setSelectedError] = React.useState('network');
        const errorSimulators = {
            network: () => new Error('Network connection failed'),
            ratelimit: () => new Error('Too many requests - rate limit exceeded (429)'),
            server: () => new Error('Internal server error (500)'),
            auth: () => new Error('Unauthorized access (401)'),
        };
        const { execute, error, errorType, errorMessage, isLoading, reset } = useErrorRecovery({
            operation: async () => {
                await new Promise((resolve) => setTimeout(resolve, 500));
                throw errorSimulators[selectedError]();
            },
            maxAttempts: 1, // Just demonstrate classification, no retries
        });
        return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Select Error Type to Simulate:" }), _jsx("div", { className: "flex flex-wrap gap-2", children: ['network', 'ratelimit', 'server', 'auth'].map((type) => (_jsx("button", { onClick: () => {
                                    setSelectedError(type);
                                    reset();
                                }, className: `px-3 py-1.5 text-sm rounded ${selectedError === type
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`, children: type.charAt(0).toUpperCase() + type.slice(1) }, type))) })] }), _jsx("button", { onClick: execute, disabled: isLoading, className: "px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50", children: "Trigger Error" }), error && (_jsxs("div", { className: "border rounded-lg p-4 space-y-3", children: [_jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "font-semibold", children: "Error Detected" }), _jsxs("div", { className: "text-sm text-muted-foreground mt-1", children: ["Type: ", _jsx("span", { className: "font-mono font-semibold", children: errorType })] })] }), _jsx("span", { className: `px-2 py-1 text-xs rounded ${errorType === 'network' ? 'bg-orange-100 text-orange-800' :
                                        errorType === 'ratelimit' ? 'bg-yellow-100 text-yellow-800' :
                                            errorType === 'server' ? 'bg-red-100 text-red-800' :
                                                'bg-purple-100 text-purple-800'}`, children: errorType })] }), _jsxs("div", { className: "p-3 bg-muted rounded text-sm", children: [_jsx("div", { className: "font-semibold mb-1", children: "User-Friendly Message:" }), _jsx("div", { children: errorMessage })] }), _jsxs("div", { className: "p-3 bg-muted rounded text-sm font-mono", children: [_jsx("div", { className: "font-semibold mb-1", children: "Technical Error:" }), _jsx("div", { className: "text-xs", children: error.message })] })] }))] }));
    },
    parameters: {
        docs: {
            description: {
                story: 'Demonstrates automatic error type classification and user-friendly messaging.',
            },
        },
    },
};
// ============================================================================
// Retry Strategy Visualization
// ============================================================================
export const RetryStrategyExample = {
    render: () => {
        const [attempts, setAttempts] = React.useState([]);
        const [backoffStrategy, setBackoffStrategy] = React.useState('exponential');
        const backoffDelays = {
            linear: [1000, 1000, 1000],
            exponential: [1000, 3000, 10000],
        };
        const { execute, isLoading, reset, attemptNumber } = useErrorRecovery({
            operation: async () => {
                const startTime = Date.now();
                await new Promise((resolve) => setTimeout(resolve, 300));
                // Succeed on 3rd attempt
                if (attemptNumber >= 3) {
                    setAttempts((prev) => [...prev, { attempt: attemptNumber, time: Date.now() - startTime, success: true }]);
                    return 'Success!';
                }
                setAttempts((prev) => [...prev, { attempt: attemptNumber, time: Date.now() - startTime, success: false }]);
                throw new Error('Operation failed');
            },
            maxAttempts: 5,
            backoffMs: backoffDelays[backoffStrategy],
            onRetryStart: (attempt) => console.log(`Starting attempt ${attempt}`),
        });
        const handleStart = async () => {
            setAttempts([]);
            await execute();
        };
        return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center gap-4 p-4 bg-muted rounded-lg", children: [_jsx("span", { className: "text-sm font-medium", children: "Backoff Strategy:" }), _jsx("div", { className: "flex gap-2", children: ['linear', 'exponential'].map((strategy) => (_jsx("button", { onClick: () => {
                                    setBackoffStrategy(strategy);
                                    reset();
                                    setAttempts([]);
                                }, className: `px-3 py-1.5 text-sm rounded ${backoffStrategy === strategy
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-background hover:bg-accent'}`, children: strategy.charAt(0).toUpperCase() + strategy.slice(1) }, strategy))) })] }), _jsx("button", { onClick: handleStart, disabled: isLoading, className: "px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50", children: "Start with Retry Strategy" }), attempts.length > 0 && (_jsxs("div", { className: "border rounded-lg p-4", children: [_jsx("h4", { className: "font-semibold mb-3", children: "Attempt Timeline" }), _jsx("div", { className: "space-y-2", children: attempts.map((attempt, index) => (_jsxs("div", { className: `flex items-center justify-between p-3 rounded ${attempt.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border`, children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("span", { className: "font-mono text-sm", children: ["#", attempt.attempt] }), _jsx("span", { className: "text-sm", children: attempt.success ? '✓ Success' : '✗ Failed' })] }), _jsxs("span", { className: "text-xs text-muted-foreground", children: [attempt.time, "ms"] })] }, index))) })] })), _jsxs("div", { className: "p-3 bg-muted rounded-lg text-sm", children: [_jsx("div", { className: "font-semibold mb-2", children: "Backoff Delays:" }), _jsxs("div", { className: "font-mono", children: [backoffDelays[backoffStrategy].join('ms → '), "ms"] })] })] }));
    },
    parameters: {
        docs: {
            description: {
                story: 'Visualizes retry attempts and backoff strategies (linear vs exponential).',
            },
        },
    },
};
// ============================================================================
// Real-World Scenario: API Data Fetching
// ============================================================================
export const APIDataFetchingExample = {
    render: () => {
        const [data, setData] = React.useState(null);
        const [serverStatus, setServerStatus] = React.useState('healthy');
        const { execute, error, isLoading, isRetrying, attemptNumber, errorMessage, reset } = useErrorRecovery({
            operation: async () => {
                await new Promise((resolve) => setTimeout(resolve, 800));
                if (serverStatus === 'down') {
                    throw new Error('Server unavailable (503)');
                }
                if (serverStatus === 'degraded' && Math.random() < 0.6) {
                    throw new Error('Request timeout - server is slow');
                }
                return {
                    users: Math.floor(Math.random() * 1000) + 100,
                    revenue: (Math.random() * 100000 + 50000).toFixed(2),
                    timestamp: new Date().toISOString(),
                };
            },
            maxAttempts: 4,
            backoffMs: [1000, 2000, 4000, 8000],
            shouldRetry: (error, attempt) => {
                // Don't retry auth errors
                if (error.message.includes('401') || error.message.includes('403')) {
                    return false;
                }
                return attempt < 4;
            },
            onRetrySuccess: (result) => setData(result),
        });
        const fetchData = async () => {
            setData(null);
            const result = await execute();
            if (result)
                setData(result);
        };
        return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "p-4 bg-muted rounded-lg space-y-3", children: [_jsx("div", { className: "font-semibold", children: "Simulate Server Status:" }), _jsx("div", { className: "flex gap-2", children: ['healthy', 'degraded', 'down'].map((status) => (_jsx("button", { onClick: () => {
                                    setServerStatus(status);
                                    reset();
                                    setData(null);
                                }, className: `px-3 py-1.5 text-sm rounded ${serverStatus === status
                                    ? status === 'healthy' ? 'bg-green-600 text-white' :
                                        status === 'degraded' ? 'bg-yellow-600 text-white' :
                                            'bg-red-600 text-white'
                                    : 'bg-background hover:bg-accent'}`, children: status.charAt(0).toUpperCase() + status.slice(1) }, status))) })] }), _jsx("button", { onClick: fetchData, disabled: isLoading, className: "px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50", children: "Fetch Dashboard Data" }), isLoading && (_jsx("div", { className: "p-4 border border-blue-500 bg-blue-50 dark:bg-blue-950/20 rounded-lg", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full" }), _jsxs("div", { children: [_jsx("div", { className: "font-semibold", children: isRetrying ? 'Retrying...' : 'Loading...' }), _jsxs("div", { className: "text-sm text-muted-foreground", children: ["Attempt #", attemptNumber, " of 4"] })] })] }) })), error && (_jsxs("div", { className: "p-4 border border-red-500 bg-red-50 dark:bg-red-950/20 rounded-lg", children: [_jsx("div", { className: "font-semibold text-red-800 dark:text-red-200", children: "Failed to load data" }), _jsx("div", { className: "text-sm mt-1", children: errorMessage })] })), data && !error && (_jsxs("div", { className: "border rounded-lg p-4", children: [_jsx("h4", { className: "font-semibold mb-3", children: "Dashboard Metrics" }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("div", { className: "text-2xl font-bold", children: data.users }), _jsx("div", { className: "text-sm text-muted-foreground", children: "Active Users" })] }), _jsxs("div", { children: [_jsxs("div", { className: "text-2xl font-bold", children: ["$", data.revenue] }), _jsx("div", { className: "text-sm text-muted-foreground", children: "Revenue" })] })] }), _jsxs("div", { className: "mt-3 text-xs text-muted-foreground", children: ["Updated: ", new Date(data.timestamp).toLocaleString()] })] }))] }));
    },
    parameters: {
        docs: {
            description: {
                story: 'Real-world scenario: Fetching dashboard data with server status simulation.',
            },
        },
    },
};
//# sourceMappingURL=UseErrorRecovery.stories.js.map