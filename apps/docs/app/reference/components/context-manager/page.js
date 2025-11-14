import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const metadata = {
    title: 'Context Manager | Clarity Chat',
    description: 'Manage conversation context with file uploads, filtering, and activation controls.'
};
export default function ContextManagerPage() {
    return (_jsxs("div", { className: "max-w-5xl mx-auto px-4 py-8", children: [_jsx("h1", { className: "text-4xl font-bold mb-4", children: "Context Manager" }), _jsx("p", { className: "text-xl text-muted-foreground mb-8", children: "Comprehensive context management component for handling files, documents, and other conversation context with filtering and activation controls." }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Features" }), _jsxs("ul", { className: "list-disc list-inside space-y-2 text-muted-foreground", children: [_jsx("li", { children: "File upload with drag-and-drop support" }), _jsx("li", { children: "Context filtering by type (document, image, video, link, text)" }), _jsx("li", { children: "Active/inactive context toggle" }), _jsx("li", { children: "Context preview functionality" }), _jsx("li", { children: "Maximum context limits" }), _jsx("li", { children: "Type statistics and counts" }), _jsx("li", { children: "Bulk activation/deactivation" }), _jsx("li", { children: "Context cards with metadata display" })] })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Usage" }), _jsx("pre", { className: "bg-muted p-4 rounded-lg overflow-x-auto", children: _jsx("code", { children: `import { ContextManager } from '@clarity-chat/react'
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
}` }) })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Props" }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-left border-collapse", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b", children: [_jsx("th", { className: "p-2 font-semibold", children: "Prop" }), _jsx("th", { className: "p-2 font-semibold", children: "Type" }), _jsx("th", { className: "p-2 font-semibold", children: "Default" }), _jsx("th", { className: "p-2 font-semibold", children: "Description" })] }) }), _jsxs("tbody", { className: "text-muted-foreground", children: [_jsxs("tr", { className: "border-b", children: [_jsx("td", { className: "p-2 font-mono text-sm", children: "contexts" }), _jsx("td", { className: "p-2 font-mono text-sm", children: "Context[]" }), _jsx("td", { className: "p-2", children: "-" }), _jsx("td", { className: "p-2", children: "Array of context items" })] }), _jsxs("tr", { className: "border-b", children: [_jsx("td", { className: "p-2 font-mono text-sm", children: "onAdd" }), _jsx("td", { className: "p-2 font-mono text-sm", children: "(contexts) => void" }), _jsx("td", { className: "p-2", children: "-" }), _jsx("td", { className: "p-2", children: "Callback when contexts added" })] }), _jsxs("tr", { className: "border-b", children: [_jsx("td", { className: "p-2 font-mono text-sm", children: "onRemove" }), _jsx("td", { className: "p-2 font-mono text-sm", children: "(id) => void" }), _jsx("td", { className: "p-2", children: "-" }), _jsx("td", { className: "p-2", children: "Callback when context removed" })] }), _jsxs("tr", { className: "border-b", children: [_jsx("td", { className: "p-2 font-mono text-sm", children: "onToggle" }), _jsx("td", { className: "p-2 font-mono text-sm", children: "(id) => void" }), _jsx("td", { className: "p-2", children: "-" }), _jsx("td", { className: "p-2", children: "Callback when context toggled" })] }), _jsxs("tr", { className: "border-b", children: [_jsx("td", { className: "p-2 font-mono text-sm", children: "onPreview" }), _jsx("td", { className: "p-2 font-mono text-sm", children: "(context) => void" }), _jsx("td", { className: "p-2", children: "-" }), _jsx("td", { className: "p-2", children: "Callback for context preview" })] }), _jsxs("tr", { className: "border-b", children: [_jsx("td", { className: "p-2 font-mono text-sm", children: "maxContexts" }), _jsx("td", { className: "p-2 font-mono text-sm", children: "number" }), _jsx("td", { className: "p-2", children: "20" }), _jsx("td", { className: "p-2", children: "Maximum allowed contexts" })] }), _jsxs("tr", { className: "border-b", children: [_jsx("td", { className: "p-2 font-mono text-sm", children: "allowedTypes" }), _jsx("td", { className: "p-2 font-mono text-sm", children: "ContextType[]" }), _jsx("td", { className: "p-2", children: "all types" }), _jsx("td", { className: "p-2", children: "Allowed context types" })] }), _jsxs("tr", { className: "border-b", children: [_jsx("td", { className: "p-2 font-mono text-sm", children: "className" }), _jsx("td", { className: "p-2 font-mono text-sm", children: "string" }), _jsx("td", { className: "p-2", children: "-" }), _jsx("td", { className: "p-2", children: "Additional CSS classes" })] })] })] }) })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Context Types" }), _jsxs("ul", { className: "list-disc list-inside space-y-2 text-muted-foreground", children: [_jsxs("li", { children: [_jsx("strong", { className: "text-foreground", children: "document" }), " - PDF, Word, text files"] }), _jsxs("li", { children: [_jsx("strong", { className: "text-foreground", children: "image" }), " - JPG, PNG, GIF images"] }), _jsxs("li", { children: [_jsx("strong", { className: "text-foreground", children: "video" }), " - MP4, MOV videos"] }), _jsxs("li", { children: [_jsx("strong", { className: "text-foreground", children: "audio" }), " - MP3, WAV audio files"] }), _jsxs("li", { children: [_jsx("strong", { className: "text-foreground", children: "link" }), " - External URLs"] }), _jsxs("li", { children: [_jsx("strong", { className: "text-foreground", children: "text" }), " - Plain text snippets"] })] })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Examples" }), _jsx("h3", { className: "text-2xl font-semibold mb-3", children: "With Type Restrictions" }), _jsx("pre", { className: "bg-muted p-4 rounded-lg overflow-x-auto mb-6", children: _jsx("code", { children: `<ContextManager
  contexts={contexts}
  onAdd={handleAdd}
  onRemove={handleRemove}
  onToggle={handleToggle}
  allowedTypes={['document', 'image']}
  maxContexts={10}
/>` }) }), _jsx("h3", { className: "text-2xl font-semibold mb-3", children: "With Preview Handler" }), _jsx("pre", { className: "bg-muted p-4 rounded-lg overflow-x-auto", children: _jsx("code", { children: `<ContextManager
  contexts={contexts}
  onAdd={handleAdd}
  onRemove={handleRemove}
  onToggle={handleToggle}
  onPreview={(context) => {
    openPreviewModal(context)
  }}
/>` }) })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Best Practices" }), _jsxs("ul", { className: "list-disc list-inside space-y-2 text-muted-foreground", children: [_jsx("li", { children: "Set reasonable maxContexts limits (10-30 items)" }), _jsx("li", { children: "Persist contexts to local storage or database" }), _jsx("li", { children: "Extract text content for searchability" }), _jsx("li", { children: "Show loading states during file processing" }), _jsx("li", { children: "Provide clear feedback on upload success/failure" }), _jsx("li", { children: "Allow users to reorder contexts by drag-and-drop" })] })] }), _jsxs("section", { children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Related Components" }), _jsxs("ul", { className: "list-disc list-inside space-y-2 text-muted-foreground", children: [_jsxs("li", { children: [_jsx("a", { href: "/reference/components/context-card", className: "text-primary hover:underline", children: "Context Card" }), " - Individual context display"] }), _jsxs("li", { children: [_jsx("a", { href: "/reference/components/file-upload", className: "text-primary hover:underline", children: "File Upload" }), " - Standalone file upload"] }), _jsxs("li", { children: [_jsx("a", { href: "/reference/components/context-visualizer", className: "text-primary hover:underline", children: "Context Visualizer" }), " - Visual context display"] })] })] })] }));
}
//# sourceMappingURL=page.js.map