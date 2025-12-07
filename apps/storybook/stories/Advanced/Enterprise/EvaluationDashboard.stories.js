import { jsx as _jsx } from "react/jsx-runtime";
import { EvaluationDashboard } from '@clarity-chat/react';
const meta = {
    title: 'Advanced/Enterprise/EvaluationDashboard',
    component: EvaluationDashboard,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Dashboard for evaluating AI model performance with metrics, sparklines, and quality indicators.',
            },
        },
    },
    tags: ['autodocs'],
    decorators: [
        (Story) => (_jsx("div", { className: "w-full max-w-6xl", children: _jsx(Story, {}) })),
    ],
};
export default meta;
const sampleMetrics = [
    {
        id: '1',
        label: 'Accuracy',
        value: '94.2%',
        trend: 'up',
        change: '+2.1%',
    },
    {
        id: '2',
        label: 'Latency',
        value: '1.2s',
        trend: 'down',
        change: '-0.3s',
    },
    {
        id: '3',
        label: 'Throughput',
        value: '1.2k',
        trend: 'up',
        change: '+150',
    },
    {
        id: '4',
        label: 'Error Rate',
        value: '0.8%',
        trend: 'flat',
        change: '0%',
    },
];
const sampleSparklines = [
    { id: '1', label: 'Relevance', percentage: 92, objective: 90 },
    { id: '2', label: 'Coherence', percentage: 88, objective: 85 },
    { id: '3', label: 'Helpfulness', percentage: 95, objective: 90 },
    { id: '4', label: 'Safety', percentage: 98, objective: 95 },
];
const sampleQuality = {
    overall: 92,
    dimensions: [
        { label: 'Relevance', score: 94 },
        { label: 'Coherence', score: 90 },
        { label: 'Helpfulness', score: 93 },
        { label: 'Safety', score: 91 },
    ],
};
export const Default = {
    args: {
        metrics: sampleMetrics,
        sparklines: sampleSparklines,
        quality: sampleQuality,
    },
};
export const MetricsOnly = {
    args: {
        metrics: sampleMetrics,
    },
};
export const WithSparklines = {
    args: {
        metrics: sampleMetrics,
        sparklines: sampleSparklines,
    },
};
export const WithQuality = {
    args: {
        metrics: sampleMetrics,
        quality: sampleQuality,
    },
};
export const Minimal = {
    args: {
        metrics: [
            {
                id: '1',
                label: 'Score',
                value: '85%',
            },
        ],
    },
};
//# sourceMappingURL=EvaluationDashboard.stories.js.map