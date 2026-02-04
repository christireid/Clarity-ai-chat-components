'use client'

import React, { useState } from 'react'
import { Upload, FileCheck, Shield, Zap, FileType, AlertCircle } from 'lucide-react'
import { DocumentationPage } from '../../../../components/Docs/DocumentationPage'
import { Section } from '../../../../components/Docs/Section'
import { PropsTable, type PropDefinition } from '../../../../components/Docs/PropsTable'
import { CodeBlock } from '../../../../components/Docs/CodeBlock'
import { FileUpload } from '../../../../../../packages/react/src/components/input/FileUpload'
import type { MessageAttachment } from '@clarity-chat/types'

const features = [
  {
    icon: Upload,
    label: 'Drag & Drop',
    description: 'Intuitive drag-and-drop file upload interface',
  },
  {
    icon: FileCheck,
    label: 'Validation',
    description: 'Built-in file type and size validation',
  },
  {
    icon: Shield,
    label: 'Type Safety',
    description: 'Full TypeScript support with type-safe callbacks',
  },
  {
    icon: Zap,
    label: 'Async Handling',
    description: 'Promise-based upload with loading states',
  },
]

const tableOfContents = [
  { id: 'overview', title: 'Overview', level: 2 },
  { id: 'installation', title: 'Installation', level: 2 },
  { id: 'basic-usage', title: 'Basic Usage', level: 2 },
  { id: 'demo', title: 'Live Demo', level: 2 },
  { id: 'props', title: 'Props', level: 2 },
  { id: 'file-validation', title: 'File Validation', level: 2 },
  { id: 'size-limits', title: 'Size Limits', level: 2 },
  { id: 'accepted-types', title: 'Accepted File Types', level: 2 },
  { id: 'examples', title: 'Examples', level: 2 },
  { id: 'accessibility', title: 'Accessibility', level: 2 },
  { id: 'related', title: 'Related', level: 2 },
]

const relatedAPIs = [
  {
    name: 'ChatInput',
    type: 'component' as const,
    description: 'Text input component that can be enhanced with file uploads',
    href: '/reference/components/chat-input',
  },
  {
    name: 'AdvancedChatInput',
    type: 'component' as const,
    description: 'Advanced chat input with built-in file upload support',
    href: '/reference/components/advanced-chat-input',
  },
  {
    name: 'MessageAttachment',
    type: 'utility' as const,
    description: 'Type definition for message attachments',
    href: '/reference/types/message-attachment',
  },
]

const footerNavigation = [
  {
    label: 'VoiceInput',
    href: '/reference/components/voice-input',
    direction: 'previous' as const,
  },
  {
    label: 'MessageList',
    href: '/reference/components/message-list',
    direction: 'next' as const,
  },
]

const props: PropDefinition[] = [
  {
    name: 'onUpload',
    type: '(files: File[]) => Promise<MessageAttachment[]>',
    required: true,
    description:
      'Async callback when files are uploaded. Must return an array of MessageAttachment objects containing URLs and metadata for the uploaded files.',
  },
  {
    name: 'maxFiles',
    type: 'number',
    default: '10',
    description: 'Maximum number of files allowed in a single upload batch.',
  },
  {
    name: 'maxFileSize',
    type: 'number',
    default: '10485760 (10MB)',
    description: 'Maximum file size in bytes. Files exceeding this limit will be rejected.',
  },
  {
    name: 'acceptedFileTypes',
    type: 'string[]',
    default: "['image/*', 'application/pdf', '.txt', '.doc', '.docx', 'video/*']",
    description:
      'Array of accepted MIME types or file extensions. Supports wildcards (e.g., "image/*").',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes to apply to the root container.',
  },
]

