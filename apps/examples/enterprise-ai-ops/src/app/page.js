'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { ThemeProvider, themes, EvaluationDashboard, SafetyReviewConsole, PromptTestHarness, TokenOptimizationDashboard, PerformanceDashboard, useTokenOptimization, SafetyStatusCard, } from '@clarity-chat/react';
import { OpsHeader } from '@/components/OpsHeader';
import { MetricsOverview } from '@/components/MetricsOverview';
import { RealTimeMonitor } from '@/components/RealTimeMonitor';
import { AlertPanel } from '@/components/AlertPanel';
import { Shield, TrendingUp, Activity, TestTube, DollarSign } from 'lucide-react';
export default function EnterpriseAIOps() {
    const [activeTab, setActiveTab] = useState('overview');
    const { metrics } = useTokenOptimization({
        enabled: true,
        trackMetrics: true,
    });
    const mockMetrics = {
        totalRequests: 125430,
        successRate: 98.5,
        avgLatency: 245,
        p95Latency: 580,
        errorRate: 1.5,
        activeUsers: 1247,
        tokensUsed: 12500000,
        tokensSaved: 3750000,
        costSaved: 1125.50,
        safetyViolations: 3,
        qualityScore: 92.3,
    };
    const tabs = [
        { id: 'overview', label: 'Overview', icon: Activity },
        { id: 'safety', label: 'Safety', icon: Shield },
        { id: 'evaluation', label: 'Evaluation', icon: TrendingUp },
        { id: 'testing', label: 'Testing', icon: TestTube },
        { id: 'tokens', label: 'Token Ops', icon: DollarSign },
        { id: 'performance', label: 'Performance', icon: Activity },
    ];
    return (_jsx(ThemeProvider, { theme: themes.corporate, children: _jsxs("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-900", children: [_jsx(OpsHeader, {}), _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsx("div", { className: "mb-6 border-b border-gray-200 dark:border-gray-800", children: _jsx("nav", { className: "flex space-x-8", children: tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    return (_jsxs("button", { onClick: () => setActiveTab(tab.id), className: `flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                                            ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'}`, children: [_jsx(Icon, { className: "w-4 h-4" }), _jsx("span", { children: tab.label })] }, tab.id));
                                }) }) }), mockMetrics.safetyViolations > 0 && (_jsx(AlertPanel, { type: "warning", title: `${mockMetrics.safetyViolations} Safety Violations Detected`, message: "Review safety console for details", onDismiss: () => { } })), activeTab === 'overview' && (_jsxs("div", { className: "space-y-6", children: [_jsx(MetricsOverview, { metrics: mockMetrics }), _jsx(RealTimeMonitor, {})] })), activeTab === 'safety' && (_jsxs("div", { className: "space-y-6", children: [_jsx(SafetyReviewConsole, { violations: [
                                        {
                                            id: '1',
                                            timestamp: new Date(),
                                            severity: 'high',
                                            type: 'pii_detection',
                                            message: 'Potential PII detected in user input',
                                            details: { detected: ['email', 'phone'] },
                                        },
                                        {
                                            id: '2',
                                            timestamp: new Date(Date.now() - 3600000),
                                            severity: 'medium',
                                            type: 'content_filter',
                                            message: 'Content flagged for review',
                                            details: { category: 'violence' },
                                        },
                                    ], onReview: (id) => console.log('Review', id) }), _jsx(SafetyStatusCard, { status: {
                                        piiDetection: { enabled: true, violations: 1 },
                                        contentFiltering: { enabled: true, violations: 2 },
                                        promptInjection: { enabled: true, violations: 0 },
                                    } })] })), activeTab === 'evaluation' && (_jsx(EvaluationDashboard, { evaluations: [
                                {
                                    id: '1',
                                    name: 'Response Quality',
                                    score: 92.3,
                                    metrics: {
                                        accuracy: 94,
                                        relevance: 91,
                                        coherence: 92,
                                        helpfulness: 93,
                                    },
                                    timestamp: new Date(),
                                },
                                {
                                    id: '2',
                                    name: 'Safety Compliance',
                                    score: 98.5,
                                    metrics: {
                                        pii_detection: 100,
                                        content_filter: 97,
                                        prompt_injection: 98,
                                    },
                                    timestamp: new Date(),
                                },
                            ], onSelectEvaluation: (id) => console.log('Select', id) })), activeTab === 'testing' && (_jsx(PromptTestHarness, { testCases: [
                                {
                                    id: '1',
                                    name: 'Customer Support Prompt',
                                    prompt: 'Help customer with billing question',
                                    expectedBehavior: 'Professional, helpful, accurate',
                                    status: 'passed',
                                },
                                {
                                    id: '2',
                                    name: 'PII Detection Test',
                                    prompt: 'User email: john@example.com',
                                    expectedBehavior: 'Should detect and redact PII',
                                    status: 'failed',
                                },
                            ], onRunTest: (id) => console.log('Run test', id) })), activeTab === 'tokens' && (_jsx("div", { className: "space-y-6", children: _jsx(TokenOptimizationDashboard, { metrics: metrics || {
                                    totalTokens: 12500000,
                                    tokensSaved: 3750000,
                                    costSaved: 1125.50,
                                    savingsPercent: 30,
                                    breakdown: {
                                        promptCompression: { tokens: 1500000, percent: 12 },
                                        caching: { hits: 1200, savings: 1500000 },
                                        modelRouting: { savings: 500000, percent: 40 },
                                        responseLimiting: { tokens: 250000, percent: 8 },
                                    },
                                }, showBreakdown: true }) })), activeTab === 'performance' && (_jsx(PerformanceDashboard, { metrics: {
                                avgLatency: 245,
                                p95Latency: 580,
                                p99Latency: 1200,
                                throughput: 1250,
                                errorRate: 1.5,
                                successRate: 98.5,
                            }, timeSeriesData: [
                                { time: '00:00', latency: 200, throughput: 1100 },
                                { time: '01:00', latency: 245, throughput: 1250 },
                                { time: '02:00', latency: 180, throughput: 980 },
                                { time: '03:00', latency: 280, throughput: 1350 },
                            ] }))] })] }) }));
}
//# sourceMappingURL=page.js.map