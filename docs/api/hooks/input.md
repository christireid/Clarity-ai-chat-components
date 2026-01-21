# Input Hooks

Hooks for managing chat input, voice recognition, character counting, and submit state.

## Overview

| Hook | Purpose | Key Features |
|------|---------|--------------|
| `useCharacterCounter` | Character counting with visual feedback | Progress percentage, color states, over-limit detection, warning threshold |
| `useMobileKeyboard` | Mobile keyboard detection and handling | iOS/Android support, auto-scroll, keyboard height, viewport management |
| `useRealisticTyping` | Simulates natural AI response timing | Multi-stage indicators, reading/thinking time, prevents instant responses |
| `useSubmitButtonState` | Submit button state management | Loading/success/error states, auto-reset, validation |
| `useVoiceInput` | Speech-to-text voice recognition | Web Speech API, interim results, multi-language, confidence scores |

---

## useCharacterCounter

Manages character counter logic with visual feedback for input validation.

### Signature

```typescript
function useCharacterCounter(options: UseCharacterCounterOptions): CharacterCounterResult

interface UseCharacterCounterOptions {
  value: string              // Input value to count
  maxLength?: number         // Maximum character limit
  warningThreshold?: number  // Warning at this % of max (default: 0.8)
}

interface CharacterCounterResult {
  charCount: number          // Current character count
  isOverLimit: boolean       // Whether exceeds maxLength
  isNearLimit: boolean       // Whether approaching limit (≥ threshold)
  hasContent: boolean        // Whether has non-whitespace content
  counterColor: string       // Tailwind CSS class for counter color
  progressColor: string      // Tailwind CSS class for progress bar
  progressPercentage: number // Progress as percentage (0-100)
}
```

### Examples

#### Basic Character Counter

```tsx
import { useCharacterCounter } from '@clarity/react/hooks/input'

function ChatInput() {
  const [message, setMessage] = React.useState('')

  const counter = useCharacterCounter({
    value: message,
    maxLength: 500,
    warningThreshold: 0.8, // Warn at 80% (400 chars)
  })

  return (
    <div>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        maxLength={counter.isOverLimit ? counter.charCount : undefined}
      />

      <div className={counter.counterColor}>
        {counter.charCount} / {500}
      </div>

      {counter.isOverLimit && (
        <div className="text-destructive text-sm">
          Message exceeds character limit by {counter.charCount - 500}
        </div>
      )}

      {counter.isNearLimit && !counter.isOverLimit && (
        <div className="text-warning text-sm">
          Approaching character limit
        </div>
      )}
    </div>
  )
}
```

#### Progress Bar Visualization

```tsx
function ChatInputWithProgress() {
  const [message, setMessage] = React.useState('')

  const counter = useCharacterCounter({
    value: message,
    maxLength: 500,
  })

  return (
    <div className="relative">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full p-2 border rounded"
      />

      {/* Progress bar */}
      <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all ${counter.progressColor}`}
          style={{ width: `${counter.progressPercentage}%` }}
        />
      </div>

      {/* Character count */}
      <div className={`text-xs ${counter.counterColor}`}>
        {counter.charCount} / 500
      </div>
    </div>
  )
}
```

#### Disable Submit When Over Limit

```tsx
function ValidatedChatInput() {
  const [message, setMessage] = React.useState('')

  const counter = useCharacterCounter({
    value: message,
    maxLength: 500,
  })

  const handleSubmit = () => {
    if (counter.isOverLimit || !counter.hasContent) {
      return // Prevent submission
    }

    // Submit message
    submitMessage(message)
    setMessage('')
  }

  return (
    <div>
      <textarea value={message} onChange={(e) => setMessage(e.target.value)} />

      <button
        onClick={handleSubmit}
        disabled={counter.isOverLimit || !counter.hasContent}
        className={counter.isOverLimit ? 'opacity-50 cursor-not-allowed' : ''}
      >
        Send
      </button>

      <span className={counter.counterColor}>
        {counter.charCount} / 500
      </span>
    </div>
  )
}
```

### Color States

The hook automatically provides Tailwind CSS classes for visual feedback:

| State | `counterColor` | `progressColor` | Description |
|-------|---------------|-----------------|-------------|
| Empty | `text-muted-foreground` | `bg-primary` | No content |
| Normal | `text-primary` | `bg-primary` | Has content, within limits |
| Warning | `text-[hsl(var(--warning))] font-medium` | `bg-[hsl(var(--warning))]` | Approaching limit (≥80%) |
| Over Limit | `text-destructive font-semibold` | `bg-destructive` | Exceeds maxLength |

### When to Use

✅ **Use when:**
- Chat inputs with character limits
- Forms with validation requirements
- Visual feedback for input length
- Preventing over-limit submissions

❌ **Avoid when:**
- No character limit needed
- Simple inputs without validation
- Char count isn't shown to user

---

## useMobileKeyboard

Detects mobile keyboard show/hide events and provides keyboard height for UI adjustments.

### Signature

```typescript
function useMobileKeyboard(options?: UseMobileKeyboardOptions): MobileKeyboardState

