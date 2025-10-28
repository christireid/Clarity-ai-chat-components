/**
 * MCP Resources for Clarity Chat
 * 
 * Resources that AI agents can read to understand the project
 */

import { Resource } from '@modelcontextprotocol/sdk/types.js'
import * as fs from 'fs/promises'
import * as path from 'path'

/**
 * Available resources
 */
export const resources: Resource[] = [
  {
    uri: 'clarity://docs/getting-started',
    name: 'Getting Started Guide',
    description: 'Complete guide to getting started with Clarity Chat',
    mimeType: 'text/markdown'
  },
  {
    uri: 'clarity://docs/architecture',
    name: 'Architecture Overview',
    description: 'System architecture and design patterns',
    mimeType: 'text/markdown'
  },
  {
    uri: 'clarity://docs/api-reference',
    name: 'API Reference',
    description: 'Complete API reference for all AI providers',
    mimeType: 'text/markdown'
  },
  {
    uri: 'clarity://examples/list',
    name: 'Examples List',
    description: 'List of all available code examples',
    mimeType: 'application/json'
  },
  {
    uri: 'clarity://models/pricing',
    name: 'Model Pricing',
    description: 'Pricing information for all AI models',
    mimeType: 'application/json'
  },
  {
    uri: 'clarity://models/capabilities',
    name: 'Model Capabilities',
    description: 'Capabilities and features of each AI model',
    mimeType: 'application/json'
  }
]

/**
 * Handle resource reads
 */
export async function handleResourceRead(uri: string): Promise<string> {
  switch (uri) {
    case 'clarity://docs/getting-started':
      return getGettingStartedGuide()
    
    case 'clarity://docs/architecture':
      return getArchitectureOverview()
    
    case 'clarity://docs/api-reference':
      return getAPIReference()
    
    case 'clarity://examples/list':
      return JSON.stringify(getExamplesList(), null, 2)
    
    case 'clarity://models/pricing':
      return JSON.stringify(getModelPricing(), null, 2)
    
    case 'clarity://models/capabilities':
      return JSON.stringify(getModelCapabilities(), null, 2)
    
    default:
      throw new Error(`Unknown resource: ${uri}`)
  }
}

/**
 * Getting Started Guide
 */
function getGettingStartedGuide(): string {
  return `# Getting Started with Clarity Chat

## Quick Start

1. **Install Clarity Chat CLI**:
   \`\`\`bash
   npm install -g @clarity-chat/cli
   \`\`\`

2. **Initialize a new project**:
   \`\`\`bash
   clarity init my-chat-app
   cd my-chat-app
   \`\`\`

3. **Add an AI provider**:
   \`\`\`bash
   clarity add openai
   \`\`\`

4. **Configure API keys**:
   Add your API keys to \`.env.local\`:
   \`\`\`
   OPENAI_API_KEY=sk-...
   \`\`\`

5. **Start development server**:
   \`\`\`bash
   npm run dev
   \`\`\`

## Basic Example

\`\`\`typescript
import { OpenAI } from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

async function chat(message: string) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [{ role: 'user', content: message }]
  })
  
  return response.choices[0].message.content
}

// Usage
const answer = await chat('What is TypeScript?')
console.log(answer)
\`\`\`

## Next Steps

- Explore [Examples](clarity://examples/list)
- Read [API Reference](clarity://docs/api-reference)
- Learn about [Architecture](clarity://docs/architecture)
- Check [Model Pricing](clarity://models/pricing)
`
}

/**
 * Architecture Overview
 */
