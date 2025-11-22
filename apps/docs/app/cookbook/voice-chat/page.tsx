import { Metadata } from 'next'
import { Callout } from '@/components/MDX/Callout'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { CodeBlock } from '@/components/MDX/CodeBlock'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Cookbook: Voice-Enabled Chat',
  description:
    'Add speech-to-text and optional text-to-speech to your chat app with Clarity Chat.',
}

export default function VoiceChatRecipePage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Cookbook</span>
        <h1>Voice-Enabled Chat</h1>
        <p className="docs-lead">
          Allow users to speak instead of type and play responses aloud. Perfect
          for accessibility, mobile users, or hands-free productivity.
        </p>
      </div>

      <section className="docs-section">
        <h2>What You’ll Build</h2>
        <ul>
          <li>🎙️ <strong>Speech-to-text</strong> via the <code>VoiceInput</code> component</li>
          <li>🧠 <strong>Real-time transcripts</strong> with interim feedback</li>
          <li>🔁 <strong>Auto-submit</strong> or manual confirm flows</li>
          <li>🔊 <strong>Optional text-to-speech</strong> playback for responses</li>
        </ul>
        <Callout type="info">
          Voice features rely on the browser’s Web Speech APIs. Test in Chrome or
          Edge. Safari supports dictation with permission prompts.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>1. Basic Voice Input</h2>
        <CodeBlock
          language="tsx"
          code={`import {
  ChatWindow,
  VoiceInput,
  useChat,
} from '@clarity-chat/react'

export default function VoiceAssistant() {
  const chat = useChat({ id: 'voice', api: '/api/chat/voice' })

  return (
    <ChatWindow
      messages={chat.messages}
      onSendMessage={chat.handleSubmit}
      footer={
        <div className="flex items-center gap-3">
          <VoiceInput
            onTranscript={(text) => chat.handleSubmit(text)}
            autoSubmit
            showInterim
            tooltipText="Press and speak"
          />
          <button
            onClick={() => chat.handleSubmit(chat.input)}
            className="btn btn-primary"
          >
            Send
          </button>
        </div>
      }
    />
  )
}
`}
        />
      </section>

      <section className="docs-section">
        <h2>2. Manual Confirmation &amp; Multi-Language</h2>
        <p>
          Disable <code>autoSubmit</code> if you want the user to review the
          transcript first. You can also change the language locale.
        </p>
        <CodeBlock
          language="tsx"
          code={`function VoiceFooter({ onSubmit }: { onSubmit: (text: string) => void }) {
  const [pending, setPending] = React.useState('')

  return (
    <div className="flex items-center gap-3">
      <VoiceInput
        onTranscript={(text) => setPending(text)}
        autoSubmit={false}
        lang="es-ES"
        tooltipText="Habla para dictar"
      />
      <button
        disabled={!pending}
        onClick={() => {
          onSubmit(pending)
          setPending('')
        }}
        className="btn btn-primary"
      >
        Enviar
      </button>
      <button
        disabled={!pending}
        onClick={() => setPending('')}
        className="btn btn-ghost"
      >
        Clear
      </button>
    </div>
  )
}
`}
        />
      </section>

      <section className="docs-section">
        <h2>3. Text-to-Speech Playback</h2>
        <p>Use the Web Speech API and listen for assistant messages to narrate them.</p>
        <CodeBlock
          language="tsx"
          code={`import { useEffect } from 'react'
import type { Message } from '@clarity-chat/types'

function useSpeechSynthesis(messages: Message[], enabled: boolean) {
  useEffect(() => {
    if (!enabled) return
    const latest = messages[messages.length - 1]
    if (!latest || latest.role !== 'assistant') return
    if (!('speechSynthesis' in window)) return

    const utterance = new SpeechSynthesisUtterance(latest.content)
    utterance.rate = 1.05
    utterance.pitch = 1
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
  }, [messages, enabled])
}

export function VoiceAssistant() {
  const chat = useChat({ id: 'voice' })
  const [ttsEnabled, setTtsEnabled] = React.useState(true)

  useSpeechSynthesis(chat.messages, ttsEnabled)

  return (
    <ChatWindow
      messages={chat.messages}
      onSendMessage={chat.handleSubmit}
      footer={
        <div className="flex items-center gap-3">
          <VoiceInput onTranscript={chat.handleSubmit} autoSubmit />
          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            <input
              type="checkbox"
              checked={ttsEnabled}
              onChange={(e) => setTtsEnabled(e.target.checked)}
            />
            Play responses aloud
          </label>
        </div>
      }
    />
  )
}
`}
        />
      </section>

      <section className="docs-section">
        <h2>UX Tips</h2>
        <ul>
          <li>Show a transcript preview while recording so users know they’re being heard</li>
          <li>Provide a manual submit option for noisy environments</li>
          <li>Allow users to toggle TTS off (avoid reading sensitive content aloud)</li>
          <li>Log <code>onError</code> results to understand microphone/browser issues</li>
        </ul>
      </section>

      <section className="docs-section">
        <Callout type="success">
          Related recipes: <Link href="/cookbook/multi-modal-chat">Multi-Modal Chat</Link>{' '}
          for attaching voice transcripts as files, <Link href="/cookbook/analytics-tracking">Analytics Tracking</Link>{' '}
          to measure voice usage.
        </Callout>
      </section>
    </div>
  )
}

