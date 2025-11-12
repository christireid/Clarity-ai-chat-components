import React from 'react'
import { Metadata } from 'next'
import { CodeBlock } from '@/components/MDX/CodeBlock'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'Error Handling - Cookbook - Clarity Chat',
  description: 'Handle API errors, network failures, and edge cases gracefully in your chat app.',
}

export default function ErrorHandlingPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Cookbook</span>
        <h1>Robust Error Handling</h1>
        <p className="docs-lead">
          Things go wrong. APIs fail, networks drop, tokens run out. Handle errors gracefully so users aren't confused.
        </p>
      </div>

      <section className="docs-section">
        <h2>Common Errors You'll Face</h2>
        <ul>
          <li>❌ Rate limits (429)</li>
          <li>❌ Network timeouts</li>
          <li>❌ Invalid API keys (401)</li>
          <li>❌ Token limits exceeded</li>
          <li>❌ Model errors (500)</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Pattern 1: Retry with Exponential Backoff</h2>
        <CodeBlock
          language="typescript"
          code={`// lib/retry.ts
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error: any) {
      const isLastAttempt = attempt === maxRetries - 1
      const isRetryable = error?.status === 429 || error?.status >= 500

      if (isLastAttempt || !isRetryable) {
        throw error
      }

      // Wait before retry: 1s, 2s, 4s
      const delay = baseDelay * Math.pow(2, attempt)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
  throw new Error('Max retries exceeded')
}

// Usage in API route
export async function POST(req: Request) {
  const response = await withRetry(
    () => openai.chat.completions.create({ ... }),
    3  // Retry up to 3 times
  )
  return response
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Pattern 2: Show Errors to Users</h2>
        <CodeBlock
          language="typescript"
          code={`// In your chat component
import { RetryButton } from '@clarity-chat/react'

const handleSendMessage = async (content: string) => {
  try {
    const response = await fetch('/api/chat', { ... })
    
    if (!response.ok) {
      const error = await response.json()
      
      // Show error in message
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: getErrorMessage(response.status),
        status: 'error',
        error: error.message
      }])
      
      return
    }
    
    // Handle success...
  } catch (error) {
    console.error('Chat error:', error)
    // Show error state
  }
}

function getErrorMessage(status: number): string {
  switch (status) {
    case 429:
      return "We're getting too many requests. Please wait a moment and try again."
    case 401:
      return "Authentication failed. Please sign in again."
    case 500:
      return "Our AI is having trouble. We're looking into it."
    default:
      return "Something went wrong. Please try again."
  }
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Pattern 3: Message-Level Retry</h2>
        <CodeBlock
          language="typescript"
          code={`import { Message, RetryButton } from '@clarity-chat/react'

function ChatMessage({ message }) {
  const [isRetrying, setIsRetrying] = useState(false)

  const handleRetry = async () => {
    setIsRetrying(true)
    
    try {
      // Retry the failed message
      await sendMessage(message.content)
    } finally {
      setIsRetrying(false)
    }
  }

  return (
    <div>
      <Message message={message} />
      
      {message.status === 'error' && (
        <RetryButton
          onRetry={handleRetry}
          errorType="network"
          isLoading={isRetrying}
        />
      )}
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Pattern 4: Error Boundaries</h2>
        <CodeBlock
          language="typescript"
          code={`import { ErrorBoundary } from '@clarity-chat/react'

export default function ChatPage() {
  return (
    <ErrorBoundary
      fallback={(error, reset) => (
        <div className="p-8 text-center">
          <h2>Something went wrong</h2>
          <p className="text-muted-foreground mt-2">
            {error.message}
          </p>
          <button
            onClick={reset}
            className="mt-4 px-4 py-2 bg-primary text-white rounded"
          >
            Try Again
          </button>
        </div>
      )}
      onError={(error, errorInfo) => {
        // Log to error tracking service
        console.error('Chat error:', error, errorInfo)
      }}
    >
      <ChatWindow {...props} />
    </ErrorBoundary>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Pattern 5: Network Status Detection</h2>
        <CodeBlock
          language="typescript"
          code={`import { NetworkStatus } from '@clarity-chat/react'
import { useState, useEffect } from 'react'

function ChatWithNetworkDetection() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    setIsOnline(navigator.onLine)
    
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return (
    <>
      <NetworkStatus isOnline={isOnline} />
      <ChatWindow
        {...props}
        disabled={!isOnline}
      />
    </>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Pattern 6: Graceful Degradation</h2>
        <CodeBlock
          language="typescript"
          code={`// Fallback when streaming fails
async function sendMessage(content: string) {
  try {
    // Try streaming first
    return await sendStreamingMessage(content)
  } catch (error) {
    console.warn('Streaming failed, falling back to non-streaming')
    // Fallback to non-streaming
    return await sendRegularMessage(content)
  }
}

// Fallback when AI fails
async function sendStreamingMessage(content: string) {
  try {
    return await fetch('/api/chat', { ... })
  } catch (error) {
    // Show cached/pre-defined response
    return {
      content: "I'm having trouble right now. Here's what I can tell you: ..."
    }
  }
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Complete Error Handling Example</h2>
        <CodeBlock
          language="typescript"
          code={`'use client'

import { ChatWindow, Toast } from '@clarity-chat/react'
import { useState } from 'react'

export default function RobustChat() {
  const [messages, setMessages] = useState([])
  const [error, setError] = useState(null)

  const handleSendMessage = async (content: string) => {
    setError(null)
    
    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      content,
      createdAt: new Date()
    }
    setMessages(prev => [...prev, userMsg])

    let retryCount = 0
    const maxRetries = 3

    while (retryCount < maxRetries) {
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: [...messages, userMsg] })
        })

        if (response.status === 429) {
          // Rate limited - wait and retry
          retryCount++
          await new Promise(r => setTimeout(r, 2000 * retryCount))
          continue
        }

        if (!response.ok) {
          throw new Error(\`API error: \${response.status}\`)
        }

        // Success - handle response
        const data = await response.json()
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.content,
          createdAt: new Date()
        }])
        return

      } catch (err: any) {
        console.error(\`Attempt \${retryCount + 1} failed:\`, err)
        retryCount++
        
        if (retryCount === maxRetries) {
          setError(err.message)
          setMessages(prev => [...prev, {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: 'Sorry, I encountered an error. Please try again.',
            status: 'error',
            createdAt: new Date()
          }])
        }
      }
    }
  }

  return (
    <>
      {error && (
        <Toast
          type="error"
          message={error}
          onClose={() => setError(null)}
        />
      )}
      <ChatWindow
        messages={messages}
        onSendMessage={handleSendMessage}
      />
    </>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>Always validate API responses</li>
          <li>Use exponential backoff for retries</li>
          <li>Show clear error messages to users</li>
          <li>Log errors for debugging</li>
          <li>Provide retry functionality</li>
          <li>Handle offline gracefully</li>
          <li>Use Error Boundaries for React errors</li>
        </ul>

        <Callout type="warning" title="Don't Show Technical Errors">
          Users don't care about "500 Internal Server Error". Show: "Something
          went wrong. We're fixing it." Keep it human.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Related Recipes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/cookbook/rate-limiting" className="docs-card">
            <h3>Rate Limiting</h3>
            <p>Prevent hitting limits</p>
          </a>
          <a href="/cookbook/analytics-tracking" className="docs-card">
            <h3>Analytics</h3>
            <p>Track errors</p>
          </a>
        </div>
      </section>
    </div>
  )
}

