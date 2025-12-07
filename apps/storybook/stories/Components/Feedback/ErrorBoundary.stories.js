import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { ErrorBoundary, ErrorBoundaryEnhanced, ErrorReporterProvider, createConsoleErrorProvider, } from '@clarity-chat/react';
const SimulatedWidget = ({ explode }) => {
    if (explode) {
        throw new Error('Simulated failure: downstream embedding service not responding');
    }
    return (_jsxs("div", { className: "space-y-2 rounded-xl border border-border bg-card p-6 text-left shadow-sm", children: [_jsx("h3", { className: "text-sm font-semibold text-foreground", children: "Analytics Stream" }), _jsx("p", { className: "text-xs text-muted-foreground", children: "This widget renders live metrics from the agent run feed. Toggle the button below to simulate a runtime error." })] }));
};
/**
 * **ErrorBoundary Component**
 *
 * Production-ready React error boundaries with enhanced reporting
 * and recovery mechanisms.
 *
 * **Key Features:**
 * - Default and custom fallback UIs
 * - Error reporting integration
 * - Reset functionality
 * - Reset keys for automatic recovery
 * - Enhanced error boundary with telemetry
 * - Error context preservation
 *
 * **Use Cases:**
 * - Application-wide error handling
 * - Component-level error boundaries
 * - Error reporting and monitoring
 * - Graceful degradation
 */
const meta = {
    title: 'Components/Feedback/ErrorBoundary',
    component: ErrorBoundary,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: `
Production-ready React error boundaries with enhanced reporting
and recovery mechanisms.

## Features

- ✅ Default and custom fallback UIs
- ✅ Error reporting integration
- ✅ Reset functionality
- ✅ Reset keys for automatic recovery
- ✅ Enhanced error boundary with telemetry
- ✅ Error context preservation
- ✅ Accessible error messages

## Basic Usage

\`\`\`tsx
<ErrorBoundary
  fallback={(error, reset) => (
    <div>
      <p>Something went wrong: {error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  )}
  resetKeys={[someKey]}
>
  <YourComponent />
</ErrorBoundary>
\`\`\`
        `,
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        fallback: {
            description: 'Custom fallback component function',
            control: { type: 'object' },
        },
        resetKeys: {
            description: 'Array of values that trigger boundary reset when changed',
            control: { type: 'object' },
        },
        onError: {
            description: 'Callback when error is caught',
            action: 'error-caught',
        },
        onReset: {
            description: 'Callback when boundary is reset',
            action: 'reset',
        },
    },
};
export default meta;
export const DefaultFallback = {
    render: (args) => {
        const [explode, setExplode] = React.useState(false);
        const [resetKey, setResetKey] = React.useState(0);
        return (_jsxs("div", { className: "flex max-w-xl flex-col gap-4", children: [_jsxs(ErrorBoundary, { ...args, resetKeys: [resetKey], children: [_jsx(SimulatedWidget, { explode: explode }), _jsx("button", { type: "button", className: "w-fit rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-accent", onClick: () => setExplode(true), children: "Trigger Failure" })] }), _jsx("button", { type: "button", className: "w-fit rounded-lg border border-primary bg-primary/5 px-4 py-2 text-sm text-primary hover:bg-primary/10", onClick: () => {
                        setExplode(false);
                        setResetKey((prev) => prev + 1);
                    }, children: "Reset boundary" })] }));
    },
    args: {
        fallback: undefined,
    },
};
export const CustomFallback = {
    render: () => {
        const [explode, setExplode] = React.useState(false);
        return (_jsx(ErrorBoundary, { fallback: (error, reset) => (_jsxs("div", { className: "flex max-w-lg flex-col gap-3 rounded-xl border border-warning bg-warning/10 p-6 shadow-sm", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-sm font-semibold text-warning", children: "Graceful degradation" }), _jsx("p", { className: "text-xs text-muted-foreground", children: error.message })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { type: "button", className: "rounded-lg border border-border bg-background px-3 py-1 text-xs hover:bg-accent", onClick: () => reset(), children: "Retry render" }), _jsx("button", { type: "button", className: "rounded-lg border border-border bg-background px-3 py-1 text-xs hover:bg-accent", onClick: () => alert('Opening status page...'), children: "View status page" })] })] })), children: _jsxs("div", { className: "flex max-w-xl flex-col gap-4", children: [_jsx(SimulatedWidget, { explode: explode }), _jsx("button", { type: "button", className: "w-fit rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-accent", onClick: () => setExplode(true), children: "Trigger Failure" })] }) }));
    },
};
export const EnhancedWithTelemetry = {
    name: 'Enhanced Boundary with Telemetry',
    render: () => {
        const [explode, setExplode] = React.useState(false);
        return (_jsx(ErrorReporterProvider, { config: {
                providers: [createConsoleErrorProvider()],
                enabled: true,
                autoReport: true,
                enableFeedback: true,
            }, children: _jsx(ErrorBoundaryEnhanced, { enableFeedback: true, severity: "error", errorContext: { surface: 'SessionSummaryCard' }, onError: (error) => console.info('[Storybook] Error captured', error.message), fallback: (error, reset, showFeedback) => (_jsxs("div", { className: "flex max-w-lg flex-col gap-3 rounded-xl border border-destructive bg-destructive/10 p-6 shadow-sm", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-sm font-semibold text-destructive", children: "Session summary failed" }), _jsx("p", { className: "text-xs text-destructive/80", children: error.message })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { type: "button", className: "rounded-lg bg-destructive px-3 py-1 text-xs text-destructive-foreground hover:opacity-90", onClick: () => {
                                        setExplode(false);
                                        reset();
                                    }, children: "Retry render" }), _jsx("button", { type: "button", className: "rounded-lg border border-border bg-background px-3 py-1 text-xs hover:bg-accent", onClick: () => {
                                        showFeedback();
                                        alert('Feedback dialog opened via ErrorBoundaryEnhanced context');
                                    }, children: "Share feedback" })] })] })), children: _jsxs("div", { className: "flex max-w-xl flex-col gap-4", children: [_jsx(SimulatedWidget, { explode: explode }), _jsx("button", { type: "button", className: "w-fit rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-accent", onClick: () => setExplode(true), children: "Trigger Failure" })] }) }) }));
    },
};
//# sourceMappingURL=ErrorBoundary.stories.js.map