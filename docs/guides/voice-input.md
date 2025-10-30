# 🎤 Voice Input Guide

> **Enable hands-free chat experiences with speech-to-text functionality**

---

## 📚 Overview

The Voice Input component provides a production-ready speech-to-text interface using the Web Speech API. Perfect for:
- 🎙️ Hands-free chat experiences
- ♿ Accessibility improvements
- 📱 Mobile-friendly input
- 🌍 Multi-language support
- 🚗 Voice-first applications

---

## 🚀 Quick Start

### Basic Usage

```tsx
import { VoiceInput } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

function App() {
  return (
    <VoiceInput
      onTranscript={(text) => {
        console.log('User said:', text)
        // Send the message
        sendMessage(text)
      }}
      lang="en-US"
      autoSubmit={true}
    />
  )
}
```

---

## 🧩 Component API

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onTranscript` | `(text: string) => void` | **Required** | Callback with final transcript |
| `lang` | `string` | `'en-US'` | Language code (BCP 47) |
| `showInterim` | `boolean` | `false` | Show real-time interim results |
| `autoSubmit` | `boolean` | `false` | Auto-submit when speech ends |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size |
| `variant` | `'primary' \| 'secondary' \| 'ghost'` | `'primary'` | Button style |
| `disabled` | `boolean` | `false` | Disable the button |
| `showTooltip` | `boolean` | `true` | Show tooltip on hover |
| `tooltipText` | `string` | `'Click to speak'` | Custom tooltip text |
| `icon` | `ReactNode` | `<MicrophoneIcon />` | Custom mic icon |
| `listeningIcon` | `ReactNode` | `<MicrophoneIcon />` | Icon when listening |
| `onStart` | `() => void` | - | Callback when recording starts |
| `onStop` | `() => void` | - | Callback when recording stops |
| `onError` | `(error: string) => void` | - | Error callback |
| `className` | `string` | - | Custom CSS class |

---

## 📖 Common Use Cases

### 1. Integrated Chat Input

Add voice input to your chat interface:

```tsx
import { useState } from 'react'
import { ChatInput, VoiceInput } from '@clarity-chat/react'

function ChatWithVoice() {
  const [inputValue, setInputValue] = useState('')

  return (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <ChatInput
        value={inputValue}
        onChange={setInputValue}
        onSend={(text) => {
          sendMessage(text)
          setInputValue('')
        }}
      />
      
      <VoiceInput
        onTranscript={(text) => {
          sendMessage(text)
        }}
        autoSubmit={true}
      />
    </div>
  )
}
```

### 2. With Real-Time Preview

Show what's being transcribed in real-time:

```tsx
import { useState } from 'react'
import { VoiceInput } from '@clarity-chat/react'

function VoiceWithPreview() {
  const [transcript, setTranscript] = useState('')
  const [interimTranscript, setInterimTranscript] = useState('')

  return (
    <div>
      {/* Preview */}
      {interimTranscript && (
        <div className="interim-preview">
          <span className="interim-text">{interimTranscript}</span>
          <span className="cursor">|</span>
        </div>
      )}

      {/* Final transcript */}
      {transcript && (
        <div className="final-transcript">
          <p>{transcript}</p>
          <button onClick={() => sendMessage(transcript)}>Send</button>
        </div>
      )}

      {/* Voice input */}
      <VoiceInput
        onTranscript={(text) => {
          setTranscript(text)
          setInterimTranscript('')
        }}
        showInterim={true}
      />
    </div>
  )
}
```

### 3. Multi-Language Support

Support different languages:

```tsx
import { useState } from 'react'
import { VoiceInput } from '@clarity-chat/react'

function MultiLanguageVoice() {
  const [language, setLanguage] = useState('en-US')

  const languages = [
    { code: 'en-US', name: 'English (US)' },
    { code: 'es-ES', name: 'Spanish (Spain)' },
    { code: 'fr-FR', name: 'French' },
    { code: 'de-DE', name: 'German' },
    { code: 'ja-JP', name: 'Japanese' },
    { code: 'zh-CN', name: 'Chinese (Simplified)' },
  ]

  return (
    <div>
      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>

      <VoiceInput
        lang={language}
        onTranscript={(text) => sendMessage(text)}
        autoSubmit={true}
      />
    </div>
  )
}
```

### 4. With Custom Styling

Customize the appearance:

```tsx
import { VoiceInput } from '@clarity-chat/react'

function StyledVoiceInput() {
  return (
    <>
      {/* Small ghost button */}
      <VoiceInput
        size="sm"
        variant="ghost"
        onTranscript={(text) => sendMessage(text)}
      />

      {/* Large primary button */}
      <VoiceInput
        size="lg"
        variant="primary"
        onTranscript={(text) => sendMessage(text)}
      />

      {/* Custom icon */}
      <VoiceInput
        icon={<MyCustomMicIcon />}
        listeningIcon={<MyCustomListeningIcon />}
        onTranscript={(text) => sendMessage(text)}
      />
    </>
  )
}
```

### 5. With Error Handling

Handle errors gracefully:

```tsx
import { useState } from 'react'
import { VoiceInput, Toast } from '@clarity-chat/react'

