import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Development Helpers',
  description: 'DX utilities for development, debugging, and configuration.',
}

export default function Page() {
  return (
    <div className="docs-content">
      <div className="docs-section">
        <h1>Development Helpers</h1>
        <p className="lead">
          Developer Experience (DX) utilities that help during development,
          debugging, and configuration of Clarity Chat.
        </p>
      </div>

      <div className="docs-section">
        <h2>🔍 Setup Validation</h2>
        <p>Automatically validate your Clarity Chat setup in development.</p>

        <div className="code-block">
          <pre><code>{`import { validateSetup } from '@clarity-chat/react'

// Check setup and get issues/suggestions
const { issues, suggestions } = validateSetup()

if (issues.length > 0) {
  console.log('Setup Issues:', issues)
  console.log('Suggestions:', suggestions)
}`}</code></pre>
        </div>

        <h3>Automatic Validation</h3>
        <p>Setup validation runs automatically in development mode. Check the console for:</p>
        <ul>
          <li>Missing CSS imports</li>
          <li>Server-side rendering issues</li>
          <li>Common configuration mistakes</li>
        </ul>
      </div>

      <div className="docs-section">
        <h2>⚙️ Configuration Presets</h2>
        <p>Pre-built configuration objects for common use cases.</p>

        <div className="code-block">
          <pre><code>{`import { ConfigPresets, createConfig } from '@clarity-chat/react'

// Use a preset directly
const minimalConfig = ConfigPresets.minimal

// Extend a preset with overrides
const customConfig = createConfig('withMemory', {
  memory: { maxTokens: 5000 }
})

// Use with useClarityChat
const { messages, append } = useClarityChat({
  api: '/api/chat',
  ...customConfig
})`}</code></pre>
        </div>

        <h3>Available Presets</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="preset-card">
            <h4>minimal</h4>
            <p>Basic functionality only</p>
          </div>
          <div className="preset-card">
            <h4>withMemory</h4>
            <p>Memory-enabled conversations</p>
          </div>
          <div className="preset-card">
            <h4>enterprise</h4>
            <p>Full enterprise features</p>
          </div>
          <div className="preset-card">
            <h4>streaming</h4>
            <p>Optimized for streaming</p>
          </div>
        </div>
      </div>

      <div className="docs-section">
        <h2>🐛 Development Logging</h2>
        <p>Structured logging utilities for development and debugging.</p>

        <div className="code-block">
          <pre><code>{`import { devLog } from '@clarity-chat/react'

// Development-only logging
devLog.info('Chat initialized', { messages: 5 })
devLog.warn('Rate limit approaching', { remaining: 10 })
devLog.error('API error', error)
devLog.debug('Memory operation', { operation: 'store', size: 1024 })`}</code></pre>
        </div>

        <p><strong>Note:</strong> All devLog calls are automatically disabled in production builds.</p>
      </div>

      <div className="docs-section">
        <h2>📝 Quick Start Templates</h2>
        <p>Copy-paste code snippets for common setups.</p>

        <div className="code-block">
          <pre><code>{`import { QuickStartTemplates, showQuickStart } from '@clarity-chat/react'

// Print a template to console
showQuickStart('withMemory')

// Or access templates directly
console.log(QuickStartTemplates.enterprise)`}</code></pre>
        </div>

        <h3>Available Templates</h3>
        <ul>
          <li><code>basic</code> - Minimal chat setup</li>
          <li><code>withMemory</code> - Chat with memory</li>
          <li><code>withHook</code> - Using useClarityChat hook</li>
          <li><code>enterprise</code> - Full enterprise setup</li>
          <li><code>ultraSimple</code> - One-line chat function</li>
        </ul>
      </div>

      <div className="docs-section">
        <h2>📊 Performance Monitoring (Dev)</h2>
        <p>Monitor component performance during development.</p>

        <div className="code-block">
          <pre><code>{`import { DevPerformanceMonitor } from '@clarity-chat/react'

const monitor = new DevPerformanceMonitor()

// Track component renders
monitor.trackRender('ChatWindow')

// Get performance stats
const stats = monitor.getStats()
console.log('Renders:', stats.renders)
console.log('Avg render time:', stats.avgRenderTime)`}</code></pre>
        </div>
      </div>

      <div className="docs-section">
        <h2>🛠️ API Reference</h2>

        <h3>validateSetup()</h3>
        <div className="api-reference">
          <div className="api-item">
            <code>validateSetup(): {'{ issues: string[], suggestions: string[] }'}</code>
            <p>Validate Clarity Chat setup and return issues/suggestions.</p>
          </div>
        </div>

        <h3>ConfigPresets</h3>
        <div className="api-reference">
          <div className="api-item">
            <code>ConfigPresets.minimal</code>
            <p>Basic configuration object.</p>
          </div>
          <div className="api-item">
            <code>ConfigPresets.withMemory</code>
            <p>Memory-enabled configuration.</p>
          </div>
          <div className="api-item">
            <code>ConfigPresets.enterprise</code>
            <p>Enterprise configuration.</p>
          </div>
          <div className="api-item">
            <code>ConfigPresets.streaming</code>
            <p>Streaming-optimized configuration.</p>
          </div>
        </div>

        <h3>createConfig()</h3>
        <div className="api-reference">
          <div className="api-item">
            <code>createConfig(preset, overrides): object</code>
            <p>Create configuration from preset with overrides.</p>
          </div>
        </div>

        <h3>devLog</h3>
        <div className="api-reference">
          <div className="api-item">
            <code>devLog.info(message, ...args)</code>
            <p>Development info logging.</p>
          </div>
          <div className="api-item">
            <code>devLog.warn(message, ...args)</code>
            <p>Development warning logging.</p>
          </div>
          <div className="api-item">
            <code>devLog.error(message, ...args)</code>
            <p>Development error logging.</p>
          </div>
          <div className="api-item">
            <code>devLog.debug(message, ...args)</code>
            <p>Development debug logging.</p>
          </div>
        </div>

        <h3>QuickStartTemplates</h3>
        <div className="api-reference">
          <div className="api-item">
            <code>QuickStartTemplates.basic</code>
            <p>Basic setup code snippet.</p>
          </div>
          <div className="api-item">
            <code>QuickStartTemplates.withMemory</code>
            <p>Memory-enabled setup code.</p>
          </div>
          <div className="api-item">
            <code>QuickStartTemplates.enterprise</code>
            <p>Enterprise setup code.</p>
          </div>
        </div>

        <h3>showQuickStart()</h3>
        <div className="api-reference">
          <div className="api-item">
            <code>showQuickStart(template: string)</code>
            <p>Print a quick start template to console.</p>
          </div>
        </div>

        <h3>DevPerformanceMonitor</h3>
        <div className="api-reference">
          <div className="api-item">
            <code>new DevPerformanceMonitor()</code>
            <p>Create a performance monitor instance.</p>
          </div>
          <div className="api-item">
            <code>trackRender(component: string)</code>
            <p>Track a component render.</p>
          </div>
          <div className="api-item">
            <code>getStats(): object</code>
            <p>Get performance statistics.</p>
          </div>
        </div>
      </div>

      <div className="docs-section">
        <h2>🎯 Usage Patterns</h2>

        <h3>Development Workflow</h3>
        <div className="code-block">
          <pre><code>{`// 1. Quick setup validation
import { validateSetup } from '@clarity-chat/react'
const { issues } = validateSetup()
if (issues.length) console.log('Fix setup:', issues)

// 2. Use presets for rapid development
import { ConfigPresets } from '@clarity-chat/react'
const config = ConfigPresets.withMemory

// 3. Debug with development logging
import { devLog } from '@clarity-chat/react'
devLog.info('Chat initialized', config)

// 4. Monitor performance
import { DevPerformanceMonitor } from '@clarity-chat/react'
const monitor = new DevPerformanceMonitor()
// Monitor automatically tracks renders`}</code></pre>
        </div>

        <h3>Production Cleanup</h3>
        <p>All development helpers are automatically disabled/removed in production:</p>
        <ul>
          <li><code>devLog</code> calls become no-ops</li>
          <li><code>validateSetup</code> returns empty results</li>
          <li><code>DevPerformanceMonitor</code> is disabled</li>
          <li>Zero impact on bundle size</li>
        </ul>
      </div>

      <div className="docs-section">
        <h2>🔧 Integration Examples</h2>

        <h3>With Build Tools</h3>
        <div className="code-block">
          <pre><code>{`// vite.config.js
export default {
  define: {
    __DEV__: process.env.NODE_ENV === 'development'
  }
}

// webpack.config.js
new webpack.DefinePlugin({
  __DEV__: JSON.stringify(process.env.NODE_ENV === 'development')
})`}</code></pre>
        </div>

        <h3>Custom Logging</h3>
        <div className="code-block">
          <pre><code>{`// Extend devLog for custom logging
import { devLog } from '@clarity-chat/react'

const customLog = {
  ...devLog,
  api: (message, data) => devLog.info(\`API: \${message}\`, data),
  perf: (metric, value) => devLog.debug(\`Perf: \${metric}\`, value)
}

customLog.api('Chat initialized', { messages: 5 })`}</code></pre>
        </div>
      </div>
    </div>
  )
}