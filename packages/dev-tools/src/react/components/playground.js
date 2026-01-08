/**
 * Interactive Playground Component
 * A sandbox for testing and experimenting with dev-tools components
 */
'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { SearchIcon, ZapIcon, CheckCircleIcon, AlertTriangleIcon, ClockIcon, TrashIcon, PlayIcon, PauseIcon, InspectorIcon, ProfilerIcon, ValidationIcon, TimeTravelIcon, ComparisonIcon, SettingsIcon, InfoIcon, DownloadIcon, } from './icons';
import { LoadingSpinner, LoadingOverlay, LoadingSkeleton, LoadingButton, } from './loading-state';
import { ConfirmationDialog, useConfirmationDialog, } from './confirmation-dialog';
import { VirtualList } from './virtual-list';
import { ScreenReaderAnnouncer, SkipLink, useAnnounce } from './accessibility';
function PlaygroundSection({ title, description, children }) {
    return (_jsxs("section", { className: "playground-section", children: [_jsxs("header", { className: "playground-section-header", children: [_jsx("h2", { className: "playground-section-title", children: title }), description && (_jsx("p", { className: "playground-section-description", children: description }))] }), _jsx("div", { className: "playground-section-content", children: children })] }));
}
// ============================================================================
// Icons Playground
// ============================================================================
function IconsPlayground() {
    const [size, setSize] = React.useState('md');
    const icons = [
        { name: 'Search', Icon: SearchIcon },
        { name: 'Zap', Icon: ZapIcon },
        { name: 'CheckCircle', Icon: CheckCircleIcon },
        { name: 'AlertTriangle', Icon: AlertTriangleIcon },
        { name: 'Clock', Icon: ClockIcon },
        { name: 'Trash', Icon: TrashIcon },
        { name: 'Play', Icon: PlayIcon },
        { name: 'Pause', Icon: PauseIcon },
        { name: 'Inspector', Icon: InspectorIcon },
        { name: 'Profiler', Icon: ProfilerIcon },
        { name: 'Validation', Icon: ValidationIcon },
        { name: 'TimeTravel', Icon: TimeTravelIcon },
        { name: 'Comparison', Icon: ComparisonIcon },
        { name: 'Settings', Icon: SettingsIcon },
        { name: 'Info', Icon: InfoIcon },
        { name: 'Download', Icon: DownloadIcon },
    ];
    return (_jsxs(PlaygroundSection, { title: "Icons", description: "40+ SVG icons with size variants", children: [_jsx("div", { className: "playground-controls", children: _jsxs("label", { className: "playground-control", children: [_jsx("span", { children: "Size:" }), _jsxs("select", { value: size, onChange: (e) => setSize(e.target.value), className: "playground-select", children: [_jsx("option", { value: "sm", children: "Small (14px)" }), _jsx("option", { value: "md", children: "Medium (16px)" }), _jsx("option", { value: "lg", children: "Large (18px)" }), _jsx("option", { value: "xl", children: "XL (48px)" })] })] }) }), _jsx("div", { className: "playground-icon-grid", children: icons.map(({ name, Icon }) => (_jsxs("div", { className: "playground-icon-item", children: [_jsx(Icon, { size: size }), _jsx("span", { className: "playground-icon-name", children: name })] }, name))) })] }));
}
// ============================================================================
// Buttons Playground
// ============================================================================
function ButtonsPlayground() {
    const [isLoading, setIsLoading] = React.useState(false);
    const handleLoadingClick = () => {
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 2000);
    };
    return (_jsxs(PlaygroundSection, { title: "Buttons", description: "Button variants, sizes, and states", children: [_jsxs("div", { className: "playground-button-group", children: [_jsx("h3", { children: "Variants" }), _jsxs("div", { className: "playground-row", children: [_jsx("button", { className: "dt-btn dt-btn-primary", children: "Primary" }), _jsx("button", { className: "dt-btn dt-btn-secondary", children: "Secondary" }), _jsx("button", { className: "dt-btn dt-btn-ghost", children: "Ghost" }), _jsx("button", { className: "dt-btn dt-btn-danger", children: "Danger" })] })] }), _jsxs("div", { className: "playground-button-group", children: [_jsx("h3", { children: "Sizes" }), _jsxs("div", { className: "playground-row", children: [_jsx("button", { className: "dt-btn dt-btn-primary dt-btn-sm", children: "Small" }), _jsx("button", { className: "dt-btn dt-btn-primary", children: "Medium" }), _jsx("button", { className: "dt-btn dt-btn-primary dt-btn-lg", children: "Large" })] })] }), _jsxs("div", { className: "playground-button-group", children: [_jsx("h3", { children: "States" }), _jsxs("div", { className: "playground-row", children: [_jsx("button", { className: "dt-btn dt-btn-primary", disabled: true, children: "Disabled" }), _jsx(LoadingButton, { isLoading: isLoading, onClick: handleLoadingClick, loadingText: "Loading...", children: "Click to Load" })] })] }), _jsxs("div", { className: "playground-button-group", children: [_jsx("h3", { children: "With Icons" }), _jsxs("div", { className: "playground-row", children: [_jsxs("button", { className: "dt-btn dt-btn-primary", children: [_jsx(SearchIcon, { size: "sm" }), "Search"] }), _jsxs("button", { className: "dt-btn dt-btn-secondary", children: [_jsx(DownloadIcon, { size: "sm" }), "Download"] }), _jsx("button", { className: "dt-btn dt-btn-ghost dt-btn-icon", "aria-label": "Settings", children: _jsx(SettingsIcon, {}) })] })] })] }));
}
// ============================================================================
// Loading States Playground
// ============================================================================
function LoadingPlayground() {
    const [showOverlay, setShowOverlay] = React.useState(false);
    return (_jsxs(PlaygroundSection, { title: "Loading States", description: "Spinners, overlays, and skeletons", children: [_jsxs("div", { className: "playground-loading-group", children: [_jsx("h3", { children: "Spinners" }), _jsxs("div", { className: "playground-row", children: [_jsxs("div", { className: "playground-item", children: [_jsx(LoadingSpinner, { size: "sm" }), _jsx("span", { children: "Small" })] }), _jsxs("div", { className: "playground-item", children: [_jsx(LoadingSpinner, { size: "md" }), _jsx("span", { children: "Medium" })] }), _jsxs("div", { className: "playground-item", children: [_jsx(LoadingSpinner, { size: "lg" }), _jsx("span", { children: "Large" })] })] })] }), _jsxs("div", { className: "playground-loading-group", children: [_jsx("h3", { children: "Skeletons" }), _jsxs("div", { className: "playground-skeleton-demo", children: [_jsx(LoadingSkeleton, { width: "60%", height: "1.5em" }), _jsx(LoadingSkeleton, { lines: 3 }), _jsx(LoadingSkeleton, { width: 100, height: 100, radius: "lg" })] })] }), _jsxs("div", { className: "playground-loading-group", children: [_jsx("h3", { children: "Loading Overlay" }), _jsx("button", { className: "dt-btn dt-btn-primary", onClick: () => setShowOverlay(true), children: "Show Overlay (3s)" }), showOverlay && (_jsx(LoadingOverlay, { isLoading: showOverlay, message: "Processing...", children: _jsx("div", { className: "playground-overlay-content", children: _jsx("p", { children: "This content is behind the overlay" }) }) })), showOverlay && setTimeout(() => setShowOverlay(false), 3000) && null] })] }));
}
// ============================================================================
// Dialog Playground
// ============================================================================
function DialogPlayground() {
    const [showDefault, setShowDefault] = React.useState(false);
    const [showDanger, setShowDanger] = React.useState(false);
    const dangerDialog = useConfirmationDialog({
        onConfirm: async () => {
            await new Promise((resolve) => setTimeout(resolve, 1500));
        },
    });
    return (_jsxs(PlaygroundSection, { title: "Confirmation Dialogs", description: "Modal dialogs for confirming actions", children: [_jsxs("div", { className: "playground-row", children: [_jsx("button", { className: "dt-btn dt-btn-primary", onClick: () => setShowDefault(true), children: "Default Dialog" }), _jsx("button", { className: "dt-btn dt-btn-danger", onClick: dangerDialog.open, children: "Danger Dialog" })] }), _jsx(ConfirmationDialog, { isOpen: showDefault, onClose: () => setShowDefault(false), onConfirm: () => setShowDefault(false), title: "Confirm Action", message: "Are you sure you want to proceed with this action?" }), _jsx(ConfirmationDialog, { ...dangerDialog.dialogProps, title: "Delete Item", message: "This action cannot be undone. Are you sure you want to delete this item permanently?", variant: "danger", confirmText: "Delete" })] }));
}
// ============================================================================
// Virtual List Playground
// ============================================================================
function VirtualListPlayground() {
    const [itemCount, setItemCount] = React.useState(1000);
    const items = React.useMemo(() => Array.from({ length: itemCount }, (_, i) => ({
        id: i,
        name: `Item ${i + 1}`,
        description: `This is the description for item ${i + 1}`,
    })), [itemCount]);
    return (_jsxs(PlaygroundSection, { title: "Virtual List", description: "Efficient rendering for large lists", children: [_jsx("div", { className: "playground-controls", children: _jsxs("label", { className: "playground-control", children: [_jsx("span", { children: "Item Count:" }), _jsxs("select", { value: itemCount, onChange: (e) => setItemCount(Number(e.target.value)), className: "playground-select", children: [_jsx("option", { value: 100, children: "100 items" }), _jsx("option", { value: 1000, children: "1,000 items" }), _jsx("option", { value: 10000, children: "10,000 items" }), _jsx("option", { value: 100000, children: "100,000 items" })] })] }) }), _jsx("div", { className: "playground-virtual-list-container", children: _jsx(VirtualList, { items: items, itemHeight: 60, containerHeight: 300, renderItem: (item) => (_jsxs("div", { className: "playground-list-item", children: [_jsx("strong", { children: item.name }), _jsx("span", { children: item.description })] })), getKey: (item) => item.id }) }), _jsxs("p", { className: "playground-note", children: ["Only visible items are rendered. Try scrolling with", ' ', itemCount.toLocaleString(), " items!"] })] }));
}
// ============================================================================
// Accessibility Playground
// ============================================================================
function AccessibilityPlayground() {
    const { announce, Announcer } = useAnnounce();
    const [lastAnnouncement, setLastAnnouncement] = React.useState('');
    const handleAnnounce = (message, level) => {
        announce(message, level);
        setLastAnnouncement(`${level}: "${message}"`);
    };
    return (_jsxs(PlaygroundSection, { title: "Accessibility", description: "Screen reader and keyboard navigation utilities", children: [_jsx(Announcer, {}), _jsxs("div", { className: "playground-a11y-group", children: [_jsx("h3", { children: "Screen Reader Announcements" }), _jsxs("div", { className: "playground-row", children: [_jsx("button", { className: "dt-btn dt-btn-primary", onClick: () => handleAnnounce('Action completed successfully', 'polite'), children: "Polite Announcement" }), _jsx("button", { className: "dt-btn dt-btn-danger", onClick: () => handleAnnounce('Error: Something went wrong!', 'assertive'), children: "Assertive Announcement" })] }), lastAnnouncement && (_jsxs("p", { className: "playground-note", children: ["Last: ", lastAnnouncement] }))] }), _jsxs("div", { className: "playground-a11y-group", children: [_jsx("h3", { children: "Skip Link Demo" }), _jsx("p", { className: "playground-note", children: "Press Tab to reveal the skip link (visible only on focus)" }), _jsx(SkipLink, { targetId: "playground-main" })] }), _jsxs("div", { className: "playground-a11y-group", children: [_jsx("h3", { children: "Keyboard Navigation" }), _jsx("p", { className: "playground-note", children: "Use Arrow keys, Home, and End to navigate the list below" }), _jsx(KeyboardNavDemo, {})] })] }));
}
function KeyboardNavDemo() {
    const [selected, setSelected] = React.useState(0);
    const items = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'];
    const handleKeyDown = (e) => {
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelected((s) => (s + 1) % items.length);
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelected((s) => (s - 1 + items.length) % items.length);
                break;
            case 'Home':
                e.preventDefault();
                setSelected(0);
                break;
            case 'End':
                e.preventDefault();
                setSelected(items.length - 1);
                break;
        }
    };
    return (_jsx("ul", { role: "listbox", className: "playground-keyboard-nav-list", tabIndex: 0, onKeyDown: handleKeyDown, "aria-activedescendant": `item-${selected}`, children: items.map((item, i) => (_jsx("li", { id: `item-${i}`, role: "option", "aria-selected": i === selected, className: `playground-keyboard-nav-item ${i === selected ? 'selected' : ''}`, onClick: () => setSelected(i), children: item }, item))) }));
}
// ============================================================================
// Status Badges Playground
// ============================================================================
function BadgesPlayground() {
    return (_jsx(PlaygroundSection, { title: "Status Badges", description: "Status indicators with semantic colors", children: _jsxs("div", { className: "playground-row", children: [_jsxs("span", { className: "status-badge success", children: [_jsx(CheckCircleIcon, { size: "sm" }), "Success"] }), _jsxs("span", { className: "status-badge warning", children: [_jsx(AlertTriangleIcon, { size: "sm" }), "Warning"] }), _jsxs("span", { className: "status-badge error", children: [_jsx(AlertTriangleIcon, { size: "sm" }), "Error"] }), _jsxs("span", { className: "status-badge pending", children: [_jsx(ClockIcon, { size: "sm" }), "Pending"] }), _jsxs("span", { className: "status-badge info", children: [_jsx(InfoIcon, { size: "sm" }), "Info"] })] }) }));
}
/**
 * Interactive Playground for testing dev-tools components
 */
