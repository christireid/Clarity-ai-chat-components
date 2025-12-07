'use client'

import { useState, useCallback } from 'react'
import { ToastProvider, ChatInput } from '@clarity-chat/react'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Pagination } from '@/components/Navigation/Pagination'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { ComponentPreview } from '@/components/Demo/ComponentPreview'
import { ViewInStorybook } from '@/components/Links/StorybookLink'

// Basic demo component
function BasicInputDemo() {
  const [value, setValue] = useState('')

  const handleSubmit = useCallback(async (text: string) => {
    console.log('Sending:', text)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setValue('')
  }, [])

  return (
    <div className="w-full max-w-2xl border border-border rounded-lg">
      <ChatInput
        value={value}
        onChange={setValue}
        onSubmit={handleSubmit}
        placeholder="Type a message..."
      />
    </div>
  )
}

// Character limit demo
function CharacterLimitDemo() {
  const [value, setValue] = useState('')

  const handleSubmit = useCallback(async (text: string) => {
    console.log('Sending:', text)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setValue('')
  }, [])

  return (
    <div className="w-full max-w-2xl border border-border rounded-lg">
      <ChatInput
        value={value}
        onChange={setValue}
        onSubmit={handleSubmit}
        maxLength={280}
        warningThreshold={0.9}
        showCharCounter
        placeholder="Type a message (280 char limit)..."
      />
    </div>
  )
}

const chatInputProps: Prop[] = [
  {
    name: 'value',
    type: 'string',
    required: true,
    description: 'Current input value (controlled component).',
  },
  {
    name: 'onChange',
    type: '(value: string) => void',
    required: true,
    description: 'Callback function called when the input value changes.',
  },
  {
    name: 'onSubmit',
    type: '(value: string) => void | Promise<void>',
    required: true,
    description: 'Callback function called when the message is submitted (Enter key or button click). Can be async.',
  },
  {
    name: 'placeholder',
    type: 'string',
    default: '"Type a message..."',
    description: 'Placeholder text displayed when input is empty.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Disable the input and submit button. Useful during loading states.',
  },
  {
    name: 'maxLength',
    type: 'number',
    description: 'Maximum character count. Enables character counter and validation.',
  },
  {
    name: 'showCharCounter',
    type: 'boolean',
    default: 'true',
    description: 'Show character counter. Only visible when maxLength is set and input has content.',
  },
  {
    name: 'warningThreshold',
    type: 'number',
    default: '0.8',
    description: 'Warning threshold as a percentage (0-1). Counter turns yellow when this percentage is reached.',
  },
  {
    name: 'animateHeight',
    type: 'boolean',
    default: 'true',
    description: 'Enable smooth expand/contract animation as textarea grows.',
  },
  {
    name: 'glowOnFocus',
    type: 'boolean',
    default: 'true',
    description: 'Enable focus ring glow animation when input is focused.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes to apply to the container element.',
  },
]

export const dynamic = 'force-dynamic'

