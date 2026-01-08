import { Metadata } from 'next'
import { Callout } from '@/components/MDX/Callout'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { CodeBlock } from '@/components/MDX/CodeBlock'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Interactive Playground - Developer Tools',
  description:
    'Experiment with Clarity Chat components live. Editable code, presets, responsive viewports, state inspector, accessibility panel, and code export.',
}

export default function PlaygroundToolsPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Tool</span>
        <h1>Interactive Playground</h1>
        <p className="docs-lead">
          A Monaco-powered environment for tinkering with components. Adjust
          props, switch presets, view state, check accessibility, and export
          code without leaving the docs.
        </p>
      </div>

      <section className="docs-section">
        <h2>Features</h2>
        <ul>
          <li>
            🎛️ Prop controls for strings, numbers, booleans, selects, colours,
            ranges
          </li>
          <li>🧩 Preset selector with descriptions and best practices</li>
          <li>📱 Responsive viewport switcher (mobile / tablet / desktop)</li>
          <li>👀 State inspector with live state tree + event log</li>
          <li>
            ♿ Accessibility panel (keyboard shortcuts, WCAG status, ARIA info)
          </li>
          <li>
            📤 Quick actions: copy code, open CodeSandbox/StackBlitz, download
            file
          </li>
          <li>🧪 TS/JS toggle + install command helper</li>
        </ul>
        <Callout type="info">
          The playground is used across the docs. Visit{' '}
          <Link href="/playground-demo">/playground-demo</Link> for a guided
          tour.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Usage</h2>
        <ol>
          <li>
            Open any component page or{' '}
            <Link href="/playground-demo">Playground Demo</Link>
          </li>
          <li>Select a preset (e.g. “Support Agent”, “RAG Assistant”)</li>
          <li>Adjust props using the controls panel or edit the live code</li>
          <li>View real-time state updates in the inspector</li>
          <li>
            Copy the snippet or open in CodeSandbox to integrate into your app
          </li>
        </ol>
      </section>

      <section className="docs-section">
        <h2>Embedding Custom Components</h2>
        <p>
          Expose the playground in your own docs or admin tools by importing the
          <code>CodePlayground</code> component.
        </p>
        <CodeBlock
          language="tsx"
          code={`import { CodePlayground } from '@/components/Playground/CodePlayground'

export default function ButtonPlayground() {
  const initialCode = \`function Example() {
  return (
    <ChatWindow
      messages={messages}
      onSendMessage={handleSend}
    />
  )
}

render(<Example />)\`

  return (
    <CodePlayground
      code={initialCode}
    />
  )
}
`}
        />
        <Callout type="warning">
          The playground depends on the Monaco editor (~2.5&nbsp;MB). Lazy-load
          it or gate behind admin-only routes in production apps.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Keyboard Shortcuts</h2>
        <ul>
          <li>
            <kbd>Cmd/Ctrl</kbd> + <kbd>S</kbd> — Copy code to clipboard
          </li>
          <li>
            <kbd>Cmd/Ctrl</kbd> + <kbd>K</kbd> — Toggle controls panel
          </li>
          <li>
            <kbd>Cmd/Ctrl</kbd> + <kbd>P</kbd> — Switch presets
          </li>
          <li>
            <kbd>Cmd/Ctrl</kbd> + <kbd>/</kbd> — Focus code editor
          </li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Architecture</h2>
        <ul>
          <li>Monaco editor for code editing</li>
          <li>Sandpack for live bundling + preview</li>
          <li>Custom prop schema to auto-generate controls</li>
          <li>State inspector built with Zustand + Immer for diffing</li>
          <li>
            Accessibility panel powered by the same data used in audit reports
          </li>
        </ul>
      </section>
    </div>
  )
}
