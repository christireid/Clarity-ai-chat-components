import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Accessibility Panel Components for Storybook
 *
 * These components provide real-time accessibility information display
 * for use in Storybook stories. They help developers understand and
 * verify ARIA attributes and accessibility features.
 *
 * @example
 * ```tsx
 * import { A11yPanel, AriaAttributesDisplay, FocusOrderVisualization } from './a11y-panel'
 *
 * // In your story
 * <div>
 *   <YourComponent />
 *   <A11yPanel targetSelector="[role='dialog']" />
 * </div>
 * ```
 */
import * as React from 'react';
import { cn } from '../lib/cn';
// ============================================================================
// Utility Functions
// ============================================================================
/**
 * Extract ARIA attributes from an element
 */
function getAriaAttributes(element) {
    const attributes = [];
    const ariaPrefix = 'aria-';
    for (const attr of element.attributes) {
        if (attr.name.startsWith(ariaPrefix) || attr.name === 'role') {
            attributes.push({ name: attr.name, value: attr.value });
        }
    }
    return attributes.sort((a, b) => a.name.localeCompare(b.name));
}
/**
 * Get element info for accessibility display
 */
function getElementInfo(element) {
    return {
        tagName: element.tagName.toLowerCase(),
        role: element.getAttribute('role'),
        ariaAttributes: getAriaAttributes(element),
        id: element.id || null,
        tabIndex: element instanceof HTMLElement
            ? element.tabIndex
            : parseInt(element.getAttribute('tabindex') || '-1', 10),
    };
}
/**
 * Get all focusable elements in order
 */
function getFocusableElementsInOrder(container) {
    const selector = [
        'a[href]',
        'button:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        '[tabindex]:not([tabindex="-1"])',
    ].join(', ');
    return Array.from(container.querySelectorAll(selector));
}
// ============================================================================
// Components
// ============================================================================
/**
 * Display ARIA attributes for a single element
 */
export function AriaAttributesDisplay({ element, className, }) {
    if (!element) {
        return (_jsx("div", { className: cn('text-sm text-muted-foreground', className), children: "No element selected" }));
    }
    const info = getElementInfo(element);
    return (_jsxs("div", { className: cn('space-y-2', className), children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("code", { className: "px-1.5 py-0.5 bg-muted rounded text-xs font-mono", children: ["<", info.tagName, ">"] }), info.role && (_jsxs("span", { className: "px-1.5 py-0.5 bg-primary/10 text-primary rounded text-xs", children: ["role=\"", info.role, "\""] })), info.id && (_jsxs("span", { className: "text-xs text-muted-foreground", children: ["#", info.id] }))] }), info.ariaAttributes.length > 0 ? (_jsx("ul", { className: "space-y-1", children: info.ariaAttributes.map((attr) => (_jsxs("li", { className: "flex items-center gap-2 text-xs font-mono", children: [_jsx("span", { className: "text-blue-600 dark:text-blue-400", children: attr.name }), _jsx("span", { className: "text-muted-foreground", children: "=" }), _jsxs("span", { className: "text-green-600 dark:text-green-400", children: ["\"", attr.value, "\""] })] }, attr.name))) })) : (_jsx("p", { className: "text-xs text-muted-foreground", children: "No ARIA attributes" }))] }));
}
/**
 * Visualize focus order within a container
 */
export function FocusOrderVisualization({ containerSelector, className, }) {
    const [focusableElements, setFocusableElements] = React.useState([]);
    React.useEffect(() => {
        const container = document.querySelector(containerSelector);
        if (container) {
            setFocusableElements(getFocusableElementsInOrder(container));
        }
        // Set up mutation observer to update on DOM changes
        const observer = new MutationObserver(() => {
            const updatedContainer = document.querySelector(containerSelector);
            if (updatedContainer) {
                setFocusableElements(getFocusableElementsInOrder(updatedContainer));
            }
        });
        if (container) {
            observer.observe(container, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['disabled', 'tabindex'],
            });
        }
        return () => observer.disconnect();
    }, [containerSelector]);
    return (_jsxs("div", { className: cn('space-y-2', className), children: [_jsxs("h4", { className: "text-sm font-medium", children: ["Focus Order (", focusableElements.length, " elements)"] }), focusableElements.length > 0 ? (_jsx("ol", { className: "space-y-1 list-decimal list-inside", children: focusableElements.map((element, index) => {
                    const info = getElementInfo(element);
                    return (_jsx("li", { className: "text-xs", children: _jsxs("code", { className: "font-mono", children: [info.tagName, info.id && `#${info.id}`, info.role && ` [role="${info.role}"]`] }) }, index));
                }) })) : (_jsx("p", { className: "text-xs text-muted-foreground", children: "No focusable elements" }))] }));
}
/**
 * Live region announcements log
 */
export function AnnouncementsLog({ className }) {
    const [announcements, setAnnouncements] = React.useState([]);
    React.useEffect(() => {
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList' ||
                    mutation.type === 'characterData') {
                    const target = mutation.target;
                    if (target.getAttribute('aria-live') ||
                        target.getAttribute('role') === 'alert' ||
                        target.getAttribute('role') === 'status') {
                        const text = target.textContent?.trim();
                        if (text) {
                            setAnnouncements((prev) => [...prev.slice(-9), text]);
                        }
                    }
                }
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true,
        });
        return () => observer.disconnect();
    }, []);
    return (_jsxs("div", { className: cn('space-y-2', className), children: [_jsx("h4", { className: "text-sm font-medium", children: "Screen Reader Announcements" }), announcements.length > 0 ? (_jsx("ul", { className: "space-y-1", children: announcements.map((msg, index) => (_jsx("li", { className: "text-xs px-2 py-1 bg-muted rounded font-mono", children: msg }, index))) })) : (_jsx("p", { className: "text-xs text-muted-foreground", children: "No announcements yet" }))] }));
}
/**
 * Complete accessibility panel combining all features
 */
export function A11yPanel({ targetSelector, className, }) {
    const [targetElement, setTargetElement] = React.useState(null);
    React.useEffect(() => {
        if (targetSelector) {
            const element = document.querySelector(targetSelector);
            setTargetElement(element);
        }
    }, [targetSelector]);
    return (_jsxs("div", { className: cn('mt-4 p-4 border border-border rounded-lg bg-card space-y-4', className), children: [_jsx("h3", { className: "text-sm font-semibold border-b border-border pb-2", children: "\u267F Accessibility Panel" }), targetSelector && (_jsxs("div", { children: [_jsxs("h4", { className: "text-xs font-medium text-muted-foreground mb-2", children: ["Target: ", targetSelector] }), _jsx(AriaAttributesDisplay, { element: targetElement })] })), targetSelector && (_jsx(FocusOrderVisualization, { containerSelector: targetSelector })), _jsx(AnnouncementsLog, {})] }));
}
export default A11yPanel;
//# sourceMappingURL=a11y-panel.js.map