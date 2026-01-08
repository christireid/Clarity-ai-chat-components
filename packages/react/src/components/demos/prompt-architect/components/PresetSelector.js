'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * PresetSelector Component
 *
 * Dropdown to load pre-configured prompt templates.
 */
import * as React from 'react';
import { cn } from '../../../../utils/cn';
import { PROMPT_PRESETS, getPresetCategories } from '../utils/presets';
/**
 * Category icons
 */
const CATEGORY_ICONS = {
    development: '🔧',
    writing: '✏️',
    data: '📊',
    analysis: '🔍',
    custom: '⚡',
};
/**
 * Preset selector dropdown
 */
export function PresetSelector({ onSelect, disabled = false, className, }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const containerRef = React.useRef(null);
    // Group presets by category
    const categories = getPresetCategories();
    const presetsByCategory = React.useMemo(() => {
        const grouped = {};
        for (const category of categories) {
            grouped[category] = PROMPT_PRESETS.filter((p) => p.category === category);
        }
        return grouped;
    }, [categories]);
    // Close on click outside
    React.useEffect(() => {
        function handleClickOutside(event) {
            if (containerRef.current &&
                !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    // Close on escape
    React.useEffect(() => {
        function handleEscape(event) {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        }
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, []);
    const handleSelect = (preset) => {
        onSelect(preset);
        setIsOpen(false);
    };
    return (_jsxs("div", { ref: containerRef, className: cn('relative', className), children: [_jsxs("button", { type: "button", onClick: () => setIsOpen(!isOpen), disabled: disabled, className: cn('flex items-center gap-2 px-3 py-2', 'text-sm font-medium', 'rounded-lg border border-border bg-background', 'hover:bg-muted transition-colors', 'focus:outline-none focus:ring-2 focus:ring-primary/50', 'disabled:opacity-50 disabled:cursor-not-allowed'), children: [_jsx("span", { children: "\uD83D\uDCDA" }), _jsx("span", { children: "Load Preset" }), _jsx("svg", { className: cn('w-4 h-4 transition-transform', isOpen && 'rotate-180'), fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 9l-7 7-7-7" }) })] }), isOpen && (_jsx("div", { className: cn('absolute top-full left-0 mt-1 z-50', 'min-w-[280px] max-h-[400px] overflow-auto', 'rounded-lg border border-border bg-background shadow-lg', 'py-1'), children: categories.map((category) => (_jsxs("div", { children: [_jsxs("div", { className: "px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2", children: [_jsx("span", { children: CATEGORY_ICONS[category] }), _jsx("span", { children: category })] }), presetsByCategory[category]?.map((preset) => (_jsx("button", { type: "button", onClick: () => handleSelect(preset), className: cn('w-full px-3 py-2 text-left', 'hover:bg-muted transition-colors', 'focus:outline-none focus:bg-muted'), children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { children: preset.icon }), _jsxs("div", { children: [_jsx("div", { className: "text-sm font-medium", children: preset.name }), _jsx("div", { className: "text-xs text-muted-foreground", children: preset.description })] })] }) }, preset.id)))] }, category))) }))] }));
}
export default PresetSelector;
//# sourceMappingURL=PresetSelector.js.map