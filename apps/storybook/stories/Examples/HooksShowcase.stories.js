import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useDebounce, useThrottle, useToggle, useLocalStorage, useMediaQuery, useWindowSize, usePrevious, useClipboard, useMounted, } from '@clarity-chat/react';
import { Button } from '@clarity-chat/primitives';
const meta = {
    title: 'Examples/HooksShowcase',
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: `
A comprehensive collection of React hooks for building chat interfaces and interactive experiences.

## Categories

- **Chat Hooks**: \`useChat\`, \`useStreaming\`, \`useMessageOperations\`
- **UI Hooks**: \`useToggle\`, \`useClipboard\`, \`useMediaQuery\`
- **Performance**: \`useDebounce\`, \`useThrottle\`, \`useDeferredSearch\`
- **DOM**: \`useEventListener\`, \`useIntersectionObserver\`, \`useAutoScroll\`
- **State**: \`useLocalStorage\`, \`usePrevious\`, \`useOptimisticMessage\`
- **Advanced**: \`useErrorRecovery\`, \`useTokenTracker\`, \`useVoiceInput\`
        `,
            },
        },
    },
};
export default meta;
export const UseDebounce = {
    render: () => {
        const [text, setText] = useState('');
        const debouncedText = useDebounce(text, 500);
        return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold mb-2", children: "useDebounce" }), _jsx("p", { className: "text-sm text-muted-foreground mb-4", children: "Delays updating a value until after a specified delay has passed since the last change." })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("input", { type: "text", value: text, onChange: (e) => setText(e.target.value), placeholder: "Type something...", className: "w-full px-3 py-2 border rounded-md" }), _jsxs("div", { className: "p-3 bg-muted rounded-md", children: [_jsxs("div", { className: "text-sm", children: [_jsx("strong", { children: "Immediate value:" }), " ", text || '(empty)'] }), _jsxs("div", { className: "text-sm", children: [_jsx("strong", { children: "Debounced value (500ms):" }), " ", debouncedText || '(empty)'] })] })] }), _jsx("div", { className: "text-xs text-muted-foreground", children: "Perfect for search inputs, auto-save, and API calls" })] }));
    },
};
export const UseThrottle = {
    render: () => {
        const [scrollCount, setScrollCount] = useState(0);
        const throttledCount = useThrottle(scrollCount, 500);
        return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold mb-2", children: "useThrottle" }), _jsx("p", { className: "text-sm text-muted-foreground mb-4", children: "Limits how often a value can update to at most once per specified interval." })] }), _jsx("div", { className: "h-64 overflow-y-scroll border rounded-md p-4 bg-muted/20", onScroll: () => setScrollCount((c) => c + 1), children: _jsx("div", { className: "h-[800px] flex items-center justify-center", children: _jsx("div", { className: "text-center", children: _jsx("p", { className: "text-sm text-muted-foreground", children: "Scroll to test throttling" }) }) }) }), _jsxs("div", { className: "p-3 bg-muted rounded-md space-y-1", children: [_jsxs("div", { className: "text-sm", children: [_jsx("strong", { children: "Scroll events:" }), " ", scrollCount] }), _jsxs("div", { className: "text-sm", children: [_jsx("strong", { children: "Throttled updates (500ms):" }), " ", throttledCount] })] }), _jsx("div", { className: "text-xs text-muted-foreground", children: "Perfect for scroll handlers, resize events, and mouse tracking" })] }));
    },
};
export const UseToggle = {
    render: () => {
        const [isOn, toggle, setOn, setOff] = useToggle(false);
        return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold mb-2", children: "useToggle" }), _jsx("p", { className: "text-sm text-muted-foreground mb-4", children: "Manages boolean state with convenient toggle, set, and reset functions." })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: `w-16 h-16 rounded-full flex items-center justify-center text-2xl transition-colors ${isOn ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`, children: isOn ? '✓' : '✗' }), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "text-lg font-semibold mb-2", children: ["State: ", isOn ? 'ON' : 'OFF'] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { size: "sm", onClick: () => toggle(), children: "Toggle" }), _jsx(Button, { size: "sm", variant: "outline", onClick: () => setOn(), children: "Turn On" }), _jsx(Button, { size: "sm", variant: "outline", onClick: () => setOff(), children: "Turn Off" })] })] })] }), _jsx("div", { className: "text-xs text-muted-foreground", children: "Perfect for modals, menus, dark mode, and feature flags" })] }));
    },
};
export const UseLocalStorage = {
    render: () => {
        const [name, setName] = useLocalStorage('storybook-name', '');
        const [count, setCount] = useLocalStorage('storybook-count', 0);
        return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold mb-2", children: "useLocalStorage" }), _jsx("p", { className: "text-sm text-muted-foreground mb-4", children: "Syncs state with localStorage, persisting across page reloads." })] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium mb-1 block", children: "Your Name" }), _jsx("input", { type: "text", value: name, onChange: (e) => setName(e.target.value), placeholder: "Enter your name", className: "w-full px-3 py-2 border rounded-md" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium mb-1 block", children: "Counter" }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { onClick: () => setCount(count - 1), children: "-" }), _jsx("div", { className: "flex-1 flex items-center justify-center border rounded-md", children: count }), _jsx(Button, { onClick: () => setCount(count + 1), children: "+" })] })] })] }), _jsxs("div", { className: "p-3 bg-muted rounded-md text-sm", children: [_jsx("div", { className: "font-semibold mb-1", children: "Persisted State:" }), _jsx("code", { className: "text-xs", children: JSON.stringify({
                                'storybook-name': name || null,
                                'storybook-count': count,
                            }, null, 2) })] }), _jsx("div", { className: "text-xs text-muted-foreground", children: "Reload the page to see the values persist! Perfect for user preferences, settings, and draft content." })] }));
    },
};
export const UseMediaQuery = {
    render: () => {
        const isMobile = useMediaQuery('(max-width: 640px)');
        const isTablet = useMediaQuery('(min-width: 641px) and (max-width: 1024px)');
        const isDesktop = useMediaQuery('(min-width: 1025px)');
        const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
        const isReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
        return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold mb-2", children: "useMediaQuery" }), _jsx("p", { className: "text-sm text-muted-foreground mb-4", children: "Responds to CSS media queries in React, enabling responsive and adaptive UIs." })] }), _jsx("div", { className: "space-y-2", children: [
                        { label: 'Mobile', value: isMobile, query: '(max-width: 640px)' },
                        {
                            label: 'Tablet',
                            value: isTablet,
                            query: '(min-width: 641px) and (max-width: 1024px)',
                        },
                        { label: 'Desktop', value: isDesktop, query: '(min-width: 1025px)' },
                        { label: 'Dark Mode', value: isDarkMode, query: '(prefers-color-scheme: dark)' },
                        {
                            label: 'Reduced Motion',
                            value: isReducedMotion,
                            query: '(prefers-reduced-motion: reduce)',
                        },
                    ].map(({ label, value, query }) => (_jsxs("div", { className: "flex items-center justify-between p-3 border rounded-md", children: [_jsxs("div", { children: [_jsx("div", { className: "font-medium", children: label }), _jsx("code", { className: "text-xs text-muted-foreground", children: query })] }), _jsx("div", { className: `px-3 py-1 rounded-full text-sm font-medium ${value
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                                    : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`, children: value ? 'Active' : 'Inactive' })] }, label))) }), _jsx("div", { className: "text-xs text-muted-foreground", children: "Resize your window to see responsive breakpoints change. Perfect for responsive layouts, adaptive components, and accessibility preferences." })] }));
    },
};
export const UseWindowSize = {
    render: () => {
        const { width, height } = useWindowSize();
        const getBreakpoint = () => {
            if (width < 640)
                return 'Mobile';
            if (width < 1024)
                return 'Tablet';
            return 'Desktop';
        };
        return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold mb-2", children: "useWindowSize" }), _jsx("p", { className: "text-sm text-muted-foreground mb-4", children: "Tracks the current window dimensions and updates on resize." })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "p-4 border rounded-md text-center", children: [_jsxs("div", { className: "text-3xl font-bold text-primary", children: [width, "px"] }), _jsx("div", { className: "text-sm text-muted-foreground mt-1", children: "Width" })] }), _jsxs("div", { className: "p-4 border rounded-md text-center", children: [_jsxs("div", { className: "text-3xl font-bold text-primary", children: [height, "px"] }), _jsx("div", { className: "text-sm text-muted-foreground mt-1", children: "Height" })] })] }), _jsxs("div", { className: "p-4 bg-muted rounded-md text-center", children: [_jsx("div", { className: "text-lg font-semibold", children: getBreakpoint() }), _jsx("div", { className: "text-sm text-muted-foreground", children: "Current Breakpoint" })] }), _jsx("div", { className: "text-xs text-muted-foreground", children: "Resize your browser to see values update. Perfect for responsive layouts, canvas sizing, and viewport calculations." })] }));
    },
};
export const UsePrevious = {
    render: () => {
        const [count, setCount] = useState(0);
        const previousCount = usePrevious(count);
        return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold mb-2", children: "usePrevious" }), _jsx("p", { className: "text-sm text-muted-foreground mb-4", children: "Stores and returns the previous value of a variable." })] }), _jsxs("div", { className: "flex gap-4 items-center", children: [_jsx(Button, { onClick: () => setCount(count - 1), children: "-" }), _jsxs("div", { className: "flex-1 text-center", children: [_jsx("div", { className: "text-4xl font-bold text-primary", children: count }), _jsx("div", { className: "text-sm text-muted-foreground mt-1", children: "Current" })] }), _jsx(Button, { onClick: () => setCount(count + 1), children: "+" })] }), _jsxs("div", { className: "p-4 bg-muted rounded-md text-center", children: [_jsx("div", { className: "text-2xl font-semibold", children: previousCount ?? '—' }), _jsx("div", { className: "text-sm text-muted-foreground mt-1", children: "Previous Value" })] }), previousCount !== undefined && (_jsx("div", { className: "p-3 border rounded-md text-center", children: _jsxs("div", { className: "text-sm", children: ["Changed by:", ' ', _jsxs("span", { className: `font-bold ${count > previousCount ? 'text-green-600' : 'text-red-600'}`, children: [count > previousCount ? '+' : '', count - previousCount] })] }) })), _jsx("div", { className: "text-xs text-muted-foreground", children: "Perfect for animations, transitions, and comparing value changes" })] }));
    },
};
export const UseClipboard = {
    render: () => {
        const { copy, copied, error } = useClipboard();
        const [textToCopy, setTextToCopy] = useState('Hello from Clarity Chat! 👋');
        return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold mb-2", children: "useClipboard" }), _jsx("p", { className: "text-sm text-muted-foreground mb-4", children: "Provides an easy way to copy text to the clipboard with feedback." })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("textarea", { value: textToCopy, onChange: (e) => setTextToCopy(e.target.value), className: "w-full px-3 py-2 border rounded-md font-mono text-sm", rows: 3, placeholder: "Enter text to copy..." }), _jsx(Button, { onClick: () => copy(textToCopy), className: "w-full", disabled: copied, children: copied ? '✓ Copied!' : 'Copy to Clipboard' })] }), error && (_jsxs("div", { className: "p-3 bg-destructive/10 text-destructive rounded-md text-sm", children: ["Error: ", error.message] })), _jsxs("div", { className: "p-3 bg-muted rounded-md text-sm", children: [_jsx("div", { className: "font-semibold mb-1", children: "Status:" }), _jsx("div", { children: copied ? '✓ Text copied successfully!' : 'Ready to copy' })] }), _jsx("div", { className: "text-xs text-muted-foreground", children: "Perfect for code snippets, sharing links, and copy buttons. The copied state resets after 2 seconds." })] }));
    },
};
export const UseMounted = {
    render: () => {
        const isMounted = useMounted();
        const [showContent, setShowContent] = useState(false);
        return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold mb-2", children: "useMounted" }), _jsx("p", { className: "text-sm text-muted-foreground mb-4", children: "Returns whether the component is currently mounted (useful for preventing state updates after unmount)." })] }), _jsx("div", { className: "p-4 bg-muted rounded-md", children: _jsxs("div", { className: "text-sm space-y-2", children: [_jsxs("div", { children: ["Component mounted: ", _jsx("strong", { children: isMounted ? 'Yes ✓' : 'No ✗' })] }), _jsx("div", { className: "text-xs text-muted-foreground", children: "This hook returns false on first render and true after the component mounts. It's useful for preventing SSR/hydration issues and avoiding state updates after unmount." })] }) }), _jsxs(Button, { onClick: () => setShowContent(!showContent), children: [showContent ? 'Hide' : 'Show', " Conditionally Rendered Content"] }), showContent && isMounted && (_jsxs("div", { className: "p-4 border border-primary rounded-md bg-primary/5 animate-in fade-in", children: [_jsx("div", { className: "font-medium", children: "This content only shows when mounted!" }), _jsx("div", { className: "text-sm text-muted-foreground mt-1", children: "Perfect for preventing \"Can't perform a React state update on an unmounted component\" warnings." })] })), _jsx("div", { className: "text-xs text-muted-foreground", children: "Perfect for async operations, animations, and preventing memory leaks" })] }));
    },
};
export const HooksCatalog = {
    render: () => {
        return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold mb-2", children: "Complete Hooks Catalog" }), _jsx("p", { className: "text-muted-foreground", children: "Browse all available hooks organized by category" })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "border rounded-lg p-4", children: [_jsx("h3", { className: "text-lg font-semibold mb-3", children: "\uD83D\uDCAC Chat Hooks" }), _jsx("div", { className: "grid gap-2", children: [
                                        { name: 'useChat', desc: 'Main hook for managing chat state and messages' },
                                        { name: 'useStreaming', desc: 'Handle streaming responses from AI models' },
                                        { name: 'useStreamingSSE', desc: 'Server-sent events streaming' },
                                        {
                                            name: 'useStreamingWebSocket',
                                            desc: 'WebSocket-based streaming',
                                        },
                                        {
                                            name: 'useMessageOperations',
                                            desc: 'CRUD operations for messages',
                                        },
                                        {
                                            name: 'useOptimisticMessage',
                                            desc: 'Optimistic UI updates',
                                        },
                                    ].map((hook) => (_jsxs("div", { className: "flex gap-2 text-sm", children: [_jsx("code", { className: "font-mono text-primary", children: hook.name }), _jsxs("span", { className: "text-muted-foreground", children: ["\u2014 ", hook.desc] })] }, hook.name))) })] }), _jsxs("div", { className: "border rounded-lg p-4", children: [_jsx("h3", { className: "text-lg font-semibold mb-3", children: "\uD83C\uDFA8 UI Hooks" }), _jsx("div", { className: "grid gap-2", children: [
                                        { name: 'useToggle', desc: 'Boolean state with toggle helpers' },
                                        { name: 'useClipboard', desc: 'Copy text to clipboard' },
                                        { name: 'useMediaQuery', desc: 'Respond to CSS media queries' },
                                        { name: 'useWindowSize', desc: 'Track window dimensions' },
                                        { name: 'useAutoScroll', desc: 'Auto-scroll to bottom' },
                                        {
                                            name: 'useIntersectionObserver',
                                            desc: 'Track element visibility',
                                        },
                                    ].map((hook) => (_jsxs("div", { className: "flex gap-2 text-sm", children: [_jsx("code", { className: "font-mono text-primary", children: hook.name }), _jsxs("span", { className: "text-muted-foreground", children: ["\u2014 ", hook.desc] })] }, hook.name))) })] }), _jsxs("div", { className: "border rounded-lg p-4", children: [_jsx("h3", { className: "text-lg font-semibold mb-3", children: "\u26A1 Performance Hooks" }), _jsx("div", { className: "grid gap-2", children: [
                                        { name: 'useDebounce', desc: 'Delay value updates' },
                                        { name: 'useThrottle', desc: 'Limit update frequency' },
                                        { name: 'useDeferredSearch', desc: 'Non-blocking search' },
                                        { name: 'usePerformance', desc: 'Track component performance' },
                                    ].map((hook) => (_jsxs("div", { className: "flex gap-2 text-sm", children: [_jsx("code", { className: "font-mono text-primary", children: hook.name }), _jsxs("span", { className: "text-muted-foreground", children: ["\u2014 ", hook.desc] })] }, hook.name))) })] }), _jsxs("div", { className: "border rounded-lg p-4", children: [_jsx("h3", { className: "text-lg font-semibold mb-3", children: "\uD83D\uDCBE State Hooks" }), _jsx("div", { className: "grid gap-2", children: [
                                        { name: 'useLocalStorage', desc: 'Persist state in localStorage' },
                                        { name: 'usePrevious', desc: 'Access previous value' },
                                        { name: 'useMounted', desc: 'Check if component is mounted' },
                                        { name: 'useUndoRedo', desc: 'Undo/redo functionality' },
                                    ].map((hook) => (_jsxs("div", { className: "flex gap-2 text-sm", children: [_jsx("code", { className: "font-mono text-primary", children: hook.name }), _jsxs("span", { className: "text-muted-foreground", children: ["\u2014 ", hook.desc] })] }, hook.name))) })] }), _jsxs("div", { className: "border rounded-lg p-4", children: [_jsx("h3", { className: "text-lg font-semibold mb-3", children: "\uD83C\uDF10 DOM Hooks" }), _jsx("div", { className: "grid gap-2", children: [
                                        { name: 'useEventListener', desc: 'Add event listeners safely' },
                                        {
                                            name: 'useIntersectionObserver',
                                            desc: 'Observe element intersection',
                                        },
                                        { name: 'useHaptic', desc: 'Trigger haptic feedback' },
                                    ].map((hook) => (_jsxs("div", { className: "flex gap-2 text-sm", children: [_jsx("code", { className: "font-mono text-primary", children: hook.name }), _jsxs("span", { className: "text-muted-foreground", children: ["\u2014 ", hook.desc] })] }, hook.name))) })] }), _jsxs("div", { className: "border rounded-lg p-4", children: [_jsx("h3", { className: "text-lg font-semibold mb-3", children: "\uD83D\uDE80 Advanced Hooks" }), _jsx("div", { className: "grid gap-2", children: [
                                        { name: 'useErrorRecovery', desc: 'Handle and recover from errors' },
                                        { name: 'useTokenTracker', desc: 'Track AI token usage' },
                                        { name: 'useVoiceInput', desc: 'Speech-to-text input' },
                                        { name: 'useMobileKeyboard', desc: 'Mobile keyboard handling' },
                                        { name: 'useRealisticTyping', desc: 'Typing animation effect' },
                                    ].map((hook) => (_jsxs("div", { className: "flex gap-2 text-sm", children: [_jsx("code", { className: "font-mono text-primary", children: hook.name }), _jsxs("span", { className: "text-muted-foreground", children: ["\u2014 ", hook.desc] })] }, hook.name))) })] })] })] }));
    },
};
//# sourceMappingURL=HooksShowcase.stories.js.map