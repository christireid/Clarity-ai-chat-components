import { Metadata } from 'next'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { Callout } from '@/components/MDX/Callout'
import { CodeBlock } from '@/components/MDX/CodeBlock'

export const metadata: Metadata = {
  title: 'Theming System',
  description: 'Customize Clarity Chat with design tokens, runtime providers, and variant packs.',
}

export default function ThemingConceptsPage() {
  return (
    <>
      <Breadcrumbs />

      <h1>Theming System</h1>

      <p className="lead">
        Clarity Chat supports layered theming with runtime providers, CSS token overrides, and
        component-level variants. Ship branded chat experiences without forking our components.
      </p>

      <h2 id="theme-provider">Theme Provider</h2>
      <p>
        Wrap your app in <code>ClarityThemeProvider</code> to toggle light/dark themes, swap accent
        colors, and standardise typography. The provider works with Next.js App Router, Remix, and Vite.
      </p>
      <CodeBlock
        language="tsx"
        title="Global theme provider"
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

      <Callout type="info">
        <p>
          The theme provider syncs with system preferences by default. Pass{' '}
          <code>mode="system"</code> to let users opt into their preferred scheme.
        </p>
      </Callout>

      <h2 id="design-tokens">Design Tokens</h2>
      <p>
        Tweak tokens using CSS variables scoped to any container. Every component reads from the{' '}
        <code>--clarity-*</code> token namespace, so you can remix palettes while keeping accessibility
        intact.
      </p>
      <CodeBlock
        language="css"
        title="Scoped overrides"
        code={`.chat-shell {
  --clarity-message-user-bg: #0f172a;
  --clarity-message-assistant-bg: #1e293b;
  --clarity-border-strong: #334155;
  --clarity-radius-lg: 16px;
}`}
      />

      <h2 id="variant-packs">Variant Packs</h2>
      <p>
        Extend base components with custom variants using the same primitives we do internally.
        Compose with Tailwind, vanilla CSS, or CSS-in-JS—the components expose className hooks across
        every surface.
      </p>
      <CodeBlock
        language="tsx"
        code={`import { Message } from '@clarity-chat/react'

export const OutlineMessage = (props: React.ComponentProps<typeof Message>) => (
  <Message
    {...props}
    className="rounded-lg border border-slate-500/60 bg-transparent"
    avatarVariant="mono"
  />
)`}
      />

      <h2 id="theme-tooling">Theme Tooling</h2>
      <ul>
        <li>
          <code>ThemeBuilder</code> turns brand palettes into full token sets with contrast guards.
        </li>
        <li>
          <code>ThemePreview</code> renders live previews for marketing reviews.
        </li>
        <li>
          <code>ThemeSwitcher</code> and <code>ThemeSelector</code> ship finished UI for user-driven theming.
        </li>
      </ul>

      <h2 id="best-practices">Best Practices</h2>
      <ul>
        <li>Keep minimum contrast ratios above 4.5:1—our ThemeBuilder enforces it automatically.</li>
        <li>Leverage <code>ThemeProvider</code> per workspace to give tenants bespoke branding.</li>
        <li>
          Pair theme overrides with <a href="/guides/styling">styling guide</a> for a complete brand system.
        </li>
      </ul>

      <p>
        Next, review the <a href="/guides/performance">performance guide</a> to ensure themed components
        stay responsive across devices.
      </p>
    </>
  )
}
