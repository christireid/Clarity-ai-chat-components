'use client'

import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Pagination } from '@/components/Navigation/Pagination'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { ViewInStorybook } from '@/components/Links/StorybookLink'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'VoiceInput Component | Clarity Chat',
  description: 'Enable voice-to-text input with real-time transcription using the Web Speech API.',
}

const voiceInputProps: Prop[] = [
  {
    name: 'onTranscript',
    type: '(transcript: string) => void',
    required: true,
    description: 'Callback when transcript is finalized (or on interim results if showInterim is true).',
  },
  {
    name: 'lang',
    type: 'string',
    default: '"en-US"',
    description: 'Language code for speech recognition (e.g., "en-US", "es-ES", "fr-FR").',
  },
  {
    name: 'showInterim',
    type: 'boolean',
    default: 'false',
    description: 'Show real-time interim results as user speaks.',
  },
  {
    name: 'autoSubmit',
    type: 'boolean',
    default: 'false',
    description: 'Automatically submit transcript when speech ends.',
  },
  {
    name: 'size',
    type: '"sm" | "md" | "lg"',
    default: '"md"',
    description: 'Button size.',
  },
  {
    name: 'variant',
    type: '"primary" | "secondary" | "ghost"',
    default: '"primary"',
    description: 'Button variant style.',
  },
  {
    name: 'icon',
    type: 'ReactNode',
    description: 'Custom icon when not listening.',
  },
  {
    name: 'listeningIcon',
    type: 'ReactNode',
    description: 'Custom icon when listening.',
  },
  {
    name: 'showTooltip',
    type: 'boolean',
    default: 'false',
    description: 'Show tooltip with instructions.',
  },
  {
    name: 'tooltipText',
    type: 'string',
    description: 'Custom tooltip text.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Disable voice input.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes.',
  },
  {
    name: 'onStart',
    type: '() => void',
    description: 'Callback when listening starts.',
  },
  {
    name: 'onStop',
    type: '() => void',
    description: 'Callback when listening stops.',
  },
  {
    name: 'onError',
    type: '(error: string) => void',
    description: 'Callback when an error occurs.',
  },
]