interface UseMobileKeyboardOptions {
  onKeyboardShow?: (height: number) => void
  onKeyboardHide?: () => void
  debounceDelay?: number      // Default: 150ms
  autoScroll?: boolean        // Default: true
  scrollOffset?: number       // Default: 20px
}

interface MobileKeyboardState {
  isKeyboardVisible: boolean
  keyboardHeight: number      // Estimated height in pixels
  isMobile: boolean
  originalViewportHeight: number
}
```

### Additional Utilities

```typescript
// Get mobile viewport height (accounts for address bar)
function useMobileViewportHeight(): number

// Lock body scroll when keyboard is visible
function useMobileKeyboardScrollLock(state?: MobileKeyboardState): void
```

### Examples

#### Adjust UI for Keyboard

```tsx
import { useMobileKeyboard } from '@clarity/react/hooks/input'

function ChatWindow() {
  const { isKeyboardVisible, keyboardHeight, isMobile } = useMobileKeyboard()

  return (
    <div
      className="chat-container"
      style={{
        paddingBottom: isMobile && isKeyboardVisible ? keyboardHeight : 0,
      }}
    >
      <MessageList />
      <ChatInput />
    </div>
  )
}
```

#### Auto-Scroll to Input

```tsx
function ChatInput() {
  const keyboard = useMobileKeyboard({
    autoScroll: true,
    scrollOffset: 20, // Extra 20px padding above input
    onKeyboardShow: (height) => {
      console.log('Keyboard height:', height)
    },
    onKeyboardHide: () => {
      console.log('Keyboard hidden')
    },
  })

  return (
    <div>
      <textarea placeholder="Type a message..." />
      {keyboard.isKeyboardVisible && (
        <div className="text-xs text-muted-foreground">
          Keyboard active
        </div>
      )}
    </div>
  )
}
```

#### Conditional Mobile UI

```tsx
function ChatFooter() {
  const { isKeyboardVisible, isMobile } = useMobileKeyboard()

  if (!isMobile) {
    return <FullFooter />
  }

  if (isKeyboardVisible) {
    // Compact footer when keyboard is visible
    return <CompactFooter />
  }

  return <DefaultFooter />
}
```

#### Lock Scroll When Keyboard Shows

```tsx
function ModalChat() {
  const keyboard = useMobileKeyboard()

  // Prevent body scroll when keyboard is visible
  useMobileKeyboardScrollLock(keyboard)

  return (
    <div style={{ paddingBottom: keyboard.keyboardHeight }}>
      <MessageList />
      <input type="text" />
    </div>
  )
}
```

#### Stable Viewport Height (CSS Custom Property)

```tsx
function App() {
  const viewportHeight = useMobileViewportHeight()

  // Sets CSS variable: --vh (1% of viewport height)
  // Use in CSS: height: calc(var(--vh, 1vh) * 100)

  return (
    <div className="app" style={{ height: `${viewportHeight}px` }}>
      <ChatWindow />
    </div>
  )
}
```

### Platform Support

| Platform | Detection Method | Notes |
|----------|-----------------|-------|
| **iOS** | `visualViewport` API + `focusin`/`focusout` | Most reliable, Safari 13+ |
| **Android** | `window.resize` + viewport height | Works on Chrome, Samsung Internet |
| **Desktop** | Graceful fallback | `isMobile: false`, no keyboard detection |

### When to Use

✅ **Use when:**
- Mobile chat interfaces
- Input needs to stay visible when keyboard appears
- Adjusting layout for keyboard height
- Preventing content from being hidden

❌ **Avoid when:**
- Desktop-only applications
- No keyboard-related UI adjustments needed
- Simple forms without scrolling issues

---

## useRealisticTyping

Simulates natural AI response timing to prevent uncanny valley of instant responses.

### Signature

```typescript
function useRealisticTyping(options?: UseRealisticTypingOptions): UseRealisticTypingReturn

