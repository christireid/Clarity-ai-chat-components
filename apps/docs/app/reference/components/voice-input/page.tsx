'use client'

import { useState, useEffect } from 'react'
import { ToastProvider, VoiceInput } from '@clarity-chat/react/internal'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Pagination } from '@/components/Navigation/Pagination'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { ComponentPreview } from '@/components/Demo/ComponentPreview'
import { ViewInStorybook } from '@/components/Links/StorybookLink'
import { ScrollReveal, ScrollRevealItem } from '@/components/UI/ScrollReveal'
import { Mic, MicOff } from 'lucide-react'

function BasicVoiceDemo() {
  const [transcript, setTranscript] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(true)

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      !('webkitSpeechRecognition' in window) &&
      !('SpeechRecognition' in window)
    ) {
      setIsSupported(false)
    }
  }, [])

  if (!isSupported) {
    return (
      <div className="w-full max-w-md p-6 border border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-900 rounded-lg text-center">
        <p className="text-yellow-800 dark:text-yellow-200 text-sm">
          Voice input is not supported in this browser. Please try Chrome, Edge,
          or Safari.
        </p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md p-6 border border-border rounded-lg bg-background flex flex-col items-center gap-4">
      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground">
          {isListening ? 'Listening...' : 'Click to speak'}
        </p>
        <div className="min-h-[60px] p-3 rounded-md bg-muted/50 w-full text-sm">
          {transcript || (
            <span className="text-muted-foreground/50 italic">
              Transcript will appear here...
            </span>
          )}
        </div>
      </div>

      <VoiceInput
        onTranscript={setTranscript}
        onStart={() => setIsListening(true)}
        onStop={() => setIsListening(false)}
        showInterim
      />
    </div>
  )
}

