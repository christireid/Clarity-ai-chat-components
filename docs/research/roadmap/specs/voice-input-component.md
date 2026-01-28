# Voice Input Component Specification

## Overview

Voice-to-text input component for AI chat interfaces with audio visualization and real-time
transcription. This component enables users to interact with AI chat applications through voice,
providing a hands-free alternative to text input with rich visual feedback during recording.

## Inspiration

### ElevenLabs UI - Audio Visualization Excellence

- **Bar Visualizer**: Real-time frequency visualization with state-based animations (idle,
  listening, speaking)
- **Live Waveform**: Real-time audio waveform display with low-latency rendering
- **Agent Orb**: Animated SVG orb synchronized with audio states
- **Technical Implementation**: WebSocket data synchronization, OfflineAudioContext for non-blocking
  analysis, GPU-accelerated animations
- **Performance**: Optimized for streaming audio with minimal latency

### shadcn Chatbot Kit - Voice Input UX

- **Voice Input Features**: Built-in audio transcription support with visualizer
- **Audio Visualizer Component**: Visual feedback during recording
- **Integration**: Seamless integration with message input component
- **File Handling**: Comprehensive approach to media handling
- **UX Details**: Thoughtful interaction patterns for voice recording

### Prompt Kit - Message Input Patterns

- **Multi-line Textarea**: Auto-resizing with smooth transitions
- **Action Buttons**: Clean toolbar design for multiple input modes
- **State Management**: Loading, disabled, and error states
- **Keyboard Interactions**: Intuitive keyboard shortcuts

### Best Practices

- **Web Audio API**: Modern browser audio processing
- **MediaRecorder API**: Native audio recording capabilities
- **Web Speech API**: Browser-native speech recognition
- **Whisper API**: High-accuracy speech-to-text alternative
- **Accessibility**: Voice input as alternative input method

## User Stories

1. **As a user, I want to speak my message instead of typing**
   - Acceptance: Click microphone button, speak, and see transcript
   - Benefit: Faster input, hands-free operation, accessibility

2. **As a user, I want to see visual feedback while recording**
   - Acceptance: Real-time waveform or bars show audio levels
   - Benefit: Confirmation that audio is being captured

3. **As a user, I want to pause/resume recording**
   - Acceptance: Pause button maintains recording context
   - Benefit: Handle interruptions without losing content

4. **As a user, I want to cancel recording**
   - Acceptance: Cancel button discards audio and transcript
   - Benefit: Easy recovery from mistakes

5. **As a user, I want to see transcription in real-time (if available)**
   - Acceptance: Partial transcripts appear as I speak
   - Benefit: Immediate feedback, can correct mid-recording

6. **As a user, I want to know when I've reached maximum duration**
   - Acceptance: Visual warning near limit, auto-stop at max
   - Benefit: No unexpected cutoffs, clear boundaries

7. **As a developer, I want to customize the visualization style**
   - Acceptance: Props for waveform, bars, or circular visualizations
   - Benefit: Match app design system

8. **As a developer, I want to handle errors gracefully**
   - Acceptance: Clear error messages for permissions, API failures
   - Benefit: Better user experience, easier debugging

## Component API

### Props

```typescript
interface VoiceInputProps {
  // Core functionality
  onTranscript: (text: string) => void
  onError?: (error: VoiceInputError) => void

  // Visualization
  showVisualization?: boolean // default: true
  visualizationType?: 'waveform' | 'bars' | 'circular' | 'orb' // default: 'waveform'
  visualizationHeight?: number // default: 48 (in pixels)

  // Behavior
  autoSend?: boolean // Auto-send on recording end, default: false
  maxDuration?: number // Max recording duration in seconds, default: 60
  language?: string // Speech recognition language, default: 'en-US'
  continuous?: boolean // Continuous recognition, default: false
  interimResults?: boolean // Show partial results, default: true

  // Transcription provider
  provider?: 'browser' | 'whisper' | 'custom' // default: 'browser'
  whisperApiKey?: string // Required if provider is 'whisper'
  customTranscriber?: (blob: Blob) => Promise<string> // Custom implementation

  // Styling
  className?: string
  variant?: 'default' | 'floating' | 'inline' | 'minimal' // default: 'default'
  size?: 'sm' | 'md' | 'lg' // default: 'md'
  theme?: 'light' | 'dark' | 'auto' // default: 'auto'

  // Advanced callbacks
  onStart?: () => void
  onStop?: () => void
  onPause?: () => void
  onResume?: () => void
  onVolumeChange?: (volume: number) => void // 0-100
  onDurationChange?: (duration: number) => void // in seconds
  onInterimTranscript?: (text: string) => void // Partial results

  // Permissions
  onPermissionDenied?: () => void
  onPermissionGranted?: () => void

  // State control (for controlled component)
  isRecording?: boolean
  onRecordingChange?: (isRecording: boolean) => void
}

interface VoiceInputError {
  code:
    | 'PERMISSION_DENIED'
    | 'DEVICE_NOT_FOUND'
    | 'TRANSCRIPTION_FAILED'
    | 'NETWORK_ERROR'
    | 'TIMEOUT'
  message: string
  originalError?: Error
}
```

### Usage Examples

#### Basic Usage

