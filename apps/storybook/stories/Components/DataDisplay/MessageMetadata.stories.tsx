import type { Meta, StoryObj } from '@storybook/react-vite'
import { MessageMetadata } from '@clarity-chat/react'
import type { Message } from '@clarity-chat/types'

/**
 * **MessageMetadata Component**
 *
 * Component for displaying message metadata including tokens,
 * cost, response time, model, confidence, and sources.
 *
 * **Key Features:**
 * - Token usage display (input/output)
 * - Cost calculation
 * - Response time tracking
 * - Model information
 * - Confidence scores
 * - Source citations
 * - Expandable details
 * - Accessible with ARIA labels
 *
 * **Use Cases:**
 * - Token usage tracking
 * - Cost monitoring
 * - Performance metrics
 * - Model information display
 * - Source attribution
 */
const meta: Meta<typeof MessageMetadata> = {
  title: 'Components/DataDisplay/MessageMetadata',
  component: MessageMetadata,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Component for displaying message metadata including tokens,
cost, response time, model, confidence, and sources.

## Features

- ✅ Token usage display (input/output)
- ✅ Cost calculation
- ✅ Response time tracking
- ✅ Model information
- ✅ Confidence scores
- ✅ Source citations
- ✅ Expandable details
- ✅ Accessible with ARIA labels
- ✅ Visual indicators for metrics

## Basic Usage

\`\`\`tsx
<MessageMetadata
  message={messageWithMetadata}
  showDetails={true}
  showSources={true}
/>
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    message: {
      description: 'Message object with metadata',
      control: { type: 'object' },
    },
    showDetails: {
      description: 'Show detailed metadata (tokens, cost, etc.)',
      control: 'boolean',
    },
    showSources: {
      description: 'Show source citations',
      control: 'boolean',
    },
    compact: {
      description: 'Use compact layout',
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof MessageMetadata>

const messageWithMetadata: Message = {
  id: '1',
  chatId: 'chat-1',
  role: 'assistant',
  content: 'This is a response with comprehensive metadata.',
  status: 'sent',
  createdAt: new Date(),
  updatedAt: new Date(),
  metadata: {
    tokens: 1250,
    inputTokens: 850,
    outputTokens: 400,
    cost: 0.015,
    responseTime: 2340,
    model: 'gpt-4',
    confidence: 0.87,
    sources: [
      {
        id: '1',
        title: 'Components/DataDisplay/MessageMetadata',
        url: 'https://example.com',
      },
      {
        id: '2',
        title: 'Components/DataDisplay/MessageMetadata',
        url: 'https://example.com',
      },
    ],
  },
} as any

const messageMinimal: Message = {
  id: '2',
  chatId: 'chat-1',
  role: 'assistant',
  content: 'This is a response with minimal metadata.',
  status: 'sent',
  createdAt: new Date(),
  updatedAt: new Date(),
  metadata: {
    tokens: 50,
    model: 'gpt-3.5-turbo',
  },
} as any

const messageHighConfidence: Message = {
  id: '3',
  chatId: 'chat-1',
  role: 'assistant',
  content: 'This is a high-confidence response.',
  status: 'sent',
  createdAt: new Date(),
  updatedAt: new Date(),
  metadata: {
    tokens: 200,
    model: 'gpt-4',
    confidence: 0.95,
    responseTime: 1200,
  },
} as any

const messageLowConfidence: Message = {
  id: '4',
  chatId: 'chat-1',
  role: 'assistant',
  content: 'This is a low-confidence response.',
  status: 'sent',
  createdAt: new Date(),
  updatedAt: new Date(),
  metadata: {
    tokens: 150,
    model: 'gpt-3.5-turbo',
    confidence: 0.45,
    responseTime: 800,
  },
} as any

export const FullMetadata: Story = {
  args: {
    message: messageWithMetadata,
    showCost: true,
    showResponseTime: true,
    showConfidence: true,
    showTokens: true,
    showModel: true,
    showSources: true,
  },
}

export const MinimalMetadata: Story = {
  args: {
    message: messageMinimal,
    showTokens: true,
    showModel: true,
  },
}

export const CostAndTokens: Story = {
  args: {
    message: messageWithMetadata,
    showCost: true,
    showTokens: true,
    showModel: true,
  },
}

export const PerformanceMetrics: Story = {
  args: {
    message: messageWithMetadata,
    showResponseTime: true,
    showTokens: true,
  },
}

export const ConfidenceScore: Story = {
  args: {
    message: messageHighConfidence,
    showConfidence: true,
    showModel: true,
  },
}

export const LowConfidence: Story = {
  args: {
    message: messageLowConfidence,
    showConfidence: true,
    showModel: true,
  },
}

export const WithSources: Story = {
  args: {
    message: messageWithMetadata,
    showSources: true,
    showModel: true,
  },
}

export const CompactMode: Story = {
  args: {
    message: messageWithMetadata,
    compact: true,
    showCost: true,
    showResponseTime: true,
    showTokens: true,
  },
}
