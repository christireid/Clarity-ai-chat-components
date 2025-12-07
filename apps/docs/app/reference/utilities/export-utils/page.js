import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs';
import { Pagination } from '@/components/Navigation/Pagination';
import { CodeBlock } from '@/components/MDX/CodeBlock';
import { Callout } from '@/components/MDX/Callout';
import { ApiTable } from '@/components/Demo/ApiTable';
export const metadata = {
    title: 'export-utils',
    description: 'Advanced conversation export utilities with analytics, privacy controls, and templating.',
};
const functions = [
    { name: 'calculateAnalytics(messages)', description: 'Compute totals, token usage, cost, and duration for a message set.' },
    { name: 'sanitizeMessages(messages, options)', description: 'Apply privacy mode, custom filters, and role exclusions before export.' },
    { name: 'redactSensitiveInfo(text)', description: 'Redact SSNs, credit cards, emails, and phone numbers using predefined patterns.' },
    { name: 'exportToJSON(messages, options)', description: 'Produce structured JSON with metadata and optional analytics block.' },
    { name: 'exportToMarkdown(messages, options)', description: 'Generate Markdown transcript with message sections and analytics summary.' },
    { name: 'exportToHTML(messages, options)', description: 'Render printable HTML with custom CSS, analytics, and message styling.' },
    { name: 'exportToText(messages, options)', description: 'Plain text export with role prefixes and optional timestamps.' },
    { name: 'exportToPDF(messages, options)', description: 'Server-side PDF export (requires PDF renderer implementation hook).' },
];
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
];
export default function ExportUtilsPage() {
    return (_jsxs(_Fragment, { children: [_jsx(Breadcrumbs, {}), _jsx("h1", { children: "export-utils" }), _jsxs("p", { className: "lead", children: ["Multi-format export helpers for conversations, including privacy controls, analytics, and customizable templates. Integrates with ", _jsx("code", { children: "ExportDialog" }), ", ", _jsx("code", { children: "BatchExportDialog" }), ", and CLI workflows."] }), _jsx(Callout, { type: "warning", children: _jsx("p", { children: "PDF export relies on your environment\u2014pass rendered HTML to a service such as Playwright, Puppeteer, or Cloudflare Workers HTML-to-PDF to generate the final file." }) }), _jsx("h2", { id: "usage", children: "Usage" }), _jsx(CodeBlock, { language: "ts", code: `import {
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
const analytics = calculateAnalytics(messages)` }), _jsx("h2", { id: "privacy", children: "Privacy Mode" }), _jsx(CodeBlock, { language: "ts", code: `const sanitized = sanitizeMessages(messages, { privacyMode: true })
console.log(sanitized[0].content) // Emails/phones redacted` }), _jsx("h2", { id: "custom-template", children: "Custom Templates" }), _jsx(CodeBlock, { language: "ts", code: `const html = exportToHTML(messages, {
  format: 'html',
  includeTimestamps: true,
  customCss: \`
    body { font-family: Inter, sans-serif; background: #f5f7fb; }
    .message.assistant { background: #eef2ff; }
  \`,
})` }), _jsx("h2", { id: "api", children: "API" }), _jsx(ApiTable, { data: functions.map((fn) => ({ name: fn.name, type: '', description: fn.description })) }), _jsx("h2", { id: "options", children: "ExportOptions" }), _jsx(ApiTable, { data: options }), _jsx(Pagination, { prev: { href: '/reference/utilities/theme-builder', title: 'ThemeBuilder' }, next: { href: '/reference/utilities/token-counter-util', title: 'TokenCounter' } })] }));
}
//# sourceMappingURL=page.js.map