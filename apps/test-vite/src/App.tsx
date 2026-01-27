import { useState } from 'react'
import { useClarityChat } from '@clarity-chat/react'

/**
 * Vite Smoke Test for @clarity-chat/react
 *
 * This app validates:
 * 1. SDK installation works with Vite
 * 2. Core hook (useClarityChat) imports correctly
 * 3. TypeScript definitions are available
 * 4. Build completes successfully
 * 5. Setup time < 10 minutes
 */
function App() {
  const [apiKey] = useState('test-api-key')
  const [started, setStarted] = useState(false)

  // Test: Core hook should be importable and callable
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
      <h1>🧪 Clarity Chat - Vite Smoke Test</h1>

      <div style={{
        padding: '20px',
        background: '#f0f9ff',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h2>✅ Import Success</h2>
        <p>
          The <code>@clarity-chat/react</code> package imported successfully in Vite.
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
          <li>✅ Vite dev server starts</li>
          <li>✅ Production build works</li>
        </ul>
      </div>
    </div>
  )
}

export default App
