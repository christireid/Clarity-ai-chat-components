# Next.js App Router Integration Guide

Complete guide for integrating Clarity AI Chat Components with Next.js 14+ App Router, featuring Server Components, Client Components, Server Actions, and modern Next.js patterns.

## Table of Contents

- [Quick Start](#quick-start)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Server vs Client Components](#server-vs-client-components)
- [Component Examples](#component-examples)
  - [CommandPalette in Root Layout](#commandpalette-in-root-layout)
  - [AudioRecorder in Client Components](#audiorecorder-in-client-components)
  - [Chat Interface with Streaming](#chat-interface-with-streaming)
- [Styling with OKLCH Colors](#styling-with-oklch-colors)
- [Server Actions](#server-actions)
- [Route Handlers](#route-handlers)
- [Performance Optimization](#performance-optimization)
- [Deployment](#deployment)

---

## Quick Start

Get a chat interface running in your Next.js app in 5 minutes.

### 1. Install Dependencies

```bash
npm install @clarity-chat/react framer-motion lucide-react zod
# or
pnpm add @clarity-chat/react framer-motion lucide-react zod
```

### 2. Add Styles to Root Layout

```tsx
// app/layout.tsx
import '@clarity-chat/react/styles.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My AI Chat App',
  description: 'Powered by Clarity AI Chat Components',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

### 3. Create Chat Page

```tsx
// app/chat/page.tsx
import { ClarityChatApp } from '@clarity-chat/react'

export default function ChatPage() {
  return (
    <div className="h-screen">
      <ClarityChatApp
        api="/api/chat"
        features={{ memory: true }}
        placeholder="Ask me anything..."
      />
    </div>
  )
}
```

### 4. Create API Route

```tsx
// app/api/chat/route.ts
import { StreamingTextResponse } from 'ai'
import { OpenAIStream } from 'ai'

export const runtime = 'edge'

export async function POST(req: Request) {
  const { messages } = await req.json()

  // Your AI logic here
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages,
      stream: true,
    }),
  })

  const stream = OpenAIStream(response)
  return new StreamingTextResponse(stream)
}
```

---

## Installation

### Core Dependencies

```bash
# Required
npm install @clarity-chat/react framer-motion lucide-react zod

# Optional but recommended
npm install ai @vercel/ai
```

### TypeScript Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "preserve",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

---

## Project Structure

Recommended Next.js 14+ App Router structure with Clarity components:

```
my-nextjs-app/
├── app/
│   ├── layout.tsx                 # Root layout with styles
│   ├── page.tsx                   # Home page
│   ├── chat/
│   │   ├── layout.tsx            # Chat layout (optional)
│   │   └── page.tsx              # Main chat page
│   ├── api/
│   │   ├── chat/
│   │   │   └── route.ts          # Chat API route
│   │   └── audio/
│   │       └── route.ts          # Audio processing route
│   └── globals.css               # Global styles with OKLCH
├── components/
│   ├── chat/
│   │   ├── ChatInterface.tsx     # Client component
│   │   ├── MessageList.tsx       # Client component
│   │   └── ChatInput.tsx         # Client component
│   ├── command/
│   │   └── CommandPaletteProvider.tsx  # Client provider
│   └── audio/
│       └── VoiceInput.tsx        # Client component
├── lib/
│   ├── ai/
│   │   └── streaming.ts          # AI utilities
│   └── utils.ts                  # Helper functions
└── package.json
```

---

## Server vs Client Components

Understanding when to use Server Components vs Client Components with Clarity.

### Server Components (Default)

Use Server Components for:
- Layouts without interactivity
- Data fetching
- Static content
- SEO optimization

```tsx
// app/chat/layout.tsx (Server Component)
import type { ReactNode } from 'react'

export default function ChatLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen flex-col">
      <header className="border-b bg-card px-6 py-4">
        <h1 className="text-2xl font-bold">AI Chat Assistant</h1>
      </header>
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  )
}
```

### Client Components

Use Client Components for:
- Interactive UI (all Clarity components)
- Browser APIs (audio, localStorage)
- Event handlers
- State management

```tsx
// components/chat/ChatInterface.tsx
'use client'

import { ClarityChatApp } from '@clarity-chat/react'
import { useState } from 'react'

export function ChatInterface() {
  const [apiKey, setApiKey] = useState('')

  return (
    <ClarityChatApp
      api="/api/chat"
      headers={{ 'X-API-Key': apiKey }}
      onError={(error) => console.error('Chat error:', error)}
    />
  )
}
```

### Mixing Patterns

```tsx
// app/chat/page.tsx (Server Component)
import { ChatInterface } from '@/components/chat/ChatInterface'

export default function ChatPage() {
  // Server-side data fetching
  const initialData = await fetchInitialData()

  return (
    <div className="h-full">
      {/* Client component receives server data */}
      <ChatInterface initialMessages={initialData.messages} />
    </div>
  )
}
```

---

## Component Examples

### CommandPalette in Root Layout

Add a global command palette accessible throughout your app.

#### 1. Create Provider Component

```tsx
// components/command/CommandPaletteProvider.tsx
'use client'

import { CommandPalette, type CommandItem } from '@clarity-chat/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import {
  Home,
  MessageSquare,
  Settings,
  FileText,
  Search,
} from 'lucide-react'

export function CommandPaletteProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  // Listen for Cmd+K / Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const commands: CommandItem[] = [
    {
      id: 'home',
      label: 'Home',
      description: 'Go to home page',
      icon: <Home className="h-4 w-4" />,
      shortcut: ['⌘', 'H'],
      category: 'Navigation',
      onSelect: () => router.push('/'),
    },
    {
      id: 'chat',
      label: 'Chat',
      description: 'Open AI chat interface',
      icon: <MessageSquare className="h-4 w-4" />,
      shortcut: ['⌘', 'C'],
      category: 'Navigation',
      onSelect: () => router.push('/chat'),
    },
    {
      id: 'docs',
      label: 'Documentation',
      description: 'View documentation',
      icon: <FileText className="h-4 w-4" />,
      category: 'Resources',
      onSelect: () => router.push('/docs'),
    },
    {
      id: 'search',
      label: 'Search',
      description: 'Search across all content',
      icon: <Search className="h-4 w-4" />,
      shortcut: ['⌘', 'F'],
      category: 'Actions',
      onSelect: () => {
        // Implement search
        console.log('Search triggered')
      },
    },
    {
      id: 'settings',
      label: 'Settings',
      description: 'Open settings panel',
      icon: <Settings className="h-4 w-4" />,
      shortcut: ['⌘', ','],
      category: 'Navigation',
      onSelect: () => router.push('/settings'),
    },
  ]

  return (
    <>
      {children}
      <CommandPalette
        items={commands}
        open={open}
        onClose={() => setOpen(false)}
        placeholder="Type a command or search..."
        aria-label="Command palette"
        aiContext={{
          modelName: 'GPT-4',
          tokenUsage: { total: 1234 },
        }}
      />
    </>
  )
}
```

#### 2. Add to Root Layout

```tsx
// app/layout.tsx
import '@clarity-chat/react/styles.css'
import './globals.css'
import { CommandPaletteProvider } from '@/components/command/CommandPaletteProvider'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <CommandPaletteProvider>{children}</CommandPaletteProvider>
      </body>
    </html>
  )
}
```

#### 3. Usage in Pages

The command palette is now globally accessible with `Cmd+K` or `Ctrl+K`.

```tsx
// Any page can trigger it programmatically
'use client'