```tsx
import { VoiceInput } from '@clarity-chat/react'

function Chat() {
  const handleTranscript = (text: string) => {
    // Send message or update input
    sendMessage(text)
  }

  return <VoiceInput onTranscript={handleTranscript} showVisualization />
}
```

#### With Message Input Integration

```tsx
import { MessageInput, VoiceInput } from '@clarity-chat/react'

function ChatInput() {
  const [input, setInput] = useState('')

  const handleTranscript = (text: string) => {
    // Append transcript to existing input
    setInput((prev) => (prev ? `${prev} ${text}` : text))
  }

  return (
    <MessageInput
      value={input}
      onChange={setInput}
      onSubmit={handleSubmit}
      actions={<VoiceInput onTranscript={handleTranscript} variant="inline" size="sm" />}
    />
  )
}
```

#### Advanced Usage with Whisper API

```tsx
<VoiceInput
  onTranscript={handleTranscript}
  onError={handleError}
  provider="whisper"
  whisperApiKey={process.env.WHISPER_API_KEY}
  visualizationType="orb"
  maxDuration={120}
  language="en-US"
  autoSend={false}
  continuous={true}
  interimResults={true}
  onStart={() => console.log('Recording started')}
  onStop={() => console.log('Recording stopped')}
  onVolumeChange={(vol) => console.log('Volume:', vol)}
  onInterimTranscript={(text) => console.log('Partial:', text)}
  onPermissionDenied={() => showPermissionInstructions()}
/>
```

#### Controlled Component

```tsx
function ControlledVoiceInput() {
  const [isRecording, setIsRecording] = useState(false)

  return (
    <>
      <VoiceInput
        isRecording={isRecording}
        onRecordingChange={setIsRecording}
        onTranscript={handleTranscript}
      />

      {/* External controls */}
      <Button onClick={() => setIsRecording(!isRecording)}>
        {isRecording ? 'Stop' : 'Start'} Recording
      </Button>
    </>
  )
}
```

#### Custom Transcription Provider

```tsx
import { VoiceInput } from '@clarity-chat/react'

const customTranscriber = async (audioBlob: Blob): Promise<string> => {
  // Send to your own transcription service
  const formData = new FormData()
  formData.append('audio', audioBlob)

  const response = await fetch('/api/transcribe', {
    method: 'POST',
    body: formData,
  })

  const { transcript } = await response.json()
  return transcript
}

;<VoiceInput
  provider="custom"
  customTranscriber={customTranscriber}
  onTranscript={handleTranscript}
/>
```

## Visual Design

### States

1. **Idle**: Ready to record
   - Microphone icon in neutral color
   - Hover effect shows interactivity
   - No visualization active

2. **Requesting Permission**: Waiting for microphone access
   - Loading indicator
   - Help text about permissions
   - Disable button during request

3. **Recording**: Active recording with visualization
   - Microphone icon in active/primary color
   - Pulsing or animated indicator
   - Live audio visualization
   - Duration timer
   - Stop button visible

4. **Paused**: Recording paused, can resume
   - Pause icon
   - Frozen visualization
   - Resume and stop buttons visible
   - Duration timer paused

5. **Processing**: Transcribing audio
   - Loading spinner
   - "Processing..." or "Transcribing..." text
   - Disabled interaction

6. **Success**: Transcription complete
   - Brief success indicator
   - Transition to idle state
   - Transcript delivered to parent

7. **Error**: Error state
   - Error icon and message
   - Retry button if applicable
   - Help text for common issues

### Layout Variants

#### Default Variant

```
┌─────────────────────────────┐
│  [🎤] Press to speak        │  <- Idle
└─────────────────────────────┘

┌─────────────────────────────┐
│  [⏹] Recording... 0:15      │  <- Recording
│  ▁▃▅▇█▇▅▃▁▃▅▇ (waveform)   │
│  [❚❚ Pause] [⏹ Stop]       │
└─────────────────────────────┘

┌─────────────────────────────┐
│  [⏳] Transcribing...        │  <- Processing
└─────────────────────────────┘

┌─────────────────────────────┐
│  [❌] Permission denied      │  <- Error
│  [Retry] [Help]             │
└─────────────────────────────┘
```

#### Floating Variant

```
        ┌─────┐
        │ 🎤  │  <- Floating button
        └─────┘

        ┌─────┐
        │ ⏹  │  <- Recording (red background)
        └─────┘
         0:15
       ▁▃▅▇█▇▅
```

#### Inline Variant (for message input integration)

```
┌─────────────────────────────────────────┐
│ Type your message...              [🎤] │  <- Inline button
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ ▁▃▅▇█▇▅▃▁▃▅▇ Recording... 0:15    [⏹] │  <- Recording state
└─────────────────────────────────────────┘
```

#### Minimal Variant

```
[🎤]  <- Just the icon button

[⏹] 0:15  <- Recording (minimal)
```

### Visualization Types

#### Waveform

```
▁▃▅▇█▇▅▃▁▃▅▇▁▃▅▇█▇▅▃▁
```

- Smooth continuous line showing audio amplitude
- Most detailed visual feedback
- Higher performance cost

#### Bars

```
█ ▇ █ ▅ ▇ █ ▃ ▅ ▇ █ ▅ ▇ █
```

