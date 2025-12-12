/**
 * Create API Route Command
 * Generates streaming API routes for different providers and frameworks
 */

import * as vscode from 'vscode'

interface ProviderOption {
  label: string
  description: string
  value: string
}

interface FrameworkOption {
  label: string
  description: string
  value: string
  fileName: string
  directory: string
}

const PROVIDERS: ProviderOption[] = [
  { label: 'OpenAI', description: 'GPT-4, GPT-3.5 Turbo', value: 'openai' },
  {
    label: 'Anthropic',
    description: 'Claude 3 Opus, Sonnet, Haiku',
    value: 'anthropic',
  },
  { label: 'Google AI', description: 'Gemini Pro models', value: 'google' },
  {
    label: 'Multi-Provider',
    description: 'Support multiple providers',
    value: 'multi',
  },
]

const FRAMEWORKS: FrameworkOption[] = [
  {
    label: 'Next.js App Router',
    description: 'app/api/chat/route.ts',
    value: 'nextjs-app',
    fileName: 'route.ts',
    directory: 'app/api/chat',
  },
  {
    label: 'Next.js Pages Router',
    description: 'pages/api/chat.ts',
    value: 'nextjs-pages',
    fileName: 'chat.ts',
    directory: 'pages/api',
  },
  {
    label: 'Express',
    description: 'Express.js server',
    value: 'express',
    fileName: 'chat.ts',
    directory: 'src/routes',
  },
  {
    label: 'Hono',
    description: 'Hono web framework',
    value: 'hono',
    fileName: 'chat.ts',
    directory: 'src/routes',
  },
]

export async function createApiRouteCommand(
  context: vscode.ExtensionContext,
  targetUri?: vscode.Uri
) {
  // Get workspace folder
  const workspaceFolders = vscode.workspace.workspaceFolders
  if (!workspaceFolders) {
    vscode.window.showErrorMessage('No workspace folder open')
    return
  }

  // Select provider
  const provider = await vscode.window.showQuickPick(PROVIDERS, {
    placeHolder: 'Select AI provider',
    title: 'Create API Route - Select Provider',
  })

  if (!provider) return

  // Select framework
  const framework = await vscode.window.showQuickPick(FRAMEWORKS, {
    placeHolder: 'Select framework',
    title: 'Create API Route - Select Framework',
  })

  if (!framework) return

  // Ask for streaming preference
  const streaming = await vscode.window.showQuickPick(
    [
      {
        label: 'Streaming',
        description: 'Real-time response streaming (recommended)',
        value: true,
      },
      {
        label: 'Non-streaming',
        description: 'Wait for complete response',
        value: false,
      },
    ],
    {
      placeHolder: 'Select response type',
      title: 'Create API Route - Response Type',
    }
  )

  if (!streaming) return

  // Generate the code
  const code = generateApiRouteCode(
    provider.value,
    framework.value,
    streaming.value
  )

  // Determine the file path
  let targetDir: vscode.Uri
  if (targetUri) {
    targetDir = targetUri
  } else {
    targetDir = vscode.Uri.joinPath(
      workspaceFolders[0].uri,
      framework.directory
    )
  }

  const targetFile = vscode.Uri.joinPath(targetDir, framework.fileName)

  // Create directory if it doesn't exist
  try {
    await vscode.workspace.fs.createDirectory(targetDir)
  } catch {
    // Directory might already exist
  }

  // Check if file exists
  let fileExists = false
  try {
    await vscode.workspace.fs.stat(targetFile)
    fileExists = true
  } catch {
    // File doesn't exist
  }

  if (fileExists) {
    const overwrite = await vscode.window.showWarningMessage(
      `File ${framework.fileName} already exists. Overwrite?`,
      'Overwrite',
      'Cancel'
    )
    if (overwrite !== 'Overwrite') return
  }

  // Write the file
  await vscode.workspace.fs.writeFile(targetFile, Buffer.from(code, 'utf8'))

  // Open the file
  const document = await vscode.workspace.openTextDocument(targetFile)
  await vscode.window.showTextDocument(document)

  // Show success message with next steps
  const action = await vscode.window.showInformationMessage(
    `API route created at ${framework.directory}/${framework.fileName}`,
    'Add Environment Variables',
    'View Documentation'
  )

  if (action === 'Add Environment Variables') {
    vscode.commands.executeCommand('clarity-chat.addProvider')
  } else if (action === 'View Documentation') {
    vscode.env.openExternal(
      vscode.Uri.parse('https://docs.claritychat.dev/api-routes')
    )
  }
}

function generateApiRouteCode(
  provider: string,
  framework: string,
  streaming: boolean
): string {
  switch (framework) {
    case 'nextjs-app':
      return generateNextJsAppRoute(provider, streaming)
    case 'nextjs-pages':
      return generateNextJsPagesRoute(provider, streaming)
    case 'express':
      return generateExpressRoute(provider, streaming)
    case 'hono':
      return generateHonoRoute(provider, streaming)
    default:
      return generateNextJsAppRoute(provider, streaming)
  }
}

