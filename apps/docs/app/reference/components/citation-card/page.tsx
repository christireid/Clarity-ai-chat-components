import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Citation Card | Clarity Chat',
  description: 'Display RAG sources and citations with expandable content and confidence scores.'
}

export default function CitationCardPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Citation Card</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Display RAG (Retrieval-Augmented Generation) sources and citations with expandable previews, confidence scores, and metadata.
      </p>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Features</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Expandable text preview with truncation</li>
          <li>Confidence score badges with color coding</li>
          <li>Source link with external navigation</li>
          <li>Metadata display (author, date, page, section)</li>
          <li>Smooth expand/collapse animations</li>
          <li>Hover state with border transition</li>
          <li>Click handlers for custom actions</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Usage</h2>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
          <code>{`import { CitationCard } from '@clarity-chat/react'

const citation = {
  id: '1',
  source: 'Documentation.pdf',
  chunkText: 'The quick brown fox jumps over the lazy dog...',
  confidence: 0.92,
  url: 'https://example.com/docs',
  metadata: {
    author: 'John Doe',
    date: '2024-01-15',
    page: 42,
    section: 'Chapter 3'
  }
}

<CitationCard
  citation={citation}
  showConfidence={true}
  onSourceClick={(url) => window.open(url)}
/>`}</code>
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
                <td className="p-2 font-mono text-sm">citation</td>
                <td className="p-2 font-mono text-sm">Citation</td>
                <td className="p-2">-</td>
                <td className="p-2">Citation data object</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-mono text-sm">defaultExpanded</td>
                <td className="p-2 font-mono text-sm">boolean</td>
                <td className="p-2">false</td>
                <td className="p-2">Show expanded view initially</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-mono text-sm">previewLength</td>
                <td className="p-2 font-mono text-sm">number</td>
                <td className="p-2">150</td>
                <td className="p-2">Characters before truncation</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-mono text-sm">showConfidence</td>
                <td className="p-2 font-mono text-sm">boolean</td>
                <td className="p-2">true</td>
                <td className="p-2">Display confidence badge</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-mono text-sm">onClick</td>
                <td className="p-2 font-mono text-sm">(citation) =&gt; void</td>
                <td className="p-2">-</td>
                <td className="p-2">Callback on card click</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-mono text-sm">onSourceClick</td>
                <td className="p-2 font-mono text-sm">(url) =&gt; void</td>
                <td className="p-2">-</td>
                <td className="p-2">Callback on source link click</td>
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
        <h2 className="text-3xl font-semibold mb-4">Citation Interface</h2>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
          <code>{`interface Citation {
  id: string
  source: string          // Source document name
  chunkText: string       // Content excerpt
  confidence?: number     // 0-1 confidence score
  url?: string           // External link
  metadata?: {
    author?: string
    date?: string
    page?: number
    section?: string
    [key: string]: any   // Custom metadata
  }
}`}</code>
        </pre>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Confidence Levels</h2>
        <div className="space-y-4 text-muted-foreground">
          <div>
            <strong className="text-foreground">High (≥0.9):</strong> Green badge - Very reliable source
          </div>
          <div>
            <strong className="text-foreground">Medium (0.7-0.89):</strong> Blue badge - Reliable source
          </div>
          <div>
            <strong className="text-foreground">Low (0.5-0.69):</strong> Yellow badge - Use with caution
          </div>
          <div>
            <strong className="text-foreground">Very Low (&lt;0.5):</strong> Red badge - May be irrelevant
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Examples</h2>
        
        <h3 className="text-2xl font-semibold mb-3">With Custom Click Handler</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-6">
          <code>{`<CitationCard
  citation={citation}
  onClick={(c) => {
    console.log('Citation clicked:', c)
    openDetailModal(c)
  }}
/>`}</code>
        </pre>

        <h3 className="text-2xl font-semibold mb-3">Without Confidence Score</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-6">
          <code>{`<CitationCard
  citation={citation}
  showConfidence={false}
/>`}</code>
        </pre>

        <h3 className="text-2xl font-semibold mb-3">Always Expanded</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
          <code>{`<CitationCard
  citation={citation}
  defaultExpanded={true}
  previewLength={500}
/>`}</code>
        </pre>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Best Practices</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Set previewLength based on available space (150-300 chars)</li>
          <li>Always provide source names that users will recognize</li>
          <li>Include confidence scores when using RAG/semantic search</li>
          <li>Add metadata to help users evaluate source credibility</li>
          <li>Handle source clicks with proper security (noopener,noreferrer)</li>
          <li>Group related citations together visually</li>
        </ul>
      </section>

      <section>
        <h2 className="text-3xl font-semibold mb-4">Related Components</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li><a href="/reference/components/message" className="text-primary hover:underline">Message</a> - Display messages with citations</li>
          <li><a href="/reference/components/link-preview" className="text-primary hover:underline">Link Preview</a> - Preview links in messages</li>
          <li><a href="/reference/components/context-card" className="text-primary hover:underline">Context Card</a> - Display context sources</li>
        </ul>
      </section>
    </div>
  )
}
