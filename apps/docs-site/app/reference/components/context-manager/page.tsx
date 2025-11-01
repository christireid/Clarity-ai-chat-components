import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Context Manager | Clarity Chat',
  description: 'Manage conversation context with file uploads, filtering, and activation controls.'
}

export default function ContextManagerPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Context Manager</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Comprehensive context management component for handling files, documents, and other conversation context with filtering and activation controls.
      </p>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Features</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>File upload with drag-and-drop support</li>
          <li>Context filtering by type (document, image, video, link, text)</li>
          <li>Active/inactive context toggle</li>
          <li>Context preview functionality</li>
          <li>Maximum context limits</li>
          <li>Type statistics and counts</li>
          <li>Bulk activation/deactivation</li>
          <li>Context cards with metadata display</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Usage</h2>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
          <code>{`import { ContextManager } from '@clarity-chat/react'
import type { Context } from '@clarity-chat/types'

function MyApp() {
  const [contexts, setContexts] = useState<Context[]>([])

  const handleAdd = (newContexts: Context[]) => {
    setContexts([...contexts, ...newContexts])
  }

  const handleRemove = (id: string) => {
    setContexts(contexts.filter(c => c.id !== id))
  }

  const handleToggle = (id: string) => {
    setContexts(contexts.map(c => 
      c.id === id ? { ...c, isActive: !c.isActive } : c
    ))
  }

  return (
    <ContextManager
      contexts={contexts}
      onAdd={handleAdd}
      onRemove={handleRemove}
      onToggle={handleToggle}
      maxContexts={20}
    />
  )
}`}</code>
        </pre>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Props</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="p-2 font-semibold">Prop</th>
                <th className="p-2 font-semibold">Type</th>
                <th className="p-2 font-semibold">Default</th>
                <th className="p-2 font-semibold">Description</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b">
                <td className="p-2 font-mono text-sm">contexts</td>
                <td className="p-2 font-mono text-sm">Context[]</td>
                <td className="p-2">-</td>
                <td className="p-2">Array of context items</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-mono text-sm">onAdd</td>
                <td className="p-2 font-mono text-sm">(contexts) =&gt; void</td>
                <td className="p-2">-</td>
                <td className="p-2">Callback when contexts added</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-mono text-sm">onRemove</td>
                <td className="p-2 font-mono text-sm">(id) =&gt; void</td>
                <td className="p-2">-</td>
                <td className="p-2">Callback when context removed</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-mono text-sm">onToggle</td>
                <td className="p-2 font-mono text-sm">(id) =&gt; void</td>
                <td className="p-2">-</td>
                <td className="p-2">Callback when context toggled</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-mono text-sm">onPreview</td>
                <td className="p-2 font-mono text-sm">(context) =&gt; void</td>
                <td className="p-2">-</td>
                <td className="p-2">Callback for context preview</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-mono text-sm">maxContexts</td>
                <td className="p-2 font-mono text-sm">number</td>
                <td className="p-2">20</td>
                <td className="p-2">Maximum allowed contexts</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-mono text-sm">allowedTypes</td>
                <td className="p-2 font-mono text-sm">ContextType[]</td>
                <td className="p-2">all types</td>
                <td className="p-2">Allowed context types</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-mono text-sm">className</td>
                <td className="p-2 font-mono text-sm">string</td>
                <td className="p-2">-</td>
                <td className="p-2">Additional CSS classes</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Context Types</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li><strong className="text-foreground">document</strong> - PDF, Word, text files</li>
          <li><strong className="text-foreground">image</strong> - JPG, PNG, GIF images</li>
          <li><strong className="text-foreground">video</strong> - MP4, MOV videos</li>
          <li><strong className="text-foreground">audio</strong> - MP3, WAV audio files</li>
          <li><strong className="text-foreground">link</strong> - External URLs</li>
          <li><strong className="text-foreground">text</strong> - Plain text snippets</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Examples</h2>
        
        <h3 className="text-2xl font-semibold mb-3">With Type Restrictions</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-6">
          <code>{`<ContextManager
  contexts={contexts}
  onAdd={handleAdd}
  onRemove={handleRemove}
  onToggle={handleToggle}
  allowedTypes={['document', 'image']}
  maxContexts={10}
/>`}</code>
        </pre>

        <h3 className="text-2xl font-semibold mb-3">With Preview Handler</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
          <code>{`<ContextManager
  contexts={contexts}
  onAdd={handleAdd}
  onRemove={handleRemove}
  onToggle={handleToggle}
  onPreview={(context) => {
    openPreviewModal(context)
  }}
/>`}</code>
        </pre>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Best Practices</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Set reasonable maxContexts limits (10-30 items)</li>
          <li>Persist contexts to local storage or database</li>
          <li>Extract text content for searchability</li>
          <li>Show loading states during file processing</li>
          <li>Provide clear feedback on upload success/failure</li>
          <li>Allow users to reorder contexts by drag-and-drop</li>
        </ul>
      </section>

      <section>
        <h2 className="text-3xl font-semibold mb-4">Related Components</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li><a href="/reference/components/context-card" className="text-primary hover:underline">Context Card</a> - Individual context display</li>
          <li><a href="/reference/components/file-upload" className="text-primary hover:underline">File Upload</a> - Standalone file upload</li>
          <li><a href="/reference/components/context-visualizer" className="text-primary hover:underline">Context Visualizer</a> - Visual context display</li>
        </ul>
      </section>
    </div>
  )
}
