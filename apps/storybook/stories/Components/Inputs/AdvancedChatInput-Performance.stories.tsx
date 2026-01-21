import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  AdvancedChatInput,
  type InputSuggestion,
  type SavedPrompt,
} from '@clarity-chat/react'
import { useState } from 'react'
import type { MessageAttachment } from '@clarity-chat/types'

/**
 * **AdvancedChatInput Performance Stories**
 *
 * Demonstrates performance optimizations and regression tests for the AdvancedChatInput component.
 *
 * **Performance Features:**
 * - ✅ Immediate visual feedback (no typing lag)
 * - ✅ Debounced expensive operations (API calls, filtering)
 * - ✅ Efficient suggestion loading
 * - ✅ Smooth autocomplete interactions
 *
 * **Regression Tests Cover:**
 * - ISSUE-018: Input debounce lag prevention
 * - Rapid typing performance
 * - Suggestion loading efficiency
 * - Memory leak prevention
 */

const meta = {
  title: 'Components/Inputs/AdvancedChatInput/Performance',
  component: AdvancedChatInput,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
AdvancedChatInput performance demonstrations and regression testing scenarios.

## Performance Optimizations

- **Immediate Visual Feedback**: Text appears instantly as you type
- **Debounced Expensive Operations**: API calls and filtering are delayed to prevent lag
- **Efficient Suggestion Loading**: Only loads suggestions after typing pauses
- **Memory Management**: Proper cleanup prevents memory leaks

## Test Scenarios

### Typing Performance
- Type rapidly without visual lag
- Experience immediate character feedback
- See debounced suggestion loading

### Suggestion Efficiency
- Trigger suggestions with @ or /
- Experience smooth filtering
- Test with large prompt libraries

### Stress Testing
- Rapid typing bursts
- Multiple suggestion requests
- Memory usage monitoring
        `,
      },
    },
  },
  argTypes: {
    onChange: {
      description: 'Called immediately on every keystroke for visual feedback',
      action: 'input-changed',
    },
    onSuggestionRequest: {
      description: 'Called after debounce delay for expensive operations',
      action: 'suggestion-requested',
    },
    placeholder: {
      description: 'Input placeholder text',
      control: 'text',
    },
  },
} satisfies Meta<typeof AdvancedChatInput>

export default meta
type Story = StoryObj<typeof meta>

// Mock data for performance testing
const mockPrompts: SavedPrompt[] = Array.from({ length: 50 }, (_, i) => ({
  id: `prompt-${i}`,
  userId: 'user1',
  name: `prompt-${i}`,
  content: `This is prompt ${i} with some example content that demonstrates how the suggestion system works efficiently.`,
  description: `Description for prompt ${i}`,
  category: ['General', 'Development', 'Writing'][i % 3],
  tags: [`tag${i}`, 'example'],
  variables: i % 5 === 0 ? [{ name: 'topic', required: true }] : [],
  usageCount: Math.floor(Math.random() * 100),
  isFavorite: i % 7 === 0,
  createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
  updatedAt: new Date(),
}))

/**
 * **Immediate Visual Feedback**
 *
 * Demonstrates that typing appears instantly without any debounce lag.
 * This is the core performance fix - visual updates are immediate.
 */
export const ImmediateVisualFeedback: Story = {
  render: () => {
    const [value, setValue] = useState('')
    const [changeCount, setChangeCount] = useState(0)

    const handleChange = (newValue: string) => {
      setValue(newValue)
      setChangeCount(prev => prev + 1)
    }

    return (
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground">
          <strong>Performance Test:</strong> Type rapidly below. Text should appear instantly.
          <br />
          Changes detected: <span className="font-mono">{changeCount}</span>
        </div>
        <AdvancedChatInput
          value={value}
          onChange={handleChange}
          onSubmit={(content) => console.log('Submitted:', content)}
          placeholder="Type rapidly here - no lag!"
        />
        <div className="text-xs text-muted-foreground p-2 bg-muted rounded">
          Current value: {value || '(empty)'}
        </div>
      </div>
    )
  },
}

/**
 * **Debounced Suggestion Loading**
 *
 * Shows how expensive operations (API calls) are properly debounced
 * while maintaining immediate visual feedback.
 */
export const DebouncedSuggestions: Story = {
  render: () => {
    const [value, setValue] = useState('')
    const [apiCallCount, setApiCallCount] = useState(0)

    const handleSuggestionRequest = async (
      query: string,
      trigger: '@' | '/'
    ): Promise<InputSuggestion[]> => {
      setApiCallCount(prev => prev + 1)

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 100))

      if (trigger === '@') {
        return mockPrompts
          .filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
          .slice(0, 10) // Limit for performance
          .map(p => ({
            id: p.id,
            type: 'prompt' as const,
            label: p.name,
            description: p.description,
            value: p.content,
          }))
      }

      return []
    }

    return (
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground">
          <strong>Debounce Test:</strong> Type "@" to trigger suggestions. API calls are debounced.
          <br />
          API calls made: <span className="font-mono">{apiCallCount}</span>
        </div>
        <AdvancedChatInput
          value={value}
          onChange={setValue}
          onSubmit={(content) => console.log('Submitted:', content)}
          onSuggestionRequest={handleSuggestionRequest}
          savedPrompts={mockPrompts}
          placeholder="Type @ to see debounced suggestions..."
        />
      </div>
    )
  },
}

/**
 * **Large Dataset Performance**
 *
 * Tests performance with large prompt libraries and rapid interactions.
 */
export const LargeDatasetPerformance: Story = {
  render: () => {
    const [value, setValue] = useState('')
    const [renderTime, setRenderTime] = useState<number>(0)

    const largePrompts: SavedPrompt[] = Array.from({ length: 500 }, (_, i) => ({
      id: `large-prompt-${i}`,
      userId: 'user1',
      name: `performance-test-prompt-${i}`,
      content: `Content for performance test prompt ${i}. This simulates real-world usage with large prompt libraries.`,
      description: `Performance test prompt ${i}`,
      category: 'Performance',
      tags: ['test', 'performance'],
      variables: [],
      usageCount: i,
      isFavorite: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }))

    const startTime = performance.now()

    React.useEffect(() => {
      const endTime = performance.now()
      setRenderTime(endTime - startTime)
    })

    return (
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground">
          <strong>Large Dataset Test:</strong> 500 prompts loaded. Type "@performance" to filter.
          <br />
          Initial render time: <span className="font-mono">{renderTime.toFixed(2)}ms</span>
        </div>
        <AdvancedChatInput
          value={value}
          onChange={setValue}
          onSubmit={(content) => console.log('Submitted:', content)}
          savedPrompts={largePrompts}
          placeholder="Type @performance to test large dataset filtering..."
        />
      </div>
    )
  },
}

/**
 * **Rapid Typing Stress Test**
 *
 * Simulates rapid typing to ensure no performance degradation or visual lag.
 */
export const RapidTypingStressTest: Story = {
  render: () => {
    const [value, setValue] = useState('')
    const [typingSpeed, setTypingSpeed] = useState<number>(0)
    const lastChangeTime = React.useRef<number>(Date.now())

    const handleChange = (newValue: string) => {
      const now = Date.now()
      const timeDiff = now - lastChangeTime.current
      if (timeDiff > 0) {
        setTypingSpeed(Math.round(1000 / timeDiff)) // chars per second
      }
      lastChangeTime.current = now
      setValue(newValue)
    }

    return (
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground">
          <strong>Stress Test:</strong> Type as rapidly as possible. Monitor for lag or performance issues.
          <br />
          Typing speed: <span className="font-mono">{typingSpeed} chars/sec</span>
          <br />
          Character count: <span className="font-mono">{value.length}</span>
        </div>
        <AdvancedChatInput
          value={value}
          onChange={handleChange}
          onSubmit={(content) => console.log('Submitted:', content)}
          placeholder="Type rapidly here - test performance under stress!"
          maxLength={500}
        />
        <div className="text-xs text-muted-foreground p-2 bg-muted rounded max-h-20 overflow-y-auto">
          {value || '(start typing)'}
        </div>
      </div>
    )
  },
}

/**
 * **Memory Leak Prevention**
 *
 * Demonstrates proper cleanup and memory management during component lifecycle.
 */
export const MemoryLeakPrevention: Story = {
  render: () => {
    const [mounted, setMounted] = useState(true)
    const [value, setValue] = useState('')
    const [cycleCount, setCycleCount] = useState(0)

    const handleUnmountRemount = () => {
      setMounted(false)
      setTimeout(() => {
        setMounted(true)
        setCycleCount(prev => prev + 1)
        setValue('')
      }, 500)
    }

    if (!mounted) {
      return (
        <div className="p-4 text-center">
          <div className="animate-pulse">Component unmounting...</div>
          <button
            onClick={() => setMounted(true)}
            className="mt-2 px-4 py-2 bg-primary text-primary-foreground rounded"
          >
            Remount Early
          </button>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground">
          <strong>Memory Test:</strong> Unmount/remount cycles test cleanup.
          <br />
          Cycles completed: <span className="font-mono">{cycleCount}</span>
        </div>
        <button
          onClick={handleUnmountRemount}
          className="px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/80"
        >
          Test Unmount/Remount Cycle
        </button>
        <AdvancedChatInput
          key={cycleCount} // Force re-mount
          value={value}
          onChange={setValue}
          onSubmit={(content) => console.log('Submitted:', content)}
          savedPrompts={mockPrompts}
          placeholder="Type here during unmount/remount cycles..."
        />
      </div>
    )
  },
}

/**
 * **Autocomplete Performance**
 *
 * Tests the complete autocomplete flow with various interaction patterns.
 */
export const AutocompletePerformance: Story = {
  render: () => {
    const [value, setValue] = useState('')
    const [interactionLog, setInteractionLog] = useState<string[]>([])

    const logInteraction = (message: string) => {
      setInteractionLog(prev => [...prev.slice(-4), `${Date.now() % 10000}: ${message}`])
    }

    const handleSuggestionRequest = async (
      query: string,
      trigger: '@' | '/'
    ): Promise<InputSuggestion[]> => {
      logInteraction(`API called: ${trigger}${query}`)

      // Simulate varying response times
      const delay = Math.random() * 200 + 50
      await new Promise(resolve => setTimeout(resolve, delay))

      if (trigger === '@') {
        return mockPrompts
          .filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
          .slice(0, 8)
          .map(p => ({
            id: p.id,
            type: 'prompt' as const,
            label: p.name,
            description: p.description,
            value: p.content,
          }))
      }

      return []
    }

    const handleSubmit = (content: string, attachments?: MessageAttachment[]) => {
      logInteraction(`Submitted: ${content}`)
      console.log('Submitted:', content, attachments)
    }

    return (
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground">
          <strong>Autocomplete Test:</strong> Use @ and / triggers. Monitor interaction timing.
        </div>
        <AdvancedChatInput
          value={value}
          onChange={(newValue) => {
            setValue(newValue)
            logInteraction(`Value changed: ${newValue.length} chars`)
          }}
          onSubmit={handleSubmit}
          onSuggestionRequest={handleSuggestionRequest}
          savedPrompts={mockPrompts}
          placeholder="Type @ or / to test autocomplete performance..."
        />
        <div className="text-xs bg-muted p-2 rounded max-h-32 overflow-y-auto">
          <strong>Interaction Log:</strong>
          {interactionLog.map((log, i) => (
            <div key={i} className="font-mono">{log}</div>
          ))}
        </div>
      </div>
    )
  },
}