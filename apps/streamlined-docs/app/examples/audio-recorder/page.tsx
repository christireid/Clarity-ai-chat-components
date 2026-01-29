import { Metadata } from 'next'
import { AudioRecorder } from '@clarity-chat/react'
import { ServerCodeBlock } from '@/components/Docs/ServerCodeBlock'

export const metadata: Metadata = {
  title: 'AudioRecorder Examples | Clarity AI Chat Components',
  description:
    'Interactive examples and code snippets for the AudioRecorder component with various configurations',
}

export default function AudioRecorderExamplesPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-16 p-6">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">AudioRecorder Examples</h1>
        <p className="text-lg text-muted-foreground">
          Interactive examples demonstrating the AudioRecorder component with various configurations,
          from basic voice recording to advanced audio processing.
        </p>
      </div>

      {/* Example 1: Basic Voice Recording */}
      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-semibold">Basic Voice Recording</h2>
          <p className="text-muted-foreground">
            Simple voice recording with default settings. Perfect for voice messages and quick audio
            notes.
          </p>
        </div>

        <AudioRecorderExample1 />

        <ServerCodeBlock
          language="tsx"
          code={`import { AudioRecorder } from '@clarity-chat/react'

function BasicVoiceRecorder() {
  const handleStop = (audioBlob: Blob, audioUrl: string) => {
    console.log('Recording complete:', audioBlob.size, 'bytes')
    // Upload to server or play audio
  }

  return (
    <AudioRecorder
      maxDuration={60}
      onStop={handleStop}
      onError={(error) => console.error('Recording error:', error)}
    />
  )
}`}
        />
      </section>

      {/* Example 2: Professional Recording */}
      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-semibold">Professional Recording with Processing</h2>
          <p className="text-muted-foreground">
            High-quality recording with noise cancellation, echo cancellation, and auto-gain control.
            Ideal for podcasts, interviews, and professional content.
          </p>
        </div>

        <AudioRecorderExample2 />

        <ServerCodeBlock
          language="tsx"
          code={`import { AudioRecorder } from '@clarity-chat/react'
import { useState } from 'react'

function ProfessionalRecorder() {
  const [audioUrl, setAudioUrl] = useState<string | null>(null)

  return (
    <div className="space-y-4">
      <AudioRecorder
        maxDuration={600}
        minDuration={3}
        outputFormat="webm"
        bitrate={192000}
        channels={2}
        enableNoiseCancellation={true}
        enableEchoCancellation={true}
        enableAutoGainControl={true}
        showWaveform={true}
        showDuration={true}
        showAmplitudeMeter={true}
        onStop={(blob, url) => {
          setAudioUrl(url)
          console.log('Recording saved:', blob.size)
        }}
        theme="dark"
      />

      {audioUrl && (
        <audio controls src={audioUrl} className="w-full" />
      )}
    </div>
  )
}`}
        />
      </section>

      {/* Example 3: Voice Activity Detection */}
      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-semibold">Voice Activity Detection</h2>
          <p className="text-muted-foreground">
            Automatically pause during silence to save space. Great for transcription, voice
            commands, and long recordings with pauses.
          </p>
        </div>

        <AudioRecorderExample3 />

        <ServerCodeBlock
          language="tsx"
          code={`import { AudioRecorder } from '@clarity-chat/react'

function VADRecorder() {
  return (
    <AudioRecorder
      maxDuration={300}
      voiceActivityDetection={true}
      silenceThreshold={0.02}
      enableNoiseCancellation={true}
      onPause={() => console.log('Paused due to silence')}
      onResume={() => console.log('Resumed on voice detection')}
      onStop={(blob) => {
        // Only contains audio when speaking
        console.log('Voice-only recording:', blob)
      }}
    />
  )
}`}
        />
      </section>

      {/* Example 4: Custom UI */}
      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-semibold">Custom UI with External Controls</h2>
          <p className="text-muted-foreground">
            Build your own UI using the component's callbacks. Hide built-in controls and create a
            fully custom recording interface.
          </p>
        </div>

        <AudioRecorderExample4 />

        <ServerCodeBlock
          language="tsx"
          code={`import { AudioRecorder } from '@clarity-chat/react'
import { useState } from 'react'

function CustomUIRecorder() {
  const [amplitude, setAmplitude] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isRecording, setIsRecording] = useState(false)

  return (
    <div className="space-y-6">
      {/* Hidden AudioRecorder */}
      <AudioRecorder
        showControls={false}
        showWaveform={false}
        showDuration={false}
        showAmplitudeMeter={false}
        onStart={() => setIsRecording(true)}
        onStop={() => setIsRecording(false)}
        onAmplitudeChange={setAmplitude}
        onDurationChange={setDuration}
      />

      {/* Custom UI */}
      <div className="rounded-lg border border-border/50 bg-card p-6 shadow-lg">
        <div className="space-y-4">
          {/* Custom Waveform */}
          <div className="h-24 bg-muted/20 rounded-lg flex items-center justify-center">
            <div
              className="h-full bg-gradient-to-t from-brand-500 to-brand-300 rounded transition-all"
              style={{ width: \`\${amplitude * 100}%\` }}
            />
          </div>

          {/* Custom Timer */}
          <div className="text-center">
            <span className="text-4xl font-mono font-bold">
              {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}
            </span>
          </div>

          {/* Custom Controls */}
          <div className="flex justify-center gap-3">
            <button className="px-6 py-3 rounded-full bg-brand-500 text-white">
              {isRecording ? 'Stop' : 'Start'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}`}
        />
      </section>

      {/* Example 5: Real-time Upload */}
      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-semibold">Real-time Chunk Upload</h2>
          <p className="text-muted-foreground">
            Process audio chunks as they're recorded. Useful for streaming transcription, real-time
            analysis, or incremental uploads of large recordings.
          </p>
        </div>

        <AudioRecorderExample5 />

        <ServerCodeBlock
          language="tsx"
          code={`import { AudioRecorder } from '@clarity-chat/react'
import { useState } from 'react'

function ChunkUploadRecorder() {
  const [chunkCount, setChunkCount] = useState(0)
  const [totalSize, setTotalSize] = useState(0)

  const uploadChunk = async (chunk: Blob) => {
    const formData = new FormData()
    formData.append('chunk', chunk)
    formData.append('index', chunkCount.toString())

    try {
      await fetch('/api/upload-chunk', {
        method: 'POST',
        body: formData,
      })
      console.log('Chunk uploaded:', chunkCount)
    } catch (error) {
      console.error('Upload failed:', error)
    }
  }

  return (
    <div className="space-y-4">
      <AudioRecorder
        maxDuration={300}
        onDataAvailable={(chunk) => {
          setChunkCount((prev) => prev + 1)
          setTotalSize((prev) => prev + chunk.size)
          uploadChunk(chunk)
        }}
        onStop={async (blob) => {
          // Finalize recording on server
          await fetch('/api/finalize-recording', {
            method: 'POST',
            body: JSON.stringify({ chunks: chunkCount }),
          })
        }}
      />

      <div className="text-sm text-muted-foreground">
        <p>Chunks uploaded: {chunkCount}</p>
        <p>Total size: {(totalSize / 1024).toFixed(2)} KB</p>
      </div>
    </div>
  )
}`}
        />
      </section>

      {/* Example 6: Transcription Integration */}
      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-semibold">Speech-to-Text Transcription</h2>
          <p className="text-muted-foreground">
            Automatically transcribe recordings using a speech-to-text API. Perfect for voice
            commands, dictation, and accessibility features.
          </p>
        </div>

        <AudioRecorderExample6 />

        <ServerCodeBlock
          language="tsx"
          code={`import { AudioRecorder } from '@clarity-chat/react'
import { useState } from 'react'

function TranscriptionRecorder() {
  const [transcript, setTranscript] = useState('')
  const [isTranscribing, setIsTranscribing] = useState(false)

  const transcribeAudio = async (audioBlob: Blob) => {
    setIsTranscribing(true)

    try {
      const formData = new FormData()
      formData.append('audio', audioBlob, 'recording.webm')

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      setTranscript(data.transcript)
    } catch (error) {
      console.error('Transcription failed:', error)
      setTranscript('Error: Transcription failed')
    } finally {
      setIsTranscribing(false)
    }
  }

  return (
    <div className="space-y-4">
      <AudioRecorder
        maxDuration={120}
        enableNoiseCancellation={true}
        voiceActivityDetection={true}
        onStop={(blob) => transcribeAudio(blob)}
      />

      {isTranscribing && (
        <div className="rounded-lg border border-border/50 bg-muted/20 p-4">
          <p className="text-sm text-muted-foreground">Transcribing audio...</p>
        </div>
      )}

      {transcript && (
        <div className="rounded-lg border border-border/50 bg-card p-4">
          <h3 className="text-sm font-semibold mb-2">Transcript:</h3>
          <p className="text-sm">{transcript}</p>
        </div>
      )}
    </div>
  )
}`}
        />
      </section>

      {/* Browser Support Note */}
      <section className="rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20 p-6">
        <h3 className="text-lg font-semibold mb-2 text-amber-900 dark:text-amber-100">
          Browser Compatibility
        </h3>
        <p className="text-sm text-amber-800 dark:text-amber-200 mb-4">
          The AudioRecorder requires the MediaRecorder API and Web Audio API. Supported in:
        </p>
        <ul className="text-sm text-amber-800 dark:text-amber-200 space-y-1 ml-6 list-disc">
          <li>Chrome/Edge 49+</li>
          <li>Firefox 25+</li>
          <li>Safari 14.1+</li>
          <li>Mobile browsers (iOS 14.5+, Android Chrome 49+)</li>
        </ul>
        <p className="text-sm text-amber-800 dark:text-amber-200 mt-4">
          <strong>Coverage:</strong> ~95% of global users
        </p>
      </section>
    </div>
  )
}

