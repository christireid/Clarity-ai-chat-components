import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Interactive Accessibility Demo
 *
 * Demonstrates accessibility patterns and utilities available
 * in the Clarity Chat component library.
 *
 * This example serves as both documentation and a testing ground
 * for accessibility features.
 */
import * as React from 'react';
import { accessibleClickHandler, useFocusTrap, useAutoFocus, useEscapeKey, announceToScreenReader, } from '../utils/accessibility';
import { ErrorBoundary, LoadingSpinner, EmptyState } from '../utils/error-boundary';
// =============================================================================
// Interactive Accessibility Demo
// =============================================================================
export function AccessibilityDemo() {
    return (_jsx(ErrorBoundary, { children: _jsxs("div", { className: "max-w-4xl mx-auto p-6 space-y-8", children: [_jsxs("header", { className: "border-b pb-4", children: [_jsx("h1", { className: "text-3xl font-bold", children: "Accessibility Demo" }), _jsx("p", { className: "text-muted-foreground mt-2", children: "Interactive examples of accessibility patterns and utilities. Test with keyboard navigation (Tab, Enter, Space, Escape) and screen readers." })] }), _jsx(AccessibleClickDemo, {}), _jsx(FocusTrapDemo, {}), _jsx(AutoFocusDemo, {}), _jsx(EscapeKeyDemo, {}), _jsx(ScreenReaderDemo, {}), _jsx(KeyboardNavigationDemo, {})] }) }));
}
// =============================================================================
// 1. Accessible Click Handler Demo
// =============================================================================
function AccessibleClickDemo() {
    const [clickCount, setClickCount] = React.useState(0);
    const [selectedCard, setSelectedCard] = React.useState(null);
    const cards = [
        { id: 'card-1', title: 'First Card', description: 'Click or press Enter/Space' },
        { id: 'card-2', title: 'Second Card', description: 'Keyboard accessible' },
        { id: 'card-3', title: 'Third Card', description: 'Focus ring visible' },
    ];
    return (_jsxs("section", { className: "space-y-4", children: [_jsx("h2", { className: "text-2xl font-semibold", children: "1. Accessible Click Handler" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Makes any element keyboard-accessible with role=\"button\", tabIndex, and keyboard handlers." }), _jsxs("div", { className: "space-y-2", children: [_jsx("h3", { className: "text-lg font-medium", children: "Simple Clickable Div" }), _jsxs("div", { ...accessibleClickHandler(() => setClickCount(c => c + 1)), className: "inline-block px-4 py-2 bg-primary text-primary-foreground rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2", children: ["Click me (", clickCount, ")"] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("h3", { className: "text-lg font-medium", children: "Selectable Cards" }), _jsx("div", { className: "grid grid-cols-3 gap-4", children: cards.map(card => (_jsxs("div", { ...accessibleClickHandler(() => setSelectedCard(card.id)), "aria-pressed": selectedCard === card.id, className: `p-4 border rounded-lg cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${selectedCard === card.id
                                ? 'bg-primary text-primary-foreground border-primary'
                                : 'hover:bg-accent'}`, children: [_jsx("h4", { className: "font-medium", children: card.title }), _jsx("p", { className: "text-sm opacity-80", children: card.description })] }, card.id))) }), selectedCard && (_jsxs("p", { className: "text-sm", role: "status", "aria-live": "polite", children: ["Selected: ", selectedCard] }))] })] }));
}
// =============================================================================
// 2. Focus Trap Demo
// =============================================================================
function FocusTrapDemo() {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const { containerRef } = useFocusTrap({
        enabled: isModalOpen,
        autoFocus: true,
        returnFocus: true,
    });
    useEscapeKey(() => setIsModalOpen(false), isModalOpen);
    return (_jsxs("section", { className: "space-y-4", children: [_jsx("h2", { className: "text-2xl font-semibold", children: "2. Focus Trap" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Keeps keyboard focus within a container (essential for modals). Press Tab to cycle through elements, Escape to close." }), _jsx("button", { onClick: () => setIsModalOpen(true), className: "px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2", children: "Open Modal (Focus Trap Demo)" }), isModalOpen && (_jsx("div", { className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50", onClick: () => setIsModalOpen(false), role: "presentation", children: _jsxs("div", { ref: containerRef, role: "dialog", "aria-modal": "true", "aria-labelledby": "modal-title", className: "bg-background p-6 rounded-lg shadow-xl max-w-md w-full mx-4", onClick: e => e.stopPropagation(), children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx("h3", { id: "modal-title", className: "text-xl font-semibold", children: "Focus Trap Modal" }), _jsx("button", { onClick: () => setIsModalOpen(false), "aria-label": "Close modal", className: "text-2xl focus:outline-none focus:ring-2 focus:ring-primary rounded", children: "\u2715" })] }), _jsx("p", { className: "mb-4", children: "Focus is trapped within this modal. Press Tab to cycle through the interactive elements below:" }), _jsxs("div", { className: "space-y-4", children: [_jsx("input", { type: "text", placeholder: "First input (auto-focused)", className: "w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary" }), _jsx("input", { type: "text", placeholder: "Second input", className: "w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary" }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => setIsModalOpen(false), className: "flex-1 px-4 py-2 border rounded hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary", children: "Cancel" }), _jsx("button", { onClick: () => {
                                                announceToScreenReader('Action confirmed');
                                                setIsModalOpen(false);
                                            }, className: "flex-1 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary", children: "Confirm" })] })] }), _jsx("p", { className: "mt-4 text-sm text-muted-foreground", children: "Press Escape to close" })] }) }))] }));
}
// =============================================================================
// 3. Auto-Focus Demo
// =============================================================================
function AutoFocusDemo() {
    const [showSearch, setShowSearch] = React.useState(false);
    const inputRef = useAutoFocus(showSearch);
    return (_jsxs("section", { className: "space-y-4", children: [_jsx("h2", { className: "text-2xl font-semibold", children: "3. Auto-Focus" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Automatically focuses an element when a condition becomes true." }), _jsx("button", { onClick: () => setShowSearch(!showSearch), className: "px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2", children: showSearch ? 'Hide Search' : 'Show Search (Auto-Focus)' }), showSearch && (_jsxs("div", { className: "p-4 border rounded-lg", children: [_jsx("label", { htmlFor: "search-input", className: "block text-sm font-medium mb-2", children: "Search (auto-focused when shown)" }), _jsx("input", { id: "search-input", ref: inputRef, type: "search", placeholder: "Start typing to search...", className: "w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary" })] }))] }));
}
// =============================================================================
// 4. Escape Key Demo
// =============================================================================
function EscapeKeyDemo() {
    const [isToastVisible, setIsToastVisible] = React.useState(false);
    useEscapeKey(() => setIsToastVisible(false), isToastVisible);
    return (_jsxs("section", { className: "space-y-4", children: [_jsx("h2", { className: "text-2xl font-semibold", children: "4. Escape Key Handler" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Closes dismissible content when Escape is pressed." }), _jsx("button", { onClick: () => setIsToastVisible(true), className: "px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2", children: "Show Toast (Press Escape to Dismiss)" }), isToastVisible && (_jsx("div", { role: "alert", className: "fixed bottom-4 right-4 bg-background border shadow-lg rounded-lg p-4 max-w-sm", children: _jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { children: [_jsx("p", { className: "font-medium", children: "Dismissible Toast" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Press Escape to close this toast." })] }), _jsx("button", { onClick: () => setIsToastVisible(false), "aria-label": "Dismiss notification", className: "text-xl focus:outline-none focus:ring-2 focus:ring-primary rounded", children: "\u2715" })] }) }))] }));
}
// =============================================================================
// 5. Screen Reader Announcements Demo
// =============================================================================
function ScreenReaderDemo() {
    const [lastAnnouncement, setLastAnnouncement] = React.useState(null);
    const handleAnnounce = (message, priority) => {
        announceToScreenReader(message, priority);
        setLastAnnouncement(`[${priority}] ${message}`);
    };
    return (_jsxs("section", { className: "space-y-4", children: [_jsx("h2", { className: "text-2xl font-semibold", children: "5. Screen Reader Announcements" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Announces dynamic content changes to screen readers using ARIA live regions." }), _jsxs("div", { className: "flex gap-2 flex-wrap", children: [_jsx("button", { onClick: () => handleAnnounce('Form saved successfully', 'polite'), className: "px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2", children: "Announce Success (Polite)" }), _jsx("button", { onClick: () => handleAnnounce('Error: Please check your input', 'assertive'), className: "px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2", children: "Announce Error (Assertive)" }), _jsx("button", { onClick: () => handleAnnounce('Loading complete, 5 items found', 'polite'), className: "px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2", children: "Announce Update (Polite)" })] }), lastAnnouncement && (_jsxs("div", { className: "p-4 bg-muted rounded-lg", children: [_jsx("p", { className: "text-sm font-medium", children: "Last Announcement:" }), _jsx("p", { className: "text-sm", children: lastAnnouncement }), _jsx("p", { className: "text-xs text-muted-foreground mt-2", children: "(Screen readers will hear this, but it's hidden visually)" })] }))] }));
}
// =============================================================================
// 6. Keyboard Navigation Demo
// =============================================================================
function KeyboardNavigationDemo() {
    const [focusedIndex, setFocusedIndex] = React.useState(-1);
    const listRef = React.useRef(null);
    const items = [
        { id: 1, label: 'Home' },
        { id: 2, label: 'Products' },
        { id: 3, label: 'About' },
        { id: 4, label: 'Contact' },
    ];
    const handleKeyDown = (e) => {
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setFocusedIndex(prev => Math.min(prev + 1, items.length - 1));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setFocusedIndex(prev => Math.max(prev - 1, 0));
                break;
            case 'Home':
                e.preventDefault();
                setFocusedIndex(0);
                break;
            case 'End':
                e.preventDefault();
                setFocusedIndex(items.length - 1);
                break;
            case 'Enter':
            case ' ':
                e.preventDefault();
                if (focusedIndex >= 0) {
                    announceToScreenReader(`Selected ${items[focusedIndex].label}`);
                }
                break;
        }
    };
    React.useEffect(() => {
        if (focusedIndex >= 0 && listRef.current) {
            const button = listRef.current.querySelector(`[data-index="${focusedIndex}"]`);
            button?.focus();
        }
    }, [focusedIndex]);
    return (_jsxs("section", { className: "space-y-4", children: [_jsx("h2", { className: "text-2xl font-semibold", children: "6. Keyboard Navigation (Arrow Keys)" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Navigate with arrow keys, Home/End for first/last item. This pattern is used for menus and lists." }), _jsxs("div", { className: "p-4 border rounded-lg max-w-xs", children: [_jsx("p", { className: "text-sm font-medium mb-2", children: "Navigation Menu" }), _jsx("ul", { ref: listRef, role: "menu", "aria-label": "Navigation menu", onKeyDown: handleKeyDown, className: "space-y-1", children: items.map((item, index) => (_jsx("li", { role: "none", children: _jsx("button", { role: "menuitem", "data-index": index, tabIndex: index === 0 ? 0 : -1, className: `w-full text-left px-3 py-2 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${focusedIndex === index ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`, children: item.label }) }, item.id))) }), _jsx("p", { className: "text-xs text-muted-foreground mt-2", children: "Use \u2191\u2193 arrows, Home, End keys" })] })] }));
}
// =============================================================================
// Exports
// =============================================================================
export default AccessibilityDemo;
//# sourceMappingURL=accessibility-demo.js.map