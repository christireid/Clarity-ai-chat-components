import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import { useVoiceInput } from '../../../packages/react/src/hooks/use-voice-input'
import { Button } from '@clarity-chat/primitives'

const meta = {
  title: 'Hooks/Utilities/UseVoiceInput',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# useVoiceInput

Speech-to-text input hook using the Web Speech API for voice recognition.

## Features

- **Real-Time Transcription**: Live speech-to-text conversion
- **Continuous Mode**: Keep listening after speech ends
- **Interim Results**: Show real-time transcription
- **Multi-Language**: Support for 50+ languages
- **Confidence Scores**: Track recognition accuracy
- **Auto-Stop**: Stop after silence period
- **Browser Detection**: Check for API support

## Browser Support

- ✅ **Chrome/Edge**: Full support (best experience)
- ✅ **Safari**: iOS 14.5+, macOS 14.3+
- ❌ **Firefox**: Not yet supported
- ❌ **Mobile Firefox**: Not supported

## Use Cases

- **Voice Chat Input**: Hands-free messaging
- **Accessibility**: Voice input for users with disabilities
- **Voice Commands**: Command palette with voice
- **Transcription**: Real-time note taking
- **Dictation**: Long-form content creation

## Basic Usage

\`\`\`tsx
const {
  isListening,
  transcript,
  finalTranscript,
  isSupported,
  startListening,
  stopListening,
} = useVoiceInput({
  lang: 'en-US',
  continuous: false,
  interimResults: true,
})

if (!isSupported) {
  return <div>Voice input not supported in this browser</div>
}

return (
  <div>
    <button onClick={isListening ? stopListening : startListening}>
      {isListening ? 'Stop' : 'Start'} Listening
    </button>
    <div>{transcript}</div>
  </div>
)
\`\`\`

## API Reference

### Options

- \`lang\`: Language code (default: 'en-US')
- \`continuous\`: Keep listening (default: false)
- \`interimResults\`: Show interim text (default: true)
- \`maxAlternatives\`: Max alternative transcripts (default: 1)
- \`autoStopTimeout\`: Auto-stop after silence in ms (default: 3000)
- \`onTranscript\`: Callback on text update
- \`onSpeechStart\`: Callback when speaking starts
- \`onSpeechEnd\`: Callback when speaking ends
- \`onError\`: Callback on errors

### Returns

- \`isListening\`: Whether currently listening
- \`transcript\`: Full transcript (interim + final)
- \`finalTranscript\`: Confirmed text only
- \`interimTranscript\`: Real-time text (may change)
- \`isSupported\`: Whether browser supports API
- \`error\`: Error message if any
- \`confidence\`: Recognition confidence (0-1)
- \`startListening()\`: Start voice recognition
- \`stopListening()\`: Stop voice recognition
- \`resetTranscript()\`: Clear transcript
`,
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// ============================================================================
// Basic Example
// ============================================================================

export const BasicVoiceInput: Story = {
  render: () => {
    // Note: This is a simulation since Web Speech API needs user interaction
    const [isListening, setIsListening] = React.useState(false)
    const [transcript, setTranscript] = React.useState('')
    const [interimText, setInterimText] = React.useState('')

    const simulateVoiceInput = () => {
      setIsListening(true)
      setInterimText('')
      
      const words = 'Hello this is a test of voice input'.split(' ')
      let index = 0
      
      const interval = setInterval(() => {
        if (index < words.length) {
          setInterimText(words.slice(0, index + 1).join(' '))
          index++
        } else {
          setTranscript(words.join(' '))
          setInterimText('')
          setIsListening(false)
          clearInterval(interval)
        }
      }, 300)
    }

    const reset = () => {
      setTranscript('')
      setInterimText('')
      setIsListening(false)
    }

    return (
      <div className="space-y-4">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> This is a simulation. Real voice input requires user microphone permission.
            In production, this hook uses the Web Speech API.
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={simulateVoiceInput}
            disabled={isListening}
            className="flex items-center gap-2"
          >
            {isListening ? (
              <>
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                Listening...
              </>
            ) : (
              <>🎤 Start Voice Input</>
            )}
          </Button>
          <Button onClick={reset} variant="outline" disabled={isListening}>
            Clear
          </Button>
        </div>

        <div className="border rounded-lg p-4 min-h-[120px] bg-card">
          {isListening && interimText && (
            <div className="text-muted-foreground italic mb-2">
              {interimText}
              <span className="animate-pulse">▋</span>
            </div>
          )}
          {transcript && (
            <div className="font-medium">{transcript}</div>
          )}
          {!isListening && !transcript && (
            <div className="text-muted-foreground text-center py-8">
              Click "Start Voice Input" to begin
            </div>
          )}
        </div>

        {transcript && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
            ✓ Transcription complete
          </div>
        )}
      </div>
    )
  },
}

// ============================================================================
// Language Selection
// ============================================================================

