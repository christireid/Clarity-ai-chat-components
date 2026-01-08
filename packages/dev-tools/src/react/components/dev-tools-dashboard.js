/**
 * Developer Tools Dashboard
 * Premium dashboard combining all dev tools components
 * React 19 component with accessibility, keyboard navigation, and delightful UX
 */
'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import * as React from 'react';
import { APIInspectorPanel } from './api-inspector-panel';
import { ProfilerPanel } from './profiler-panel';
import { ValidationForm } from './validation-form';
import { TimeTravelPanel } from './time-travel-panel';
import { ModelComparisonPanel } from './model-comparison-panel';
import { PanelErrorBoundary } from './error-boundary';
import { InspectorIcon, ProfilerIcon, ValidationIcon, TimeTravelIcon, ComparisonIcon, KeyboardIcon, CloseIcon, } from './icons';
// Tab icon mapping using shared icons
const TabIcons = {
    inspector: InspectorIcon,
    profiler: ProfilerIcon,
    validation: ValidationIcon,
    'time-travel': TimeTravelIcon,
    'model-comparison': ComparisonIcon,
};
/**
 * Developer Tools Dashboard Component
 * A premium, accessible dashboard combining all dev tools
 */
export function DevToolsDashboard({ className, defaultTab = 'inspector', showInspector = true, showProfiler = true, showValidation = true, showTimeTravel = true, showModelComparison = true, theme = 'auto', onTabChange, enableKeyboardShortcuts = true, compact = false, }) {
    const [activeTab, setActiveTab] = React.useState(defaultTab);
    const [showShortcuts, setShowShortcuts] = React.useState(false);
    const tabListRef = React.useRef(null);
    const tabRefs = React.useRef(new Map());
    // Build available tabs
    const tabs = React.useMemo(() => {
        const availableTabs = [];
        if (showInspector) {
            const Icon = TabIcons.inspector;
            availableTabs.push({
                id: 'inspector',
                label: 'API Inspector',
                icon: _jsx(Icon, { size: "lg" }),
                shortcut: '1',
                description: 'Monitor and debug API calls in real-time',
            });
        }
        if (showProfiler) {
            const Icon = TabIcons.profiler;
            availableTabs.push({
                id: 'profiler',
                label: 'Profiler',
                icon: _jsx(Icon, { size: "lg" }),
                shortcut: '2',
                description: 'Track performance metrics and bottlenecks',
            });
        }
        if (showValidation) {
            const Icon = TabIcons.validation;
            availableTabs.push({
                id: 'validation',
                label: 'Validation',
                icon: _jsx(Icon, { size: "lg" }),
                shortcut: '3',
                description: 'Validate configuration and API keys',
            });
        }
        if (showTimeTravel) {
            const Icon = TabIcons['time-travel'];
            availableTabs.push({
                id: 'time-travel',
                label: 'Time Travel',
                icon: _jsx(Icon, { size: "lg" }),
                shortcut: '4',
                description: 'Debug state changes with time-travel',
            });
        }
        if (showModelComparison) {
            const Icon = TabIcons['model-comparison'];
            availableTabs.push({
                id: 'model-comparison',
                label: 'Model Comparison',
                icon: _jsx(Icon, { size: "lg" }),
                shortcut: '5',
                description: 'Compare AI model responses and costs',
            });
        }
        return availableTabs;
    }, [
        showInspector,
        showProfiler,
        showValidation,
        showTimeTravel,
        showModelComparison,
    ]);
    // Handle tab change
    const handleTabChange = React.useCallback((tab) => {
        setActiveTab(tab);
        onTabChange?.(tab);
    }, [onTabChange]);
    // Keyboard navigation
    React.useEffect(() => {
        if (!enableKeyboardShortcuts)
            return;
        const handleKeyDown = (e) => {
            // Ignore if user is typing in an input
            if (e.target instanceof HTMLInputElement ||
                e.target instanceof HTMLTextAreaElement) {
                return;
            }
            // Number shortcuts (1-5)
            if (e.key >= '1' && e.key <= '5') {
                const index = parseInt(e.key) - 1;
                if (tabs[index]) {
                    e.preventDefault();
                    handleTabChange(tabs[index].id);
                    tabRefs.current.get(tabs[index].id)?.focus();
                }
            }
            // ? to show shortcuts
            if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
                e.preventDefault();
                setShowShortcuts((prev) => !prev);
            }
            // Escape to close shortcuts
            if (e.key === 'Escape' && showShortcuts) {
                setShowShortcuts(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [enableKeyboardShortcuts, tabs, handleTabChange, showShortcuts]);
    // Arrow key navigation within tabs
    const handleTabKeyDown = React.useCallback((e, currentIndex) => {
        let newIndex = currentIndex;
        switch (e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                newIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
                break;
            case 'ArrowRight':
                e.preventDefault();
                newIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
                break;
            case 'Home':
                e.preventDefault();
                newIndex = 0;
                break;
            case 'End':
                e.preventDefault();
                newIndex = tabs.length - 1;
                break;
            default:
                return;
        }
        const newTab = tabs[newIndex];
        if (newTab) {
            handleTabChange(newTab.id);
            tabRefs.current.get(newTab.id)?.focus();
        }
    }, [tabs, handleTabChange]);
    // Theme class
    const themeClass = theme === 'auto' ? '' : theme === 'dark' ? 'dev-tools-dark' : '';
    return (_jsxs("div", { className: `dev-tools-root dev-tools-dashboard ${themeClass} ${compact ? 'dev-tools-compact' : ''} ${className || ''}`, "data-testid": "dev-tools-dashboard", children: [_jsx("a", { href: "#dev-tools-content", className: "skip-link", children: "Skip to content" }), _jsxs("header", { className: "dev-tools-header", children: [_jsxs("div", { className: "dev-tools-header-content", children: [_jsx("h1", { children: "Developer Tools" }), _jsx("p", { className: "dev-tools-subtitle", children: "AI Chat Development Suite" })] }), enableKeyboardShortcuts && (_jsxs("button", { className: "dt-btn dt-btn-ghost keyboard-hint", onClick: () => setShowShortcuts((prev) => !prev), "aria-label": "Show keyboard shortcuts", title: "Keyboard shortcuts (?)", children: [_jsx(KeyboardIcon, { size: "sm" }), _jsx("span", { className: "keyboard-hint-text", children: "?" })] }))] }), _jsx("nav", { className: "dev-tools-tabs", "aria-label": "Developer tools tabs", children: _jsx("div", { ref: tabListRef, role: "tablist", "aria-label": "Developer tool panels", className: "dev-tools-tablist", children: tabs.map((tab, index) => (_jsxs("button", { ref: (el) => {
                            if (el)
                                tabRefs.current.set(tab.id, el);
                        }, role: "tab", "aria-selected": activeTab === tab.id, "aria-controls": `panel-${tab.id}`, id: `tab-${tab.id}`, tabIndex: activeTab === tab.id ? 0 : -1, className: `dev-tools-tab ${activeTab === tab.id ? 'active' : ''}`, onClick: () => handleTabChange(tab.id), onKeyDown: (e) => handleTabKeyDown(e, index), children: [_jsx("span", { className: "tab-icon", "aria-hidden": "true", children: tab.icon }), _jsx("span", { className: "tab-label", children: tab.label }), enableKeyboardShortcuts && !compact && (_jsx("kbd", { className: "tab-shortcut", "aria-hidden": "true", children: tab.shortcut }))] }, tab.id))) }) }), _jsx("main", { id: "dev-tools-content", className: "dev-tools-content", children: tabs.map((tab) => (_jsx("div", { role: "tabpanel", id: `panel-${tab.id}`, "aria-labelledby": `tab-${tab.id}`, hidden: activeTab !== tab.id, tabIndex: 0, className: "dev-tools-panel", children: activeTab === tab.id && (_jsxs(_Fragment, { children: [tab.id === 'inspector' && (_jsx(PanelErrorBoundary, { panelName: "API Inspector", children: _jsx(APIInspectorPanel, {}) })), tab.id === 'profiler' && (_jsx(PanelErrorBoundary, { panelName: "Profiler", children: _jsx(ProfilerPanel, {}) })), tab.id === 'validation' && (_jsx(PanelErrorBoundary, { panelName: "Validation", children: _jsx(ValidationForm, { type: "env" }) })), tab.id === 'time-travel' && (_jsx(PanelErrorBoundary, { panelName: "Time Travel", children: _jsx(TimeTravelPanel, {}) })), tab.id === 'model-comparison' && (_jsx(PanelErrorBoundary, { panelName: "Model Comparison", children: _jsx(ModelComparisonPanel, {}) }))] })) }, tab.id))) }), _jsx("footer", { className: "dev-tools-footer", children: _jsxs("p", { className: "dev-tools-info", children: [_jsx("span", { children: "Clarity Dev Tools" }), _jsx("span", { className: "footer-separator", children: "\u2022" }), _jsx("span", { children: "React 19" }), _jsx("span", { className: "footer-separator", children: "\u2022" }), _jsx("span", { children: "Optimistic Updates" })] }) }), showShortcuts && (_jsx("div", { className: "shortcuts-overlay", onClick: () => setShowShortcuts(false), role: "dialog", "aria-modal": "true", "aria-labelledby": "shortcuts-title", children: _jsxs("div", { className: "shortcuts-modal", onClick: (e) => e.stopPropagation(), children: [_jsxs("header", { className: "shortcuts-header", children: [_jsx("h2", { id: "shortcuts-title", children: "Keyboard Shortcuts" }), _jsx("button", { className: "dt-btn dt-btn-ghost dt-btn-icon", onClick: () => setShowShortcuts(false), "aria-label": "Close shortcuts", children: _jsx(CloseIcon, { size: 20 }) })] }), _jsxs("div", { className: "shortcuts-content", children: [_jsxs("div", { className: "shortcuts-group", children: [_jsx("h3", { children: "Navigation" }), _jsx("ul", { className: "shortcuts-list", children: tabs.map((tab) => (_jsxs("li", { className: "shortcut-item", children: [_jsx("kbd", { children: tab.shortcut }), _jsx("span", { children: tab.label })] }, tab.id))) })] }), _jsxs("div", { className: "shortcuts-group", children: [_jsx("h3", { children: "General" }), _jsxs("ul", { className: "shortcuts-list", children: [_jsxs("li", { className: "shortcut-item", children: [_jsx("kbd", { children: "?" }), _jsx("span", { children: "Toggle shortcuts" })] }), _jsxs("li", { className: "shortcut-item", children: [_jsx("kbd", { children: "Esc" }), _jsx("span", { children: "Close dialog" })] }), _jsxs("li", { className: "shortcut-item", children: [_jsx("kbd", { children: "\u2190" }), " ", _jsx("kbd", { children: "\u2192" }), _jsx("span", { children: "Navigate tabs" })] })] })] })] })] }) }))] }));
}
//# sourceMappingURL=dev-tools-dashboard.js.map