interface UseRealisticTypingOptions {
  minDelay?: number              // Default: 800ms
  maxDelay?: number              // Default: 2000ms
  wordsPerMinute?: number        // Default: 400 WPM reading speed
  charactersPerMinute?: number   // Default: 200 CPM typing speed
  stages?: TypingStage[]         // Custom typing stages
  showIndicatorAfter?: number    // Default: 1000ms
  onTypingStart?: () => void
  onStageChange?: (stage: TypingStage) => void
  onTypingEnd?: () => void
}

interface UseRealisticTypingReturn {
  isTyping: boolean
  currentStage: TypingStage | null
  stageProgress: number          // 0-1
  elapsedTime: number
  startTyping: (inputText?: string, responseLength?: number) => void
  stopTyping: () => void
  calculateDelay: (inputText: string, responseLength?: number) => number
  delayResponse: <T>(response: T, inputText?: string) => Promise<T>
}

interface TypingStage {
  duration: number               // ms
  label: string                  // e.g., "Reading...", "Thinking..."
}
```

### Examples

#### Basic Realistic Typing

```tsx
import { useRealisticTyping } from '@clarity/react/hooks/input'

function ChatWithTyping() {
  const { isTyping, startTyping, stopTyping } = useRealisticTyping({
    minDelay: 800,
    maxDelay: 2000,
  })

  const handleSend = async (message: string) => {
    startTyping(message)

    const response = await sendToAI(message)

    stopTyping()
    displayResponse(response)
  }

  return (
    <div>
      {isTyping && <TypingIndicator />}
      <ChatInput onSend={handleSend} />
    </div>
  )
}
```

#### Multi-Stage Typing Indicator

```tsx
function ChatWithStages() {
  const { isTyping, currentStage, stageProgress } = useRealisticTyping({
    stages: [
      { duration: 1500, label: 'Reading your message...' },
      { duration: 2000, label: 'Thinking...' },
      { duration: 1500, label: 'Crafting response...' },
    ],
    onStageChange: (stage) => {
      console.log('Stage changed:', stage.label)
    },
  })

  return (
    <div>
      {isTyping && currentStage && (
        <div className="typing-indicator">
          <span>{currentStage.label}</span>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${stageProgress * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
```

#### Delayed Response Pattern

```tsx
function ChatWithDelay() {
  const { delayResponse } = useRealisticTyping({
    wordsPerMinute: 400, // Reading speed
    charactersPerMinute: 200, // Typing speed
  })

  const handleSend = async (message: string) => {
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message }),
    }).then(r => r.json())

    // Add realistic delay based on message length
    const delayedResponse = await delayResponse(response, message)

    displayResponse(delayedResponse)
  }

  return <ChatInput onSend={handleSend} />
}
```

#### Calculate Delay for Manual Control

```tsx
function CustomDelayChat() {
  const { calculateDelay } = useRealisticTyping({
    wordsPerMinute: 400,
  })

  const handleSend = async (message: string) => {
    const expectedResponseLength = 500 // Estimate or from API

    // Calculate appropriate delay
    const delay = calculateDelay(message, expectedResponseLength)

    // Show typing indicator
    setIsTyping(true)
    await new Promise(resolve => setTimeout(resolve, delay))
    setIsTyping(false)

    // Display response
    const response = await sendToAI(message)
    displayResponse(response)
  }

  return <ChatInput onSend={handleSend} />
}
```

### Delay Calculation

The hook calculates realistic delays based on three factors:

```typescript
delay = readingTime + thinkingTime + typingTime

readingTime = (wordCount / wordsPerMinute) * 60 * 1000
thinkingTime = min(responseLength * 10, 3000)
typingTime = (responseLength / charactersPerMinute) * 60 * 1000

// Clamped between minDelay and maxDelay
```

**Example:**
- Input: "What is the weather today?" (5 words)
- Expected response: 100 characters
- Reading: (5 / 400) * 60 * 1000 = 750ms
- Thinking: min(100 * 10, 3000) = 1000ms
- Typing: (100 / 200) * 60 * 1000 = 30000ms
- Total: ~1750ms (clamped to maxDelay of 2000ms)

### When to Use

✅ **Use when:**
- AI responses feel too instant/robotic
- Want natural "thinking" indicators
- Improving perceived response quality
- Building human-like chat experiences

❌ **Avoid when:**
- Speed is critical (live chat support)
- Users expect instant responses
- Debugging/development (adds artificial delay)

---

## useSubmitButtonState

Manages submit button state with loading, success, and error states.

### Signature

```typescript
function useSubmitButtonState(options: UseSubmitButtonStateOptions): SubmitButtonStateResult

interface UseSubmitButtonStateOptions {
  onSubmit: (value: string) => void | Promise<void>
  value: string
  disabled?: boolean
  isOverLimit?: boolean
}

interface SubmitButtonStateResult {
  buttonState: ButtonState            // 'idle' | 'loading' | 'success' | 'error'
  handleSubmit: () => Promise<void>
  resetState: () => void
}
```

### Examples

#### Basic Submit Button

```tsx
import { useSubmitButtonState } from '@clarity/react/hooks/input'

function ChatInput() {
  const [message, setMessage] = React.useState('')

  const { buttonState, handleSubmit } = useSubmitButtonState({
    onSubmit: async (value) => {
      await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ message: value }),
      })
      setMessage('') // Clear input on success
    },
    value: message,
  })

  return (
    <div>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={buttonState === 'loading'}
      />

      <button onClick={handleSubmit} disabled={buttonState === 'loading'}>
        {buttonState === 'loading' && <Spinner />}
        {buttonState === 'success' && <CheckIcon />}
        {buttonState === 'error' && <ErrorIcon />}
        {buttonState === 'idle' && 'Send'}
      </button>
    </div>
  )
}
```

#### With Character Counter Validation

```tsx
function ValidatedInput() {
  const [message, setMessage] = React.useState('')

  const counter = useCharacterCounter({
    value: message,
    maxLength: 500,
  })

  const submit = useSubmitButtonState({
    onSubmit: async (value) => {
      await sendMessage(value)
      setMessage('')
    },
    value: message,
    disabled: false,
    isOverLimit: counter.isOverLimit,
  })

  return (
    <div>
      <textarea value={message} onChange={(e) => setMessage(e.target.value)} />

      <div className={counter.counterColor}>
        {counter.charCount} / 500
      </div>

      <button
        onClick={submit.handleSubmit}
        disabled={
          submit.buttonState === 'loading' ||
          counter.isOverLimit ||
          !counter.hasContent
        }
      >
        {submit.buttonState === 'loading' ? 'Sending...' : 'Send'}
      </button>

      {submit.buttonState === 'error' && (
        <div className="text-destructive">Failed to send message</div>
      )}
    </div>
  )
}
```

#### Auto-Reset States

The hook automatically resets button state after showing feedback:

- **Success**: Resets to `idle` after 1 second
- **Error**: Resets to `idle` after 2 seconds

```tsx
function ChatInput() {
  const submit = useSubmitButtonState({
    onSubmit: async (value) => {
      await sendMessage(value)
      // State automatically transitions: loading → success → idle (after 1s)
    },
    value: message,
  })

  // Manual reset if needed
  const handleCancel = () => {
    submit.resetState()
  }

  return <div>...</div>
}
```

### State Transitions

```
idle → loading → success → idle (1s delay)
idle → loading → error → idle (2s delay)
```

### When to Use

✅ **Use when:**
- Chat message submission
- Form submissions with async operations
- Visual feedback for submission state
- Automatic error recovery

❌ **Avoid when:**
- Synchronous operations (no loading state needed)
- Custom state management already in place
- Not showing visual feedback

---

## useVoiceInput

Speech-to-text voice recognition using the Web Speech API.

### Signature

```typescript
function useVoiceInput(options?: UseVoiceInputOptions): VoiceInputState & {
  startListening: () => void
  stopListening: () => void
  resetTranscript: () => void
}