- Vertical bars representing frequency bands
- Good balance of detail and performance
- Inspired by ElevenLabs Bar Visualizer

#### Circular

```
    ▇▃▅
  ▇     ▅
 █   🎤   █
  ▅     ▇
    ▃▅▇
```

- Circular arrangement of bars around microphone
- Visually striking, modern look
- Good for floating/centered layouts

#### Orb

```
    .-~~~-.
  .' O   O `.
 /   ~~~~~   \
|  (  ◡  )   |
 \   '---'  /
  `.____.-'
```

- Animated blob/orb that pulses and morphs
- Inspired by ElevenLabs Agent Orb
- Most visually appealing but highest performance cost
- GPU-accelerated animations

### Styling (from shadcn/ui AI + Ant Design X + ElevenLabs UI)

```css
/* Button styling */
.voice-input-button {
  background: var(--primary);
  border-radius: 9999px; /* Fully rounded */
  padding: 12px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.voice-input-button:hover {
  background: var(--primary-hover);
  transform: scale(1.05);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.voice-input-button:active {
  transform: scale(0.95);
}

.voice-input-button.recording {
  background: var(--destructive);
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

/* Container styling */
.voice-input-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 8px;
}

/* Visualization */
.voice-visualization {
  height: 48px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
}

.voice-visualization-bar {
  width: 3px;
  background: var(--primary);
  border-radius: 9999px;
  transition: height 0.1s ease-out;
}

.voice-visualization-waveform {
  width: 100%;
  height: 100%;
}

.voice-visualization-orb {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--primary);
  filter: blur(8px);
  animation: morph 3s ease-in-out infinite;
}

@keyframes morph {
  0%,
  100% {
    border-radius: 50% 50% 50% 50%;
  }
  25% {
    border-radius: 60% 40% 50% 50%;
  }
  50% {
    border-radius: 50% 60% 40% 50%;
  }
  75% {
    border-radius: 50% 50% 60% 40%;
  }
}

/* Timer and controls */
.voice-input-timer {
  font-variant-numeric: tabular-nums;
  font-size: 0.875rem;
  color: var(--muted-foreground);
}

.voice-input-controls {
  display: flex;
  gap: 8px;
  align-items: center;
}

/* States */
.voice-input-error {
  color: var(--destructive);
  font-size: 0.875rem;
  text-align: center;
}

.voice-input-processing {
  color: var(--muted-foreground);
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Permission prompt */
.voice-input-permission {
  text-align: center;
  color: var(--muted-foreground);
  font-size: 0.875rem;
  max-width: 300px;
}

/* Responsive sizing */
.voice-input-sm {
  padding: 8px;
}

.voice-input-sm .voice-input-button {
  padding: 8px;
}

.voice-input-sm .voice-visualization {
  height: 32px;
}

.voice-input-lg {
  padding: 24px;
}

.voice-input-lg .voice-input-button {
  padding: 16px;
}

.voice-input-lg .voice-visualization {
  height: 64px;
}
```

## Implementation Details

### File Structure

```
packages/react/src/components/voice-input/
├── voice-input.tsx                 # Main component
├── voice-input.test.tsx            # Unit tests
├── voice-input.stories.tsx         # Storybook stories
├── voice-visualizer.tsx            # Visualization component
├── voice-visualizer-waveform.tsx   # Waveform visualizer
├── voice-visualizer-bars.tsx       # Bar visualizer
├── voice-visualizer-circular.tsx   # Circular visualizer
├── voice-visualizer-orb.tsx        # Orb visualizer
├── use-voice-recording.ts          # Hook for recording logic
├── use-speech-recognition.ts       # Hook for speech recognition
├── audio-processor.ts              # Audio processing utilities
├── transcription-provider.ts       # Transcription provider abstraction
├── types.ts                        # TypeScript types
├── constants.ts                    # Constants and defaults
├── index.ts                        # Exports
└── README.md                       # Component documentation
```

### Core Functionality

#### 1. Audio Recording (MediaRecorder API)