import { Button } from '@/components/ui/button'

export default function SomePage() {
  return (
    <div>
      <p>Press ⌘K to open command palette</p>
      <Button
        onClick={() => {
          // Trigger programmatically by dispatching the keyboard event
          document.dispatchEvent(
            new KeyboardEvent('keydown', { key: 'k', metaKey: true })
          )
        }}
      >
        Open Command Palette
      </Button>
    </div>
  )
}
```

---

### AudioRecorder in Client Components

Add voice input to your chat interface.

#### 1. Create Voice Input Component

```tsx
// components/audio/VoiceInput.tsx
'use client'

import { AudioRecorder } from '@clarity-chat/react'
import { useState } from 'react'
import { toast } from 'sonner'

export function VoiceInput({ onTranscription }: { onTranscription: (text: string) => void }) {
  const [isProcessing, setIsProcessing] = useState(false)

  const handleRecordingStop = async (audioBlob: Blob, audioUrl: string) => {
    setIsProcessing(true)

    try {
      // Send audio to transcription API
      const formData = new FormData()
      formData.append('audio', audioBlob, 'recording.webm')

      const response = await fetch('/api/audio/transcribe', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Transcription failed')
      }

      const { text } = await response.json()
      onTranscription(text)
      toast.success('Voice transcribed successfully')
    } catch (error) {
      console.error('Transcription error:', error)
      toast.error('Failed to transcribe audio')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="rounded-lg border bg-card p-4">
      <h3 className="mb-4 text-lg font-semibold">Voice Input</h3>
      <AudioRecorder
        maxDuration={60}
        outputFormat="webm"
        enableNoiseCancellation={true}
        onStop={handleRecordingStop}
        onError={(error) => {
          console.error('Recording error:', error)
          toast.error('Recording failed: ' + error.message)
        }}
        showWaveform={true}
        showDuration={true}
        showAmplitudeMeter={true}
        pausable={true}
        disabled={isProcessing}
      />
      {isProcessing && (
        <div className="mt-4 text-center text-sm text-muted-foreground">
          Transcribing audio...
        </div>
      )}
    </div>
  )
}
```

#### 2. Integrate with Chat

```tsx
// app/chat/page.tsx
'use client'

import { ClarityChatApp } from '@clarity-chat/react'
import { VoiceInput } from '@/components/audio/VoiceInput'
import { useState } from 'react'

export default function ChatPage() {
  const [messages, setMessages] = useState([])

  const handleTranscription = (text: string) => {
    // Add transcribed text to chat
    setMessages((prev) => [...prev, { role: 'user', content: text }])
  }

  return (
    <div className="grid h-screen grid-cols-1 gap-4 p-4 lg:grid-cols-3">
      {/* Main chat - 2/3 width on desktop */}
      <div className="lg:col-span-2">
        <ClarityChatApp
          api="/api/chat"
          initialMessages={messages}
          placeholder="Type or speak your message..."
        />
      </div>

      {/* Voice input sidebar - 1/3 width on desktop */}
      <div className="hidden lg:block">
        <VoiceInput onTranscription={handleTranscription} />
      </div>
    </div>
  )
}
```

#### 3. Create Transcription API Route

```tsx
// app/api/audio/transcribe/route.ts
import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get('audio') as File

    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      )
    }

    // Convert File to Buffer for OpenAI
    const arrayBuffer = await audioFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Transcribe with OpenAI Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: new File([buffer], 'audio.webm', { type: audioFile.type }),
      model: 'whisper-1',
      language: 'en',
    })

    return NextResponse.json({ text: transcription.text })
  } catch (error) {
    console.error('Transcription error:', error)
    return NextResponse.json(
      { error: 'Transcription failed' },
      { status: 500 }
    )
  }
}
```

---

### Chat Interface with Streaming

Complete example with streaming responses, error handling, and loading states.

#### 1. Chat Interface Component

```tsx
// components/chat/StreamingChat.tsx
'use client'

