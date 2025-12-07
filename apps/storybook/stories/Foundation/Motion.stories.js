import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { ComponentHeader } from '../../.storybook/blocks';
const meta = {
    title: 'Foundation/Motion & Animation',
    parameters: {
        layout: 'centered',
        docs: {
            page: () => (_jsxs("div", { className: "max-w-6xl mx-auto p-8", children: [_jsx(ComponentHeader, { title: "Motion & Animation", status: "stable", description: "Purposeful animations that enhance user experience without distracting. All animations respect prefers-reduced-motion." }), _jsx("div", { className: "prose prose-slate max-w-none", children: _jsx("p", { children: "Motion in Clarity Chat is designed to be subtle, purposeful, and performant. Animations provide visual feedback, guide attention, and create a polished experience." }) })] })),
        },
    },
    tags: ['autodocs'],
};
export default meta;
// Transition Durations
export const TransitionDurations = {
    render: () => {
        const durations = [
            { name: 'Fast', value: '150ms', class: 'duration-150' },
            { name: 'Normal', value: '200ms', class: 'duration-200' },
            { name: 'Smooth', value: '300ms', class: 'duration-300' },
            { name: 'Slow', value: '500ms', class: 'duration-500' },
        ];
        return (_jsxs("div", { className: "w-full max-w-2xl p-8", children: [_jsx("h2", { className: "text-2xl font-bold mb-6", children: "Transition Durations" }), _jsx("div", { className: "space-y-6", children: durations.map((duration) => {
                        const [isHovered, setIsHovered] = useState(false);
                        return (_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm font-semibold", children: duration.name }), _jsx("span", { className: "text-sm text-gray-500 font-mono", children: duration.value })] }), _jsx("div", { className: "relative h-16 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden cursor-pointer", onMouseEnter: () => setIsHovered(true), onMouseLeave: () => setIsHovered(false), children: _jsx("div", { className: `absolute inset-y-0 left-0 bg-brand-500 ${duration.class} transition-all`, style: { width: isHovered ? '100%' : '20%' } }) }), _jsx("p", { className: "text-xs text-gray-500", children: "Hover to see animation" })] }, duration.name));
                    }) }), _jsxs("div", { className: "mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-800", children: [_jsx("h3", { className: "text-sm font-semibold mb-2", children: "Usage Guidelines" }), _jsxs("ul", { className: "text-xs space-y-1", children: [_jsxs("li", { children: ["\u2022 ", _jsx("strong", { children: "Fast (150ms)" }), ": Instant feedback like button presses"] }), _jsxs("li", { children: ["\u2022 ", _jsx("strong", { children: "Normal (200ms)" }), ": Most hover states and small movements"] }), _jsxs("li", { children: ["\u2022 ", _jsx("strong", { children: "Smooth (300ms)" }), ": Larger movements and state changes"] }), _jsxs("li", { children: ["\u2022 ", _jsx("strong", { children: "Slow (500ms)" }), ": Complex animations and page transitions"] })] })] })] }));
    },
};
// Easing Functions
export const EasingFunctions = {
    render: () => {
        const easings = [
            { name: 'Linear', class: 'ease-linear' },
            { name: 'Ease', class: 'ease' },
            { name: 'Ease In', class: 'ease-in' },
            { name: 'Ease Out', class: 'ease-out' },
            { name: 'Ease In Out', class: 'ease-in-out' },
        ];
        return (_jsxs("div", { className: "w-full max-w-2xl p-8", children: [_jsx("h2", { className: "text-2xl font-bold mb-6", children: "Easing Functions" }), _jsx("div", { className: "space-y-6", children: easings.map((easing) => {
                        const [isAnimating, setIsAnimating] = useState(false);
                        return (_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm font-semibold", children: easing.name }), _jsx("button", { onClick: () => {
                                                setIsAnimating(true);
                                                setTimeout(() => setIsAnimating(false), 1000);
                                            }, className: "text-xs px-3 py-1 bg-brand-500 text-white rounded hover:bg-brand-600 transition-colors", children: "Replay" })] }), _jsx("div", { className: "relative h-16 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden", children: _jsx("div", { className: `absolute inset-y-0 left-0 w-12 bg-brand-500 duration-1000 ${easing.class}`, style: {
                                            transform: isAnimating ? 'translateX(calc(100vw - 400px))' : 'translateX(0)',
                                        } }) })] }, easing.name));
                    }) })] }));
    },
};
// Common Animations
export const CommonAnimations = {
    render: () => {
        return (_jsxs("div", { className: "w-full max-w-2xl p-8 space-y-8", children: [_jsx("h2", { className: "text-2xl font-bold mb-6", children: "Common Animations" }), _jsxs("div", { className: "space-y-2", children: [_jsx("h3", { className: "text-sm font-semibold", children: "Fade In" }), _jsx("div", { className: "animate-fade-in p-4 bg-brand-500/20 rounded-lg", children: _jsx("p", { className: "text-sm", children: "This element fades in smoothly" }) }), _jsx("code", { className: "text-xs text-gray-600 dark:text-gray-400 block mt-2", children: "className=\"animate-fade-in\"" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("h3", { className: "text-sm font-semibold", children: "Slide Up" }), _jsx("div", { className: "animate-slide-up p-4 bg-brand-500/20 rounded-lg", children: _jsx("p", { className: "text-sm", children: "This element slides up" }) }), _jsx("code", { className: "text-xs text-gray-600 dark:text-gray-400 block mt-2", children: "className=\"animate-slide-up\"" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("h3", { className: "text-sm font-semibold", children: "Scale on Hover" }), _jsx("button", { className: "px-6 py-3 bg-brand-500 text-white rounded-lg hover:scale-105 transition-transform duration-200", children: "Hover Me" }), _jsx("code", { className: "text-xs text-gray-600 dark:text-gray-400 block mt-2", children: "className=\"hover:scale-105 transition-transform duration-200\"" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("h3", { className: "text-sm font-semibold", children: "Translate on Hover" }), _jsx("div", { className: "p-4 bg-brand-500/20 rounded-lg hover:-translate-y-1 transition-transform duration-200 cursor-pointer", children: _jsx("p", { className: "text-sm", children: "Hover to lift" }) }), _jsx("code", { className: "text-xs text-gray-600 dark:text-gray-400 block mt-2", children: "className=\"hover:-translate-y-1 transition-transform duration-200\"" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("h3", { className: "text-sm font-semibold", children: "Shadow on Hover" }), _jsx("div", { className: "p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200 cursor-pointer border-2 border-border", children: _jsx("p", { className: "text-sm", children: "Hover for shadow" }) }), _jsx("code", { className: "text-xs text-gray-600 dark:text-gray-400 block mt-2", children: "className=\"shadow-sm hover:shadow-lg transition-shadow duration-200\"" })] })] }));
    },
};
// Loading Animations
export const LoadingAnimations = {
    render: () => {
        return (_jsxs("div", { className: "w-full max-w-2xl p-8 space-y-8", children: [_jsx("h2", { className: "text-2xl font-bold mb-6", children: "Loading Animations" }), _jsxs("div", { className: "space-y-2", children: [_jsx("h3", { className: "text-sm font-semibold", children: "Spinner" }), _jsx("div", { className: "animate-spin h-8 w-8 border-4 border-brand-500 border-t-transparent rounded-full" }), _jsx("code", { className: "text-xs text-gray-600 dark:text-gray-400 block mt-2", children: "className=\"animate-spin\"" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("h3", { className: "text-sm font-semibold", children: "Pulse" }), _jsx("div", { className: "animate-pulse h-8 w-48 bg-brand-500/20 rounded-lg" }), _jsx("code", { className: "text-xs text-gray-600 dark:text-gray-400 block mt-2", children: "className=\"animate-pulse\"" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("h3", { className: "text-sm font-semibold", children: "Bounce" }), _jsx("div", { className: "animate-bounce h-8 w-8 bg-brand-500 rounded-full" }), _jsx("code", { className: "text-xs text-gray-600 dark:text-gray-400 block mt-2", children: "className=\"animate-bounce\"" })] })] }));
    },
};
//# sourceMappingURL=Motion.stories.js.map