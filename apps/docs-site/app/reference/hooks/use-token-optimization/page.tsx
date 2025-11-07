import React from 'react'
import { Metadata } from 'next'
import { LiveDemo } from '@/components/Demo/LiveDemo'
import { ApiTable } from '@/components/Demo/ApiTable'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'useTokenOptimization - Clarity Chat Hooks',
  description: 'React hook for applying token optimization strategies to conversations.',
}

export default function UseTokenOptimizationPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Hook</span>
        <h1>useTokenOptimization</h1>
        <p className="docs-lead">
          Apply compression, reranking, and sliding windows to reduce token usage while maintaining quality.
        </p>
      </div>

      <section className="docs-section">
        <h2>Overview</h2>
        <p>
          The <code>useTokenOptimization</code> hook provides a declarative way to apply various
          token optimization strategies to your conversations, reducing costs and improving latency.
        </p>
      </section>

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <LiveDemo
          title="Simple Example"
          code={`import { useTokenOptimization } from '@clarity-chat/react/hooks'

function ChatComponent() {
  const { optimizedMessages, savings, status } = useTokenOptimization(messages, {
    compression: { algorithm: 'llmlingua', targetRatio: 0.6 },
    slidingWindow: { maxTokens: 4000 }
  })

  return (
    <div>
      <div className="text-sm text-gray-600">
        Tokens saved: {savings.tokens} ({savings.percent}%)
      </div>
      <ChatWindow messages={optimizedMessages} />
    </div>
  )
}`}
          height="280px"
        />
      </section>

      <section className="docs-section">
        <h2>With Reranking</h2>
        <LiveDemo
          title="RAG with Reranking"
          code={`import { useTokenOptimization } from '@clarity-chat/react/hooks'

function RAGChat() {
  const { optimizedMessages, rerank } = useTokenOptimization(messages, {
    reranking: {
      enabled: true,
      model: 'cohere-rerank-v3',
      k: 10,  // Initial retrieval
      topK: 3  // Final documents
    }
  })

  const handleQuery = async (query: string) => {
    // Retrieve documents
    const docs = await vectorSearch(query, 10)
    
    // Rerank for relevance
    const topDocs = await rerank(query, docs)
    
    // Use in prompt
    sendMessage({ query, context: topDocs })
  }

  return <ChatWindow messages={optimizedMessages} onSend={handleQuery} />
}`}
          height="350px"
        />
      </section>

      <section className="docs-section">
        <h2>Props</h2>
        <ApiTable
          title="useTokenOptimization Parameters"
          data={hookParams}
        />
      </section>

      <section className="docs-section">
        <h2>Return Value</h2>
        <ApiTable
          title="Returned Object"
          data={returnValue}
        />
      </section>

      <section className="docs-section">
        <h2>Optimization Strategies</h2>
        
        <h3>Compression</h3>
        <p>Reduce prompt size while preserving meaning:</p>
        <pre><code>{`{
  compression: {
    algorithm: 'llmlingua',  // or 'gzip', 'selective'
    targetRatio: 0.6,  // Target 60% of original size
    preserveInstructions: true  // Keep system prompts intact
  }
}`}</code></pre>

        <h3>Sliding Window</h3>
        <p>Keep conversations within token limits:</p>
        <pre><code>{`{
  slidingWindow: {
    maxTokens: 4000,
    strategy: 'recent',  // or 'semantic', 'importance'
    keepSystem: true  // Always keep system messages
  }
}`}</code></pre>

        <h3>Reranking</h3>
        <p>Improve retrieval relevance:</p>
        <pre><code>{`{
  reranking: {
    model: 'cohere-rerank-v3',
    k: 20,  // Initial retrieval
    topK: 5,  // Final selection
    minScore: 0.3  // Minimum relevance score
  }
}`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>Advanced Example</h2>
        <pre><code>{`import { useTokenOptimization } from '@clarity-chat/react/hooks'

function AdvancedChat() {
  const {
    optimizedMessages,
    savings,
    status,
    compress,
    rerank,
    applyWindow
  } = useTokenOptimization(messages, {
    compression: {
      algorithm: 'llmlingua',
      targetRatio: 0.5,
      targetModels: ['gpt-4'],  // Only compress for expensive models
    },
    reranking: {
      model: 'cohere-rerank-v3',
      k: 15,
      topK: 4
    },
    slidingWindow: {
      maxTokens: 6000,
      strategy: 'semantic',  // Keep semantically important messages
      embeddings: openaiEmbeddings
    },
    onOptimized: (result) => {
      console.log('Optimization complete:', result)
      trackMetric('tokens_saved', result.tokensSaved)
    }
  })

  // Manual compression
  const compressPrompt = async (text: string) => {
    const compressed = await compress(text)
    return compressed
  }

  // Manual reranking
  const rankResults = async (query: string, docs: Document[]) => {
    const ranked = await rerank(query, docs)
    return ranked
  }

  return (
    <div>
      <TokenOptimizationBadge savings={savings} />
      <ChatWindow 
        messages={optimizedMessages}
        status={status}
      />
    </div>
  )
}`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <Callout type="tip" title="Optimization Tips">
          • Start with a targetRatio of 0.6-0.7 and adjust based on quality<br/>
          • Use semantic sliding windows for long conversations<br/>
          • Combine reranking with hybrid search for best results<br/>
          • Monitor savings vs. quality trade-offs
        </Callout>
        <ul>
          <li>Test optimization strategies against your quality metrics</li>
          <li>Use different strategies for different models (more aggressive for GPT-4)</li>
          <li>Cache compressed prompts to reduce overhead</li>
          <li>Monitor token savings in production</li>
          <li>A/B test compression ratios</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/guides/token-optimization" className="docs-card">
            <h3>Token Optimization Guide</h3>
            <p>Complete optimization strategies</p>
          </a>
          <a href="/reference/components/token-optimization-panel" className="docs-card">
            <h3>TokenOptimizationPanel</h3>
            <p>UI for optimization controls</p>
          </a>
          <a href="/reference/hooks/use-token-tracker" className="docs-card">
            <h3>useTokenTracker</h3>
            <p>Track token usage</p>
          </a>
        </div>
      </section>
    </div>
  )
}

