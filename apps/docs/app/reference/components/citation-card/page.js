import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const metadata = {
    title: 'Citation Card | Clarity Chat',
    description: 'Display RAG sources and citations with expandable content and confidence scores.'
};
export default function CitationCardPage() {
    return (_jsxs("div", { className: "max-w-5xl mx-auto px-4 py-8", children: [_jsx("h1", { className: "text-4xl font-bold mb-4", children: "Citation Card" }), _jsx("p", { className: "text-xl text-muted-foreground mb-8", children: "Display RAG (Retrieval-Augmented Generation) sources and citations with expandable previews, confidence scores, and metadata." }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Features" }), _jsxs("ul", { className: "list-disc list-inside space-y-2 text-muted-foreground", children: [_jsx("li", { children: "Expandable text preview with truncation" }), _jsx("li", { children: "Confidence score badges with color coding" }), _jsx("li", { children: "Source link with external navigation" }), _jsx("li", { children: "Metadata display (author, date, page, section)" }), _jsx("li", { children: "Smooth expand/collapse animations" }), _jsx("li", { children: "Hover state with border transition" }), _jsx("li", { children: "Click handlers for custom actions" })] })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Usage" }), _jsx("pre", { className: "bg-muted p-4 rounded-lg overflow-x-auto", children: _jsx("code", { children: `import { CitationCard } from '@clarity-chat/react'

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
/>` }) })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Props" }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-left border-collapse", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b", children: [_jsx("th", { className: "p-2 font-semibold", children: "Prop" }), _jsx("th", { className: "p-2 font-semibold", children: "Type" }), _jsx("th", { className: "p-2 font-semibold", children: "Default" }), _jsx("th", { className: "p-2 font-semibold", children: "Description" })] }) }), _jsxs("tbody", { className: "text-muted-foreground", children: [_jsxs("tr", { className: "border-b", children: [_jsx("td", { className: "p-2 font-mono text-sm", children: "citation" }), _jsx("td", { className: "p-2 font-mono text-sm", children: "Citation" }), _jsx("td", { className: "p-2", children: "-" }), _jsx("td", { className: "p-2", children: "Citation data object" })] }), _jsxs("tr", { className: "border-b", children: [_jsx("td", { className: "p-2 font-mono text-sm", children: "defaultExpanded" }), _jsx("td", { className: "p-2 font-mono text-sm", children: "boolean" }), _jsx("td", { className: "p-2", children: "false" }), _jsx("td", { className: "p-2", children: "Show expanded view initially" })] }), _jsxs("tr", { className: "border-b", children: [_jsx("td", { className: "p-2 font-mono text-sm", children: "previewLength" }), _jsx("td", { className: "p-2 font-mono text-sm", children: "number" }), _jsx("td", { className: "p-2", children: "150" }), _jsx("td", { className: "p-2", children: "Characters before truncation" })] }), _jsxs("tr", { className: "border-b", children: [_jsx("td", { className: "p-2 font-mono text-sm", children: "showConfidence" }), _jsx("td", { className: "p-2 font-mono text-sm", children: "boolean" }), _jsx("td", { className: "p-2", children: "true" }), _jsx("td", { className: "p-2", children: "Display confidence badge" })] }), _jsxs("tr", { className: "border-b", children: [_jsx("td", { className: "p-2 font-mono text-sm", children: "onClick" }), _jsx("td", { className: "p-2 font-mono text-sm", children: "(citation) => void" }), _jsx("td", { className: "p-2", children: "-" }), _jsx("td", { className: "p-2", children: "Callback on card click" })] }), _jsxs("tr", { className: "border-b", children: [_jsx("td", { className: "p-2 font-mono text-sm", children: "onSourceClick" }), _jsx("td", { className: "p-2 font-mono text-sm", children: "(url) => void" }), _jsx("td", { className: "p-2", children: "-" }), _jsx("td", { className: "p-2", children: "Callback on source link click" })] }), _jsxs("tr", { className: "border-b", children: [_jsx("td", { className: "p-2 font-mono text-sm", children: "className" }), _jsx("td", { className: "p-2 font-mono text-sm", children: "string" }), _jsx("td", { className: "p-2", children: "-" }), _jsx("td", { className: "p-2", children: "Additional CSS classes" })] })] })] }) })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Citation Interface" }), _jsx("pre", { className: "bg-muted p-4 rounded-lg overflow-x-auto", children: _jsx("code", { children: `interface Citation {
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
}` }) })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Confidence Levels" }), _jsxs("div", { className: "space-y-4 text-muted-foreground", children: [_jsxs("div", { children: [_jsx("strong", { className: "text-foreground", children: "High (\u22650.9):" }), " Green badge - Very reliable source"] }), _jsxs("div", { children: [_jsx("strong", { className: "text-foreground", children: "Medium (0.7-0.89):" }), " Blue badge - Reliable source"] }), _jsxs("div", { children: [_jsx("strong", { className: "text-foreground", children: "Low (0.5-0.69):" }), " Yellow badge - Use with caution"] }), _jsxs("div", { children: [_jsx("strong", { className: "text-foreground", children: "Very Low (<0.5):" }), " Red badge - May be irrelevant"] })] })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Examples" }), _jsx("h3", { className: "text-2xl font-semibold mb-3", children: "With Custom Click Handler" }), _jsx("pre", { className: "bg-muted p-4 rounded-lg overflow-x-auto mb-6", children: _jsx("code", { children: `<CitationCard
  citation={citation}
  onClick={(c) => {
    console.log('Citation clicked:', c)
    openDetailModal(c)
  }}
/>` }) }), _jsx("h3", { className: "text-2xl font-semibold mb-3", children: "Without Confidence Score" }), _jsx("pre", { className: "bg-muted p-4 rounded-lg overflow-x-auto mb-6", children: _jsx("code", { children: `<CitationCard
  citation={citation}
  showConfidence={false}
/>` }) }), _jsx("h3", { className: "text-2xl font-semibold mb-3", children: "Always Expanded" }), _jsx("pre", { className: "bg-muted p-4 rounded-lg overflow-x-auto", children: _jsx("code", { children: `<CitationCard
  citation={citation}
  defaultExpanded={true}
  previewLength={500}
/>` }) })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Best Practices" }), _jsxs("ul", { className: "list-disc list-inside space-y-2 text-muted-foreground", children: [_jsx("li", { children: "Set previewLength based on available space (150-300 chars)" }), _jsx("li", { children: "Always provide source names that users will recognize" }), _jsx("li", { children: "Include confidence scores when using RAG/semantic search" }), _jsx("li", { children: "Add metadata to help users evaluate source credibility" }), _jsx("li", { children: "Handle source clicks with proper security (noopener,noreferrer)" }), _jsx("li", { children: "Group related citations together visually" })] })] }), _jsxs("section", { children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Related Components" }), _jsxs("ul", { className: "list-disc list-inside space-y-2 text-muted-foreground", children: [_jsxs("li", { children: [_jsx("a", { href: "/reference/components/message", className: "text-primary hover:underline", children: "Message" }), " - Display messages with citations"] }), _jsxs("li", { children: [_jsx("a", { href: "/reference/components/link-preview", className: "text-primary hover:underline", children: "Link Preview" }), " - Preview links in messages"] }), _jsxs("li", { children: [_jsx("a", { href: "/reference/components/context-card", className: "text-primary hover:underline", children: "Context Card" }), " - Display context sources"] })] })] })] }));
}
//# sourceMappingURL=page.js.map