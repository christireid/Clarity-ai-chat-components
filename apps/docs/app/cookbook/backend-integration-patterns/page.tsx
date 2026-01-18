import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { Pagination } from '@/components/Navigation/Pagination'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'Backend Integration Patterns | Clarity Chat Cookbook',
  description:
    'Learn backend integration patterns for different frameworks and architectures.',
}

export default function BackendIntegrationPatternsPage() {
  return (
    <>
      <Breadcrumbs />

      <h1>Backend Integration Patterns</h1>

      <p className="lead">
        Learn how to integrate Clarity Chat with different backend frameworks
        and architectures. Patterns for Express, FastAPI, NestJS, and more.
      </p>

      <Callout type="info" title="Backend Flexibility">
        <p>
          Clarity Chat works with any backend that can handle HTTP requests and
          return streaming responses. These patterns show how to integrate with
          popular frameworks.
        </p>
      </Callout>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Express.js</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Complete Express.js integration:
        </p>

        <EnhancedCodeBlock
          language="tsx"
          code={`// server.js
const express = require('express')
const OpenAI = require('openai')
const app = express()

app.use(express.json())
app.use(cors())

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format' })
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OPENAI_API_KEY not configured' })
    }

    // Set up SSE headers
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')
    res.setHeader('Access-Control-Allow-Origin', '*')

    // Create streaming response
    const stream = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4',
      messages,
      stream: true,
    })

    // Stream chunks to client
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content
      if (content) {
        res.write(\`data: \${content}\\n\\n\`)
      }
    }

    res.end()
  } catch (error) {
    console.error('Chat API error:', error)
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal server error' })
    }
  }
})

app.listen(3000, () => {
  logger.debug('Server running on http://localhost:3000')
})`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">FastAPI (Python)</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          FastAPI streaming endpoint:
        </p>

        <EnhancedCodeBlock
          language="python"
          code={`# main.py
from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
import os
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@app.post("/api/chat")
async def chat(request: Request):
    try:
        body = await request.json()
        messages = body.get("messages", [])

        if not messages or not isinstance(messages, list):
            return {"error": "Invalid messages format"}, 400

        if not os.getenv("OPENAI_API_KEY"):
            return {"error": "OPENAI_API_KEY not configured"}, 500

        # Create streaming response
        stream = openai_client.chat.completions.create(
            model=os.getenv("OPENAI_MODEL", "gpt-4"),
            messages=messages,
            stream=True,
        )

        async def generate():
            for chunk in stream:
                content = chunk.choices[0].delta.content
                if content:
                    yield f"data: {content}\\n\\n"

        return StreamingResponse(
            generate(),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
            }
        )
    except Exception as e:
        print(f"Chat API error: {e}")
        return {"error": "Internal server error"}, 500`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">NestJS</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          NestJS controller with streaming:
        </p>

        <EnhancedCodeBlock
          language="tsx"
          code={`// chat.controller.ts
import { Controller, Post, Body, Res } from '@nestjs/common'
import { Response } from 'express'
import { ChatService } from './chat.service'

@Controller('api/chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async chat(@Body() body: { messages: any[] }, @Res() res: Response) {
    try {
      const { messages } = body

      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: 'Invalid messages format' })
      }

      // Set up SSE headers
      res.setHeader('Content-Type', 'text/event-stream')
      res.setHeader('Cache-Control', 'no-cache')
      res.setHeader('Connection', 'keep-alive')

      // Stream response
      const stream = await this.chatService.createStream(messages)

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content
        if (content) {
          res.write(\`data: \${content}\\n\\n\`)
        }
      }

      res.end()
    } catch (error) {
      console.error('Chat API error:', error)
      if (!res.headersSent) {
        res.status(500).json({ error: 'Internal server error' })
      }
    }
  }
}

// chat.service.ts
import { Injectable } from '@nestjs/common'
import OpenAI from 'openai'

@Injectable()
export class ChatService {
  private openai: OpenAI

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }

  async createStream(messages: any[]) {
    return this.openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4',
      messages,
      stream: true,
    })
  }
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Authentication</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Add authentication to your endpoints:
        </p>

        <EnhancedCodeBlock
          language="tsx"
          code={`// Express.js with JWT
const jwt = require('jsonwebtoken')

app.post('/api/chat', authenticateToken, async (req, res) => {
  // req.user is set by authenticateToken middleware
  const userId = req.user.id

  // ... streaming logic
})

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Forbidden' })
    }
    req.user = user
    next()
  })
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Rate Limiting</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Implement rate limiting:
        </p>

        <EnhancedCodeBlock
          language="tsx"
          code={`// Express.js with express-rate-limit
const rateLimit = require('express-rate-limit')

const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
})

app.post('/api/chat', chatLimiter, async (req, res) => {
  // ... streaming logic
})`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Error Handling</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Comprehensive error handling:
        </p>

        <EnhancedCodeBlock
          language="tsx"
          code={`app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body

    // Validation
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format' })
    }

    if (messages.length === 0) {
      return res.status(400).json({ error: 'Messages array cannot be empty' })
    }

    // Check API key
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OPENAI_API_KEY not configured' })
    }

    // Create stream
    const stream = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4',
      messages,
      stream: true,
    })

    // Handle stream errors
    stream.on('error', (error) => {
      console.error('Stream error:', error)
      if (!res.headersSent) {
        res.status(500).json({ error: 'Stream error occurred' })
      }
    })

    // Stream response
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content
      if (content) {
        res.write(\`data: \${content}\\n\\n\`)
      }
    }

    res.end()
  } catch (error) {
    console.error('Chat API error:', error)

    // Handle specific error types
    if (error.status === 429) {
      return res.status(429).json({ error: 'Rate limit exceeded' })
    }

    if (error.status === 401) {
      return res.status(401).json({ error: 'Invalid API key' })
    }

    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal server error' })
    }
  }
})`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Logging and Monitoring</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Add logging and monitoring:
        </p>

        <EnhancedCodeBlock
          language="tsx"
          code={`// Express.js with Winston
const winston = require('winston')

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
})

app.post('/api/chat', async (req, res) => {
  const startTime = Date.now()
  const requestId = generateId()

  logger.info('Chat request started', {
    requestId,
    userId: req.user?.id,
    messageCount: req.body.messages?.length,
  })

  try {
    // ... streaming logic

    const duration = Date.now() - startTime
    logger.info('Chat request completed', {
      requestId,
      duration,
      success: true,
    })
  } catch (error) {
    const duration = Date.now() - startTime
    logger.error('Chat request failed', {
      requestId,
      duration,
      error: error.message,
    })
    throw error
  }
})`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Best Practices</h2>
        <ul className="list-disc list-inside mb-4 space-y-2 text-gray-600 dark:text-gray-400">
          <li>
            <strong>Validate inputs</strong> - Always validate message format
            and content
          </li>
          <li>
            <strong>Handle errors gracefully</strong> - Return user-friendly
            error messages
          </li>
          <li>
            <strong>Implement rate limiting</strong> - Prevent abuse and control
            costs
          </li>
          <li>
            <strong>Add authentication</strong> - Secure your endpoints
          </li>
          <li>
            <strong>Log requests</strong> - Track usage and debug issues
          </li>
          <li>
            <strong>Monitor performance</strong> - Track response times and
            errors
          </li>
          <li>
            <strong>Use environment variables</strong> - Never hardcode API keys
          </li>
          <li>
            <strong>Handle streaming errors</strong> - Clean up streams on
            errors
          </li>
        </ul>
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Related</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/cookbook/quick-start-3-lines" className="docs-card">
            <h3>Quick Start Recipe</h3>
            <p>Get started quickly</p>
          </a>
          <a href="/cookbook/nextjs-integration" className="docs-card">
            <h3>Next.js Integration</h3>
            <p>Next.js-specific patterns</p>
          </a>
          <a href="/cookbook/streaming-setup" className="docs-card">
            <h3>Streaming Setup Recipe</h3>
            <p>Streaming implementation</p>
          </a>
          <a href="/cookbook/error-handling" className="docs-card">
            <h3>Error Handling Recipe</h3>
            <p>Error handling patterns</p>
          </a>
        </div>
      </section>

      <Pagination
        prev={{
          title: 'Real-Time Collaboration',
          href: '/cookbook/real-time-collaboration',
        }}
        next={{
          title: 'Next.js Integration',
          href: '/cookbook/nextjs-integration',
        }}
      />
    </>
  )
}
