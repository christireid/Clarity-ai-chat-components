import { Metadata } from 'next'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'VS Code Extension - Developer Tools',
  description:
    'Boost productivity with IntelliSense, snippets, CodeLens hints, and commands for Clarity Chat development.',
}

export default function VscodeToolsPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Extension</span>
        <h1>Clarity Chat – VS Code Extension</h1>
        <p className="docs-lead">
          Intelligent completions, snippets, hover docs, and CLI integration right
          inside VS Code.
        </p>
      </div>

      <section className="docs-section">
        <h2>Features</h2>
        <ul>
          <li>🤖 Model-aware IntelliSense with pricing, context window, use cases</li>
          <li>📄 60+ TypeScript/React snippets for providers, hooks, API routes</li>
          <li>💡 Hover documentation for models, env vars, configuration</li>
          <li>🔎 CodeLens hints for API calls + quick docs links</li>
          <li>🛠️ Command palette integration for project init, provider setup, validation</li>
          <li>🔑 API key manager &amp; config validator panel</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Installation</h2>
        <ol>
          <li>Open VS Code → Extensions (<kbd>Cmd/Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>X</kbd>)</li>
          <li>Search for “Clarity Chat”</li>
          <li>Click Install</li>
          <li>Run <code>Clarity Chat: Initialize Project</code> from the command palette</li>
        </ol>
      </section>

      <section className="docs-section">
        <h2>Command Palette</h2>
        <ul>
          <li>
            <strong>Clarity Chat: Initialize Project</strong> — bootstrap a new project with provider templates
          </li>
          <li>
            <strong>Clarity Chat: Add Provider</strong> — install &amp; configure OpenAI/Anthropic/Google AI
          </li>
          <li>
            <strong>Clarity Chat: Validate Configuration</strong> — ensure env vars &amp; SDKs are present
          </li>
          <li>
            <strong>Clarity Chat: Show Examples</strong> — insert common patterns into the editor
          </li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Snippets</h2>
        <p>Prefixes start with <code>cc-</code>. Highlights:</p>
        <ul>
          <li><code>cc-openai-chat</code> — OpenAI chat completion boilerplate</li>
          <li><code>cc-openai-stream</code> — Streaming API route with SSE</li>
          <li><code>cc-react-chat</code> — Fully wired chat component</li>
          <li><code>cc-rag-processor</code> — RAG ingestion helper</li>
          <li><code>cc-token-counter</code> — Token usage + cost calculator</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Configuration</h2>
        <p>
          Access settings via <em>Preferences → Settings → Clarity Chat</em>. Enable or disable
          IntelliSense, CodeLens, inline hints, and choose a default provider.
        </p>
      </section>

      <section className="docs-section">
        <h2>Tips</h2>
        <ul>
          <li>Use <code>cc-</code> + <kbd>Ctrl/Cmd</kbd> + <kbd>Space</kbd> to trigger snippet suggestions</li>
          <li>Run <code>Clarity Chat: Validate Configuration</code> before shipping</li>
          <li>Hover over environment variables to see setup instructions &amp; docs links</li>
          <li>Enable “Inline hints” to visualise token costs beside API calls</li>
        </ul>
        <Callout type="warning">
          The extension requires VS Code 1.85+ and Node 16+ if developing locally.
          Snippets support TypeScript, JavaScript, and TSX/JSX files.
        </Callout>
      </section>
    </div>
  )
}