interface UseVoiceInputOptions {
  lang?: string                  // Default: 'en-US'
  continuous?: boolean           // Default: false
  interimResults?: boolean       // Default: true
  maxAlternatives?: number       // Default: 1
  autoStopTimeout?: number       // Auto-stop after silence (ms)
  onTranscript?: (transcript: string, isFinal: boolean) => void
  onSpeechStart?: () => void
  onSpeechEnd?: () => void
  onError?: (error: string) => void
}

interface VoiceInputState {
  isListening: boolean
  transcript: string             // Full transcript (interim + final)
  finalTranscript: string        // Confirmed text only
  interimTranscript: string      // Real-time (may change)
  isSupported: boolean
  error: string | null
  confidence: number             // 0-1
}
```

### Simplified API

```typescript
// Single-shot voice input with auto-toggle
function useSimpleVoiceInput(lang?: string): {
  isActive: boolean
  transcript: string
  toggle: () => void
  isSupported: boolean
  error: string | null
}
```

### Examples

#### Basic Voice Button

```tsx
import { useVoiceInput } from '@clarity/react/hooks/input'

function VoiceButton() {
  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    isSupported,
    error,
  } = useVoiceInput()

  if (!isSupported) {
    return <div>Voice input not supported in this browser</div>
  }

  return (
    <div>
      <button onClick={isListening ? stopListening : startListening}>
        {isListening ? '🔴 Stop' : '🎤 Start'} Listening
      </button>

      {transcript && <p>{transcript}</p>}
      {error && <div className="text-destructive">{error}</div>}
    </div>
  )
}
```

#### Voice-to-Text Chat Input

```tsx
function VoiceChatInput() {
  const [message, setMessage] = React.useState('')

  const voice = useVoiceInput({
    lang: 'en-US',
    continuous: false, // Stop after one utterance
    onTranscript: (text, isFinal) => {
      if (isFinal) {
        setMessage(text) // Update input with final transcript
      }
    },
    onError: (error) => {
      console.error('Voice error:', error)
    },
  })

  return (
    <div>
      <div className="relative">
        <textarea
          value={message || voice.transcript}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type or speak your message..."
        />

        <button
          onClick={voice.isListening ? voice.stopListening : voice.startListening}
          className="absolute right-2 top-2"
        >
          {voice.isListening ? (
            <Mic className="text-red-500 animate-pulse" />
          ) : (
            <Mic />
          )}
        </button>
      </div>

      {voice.error && (
        <div className="text-sm text-destructive">{voice.error}</div>
      )}
    </div>
  )
}
```

#### Continuous Voice Chat

```tsx
function ContinuousVoiceChat() {
  const [messages, setMessages] = React.useState<string[]>([])

  const voice = useVoiceInput({
    continuous: true,
    interimResults: true,
    autoStopTimeout: 3000, // Auto-stop after 3s of silence
    onTranscript: (text, isFinal) => {
      if (isFinal) {
        setMessages(prev => [...prev, text])
        voice.resetTranscript() // Clear for next utterance
      }
    },
  })

  return (
    <div>
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i}>{msg}</div>
        ))}
        {voice.interimTranscript && (
          <div className="text-muted-foreground italic">
            {voice.interimTranscript}...
          </div>
        )}
      </div>

      <button onClick={voice.isListening ? voice.stopListening : voice.startListening}>
        {voice.isListening ? 'Stop Recording' : 'Start Recording'}
      </button>
    </div>
  )
}
```

#### Multi-Language Voice Input

```tsx
function MultilingualVoice() {
  const [lang, setLang] = React.useState('en-US')

  const voice = useVoiceInput({
    lang,
    continuous: true,
    onTranscript: (text, isFinal) => {
      if (isFinal) {
        console.log(`[${lang}] Final:`, text)
      }
    },
  })

  return (
    <div>
      <select value={lang} onChange={(e) => setLang(e.target.value)}>
        <option value="en-US">English (US)</option>
        <option value="en-GB">English (UK)</option>
        <option value="es-ES">Spanish</option>
        <option value="fr-FR">French</option>
        <option value="de-DE">German</option>
        <option value="zh-CN">Chinese (Simplified)</option>
        <option value="ja-JP">Japanese</option>
        <option value="ko-KR">Korean</option>
      </select>

      <button onClick={voice.startListening} disabled={voice.isListening}>
        Start Listening
      </button>

      <p>{voice.transcript}</p>
      <small>Confidence: {(voice.confidence * 100).toFixed(0)}%</small>
    </div>
  )
}
```

#### Simplified Voice Toggle

```tsx
import { useSimpleVoiceInput } from '@clarity/react/hooks/input'

