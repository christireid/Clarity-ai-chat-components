import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import { StreamBlock, type StreamBlockProps } from '@clarity-chat/react'

type StreamBlockStoryProps = StreamBlockProps<string>

const StreamBlockPreview: React.FC<StreamBlockStoryProps> = (props) => (
  <StreamBlock<string> {...props} />
)

const meta: Meta<typeof StreamBlockPreview> = {
  title: 'Components/StreamBlock',
  component: StreamBlockPreview,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Render progressively streamed content (strings, JSX, or fragments) with automatic accumulation, error handling, and live indicators. Compatible with async iterables, promises, readable streams, and Vercel AI `StreamableValue` sources.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof StreamBlockPreview>

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

async function* streamChunks(chunks: string[], delayMs = 400) {
  for (const chunk of chunks) {
    await wait(delayMs)
    yield chunk
  }
}

const narrativeChunks = [
  'Clarity Chat seamlessly streams AI responses',
  'Chunks arrive progressively so users never wait in silence',
  'Combine with typing indicators for lifelike experiences',
  'Swap in your own async data source to render tables, code, or UI fragments',
]

const statusChunks = [
  '🔄 Connecting to Realtime endpoint…',
  '✨ Streaming suggestions…',
  '📦 Fetching supporting knowledge base documents…',
  '✅ Response complete. Tokens saved: 1,248',
]

const StreamBlockExample: React.FC<{
  mode: StreamBlockStoryProps['mode']
  chunks: string[]
  delay?: number
}> = ({ mode, chunks, delay = 450 }) => {
  const [runId, setRunId] = React.useState(0)

  const source = React.useMemo(() => streamChunks(chunks, delay), [chunks, delay, runId])

  return (
    <div className="space-y-4">
      <StreamBlockPreview
        source={source}
        mode={mode}
        spacing="relaxed"
        fallback={
          <div className="rounded-lg border border-dashed border-primary/40 bg-primary/10 p-4 text-sm text-primary">
            Waiting for stream…
          </div>
        }
        renderItem={(item, index) => (
          <div className="rounded-lg border border-border bg-card/80 p-4 shadow-sm">
            <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
              Fragment {index + 1}
            </div>
            <div className="text-sm leading-relaxed">{item}</div>
          </div>
        )}
        showIndicator
      />

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{mode === 'append' ? 'Fragments accumulate over time' : 'Only latest fragment shown'}</span>
        <button
          type="button"
          onClick={() => setRunId((id) => id + 1)}
          className="rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium transition hover:border-primary hover:text-primary"
        >
          Replay stream
        </button>
      </div>
    </div>
  )
}

export const AppendMode: Story = {
  render: () => <StreamBlockExample mode="append" chunks={narrativeChunks} />,
  name: 'Append Mode (default)',
  parameters: {
    docs: {
      description: {
        story:
          'Streams conversational content, preserving the full transcript as each fragment arrives. Perfect for incremental AI responses or progressively rendered markdown.',
      },
    },
  },
}

export const ReplaceMode: Story = {
  render: () => <StreamBlockExample mode="replace" chunks={statusChunks} delay={650} />,
  name: 'Replace Mode (status updates)',
  parameters: {
    docs: {
      description: {
        story:
          'Shows the latest fragment only — ideal for live status monitors, progress updates, or typing indicators sourced from async iterables.',
      },
    },
  },
}

export const ErrorFallback: Story = {
  render: () => {
    const [shouldError, setShouldError] = React.useState(false)
    const source = React.useMemo(async function* () {
      let count = 0
      for (const chunk of narrativeChunks) {
        await wait(400)
        if (shouldError && count === 2) {
          throw new Error('Simulated streaming failure')
        }
        count += 1
        yield chunk
      }
    }, [shouldError])

    return (
      <div className="space-y-4">
        <StreamBlockPreview
          source={source}
          spacing="compact"
          fallback={<div className="text-sm text-muted-foreground">Waiting for stream…</div>}
          errorFallback={(error) => (
            <div className="rounded-md border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
              <div className="font-semibold mb-1">Streaming interrupted</div>
              <div>{error.message}</div>
            </div>
          )}
        />
        <button
          type="button"
          onClick={() => setShouldError((value) => !value)}
          className="rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium transition hover:border-primary hover:text-primary"
        >
          {shouldError ? 'Disable simulated error' : 'Simulate streaming error'}
        </button>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates the `errorFallback` prop for graceful failure handling. Toggle the simulation to showcase recovery patterns during development.',
      },
    },
  },
}