function generateNextJsAppRoute(provider: string, streaming: boolean): string {
  if (provider === 'multi') {
    return `import { NextRequest, NextResponse } from 'next/server'
import { OpenAI } from 'openai'
import Anthropic from '@anthropic-ai/sdk'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  const { messages, provider = 'openai', model } = await req.json()

  try {
    if (provider === 'openai') {
      return handleOpenAI(messages, model || 'gpt-4-turbo')
    } else if (provider === 'anthropic') {
      return handleAnthropic(messages, model || 'claude-3-opus-20240229')
    } else {
      return NextResponse.json({ error: 'Unknown provider' }, { status: 400 })
    }
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    )
  }
}

async function handleOpenAI(messages: any[], model: string) {
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      const completion = await openai.chat.completions.create({
        model,
        messages,
        stream: true,
      })

      for await (const chunk of completion) {
        const content = chunk.choices[0]?.delta?.content
        if (content) {
          controller.enqueue(encoder.encode(\`data: \${JSON.stringify({ content })}\\n\\n\`))
        }
      }

      controller.enqueue(encoder.encode('data: [DONE]\\n\\n'))
      controller.close()
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}

async function handleAnthropic(messages: any[], model: string) {
  const encoder = new TextEncoder()
  const systemMessage = messages.find((m: any) => m.role === 'system')?.content || ''
  const claudeMessages = messages
    .filter((m: any) => m.role !== 'system')
    .map((m: any) => ({ role: m.role as 'user' | 'assistant', content: m.content }))

  const stream = new ReadableStream({
    async start(controller) {
      const response = anthropic.messages.stream({
        model,
        max_tokens: 4096,
        system: systemMessage,
        messages: claudeMessages,
      })

      for await (const event of response) {
        if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
          controller.enqueue(encoder.encode(\`data: \${JSON.stringify({ content: event.delta.text })}\\n\\n\`))
        }
      }

      controller.enqueue(encoder.encode('data: [DONE]\\n\\n'))
      controller.close()
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
`
  }

  if (provider === 'anthropic') {
    if (streaming) {
      return `import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const { messages, model = 'claude-3-opus-20240229' } = await req.json()

    const systemMessage = messages.find((m: any) => m.role === 'system')?.content || ''
    const claudeMessages = messages
      .filter((m: any) => m.role !== 'system')
      .map((m: any) => ({ role: m.role as 'user' | 'assistant', content: m.content }))

    const encoder = new TextEncoder()

    const stream = new ReadableStream({
      async start(controller) {
        const response = anthropic.messages.stream({
          model,
          max_tokens: 4096,
          system: systemMessage,
          messages: claudeMessages,
        })

        for await (const event of response) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            const content = event.delta.text
            controller.enqueue(encoder.encode(\`data: \${JSON.stringify({ content })}\\n\\n\`))
          }
        }

        controller.enqueue(encoder.encode('data: [DONE]\\n\\n'))
        controller.close()
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Chat error:', error)
    return Response.json({ error: 'Failed to generate response' }, { status: 500 })
  }
}
`
    } else {
      return `import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const { messages, model = 'claude-3-opus-20240229' } = await req.json()

    const systemMessage = messages.find((m: any) => m.role === 'system')?.content || ''
    const claudeMessages = messages
      .filter((m: any) => m.role !== 'system')
      .map((m: any) => ({ role: m.role as 'user' | 'assistant', content: m.content }))

    const response = await anthropic.messages.create({
      model,
      max_tokens: 4096,
      system: systemMessage,
      messages: claudeMessages,
    })

    return NextResponse.json({
      content: response.content[0].type === 'text' ? response.content[0].text : '',
      usage: response.usage,
    })
  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 })
  }
}
`
    }
  }

  if (provider === 'google') {
    if (streaming) {
      return `import { NextRequest } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '')

export async function POST(req: NextRequest) {
  try {
    const { messages, model = 'gemini-pro' } = await req.json()

    const geminiModel = genAI.getGenerativeModel({ model })

    // Convert messages to Gemini format
    const history = messages
      .filter((m: any) => m.role !== 'system')
      .map((m: any) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }))

    const lastMessage = history.pop()
    const chat = geminiModel.startChat({ history })

    const encoder = new TextEncoder()

    const stream = new ReadableStream({
      async start(controller) {
        const result = await chat.sendMessageStream(lastMessage?.parts[0].text || '')

        for await (const chunk of result.stream) {
          const content = chunk.text()
          if (content) {
            controller.enqueue(encoder.encode(\`data: \${JSON.stringify({ content })}\\n\\n\`))
          }
        }

        controller.enqueue(encoder.encode('data: [DONE]\\n\\n'))
        controller.close()
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Chat error:', error)
    return Response.json({ error: 'Failed to generate response' }, { status: 500 })
  }
}
`
    } else {
      return `import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '')

export async function POST(req: NextRequest) {
  try {
    const { messages, model = 'gemini-pro' } = await req.json()

    const geminiModel = genAI.getGenerativeModel({ model })

    // Convert messages to Gemini format
    const history = messages
      .filter((m: any) => m.role !== 'system')
      .map((m: any) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }))

    const lastMessage = history.pop()
    const chat = geminiModel.startChat({ history })

    const result = await chat.sendMessage(lastMessage?.parts[0].text || '')
    const response = await result.response

    return NextResponse.json({
      content: response.text(),
    })
  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 })
  }
}
`
    }
  }

  // Default: OpenAI
  if (streaming) {
    return `import { NextRequest } from 'next/server'
import { OpenAI } from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const { messages, model = 'gpt-4-turbo' } = await req.json()

    const encoder = new TextEncoder()

    const stream = new ReadableStream({
      async start(controller) {
        const completion = await openai.chat.completions.create({
          model,
          messages,
          stream: true,
        })

        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content
          if (content) {
            controller.enqueue(encoder.encode(\`data: \${JSON.stringify({ content })}\\n\\n\`))
          }
        }

        controller.enqueue(encoder.encode('data: [DONE]\\n\\n'))
        controller.close()
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Chat error:', error)
    return Response.json({ error: 'Failed to generate response' }, { status: 500 })
  }
}
`
  } else {
    return `import { NextRequest, NextResponse } from 'next/server'
import { OpenAI } from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const { messages, model = 'gpt-4-turbo' } = await req.json()

    const response = await openai.chat.completions.create({
      model,
      messages,
    })

    return NextResponse.json({
      content: response.choices[0].message.content,
      usage: response.usage,
    })
  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 })
  }
}
`
  }
}