import { ClarityChatApp } from '@clarity-chat/react'
import { useChat } from 'ai/react'
import { Loader2 } from 'lucide-react'

export function StreamingChat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } =
    useChat({
      api: '/api/chat',
      onError: (error) => {
        console.error('Chat error:', error)
      },
    })

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <p className="text-sm text-destructive">
            Error: {error.message}
          </p>
        </div>
      </div>
    )
  }

  return (
    <ClarityChatApp
      api="/api/chat"
      initialMessages={messages}
      placeholder="Ask me anything..."
      features={{
        memory: true,
        streaming: true,
        markdown: true,
        codeHighlighting: true,
      }}
      onMessageSent={(message) => {
        console.log('Message sent:', message)
      }}
      renderCustomLoader={() => (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Thinking...</span>
        </div>
      )}
    />
  )
}
```

#### 2. Chat Page with Suspense

```tsx
// app/chat/page.tsx
import { Suspense } from 'react'
import { StreamingChat } from '@/components/chat/StreamingChat'
import { Skeleton } from '@/components/ui/skeleton'

function ChatSkeleton() {
  return (
    <div className="flex h-screen flex-col p-4">
      <Skeleton className="mb-4 h-16 w-full" />
      <Skeleton className="mb-2 h-20 w-3/4" />
      <Skeleton className="mb-2 h-20 w-2/3 self-end" />
      <Skeleton className="mb-4 h-20 w-3/4" />
      <Skeleton className="mt-auto h-12 w-full" />
    </div>
  )
}

