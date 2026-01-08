/**
 * Dev Tools Demo Page
 * Visual demonstration of all dev tools components
 * Used for testing and showcasing the UI
 */
'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { DevToolsDashboard } from './dev-tools-dashboard';
import { SearchIcon, ZapIcon, ClockIcon, CheckCircleIcon, AlertTriangleIcon, TrashIcon, PlayIcon, PauseIcon, } from './icons';
/**
 * Demo Page Component
 * Showcases all dev tools components with sample data
 */
export function DemoPage({ theme = 'auto' }) {
    const [currentTheme, setCurrentTheme] = React.useState(theme);
    const [showIconsDemo, setShowIconsDemo] = React.useState(false);
    return (_jsxs("div", { className: `dev-tools-root demo-page ${currentTheme === 'dark' ? 'dev-tools-dark' : ''}`, children: [_jsxs("header", { className: "demo-header", children: [_jsxs("div", { className: "demo-header-content", children: [_jsx("h1", { children: "Clarity Dev Tools Demo" }), _jsx("p", { children: "Premium Developer Tools for AI Chat Applications" })] }), _jsxs("div", { className: "demo-controls", children: [_jsx("button", { className: "dt-btn dt-btn-ghost", onClick: () => setShowIconsDemo(!showIconsDemo), children: showIconsDemo ? 'Show Dashboard' : 'Show Icons' }), _jsxs("select", { className: "demo-theme-select", value: currentTheme, onChange: (e) => setCurrentTheme(e.target.value), "aria-label": "Select theme", children: [_jsx("option", { value: "light", children: "Light" }), _jsx("option", { value: "dark", children: "Dark" }), _jsx("option", { value: "auto", children: "Auto" })] })] })] }), _jsx("main", { className: "demo-content", children: showIconsDemo ? (_jsx(IconsDemo, {})) : (_jsx(DevToolsDashboard, { theme: currentTheme, enableKeyboardShortcuts: true, showInspector: true, showProfiler: true, showValidation: true, showTimeTravel: true, showModelComparison: true })) }), _jsxs("aside", { className: "demo-features", children: [_jsx("h2", { children: "Features" }), _jsxs("ul", { className: "features-list", children: [_jsxs("li", { children: [_jsx(CheckCircleIcon, { size: "sm" }), _jsx("span", { children: "React 19 with useOptimistic" })] }), _jsxs("li", { children: [_jsx(CheckCircleIcon, { size: "sm" }), _jsx("span", { children: "90+ CSS Custom Properties" })] }), _jsxs("li", { children: [_jsx(CheckCircleIcon, { size: "sm" }), _jsx("span", { children: "Light & Dark Mode" })] }), _jsxs("li", { children: [_jsx(CheckCircleIcon, { size: "sm" }), _jsx("span", { children: "Keyboard Navigation" })] }), _jsxs("li", { children: [_jsx(CheckCircleIcon, { size: "sm" }), _jsx("span", { children: "ARIA Accessibility" })] }), _jsxs("li", { children: [_jsx(CheckCircleIcon, { size: "sm" }), _jsx("span", { children: "Smooth Animations" })] }), _jsxs("li", { children: [_jsx(CheckCircleIcon, { size: "sm" }), _jsx("span", { children: "Error Boundaries" })] }), _jsxs("li", { children: [_jsx(CheckCircleIcon, { size: "sm" }), _jsx("span", { children: "Export Functionality" })] })] })] })] }));
}
/**
 * Icons Demo Component
 * Showcases all available icons
 */
