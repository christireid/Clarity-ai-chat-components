/**
 * Token Optimization Demo
 *
 * Interactive demonstration of token counting, budget monitoring, and cost estimation
 * Features glassmorphism design and real-time updates
 */

import React, { useState, useEffect } from 'react'
import { TokenCounter } from '@clarity-chat/react'

// Simple token estimation function (approximation: 1 token ≈ 4 characters)
function estimateTokens(text: string): number {
  if (!text) return 0
  // More accurate estimation considering whitespace and punctuation
  const words = text.trim().split(/\s+/)
  const avgCharsPerToken = 4
  return Math.ceil(text.length / avgCharsPerToken)
}

// Sample model configurations
const MODELS = [
  { id: 'gpt-4o', name: 'GPT-4o', maxTokens: 128000, costPer1k: 0.0025 },
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', maxTokens: 128000, costPer1k: 0.01 },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', maxTokens: 16385, costPer1k: 0.0005 },
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    maxTokens: 200000,
    costPer1k: 0.003,
  },
  { id: 'claude-3-opus', name: 'Claude 3 Opus', maxTokens: 200000, costPer1k: 0.015 },
  { id: 'claude-3-haiku', name: 'Claude 3 Haiku', maxTokens: 200000, costPer1k: 0.00025 },
] as const

// Sample conversations for quick testing
const SAMPLE_CONVERSATIONS = [
  {
    name: 'Short (~50 tokens)',
    text: 'Hello! How are you doing today? I hope everything is going well.',
  },
  {
    name: 'Medium (~500 tokens)',
    text: `I'm working on a complex project that involves building a chat application with AI capabilities. The application needs to support multiple AI models, handle streaming responses, and provide real-time token counting. I'm also implementing features like context management, message history, and user preferences. The architecture uses React for the frontend, with TypeScript for type safety, and integrates with various AI providers through a unified interface. I need to ensure the application is performant, accessible, and provides a great user experience. What are your recommendations for optimizing this kind of application?`,
  },
  {
    name: 'Large (~2000 tokens)',
    text: `In the realm of software engineering, particularly when developing sophisticated AI-powered applications, there are numerous considerations that must be carefully evaluated and implemented to ensure both technical excellence and user satisfaction. The landscape of artificial intelligence has evolved dramatically over recent years, with large language models becoming increasingly capable and accessible to developers worldwide. These advancements have opened up unprecedented opportunities for creating intelligent, conversational interfaces that can understand context, maintain coherent dialogues, and provide valuable assistance across a wide range of domains.

When architecting such systems, one must consider multiple layers of complexity. At the foundational level, we need robust infrastructure that can handle the asynchronous nature of AI interactions. This includes managing API calls to various providers, handling streaming responses efficiently, and implementing proper error handling and retry logic. The frontend must be responsive and provide clear feedback to users about the state of their requests, whether the AI is thinking, streaming a response, or has encountered an error.

Token management is particularly critical in AI applications because it directly impacts both cost and functionality. Different models have different context windows, ranging from thousands to hundreds of thousands of tokens. Understanding how to count tokens accurately, monitor usage in real-time, and implement strategies to stay within budget constraints is essential for production deployments. This becomes even more important when dealing with long conversations where context must be maintained while staying within token limits.

The user experience design of AI interfaces requires special attention. Unlike traditional applications where interactions are predictable, AI systems can produce varied outputs and may occasionally need additional context or clarification. The interface must accommodate these characteristics while remaining intuitive and accessible. This includes providing clear visual feedback during streaming, allowing users to interrupt or modify ongoing requests, and presenting complex information in digestible formats.

Performance optimization is another crucial aspect. AI applications often involve processing large amounts of text, making API calls that can take several seconds to complete, and rendering dynamic content as it streams in. Implementing efficient rendering strategies, such as virtualization for long message lists, debouncing user inputs, and optimizing re-renders, can significantly improve the perceived performance of the application.

Security and privacy considerations are paramount, especially when handling user data and API keys. Implementing proper authentication, encrypting sensitive data, and ensuring that API keys are never exposed to the client are fundamental requirements. Additionally, implementing rate limiting and usage quotas helps prevent abuse and controls costs.`,
  },
] as const

