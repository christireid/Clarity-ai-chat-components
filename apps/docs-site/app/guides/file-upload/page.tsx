import React from 'react'
import { Metadata } from 'next'
import { CodeBlock } from '@/components/MDX/CodeBlock'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'File Upload - Clarity Chat',
  description: 'Support rich user attachments including documents, images, and structured data.',
}

export default function FileUploadGuidePage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Guide</span>
        <h1>File Upload</h1>
        <p className="docs-lead">
          Support rich user attachments including documents, images, and structured data.
        </p>
      </div>

      <section className="docs-section">
        <h2>Composer Configuration</h2>
        <p>
          Enable uploads via the <code>Composer</code> component or the <code>useComposer</code> hook.
        </p>
        <CodeBlock
          language="tsx"
          code={`import { ChatWindow } from '@clarity-chat/react'

<ChatWindow
  allowFileUploads
  onUploadFiles={async files => {
    // Perform validation and upload
    return files.map(file => ({
      id: crypto.randomUUID(),
      name: file.name,
      size: file.size,
      type: file.type,
      url: await uploadToS3(file),
    }))
  }}
/>`}
        />
      </section>

      <section className="docs-section">
        <h2>Validation</h2>
        <ul>
          <li>Restrict MIME types and maximum sizes with <code>uploadConfig</code>.</li>
          <li>Provide descriptive error messages for rejected files.</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Displaying Attachments</h2>
        <p>
          Use <code>AttachmentGallery</code> or <code>AttachmentList</code> to render previews inside the transcript or composer.
        </p>
        <p>
          Next, explore <a href="/guides/message-operations">Message Operations</a> to manage edits, branches, and retries.
        </p>
      </section>
    </div>
  )
}