export const LanguageSelection: Story = {
  render: () => {
    const [language, setLanguage] = React.useState('en-US')
    const [isListening, setIsListening] = React.useState(false)
    const [transcript, setTranscript] = React.useState('')

    const languages = [
      { code: 'en-US', name: 'English (US)', sample: 'Hello, how are you?' },
      { code: 'es-ES', name: 'Español', sample: 'Hola, ¿cómo estás?' },
      { code: 'fr-FR', name: 'Français', sample: 'Bonjour, comment allez-vous?' },
      { code: 'de-DE', name: 'Deutsch', sample: 'Hallo, wie geht es dir?' },
      { code: 'ja-JP', name: '日本語', sample: 'こんにちは、お元気ですか？' },
      { code: 'zh-CN', name: '中文', sample: '你好，你好吗？' },
    ]

    const simulateTranscription = () => {
      setIsListening(true)
      const selectedLang = languages.find(l => l.code === language)
      
      setTimeout(() => {
        setTranscript(selectedLang?.sample || 'Hello!')
        setIsListening(false)
      }, 2000)
    }

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Language:</label>
          <select
            value={language}
            onChange={(e) => {
              setLanguage(e.target.value)
              setTranscript('')
            }}
            className="w-full px-3 py-2 border rounded"
            disabled={isListening}
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        <Button
          onClick={simulateTranscription}
          disabled={isListening}
          className="w-full"
        >
          {isListening ? (
            <>
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2" />
              Listening in {languages.find(l => l.code === language)?.name}...
            </>
          ) : (
            <>🎤 Start Voice Input</>
          )}
        </Button>

        <div className="border rounded-lg p-4 min-h-[100px] bg-card">
          {transcript || (
            <div className="text-muted-foreground text-center py-4">
              Select a language and start speaking
            </div>
          )}
        </div>

        {transcript && (
          <div className="text-sm text-muted-foreground">
            Recognized in: {languages.find(l => l.code === language)?.name}
          </div>
        )}
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Voice input with multi-language support.',
      },
    },
  },
}

// ============================================================================
// Chat Integration
// ============================================================================