// Example Components
'use client'

function AudioRecorderExample1() {
  return (
    <div className="rounded-lg border border-border/50 bg-card p-6">
      <AudioRecorder
        maxDuration={60}
        onStop={(audioBlob: Blob, audioUrl: string) => {
          console.log('Recording complete:', audioBlob.size, 'bytes')
        }}
        onError={(error: Error) => console.error('Recording error:', error)}
      />
    </div>
  )
}

function AudioRecorderExample2() {
  const [audioUrl, setAudioUrl] = React.useState<string | null>(null)

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border/50 bg-card p-6">
        <AudioRecorder
          maxDuration={600}
          minDuration={3}
          outputFormat="webm"
          bitrate={192000}
          channels={2}
          enableNoiseCancellation={true}
          enableEchoCancellation={true}
          enableAutoGainControl={true}
          showWaveform={true}
          showDuration={true}
          showAmplitudeMeter={true}
          onStop={(blob: Blob, url: string) => {
            setAudioUrl(url)
            console.log('Recording saved:', blob.size)
          }}
          theme="dark"
        />
      </div>

      {audioUrl && (
        <div className="rounded-lg border border-border/50 bg-card p-4">
          <audio controls src={audioUrl} className="w-full" />
        </div>
      )}
    </div>
  )
}

