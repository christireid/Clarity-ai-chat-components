import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import {
  FollowUpSuggestions,
  PersonaPanel,
  ConversationTimeline,
  MemoryInspector,
  SafetyStatusCard,
  ResponseQualityMeter,
  MultiModalPreview,
  AgentRunFeed,
  SessionSummaryCard,
  WorkflowSuggestionList,
  PromptTestHarness,
  EvaluationDashboard,
  SafetyReviewConsole,
} from '@clarity-chat/react'

describe('AI experience components', () => {
  it('renders follow-up suggestions and calls onSelect', () => {
    const handleSelect = vi.fn()
    render(
      <FollowUpSuggestions
        suggestions={[{ id: '1', title: 'Summarise conversation' }]}
        onSelect={handleSelect}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: /summarise conversation/i }))
    expect(handleSelect).toHaveBeenCalled()
  })

  it('highlights active persona', () => {
    render(
      <PersonaPanel
        personas={[
          { id: '1', name: 'Researcher', role: 'researcher', summary: 'Finds docs', expertise: [] },
          { id: '2', name: 'Mentor', role: 'coach', summary: 'Coaches writing', expertise: [] },
        ]}
        activePersonaId="2"
      />
    )

    expect(screen.getByText(/mentor/i)).toBeInTheDocument()
    expect(screen.getByText(/active/i)).toBeInTheDocument()
  })

  it('renders conversation timeline events in order', () => {
    render(
      <ConversationTimeline
        events={[
          { id: '1', type: 'user', title: 'User question', timestamp: new Date('2024-01-01T10:00:00Z') },
          { id: '2', type: 'assistant', title: 'Assistant reply', timestamp: new Date('2024-01-01T10:01:00Z') },
        ]}
      />
    )

    expect(screen.getByText(/user question/i)).toBeInTheDocument()
    expect(screen.getByText(/assistant reply/i)).toBeInTheDocument()
  })

  it('renders memory inspector with grouped scopes', () => {
    render(
      <MemoryInspector
        memories={[{
          id: 'm1',
          label: 'Project',
          value: 'Phoenix',
          scope: 'thread',
          lastUpdated: new Date(),
        }]}
      />
    )

    expect(screen.getByText(/phoenix/i)).toBeInTheDocument()
    expect(screen.getByText(/current thread/i)).toBeInTheDocument()
  })

  it('shows safety status badges', () => {
    render(
      <SafetyStatusCard
        checks={[{ id: 'check', label: 'Policy', status: 'warn' }]}
        lastReviewedAt={new Date()}
      />
    )

    expect(screen.getByText(/policy/i)).toBeInTheDocument()
    expect(screen.getAllByText(/review/i).length).toBeGreaterThan(0)
  })

  it('renders response quality metrics', () => {
    render(
      <ResponseQualityMeter
        overallScore={0.8}
        metrics={[{ id: 'grounded', label: 'Groundedness', score: 0.9 }]}
      />
    )

    expect(screen.getByText(/groundedness/i)).toBeInTheDocument()
    expect(screen.getByText(/80%/i)).toBeInTheDocument()
  })

  it('renders multimodal attachments', () => {
    render(
      <MultiModalPreview
        attachments={[{ id: 'img', type: 'image', title: 'Screenshot' }]}
      />
    )

    expect(screen.getByText(/screenshot/i)).toBeInTheDocument()
  })

  it('renders agent run feed with actions', () => {
    const handleRetry = vi.fn()
    render(
      <AgentRunFeed
        steps={[{
          id: 'step',
          title: 'Search KB',
          status: 'failed',
          startedAt: new Date(),
          completedAt: new Date(),
        }]}
        onRetry={handleRetry}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: /retry step/i }))
    expect(handleRetry).toHaveBeenCalled()
  })

  it('renders session summary and actions', () => {
    const handleAction = vi.fn()
    render(
      <SessionSummaryCard
        summary={{
          title: 'Recap',
          highlights: ['Key point'],
          nextActions: ['Send follow-up'],
        }}
        metrics={[{ label: 'Messages', value: '12' }]}
        onAction={handleAction}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: /send follow-up/i }))
    expect(handleAction).toHaveBeenCalled()
  })

  it('renders workflow suggestion list', () => {
    const handleSelect = vi.fn()
    render(
      <WorkflowSuggestionList
        workflows={[{
          id: 'wf',
          name: 'Troubleshooting handoff',
          description: 'Escalate conversation to support agent',
          steps: ['Summarise issue'],
        }]}
        onSelect={handleSelect}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: /start workflow/i }))
    expect(handleSelect).toHaveBeenCalled()
  })

  it('renders prompt test harness and triggers run all', () => {
    const handleRunAll = vi.fn()
    render(
      <PromptTestHarness
        variants={[{ id: 'control', label: 'Control' }]}
        tests={[{ id: 't1', input: 'Hello', status: 'pending' }]}
        onRunAll={handleRunAll}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: /run all variants/i }))
    expect(handleRunAll).toHaveBeenCalled()
  })

  it('renders evaluation dashboard metrics and sparklines', () => {
    render(
      <EvaluationDashboard
        metrics={[{ id: 'latency', label: 'Latency', value: '1.8s', trend: 'up', change: '+0.3s' }]}
        sparklines={[{ id: 'cost', label: 'Cost per 1K tokens', percentage: 72 }]}
      />
    )

    expect(screen.getByText(/latency/i)).toBeInTheDocument()
    expect(screen.getByText('1.8s')).toBeInTheDocument()
    expect(screen.getByText(/cost per 1k tokens/i)).toBeInTheDocument()
  })

  it('renders safety review console and handles redact click', () => {
    const handleRedact = vi.fn()
    render(
      <SafetyReviewConsole
        content="Sensitive value: 123"
        highlights={[{
          id: 'h1',
          start: 18,
          end: 21,
          category: 'PII',
          severity: 'high',
        }]}
        onRedact={handleRedact}
      />
    )

    fireEvent.click(screen.getByText('123'))
    expect(handleRedact).toHaveBeenCalled()
  })
})

