/**
 * React 19 Demo Example
 * Comprehensive example showing all React 19 enhanced dev tools
 */

'use client'

import * as React from 'react'
import {
  DevToolsDashboard,
  useAPIInspector,
  useProfiler,
  useEnvValidation,
  useTimeTravel,
} from '../src/react'

/**
 * Example application demonstrating React 19 dev tools
 */
export function React19DevToolsDemo() {
  const { startCall, completeCall, setEnabled, logs, stats } = useAPIInspector()
  const { profile, summary } = useProfiler()
  const { validate, isValid, errors } = useEnvValidation()
  const { record, snapshots } = useTimeTravel()

  const [messages, setMessages] = React.useState<Array<{ role: string; content: string }>>([])

  React.useEffect(() => {
    // Enable tools
    setEnabled(true)
  }, [setEnabled])

  const handleSendMessage = React.useCallback(async () => {
    const userMessage = { role: 'user', content: 'Hello, AI!' }
    const newMessages = [...messages, userMessage]
    
    // Record state snapshot
    record(newMessages, { model: 'gpt-4-turbo' }, {}, 'Before API Call')

    // Start API call tracking
    const callId = startCall({
      provider: 'openai',
      model: 'gpt-4-turbo',
      endpoint: 'https://api.openai.com/v1/chat/completions',
      method: 'POST',
      headers: {},
      body: { messages: newMessages },
    })

    // Profile the API call
    const { result, metrics } = await profile('api-call', async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      return {
        choices: [{
          message: { role: 'assistant', content: 'Hello! How can I help you?' },
        }],
        usage: { prompt_tokens: 10, completion_tokens: 20, total_tokens: 30 },
      }
    })

    // Complete API call
    completeCall(callId, {
      status: 200,
      statusText: 'OK',
      headers: {},
      body: result,
    })

    // Update messages
    const updatedMessages = [
      ...newMessages,
      { role: 'assistant', content: result.choices[0].message.content },
    ]
    setMessages(updatedMessages)

    // Record state snapshot
    record(updatedMessages, { model: 'gpt-4-turbo' }, {}, 'After API Call')
  }, [messages, startCall, completeCall, profile, record])

  const handleValidateEnv = React.useCallback(async () => {
    await validate()
  }, [validate])

  return (
    <div className="react-19-demo">
      <div className="demo-header">
        <h1>React 19 Dev Tools Demo</h1>
        <p>Demonstrating React 19 features: useOptimistic, client-side form state, and more</p>
      </div>

      <div className="demo-content">
        <div className="demo-section">
          <h2>Chat Interface</h2>
          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`message ${msg.role}`}>
                <strong>{msg.role}:</strong> {msg.content}
              </div>
            ))}
          </div>
          <button onClick={handleSendMessage}>Send Message</button>
        </div>

        <div className="demo-section">
          <h2>Quick Stats</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>API Calls</h3>
              <p>{stats.totalCalls}</p>
            </div>
            <div className="stat-card">
              <h3>Completed</h3>
              <p>{stats.completedCalls}</p>
            </div>
            <div className="stat-card">
              <h3>Avg Response</h3>
              <p>{stats.averageResponseTime.toFixed(2)}ms</p>
            </div>
            <div className="stat-card">
              <h3>Operations</h3>
              <p>{summary.totalOperations}</p>
            </div>
            <div className="stat-card">
              <h3>Snapshots</h3>
              <p>{snapshots.length}</p>
            </div>
            <div className="stat-card">
              <h3>Env Valid</h3>
              <p>{isValid ? '✅' : '❌'}</p>
            </div>
          </div>
        </div>

        <div className="demo-section">
          <h2>Environment Validation</h2>
          <button onClick={handleValidateEnv}>Validate Environment</button>
          {errors.length > 0 && (
            <div className="errors">
              <h4>Errors:</h4>
              <ul>
                {errors.map((error, i) => (
                  <li key={i}>{error.field}: {error.message}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="demo-section">
          <h2>Full Dashboard</h2>
          <DevToolsDashboard defaultTab="inspector" />
        </div>
      </div>
    </div>
  )
}
