import React from 'react'
import { Metadata } from 'next'
import { ApiTable } from '@/components/Demo/ApiTable'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'Multi-Modal Preview - Clarity Chat Components',
  description:
    'Preview multiple file types - images, videos, audio, PDFs - in a unified interface.',
}

export default function MultiModalPreviewPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Component</span>
        <h1>Multi-Modal Preview</h1>
        <p className="docs-lead">
          Show previews of different file types - images, videos, audio, PDFs -
          all in one consistent interface. Like a universal file viewer.
        </p>
      </div>

      <section className="docs-section">
        <h2>Overview</h2>
        <p>
          When users upload files or AI generates images/audio, this component
          shows nice previews. It handles all the different file types for you.
        </p>
      </section>

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <CodePlayground
          initialCode={`function FilePreviews() {
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

render(<FilePreviews />)`}
        />
      </section>

      <section className="docs-section">
        <h2>Props</h2>
        <ApiTable title="MultiModalPreview Props" data={multiModalProps} />
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>Show thumbnails for images and videos</li>
          <li>Display duration for audio/video</li>
          <li>Show file size to set expectations</li>
          <li>Provide retry for failed uploads</li>
          <li>Allow removal of attachments</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/reference/components/file-upload" className="docs-card">
            <h3>File Upload</h3>
            <p>Upload files</p>
          </a>
          <a href="/reference/components/context-card" className="docs-card">
            <h3>Context Card</h3>
            <p>RAG context display</p>
          </a>
        </div>
      </section>
    </div>
  )
}

const multiModalProps = [
  {
    name: 'attachments',
    type: 'AttachmentPreview[]',
    required: true,
    description: 'Array of file attachments to preview',
  },
  {
    name: 'onOpen',
    type: '(attachment: AttachmentPreview) => void',
    required: false,
    description: 'Callback when user opens/clicks an attachment',
  },
  {
    name: 'onRetry',
    type: '(attachment: AttachmentPreview) => void',
    required: false,
    description: 'Callback to retry failed uploads',
  },
  {
    name: 'onRemove',
    type: '(attachment: AttachmentPreview) => void',
    required: false,
    description: 'Callback to remove an attachment',
  },
  {
    name: 'className',
    type: 'string',
    required: false,
    description: 'Additional CSS classes',
  },
]