export function TokenOptimizationDemo() {
  const [selectedModel, setSelectedModel] = useState(MODELS[0])
  const [inputText, setInputText] = useState('')
  const [simulatedTokens, setSimulatedTokens] = useState(0)

  // Update token count when text changes
  useEffect(() => {
    const tokens = estimateTokens(inputText)
    setSimulatedTokens(tokens)
  }, [inputText])

  // Handle sample conversation selection
  const loadSample = (text: string) => {
    setInputText(text)
  }

  return (
    <div className="token-optimization-demo">
      <div className="demo-header">
        <h2>Token Optimization Playground</h2>
        <p className="demo-subtitle">
          Explore real-time token counting, model comparison, and cost estimation
        </p>
      </div>

      <div className="demo-grid">
        {/* Left Column: Input & Controls */}
        <div className="demo-section glass-card">
          <h3 className="section-title">Input Text</h3>

          {/* Sample Conversations */}
          <div className="sample-buttons">
            {SAMPLE_CONVERSATIONS.map((sample) => (
              <button
                key={sample.name}
                onClick={() => loadSample(sample.text)}
                className="sample-button glass-button"
              >
                {sample.name}
              </button>
            ))}
            <button
              onClick={() => setInputText('')}
              className="sample-button glass-button clear-button"
            >
              Clear
            </button>
          </div>

          {/* Text Input */}
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type or paste your text here to see real-time token counting..."
            className="token-input glass-input"
            rows={12}
          />

          {/* Character & Word Count */}
          <div className="input-stats">
            <span>Characters: {inputText.length.toLocaleString()}</span>
            <span>
              Words: {inputText.trim().split(/\s+/).filter(Boolean).length.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Right Column: Token Counter & Model Selector */}
        <div className="demo-section glass-card">
          <h3 className="section-title">Token Analysis</h3>

          {/* Model Selector */}
          <div className="model-selector">
            <label className="model-label">AI Model</label>
            <select
              value={selectedModel.id}
              onChange={(e) =>
                setSelectedModel(MODELS.find((m) => m.id === e.target.value) || MODELS[0])
              }
              className="model-select glass-select"
            >
              {MODELS.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name} ({model.maxTokens.toLocaleString()} tokens)
                </option>
              ))}
            </select>
          </div>

          {/* Token Counter Component */}
          <div className="token-counter-wrapper">
            <TokenCounter
              currentTokens={simulatedTokens}
              maxTokens={selectedModel.maxTokens}
              costPerToken={selectedModel.costPer1k / 1000}
              showWarning={true}
              warningThreshold={0.8}
              criticalThreshold={0.95}
              showCost={true}
              showBar={true}
              size="lg"
            />
          </div>

          {/* Model Comparison */}
          <div className="model-comparison">
            <h4 className="comparison-title">Cost Comparison</h4>
            <div className="comparison-grid">
              {MODELS.map((model) => {
                const cost = (simulatedTokens * model.costPer1k) / 1000
                const isSelected = model.id === selectedModel.id

                return (
                  <div
                    key={model.id}
                    className={`comparison-card ${isSelected ? 'selected' : ''}`}
                  >
                    <div className="model-name">{model.name}</div>
                    <div className="model-cost">
                      ${cost < 0.01 ? (cost * 100).toFixed(3) + '¢' : cost.toFixed(4)}
                    </div>
                    <div className="model-limit">
                      {((simulatedTokens / model.maxTokens) * 100).toFixed(1)}% used
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Features Overview */}
      <div className="demo-section glass-card features-section">
        <h3 className="section-title">Token Optimization Features</h3>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h4>Real-time Counting</h4>
            <p>Accurate token counting using model-specific tokenizers</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h4>Cost Estimation</h4>
            <p>Track API costs in real-time with per-model pricing</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚠️</div>
            <h4>Budget Monitoring</h4>
            <p>Warnings at 80% and 95% of context window</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔄</div>
            <h4>Model Comparison</h4>
            <p>Compare costs and limits across different AI models</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h4>Performance</h4>
            <p>Debounced counting with efficient caching</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">♿</div>
            <h4>Accessible</h4>
            <p>WCAG 2.1 AA compliant with ARIA labels</p>
          </div>
        </div>
      </div>
    </div>
  )
}
