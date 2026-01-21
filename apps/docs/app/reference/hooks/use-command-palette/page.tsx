import type { Metadata } from 'next'
import Link from 'next/link'
import { CodePlayground } from '@/components/Playground/CodePlayground'

export const metadata: Metadata = {
  title: 'useCommandPalette Hook | Clarity Chat',
  description:
    'Hook for managing command palette state with keyboard shortcut support (Cmd+K / Ctrl+K).',
}

export default function UseCommandPalettePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium mb-4">
          <span>UI Interaction</span>
        </div>
        <h1 className="text-4xl font-bold mb-4">useCommandPalette</h1>
        <p className="text-xl text-muted-foreground mb-4">
          Hook for managing command palette state with built-in keyboard
          shortcut support. Default shortcut is Cmd+K (Mac) or Ctrl+K
          (Windows/Linux).
        </p>
        <p className="text-muted-foreground">
          <strong>Architecture Layer:</strong> Mid-Level (Composable) •{' '}
          <strong>Domain:</strong> UI Interaction
        </p>
      </div>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">When to Use</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
          <li>
            Adding a command palette (Cmd+K) for quick actions in your chat app
          </li>
          <li>
            Implementing search functionality with keyboard shortcut activation
          </li>
          <li>
            When you need to track open/close state with global keyboard
            shortcuts
          </li>
          <li>Building power-user features with keyboard-driven navigation</li>
        </ul>

        <h2 className="text-3xl font-semibold mb-4">When NOT to Use</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>
            For simple modals - use{' '}
            <code className="bg-muted px-2 py-1 rounded">Modal</code> component
            instead
          </li>
          <li>
            For general keyboard shortcuts - use{' '}
            <code className="bg-muted px-2 py-1 rounded">
              useKeyboardShortcuts
            </code>
          </li>
          <li>
            When you only need the visual component - use{' '}
            <code className="bg-muted px-2 py-1 rounded">CommandPalette</code>{' '}
            directly
          </li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Basic Usage</h2>
        <CodePlayground
          code={`import { useCommandPalette, CommandPalette } from '@clarity-chat/react'

function App() {
  const {
    isOpen,
    open,
    close,
    toggle,
    shortcutDisplay, // "⌘K" on Mac, "Ctrl+K" on Windows
  } = useCommandPalette({
    shortcut: 'mod+k', // 'mod' = Cmd on Mac, Ctrl on Windows
    onOpen: () => console.log('Command palette opened'),
    onClose: () => console.log('Command palette closed'),
  })

  return (
    <div>
      <button onClick={open}>
        Search... <kbd>{shortcutDisplay}</kbd>
      </button>

      <CommandPalette
        isOpen={isOpen}
        onClose={close}
        commands={[
          { id: 'new', label: 'New Chat', action: () => {} },
          { id: 'settings', label: 'Settings', action: () => {} },
        ]}
      />
    </div>
  )
}`}
        />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">API Reference</h2>

        <div className="space-y-8">
          <div>
            <h3 className="text-2xl font-semibold mb-3">Options</h3>
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
                    <td className="p-3 font-mono text-sm">defaultOpen</td>
                    <td className="p-3 font-mono text-sm">boolean</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Initial open state. Default: false.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">shortcut</td>
                    <td className="p-3 font-mono text-sm">string</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Keyboard shortcut (e.g., 'mod+k', 'ctrl+shift+p').
                      Default: 'mod+k'.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">shortcutEnabled</td>
                    <td className="p-3 font-mono text-sm">boolean</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Whether keyboard shortcut is enabled. Default: true.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">onOpen</td>
                    <td className="p-3 font-mono text-sm">() =&gt; void</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Callback when palette opens.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">onClose</td>
                    <td className="p-3 font-mono text-sm">() =&gt; void</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Callback when palette closes.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">onToggle</td>
                    <td className="p-3 font-mono text-sm">
                      (isOpen: boolean) =&gt; void
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Callback when palette toggles.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">enableInInput</td>
                    <td className="p-3 font-mono text-sm">boolean</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Allow shortcut when focused on input elements. Default:
                      false.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold mb-3">Return Value</h3>
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
                    <td className="p-3 font-mono text-sm">isOpen</td>
                    <td className="p-3 font-mono text-sm">boolean</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Whether palette is open.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">open</td>
                    <td className="p-3 font-mono text-sm">() =&gt; void</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Open the palette.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">close</td>
                    <td className="p-3 font-mono text-sm">() =&gt; void</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Close the palette.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">toggle</td>
                    <td className="p-3 font-mono text-sm">() =&gt; void</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Toggle open/closed.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">setOpen</td>
                    <td className="p-3 font-mono text-sm">
                      (open: boolean) =&gt; void
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Set open state directly.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">shortcutDisplay</td>
                    <td className="p-3 font-mono text-sm">string</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Platform-aware shortcut string (e.g., "⌘K").
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Related</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            href="/reference/components/command-palette"
            className="border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">CommandPalette</h3>
            <p className="text-sm text-muted-foreground">
              Command palette UI component.
            </p>
          </Link>
          <Link
            href="/reference/hooks/use-keyboard-shortcuts"
            className="border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">useKeyboardShortcuts</h3>
            <p className="text-sm text-muted-foreground">
              Register multiple keyboard shortcuts.
            </p>
          </Link>
        </div>
      </section>
    </div>
  )
}
