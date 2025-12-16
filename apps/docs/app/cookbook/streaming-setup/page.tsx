import { logger } from '@clarity-chat/utils/logger';
'use client'

import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { Pagination } from '@/components/Navigation/Pagination'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'Streaming Setup Recipe | Clarity Chat Cookbook',
  description:
    'Learn how to set up streaming AI responses for real-time, word-by-word output.',
}

export default function StreamingSetupPage() {
  return (
    <>
      <Breadcrumbs />

      <h1>Streaming Setup Recipe</h1>

      <p className="lead">
        Set up streaming AI responses so users see text appear word-by-word in
        real-time, just like ChatGPT. Dramatically improves perceived
        performance.
      </p>

      <Callout type="info" title="Why Streaming?">
        <p>
          Streaming reduces perceived latency by 70-80%. Users see responses
          immediately instead of waiting 20-30 seconds for the complete answer.
        </p>
      </Callout>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Quick Start</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Streaming is enabled by default with ClarityChat:
        </p>

        <EnhancedCodeBlock
          language="tsx"
          code={`import { ClarityChat } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

function Chat() {
  return <ClarityChat api="/api/chat" />
  // Streaming is enabled by default!
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">API Endpoint Setup</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Your API endpoint needs to return a streaming response. Here are
          examples:
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-4">Next.js App Router</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`// app/api/chat/route.ts
import { NextRequest } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'Invalid messages format' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    if (!process.env.OPENAI_API_KEY) {
      return new Response(JSON.stringify({ error: 'OPENAI_API_KEY not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Create streaming response
    const stream = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4',
      messages,
      stream: true, // Enable streaming
    })

    // Return as Server-Sent Events (SSE)
    return new Response(
      new ReadableStream({
        async start(controller) {
          const encoder = new TextEncoder()
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content
            if (content) {
              // Send as SSE format
              controller.enqueue(encoder.encode(\`data: \${content}\\n\\n\`))
            }
          }
          controller.close()
        },
      }),
      {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      }
    )
  } catch (error) {
    logger.logger.error('Chat API error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}`}
        />

        <h3 className="text-xl font-semibold mt-6 mb-4">
          Next.js Pages Router
        </h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`// pages/api/chat.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { messages } = req.body

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format' })
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OPENAI_API_KEY not configured' })
    }

    // Set up SSE headers
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    // Create streaming response
    const stream = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4',
      messages,
      stream: true,
    })

    // Stream chunks to client
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content
      if (content) {
        res.write(\`data: \${content}\\n\\n\`)
      }
    }

    res.end()
  } catch (error) {
    logger.logger.error('Chat API error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}`}
        />

        <h3 className="text-xl font-semibold mt-6 mb-4">Express.js</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`// server.ts
import express from 'express'
import OpenAI from 'openai'

const app = express()
app.use(express.json())

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format' })
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OPENAI_API_KEY not configured' })
    }

    // Set up SSE headers
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    // Create streaming response
    const stream = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4',
      messages,
      stream: true,
    })

    // Stream chunks to client
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content
      if (content) {
        res.write(\`data: \${content}\\n\\n\`)
      }
    }

    res.end()
  } catch (error) {
    logger.logger.error('Chat API error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.listen(3000, () => {
  logger.debug('Server running on http://localhost:3000')
})`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Streaming Protocols</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Clarity Chat supports multiple streaming protocols:
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-4">
          Server-Sent Events (SSE) - Default
        </h3>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          SSE is the default and recommended protocol. It's simple, HTTP-based,
          and works everywhere.
        </p>
        <EnhancedCodeBlock
          language="tsx"
          code={`<ClarityChat
  api="/api/chat"
  streamProtocol="sse" // Default
/>`}
        />

        <h3 className="text-xl font-semibold mt-6 mb-4">WebSocket</h3>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          WebSocket provides bidirectional communication and is better for
          real-time applications.
        </p>
        <EnhancedCodeBlock
          language="tsx"
          code={`<ClarityChat
  api="/api/chat"
  streamProtocol="websocket"
  websocket={{
    url: 'wss://api.example.com/chat',
    autoReconnect: true,
  }}
/>`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">With useClarityChat</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          For custom UIs, streaming is automatically handled:
        </p>

        <EnhancedCodeBlock
          language="tsx"
          code={`import { useClarityChat, ChatWindow } from '@clarity-chat/react'

function Chat() {
  const { messages, append, isLoading } = useClarityChat({
    api: '/api/chat',
    // Streaming is enabled by default
  })

  return (
    <ChatWindow
      messages={messages}
      isLoading={isLoading}
      onSendMessage={async (content) => {
        await append({ role: 'user', content })
        // Response will stream automatically
      }}
    />
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Streaming Components</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Use StreamingMessage for advanced streaming features:
        </p>

        <EnhancedCodeBlock
          language="tsx"
          code={`import { StreamingMessage } from '@clarity-chat/react'

function Chat() {
  const [content, setContent] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)

  // Handle streaming updates
  useEffect(() => {
    const eventSource = new EventSource('/api/chat')
    
    eventSource.onmessage = (event) => {
      setContent(prev => prev + event.data)
      setIsStreaming(true)
    }

    eventSource.onerror = () => {
      setIsStreaming(false)
      eventSource.close()
    }

    return () => eventSource.close()
  }, [])

  return (
    <StreamingMessage
      content={content}
      isStreaming={isStreaming}
      showThinking
      showCitations
    />
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Best Practices</h2>
        <ul className="list-disc list-inside mb-4 space-y-2 text-gray-600 dark:text-gray-400">
          <li>
            <strong>Always enable streaming</strong> - It dramatically improves
            UX
          </li>
          <li>
            <strong>Use SSE for most cases</strong> - It's simpler and more
            reliable
          </li>
          <li>
            <strong>Handle errors gracefully</strong> - Show user-friendly error
            messages
          </li>
          <li>
            <strong>Show loading states</strong> - Use isLoading to show
            progress
          </li>
          <li>
            <strong>Allow cancellation</strong> - Let users stop streaming if
            needed
          </li>
        </ul>
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Troubleshooting</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">
              Streaming not working?
            </h3>
            <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
              <li>
                Check that your API endpoint returns{' '}
                <code>text/event-stream</code> content type
              </li>
              <li>
                Ensure chunks are sent in SSE format:{' '}
                <code>data: content\n\n</code>
              </li>
              <li>Verify CORS headers allow streaming</li>
              <li>Check browser console for errors</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">
              Chunks appearing slowly?
            </h3>
            <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
              <li>Check network latency</li>
              <li>Verify your LLM provider supports streaming</li>
              <li>Consider using WebSocket for lower latency</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Related</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="/reference/components/streaming-message"
            className="docs-card"
          >
            <h3>StreamingMessage Component</h3>
            <p>Component for displaying streaming content</p>
          </a>
          <a href="/reference/hooks/use-streaming-sse" className="docs-card">
            <h3>useStreamingSSE Hook</h3>
            <p>SSE streaming hook</p>
          </a>
          <a
            href="/reference/hooks/use-streaming-websocket"
            className="docs-card"
          >
            <h3>useStreamingWebSocket Hook</h3>
            <p>WebSocket streaming hook</p>
          </a>
          <a href="/guides/streaming" className="docs-card">
            <h3>Streaming Guide</h3>
            <p>Complete streaming guide</p>
          </a>
        </div>
      </section>

      <Pagination
        prev={{
          title: 'Memory Integration',
          href: '/cookbook/memory-integration',
        }}
        next={{ title: 'Error Handling', href: '/cookbook/error-handling' }}
      />
    </>
  )
}
