import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Code Assistant Template | Clarity Chat',
  description: 'Specialized template for code assistance with syntax highlighting and code actions.'
}

export default function CodeAssistantTemplatePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Code Assistant Template</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Specialized chat template for coding assistance with syntax highlighting, code execution, and diff viewing.
      </p>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Features</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Multi-language syntax highlighting</li>
          <li>Copy code button on hover</li>
          <li>Code diff visualization</li>
          <li>File tree navigation</li>
          <li>Terminal integration</li>
          <li>Code explanation mode</li>
          <li>Refactoring suggestions</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Usage</h2>
        <div className="bg-muted p-6 rounded-lg">
          <pre className="text-sm overflow-x-auto"><code>{`import { CodeAssistant } from '@clarity-chat/react/templates'

function App() {
  return (
    <CodeAssistant
      apiEndpoint="/api/code"
      defaultLanguage="typescript"
      enableCodeExecution
      enableDiffView
    />
  )
}`}</code></pre>
        </div>
      </section>
    </div>
  )
}
