/**
 * Model Selector Component
 *
 * Dropdown to switch between AI models with metrics (speed, cost, quality)
 */
'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import * as React from 'react';
import { motion } from 'framer-motion';
import { Badge, Button, cn } from '@clarity-chat/primitives';
export function ModelSelector({ models, value, onChange, className = '', showMetrics = true, disabled = false, showDescription = true }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const containerRef = React.useRef(null);
    const handleToggle = React.useCallback(() => setIsOpen(!isOpen), [isOpen]);
    const handleBackdropClick = React.useCallback(() => setIsOpen(false), []);
    // Memoize selected model lookup
    const selectedModel = React.useMemo(() => models.find(m => m.id === value), [models, value]);
    // Memoize select handler
    const handleSelect = React.useCallback((model) => {
        onChange(model.id, {
            provider: model.provider,
            model: model.id
        });
        setIsOpen(false);
    }, [onChange]);
    // Memoize badge props getter
    const getBadgeProps = React.useCallback((type, value) => {
        switch (type) {
            case 'speed':
                if (value === 'fast')
                    return { variant: 'success', label: 'Fast' };
                if (value === 'medium')
                    return { variant: 'warning', label: 'Moderate' };
                return { variant: 'destructive', label: 'Slow' };
            case 'cost':
                if (value === 'low')
                    return { variant: 'success', label: 'Low cost' };
                if (value === 'medium')
                    return { variant: 'warning', label: 'Medium cost' };
                return { variant: 'destructive', label: 'High cost' };
            case 'quality':
                if (value === 'best')
                    return { variant: 'success', label: 'Best quality' };
                if (value === 'excellent')
                    return { variant: 'info', label: 'Excellent' };
                return { variant: 'secondary', label: 'Good' };
            default:
                return { variant: 'secondary', label: value };
        }
    }, []);
    return (_jsxs("div", { ref: containerRef, className: cn('relative', className), children: [_jsxs(Button, { type: "button", variant: "surface", onClick: handleToggle, disabled: disabled, className: "w-full justify-between rounded-xl border border-border/40 bg-card/95 backdrop-blur-md px-4 py-3 text-left text-sm shadow-sm hover:shadow-md hover:border-border/60 transition-all duration-200 ease-out", "aria-haspopup": "listbox", "aria-expanded": isOpen, children: [_jsxs("div", { className: "flex min-w-0 flex-1 items-center gap-3.5", children: [_jsx("span", { className: "truncate text-foreground font-semibold", children: selectedModel?.name || 'Select model' }), showMetrics && selectedModel && (_jsx("div", { className: "inline-flex items-center gap-1.5 text-xs text-muted-foreground/90", children: ['speed', 'cost'].map((type) => {
                                    const { variant, label } = getBadgeProps(type, selectedModel[type]);
                                    const displayValue = type === 'cost' ? `$${selectedModel[type]}` : selectedModel[type];
                                    return (_jsx(Badge, { variant: variant, className: "rounded-full px-2 py-0.5 capitalize", title: label, children: displayValue }, type));
                                }) }))] }), _jsx("svg", { className: cn('h-4 w-4 text-muted-foreground transition-transform duration-200', isOpen && 'rotate-180'), fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 9l-7 7-7-7" }) })] }), isOpen && (_jsxs(_Fragment, { children: [_jsx("div", { className: "fixed inset-0 z-10", onClick: handleBackdropClick, "aria-hidden": "true" }), _jsx(motion.div, { initial: { opacity: 0, y: -8, scale: 0.96 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: -8, scale: 0.96 }, transition: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }, role: "listbox", className: "absolute z-20 mt-2 w-full overflow-auto rounded-2xl border border-border/40 bg-card/98 backdrop-blur-lg shadow-xl", children: models.map((model) => (_jsx("button", { type: "button", role: "option", "aria-selected": model.id === value, onClick: () => handleSelect(model), className: cn('w-full px-4 py-3 text-left transition-colors duration-150 ease-out first:rounded-t-2xl last:rounded-b-2xl', model.id === value
                                ? 'bg-muted/60 text-foreground'
                                : 'text-muted-foreground/90 hover:bg-muted/40 hover:text-foreground'), children: _jsxs("div", { className: "flex flex-col gap-2", children: [_jsxs("div", { className: "flex items-center justify-between gap-4", children: [_jsx("span", { className: "font-semibold text-foreground", children: model.name }), showMetrics && (_jsx("div", { className: "flex flex-wrap gap-1.5", children: ['speed', 'quality', 'cost'].map((type) => {
                                                    const { variant, label } = getBadgeProps(type, model[type]);
                                                    const displayValue = type === 'cost' ? `$${model[type]}` : model[type];
                                                    return (_jsx(Badge, { variant: variant, className: "rounded-full px-2 py-0.5 capitalize", title: label, children: displayValue }, type));
                                                }) }))] }), showDescription && model.description && (_jsx("p", { className: "text-sm text-muted-foreground/90", children: model.description })), _jsxs("p", { className: "text-xs text-muted-foreground/90", children: [(model.contextWindow / 1000).toFixed(0), "K context", model.vision && ' · Vision', model.toolCalling && ' · Tools'] })] }) }, model.id))) })] }))] }));
}
//# sourceMappingURL=model-selector.js.map