function AudioRecorderExample3() {
  return (
    <div className="rounded-lg border border-border/50 bg-card p-6">
      <AudioRecorder
        maxDuration={300}
        voiceActivityDetection={true}
        silenceThreshold={0.02}
        enableNoiseCancellation={true}
        onPause={() => console.log('Paused due to silence')}
        onResume={() => console.log('Resumed on voice detection')}
        onStop={(blob: Blob) => {
          console.log('Voice-only recording:', blob)
        }}
      />
    </div>
  )
}

function AudioRecorderExample4() {
  const [amplitude, setAmplitude] = React.useState(0)
  const [duration, setDuration] = React.useState(0)
  const [isRecording, setIsRecording] = React.useState(false)

  return (
    <div className="space-y-6">
      {/* Hidden AudioRecorder */}
      <div className="hidden">
        <AudioRecorder
          showControls={false}
          showWaveform={false}
          showDuration={false}
          showAmplitudeMeter={false}
          onStart={() => setIsRecording(true)}
          onStop={() => {
            setIsRecording(false)
            setAmplitude(0)
          }}
          onAmplitudeChange={setAmplitude}
          onDurationChange={setDuration}
        />
      </div>

      {/* Custom UI */}
      <div className="rounded-lg border border-border/50 bg-card p-6 shadow-lg">
        <div className="space-y-6">
          {/* Custom Waveform */}
          <div className="h-24 bg-muted/20 rounded-lg flex items-center justify-center overflow-hidden">
            <div
              className="h-full bg-gradient-to-t from-brand-500 to-brand-300 rounded transition-all duration-150"
              style={{ width: `${amplitude * 100}%`, minWidth: '2px' }}
            />
          </div>

          {/* Custom Timer */}
          <div className="text-center">
            <span className="text-4xl font-mono font-bold">
              {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}
            </span>
          </div>

          {/* Status */}
          <div className="text-center text-sm text-muted-foreground">
            {isRecording ? 'Recording in progress...' : 'Ready to record'}
          </div>
        </div>
      </div>
    </div>
  )
}

