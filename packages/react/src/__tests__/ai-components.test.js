import { jsx as _jsx } from "react/jsx-runtime";
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { FollowUpSuggestions, PersonaPanel, ConversationTimeline, MemoryInspector, SafetyStatusCard, ResponseQualityMeter, MultiModalPreview, AgentRunFeed, SessionSummaryCard, WorkflowSuggestionList, PromptTestHarness, EvaluationDashboard, SafetyReviewConsole, AuthTenantDashboard, ApiTokenManager, SSOConfigWizard, SeatInviteDialog, } from '@clarity-chat/react';
describe('AI experience components', () => {
    it('renders follow-up suggestions and calls onSelect', () => {
        const handleSelect = vi.fn();
        render(_jsx(FollowUpSuggestions, { suggestions: [{ id: '1', title: 'Summarise conversation' }], onSelect: handleSelect }));
        fireEvent.click(screen.getByRole('button', { name: /summarise conversation/i }));
        expect(handleSelect).toHaveBeenCalled();
    });
    it('highlights active persona', () => {
        render(_jsx(PersonaPanel, { personas: [
                {
                    id: '1',
                    name: 'Researcher',
                    role: 'researcher',
                    summary: 'Finds docs',
                    expertise: [],
                },
                {
                    id: '2',
                    name: 'Mentor',
                    role: 'coach',
                    summary: 'Coaches writing',
                    expertise: [],
                },
            ], activePersonaId: "2" }));
        expect(screen.getByText(/mentor/i)).toBeInTheDocument();
        expect(screen.getByText(/active/i)).toBeInTheDocument();
    });
    it('renders conversation timeline events in order', () => {
        render(_jsx(ConversationTimeline, { events: [
                {
                    id: '1',
                    type: 'user',
                    title: 'User question',
                    timestamp: new Date('2024-01-01T10:00:00Z'),
                },
                {
                    id: '2',
                    type: 'assistant',
                    title: 'Assistant reply',
                    timestamp: new Date('2024-01-01T10:01:00Z'),
                },
            ] }));
        expect(screen.getByText(/user question/i)).toBeInTheDocument();
        expect(screen.getByText(/assistant reply/i)).toBeInTheDocument();
    });
    it('renders memory inspector with grouped scopes', () => {
        render(_jsx(MemoryInspector, { memories: [
                {
                    id: 'm1',
                    label: 'Project',
                    value: 'Phoenix',
                    scope: 'thread',
                    lastUpdated: new Date(),
                },
            ] }));
        expect(screen.getByText(/phoenix/i)).toBeInTheDocument();
        expect(screen.getByText(/current thread/i)).toBeInTheDocument();
    });
    it('shows safety status badges', () => {
        render(_jsx(SafetyStatusCard, { checks: [{ id: 'check', label: 'Policy', status: 'warn' }], lastReviewedAt: new Date() }));
        expect(screen.getByText(/policy/i)).toBeInTheDocument();
        expect(screen.getAllByText(/review/i).length).toBeGreaterThan(0);
    });
    it('renders response quality metrics', () => {
        render(_jsx(ResponseQualityMeter, { overallScore: 0.8, metrics: [{ id: 'grounded', label: 'Groundedness', score: 0.9 }] }));
        expect(screen.getByText(/groundedness/i)).toBeInTheDocument();
        expect(screen.getByText(/80%/i)).toBeInTheDocument();
    });
    it('renders multimodal attachments', () => {
        render(_jsx(MultiModalPreview, { attachments: [{ id: 'img', type: 'image', title: 'Screenshot' }] }));
        expect(screen.getByText(/screenshot/i)).toBeInTheDocument();
    });
    it('renders agent run feed with actions', () => {
        const handleRetry = vi.fn();
        render(_jsx(AgentRunFeed, { steps: [
                {
                    id: 'step',
                    title: 'Search KB',
                    status: 'failed',
                    startedAt: new Date(),
                    completedAt: new Date(),
                },
            ], onRetry: handleRetry }));
        fireEvent.click(screen.getByRole('button', { name: /retry step/i }));
        expect(handleRetry).toHaveBeenCalled();
    });
    it('renders session summary and actions', () => {
        const handleAction = vi.fn();
        render(_jsx(SessionSummaryCard, { summary: {
                title: 'Recap',
                highlights: ['Key point'],
                nextActions: ['Send follow-up'],
            }, metrics: [{ label: 'Messages', value: '12' }], onAction: handleAction }));
        fireEvent.click(screen.getByRole('button', { name: /send follow-up/i }));
        expect(handleAction).toHaveBeenCalled();
    });
    it('renders workflow suggestion list', () => {
        const handleSelect = vi.fn();
        render(_jsx(WorkflowSuggestionList, { workflows: [
                {
                    id: 'wf',
                    name: 'Troubleshooting handoff',
                    description: 'Escalate conversation to support agent',
                    steps: ['Summarise issue'],
                },
            ], onSelect: handleSelect }));
        fireEvent.click(screen.getByRole('button', { name: /start workflow/i }));
        expect(handleSelect).toHaveBeenCalled();
    });
    it('renders prompt test harness and triggers run all', () => {
        const handleRunAll = vi.fn();
        render(_jsx(PromptTestHarness, { variants: [{ id: 'control', label: 'Control' }], tests: [{ id: 't1', input: 'Hello', status: 'pending' }], onRunAll: handleRunAll }));
        fireEvent.click(screen.getByRole('button', { name: /run all variants/i }));
        expect(handleRunAll).toHaveBeenCalled();
    });
    it('renders evaluation dashboard metrics and sparklines', () => {
        render(_jsx(EvaluationDashboard, { metrics: [
                {
                    id: 'latency',
                    label: 'Latency',
                    value: '1.8s',
                    trend: 'up',
                    change: '+0.3s',
                },
            ], sparklines: [
                { id: 'cost', label: 'Cost per 1K tokens', percentage: 72 },
            ] }));
        expect(screen.getByText(/latency/i)).toBeInTheDocument();
        expect(screen.getByText('1.8s')).toBeInTheDocument();
        expect(screen.getByText(/cost per 1k tokens/i)).toBeInTheDocument();
    });
    it('renders safety review console and handles redact click', () => {
        const handleRedact = vi.fn();
        render(_jsx(SafetyReviewConsole, { content: "Sensitive value: 123", highlights: [
                {
                    id: 'h1',
                    start: 18,
                    end: 21,
                    category: 'PII',
                    severity: 'high',
                },
            ], onRedact: handleRedact }));
        fireEvent.click(screen.getByText('123'));
        expect(handleRedact).toHaveBeenCalled();
    });
    it('renders auth tenant dashboard with usage', () => {
        render(_jsx(AuthTenantDashboard, { organizationName: "Phoenix Labs", planName: "Enterprise", seatUsage: { label: 'Seats', used: 5, total: 10 } }));
        expect(screen.getByText(/Phoenix Labs/)).toBeInTheDocument();
        expect(screen.getByText(/5\/10/)).toBeInTheDocument();
    });
    it('renders API token manager and shows revoke confirmation', () => {
        const handleRevoke = vi.fn();
        render(_jsx(ApiTokenManager, { tokens: [
                {
                    id: 'token',
                    label: 'Backend',
                    createdAt: 'Apr 1',
                    lastUsed: 'today',
                    scopes: ['chat:read'],
                    status: 'active',
                },
            ], onRevoke: handleRevoke }));
        // Click revoke button - this should open confirmation dialog
        fireEvent.click(screen.getByRole('button', { name: /revoke/i }));
        // The dialog should now be open
        expect(screen.getByText(/revoke api token/i)).toBeInTheDocument();
        // Click confirm button in dialog
        const confirmButton = screen.getAllByRole('button', {
            name: /revoke token/i,
        })[0];
        fireEvent.click(confirmButton);
        expect(handleRevoke).toHaveBeenCalled();
    });
    it('submits SSO configuration wizard', () => {
        const handleSubmit = vi.fn();
        render(_jsx(SSOConfigWizard, { steps: [
                {
                    id: '1',
                    title: 'Download metadata',
                    description: 'Copy ACS URL',
                    status: 'complete',
                },
            ], onSubmit: handleSubmit }));
        fireEvent.click(screen.getByRole('button', { name: /save configuration/i }));
        expect(handleSubmit).toHaveBeenCalled();
    });
    it('renders seat invite dialog trigger button', () => {
        render(_jsx(SeatInviteDialog, {}));
        expect(screen.getByRole('button', { name: /invite teammate/i })).toBeInTheDocument();
    });
});
//# sourceMappingURL=ai-components.test.js.map