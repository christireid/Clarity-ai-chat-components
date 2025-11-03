import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
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
} from '@clarity-chat/react'
import { SparklesIcon } from '@clarity-chat/react/components/icons'

const meta = {
  title: 'AI Experience/New Components',
  parameters: {
    layout: 'centered',
    controls: { expanded: true },
  },
} satisfies Meta

export default meta

const eventTimestamp = (offsetMinutes: number) => new Date(Date.now() - offsetMinutes * 60_000)

export const FollowUp: StoryObj = {
  render: () => (
    <div className="w-full max-w-3xl">
      <FollowUpSuggestions
        suggestions={[
          {
            id: '1',
            title: 'Summarise this thread for executives',
            description: 'Condense the latest updates into three bullet points.',
            keywords: ['summary', 'executive'],
            confidence: 0.84,
            icon: <SparklesIcon size={16} />,
          },
          {
            id: '2',
            title: 'Extract unanswered questions',
            description: 'Highlight gaps in context that we should clarify next.',
            keywords: ['gaps', 'follow-up'],
            confidence: 0.61,
          },
        ]}
        onSelect={(suggestion) => alert(`Selected: ${suggestion.title}`)}
      />
    </div>
  ),
}

export const Personas: StoryObj = {
  render: () => (
    <div className="w-full max-w-3xl">
      <PersonaPanel
        personas={[
          {
            id: 'analyst',
            name: 'Insight Analyst',
            role: 'researcher',
            summary: 'Scans knowledge bases and cites evidence for each claim.',
            expertise: ['Knowledge base', 'Citation'],
            temperature: 0.2,
            tags: ['grounded', 'deterministic'],
          },
          {
            id: 'mentor',
            name: 'Creative Mentor',
            role: 'coach',
            summary: 'Encourages brainstorming and provides writing feedback.',
            expertise: ['Ideation', 'Copywriting'],
            temperature: 0.8,
            tags: ['creative', 'supportive'],
          },
        ]}
        activePersonaId="analyst"
        onSelect={(persona) => alert(`Switched to ${persona.name}`)}
      />
    </div>
  ),
}

export const Timeline: StoryObj = {
  render: () => (
    <div className="w-full max-w-3xl">
      <ConversationTimeline
        events={[
          {
            id: 'event-1',
            type: 'user',
            title: 'User asked for marketing copy',
            timestamp: eventTimestamp(25),
            summary: 'Requested a launch announcement for the Phoenix project.',
          },
          {
            id: 'event-2',
            type: 'assistant',
            title: 'Assistant proposed outline',
            timestamp: eventTimestamp(20),
            summary: 'Shared three-section outline for the announcement and asked for feedback.',
            status: 'complete',
          },
          {
            id: 'event-3',
            type: 'tool',
            title: 'Brand tone retrieval',
            timestamp: eventTimestamp(15),
            summary: 'Fetched tone-of-voice guidelines from knowledge base.',
            metadata: [{ label: 'Confidence', value: '0.92' }],
            status: 'complete',
          },
          {
            id: 'event-4',
            type: 'assistant',
            title: 'Drafted final copy',
            timestamp: eventTimestamp(5),
            summary: 'Delivered long-form response with variant headlines.',
            status: 'complete',
          },
        ]}
      />
    </div>
  ),
}

export const Memory: StoryObj = {
  render: () => (
    <div className="w-full max-w-3xl">
      <MemoryInspector
        memories={[
          {
            id: 'm1',
            label: 'Launch codename',
            value: 'Project Phoenix – do not mention publicly until 12/12',
            scope: 'thread',
            lastUpdated: eventTimestamp(30),
            confidence: 0.82,
            tokens: 18,
            source: 'User message',
          },
          {
            id: 'm2',
            label: 'Target audience',
            value: 'Enterprise IT leaders evaluating modernisation vendors',
            scope: 'global',
            lastUpdated: eventTimestamp(120),
            confidence: 0.92,
            tokens: 14,
            source: 'Manual pin',
          },
        ]}
        onRemove={(memory) => alert(`Removed ${memory.label}`)}
        onPromote={(memory) => alert(`Promoted ${memory.label}`)}
      />
    </div>
  ),
}

export const Safety: StoryObj = {
  render: () => (
    <div className="w-full max-w-3xl">
      <SafetyStatusCard
        checks={[
          {
            id: 's1',
            label: 'Hallucination detector',
            status: 'pass',
            detail: 'No ungrounded claims detected in citations.',
          },
          {
            id: 's2',
            label: 'Safety policy',
            status: 'warn',
            detail: 'Mentions embargoed launch. Ensure internal recipients only.',
            remediation: 'Redact embargo details or confirm distribution list is private.',
          },
        ]}
        lastReviewedAt={eventTimestamp(2)}
        onReviewPolicy={() => alert('Open policy docs')}
      />
    </div>
  ),
}

