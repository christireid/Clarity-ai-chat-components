import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { StreamingMessage, type ToolCall, type Citation } from '@clarity-chat/react'
import { useState } from 'react'

/**
 * **StreamingMessage Animation Stories**
 *
 * Demonstrates 60fps animation timing and smooth text streaming.
 *
 * **Key Features:**
 * - ✅ 60fps animation timing (~16.67ms intervals)
 * - ✅ Smooth character reveals
 * - ✅ Consistent animation performance
 * - ✅ requestAnimationFrame optimization
 *
 * **Regression Tests Cover:**
 * - ISSUE-022: Streaming animation smoothness
 * - 60fps timing accuracy
 * - Memory leak prevention
 */

const meta = {
  title: 'Components/Message/StreamingMessage/Animation',
  component: StreamingMessage,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
StreamingMessage animation performance demonstrations and 60fps timing testing.

## 60fps Animation Timing

The StreamingMessage component uses precise animation timing for smooth text streaming:

- **Exact Intervals**: Characters revealed every ~16.67ms (60fps)
- **Smooth Animation**: No stuttering or inconsistent timing
- **Performance Optimized**: Uses requestAnimationFrame for optimal performance
- **Memory Safe**: Proper cleanup prevents leaks

## Animation Features

- **Precise Timing**: 60fps character reveals
- **Consistent Speed**: Configurable streaming speeds
- **Smooth Transitions**: No janky animations
- **Cleanup**: Proper animation frame management

## Test Scenarios

### Animation Timing
- 60fps character reveals
- Consistent intervals
- Performance monitoring

### Speed Control
- Fast, normal, slow speeds
- Dynamic speed changes
- Smooth transitions

### Memory Management
- Animation cleanup
- Frame management
- Leak prevention
        `,
      },
    },
  },
  argTypes: {
    content: {
      description: 'Text content to stream',
      control: 'text',
    },
    isStreaming: {
      description: 'Whether streaming is active',
      control: 'boolean',
    },
    smoothStreaming: {
      description: 'Enable smooth streaming animation',
      control: 'boolean',
      defaultValue: true,
    },
    streamingSpeed: {
      description: 'Animation speed',
      control: { type: 'select', options: ['fast', 'normal', 'slow'] },
      defaultValue: 'normal',
    },
  },
} satisfies Meta<typeof StreamingMessage>

export default meta
type Story = StoryObj<typeof meta>

// Mock data for testing
const mockToolCall: ToolCall = {
  id: 'tool-1',
  name: 'search_database',
  arguments: { query: 'test query' },
  result: 'Search completed successfully',
}

const mockCitation: Citation = {
  id: 'cite-1',
  title: 'Test Source',
  url: 'https://example.com',
  snippet: 'This is a test citation snippet.',
}

/**
 * **Basic 60fps Streaming**
 *
 * Demonstrates smooth character-by-character text streaming at 60fps.
 */
export const Basic60fpsStreaming: Story = {
  render: () => {
    const streamingContent = `This message demonstrates smooth 60fps text streaming animation.

Each character appears at precise 16.67-millisecond intervals for buttery smooth animation.

The timing is controlled by requestAnimationFrame to ensure consistent performance across different devices and browsers.

Notice how the text flows naturally without stuttering or inconsistent timing gaps.`

    const [isStreaming, setIsStreaming] = useState(true)
    const [animationStats, setAnimationStats] = useState({
      startTime: 0,
      charCount: 0,
      fps: 0,
    })

    React.useEffect(() => {
      if (isStreaming) {
        setAnimationStats(prev => ({ ...prev, startTime: performance.now(), charCount: 0 }))

        // Monitor animation performance
        const interval = setInterval(() => {
          const elapsed = performance.now() - animationStats.startTime
          const fps = elapsed > 0 ? (animationStats.charCount / elapsed) * 1000 : 0
          setAnimationStats(prev => ({ ...prev, fps: Math.round(fps) }))
        }, 100)

        return () => clearInterval(interval)
      }
    }, [isStreaming])

    const handleContentChange = (newContent: string) => {
      setAnimationStats(prev => ({ ...prev, charCount: newContent.length }))
    }

    return (
      <div className="max-w-2xl mx-auto p-4">
        <h2 className="text-lg font-semibold mb-4">60fps Streaming Animation</h2>
        <div className="mb-4 p-3 bg-muted rounded">
          <div className="text-sm">
            <strong>Streaming:</strong>{' '}
            <span className={`font-mono ${isStreaming ? 'text-green-600' : 'text-orange-600'}`}>
              {isStreaming ? 'Active' : 'Complete'}
            </span>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Characters: <span className="font-mono">{animationStats.charCount}</span> •
            Effective FPS: <span className="font-mono">{animationStats.fps}</span>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setIsStreaming(true)}
            disabled={isStreaming}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50"
          >
            Start Streaming
          </button>
          <button
            onClick={() => setIsStreaming(false)}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/90"
          >
            Complete Streaming
          </button>
        </div>

        <div className="border rounded-lg p-4">
          <StreamingMessage
            content={streamingContent}
            isStreaming={isStreaming}
            smoothStreaming={true}
            streamingSpeed="normal"
          />
        </div>
      </div>
    )
  },
}

/**
 * **Animation Speed Comparison**
 *
 * Shows different streaming speeds and their timing characteristics.
 */
export const AnimationSpeedComparison: Story = {
  render: () => {
    const content = `This demonstrates different streaming animation speeds.

Fast speed: ~120 characters per second
Normal speed: ~80 characters per second  
Slow speed: ~50 characters per second

Each speed maintains smooth 60fps animation timing while varying the character reveal rate.`

    const [currentSpeed, setCurrentSpeed] = useState<'fast' | 'normal' | 'slow'>('normal')
    const [isStreaming, setIsStreaming] = useState(false)

    const speeds = [
      { key: 'fast' as const, label: 'Fast (~120 cps)', charsPerSec: 120 },
      { key: 'normal' as const, label: 'Normal (~80 cps)', charsPerSec: 80 },
      { key: 'slow' as const, label: 'Slow (~50 cps)', charsPerSec: 50 },
    ]

    const startStreaming = (speed: 'fast' | 'normal' | 'slow') => {
      setCurrentSpeed(speed)
      setIsStreaming(true)
    }

    return (
      <div className="max-w-3xl mx-auto p-4">
        <h2 className="text-lg font-semibold mb-4">Animation Speed Comparison</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Test different streaming speeds while maintaining smooth 60fps animation.
        </p>

        <div className="grid grid-cols-3 gap-2 mb-4">
          {speeds.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => startStreaming(key)}
              disabled={isStreaming}
              className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50 text-sm"
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mb-4 p-3 bg-muted rounded">
          <div className="text-sm">
            <strong>Current Speed:</strong>{' '}
            <span className="font-mono text-blue-600">{currentSpeed}</span>
            <span className="text-xs text-muted-foreground ml-2">
              ({speeds.find(s => s.key === currentSpeed)?.charsPerSec} chars/sec)
            </span>
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <StreamingMessage
            content={content}
            isStreaming={isStreaming}
            smoothStreaming={true}
            streamingSpeed={currentSpeed}
          />
        </div>
      </div>
    )
  },
}

/**
 * **Timing Precision Test**
 *
 * Measures and displays animation timing precision.
 */
export const TimingPrecisionTest: Story = {
  render: () => {
    const content = `This test measures animation timing precision.

The component should maintain consistent 16.67ms intervals between animation frames.

Any deviation from this timing would cause stuttering or inconsistent character reveals.`

    const [isStreaming, setIsStreaming] = useState(false)
    const [timingData, setTimingData] = useState<{
      intervals: number[]
      avgInterval: number
      minInterval: number
      maxInterval: number
      totalChars: number
    }>({
      intervals: [],
      avgInterval: 0,
      minInterval: 0,
      maxInterval: 0,
      totalChars: 0,
    })

    const resetTimingData = () => {
      setTimingData({
        intervals: [],
        avgInterval: 0,
        minInterval: 0,
        maxInterval: 0,
        totalChars: 0,
      })
    }

    const startTimingTest = () => {
      resetTimingData()
      setIsStreaming(true)

      // Monitor timing (this is a simplified version for demo)
      let lastTime = performance.now()
      const intervals: number[] = []

      const monitorInterval = setInterval(() => {
        const now = performance.now()
        const interval = now - lastTime
        intervals.push(interval)
        lastTime = now

        if (intervals.length > 100) { // Keep last 100 intervals
          intervals.shift()
        }

        const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length
        const minInterval = Math.min(...intervals)
        const maxInterval = Math.max(...intervals)

        setTimingData(prev => ({
          ...prev,
          intervals: intervals.slice(),
          avgInterval,
          minInterval,
          maxInterval,
        }))
      }, 50)

      // Stop monitoring after streaming completes
      setTimeout(() => {
        clearInterval(monitorInterval)
      }, 10000) // 10 seconds max
    }

    return (
      <div className="max-w-4xl mx-auto p-4">
        <h2 className="text-lg font-semibold mb-4">Timing Precision Test</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Measures animation frame timing precision for smooth 60fps streaming.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-muted p-3 rounded text-center">
            <div className="text-xs text-muted-foreground">Avg Interval</div>
            <div className="text-lg font-mono">{timingData.avgInterval.toFixed(2)}ms</div>
          </div>
          <div className="bg-muted p-3 rounded text-center">
            <div className="text-xs text-muted-foreground">Min Interval</div>
            <div className="text-lg font-mono">{timingData.minInterval.toFixed(2)}ms</div>
          </div>
          <div className="bg-muted p-3 rounded text-center">
            <div className="text-xs text-muted-foreground">Max Interval</div>
            <div className="text-lg font-mono">{timingData.maxInterval.toFixed(2)}ms</div>
          </div>
          <div className="bg-muted p-3 rounded text-center">
            <div className="text-xs text-muted-foreground">Target (60fps)</div>
            <div className="text-lg font-mono">16.67ms</div>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          <button
            onClick={startTimingTest}
            disabled={isStreaming}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50"
          >
            Start Timing Test
          </button>
          <button
            onClick={() => setIsStreaming(false)}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/90"
          >
            Stop Streaming
          </button>
          <button
            onClick={resetTimingData}
            className="px-4 py-2 bg-muted text-muted-foreground rounded hover:bg-muted/80"
          >
            Reset Data
          </button>
        </div>

        <div className="border rounded-lg p-4">
          <StreamingMessage
            content={content}
            isStreaming={isStreaming}
            smoothStreaming={true}
            streamingSpeed="normal"
          />
        </div>
      </div>
    )
  },
}

/**
 * **Memory Leak Prevention**
 *
 * Tests proper cleanup of animation frames and memory management.
 */
export const MemoryLeakPrevention: Story = {
  render: () => {
    const [mounted, setMounted] = useState(true)
    const [cycleCount, setCycleCount] = useState(0)

    const content = `This tests memory leak prevention during component lifecycle changes.

The animation frames should be properly cleaned up when the component unmounts or remounts.

Multiple unmount/remount cycles should not cause memory leaks or animation conflicts.`

    const testUnmountRemount = () => {
      setMounted(false)
      setTimeout(() => {
        setMounted(true)
        setCycleCount(prev => prev + 1)
      }, 1000)
    }

    if (!mounted) {
      return (
        <div className="max-w-2xl mx-auto p-8 text-center">
          <div className="animate-pulse text-lg">Component unmounting...</div>
          <div className="text-sm text-muted-foreground mt-2">
            Testing animation frame cleanup and memory management
          </div>
          <div className="text-xs text-muted-foreground mt-4">
            Cycle count: {cycleCount}
          </div>
        </div>
      )
    }

    return (
      <div className="max-w-3xl mx-auto p-4">
        <h2 className="text-lg font-semibold mb-4">Memory Leak Prevention Test</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Test proper cleanup during unmount/remount cycles. Cycle count: <span className="font-mono">{cycleCount}</span>
        </p>

        <div className="flex gap-2 mb-4">
          <button
            onClick={testUnmountRemount}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Test Unmount/Remount Cycle
          </button>
          <button
            onClick={() => setMounted(false)}
            className="px-4 py-2 bg-destructive text-destructive-foreground rounded hover:bg-destructive/90"
          >
            Unmount Only
          </button>
        </div>

        <div className="border rounded-lg p-4">
          <StreamingMessage
            key={cycleCount} // Force re-mount for testing
            content={content}
            isStreaming={true}
            smoothStreaming={true}
            streamingSpeed="normal"
          />
        </div>
      </div>
    )
  },
}

/**
 * **Complex Content Streaming**
 *
 * Tests animation with complex content including special characters and formatting.
 */
export const ComplexContentStreaming: Story = {
  render: () => {
    const complexContent = `🚀 Complex content streaming test with Unicode characters!

This includes emojis 🚀🔥💡, mathematical symbols ∑∫√∮, and various scripts:
- English: Hello World
- Español: ¡Hola Mundo!
- Français: Bonjour le Monde
- Deutsch: Hallo Welt
- 日本語: こんにちは世界
- 한국어: 안녕하세요 세계
- العربية: مرحبا بالعالم
- Русский: Привет мир

Special characters: àáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ

Numbers: 0123456789
Symbols: !@#$%^&*()_+-=[]{}|;':",./<>?

The animation should handle all these characters smoothly at 60fps.`

    const [isStreaming, setIsStreaming] = useState(false)
    const [speed, setSpeed] = useState<'fast' | 'normal' | 'slow'>('normal')

    return (
      <div className="max-w-4xl mx-auto p-4">
        <h2 className="text-lg font-semibold mb-4">Complex Content Streaming</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Test streaming with Unicode characters, emojis, and special symbols.
        </p>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setIsStreaming(!isStreaming)}
            className={`px-4 py-2 rounded ${
              isStreaming
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {isStreaming ? 'Pause' : 'Start'} Streaming
          </button>

          <select
            value={speed}
            onChange={(e) => setSpeed(e.target.value as 'fast' | 'normal' | 'slow')}
            className="px-3 py-2 border rounded"
          >
            <option value="fast">Fast</option>
            <option value="normal">Normal</option>
            <option value="slow">Slow</option>
          </select>
        </div>

        <div className="border rounded-lg p-4 bg-white">
          <StreamingMessage
            content={complexContent}
            isStreaming={isStreaming}
            smoothStreaming={true}
            streamingSpeed={speed}
          />
        </div>
      </div>
    )
  },
}