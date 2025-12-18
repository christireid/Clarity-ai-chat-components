/**
 * Prompt Optimization Example
 * 
 * Demonstrates how to use the prompt & token optimization layer
 * with useClarityChat and standalone hooks.
 */

import * as React from 'react'
import { useClarityChat } from '@clarity-chat/react'
import {
  usePromptInspector,
  useTokenBudget,
  usePromptRecipe,
  toon,
  createPromptRecipe,
  BUILT_IN_RECIPES,
} from '@clarity-chat/react/prompt'

/**
 * Example 1: Basic useClarityChat with prompt optimization
 */
export function BasicOptimizedChat() {
  const chat = useClarityChat({
    api: '/api/chat',
    promptOptimization: {
      enabled: true,
      targetTokens: 4000,
      strategy: 'hybrid',
      model: 'gpt-4',
    },
  })

  return (
    <div className="chat-container">
      <div className="messages">
        {chat.messages.map((msg) => (
          <div key={msg.id} className={`message message-${msg.role}`}>
            {typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content)}
          </div>
        ))}
      </div>

      {chat.tokenStats && (
        <div className="token-stats">
          <div>
            Tokens: {chat.tokenStats.inputTokens} /{' '}
            {chat.tokenStats.remainingBudget + chat.tokenStats.inputTokens}
          </div>
          <div>Utilization: {(chat.tokenStats.utilization * 100).toFixed(1)}%</div>
          {chat.tokenStats.wasOptimized && (
            <div className="optimization-info">
              Optimized: {chat.tokenStats.lastOptimizationReason}
            </div>
          )}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault()
          const input = e.currentTarget.elements.namedItem('input') as HTMLInputElement
          chat.append({ role: 'user', content: input.value })
          input.value = ''
        }}
      >
        <input name="input" placeholder="Type a message..." />
        <button type="submit" disabled={chat.isLoading}>
          Send
        </button>
      </form>
    </div>
  )
}

/**
 * Example 2: Using prompt recipes with toon DSL
 */
