import type { Metadata } from 'next'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { Pagination } from '@/components/Navigation/Pagination'

export const metadata: Metadata = {
  title: '3-Line Quick Start | Clarity Chat Cookbook',
  description:
    'Get a robust AI chat interface in just 3 lines of code.',
}

export default function QuickStart3LinesPage() {
  return (
    <>
      <Breadcrumbs />

      <h1>3-Line Quick Start</h1>

      <p className="lead">
        Get a robust AI chat interface in{' '}
        <strong>just 3 lines of code</strong>
        (plus imports). No configuration needed.
      </p>

      <Callout type="success" title="Fastest Way to Get Started">
        <p>
          This is the absolute fastest way to add AI chat to your app. Perfect
          for prototyping, MVPs, and simple use cases.
        </p>
      </Callout>

      <section className="my-12">
        <Callout type="warning" className="mb-6">
          <strong>Coming Soon!</strong> The Clarity Chat packages are currently in development and not yet available on npm registries. These installation commands will work once the packages are published.
        </Callout>

        <h2 className="text-2xl font-bold mb-4">Installation</h2>
        <EnhancedCodeBlock
          language="bash"
          code={`npm install @clarity-chat/react
# or
pnpm add @clarity-chat/react
# or
yarn add @clarity-chat/react`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">1 Line of Code (Even Simpler!)</h2>

        <div className="space-y-4">
          <div className="border rounded-lg p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
            <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">🚀 Ultra-Simple API (New!)</h4>
            <EnhancedCodeBlock
              language="tsx"
              code={`import { chat } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

export default function App() {
  return chat('/api/chat') // 1 line!
}`}
            />
          </div>

          <div className="border rounded-lg p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
            <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">🎯 Named Presets</h4>
            <EnhancedCodeBlock
              language="tsx"
              code={`import { ChatPresets } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

export default function App() {
  return ChatPresets.Enterprise('/api/chat') // 1 line with enterprise features!
}`}
            />
          </div>

          <div className="border rounded-lg p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
            <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">🏗️ Builder Pattern</h4>
            <EnhancedCodeBlock
              language="tsx"
              code={`import { ChatBuilder } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

export default function App() {
  return ChatBuilder.create('/api/chat')
    .withMemory('vector-store')
    .build() // 3 lines with custom config
}`}
            />
          </div>
        </div>

        <Callout type="success" title="That's it!">
          <p>You now have a fully functional AI chat interface with:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>✨ Beautiful UI with animations</li>
            <li>⌨️ Full keyboard navigation</li>
            <li>📱 Mobile responsive</li>
            <li>⚡ Optimized performance</li>
            <li>♿ WCAG AAA accessible</li>
            <li>🔒 Robust security</li>
            <li>🔄 Streaming responses</li>
            <li>🛡️ Error recovery</li>
            <li>💾 Automatic state management</li>
          </ul>
        </Callout>
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">API Endpoint Setup</h2>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          You need to create an API endpoint that handles chat requests. Here
          are examples for different frameworks:
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-4">Next.js App Router</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`// app/api/chat/route.ts
import { NextRequest } from 'next/server'
import OpenAI from 'openai'

// Initialize OpenAI client
// Make sure OPENAI_API_KEY is set in your .env.local file
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

    const stream = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4', // Use env var or default to gpt-4
    messages,
    stream: true,
  })

  return new Response(
    new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder()
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content
          if (content) {
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
    console.error('Chat API error:', error)
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
import { NextApiRequest, NextApiResponse } from 'next'
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

    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    const stream = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4', // Use env var or default to gpt-4
      messages,
      stream: true,
    })

    for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content
    if (content) {
      res.write(\`data: \${content}\\n\\n\`)
    }
  }

  res.end()
}`}
        />

        <h3 className="text-xl font-semibold mt-6 mb-4">Express.js</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`// server.js
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

    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    const stream = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4', // Use env var or default to gpt-4
      messages,
      stream: true,
    })

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content
      if (content) {
        res.write(\`data: \${content}\\n\\n\`)
      }
    }

    res.end()
  } catch (error) {
    console.error('Chat API error:', error)
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal server error' })
    }
  }
})

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000')
})`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Environment Variables</h2>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          Create a <code>.env.local</code> file with your API key:
        </p>
        <EnhancedCodeBlock
          language="bash"
          code={`OPENAI_API_KEY=sk-your-api-key-here`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Next Steps</h2>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          Once you have the basic setup working, you can enhance it:
        </p>
        <ul className="list-disc list-inside mb-4 space-y-2 text-gray-600 dark:text-gray-400">
          <li>
            <a href="/reference/components/clarity-chat">
              Customize ClarityChat props
            </a>
          </li>
          <li>
            <a href="/guides/memory">Add memory support</a>
          </li>
          <li>
            <a href="/guides/theming">Customize the theme</a>
          </li>
          <li>
            <a href="/cookbook/nextjs-integration">Deep Next.js integration</a>
          </li>
          <li>
            <a href="/guides/error-handling">Add error handling</a>
          </li>
        </ul>
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Related</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/reference/components/clarity-chat" className="docs-card">
            <h3>ClarityChat Component</h3>
            <p>Full component documentation</p>
          </a>
          <a href="/learn/quick-start" className="docs-card">
            <h3>Quick Start Guide</h3>
            <p>Comprehensive getting started guide</p>
          </a>
          <a href="/cookbook/nextjs-integration" className="docs-card">
            <h3>Next.js Integration</h3>
            <p>Deep integration patterns</p>
          </a>
          <a href="/guides/getting-started" className="docs-card">
            <h3>Getting Started Guide</h3>
            <p>Detailed setup instructions</p>
          </a>
        </div>
      </section>

      <Pagination
        prev={{ title: 'Cookbook Overview', href: '/cookbook' }}
        next={{
          title: 'OpenAI Streaming Chat',
          href: '/cookbook/openai-streaming-chat',
        }}
      />
    </>
  )
}