export default function VoiceInputPage() {
  return (
    <>
      <Breadcrumbs />

      <h1>VoiceInput</h1>

      <p className="lead">
        Enable voice-to-text input with real-time transcription using the Web Speech API.
        Perfect for hands-free chat, mobile interfaces, and accessibility.
      </p>

      <Callout type="info" title="Browser Support">
        <p>
          VoiceInput uses the Web Speech API, which is supported in Chrome, Edge, and Safari.
          The component gracefully degrades on unsupported browsers.
        </p>
      </Callout>

      <ViewInStorybook component="VoiceInput" />

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Basic Usage</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          The simplest way to use the component:
        </p>
        
        <EnhancedCodeBlock
          language="tsx"
          code={`import { VoiceInput } from '@clarity-chat/react'

function Chat() {
  const handleTranscript = (text: string) => {
    console.log('Voice input:', text)
    sendMessage(text)
  }

  return (
    <VoiceInput
      onTranscript={handleTranscript}
      autoSubmit
    />
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Interactive Playground</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Try the VoiceInput component:
        </p>
        <CodePlayground
          initialCode={`import { VoiceInput } from '@clarity-chat/react'
import { useState } from 'react'

function Example() {
  const [transcript, setTranscript] = useState('')

  return (
    <div>
      <VoiceInput
        onTranscript={(text) => setTranscript(text)}
        showInterim
        autoSubmit
      />
      {transcript && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <strong>Transcript:</strong> {transcript}
        </div>
      )}
    </div>
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Examples</h2>

        <h3 className="text-xl font-semibold mt-6 mb-4">With Interim Results</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { VoiceInput } from '@clarity-chat/react'

function Chat() {
  const [interimText, setInterimText] = useState('')

  return (
    <div>
      <VoiceInput
        onTranscript={(text) => {
          setInterimText(text)
          // Final transcript will be sent when speech ends
        }}
        showInterim
        lang="en-US"
      />
      {interimText && (
        <div className="text-gray-500 italic">{interimText}</div>
      )}
    </div>
  )
}`}
        />

        <h3 className="text-xl font-semibold mt-6 mb-4">With Auto-Submit</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { VoiceInput } from '@clarity-chat/react'

function Chat() {
  return (
    <VoiceInput
      onTranscript={(text) => {
        // Automatically called when speech ends
        sendMessage(text)
      }}
      autoSubmit
      showTooltip
      tooltipText="Click to start voice input"
    />
  )
}`}
        />

        <h3 className="text-xl font-semibold mt-6 mb-4">With Error Handling</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { VoiceInput } from '@clarity-chat/react'

function Chat() {
  return (
    <VoiceInput
      onTranscript={handleTranscript}
      onError={(error) => {
        if (error.includes('not supported')) {
          toast.error('Voice input is not supported in this browser')
        } else if (error.includes('permission')) {
          toast.error('Microphone permission denied')
        } else {
          toast.error('Voice input error: ' + error)
        }
      }}
    />
  )
}`}
        />

        <h3 className="text-xl font-semibold mt-6 mb-4">Multi-Language Support</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { VoiceInput } from '@clarity-chat/react'

function Chat() {
  const [language, setLanguage] = useState('en-US')

  return (
    <div>
      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option value="en-US">English (US)</option>
        <option value="es-ES">Spanish</option>
        <option value="fr-FR">French</option>
        <option value="de-DE">German</option>
      </select>
      <VoiceInput
        onTranscript={handleTranscript}
        lang={language}
        autoSubmit
      />
    </div>
  )
}`}
        />

        <h3 className="text-xl font-semibold mt-6 mb-4">With Custom Styling</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { VoiceInput } from '@clarity-chat/react'
import { Mic, MicOff } from 'lucide-react'

function Chat() {
  return (
    <VoiceInput
      onTranscript={handleTranscript}
      size="lg"
      variant="primary"
      icon={<Mic className="w-5 h-5" />}
      listeningIcon={<MicOff className="w-5 h-5" />}
      className="rounded-full"
    />
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Props</h2>
        <PropsTable props={voiceInputProps} />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Features</h2>
        <ul className="list-disc list-inside mb-4 space-y-2 text-gray-600 dark:text-gray-400">
          <li><strong>One-click voice recording</strong> - Simple button interface</li>
          <li><strong>Real-time transcription</strong> - See text as you speak</li>
          <li><strong>Visual feedback</strong> - Pulse animation during recording</li>
          <li><strong>Auto-submit</strong> - Automatically send when speech ends</li>
          <li><strong>Multi-language support</strong> - Supports 100+ languages</li>
          <li><strong>Error handling</strong> - Graceful degradation on unsupported browsers</li>
          <li><strong>Accessibility</strong> - Full keyboard and screen reader support</li>
        </ul>
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Browser Support</h2>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          The Web Speech API is supported in:
        </p>
        <ul className="list-disc list-inside mb-4 space-y-2 text-gray-600 dark:text-gray-400">
          <li>Chrome 33+ (Desktop & Mobile)</li>
          <li>Edge 79+</li>
          <li>Safari 14.1+ (iOS 14.5+)</li>
          <li>Opera 20+</li>
        </ul>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          On unsupported browsers, the component will be disabled or show an error message.
        </p>
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Integration with ChatInput</h2>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          Use with ChatInput for complete voice-enabled chat:
        </p>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { ChatInput, VoiceInput } from '@clarity-chat/react'

function Chat() {
  return (
    <div className="flex gap-2">
      <ChatInput
        value={input}
        onChange={setInput}
        onSubmit={handleSend}
      />
      <VoiceInput
        onTranscript={(text) => {
          setInput(text)
          handleSend(text)
        }}
        autoSubmit
      />
    </div>
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Accessibility</h2>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          VoiceInput is built with accessibility in mind:
        </p>
        <ul className="list-disc list-inside mb-4 space-y-2 text-gray-600 dark:text-gray-400">
          <li>ARIA labels and descriptions</li>
          <li>Keyboard navigation support</li>
          <li>Screen reader announcements</li>
          <li>Focus management</li>
          <li>Error announcements</li>
        </ul>
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Related</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/reference/components/chat-input" className="docs-card">
            <h3>ChatInput Component</h3>
            <p>Text input component</p>
          </a>
          <a href="/reference/components/advanced-chat-input" className="docs-card">
            <h3>AdvancedChatInput Component</h3>
            <p>Enhanced input with voice support</p>
          </a>
          <a href="/reference/hooks/use-voice-input" className="docs-card">
            <h3>useVoiceInput Hook</h3>
            <p>Voice input hook (lower level)</p>
          </a>
          <a href="/guides/mobile" className="docs-card">
            <h3>Mobile Guide</h3>
            <p>Mobile optimization guide</p>
          </a>
        </div>
      </section>

      <Pagination
        prev={{ title: 'FileUpload', href: '/reference/components/file-upload' }}
        next={{ title: 'AdvancedChatInput', href: '/reference/components/advanced-chat-input' }}
      />
    </>
  )
}
