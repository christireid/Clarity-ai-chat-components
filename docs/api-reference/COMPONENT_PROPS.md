# Component Props Reference

Comprehensive documentation of all props for Clarity AI Chat Components. This reference provides complete information about every configurable option for each component.

## Table of Contents

1. [CommandPalette](#commandpalette)
2. [AudioRecorder](#audiorecorder)

---

## CommandPalette

A powerful keyboard-first command interface for quick actions, search, and navigation with fuzzy matching and category grouping.

### Component Props

| Prop Name | Type | Default | Required | Description |
|-----------|------|---------|----------|-------------|
| `items` | `CommandItem[]` | — | Yes | Array of command items to display in the palette. See [CommandItem Interface](#commanditem-interface) |
| `open` | `boolean` | — | Yes | Controls whether the command palette is visible. Typically managed with `useState` hook |
| `onClose` | `() => void` | — | Yes | Callback function when palette is closed (Escape key or backdrop click) |
| `placeholder` | `string` | `'Type a command...'` | No | Placeholder text displayed in the search input field |
| `className` | `string` | — | No | Additional CSS classes for custom styling of the palette container |
| `loading` | `boolean` | `false` | No | Shows loading spinner in input when `true`. Use during async command operations |
| `aria-label` | `string` | `'Command palette'` | No | Accessible label for screen readers. Improves accessibility for assistive technology |
| `aiContext` | `AIContext` | — | No | Optional AI-specific context information displayed in footer. See [AIContext Interface](#aicontext-interface) |
| `ref` | `React.Ref<HTMLDivElement>` | — | No | React ref for accessing the command palette DOM element. Advanced use cases only |

### CommandItem Interface

Each item in the `items` array must conform to this interface:

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | `string` | Yes | Unique identifier for the command item. Used internally for key and ARIA references |
| `label` | `string` | Yes | Display name of the command shown in the list. Should be concise (2-3 words) |
| `description` | `string` | No | Helpful text describing what the command does. Improves discoverability |
| `icon` | `React.ReactNode` | No | Icon component to display left of the label. Can use lucide-react or custom SVG |
| `shortcut` | `string[]` | No | Keyboard shortcut keys as array. Example: `['⌘', 'N']` or `['Ctrl', 'Shift', 'P']` |
| `category` | `string` | No | Groups commands by category in the UI. Commands without category appear under "Commands" |
| `onSelect` | `() => void` | Yes | Callback function executed when user selects the command |

### AIContext Interface

Optional AI context information displayed in the command palette footer:

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `modelName` | `string` | No | Current AI model name (e.g., "Claude 3.5 Sonnet", "GPT-4 Turbo"). Displayed with computer icon |
| `conversationId` | `string` | No | Active conversation ID. Displayed with chat icon for reference |
| `tokenUsage` | `TokenUsage` | No | Token usage statistics. Contains `input`, `output`, and `total` properties (all numbers) |
| `metadata` | `Record<string, string \| number>` | No | Additional custom metadata key-value pairs |

**TokenUsage Sub-interface:**

```typescript
{
  input?: number      // Tokens used in input
  output?: number     // Tokens used in output
  total?: number      // Total tokens used
}
```

### Keyboard Navigation

The CommandPalette supports full keyboard navigation:

| Key | Action |
|-----|--------|
| `↑` / `↓` | Navigate between commands |
| `Home` | Jump to first command |
| `End` | Jump to last command |
| `Enter` | Select highlighted command |
| `Escape` | Close palette |

### Usage Examples

#### Basic Usage

```tsx
import { CommandPalette, type CommandItem } from '@clarity-chat/react'
import { useState } from 'react'

export function App() {
  const [open, setOpen] = useState(false)

  const commands: CommandItem[] = [
    {
      id: 'new-chat',
      label: 'New Chat',
      description: 'Start a new conversation',
      shortcut: ['⌘', 'N'],
      category: 'Actions',
      onSelect: () => console.log('New chat'),
    },
    {
      id: 'settings',
      label: 'Settings',
      description: 'Open preferences',
      shortcut: ['⌘', ','],
      category: 'Navigation',
      onSelect: () => console.log('Open settings'),
    },
  ]

  return (
    <>
      <button onClick={() => setOpen(true)}>Open Commands</button>
      <CommandPalette
        items={commands}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  )
}
```

#### With AI Context

```tsx
<CommandPalette
  items={commands}
  open={open}
  onClose={() => setOpen(false)}
  aiContext={{
    modelName: 'Claude 3.5 Sonnet',
    conversationId: 'conv-12345',
    tokenUsage: {
      input: 1250,
      output: 680,
      total: 1930,
    },
  }}
/>
```

#### With Loading State

```tsx
const [loading, setLoading] = useState(false)

<CommandPalette
  items={commands}
  open={open}
  onClose={() => setOpen(false)}
  loading={loading}
  placeholder="Searching commands..."
/>
```

#### With Custom Styling

```tsx
<CommandPalette
  items={commands}
  open={open}
  onClose={() => setOpen(false)}
  className="max-w-3xl"
/>
```

### Accessibility Features

- Full keyboard navigation with arrow keys, Home, End, Enter, and Escape
- ARIA combobox pattern with proper roles and states
- Live region announcements for command count
- Focus trap when palette is open
- Screen reader friendly category grouping
- Keyboard shortcut display for visual discoverability
- Backdrop click and Escape key to close

### Performance Notes

- Search is debounced at 150ms to prevent excessive filtering on rapid typing
- Commands are grouped by category for efficient rendering
- Selection index automatically resets when filtered items change
- Smooth scroll into view for selected item without jarring jumps

### Migration from Previous Versions

N/A - Initial stable release.

---

## AudioRecorder

Browser-based audio recording with waveform visualization, noise cancellation, and format conversion. Built on Web Audio API with 95% browser compatibility and professional-grade audio processing.

### Component Props

#### Recording Settings

| Prop Name | Type | Default | Required | Description |
|-----------|------|---------|----------|-------------|
| `maxDuration` | `number` | `300` | No | Maximum recording duration in seconds. Recording auto-stops at this limit (5 minutes by default) |
| `minDuration` | `number` | `1` | No | Minimum duration in seconds before stop button is enabled. Prevents accidental short clips |
| `autoStart` | `boolean` | `false` | No | Automatically start recording when component mounts. Requires prior user gesture. Useful for voice commands |
| `pausable` | `boolean` | `true` | No | Enable pause/resume functionality during recording. Set `false` for continuous-only recording |
| `countdownDuration` | `number` | `0` | No | Show countdown timer (in seconds) before recording starts. `0` disables countdown |

#### Format Options

| Prop Name | Type | Default | Required | Description |
|-----------|------|---------|----------|-------------|
| `outputFormat` | `'mp3' \| 'wav' \| 'ogg' \| 'webm' \| 'flac'` | `'webm'` | No | Desired output format. Actual format depends on browser support. WebM (Opus codec) recommended |
| `mimeType` | `string` | Auto-detected | No | Override MIME type for MediaRecorder. Auto-detected if not provided. Advanced use only |
| `bitrate` | `number` | `128000` | No | Audio bitrate in bits per second. Range: 8000-320000. Default is CD quality (128 kbps) |
| `sampleRate` | `number` | Device default | No | Audio sample rate in Hz. Typically 48000 (48 kHz). Set to 16000 for speech-optimized |
| `channels` | `1 \| 2` | `1` | No | Number of audio channels: `1` for mono, `2` for stereo. Mono reduces file size by 50% |

#### Audio Processing

| Prop Name | Type | Default | Required | Description |
|-----------|------|---------|----------|-------------|
| `enableNoiseCancellation` | `boolean` | `false` | No | Enable Web Audio API noise cancellation. Reduces background noise. Computationally expensive |
| `enableEchoCancellation` | `boolean` | `false` | No | Enable echo cancellation for clearer recordings. Essential for speakerphone scenarios |
| `enableAutoGainControl` | `boolean` | `false` | No | Automatically adjust input gain to maintain consistent volume. Prevents loud/quiet spikes |
| `noiseSuppression` | `boolean` | `false` | No | Enable noise suppression using MediaStream constraints. Browser-native implementation |
| `voiceActivityDetection` | `boolean` | `false` | No | Automatically pause recording during silence to save space. Uses `silenceThreshold` to detect |
| `silenceThreshold` | `number` | `0.01` | No | Amplitude threshold for silence detection (0-1 range). Lower values = more sensitive. Used with VAD |

#### Callbacks

| Prop Name | Type | Default | Required | Description |
|-----------|------|---------|----------|-------------|
| `onStart` | `() => void` | — | No | Called when recording starts. Use for UI state updates or analytics |
| `onStop` | `(audioBlob: Blob, audioUrl: string) => void` | — | No | Called when recording stops. Receives audio Blob and object URL for playback |
| `onPause` | `() => void` | — | No | Called when recording is paused. Use for updating pause UI state |
| `onResume` | `() => void` | — | No | Called when recording is resumed after pause. Mirror of `onPause` |
| `onDataAvailable` | `(data: Blob) => void` | — | No | Called when audio data chunks become available during recording. For streaming/live processing |
| `onError` | `(error: Error) => void` | — | No | Called when error occurs (permission denied, unsupported format, etc.). Always handle |
| `onDurationChange` | `(duration: number) => void` | — | No | Called every second with current duration in seconds. Use for custom timer display |
| `onAmplitudeChange` | `(amplitude: number) => void` | — | No | Called with current audio amplitude (0-1). Use for custom waveform or VU meter |

#### UI Configuration

| Prop Name | Type | Default | Required | Description |
|-----------|------|---------|----------|-------------|
| `showWaveform` | `boolean` | `true` | No | Display real-time waveform visualization. Disables for performance-critical scenarios |
| `showDuration` | `boolean` | `true` | No | Display recording duration timer (MM:SS format) |
| `showControls` | `boolean` | `true` | No | Show built-in start/stop/pause buttons. Set `false` to use custom button controls |
| `showAmplitudeMeter` | `boolean` | `true` | No | Display audio input level meter (VU meter). Shows current amplitude percentage |
| `className` | `string` | — | No | Additional CSS classes for the component container |
| `theme` | `'light' \| 'dark' \| 'auto'` | `'auto'` | No | Color theme for recorder UI. `'auto'` respects system preference |
| `disabled` | `boolean` | `false` | No | Disable recording. Useful for conditional recording (e.g., when no microphone available) |

### Data Structures Returned

#### Audio Blob

The `Blob` returned in `onStop` callback contains encoded audio data:

```typescript
// Properties available on Blob
{
  size: number              // File size in bytes
  type: string              // MIME type (e.g., 'audio/webm')
  slice(): Blob             // Extract portion of audio
  stream(): ReadableStream  // Stream audio for upload
}

// To send to server:
const formData = new FormData()
formData.append('audio', audioBlob, 'recording.webm')
await fetch('/api/upload', { method: 'POST', body: formData })
```

#### Audio URL

The `audioUrl` returned is an object URL for immediate playback:

```typescript
// Use in audio element
<audio src={audioUrl} controls />

// Or manual playback
const audio = new Audio(audioUrl)
audio.play()

// Always revoke when done to free memory
URL.revokeObjectURL(audioUrl)
```

### Usage Examples

#### Basic Recording

```tsx
import { AudioRecorder } from '@clarity-chat/react'
import { useState } from 'react'

export function VoiceInput() {
  const [audioUrl, setAudioUrl] = useState<string>()

  return (
    <AudioRecorder
      onStop={(blob, url) => {
        console.log('Recording complete:', blob.size, 'bytes')
        setAudioUrl(url)
      }}
      onError={(error) => console.error('Recording error:', error)}
    />
  )
}
```

#### With Waveform and Timer

```tsx
<AudioRecorder
  maxDuration={60}
  showWaveform={true}
  showDuration={true}
  onStop={(blob, url) => {
    console.log('Recorded:', blob.size, 'bytes')
  }}
/>
```

#### Speech Recognition Optimized

```tsx
<AudioRecorder
  maxDuration={30}
  minDuration={1}
  channels={1}
  sampleRate={16000}
  enableNoiseCancellation={true}
  enableEchoCancellation={true}
  voiceActivityDetection={true}
  silenceThreshold={0.02}
  outputFormat="wav"
  onStop={async (blob, url) => {
    // Send to speech-to-text API
    const formData = new FormData()
    formData.append('audio', blob)
    const response = await fetch('/api/transcribe', {
      method: 'POST',
      body: formData,
    })
  }}
/>
```

#### High Quality Voice Message

```tsx
<AudioRecorder
  maxDuration={300}
  channels={2}
  bitrate={192000}
  outputFormat="mp3"
  enableAutoGainControl={true}
  showAmplitudeMeter={true}
  onStop={(blob, url) => {
    // Save high-quality voice message
    console.log('Voice message ready:', blob.type)
  }}
/>
```

#### Disabled State

```tsx
const [hasMicrophone, setHasMicrophone] = useState(true)

<AudioRecorder
  disabled={!hasMicrophone}
  onError={(error) => {
    if (error.message.includes('permission')) {
      setHasMicrophone(false)
    }
  }}
/>
```

#### With Custom Duration Handling

```tsx
const [duration, setDuration] = useState(0)

<AudioRecorder
  maxDuration={120}
  onDurationChange={(seconds) => setDuration(seconds)}
  onStop={(blob) => {
    console.log(`Recorded ${duration} seconds`)
  }}
/>
```

#### With Amplitude Monitoring

```tsx
const [amplitude, setAmplitude] = useState(0)

<AudioRecorder
  showAmplitudeMeter={false}
  onAmplitudeChange={(amp) => setAmplitude(amp)}
  // Custom waveform display using amplitude
/>
```

### Browser Compatibility

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome/Edge | 95%+ | Full support including noise cancellation |
| Firefox | 95%+ | Full support, WebM recommended |
| Safari | 85%+ | Limited audio processing options |
| Mobile Chrome | 95%+ | Requires user gesture to start |
| Mobile Safari | 85%+ | Limited processing, WebM fallback to MP4 |

### Accessibility Features

- Status announcements for screen readers (recording, paused, ready)
- ARIA live region for real-time duration updates
- Keyboard accessible buttons for recording controls
- Proper button labels and tooltips
- Visual and status indicators for recording state

### Performance Considerations

- Waveform visualization uses `requestAnimationFrame` for smooth 60fps updates
- Amplitude calculation uses efficient RMS computation
- Audio context closed automatically on component unmount
- Media stream tracks stopped to free resources
- Object URLs revoked when playback complete

### Common Patterns

#### Save Recording to Database

```tsx
const handleStop = async (blob: Blob, url: string) => {
  // Convert to base64
  const reader = new FileReader()
  reader.readAsDataURL(blob)
  reader.onloadend = async () => {
    const base64 = reader.result as string
    await fetch('/api/save-recording', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ audio: base64, timestamp: Date.now() }),
    })
  }
}

<AudioRecorder onStop={handleStop} />
```

#### Voice Activity Detection with Auto-Save

```tsx
<AudioRecorder
  voiceActivityDetection={true}
  silenceThreshold={0.015}
  onStop={(blob) => {
    // Automatically sends when user stops speaking
    sendAudioToServer(blob)
  }}
/>
```

#### Real-Time Transcription

```tsx
const [transcript, setTranscript] = useState('')
const mediaRecorderRef = useRef<MediaRecorder>()

<AudioRecorder
  onStart={() => {
    // Reset transcript for new recording
    setTranscript('')
  }}
  onDataAvailable={(chunk) => {
    // Stream chunks to transcription API
    transcribeChunk(chunk)
  }}
  onStop={(blob) => {
    // Final transcription
    transcribeAudio(blob)
  }}
/>
```

### Error Handling

```tsx
<AudioRecorder
  onError={(error) => {
    if (error.message.includes('NotAllowedError')) {
      // Microphone permission denied
      showPermissionDeniedMessage()
    } else if (error.message.includes('NotFoundError')) {
      // No microphone available
      showNoMicrophoneMessage()
    } else if (error.message.includes('NotSupportedError')) {
      // Format not supported by browser
      showFormatNotSupportedMessage()
    } else {
      // Other recording errors
      console.error('Recording failed:', error)
    }
  }}
/>
```

### Cleanup and Resource Management

The component automatically handles cleanup on unmount:

- Stops recording if active
- Closes audio context
- Stops all media tracks
- Cancels animation frames
- Clears all intervals

No manual cleanup required when using React unmounting.

### Migration from Previous Versions

N/A - Initial stable release.

---

## Common Props Patterns

### Theme Support

Both components support theme customization through:

1. **CommandPalette**: Uses `className` prop for custom styling
2. **AudioRecorder**: Uses `theme` prop for light/dark/auto mode

```tsx
// CommandPalette with dark theme
<CommandPalette
  items={commands}
  open={open}
  onClose={() => setOpen(false)}
  className="dark bg-slate-950 border-slate-800"
/>

// AudioRecorder with dark theme
<AudioRecorder
  theme="dark"
  onStop={(blob) => handleRecording(blob)}
/>
```

### Accessibility Props

Both components provide ARIA attributes for screen readers:

- CommandPalette: `aria-label` for accessible name
- AudioRecorder: Automatic status announcements via ARIA live regions

### Error Handling

Always implement error handlers in production:

```tsx
// CommandPalette: Monitor for permission/auth errors in callbacks
const commands: CommandItem[] = [
  {
    id: 'delete',
    label: 'Delete',
    onSelect: async () => {
      try {
        await deleteItem()
      } catch (error) {
        showErrorNotification(error)
      }
    },
  },
]

// AudioRecorder: Always handle permission and format errors
<AudioRecorder
  onError={(error) => {
    if (error.message.includes('NotAllowed')) {
      showPermissionError()
    } else {
      showGenericError(error)
    }
  }}
/>
```

---

## Quick Reference Cheat Sheet

### CommandPalette Quick Setup

```tsx
<CommandPalette
  items={[
    {
      id: 'cmd1',
      label: 'Command',
      description: 'Does something',
      shortcut: ['⌘', 'K'],
      category: 'Actions',
      onSelect: () => { /* action */ },
    },
  ]}
  open={isOpen}
  onClose={() => setIsOpen(false)}
/>
```

### AudioRecorder Quick Setup

```tsx
<AudioRecorder
  maxDuration={60}
  onStop={(blob, url) => {
    console.log('Recording:', blob.size, 'bytes')
  }}
  onError={(error) => {
    console.error('Error:', error)
  }}
/>
```

---

## API Stability

- **CommandPalette**: Stable. No breaking changes planned.
- **AudioRecorder**: Stable. No breaking changes planned.

Last updated: January 28, 2026
