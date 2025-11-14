import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'useLocalStorage | Clarity Chat',
  description: 'Persist state to localStorage with automatic serialization.'
}

export default function UseLocalStoragePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">useLocalStorage</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Persist state to localStorage with automatic serialization and cross-tab synchronization.
      </p>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Usage</h2>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
          <code>{`import { useLocalStorage } from '@clarity-chat/react'

const [theme, setTheme, removeTheme] = useLocalStorage('theme', 'light')
const [user, setUser] = useLocalStorage('user', null)

<button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
  Toggle theme
</button>`}</code>
        </pre>
      </section>

      <section>
        <h2 className="text-3xl font-semibold mb-4">Features</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Automatic JSON serialization</li>
          <li>Cross-tab synchronization</li>
          <li>SSR-safe (works with Next.js)</li>
          <li>Custom serializers supported</li>
          <li>Remove function included</li>
        </ul>
      </section>
    </div>
  )
}
