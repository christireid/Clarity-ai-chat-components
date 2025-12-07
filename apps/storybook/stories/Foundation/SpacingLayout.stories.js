import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ComponentHeader } from '../../.storybook/blocks';
const meta = {
    title: 'Foundation/Spacing & Layout',
    parameters: {
        layout: 'fullscreen',
        docs: {
            page: () => (_jsxs("div", { className: "max-w-6xl mx-auto p-8", children: [_jsx(ComponentHeader, { title: "Spacing & Layout", status: "stable", description: "Consistent spacing scale and layout primitives for building responsive, accessible interfaces." }), _jsx("div", { className: "prose prose-slate max-w-none", children: _jsx("p", { children: "Clarity Chat uses Tailwind CSS's spacing scale (based on 0.25rem increments) for consistent spacing across all components. This ensures visual rhythm and predictable layouts." }) })] })),
        },
    },
    tags: ['autodocs'],
};
export default meta;
// Spacing Scale Visualization
export const SpacingScale = {
    render: () => {
        const spaces = [
            { name: '1', value: '0.25rem', pixels: '4px' },
            { name: '2', value: '0.5rem', pixels: '8px' },
            { name: '3', value: '0.75rem', pixels: '12px' },
            { name: '4', value: '1rem', pixels: '16px' },
            { name: '5', value: '1.25rem', pixels: '20px' },
            { name: '6', value: '1.5rem', pixels: '24px' },
            { name: '8', value: '2rem', pixels: '32px' },
            { name: '10', value: '2.5rem', pixels: '40px' },
            { name: '12', value: '3rem', pixels: '48px' },
            { name: '16', value: '4rem', pixels: '64px' },
            { name: '20', value: '5rem', pixels: '80px' },
            { name: '24', value: '6rem', pixels: '96px' },
        ];
        return (_jsxs("div", { className: "p-8 max-w-4xl", children: [_jsx("h2", { className: "text-2xl font-bold mb-6", children: "Spacing Scale" }), _jsx("div", { className: "space-y-4", children: spaces.map((space) => (_jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("div", { className: "w-24 text-sm font-mono text-gray-600 dark:text-gray-400", children: ["spacing-", space.name] }), _jsx("div", { className: "bg-brand-500 rounded", style: { width: space.value, height: '2rem' } }), _jsxs("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: [space.value, " ", _jsxs("span", { className: "text-gray-400", children: ["(", space.pixels, ")"] })] })] }, space.name))) }), _jsxs("div", { className: "mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-800", children: [_jsx("h3", { className: "text-lg font-semibold mb-2", children: "Usage Guidelines" }), _jsxs("ul", { className: "space-y-2 text-sm", children: [_jsxs("li", { children: ["\u2022 ", _jsx("strong", { children: "spacing-1 to spacing-3" }), ": Tight spacing for inline elements and icons"] }), _jsxs("li", { children: ["\u2022 ", _jsx("strong", { children: "spacing-4 to spacing-6" }), ": Standard spacing for component padding and gaps"] }), _jsxs("li", { children: ["\u2022 ", _jsx("strong", { children: "spacing-8 to spacing-12" }), ": Section spacing and larger component gaps"] }), _jsxs("li", { children: ["\u2022 ", _jsx("strong", { children: "spacing-16+" }), ": Page-level spacing and major section breaks"] })] })] })] }));
    },
};
// Container Widths
export const ContainerWidths = {
    render: () => {
        const containers = [
            { name: 'sm', value: '640px', className: 'max-w-sm' },
            { name: 'md', value: '768px', className: 'max-w-md' },
            { name: 'lg', value: '1024px', className: 'max-w-lg' },
            { name: 'xl', value: '1280px', className: 'max-w-xl' },
            { name: '2xl', value: '1536px', className: 'max-w-2xl' },
            { name: 'full', value: '100%', className: 'max-w-full' },
        ];
        return (_jsxs("div", { className: "p-8", children: [_jsx("h2", { className: "text-2xl font-bold mb-6", children: "Container Widths" }), _jsx("div", { className: "space-y-4", children: containers.map((container) => (_jsxs("div", { children: [_jsxs("div", { className: "text-sm font-mono text-gray-600 dark:text-gray-400 mb-2", children: [container.className, " (", container.value, ")"] }), _jsx("div", { className: `${container.className} bg-gradient-to-r from-brand-500 to-brand-600 h-12 rounded-lg shadow-sm` })] }, container.name))) })] }));
    },
};
// Grid System
export const GridSystem = {
    render: () => {
        return (_jsxs("div", { className: "p-8", children: [_jsx("h2", { className: "text-2xl font-bold mb-6", children: "Grid System" }), _jsxs("div", { className: "space-y-8", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-sm font-semibold mb-3 text-gray-600 dark:text-gray-400", children: "2 Column Grid" }), _jsx("div", { className: "grid grid-cols-2 gap-4", children: [1, 2].map((i) => (_jsxs("div", { className: "h-24 bg-brand-500/20 rounded-lg flex items-center justify-center font-semibold", children: ["Column ", i] }, i))) })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-semibold mb-3 text-gray-600 dark:text-gray-400", children: "3 Column Grid" }), _jsx("div", { className: "grid grid-cols-3 gap-4", children: [1, 2, 3].map((i) => (_jsxs("div", { className: "h-24 bg-brand-500/20 rounded-lg flex items-center justify-center font-semibold", children: ["Column ", i] }, i))) })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-semibold mb-3 text-gray-600 dark:text-gray-400", children: "4 Column Grid" }), _jsx("div", { className: "grid grid-cols-4 gap-4", children: [1, 2, 3, 4].map((i) => (_jsxs("div", { className: "h-24 bg-brand-500/20 rounded-lg flex items-center justify-center font-semibold", children: ["Column ", i] }, i))) })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-semibold mb-3 text-gray-600 dark:text-gray-400", children: "Responsive Grid (1 \u2192 2 \u2192 3 \u2192 4)" }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4", children: [1, 2, 3, 4].map((i) => (_jsxs("div", { className: "h-24 bg-brand-500/20 rounded-lg flex items-center justify-center font-semibold", children: ["Column ", i] }, i))) })] })] }), _jsxs("div", { className: "mt-12 p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-2 border-purple-200 dark:border-purple-800", children: [_jsx("h3", { className: "text-lg font-semibold mb-2", children: "Code Example" }), _jsx("pre", { className: "text-sm overflow-x-auto", children: _jsx("code", { children: `<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>` }) })] })] }));
    },
};
// Flexbox Patterns
export const FlexboxPatterns = {
    render: () => {
        return (_jsxs("div", { className: "p-8", children: [_jsx("h2", { className: "text-2xl font-bold mb-6", children: "Flexbox Patterns" }), _jsxs("div", { className: "space-y-8", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-sm font-semibold mb-3 text-gray-600 dark:text-gray-400", children: "Horizontal Stack" }), _jsx("div", { className: "flex gap-4", children: [1, 2, 3].map((i) => (_jsxs("div", { className: "px-6 py-4 bg-brand-500/20 rounded-lg font-semibold", children: ["Item ", i] }, i))) })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-semibold mb-3 text-gray-600 dark:text-gray-400", children: "Vertical Stack" }), _jsx("div", { className: "flex flex-col gap-4 max-w-xs", children: [1, 2, 3].map((i) => (_jsxs("div", { className: "px-6 py-4 bg-brand-500/20 rounded-lg font-semibold", children: ["Item ", i] }, i))) })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-semibold mb-3 text-gray-600 dark:text-gray-400", children: "Space Between" }), _jsxs("div", { className: "flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg", children: [_jsx("div", { className: "px-6 py-4 bg-brand-500/20 rounded-lg font-semibold", children: "Left" }), _jsx("div", { className: "px-6 py-4 bg-brand-500/20 rounded-lg font-semibold", children: "Right" })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-semibold mb-3 text-gray-600 dark:text-gray-400", children: "Centered" }), _jsx("div", { className: "flex justify-center items-center h-32 bg-gray-100 dark:bg-gray-800 rounded-lg", children: _jsx("div", { className: "px-6 py-4 bg-brand-500/20 rounded-lg font-semibold", children: "Centered Item" }) })] })] })] }));
    },
};
//# sourceMappingURL=SpacingLayout.stories.js.map