import React from 'react'
import { Metadata } from 'next'
import { CodeBlock } from '@/components/MDX/CodeBlock'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'Customization - Clarity Chat',
  description: 'Tailor the Clarity Chat experience to match your product\'s voice, brand, and workflows.',
}

export default function CustomizationGuidePage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Guide</span>
        <h1>Customization</h1>
        <p className="docs-lead">
          Tailor the Clarity Chat experience to match your product&apos;s voice, brand, and workflows.
        </p>
      </div>

      <section className="docs-section">
        <h2>Theming via CSS Variables</h2>
        <p>
          All components expose design tokens under the <code>--clarity-*</code> namespace. Override them globally or per component.
        </p>
        <CodeBlock
          language="css"
          code={`:root {
  --clarity-background: #050816;
  --clarity-surface: #10122b;
  --clarity-primary: #4b7cf5;
  --clarity-success: #31c48d;
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Utility-First Styling</h2>
        <p>
          Pass a <code>className</code> or <code>slotClassNames</code> prop to inject Tailwind or utility classes without losing built-in accessibility attributes.
        </p>
        <CodeBlock
          language="tsx"
          code={`import { ChatWindow, Composer, Message } from '@clarity-chat/react'

<ChatWindow
  className="rounded-xl border border-slate-700"
  headerClassName="bg-slate-900/80"
  composerClassName="bg-slate-950"
  messages={messages}
/>`}
        />
      </section>

      <section className="docs-section">
        <h2>Component Slots</h2>
        <p>
          Override individual sub-components via render props:
        </p>
        <CodeBlock
          language="tsx"
          code={`import { ChatWindow, Composer, Message } from '@clarity-chat/react'

<ChatWindow
  messages={messages}
  renderMessage={props => (
    <Message {...props} showAvatar={false} variant="compact" />
  )}
  renderComposer={props => (
    <Composer {...props} placeholder="Ask our AI anything…" />
  )}
/>`}
        />
      </section>

      <section className="docs-section">
        <h2>Localization</h2>
        <p>
          Translate labels via props like <code>composerLabels</code>, <code>attachmentLabels</code>, and <code>errorMessages</code>. Use the <code>useChat</code> hook to feed locale-specific prompts.
        </p>
        <p>
          Continue with the <a href="/guides/theming">Theming</a> guide for advanced token maps and dark/light switching.
        </p>
      </section>
    </div>
  )
}