```typescript
// use-voice-recording.ts
import { useState, useRef, useCallback } from 'react'

interface UseVoiceRecordingOptions {
  maxDuration?: number
  onStart?: () => void
  onStop?: (blob: Blob) => void
  onPause?: () => void
  onResume?: () => void
  onVolumeChange?: (volume: number) => void
  onDurationChange?: (duration: number) => void
  onError?: (error: Error) => void
}

export function useVoiceRecording(options: UseVoiceRecordingOptions = {}) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)

  const mediaRecorder = useRef<MediaRecorder | null>(null)
  const audioContext = useRef<AudioContext | null>(null)
  const analyser = useRef<AnalyserNode | null>(null)
  const stream = useRef<MediaStream | null>(null)
  const durationInterval = useRef<NodeJS.Timeout | null>(null)
  const volumeInterval = useRef<NodeJS.Timeout | null>(null)

  const startRecording = useCallback(async () => {
    try {
      // Request microphone access
      stream.current = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      })

      // Set up MediaRecorder
      mediaRecorder.current = new MediaRecorder(stream.current, {
        mimeType: 'audio/webm;codecs=opus',
      })

      // Set up audio analysis for volume tracking
      audioContext.current = new AudioContext()
      analyser.current = audioContext.current.createAnalyser()
      const source = audioContext.current.createMediaStreamSource(stream.current)
      source.connect(analyser.current)

      const chunks: Blob[] = []

      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data)
        }
      }

      mediaRecorder.current.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' })
        setAudioBlob(blob)
        options.onStop?.(blob)
        cleanup()
      }

      mediaRecorder.current.start()
      setIsRecording(true)
      options.onStart?.()

      // Start duration tracking
      durationInterval.current = setInterval(() => {
        setDuration((prev) => {
          const newDuration = prev + 1
          options.onDurationChange?.(newDuration)

          // Auto-stop at max duration
          if (options.maxDuration && newDuration >= options.maxDuration) {
            stopRecording()
          }

          return newDuration
        })
      }, 1000)

      // Start volume tracking
      volumeInterval.current = setInterval(() => {
        if (analyser.current) {
          const dataArray = new Uint8Array(analyser.current.frequencyBinCount)
          analyser.current.getByteFrequencyData(dataArray)
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length
          const vol = Math.min(100, Math.round((average / 255) * 100))
          setVolume(vol)
          options.onVolumeChange?.(vol)
        }
      }, 100)
    } catch (error) {
      options.onError?.(error as Error)
      cleanup()
    }
  }, [options])

  const stopRecording = useCallback(() => {
    if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
      mediaRecorder.current.stop()
      setIsRecording(false)
      setIsPaused(false)
    }
  }, [])

  const pauseRecording = useCallback(() => {
    if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
      mediaRecorder.current.pause()
      setIsPaused(true)
      options.onPause?.()

      // Pause duration tracking
      if (durationInterval.current) {
        clearInterval(durationInterval.current)
      }
    }
  }, [options])

  const resumeRecording = useCallback(() => {
    if (mediaRecorder.current && mediaRecorder.current.state === 'paused') {
      mediaRecorder.current.resume()
      setIsPaused(false)
      options.onResume?.()

      // Resume duration tracking
      durationInterval.current = setInterval(() => {
        setDuration((prev) => {
          const newDuration = prev + 1
          options.onDurationChange?.(newDuration)

          if (options.maxDuration && newDuration >= options.maxDuration) {
            stopRecording()
          }

          return newDuration
        })
      }, 1000)
    }
  }, [options, stopRecording])

  const cleanup = () => {
    if (stream.current) {
      stream.current.getTracks().forEach((track) => track.stop())
    }
    if (audioContext.current) {
      audioContext.current.close()
    }
    if (durationInterval.current) {
      clearInterval(durationInterval.current)
    }
    if (volumeInterval.current) {
      clearInterval(volumeInterval.current)
    }
    setDuration(0)
    setVolume(0)
  }

  return {
    isRecording,
    isPaused,
    duration,
    volume,
    audioBlob,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    analyser: analyser.current,
    stream: stream.current,
  }
}
```

#### 2. Speech Recognition (Multiple Providers)

```typescript
// transcription-provider.ts
export interface TranscriptionProvider {
  transcribe(audioBlob: Blob, options?: TranscriptionOptions): Promise<string>
  startContinuous?(options?: ContinuousOptions): void
  stopContinuous?(): void
  supportsContinuous: boolean
}

export interface TranscriptionOptions {
  language?: string
  interimResults?: boolean
}

export interface ContinuousOptions extends TranscriptionOptions {
  onInterimResult?: (text: string) => void
  onFinalResult?: (text: string) => void
  onError?: (error: Error) => void
}

// Browser provider (Web Speech API)
export class BrowserTranscriptionProvider implements TranscriptionProvider {
  supportsContinuous = true
  private recognition: SpeechRecognition | null = null

  async transcribe(audioBlob: Blob, options: TranscriptionOptions = {}): Promise<string> {
    // Web Speech API doesn't support blob transcription
    // This would need to play the audio back, which is not ideal
    throw new Error('Browser provider requires continuous mode')
  }

  startContinuous(options: ContinuousOptions = {}): void {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      throw new Error('Speech recognition not supported in this browser')
    }

    this.recognition = new SpeechRecognition()
    this.recognition.continuous = true
    this.recognition.interimResults = options.interimResults ?? true
    this.recognition.lang = options.language || 'en-US'

    this.recognition.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript

        if (event.results[i].isFinal) {
          options.onFinalResult?.(transcript)
        } else if (options.interimResults) {
          options.onInterimResult?.(transcript)
        }
      }
    }

    this.recognition.onerror = (event) => {
      options.onError?.(new Error(event.error))
    }

    this.recognition.start()
  }

  stopContinuous(): void {
    if (this.recognition) {
      this.recognition.stop()
      this.recognition = null
    }
  }
}

// Whisper provider
export class WhisperTranscriptionProvider implements TranscriptionProvider {
  supportsContinuous = false

  constructor(private apiKey: string) {}

  async transcribe(audioBlob: Blob, options: TranscriptionOptions = {}): Promise<string> {
    const formData = new FormData()
    formData.append('file', audioBlob, 'audio.webm')
    formData.append('model', 'whisper-1')

    if (options.language) {
      formData.append('language', options.language.split('-')[0]) // Whisper uses ISO-639-1
    }

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Whisper API error: ${response.statusText}`)
    }

    const data = await response.json()
    return data.text
  }
}

