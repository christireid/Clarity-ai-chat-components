import type { Meta, StoryObj } from '@storybook/react'
import { ThinkingIndicator } from '@clarity-chat/react'
import type { ThinkingStage } from '@clarity-chat/types'

const meta: Meta<typeof ThinkingIndicator> = {
  title: 'Components/ThinkingIndicator',
  component: ThinkingIndicator,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Animated thinking indicator showing AI processing stages.',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ThinkingIndicator>

export const Thinking: Story = {
  args: {
    stage: 'thinking',
  },
}

export const Researching: Story = {
  args: {
    stage: 'researching',
    topic: 'React hooks documentation',
  },
}

export const Compiling: Story = {
  args: {
    stage: 'compiling',
    detail: 'Analyzing code patterns',
  },
}

export const Generating: Story = {
  args: {
    stage: 'generating',
    progress: 65,
  },
}

export const Finalizing: Story = {
  args: {
    stage: 'finalizing',
    progress: 95,
    estimatedTime: 5,
  },
}

export const WithAllDetails: Story = {
  args: {
    stage: 'generating',
    topic: 'Comprehensive React Tutorial',
    detail: 'Creating detailed examples with code',
    progress: 50,
    estimatedTime: 15,
  },
}
