'use client'

import type { Metadata } from 'next'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { Pagination } from '@/components/Navigation/Pagination'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: '3-Line Quick Start | Clarity Chat Cookbook',
  description: 'Get a production-ready AI chat interface in just 3 lines of code.',
}

export default function QuickStart3LinesPage() {
  return (
    <>
      <Breadcrumbs />

      <h1>3-Line Quick Start</h1>

      <p className="lead">
        Get a production-ready AI chat interface in <strong>just 3 lines of code</strong>.
        No configuration needed.
      </p>

      <Callout type="success" title="Fastest Way to Get Started">
        <p>
          This is the absolute fastest way to add AI chat to your app. Perfect for
          prototyping, MVPs, and simple use cases.
        </p>
      </Callout>

      <section className="my-12">
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
        <h2 className="text-2xl font-bold mb-4">3 Lines of Code</h2>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { ClarityChat } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

function App() {
  return <ClarityChat api="/api/chat" />
}`}
        />

        <Callout type="info" title="That's it!">
          <p>
            You now have a fully functional AI chat interface with:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>✨ Beautiful UI with animations</li>
            <li>⌨️ Full keyboard navigation</li>
            <li>📱 Mobile responsive</li>
            <li>⚡ Optimized performance</li>
            <li>♿ WCAG AAA accessible</li>
            <li>🔒 Production-ready security</li>
          </ul>
        </Callout>
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">API Endpoint Setup</h2>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          You need to create an API endpoint that handles chat requests. Here are examples for different frameworks:
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
  const { messages } = await req.json()

  const stream = await openai.chat.completions.create({
    model: 'gpt-4',
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
}`}
        />

        <h3 className="text-xl font-semibold mt-6 mb-4">Next.js Pages Router</h3>
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

  const { messages } = req.body

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  const stream = await openai.chat.completions.create({
    model: 'gpt-4',
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
  const { messages } = req.body

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  const stream = await openai.chat.completions.create({
    model: 'gpt-4',
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
          <li><a href="/reference/components/clarity-chat">Customize ClarityChat props</a></li>
          <li><a href="/guides/memory">Add memory support</a></li>
          <li><a href="/guides/theming">Customize the theme</a></li>
          <li><a href="/cookbook/nextjs-integration">Deep Next.js integration</a></li>
          <li><a href="/guides/error-handling">Add error handling</a></li>
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
        previous={{ title: 'Cookbook Overview', href: '/cookbook' }}
        next={{ title: 'OpenAI Streaming Chat', href: '/cookbook/openai-streaming-chat' }}
      />
    </>
  )
}
