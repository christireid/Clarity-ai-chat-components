'use client'

import { useState, useCallback } from 'react'
import { FileUpload } from '@clarity-chat/react'
import type { MessageAttachment } from '@clarity-chat/types'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { ComponentPreview } from '@/components/Demo/ComponentPreview'
import { Callout } from '@/components/MDX/Callout'
import { ViewInStorybook } from '@/components/Links/StorybookLink'
import { ScrollReveal, ScrollRevealItem } from '@/components/UI/ScrollReveal'

const fileUploadProps: Prop[] = [
  {
    name: 'onUpload',
    type: '(files: File[]) => Promise<MessageAttachment[]>',
    required: true,
    description:
      'Async callback to handle file uploads. Must return array of attachment objects.',
  },
  {
    name: 'maxFiles',
    type: 'number',
    default: '10',
    description: 'Maximum number of files allowed to be selected at once.',
  },
  {
    name: 'maxFileSize',
    type: 'number',
    default: '10485760',
    description: 'Maximum file size in bytes (default: 10MB).',
  },
  {
    name: 'acceptedFileTypes',
    type: 'string[]',
    description:
      'Array of accepted MIME types (e.g., ["image/*", "application/pdf"]).',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Disable the upload input.',
  },
  {
    name: 'showPreview',
    type: 'boolean',
    default: 'true',
    description: 'Show preview thumbnails for selected files before upload.',
  },
  {
    name: 'dropzoneText',
    type: 'string',
    default: '"Drag & drop files here, or click to select"',
    description: 'Text displayed in the dropzone area.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes.',
  },
]

function BasicFileUploadDemo() {
  const handleUpload = useCallback(
    async (files: File[]): Promise<MessageAttachment[]> => {
      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      return files.map((file) => ({
        id: Math.random().toString(36).substring(7),
        type: file.type.startsWith('image/') ? 'image' as const : 'document' as const,
        url: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
        mimeType: file.type,
      }))
    },
    []
  )

  return (
    <div className="w-full max-w-xl p-4 border border-border rounded-lg bg-background">
      <FileUpload
        onUpload={handleUpload}
        maxFiles={3}
        maxFileSize={5 * 1024 * 1024}
        acceptedFileTypes={['image/*', 'application/pdf']}
      />
    </div>
  )
}

