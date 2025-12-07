import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useThrottle } from '@clarity-chat/react';
import { Button } from '@clarity-chat/primitives';
import { useState, useEffect } from 'react';
/**
 * **useThrottle Hook**
 *
 * Hook for throttling values - only updates at most once per delay period.
 * Useful for limiting the rate of updates from frequent events.
 *
 * **Key Features:**
 * - Throttle value updates
 * - Configurable delay
 * - Limits update frequency
 * - Automatic cleanup
 *
 * **Use Cases:**
 * - Scroll position tracking
 * - Resize handlers
 * - Mouse move events
 * - Window scroll events
 */
const meta = {
    title: 'Hooks/Performance/UseThrottle',
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: `
The \`useThrottle\` hook limits value updates to at most once per delay period.
This is useful for limiting the rate of updates from frequent events like scroll or resize.

## Features

- ✅ Throttle value updates
- ✅ Configurable delay
- ✅ Limits update frequency
- ✅ Automatic cleanup
- ✅ Type-safe with TypeScript

## Basic Usage

\`\`\`tsx
const [scrollY, setScrollY] = useState(0)
const throttledScrollY = useThrottle(scrollY, 100)

useEffect(() => {
  const handleScroll = () => setScrollY(window.scrollY)
  window.addEventListener('scroll', handleScroll)
  return () => window.removeEventListener('scroll', handleScroll)
}, [])
\`\`\`
        `,
            },
        },
    },
    tags: ['autodocs'],
};
export default meta;
function ScrollTrackingDemo() {
    const [scrollY, setScrollY] = useState(0);
    const [delay, setDelay] = useState(100);
    const throttledScrollY = useThrottle(scrollY, delay);
    const [updates, setUpdates] = useState(0);
    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    useEffect(() => {
        if (throttledScrollY !== scrollY) {
            setUpdates((prev) => prev + 1);
        }
    }, [throttledScrollY]);
    return (_jsxs("div", { className: "space-y-4 max-w-2xl", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Throttle Delay (ms):" }), _jsx("input", { type: "number", value: delay, onChange: (e) => setDelay(Number(e.target.value)), className: "w-full p-2 border rounded-lg", min: "50", max: "1000", step: "50" })] }), _jsxs("div", { className: "p-4 bg-gray-50 dark:bg-gray-900 border rounded-lg space-y-2", children: [_jsxs("div", { className: "text-sm", children: [_jsx("strong", { children: "Current Scroll Y:" }), " ", scrollY, "px"] }), _jsxs("div", { className: "text-sm", children: [_jsx("strong", { children: "Throttled Scroll Y:" }), " ", throttledScrollY, "px"] }), _jsxs("div", { className: "text-sm", children: [_jsx("strong", { children: "Throttled Updates:" }), " ", updates] }), _jsxs("p", { className: "text-xs text-gray-500 mt-2", children: ["Scroll the page to see throttling in action. Updates are limited to once per ", delay, "ms."] })] }), _jsx("div", { className: "h-96 overflow-y-auto border rounded-lg p-4 bg-gray-50 dark:bg-gray-900", children: _jsx("div", { className: "space-y-4", children: Array.from({ length: 50 }, (_, i) => (_jsxs("div", { className: "p-4 bg-white dark:bg-gray-800 rounded", children: ["Scroll item ", i + 1, " - Keep scrolling to see throttling effect"] }, i))) }) })] }));
}
export const ScrollTracking = {
    render: () => _jsx(ScrollTrackingDemo, {}),
    parameters: {
        docs: {
            description: {
                story: 'Throttling scroll position updates to limit update frequency.',
            },
        },
    },
};
function ResizeTrackingDemo() {
    const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
    const [delay, setDelay] = useState(200);
    const throttledSize = useThrottle(windowSize, delay);
    const [updates, setUpdates] = useState(0);
    useEffect(() => {
        const handleResize = () => {
            setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    useEffect(() => {
        setUpdates((prev) => prev + 1);
    }, [throttledSize]);
    return (_jsxs("div", { className: "space-y-4 max-w-2xl", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Throttle Delay (ms):" }), _jsx("input", { type: "number", value: delay, onChange: (e) => setDelay(Number(e.target.value)), className: "w-full p-2 border rounded-lg", min: "100", max: "1000", step: "100" })] }), _jsxs("div", { className: "p-4 bg-gray-50 dark:bg-gray-900 border rounded-lg space-y-2", children: [_jsxs("div", { className: "text-sm", children: [_jsx("strong", { children: "Current Window Size:" }), " ", windowSize.width, " \u00D7 ", windowSize.height, "px"] }), _jsxs("div", { className: "text-sm", children: [_jsx("strong", { children: "Throttled Window Size:" }), " ", throttledSize.width, " \u00D7 ", throttledSize.height, "px"] }), _jsxs("div", { className: "text-sm", children: [_jsx("strong", { children: "Throttled Updates:" }), " ", updates] }), _jsxs("p", { className: "text-xs text-gray-500 mt-2", children: ["Resize the browser window to see throttling in action. Updates are limited to once per ", delay, "ms."] })] })] }));
}
export const ResizeTracking = {
    render: () => _jsx(ResizeTrackingDemo, {}),
    parameters: {
        docs: {
            description: {
                story: 'Throttling window resize events to limit update frequency.',
            },
        },
    },
};
function CounterDemo() {
    const [count, setCount] = useState(0);
    const [delay, setDelay] = useState(500);
    const throttledCount = useThrottle(count, delay);
    const [updates, setUpdates] = useState(0);
    useEffect(() => {
        setUpdates((prev) => prev + 1);
    }, [throttledCount]);
    return (_jsxs("div", { className: "space-y-4 max-w-2xl", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Throttle Delay (ms):" }), _jsx("input", { type: "number", value: delay, onChange: (e) => setDelay(Number(e.target.value)), className: "w-full p-2 border rounded-lg", min: "100", max: "2000", step: "100" })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { onClick: () => setCount((prev) => prev + 1), children: "Increment Count" }), _jsx(Button, { onClick: () => setCount(0), variant: "outline", children: "Reset" })] }), _jsxs("div", { className: "p-4 bg-gray-50 dark:bg-gray-900 border rounded-lg space-y-2", children: [_jsxs("div", { className: "text-sm", children: [_jsx("strong", { children: "Current Count:" }), " ", count] }), _jsxs("div", { className: "text-sm", children: [_jsx("strong", { children: "Throttled Count:" }), " ", throttledCount] }), _jsxs("div", { className: "text-sm", children: [_jsx("strong", { children: "Throttled Updates:" }), " ", updates] }), _jsxs("p", { className: "text-xs text-gray-500 mt-2", children: ["Click rapidly to see throttling effect. Updates are limited to once per ", delay, "ms."] })] })] }));
}
export const Counter = {
    render: () => _jsx(CounterDemo, {}),
    parameters: {
        docs: {
            description: {
                story: 'Throttling counter updates to demonstrate throttling behavior.',
            },
        },
    },
};
//# sourceMappingURL=UseThrottle.stories.js.map