import { Metadata } from 'next'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodeBlock } from '@/components/MDX/CodeBlock'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'Styling & Customization',
  description: 'Match Clarity Chat to your brand with CSS tokens, slots, and localization.',
}

export default function StylingGuidePage() {
  return (
    <>
      <Breadcrumbs />

      <h1>Styling &amp; Customization</h1>

      <p className="lead">
        Tailor the Clarity Chat experience to match your product’s voice, brand, and workflows without
        forking core components.
      </p>

      <h2 id="css-variables">CSS Variable Tokens</h2>
      <p>
        All components expose design tokens under the <code>--clarity-*</code> namespace. Override
        them globally or scope them to specific shells.
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

      <h2 id="utility-first">Utility-First Styling</h2>
      <p>
        Use <code>className</code> or slot-specific props to add Tailwind or utility classes while
        keeping built-in accessibility attributes.
      </p>
      <CodeBlock
        language="tsx"
        code={`import { ChatWindow } from '@clarity-chat/react'

<ChatWindow
  className="rounded-xl border border-slate-700 shadow-lg"
  headerClassName="bg-slate-900/80 backdrop-blur"
  composerClassName="bg-slate-950"
  messages={messages}
/>`}
      />

      <h2 id="component-slots">Component Slots</h2>
      <p>
        Swap internals via render props. Keep default structure but inject your own variants or copy.
      </p>
      <CodeBlock
        language="tsx"
        code={`import { ChatWindow, Composer, Message } from '@clarity-chat/react'

<ChatWindow
  messages={messages}
  renderMessage={(props) => (
    <Message {...props} showAvatar={false} variant="compact" />
  )}
  renderComposer={(props) => (
    <Composer {...props} placeholder="Ask our AI anything…" />
  )}
/>`}
      />

      <h2 id="layout">Layouts &amp; Shells</h2>
      <p>
        Use primitives from <code>@clarity-chat/primitives</code> (Card, Drawer, ScrollArea) to frame
        chat surfaces. Combine with <code>ProjectSidebar</code>, <code>ContextManager</code>, and
        <code>UsageDashboard</code> for enterprise workflows.
      </p>

      <h2 id="localization">Localization</h2>
      <p>
        Translate labels via props such as <code>composerLabels</code>, <code>attachmentLabels</code>,
        and <code>errorMessages</code>. Hooks expose friendly APIs for locale-specific prompts.
      </p>

      <Callout type="tip">
        <p>
          Build multi-brand SaaS by wrapping each tenant view in a <code>ClarityThemeProvider</code> and
          applying per-tenant token overrides.
        </p>
      </Callout>

      <h2 id="next-steps">Next Steps</h2>
      <ul>
        <li>Read <a href="/learn/concepts/theming">Theming System</a> for runtime token orchestration.</li>
        <li>Browse <a href="/reference/components">component reference</a> to discover slot props.</li>
        <li>Check the <a href="/cookbook/custom-theming">Custom Theming</a> recipe for end-to-end setup.</li>
      </ul>
    </>
  )
}
