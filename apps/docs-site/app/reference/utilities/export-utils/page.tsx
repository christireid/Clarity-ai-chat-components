import { Metadata } from 'next'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { Pagination } from '@/components/Navigation/Pagination'
import { CodeBlock } from '@/components/MDX/CodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { ApiTable } from '@/components/Demo/ApiTable'

export const metadata: Metadata = {
  title: 'export-utils',
  description: 'Advanced conversation export utilities with analytics, privacy controls, and templating.',
}

const functions = [
  { name: 'calculateAnalytics(messages)', description: 'Compute totals, token usage, cost, and duration for a message set.' },
  { name: 'sanitizeMessages(messages, options)', description: 'Apply privacy mode, custom filters, and role exclusions before export.' },
  { name: 'redactSensitiveInfo(text)', description: 'Redact SSNs, credit cards, emails, and phone numbers using predefined patterns.' },
  { name: 'exportToJSON(messages, options)', description: 'Produce structured JSON with metadata and optional analytics block.' },
  { name: 'exportToMarkdown(messages, options)', description: 'Generate Markdown transcript with message sections and analytics summary.' },
  { name: 'exportToHTML(messages, options)', description: 'Render printable HTML with custom CSS, analytics, and message styling.' },
  { name: 'exportToText(messages, options)', description: 'Plain text export with role prefixes and optional timestamps.' },
  { name: 'exportToPDF(messages, options)', description: 'Server-side PDF export (requires PDF renderer implementation hook).' },
]

const options = [
  { name: 'format', type: `'json' | 'markdown' | 'html' | 'pdf' | 'txt'`, required: true, description: 'Target export format.' },
  { name: 'template', type: `'clean' | 'detailed' | 'shareable' | 'analytics'`, description: 'Optional presentation preset.' },
  { name: 'includeTimestamps', type: 'boolean', description: 'Include ISO timestamps or localized strings.' },
  { name: 'includeMetadata', type: 'boolean', description: 'Include token counts, cost, and metadata fields.' },
  { name: 'includeSystemMessages', type: 'boolean', description: 'Export system messages (default false).' },
  { name: 'messageFilter', type: '(message: Message) => boolean', description: 'Custom filter applied before export.' },
  { name: 'filename', type: 'string', description: 'Preferred filename without extension.' },
  { name: 'includeAnalytics', type: 'boolean', description: 'Append analytics summary block.' },
  { name: 'privacyMode', type: 'boolean', description: 'Redact sensitive info via `redactSensitiveInfo`.' },
  { name: 'customCss', type: 'string', description: 'Custom CSS for HTML/PDF export templates.' },
]

export default function ExportUtilsPage() {
  return (
    <>
      <Breadcrumbs />

      <h1>export-utils</h1>
      <p className="lead">
        Multi-format export helpers for conversations, including privacy controls, analytics, and customizable
        templates. Integrates with <code>ExportDialog</code>, <code>BatchExportDialog</code>, and CLI workflows.
      </p>

      <Callout type="warning">
        <p>
          PDF export relies on your environment—pass rendered HTML to a service such as Playwright, Puppeteer, or
          Cloudflare Workers HTML-to-PDF to generate the final file.
        </p>
      </Callout>

      <h2 id="usage">Usage</h2>
      <CodeBlock
        language="ts"
        code={`import {
  exportToJSON,
  exportToMarkdown,
  exportToHTML,
  calculateAnalytics,
} from '@clarity-chat/react/utils/export-utils'

const options = {
  format: 'markdown' as const,
  includeTimestamps: true,
  includeMetadata: true,
  includeAnalytics: true,
  privacyMode: false,
}

const markdown = exportToMarkdown(messages, options)
const analytics = calculateAnalytics(messages)`}
      />

      <h2 id="privacy">Privacy Mode</h2>
      <CodeBlock
        language="ts"
        code={`const sanitized = sanitizeMessages(messages, { privacyMode: true })
console.log(sanitized[0].content) // Emails/phones redacted`}
      />

      <h2 id="custom-template">Custom Templates</h2>
      <CodeBlock
        language="ts"
        code={`const html = exportToHTML(messages, {
  format: 'html',
  includeTimestamps: true,
  customCss: \`
    body { font-family: Inter, sans-serif; background: #f5f7fb; }
    .message.assistant { background: #eef2ff; }
  \`,
})`}
      />

      <h2 id="api">API</h2>
      <ApiTable data={functions.map((fn) => ({ name: fn.name, type: '', description: fn.description }))} />

      <h2 id="options">ExportOptions</h2>
      <ApiTable data={options} />

      <Pagination
        prev={{ href: '/reference/utilities/theme-builder', label: 'ThemeBuilder' }}
        next={{ href: '/reference/utilities/token-counter-util', label: 'TokenCounter' }}
      />
    </>
  )
}
