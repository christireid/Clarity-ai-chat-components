/**
 * Live Demo Chat API Endpoint
 *
 * Powers the homepage demo chat with Gemini AI and docs search.
 * Uses streaming responses for real-time UX.
 */

import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest } from 'next/server'
import { searchDocumentation, formatSearchResultsForRAG } from '@/lib/ai/keywordSearch'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// System prompt that defines the assistant's role
const SYSTEM_PROMPT = `You are the Clarity Chat documentation assistant, helping developers build amazing chat interfaces.

## About Clarity Chat

Clarity Chat is a comprehensive React component library with:
- 70+ production-ready components (ChatWindow, MessageBubble, InputBar, TypingIndicator, etc.)
- 35+ custom hooks (useChat, useStreaming, useTokenCount, useMessageHistory, etc.)
- Token optimization tools achieving 60-80% cost reductions
- TypeScript-first design with full type safety
- WCAG AAA accessibility compliance
- 11 built-in themes with dark mode support

## Your Behavior

1. **Be concise**: This is a demo chat, keep responses focused and helpful (2-4 paragraphs max)
2. **Use the documentation context**: When provided, reference specific components, hooks, and features
3. **Provide code examples**: Include short, practical code snippets when relevant
4. **Be enthusiastic but professional**: Help developers feel excited about using Clarity Chat
5. **Stay on topic**: Focus on Clarity Chat; politely redirect off-topic questions

## Response Format

- Use markdown for formatting (code blocks, bold, lists)
- Keep code examples short and focused
- Always mention relevant documentation pages when applicable
- End with a helpful follow-up suggestion when appropriate

Remember: You're the friendly face of Clarity Chat, helping developers build production-ready chat UIs!`

interface RequestBody {
  message: string
}

/**
 * Demo mode responses when no API key is configured
 */
function getDemoResponse(message: string): string {
  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes('component') || lowerMessage.includes('chatwindow')) {
    return `Clarity Chat includes **70+ components** for building chat interfaces!

Here's a quick example using the core components:

\`\`\`tsx
import { ChatWindow, MessageList, InputBar } from '@clarity-chat/react'

function MyChat() {
  return (
    <ChatWindow>
      <MessageList messages={messages} />
      <InputBar onSend={handleSend} />
    </ChatWindow>
  )
}
\`\`\`

Key components include:
- **ChatWindow**: Main container with layout
- **MessageBubble**: Individual message display
- **InputBar**: Message input with attachments
- **TypingIndicator**: Shows when someone is typing

Check out the [Component Reference](/reference/components) for the full list!`
  }

  if (lowerMessage.includes('hook') || lowerMessage.includes('usechat')) {
    return `Clarity Chat provides **35+ hooks** for state management and AI integration!

The most popular hook is \`useChat\`:

\`\`\`tsx
import { useChat } from '@clarity-chat/react'

function MyChat() {
  const { messages, sendMessage, isLoading } = useChat({
    onMessage: (msg) => console.log('New message:', msg)
  })

  return <ChatWindow messages={messages} onSend={sendMessage} />
}
\`\`\`

Other popular hooks:
- **useStreaming**: Real-time message streaming
- **useTokenCount**: Track token usage
- **useMessageHistory**: Conversation persistence
- **useTheme**: Dynamic theming

See the [Hooks Reference](/reference/hooks) for all available hooks!`
  }

  if (lowerMessage.includes('stream')) {
    return `Streaming is built right into Clarity Chat! Here's how to implement it:

\`\`\`tsx
import { useStreaming, StreamingMessage } from '@clarity-chat/react'

function Chat() {
  const { startStream, content, isStreaming } = useStreaming()

  const handleSend = async (text: string) => {
    await startStream('/api/chat', { message: text })
  }

  return (
    <>
      {isStreaming && <StreamingMessage content={content} />}
    </>
  )
}
\`\`\`

The \`StreamingMessage\` component handles token-by-token rendering automatically with smooth animations.

Learn more in our [Streaming Guide](/guides/streaming)!`
  }

  if (lowerMessage.includes('theme') || lowerMessage.includes('dark') || lowerMessage.includes('style')) {
    return `Clarity Chat supports **11 built-in themes** with dark mode out of the box!

\`\`\`tsx
import { ThemeProvider } from '@clarity-chat/react'

function App() {
  return (
    <ThemeProvider theme="midnight" darkMode>
      <ChatWindow />
    </ThemeProvider>
  )
}
\`\`\`

Available themes: default, midnight, ocean, forest, sunset, lavender, and more!

You can also create custom themes using CSS variables:

\`\`\`css
:root {
  --clarity-primary: #6366f1;
  --clarity-bg: #1a1a2e;
}
\`\`\`

Check out the [Theming Guide](/guides/theming) for full customization options!`
  }

  if (lowerMessage.includes('accessibility') || lowerMessage.includes('a11y') || lowerMessage.includes('wcag')) {
    return `Accessibility is a core priority in Clarity Chat! All components are **WCAG AAA compliant**.

Built-in accessibility features:
- Full keyboard navigation (Tab, Enter, Escape, Arrow keys)
- Screen reader support with proper ARIA labels
- Focus management and focus trapping in modals
- Reduced motion support
- High contrast mode compatibility

No extra work needed - accessibility works out of the box! You can customize ARIA labels:

\`\`\`tsx
<InputBar
  ariaLabel="Type your message"
  sendButtonAriaLabel="Send message"
/>
\`\`\`

See our [Accessibility Guide](/guides/accessibility) for best practices!`
  }

  if (lowerMessage.includes('get started') || lowerMessage.includes('install') || lowerMessage.includes('start')) {
    return `Getting started with Clarity Chat is easy!

**1. Install the package:**
\`\`\`bash
npm install @clarity-chat/react
\`\`\`

**2. Import styles and components:**
\`\`\`tsx
import '@clarity-chat/react/styles.css'
import { ChatWindow } from '@clarity-chat/react'
\`\`\`

**3. Build your first chat:**
\`\`\`tsx
function App() {
  const [messages, setMessages] = useState([])

  return (
    <ChatWindow
      messages={messages}
      onSend={(text) => setMessages([...messages, { text }])}
    />
  )
}
\`\`\`

That's it! Check out the [Quick Start Guide](/guides/quick-start) for a complete walkthrough.`
  }

  // Default response
  return `Great question! Clarity Chat makes building production-ready chat interfaces simple.

Here's what you can do:
- **70+ Components**: ChatWindow, MessageBubble, InputBar, and more
- **35+ Hooks**: useChat, useStreaming, useTokenCount for state management
- **Full Theming**: 11 built-in themes with dark mode
- **Accessibility**: WCAG AAA compliant out of the box
- **TypeScript**: Full type safety and IntelliSense

Try asking about:
- "How do I add streaming?"
- "What components are available?"
- "How do I customize the theme?"

Or explore the [documentation](/guides/quick-start) to get started!`
}

