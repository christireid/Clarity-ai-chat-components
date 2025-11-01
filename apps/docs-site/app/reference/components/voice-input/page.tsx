import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Voice Input - Clarity Chat',
  description: 'Enable voice-to-text input with real-time transcription using the Web Speech API.',
}

# Voice Input

Enable voice-to-text input with real-time transcription, multi-language support, and visual feedback using the Web Speech API.

## Overview

The Voice Input component provides comprehensive voice recording capabilities:

- **One-click recording** - Simple button interface for voice capture
- **Real-time transcription** - Live text display as you speak
- **Visual feedback** - Pulse animation and status indicators
- **Auto-submit** - Automatically submit when speech ends
- **Multi-language** - Support for 100+ languages
- **Confidence scoring** - Display transcription accuracy
- **Error handling** - Graceful fallbacks and user feedback
- **Accessibility** - Full keyboard and screen reader support

## Installation

```bash
npm install @clarity-chat/react
```

## Basic Usage

```tsx
import { VoiceInput } from '@clarity-chat/react'

function ChatInput() {
  const handleVoiceInput = (transcript: string) => {
    console.log('Voice input:', transcript)
    sendMessage(transcript)
  }

  return (
    <VoiceInput
      onTranscript={handleVoiceInput}
    />
  )
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| \`onTranscript\` | \`(transcript: string) => void\` | **Required** | Callback when transcript is finalized |
| \`lang\` | \`string\` | \`'en-US'\` | Language code (BCP 47) |
| \`showInterim\` | \`boolean\` | \`true\` | Show real-time interim results |
| \`autoSubmit\` | \`boolean\` | \`true\` | Auto-submit on speech end (2s timeout) |
| \`size\` | \`'sm' \| 'md' \| 'lg'\` | \`'md'\` | Button size |
| \`variant\` | \`'primary' \| 'secondary' \| 'ghost'\` | \`'ghost'\` | Button style variant |
| \`icon\` | \`React.ReactNode\` | Microphone icon | Custom icon when not listening |
| \`listeningIcon\` | \`React.ReactNode\` | Pause icon | Custom icon when listening |
| \`showTooltip\` | \`boolean\` | \`true\` | Show tooltip on hover |
| \`tooltipText\` | \`string\` | \`'Click to speak'\` | Tooltip text |
| \`disabled\` | \`boolean\` | \`false\` | Disabled state |
| \`className\` | \`string\` | \`undefined\` | Additional CSS classes |
| \`onStart\` | \`() => void\` | \`undefined\` | Callback when listening starts |
| \`onStop\` | \`() => void\` | \`undefined\` | Callback when listening stops |
| \`onError\` | \`(error: string) => void\` | \`undefined\` | Callback on error |

## Features

### Real-Time Transcription

See your words appear as you speak:

```tsx
<VoiceInput
  onTranscript={handleInput}
  showInterim={true} // Default: true
/>
```

**Transcript display:**
- **Final text**: Bold, confirmed transcription
- **Interim text**: Italic, gray text for in-progress speech
- **Confidence score**: Visual indicator of accuracy
- **Auto-scroll**: Handles long transcriptions

### Auto-Submit Mode

Automatically submit when you stop speaking:

```tsx
<VoiceInput
  onTranscript={handleInput}
  autoSubmit={true} // Default: true
  // Submits 2 seconds after speech ends
/>
```

**Manual submit mode:**
```tsx
<VoiceInput
  onTranscript={handleInput}
  autoSubmit={false}
  // Shows "Send" and "Cancel" buttons
/>
```

### Multi-Language Support

Support for 100+ languages:

```tsx
// Spanish
<VoiceInput
  onTranscript={handleInput}
  lang="es-ES"
  tooltipText="Haz clic para hablar"
/>

// French
<VoiceInput
  onTranscript={handleInput}
  lang="fr-FR"
  tooltipText="Cliquez pour parler"
/>

// Japanese
<VoiceInput
  onTranscript={handleInput}
  lang="ja-JP"
/>