// Custom provider wrapper
export class CustomTranscriptionProvider implements TranscriptionProvider {
  supportsContinuous = false

  constructor(
    private transcribeFn: (blob: Blob, options?: TranscriptionOptions) => Promise<string>
  ) {}

  async transcribe(audioBlob: Blob, options: TranscriptionOptions = {}): Promise<string> {
    return this.transcribeFn(audioBlob, options)
  }
}
```

```typescript
// use-speech-recognition.ts
import { useState, useCallback, useRef } from 'react'
import type { TranscriptionProvider } from './transcription-provider'

interface UseSpeechRecognitionOptions {
  provider: TranscriptionProvider
  language?: string
  continuous?: boolean
  interimResults?: boolean
  onInterimTranscript?: (text: string) => void
  onFinalTranscript?: (text: string) => void
  onError?: (error: Error) => void
}

export function useSpeechRecognition(options: UseSpeechRecognitionOptions) {
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [interimTranscript, setInterimTranscript] = useState('')
  const accumulatedTranscript = useRef('')

  const startRecognition = useCallback(() => {
    if (!options.provider.supportsContinuous && options.continuous) {
      throw new Error('Provider does not support continuous recognition')
    }

    if (options.continuous && options.provider.startContinuous) {
      options.provider.startContinuous({
        language: options.language,
        interimResults: options.interimResults,
        onInterimResult: (text) => {
          setInterimTranscript(text)
          options.onInterimTranscript?.(text)
        },
        onFinalResult: (text) => {
          accumulatedTranscript.current += (accumulatedTranscript.current ? ' ' : '') + text
          setTranscript(accumulatedTranscript.current)
          setInterimTranscript('')
          options.onFinalTranscript?.(text)
        },
        onError: options.onError,
      })
    }
  }, [options])

  const stopRecognition = useCallback(() => {
    if (options.provider.stopContinuous) {
      options.provider.stopContinuous()
    }
  }, [options.provider])

  const transcribeBlob = useCallback(
    async (blob: Blob): Promise<string> => {
      setIsTranscribing(true)

      try {
        const result = await options.provider.transcribe(blob, {
          language: options.language,
          interimResults: options.interimResults,
        })

        setTranscript(result)
        options.onFinalTranscript?.(result)
        return result
      } catch (error) {
        options.onError?.(error as Error)
        throw error
      } finally {
        setIsTranscribing(false)
      }
    },
    [options]
  )

  const reset = useCallback(() => {
    setTranscript('')
    setInterimTranscript('')
    accumulatedTranscript.current = ''
  }, [])

  return {
    isTranscribing,
    transcript,
    interimTranscript,
    startRecognition,
    stopRecognition,
    transcribeBlob,
    reset,
  }
}
```

#### 3. Audio Visualization

```typescript
// voice-visualizer.tsx
import React, { useEffect, useRef } from 'react';
import { VoiceVisualizerWaveform } from './voice-visualizer-waveform';
import { VoiceVisualizerBars } from './voice-visualizer-bars';
import { VoiceVisualizerCircular } from './voice-visualizer-circular';
import { VoiceVisualizerOrb } from './voice-visualizer-orb';

interface VoiceVisualizerProps {
  analyser: AnalyserNode | null;
  type?: 'waveform' | 'bars' | 'circular' | 'orb';
  height?: number;
  className?: string;
  isActive?: boolean;
}

export function VoiceVisualizer({
  analyser,
  type = 'waveform',
  height = 48,
  className,
  isActive = true,
}: VoiceVisualizerProps) {
  if (!analyser || !isActive) {
    return null;
  }

  const VisualizerComponent = {
    waveform: VoiceVisualizerWaveform,
    bars: VoiceVisualizerBars,
    circular: VoiceVisualizerCircular,
    orb: VoiceVisualizerOrb,
  }[type];

  return (
    <VisualizerComponent
      analyser={analyser}
      height={height}
      className={className}
    />
  );
}
```

```typescript
// voice-visualizer-bars.tsx
import React, { useEffect, useRef } from 'react';

interface VoiceVisualizerBarsProps {
  analyser: AnalyserNode;
  height?: number;
  className?: string;
}

