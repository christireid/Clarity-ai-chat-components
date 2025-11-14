import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Voice Input - Clarity Chat',
  description: 'Enable voice-to-text input with real-time transcription using the Web Speech API.',
}

export default function VoiceInputClarityChatPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Component</span>
        <h1>Voice Input - Clarity Chat</h1>
        <p className="docs-lead">
          Enable voice-to-text input with real-time transcription using the Web Speech API.
        </p>
      </div>
      <section className="docs-section">
        <p className="text-sm text-muted-foreground">
          Note: Full documentation for this component is being migrated. Please refer to the storybook for interactive examples.
        </p>
      </section>
    </div>
  )
}
