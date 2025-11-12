import React from 'react'
import { Metadata } from 'next'
import { CodeBlock } from '@/components/MDX/CodeBlock'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'Advanced Theming - Clarity Chat',
  description: 'Clarity Chat supports layered theming for both design tokens and component variants.',
}

export default function ThemingGuidePage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Guide</span>
        <h1>Advanced Theming</h1>
        <p className="docs-lead">
          Clarity Chat supports layered theming for both design tokens and component variants.
        </p>
      </div>

      <section className="docs-section">
        <h2>Theme Providers</h2>
        <p>
          Wrap your app with <code>ClarityThemeProvider</code> to toggle between light, dark, or custom palettes at runtime.
        </p>
        <CodeBlock
          language="tsx"
          code={`import { ClarityThemeProvider } from '@clarity-chat/react'

export function App({ children }: { children: React.ReactNode }) {
  return (
    <ClarityThemeProvider
      value={{
        mode: 'dark',
        accentColor: '#4b7cf5',
        radius: '0.75rem',
      }}
    >
      {children}
    </ClarityThemeProvider>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Token Overrides</h2>
        <p>
          Fine-tune tokens per component using CSS variables scoped to container elements.
        </p>
        <CodeBlock
          language="css"
          code={`.chat-shell {
  --clarity-message-user-bg: #0f172a;
  --clarity-message-assistant-bg: #1e293b;
  --clarity-border-strong: #334155;
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Variant Packs</h2>
        <p>
          Create custom component variants by extending base primitives.
        </p>
        <CodeBlock
          language="tsx"
          code={`import { Message } from '@clarity-chat/react'

export const OutlineMessage = props => (
  <Message
    {...props}
    className="rounded-lg border border-slate-500/60 bg-transparent"
    avatarVariant="mono"
  />
)`}
        />
      </section>

      <section className="docs-section">
        <p>
          Next, review the <a href="/guides/performance">Performance</a> guide to ensure themed components stay responsive.
        </p>
      </section>
    </div>
  )
}