export default function ChatPage() {
  return (
    <div className="h-screen">
      <Suspense fallback={<ChatSkeleton />}>
        <StreamingChat />
      </Suspense>
    </div>
  )
}
```

#### 3. Streaming API Route

```tsx
// app/api/chat/route.ts
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { Configuration, OpenAIApi } from 'openai-edge'

// Enable Edge Runtime for streaming
export const runtime = 'edge'

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(config)

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    const response = await openai.createChatCompletion({
      model: 'gpt-4',
      stream: true,
      messages: messages.map((message: any) => ({
        role: message.role,
        content: message.content,
      })),
      temperature: 0.7,
      max_tokens: 500,
    })

    const stream = OpenAIStream(response)
    return new StreamingTextResponse(stream)
  } catch (error) {
    console.error('Chat API error:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}
```

---

## Styling with OKLCH Colors

Clarity uses modern OKLCH colors for perceptual uniformity. Here's how to integrate them in Next.js.

### 1. Global CSS Setup

```css
/* app/globals.css */
@import '@clarity-chat/react/styles.css';

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* OKLCH color system - perceptually uniform */
    --background: 0 0% 100%;
    --foreground: 222 47% 11%;

    /* AI-specific colors (OKLCH format) */
    --ai-assistant: oklch(96% 0.02 220); /* Light blue-gray */
    --ai-user: oklch(92% 0.06 260);      /* Soft blue-purple */
    --ai-system: oklch(95% 0.03 180);    /* Light cyan */
    --ai-thinking: oklch(94% 0.04 280);  /* Soft purple */
    --ai-tool: oklch(93% 0.05 160);      /* Soft green */
    --ai-error: oklch(91% 0.12 25);      /* Warm red */

    /* Brand colors */
    --brand-500: oklch(65% 0.25 265);    /* Primary brand */
    --brand-600: oklch(55% 0.25 265);    /* Hover state */
  }

  .dark {
    --background: 222 47% 11%;
    --foreground: 210 40% 96%;

    /* AI colors - dark mode */
    --ai-assistant: oklch(25% 0.04 220);
    --ai-user: oklch(30% 0.08 260);
    --ai-system: oklch(22% 0.05 180);
    --ai-thinking: oklch(28% 0.06 280);
    --ai-tool: oklch(27% 0.07 160);
    --ai-error: oklch(35% 0.15 25);
  }
}

/* Glass effect utilities */
@layer utilities {
  .glass-panel {
    background: oklch(from var(--background) l c h / 0.8);
    backdrop-filter: blur(12px) saturate(1.5);
    -webkit-backdrop-filter: blur(12px) saturate(1.5);
    border: 1px solid oklch(from var(--border) l c h / 0.2);
  }

  .glass-glow {
    box-shadow: 0 0 20px oklch(70% 0.15 265 / 0.3);
  }
}
```

### 2. Using OKLCH in Components

```tsx
// components/ui/MessageBubble.tsx
'use client'

import { cn } from '@/lib/utils'

interface MessageBubbleProps {
  role: 'user' | 'assistant' | 'system'
  children: React.ReactNode
}

export function MessageBubble({ role, children }: MessageBubbleProps) {
  return (
    <div
      className={cn(
        'rounded-lg px-4 py-3 shadow-sm',
        role === 'user' && 'bg-[var(--ai-user)] text-foreground',
        role === 'assistant' && 'bg-[var(--ai-assistant)] text-foreground',
        role === 'system' && 'bg-[var(--ai-system)] text-muted-foreground'
      )}
    >
      {children}
    </div>
  )
}
```

### 3. Tailwind Configuration

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        // AI-specific colors (OKLCH format)
        ai: {
          assistant: 'var(--ai-assistant)',
          user: 'var(--ai-user)',
          system: 'var(--ai-system)',
          thinking: 'var(--ai-thinking)',
          tool: 'var(--ai-tool)',
          error: 'var(--ai-error)',
        },
        brand: {
          500: 'var(--brand-500)',
          600: 'var(--brand-600)',
        },
      },
      // Glass effect utilities
      backgroundImage: {
        'glass-pastel-blue':
          'linear-gradient(135deg, oklch(95% 0.02 240) 0%, oklch(97% 0.015 260) 100%)',
        'glass-pastel-purple':
          'linear-gradient(135deg, oklch(95% 0.025 280) 0%, oklch(97% 0.02 300) 100%)',
      },
    },
  },
}
```

