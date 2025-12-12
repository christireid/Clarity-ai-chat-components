import type { Meta, StoryObj } from '@storybook/react'
import { useState, useEffect } from 'react'
import { StreamingCodeBlock } from './StreamingCodeBlock'

const meta: Meta<typeof StreamingCodeBlock> = {
  title: 'Components/Code/StreamingCodeBlock',
  component: StreamingCodeBlock,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Code block optimized for streaming AI responses.

## Features
- **Throttled Highlighting**: Prevents excessive re-renders during fast streaming
- **Auto-scroll**: Automatically scrolls to bottom during active streaming
- **Streaming Cursor**: Visual indicator showing active streaming
- **Copy Protection**: Copy button disabled during streaming to prevent partial copies
- **Final Pass**: Full syntax highlight when stream completes
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof StreamingCodeBlock>

// Streaming simulation hook
function useStreamingSimulation(fullCode: string, speed = 50) {
  const [code, setCode] = useState('')
  const [isStreaming, setIsStreaming] = useState(true)

  useEffect(() => {
    let index = 0
    setCode('')
    setIsStreaming(true)

    const interval = setInterval(() => {
      if (index < fullCode.length) {
        // Stream 1-3 characters at a time for realistic effect
        const chunkSize = Math.floor(Math.random() * 3) + 1
        setCode(fullCode.slice(0, index + chunkSize))
        index += chunkSize
      } else {
        setIsStreaming(false)
        clearInterval(interval)
      }
    }, speed)

    return () => clearInterval(interval)
  }, [fullCode, speed])

  return { code, isStreaming }
}

const sampleCode = `import { useState, useEffect } from 'react';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
}

export function useChat(apiEndpoint: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (content: string) => {
    setIsLoading(true);

    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });

    const data = await response.json();
    setMessages(prev => [...prev, data.message]);
    setIsLoading(false);
  };

  return { messages, sendMessage, isLoading };
}`

// Interactive streaming demo
function StreamingDemo({
  speed = 50,
  language = 'typescript',
  theme = 'github-dark',
}: {
  speed?: number
  language?: string
  theme?: 'github-dark' | 'one-dark-pro' | 'night-owl'
}) {
  const { code, isStreaming } = useStreamingSimulation(sampleCode, speed)

  return (
    <StreamingCodeBlock
      code={code}
      isStreaming={isStreaming}
      language={language}
      theme={theme}
      title="useChat.ts"
      showCopyButton
    />
  )
}

export const Default: Story = {
  args: {
    code: sampleCode,
    isStreaming: false,
    language: 'typescript',
    theme: 'github-dark',
    title: 'useChat.ts',
  },
}

export const ActivelyStreaming: Story = {
  render: () => <StreamingDemo speed={30} />,
  parameters: {
    docs: {
      description: {
        story:
          'Live demonstration of code streaming. The code is revealed character by character with syntax highlighting applied in real-time.',
      },
    },
  },
}

export const SlowStreaming: Story = {
  render: () => <StreamingDemo speed={100} />,
  parameters: {
    docs: {
      description: {
        story: 'Slower streaming for better visibility of the effect.',
      },
    },
  },
}

export const FastStreaming: Story = {
  render: () => <StreamingDemo speed={10} />,
  parameters: {
    docs: {
      description: {
        story:
          'Fast streaming with throttled highlighting to prevent performance issues.',
      },
    },
  },
}

export const WithDifferentTheme: Story = {
  render: () => <StreamingDemo speed={40} theme="night-owl" />,
}

export const StreamingPython: Story = {
  render: () => {
    const pythonCode = `async def process_chat_message(message: str) -> str:
    """Process an incoming chat message and return AI response."""

    # Validate input
    if not message or len(message) > 4000:
        raise ValueError("Invalid message length")

    # Call AI service
    response = await ai_service.generate(
        prompt=message,
        max_tokens=1000,
        temperature=0.7,
    )

    return response.content`

    const Component = () => {
      const { code, isStreaming } = useStreamingSimulation(pythonCode, 40)
      return (
        <StreamingCodeBlock
          code={code}
          isStreaming={isStreaming}
          language="python"
          theme="one-dark-pro"
          title="chat_handler.py"
        />
      )
    }

    return <Component />
  },
}

export const CompletedStream: Story = {
  args: {
    code: sampleCode,
    isStreaming: false,
    language: 'typescript',
    theme: 'github-dark',
    title: 'useChat.ts (completed)',
  },
  parameters: {
    docs: {
      description: {
        story:
          'A completed stream with full syntax highlighting and copy button enabled.',
      },
    },
  },
}