function SimpleVoiceButton() {
  const { isActive, transcript, toggle, isSupported } = useSimpleVoiceInput('en-US')

  if (!isSupported) return null

  return (
    <div>
      <button onClick={toggle}>
        {isActive ? '🔴' : '🎤'}
      </button>
      {transcript && <p>{transcript}</p>}
    </div>
  )
}
```

### Browser Support

| Browser | Support | Notes |
|---------|---------|-------|
| **Chrome/Edge** | ✅ Full | Best support, most reliable |
| **Safari** | ✅ iOS 14.5+, macOS 14.3+ | Requires HTTPS, user gesture |
| **Firefox** | ❌ No | Not yet implemented |
| **Mobile Chrome** | ✅ Yes | Works well on Android |
| **Samsung Internet** | ❌ No | Limited support |

### Common Error Messages

| Error Code | Message | Meaning |
|------------|---------|---------|
| `no-speech` | "No speech detected" | No audio input detected |
| `audio-capture` | "No microphone found" | Microphone not available |
| `not-allowed` | "Microphone permission denied" | User denied permission |
| `network` | "Network error occurred" | Network issue during recognition |
| `aborted` | "Recognition aborted" | Recognition stopped unexpectedly |

### When to Use

✅ **Use when:**
- Mobile chat interfaces
- Accessibility features
- Hands-free operation
- Voice commands
- Multi-language support needed

❌ **Avoid when:**
- Firefox is primary browser (not supported)
- Privacy-sensitive contexts (audio sent to cloud)
- Offline-only applications
- Desktop-only with no voice features

---

## Common Patterns

### Complete Chat Input

```tsx
function CompleteChatInput() {
  const [message, setMessage] = React.useState('')

  // Character counter
  const counter = useCharacterCounter({
    value: message,
    maxLength: 500,
    warningThreshold: 0.8,
  })

  // Mobile keyboard
  const keyboard = useMobileKeyboard({
    autoScroll: true,
    scrollOffset: 20,
  })

  // Realistic typing
  const typing = useRealisticTyping({
    minDelay: 800,
    maxDelay: 2000,
  })

  // Submit state
  const submit = useSubmitButtonState({
    onSubmit: async (value) => {
      typing.startTyping(value)
      await sendMessage(value)
      typing.stopTyping()
      setMessage('')
    },
    value: message,
    isOverLimit: counter.isOverLimit,
  })

  // Voice input
  const voice = useVoiceInput({
    onTranscript: (text, isFinal) => {
      if (isFinal) setMessage(text)
    },
  })

  return (
    <div
      className="chat-input"
      style={{
        marginBottom: keyboard.isMobile ? keyboard.keyboardHeight : 0,
      }}
    >
      {typing.isTyping && (
        <div className="typing-indicator">
          {typing.currentStage?.label}
        </div>
      )}

      <div className="input-container">
        <textarea
          value={message || voice.transcript}
          onChange={(e) => setMessage(e.target.value)}
          disabled={submit.buttonState === 'loading'}
        />

        <button
          onClick={voice.isListening ? voice.stopListening : voice.startListening}
          disabled={!voice.isSupported}
        >
          {voice.isListening ? '🔴' : '🎤'}
        </button>
      </div>

      <div className="input-footer">
        <div className={counter.counterColor}>
          {counter.charCount} / 500
        </div>

        <button
          onClick={submit.handleSubmit}
          disabled={
            submit.buttonState === 'loading' ||
            counter.isOverLimit ||
            !counter.hasContent
          }
        >
          {submit.buttonState === 'loading' ? 'Sending...' : 'Send'}
        </button>
      </div>

      <div className="progress-bar">
        <div
          className={counter.progressColor}
          style={{ width: `${counter.progressPercentage}%` }}
        />
      </div>
    </div>
  )
}
```

---

## Related Hooks

- `useDebounce` - Debounce input changes
- `useThrottle` - Throttle input events
- `useAutoResize` - Auto-resize textarea
- `useClarityChat` - Full chat integration
