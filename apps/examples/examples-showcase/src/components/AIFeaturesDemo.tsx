/**
 * AI Features Demo
 *
 * Comprehensive showcase of AI-specific components including:
 * - ModelSelector with provider logos
 * - PersonaPanel (coming soon)
 * - KnowledgeBaseViewer
 * - RAGConfigPanel (coming soon)
 * - TokenUsageMeter with charts
 * - TokenBudgetBar with alerts
 * - PromptTemplateSelector (using Prompts component)
 * - AIStatusIndicator (using ThinkingBar)
 */

import React, { useState, useEffect } from 'react'
import {
  TokenUsageMeter,
  TokenBudgetBar,
  // ThinkingBar, // Not exported yet
  // Prompts, // Not exported yet
  // type PromptItem,
  // type ThinkingBarStatus,
} from '@clarity-chat/react'

// Simple ModelSelector component for demo
interface ModelSelectorProps {
  providers: AIProvider[]
  selectedModelId: string
  onModelSelect: (modelId: string) => void
  showProviderLogos?: boolean
  showModelDetails?: boolean
}

function ModelSelector({
  providers,
  selectedModelId,
  onModelSelect,
  showModelDetails = true,
}: ModelSelectorProps) {
  return (
    <div className="model-selector">
      {providers.map((provider) => (
        <div key={provider.id} className="provider-section">
          <h4 className="provider-name">{provider.name}</h4>
          <div className="model-list">
            {provider.models.map((model) => (
              <button
                key={model.id}
                className={`model-option ${selectedModelId === model.id ? 'selected' : ''}`}
                onClick={() => onModelSelect(model.id)}
              >
                <div className="model-option-header">
                  <span className="model-name">{model.name}</span>
                  {selectedModelId === model.id && <span className="check-icon">✓</span>}
                </div>
                {showModelDetails && (
                  <p className="model-description">{model.description}</p>
                )}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// Mock AI model type
interface AIModel {
  id: string
  name: string
  description: string
  maxTokens: number
  costPer1k: number
}

interface AIProvider {
  id: string
  name: string
  models: AIModel[]
}

// Mock AI providers with logos (using emoji as fallback)
const AI_PROVIDERS: AIProvider[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    models: [
      {
        id: 'gpt-4o',
        name: 'GPT-4o',
        description: 'Most capable model, best for complex tasks',
        maxTokens: 128000,
        costPer1k: 0.0025,
      },
      {
        id: 'gpt-4-turbo',
        name: 'GPT-4 Turbo',
        description: 'Fast and powerful, great for most tasks',
        maxTokens: 128000,
        costPer1k: 0.01,
      },
      {
        id: 'gpt-3.5-turbo',
        name: 'GPT-3.5 Turbo',
        description: 'Fast and economical',
        maxTokens: 16385,
        costPer1k: 0.0005,
      },
    ],
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    models: [
      {
        id: 'claude-3-5-sonnet',
        name: 'Claude 3.5 Sonnet',
        description: 'Best balance of intelligence and speed',
        maxTokens: 200000,
        costPer1k: 0.003,
      },
      {
        id: 'claude-3-opus',
        name: 'Claude 3 Opus',
        description: 'Most powerful model for complex tasks',
        maxTokens: 200000,
        costPer1k: 0.015,
      },
      {
        id: 'claude-3-haiku',
        name: 'Claude 3 Haiku',
        description: 'Ultra-fast and cost-effective',
        maxTokens: 200000,
        costPer1k: 0.00025,
      },
    ],
  },
  {
    id: 'google',
    name: 'Google',
    models: [
      {
        id: 'gemini-pro',
        name: 'Gemini Pro',
        description: 'Advanced multimodal capabilities',
        maxTokens: 32000,
        costPer1k: 0.0005,
      },
      {
        id: 'gemini-ultra',
        name: 'Gemini Ultra',
        description: 'Most capable Gemini model',
        maxTokens: 32000,
        costPer1k: 0.002,
      },
    ],
  },
]

// Mock prompt templates - Commented out until Prompts and PromptItem are exported
// const PROMPT_TEMPLATES: PromptItem[] = [
//   {
//     id: 'code-review',
//     title: 'Code Review',
//     description: 'Review code for best practices and improvements',
//     content:
//       'Review the following code and provide suggestions for improvements:\n\n{{code}}',
//     icon: '🔍',
//     tags: ['code', 'review'],
//   },
//   {
//     id: 'explain-concept',
//     title: 'Explain Concept',
//     description: 'Explain a technical concept simply',
//     content: 'Explain {{concept}} in simple terms with examples.',
//     icon: '💡',
//     tags: ['education', 'explanation'],
//   },
//   {
//     id: 'debug-help',
//     title: 'Debug Help',
//     description: 'Get help debugging an issue',
//     content:
//       'I am experiencing the following issue:\n\n{{issue}}\n\nHelp me debug this problem.',
//     icon: '🐛',
//     tags: ['debug', 'troubleshoot'],
//   },
//   {
//     id: 'api-design',
//     title: 'API Design',
//     description: 'Design a RESTful API',
//     content:
//       'Design a RESTful API for {{resource}} with CRUD operations. Include endpoints, request/response formats, and status codes.',
//     icon: '🔌',
//     tags: ['api', 'design'],
//   },
//   {
//     id: 'summarize',
//     title: 'Summarize',
//     description: 'Summarize long content',
//     content: 'Summarize the following content in {{word_count}} words:\n\n{{content}}',
//     icon: '📝',
//     tags: ['summary', 'content'],
//   },
// ]

// Mock knowledge base items
const KNOWLEDGE_BASE_ITEMS = [
  {
    id: '1',
    title: 'API Documentation',
    description: 'Complete API reference and guides',
    itemCount: 156,
    lastUpdated: '2 hours ago',
    icon: '📚',
  },
  {
    id: '2',
    title: 'Code Examples',
    description: 'Production-ready code samples',
    itemCount: 89,
    lastUpdated: '1 day ago',
    icon: '💻',
  },
  {
    id: '3',
    title: 'Best Practices',
    description: 'Industry best practices and patterns',
    itemCount: 45,
    lastUpdated: '3 days ago',
    icon: '⭐',
  },
  {
    id: '4',
    title: 'Troubleshooting',
    description: 'Common issues and solutions',
    itemCount: 67,
    lastUpdated: '1 week ago',
    icon: '🔧',
  },
]

// AI status simulation - Commented out until ThinkingBar is exported
// type ThinkingBarStatus = 'idle' | 'thinking' | 'processing' | 'streaming' | 'complete' | 'error'
// const AI_STATUSES: Array<{ status: ThinkingBarStatus; label: string; message: string }> = [
//   { status: 'idle', label: 'Idle', message: 'Ready to assist' },
//   { status: 'thinking', label: 'Thinking', message: 'Analyzing your request...' },
//   { status: 'processing', label: 'Processing', message: 'Processing data...' },
//   { status: 'streaming', label: 'Streaming', message: 'Generating response...' },
//   { status: 'complete', label: 'Complete', message: 'Response complete!' },
//   { status: 'error', label: 'Error', message: 'An error occurred' },
// ]

export function AIFeaturesDemo() {
  const [selectedModel, setSelectedModel] = useState(AI_PROVIDERS[0].models[0])
  const [tokenUsage, setTokenUsage] = useState({ used: 2500, total: 10000 })
  // const [aiStatus, setAiStatus] = useState<ThinkingBarStatus>('idle') // Commented out until ThinkingBar is exported
  // const [currentStatusIndex, setCurrentStatusIndex] = useState(0) // Commented out until ThinkingBar is exported
  // const [selectedPrompt, setSelectedPrompt] = useState<PromptItem | null>(null) // Commented out until PromptItem is exported

  // Simulate AI status changes - Commented out until ThinkingBar is exported
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setCurrentStatusIndex((prev) => (prev + 1) % AI_STATUSES.length)
  //   }, 3000)

  //   return () => clearInterval(interval)
  // }, [])

  // useEffect(() => {
  //   setAiStatus(AI_STATUSES[currentStatusIndex].status)
  // }, [currentStatusIndex])

  // Simulate token usage growth
  useEffect(() => {
    const interval = setInterval(() => {
      setTokenUsage((prev) => {
        const newUsed = prev.used + Math.floor(Math.random() * 100)
        return {
          used: newUsed > prev.total ? prev.used : newUsed,
          total: prev.total,
        }
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleModelSelect = (modelId: string) => {
    for (const provider of AI_PROVIDERS) {
      const model = provider.models.find((m) => m.id === modelId)
      if (model) {
        setSelectedModel(model)
        break
      }
    }
  }

  // Commented out until Prompts component is exported
  // const handlePromptSelect = (promptId: string) => {
  //   const prompt = PROMPT_TEMPLATES.find((p) => p.id === promptId)
  //   setSelectedPrompt(prompt || null)
  // }

  const handleResetBudget = () => {
    setTokenUsage({ used: 0, total: 10000 })
  }

  return (
    <div className="ai-features-demo">
      <div className="demo-header">
        <h2>AI Features Showcase</h2>
        <p className="demo-subtitle">
          Explore AI-specific components for building intelligent applications
        </p>
      </div>

      <div className="demo-grid">
        {/* Model Selector Section */}
        <div className="demo-section glass-card">
          <h3 className="section-title">Model Selector</h3>
          <p className="section-description">
            Choose from multiple AI providers and models
          </p>

          <div className="model-selector-container">
            <ModelSelector
              providers={AI_PROVIDERS}
              selectedModelId={selectedModel.id}
              onModelSelect={handleModelSelect}
              showProviderLogos={true}
              showModelDetails={true}
            />
          </div>

          <div className="selected-model-info glass-card-inner">
            <h4>Selected Model</h4>
            <div className="model-details">
              <div className="detail-item">
                <span className="detail-label">Model:</span>
                <span className="detail-value">{selectedModel.name}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Max Tokens:</span>
                <span className="detail-value">
                  {selectedModel.maxTokens.toLocaleString()}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Cost:</span>
                <span className="detail-value">${selectedModel.costPer1k}/1K tokens</span>
              </div>
            </div>
          </div>
        </div>

        {/* Token Usage Section */}
        <div className="demo-section glass-card">
          <h3 className="section-title">Token Usage & Budget</h3>
          <p className="section-description">
            Monitor token consumption with real-time charts and alerts
          </p>

          <div className="token-usage-container">
            <TokenUsageMeter
              used={tokenUsage.used}
              total={tokenUsage.total}
              showChart={true}
              showPercentage={true}
              size="large"
            />
          </div>

          <div className="token-budget-container">
            <TokenBudgetBar
              current={tokenUsage.used}
              limit={tokenUsage.total}
              showAlert={tokenUsage.used / tokenUsage.total > 0.8}
              warningThreshold={0.7}
              criticalThreshold={0.9}
            />
          </div>

          <div className="budget-controls">
            <button onClick={handleResetBudget} className="glass-button">
              Reset Budget
            </button>
          </div>

          <div className="usage-stats glass-card-inner">
            <div className="stat-item">
              <span className="stat-label">Usage:</span>
              <span className="stat-value">
                {((tokenUsage.used / tokenUsage.total) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Remaining:</span>
              <span className="stat-value">
                {(tokenUsage.total - tokenUsage.used).toLocaleString()} tokens
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Est. Cost:</span>
              <span className="stat-value">
                ${((tokenUsage.used / 1000) * selectedModel.costPer1k).toFixed(4)}
              </span>
            </div>
          </div>
        </div>

        {/* AI Status Indicator Section - Commented out until ThinkingBar is exported */}
        {/* <div className="demo-section glass-card">
          <h3 className="section-title">AI Status Indicator</h3>
          <p className="section-description">
            Visual feedback for AI processing states (auto-cycling demo)
          </p>

          <div className="status-indicator-container">
            <ThinkingBar
              status={aiStatus}
              message={AI_STATUSES[currentStatusIndex].message}
              showProgress={aiStatus === 'processing' || aiStatus === 'streaming'}
            />
          </div>

          <div className="status-info glass-card-inner">
            <h4>Current Status</h4>
            <div className="status-details">
              <div className="status-badge" data-status={aiStatus}>
                {AI_STATUSES[currentStatusIndex].label}
              </div>
              <p className="status-description">
                {AI_STATUSES[currentStatusIndex].message}
              </p>
            </div>
          </div>

          <div className="status-legend">
            <h4>Available States</h4>
            <div className="legend-grid">
              {AI_STATUSES.map((status) => (
                <div key={status.status} className="legend-item">
                  <div className="legend-badge" data-status={status.status}>
                    {status.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div> */}

        {/* Prompt Template Selector Section - Commented out until Prompts is exported */}
        {/* <div className="demo-section glass-card">
          <h3 className="section-title">Prompt Template Selector</h3>
          <p className="section-description">
            Pre-built prompt templates for common tasks
          </p>

          <div className="prompt-selector-container">
            <Prompts
              items={PROMPT_TEMPLATES}
              onSelect={handlePromptSelect}
              variant="grid"
              showSearch={true}
            />
          </div>

          {selectedPrompt && (
            <div className="selected-prompt glass-card-inner">
              <h4>
                {selectedPrompt.icon} {selectedPrompt.title}
              </h4>
              <p className="prompt-description">{selectedPrompt.description}</p>
              <div className="prompt-content">
                <code>{selectedPrompt.content}</code>
              </div>
              <div className="prompt-tags">
                {selectedPrompt.tags?.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div> */}

        {/* Knowledge Base Viewer Section */}
        <div className="demo-section glass-card">
          <h3 className="section-title">Knowledge Base Viewer</h3>
          <p className="section-description">
            Browse available knowledge sources for RAG
          </p>

          <div className="knowledge-base-grid">
            {KNOWLEDGE_BASE_ITEMS.map((item) => (
              <div key={item.id} className="kb-item glass-card-inner">
                <div className="kb-icon">{item.icon}</div>
                <div className="kb-content">
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                  <div className="kb-meta">
                    <span className="kb-count">{item.itemCount} items</span>
                    <span className="kb-updated">Updated {item.lastUpdated}</span>
                  </div>
                </div>
                <button className="kb-action glass-button-sm">View</button>
              </div>
            ))}
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className="demo-section glass-card coming-soon">
          <h3 className="section-title">Coming Soon</h3>
          <div className="coming-soon-grid">
            <div className="coming-soon-item">
              <div className="coming-soon-icon">👤</div>
              <h4>PersonaPanel</h4>
              <p>Configure AI personas with custom behaviors and avatars</p>
            </div>
            <div className="coming-soon-item">
              <div className="coming-soon-icon">⚙️</div>
              <h4>RAGConfigPanel</h4>
              <p>Fine-tune RAG settings for optimal retrieval</p>
            </div>
            <div className="coming-soon-item">
              <div className="coming-soon-icon">📊</div>
              <h4>ModelComparison</h4>
              <p>Side-by-side model performance comparison</p>
            </div>
            <div className="coming-soon-item">
              <div className="coming-soon-icon">🎯</div>
              <h4>IntentClassifier</h4>
              <p>Classify user intent with confidence scores</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
