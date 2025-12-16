import { SecureLogger } from '@/lib/security/secureLogger';
import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import { useTokenTracker, type MessageWithTokens } from '@clarity-chat/react'
import { Button } from '@clarity-chat/primitives'

const meta = {
  title: 'Hooks/Performance/UseTokenTracker',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# useTokenTracker

Track token usage across a conversation with automatic cost calculation, limit warnings, and intelligent pruning suggestions.

## Features

- **Real-Time Tracking**: Monitor token usage as conversation grows
- **Cost Estimation**: Automatic cost calculation based on model pricing
- **Limit Warnings**: Alerts when approaching token limits
- **Multi-Model Support**: Works with GPT-4, Claude, and more
- **Pruning Suggestions**: Suggests when to remove old messages
- **Threshold Alerts**: Customizable warning and critical thresholds
- **Usage Stats**: Input/output token breakdown

## Use Cases

- **Chat Applications**: Track conversation token usage
- **Cost Monitoring**: Keep tabs on API costs
- **Context Management**: Know when to prune messages
- **Budget Alerts**: Warn users about cost
- **Performance**: Optimize for token limits

## Basic Usage

\`\`\`tsx
const { 
  tokens,
  estimatedCost,
  isNearLimit,
  isCritical,
  percentage,
  addMessage 
} = useTokenTracker({
  modelName: 'gpt-4-turbo',
  warningThreshold: 0.8,
  criticalThreshold: 0.95,
})

// Add messages as they're sent
addMessage({
  role: 'user',
  content: 'Hello!',
  tokens: 5,
})
\`\`\`

## API Reference

### Options

- \`modelName\`: Model identifier (gpt-4, claude-3-opus, etc.)
- \`maxTokens\`: Manual token limit (auto-detected for known models)
- \`inputCostPerToken\`: Input token cost (auto-detected)
- \`outputCostPerToken\`: Output token cost (auto-detected)
- \`warningThreshold\`: Warning at % of limit (default: 0.8)
- \`criticalThreshold\`: Critical at % of limit (default: 0.95)
- \`onWarning\`: Callback when warning triggered
- \`onCritical\`: Callback when critical triggered

### Returns

- \`tokens\`: Total token count
- \`inputTokens\`: User message tokens
- \`outputTokens\`: Assistant response tokens
- \`estimatedCost\`: Total cost in dollars
- \`isNearLimit\`: At warning threshold
- \`isCritical\`: At critical threshold
- \`percentage\`: Percent of limit used (0-100)
- \`canSend(tokens)\`: Check if message fits
- \`suggestPruning\`: Should prune messages
- \`addMessage(msg)\`: Add message
- \`removeMessage(index)\`: Remove message
- \`reset()\`: Clear all tracking
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

export const BasicUsage: Story = {
  render: () => {
    const [messages, setMessages] = React.useState<MessageWithTokens[]>([])
    const [inputText, setInputText] = React.useState('')

    const tracker = useTokenTracker({
      modelName: 'gpt-4-turbo',
      warningThreshold: 0.7,
      criticalThreshold: 0.9,
    })

    const addUserMessage = () => {
      if (!inputText.trim()) return
      
      const newMessage: MessageWithTokens = {
        role: 'user',
        content: inputText,
        tokens: Math.ceil(inputText.split(' ').length * 1.3), // Rough estimate
      }
      
      setMessages([...messages, newMessage])
      tracker.addMessage(newMessage)
      setInputText('')
      
      // Simulate AI response
      setTimeout(() => {
        const aiMessage: MessageWithTokens = {
          role: 'assistant',
          content: 'This is a simulated AI response.',
          tokens: 10,
        }
        setMessages((prev) => [...prev, aiMessage])
        tracker.addMessage(aiMessage)
      }, 500)
    }

    return (
      <div className="space-y-6 max-w-2xl">
        {/* Token Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className={`p-4 border rounded-lg ${tracker.isCritical ? 'border-red-500 bg-red-50' : tracker.isNearLimit ? 'border-yellow-500 bg-yellow-50' : 'border-border'}`}>
            <div className="text-2xl font-bold">{tracker.tokens.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Total Tokens</div>
            <div className="text-xs mt-1">{tracker.percentage.toFixed(1)}% of limit</div>
          </div>

          <div className="p-4 border rounded-lg">
            <div className="text-2xl font-bold">${tracker.estimatedCost.toFixed(4)}</div>
            <div className="text-sm text-muted-foreground">Estimated Cost</div>
          </div>

          <div className="p-4 border rounded-lg">
            <div className="text-2xl font-bold">{messages.length}</div>
            <div className="text-sm text-muted-foreground">Messages</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Token Usage</span>
            <span>{tracker.tokens} / 128,000</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${
                tracker.isCritical ? 'bg-red-500' :
                tracker.isNearLimit ? 'bg-yellow-500' :
                'bg-green-500'
              }`}
              style={{ width: `${Math.min(100, tracker.percentage)}%` }}
            />
          </div>
        </div>

        {/* Warnings */}
        {tracker.suggestPruning && (
          <div className="p-4 border border-yellow-500 bg-yellow-50 rounded-lg">
            <div className="font-semibold text-yellow-800">⚠️ Consider Pruning Messages</div>
            <div className="text-sm text-yellow-700 mt-1">
              You're using {tracker.percentage.toFixed(1)}% of the token limit. Consider removing older messages.
            </div>
          </div>
        )}

        {tracker.isCritical && (
          <div className="p-4 border border-red-500 bg-red-50 rounded-lg">
            <div className="font-semibold text-red-800">🚨 Critical Token Limit</div>
            <div className="text-sm text-red-700 mt-1">
              You're at {tracker.percentage.toFixed(1)}% of the limit! Remove messages to continue.
            </div>
          </div>
        )}

        {/* Input */}
        <div className="space-y-2">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message..."
            className="w-full px-3 py-2 border rounded-lg"
            rows={3}
          />
          <div className="flex gap-2">
            <Button onClick={addUserMessage} disabled={!inputText.trim()}>
              Send Message
            </Button>
            <Button variant="outline" onClick={() => {
              setMessages([])
              tracker.reset()
            }}>
              Clear All
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="space-y-2 max-h-64 overflow-y-auto border rounded-lg p-4">
          {messages.length === 0 ? (
            <p className="text-muted-foreground text-center">No messages yet</p>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg ${
                  msg.role === 'user' ? 'bg-primary text-primary-foreground ml-12' : 'bg-muted mr-12'
                }`}
              >
                <div className="text-sm">{msg.content}</div>
                <div className="text-xs mt-1 opacity-70">{msg.tokens} tokens</div>
              </div>
            ))
          )}
        </div>
      </div>
    )
  },
}

// ============================================================================
// Model Comparisons
// ============================================================================

export const ModelComparison: Story = {
  render: () => {
    const models = ['gpt-4-turbo', 'gpt-3.5-turbo', 'claude-3-opus', 'claude-3-haiku']
    const [selectedModel, setSelectedModel] = React.useState('gpt-4-turbo')
    const [messageCount, setMessageCount] = React.useState(0)

    const tracker = useTokenTracker({
      modelName: selectedModel,
    })

    const addSampleMessages = () => {
      const samples: MessageWithTokens[] = [
        { role: 'user', content: 'What is machine learning?', tokens: 50 },
        { role: 'assistant', content: 'Machine learning is a subset of artificial intelligence...', tokens: 150 },
        { role: 'user', content: 'Can you explain deep learning?', tokens: 45 },
        { role: 'assistant', content: 'Deep learning uses neural networks with multiple layers...', tokens: 200 },
      ]
      
      samples.forEach(msg => tracker.addMessage(msg))
      setMessageCount((prev) => prev + samples.length)
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">Select Model:</span>
          <select
            value={selectedModel}
            onChange={(e) => {
              setSelectedModel(e.target.value)
              tracker.reset()
              setMessageCount(0)
            }}
            className="px-3 py-1.5 border rounded"
          >
            {models.map((model) => (
              <option key={model} value={model}>{model}</option>
            ))}
          </select>
          <Button onClick={addSampleMessages} size="sm">
            Add Sample Messages
          </Button>
          <Button onClick={() => {
            tracker.reset()
            setMessageCount(0)
          }} variant="outline" size="sm">
            Reset
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 border rounded-lg">
            <div className="text-xl font-bold">{tracker.tokens}</div>
            <div className="text-sm text-muted-foreground">Tokens</div>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="text-xl font-bold">${tracker.estimatedCost.toFixed(4)}</div>
            <div className="text-sm text-muted-foreground">Cost</div>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="text-xl font-bold">{tracker.inputTokens}</div>
            <div className="text-sm text-muted-foreground">Input</div>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="text-xl font-bold">{tracker.outputTokens}</div>
            <div className="text-sm text-muted-foreground">Output</div>
          </div>
        </div>

        <div className="p-4 bg-muted rounded-lg">
          <div className="font-semibold mb-2">Model: {selectedModel}</div>
          <div className="text-sm space-y-1">
            <div>Messages: {messageCount}</div>
            <div>Near Limit: {tracker.isNearLimit ? '⚠️ Yes' : '✅ No'}</div>
            <div>Critical: {tracker.isCritical ? '🚨 Yes' : '✅ No'}</div>
            <div>Suggest Pruning: {tracker.suggestPruning ? '⚠️ Yes' : '✅ No'}</div>
          </div>
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Compare token usage and costs across different models.',
      },
    },
  },
}

// ============================================================================
// Real-Time Monitoring
// ============================================================================

export const RealTimeMonitoring: Story = {
  render: () => {
    const tracker = useTokenTracker({
      modelName: 'gpt-4',
      warningThreshold: 0.6,
      criticalThreshold: 0.8,
      onWarning: () => SecureLogger.debug('⚠️ Warning threshold reached!'),
      onCritical: () => SecureLogger.debug('🚨 Critical threshold reached!'),
    })

    const [isSimulating, setIsSimulating] = React.useState(false)

    const simulate = () => {
      setIsSimulating(true)
      let count = 0
      const interval = setInterval(() => {
        if (count < 20) {
          tracker.addMessage({
            role: count % 2 === 0 ? 'user' : 'assistant',
            content: `Message ${count}`,
            tokens: Math.floor(Math.random() * 200) + 50,
          })
          count++
        } else {
          clearInterval(interval)
          setIsSimulating(false)
        }
      }, 500)
    }

    return (
      <div className="space-y-6">
        <div className="flex gap-2">
          <Button onClick={simulate} disabled={isSimulating}>
            {isSimulating ? 'Simulating...' : 'Simulate Conversation'}
          </Button>
          <Button onClick={tracker.reset} variant="outline">
            Reset
          </Button>
        </div>

        <div className="p-6 border rounded-lg space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Token Usage Monitor</h3>
            <span className={`px-3 py-1 rounded-full text-sm ${
              tracker.isCritical ? 'bg-red-100 text-red-800' :
              tracker.isNearLimit ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              {tracker.isCritical ? 'Critical' : tracker.isNearLimit ? 'Warning' : 'Normal'}
            </span>
          </div>

          <div className="h-8 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                tracker.isCritical ? 'bg-red-500' :
                tracker.isNearLimit ? 'bg-yellow-500' :
                'bg-green-500'
              }`}
              style={{ width: `${Math.min(100, tracker.percentage)}%` }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Total Tokens:</span>
              <span className="ml-2 font-semibold">{tracker.tokens.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Percentage:</span>
              <span className="ml-2 font-semibold">{tracker.percentage.toFixed(1)}%</span>
            </div>
            <div>
              <span className="text-muted-foreground">Input Tokens:</span>
              <span className="ml-2 font-semibold">{tracker.inputTokens.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Output Tokens:</span>
              <span className="ml-2 font-semibold">{tracker.outputTokens.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Est. Cost:</span>
              <span className="ml-2 font-semibold">${tracker.estimatedCost.toFixed(4)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Model:</span>
              <span className="ml-2 font-semibold">GPT-4</span>
            </div>
          </div>

          {tracker.suggestPruning && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-sm text-yellow-800">
                💡 Consider removing older messages to stay within token limits
              </p>
            </div>
          )}
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Real-time monitoring with automatic warnings and cost tracking.',
      },
    },
  },
}

// ============================================================================
// Cost Tracking
// ============================================================================

export const CostTracking: Story = {
  render: () => {
    const [model, setModel] = React.useState<'gpt-4' | 'gpt-3.5-turbo' | 'claude-3-opus'>('gpt-4')
    const tracker = useTokenTracker({ modelName: model })

    const addExpensiveMessage = () => {
      tracker.addMessage({
        role: 'assistant',
        content: 'Long response...',
        tokens: 500,
      })
    }

    const addCheapMessage = () => {
      tracker.addMessage({
        role: 'user',
        content: 'Short question',
        tokens: 10,
      })
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">Model:</span>
          <select
            value={model}
            onChange={(e) => {
              setModel(e.target.value as typeof model)
              tracker.reset()
            }}
            className="px-3 py-1.5 border rounded"
          >
            <option value="gpt-4">GPT-4 (Most Expensive)</option>
            <option value="claude-3-opus">Claude 3 Opus (Expensive)</option>
            <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Cheap)</option>
          </select>
        </div>

        <div className="flex gap-2">
          <Button onClick={addExpensiveMessage} size="sm">
            Add Expensive Message (500 tokens)
          </Button>
          <Button onClick={addCheapMessage} variant="outline" size="sm">
            Add Cheap Message (10 tokens)
          </Button>
          <Button onClick={tracker.reset} variant="secondary" size="sm">
            Reset
          </Button>
        </div>

        <div className="p-6 border rounded-lg">
          <h4 className="font-semibold mb-4">Cost Breakdown</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Input tokens ({tracker.inputTokens}):</span>
              <span className="font-mono">${(tracker.inputTokens * 0.00003).toFixed(6)}</span>
            </div>
            <div className="flex justify-between">
              <span>Output tokens ({tracker.outputTokens}):</span>
              <span className="font-mono">${(tracker.outputTokens * 0.00006).toFixed(6)}</span>
            </div>
            <div className="border-t pt-3 flex justify-between font-semibold">
              <span>Total Cost:</span>
              <span className="font-mono text-lg">${tracker.estimatedCost.toFixed(6)}</span>
            </div>
          </div>
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Track costs across different models and message types.',
      },
    },
  },
}
