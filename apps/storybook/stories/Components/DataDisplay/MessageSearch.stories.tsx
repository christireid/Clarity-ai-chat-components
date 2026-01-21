import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'
import {
  MessageSearch,
  MessageSearchWithSuspense,
} from '@clarity-chat/react'
import type { Message } from '@clarity-chat/types'

const dataset: Message[] = [
  {
    id: '1',
    chatId: 'storybook',
    role: 'user',
    content:
      'Outline a GTM plan for the Phoenix launch focusing on enterprise accounts.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    status: 'sent',
  },
  {
    id: '2',
    chatId: 'storybook',
    role: 'assistant',
    content:
      'Here is a phased approach with awareness, activation, and expansion plays.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 22),
    status: 'sent',
  },
  {
    id: '3',
    chatId: 'storybook',
    role: 'user',
    content:
      'Summarise objections from pilot customers and suggested mitigations.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 10),
    status: 'sent',
  },
  {
    id: '4',
    chatId: 'storybook',
    role: 'assistant',
    content:
      'Top objections: integration effort, contract flexibility, and quota alignment.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8),
    status: 'sent',
  },
  {
    id: '5',
    chatId: 'storybook',
    role: 'assistant',
    content:
      'Mitigations include pre-built Okta workflows, flexible seat pricing, and success SLAs.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 7),
    status: 'sent',
  },
  {
    id: '6',
    chatId: 'storybook',
    role: 'user',
    content:
      'Draft a leadership update synthesising outcomes, risks, and asks.',
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
    status: 'sent',
  },
]

const meta = {
  title: 'Components/DataDisplay/MessageSearch',
  component: MessageSearch,
  parameters: {
    docs: {
      description: {
        component:
          'Concurrent-safe message filtering built on React deferred values. Inspired by high-scale search interactions in Workplace by Meta and Slack. Use for in-thread search experiences.',
      },
    },
    layout: 'centered',
  },
  argTypes: {
    placeholder: { control: 'text' },
  },
  args: {
    placeholder: 'Search conversation...',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof MessageSearch>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => {
    const [filtered, setFiltered] = React.useState<Message[]>(dataset)

    return (
      <div className="w-full max-w-xl space-y-4">
        <MessageSearch
          {...args}
          messages={dataset}
          onResultsChange={(results) => setFiltered(results)}
        />

        <ul className="space-y-2 rounded-xl border border-border bg-card p-4 text-sm">
          {filtered.map((message) => (
            <li
              key={message.id}
              className="rounded-lg border border-border/60 bg-muted/30 p-3"
            >
              <p className="font-medium text-foreground">
                {message.role === 'assistant' ? 'Assistant' : 'You'}
              </p>
              <p className="text-xs text-muted-foreground">{message.content}</p>
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="rounded-lg border border-dashed border-border p-3 text-xs text-muted-foreground">
              No messages match this query. Try keywords such as “risks” or
              “pricing”.
            </li>
          )}
        </ul>
      </div>
    )
  },
}

export const WithSuspenseBoundary: Story = {
  render: (args) => (
    <div className="w-full max-w-xl space-y-4">
      <MessageSearchWithSuspense {...args} messages={dataset} />
      <p className="text-xs text-muted-foreground">
        Suspense-friendly wrapper is useful when lazily loading the search
        component or heavy analytics providers.
      </p>
    </div>
  ),
}
