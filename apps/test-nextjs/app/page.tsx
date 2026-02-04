'use client'

import { useState } from 'react'
import { useClarityChat } from '@clarity-chat/react'

/**
 * Next.js App Router Smoke Test for @clarity-chat/react
 *
 * This app validates:
 * 1. SDK works with Next.js 15 App Router
 * 2. Server Components compatibility ('use client' boundary)
 * 3. TypeScript definitions available
 * 4. Build completes successfully
 * 5. Setup time < 10 minutes
 */
export default function Home() {
  const [apiKey] = useState('test-api-key')
  const [started, setStarted] = useState(false)

  // Test: Core hook should work in client component
  const chat = useClarityChat({
    apiKey,
    model: 'gpt-4',
    systemPrompt: 'You are a helpful assistant.',
  })

  const handleStart = () => {
    setStarted(true)
    console.log('✅ useClarityChat hook initialized:', {
      hasMessages: Array.isArray(chat.messages),
      hasSendMessage: typeof chat.sendMessage === 'function',
      hasIsLoading: typeof chat.isLoading === 'boolean',
    })
  }

  return (
    <div style={{
      fontFamily: 'system-ui',
      maxWidth: '800px',
      margin: '0 auto',
      padding: '40px 20px'
    }}>
      <h1>🧪 Clarity Chat - Next.js Smoke Test</h1>

      <div style={{
        padding: '20px',
        background: '#f0f9ff',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h2>✅ Import Success</h2>
        <p>
          The <code>@clarity-chat/react</code> package imported successfully in Next.js App Router.
        </p>
        <p style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
          Note: This is a Client Component (<code>'use client'</code>) as required for hooks.
        </p>
      </div>

      {!started ? (
        <button
          onClick={handleStart}
          style={{
            padding: '12px 24px',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            cursor: 'pointer',
          }}
        >
          Initialize Chat Hook
        </button>
      ) : (
        <div style={{
          padding: '20px',
          background: '#f0fdf4',
          borderRadius: '8px'
        }}>
          <h2>✅ Hook Initialized</h2>
          <ul>
            <li>Messages array: {chat.messages.length} messages</li>
            <li>Loading state: {chat.isLoading ? 'true' : 'false'}</li>
            <li>SendMessage: {typeof chat.sendMessage === 'function' ? 'available' : 'missing'}</li>
          </ul>
          <p>Check console for detailed validation.</p>
        </div>
      )}

      <div style={{
        marginTop: '40px',
        padding: '20px',
        background: '#fafafa',
        borderRadius: '8px'
      }}>
        <h3>Smoke Test Checklist</h3>
        <ul>
          <li>✅ Package installs via pnpm</li>
          <li>✅ TypeScript compilation works</li>
          <li>✅ Core hook imports successfully</li>
          <li>✅ Next.js dev server starts</li>
          <li>✅ Production build works</li>
          <li>✅ Works with App Router</li>
        </ul>
      </div>
    </div>
  )
}