function getArchitectureOverview(): string {
  return `# Clarity Chat Architecture

## Core Components

### 1. CLI Tool
Command-line interface for project management:
- Project initialization
- Provider management
- Example generation
- Configuration validation

### 2. Dev Tools Package
Developer utilities for debugging and testing:
- API inspector for tracking calls
- Enhanced logger with structured logging
- Mock providers for testing
- Configuration validators
- Performance profiler

### 3. VS Code Extension
Editor integration for productivity:
- IntelliSense for AI APIs
- 60+ code snippets
- Hover documentation
- CodeLens hints
- Project commands

### 4. MCP Server
Model Context Protocol integration:
- Tool calls for AI agents
- Resource access
- Prompt templates
- Project analysis

## Design Patterns

### Provider Abstraction
\`\`\`typescript
interface ChatProvider {
  name: string
  models: string[]
  chat(options: ChatOptions): Promise<ChatResponse>
  stream(options: ChatOptions): AsyncIterator<ChatChunk>
}
\`\`\`

### Streaming Pattern
\`\`\`typescript
async function* streamChat(prompt: string) {
  const stream = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [{ role: 'user', content: prompt }],
    stream: true
  })
  
  for await (const chunk of stream) {
    yield chunk.choices[0]?.delta?.content || ''
  }
}
\`\`\`

### RAG Pattern
1. Document ingestion and chunking
2. Vector embedding generation
3. Semantic search
4. Context injection
5. Response generation

## Technology Stack

- **TypeScript** - Type-safe development
- **Node.js** - Runtime environment
- **Next.js** - Web framework (optional)
- **OpenAI SDK** - GPT models
- **Anthropic SDK** - Claude models
- **Google AI SDK** - Gemini models
`
}

/**
 * API Reference
 */
function getAPIReference(): string {
  return `# API Reference

## OpenAI

### Chat Completion
\`\`\`typescript
import { OpenAI } from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const response = await openai.chat.completions.create({
  model: 'gpt-4-turbo',
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'Hello!' }
  ],
  temperature: 0.7,
  max_tokens: 1000
})
\`\`\`

### Streaming
\`\`\`typescript
const stream = await openai.chat.completions.create({
  model: 'gpt-4-turbo',
  messages: [{ role: 'user', content: 'Tell me a story' }],
  stream: true
})

for await (const chunk of stream) {
  process.stdout.write(chunk.choices[0]?.delta?.content || '')
}
\`\`\`

## Anthropic

### Chat Completion
\`\`\`typescript
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const response = await anthropic.messages.create({
  model: 'claude-3-opus-20240229',
  max_tokens: 1024,
  messages: [{ role: 'user', content: 'Hello!' }]
})
\`\`\`

### Streaming
\`\`\`typescript
const stream = await anthropic.messages.create({
  model: 'claude-3-opus-20240229',
  max_tokens: 1024,
  messages: [{ role: 'user', content: 'Tell me a story' }],
  stream: true
})

for await (const event of stream) {
  if (event.type === 'content_block_delta') {
    process.stdout.write(event.delta.text)
  }
}
\`\`\`

## Google AI

### Chat Completion
\`\`\`typescript
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY)
const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

const result = await model.generateContent('Hello!')
const response = await result.response
console.log(response.text())
\`\`\`

### Streaming
\`\`\`typescript
const result = await model.generateContentStream('Tell me a story')

for await (const chunk of result.stream) {
  process.stdout.write(chunk.text())
}
\`\`\`
`
}

/**
 * Examples List
 */
function getExamplesList() {
  return {
    examples: [
      {
        id: 'basic-chat',
        name: 'Basic Chat Completion',
        description: 'Simple chat completion with OpenAI',
        category: 'fundamentals',
        difficulty: 'beginner',
        providers: ['openai', 'anthropic', 'google']
      },
      {
        id: 'streaming',
        name: 'Streaming Responses',
        description: 'Real-time streaming chat responses',
        category: 'fundamentals',
        difficulty: 'beginner',
        providers: ['openai', 'anthropic', 'google']
      },
      {
        id: 'nextjs-api',
        name: 'Next.js API Route',
        description: 'Server-side API endpoint with Next.js',
        category: 'frameworks',
        difficulty: 'intermediate',
        providers: ['openai']
      },
      {
        id: 'react-hook',
        name: 'React useChat Hook',
        description: 'Custom React hook for chat functionality',
        category: 'frontend',
        difficulty: 'intermediate',
        providers: ['openai']
      },
      {
        id: 'conversation',
        name: 'Multi-turn Conversation',
        description: 'Maintain conversation history across turns',
        category: 'patterns',
        difficulty: 'intermediate',
        providers: ['openai', 'anthropic', 'google']
      },
      {
        id: 'functions',
        name: 'Function Calling',
        description: 'Use OpenAI function calling/tools',
        category: 'advanced',
        difficulty: 'advanced',
        providers: ['openai']
      },
      {
        id: 'cost-tracking',
        name: 'Cost Tracking',
        description: 'Track token usage and calculate costs',
        category: 'utilities',
        difficulty: 'intermediate',
        providers: ['openai', 'anthropic', 'google']
      },
      {
        id: 'rag',
        name: 'RAG Pattern',
        description: 'Retrieval Augmented Generation with documents',
        category: 'advanced',
        difficulty: 'advanced',
        providers: ['openai', 'anthropic']
      }
    ],
    categories: ['fundamentals', 'frameworks', 'frontend', 'patterns', 'utilities', 'advanced'],
    totalCount: 8
  }
}

