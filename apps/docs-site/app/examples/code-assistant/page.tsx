import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Code2, Terminal, GitBranch, Bug } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Code Assistant Example',
  description: 'AI-powered coding help with code generation and debugging',
}

export default function CodeAssistantPage() {
  return (
    <div className="container-docs py-12">
      <Link
        href="/examples"
        className="inline-flex items-center gap-2 text-brand-600 dark:text-brand-400 hover:underline mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Examples
      </Link>

      <div className="max-w-4xl">
        <div className="flex items-start gap-4 mb-8">
          <div className="p-3 bg-gradient-to-br from-slate-700 to-gray-900 text-white rounded-xl">
            <Code2 className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-5xl font-bold mb-4">Code Assistant</h1>
            <p className="text-xl text-text-secondary">
              AI-powered coding help with syntax highlighting, debugging, and code generation
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          <span className="px-3 py-1 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 rounded-full text-sm font-medium">
            Advanced
          </span>
          <span className="px-3 py-1 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 rounded-full text-sm">
            Developer Tools
          </span>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <h2>✨ Features</h2>
          <ul>
            <li>
              <strong>Code Explanation</strong> - Understand complex code snippets
            </li>
            <li>
              <strong>Debugging Help</strong> - Find and fix bugs with AI assistance
            </li>
            <li>
              <strong>Code Generation</strong> - Generate boilerplate and implementations
            </li>
            <li>
              <strong>Best Practices</strong> - Learn patterns and anti-patterns
            </li>
            <li>
              <strong>Syntax Highlighting</strong> - Beautiful code display
            </li>
            <li>
              <strong>Multi-Language</strong> - JavaScript, Python, TypeScript, Go, Rust
            </li>
            <li>
              <strong>Code Review</strong> - Get feedback on code quality
            </li>
            <li>
              <strong>Refactoring</strong> - Improve code structure
            </li>
          </ul>

          <h2>💬 Example Interactions</h2>

          <h3>Debugging Help</h3>
          <div className="bg-surface-elevated p-4 rounded-lg border border-border not-prose mb-4">
            <p className="font-medium mb-2">👤 Developer: "Why is my React component re-rendering?"</p>
            <div className="text-sm space-y-2">
              <p className="text-text-secondary">🤖 Assistant analyzes code and explains:</p>
              <ul className="ml-4 space-y-1 text-text-secondary">
                <li>• Object created in render (new reference every time)</li>
                <li>• Missing dependency in useEffect</li>
                <li>• Parent component passing new function</li>
              </ul>
              <p className="mt-2 font-medium">💡 Solution provided with code example</p>
            </div>
          </div>

          <h3>Code Generation</h3>
          <div className="bg-surface-elevated p-4 rounded-lg border border-border not-prose mb-4">
            <p className="font-medium mb-2">👤 Developer: "Create a debounce hook in TypeScript"</p>
            <p className="text-text-secondary text-sm mb-2">🤖 Assistant generates:</p>
            <pre className="bg-slate-950 text-slate-200 p-3 rounded text-xs overflow-x-auto">
{`function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  
  return debouncedValue
}`}</pre>
            <p className="text-sm text-green-600 mt-2">✅ With explanation of how it works</p>
          </div>

          <h2>🎯 Use Cases</h2>
          <div className="grid md:grid-cols-2 gap-4 not-prose my-6">
            <div className="p-4 border border-border rounded-lg">
              <Bug className="w-6 h-6 text-brand-500 mb-2" />
              <h3 className="font-semibold mb-2">Bug Fixing</h3>
              <p className="text-sm text-text-secondary">
                Identify issues and suggest fixes with explanations
              </p>
            </div>
            <div className="p-4 border border-border rounded-lg">
              <Code2 className="w-6 h-6 text-brand-500 mb-2" />
              <h3 className="font-semibold mb-2">Code Review</h3>
              <p className="text-sm text-text-secondary">
                Get feedback on code quality and best practices
              </p>
            </div>
            <div className="p-4 border border-border rounded-lg">
              <Terminal className="w-6 h-6 text-brand-500 mb-2" />
              <h3 className="font-semibold mb-2">Learning</h3>
              <p className="text-sm text-text-secondary">
                Understand new concepts with clear examples
              </p>
            </div>
            <div className="p-4 border border-border rounded-lg">
              <GitBranch className="w-6 h-6 text-brand-500 mb-2" />
              <h3 className="font-semibold mb-2">Refactoring</h3>
              <p className="text-sm text-text-secondary">
                Improve code structure and readability
              </p>
            </div>
          </div>

          <h2>🚀 Quick Start</h2>
          <pre className="bg-surface-muted p-4 rounded-lg">
            <code>{`cd examples/code-assistant
npm install
npm run dev`}</code>
          </pre>

          <h2>🔗 Related</h2>
          <ul>
            <li>
              <Link href="/examples/education-tutor" className="text-brand-600 dark:text-brand-400 hover:underline">
                Education Tutor
              </Link>{' '}
              - Similar teaching patterns
            </li>
            <li>
              <Link href="/reference/components/message" className="text-brand-600 dark:text-brand-400 hover:underline">
                Message Component
              </Link>{' '}
              - With syntax highlighting
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