function IconsDemo() {
    const icons = [
        { name: 'Search', Icon: SearchIcon },
        { name: 'Zap', Icon: ZapIcon },
        { name: 'Clock', Icon: ClockIcon },
        { name: 'CheckCircle', Icon: CheckCircleIcon },
        { name: 'AlertTriangle', Icon: AlertTriangleIcon },
        { name: 'Trash', Icon: TrashIcon },
        { name: 'Play', Icon: PlayIcon },
        { name: 'Pause', Icon: PauseIcon },
    ];
    return (_jsxs("div", { className: "icons-demo", children: [_jsx("h2", { children: "Icon Library" }), _jsx("p", { className: "icons-demo-description", children: "All icons support size props (sm, md, lg, xl or custom number) and className." }), _jsx("div", { className: "icons-grid", children: icons.map(({ name, Icon }) => (_jsxs("div", { className: "icon-item", children: [_jsx("div", { className: "icon-preview", children: _jsx(Icon, { size: "lg" }) }), _jsx("span", { className: "icon-name", children: name })] }, name))) }), _jsx("h3", { children: "Icon Sizes" }), _jsxs("div", { className: "icon-sizes", children: [_jsxs("div", { className: "size-item", children: [_jsx(SearchIcon, { size: "sm" }), _jsx("span", { children: "sm (14px)" })] }), _jsxs("div", { className: "size-item", children: [_jsx(SearchIcon, { size: "md" }), _jsx("span", { children: "md (16px)" })] }), _jsxs("div", { className: "size-item", children: [_jsx(SearchIcon, { size: "lg" }), _jsx("span", { children: "lg (18px)" })] }), _jsxs("div", { className: "size-item", children: [_jsx(SearchIcon, { size: "xl" }), _jsx("span", { children: "xl (48px)" })] }), _jsxs("div", { className: "size-item", children: [_jsx(SearchIcon, { size: 24 }), _jsx("span", { children: "24px" })] })] })] }));
}
/**
 * Buttons Demo Component
 */
export function ButtonsDemo() {
    return (_jsxs("div", { className: "buttons-demo", children: [_jsx("h2", { children: "Button Variants" }), _jsxs("div", { className: "button-row", children: [_jsx("button", { className: "dt-btn dt-btn-primary", children: "Primary" }), _jsx("button", { className: "dt-btn dt-btn-secondary", children: "Secondary" }), _jsx("button", { className: "dt-btn dt-btn-ghost", children: "Ghost" }), _jsx("button", { className: "dt-btn dt-btn-danger", children: "Danger" })] }), _jsxs("div", { className: "button-row", children: [_jsx("button", { className: "dt-btn dt-btn-primary dt-btn-sm", children: "Small" }), _jsx("button", { className: "dt-btn dt-btn-primary", children: "Medium" }), _jsx("button", { className: "dt-btn dt-btn-primary dt-btn-lg", children: "Large" })] }), _jsxs("div", { className: "button-row", children: [_jsx("button", { className: "dt-btn dt-btn-primary", disabled: true, children: "Disabled" }), _jsxs("button", { className: "dt-btn dt-btn-primary", children: [_jsx(ZapIcon, { size: "sm" }), "With Icon"] }), _jsx("button", { className: "dt-btn dt-btn-ghost dt-btn-icon", "aria-label": "Icon only", children: _jsx(TrashIcon, {}) })] })] }));
}
/**
 * Status Badges Demo
 */
export function StatusBadgesDemo() {
    return (_jsxs("div", { className: "badges-demo", children: [_jsx("h2", { children: "Status Badges" }), _jsxs("div", { className: "badge-row", children: [_jsxs("span", { className: "status-badge success", children: [_jsx(CheckCircleIcon, { size: "sm" }), "Success"] }), _jsxs("span", { className: "status-badge warning", children: [_jsx(AlertTriangleIcon, { size: "sm" }), "Warning"] }), _jsxs("span", { className: "status-badge error", children: [_jsx(AlertTriangleIcon, { size: "sm" }), "Error"] }), _jsxs("span", { className: "status-badge pending", children: [_jsx(ClockIcon, { size: "sm" }), "Pending"] })] })] }));
}
export default DemoPage;
//# sourceMappingURL=demo.js.map