/**
 * Model Pricing
 */
function getModelPricing() {
  return {
    models: {
      'gpt-4-turbo': {
        provider: 'OpenAI',
        input: 0.01,
        output: 0.03,
        currency: 'USD',
        per: '1K tokens'
      },
      'gpt-4': {
        provider: 'OpenAI',
        input: 0.03,
        output: 0.06,
        currency: 'USD',
        per: '1K tokens'
      },
      'gpt-3.5-turbo': {
        provider: 'OpenAI',
        input: 0.0005,
        output: 0.0015,
        currency: 'USD',
        per: '1K tokens'
      },
      'claude-3-opus-20240229': {
        provider: 'Anthropic',
        input: 0.015,
        output: 0.075,
        currency: 'USD',
        per: '1K tokens'
      },
      'claude-3-sonnet-20240229': {
        provider: 'Anthropic',
        input: 0.003,
        output: 0.015,
        currency: 'USD',
        per: '1K tokens'
      },
      'claude-3-haiku-20240307': {
        provider: 'Anthropic',
        input: 0.00025,
        output: 0.00125,
        currency: 'USD',
        per: '1K tokens'
      },
      'gemini-pro': {
        provider: 'Google',
        input: 0.00025,
        output: 0.0005,
        currency: 'USD',
        per: '1K tokens'
      }
    }
  }
}

/**
 * Model Capabilities
 */
function getModelCapabilities() {
  return {
    models: {
      'gpt-4-turbo': {
        provider: 'OpenAI',
        contextWindow: 128000,
        capabilities: ['text', 'code', 'functions', 'json-mode', 'vision'],
        bestFor: ['complex reasoning', 'long-form content', 'code generation'],
        limitations: ['higher cost', 'slower than gpt-3.5']
      },
      'gpt-4': {
        provider: 'OpenAI',
        contextWindow: 8192,
        capabilities: ['text', 'code', 'functions'],
        bestFor: ['complex tasks', 'creative writing', 'analysis'],
        limitations: ['expensive', 'smaller context']
      },
      'gpt-3.5-turbo': {
        provider: 'OpenAI',
        contextWindow: 16385,
        capabilities: ['text', 'code', 'functions'],
        bestFor: ['quick responses', 'simple tasks', 'cost efficiency'],
        limitations: ['less capable than gpt-4']
      },
      'claude-3-opus-20240229': {
        provider: 'Anthropic',
        contextWindow: 200000,
        capabilities: ['text', 'code', 'analysis', 'vision'],
        bestFor: ['complex analysis', 'research', 'long documents'],
        limitations: ['expensive', 'slower']
      },
      'claude-3-sonnet-20240229': {
        provider: 'Anthropic',
        contextWindow: 200000,
        capabilities: ['text', 'code', 'analysis', 'vision'],
        bestFor: ['balanced performance', 'general tasks'],
        limitations: ['less capable than opus']
      },
      'claude-3-haiku-20240307': {
        provider: 'Anthropic',
        contextWindow: 200000,
        capabilities: ['text', 'analysis', 'vision'],
        bestFor: ['speed', 'simple tasks', 'high volume'],
        limitations: ['less capable than opus/sonnet']
      },
      'gemini-pro': {
        provider: 'Google',
        contextWindow: 32768,
        capabilities: ['text', 'code', 'analysis'],
        bestFor: ['general tasks', 'cost efficiency', 'fast responses'],
        limitations: ['smaller context', 'newer ecosystem']
      }
    }
  }
}
