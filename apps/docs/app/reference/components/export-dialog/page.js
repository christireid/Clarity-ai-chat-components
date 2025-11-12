import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const metadata = {
    title: 'Export Dialog | Clarity Chat',
    description: 'Export conversation data in multiple formats with customizable options.'
};
export default function ExportDialogPage() {
    return (_jsxs("div", { className: "max-w-5xl mx-auto px-4 py-8", children: [_jsx("h1", { className: "text-4xl font-bold mb-4", children: "Export Dialog" }), _jsx("p", { className: "text-xl text-muted-foreground mb-8", children: "Feature-rich export dialog supporting PDF, DOCX, Markdown, JSON, and HTML with customizable export options." }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Features" }), _jsxs("ul", { className: "list-disc list-inside space-y-2 text-muted-foreground", children: [_jsx("li", { children: "5 export formats (PDF, DOCX, Markdown, JSON, HTML)" }), _jsx("li", { children: "Animated format selection" }), _jsx("li", { children: "Customizable export options (metadata, images, attachments)" }), _jsx("li", { children: "Date range filtering for chats" }), _jsx("li", { children: "Progress bar during export" }), _jsx("li", { children: "File size estimation" }), _jsx("li", { children: "Format-specific tips and descriptions" })] })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Usage" }), _jsx("pre", { className: "bg-muted p-4 rounded-lg overflow-x-auto", children: _jsx("code", { children: `import { ExportDialog } from '@clarity-chat/react'

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
/>` }) })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Export Formats" }), _jsxs("div", { className: "space-y-4 text-muted-foreground", children: [_jsxs("div", { children: [_jsx("strong", { children: "\uD83D\uDCD5 PDF:" }), " Best for printing and sharing"] }), _jsxs("div", { children: [_jsx("strong", { children: "\uD83D\uDCC4 DOCX:" }), " Editable in Microsoft Word"] }), _jsxs("div", { children: [_jsx("strong", { children: "\uD83D\uDCDD Markdown:" }), " Plain text with formatting"] }), _jsxs("div", { children: [_jsx("strong", { children: "\uD83D\uDCCA JSON:" }), " Raw data for processing"] }), _jsxs("div", { children: [_jsx("strong", { children: "\uD83C\uDF10 HTML:" }), " Web-ready format"] })] })] }), _jsxs("section", { children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Export Options" }), _jsxs("ul", { className: "list-disc list-inside space-y-2 text-muted-foreground", children: [_jsx("li", { children: "Include/exclude metadata (timestamps, authors)" }), _jsx("li", { children: "Include/exclude embedded images" }), _jsx("li", { children: "Include/exclude separate attachment files" }), _jsx("li", { children: "Date range filtering (for chat exports)" })] })] })] }));
}
//# sourceMappingURL=page.js.map