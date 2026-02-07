'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Button, Badge, cn } from '@clarity-chat/primitives'
import { useAutoScroll } from '@clarity-chat/react'
import { Plus, Trash2, ChevronDown } from 'lucide-react'

// Mock for useTokenCounter – requires a backend service not available in demos.
function useTokenCounterMock(config: { model: string }) {
  const [tokenCount, setTokenCount] = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const setInput = useCallback((text: string) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setTokenCount(Math.ceil(text.split(/\s+/).filter(Boolean).length * 1.3))
    }, 150)
  }, [])

  const countTokens = useCallback((text: string) => {
    return Math.ceil(text.split(/\s+/).filter(Boolean).length * 1.3)
  }, [])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return {
    tokenCount,
    setInput,
    countTokens,
    modelMaxTokens: config.model.includes('gpt-4') ? 128000 : 200000,
  }
}

export function AutoScrollDemo() {
  const [messages, setMessages] = useState<
    { id: number; text: string; time: string }[]
  >([])
  const nextId = useRef(1)
  const batchTimersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    return () => {
      batchTimersRef.current.forEach(clearTimeout)
    }
  }, [])

  const { scrollRef, isNearBottom, scrollToBottom } = useAutoScroll({
    dependencies: [messages],
    threshold: 50,
  })

  const addMessage = useCallback(() => {
    const id = nextId.current++
    const samples = [
      'Hello! How can I help you today?',
      'Processing your request...',
      'Here is the analysis of your data.',
      'Would you like me to continue?',
      'Task completed successfully.',
      'Let me look into that for you.',
      'Based on my analysis, I recommend...',
      'Is there anything else you need?',
    ]
    setMessages((prev) => [
      ...prev,
      {
        id,
        text: samples[id % samples.length],
        time: new Date().toLocaleTimeString(),
      },
    ])
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={addMessage}>
          <Plus className="h-4 w-4 mr-1" />
          Add Message
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            batchTimersRef.current.forEach(clearTimeout)
            batchTimersRef.current = Array.from({ length: 5 }, (_, i) =>
              setTimeout(addMessage, i * 100)
            )
          }}
        >
          Add 5 Messages
        </Button>
        <Button variant="outline" size="sm" onClick={() => setMessages([])}>
          <Trash2 className="h-4 w-4 mr-1" />
          Clear
        </Button>
      </div>

      <div className="relative">
        <div
          ref={scrollRef as React.RefObject<HTMLDivElement | null>}
          className="glass-panel rounded-lg h-60 overflow-y-auto p-3 space-y-2"
        >
          {messages.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">
              Add messages to see auto-scroll in action
            </p>
          )}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="flex gap-2 items-start p-2 rounded-md bg-muted/30"
            >
              <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold">AI</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm">{msg.text}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {msg.time}
                </p>
              </div>
            </div>
          ))}
        </div>
        {!isNearBottom && messages.length > 0 && (
          <button
            onClick={scrollToBottom}
            className="absolute bottom-3 right-3 p-2 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex gap-2">
        <Badge variant="outline">threshold: 50px</Badge>
        <Badge variant={isNearBottom ? 'default' : 'secondary'}>
          isNearBottom: {isNearBottom ? 'true' : 'false'}
        </Badge>
        <Badge variant="secondary">{messages.length} messages</Badge>
      </div>
    </div>
  )
}

export function TokenCounterDemo() {
  const [text, setText] = useState('')
  const { tokenCount, setInput, modelMaxTokens } = useTokenCounterMock({
    model: 'gpt-4',
  })

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
    setInput(e.target.value)
  }

  const percentage = Math.min(100, (tokenCount / 4096) * 100)

  return (
    <div className="space-y-4">
      <textarea
        value={text}
        onChange={handleChange}
        placeholder="Type or paste text to count tokens..."
        className="w-full h-32 glass-panel rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
      />
      <div className="glass-panel p-4 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Token count</span>
          <span className="text-sm font-mono">{tokenCount} / 4,096</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-300',
              percentage > 90
                ? 'bg-destructive'
                : percentage > 70
                  ? 'bg-yellow-500'
                  : 'bg-primary'
            )}
            style={{ width: `${Math.min(100, percentage)}%` }}
          />
        </div>
      </div>
      <div className="flex gap-2 flex-wrap">
        <Badge variant="outline">model: gpt-4</Badge>
        <Badge variant="outline">
          max tokens: {modelMaxTokens.toLocaleString()}
        </Badge>
        <Badge variant="secondary">
          ~{Math.ceil(text.length / 4)} chars/token
        </Badge>
      </div>
      <p className="text-xs text-muted-foreground">
        Token counts are approximated using word-based estimation. The library
        version uses the accurate gpt-tokenizer encoding.
      </p>
    </div>
  )
}