export function VoiceVisualizerBars({
  analyser,
  height = 48,
  className = '',
}: VoiceVisualizerBarsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const barCount = 32;
    const barWidth = canvas.width / barCount;

    const draw = () => {
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < barCount; i++) {
        // Average frequencies for each bar
        const startIndex = Math.floor((i * bufferLength) / barCount);
        const endIndex = Math.floor(((i + 1) * bufferLength) / barCount);
        let sum = 0;
        for (let j = startIndex; j < endIndex; j++) {
          sum += dataArray[j];
        }
        const average = sum / (endIndex - startIndex);

        const barHeight = (average / 255) * canvas.height;
        const x = i * barWidth;
        const y = canvas.height - barHeight;

        // Draw bar with gradient
        const gradient = ctx.createLinearGradient(0, y, 0, canvas.height);
        gradient.addColorStop(0, 'hsl(var(--primary))');
        gradient.addColorStop(1, 'hsl(var(--primary) / 0.5)');

        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth - 2, barHeight);
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [analyser, height]);

  return (
    <canvas
      ref={canvasRef}
      width={300}
      height={height}
      className={`voice-visualization voice-visualization-bars ${className}`}
    />
  );
}
```

### Dependencies

```json
{
  "dependencies": {
    // No additional dependencies needed for basic implementation
    // Browser APIs used: MediaRecorder, Web Audio API, Web Speech API
  },
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0",
    "react-dom": "^18.0.0 || ^19.0.0"
  },
  "optionalDependencies": {
    // Only needed if using Whisper or custom API transcription
  }
}
```

### Browser Support

| Feature               | Chrome | Firefox | Safari | Edge |
| --------------------- | ------ | ------- | ------ | ---- |
| **MediaRecorder API** | 47+    | 25+     | 14.1+  | 79+  |
| **Web Speech API**    | 25+    | ❌      | 14.1+  | 79+  |
| **Web Audio API**     | 35+    | 25+     | 14.1+  | 79+  |
| **getUserMedia**      | 53+    | 36+     | 11+    | 79+  |

**Fallback Strategy:**

- Provide Whisper API integration for browsers without Web Speech API
- Show clear error messages for unsupported browsers
- Graceful degradation to text input
- Feature detection before rendering component

## Accessibility

### ARIA Attributes

```tsx
<button
  role="button"
  aria-label={
    isRecording
      ? "Stop recording"
      : isPaused
      ? "Resume recording"
      : "Start recording"
  }
  aria-pressed={isRecording}
  aria-live="polite"
  aria-atomic="true"
>
  {/* Icon */}
</button>

<div
  role="status"
  aria-live="polite"
  aria-label={`Recording duration: ${formatDuration(duration)}`}
>
  {formatDuration(duration)}
</div>

<div
  role="img"
  aria-label="Audio visualization"
  aria-hidden={!showVisualization}
>
  {/* Visualization */}
</div>
```

### Keyboard Navigation

| Key                   | Action                                  |
| --------------------- | --------------------------------------- |
| **Space** / **Enter** | Start/stop recording                    |
| **Escape**            | Cancel recording                        |
| **P**                 | Pause/resume recording (when recording) |
| **Tab**               | Navigate to next/previous control       |

### Screen Reader Support

- Announce recording state changes ("Recording started", "Recording stopped")
- Announce transcription results ("Transcript: [text]")
- Announce errors with context
- Provide alternative text for visualizations
- Ensure button labels are descriptive

### WCAG 2.1 Level AA Compliance

- Color contrast ratio ≥ 4.5:1 for text
- Interactive elements have minimum 44x44px touch target
- Focus indicators visible and clear
- No flashing content (visualization frequency < 3Hz)
- Keyboard accessible without mouse
- Alternative input method to voice (text input)

## Testing Strategy

### Unit Tests

```typescript
describe('VoiceInput', () => {
  describe('Rendering', () => {
    it('renders idle state by default', () => {})
    it('renders with custom className', () => {})
    it('renders different variants correctly', () => {})
    it('renders different sizes correctly', () => {})
  })

  describe('Recording', () => {
    it('starts recording on button click', () => {})
    it('stops recording on stop button', () => {})
    it('pauses and resumes recording', () => {})
    it('cancels recording', () => {})
    it('auto-stops at max duration', () => {})
  })

  describe('Transcription', () => {
    it('transcribes audio with browser provider', () => {})
    it('transcribes audio with Whisper provider', () => {})
    it('handles transcription with custom provider', () => {})
    it('shows interim results during continuous recognition', () => {})
    it('calls onTranscript with final result', () => {})
  })

  describe('Visualization', () => {
    it('shows visualization when recording', () => {})
    it('hides visualization when not recording', () => {})
    it('renders different visualization types', () => {})
    it('updates visualization based on audio levels', () => {})
  })

  describe('Error Handling', () => {
    it('handles permission denied gracefully', () => {})
    it('handles transcription errors', () => {})
    it('handles network errors', () => {})
    it('shows error messages to user', () => {})
    it('calls onError callback with error details', () => {})
  })

  describe('Callbacks', () => {
    it('calls onStart when recording starts', () => {})
    it('calls onStop when recording stops', () => {})
    it('calls onPause when recording pauses', () => {})
    it('calls onResume when recording resumes', () => {})
    it('calls onVolumeChange with volume level', () => {})
    it('calls onDurationChange with duration', () => {})
    it('calls onInterimTranscript with partial results', () => {})
  })

  describe('Controlled Component', () => {
    it('respects isRecording prop', () => {})
    it('calls onRecordingChange when state changes', () => {})
  })

  describe('Accessibility', () => {
    it('has proper ARIA labels', () => {})
    it('supports keyboard navigation', () => {})
    it('announces state changes to screen readers', () => {})
  })
})

describe('useVoiceRecording', () => {
  it('requests microphone permission', () => {})
  it('starts recording', () => {})
  it('stops recording and returns blob', () => {})
  it('tracks duration', () => {})
  it('tracks volume', () => {})
  it('cleans up resources on unmount', () => {})
})

