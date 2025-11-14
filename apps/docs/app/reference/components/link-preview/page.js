import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const metadata = {
    title: 'Link Preview | Clarity Chat',
    description: 'Rich link preview cards with metadata fetching and error handling.'
};
export default function LinkPreviewPage() {
    return (_jsxs("div", { className: "max-w-5xl mx-auto px-4 py-8", children: [_jsx("h1", { className: "text-4xl font-bold mb-4", children: "Link Preview" }), _jsx("p", { className: "text-xl text-muted-foreground mb-8", children: "Display rich link previews with title, description, image, and site metadata." }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Usage" }), _jsx("pre", { className: "bg-muted p-4 rounded-lg overflow-x-auto", children: _jsx("code", { children: `import { LinkPreview } from '@clarity-chat/react'

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
/>` }) })] }), _jsxs("section", { children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Features" }), _jsxs("ul", { className: "list-disc list-inside space-y-2 text-muted-foreground", children: [_jsx("li", { children: "Open Graph metadata display" }), _jsx("li", { children: "Loading state with skeleton" }), _jsx("li", { children: "Image error handling" }), _jsx("li", { children: "Domain extraction" }), _jsx("li", { children: "Click handler support" }), _jsx("li", { children: "Remove button" })] })] })] }));
}
//# sourceMappingURL=page.js.map