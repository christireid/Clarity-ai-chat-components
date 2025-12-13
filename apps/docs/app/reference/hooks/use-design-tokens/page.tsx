import type { Metadata } from 'next'
import Link from 'next/link'
import { CodePlayground } from '@/components/Playground/CodePlayground'


export const metadata: Metadata = {
  title: 'useDesignTokens Hook | Clarity Chat',
  description:
    'Access design tokens for consistent styling across components including shadows, radius, and animations.',
}

export default function UseDesignTokensPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300 rounded-full text-sm font-medium mb-4">
          <span>Theming</span>
        </div>
        <h1 className="text-4xl font-bold mb-4">useDesignTokens</h1>
        <p className="text-xl text-muted-foreground mb-4">
          Provides access to design tokens and helper functions for consistent styling across components.
        </p>
        <p className="text-muted-foreground">
          <strong>Architecture Layer:</strong> Low-Level (Utilities) •{' '}
          <strong>Domain:</strong> Theming
        </p>
      </div>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">When to Use</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
          <li>Building custom components that need consistent styling with Clarity Chat</li>
          <li>Creating themed UI elements that respond to dark/light mode</li>
          <li>When you need programmatic access to shadows, border-radius, or ring styles</li>
          <li>Implementing animations with consistent timing and easing</li>
        </ul>

        <h2 className="text-3xl font-semibold mb-4">When NOT to Use</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>For simple styling - use Tailwind CSS classes directly</li>
          <li>For theme switching - use <code className="bg-muted px-2 py-1 rounded">useTheme</code> instead</li>
          <li>When tokens are already applied via component props</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Basic Usage</h2>
        <CodePlayground
          code={`import { useDesignTokens } from '@clarity-chat/react'

function StyledCard() {
  const tokens = useDesignTokens()

  return (
    <div className={\`
      \${tokens.shadows.lg}
      \${tokens.radius.lg}
      \${tokens.rings.default}
    \`}>
      <h3>Styled Card</h3>
      <p>Using design tokens for consistent styling</p>
    </div>
  )
}`}
        />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">API Reference</h2>

        <div className="space-y-8">
          <div>
            <h3 className="text-2xl font-semibold mb-3">Return Value (DesignTokens)</h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-3 font-semibold">Property</th>
                    <th className="text-left p-3 font-semibold">Type</th>
                    <th className="text-left p-3 font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="p-3 font-mono text-sm">shadows</td>
                    <td className="p-3 font-mono text-sm">{'{ xs, sm, md, lg, xl, 2xl }'}</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Shadow scale classes (e.g., 'shadow-lg').
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">radius</td>
                    <td className="p-3 font-mono text-sm">{'{ sm, md, lg, xl, full }'}</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Border radius classes (e.g., 'rounded-lg').
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">rings</td>
                    <td className="p-3 font-mono text-sm">{'{ default, focus, selected }'}</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Ring/border classes for focus and selection states.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">opacity</td>
                    <td className="p-3 font-mono text-sm">{'{ subtle, medium, strong }'}</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Opacity modifiers (e.g., '/10', '/30', '/50').
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">duration</td>
                    <td className="p-3 font-mono text-sm">{'{ instant, fast, normal, slow }'}</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Animation duration classes.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Token Values</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Shadows</h3>
            <ul className="text-sm space-y-1 font-mono text-muted-foreground">
              <li>xs: shadow-xs</li>
              <li>sm: shadow-sm</li>
              <li>md: shadow-md</li>
              <li>lg: shadow-lg</li>
              <li>xl: shadow-xl</li>
              <li>2xl: shadow-2xl</li>
            </ul>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Radius</h3>
            <ul className="text-sm space-y-1 font-mono text-muted-foreground">
              <li>sm: rounded-sm</li>
              <li>md: rounded-md</li>
              <li>lg: rounded-lg</li>
              <li>xl: rounded-xl</li>
              <li>full: rounded-full</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Related</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            href="/guides/theming"
            className="border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">Theming Guide</h3>
            <p className="text-sm text-muted-foreground">
              Complete guide to theming and customization.
            </p>
          </Link>
          <Link
            href="/reference/components/theme-switcher"
            className="border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">ThemeSwitcher</h3>
            <p className="text-sm text-muted-foreground">
              Component for switching between themes.
            </p>
          </Link>
        </div>
      </section>
    </div>
  )
}
