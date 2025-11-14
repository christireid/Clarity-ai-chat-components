import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Link Preview | Clarity Chat',
  description: 'Rich link preview cards with metadata fetching and error handling.'
}

export default function LinkPreviewPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Link Preview</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Display rich link previews with title, description, image, and site metadata.
      </p>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Usage</h2>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
          <code>{`import { LinkPreview } from '@clarity-chat/react'

const metadata = {
  url: 'https://example.com',
  title: 'Example Site',
  description: 'This is an example',
  image: 'https://example.com/og.jpg',
  siteName: 'Example'
}

<LinkPreview
  metadata={metadata}
  onClick={() => window.open(metadata.url)}
  onRemove={() => removeLink()}
/>`}</code>
        </pre>
      </section>

      <section>
        <h2 className="text-3xl font-semibold mb-4">Features</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Open Graph metadata display</li>
          <li>Loading state with skeleton</li>
          <li>Image error handling</li>
          <li>Domain extraction</li>
          <li>Click handler support</li>
          <li>Remove button</li>
        </ul>
      </section>
    </div>
  )
}
