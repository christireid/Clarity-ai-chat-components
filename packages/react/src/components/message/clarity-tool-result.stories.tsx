/**
 * ClarityToolResult Storybook Stories
 *
 * Demonstrates the tool UI registry pattern and ClarityToolResult component
 */

import type { Meta, StoryObj } from '@storybook/react'
import { ClarityToolResult, type ToolCall } from './ClarityToolResult'
import { createToolUIRegistry } from '../../agents/tool-ui-registry'
import { Card, CardContent, CardHeader, Badge } from '@clarity-chat/primitives'
import type { CoreMessage } from '../../hooks/chat/use-chat-enhanced'

const meta: Meta<typeof ClarityToolResult> = {
  title: 'Components/ClarityToolResult',
  component: ClarityToolResult,
  parameters: {
    docs: {
      description: {
        component: `
Renders tool execution results using registered UI components.

## Features
- Type-safe tool component registry
- Automatic component resolution by tool name
- Fallback rendering for unregistered tools
- Message context integration
- Customizable component props

## Usage

\`\`\`tsx
import { ClarityToolResult, createToolUIRegistry } from '@clarity-chat/react'

const registry = createToolUIRegistry({
  get_weather: WeatherResult,
  search_faq: FAQResults,
})

<ClarityToolResult
  registry={registry}
  toolCall={{ name: 'get_weather', args: { location: 'San Francisco' } }}
  result={{ temperature: 72, condition: 'Sunny' }}
  messages={messages}
/>
\`\`\`
        `,
      },
    },
    layout: 'padded',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ClarityToolResult>

// Mock tool UI components
interface WeatherData {
  location: string
  temperature: number
  condition: string
  humidity: number
  windSpeed: number
  units: string
}

function WeatherResult({ data }: { data: WeatherData }) {
  return (
    <Card className="mt-2">
      <CardHeader className="">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Weather in {data.location}</h3>
          <Badge variant="info">{data.condition}</Badge>
        </div>
      </CardHeader>
      <CardContent className="">
        <div className="space-y-2">
          <div className="text-3xl font-bold">
            {data.temperature}°{data.units === 'celsius' ? 'C' : 'F'}
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Humidity:</span>{' '}
              {data.humidity}%
            </div>
            <div>
              <span className="text-muted-foreground">Wind:</span>{' '}
              {data.windSpeed} km/h
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface FAQSearchData {
  query: string
  results: Array<{
    question: string
    answer: string
    category: string
  }>
  totalResults: number
}

function FAQResults({ data }: { data: FAQSearchData }) {
  return (
    <Card className="mt-2">
      <CardHeader className="">
        <h3 className="text-lg font-semibold">FAQ Search: "{data.query}"</h3>
        <p className="text-sm text-muted-foreground">
          Found {data.totalResults} results
        </p>
      </CardHeader>
      <CardContent className="">
        <div className="space-y-3">
          {data.results.map((faq, idx) => (
            <div key={idx} className="border-l-2 border-primary pl-3">
              <div className="font-semibold">{faq.question}</div>
              <div className="text-sm text-muted-foreground mt-1">
                {faq.answer}
              </div>
              <Badge variant="outline" className="mt-2">
                {faq.category}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

const mockMessages: CoreMessage[] = [
  {
    id: '1',
    role: 'user',
    content: 'What is the weather in San Francisco?',
  },
  {
    id: '2',
    role: 'assistant',
    content: 'Let me check the weather for you.',
  },
]

export const WeatherTool: Story = {
  args: {
    registry: createToolUIRegistry({
      get_weather: WeatherResult,
    }),
    toolCall: {
      name: 'get_weather',
      args: { location: 'San Francisco', units: 'fahrenheit' },
      id: 'call_123',
    },
    result: {
      location: 'San Francisco',
      temperature: 72,
      condition: 'Sunny',
      humidity: 65,
      windSpeed: 10,
      units: 'fahrenheit',
    },
    messages: mockMessages,
  },
  parameters: {
    docs: {
      description: {
        story: 'Weather tool result with custom UI component',
      },
    },
  },
}

export const FAQSearchTool: Story = {
  args: {
    registry: createToolUIRegistry({
      search_faq: FAQResults,
    }),
    toolCall: {
      name: 'search_faq',
      args: { query: 'password reset', limit: 3 },
      id: 'call_456',
    },
    result: {
      query: 'password reset',
      results: [
        {
          question: 'How do I reset my password?',
          answer: 'Go to Settings > Security > Reset Password',
          category: 'Account',
        },
        {
          question: 'What if I forgot my email?',
          answer: 'Contact support with your account details',
          category: 'Account',
        },
        {
          question: 'How long does reset take?',
          answer: 'Password reset emails arrive within 5 minutes',
          category: 'Account',
        },
      ],
      totalResults: 3,
    },
    messages: mockMessages,
  },
  parameters: {
    docs: {
      description: {
        story: 'FAQ search tool result with custom UI component',
      },
    },
  },
}

export const MultipleTools: Story = {
  render: () => {
    const registry = createToolUIRegistry({
      get_weather: WeatherResult,
      search_faq: FAQResults,
    })

    return (
      <div className="space-y-4">
        <ClarityToolResult
          registry={registry}
          toolCall={{
            name: 'get_weather',
            args: { location: 'New York', units: 'celsius' },
            id: 'call_1',
          }}
          result={{
            location: 'New York',
            temperature: 22,
            condition: 'Cloudy',
            humidity: 70,
            windSpeed: 15,
            units: 'celsius',
          }}
          messages={mockMessages}
        />
        <ClarityToolResult
          registry={registry}
          toolCall={{
            name: 'search_faq',
            args: { query: 'billing', limit: 2 },
            id: 'call_2',
          }}
          result={{
            query: 'billing',
            results: [
              {
                question: 'What is your refund policy?',
                answer: 'We offer 30-day money-back guarantee',
                category: 'Billing',
              },
              {
                question: 'How do I update my payment method?',
                answer: 'Go to Settings > Billing > Payment Methods',
                category: 'Billing',
              },
            ],
            totalResults: 2,
          }}
          messages={mockMessages}
        />
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Multiple tool results using the same registry',
      },
    },
  },
}

export const UnregisteredTool: Story = {
  args: {
    registry: createToolUIRegistry({}),
    toolCall: {
      name: 'unknown_tool',
      args: { data: 'some data' },
      id: 'call_999',
    },
    result: {
      status: 'success',
      data: { value: 42, message: 'Tool executed successfully' },
    },
    messages: mockMessages,
  },
  parameters: {
    docs: {
      description: {
        story: 'Fallback rendering for unregistered tools (shows JSON)',
      },
    },
  },
}

export const WithHeader: Story = {
  args: {
    registry: createToolUIRegistry({
      get_weather: WeatherResult,
    }),
    toolCall: {
      name: 'get_weather',
      args: { location: 'London', units: 'celsius' },
      id: 'call_789',
    },
    result: {
      location: 'London',
      temperature: 15,
      condition: 'Rainy',
      humidity: 80,
      windSpeed: 20,
      units: 'celsius',
    },
    messages: mockMessages,
    showHeader: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Tool result with header showing tool name',
      },
    },
  },
}