// Chinese (Simplified)
<VoiceInput
  onTranscript={handleInput}
  lang="zh-CN"
/>
```

**Common language codes:**
- English (US): `en-US`
- English (UK): `en-GB`
- Spanish (Spain): `es-ES`
- Spanish (Latin America): `es-MX`
- French: `fr-FR`
- German: `de-DE`
- Italian: `it-IT`
- Portuguese (Brazil): `pt-BR`
- Russian: `ru-RU`
- Japanese: `ja-JP`
- Korean: `ko-KR`
- Chinese (Simplified): `zh-CN`
- Chinese (Traditional): `zh-TW`
- Arabic: `ar-SA`
- Hindi: `hi-IN`

### Visual Feedback

Animated pulse effect while listening:

```tsx
<VoiceInput
  onTranscript={handleInput}
  // Red pulsing circle while recording
  // Visual confidence indicator
/>
```

**Visual elements:**
- Pulse animation (red, expanding circle)
- Recording indicator (red dot)
- Confidence bar (green progress)
- Status text ("Listening..." / "Voice Input")

### Custom Styling

Customize size, variant, and icons:

```tsx
import { Mic2, Square } from 'lucide-react'

<VoiceInput
  onTranscript={handleInput}
  size="lg"
  variant="primary"
  icon={<Mic2 size={20} />}
  listeningIcon={<Square size={20} />}
/>
```

**Size options:**
- `sm`: 32px (w-8 h-8)
- `md`: 40px (w-10 h-10) - default
- `lg`: 48px (w-12 h-12)

**Variant styles:**
- `primary`: Blue background
- `secondary`: Gray background
- `ghost`: Transparent (default)

### Callbacks

Track voice input lifecycle:

```tsx
<VoiceInput
  onTranscript={(transcript) => {
    console.log('Final transcript:', transcript)
    sendMessage(transcript)
  }}
  onStart={() => {
    console.log('Started listening')
    // Pause other audio, show indicator, etc.
  }}
  onStop={() => {
    console.log('Stopped listening')
    // Resume audio, hide indicator, etc.
  }}
  onError={(error) => {
    console.error('Voice error:', error)
    toast.error(`Voice input failed: ${error}`)
  }}
/>
```

## Inline Voice Input

Integrate voice input directly into text fields:

```tsx
import { InlineVoiceInput } from '@clarity-chat/react'

function ChatInputField() {
  const [value, setValue] = useState('')

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full pr-12"
        placeholder="Type or speak..."
      />
      
      <InlineVoiceInput
        value={value}
        onChange={setValue}
        position="inside" // Places inside input field
      />
    </div>
  )
}
```

**InlineVoiceInput props:**
- `value`: Current input value
- `onChange`: Update value callback
- `lang`: Language code
- `position`: `'inside'` (absolute positioned) or `'outside'` (standalone)

## Complete Example

Full chat interface with voice input:

```tsx
import { useState } from 'react'
import { VoiceInput } from '@clarity-chat/react'
import { Mic, Send } from 'lucide-react'

function VoiceChatInterface() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<string[]>([])

  const handleSend = (text: string) => {
    if (!text.trim()) return
    
    setMessages(prev => [...prev, text])
    setMessage('')
  }

  const handleVoiceInput = (transcript: string) => {
    // Option 1: Send immediately
    handleSend(transcript)
    
    // Option 2: Fill input field
    // setMessage(transcript)
  }

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className="p-3 bg-blue-50 rounded-lg">
            {msg}
          </div>
        ))}
      </div>

      {/* Input area */}
      <div className="border-t p-4">
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSend(message)
                }
              }}
              placeholder="Type a message or click the microphone..."
              className="w-full pr-12 p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
            
            {/* Inline voice button */}
            <div className="absolute right-3 bottom-3">
              <VoiceInput
                onTranscript={handleVoiceInput}
                size="sm"
                variant="ghost"
                showInterim={true}
                autoSubmit={true}
                onStart={() => setMessage('')}
                onError={(err) => {
                  alert(`Voice input error: ${err}`)
                }}
              />
            </div>
          </div>

          <button
            onClick={() => handleSend(message)}
            disabled={!message.trim()}
            className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}
