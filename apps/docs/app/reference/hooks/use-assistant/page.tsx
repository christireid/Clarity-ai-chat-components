'use client'

import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Pagination } from '@/components/Navigation/Pagination'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { FeedbackWidget } from '@/components/FeedbackWidget'

export const metadata: Metadata = {
  title: 'useAssistant Hook | Clarity Chat',
  description:
    'Hook for managing AI assistant interactions with tool calling support, multi-step workflows, and thread/run management.',
}

const useAssistantOptions: Prop[] = [
  {
    name: 'api',
    type: 'string',
    default: '"/api/assistant"',
    description: 'API endpoint URL for assistant requests.',
  },
  {
    name: 'assistantId',
    type: 'string',
    description: 'Assistant ID for OpenAI-compatible APIs.',
  },
  {
    name: 'threadId',
    type: 'string',
    description: 'Thread ID for multi-turn conversations.',
  },
  {
    name: 'initialMessages',
    type: 'CoreMessage[]',
    default: '[]',
    description: 'Initial messages to load in the conversation.',
  },
  {
    name: 'onToolCall',
    type: '(invocation: ToolInvocation) => void | Promise<any>',
    description: 'Callback when a tool is invoked. Return the tool result.',
  },
  {
    name: 'onFinish',
    type: '(message: CoreMessage) => void | Promise<void>',
    description: 'Callback when assistant finishes responding.',
  },
  {
    name: 'onError',
    type: '(error: Error) => void',
    description: 'Callback when an error occurs.',
  },
  {
    name: 'maxSteps',
    type: 'number',
    default: '10',
    description: 'Maximum number of tool-calling steps.',
  },
  {
    name: 'autoRunTools',
    type: 'boolean',
    default: 'true',
    description: 'Automatically execute tools when called.',
  },
]

const useAssistantReturn: Prop[] = [
  {
    name: 'messages',
    type: 'CoreMessage[]',
    description: 'Array of messages in the conversation.',
  },
  {
    name: 'setMessages',
    type: 'React.Dispatch<React.SetStateAction<CoreMessage[]>>',
    description: 'Replace all messages in the conversation.',
  },
  {
    name: 'append',
    type: '(message: CoreMessage | Pick<CoreMessage, "role" | "content">) => Promise<string | null>',
    description:
      'Add a new message and trigger assistant response. Returns message ID.',
  },
  {
    name: 'status',
    type: '"idle" | "loading" | "streaming" | "processing_tools" | "complete" | "error"',
    description: 'Current assistant status.',
  },
  {
    name: 'isLoading',
    type: 'boolean',
    description: 'Whether the assistant is currently processing.',
  },
  {
    name: 'error',
    type: 'Error | undefined',
    description: 'Current error state, if any.',
  },
  {
    name: 'toolInvocations',
    type: 'ToolInvocation[]',
    description: 'Array of tool invocations made during the conversation.',
  },
  {
    name: 'stop',
    type: '() => void',
    description: 'Stop the current assistant operation.',
  },
  {
    name: 'reset',
    type: '() => void',
    description: 'Reset the assistant state.',
  },
]

