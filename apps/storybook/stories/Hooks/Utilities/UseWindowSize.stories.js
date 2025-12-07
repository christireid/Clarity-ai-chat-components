import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useWindowSize } from '@clarity-chat/react';
/**
 * **useWindowSize Hook**
 *
 * Hook for tracking window dimensions with throttled updates
 * to prevent performance issues during window resize events.
 *
 * **Key Features:**
 * - Track window width and height
 * - Automatic throttling (150ms default)
 * - SSR-safe (returns 0x0 on server)
 * - Automatic cleanup on unmount
 * - Memory efficient
 *
 * **Use Cases:**
 * - Responsive component rendering
 * - Conditional layout switching
 * - Dynamic sizing calculations
 * - Mobile/desktop detection
 */
const meta = {
    title: 'Hooks/Utilities/UseWindowSize',
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: `
The \`useWindowSize\` hook tracks window dimensions with throttled updates
to prevent performance issues during window resize events.

## Features

- ✅ Track window width and height
- ✅ Automatic throttling (150ms default)
- ✅ SSR-safe (returns 0x0 on server)
- ✅ Automatic cleanup on unmount
- ✅ Memory efficient
- ✅ Type-safe with TypeScript

## Basic Usage

\`\`\`tsx
const { width, height } = useWindowSize()

return (
  <div>
    Window size: {width} x {height}
    {width < 768 ? <MobileView /> : <DesktopView />}
  </div>
)
\`\`\`
        `,
            },
        },
    },
    tags: ['autodocs'],
};
export default meta;
function BasicWindowSizeDemo() {
    const { width, height } = useWindowSize();
    return (_jsxs("div", { className: "space-y-4 max-w-2xl", children: [_jsx("div", { className: "p-4 bg-gray-50 dark:bg-gray-900 border rounded-lg", children: _jsxs("div", { className: "space-y-2 text-sm", children: [_jsxs("div", { children: [_jsx("strong", { children: "Window Width:" }), " ", width, "px"] }), _jsxs("div", { children: [_jsx("strong", { children: "Window Height:" }), " ", height, "px"] }), _jsxs("div", { children: [_jsx("strong", { children: "Aspect Ratio:" }), " ", (width / height).toFixed(2)] })] }) }), _jsx("p", { className: "text-xs text-gray-500", children: "Resize the browser window to see the values update. Updates are throttled to prevent performance issues." })] }));
}
export const BasicUsage = {
    render: () => _jsx(BasicWindowSizeDemo, {}),
    parameters: {
        docs: {
            description: {
                story: 'Basic window size tracking with automatic updates on resize.',
            },
        },
    },
};
function ResponsiveLayoutDemo() {
    const { width } = useWindowSize();
    const getBreakpoint = () => {
        if (width < 640)
            return 'Mobile (< 640px)';
        if (width < 768)
            return 'Tablet (640px - 768px)';
        if (width < 1024)
            return 'Small Desktop (768px - 1024px)';
        if (width < 1280)
            return 'Desktop (1024px - 1280px)';
        return 'Large Desktop (> 1280px)';
    };
    return (_jsxs("div", { className: "space-y-4 max-w-2xl", children: [_jsx("div", { className: "p-4 bg-gray-50 dark:bg-gray-900 border rounded-lg", children: _jsxs("div", { className: "space-y-2 text-sm", children: [_jsxs("div", { children: [_jsx("strong", { children: "Current Width:" }), " ", width, "px"] }), _jsxs("div", { children: [_jsx("strong", { children: "Breakpoint:" }), " ", getBreakpoint()] })] }) }), _jsx("div", { className: "p-4 border rounded-lg", children: width < 640 ? (_jsxs("div", { className: "text-center p-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg", children: [_jsx("div", { className: "text-2xl mb-2", children: "\uD83D\uDCF1" }), _jsx("div", { className: "font-medium", children: "Mobile Layout" }), _jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400 mt-1", children: "Optimized for small screens" })] })) : width < 1024 ? (_jsxs("div", { className: "text-center p-8 bg-green-50 dark:bg-green-900/20 rounded-lg", children: [_jsx("div", { className: "text-2xl mb-2", children: "\uD83D\uDCBB" }), _jsx("div", { className: "font-medium", children: "Tablet/Desktop Layout" }), _jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400 mt-1", children: "Optimized for medium screens" })] })) : (_jsxs("div", { className: "text-center p-8 bg-purple-50 dark:bg-purple-900/20 rounded-lg", children: [_jsx("div", { className: "text-2xl mb-2", children: "\uD83D\uDDA5\uFE0F" }), _jsx("div", { className: "font-medium", children: "Large Desktop Layout" }), _jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400 mt-1", children: "Optimized for large screens" })] })) }), _jsx("p", { className: "text-xs text-gray-500", children: "Resize the browser window to see the layout change based on breakpoints." })] }));
}
export const ResponsiveLayout = {
    render: () => _jsx(ResponsiveLayoutDemo, {}),
    parameters: {
        docs: {
            description: {
                story: 'Using window size for responsive layout switching.',
            },
        },
    },
};
function ConditionalRenderingDemo() {
    const { width, height } = useWindowSize();
    const isMobile = width < 768;
    const isLandscape = width > height;
    const isSmallScreen = width < 640;
    return (_jsxs("div", { className: "space-y-4 max-w-2xl", children: [_jsx("div", { className: "p-4 bg-gray-50 dark:bg-gray-900 border rounded-lg", children: _jsxs("div", { className: "space-y-2 text-sm", children: [_jsxs("div", { children: [_jsx("strong", { children: "Is Mobile:" }), " ", isMobile ? 'Yes' : 'No', " (width < 768px)"] }), _jsxs("div", { children: [_jsx("strong", { children: "Is Landscape:" }), " ", isLandscape ? 'Yes' : 'No', " (width > height)"] }), _jsxs("div", { children: [_jsx("strong", { children: "Is Small Screen:" }), " ", isSmallScreen ? 'Yes' : 'No', " (width < 640px)"] })] }) }), _jsxs("div", { className: "space-y-2", children: [isMobile && (_jsx("div", { className: "p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-sm", children: "\uD83D\uDCF1 Mobile view active" })), isLandscape && (_jsx("div", { className: "p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-sm", children: "\u2194\uFE0F Landscape orientation" })), isSmallScreen && (_jsx("div", { className: "p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg text-sm", children: "\u26A0\uFE0F Small screen detected" }))] })] }));
}
export const ConditionalRendering = {
    render: () => _jsx(ConditionalRenderingDemo, {}),
    parameters: {
        docs: {
            description: {
                story: 'Using window size for conditional rendering based on screen size.',
            },
        },
    },
};
//# sourceMappingURL=UseWindowSize.stories.js.map