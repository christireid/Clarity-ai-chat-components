import { SessionSummaryCard } from '@clarity-chat/react';
const meta = {
    title: 'Components/Feedback/SessionSummaryCard',
    component: SessionSummaryCard,
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: 'Card displaying session summary with highlights, metrics, and actionable next steps. Perfect for conversation summaries and session recaps.',
            },
        },
        layout: 'padded',
    },
};
export default meta;
const mockSummary = {
    title: 'Components/Feedback/SessionSummaryCard',
    highlights: [
        'Discussed React hooks and best practices',
        'Explored useState and useEffect patterns',
        'Reviewed code examples and patterns',
    ],
    nextActions: [
        'Review the code examples shared',
        'Try implementing a custom hook',
        'Explore advanced React patterns',
    ],
};
const mockMetrics = [
    {
        label: 'Messages',
        value: '24',
        trend: 'up',
    },
    {
        label: 'Duration',
        value: '15 min',
        trend: 'steady',
    },
    {
        label: 'Topics Covered',
        value: '5',
        trend: 'up',
    },
];
export const Default = {
    args: {
        summary: mockSummary,
        metrics: mockMetrics,
    },
};
export const WithActions = {
    args: {
        summary: mockSummary,
        metrics: mockMetrics,
        onAction: (action) => {
            console.log('Action selected:', action);
            alert(`Selected: ${action}`);
        },
        onExport: () => {
            console.log('Exporting session');
            alert('Exporting session summary...');
        },
    },
};
export const EmptyMetrics = {
    args: {
        summary: mockSummary,
        metrics: [],
    },
};
export const CustomTitle = {
    args: {
        summary: mockSummary,
        metrics: mockMetrics,
        title: 'Components/Feedback/SessionSummaryCard',
        subtitle: 'Components/Feedback/SessionSummaryCard',
    },
};
export const ManyHighlights = {
    args: {
        summary: {
            title: 'Components/Feedback/SessionSummaryCard',
            highlights: Array.from({ length: 10 }, (_, i) => `Highlight ${i + 1}: Important point about topic ${i + 1}`),
            nextActions: ['Action 1', 'Action 2', 'Action 3'],
        },
        metrics: mockMetrics,
    },
};
//# sourceMappingURL=SessionSummaryCard.stories.js.map