export default function FileUploadPage() {
  return (
    <div className="docs-content">
      <Breadcrumbs />

      <ScrollReveal>
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-brand-500 to-brand-600 bg-clip-text text-transparent">
            FileUpload
          </h1>
          <p className="text-xl text-text-secondary leading-relaxed">
            A comprehensive file upload component featuring drag-and-drop,
            multi-file support, progress tracking, and preview generation.
          </p>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <ViewInStorybook component="FileUpload" />
      </ScrollReveal>

      <ScrollReveal delay={0.2}>
        <section className="my-12">
          <h2 className="text-2xl font-bold mb-4">Features</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-secondary/20 border border-border">
              <h3 className="font-semibold mb-2">🖱️ Drag & Drop</h3>
              <p className="text-sm text-muted-foreground">
                Intuitive drag and drop interface with visual feedback states.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/20 border border-border">
              <h3 className="font-semibold mb-2">👁️ File Previews</h3>
              <p className="text-sm text-muted-foreground">
                Automatic thumbnail generation for images and file type icons.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/20 border border-border">
              <h3 className="font-semibold mb-2">📊 Progress Tracking</h3>
              <p className="text-sm text-muted-foreground">
                Built-in loading states and progress indicators during upload.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/20 border border-border">
              <h3 className="font-semibold mb-2">🛡️ Validation</h3>
              <p className="text-sm text-muted-foreground">
                Client-side validation for file types, sizes, and counts.
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal delay={0.3}>
        <h2 id="import">Import</h2>
        <EnhancedCodeBlock
          code={`import { FileUpload } from '@clarity-chat/react'
import type { MessageAttachment } from '@clarity-chat/types'`}
          language="tsx"
        />
      </ScrollReveal>

      <ScrollReveal delay={0.4}>
        <h2 id="usage">Usage</h2>
        <p className="mb-4 text-muted-foreground">
          The FileUpload component requires an <code>onUpload</code> handler
          that returns a Promise resolving to an array of attachments.
        </p>

        <ComponentPreview
          title="Basic File Upload"
          description="Drag and drop images or PDFs (max 5MB)."
          code={`import { FileUpload } from '@clarity-chat/react'
import type { MessageAttachment } from '@clarity-chat/types'

function UploadDemo() {
  const handleUpload = async (files: File[]): Promise<MessageAttachment[]> => {
    // Simulate API upload
    const uploadPromises = files.map(async (file) => {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      
      return await response.json()
    })
    
    return Promise.all(uploadPromises)
  }

  return (
    <FileUpload
      onUpload={handleUpload}
      maxFiles={3}
      maxFileSize={5 * 1024 * 1024} // 5MB
      acceptedFileTypes={['image/*', 'application/pdf']}
    />
  )
}`}
        >
          <BasicFileUploadDemo />
        </ComponentPreview>
      </ScrollReveal>

      <ScrollReveal delay={0.5}>
        <section className="my-12">
          <h2 className="text-2xl font-bold mb-4">Interactive Playground</h2>
          <p className="mb-6 text-muted-foreground">
            Try customizing the accepted file types and limits.
          </p>
          <CodePlayground
            initialCode={`function Example() {
  const handleUpload = async (files) => {
    console.log('Uploading...', files)
    // Simulate 1s upload delay
    await new Promise(r => setTimeout(r, 1000))
    
    return files.map(f => ({
      id: Date.now().toString(),
      type: 'file',
      url: '#',
      name: f.name,
      size: f.size
    }))
  }

  return (
    <div className="p-4 bg-white dark:bg-gray-900 rounded-lg">
      <FileUpload
        onUpload={handleUpload}
        maxFiles={5}
        maxFileSize={1024 * 1024} // 1MB
        dropzoneText="Drop files here!"
      />
    </div>
  )
}

render(<Example />)`}
          />
        </section>
      </ScrollReveal>

      <ScrollReveal delay={0.6}>
        <h2 id="validation">Validation Patterns</h2>
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Common patterns for <code>acceptedFileTypes</code>:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-muted p-4 rounded-md">
              <code className="text-sm font-semibold text-primary">
                ['image/*']
              </code>
              <p className="text-sm mt-1 text-muted-foreground">
                Accept all image formats
              </p>
            </div>
            <div className="bg-muted p-4 rounded-md">
              <code className="text-sm font-semibold text-primary">
                ['application/pdf']
              </code>
              <p className="text-sm mt-1 text-muted-foreground">
                PDF documents only
              </p>
            </div>
            <div className="bg-muted p-4 rounded-md">
              <code className="text-sm font-semibold text-primary">
                ['.csv', '.xlsx']
              </code>
              <p className="text-sm mt-1 text-muted-foreground">
                Spreadsheets by extension
              </p>
            </div>
            <div className="bg-muted p-4 rounded-md">
              <code className="text-sm font-semibold text-primary">
                ['video/*', 'audio/*']
              </code>
              <p className="text-sm mt-1 text-muted-foreground">Media files</p>
            </div>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.7}>
        <h2 id="props">Props</h2>
        <PropsTable props={fileUploadProps} />
      </ScrollReveal>

      <ScrollReveal delay={0.8}>
        <h2 id="best-practices">Best Practices</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-8">
          <li>Always validate file types on the server side as well.</li>
          <li>
            Set reasonable <code>maxFileSize</code> limits to prevent server
            overload.
          </li>
          <li>
            Provide immediate feedback using toast notifications for upload
            errors.
          </li>
          <li>
            Use the <code>disabled</code> prop during parent form submission.
          </li>
        </ul>
      </ScrollReveal>

      <ScrollReveal delay={0.9}>
        <div className="flex flex-col gap-4 border-t border-border pt-8 mt-12">
          <h2 className="text-2xl font-bold">Related Components</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <a
              href="/reference/components/advanced-chat-input"
              className="group p-4 border border-border rounded-lg hover:border-brand-500 transition-colors"
            >
              <h3 className="font-semibold text-primary group-hover:text-brand-500 mb-1">
                AdvancedChatInput
              </h3>
              <p className="text-sm text-muted-foreground">
                Chat input with integrated file upload.
              </p>
            </a>
            <a
              href="/reference/components/message-attachment"
              className="group p-4 border border-border rounded-lg hover:border-brand-500 transition-colors"
            >
              <h3 className="font-semibold text-primary group-hover:text-brand-500 mb-1">
                MessageAttachment
              </h3>
              <p className="text-sm text-muted-foreground">
                Component for displaying uploaded files in chat.
              </p>
            </a>
          </div>
        </div>
      </ScrollReveal>
    </div>
  )
}
