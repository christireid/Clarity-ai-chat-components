/**
 * Developer Tools Dashboard
 * Comprehensive dashboard combining all dev tools components
 * React 19 component showcasing all features
 */
'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { APIInspectorPanel } from './api-inspector-panel';
import { ProfilerPanel } from './profiler-panel';
import { ValidationForm } from './validation-form';
import { TimeTravelPanel } from './time-travel-panel';
import { ModelComparisonPanel } from './model-comparison-panel';
/**
 * Developer Tools Dashboard Component
 * Combines all dev tools in a tabbed interface
 */
export function DevToolsDashboard({ className, defaultTab = 'inspector', showInspector = true, showProfiler = true, showValidation = true, showTimeTravel = true, showModelComparison = true, }) {
    const [activeTab, setActiveTab] = React.useState(defaultTab);
    const tabs = React.useMemo(() => {
        const availableTabs = [];
        if (showInspector) {
            availableTabs.push({ id: 'inspector', label: 'API Inspector', icon: '🔍' });
        }
        if (showProfiler) {
            availableTabs.push({ id: 'profiler', label: 'Profiler', icon: '⚡' });
        }
        if (showValidation) {
            availableTabs.push({ id: 'validation', label: 'Validation', icon: '✅' });
        }
        if (showTimeTravel) {
            availableTabs.push({ id: 'time-travel', label: 'Time Travel', icon: '⏮️' });
        }
        if (showModelComparison) {
            availableTabs.push({ id: 'model-comparison', label: 'Model Comparison', icon: '⚖️' });
        }
        return availableTabs;
    }, [showInspector, showProfiler, showValidation, showTimeTravel, showModelComparison]);
    return (_jsxs("div", { className: className, "data-testid": "dev-tools-dashboard", children: [_jsxs("div", { className: "dev-tools-header", children: [_jsx("h1", { children: "Developer Tools Dashboard" }), _jsx("p", { className: "dev-tools-subtitle", children: "React 19 powered developer tools for AI chat applications" })] }), _jsx("div", { className: "dev-tools-tabs", children: tabs.map((tab) => (_jsxs("button", { className: `dev-tools-tab ${activeTab === tab.id ? 'active' : ''}`, onClick: () => setActiveTab(tab.id), type: "button", children: [_jsx("span", { className: "tab-icon", children: tab.icon }), _jsx("span", { className: "tab-label", children: tab.label })] }, tab.id))) }), _jsxs("div", { className: "dev-tools-content", children: [activeTab === 'inspector' && showInspector && (_jsx("div", { className: "dev-tools-panel", children: _jsx(APIInspectorPanel, {}) })), activeTab === 'profiler' && showProfiler && (_jsx("div", { className: "dev-tools-panel", children: _jsx(ProfilerPanel, {}) })), activeTab === 'validation' && showValidation && (_jsx("div", { className: "dev-tools-panel", children: _jsx(ValidationForm, { type: "env" }) })), activeTab === 'time-travel' && showTimeTravel && (_jsx("div", { className: "dev-tools-panel", children: _jsx(TimeTravelPanel, {}) })), activeTab === 'model-comparison' && showModelComparison && (_jsx("div", { className: "dev-tools-panel", children: _jsx(ModelComparisonPanel, {}) }))] }), _jsx("div", { className: "dev-tools-footer", children: _jsx("p", { className: "dev-tools-info", children: "Powered by React 19 \u2022 Using useOptimistic for real-time updates" }) })] }));
}
//# sourceMappingURL=dev-tools-dashboard.js.map