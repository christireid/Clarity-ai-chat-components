import React from 'react'
import { Metadata } from 'next'
import { CodeBlock } from '@/components/MDX/CodeBlock'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'Multi-Modal Chat - Cookbook - Clarity Chat',
  description: 'Build a chat that handles images, PDFs, and other files with GPT-4 Vision.',
}

export default function MultiModalChatPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Cookbook</span>
        <h1>Multi-Modal Chat</h1>
        <p className="docs-lead">
          Let users upload images and ask questions about them. "What's in this screenshot?" "Describe this diagram." Powered by GPT-4 Vision.
        </p>
      </div>

      <section className="docs-section">
        <h2>What You'll Build</h2>
        <ul>
          <li>✅ Upload images to chat</li>
          <li>✅ Ask questions about images</li>
          <li>✅ Show image previews in messages</li>
          <li>✅ Handle PDFs with vision API</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Step 1: File Upload API</h2>
        <CodeBlock
          language="typescript"
          code={`// app/api/upload/route.ts
import { put } from '@vercel/blob'

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get('file') as File

  // Upload to blob storage
  const blob = await put(file.name, file, {
    access: 'public',
  })

  return Response.json({
    url: blob.url,
    fileName: file.name,
    type: file.type,
    size: file.size
  })
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Step 2: Vision API Integration</h2>
        <CodeBlock
          language="typescript"
          code={`// app/api/chat/route.ts
import OpenAI from 'openai'

const openai = new OpenAI()

export async function POST(req: Request) {
  const { messages, imageUrls } = await req.json()

  // Build messages with images
  const messageWithImages = messages.map(msg => {
    if (msg.attachments && msg.attachments.length > 0) {
      return {
        role: msg.role,
        content: [
          { type: 'text', text: msg.content },
          ...msg.attachments.map(att => ({
            type: 'image_url',
            image_url: { url: att.url }
          }))
        ]
      }
    }
    return { role: msg.role, content: msg.content }
  })

  const response = await openai.chat.completions.create({
    model: 'gpt-4-vision-preview',
    max_tokens: 4096,
    messages: messageWithImages
  })

  return Response.json({
    content: response.choices[0].message.content
  })
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Step 3: Chat UI with File Upload</h2>
        <CodeBlock
          language="typescript"
          code={`'use client'

import { ChatWindow, FileUpload } from '@clarity-chat/react'
import { useState } from 'react'

export default function MultiModalChat() {
  const [messages, setMessages] = useState([])
  const [attachments, setAttachments] = useState([])

  // Handle file upload
  const handleUpload = async (files: File[]) => {
    const uploaded = []
    
    for (const file of files) {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      
      const result = await response.json()
      uploaded.push({
        id: result.url,
        url: result.url,
        type: file.type,
        name: file.name
      })
    }
    
    setAttachments(uploaded)
    return uploaded
  }

  // Send message with attachments
  const handleSendMessage = async (content: string) => {
    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      content,
      createdAt: new Date(),
      attachments: attachments  // Include uploaded files
    }
    
    setMessages(prev => [...prev, userMsg])
    setAttachments([])  // Clear for next message

    // Call API with image URLs
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [...messages, userMsg],
        imageUrls: attachments.map(a => a.url)
      })
    })

    const data = await response.json()
    
    setMessages(prev => [...prev, {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: data.content,
      createdAt: new Date()
    }])
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1">
        <ChatWindow
          messages={messages}
          onSendMessage={handleSendMessage}
        />
      </div>
      
      {/* File Upload Area */}
      <div className="border-t p-4">
        <FileUpload
          onUpload={handleUpload}
          acceptedFileTypes={['image/*', 'application/pdf']}
          maxFiles={4}
          maxFileSize={10 * 1024 * 1024}
        />
        
        {/* Show attached files */}
        {attachments.length > 0 && (
          <div className="mt-2 flex gap-2">
            {attachments.map(att => (
              <div key={att.id} className="relative">
                <img
                  src={att.url}
                  alt={att.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <button
                  onClick={() => setAttachments(prev =>
                    prev.filter(a => a.id !== att.id)
                  )}
                  className="absolute -top-1 -right-1 bg-destructive text-white rounded-full w-5 h-5"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>Validate file types and sizes on upload</li>
          <li>Show image previews before sending</li>
          <li>Compress large images to save tokens</li>
          <li>Use detail: "low" for faster responses</li>
          <li>Handle vision API errors gracefully</li>
          <li>Consider costs - vision is more expensive</li>
        </ul>

        <Callout type="warning" title="Token Costs">
          Images use lots of tokens. A 1024x1024 image ≈ 765 tokens. Budget accordingly.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Related Recipes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/cookbook/rag-document-chat" className="docs-card">
            <h3>RAG Documents</h3>
            <p>Combine with document search</p>
          </a>
          <a href="/reference/components/file-upload" className="docs-card">
            <h3>File Upload</h3>
            <p>Component docs</p>
          </a>
        </div>
      </section>
    </div>
  )
}

