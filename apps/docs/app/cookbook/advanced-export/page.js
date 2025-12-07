import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CodeBlock } from '@/components/MDX/CodeBlock';
import { Callout } from '@/components/MDX/Callout';
export const dynamic = 'force-dynamic';
export const metadata = {
    title: 'Advanced Export Workflows - Cookbook - Clarity Chat',
    description: 'Export chat transcripts with analytics, privacy filtering, and multiple formats.',
};
export default function AdvancedExportCookbook() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "Cookbook" }), _jsx("span", { className: "docs-badge", children: "Enterprise" }), _jsx("h1", { children: "Advanced Export Workflows" }), _jsx("p", { className: "docs-lead", children: "Generate PDF, Markdown, HTML, JSON, or plain text transcripts with metadata, analytics, and privacy safeguards." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "1. Configure Export Options" }), _jsx(CodeBlock, { language: "ts", code: `import { exportToMarkdown, calculateAnalytics } from '@clarity-chat/react/utils/export-utils'

const exportOptions = {
  format: 'markdown' as const,
  includeTimestamps: true,
  includeMetadata: true,
  includeAnalytics: true,
  privacyMode: true,
  template: 'detailed' as const,
}` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "2. Trigger from UI" }), _jsx(CodeBlock, { language: "tsx", code: `import { ExportDialog } from '@clarity-chat/react'

<ExportDialog
  open={isExportOpen}
  onOpenChange={setIsExportOpen}
  messages={conversation.messages}
  onExport={async (options) => {
    const markdown = exportToMarkdown(conversation.messages, options)
    downloadFile(markdown, options.filename ?? 'conversation.md')
  }}
/>` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "3. Generate HTML + PDF" }), _jsx(CodeBlock, { language: "ts", code: `import { exportToHTML } from '@clarity-chat/react/utils/export-utils'
import { renderToPDF } from './lib/pdf'

const html = exportToHTML(messages, {
  format: 'html',
  includeTimestamps: true,
  includeAnalytics: true,
  customCss: fs.readFileSync('./templates/export.css', 'utf-8'),
})

const pdfBuffer = await renderToPDF(html)
fs.writeFileSync('conversation.pdf', pdfBuffer)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "4. Batch Export" }), _jsx(CodeBlock, { language: "ts", code: `import { BatchExportDialog } from '@clarity-chat/react'

<BatchExportDialog
  open={isBatchOpen}
  onOpenChange={setIsBatchOpen}
  conversations={selectedConversations}
  onExport={async (conversation, options) => {
    const json = exportToJSON(conversation.messages, options)
    await storage.put(\`\${conversation.id}.json\`, json)
  }}
/>` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Privacy Tips" }), _jsx(Callout, { type: "warning", children: _jsxs("ul", { children: [_jsxs("li", { children: ["Enable ", _jsx("code", { children: "privacyMode" }), " to redact PII automatically."] }), _jsxs("li", { children: ["Supply a custom ", _jsx("code", { children: "messageFilter" }), " to exclude system messages or sensitive metadata."] }), _jsx("li", { children: "Log every export event with user id, branch id, and format for auditing." })] }) })] })] }));
}
//# sourceMappingURL=page.js.map