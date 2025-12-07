import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ApiTable } from '@/components/Demo/ApiTable';
import { CodePlayground } from '@/components/Playground/CodePlayground';
export const dynamic = 'force-dynamic';
export const metadata = {
    title: 'Multi-Modal Preview - Clarity Chat Components',
    description: 'Preview multiple file types - images, videos, audio, PDFs - in a unified interface.',
};
export default function MultiModalPreviewPage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "Component" }), _jsx("h1", { children: "Multi-Modal Preview" }), _jsx("p", { className: "docs-lead", children: "Show previews of different file types - images, videos, audio, PDFs - all in one consistent interface. Like a universal file viewer." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Overview" }), _jsx("p", { children: "When users upload files or AI generates images/audio, this component shows nice previews. It handles all the different file types for you." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Basic Usage" }), _jsx(CodePlayground, { initialCode: `function FilePreviews() {
  const attachments = [
    {
      id: '1',
      type: 'image',
      title: 'Screenshot.png',
      thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200',
      sizeLabel: '2.4 MB',
      status: 'ready'
    },
    {
      id: '2',
      type: 'video',
      title: 'Tutorial.mp4',
      durationMs: 120000,
      sizeLabel: '15 MB',
      status: 'ready'
    },
    {
      id: '3',
      type: 'audio',
      title: 'Recording.mp3',
      durationMs: 180000,
      sizeLabel: '5.2 MB',
      status: 'processing'
    }
  ]

  return (
    <MultiModalPreview
      attachments={attachments}
      onOpen={(a) => console.log('Open:', a.title)}
    />
  )
}

render(<FilePreviews />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Props" }), _jsx(ApiTable, { title: "MultiModalPreview Props", data: multiModalProps })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Best Practices" }), _jsxs("ul", { children: [_jsx("li", { children: "Show thumbnails for images and videos" }), _jsx("li", { children: "Display duration for audio/video" }), _jsx("li", { children: "Show file size to set expectations" }), _jsx("li", { children: "Provide retry for failed uploads" }), _jsx("li", { children: "Allow removal of attachments" })] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Related" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("a", { href: "/reference/components/file-upload", className: "docs-card", children: [_jsx("h3", { children: "File Upload" }), _jsx("p", { children: "Upload files" })] }), _jsxs("a", { href: "/reference/components/context-card", className: "docs-card", children: [_jsx("h3", { children: "Context Card" }), _jsx("p", { children: "RAG context display" })] })] })] })] }));
}
const multiModalProps = [
    {
        name: 'attachments',
        type: 'AttachmentPreview[]',
        required: true,
        description: 'Array of file attachments to preview'
    },
    {
        name: 'onOpen',
        type: '(attachment: AttachmentPreview) => void',
        required: false,
        description: 'Callback when user opens/clicks an attachment'
    },
    {
        name: 'onRetry',
        type: '(attachment: AttachmentPreview) => void',
        required: false,
        description: 'Callback to retry failed uploads'
    },
    {
        name: 'onRemove',
        type: '(attachment: AttachmentPreview) => void',
        required: false,
        description: 'Callback to remove an attachment'
    },
    {
        name: 'className',
        type: 'string',
        required: false,
        description: 'Additional CSS classes'
    }
];
//# sourceMappingURL=page.js.map