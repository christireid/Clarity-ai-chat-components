import { Metadata } from 'next'
import { CodeBlock } from '@/components/MDX/CodeBlock'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'Advanced Export Workflows - Cookbook - Clarity Chat',
  description:
    'Export chat transcripts with analytics, privacy filtering, and multiple formats.',
}

export default function AdvancedExportCookbook() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Cookbook</span>
        <span className="docs-badge">Enterprise</span>
        <h1>Advanced Export Workflows</h1>
        <p className="docs-lead">
          Generate PDF, Markdown, HTML, JSON, or plain text transcripts with
          metadata, analytics, and privacy safeguards.
        </p>
      </div>

      <section className="docs-section">
        <h2>1. Configure Export Options</h2>
        <CodeBlock
          language="ts"
          code={`import { exportToMarkdown, calculateAnalytics } from '@clarity-chat/react/utils/export-utils'

const exportOptions = {
  format: 'markdown' as const,
  includeTimestamps: true,
  includeMetadata: true,
  includeAnalytics: true,
  privacyMode: true,
  template: 'detailed' as const,
}`}
        />
      </section>

      <section className="docs-section">
        <h2>2. Trigger from UI</h2>
        <CodeBlock
          language="tsx"
          code={`import { ExportDialog } from '@clarity-chat/react/internal'

<ExportDialog
  open={isExportOpen}
  onOpenChange={setIsExportOpen}
  messages={conversation.messages}
  onExport={async (options) => {
    const markdown = exportToMarkdown(conversation.messages, options)
    downloadFile(markdown, options.filename ?? 'conversation.md')
  }}
/>`}
        />
      </section>

      <section className="docs-section">
        <h2>3. Generate HTML + PDF</h2>
        <CodeBlock
          language="ts"
          code={`import { exportToHTML } from '@clarity-chat/react/utils/export-utils'
import { renderToPDF } from './lib/pdf'

const html = exportToHTML(messages, {
  format: 'html',
  includeTimestamps: true,
  includeAnalytics: true,
  customCss: fs.readFileSync('./templates/export.css', 'utf-8'),
})

const pdfBuffer = await renderToPDF(html)
fs.writeFileSync('conversation.pdf', pdfBuffer)`}
        />
      </section>

      <section className="docs-section">
        <h2>4. Batch Export</h2>
        <CodeBlock
          language="ts"
          code={`import { BatchExportDialog } from '@clarity-chat/react/internal'

<BatchExportDialog
  open={isBatchOpen}
  onOpenChange={setIsBatchOpen}
  conversations={selectedConversations}
  onExport={async (conversation, options) => {
    const json = exportToJSON(conversation.messages, options)
    await storage.put(\`\${conversation.id}.json\`, json)
  }}
/>`}
        />
      </section>

      <section className="docs-section">
        <h2>Privacy Tips</h2>
        <Callout type="warning">
          <ul>
            <li>
              Enable <code>privacyMode</code> to redact PII automatically.
            </li>
            <li>
              Supply a custom <code>messageFilter</code> to exclude system
              messages or sensitive metadata.
            </li>
            <li>
              Log every export event with user id, branch id, and format for
              auditing.
            </li>
          </ul>
        </Callout>
      </section>
    </div>
  )
}
