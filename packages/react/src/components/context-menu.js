'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@clarity-chat/primitives';
import { ANIMATION_DURATION, ANIMATION_EASING } from '../animations/constants';
export const ContextMenu = React.forwardRef(({ items, children, className }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [position, setPosition] = React.useState({ x: 0, y: 0 });
    const [submenuOpen, setSubmenuOpen] = React.useState(null);
    const menuRef = React.useRef(null);
    const handleContextMenu = (e) => {
        e.preventDefault();
        setPosition({ x: e.clientX, y: e.clientY });
        setIsOpen(true);
        setSubmenuOpen(null);
    };
    const handleClose = () => {
        setIsOpen(false);
        setSubmenuOpen(null);
    };
    const handleItemClick = (item) => {
        if (item.disabled)
            return;
        if (item.submenu) {
            setSubmenuOpen(submenuOpen === item.id ? null : item.id);
        }
        else {
            item.onSelect?.();
            handleClose();
        }
    };
    // Close on click outside
    React.useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                handleClose();
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isOpen]);
    // Close on Escape
    React.useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                handleClose();
            }
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            return () => document.removeEventListener('keydown', handleEscape);
        }
    }, [isOpen]);
    // Adjust position to keep menu on screen
    React.useEffect(() => {
        if (isOpen && menuRef.current) {
            const menu = menuRef.current;
            const rect = menu.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            let { x, y } = position;
            // Adjust horizontal position
            if (x + rect.width > viewportWidth) {
                x = viewportWidth - rect.width - 10;
            }
            // Adjust vertical position
            if (y + rect.height > viewportHeight) {
                y = viewportHeight - rect.height - 10;
            }
            if (x !== position.x || y !== position.y) {
                setPosition({ x, y });
            }
        }
    }, [isOpen, position]);
    const renderMenuItems = (menuItems, level = 0) => {
        return menuItems.map((item, index) => {
            if (item.separator) {
                return (_jsx(motion.div, { initial: { scaleX: 0 }, animate: { scaleX: 1 }, transition: { delay: index * 0.02 }, className: "my-1 border-t" }, `separator-${index}`));
            }
            const hasSubmenu = item.submenu && item.submenu.length > 0;
            const isSubmenuOpen = submenuOpen === item.id;
            return (_jsxs("div", { className: "relative", children: [_jsxs(motion.button, { initial: { opacity: 0, x: -10 }, animate: { opacity: 1, x: 0 }, transition: { delay: index * 0.03, ease: ANIMATION_EASING.out }, onClick: () => handleItemClick(item), onMouseEnter: () => hasSubmenu && setSubmenuOpen(item.id), disabled: item.disabled, whileHover: !item.disabled ? { x: 2 } : {}, whileTap: !item.disabled ? { scale: 0.98 } : {}, className: cn('w-full flex items-center gap-3 px-3 py-2 text-sm text-left', 'transition-all duration-150 rounded-lg', item.disabled && 'opacity-50 cursor-not-allowed', !item.disabled && 'hover:bg-accent hover:shadow-[0_2px_8px_rgba(15,23,42,0.08)]', item.danger && !item.disabled && 'text-destructive hover:bg-destructive/10 hover:text-destructive'), children: [item.icon && (_jsx(motion.div, { whileHover: !item.disabled ? { scale: 1.2, rotate: 5 } : {}, className: "flex-shrink-0", children: item.icon })), _jsx("span", { className: "flex-1", children: item.label }), item.shortcut && !hasSubmenu && (_jsx("kbd", { className: "px-1.5 py-0.5 text-xs text-muted-foreground font-mono bg-muted border border-border/60 rounded shadow-[0_1px_2px_rgba(15,23,42,0.08)]", children: item.shortcut })), hasSubmenu && (_jsx(motion.svg, { animate: { rotate: isSubmenuOpen ? 90 : 0 }, transition: { duration: 0.2 }, width: "12", height: "12", viewBox: "0 0 15 15", fill: "none", xmlns: "http://www.w3.org/2000/svg", className: "flex-shrink-0", children: _jsx("path", { d: "M6.1584 3.13508C6.35985 2.94621 6.67627 2.95642 6.86514 3.15788L10.6151 7.15788C10.7954 7.3502 10.7954 7.64949 10.6151 7.84182L6.86514 11.8418C6.67627 12.0433 6.35985 12.0535 6.1584 11.8646C5.95694 11.6757 5.94673 11.3593 6.1356 11.1579L9.565 7.49985L6.1356 3.84182C5.94673 3.64036 5.95694 3.32394 6.1584 3.13508Z", fill: "currentColor", fillRule: "evenodd", clipRule: "evenodd" }) }))] }), _jsx(AnimatePresence, { children: hasSubmenu && isSubmenuOpen && (_jsx(motion.div, { initial: { opacity: 0, x: -10, scale: 0.95 }, animate: { opacity: 1, x: 0, scale: 1 }, exit: { opacity: 0, x: -10, scale: 0.95 }, transition: {
                                duration: ANIMATION_DURATION.fast / 1000,
                                ease: ANIMATION_EASING.out,
                            }, className: cn('absolute left-full top-0 ml-2', 'min-w-[180px] bg-card border border-border/60 shadow-[0_24px_48px_rgba(15,23,42,0.32)] rounded-lg', 'p-2 z-10'), children: renderMenuItems(item.submenu, level + 1) })) })] }, item.id));
        });
    };
    return (_jsxs("div", { ref: ref, onContextMenu: handleContextMenu, className: className, children: [children, _jsx(AnimatePresence, { children: isOpen && (_jsxs(_Fragment, { children: [_jsx("div", { className: "fixed inset-0 z-[var(--z-popover)]" }), _jsx(motion.div, { ref: menuRef, initial: { opacity: 0, scale: 0.9, y: -10 }, animate: { opacity: 1, scale: 1, y: 0 }, exit: { opacity: 0, scale: 0.9, y: -10 }, transition: {
                                duration: ANIMATION_DURATION.fast / 1000,
                                ease: ANIMATION_EASING.out,
                            }, style: {
                                position: 'fixed',
                                left: position.x,
                                top: position.y,
                                zIndex: 'var(--z-popover)',
                            }, className: "min-w-[200px] bg-card border border-border/50 shadow-[0_4px_6px_-1px_rgb(0_0_0_/_0.1),0_2px_4px_-2px_rgb(0_0_0_/_0.1)] rounded-lg p-2 backdrop-blur-sm", children: renderMenuItems(items) })] })) })] }));
});
ContextMenu.displayName = 'ContextMenu';
//# sourceMappingURL=context-menu.js.map