function generateNextJsPagesRoute(
  provider: string,
  streaming: boolean
): string {
  // Similar implementation for pages router
  return `import type { NextApiRequest, NextApiResponse } from 'next'
import { OpenAI } from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { messages, model = 'gpt-4-turbo' } = req.body

${
  streaming
    ? `    // Set up SSE headers
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    const stream = await openai.chat.completions.create({
      model,
      messages,
      stream: true,
    })

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content
      if (content) {
        res.write(\`data: \${JSON.stringify({ content })}\\n\\n\`)
      }
    }

    res.write('data: [DONE]\\n\\n')
    res.end()`
    : `    const response = await openai.chat.completions.create({
      model,
      messages,
    })

    res.status(200).json({
      content: response.choices[0].message.content,
      usage: response.usage,
    })`
}
  } catch (error) {
    console.error('Chat error:', error)
    res.status(500).json({ error: 'Failed to generate response' })
  }
}
`
}

function generateExpressRoute(provider: string, streaming: boolean): string {
  return `import express from 'express'
import { OpenAI } from 'openai'

const router = express.Router()

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

router.post('/chat', async (req, res) => {
  try {
    const { messages, model = 'gpt-4-turbo' } = req.body

${
  streaming
    ? `    // Set up SSE headers
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    const stream = await openai.chat.completions.create({
      model,
      messages,
      stream: true,
    })

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content
      if (content) {
        res.write(\`data: \${JSON.stringify({ content })}\\n\\n\`)
      }
    }

    res.write('data: [DONE]\\n\\n')
    res.end()`
    : `    const response = await openai.chat.completions.create({
      model,
      messages,
    })

    res.json({
      content: response.choices[0].message.content,
      usage: response.usage,
    })`
}
  } catch (error) {
    console.error('Chat error:', error)
    res.status(500).json({ error: 'Failed to generate response' })
  }
})

export default router
`
}

function generateHonoRoute(provider: string, streaming: boolean): string {
  return `import { Hono } from 'hono'
import { streamSSE } from 'hono/streaming'
import { OpenAI } from 'openai'

const app = new Hono()

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

app.post('/chat', async (c) => {
  const { messages, model = 'gpt-4-turbo' } = await c.req.json()

  try {
${
  streaming
    ? `    return streamSSE(c, async (stream) => {
      const completion = await openai.chat.completions.create({
        model,
        messages,
        stream: true,
      })

      for await (const chunk of completion) {
        const content = chunk.choices[0]?.delta?.content
        if (content) {
          await stream.writeSSE({ data: JSON.stringify({ content }) })
        }
      }

      await stream.writeSSE({ data: '[DONE]' })
    })`
    : `    const response = await openai.chat.completions.create({
      model,
      messages,
    })

    return c.json({
      content: response.choices[0].message.content,
      usage: response.usage,
    })`
}
  } catch (error) {
    console.error('Chat error:', error)
    return c.json({ error: 'Failed to generate response' }, 500)
  }
})

export default app
`
}
