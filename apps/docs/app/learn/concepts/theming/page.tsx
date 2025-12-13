import { Metadata } from 'next'
import { Callout } from '@/components/MDX/Callout'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { CodeBlock } from '@/components/MDX/CodeBlock'


export const metadata: Metadata = {
  title: 'Theming Basics - Learn Clarity Chat',
  description:
    'Customize the visual system: theme provider, CSS variables, presets, and per-component overrides.',
}

export default function ThemingConceptPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Concept</span>
        <h1>Theming System</h1>
        <p className="docs-lead">
          Clarity Chat exposes an opinionated but flexible theme layer based on
          CSS variables. Change colour palettes, typography, spacing, and even
          animation presets without editing component source.
        </p>
      </div>

      <section className="docs-section">
        <h2>Theme Provider</h2>
        <p>
          Wrap your app with <code>ThemeProvider</code> and pass either built-in
          presets or your own token map.
        </p>
        <CodeBlock
          language="tsx"
          code={`import {
  ThemeProvider,
  ThemeSwitcher,
  createTheme,
  defaultTheme,
} from '@clarity-chat/react'

const brandTheme = createTheme({
  name: 'brand',
  colors: {
    primary: '#2563EB',
    primaryForeground: '#ffffff',
    secondary: '#9333EA',
    secondaryForeground: '#ffffff',
    surface: '#0B1120',
    surfaceForeground: '#E2E8F0',
  },
  radii: {
    md: '12px',
    lg: '20px',
  },
  fonts: {
    heading: 'Switzer, Inter, sans-serif',
    body: 'Inter, system-ui, sans-serif',
  },
})

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider themes={[defaultTheme, brandTheme]} defaultTheme="brand">
      <ThemeSwitcher className="fixed bottom-4 right-4" />
      {children}
    </ThemeProvider>
  )
}
`}
        />
        <Callout type="tip">
          Themes are serialisable JSON objects. Store them in your CMS or database
          to deliver enterprise-specific branding on the fly.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Token Reference</h2>
        <p>
          All components reference CSS variables such as{' '}
          <code>--chat-background</code>, <code>--chat-border</code>,{' '}
          <code>--chat-font-body</code>. Inspect them via browser devtools or the
          Theme Panel inside the docs site.
        </p>
        <CodeBlock
          language="css"
          code={`:root {
  --chat-background: hsl(210 30% 98%);
  --chat-surface: hsl(215 25% 96%);
  --chat-border: hsl(215 18% 90%);
  --chat-primary: hsl(221 83% 53%);
  --chat-primary-foreground: hsl(0 0% 100%);
  --chat-radius-md: 12px;
  --chat-font-body: 'Inter', sans-serif;
}`}
        />
        <Callout type="info">
          Prefer Tailwind? The docs and Storybook use TailwindCSS with CSS
          variables mapped to utility classes. You can follow the same pattern.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Per-Component Overrides</h2>
        <p>
          Override tokens per component using the <code>className</code> /
          <code>style</code> props or by targeting CSS variables directly.
        </p>
        <CodeBlock
          language="tsx"
          code={`<ChatWindow
  className="bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950"
  components={{
    Message: (props) => (
      <Message
        {...props}
        style={
          props.message.role === 'assistant'
            ? {
                ['--chat-surface' as any]: 'rgba(37, 99, 235, 0.08)',
                ['--chat-surface-foreground' as any]: '#0f172a',
              }
            : undefined
        }
      />
    ),
  }}
/>`}
        />
        <Callout type="warning">
          Remember accessibility: maintain the 7:1 contrast ratio from the
          default theme when introducing custom colours.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Dark Mode &amp; System Preference</h2>
        <p>
          <code>ThemeProvider</code> watches <code>prefers-color-scheme</code> and
          stores user overrides in localStorage. Expose a toggle via{' '}
          <code>ThemeSwitcher</code> or roll your own using the{' '}
          <code>useTheme</code> hook.
        </p>
        <CodeBlock
          language="tsx"
          code={`import { useTheme } from '@clarity-chat/react'

function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="rounded-full border border-border px-3 py-1 text-xs"
    >
      {resolvedTheme === 'dark' ? '🌙 Dark' : '☀️ Light'}
    </button>
  )
}
`}
        />
      </section>

      <section className="docs-section">
        <h2>Animations &amp; Motion</h2>
        <p>
          The theming system also controls motion through animation presets. See
          the Animations concept page for full details, but you can override
          duration/easing from the theme:
        </p>
        <CodeBlock
          language="tsx"
          code={`const fastMotionTheme = createTheme({
  name: 'fast-motion',
  motion: {
    duration: {
      normal: 180,
      slow: 260,
    },
    easing: {
      default: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
    },
  },
})`}
        />
      </section>

      <section className="docs-section">
        <h2>Key Takeaways</h2>
        <ul>
          <li>Use <code>ThemeProvider</code> with presets or custom tokens.</li>
          <li>Override specific components using CSS variables for consistent results.</li>
          <li>Provide light/dark or tenant-specific themes via the built-in switcher.</li>
          <li>Keep accessibility in mind—test contrast and motion preferences.</li>
        </ul>
      </section>
    </div>
  )
}