```

## Browser Support

The component uses the Web Speech API:

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome | ✅ Full | Best support, all features |
| Edge | ✅ Full | Chromium-based |
| Safari | ⚠️ Partial | Limited accuracy, some iOS support |
| Firefox | ❌ No | Not supported |
| Opera | ✅ Full | Chromium-based |

**Fallback handling:**
```tsx
function VoiceOrText() {
  return (
    <>
      <VoiceInput
        onTranscript={handleInput}
        // Shows "not supported" message if unavailable
      />
      
      {/* Always provide text input as fallback */}
      <input
        type="text"
        placeholder="Type your message..."
      />
    </>
  )
}
```

## Accessibility

Full accessibility support built-in:

- **ARIA labels**: Descriptive labels for all states
- **Keyboard navigation**: Space/Enter to toggle recording
- **Screen reader**: Status announcements
- **Focus indicators**: Clear visual focus states
- **Alternative input**: Always provide text input fallback

## Error Handling

Common errors and solutions:

```tsx
<VoiceInput
  onTranscript={handleInput}
  onError={(error) => {
    switch (error) {
      case 'not-allowed':
        toast.error('Microphone permission denied')
        break
      case 'no-speech':
        toast.warning('No speech detected. Please try again.')
        break
      case 'network':
        toast.error('Network error. Check your connection.')
        break
      case 'not-supported':
        toast.error('Voice input not supported in this browser')
        break
      default:
        toast.error(\`Voice error: \${error}\`)
    }
  }}
/>
```

## TypeScript

### VoiceInputProps Interface

```typescript
interface VoiceInputProps {
  onTranscript: (transcript: string) => void
  lang?: string
  showInterim?: boolean
  autoSubmit?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'secondary' | 'ghost'
  icon?: React.ReactNode
  listeningIcon?: React.ReactNode
  showTooltip?: boolean
  tooltipText?: string
  disabled?: boolean
  className?: string
  onStart?: () => void
  onStop?: () => void
  onError?: (error: string) => void
}
```

### InlineVoiceInputProps Interface

```typescript
interface InlineVoiceInputProps {
  value: string
  onChange: (value: string) => void
  lang?: string
  position?: 'inside' | 'outside'
  className?: string
}
```

## Related Components

- [Advanced Chat Input](/reference/components/advanced-chat-input) - Full-featured chat input
- [useVoiceInput](/reference/hooks/use-voice-input) - Voice input hook
- [Message](/reference/components/message) - Display sent messages

## Best Practices

1. **Always provide text alternative**: Not all browsers support voice input
2. **Request permissions early**: Ask for microphone access during onboarding
3. **Provide visual feedback**: Users need to see when recording is active
4. **Handle errors gracefully**: Show helpful error messages
5. **Test on mobile**: Voice input is particularly useful on mobile devices
6. **Consider context**: Voice input may not be appropriate in all environments
7. **Privacy considerations**: Inform users that voice data may be processed
8. **Language detection**: Consider auto-detecting user's language
9. **Noise handling**: Test in noisy environments
10. **Timeout configuration**: Adjust auto-submit timeout based on use case

## Performance Tips

- **Debounce interim results**: Avoid excessive re-renders
- **Clean up listeners**: useVoiceInput handles cleanup automatically
- **Memoize callbacks**: Use `useCallback` for event handlers
- **Lazy load**: Load voice input only when needed

## Troubleshooting

### Microphone permission denied
- Request permission with clear explanation
- Provide instructions to enable in browser settings
- Fall back to text input

### No speech detected
- Ensure microphone is working
- Check volume levels
- Try speaking louder or closer to microphone

### Poor transcription accuracy
- Speak clearly and at moderate pace
- Reduce background noise
- Check language setting matches spoken language
- Consider interim results for feedback

### Auto-submit not working
- Ensure `autoSubmit={true}` is set
- Check 2-second timeout is appropriate
- Verify speech has actually ended
