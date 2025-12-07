import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ErrorBoundary } from '@clarity-chat/error-handling';
import { ConfigurationError, APIError } from '@clarity-chat/error-handling';
import { useState } from 'react';
const meta = {
    title: 'Components/ErrorBoundary',
    component: ErrorBoundary,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};
export default meta;
// Component that throws an error
function ThrowError({ error }) {
    throw error || new Error('Something went wrong!');
}
// Component with button to trigger error
function ErrorTrigger() {
    const [shouldThrow, setShouldThrow] = useState(false);
    if (shouldThrow) {
        throw new Error('User triggered error');
    }
    return (_jsxs("div", { children: [_jsx("h3", { children: "Click to trigger error" }), _jsx("button", { onClick: () => setShouldThrow(true), children: "Throw Error" })] }));
}
export const DefaultFallback = {
    args: {
        children: _jsx(ThrowError, {}),
    },
};
export const CustomFallback = {
    args: {
        children: _jsx(ThrowError, {}),
        fallback: ({ error, resetError }) => (_jsxs("div", { style: { padding: '2rem', border: '2px solid red', borderRadius: '8px' }, children: [_jsx("h2", { children: "Custom Error UI" }), _jsx("p", { children: error.message }), _jsx("button", { onClick: resetError, children: "Reset" })] })),
    },
};
export const WithConfigurationError = {
    args: {
        children: (_jsx(ThrowError, { error: new ConfigurationError('Missing API endpoint', {
                code: 'MISSING_API_ENDPOINT',
                solution: 'Add apiEndpoint prop to your component',
            }) })),
    },
};
export const WithAPIError = {
    args: {
        children: (_jsx(ThrowError, { error: new APIError('Request failed', {
                code: 'API_REQUEST_FAILED',
                statusCode: 500,
                solution: 'Check your API endpoint and try again',
            }) })),
    },
};
export const InteractiveTrigger = {
    args: {
        children: _jsx(ErrorTrigger, {}),
    },
};
export const WithErrorCallback = {
    args: {
        children: _jsx(ThrowError, {}),
        onError: (error, errorInfo) => {
            console.log('Error caught:', error);
            console.log('Error info:', errorInfo);
        },
    },
};
//# sourceMappingURL=ErrorBoundary.stories.js.map