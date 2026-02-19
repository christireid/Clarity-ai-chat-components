import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Quick Start Helpers',
  description: 'Ultra-simple APIs for getting started with Clarity Chat in seconds.',
}

export default function Page() {
  return (
    <div className="docs-content">
      <div className="docs-section">
        <h1>Quick Start Helpers</h1>
        <p className="lead">
          Ultra-simple APIs that let you get started with Clarity Chat in seconds.
          Choose the level of abstraction that fits your needs.
        </p>
      </div>

      <div className="docs-section">
        <h2>🚀 Level 1: One-Line Chat (Simplest)</h2>
        <p>The absolute simplest way to add chat to your app.</p>

        <div className="code-block">
          <pre><code>{`import { chat } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

export default function App() {
  return chat('/api/chat') // That's it! 🎉
}`}</code></pre>
        </div>

        <h3>API Reference</h3>
        <div className="api-reference">
          <div className="api-item">
            <code>chat(api: string, options?: ChatOptions): JSX.Element</code>
            <p>Create a basic chat component.</p>
            <h4>Parameters</h4>
            <ul>
              <li><code>api</code> - API endpoint URL</li>
              <li><code>options.memory</code> - Enable memory (optional)</li>
              <li><code>options.streaming</code> - Enable streaming (optional)</li>
              <li><code>options.enterprise</code> - Use enterprise preset (optional)</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="docs-section">
        <h2>🏗️ Level 2: Builder Pattern</h2>
        <p>Fluent API for building custom configurations.</p>

        <div className="code-block">
          <pre><code>{`import { ChatBuilder } from '@clarity-chat/react'

export default function App() {
  return ChatBuilder.create('/api/chat')
    .withMemory('vector-store')
    .withHeader('My AI Assistant')
    .withStreaming()
    .withRateLimiting(true)
    .build()
}`}</code></pre>
        </div>

        <h3>API Reference</h3>
        <div className="api-reference">
          <div className="api-item">
            <code>ChatBuilder.create(api: string): ChatBuilder</code>
            <p>Start building a chat configuration.</p>
          </div>
          <div className="api-item">
            <code>.withMemory(strategy?): ChatBuilder</code>
            <p>Enable memory with optional strategy.</p>
          </div>
          <div className="api-item">
            <code>.withHeader(title?): ChatBuilder</code>
            <p>Add a header with optional title.</p>
          </div>
          <div className="api-item">
            <code>.withStreaming(useWebSocket?): ChatBuilder</code>
            <p>Enable streaming with optional WebSocket.</p>
          </div>
          <div className="api-item">
            <code>.withRateLimiting(enabled?): ChatBuilder</code>
            <p>Enable rate limiting.</p>
          </div>
          <div className="api-item">
            <code>.withPrompts(starterPrompts?): ChatBuilder</code>
            <p>Add starter prompts.</p>
          </div>
          <div className="api-item">
            <code>.build(): JSX.Element</code>
            <p>Build the final component.</p>
          </div>
        </div>
      </div>

      <div className="docs-section">
        <h2>🎯 Level 3: Named Presets</h2>
        <p>Pre-configured components for common use cases.</p>

        <div className="code-block">
          <pre><code>{`import { ChatPresets } from '@clarity-chat/react'

export default function App() {
  return ChatPresets.Enterprise('/api/chat')
}`}</code></pre>
        </div>

        <h3>Available Presets</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="preset-card">
            <h4>ChatPresets.Minimal</h4>
            <p>Basic chat functionality only.</p>
          </div>
          <div className="preset-card">
            <h4>ChatPresets.WithMemory</h4>
            <p>Chat with memory enabled.</p>
          </div>
          <div className="preset-card">
            <h4>ChatPresets.Streaming</h4>
            <p>Optimized for real-time updates.</p>
          </div>
          <div className="preset-card">
            <h4>ChatPresets.Enterprise</h4>
            <p>Full-featured enterprise chat.</p>
          </div>
          <div className="preset-card">
            <h4>ChatPresets.Support</h4>
            <p>Optimized for customer support.</p>
          </div>
          <div className="preset-card">
            <h4>ChatPresets.Technical</h4>
            <p>Optimized for technical questions.</p>
          </div>
        </div>
      </div>

      <div className="docs-section">
        <h2>🔧 Additional Helpers</h2>

        <h3>chatWithMemory</h3>
        <div className="code-block">
          <pre><code>{`import { chatWithMemory } from '@clarity-chat/react'

export default function App() {
  return chatWithMemory('/api/chat', 'vector-store')
}`}</code></pre>
        </div>

        <h3>enterpriseChat</h3>
        <div className="code-block">
          <pre><code>{`import { enterpriseChat } from '@clarity-chat/react'

export default function App() {
  return enterpriseChat('/api/chat', 'My Assistant')
}`}</code></pre>
        </div>

        <h3>streamingChat</h3>
        <div className="code-block">
          <pre><code>{`import { streamingChat } from '@clarity-chat/react'

export default function App() {
  return streamingChat('/api/chat', true) // WebSocket
}`}</code></pre>
        </div>
      </div>

      <div className="docs-section">
        <h2>📚 Migration Guide</h2>

        <h3>From Basic Setup</h3>
        <div className="code-comparison">
          <div>
            <h4>Before (Verbose)</h4>
            <pre><code>{`<ClarityChat
  api="/api/chat"
  memory={{ enabled: true }}
  transport="sse"
/>`}</code></pre>
          </div>
          <div>
            <h4>After (Simple)</h4>
            <pre><code>{`chat('/api/chat', {
  memory: true,
  streaming: true
})`}</code></pre>
          </div>
        </div>

        <h3>From Complex Configuration</h3>
        <div className="code-comparison">
          <div>
            <h4>Before (Complex)</h4>
            <pre><code>{`const config = {
  memory: { enabled: true, strategy: 'vector-store' },
  promptOptimization: { enabled: true },
  rateLimiting: { enabled: true },
  header: { show: true, title: 'Assistant' }
}

<ClarityChat api="/api/chat" {...config} />`}</code></pre>
          </div>
          <div>
            <h4>After (Builder)</h4>
            <pre><code>{`ChatBuilder.create('/api/chat')
  .withMemory('vector-store')
  .withHeader('Assistant')
  .withRateLimiting(true)
  .build()`}</code></pre>
          </div>
        </div>
      </div>

      <div className="docs-section">
        <h2>🎯 Best Practices</h2>

        <h3>Choose the Right Level</h3>
        <ul>
          <li><strong>Level 1</strong> - Quick prototyping, demos, simple apps</li>
          <li><strong>Level 2</strong> - Custom configurations, advanced use cases</li>
          <li><strong>Level 3</strong> - Pre-built solutions, specific domains</li>
        </ul>

        <h3>Performance Considerations</h3>
        <ul>
          <li>Level 1 functions return JSX directly (no lazy loading)</li>
          <li>Use presets for common configurations</li>
          <li>Builder pattern allows tree-shaking of unused features</li>
        </ul>

        <h3>Development vs Production</h3>
        <ul>
          <li>Use simple APIs for rapid development</li>
          <li>Gradually migrate to more specific configurations</li>
          <li>All levels are robust</li>
        </ul>
      </div>
    </div>
  )
}