---

## Server Actions

Use Server Actions for mutations and form handling.

### 1. Save Chat History

```tsx
// app/actions/chat.ts
'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'

export async function saveChatHistory(
  userId: string,
  conversationId: string,
  messages: any[]
) {
  try {
    await db.conversation.update({
      where: { id: conversationId },
      data: {
        messages: {
          createMany: {
            data: messages.map((msg) => ({
              role: msg.role,
              content: msg.content,
              timestamp: new Date(),
            })),
          },
        },
      },
    })

    revalidatePath(`/chat/${conversationId}`)

    return { success: true }
  } catch (error) {
    console.error('Failed to save chat:', error)
    return { success: false, error: 'Failed to save chat history' }
  }
}
```

### 2. Delete Message

```tsx
// app/actions/messages.ts
'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'

export async function deleteMessage(messageId: string, conversationId: string) {
  try {
    await db.message.delete({
      where: { id: messageId },
    })

    revalidatePath(`/chat/${conversationId}`)

    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete message' }
  }
}
```

### 3. Using Server Actions in Components

```tsx
// components/chat/ChatWithActions.tsx
'use client'

import { ClarityChatApp } from '@clarity-chat/react'
import { saveChatHistory, deleteMessage } from '@/app/actions/chat'
import { useTransition } from 'react'
import { toast } from 'sonner'

export function ChatWithActions({ userId, conversationId }: Props) {
  const [isPending, startTransition] = useTransition()

  const handleSave = async (messages: any[]) => {
    startTransition(async () => {
      const result = await saveChatHistory(userId, conversationId, messages)
      if (result.success) {
        toast.success('Chat saved')
      } else {
        toast.error(result.error)
      }
    })
  }

  const handleDelete = async (messageId: string) => {
    startTransition(async () => {
      const result = await deleteMessage(messageId, conversationId)
      if (result.success) {
        toast.success('Message deleted')
      } else {
        toast.error(result.error)
      }
    })
  }

  return (
    <ClarityChatApp
      api="/api/chat"
      onMessageSent={(message) => handleSave([message])}
      renderMessageActions={(message) => (
        <button
          onClick={() => handleDelete(message.id)}
          disabled={isPending}
          className="text-sm text-destructive hover:underline"
        >
          Delete
        </button>
      )}
    />
  )
}
```

---

## Route Handlers

Modern API routes with proper error handling and validation.

### 1. Chat Route with Validation

```tsx
// app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { OpenAIStream, StreamingTextResponse } from 'ai'

export const runtime = 'edge'

const messageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string().min(1),
})

const requestSchema = z.object({
  messages: z.array(messageSchema),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().min(1).max(4000).optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Validate request
    const validatedData = requestSchema.parse(body)

    // Check authentication
    const apiKey = req.headers.get('Authorization')
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Call AI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: apiKey,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: validatedData.messages,
        temperature: validatedData.temperature ?? 0.7,
        max_tokens: validatedData.maxTokens ?? 500,
        stream: true,
      }),
    })

    if (!response.ok) {
      throw new Error('AI API request failed')
    }

    const stream = OpenAIStream(response)
    return new StreamingTextResponse(stream)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### 2. Rate Limited Route

```tsx
// app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 requests per minute
})

export async function POST(req: NextRequest) {
  // Check rate limit
  const ip = req.ip ?? '127.0.0.1'
  const { success, limit, reset, remaining } = await ratelimit.limit(ip)

  if (!success) {
    return NextResponse.json(
      {
        error: 'Rate limit exceeded',
        limit,
        reset,
        remaining,
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString(),
        },
      }
    )
  }

  // Process request...
}
```

---

## Performance Optimization

Optimize your Next.js app for production.

### 1. Dynamic Imports

```tsx
// app/chat/page.tsx
import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton'