export const ChatIntegration: Story = {
  render: () => {
    const [messages, setMessages] = React.useState<string[]>([])
    const [isListening, setIsListening] = React.useState(false)
    const [currentTranscript, setCurrentTranscript] = React.useState('')
    const [textInput, setTextInput] = React.useState('')

    const simulateVoice = () => {
      setIsListening(true)
      setCurrentTranscript('')
      
      const sample = 'What is artificial intelligence?'
      const words = sample.split(' ')
      let index = 0
      
      const interval = setInterval(() => {
        if (index < words.length) {
          setCurrentTranscript(words.slice(0, index + 1).join(' '))
          index++
        } else {
          setTextInput(sample)
          setCurrentTranscript('')
          setIsListening(false)
          clearInterval(interval)
        }
      }, 200)
    }

    const sendMessage = () => {
      if (textInput.trim()) {
        setMessages([...messages, textInput])
        setTextInput('')
      }
    }

    return (
      <div className="space-y-4">
        <div className="border rounded-lg p-4 h-64 overflow-y-auto bg-muted/20">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              No messages yet
            </div>
          ) : (
            <div className="space-y-2">
              {messages.map((msg, index) => (
                <div key={index} className="p-3 bg-primary text-primary-foreground rounded-lg">
                  {msg}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          {isListening && currentTranscript && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-sm text-blue-800 flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="italic">{currentTranscript}</span>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Type or use voice input..."
              className="flex-1 px-3 py-2 border rounded-lg resize-none"
              rows={2}
            />
            <div className="flex flex-col gap-2">
              <Button
                onClick={simulateVoice}
                disabled={isListening}
                size="sm"
                variant="outline"
                className="h-full"
              >
                {isListening ? '🔴' : '🎤'}
              </Button>
            </div>
          </div>

          <Button onClick={sendMessage} className="w-full" disabled={!textInput.trim()}>
            Send Message
          </Button>
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Voice input integrated with chat interface.',
      },
    },
  },
}

// ============================================================================
// Browser Support Info
// ============================================================================

export const BrowserSupportInfo: Story = {
  render: () => {
    const browsers = [
      { name: 'Chrome', supported: true, version: '25+', notes: 'Full support' },
      { name: 'Edge', supported: true, version: '79+', notes: 'Full support' },
      { name: 'Safari', supported: true, version: 'iOS 14.5+', notes: 'Good support' },
      { name: 'Firefox', supported: false, version: '-', notes: 'Not yet supported' },
      { name: 'Opera', supported: true, version: '27+', notes: 'Full support' },
      { name: 'Samsung Internet', supported: false, version: '-', notes: 'Not supported' },
    ]

    return (
      <div className="space-y-6">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">Browser Compatibility</h4>
          <p className="text-sm text-blue-800">
            The Web Speech API has varying support across browsers. Check compatibility before using voice features.
          </p>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-3 text-sm font-semibold">Browser</th>
                <th className="text-left p-3 text-sm font-semibold">Version</th>
                <th className="text-left p-3 text-sm font-semibold">Status</th>
                <th className="text-left p-3 text-sm font-semibold">Notes</th>
              </tr>
            </thead>
            <tbody>
              {browsers.map((browser, index) => (
                <tr key={browser.name} className={index % 2 === 0 ? 'bg-card' : 'bg-muted/30'}>
                  <td className="p-3 font-medium">{browser.name}</td>
                  <td className="p-3 text-sm">{browser.version}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      browser.supported 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {browser.supported ? '✅ Supported' : '❌ Not Supported'}
                    </span>
                  </td>
                  <td className="p-3 text-sm text-muted-foreground">{browser.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-semibold text-yellow-900 mb-2">💡 Implementation Tips</h4>
          <ul className="text-sm text-yellow-800 space-y-1 ml-4 list-disc">
            <li>Always check \`isSupported\` before showing voice UI</li>
            <li>Provide fallback text input for unsupported browsers</li>
            <li>Request microphone permission before using</li>
            <li>Handle errors gracefully (e.g., permission denied)</li>
            <li>Show visual feedback while listening</li>
          </ul>
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Browser support information and implementation tips.',
      },
    },
  },
}

// ============================================================================
// Continuous Mode
// ============================================================================

export const ContinuousModeExample: Story = {
  render: () => {
    const [isListening, setIsListening] = React.useState(false)
    const [transcript, setTranscript] = React.useState('')
    const [messages, setMessages] = React.useState<string[]>([])

    const toggleListening = () => {
      if (isListening) {
        setIsListening(false)
        if (transcript) {
          setMessages([...messages, transcript])
          setTranscript('')
        }
      } else {
        setIsListening(true)
        
        // Simulate continuous listening
        const interval = setInterval(() => {
          setTranscript((prev) => {
            const words = ['hello', 'world', 'this', 'is', 'continuous', 'mode']
            const randomWord = words[Math.floor(Math.random() * words.length)]
            return prev ? `${prev} ${randomWord}` : randomWord
          })
        }, 1000)
        
        setTimeout(() => {
          clearInterval(interval)
        }, 5000)
      }
    }

    return (
      <div className="space-y-4">
        <div className="p-4 bg-muted rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold">Continuous Listening Mode</h4>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : 'bg-gray-300'}`} />
              <span className="text-sm">{isListening ? 'Listening' : 'Idle'}</span>
            </div>
          </div>

          <Button onClick={toggleListening} className="w-full">
            {isListening ? 'Stop & Save' : 'Start Continuous Listening'}
          </Button>
        </div>

        <div className="border rounded-lg p-4 min-h-[120px] bg-card">
          <div className="text-sm text-muted-foreground mb-2">Current Transcript:</div>
          <div className="font-medium">
            {transcript || <span className="text-muted-foreground italic">No speech detected...</span>}
            {isListening && <span className="animate-pulse">▋</span>}
          </div>
        </div>

        {messages.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium">Saved Transcripts:</div>
            {messages.map((msg, index) => (
              <div key={index} className="p-3 bg-muted rounded-lg text-sm">
                {msg}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Continuous listening mode that keeps recognizing speech.',
      },
    },
  },
}

// ============================================================================
// Confidence Scores
// ============================================================================

export const ConfidenceScores: Story = {
  render: () => {
    const [results, setResults] = React.useState<Array<{ text: string; confidence: number }>>([])
    
    const simulateRecognition = () => {
      const samples = [
        { text: 'Hello world', confidence: 0.98 },
        { text: 'How are you today', confidence: 0.92 },
        { text: 'The weather is nice', confidence: 0.85 },
        { text: 'Something unclear', confidence: 0.62 },
      ]
      
      const sample = samples[Math.floor(Math.random() * samples.length)]
      setResults([...results, sample])
    }

    return (
      <div className="space-y-4">
        <Button onClick={simulateRecognition}>
          Simulate Voice Recognition
        </Button>

        <div className="space-y-3">
          {results.length === 0 ? (
            <div className="border border-dashed border-border/50 rounded-lg p-8 text-center text-muted-foreground">
              Click button to simulate recognition with confidence scores
            </div>
          ) : (
            results.map((result, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="font-medium">{result.text}</div>
                  <span className={`px-2 py-1 text-xs rounded ${
                    result.confidence >= 0.9 ? 'bg-green-100 text-green-800' :
                    result.confidence >= 0.75 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {(result.confidence * 100).toFixed(0)}% confident
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      result.confidence >= 0.9 ? 'bg-green-500' :
                      result.confidence >= 0.75 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${result.confidence * 100}%` }}
                  />
                </div>
              </div>
            ))
          )}
        </div>

        {results.length > 0 && (
          <div className="p-3 bg-muted rounded-lg text-sm">
            <strong>Tip:</strong> Low confidence scores may indicate unclear speech, background noise,
            or accents. Consider asking users to repeat for better accuracy.
          </div>
        )}
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Displays confidence scores for voice recognition accuracy.',
      },
    },
  },
}