function VoiceWithErrorHandling() {
  const [error, setError] = useState<string | null>(null)

  return (
    <>
      <VoiceInput
        onTranscript={(text) => sendMessage(text)}
        onError={(errorMessage) => {
          setError(errorMessage)
          // Auto-clear after 5 seconds
          setTimeout(() => setError(null), 5000)
        }}
      />

      {error && (
        <Toast variant="error" onClose={() => setError(null)}>
          {error}
        </Toast>
      )}
    </>
  )
}
```

---

## 🪝 Using the Hook Directly

For more control, use the `useVoiceInput` hook:

```tsx
import { useState } from 'react'
import { useVoiceInput } from '@clarity-chat/react'

function CustomVoiceInput() {
  const {
    isListening,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    isSupported,
    error,
  } = useVoiceInput({
    lang: 'en-US',
    onTranscript: (text) => {
      console.log('Final transcript:', text)
      sendMessage(text)
    },
  })

  if (!isSupported) {
    return <p>Voice input is not supported in your browser</p>
  }

  return (
    <div>
      <button
        onClick={isListening ? stopListening : startListening}
        className={isListening ? 'recording' : ''}
      >
        {isListening ? '⏹️ Stop' : '🎤 Start Recording'}
      </button>

      {interimTranscript && (
        <p className="interim">
          <em>{interimTranscript}</em>
        </p>
      )}

      {transcript && (
        <div>
          <p>{transcript}</p>
          <button onClick={() => sendMessage(transcript)}>Send</button>
        </div>
      )}

      {error && <p className="error">{error}</p>}
    </div>
  )
}
```

### Hook API

```typescript
interface UseVoiceInputOptions {
  lang?: string
  onTranscript?: (text: string) => void
  autoStop?: boolean
  autoStopDelay?: number
}

interface UseVoiceInputReturn {
  isListening: boolean
  transcript: string
  interimTranscript: string
  startListening: () => void
  stopListening: () => void
  isSupported: boolean
  error: string | null
}
```

---

## 🌍 Supported Languages

The Web Speech API supports many languages:

| Language | Code | Example |
|----------|------|---------|
| English (US) | `en-US` | Default |
| English (UK) | `en-GB` | British accent |
| Spanish (Spain) | `es-ES` | Castilian Spanish |
| Spanish (Mexico) | `es-MX` | Mexican Spanish |
| French | `fr-FR` | Standard French |
| German | `de-DE` | Standard German |
| Italian | `it-IT` | Standard Italian |
| Portuguese (Brazil) | `pt-BR` | Brazilian Portuguese |
| Russian | `ru-RU` | Standard Russian |
| Japanese | `ja-JP` | Standard Japanese |
| Korean | `ko-KR` | Standard Korean |
| Chinese (Simplified) | `zh-CN` | Mandarin (Simplified) |
| Chinese (Traditional) | `zh-TW` | Mandarin (Traditional) |
| Arabic | `ar-SA` | Modern Standard Arabic |
| Hindi | `hi-IN` | Standard Hindi |

**Full list**: [BCP 47 Language Tags](https://www.techonthenet.com/js/language_tags.php)

---

## 🔒 Browser Support

### Desktop Browsers
- ✅ **Chrome** 25+
- ✅ **Edge** 79+
- ✅ **Safari** 14.1+
- ❌ **Firefox** (Not supported)

### Mobile Browsers
- ✅ **Chrome Mobile** (Android)
- ✅ **Safari Mobile** (iOS 14.3+)
- ⚠️ **Samsung Internet** (Limited support)

### Check Support at Runtime

```tsx
import { useVoiceInput } from '@clarity-chat/react'

function VoiceInputWrapper() {
  const { isSupported } = useVoiceInput()

  if (!isSupported) {
    return (
      <div className="unsupported-notice">
        <p>🎤 Voice input is not available in your browser.</p>
        <p>Try using Chrome, Edge, or Safari for voice features.</p>
      </div>
    )
  }

  return <VoiceInput onTranscript={(text) => sendMessage(text)} />
}
```

---

## ⚙️ Advanced Configuration

### Custom Auto-Stop Delay

Control when recording stops automatically:

```tsx
import { useVoiceInput } from '@clarity-chat/react'

function CustomAutoStop() {
  const { isListening, startListening, stopListening } = useVoiceInput({
    autoStop: true,
    autoStopDelay: 3000, // Stop after 3 seconds of silence
    onTranscript: (text) => sendMessage(text),
  })

  return (
    <button onClick={isListening ? stopListening : startListening}>
      {isListening ? 'Listening...' : 'Start Recording'}
    </button>
  )
}
```

### Continuous Recording

Keep recording until manually stopped:

```tsx
import { useVoiceInput } from '@clarity-chat/react'