/**
 * Stream response from Gemini with docs context
 */
async function* streamFromGemini(
  message: string,
  docsContext: string
): AsyncGenerator<string> {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    // Fallback to demo mode
    const response = getDemoResponse(message)
    // Simulate streaming by yielding words
    const words = response.split(' ')
    for (let i = 0; i < words.length; i++) {
      yield words[i] + (i < words.length - 1 ? ' ' : '')
      await new Promise(resolve => setTimeout(resolve, 20))
    }
    return
  }

  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  // Build the prompt with context
  const messageWithContext = docsContext
    ? `[Documentation Context]\n${docsContext}\n\n[User Question]\n${message}`
    : message

  try {
    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: `System instructions: ${SYSTEM_PROMPT}` }]
        },
        {
          role: 'model',
          parts: [{ text: 'Understood. I am the Clarity Chat documentation assistant. I will help developers with questions about the component library. How can I help you today?' }]
        }
      ]
    })

    const result = await chat.sendMessageStream(messageWithContext)

    for await (const chunk of result.stream) {
      const text = chunk.text()
      if (text) {
        yield text
      }
    }
  } catch (error) {
    console.error('Gemini API error:', error)
    // Fallback to demo response
    const response = getDemoResponse(message)
    yield response
  }
}

/**
 * POST /api/live-demo-chat
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RequestBody

    if (!body.message) {
      return Response.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Search documentation for relevant context
    const searchResults = searchDocumentation(body.message, {
      topK: 3,
      minScore: 0.5,
    })

    const { context: docsContext } = formatSearchResultsForRAG(searchResults)

    // Create streaming response
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of streamFromGemini(body.message, docsContext)) {
            controller.enqueue(encoder.encode(chunk))
          }
          controller.close()
        } catch (error) {
          console.error('Streaming error:', error)
          controller.error(error)
        }
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('API error:', error)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/live-demo-chat - Health check
 */
export async function GET() {
  return Response.json({
    status: 'ok',
    service: 'Live Demo Chat',
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
  })
}
