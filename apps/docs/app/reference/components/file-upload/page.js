import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const metadata = {
    title: 'File Upload | Clarity Chat',
    description: 'File upload component with drag-and-drop, validation, and progress tracking.'
};
export default function FileUploadPage() {
    return (_jsxs("div", { className: "max-w-5xl mx-auto px-4 py-8", children: [_jsx("h1", { className: "text-4xl font-bold mb-4", children: "File Upload" }), _jsx("p", { className: "text-xl text-muted-foreground mb-8", children: "Feature-rich file upload component with drag-and-drop, file validation, size limits, and upload progress tracking." }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Features" }), _jsxs("ul", { className: "list-disc list-inside space-y-2 text-muted-foreground", children: [_jsx("li", { children: "Drag-and-drop file upload" }), _jsx("li", { children: "Click to browse file selection" }), _jsx("li", { children: "File type validation" }), _jsx("li", { children: "File size validation" }), _jsx("li", { children: "Multiple file support" }), _jsx("li", { children: "Upload progress tracking" }), _jsx("li", { children: "Error handling and display" }), _jsx("li", { children: "File preview before upload" }), _jsx("li", { children: "Remove files before upload" })] })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Usage" }), _jsx("pre", { className: "bg-muted p-4 rounded-lg overflow-x-auto", children: _jsx("code", { children: `import { FileUpload } from '@clarity-chat/react'
import type { MessageAttachment } from '@clarity-chat/types'

function MyComponent() {
  const handleUpload = async (files: File[]): Promise<MessageAttachment[]> => {
    // Upload files to your server
    const uploadPromises = files.map(async (file) => {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      
      const data = await response.json()
      
      return {
        id: data.id,
        filename: file.name,
        url: data.url,
        size: file.size,
        mimeType: file.type
      }
    })
    
    return Promise.all(uploadPromises)
  }

  return (
    <FileUpload
      onUpload={handleUpload}
      maxFiles={5}
      maxFileSize={10 * 1024 * 1024}
      acceptedFileTypes={['image/*', 'application/pdf']}
    />
  )
}` }) })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Props" }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-left border-collapse", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b", children: [_jsx("th", { className: "p-2 font-semibold", children: "Prop" }), _jsx("th", { className: "p-2 font-semibold", children: "Type" }), _jsx("th", { className: "p-2 font-semibold", children: "Default" }), _jsx("th", { className: "p-2 font-semibold", children: "Description" })] }) }), _jsxs("tbody", { className: "text-muted-foreground", children: [_jsxs("tr", { className: "border-b", children: [_jsx("td", { className: "p-2 font-mono text-sm", children: "onUpload" }), _jsx("td", { className: "p-2 font-mono text-sm", children: "(files) => Promise<Attachment[]>" }), _jsx("td", { className: "p-2", children: "-" }), _jsx("td", { className: "p-2", children: "Upload handler returning attachments" })] }), _jsxs("tr", { className: "border-b", children: [_jsx("td", { className: "p-2 font-mono text-sm", children: "maxFiles" }), _jsx("td", { className: "p-2 font-mono text-sm", children: "number" }), _jsx("td", { className: "p-2", children: "10" }), _jsx("td", { className: "p-2", children: "Maximum number of files" })] }), _jsxs("tr", { className: "border-b", children: [_jsx("td", { className: "p-2 font-mono text-sm", children: "maxFileSize" }), _jsx("td", { className: "p-2 font-mono text-sm", children: "number" }), _jsx("td", { className: "p-2", children: "10485760" }), _jsx("td", { className: "p-2", children: "Max size in bytes (10MB default)" })] }), _jsxs("tr", { className: "border-b", children: [_jsx("td", { className: "p-2 font-mono text-sm", children: "acceptedFileTypes" }), _jsx("td", { className: "p-2 font-mono text-sm", children: "string[]" }), _jsx("td", { className: "p-2", children: "images, PDFs, docs, videos" }), _jsx("td", { className: "p-2", children: "Accepted MIME types" })] }), _jsxs("tr", { className: "border-b", children: [_jsx("td", { className: "p-2 font-mono text-sm", children: "className" }), _jsx("td", { className: "p-2 font-mono text-sm", children: "string" }), _jsx("td", { className: "p-2", children: "-" }), _jsx("td", { className: "p-2", children: "Additional CSS classes" })] })] })] }) })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Examples" }), _jsx("h3", { className: "text-2xl font-semibold mb-3", children: "Images Only" }), _jsx("pre", { className: "bg-muted p-4 rounded-lg overflow-x-auto mb-6", children: _jsx("code", { children: `<FileUpload
  onUpload={handleUpload}
  maxFiles={3}
  maxFileSize={5 * 1024 * 1024} // 5MB
  acceptedFileTypes={['image/jpeg', 'image/png', 'image/gif']}
/>` }) }), _jsx("h3", { className: "text-2xl font-semibold mb-3", children: "Documents Only" }), _jsx("pre", { className: "bg-muted p-4 rounded-lg overflow-x-auto", children: _jsx("code", { children: `<FileUpload
  onUpload={handleUpload}
  maxFiles={10}
  maxFileSize={25 * 1024 * 1024} // 25MB
  acceptedFileTypes={[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ]}
/>` }) })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "File Type Patterns" }), _jsxs("div", { className: "space-y-4 text-muted-foreground", children: [_jsxs("div", { children: [_jsx("strong", { className: "text-foreground", children: "image/*" }), " - All image types"] }), _jsxs("div", { children: [_jsx("strong", { className: "text-foreground", children: "video/*" }), " - All video types"] }), _jsxs("div", { children: [_jsx("strong", { className: "text-foreground", children: "application/pdf" }), " - PDF files"] }), _jsxs("div", { children: [_jsx("strong", { className: "text-foreground", children: ".txt, .doc, .docx" }), " - Specific extensions"] })] })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Best Practices" }), _jsxs("ul", { className: "list-disc list-inside space-y-2 text-muted-foreground", children: [_jsx("li", { children: "Set appropriate maxFileSize for your use case" }), _jsx("li", { children: "Validate file types on both client and server" }), _jsx("li", { children: "Show upload progress for large files" }), _jsx("li", { children: "Handle errors gracefully with clear messages" }), _jsx("li", { children: "Provide feedback during upload process" }), _jsx("li", { children: "Allow users to cancel uploads" }), _jsx("li", { children: "Compress images before upload when possible" })] })] }), _jsxs("section", { children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Related Components" }), _jsxs("ul", { className: "list-disc list-inside space-y-2 text-muted-foreground", children: [_jsxs("li", { children: [_jsx("a", { href: "/reference/components/context-manager", className: "text-primary hover:underline", children: "Context Manager" }), " - Manage uploaded files"] }), _jsxs("li", { children: [_jsx("a", { href: "/reference/components/advanced-chat-input", className: "text-primary hover:underline", children: "Advanced Chat Input" }), " - Chat input with file upload"] })] })] })] }));
}
//# sourceMappingURL=page.js.map