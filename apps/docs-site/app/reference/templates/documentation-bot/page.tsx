import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Documentation Bot Template | Clarity Chat',
  description: 'Interactive documentation assistant with semantic search and code examples.'
}

export default function DocumentationBotTemplatePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Documentation Bot Template</h1>
      <p className="text-xl text-muted-foreground mb-8">
        AI-powered documentation assistant with semantic search, code examples, and contextual help.
      </p>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Features</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Semantic documentation search</li>
          <li>Code example generation</li>
          <li>API reference lookups</li>
          <li>Version-aware responses</li>
          <li>Related docs suggestions</li>
          <li>Feedback collection</li>
          <li>Usage analytics</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Usage</h2>
        <div className="bg-muted p-6 rounded-lg">
          <pre className="text-sm overflow-x-auto"><code>{`import { DocumentationBot } from '@clarity-chat/react/templates'

function App() {
  return (
    <DocumentationBot
      apiEndpoint="/api/docs"
      docsVersion="v2.0"
      enableCodeGeneration
      showRelatedDocs
    />
  )
}`}</code></pre>
        </div>
      </section>
    </div>
  )
}