export default function UseAssistantPage() {
  return (
    <>
      <Breadcrumbs />

      <h1>useAssistant</h1>

      <p className="lead">
        Hook for managing AI assistant interactions with tool calling support,
        multi-step workflows, and thread/run management. Perfect for building
        agent-like experiences.
      </p>

      <Callout type="info" title="Architecture Layer">
        <p>
          <strong>useAssistant</strong> is a mid-level hook for assistant
          interactions. For chat with tools, use top-level{' '}
          <code>useClarityChatWithTools</code> instead. For standalone agents,
          use <code>createAgent</code> instead.
        </p>
      </Callout>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Basic Usage</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          The simplest way to use the hook:
        </p>

        <EnhancedCodeBlock
          language="tsx"
          code={`import { useAssistant } from '@clarity-chat/react/internal'

function Assistant() {
  const { messages, append, status, toolInvocations } = useAssistant({
    api: '/api/assistant',
    assistantId: 'asst_123',
    onToolCall: async (invocation) => {
      // Execute tool and return result
      if (invocation.toolName === 'get_weather') {
        return await fetchWeather(invocation.args.location)
      }
      return null
    },
  })

  const handleSend = async (content: string) => {
    await append({ role: 'user', content })
  }

  return (
    <div>
      <div>Status: {status}</div>
      {toolInvocations.map(inv => (
        <div key={inv.toolCallId}>
          {inv.toolName}: {inv.state}
        </div>
      ))}
      <ChatWindow messages={messages} onSendMessage={handleSend} />
    </div>
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Interactive Playground</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Experiment with useAssistant:
        </p>
        <CodePlayground
          initialCode={`import { useAssistant } from '@clarity-chat/react/internal'

function Example() {
  const { messages, append, status, toolInvocations } = useAssistant({
    api: '/api/assistant',
    onToolCall: async (invocation) => {
      logger.debug('Tool called:', invocation.toolName, invocation.args)
      // Return tool result
      return { result: 'Tool executed successfully' }
    },
  })

  return (
    <div>
      <p>Status: {status}</p>
      <button onClick={() => append({ role: 'user', content: 'Hello' })}>
        Send Message
      </button>
    </div>
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Examples</h2>

        <h3 className="text-xl font-semibold mt-6 mb-4">With Tool Calling</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { useAssistant } from '@clarity-chat/react/internal'

function Assistant() {
  const { messages, append, toolInvocations } = useAssistant({
    api: '/api/assistant',
    assistantId: 'asst_123',
    onToolCall: async (invocation) => {
      switch (invocation.toolName) {
        case 'search_web':
          return await searchWeb(invocation.args.query)
        case 'get_weather':
          return await getWeather(invocation.args.location)
        case 'calculate':
          // Safe math evaluation - sanitize input first
          const expr = String(invocation.args.expression).replace(/[^0-9+\\-*/().\\s]/g, '')
          const result = new Function(\`"use strict"; return (\${expr})\`)()
          return { result: typeof result === 'number' ? result : 'Invalid' }
        default:
          throw new Error(\`Unknown tool: \${invocation.toolName}\`)
      }
    },
  })

  return <ChatWindow messages={messages} onSendMessage={handleSend} />
}`}
        />

        <h3 className="text-xl font-semibold mt-6 mb-4">
          With Thread Management
        </h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { useAssistant } from '@clarity-chat/react/internal'
import { useState } from 'react'

function Assistant() {
  const [threadId, setThreadId] = useState<string | undefined>()

  const { messages, append } = useAssistant({
    api: '/api/assistant',
    assistantId: 'asst_123',
    threadId,
    onFinish: (message) => {
      // Thread ID is automatically managed
      logger.debug('Assistant finished:', message)
    },
  })

  const startNewThread = () => {
    setThreadId(undefined) // New thread will be created
  }

  return (
    <div>
      <button onClick={startNewThread}>New Conversation</button>
      <ChatWindow messages={messages} onSendMessage={handleSend} />
    </div>
  )
}`}
        />

        <h3 className="text-xl font-semibold mt-6 mb-4">
          With Status Tracking
        </h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { useAssistant } from '@clarity-chat/react/internal'

function Assistant() {
  const { messages, append, status, toolInvocations } = useAssistant({
    api: '/api/assistant',
    onToolCall: handleToolCall,
  })

  return (
    <div>
      {status === 'loading' && <div>Loading...</div>}
      {status === 'streaming' && <div>Streaming response...</div>}
      {status === 'processing_tools' && (
        <div>
          Processing {toolInvocations.length} tool(s)...
        </div>
      )}
      {status === 'error' && <div>Error occurred</div>}
      
      <ChatWindow messages={messages} onSendMessage={handleSend} />
    </div>
  )
}`}
        />

        <h3 className="text-xl font-semibold mt-6 mb-4">
          With Manual Tool Execution
        </h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { useAssistant } from '@clarity-chat/react/internal'

function Assistant() {
  const { messages, append, toolInvocations } = useAssistant({
    api: '/api/assistant',
    autoRunTools: false, // Manual tool execution
    onToolCall: async (invocation) => {
      // Show tool approval UI
      const approved = await showToolApprovalDialog(invocation)
      if (approved) {
        return await executeTool(invocation)
      }
      throw new Error('Tool execution cancelled')
    },
  })

  return <ChatWindow messages={messages} onSendMessage={handleSend} />
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Options</h2>
        <PropsTable props={useAssistantOptions} title="Hook Options" />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Return Values</h2>
        <PropsTable props={useAssistantReturn} title="Hook Return" />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Status States</h2>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          The assistant goes through these states:
        </p>
        <ul className="list-disc list-inside mb-4 space-y-2 text-gray-600 dark:text-gray-400">
          <li>
            <strong>idle</strong> - Not doing anything
          </li>
          <li>
            <strong>loading</strong> - Initial API call
          </li>
          <li>
            <strong>streaming</strong> - Receiving content
          </li>
          <li>
            <strong>processing_tools</strong> - Executing tool calls
          </li>
          <li>
            <strong>complete</strong> - Finished successfully
          </li>
          <li>
            <strong>error</strong> - Error occurred
          </li>
        </ul>
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Tool Invocations</h2>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          Tool invocations track the lifecycle of tool calls:
        </p>
        <EnhancedCodeBlock
          language="tsx"
          code={`interface ToolInvocation {
  toolCallId: string
  toolName: string
  args: Record<string, any>
  state: 'partial-call' | 'call' | 'result' | 'error'
  result?: any
  error?: string
  duration?: number
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Multi-Step Workflows</h2>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          The assistant can execute multiple tool calls in sequence:
        </p>
        <EnhancedCodeBlock
          language="tsx"
          code={`const { messages, append, toolInvocations } = useAssistant({
  api: '/api/assistant',
  maxSteps: 10, // Allow up to 10 tool-calling steps
  onToolCall: async (invocation) => {
    // Tools are executed sequentially
    // Each tool result is fed back to the assistant
    return await executeTool(invocation)
  },
})

// Assistant can chain tool calls:
// 1. Search for information
// 2. Process the results
// 3. Generate final response`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Related</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="/reference/hooks/use-clarity-chat-with-tools"
            className="docs-card"
          >
            <h3>useClarityChatWithTools Hook</h3>
            <p>Top-level hook with tool support</p>
          </a>
          <a href="/reference/hooks/use-completion" className="docs-card">
            <h3>useCompletion Hook</h3>
            <p>Simple text completion hook</p>
          </a>
          <a href="/guides/agents" className="docs-card">
            <h3>Agents Guide</h3>
            <p>Complete agents guide</p>
          </a>
          <a href="/cookbook/custom-tool-integration" className="docs-card">
            <h3>Custom Tool Integration Recipe</h3>
            <p>Recipe for integrating custom tools</p>
          </a>
        </div>
      </section>

      <Pagination
        prev={{
          title: 'useChatEnhanced',
          href: '/reference/hooks/use-chat-enhanced',
        }}
        next={{
          title: 'useCompletion',
          href: '/reference/hooks/use-completion',
        }}
      />

      {/* Feedback Widget */}
      <FeedbackWidget pageId="use-assistant" className="mt-12" />
    </>
  )
}