export function Playground({ theme = 'auto', className }) {
    const [currentTheme, setCurrentTheme] = React.useState(theme);
    const containerClass = [
        'playground',
        currentTheme === 'dark' ? 'dev-tools-dark' : '',
        className,
    ]
        .filter(Boolean)
        .join(' ');
    return (_jsxs("div", { className: containerClass, id: "playground-main", children: [_jsx(SkipLink, { targetId: "playground-main", children: "Skip to playground content" }), _jsxs("header", { className: "playground-header", children: [_jsxs("div", { className: "playground-header-content", children: [_jsxs("h1", { className: "playground-title", children: [_jsx(ZapIcon, { size: "lg" }), "Component Playground"] }), _jsx("p", { className: "playground-subtitle", children: "Interactive sandbox for Clarity Dev Tools components" })] }), _jsxs("div", { className: "playground-theme-toggle", children: [_jsx("label", { htmlFor: "theme-select", children: "Theme:" }), _jsxs("select", { id: "theme-select", value: currentTheme, onChange: (e) => setCurrentTheme(e.target.value), className: "playground-select", children: [_jsx("option", { value: "light", children: "Light" }), _jsx("option", { value: "dark", children: "Dark" }), _jsx("option", { value: "auto", children: "Auto" })] })] })] }), _jsxs("main", { className: "playground-main", children: [_jsx(IconsPlayground, {}), _jsx(ButtonsPlayground, {}), _jsx(BadgesPlayground, {}), _jsx(LoadingPlayground, {}), _jsx(DialogPlayground, {}), _jsx(VirtualListPlayground, {}), _jsx(AccessibilityPlayground, {})] }), _jsx("footer", { className: "playground-footer", children: _jsxs("p", { children: ["Clarity Dev Tools - ", new Date().getFullYear(), " - 144+ Tests Passing"] }) })] }));
}
export default Playground;
//# sourceMappingURL=playground.js.map