export function RecipeBasedChat() {
  const [userName, setUserName] = React.useState('')
  const [userInput, setUserInput] = React.useState('')

  // Create a custom recipe
  const recipe = React.useMemo(
    () =>
      createPromptRecipe('greeting-chatbot', 'Greeting Chatbot', {
        systemPrompt: (b) =>
          b.text('You are a friendly assistant.')
            .conditional('userName', (b) =>
              b.text(' You are talking to {{userName}}.').build()
            )
            .build(),
        userMessage: (b) => b.variable('userInput', { required: true }).build(),
      }),
    []
  )

  const { buildPrompt, estimateTokens } = usePromptRecipe({
    recipe,
    variables: { userName, userInput },
  })

  const messages = React.useMemo(() => buildPrompt(), [buildPrompt])
  const tokens = React.useMemo(() => estimateTokens(), [estimateTokens])

  return (
    <div>
      <div>
        <label>
          Your name:
          <input value={userName} onChange={(e) => setUserName(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          Message:
          <input value={userInput} onChange={(e) => setUserInput(e.target.value)} />
        </label>
      </div>
      <div>
        <strong>Estimated tokens:</strong> {tokens}
      </div>
      <div>
        <strong>Messages:</strong>
        <pre>{JSON.stringify(messages, null, 2)}</pre>
      </div>
    </div>
  )
}

/**
 * Example 3: Token budget management
 */
export function TokenBudgetExample() {
  const [messages, setMessages] = React.useState([
    { id: '1', role: 'user' as const, content: 'Hello' },
    { id: '2', role: 'assistant' as const, content: 'Hi there!' },
    { id: '3', role: 'user' as const, content: 'How are you?' },
  ])

  const budget = useTokenBudget({
    messages,
    modelMetadata: 'gpt-4',
    targetBudget: 100, // Small budget for demo
  })

  const handleOptimize = React.useCallback(async () => {
    const result = await budget.optimize('hybrid')
    setMessages(result.optimizedMessages)
    SecureLogger.debug('Optimization diagnostics:', result.diagnostics)
  }, [budget])

  return (
    <div>
      <div>
        <strong>Current tokens:</strong> {budget.currentTokens}
      </div>
      <div>
        <strong>Remaining budget:</strong> {budget.remainingBudget}
      </div>
      <div>
        <strong>Utilization:</strong> {(budget.utilization * 100).toFixed(1)}%
      </div>
      {budget.isExceeded && (
        <div className="warning">Budget exceeded! Consider optimizing.</div>
      )}
      {budget.estimatedCost && (
        <div>
          <strong>Estimated cost:</strong> ${budget.estimatedCost.totalCost.toFixed(4)}
        </div>
      )}
      <button onClick={handleOptimize} disabled={!budget.isExceeded}>
        Optimize Messages
      </button>
    </div>
  )
}

/**
 * Example 4: Prompt inspector (dev tool)
 */
export function PromptInspectorExample() {
  const chat = useClarityChat({ api: '/api/chat' })

  const inspector = usePromptInspector({
    messages: chat.messages,
    modelMetadata: 'gpt-4',
    detailed: true,
  })

  return (
    <div className="inspector-panel">
      <h3>Prompt Inspector</h3>
      <div className="summary">{inspector.formattedView.summary}</div>
      <div className="details">
        {inspector.formattedView.details.map((detail, i) => (
          <div key={i}>{detail}</div>
        ))}
      </div>
      <div className="breakdown">
        <h4>Breakdown by Role</h4>
        {Object.entries(inspector.byRole).map(([role, stats]) => (
          <div key={role}>
            {role}: {stats.tokens} tokens ({stats.count} messages, {stats.percentage.toFixed(1)}%)
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Example 5: Complete chat with optimization and inspector
 */
export function CompleteOptimizedChat() {
  const chat = useClarityChat({
    api: '/api/chat',
    promptOptimization: {
      enabled: true,
      targetTokens: 4000,
      strategy: 'hybrid',
      model: 'gpt-4',
      keepRecent: 3,
    },
  })

  const inspector = usePromptInspector({
    messages: chat.messages,
    modelMetadata: 'gpt-4',
    detailed: false,
  })

  return (
    <div className="complete-chat">
      <div className="chat-main">
        <div className="messages">
          {chat.messages.map((msg) => (
            <div key={msg.id} className={`message message-${msg.role}`}>
              {typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content)}
            </div>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            const input = e.currentTarget.elements.namedItem('input') as HTMLInputElement
            chat.append({ role: 'user', content: input.value })
            input.value = ''
          }}
        >
          <input name="input" placeholder="Type a message..." />
          <button type="submit" disabled={chat.isLoading}>
            Send
          </button>
        </form>
      </div>

      <div className="sidebar">
        {chat.tokenStats && (
          <div className="token-stats-panel">
            <h3>Token Stats</h3>
            <div>Input: {chat.tokenStats.inputTokens} tokens</div>
            <div>Remaining: {chat.tokenStats.remainingBudget} tokens</div>
            <div>Utilization: {(chat.tokenStats.utilization * 100).toFixed(1)}%</div>
            {chat.tokenStats.wasOptimized && (
              <div className="optimization-note">
                ✓ Optimized: {chat.tokenStats.lastOptimizationReason}
              </div>
            )}
          </div>
        )}

        <div className="inspector-panel">
          <h3>Inspector</h3>
          <div>{inspector.formattedView.summary}</div>
          <div className="role-breakdown">
            {Object.entries(inspector.byRole).map(([role, stats]) => (
              <div key={role} className="role-stat">
                <span className="role-name">{role}</span>
                <span className="role-tokens">{stats.tokens} tokens</span>
                <span className="role-percentage">{stats.percentage.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