export default function ChatInputPage() {
  return (
    <ToastProvider>
      <>
        <Breadcrumbs />

        <h1>ChatInput</h1>

        <p className="lead">
          A composable chat input component with character counting, validation,
          smooth animations, and keyboard shortcuts. Perfect for building custom chat interfaces.
        </p>

        <Callout type="info">
          <p>
            For drop-in usage with built-in state management, use the{' '}
            <a href="/reference/components/clarity-chat">ClarityChat</a> component instead.
            ChatInput is ideal when you need more control over the input behavior.
          </p>
        </Callout>

        <ViewInStorybook component="ChatInput" />

        <section className="my-12">
          <h2 className="text-2xl font-bold mb-4">Interactive Playground</h2>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            Experiment with the ChatInput component! Try typing, test character limits,
            and see the animations in action.
          </p>
          <CodePlayground
            initialCode={`function Example() {
  const [value, setValue] = React.useState('')

  const handleSubmit = async (text) => {
    console.log('Sending:', text)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setValue('')
  }

  return (
    <ChatInput
      value={value}
      onChange={setValue}
      onSubmit={handleSubmit}
      maxLength={280}
      placeholder="Type a message..."
    />
  )
}

render(<Example />)`}
          />
        </section>

        <h2 id="import">Import</h2>

        <EnhancedCodeBlock
          code={`import { ChatInput } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'`}
          language="tsx"
        />

        <h2 id="basic-usage">Basic Usage</h2>

        <p>
          ChatInput is a controlled component that requires <code>value</code>,{' '}
          <code>onChange</code>, and <code>onSubmit</code> props:
        </p>

        <ComponentPreview
          title="Simple Chat Input"
          description="A basic chat input with submit handling"
          code={`import { useState, useCallback } from 'react'
import { ChatInput } from '@clarity-chat/react'

function SimpleChatInput() {
  const [value, setValue] = useState('')

  const handleSubmit = useCallback(async (text: string) => {
    console.log('Sending:', text)
    // Send to your API
    await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message: text }),
    })
    setValue('') // Clear input after successful send
  }, [])

  return (
    <ChatInput
      value={value}
      onChange={setValue}
      onSubmit={handleSubmit}
      placeholder="Type a message..."
    />
  )
}`}
        >
          <BasicInputDemo />
        </ComponentPreview>

        <h2 id="character-limit">Character Limit</h2>

        <p>
          Set a maximum character count with visual feedback. The counter shows
          progress and changes color as you approach the limit:
        </p>

        <ComponentPreview
          title="With Character Limit"
          description="Character counter with warning threshold"
          code={`import { ChatInput } from '@clarity-chat/react'

function ChatWithLimit() {
  const [value, setValue] = useState('')

  return (
    <ChatInput
      value={value}
      onChange={setValue}
      onSubmit={handleSubmit}
      maxLength={280}
      warningThreshold={0.9} // Warn at 90%
      showCharCounter
    />
  )
}`}
        >
          <CharacterLimitDemo />
        </ComponentPreview>

        <Callout type="tip">
          <p>
            <strong>Character Counter States:</strong>
          </p>
          <ul>
            <li>
              <strong>Normal (0-79%):</strong> Blue color, normal font weight
            </li>
            <li>
              <strong>Warning (80-99%):</strong> Yellow color, medium font weight
            </li>
            <li>
              <strong>Over Limit (100%+):</strong> Red color, bold font, pulsing animation
            </li>
          </ul>
        </Callout>

        <h2 id="async-submit">Async Submit</h2>

        <p>
          The <code>onSubmit</code> callback can be async. The button automatically
          shows loading, success, and error states:
        </p>

        <EnhancedCodeBlock
          code={`import { ChatInput } from '@clarity-chat/react'

function ChatWithAsyncSubmit() {
  const [value, setValue] = useState('')

  const handleSubmit = async (text: string) => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      // Success - button shows checkmark for 1 second
      setValue('')
    } catch (error) {
      // Error - button shows error icon for 2 seconds
      console.error('Failed to send:', error)
      // Error state is handled automatically
    }
  }

  return (
    <ChatInput
      value={value}
      onChange={setValue}
      onSubmit={handleSubmit}
    />
  )
}`}
          language="tsx"
          showLineNumbers
        />

        <Callout type="info">
          <p>
            <strong>Button States:</strong> The submit button automatically transitions
            through states: <code>idle</code> → <code>loading</code> → <code>success</code> or <code>error</code>.
            You don't need to manage these states manually.
          </p>
        </Callout>

        <h2 id="disabled-state">Disabled State</h2>

        <p>
          Disable the input during loading or when chat is unavailable:
        </p>

        <EnhancedCodeBlock
          code={`import { ChatInput } from '@clarity-chat/react'
import { useClarityChat } from '@clarity-chat/react'

function ChatWithDisabledState() {
  const chat = useClarityChat({ api: '/api/chat' })
  const [value, setValue] = useState('')

  return (
    <ChatInput
      value={value}
      onChange={setValue}
      onSubmit={async (text) => {
        await chat.append({ role: 'user', content: text })
        setValue('')
      }}
      disabled={chat.isLoading} // Disable while loading
    />
  )
}`}
          language="tsx"
          showLineNumbers
        />

        <h2 id="customization">Customization</h2>

        <p>Customize animations and appearance:</p>

        <EnhancedCodeBlock
          code={`<ChatInput
  value={value}
  onChange={setValue}
  onSubmit={handleSubmit}
  placeholder="Custom placeholder..."
  animateHeight={false} // Disable height animation
  glowOnFocus={false}    // Disable focus glow
  className="custom-input" // Custom styling
/>`}
          language="tsx"
          showLineNumbers
        />

        <h2 id="keyboard-shortcuts">Keyboard Shortcuts</h2>

        <p>ChatInput supports the following keyboard shortcuts:</p>

        <ul>
          <li>
            <kbd className="px-2 py-1 text-xs border rounded bg-muted">Enter</kbd> - Submit message (if valid and not over limit)
          </li>
          <li>
            <kbd className="px-2 py-1 text-xs border rounded bg-muted">Shift</kbd> + <kbd className="px-2 py-1 text-xs border rounded bg-muted">Enter</kbd> - Insert new line
          </li>
        </ul>

        <Callout type="tip">
          <p>
            When the input exceeds <code>maxLength</code>, pressing Enter triggers
            a shake animation to indicate the message is too long.
          </p>
        </Callout>

        <h2 id="props">Props</h2>

        <PropsTable props={chatInputProps} />

        <h2 id="examples">Complete Examples</h2>

        <h3>With useClarityChat Hook</h3>

        <EnhancedCodeBlock
          code={`import { useState } from 'react'
import { ChatInput, useClarityChat } from '@clarity-chat/react'

function ChatWithHook() {
  const chat = useClarityChat({ api: '/api/chat' })
  const [input, setInput] = useState('')

  return (
    <div className="flex flex-col h-screen">
      {/* Your message list here */}
      
      <ChatInput
        value={input}
        onChange={setInput}
        onSubmit={async (text) => {
          await chat.append({ role: 'user', content: text })
          setInput('')
        }}
        disabled={chat.isLoading}
        maxLength={1000}
        placeholder="Ask me anything..."
      />
    </div>
  )
}`}
          language="tsx"
          showLineNumbers
        />

        <h3>With Validation</h3>

        <EnhancedCodeBlock
          code={`import { useState } from 'react'
import { ChatInput } from '@clarity-chat/react'

function ChatWithValidation() {
  const [value, setValue] = useState('')

  const handleSubmit = async (text: string) => {
    // Additional validation
    if (text.trim().length < 3) {
      alert('Message must be at least 3 characters')
      return
    }

    // Send message
    await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message: text }),
    })

    setValue('')
  }

  return (
    <ChatInput
      value={value}
      onChange={setValue}
      onSubmit={handleSubmit}
      maxLength={500}
      warningThreshold={0.85}
    />
  )
}`}
          language="tsx"
          showLineNumbers
        />

        <h2 id="accessibility">Accessibility</h2>

        <p>ChatInput is built with accessibility in mind:</p>

        <ul>
          <li>✅ Full keyboard navigation support</li>
          <li>✅ ARIA labels on submit button reflect current state</li>
          <li>✅ Screen reader announcements for state changes</li>
          <li>✅ Focus indicators meet WCAG 2.1 AA standards</li>
          <li>✅ Error messages are programmatically associated</li>
          <li>✅ Character counter is accessible to screen readers</li>
        </ul>

        <h2 id="performance">Performance</h2>

        <p>ChatInput is optimized for performance:</p>

        <ul>
          <li>
            <strong>React 19 optimizations:</strong> Automatic memoization of event handlers
          </li>
          <li>
            <strong>Debounced animations:</strong> Smooth transitions without performance impact
          </li>
          <li>
            <strong>Efficient re-renders:</strong> Only re-renders when necessary
          </li>
        </ul>

        <h2 id="related">Related</h2>

        <ul>
          <li>
            <a href="/reference/components/advanced-chat-input">AdvancedChatInput</a> - Enhanced version with file uploads, mentions, and commands
          </li>
          <li>
            <a href="/reference/components/chat-window">ChatWindow</a> - Complete chat interface that includes ChatInput
          </li>
          <li>
            <a href="/reference/components/clarity-chat">ClarityChat</a> - Drop-in component with built-in input
          </li>
          <li>
            <a href="/reference/hooks/use-clarity-chat">useClarityChat</a> - Chat state hook for integration
          </li>
        </ul>

        <Pagination
          previous={{
            title: 'ChatWindow',
            href: '/reference/components/chat-window',
          }}
          next={{
            title: 'AdvancedChatInput',
            href: '/reference/components/advanced-chat-input',
          }}
        />
      </>
    </ToastProvider>
  )
}