describe('useSpeechRecognition', () => {
  it('transcribes with browser provider', () => {})
  it('transcribes with Whisper provider', () => {})
  it('handles continuous recognition', () => {})
  it('handles interim results', () => {})
  it('handles errors', () => {})
})
```

### Integration Tests

- Test with mock MediaRecorder API
- Test with mock SpeechRecognition API
- Test visualization rendering and updates
- Test with different audio input devices
- Test permission flows
- Test error scenarios

### Visual Regression Tests

- Idle state
- Recording state
- Paused state
- Processing state
- Error state
- Different variants (default, floating, inline, minimal)
- Different sizes (sm, md, lg)
- Different visualization types (waveform, bars, circular, orb)
- Dark mode

### Manual Testing Checklist

- [ ] Recording in Chrome, Firefox, Safari, Edge
- [ ] Permission grant/deny flows
- [ ] Different microphone devices
- [ ] Background noise handling
- [ ] Long recording (approaching max duration)
- [ ] Pause/resume functionality
- [ ] Cancel during recording
- [ ] Transcription accuracy
- [ ] Visualization performance
- [ ] Mobile device recording
- [ ] Touch interactions
- [ ] Keyboard-only navigation
- [ ] Screen reader experience
- [ ] Network failure handling
- [ ] API rate limiting scenarios

## Documentation

### API Documentation

Full TypeScript API documentation with:

- Props descriptions and types
- Default values
- Code examples for each prop
- Return types for callbacks
- Error types and codes

### Usage Guide

#### Basic Setup

```tsx
import { VoiceInput } from '@clarity-chat/react'

function App() {
  return <VoiceInput onTranscript={(text) => console.log(text)} />
}
```

#### Advanced Customization

- Visualization types and styling
- Provider configuration
- Error handling
- Controlled vs uncontrolled usage
- Integration with chat components

#### API Integration

##### Whisper API

```tsx
<VoiceInput
  provider="whisper"
  whisperApiKey={process.env.WHISPER_API_KEY}
  onTranscript={handleTranscript}
/>
```

##### Custom API

```tsx
const transcriber = async (blob) => {
  const formData = new FormData()
  formData.append('audio', blob)
  const res = await fetch('/api/transcribe', {
    method: 'POST',
    body: formData,
  })
  return res.json().then((data) => data.transcript)
}

;<VoiceInput provider="custom" customTranscriber={transcriber} onTranscript={handleTranscript} />
```

#### Troubleshooting

**Permission Issues:**

- Browser permission prompts
- Checking permission status
- Handling denied permissions
- Permission persistence

**Audio Quality:**

- Microphone selection
- Noise cancellation
- Echo cancellation
- Auto gain control

**Transcription Accuracy:**

- Language selection
- Provider comparison
- Network considerations
- Audio preprocessing

**Performance:**

- Visualization optimization
- Memory management
- Long recording handling
- Mobile considerations

### Examples

#### Basic Voice Input

```tsx
import { VoiceInput } from '@clarity-chat/react'

export function BasicExample() {
  const handleTranscript = (text: string) => {
    alert(`You said: ${text}`)
  }

  return <VoiceInput onTranscript={handleTranscript} />
}
```

#### With Message Input

```tsx
import { MessageInput, VoiceInput } from '@clarity-chat/react'

export function MessageInputExample() {
  const [message, setMessage] = useState('')

  return (
    <MessageInput
      value={message}
      onChange={setMessage}
      onSubmit={handleSend}
      actions={
        <VoiceInput
          variant="inline"
          onTranscript={(text) => setMessage((prev) => `${prev} ${text}`.trim())}
        />
      }
    />
  )
}
```

#### Custom Visualization

```tsx
<VoiceInput
  visualizationType="orb"
  visualizationHeight={80}
  onTranscript={handleTranscript}
  className="custom-voice-input"
/>
```

#### Whisper Integration

```tsx
<VoiceInput
  provider="whisper"
  whisperApiKey={process.env.WHISPER_API_KEY}
  language="es-ES"
  maxDuration={120}
  onTranscript={handleTranscript}
  onError={handleError}
