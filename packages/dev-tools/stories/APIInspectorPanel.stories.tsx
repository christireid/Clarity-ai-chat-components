/**
 * Storybook stories for APIInspectorPanel component
 * Demonstrates React 19 useOptimistic functionality
 */

import type { Meta, StoryObj } from '@storybook/react'
import { APIInspectorPanel } from '../src/react/components/api-inspector-panel'
import { useAPIInspector } from '../src/react/hooks/use-api-inspector'
import { useEffect } from 'react'

const meta: Meta<typeof APIInspectorPanel> = {
  title: 'Dev Tools/API Inspector Panel',
  component: APIInspectorPanel,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'API Inspector Panel using React 19 useOptimistic for real-time log updates.',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof APIInspectorPanel>

/**
 * Default API Inspector Panel
 */
export const Default: Story = {
  render: () => {
    const { startCall, completeCall, setEnabled } = useAPIInspector()

    useEffect(() => {
      setEnabled(true)

      // Simulate some API calls
      const call1 = startCall({
        provider: 'openai',
        model: 'gpt-4-turbo',
        endpoint: 'https://api.openai.com/v1/chat/completions',
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: { messages: [{ role: 'user', content: 'Hello!' }] },
      })

      setTimeout(() => {
        completeCall(call1, {
          status: 200,
          statusText: 'OK',
          headers: {},
          body: {
            usage: { prompt_tokens: 10, completion_tokens: 20, total_tokens: 30 },
          },
        })
      }, 500)

      const call2 = startCall({
        provider: 'anthropic',
        model: 'claude-3-opus',
        endpoint: 'https://api.anthropic.com/v1/messages',
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: { messages: [{ role: 'user', content: 'How are you?' }] },
      })

      setTimeout(() => {
        completeCall(call2, {
          status: 200,
          statusText: 'OK',
          headers: {},
          body: {
            usage: { prompt_tokens: 15, completion_tokens: 25, total_tokens: 40 },
          },
        })
      }, 1000)
    }, [])

    return <APIInspectorPanel />
  },
}

/**
 * Empty State
 */
export const Empty: Story = {
  render: () => <APIInspectorPanel />,
}

/**
 * With Many Logs
 */
export const WithManyLogs: Story = {
  render: () => {
    const { startCall, completeCall, setEnabled } = useAPIInspector()

    useEffect(() => {
      setEnabled(true)

      // Create multiple calls
      for (let i = 0; i < 10; i++) {
        const callId = startCall({
          provider: i % 2 === 0 ? 'openai' : 'anthropic',
          model: i % 2 === 0 ? 'gpt-4-turbo' : 'claude-3-opus',
          endpoint: 'https://api.example.com/v1/chat',
          method: 'POST',
          headers: {},
          body: { messages: [{ role: 'user', content: `Request ${i}` }] },
        })

        setTimeout(() => {
          completeCall(callId, {
            status: 200,
            statusText: 'OK',
            headers: {},
            body: {
              usage: {
                prompt_tokens: 10 + i,
                completion_tokens: 20 + i,
                total_tokens: 30 + i * 2,
              },
            },
          })
        }, i * 200)
      }
    }, [])

    return <APIInspectorPanel maxLogs={50} />
  },
}

/**
 * With Errors
 */
export const WithErrors: Story = {
  render: () => {
    const { startCall, recordError, setEnabled } = useAPIInspector()

    useEffect(() => {
      setEnabled(true)

      const call1 = startCall({
        provider: 'openai',
        model: 'gpt-4-turbo',
        endpoint: 'https://api.openai.com/v1/chat/completions',
        method: 'POST',
        headers: {},
        body: {},
      })

      setTimeout(() => {
        recordError(call1, new Error('Rate limit exceeded'))
      }, 500)

      const call2 = startCall({
        provider: 'anthropic',
        model: 'claude-3-opus',
        endpoint: 'https://api.anthropic.com/v1/messages',
        method: 'POST',
        headers: {},
        body: {},
      })

      setTimeout(() => {
        recordError(call2, new Error('Invalid API key'))
      }, 1000)
    }, [])

    return <APIInspectorPanel />
  },
}