function ContinuousRecording() {
  const { isListening, interimTranscript, startListening, stopListening } = useVoiceInput({
    autoStop: false, // Don't stop automatically
    onTranscript: (text) => {
      console.log('Transcript update:', text)
    },
  })

  return (
    <div>
      <button onClick={isListening ? stopListening : startListening}>
        {isListening ? '⏹️ Stop' : '🎤 Start'}
      </button>

      {isListening && interimTranscript && (
        <div className="live-transcript">
          <p>{interimTranscript}</p>
          <span className="recording-indicator">🔴 Recording</span>
        </div>
      )}
    </div>
  )
}
```

---

## 🎨 Styling & Animation

### Custom Pulse Animation

```css
/* Custom pulse animation for listening state */
.voice-button.listening {
  position: relative;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
  }
}

/* Audio waveform visualization */
.audio-wave {
  display: flex;
  gap: 2px;
  align-items: center;
  height: 20px;
}

.audio-wave span {
  width: 3px;
  background: currentColor;
  animation: wave 1s infinite ease-in-out;
}

.audio-wave span:nth-child(2) { animation-delay: 0.1s; }
.audio-wave span:nth-child(3) { animation-delay: 0.2s; }
.audio-wave span:nth-child(4) { animation-delay: 0.3s; }

@keyframes wave {
  0%, 100% { height: 4px; }
  50% { height: 20px; }
}
```

### Transcript Preview Styling

```css
.interim-preview {
  padding: 0.75rem 1rem;
  background: hsl(var(--muted));
  border-radius: var(--radius);
  font-style: italic;
  color: hsl(var(--muted-foreground));
}

.interim-text {
  opacity: 0.7;
}

.cursor {
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.final-transcript {
  padding: 1rem;
  background: hsl(var(--accent));
  border-radius: var(--radius);
  margin-top: 0.5rem;
}
```

---

## ♿ Accessibility

### Keyboard Support

The VoiceInput component is fully keyboard accessible:
- **Space** or **Enter**: Toggle recording
- **Escape**: Stop recording

### Screen Reader Support

```tsx
<VoiceInput
  onTranscript={(text) => sendMessage(text)}
  aria-label="Voice input"
  tooltipText="Click to speak or press Space to start recording"
/>
```

### ARIA Announcements

```tsx
import { VoiceInput } from '@clarity-chat/react'

function AccessibleVoiceInput() {
  const [announcement, setAnnouncement] = useState('')

  return (
    <>
      {/* Screen reader announcements */}
      <div role="status" aria-live="polite" className="sr-only">
        {announcement}
      </div>

      <VoiceInput
        onStart={() => setAnnouncement('Recording started')}
        onStop={() => setAnnouncement('Recording stopped')}
        onTranscript={(text) => {
          setAnnouncement(`Transcript received: ${text}`)
          sendMessage(text)
        }}
        onError={(error) => setAnnouncement(`Error: ${error}`)}
      />
    </>
  )
}
```

---

## 🐛 Troubleshooting

### Voice input not working?

**Check browser support:**
```tsx
const { isSupported } = useVoiceInput()
if (!isSupported) {
  console.log('Web Speech API not supported')
}
```

**Check microphone permissions:**
- Browser needs microphone access
- Check browser settings/permissions
- Look for blocked icon in address bar

**Common issues:**
- **Firefox**: Web Speech API not supported
- **HTTP**: Some browsers require HTTPS for microphone access
- **Mobile**: May need user interaction to start recording

### No transcript received?

- **Speak clearly** into the microphone
- **Check volume** levels
- **Try different language** codes
- **Background noise** can affect accuracy

### Transcript is inaccurate?

- Use correct `lang` prop for your language
- Speak at a moderate pace
- Reduce background noise
- Consider using a better microphone

---

## 📊 Performance Considerations

### Lazy Loading

Only load the voice component when needed:

```tsx
import { lazy, Suspense } from 'react'

const VoiceInput = lazy(() => import('@clarity-chat/react').then(m => ({ default: m.VoiceInput })))

function App() {
  return (
    <Suspense fallback={<div>Loading voice input...</div>}>
      <VoiceInput onTranscript={(text) => sendMessage(text)} />
    </Suspense>
  )
}
```

### Conditional Rendering

Only render when supported:

```tsx
import { useVoiceInput } from '@clarity-chat/react'

function VoiceInputWrapper() {
  const { isSupported } = useVoiceInput()

  if (!isSupported) {
    return null // Don't render if not supported
  }

  return <VoiceInput onTranscript={(text) => sendMessage(text)} />
}
```

---

## 🔗 Related Documentation

- **[First Component Guide](../getting-started/first-component.md)** - Learn the basics
- **[ChatInput Component](../api/components.md#chatinput)** - Text input component
- **[Hooks API](../api/hooks.md#usevoiceinput)** - useVoiceInput hook details
- **[Accessibility Guide](./accessibility.md)** - Full accessibility features

---

## 💡 Best Practices

### ✅ Do's
- Test across different browsers
- Provide visual feedback when recording
- Handle errors gracefully
- Show browser compatibility message
- Use appropriate language codes
- Provide keyboard shortcuts
- Add screen reader support

### ❌ Don'ts
- Don't assume voice is supported
- Don't start recording without user action
- Don't forget to handle errors
- Don't ignore mobile users
- Don't use voice as the only input method

---

**Ready to add voice to your chat?** Try our [Voice-Enabled Template](../../examples/voice-assistant/)! 🎤