/>
```

#### Multi-language Support

```tsx
function MultiLanguageVoice() {
  const [language, setLanguage] = useState('en-US')

  return (
    <>
      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option value="en-US">English</option>
        <option value="es-ES">Spanish</option>
        <option value="fr-FR">French</option>
        <option value="de-DE">German</option>
      </select>

      <VoiceInput language={language} onTranscript={handleTranscript} />
    </>
  )
}
```

#### Controlled Component

```tsx
function ControlledVoiceInput() {
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState('')

  return (
    <div>
      <VoiceInput
        isRecording={isRecording}
        onRecordingChange={setIsRecording}
        onTranscript={setTranscript}
        onInterimTranscript={(text) => console.log('Interim:', text)}
      />

      <div>
        <h3>Status</h3>
        <p>{isRecording ? 'Recording...' : 'Idle'}</p>
      </div>

      <div>
        <h3>Transcript</h3>
        <p>{transcript}</p>
      </div>

      <button onClick={() => setIsRecording(!isRecording)}>{isRecording ? 'Stop' : 'Start'}</button>
    </div>
  )
}
```

## Performance

### Optimizations

1. **Lazy Loading**
   - Load audio processing code only when needed
   - Dynamically import visualization components
   - Defer permission requests until user interaction

2. **Audio Processing**
   - Use OfflineAudioContext for non-blocking analysis
   - Debounce volume change callbacks
   - Throttle visualization updates (60fps max)
   - Use Web Workers for heavy processing

3. **Visualization**
   - Canvas-based rendering for performance
   - RequestAnimationFrame for smooth animations
   - GPU acceleration where possible
   - Reduce bar count on lower-end devices

4. **Memory Management**
   - Clean up audio streams on unmount
   - Close audio context when done
   - Clear intervals and timeouts
   - Dispose of large audio blobs promptly

5. **State Updates**
   - Batch state updates where possible
   - Use refs for non-visual state
   - Memoize expensive calculations
   - Optimize re-renders with React.memo

### Bundle Size

**Estimated Bundle Sizes:**

- Base component (no visualization): ~3kb gzipped
- With waveform visualization: ~5kb gzipped
- With bars visualization: ~4kb gzipped
- With circular visualization: ~4kb gzipped
- With orb visualization: ~6kb gzipped
- Full package: ~8kb gzipped

**Tree-shakeable:**

- Import only needed visualization types
- Transcription providers imported separately
- Utilities are pure functions

**No External Dependencies:**

- Uses browser native APIs
- No heavy libraries required
- Optional Whisper integration adds no bundle size (API call)

## Migration Path

### For Existing Users

Not applicable - new component

### For New Users

#### Installation

```bash
npm install @clarity-chat/react@latest
```

#### Basic Usage

```tsx
import { VoiceInput } from '@clarity-chat/react'

function App() {
  return (
    <VoiceInput
      onTranscript={(text) => {
        console.log('Transcript:', text)
      }}
    />
  )
}
```

#### Integration with Existing Chat

```tsx
import { Chat, MessageInput, VoiceInput } from '@clarity-chat/react'

function ChatApp() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')

  const handleSend = () => {
    setMessages([...messages, { role: 'user', content: input }])
    setInput('')
  }

  return (
    <Chat messages={messages}>
      <MessageInput
        value={input}
        onChange={setInput}
        onSubmit={handleSend}
        actions={
          <VoiceInput
            variant="inline"
            onTranscript={(text) => {
              setInput((prev) => `${prev} ${text}`.trim())
            }}
          />
        }
      />
    </Chat>
  )
}
```

## Implementation Timeline

### Week 1: Core Functionality

- **Day 1-2**: MediaRecorder integration and audio recording
  - Set up MediaRecorder API
  - Implement permission handling
  - Audio stream management
  - Basic error handling

- **Day 3-4**: Speech recognition integration
  - Implement browser provider (Web Speech API)
  - Implement Whisper provider
  - Custom provider abstraction
  - Continuous vs blob-based transcription

- **Day 5**: Basic UI and state management
  - Component structure
  - State management (recording, processing, error)
  - Button interactions
  - Timer display

### Week 2: Polish & Testing

- **Day 1-2**: Visualization components
  - Waveform visualizer
  - Bar visualizer
  - Circular visualizer
  - Orb visualizer (GPU-accelerated)

- **Day 3**: Accessibility
  - ARIA labels and roles
  - Keyboard navigation
  - Screen reader support
  - Focus management

- **Day 4-5**: Tests & documentation
  - Unit tests (>90% coverage)
  - Integration tests
  - Storybook stories
  - API documentation
  - Usage guide and examples

## Success Criteria

- ✅ **Records audio successfully** in all supported browsers
- ✅ **Transcribes speech accurately** with browser and Whisper providers
- ✅ **Visualizes audio in real-time** with smooth 60fps animations
- ✅ **Handles errors gracefully** with helpful error messages and recovery
- ✅ **Meets accessibility standards** (WCAG 2.1 Level AA)
- ✅ **Comprehensive tests** (>90% code coverage)
- ✅ **Complete documentation** with examples and troubleshooting
- ✅ **Performance optimized** (<8kb gzipped, 60fps visualization)
- ✅ **Mobile support** works on iOS and Android devices
- ✅ **Keyboard accessible** all features available without mouse
- ✅ **Production ready** handles edge cases and error scenarios

## Future Enhancements

### Phase 2 (Post-Launch)

- Real-time streaming transcription (as you speak)
- Multiple language auto-detection
- Speaker diarization (multiple speakers)
- Noise filtering and enhancement
- Voice activity detection (VAD)
- Custom wake words
- Voice biometric authentication

### Phase 3 (Advanced Features)

- Offline transcription (local models)
- Voice command recognition
- Emotional tone analysis
- Accent detection and adaptation
- Background noise cancellation
- Multi-channel audio support
- Audio preprocessing options

## References

### Documentation

- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [MediaRecorder API](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [OpenAI Whisper API](https://platform.openai.com/docs/guides/speech-to-text)

### Inspiration

- [ElevenLabs UI Documentation](https://ui.elevenlabs.io/)
- [shadcn Chatbot Kit](https://shadcn-chatbot-kit.vercel.app)
- [Prompt Kit](https://www.prompt-kit.com/chat-ui)

### Best Practices

- [WCAG 2.1 Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Web Audio Best Practices](https://www.html5rocks.com/en/tutorials/webaudio/intro/)
- [Browser Audio Permissions](https://web.dev/articles/media-capture-permissions)
