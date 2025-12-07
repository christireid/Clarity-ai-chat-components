import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { ComponentHeader } from '../../.storybook/blocks';
import { MessageSquare, Send, User, Settings, Search, Heart, Star, Bell, Check, X, ChevronRight, ChevronDown, Menu, MoreVertical, Copy, Download, Upload, File, Image, Video, AlertCircle, Info, CheckCircle, XCircle, Sparkles, Zap, Flame, ThumbsUp, ThumbsDown, } from 'lucide-react';
const meta = {
    title: 'Foundation/Iconography',
    parameters: {
        layout: 'centered',
        docs: {
            page: () => (_jsxs("div", { className: "max-w-6xl mx-auto p-8", children: [_jsx(ComponentHeader, { title: "Iconography", status: "stable", description: "Clarity Chat uses Lucide React icons for a consistent, modern icon system across all components." }), _jsx("div", { className: "prose prose-slate max-w-none", children: _jsxs("p", { children: [_jsx("a", { href: "https://lucide.dev", target: "_blank", rel: "noopener noreferrer", className: "text-brand-500 underline", children: "Lucide" }), " is a beautiful, consistent icon library with 1000+ icons. All icons are designed with a 24x24 grid, 2px stroke, and rounded corners."] }) })] })),
        },
    },
    tags: ['autodocs'],
};
export default meta;
const iconCategories = {
    'Communication': [
        { Icon: MessageSquare, name: 'MessageSquare' },
        { Icon: Send, name: 'Send' },
        { Icon: Bell, name: 'Bell' },
    ],
    'User & Navigation': [
        { Icon: User, name: 'User' },
        { Icon: Settings, name: 'Settings' },
        { Icon: Search, name: 'Search' },
        { Icon: Menu, name: 'Menu' },
        { Icon: MoreVertical, name: 'MoreVertical' },
    ],
    'Actions': [
        { Icon: Copy, name: 'Copy' },
        { Icon: Download, name: 'Download' },
        { Icon: Upload, name: 'Upload' },
        { Icon: Check, name: 'Check' },
        { Icon: X, name: 'X' },
    ],
    'Directional': [
        { Icon: ChevronRight, name: 'ChevronRight' },
        { Icon: ChevronDown, name: 'ChevronDown' },
    ],
    'Files & Media': [
        { Icon: File, name: 'File' },
        { Icon: Image, name: 'Image' },
        { Icon: Video, name: 'Video' },
    ],
    'Feedback': [
        { Icon: AlertCircle, name: 'AlertCircle' },
        { Icon: Info, name: 'Info' },
        { Icon: CheckCircle, name: 'CheckCircle' },
        { Icon: XCircle, name: 'XCircle' },
    ],
    'Engagement': [
        { Icon: Heart, name: 'Heart' },
        { Icon: Star, name: 'Star' },
        { Icon: ThumbsUp, name: 'ThumbsUp' },
        { Icon: ThumbsDown, name: 'ThumbsDown' },
    ],
    'AI & Special': [
        { Icon: Sparkles, name: 'Sparkles' },
        { Icon: Zap, name: 'Zap' },
        { Icon: Flame, name: 'Flame' },
    ],
};
// Icon Categories
export const IconCategories = {
    render: () => {
        const [copiedIcon, setCopiedIcon] = useState(null);
        const handleCopy = (name) => {
            navigator.clipboard.writeText(`import { ${name} } from 'lucide-react'`);
            setCopiedIcon(name);
            setTimeout(() => setCopiedIcon(null), 2000);
        };
        return (_jsxs("div", { className: "w-full max-w-6xl p-8", children: [_jsx("h2", { className: "text-2xl font-bold mb-6", children: "Icon Library" }), _jsx("div", { className: "space-y-8", children: Object.entries(iconCategories).map(([category, icons]) => (_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300", children: category }), _jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4", children: icons.map(({ Icon, name }) => (_jsxs("button", { onClick: () => handleCopy(name), className: "group flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-border bg-white dark:bg-gray-900 hover:border-brand-500 hover:shadow-md transition-all duration-200", children: [_jsx(Icon, { className: "w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-brand-500 transition-colors" }), _jsx("span", { className: "text-xs font-mono text-gray-600 dark:text-gray-400 text-center", children: copiedIcon === name ? '✓ Copied!' : name })] }, name))) })] }, category))) }), _jsxs("div", { className: "mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-800", children: [_jsx("h3", { className: "text-lg font-semibold mb-3", children: "Usage" }), _jsx("pre", { className: "text-sm overflow-x-auto bg-white dark:bg-gray-800 p-4 rounded", children: _jsx("code", { children: `import { MessageSquare } from 'lucide-react'

function MyComponent() {
  return <MessageSquare className="w-5 h-5 text-brand-500" />
}` }) })] })] }));
    },
};
// Icon Sizes
export const IconSizes = {
    render: () => {
        const sizes = [
            { name: 'Extra Small', class: 'w-3 h-3', pixels: '12px' },
            { name: 'Small', class: 'w-4 h-4', pixels: '16px' },
            { name: 'Medium', class: 'w-5 h-5', pixels: '20px' },
            { name: 'Large', class: 'w-6 h-6', pixels: '24px' },
            { name: 'Extra Large', class: 'w-8 h-8', pixels: '32px' },
            { name: '2X Large', class: 'w-10 h-10', pixels: '40px' },
        ];
        return (_jsxs("div", { className: "w-full max-w-2xl p-8", children: [_jsx("h2", { className: "text-2xl font-bold mb-6", children: "Icon Sizes" }), _jsx("div", { className: "space-y-6", children: sizes.map((size) => (_jsxs("div", { className: "flex items-center gap-6", children: [_jsx("div", { className: "w-32 text-sm font-semibold", children: size.name }), _jsx(MessageSquare, { className: `${size.class} text-brand-500` }), _jsxs("code", { className: "text-sm text-gray-600 dark:text-gray-400", children: ["className=\"", size.class, "\" (", size.pixels, ")"] })] }, size.name))) }), _jsxs("div", { className: "mt-8 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-2 border-purple-200 dark:border-purple-800", children: [_jsx("h3", { className: "text-sm font-semibold mb-2", children: "Guidelines" }), _jsxs("ul", { className: "text-xs space-y-1", children: [_jsxs("li", { children: ["\u2022 ", _jsx("strong", { children: "w-3 h-3" }), ": Inline icons within text"] }), _jsxs("li", { children: ["\u2022 ", _jsx("strong", { children: "w-4 h-4" }), ": Button icons, form inputs"] }), _jsxs("li", { children: ["\u2022 ", _jsx("strong", { children: "w-5 h-5" }), ": Default size for most UI icons"] }), _jsxs("li", { children: ["\u2022 ", _jsx("strong", { children: "w-6 h-6" }), ": Headers, prominent actions"] }), _jsxs("li", { children: ["\u2022 ", _jsx("strong", { children: "w-8 h-8+" }), ": Feature icons, empty states"] })] })] })] }));
    },
};
// Icon Colors
export const IconColors = {
    render: () => {
        const colors = [
            { name: 'Brand', class: 'text-brand-500' },
            { name: 'Primary', class: 'text-gray-900 dark:text-gray-100' },
            { name: 'Secondary', class: 'text-gray-600 dark:text-gray-400' },
            { name: 'Muted', class: 'text-gray-400 dark:text-gray-600' },
            { name: 'Success', class: 'text-green-500' },
            { name: 'Warning', class: 'text-yellow-500' },
            { name: 'Error', class: 'text-red-500' },
        ];
        return (_jsxs("div", { className: "w-full max-w-2xl p-8", children: [_jsx("h2", { className: "text-2xl font-bold mb-6", children: "Icon Colors" }), _jsx("div", { className: "space-y-4", children: colors.map((color) => (_jsxs("div", { className: "flex items-center gap-6", children: [_jsx("div", { className: "w-32 text-sm font-semibold", children: color.name }), _jsx(MessageSquare, { className: `w-6 h-6 ${color.class}` }), _jsxs("code", { className: "text-sm text-gray-600 dark:text-gray-400", children: ["className=\"", color.class, "\""] })] }, color.name))) })] }));
    },
};
// Icon Stroke Width
export const IconStrokeWidth = {
    render: () => {
        const strokeWidths = [
            { name: 'Thin', value: 1 },
            { name: 'Default', value: 2 },
            { name: 'Bold', value: 2.5 },
        ];
        return (_jsxs("div", { className: "w-full max-w-2xl p-8", children: [_jsx("h2", { className: "text-2xl font-bold mb-6", children: "Stroke Width" }), _jsx("div", { className: "space-y-6", children: strokeWidths.map((stroke) => (_jsxs("div", { className: "flex items-center gap-6", children: [_jsx("div", { className: "w-32 text-sm font-semibold", children: stroke.name }), _jsx(MessageSquare, { className: "w-8 h-8 text-brand-500", strokeWidth: stroke.value }), _jsxs("code", { className: "text-sm text-gray-600 dark:text-gray-400", children: ["strokeWidth=", stroke.value] })] }, stroke.name))) }), _jsx("div", { className: "mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-800", children: _jsxs("p", { className: "text-sm", children: [_jsx("strong", { children: "Note:" }), " Lucide icons default to 2px stroke width. Use 1.5-2.5 for most cases. Avoid going below 1 or above 3 for consistency."] }) })] }));
    },
};
//# sourceMappingURL=Iconography.stories.js.map