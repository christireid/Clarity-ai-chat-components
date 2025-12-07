'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Info, AlertTriangle, AlertCircle, CheckCircle, Lightbulb, MessageSquare, ChevronDown, } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
const calloutConfig = {
    info: {
        icon: Info,
        bgColor: 'bg-blue-50 dark:bg-blue-950/30',
        borderColor: 'border-blue-200 dark:border-blue-800',
        iconColor: 'text-blue-600 dark:text-blue-400',
        titleColor: 'text-blue-900 dark:text-blue-100',
    },
    warning: {
        icon: AlertTriangle,
        bgColor: 'bg-yellow-50 dark:bg-yellow-950/30',
        borderColor: 'border-yellow-200 dark:border-yellow-800',
        iconColor: 'text-yellow-600 dark:text-yellow-400',
        titleColor: 'text-yellow-900 dark:text-yellow-100',
    },
    error: {
        icon: AlertCircle,
        bgColor: 'bg-red-50 dark:bg-red-950/30',
        borderColor: 'border-red-200 dark:border-red-800',
        iconColor: 'text-red-600 dark:text-red-400',
        titleColor: 'text-red-900 dark:text-red-100',
    },
    success: {
        icon: CheckCircle,
        bgColor: 'bg-green-50 dark:bg-green-950/30',
        borderColor: 'border-green-200 dark:border-green-800',
        iconColor: 'text-green-600 dark:text-green-400',
        titleColor: 'text-green-900 dark:text-green-100',
    },
    tip: {
        icon: Lightbulb,
        bgColor: 'bg-purple-50 dark:bg-purple-950/30',
        borderColor: 'border-purple-200 dark:border-purple-800',
        iconColor: 'text-purple-600 dark:text-purple-400',
        titleColor: 'text-purple-900 dark:text-purple-100',
    },
    quote: {
        icon: MessageSquare,
        bgColor: 'bg-gray-50 dark:bg-gray-950/30',
        borderColor: 'border-gray-200 dark:border-gray-800',
        iconColor: 'text-gray-600 dark:text-gray-400',
        titleColor: 'text-gray-900 dark:text-gray-100',
    },
};
export function Callout({ type = 'info', title, children, className, icon, collapsible = false, defaultCollapsed = false, }) {
    const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
    const config = calloutConfig[type];
    const DefaultIcon = config.icon;
    const defaultTitles = {
        info: 'Info',
        warning: 'Warning',
        error: 'Error',
        success: 'Success',
        tip: 'Tip',
        quote: 'Quote',
    };
    const displayTitle = title || defaultTitles[type];
    return (_jsx(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }, className: cn('not-prose my-6 p-5 rounded-xl border-2 shadow-sm transition-all duration-200', 'hover:shadow-md hover:scale-[1.01]', config.bgColor, config.borderColor, className), role: "note", "aria-label": `${type} callout`, children: _jsxs("div", { className: "flex gap-3", children: [_jsx(motion.div, { initial: { scale: 0, rotate: -180 }, animate: { scale: 1, rotate: 0 }, transition: { delay: 0.1, type: 'spring', stiffness: 200, damping: 15 }, className: cn('flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center', 'bg-white/50 dark:bg-black/20 shadow-inner', config.iconColor), children: icon || _jsx(DefaultIcon, { className: "w-5 h-5" }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [displayTitle && (_jsxs("div", { className: "flex items-center justify-between mb-2 gap-2", children: [_jsx("div", { className: cn('font-semibold text-base', config.titleColor), children: displayTitle }), collapsible && (_jsx(motion.button, { onClick: () => setIsCollapsed(!isCollapsed), className: cn('p-1 rounded-lg transition-colors', 'hover:bg-black/5 dark:hover:bg-white/5', 'focus:outline-none focus:ring-2 focus:ring-offset-2', config.iconColor), whileHover: { scale: 1.1 }, whileTap: { scale: 0.95 }, "aria-label": isCollapsed ? 'Expand callout' : 'Collapse callout', "aria-expanded": !isCollapsed, children: _jsx(motion.div, { animate: { rotate: isCollapsed ? -90 : 0 }, transition: { duration: 0.2 }, children: _jsx(ChevronDown, { className: "w-4 h-4" }) }) }))] })), _jsx(AnimatePresence, { initial: false, children: !isCollapsed && (_jsx(motion.div, { initial: { height: 0, opacity: 0 }, animate: { height: 'auto', opacity: 1 }, exit: { height: 0, opacity: 0 }, transition: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }, className: "overflow-hidden", children: _jsx("div", { className: "text-sm leading-relaxed text-text-secondary [&>p]:my-2 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0", children: children }) })) })] })] }) }));
}
//# sourceMappingURL=Callout.js.map