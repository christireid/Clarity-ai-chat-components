import { jsx as _jsx } from "react/jsx-runtime";
import { SafetyReviewConsole } from '@clarity-chat/react';
const meta = {
    title: 'Advanced/Enterprise/SafetyReviewConsole',
    component: SafetyReviewConsole,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Console for reviewing and managing safety highlights in AI-generated content.',
            },
        },
    },
    tags: ['autodocs'],
    decorators: [
        (Story) => (_jsx("div", { className: "w-full max-w-4xl", children: _jsx(Story, {}) })),
    ],
};
export default meta;
const sampleContent = 'This is a sample message that contains some potentially sensitive information. The system has identified several areas that may need review before approval. Please review the highlighted sections carefully.';
const sampleHighlights = [
    {
        id: '1',
        start: 50,
        end: 80,
        category: 'PII',
        severity: 'high',
        suggestion: 'Consider redacting personal information',
    },
    {
        id: '2',
        start: 120,
        end: 150,
        category: 'Content',
        severity: 'medium',
        suggestion: 'Review for appropriateness',
    },
    {
        id: '3',
        start: 180,
        end: 210,
        category: 'Safety',
        severity: 'low',
        suggestion: 'Verify accuracy',
    },
];
export const Default = {
    args: {
        content: sampleContent,
        highlights: sampleHighlights,
    },
};
export const WithCallbacks = {
    args: {
        content: sampleContent,
        highlights: sampleHighlights,
        onRedact: (highlight) => {
            console.log('Redact highlight:', highlight);
            alert(`Redacting: ${highlight.category} (${highlight.severity})`);
        },
        onApprove: () => {
            console.log('Approved');
            alert('Content approved');
        },
        onReject: () => {
            console.log('Rejected');
            alert('Content rejected');
        },
    },
};
export const NoHighlights = {
    args: {
        content: 'This is clean content with no safety concerns.',
        highlights: [],
    },
};
export const HighSeverityOnly = {
    args: {
        content: sampleContent,
        highlights: sampleHighlights.filter((h) => h.severity === 'high'),
    },
};
export const LongContent = {
    args: {
        content: Array(10)
            .fill('This is a longer piece of content that contains multiple safety highlights. The system will identify and mark various sections that require review. Each highlight can be individually addressed or redacted as needed.')
            .join(' '),
        highlights: Array.from({ length: 5 }, (_, i) => ({
            id: `highlight-${i}`,
            start: i * 100,
            end: i * 100 + 50,
            category: ['PII', 'Content', 'Safety', 'Bias', 'Accuracy'][i % 5],
            severity: ['high', 'medium', 'low'][i % 3],
            suggestion: `Review ${['PII', 'Content', 'Safety', 'Bias', 'Accuracy'][i % 5]}`,
        })),
    },
};
//# sourceMappingURL=SafetyReviewConsole.stories.js.map