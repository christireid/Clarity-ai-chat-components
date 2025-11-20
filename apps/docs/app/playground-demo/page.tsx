import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'

export const metadata: Metadata = {
  title: 'Interactive Playground',
  description: 'Try out Clarity Chat components with live code editing',
}

const exampleCode = `import { Button, Badge, ToastProvider, useToast } from '@clarity-chat/react'
import { Send } from 'lucide-react'

function App() {
  const { success } = useToast()

  return (
    <div className="flex flex-col gap-4 p-6">
      <h2 className="text-2xl font-bold">Button Examples</h2>

      <div className="flex items-center gap-3 flex-wrap">
        <Button variant="primary" onClick={() => success('Primary clicked!')}>
          Primary
        </Button>
        <Button variant="secondary">
          Secondary
        </Button>
        <Button variant="success">
          Success
        </Button>
        <Button variant="outline">
          Outline
        </Button>
      </div>

      <h2 className="text-2xl font-bold mt-4">Badge Examples</h2>

      <div className="flex items-center gap-2 flex-wrap">
        <Badge>Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="success">Success</Badge>
        <Badge variant="destructive">Destructive</Badge>
        <Badge variant="outline">Outline</Badge>
      </div>

      <h2 className="text-2xl font-bold mt-4">With Icons</h2>

      <div className="flex items-center gap-3">
        <Button variant="primary">
          <Send className="w-4 h-4 mr-2" />
          Send Message
        </Button>
        <Button isLoading variant="secondary">
          Loading...
        </Button>
      </div>
    </div>
  )
}

render(<App />)`

export default function PlaygroundDemoPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">🎮 Interactive</span>
        <h1>Live Playground</h1>
        <p className="docs-lead">
          Edit the code below to see real Clarity Chat components in action. All components are rendered using the actual library code - no mocks!
        </p>
      </div>

      <section className="docs-section">
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">Try it yourself</h2>
          <p className="text-gray-600 dark:text-gray-400">
            The playground below uses <code className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">react-live</code> to render real components from <code className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">@clarity-chat/react</code>.
            Modify the code to experiment with different props, variants, and compositions.
          </p>
        </div>

        <CodePlayground initialCode={exampleCode} />
      </section>

      <section className="docs-section">
        <h2>✨ Key Features</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="font-bold text-lg mb-2">Real Components</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Uses actual @clarity-chat/react components, not mocks. See exactly how your components will behave in production.
            </p>
          </div>

          <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200 dark:border-purple-800">
            <h3 className="font-bold text-lg mb-2">Live Preview</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Changes update instantly as you type. Experiment with different props and see results in real-time.
            </p>
          </div>

          <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
            <h3 className="font-bold text-lg mb-2">Full Access</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              All exported components, hooks, and utilities are available in scope. No imports needed in the playground.
            </p>
          </div>

          <div className="p-4 bg-orange-50 dark:bg-orange-950/30 rounded-lg border border-orange-200 dark:border-orange-800">
            <h3 className="font-bold text-lg mb-2">Error Handling</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              See helpful error messages and stack traces when something goes wrong. Great for learning.
            </p>
          </div>
        </div>
      </section>

      <section className="docs-section">
        <h2>🚀 Available in Scope</h2>
        <p className="mb-4">
          All Clarity Chat components and React hooks are available without imports:
        </p>

        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <h4 className="font-semibold mb-2">Components</h4>
          <code className="text-sm text-gray-700 dark:text-gray-300">
            Button, Badge, ChatWindow, Message, ToastProvider, and all other @clarity-chat/react components
          </code>

          <h4 className="font-semibold mt-4 mb-2">Hooks</h4>
          <code className="text-sm text-gray-700 dark:text-gray-300">
            useState, useEffect, useCallback, useMemo, useRef, useContext, createContext, useToast, and all other React hooks
          </code>

          <h4 className="font-semibold mt-4 mb-2">Utilities</h4>
          <code className="text-sm text-gray-700 dark:text-gray-300">
            render (for rendering components)
          </code>
        </div>
      </section>

      <section className="docs-section">
        <h2>💡 Tips</h2>
        <ul className="space-y-2">
          <li>• Edit the code in the left panel to see changes in real-time</li>
          <li>• Use <code className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">render(&lt;YourComponent /&gt;)</code> to display your component</li>
          <li>• All Clarity components are wrapped with ToastProvider automatically</li>
          <li>• Errors will appear above the preview with helpful debugging information</li>
          <li>• Click the reset button to restore the original example code</li>
        </ul>
      </section>
    </div>
  )
}
