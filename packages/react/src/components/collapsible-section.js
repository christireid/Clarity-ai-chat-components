/**
 * Collapsible Section Component
 *
 * Animated expand/collapse section with smooth height transitions.
 * Perfect for accordions, FAQ sections, and expandable list items.
 */
'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@clarity-chat/primitives';
/**
 * Collapsible section with smooth height animation
 */
export function CollapsibleSection({ open: controlledOpen, onOpenChange, defaultOpen = false, trigger, children, className, triggerClassName, contentClassName, duration = 0.3, disabled = false, }) {
    const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
    const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
    const toggle = () => {
        if (disabled)
            return;
        const newOpen = !isOpen;
        if (controlledOpen === undefined) {
            setInternalOpen(newOpen);
        }
        onOpenChange?.(newOpen);
    };
    return (_jsxs("div", { className: cn('border border-border/40 rounded-lg shadow-sm', className), children: [_jsxs(motion.button, { type: "button", onClick: toggle, disabled: disabled, className: cn('w-full flex items-center justify-between p-4', 'text-left font-medium transition-all duration-150 ease-out', 'hover:bg-muted/40', 'focus:outline-none focus:ring-2 focus:ring-ring/40 focus:ring-offset-1', 'disabled:opacity-50 disabled:cursor-not-allowed', triggerClassName), "aria-expanded": isOpen, children: [trigger, _jsx(motion.svg, { animate: { rotate: isOpen ? 180 : 0 }, transition: { duration: duration, ease: [0.4, 0, 0.2, 1] }, className: "w-5 h-5 flex-shrink-0 text-muted-foreground", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 9l-7 7-7-7" }) })] }), _jsx(AnimatePresence, { initial: false, children: isOpen && (_jsx(motion.div, { initial: { height: 0, opacity: 0 }, animate: { height: 'auto', opacity: 1 }, exit: { height: 0, opacity: 0 }, transition: { duration: duration, ease: [0.4, 0, 0.2, 1] }, className: "overflow-hidden", children: _jsx("div", { className: cn('p-4 pt-0 border-t border-border/40', contentClassName), children: children }) })) })] }));
}
export function Accordion({ items, openId: controlledOpenId, onOpenChange, defaultOpenId, allowMultiple = false, className, duration = 0.3, }) {
    const [internalOpenId, setInternalOpenId] = React.useState(defaultOpenId || null);
    const [multipleOpen, setMultipleOpen] = React.useState(new Set(defaultOpenId ? [defaultOpenId] : []));
    const openId = controlledOpenId !== undefined ? controlledOpenId : internalOpenId;
    const handleToggle = (id) => {
        if (allowMultiple) {
            setMultipleOpen((prev) => {
                const newSet = new Set(prev);
                if (newSet.has(id)) {
                    newSet.delete(id);
                }
                else {
                    newSet.add(id);
                }
                return newSet;
            });
        }
        else {
            const newId = openId === id ? null : id;
            if (controlledOpenId === undefined) {
                setInternalOpenId(newId);
            }
            onOpenChange?.(newId);
        }
    };
    return (_jsx("div", { className: cn('space-y-2.5', className), children: items.map((item) => {
            const isOpen = allowMultiple
                ? multipleOpen.has(item.id)
                : openId === item.id;
            return (_jsx(CollapsibleSection, { open: isOpen, onOpenChange: () => handleToggle(item.id), trigger: item.trigger, duration: duration, children: item.content }, item.id));
        }) }));
}
Accordion.displayName = 'Accordion';
export function ExpandableListItem({ title, badge, icon, children, defaultOpen = false, className, }) {
    return (_jsx(CollapsibleSection, { defaultOpen: defaultOpen, trigger: _jsxs("div", { className: "flex items-center gap-3.5 flex-1", children: [icon && _jsx("div", { className: "text-muted-foreground", children: icon }), _jsx("span", { className: "flex-1", children: title }), badge] }), className: className, children: children }));
}
ExpandableListItem.displayName = 'ExpandableListItem';
//# sourceMappingURL=collapsible-section.js.map