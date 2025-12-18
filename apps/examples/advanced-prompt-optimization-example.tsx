/**
 * Advanced Prompt Optimization Example
 *
 * Demonstrates Phase 2 features:
 * - Automatic prompt optimization with compiler-like pipeline
 * - Dynamic model routing
 * - Real-time token visualization
 * - Compression logs and diagnostics
 */

import * as React from 'react'
import {
  usePromptOptimizer,
  useDynamicModelRouting,
  usePromptDebugger,
  toon,
} from '@clarity-chat/react/prompt'
import type { CoreMessage } from '@clarity-chat/react/hooks/use-chat-enhanced'

/**
 * Example: Chat with Automatic Optimization
 * Shows how prompts shrink in real time with visualization
 */
export function AdvancedOptimizedChat() {
  const [messages, setMessages] = React.useState<CoreMessage[]>([])
  const [currentModel, setCurrentModel] = React.useState('gpt-4')
  const [userInput, setUserInput] = React.useState('')
  const [targetTokens] = React.useState(4000)

  // Use prompt optimizer
  const optimizer = usePromptOptimizer({
    messages,
    model: currentModel,
    targetTokens,
    autoOptimize: true,
    applyStyleTransformation: true,
    debug: true,
  })

  // Use dynamic model routing
  const routing = useDynamicModelRouting({
    currentModel,
    targetTokens,
    messages: optimizer.optimizedMessages,
  })

  // Use debugger for visualization
  const promptDebugger = usePromptDebugger({
    diagnostics: optimizer.diagnostics,
    routingDecision: routing.routingDecision,
    messagesBefore: messages,
    messagesAfter: optimizer.optimizedMessages,
    detailed: true,
  })

  const handleSend = () => {
    if (!userInput.trim()) return

    const newMessage: CoreMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: userInput,
    }

    setMessages((prev) => [...prev, newMessage])
    setUserInput('')
  }

  // Switch model if recommended
  React.useEffect(() => {
    if (
      routing.routingDecision.shouldSwitch &&
      routing.routingDecision.recommendedModel
    ) {
      SecureLogger.debug(
        'Model switch recommended:',
        routing.routingDecision.reasoning
      )
      // In production, you'd show a confirmation dialog
    }
  }, [routing.routingDecision])

  return (
    <div style={{ display: 'flex', gap: '20px', padding: '20px' }}>
      {/* Main Chat Area */}
      <div style={{ flex: 1 }}>
        <h2>Chat with Automatic Optimization</h2>

        {/* Model Selector */}
        <div style={{ marginBottom: '20px' }}>
          <label>
            Model:{' '}
            <select
              value={currentModel}
              onChange={(e) => setCurrentModel(e.target.value)}
            >
              <option value="gpt-4">GPT-4</option>
              <option value="gpt-4-turbo">GPT-4 Turbo</option>
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
              <option value="claude-3-opus">Claude 3 Opus</option>
              <option value="claude-3-sonnet">Claude 3 Sonnet</option>
              <option value="claude-3-haiku">Claude 3 Haiku</option>
              <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
              <option value="mistral-large">Mistral Large</option>
            </select>
          </label>
          {routing.routingDecision.shouldSwitch && (
            <div
              style={{
                marginTop: '10px',
                padding: '10px',
                background: '#fff3cd',
                borderRadius: '4px',
              }}
            >
              💡 Recommendation: Switch to{' '}
              {routing.routingDecision.recommendedModel}
              <br />
              <small>{routing.routingDecision.reasoning}</small>
            </div>
          )}
        </div>

        {/* Messages */}
        <div
          style={{
            border: '1px solid #ddd',
            borderRadius: '4px',
            padding: '10px',
            minHeight: '300px',
            marginBottom: '20px',
          }}
        >
          {optimizer.optimizedMessages.map((msg) => (
            <div
              key={msg.id}
              style={{
                marginBottom: '10px',
                padding: '8px',
                background: msg.role === 'user' ? '#e3f2fd' : '#f5f5f5',
                borderRadius: '4px',
              }}
            >
              <strong>{msg.role}:</strong>{' '}
              {typeof msg.content === 'string'
                ? msg.content
                : JSON.stringify(msg.content)}
              {msg.metadata?.compressed && (
                <span
                  style={{
                    fontSize: '12px',
                    color: '#666',
                    marginLeft: '10px',
                  }}
                >
                  [Compressed: {msg.metadata.compressionType}]
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Input */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            style={{ flex: 1, padding: '8px' }}
          />
          <button onClick={handleSend} disabled={optimizer.isOptimizing}>
            {optimizer.isOptimizing ? 'Optimizing...' : 'Send'}
          </button>
        </div>
      </div>

      {/* Debug Panel */}
      <div
        style={{
          width: '400px',
          border: '1px solid #ddd',
          borderRadius: '4px',
          padding: '15px',
        }}
      >
        <h3>Optimization Debug Panel</h3>

        {/* Token Stats */}
        <div style={{ marginBottom: '20px' }}>
          <h4>Token Statistics</h4>
          <div>
            <div>Input Tokens: {optimizer.tokenStats.inputTokens}</div>
            <div>Remaining Budget: {optimizer.tokenStats.remainingBudget}</div>
            <div>
              Utilization: {(optimizer.tokenStats.utilization * 100).toFixed(1)}
              %
            </div>
            {optimizer.costEstimate && (
              <div>Cost: ${optimizer.costEstimate.totalCost.toFixed(4)}</div>
            )}
          </div>
        </div>

        {/* Token Graph */}
        <div style={{ marginBottom: '20px' }}>
          <h4>Token Graph</h4>
          <div
            style={{
              height: '150px',
              border: '1px solid #ddd',
              padding: '10px',
            }}
          >
            {promptDebugger.tokenGraph.map((point, idx) => (
              <div
                key={idx}
                style={{
                  display: 'inline-block',
                  width: `${100 / promptDebugger.tokenGraph.length}%`,
                  height: `${(point.tokens / Math.max(...promptDebugger.tokenGraph.map((p) => p.tokens))) * 100}%`,
                  background: '#4CAF50',
                  marginRight: '2px',
                  verticalAlign: 'bottom',
                }}
                title={`${point.stage}: ${point.tokens} tokens`}
              />
            ))}
          </div>
          <div style={{ fontSize: '12px', marginTop: '5px' }}>
            {promptDebugger.tokenGraph.map((p, idx) => (
              <span key={idx} style={{ marginRight: '10px' }}>
                {p.stage}: {p.tokens}
              </span>
            ))}
          </div>
        </div>

        {/* Optimization Stages */}
        <div style={{ marginBottom: '20px' }}>
          <h4>Optimization Stages</h4>
          <div style={{ fontSize: '12px' }}>
            {promptDebugger.optimizationHistory.map((stage, idx) => (
              <div
                key={idx}
                style={{
                  marginBottom: '8px',
                  padding: '5px',
                  background: '#f9f9f9',
                }}
              >
                <strong>{stage.stage}</strong>
                <br />
                {stage.tokensBefore} → {stage.tokensAfter} tokens
                {stage.tokensSaved > 0 && (
                  <span style={{ color: '#4CAF50' }}>
                    {' '}
                    (-{stage.tokensSaved})
                  </span>
                )}
                {stage.duration && (
                  <span style={{ color: '#666' }}> [{stage.duration}ms]</span>
                )}
                {stage.details.length > 0 && (
                  <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                    {stage.details.map((detail, i) => (
                      <li key={i}>{detail}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Compression Logs */}
        {promptDebugger.compressionLogs.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <h4>Compression Logs</h4>
            <div style={{ fontSize: '12px' }}>
              {promptDebugger.compressionLogs.map((log, idx) => (
                <div
                  key={idx}
                  style={{
                    marginBottom: '5px',
                    padding: '5px',
                    background: '#fff3cd',
                  }}
                >
                  <strong>{log.messageId}</strong>
                  <br />
                  {log.originalLength} → {log.compressedLength} tokens
                  <br />
                  Ratio: {(log.compressionRatio * 100).toFixed(1)}% (
                  {log.compressionType})
                  {log.originalCount && (
                    <>
                      <br />
                      Grouped {log.originalCount} messages
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Summary */}
        <div>
          <h4>Summary</h4>
          <div style={{ fontSize: '12px' }}>
            <div>Total Stages: {promptDebugger.summary.totalStages}</div>
            <div>Tokens Saved: {promptDebugger.summary.totalTokensSaved}</div>
            <div>
              Compression Ratio:{' '}
              {(promptDebugger.summary.compressionRatio * 100).toFixed(1)}%
            </div>
            <div>Duration: {promptDebugger.summary.optimizationDuration}ms</div>
            <div>
              Optimized: {promptDebugger.summary.wasOptimized ? 'Yes' : 'No'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Example: Using Toon DSL with Advanced Features
 */
export function ToonDSLAdvancedExample() {
  const [variables, setVariables] = React.useState({
    userName: 'Alice',
    userQuery: 'What is the weather today?',
  })

  // Create a toon prompt with importance tags and compression hints
  const toonPrompt = React.useMemo(
    () =>
      toon()
        .roleWithMetadata(
          'system',
          (b) =>
            b
              .text('You are a helpful assistant.')
              .importantText('Always be concise and accurate.', 8)
              .text('Provide clear, actionable responses.'),
          { importance: 9, compressStrategy: 'none' }
        )
        .scopedSection(
          'UserContext',
          'user-context',
          (b) =>
            b.variable('userName').text(' is asking: ').variable('userQuery'),
          { importance: 5, compressible: true }
        )
        .longResponse('assistant', (b) => b.variable('response'), 'semantic')
        .build(),
    []
  )

  const optimizer = usePromptOptimizer({
    toon: toonPrompt,
    variables,
    model: 'gpt-4',
    targetTokens: 2000,
    autoOptimize: true,
  })

  return (
    <div style={{ padding: '20px' }}>
      <h2>Toon DSL with Advanced Features</h2>

      <div style={{ marginBottom: '20px' }}>
        <label>
          User Name:{' '}
          <input
            value={variables.userName}
            onChange={(e) =>
              setVariables({ ...variables, userName: e.target.value })
            }
          />
        </label>
        <br />
        <label>
          Query:{' '}
          <input
            value={variables.userQuery}
            onChange={(e) =>
              setVariables({ ...variables, userQuery: e.target.value })
            }
            style={{ width: '300px' }}
          />
        </label>
      </div>

      <div>
        <h3>Optimized Messages ({optimizer.tokenStats.inputTokens} tokens)</h3>
        {optimizer.optimizedMessages.map((msg) => (
          <div
            key={msg.id}
            style={{
              marginBottom: '10px',
              padding: '10px',
              border: '1px solid #ddd',
            }}
          >
            <strong>{msg.role}:</strong>{' '}
            {typeof msg.content === 'string'
              ? msg.content
              : JSON.stringify(msg.content)}
          </div>
        ))}
      </div>

      {optimizer.diagnostics.wasOptimized && (
        <div
          style={{
            marginTop: '20px',
            padding: '10px',
            background: '#e8f5e9',
            borderRadius: '4px',
          }}
        >
          <strong>Optimization Applied:</strong> {optimizer.diagnostics.reason}
          <br />
          <small>Saved {optimizer.diagnostics.totalTokensSaved} tokens</small>
        </div>
      )}
    </div>
  )
}

/**
 * Example: Model Switching Visualization
 */
export function ModelSwitchingExample() {
  const [messages, setMessages] = React.useState<CoreMessage[]>([])
  const [selectedModel, setSelectedModel] = React.useState('gpt-4')
  const [costBudget, setCostBudget] = React.useState(0.1)

  const routing = useDynamicModelRouting({
    currentModel: selectedModel,
    targetTokens: 4000,
    costBudget,
    messages,
  })

  const availableModels = routing.getAvailableModels()
  const modelsInBudget = routing.getModelsWithinBudget(costBudget, 4000)

  return (
    <div style={{ padding: '20px' }}>
      <h2>Dynamic Model Routing</h2>

      <div style={{ marginBottom: '20px' }}>
        <label>
          Cost Budget (USD):{' '}
          <input
            type="number"
            value={costBudget}
            onChange={(e) => setCostBudget(parseFloat(e.target.value))}
            step="0.01"
            min="0"
          />
        </label>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Current Model: {routing.currentModelProfile.name}</h3>
        <div>
          Max Tokens: {routing.currentModelProfile.maxTokens.toLocaleString()}
          <br />
          Cost: ${routing.currentModelProfile.costPer1K}/1K input, $
          {routing.currentModelProfile.outputCostPer1K}/1K output
        </div>
      </div>

      {routing.routingDecision.shouldSwitch && (
        <div
          style={{
            padding: '15px',
            background: '#fff3cd',
            borderRadius: '4px',
            marginBottom: '20px',
          }}
        >
          <h4>💡 Model Switch Recommended</h4>
          <p>
            <strong>Recommended:</strong>{' '}
            {routing.routingDecision.recommendedModel}
            <br />
            <strong>Reason:</strong> {routing.routingDecision.reasoning}
            {routing.routingDecision.costSavings && (
              <>
                <br />
                <strong>Cost Savings:</strong> $
                {routing.routingDecision.costSavings.toFixed(4)}
              </>
            )}
            {routing.routingDecision.tokenCapacityImprovement && (
              <>
                <br />
                <strong>Token Capacity Improvement:</strong>{' '}
                {routing.routingDecision.tokenCapacityImprovement.toLocaleString()}{' '}
                tokens
              </>
            )}
          </p>
        </div>
      )}

      <div>
        <h3>Available Models ({availableModels.length})</h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '10px',
          }}
        >
          {availableModels.map((model) => (
            <div
              key={model.name}
              style={{
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                background: model.name === selectedModel ? '#e3f2fd' : 'white',
                cursor: 'pointer',
              }}
              onClick={() => setSelectedModel(model.name)}
            >
              <strong>{model.name}</strong>
              <br />
              Max: {model.maxTokens.toLocaleString()} tokens
              <br />${model.costPer1K}/1K input
              <br />
              Style: {model.optimalPromptStyle}
              {modelsInBudget.some((m) => m.name === model.name) && (
                <div
                  style={{
                    marginTop: '5px',
                    color: '#4CAF50',
                    fontSize: '12px',
                  }}
                >
                  ✓ Within budget
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