const hookParams = [
  {
    name: 'messages',
    type: 'Message[]',
    required: true,
    description: 'Array of messages to optimize'
  },
  {
    name: 'options',
    type: 'TokenOptimizationOptions',
    required: false,
    description: 'Optimization configuration'
  },
  {
    name: 'options.compression',
    type: 'CompressionConfig',
    required: false,
    description: 'Prompt compression settings'
  },
  {
    name: 'options.reranking',
    type: 'RerankingConfig',
    required: false,
    description: 'Document reranking settings'
  },
  {
    name: 'options.slidingWindow',
    type: 'SlidingWindowConfig',
    required: false,
    description: 'Context window management'
  },
  {
    name: 'options.onOptimized',
    type: '(result: OptimizationResult) => void',
    required: false,
    description: 'Callback after optimization'
  }
]

const returnValue = [
  {
    name: 'optimizedMessages',
    type: 'Message[]',
    description: 'Optimized message array'
  },
  {
    name: 'savings',
    type: '{ tokens: number; percent: number; cost: number }',
    description: 'Token and cost savings'
  },
  {
    name: 'status',
    type: "'idle' | 'optimizing' | 'complete' | 'error'",
    description: 'Optimization status'
  },
  {
    name: 'compress',
    type: '(text: string) => Promise<string>',
    description: 'Manually compress text'
  },
  {
    name: 'rerank',
    type: '(query: string, docs: Document[]) => Promise<Document[]>',
    description: 'Manually rerank documents'
  },
  {
    name: 'applyWindow',
    type: '(messages: Message[]) => Message[]',
    description: 'Apply sliding window manually'
  },
  {
    name: 'error',
    type: 'Error | null',
    description: 'Error if optimization failed'
  }
]