function AudioRecorderExample5() {
  const [chunkCount, setChunkCount] = React.useState(0)
  const [totalSize, setTotalSize] = React.useState(0)

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border/50 bg-card p-6">
        <AudioRecorder
          maxDuration={300}
          onDataAvailable={(chunk: Blob) => {
            setChunkCount((prev) => prev + 1)
            setTotalSize((prev) => prev + chunk.size)
            console.log('Chunk available:', chunk.size)
          }}
          onStop={(blob: Blob) => {
            console.log('Recording complete:', blob.size)
          }}
        />
      </div>

      <div className="rounded-lg border border-border/50 bg-muted/20 p-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Chunks processed:</span>
            <span className="ml-2 font-mono font-semibold">{chunkCount}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Total size:</span>
            <span className="ml-2 font-mono font-semibold">
              {(totalSize / 1024).toFixed(2)} KB
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function AudioRecorderExample6() {
  const [transcript, setTranscript] = React.useState('')
  const [isTranscribing, setIsTranscribing] = React.useState(false)

  const transcribeAudio = async (audioBlob: Blob) => {
    setIsTranscribing(true)
    setTranscript('')

    // Simulate transcription (replace with actual API call)
    setTimeout(() => {
      setTranscript(
        'This is a simulated transcript. In production, this would be the actual transcribed text from your speech-to-text API.'
      )
      setIsTranscribing(false)
    }, 2000)
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border/50 bg-card p-6">
        <AudioRecorder
          maxDuration={120}
          enableNoiseCancellation={true}
          voiceActivityDetection={true}
          onStop={(blob: Blob) => transcribeAudio(blob)}
        />
      </div>

      {isTranscribing && (
        <div className="rounded-lg border border-border/50 bg-muted/20 p-4">
          <div className="flex items-center gap-3">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
            <p className="text-sm text-muted-foreground">Transcribing audio...</p>
          </div>
        </div>
      )}

      {transcript && (
        <div className="rounded-lg border border-border/50 bg-card p-4">
          <h3 className="text-sm font-semibold mb-2">Transcript:</h3>
          <p className="text-sm text-muted-foreground">{transcript}</p>
        </div>
      )}
    </div>
  )
}

import * as React from 'react'