export default function FileUploadPage() {
  const [uploadedFiles, setUploadedFiles] = useState<MessageAttachment[]>([])
  const [uploadStatus, setUploadStatus] = useState<string>('')

  const handleUpload = async (files: File[]): Promise<MessageAttachment[]> => {
    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Create mock attachments
    const attachments: MessageAttachment[] = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      type: file.type.startsWith('image/')
        ? ('image' as const)
        : file.type.startsWith('video/')
          ? ('video' as const)
          : file.type.includes('pdf')
            ? ('document' as const)
            : ('document' as const),
      url: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      mimeType: file.type,
    }))

    setUploadedFiles((prev) => [...prev, ...attachments])
    setUploadStatus(`Successfully uploaded ${files.length} file(s)`)

    return attachments
  }

  return (
    <DocumentationPage
      title="FileUpload"
      description="A drag-and-drop file upload component with validation, file type restrictions, and size limits. Supports multiple files with progress tracking and error handling."
      icon={Upload}
      badges={[{ label: 'Stable', variant: 'stable' }]}
      packageName="@clarity-chat/react"
      features={features}
      tableOfContents={tableOfContents}
      relatedAPIs={relatedAPIs}
      footerNavigation={footerNavigation}
    >
      {/* Overview */}
      <Section id="overview" title="Overview">
        <p className="text-muted-foreground leading-relaxed">
          The <code className="text-sm">FileUpload</code> component provides a polished,
          accessible interface for uploading files to your chat application. It features
          drag-and-drop support, file validation, size limits, and real-time feedback.
        </p>
        <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">
            Key Features
          </h4>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>• Drag-and-drop interface with visual feedback</li>
            <li>• File type validation with MIME type and extension support</li>
            <li>• Configurable file size limits with user-friendly error messages</li>
            <li>• Multiple file upload with batch processing</li>
            <li>• Progress tracking and loading states</li>
            <li>• Accessible with keyboard navigation and screen reader support</li>
            <li>• Responsive design adapts to mobile and desktop</li>
            <li>• Respects reduced motion preferences</li>
          </ul>
        </div>
      </Section>

      {/* Installation */}
      <Section id="installation" title="Installation">
        <CodeBlock
          language="bash"
          code={`npm install @clarity-chat/react
# or
yarn add @clarity-chat/react
# or
pnpm add @clarity-chat/react`}
        />
      </Section>

      {/* Basic Usage */}
      <Section id="basic-usage" title="Basic Usage">
        <CodeBlock
          language="tsx"
          code={`import { FileUpload } from '@clarity-chat/react'
import type { MessageAttachment } from '@clarity-chat/types'

function ChatWithFiles() {
  const [attachments, setAttachments] = useState<MessageAttachment[]>([])

  const handleUpload = async (files: File[]): Promise<MessageAttachment[]> => {
    // Upload files to your server
    const formData = new FormData()
    files.forEach((file) => formData.append('files', file))

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    const uploadedFiles = await response.json()
    setAttachments((prev) => [...prev, ...uploadedFiles])

    return uploadedFiles
  }

  return (
    <div>
      <FileUpload
        onUpload={handleUpload}
        maxFiles={5}
        maxFileSize={5 * 1024 * 1024} // 5MB
        acceptedFileTypes={['image/*', 'application/pdf']}
      />
      {attachments.length > 0 && (
        <div className="mt-4">
          <h3>Uploaded Files:</h3>
          {attachments.map((file) => (
            <div key={file.id}>{file.name}</div>
          ))}
        </div>
      )}
    </div>
  )
}`}
        />
      </Section>

      {/* Live Demo */}
      <Section id="demo" title="Live Demo">
        <div className="space-y-4">
          <div className="p-6 border border-border/50 rounded-lg bg-card">
            <FileUpload
              onUpload={handleUpload}
              maxFiles={5}
              maxFileSize={5 * 1024 * 1024}
              acceptedFileTypes={['image/*', 'application/pdf', '.txt', '.doc', '.docx']}
            />
          </div>

          {uploadStatus && (
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <p className="text-sm text-green-600 dark:text-green-400">{uploadStatus}</p>
            </div>
          )}

          {uploadedFiles.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Uploaded Files:</h4>
              <div className="space-y-2">
                {uploadedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center gap-3 p-3 bg-muted/30 border border-border/40 rounded-lg"
                  >
                    <FileType className="w-5 h-5 text-brand-500" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {file.size ? `${(file.size / 1024).toFixed(1)} KB` : 'Unknown size'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  setUploadedFiles([])
                  setUploadStatus('')
                }}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </Section>

      {/* Props */}
      <Section id="props" title="Props">
        <PropsTable props={props} />
      </Section>

      {/* File Validation */}
      <Section id="file-validation" title="File Validation">
        <p className="text-muted-foreground mb-4">
          The component performs several validation checks before accepting files:
        </p>

        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">1. File Count Validation</h4>
            <CodeBlock
              language="tsx"
              code={`<FileUpload
  maxFiles={3}
  onUpload={handleUpload}
/>
// Error: "Maximum 3 files allowed"`}
            />
          </div>

          <div>
            <h4 className="font-semibold mb-2">2. File Size Validation</h4>
            <CodeBlock
              language="tsx"
              code={`<FileUpload
  maxFileSize={2 * 1024 * 1024} // 2MB
  onUpload={handleUpload}
/>
// Error: "File example.pdf exceeds maximum size of 2 MB"`}
            />
          </div>

          <div>
            <h4 className="font-semibold mb-2">3. File Type Validation</h4>
            <CodeBlock
              language="tsx"
              code={`<FileUpload
  acceptedFileTypes={['image/png', 'image/jpeg']}
  onUpload={handleUpload}
/>
// Accepts: .png, .jpg, .jpeg files only`}
            />
          </div>
        </div>
      </Section>

      {/* Size Limits */}
      <Section id="size-limits" title="Size Limits">
        <p className="text-muted-foreground mb-4">
          Configure file size limits to prevent uploading excessively large files:
        </p>

        <CodeBlock
          language="tsx"
          code={`// Common size limit configurations

// 1MB limit
<FileUpload maxFileSize={1024 * 1024} />

// 5MB limit (common for images)
<FileUpload maxFileSize={5 * 1024 * 1024} />

// 10MB limit (default)
<FileUpload maxFileSize={10 * 1024 * 1024} />

// 50MB limit (for videos)
<FileUpload maxFileSize={50 * 1024 * 1024} />

// 100MB limit (large files)
<FileUpload maxFileSize={100 * 1024 * 1024} />`}
        />

        <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-amber-600 dark:text-amber-400 mb-1">
                Server-Side Validation Required
              </h4>
              <p className="text-sm text-muted-foreground">
                Always validate file sizes on your server as well. Client-side validation can
                be bypassed and should only be used for UX improvements.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Accepted File Types */}
      <Section id="accepted-types" title="Accepted File Types">
        <p className="text-muted-foreground mb-4">
          Control which file types users can upload using MIME types or file extensions:
        </p>

        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">MIME Type Wildcards</h4>
            <CodeBlock
              language="tsx"
              code={`<FileUpload
  acceptedFileTypes={[
    'image/*',        // All images
    'video/*',        // All videos
    'audio/*',        // All audio
    'application/*',  // All applications
  ]}
/>`}
            />
          </div>

          <div>
            <h4 className="font-semibold mb-2">Specific MIME Types</h4>
            <CodeBlock
              language="tsx"
              code={`<FileUpload
  acceptedFileTypes={[
    'image/png',
    'image/jpeg',
    'image/gif',
    'image/webp',
    'application/pdf',
  ]}
/>`}
            />
          </div>

          <div>
            <h4 className="font-semibold mb-2">File Extensions</h4>
            <CodeBlock
              language="tsx"
              code={`<FileUpload
  acceptedFileTypes={[
    '.txt',
    '.doc',
    '.docx',
    '.pdf',
    '.csv',
    '.xlsx',
  ]}
/>`}
            />
          </div>

          <div>
            <h4 className="font-semibold mb-2">Mixed Configuration</h4>
            <CodeBlock
              language="tsx"
              code={`<FileUpload
  acceptedFileTypes={[
    'image/*',           // All images
    'video/*',           // All videos
    'application/pdf',   // PDF documents
    '.txt',              // Text files
    '.doc',              // Word documents
    '.docx',
  ]}
/>`}
            />
          </div>
        </div>
      </Section>

      {/* Examples */}
      <Section id="examples" title="Examples">
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold mb-3">Image Upload Only</h4>
            <CodeBlock
              language="tsx"
              code={`<FileUpload
  onUpload={handleUpload}
  maxFiles={10}
  maxFileSize={5 * 1024 * 1024} // 5MB
  acceptedFileTypes={['image/*']}
/>`}
            />
          </div>

          <div>
            <h4 className="font-semibold mb-3">Document Upload</h4>
            <CodeBlock
              language="tsx"
              code={`<FileUpload
  onUpload={handleUpload}
  maxFiles={5}
  maxFileSize={10 * 1024 * 1024} // 10MB
  acceptedFileTypes={[
    'application/pdf',
    '.doc',
    '.docx',
    '.txt',
  ]}
/>`}
            />
          </div>

          <div>
            <h4 className="font-semibold mb-3">Media Upload (Images & Videos)</h4>
            <CodeBlock
              language="tsx"
              code={`<FileUpload
  onUpload={handleUpload}
  maxFiles={3}
  maxFileSize={50 * 1024 * 1024} // 50MB for videos
  acceptedFileTypes={['image/*', 'video/*']}
/>`}
            />
          </div>

          <div>
            <h4 className="font-semibold mb-3">With Custom Error Handling</h4>
            <CodeBlock
              language="tsx"
              code={`function CustomFileUpload() {
  const [error, setError] = useState<string | null>(null)

  const handleUpload = async (files: File[]): Promise<MessageAttachment[]> => {
    setError(null)

    try {
      const formData = new FormData()
      files.forEach((file) => formData.append('files', file))

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      return await response.json()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
      throw err
    }
  }

  return (
    <div>
      <FileUpload onUpload={handleUpload} />
      {error && (
        <div className="mt-2 text-sm text-destructive">
          {error}
        </div>
      )}
    </div>
  )
}`}
            />
          </div>
        </div>
      </Section>

      {/* Accessibility */}
      <Section id="accessibility" title="Accessibility">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Keyboard Navigation</h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4 font-semibold">Key</th>
                    <th className="text-left py-2 px-4 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 px-4">
                      <kbd className="px-2 py-1 bg-muted rounded text-xs">Enter</kbd> /{' '}
                      <kbd className="px-2 py-1 bg-muted rounded text-xs">Space</kbd>
                    </td>
                    <td className="py-2 px-4">Open file picker</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-4">
                      <kbd className="px-2 py-1 bg-muted rounded text-xs">Tab</kbd>
                    </td>
                    <td className="py-2 px-4">Navigate between controls</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-4">
                      <kbd className="px-2 py-1 bg-muted rounded text-xs">Escape</kbd>
                    </td>
                    <td className="py-2 px-4">Cancel file selection</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Screen Reader Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Drag zone announces upload instructions</li>
              <li>• File validation errors are announced immediately</li>
              <li>• Upload progress is announced with live regions</li>
              <li>• File list items are properly labeled</li>
              <li>• Remove buttons have descriptive labels</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">WCAG 2.1 AA Compliance</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>✓ Color contrast meets 4.5:1 ratio</li>
              <li>✓ Focus indicators are clearly visible</li>
              <li>✓ All interactive elements are keyboard accessible</li>
              <li>✓ Error messages are associated with form controls</li>
              <li>✓ Respects prefers-reduced-motion</li>
            </ul>
          </div>
        </div>
      </Section>
    </DocumentationPage>
  )
}