export const QualityMeter: StoryObj = {
  render: () => (
    <div className="w-full max-w-3xl">
      <ResponseQualityMeter
        overallScore={0.78}
        metrics={[
          {
            id: 'grounded',
            label: 'Groundedness',
            score: 0.92,
            description: 'Evidence-backed statements with proper citations.',
          },
          {
            id: 'coverage',
            label: 'Goal coverage',
            score: 0.74,
            target: 0.8,
            description: 'Addresses each user goal identified in the prompt.',
          },
          {
            id: 'tone',
            label: 'Tone alignment',
            score: 0.66,
            target: 0.9,
            description: 'Matches the Phoenix launch brand voice.',
          },
        ]}
      />
    </div>
  ),
}

export const MultiModal: StoryObj = {
  render: () => (
    <div className="w-full max-w-3xl">
      <MultiModalPreview
        attachments={[
          {
            id: 'img-1',
            type: 'image',
            title: 'Launch hero concept',
            description: 'Concept art mock shared by product marketing.',
            thumbnailUrl: 'https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=160&q=80',
            status: 'ready',
            metadata: [{ label: 'Source', value: 'Assets drive' }],
          },
          {
            id: 'audio-1',
            type: 'audio',
            title: 'Customer testimonial clip',
            description: '60s clip summarising ROI results.',
            durationMs: 60000,
            sizeLabel: '3.2 MB',
            status: 'processing',
          },
        ]}
        onOpen={(attachment) => alert(`Open ${attachment.title}`)}
      />
    </div>
  ),
}

export const AgentFeed: StoryObj = {
  render: () => (
    <div className="w-full max-w-3xl">
      <AgentRunFeed
        steps={[
          {
            id: 'step-1',
            title: 'Search knowledge base',
            status: 'succeeded',
            tool: 'vector-search',
            startedAt: eventTimestamp(10),
            completedAt: eventTimestamp(9.5),
            detail: 'Retrieved top 5 passages matching Phoenix launch query.',
            outputPreview: 'Found product overview and embargo note.',
          },
          {
            id: 'step-2',
            title: 'Summarise findings',
            status: 'succeeded',
            tool: 'summariser',
            startedAt: eventTimestamp(9),
            completedAt: eventTimestamp(8.5),
            detail: 'Condensed passages into bullet summary for copywriting.',
          },
          {
            id: 'step-3',
            title: 'Generate copy draft',
            status: 'failed',
            tool: 'gpt-4',
            startedAt: eventTimestamp(8),
            completedAt: eventTimestamp(7.8),
            detail: 'Request exceeded safety filter due to embargo mention.',
            outputPreview: 'Blocked: “Phoenix goes public on Dec 12th.”',
          },
        ]}
        onRetry={(step) => alert(`Retry ${step.title}`)}
      />
    </div>
  ),
}

export const SessionSummary: StoryObj = {
  render: () => (
    <div className="w-full max-w-3xl">
      <SessionSummaryCard
        summary={{
          title: 'Phoenix launch prep',
          highlights: [
            'Aligned on target persona and product value props.',
            'Gathered three testimonial snippets to weave into copy.',
            'Identified open question about pricing tier availability.',
          ],
          nextActions: ['Draft final announcement', 'Confirm embargo policy', 'Route to legal review'],
        }}
        metrics={[
          { label: 'Messages exchanged', value: '18', trend: 'up' },
          { label: 'Avg. response latency', value: '2.3s', trend: 'steady' },
          { label: 'Citations referenced', value: '5', trend: 'up' },
          { label: 'Action items captured', value: '3', trend: 'up' },
        ]}
      />
    </div>
  ),
}

export const WorkflowList: StoryObj = {
  render: () => (
    <div className="w-full max-w-3xl">
      <WorkflowSuggestionList
        workflows={[
          {
            id: 'wf-brief',
            name: 'Create campaign brief',
            description: 'Compile background, goals, and deliverables into a single creative brief.',
            estimatedTime: '~8 minutes',
            audience: 'Marketing',
            steps: [
              'Collect campaign objectives and KPIs',
              'Summarise audience research findings',
              'Draft deliverables list with owners and due dates',
            ],
            tags: ['marketing', 'planning'],
          },
          {
            id: 'wf-hand-off',
            name: 'AI hand-off to support team',
            description: 'Export chat summary plus key action items for human follow-up.',
            estimatedTime: '~3 minutes',
            audience: 'Customer success',
            steps: [
              'Summarise user goals and blockers',
              'Highlight relevant troubleshooting history',
              'Generate recommended follow-up email draft',
            ],
            tags: ['support', 'handoff'],
          },
        ]}
        onSelect={(workflow) => alert(`Start: ${workflow.name}`)}
      />
    </div>
  ),
}

