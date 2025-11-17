import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'File Upload | Clarity Chat',
  description: 'File upload component with drag-and-drop, validation, and progress tracking.'
}

export default function FileUploadPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">File Upload</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Feature-rich file upload component with drag-and-drop, file validation, size limits, and upload progress tracking.
      </p>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Features</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Drag-and-drop file upload</li>
          <li>Click to browse file selection</li>
          <li>File type validation</li>
          <li>File size validation</li>
          <li>Multiple file support</li>
          <li>Upload progress tracking</li>
          <li>Error handling and display</li>
          <li>File preview before upload</li>
          <li>Remove files before upload</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Usage</h2>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
          <code>{`import { FileUpload } from '@clarity-chat/react'
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
}`}</code>
        </pre>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Props</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="p-2 font-semibold">Prop</th>
                <th className="p-2 font-semibold">Type</th>
                <th className="p-2 font-semibold">Default</th>
                <th className="p-2 font-semibold">Description</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b">
                <td className="p-2 font-mono text-sm">onUpload</td>
                <td className="p-2 font-mono text-sm">(files) =&gt; Promise&lt;Attachment[]&gt;</td>
                <td className="p-2">-</td>
                <td className="p-2">Upload handler returning attachments</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-mono text-sm">maxFiles</td>
                <td className="p-2 font-mono text-sm">number</td>
                <td className="p-2">10</td>
                <td className="p-2">Maximum number of files</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-mono text-sm">maxFileSize</td>
                <td className="p-2 font-mono text-sm">number</td>
                <td className="p-2">10485760</td>
                <td className="p-2">Max size in bytes (10MB default)</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-mono text-sm">acceptedFileTypes</td>
                <td className="p-2 font-mono text-sm">string[]</td>
                <td className="p-2">images, PDFs, docs, videos</td>
                <td className="p-2">Accepted MIME types</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-mono text-sm">className</td>
                <td className="p-2 font-mono text-sm">string</td>
                <td className="p-2">-</td>
                <td className="p-2">Additional CSS classes</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Examples</h2>
        
        <h3 className="text-2xl font-semibold mb-3">Images Only</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-6">
          <code>{`<FileUpload
  onUpload={handleUpload}
  maxFiles={3}
  maxFileSize={5 * 1024 * 1024} // 5MB
  acceptedFileTypes={['image/jpeg', 'image/png', 'image/gif']}
/>`}</code>
        </pre>

        <h3 className="text-2xl font-semibold mb-3">Documents Only</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
          <code>{`<FileUpload
  onUpload={handleUpload}
  maxFiles={10}
  maxFileSize={25 * 1024 * 1024} // 25MB
  acceptedFileTypes={[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ]}
/>`}</code>
        </pre>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">File Type Patterns</h2>
        <div className="space-y-4 text-muted-foreground">
          <div>
            <strong className="text-foreground">image/*</strong> - All image types
          </div>
          <div>
            <strong className="text-foreground">video/*</strong> - All video types
          </div>
          <div>
            <strong className="text-foreground">application/pdf</strong> - PDF files
          </div>
          <div>
            <strong className="text-foreground">.txt, .doc, .docx</strong> - Specific extensions
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Best Practices</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Set appropriate maxFileSize for your use case</li>
          <li>Validate file types on both client and server</li>
          <li>Show upload progress for large files</li>
          <li>Handle errors gracefully with clear messages</li>
          <li>Provide feedback during upload process</li>
          <li>Allow users to cancel uploads</li>
          <li>Compress images before upload when possible</li>
        </ul>
      </section>

      <section>
        <h2 className="text-3xl font-semibold mb-4">Related Components</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li><a href="/reference/components/context-manager" className="text-primary hover:underline">Context Manager</a> - Manage uploaded files</li>
          <li><a href="/reference/components/advanced-chat-input" className="text-primary hover:underline">Advanced Chat Input</a> - Chat input with file upload</li>
        </ul>
      </section>
    </div>
  )
}
