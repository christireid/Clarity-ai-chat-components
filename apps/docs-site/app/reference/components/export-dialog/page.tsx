import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Export Dialog | Clarity Chat',
  description: 'Export conversation data in multiple formats with customizable options.'
}

export default function ExportDialogPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Export Dialog</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Feature-rich export dialog supporting PDF, DOCX, Markdown, JSON, and HTML with customizable export options.
      </p>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Features</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>5 export formats (PDF, DOCX, Markdown, JSON, HTML)</li>
          <li>Animated format selection</li>
          <li>Customizable export options (metadata, images, attachments)</li>
          <li>Date range filtering for chats</li>
          <li>Progress bar during export</li>
          <li>File size estimation</li>
          <li>Format-specific tips and descriptions</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Usage</h2>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
          <code>{`import { ExportDialog } from '@clarity-chat/react'

const [exportOpen, setExportOpen] = useState(false)

const handleExport = async (options: ExportOptions) => {
  const data = await generateExport(options)
  downloadFile(data, options.format)
}

<ExportDialog
  open={exportOpen}
  onOpenChange={setExportOpen}
  onExport={handleExport}
  resourceType="chat"
  resourceName="Customer Support Chat"
/>`}</code>
        </pre>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Export Formats</h2>
        <div className="space-y-4 text-muted-foreground">
          <div><strong>📕 PDF:</strong> Best for printing and sharing</div>
          <div><strong>📄 DOCX:</strong> Editable in Microsoft Word</div>
          <div><strong>📝 Markdown:</strong> Plain text with formatting</div>
          <div><strong>📊 JSON:</strong> Raw data for processing</div>
          <div><strong>🌐 HTML:</strong> Web-ready format</div>
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-semibold mb-4">Export Options</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Include/exclude metadata (timestamps, authors)</li>
          <li>Include/exclude embedded images</li>
          <li>Include/exclude separate attachment files</li>
          <li>Date range filtering (for chat exports)</li>
        </ul>
      </section>
    </div>
  )
}
