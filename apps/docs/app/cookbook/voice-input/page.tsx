'use client'

import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { Pagination } from '@/components/Navigation/Pagination'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'


export const metadata: Metadata = {
  title: 'Voice Input Recipe | Clarity Chat Cookbook',
  description: 'Learn how to add voice-to-text input to your chat application for hands-free interaction.',
}

export default function VoiceInputPage() {
  return (
    <>
      <Breadcrumbs />

      <h1>Voice Input Recipe</h1>

      <p className="lead">
        Add voice-to-text input to your chat application for hands-free interaction.
        Perfect for mobile apps, accessibility, and modern UX.
      </p>

      <Callout type="info" title="Web Speech API">
        <p>
          Voice input uses the Web Speech API, which is supported in Chrome, Edge, and Safari.
          The component gracefully degrades on unsupported browsers.
        </p>
      </Callout>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Quick Start</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Add voice input with just a few lines:
        </p>
        
        <EnhancedCodeBlock
          language="tsx"
          code={`import { VoiceInput, ClarityChat } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

function Chat() {
  return (
    <div>
      <ClarityChat api="/api/chat" />
      <VoiceInput
        onTranscript={(text) => {
          // Text is automatically sent to chat
          sendMessage(text)
        }}
        autoSubmit
      />
    </div>
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">With useClarityChat</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Integrate voice input with custom chat UI:
        </p>
        
        <EnhancedCodeBlock
          language="tsx"
          code={`import { useClarityChat, ChatWindow, VoiceInput } from '@clarity-chat/react'

function VoiceChat() {
  const { messages, append } = useClarityChat({
    api: '/api/chat',
  })

  const handleVoiceTranscript = async (text: string) => {
    await append({ role: 'user', content: text })
  }

  return (
    <div>
      <ChatWindow
        messages={messages}
        onSendMessage={handleVoiceTranscript}
      />
      <VoiceInput
        onTranscript={handleVoiceTranscript}
        autoSubmit
        showInterim
      />
    </div>
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">With AdvancedChatInput</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Combine voice input with text input:
        </p>
        
        <EnhancedCodeBlock
          language="tsx"
          code={`import { AdvancedChatInput, VoiceInput } from '@clarity-chat/react'

function ChatInput() {
  const [message, setMessage] = useState('')

  return (
    <div className="flex gap-2">
      <AdvancedChatInput
        value={message}
        onChange={setMessage}
        onSubmit={handleSend}
      />
      <VoiceInput
        onTranscript={(text) => {
          setMessage(text)
          handleSend(text)
        }}
        autoSubmit
        size="lg"
      />
    </div>
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Interim Results</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Show real-time transcription as the user speaks:
        </p>
        
        <EnhancedCodeBlock
          language="tsx"
          code={`import { VoiceInput } from '@clarity-chat/react'
import { useState } from 'react'

function VoiceChat() {
  const [interimText, setInterimText] = useState('')

  return (
    <div>
      <VoiceInput
        onTranscript={(text) => {
          setInterimText(text)
          // Final transcript will be sent when speech ends
        }}
        showInterim
        autoSubmit
      />
      {interimText && (
        <div className="interim-text italic text-gray-500">
          {interimText}
        </div>
      )}
    </div>
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Multi-Language Support</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Support multiple languages:
        </p>
        
        <EnhancedCodeBlock
          language="tsx"
          code={`import { VoiceInput } from '@clarity-chat/react'
import { useState } from 'react'

function MultiLanguageChat() {
  const [language, setLanguage] = useState('en-US')

  const languages = [
    { code: 'en-US', name: 'English (US)' },
    { code: 'es-ES', name: 'Spanish' },
    { code: 'fr-FR', name: 'French' },
    { code: 'de-DE', name: 'German' },
    { code: 'ja-JP', name: 'Japanese' },
  ]

  return (
    <div>
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
      >
        {languages.map(lang => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
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
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Error Handling</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Handle errors gracefully:
        </p>
        
        <EnhancedCodeBlock
          language="tsx"
          code={`import { VoiceInput } from '@clarity-chat/react'

function VoiceChat() {
  return (
    <VoiceInput
      onTranscript={handleTranscript}
      onError={(error) => {
        if (error.includes('not supported')) {
          toast.error('Voice input is not supported in this browser')
        } else if (error.includes('permission')) {
          toast.error('Microphone permission denied. Please enable it in your browser settings.')
        } else if (error.includes('no-speech')) {
          toast.error('No speech detected. Please try again.')
        } else {
          toast.error('Voice input error: ' + error)
        }
      }}
      autoSubmit
    />
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Browser Compatibility</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Check browser support before showing voice input:
        </p>
        
        <EnhancedCodeBlock
          language="tsx"
          code={`import { VoiceInput } from '@clarity-chat/react'
import { useState, useEffect } from 'react'

function VoiceChat() {
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    // Check if Web Speech API is supported
    setIsSupported(
      'webkitSpeechRecognition' in window ||
      'SpeechRecognition' in window
    )
  }, [])

  if (!isSupported) {
    return (
      <div className="text-gray-500">
        Voice input is not supported in this browser.
        Please use Chrome, Edge, or Safari.
      </div>
    )
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
        <h2 className="text-2xl font-bold mb-4">Mobile Optimization</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Optimize for mobile devices:
        </p>
        
        <EnhancedCodeBlock
          language="tsx"
          code={`import { VoiceInput } from '@clarity-chat/react'

function MobileVoiceChat() {
  return (
    <VoiceInput
      onTranscript={handleTranscript}
      autoSubmit
      size="lg" // Larger button for mobile
      showTooltip
      tooltipText="Tap to speak"
      className="fixed bottom-4 right-4 rounded-full shadow-lg"
    />
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Best Practices</h2>
        <ul className="list-disc list-inside mb-4 space-y-2 text-gray-600 dark:text-gray-400">
          <li><strong>Request permission early</strong> - Ask for microphone permission on first use</li>
          <li><strong>Show visual feedback</strong> - Use animations to indicate listening state</li>
          <li><strong>Handle errors gracefully</strong> - Provide clear error messages</li>
          <li><strong>Support multiple languages</strong> - Allow users to select their language</li>
          <li><strong>Show interim results</strong> - Display real-time transcription</li>
          <li><strong>Auto-submit on speech end</strong> - Improve UX by automatically sending</li>
          <li><strong>Check browser support</strong> - Hide voice input on unsupported browsers</li>
        </ul>
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Related</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/reference/components/voice-input" className="docs-card">
            <h3>VoiceInput Component</h3>
            <p>Voice input component reference</p>
          </a>
          <a href="/reference/hooks/use-voice-input" className="docs-card">
            <h3>useVoiceInput Hook</h3>
            <p>Voice input hook (lower level)</p>
          </a>
          <a href="/cookbook/multi-modal-chat" className="docs-card">
            <h3>Multi-Modal Chat Recipe</h3>
            <p>Combine voice with other media</p>
          </a>
          <a href="/guides/mobile" className="docs-card">
            <h3>Mobile Guide</h3>
            <p>Mobile optimization guide</p>
          </a>
        </div>
      </section>

      <Pagination
        prev={{ title: 'Multi-Modal Chat', href: '/cookbook/multi-modal-chat' }}
        next={{ title: 'Custom Tool Integration', href: '/cookbook/custom-tool-integration' }}
      />
    </>
  )
}
