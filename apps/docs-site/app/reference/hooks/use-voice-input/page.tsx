import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'useVoiceInput Hook | Clarity Chat',
  description: 'Hook for voice-to-text input using Web Speech API with browser compatibility.'
}

export default function UseVoiceInputPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">useVoiceInput Hook</h1>
      <p className="text-xl text-muted-foreground mb-8">
        React hook for voice input using the Web Speech API with automatic transcription and browser compatibility detection.
      </p>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Key Features</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Browser speech recognition API integration</li>
          <li>Real-time transcription with interim results</li>
          <li>Multiple language support</li>
          <li>Continuous and single-phrase modes</li>
          <li>Auto-stop on silence detection</li>
          <li>Browser compatibility checking</li>
          <li>Error handling and fallback support</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Basic Usage</h2>
        <div className="bg-muted p-6 rounded-lg">
          <pre className="text-sm overflow-x-auto"><code>{`import { useVoiceInput } from '@clarity-chat/react'

function VoiceInput() {
  const {
    transcript,
    isListening,
    isSupported,
    startListening,
    stopListening,
    error
  } = useVoiceInput({
    language: 'en-US',
    continuous: false,
    onResult: (text) => console.log('Transcribed:', text)
  })

  if (!isSupported) {
    return <p>Voice input not supported in this browser</p>
  }

  return (
    <div>
      <button onClick={isListening ? stopListening : startListening}>
        {isListening ? 'Stop' : 'Start'} Recording
      </button>
      <p>{transcript}</p>
    </div>
  )
}`}</code></pre>
        </div>
      </section>
    </div>
  )
}
