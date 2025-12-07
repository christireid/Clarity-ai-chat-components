import { SafetyStatusCard } from '@clarity-chat/react';
const meta = {
    title: 'Components/Feedback/SafetyStatusCard',
    component: SafetyStatusCard,
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: 'Monitor policy checks on model responses. Display safety guardrails status with pass, warn, and fail states.',
            },
        },
        layout: 'padded',
    },
};
export default meta;
const mockChecks = [
    {
        id: '1',
        label: 'Toxicity',
        status: 'pass',
        detail: 'No toxic content detected',
    },
    {
        id: '2',
        label: 'Violence',
        status: 'pass',
        detail: 'No violent content detected',
    },
    {
        id: '3',
        label: 'Privacy',
        status: 'warn',
        detail: 'Potential PII detected',
        remediation: 'Review before sending',
    },
];
export const Default = {
    args: {
        checks: mockChecks,
    },
};
export const AllPass = {
    args: {
        checks: [
            {
                id: '1',
                label: 'Toxicity',
                status: 'pass',
            },
            {
                id: '2',
                label: 'Violence',
                status: 'pass',
            },
            {
                id: '3',
                label: 'Privacy',
                status: 'pass',
            },
        ],
    },
};
export const WithWarnings = {
    args: {
        checks: [
            {
                id: '1',
                label: 'Toxicity',
                status: 'pass',
            },
            {
                id: '2',
                label: 'Violence',
                status: 'warn',
                detail: 'Contains potentially violent language',
                remediation: 'Review content',
            },
            {
                id: '3',
                label: 'Privacy',
                status: 'warn',
                detail: 'Possible personal information',
                remediation: 'Verify before sharing',
            },
        ],
    },
};
export const WithFailures = {
    args: {
        checks: [
            {
                id: '1',
                label: 'Toxicity',
                status: 'fail',
                detail: 'High toxicity score detected',
                remediation: 'Block message',
            },
            {
                id: '2',
                label: 'Violence',
                status: 'pass',
            },
            {
                id: '3',
                label: 'Privacy',
                status: 'warn',
                detail: 'Possible PII',
            },
        ],
    },
};
export const WithActions = {
    args: {
        checks: mockChecks,
        lastReviewedAt: new Date(),
        onReviewPolicy: () => {
            console.log('Reviewing policy');
            alert('Opening policy review...');
        },
        onAcknowledge: (check) => {
            console.log('Acknowledging check:', check.id);
            alert(`Acknowledged: ${check.label}`);
        },
    },
};
export const CustomTitle = {
    args: {
        checks: mockChecks,
        title: 'Components/Feedback/SafetyStatusCard',
        subtitle: 'Components/Feedback/SafetyStatusCard',
    },
};
//# sourceMappingURL=SafetyStatusCard.stories.js.map