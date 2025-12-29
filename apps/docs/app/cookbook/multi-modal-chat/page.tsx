import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { Pagination } from '@/components/Navigation/Pagination'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'Multi-Modal Chat Recipe | Clarity Chat Cookbook',
  description:
    'Learn how to build chat interfaces that support text, images, files, and other media types.',
}

export default function MultiModalChatPage() {
  return (
    <>
      <Breadcrumbs />

      <h1>Multi-Modal Chat Recipe</h1>

      <p className="lead">
        Build chat interfaces that support text, images, files, and other media
        types. Perfect for applications that need to process visual content
        alongside text.
      </p>

      <Callout type="info" title="What is Multi-Modal?">
        <p>
          Multi-modal chat allows users to send and receive different types of
          content: text, images, files, audio, video, and more. The AI can
          understand and respond to all these formats.
        </p>
      </Callout>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Quick Start</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Enable multi-modal with file upload support:
        </p>

        <EnhancedCodeBlock
          language="tsx"
          code={`import { ClarityChat, FileUpload } from '@clarity-chat/react/internal'
import '@clarity-chat/react/styles.css'

function MultiModalChat() {
  return (
    <div>
      <ClarityChat
        api="/api/chat"
        // Multi-modal is enabled by default when files are attached
      />
      <FileUpload
        onUpload={async (files) => {
          // Upload files and return attachments
          return files.map(file => ({
            id: file.name,
            filename: file.name,
            url: URL.createObjectURL(file),
            size: file.size,
            mimeType: file.type,
          }))
        }}
      />
    </div>
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">With useClarityChat</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          For custom UIs, handle multi-modal messages:
        </p>

        <EnhancedCodeBlock
          language="tsx"
          code={`import { useClarityChat, ChatWindow, FileUpload } from '@clarity-chat/react/internal'
import { useState } from 'react'

function MultiModalChat() {
  const { messages, append } = useClarityChat({
    api: '/api/chat',
  })

  const [attachments, setAttachments] = useState([])

  const handleFileUpload = async (files: File[]) => {
    // Upload files to your server
    const uploaded = await Promise.all(
      files.map(async (file) => {
        const formData = new FormData()
        formData.append('file', file)
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })
        
        const data = await response.json()
        return {
          id: data.id,
          filename: file.name,
          url: data.url,
          size: file.size,
          mimeType: file.type,
        }
      })
    )

    setAttachments(uploaded)
    return uploaded
  }

  const handleSend = async (content: string) => {
    await append({
      role: 'user',
      content: [
        { type: 'text', text: content },
        ...attachments.map(att => ({
          type: 'image',
          image: att.url,
        })),
      ],
    })
    setAttachments([])
  }

  return (
    <div>
      <FileUpload onUpload={handleFileUpload} />
      <ChatWindow
        messages={messages}
        onSendMessage={handleSend}
      />
    </div>
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Image Support</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Send images with text messages:
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-4">
          With AdvancedChatInput
        </h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { AdvancedChatInput } from '@clarity-chat/react/internal'

function ImageChat() {
  const [message, setMessage] = useState('')
  const [attachments, setAttachments] = useState([])

  return (
    <AdvancedChatInput
      value={message}
      onChange={setMessage}
      onSubmit={(text, files) => {
        // Send message with image attachments
        sendMessage({
          role: 'user',
          content: [
            { type: 'text', text },
            ...files.map(file => ({
              type: 'image',
              image: file.url,
            })),
          ],
        })
      }}
      onFileUpload={async (files) => {
        // Upload images
        return files.map(file => ({
          id: file.name,
          filename: file.name,
          url: URL.createObjectURL(file),
          size: file.size,
          mimeType: file.type,
        }))
      }}
      acceptedFileTypes={['image/*']}
    />
  )
}`}
        />

        <h3 className="text-xl font-semibold mt-6 mb-4">Image Preview</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`function ImagePreview({ attachments }) {
  return (
    <div className="image-preview">
      {attachments.map(att => (
        <div key={att.id} className="image-item">
          <img src={att.url} alt={att.filename} />
          <button onClick={() => removeAttachment(att.id)}>Remove</button>
        </div>
      ))}
    </div>
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">API Endpoint Setup</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Your API endpoint needs to handle multi-modal content:
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-4">Next.js App Router</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`// app/api/chat/route.ts
import { NextRequest } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    // Messages can contain multi-modal content
    // Example: [
    //   {
    //     role: 'user',
    //     content: [
    //       { type: 'text', text: 'What is in this image?' },
    //       { type: 'image_url', image_url: { url: 'https://...' } }
    //     ]
    //   }
    // ]

    const stream = await openai.chat.completions.create({
      model: 'gpt-4-vision-preview', // Use vision model for images
      messages,
      stream: true,
    })

    return new Response(
      new ReadableStream({
        async start(controller) {
          const encoder = new TextEncoder()
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content
            if (content) {
              controller.enqueue(encoder.encode(\`data: \${content}\\n\\n\`))
            }
          }
          controller.close()
        },
      }),
      {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      }
    )
  } catch (error) {
    console.error('Chat API error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">File Types</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Support different file types:
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-4">Images</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`// Send image with text
await append({
  role: 'user',
  content: [
    { type: 'text', text: 'Analyze this image' },
    { type: 'image_url', image_url: { url: imageUrl } },
  ],
})`}
        />

        <h3 className="text-xl font-semibold mt-6 mb-4">PDFs and Documents</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`// Upload and process PDF
const handlePDFUpload = async (file: File) => {
  // Extract text from PDF
  const text = await extractTextFromPDF(file)
  
  // Send as context
  await append({
    role: 'user',
    content: \`Please analyze this document: \\n\\n\${text}\`,
  })
}`}
        />

        <h3 className="text-xl font-semibold mt-6 mb-4">Audio</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`// Transcribe audio and send
const handleAudioUpload = async (file: File) => {
  // Transcribe audio to text
  const transcript = await transcribeAudio(file)
  
  await append({
    role: 'user',
    content: transcript,
  })
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">
          Displaying Multi-Modal Messages
        </h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Render different content types in messages:
        </p>

        <EnhancedCodeBlock
          language="tsx"
          code={`function MultiModalMessage({ message }) {
  return (
    <div className="message">
      {Array.isArray(message.content) ? (
        message.content.map((part, i) => {
          if (part.type === 'text') {
            return <div key={i}>{part.text}</div>
          }
          if (part.type === 'image_url' || part.type === 'image') {
            const url = part.image_url?.url || part.image
            return <img key={i} src={url} alt="User upload" />
          }
          return null
        })
      ) : (
        <div>{message.content}</div>
      )}
    </div>
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Best Practices</h2>
        <ul className="list-disc list-inside mb-4 space-y-2 text-gray-600 dark:text-gray-400">
          <li>
            <strong>Validate file types</strong> - Only accept supported formats
          </li>
          <li>
            <strong>Limit file sizes</strong> - Prevent large uploads from
            slowing down the app
          </li>
          <li>
            <strong>Show upload progress</strong> - Give users feedback during
            uploads
          </li>
          <li>
            <strong>Handle errors gracefully</strong> - Show clear error
            messages for unsupported files
          </li>
          <li>
            <strong>Optimize images</strong> - Compress images before sending to
            reduce token usage
          </li>
          <li>
            <strong>Use appropriate models</strong> - Use vision models
            (gpt-4-vision) for images
          </li>
        </ul>
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Related</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/reference/components/file-upload" className="docs-card">
            <h3>FileUpload Component</h3>
            <p>File upload component</p>
          </a>
          <a
            href="/reference/components/advanced-chat-input"
            className="docs-card"
          >
            <h3>AdvancedChatInput Component</h3>
            <p>Input with file support</p>
          </a>
          <a href="/cookbook/voice-input" className="docs-card">
            <h3>Voice Input Recipe</h3>
            <p>Add voice input support</p>
          </a>
          <a href="/guides/multi-modal" className="docs-card">
            <h3>Multi-Modal Guide</h3>
            <p>Complete multi-modal guide</p>
          </a>
        </div>
      </section>

      <Pagination
        prev={{ title: 'Error Handling', href: '/cookbook/error-handling' }}
        next={{ title: 'Voice Input', href: '/cookbook/voice-input' }}
      />
    </>
  )
}