const voiceInputProps: Prop[] = [
  {
    name: 'onTranscript',
    type: '(transcript: string) => void',
    required: true,
    description:
      'Callback when transcript is finalized (or on interim results if showInterim is true).',
  },
  {
    name: 'lang',
    type: 'string',
    default: '"en-US"',
    description:
      'Language code for speech recognition (e.g., "en-US", "es-ES", "fr-FR").',
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
    <ToastProvider>
      <div className="docs-content">
        <Breadcrumbs />

        <ScrollReveal>
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-brand-500 to-brand-600 bg-clip-text text-transparent">
              VoiceInput
            </h1>

            <p className="text-xl text-text-secondary leading-relaxed">
              Enable voice-to-text input with real-time transcription using the
              Web Speech API. Perfect for hands-free chat, mobile interfaces,
              and accessibility.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <Callout type="info" title="Browser Support" className="mb-8">
            <p>
              VoiceInput uses the Web Speech API, which is supported in Chrome,
              Edge, and Safari. The component gracefully degrades on unsupported
              browsers.
            </p>
          </Callout>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <ViewInStorybook component="VoiceInput" />
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <h2 id="basic-usage">Basic Usage</h2>
          <p className="mb-4">
            The simplest way to use the component is to provide an{' '}
            <code>onTranscript</code> callback:
          </p>

          <ComponentPreview
            title="Voice Input Demo"
            description="Click the microphone to start speaking."
            code={`import { useState } from 'react'
import { VoiceInput } from '@clarity-chat/react/internal'

function VoiceDemo() {
  const [transcript, setTranscript] = useState('')
  const [isListening, setIsListening] = useState(false)

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="p-3 bg-muted rounded w-full min-h-[60px]">
        {transcript || 'Transcript will appear here...'}
      </div>
      
      <VoiceInput
        onTranscript={setTranscript}
        onStart={() => setIsListening(true)}
        onStop={() => setIsListening(false)}
        showInterim
      />
    </div>
  )
}`}
          >
            <BasicVoiceDemo />
          </ComponentPreview>
        </ScrollReveal>

        <ScrollReveal delay={0.4}>
          <section className="my-12">
            <h2 className="text-2xl font-bold mb-4">Interactive Playground</h2>
            <p className="mb-6 text-muted-foreground">
              Try configuring the VoiceInput component:
            </p>
            <CodePlayground
              code={`import { VoiceInput } from '@clarity-chat/react/internal'
import { useState } from 'react'

function Example() {
  const [transcript, setTranscript] = useState('')

  return (
    <div className="p-4 border rounded-lg bg-background">
      <div className="flex items-center gap-4 mb-4">
        <VoiceInput
          onTranscript={(text) => setTranscript(text)}
          showInterim
          autoSubmit={false}
          lang="en-US"
        />
        <span className="text-sm text-muted-foreground">
          Click microphone to speak
        </span>
      </div>
      
      {transcript && (
        <div className="p-3 bg-muted rounded-md text-sm">
          <strong>Transcript:</strong> {transcript}
        </div>
      )}
    </div>
  )
}

render(<Example />)`}
            />
          </section>
        </ScrollReveal>

        <ScrollReveal delay={0.5}>
          <h2 id="examples">Examples</h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">With Auto-Submit</h3>
              <p className="mb-4 text-muted-foreground">
                Automatically submit the form or send message when speech ends
                (silence detected).
              </p>
              <EnhancedCodeBlock
                language="tsx"
                code={`import { VoiceInput } from '@clarity-chat/react/internal'

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
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">
                Multi-Language Support
              </h3>
              <p className="mb-4 text-muted-foreground">
                Support different languages by passing the <code>lang</code>{' '}
                prop.
              </p>
              <EnhancedCodeBlock
                language="tsx"
                code={`import { VoiceInput } from '@clarity-chat/react/internal'

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
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Custom Styling</h3>
              <p className="mb-4 text-muted-foreground">
                Customize the appearance with different variants, sizes, and
                icons.
              </p>
              <EnhancedCodeBlock
                language="tsx"
                code={`import { VoiceInput } from '@clarity-chat/react/internal'
import { Mic, MicOff } from 'lucide-react'

function Chat() {
  return (
    <VoiceInput
      onTranscript={handleTranscript}
      size="lg"
      variant="primary"
      icon={<Mic className="w-5 h-5" />}
      listeningIcon={<MicOff className="w-5 h-5" />}
      className="rounded-full shadow-lg"
    />
  )
}`}
              />
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.6}>
          <h2 id="props">Props</h2>
          <PropsTable props={voiceInputProps} />
        </ScrollReveal>

        <ScrollReveal delay={0.7}>
          <h2 id="features">Features</h2>
          <ul className="mb-8">
            <li>
              <strong>One-click voice recording</strong> - Simple button
              interface
            </li>
            <li>
              <strong>Real-time transcription</strong> - See text as you speak
            </li>
            <li>
              <strong>Visual feedback</strong> - Pulse animation during
              recording
            </li>
            <li>
              <strong>Auto-submit</strong> - Automatically send when speech ends
            </li>
            <li>
              <strong>Multi-language support</strong> - Supports 100+ languages
            </li>
            <li>
              <strong>Error handling</strong> - Graceful degradation on
              unsupported browsers
            </li>
            <li>
              <strong>Accessibility</strong> - Full keyboard and screen reader
              support
            </li>
          </ul>
        </ScrollReveal>

        <ScrollReveal delay={0.8}>
          <h2 id="integration">Integration with ChatInput</h2>
          <p className="mb-4">
            VoiceInput works seamlessly alongside ChatInput for a complete
            multi-modal experience:
          </p>
          <EnhancedCodeBlock
            language="tsx"
            code={`import { ChatInput, VoiceInput } from '@clarity-chat/react/internal'

function Chat() {
  const [input, setInput] = useState('')

  return (
    <div className="flex gap-2 items-center">
      <ChatInput
        value={input}
        onChange={setInput}
        onSubmit={handleSend}
        className="flex-1"
      />
      <VoiceInput
        onTranscript={(text) => {
          setInput(text)
          // Optional: Auto-send
          // handleSend(text)
        }}
        showInterim
      />
    </div>
  )
}`}
          />
        </ScrollReveal>

        <ScrollReveal delay={0.9}>
          <h2 id="related">Related</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="/reference/components/chat-input"
              className="p-4 border rounded-lg hover:border-brand-500 transition-colors"
            >
              <h3 className="font-semibold mb-1">ChatInput Component</h3>
              <p className="text-sm text-muted-foreground">
                Text input component
              </p>
            </a>
            <a
              href="/reference/components/advanced-chat-input"
              className="p-4 border rounded-lg hover:border-brand-500 transition-colors"
            >
              <h3 className="font-semibold mb-1">
                AdvancedChatInput Component
              </h3>
              <p className="text-sm text-muted-foreground">
                Enhanced input with voice support
              </p>
            </a>
          </div>
        </ScrollReveal>

        <Pagination
          prev={{
            title: 'FileUpload',
            href: '/reference/components/file-upload',
          }}
          next={{
            title: 'AdvancedChatInput',
            href: '/reference/components/advanced-chat-input',
          }}
        />
      </div>
    </ToastProvider>
  )
}
