import type { Meta, StoryObj } from '@storybook/react-vite'
import { AgentRunFeed } from '@clarity-chat/react'
import type { AgentRunStep } from '@clarity-chat/react'

const meta: Meta<typeof AgentRunFeed> = {
  title: 'Advanced/AI/AgentRunFeed',
  component: AgentRunFeed,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Visual feed showing agent execution steps, tool invocations, and their status. Useful for debugging and understanding agent workflows.',
      },
    },
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof AgentRunFeed>

const mockSteps: AgentRunStep[] = [
  {
    id: '1',
    title: 'Advanced/AI/AgentRunFeed',
    detail: 'Parsing intent and extracting key information',
    status: 'succeeded',
    startedAt: new Date(Date.now() - 5000),
    completedAt: new Date(Date.now() - 4500),
    outputPreview: 'Intent: code_explanation, Topic: React hooks',
  },
  {
    id: '2',
    title: 'Advanced/AI/AgentRunFeed',
    tool: 'vector_search',
    status: 'succeeded',
    startedAt: new Date(Date.now() - 4500),
    completedAt: new Date(Date.now() - 4000),
    outputPreview: 'Found 3 relevant documents',
  },
  {
    id: '3',
    title: 'Advanced/AI/AgentRunFeed',
    detail: 'Creating comprehensive explanation',
    status: 'running',
    startedAt: new Date(Date.now() - 3000),
  },
]

export const Default: Story = {
  args: {
    steps: mockSteps,
  },
}

export const AllStatuses: Story = {
  args: {
    steps: [
      {
        id: '1',
        title: 'Advanced/AI/AgentRunFeed',
        status: 'pending',
        startedAt: new Date(),
      },
      {
        id: '2',
        title: 'Advanced/AI/AgentRunFeed',
        status: 'running',
        tool: 'code_executor',
        startedAt: new Date(Date.now() - 2000),
      },
      {
        id: '3',
        title: 'Advanced/AI/AgentRunFeed',
        status: 'succeeded',
        tool: 'web_search',
        startedAt: new Date(Date.now() - 5000),
        completedAt: new Date(Date.now() - 4000),
        outputPreview: 'Successfully completed',
      },
      {
        id: '4',
        title: 'Advanced/AI/AgentRunFeed',
        status: 'failed',
        tool: 'api_call',
        startedAt: new Date(Date.now() - 10000),
        completedAt: new Date(Date.now() - 9500),
        outputPreview: 'Error: Connection timeout',
      },
    ],
  },
}

export const WithRetry: Story = {
  args: {
    steps: mockSteps,
    onRetry: (step) => {
      console.log('Retrying step:', step.id)
      alert(`Retrying: ${step.title}`)
    },
  },
}

export const WithLogs: Story = {
  args: {
    steps: mockSteps,
    onOpenLogs: (step) => {
      console.log('Opening logs for step:', step.id)
      alert(`Logs for: ${step.title}`)
    },
  },
}

export const CustomTitle: Story = {
  args: {
    steps: mockSteps,
    title: 'Advanced/AI/AgentRunFeed',
    subtitle: 'Advanced/AI/AgentRunFeed',
  },
}

export const LongList: Story = {
  args: {
    steps: Array.from({ length: 15 }, (_, i) => ({
      id: `step-${i}`,
      title: `Step ${i + 1}`,
      detail: `Processing step ${i + 1}`,
      status: i < 10 ? 'succeeded' : i === 10 ? 'running' : 'pending',
      tool: i % 3 === 0 ? 'tool_a' : i % 3 === 1 ? 'tool_b' : undefined,
      startedAt: new Date(Date.now() - (15 - i) * 1000),
      completedAt: i < 10 ? new Date(Date.now() - (15 - i) * 500) : undefined,
      outputPreview: i < 10 ? `Output ${i + 1}` : undefined,
    })),
  },
}