// Lazy load heavy components
const ClarityChatApp = dynamic(
  () => import('@clarity-chat/react').then((mod) => mod.ClarityChatApp),
  {
    loading: () => <Skeleton className="h-screen w-full" />,
    ssr: false, // Disable SSR for client-only components
  }
)

const AudioRecorder = dynamic(
  () => import('@clarity-chat/react').then((mod) => mod.AudioRecorder),
  {
    loading: () => <Skeleton className="h-64 w-full" />,
    ssr: false,
  }
)

export default function ChatPage() {
  return (
    <div className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <ClarityChatApp api="/api/chat" />
      </div>
      <div className="hidden lg:block">
        <AudioRecorder onStop={(blob) => console.log(blob)} />
      </div>
    </div>
  )
}
```

### 2. Streaming with Suspense

```tsx
// app/chat/[id]/page.tsx
import { Suspense } from 'react'
import { ChatHistory } from '@/components/chat/ChatHistory'
import { Skeleton } from '@/components/ui/skeleton'

async function getChatHistory(id: string) {
  const res = await fetch(`/api/chat/${id}/history`, {
    cache: 'no-store', // Always fresh data
  })
  return res.json()
}

export default async function ChatDetailPage({
  params,
}: {
  params: { id: string }
}) {
  return (
    <div>
      <h1>Chat: {params.id}</h1>
      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <ChatHistoryLoader id={params.id} />
      </Suspense>
    </div>
  )
}

async function ChatHistoryLoader({ id }: { id: string }) {
  const history = await getChatHistory(id)
  return <ChatHistory messages={history.messages} />
}
```

### 3. Caching Strategies

```tsx
// app/chat/page.tsx
import { ClarityChatApp } from '@clarity-chat/react'

// Static page - generated at build time
export const dynamic = 'force-static'

// Revalidate every hour
export const revalidate = 3600

// Streaming SSR
export const dynamic = 'force-dynamic'

// Edge runtime for lower latency
export const runtime = 'edge'
```

---

## Deployment

Deploy your Next.js app with Clarity components.

### Vercel Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Environment variables
vercel env add OPENAI_API_KEY
```

### Environment Variables

```env
# .env.local
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
```

### Build Configuration

```js
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode
  reactStrictMode: true,

  // Optimize images
  images: {
    domains: ['your-cdn.com'],
  },

  // Bundle analyzer
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      }
    }
    return config
  },

  // Experimental features
  experimental: {
    // Enable Server Actions
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
}

module.exports = nextConfig
```

---

## Best Practices

1. **Use 'use client' directive** - Mark all components using Clarity as client components
2. **Lazy load heavy components** - Use dynamic imports for better performance
3. **Stream responses** - Use streaming for better UX with AI responses
4. **Error boundaries** - Wrap client components in error boundaries
5. **Validate API inputs** - Always validate with Zod or similar
6. **Rate limiting** - Protect your API routes from abuse
7. **Environment variables** - Never expose API keys in client code
8. **Type safety** - Use TypeScript strictly
9. **Accessibility** - Test with keyboard navigation
10. **Testing** - Write tests for critical user flows

---

## Troubleshooting

### "use client" Errors

If you see errors about hooks or browser APIs:

```tsx
// Add 'use client' to the top of the file
'use client'

import { ClarityChatApp } from '@clarity-chat/react'
```

### Module Not Found

If imports fail, check your tsconfig.json paths:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### Hydration Errors

If you get hydration mismatches, disable SSR for client-only components:

```tsx
const ClarityChatApp = dynamic(
  () => import('@clarity-chat/react').then((mod) => mod.ClarityChatApp),
  { ssr: false }
)
```

---

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Clarity React Docs](https://clarity-chat.dev/docs)
- [Vercel AI SDK](https://sdk.vercel.ai/docs)
- [OKLCH Color Picker](https://oklch.com)

---

**Built with Clarity AI Chat Components** • [GitHub](https://github.com/christireid/Clarity-ai-chat-components) • [Documentation](https://clarity-chat.dev)
