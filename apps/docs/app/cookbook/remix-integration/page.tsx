import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Callout } from '@/components/MDX/Callout'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'

export const metadata: Metadata = {
  title: 'Remix Integration - Clarity Chat Components',
  description:
    'Learn how to integrate Clarity Chat Components with Remix, including loaders, actions, and streaming.',
}

export default function RemixIntegrationPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Recipe</span>
        <h1>Remix Integration</h1>
        <p className="docs-lead">
          Learn how to integrate Clarity Chat Components with Remix, including
          loaders, actions, streaming, and form handling.
        </p>
      </div>

      <YouWillLearn
        items={[
          'Set up Clarity Chat in Remix',
          'Use loaders for initial data',
          'Handle form actions',
          'Implement streaming',
          'Manage authentication',
        ]}
      />

      <section className="docs-section">
        <h2>Basic Setup</h2>
        <p>Set up Clarity Chat in a Remix route:</p>
        <CodePlayground
          initialCode={`// app/routes/chat.tsx
import { useLoaderData } from '@remix-run/react'
import { ClarityChat } from '@clarity-chat/react/internal'
import type { LoaderFunctionArgs } from '@remix-run/node'

export async function loader({ request }: LoaderFunctionArgs) {
  // Load initial messages
  const messages = await loadMessages(request)
  return { messages }
}

export default function ChatRoute() {
  const { messages } = useLoaderData<typeof loader>()

  return (
    <div>
      <h1>Chat</h1>
      <ClarityChat
        api="/api/chat"
        initialMessages={messages}
      />
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Form Actions</h2>
        <p>Handle chat messages with Remix actions:</p>
        <CodePlayground
          initialCode={`// app/routes/chat.tsx
import { useActionData, useNavigation } from '@remix-run/react'
import { action } from './chat.server'
import { ChatInput } from '@clarity-chat/react/internal'

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  const message = formData.get('message') as string

  // Process message
  const response = await processChatMessage(message)

  return json({ response })
}

export default function ChatRoute() {
  const actionData = useActionData<typeof action>()
  const navigation = useNavigation()

  return (
    <div>
      <ChatWindow messages={messages} />
      <ChatInput
        onSend={async (content) => {
          const formData = new FormData()
          formData.append('message', content)
          await submit(formData, { method: 'post' })
        }}
        disabled={navigation.state === 'submitting'}
      />
      {actionData?.response && (
        <Message message={actionData.response} />
      )}
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Streaming with Resource Routes</h2>
        <p>Implement streaming with Remix resource routes:</p>
        <CodePlayground
          initialCode={`// app/routes/api.chat.stream.tsx
import type { LoaderFunctionArgs } from '@remix-run/node'
import { eventStream } from '@remix-run/node'

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const message = url.searchParams.get('message')

  return eventStream(request.signal, (send) => {
    const stream = createChatStream(message)

    stream.on('data', (chunk) => {
      send({ data: chunk })
    })

    stream.on('end', () => {
      send({ data: '[DONE]' })
    })

    return () => {
      stream.destroy()
    }
  })
}

// Client component
'use client'

import { useStreaming } from '@clarity-chat/react/internal'

export function StreamingChat() {
  const streaming = useStreaming({
    api: '/api/chat/stream',
  })

  return (
    <ChatWindow
      messages={streaming.messages}
      onSend={streaming.sendMessage}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Authentication</h2>
        <p>Handle authentication in Remix:</p>
        <CodePlayground
          initialCode={`// app/routes/chat.tsx
import { requireUserId } from '~/session.server'

export async function loader({ request }: LoaderFunctionArgs) {
  // Require authentication
  const userId = await requireUserId(request)

  // Load user-specific messages
  const messages = await loadUserMessages(userId)

  return { messages, userId }
}

export default function ChatRoute() {
  const { messages, userId } = useLoaderData<typeof loader>()

  return (
    <ClarityChat
      api="/api/chat"
      initialMessages={messages}
      headers={{
        'X-User-ID': userId,
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Error Handling</h2>
        <p>Handle errors in Remix:</p>
        <CodePlayground
          initialCode={`// app/routes/chat.tsx
import { useRouteError } from '@remix-run/react'

export function ErrorBoundary() {
  const error = useRouteError()

  return (
    <div>
      <h1>Error</h1>
      <p>{error.message}</p>
      <ErrorBoundary />
    </div>
  )
}

// Or with error handling in loader
export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const messages = await loadMessages(request)
    return { messages }
  } catch (error) {
    throw new Response('Failed to load messages', { status: 500 })
  }
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>Use loaders for initial data</li>
          <li>Use actions for mutations</li>
          <li>Handle authentication in loaders</li>
          <li>Use resource routes for streaming</li>
          <li>Implement error boundaries</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <ul>
          <li>
            <a href="/cookbook/server-side-rendering">
              Server-Side Rendering Patterns
            </a>{' '}
            - SSR patterns
          </li>
          <li>
            <a href="/cookbook/nextjs-integration">Next.js Integration</a> -
            Next.js integration
          </li>
        </ul>
      </section>
    </div>
  )
}
