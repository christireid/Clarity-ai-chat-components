/**
 * Storybook Link Component
 *
 * Creates prominent links from documentation to Storybook for interactive component exploration.
 */
'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ExternalLink, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { Callout } from '@/components/MDX/Callout';
export function StorybookLink({ story, componentName, storybookUrl = 'https://storybook.clarity-chat.dev', variant = 'callout' }) {
    const fullUrl = `${storybookUrl}/?path=/story/${story}`;
    const displayName = componentName || story.split('--')[0].split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    if (variant === 'inline') {
        return (_jsxs(motion.a, { href: fullUrl, target: "_blank", rel: "noopener noreferrer", whileHover: { scale: 1.02, x: 2 }, whileTap: { scale: 0.98 }, transition: { type: 'spring', stiffness: 300, damping: 20 }, className: "inline-flex items-center gap-1.5 text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 font-medium transition-colors", children: [_jsx(motion.div, { whileHover: { rotate: 10, scale: 1.1 }, transition: { type: 'spring', stiffness: 300, damping: 15 }, children: _jsx(Play, { className: "w-4 h-4" }) }), "View in Storybook", _jsx(motion.div, { whileHover: { x: 2, y: -2 }, transition: { duration: 0.2 }, children: _jsx(ExternalLink, { className: "w-3.5 h-3.5" }) })] }));
    }
    if (variant === 'button') {
        return (_jsxs(motion.a, { href: fullUrl, target: "_blank", rel: "noopener noreferrer", whileHover: { scale: 1.05, y: -2 }, whileTap: { scale: 0.95 }, transition: { type: 'spring', stiffness: 300, damping: 20 }, className: "inline-flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-medium transition-colors shadow-sm hover:shadow", children: [_jsx(motion.div, { animate: { scale: [1, 1.1, 1] }, transition: { duration: 2, repeat: Infinity, repeatDelay: 3 }, children: _jsx(Play, { className: "w-4 h-4" }) }), "Try ", displayName, " in Storybook", _jsx(motion.div, { whileHover: { x: 2, y: -2 }, transition: { duration: 0.2 }, children: _jsx(ExternalLink, { className: "w-4 h-4" }) })] }));
    }
    // Default: callout variant
    return (_jsx(Callout, { type: "info", icon: _jsx(Play, { className: "w-5 h-5" }), children: _jsxs("div", { className: "flex items-start justify-between gap-4", children: [_jsxs(motion.div, { initial: { opacity: 0, x: -10 }, whileInView: { opacity: 1, x: 0 }, viewport: { once: true }, transition: { duration: 0.3 }, className: "flex-1", children: [_jsx("p", { className: "font-medium mb-1", children: "Interactive Demo" }), _jsx("p", { className: "text-sm text-text-secondary", children: "Try this component with live controls and see all variations in Storybook." })] }), _jsxs(motion.a, { href: fullUrl, target: "_blank", rel: "noopener noreferrer", initial: { opacity: 0, x: 10 }, whileInView: { opacity: 1, x: 0 }, viewport: { once: true }, whileHover: { scale: 1.05, y: -2 }, whileTap: { scale: 0.95 }, transition: { type: 'spring', stiffness: 300, damping: 20 }, className: "flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white text-sm rounded-md font-medium transition-colors whitespace-nowrap shadow-sm hover:shadow", children: ["Open Storybook", _jsx(motion.div, { whileHover: { x: 2, y: -2 }, transition: { duration: 0.2 }, children: _jsx(ExternalLink, { className: "w-3.5 h-3.5" }) })] })] }) }));
}
/**
 * Helper to generate Storybook story path from component name
 */
export function getStorybookPath(componentName, storyName = 'default') {
    const kebabCase = componentName
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .toLowerCase();
    return `components-${kebabCase}--${storyName}`;
}
/**
 * Quick link component for adding to component pages
 */
export function ViewInStorybook({ component, story }) {
    const storyPath = getStorybookPath(component, story);
    return _jsx(StorybookLink, { story: storyPath, componentName: component });
}
//# sourceMappingURL=StorybookLink.js.map