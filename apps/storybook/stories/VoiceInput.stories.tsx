import type { Meta, StoryObj } from '@storybook/react'
import { VoiceInput, InlineVoiceInput } from '@clarity-chat/react'
import { useState } from 'react'

const meta: Meta<typeof VoiceInput> = {
  title: 'Phase 4/Voice Input',
  component: VoiceInput,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Voice input component with Web Speech API support. Enables voice-to-text functionality with real-time transcription.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof VoiceInput>

export const Default: Story = {
  args: {
    onTranscript: (transcript) => {
      console.log('Transcript:', transcript)
      alert(`You said: ${transcript}`)
    },
  },
}

export const WithInterimResults: Story = {
  args: {
    onTranscript: (transcript) => {
      console.log('Transcript:', transcript)
    },
    showInterim: true,
    autoSubmit: true,
  },
}

export const ManualSubmit: Story = {
  args: {
    onTranscript: (transcript) => {
      console.log('Transcript:', transcript)
      alert(`Submitted: ${transcript}`)
    },
    showInterim: true,
    autoSubmit: false,
  },
}

export const SmallSize: Story = {
  args: {
    onTranscript: (transcript) => {
      console.log('Transcript:', transcript)
    },
    size: 'sm',
  },
}

export const LargeSize: Story = {
  args: {
    onTranscript: (transcript) => {
      console.log('Transcript:', transcript)
    },
    size: 'lg',
  },
}

export const PrimaryVariant: Story = {
  args: {
    onTranscript: (transcript) => {
      console.log('Transcript:', transcript)
    },
    variant: 'primary',
    size: 'lg',
  },
}

export const SecondaryVariant: Story = {
  args: {
    onTranscript: (transcript) => {
      console.log('Transcript:', transcript)
    },
    variant: 'secondary',
    size: 'lg',
  },
}

export const SpanishLanguage: Story = {
  args: {
    onTranscript: (transcript) => {
      console.log('Transcript (es-ES):', transcript)
      alert(`Dijiste: ${transcript}`)
    },
    lang: 'es-ES',
    tooltipText: 'Haz clic para hablar',
  },
}

export const WithCallbacks: Story = {
  args: {
    onTranscript: (transcript) => {
      console.log('Transcript:', transcript)
    },
    onStart: () => {
      console.log('Started listening')
    },
    onStop: () => {
      console.log('Stopped listening')
    },
    onError: (error) => {
      console.error('Voice error:', error)
    },
  },
}

export const InlineExample: Story = {
  render: () => {
    const [value, setValue] = useState('')

    return (
      <div className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Type or speak..."
            className="w-full pr-12 px-4 py-2 border border-gray-300 rounded-lg"
          />
          <InlineVoiceInput
            value={value}
            onChange={setValue}
            position="inside"
          />
        </div>
        
        <div className="p-4 bg-gray-100 rounded-lg">
          <h4 className="font-semibold mb-2">Current Value:</h4>
          <p>{value || '(empty)'}</p>
        </div>
      </div>
    )
  },
}

export const ChatIntegrationExample: Story = {
  render: () => {
    const [messages, setMessages] = useState<string[]>([])
    const [input, setInput] = useState('')

    const handleSend = () => {
      if (input.trim()) {
        setMessages([...messages, input])
        setInput('')
      }
    }

    return (
      <div className="max-w-md space-y-4">
        <div className="h-64 border border-gray-300 rounded-lg p-4 overflow-y-auto space-y-2">
          {messages.map((msg, i) => (
            <div key={i} className="p-2 bg-blue-100 rounded">
              {msg}
            </div>
          ))}
        </div>
        
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type or speak your message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
          />
          <VoiceInput
            onTranscript={(transcript) => {
              setInput((prev) => prev ? `${prev} ${transcript}` : transcript)
            }}
            size="lg"
            variant="primary"
          />
          <button
            onClick={handleSend}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </div>
    )
  },
}
