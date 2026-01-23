import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Setup Wizard',
  description: 'Interactive setup wizard for configuring Clarity Chat.',
}

export default function Page() {
  return (
    <div className="docs-content">
      <div className="docs-section">
        <h1>Setup Wizard</h1>
        <p className="lead">
          Interactive setup wizard that guides you through configuring
          Clarity Chat with sensible defaults and validation.
        </p>
      </div>

      <div className="docs-section">
        <h2>🎯 Interactive Setup</h2>
        <p>Use the setup wizard component for guided configuration.</p>

        <div className="code-block">
          <pre><code>{`import { SetupWizard } from '@clarity-chat/react'

function SetupApp() {
  return (
    <SetupWizard
      onComplete={(config) => {
        console.log('Setup complete:', config)
        // Use config to initialize your chat
      }}
      onCancel={() => console.log('Setup cancelled')}
    />
  )
}`}</code></pre>
        </div>
      </div>

      <div className="docs-section">
        <h2>⚡ Quick Setup</h2>
        <p>Pre-configured setup utilities for common scenarios.</p>

        <div className="code-block">
          <pre><code>{`import { QuickSetup } from '@clarity-chat/react'

function App() {
  return QuickSetup.basic('/api/chat')
}

// Or with memory
function AppWithMemory() {
  return QuickSetup.withMemory('/api/chat')
}

// Enterprise setup
function EnterpriseApp() {
  return QuickSetup.enterprise('/api/chat')
}

// Streaming optimized
function StreamingApp() {
  return QuickSetup.streaming('/api/chat')
}`}</code></pre>
        </div>
      </div>

      <div className="docs-section">
        <h2>🖥️ Console Setup</h2>
        <p>Run interactive setup directly from the browser console.</p>

        <div className="code-block">
          <pre><code>{`import { interactiveSetup } from '@clarity-chat/react'

// Run in browser console
interactiveSetup()

// Follow the prompts:
// 1. Enter API endpoint
// 2. Choose features
// 3. Configure UI options
// 4. Get generated code`}</code></pre>
        </div>
      </div>

      <div className="docs-section">
        <h2>🔧 Configuration Structure</h2>

        <h3>SetupWizardConfig</h3>
        <div className="code-block">
          <pre><code>{`interface SetupWizardConfig {
  api: string                    // API endpoint URL
  features: {
    memory: boolean             // Enable memory
    streaming: boolean          // Enable streaming
    rateLimiting: boolean       // Enable rate limiting
    enterprise: boolean         // Use enterprise features
  }
  ui: {
    header: boolean             // Show header
    prompts: boolean            // Show starter prompts
    darkMode: boolean           // Use dark mode
  }
}`}</code></pre>
        </div>
      </div>

      <div className="docs-section">
        <h2>📚 API Reference</h2>

        <h3>SetupWizard Component</h3>
        <div className="api-reference">
          <div className="api-item">
            <code>SetupWizard</code>
            <p>Interactive setup wizard component.</p>
            <h4>Props</h4>
            <ul>
              <li><code>onComplete(config)</code> - Called when setup is complete</li>
              <li><code>onCancel()</code> - Called when setup is cancelled</li>
            </ul>
          </div>
        </div>

        <h3>QuickSetup</h3>
        <div className="api-reference">
          <div className="api-item">
            <code>QuickSetup.basic(api)</code>
            <p>Basic chat setup.</p>
          </div>
          <div className="api-item">
            <code>QuickSetup.withMemory(api)</code>
            <p>Chat with memory enabled.</p>
          </div>
          <div className="api-item">
            <code>QuickSetup.enterprise(api)</code>
            <p>Enterprise chat setup.</p>
          </div>
          <div className="api-item">
            <code>QuickSetup.streaming(api)</code>
            <p>Streaming-optimized chat.</p>
          </div>
        </div>

        <h3>interactiveSetup()</h3>
        <div className="api-reference">
          <div className="api-item">
            <code>interactiveSetup(): void</code>
            <p>Run interactive setup in browser console.</p>
          </div>
        </div>
      </div>

      <div className="docs-section">
        <h2>🎨 Customization</h2>

        <h3>Custom Wizard Steps</h3>
        <div className="code-block">
          <pre><code>{`import { SetupWizard } from '@clarity-chat/react'

class CustomSetupWizard extends SetupWizard {
  render() {
    // Custom rendering logic
    return super.render()
  }
}`}</code></pre>
        </div>

        <h3>Configuration Validation</h3>
        <div className="code-block">
          <pre><code>{`function validateConfig(config: SetupWizardConfig): string[] {
  const errors: string[] = []

  if (!config.api) {
    errors.push('API endpoint is required')
  }

  if (config.features.memory && config.features.streaming) {
    // Custom validation logic
  }

  return errors
}`}</code></pre>
        </div>
      </div>

      <div className="docs-section">
        <h2>🚀 Integration Patterns</h2>

        <h3>With React Router</h3>
        <div className="code-block">
          <pre><code>{`import { SetupWizard } from '@clarity-chat/react'

function SetupRoute() {
  return (
    <SetupWizard
      onComplete={(config) => {
        // Save config and redirect
        localStorage.setItem('chatConfig', JSON.stringify(config))
        navigate('/chat')
      }}
    />
  )
}`}</code></pre>
        </div>

        <h3>With Form Libraries</h3>
        <div className="code-block">
          <pre><code>{`import { QuickSetup } from '@clarity-chat/react'

function AdvancedSetup() {
  const [config, setConfig] = useState(null)

  if (!config) {
    return <SetupWizard onComplete={setConfig} />
  }

  // Use the configuration
  return <ClarityChat api={config.api} {...config} />
}`}</code></pre>
        </div>

        <h3>Programmatic Setup</h3>
        <div className="code-block">
          <pre><code>{`import { QuickSetup, interactiveSetup } from '@clarity-chat/react'

// In development console
interactiveSetup()

// Or use QuickSetup for immediate setup
const chat = QuickSetup.enterprise('/api/chat')`}</code></pre>
        </div>
      </div>

      <div className="docs-section">
        <h2>🎯 Best Practices</h2>

        <h3>Setup Flow</h3>
        <ul>
          <li>Use <code>SetupWizard</code> for user-facing setup</li>
          <li>Use <code>QuickSetup</code> for programmatic setup</li>
          <li>Use <code>interactiveSetup</code> for development/testing</li>
        </ul>

        <h3>Configuration Management</h3>
        <ul>
          <li>Validate configurations before use</li>
          <li>Store configurations for persistence</li>
          <li>Provide migration paths for config changes</li>
        </ul>

        <h3>Performance</h3>
        <ul>
          <li>Lazy load setup components</li>
          <li>Cache validated configurations</li>
          <li>Avoid re-running setup unnecessarily</li>
        </ul>
      </div>

      <div className="docs-section">
        <h2>🔍 Troubleshooting</h2>

        <h3>Common Issues</h3>
        <div className="issue-list">
          <div className="issue">
            <h4>Setup wizard not rendering</h4>
            <p>Ensure you're in a React environment and have imported styles.</p>
          </div>
          <div className="issue">
            <h4>interactiveSetup not working</h4>
            <p>Make sure you're running in a browser environment.</p>
          </div>
          <div className="issue">
            <h4>Configuration not persisting</h4>
            <p>Implement your own persistence layer for configurations.</p>
          </div>
        </div>
      </div>
    </div>
  )
}