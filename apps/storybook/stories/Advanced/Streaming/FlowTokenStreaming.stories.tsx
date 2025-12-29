import type { Meta, StoryObj } from '@storybook/react-vite'
import React, { useState, useEffect } from 'react'
import {
  FlowTokenStreamingText,
  FlowTokenMarkdown,
  useFlowToken,
} from '@clarity-chat/react'

// Simulate streaming content
const useSimulatedStreaming = (fullContent: string, speed = 50) => {
  const [content, setContent] = useState('')
  const [isStreaming, setIsStreaming] = useState(true)

  useEffect(() => {
    let index = 0
    setContent('')
    setIsStreaming(true)

    const interval = setInterval(() => {
      if (index < fullContent.length) {
        setContent(fullContent.slice(0, index + 1))
        index++
      } else {
        setIsStreaming(false)
        clearInterval(interval)
      }
    }, speed)

    return () => clearInterval(interval)
  }, [fullContent, speed])

  return { content, isStreaming }
}

const StreamingDemo = ({
  animation,
}: {
  animation: 'fade' | 'blur-in' | 'drop-in' | 'typewriter' | 'slide-left'
}) => {
  const sampleContent =
    'FlowToken provides beautiful text animations for streaming AI responses. Each character or word can animate in smoothly, creating a polished user experience.'
  const { content, isStreaming } = useSimulatedStreaming(sampleContent, 30)

  return (
    <div className="p-4 rounded-lg bg-muted">
      <FlowTokenStreamingText
        content={content}
        isStreaming={isStreaming}
        animation={animation}
        smooth
      />
    </div>
  )
}

const MarkdownStreamingDemo = () => {
  const markdownContent = `# Hello World

This is **bold** and *italic* text.

## Code Example

\`\`\`javascript
const greeting = "Hello, FlowToken!"
console.log(greeting)
\`\`\`

- List item 1
- List item 2
- List item 3
`
  const { content, isStreaming } = useSimulatedStreaming(markdownContent, 20)

  return (
    <div className="p-4 rounded-lg bg-card border">
      <FlowTokenMarkdown content={content} isStreaming={isStreaming} />
    </div>
  )
}

const AvailabilityDemo = () => {
  const { isLoading, isAvailable, components } = useFlowToken()

  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 rounded bg-muted">
          <div className="text-sm font-medium">Loading Status</div>
          <div className={isLoading ? 'text-yellow-600' : 'text-green-600'}>
            {isLoading ? 'Loading...' : 'Ready'}
          </div>
        </div>
        <div className="p-3 rounded bg-muted">
          <div className="text-sm font-medium">FlowToken Available</div>
          <div
            className={isAvailable ? 'text-green-600' : 'text-muted-foreground'}
          >
            {isAvailable
              ? 'Yes - Enhanced animations active'
              : 'No - Using fallback'}
          </div>
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        <p>
          FlowToken is an optional peer dependency. When installed, it provides
          enhanced streaming animations. Without it, a graceful fallback is
          used.
        </p>
        <p className="mt-2">
          Install with:{' '}
          <code className="bg-muted px-1 rounded">npm install flowtoken</code>
        </p>
      </div>

      {!isLoading && (
        <div className="p-4 rounded-lg bg-muted">
          <FlowTokenStreamingText
            content="This text uses FlowToken if available, or falls back gracefully."
            isStreaming={false}
          />
        </div>
      )}
    </div>
  )
}

const meta = {
  title: 'Advanced/Streaming/FlowTokenStreaming',
  component: FlowTokenStreamingText,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Enhanced streaming text animations powered by FlowToken (optional peer dependency). Provides beautiful character-by-character or word-by-word animations. Falls back gracefully when FlowToken is not installed.',
      },
    },
  },
  argTypes: {
    animation: {
      control: 'select',
      options: ['fade', 'blur-in', 'drop-in', 'typewriter', 'slide-left'],
    },
    smooth: { control: 'boolean' },
    markdown: { control: 'boolean' },
  },
  args: {
    animation: 'fade',
    smooth: true,
    markdown: false,
  },
  decorators: [
    (Story) => (
      <div className="w-[600px] max-w-full">
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof FlowTokenStreamingText>

export default meta
type Story = StoryObj<typeof meta>

export const FadeAnimation: Story = {
  render: () => <StreamingDemo animation="fade" />,
  parameters: {
    docs: {
      description: {
        story: 'Smooth fade-in animation for each character or word.',
      },
    },
  },
}

export const BlurInAnimation: Story = {
  render: () => <StreamingDemo animation="blur-in" />,
  parameters: {
    docs: {
      description: {
        story: 'Characters blur in from fuzzy to clear.',
      },
    },
  },
}

export const DropInAnimation: Story = {
  render: () => <StreamingDemo animation="drop-in" />,
  parameters: {
    docs: {
      description: {
        story: 'Characters drop in from above with a subtle bounce.',
      },
    },
  },
}

export const TypewriterAnimation: Story = {
  render: () => <StreamingDemo animation="typewriter" />,
  parameters: {
    docs: {
      description: {
        story: 'Classic typewriter effect with cursor.',
      },
    },
  },
}

export const SlideLeftAnimation: Story = {
  render: () => <StreamingDemo animation="slide-left" />,
  parameters: {
    docs: {
      description: {
        story: 'Characters slide in from the left.',
      },
    },
  },
}

export const MarkdownStreaming: Story = {
  render: () => <MarkdownStreamingDemo />,
  parameters: {
    docs: {
      description: {
        story:
          'FlowTokenMarkdown component for streaming markdown content with proper rendering.',
      },
    },
  },
}

export const AvailabilityCheck: Story = {
  render: () => <AvailabilityDemo />,
  parameters: {
    docs: {
      description: {
        story:
          'Use the useFlowToken hook to check if FlowToken is available and adapt your UI accordingly.',
      },
    },
  },
}

export const CompletedState: Story = {
  render: () => (
    <div className="p-4 rounded-lg bg-muted">
      <FlowTokenStreamingText
        content="This is completed text that is no longer streaming. The cursor is hidden and all animations are complete."
        isStreaming={false}
        animation="fade"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Completed streaming state with no cursor or active animations.',
      },
    },
  },
}

export const WithCallback: Story = {
  render: () => {
    const [completed, setCompleted] = useState(false)
    const { content, isStreaming } = useSimulatedStreaming(
      'Watch for the completion callback!',
      50
    )

    return (
      <div className="space-y-4">
        <div className="p-4 rounded-lg bg-muted">
          <FlowTokenStreamingText
            content={content}
            isStreaming={isStreaming}
            animation="fade"
            onComplete={() => setCompleted(true)}
          />
        </div>
        <div
          className={`text-sm ${completed ? 'text-green-600' : 'text-muted-foreground'}`}
        >
          {completed
            ? '✓ onComplete callback fired!'
            : 'Waiting for completion...'}
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          'The onComplete callback fires when streaming ends, useful for triggering follow-up actions.',
      },
    },
  },
}

export const CustomStyling: Story = {
  render: () => {
    const { content, isStreaming } = useSimulatedStreaming(
      'Custom styled streaming text with your own classes.',
      40
    )

    return (
      <div className="p-6 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-200">
        <FlowTokenStreamingText
          content={content}
          isStreaming={isStreaming}
          animation="blur-in"
          className="text-lg font-medium text-purple-900 dark:text-purple-100"
        />
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Apply custom styling via className prop.',
      },
    },
  },
}
