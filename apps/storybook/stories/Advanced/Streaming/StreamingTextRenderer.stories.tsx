import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState, useEffect } from 'react'
import { StreamingTextRenderer } from '@clarity-chat/react'
import { Button } from '@clarity-chat/primitives'

const meta: Meta<typeof StreamingTextRenderer> = {
  title: 'Advanced/Streaming/StreamingTextRenderer',
  component: StreamingTextRenderer,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof StreamingTextRenderer>

const InteractiveWrapper = (args: any) => {
  const [text, setText] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const fullText = args.text || 'This is a streaming text example that demonstrates progressive character-by-character display with smooth animation and cursor feedback.'

  const handleStart = () => {
    setText('')
    setIsStreaming(true)
    
    let index = 0
    const interval = setInterval(() => {
      if (index < fullText.length) {
        setText(fullText.slice(0, index + 1))
        index++
      } else {
        clearInterval(interval)
        setIsStreaming(false)
      }
    }, args.typingSpeed || 30)
  }

  return (
    <div className="space-y-4">
      <Button onClick={handleStart}>Start Streaming</Button>
      <div className="p-4 border rounded-lg min-h-[100px]">
        <StreamingTextRenderer
          {...args}
          text={text}
          isStreaming={isStreaming}
        />
      </div>
    </div>
  )
}

export const CharacterByCharacter: Story = {
  render: InteractiveWrapper,
  args: {
    displayMode: 'character',
    typingSpeed: 30,
    showCursor: true,
  },
}

export const ChunkBased: Story = {
  render: InteractiveWrapper,
  args: {
    displayMode: 'chunk',
    typingSpeed: 50,
    chunkSize: 5,
    showCursor: true,
  },
}

export const FastTyping: Story = {
  render: InteractiveWrapper,
  args: {
    displayMode: 'character',
    typingSpeed: 10,
    showCursor: true,
  },
}

export const SlowTyping: Story = {
  render: InteractiveWrapper,
  args: {
    displayMode: 'character',
    typingSpeed: 100,
    showCursor: true,
  },
}

export const WithoutCursor: Story = {
  render: InteractiveWrapper,
  args: {
    displayMode: 'character',
    typingSpeed: 30,
    showCursor: false,
  },
}

export const CustomCursor: Story = {
  render: InteractiveWrapper,
  args: {
    displayMode: 'character',
    typingSpeed: 30,
    showCursor: true,
    cursorChar: '|',
  },
}

export const InstantDisplay: Story = {
  render: InteractiveWrapper,
  args: {
    displayMode: 'instant',
    showCursor: false,
  },
}
