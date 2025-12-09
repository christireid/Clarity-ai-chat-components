/**
 * MCP Tools for Clarity Chat
 * 
 * Tools that AI agents can call to interact with Clarity Chat projects
 */

import { Tool } from '@modelcontextprotocol/sdk/types.js'
import * as fs from 'fs/promises'
import * as path from 'path'
import { logger } from '../utils/logger.js'
import { NotFoundError, ValidationError } from '../utils/errors.js'
import { validateRequired, validateEnum, validateString, validateNumber } from '../utils/validation.js'
import { validateProjectPath } from '../utils/security.js'

type Provider = 'openai' | 'anthropic' | 'google' | 'all'
type Framework = 'nextjs' | 'express' | 'hono' | 'standalone'

/**
 * Available tools
 */
export const tools: Tool[] = [
  {
    name: 'init_project',
    description: `Initialize a new Clarity Chat AI chat application project.

Use this tool when the user wants to:
- Create a new AI chat application from scratch
- Set up a project with a specific AI provider (OpenAI, Anthropic, Google, or all)
- Scaffold a project using Next.js, Express, Hono, or standalone TypeScript

This tool creates: project directory, .env.local with API key placeholders, package.json with dependencies, and example code.
The user must add their API keys separately after project creation.`,
    inputSchema: {
      type: 'object',
      properties: {
        provider: {
          type: 'string',
          enum: ['openai', 'anthropic', 'google', 'all'],
          description: 'AI provider to configure. Use "all" to set up all three providers.'
        },
        framework: {
          type: 'string',
          enum: ['nextjs', 'express', 'hono', 'standalone'],
          description: 'Framework to use. "nextjs" recommended for full-stack apps, "standalone" for scripts.'
        },
        projectPath: {
          type: 'string',
          description: 'Absolute or relative path where the project should be created.'
        }
      },
      required: ['provider', 'framework', 'projectPath']
    }
  },
  {
    name: 'list_examples',
    description: `List all available Clarity Chat code examples and patterns.

Use this tool when the user wants to see what example code is available, find patterns for specific use cases (streaming, RAG, function calling), or browse templates before getting code.

Returns a list of example names with descriptions. Use get_example to retrieve the actual code.`,
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_example',
    description: `Get complete, production-ready code for a specific Clarity Chat example.

Use this tool when the user wants to see how to implement a specific feature (streaming, function calling), get starter code for a pattern, or learn Clarity Chat API usage through examples.

Available examples: basic-chat, streaming, nextjs-api, react-hook, conversation, functions, cost-tracking, rag.`,
    inputSchema: {
      type: 'object',
      properties: {
        exampleName: {
          type: 'string',
          description: 'Name of the example: basic-chat, streaming, nextjs-api, react-hook, conversation, functions, cost-tracking, rag'
        }
      },
      required: ['exampleName']
    }
  },
  {
    name: 'validate_config',
    description: `Validate a Clarity Chat project configuration and check for common issues.

Use this tool when the user reports issues with their setup, wants to verify their project is configured correctly, or needs to troubleshoot configuration problems.

Checks for: package.json and AI SDK dependencies, .env.local file, tsconfig.json with strict mode, common misconfigurations.`,
    inputSchema: {
      type: 'object',
      properties: {
        projectPath: {
          type: 'string',
          description: 'Path to the Clarity Chat project directory to validate'
        }
      },
      required: ['projectPath']
    }
  },
  {
    name: 'get_model_info',
    description: `Get detailed information about an AI model including pricing, capabilities, and best use cases.

Use this tool when the user asks about model pricing (cost per 1K tokens), context window sizes, model capabilities, which model to use for specific tasks, or comparing models.

Supported models: gpt-4-turbo, gpt-4, claude-3-opus-20240229, gemini-pro.`,
    inputSchema: {
      type: 'object',
      properties: {
        modelName: {
          type: 'string',
          description: 'Model identifier: gpt-4-turbo, gpt-4, claude-3-opus-20240229, gemini-pro'
        }
      },
      required: ['modelName']
    }
  },
  {
    name: 'calculate_cost',
    description: `Calculate the exact cost for API usage with a specific model and token count.

Use this tool when the user wants to estimate costs before making API calls, understand the cost breakdown (input vs output tokens), compare costs between models, or budget for AI API usage.

Returns total cost in USD, broken down by input and output tokens.`,
    inputSchema: {
      type: 'object',
      properties: {
        modelName: {
          type: 'string',
          description: 'Model identifier: gpt-4-turbo, gpt-4, claude-3-opus-20240229, gemini-pro'
        },
        promptTokens: {
          type: 'number',
          description: 'Number of input/prompt tokens'
        },
        completionTokens: {
          type: 'number',
          description: 'Number of output/completion tokens'
        }
      },
      required: ['modelName', 'promptTokens', 'completionTokens']
    }
  },
  {
    name: 'analyze_project',
    description: `Analyze an existing Clarity Chat project and provide detailed insights.

Use this tool when the user wants an overview of their project structure, to see which AI providers are configured, check project health and setup completeness, or understand their project's architecture.

Returns: file count, detected framework, configured providers, presence of key files (package.json, .env.local, tsconfig.json).`,
    inputSchema: {
      type: 'object',
      properties: {
        projectPath: {
          type: 'string',
          description: 'Path to the Clarity Chat project directory to analyze'
        }
      },
      required: ['projectPath']
    }
  }
]

/**
 * Handle tool calls with proper validation and error handling
 */
export async function handleToolCall(name: string, args: Record<string, any>): Promise<any> {
  logger.debug('Tool call received', { tool: name, args })
  
  try {
    switch (name) {
      case 'init_project':
        validateRequired(args, ['provider', 'framework', 'projectPath'])
        const provider = validateEnum(args.provider, ['openai', 'anthropic', 'google', 'all'] as const, 'provider')
        const framework = validateEnum(args.framework, ['nextjs', 'express', 'hono', 'standalone'] as const, 'framework')
        const projectPath = validateProjectPath(validateString(args.projectPath, 'projectPath'))
        return await initProject(provider, framework, projectPath)
      
      case 'list_examples':
        return await listExamples()
      
      case 'get_example':
        validateRequired(args, ['exampleName'])
        const exampleName = validateString(args.exampleName, 'exampleName')
        return await getExample(exampleName)
      
      case 'validate_config':
        validateRequired(args, ['projectPath'])
        const configPath = validateProjectPath(validateString(args.projectPath, 'projectPath'))
        return await validateConfig(configPath)
      
      case 'get_model_info':
        validateRequired(args, ['modelName'])
        const modelName = validateString(args.modelName, 'modelName')
        return await getModelInfo(modelName)
      
      case 'calculate_cost':
        validateRequired(args, ['modelName', 'promptTokens', 'completionTokens'])
        const costModelName = validateString(args.modelName, 'modelName')
        const promptTokens = validateNumber(args.promptTokens, 'promptTokens', 0)
        const completionTokens = validateNumber(args.completionTokens, 'completionTokens', 0)
        return await calculateCost(costModelName, promptTokens, completionTokens)
      
      case 'analyze_project':
        validateRequired(args, ['projectPath'])
        const analyzePath = validateProjectPath(validateString(args.projectPath, 'projectPath'))
        return await analyzeProject(analyzePath)
      
      default:
        throw new ValidationError(`Unknown tool: ${name}`, { tool: name })
    }
  } catch (error) {
    logger.error(`Tool call failed: ${name}`, error instanceof Error ? error : undefined, { args })
    throw error
  }
}

/**
 * Initialize a new project
 */
async function initProject(provider: Provider, framework: Framework, projectPath: string) {
  logger.info('Initializing project', { provider, framework, projectPath })
  
  try {
    const envContent = generateEnvTemplate(provider)
    const exampleCode = generateExampleCode(provider, framework)

    // Create project directory
    await fs.mkdir(projectPath, { recursive: true })

    // Write .env.local
    await fs.writeFile(path.join(projectPath, '.env.local'), envContent)

    // Write example code
    const fileName = framework === 'nextjs' ? 'app/api/chat/route.ts' : 'src/index.ts'
    const filePath = path.join(projectPath, fileName)
    await fs.mkdir(path.dirname(filePath), { recursive: true })
    await fs.writeFile(filePath, exampleCode)

    // Create package.json
    const packageJson = generatePackageJson(provider, framework)
    await fs.writeFile(path.join(projectPath, 'package.json'), JSON.stringify(packageJson, null, 2))

    logger.info('Project initialized successfully', { projectPath })
    
    return {
      success: true,
      message: `Project initialized at ${projectPath}`,
      files: ['.env.local', fileName, 'package.json'],
      nextSteps: [
        `cd ${projectPath}`,
        'npm install',
        'Add your API keys to .env.local',
        framework === 'nextjs' ? 'npm run dev' : 'npm start'
      ]
    }
  } catch (error) {
    logger.error('Failed to initialize project', error instanceof Error ? error : undefined, { provider, framework, projectPath })
    throw new Error(`Failed to initialize project: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * List available examples
 */
async function listExamples() {
  return {
    examples: [
      { name: 'basic-chat', description: 'Simple chat completion' },
      { name: 'streaming', description: 'Real-time streaming responses' },
      { name: 'nextjs-api', description: 'Next.js API route' },
      { name: 'react-hook', description: 'Custom React hook for chat' },
      { name: 'conversation', description: 'Multi-turn conversation' },
      { name: 'functions', description: 'Function calling/tools' },
      { name: 'cost-tracking', description: 'Token usage and cost tracking' },
      { name: 'rag', description: 'Retrieval Augmented Generation' }
    ]
  }
}

/**
 * Get example code
 */
async function getExample(exampleName: string) {
  logger.debug('Getting example', { exampleName })

  const examples: Record<string, string> = {
    'basic-chat': `import { OpenAI } from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

async function chat(message: string) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [{ role: 'user', content: message }]
  })
  return response.choices[0].message.content
}`,
    'streaming': `import { OpenAI } from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

async function streamChat(message: string) {
  const stream = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [{ role: 'user', content: message }],
    stream: true
  })

  for await (const chunk of stream) {
    process.stdout.write(chunk.choices[0]?.delta?.content || '')
  }
}`,
    'nextjs-api': `// app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { OpenAI } from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: NextRequest) {
  const { messages } = await req.json()

  const stream = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages,
    stream: true
  })

  const encoder = new TextEncoder()
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content || ''
        controller.enqueue(encoder.encode(text))
      }
      controller.close()
    }
  })

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  })
}`,
    'react-hook': `import { useState, useCallback } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: Message = { role: 'user', content }
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] })
      })

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let assistantContent = ''

      setMessages(prev => [...prev, { role: 'assistant', content: '' }])

      while (reader) {
        const { done, value } = await reader.read()
        if (done) break

        assistantContent += decoder.decode(value)
        setMessages(prev => [
          ...prev.slice(0, -1),
          { role: 'assistant', content: assistantContent }
        ])
      }
    } finally {
      setIsLoading(false)
    }
  }, [messages])

  return { messages, sendMessage, isLoading }
}`,
    'conversation': `import { OpenAI } from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

interface Message {
  role: 'system' | 'user' | 'assistant'
  content: string
}

class Conversation {
  private messages: Message[] = []

  constructor(systemPrompt?: string) {
    if (systemPrompt) {
      this.messages.push({ role: 'system', content: systemPrompt })
    }
  }

  async chat(userMessage: string): Promise<string> {
    this.messages.push({ role: 'user', content: userMessage })

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: this.messages
    })

    const assistantMessage = response.choices[0].message.content || ''
    this.messages.push({ role: 'assistant', content: assistantMessage })

    return assistantMessage
  }

  getHistory(): Message[] {
    return [...this.messages]
  }

  clear(): void {
    const systemMessage = this.messages.find(m => m.role === 'system')
    this.messages = systemMessage ? [systemMessage] : []
  }
}

// Usage:
const chat = new Conversation('You are a helpful assistant.')
await chat.chat('Hello!')  // "Hi! How can I help you today?"
await chat.chat('What did I just say?')  // "You said 'Hello!'"`,
    'functions': `import { OpenAI } from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// Define available tools
const tools: OpenAI.Chat.ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'get_weather',
      description: 'Get the current weather for a location',
      parameters: {
        type: 'object',
        properties: {
          location: { type: 'string', description: 'City name' },
          unit: { type: 'string', enum: ['celsius', 'fahrenheit'] }
        },
        required: ['location']
      }
    }
  }
]

// Implement the function
function getWeather(location: string, unit = 'celsius') {
  // Mock implementation
  return { location, temperature: 22, unit, condition: 'sunny' }
}

async function chatWithFunctions(message: string) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [{ role: 'user', content: message }],
    tools,
    tool_choice: 'auto'
  })

  const assistantMessage = response.choices[0].message

  // Handle tool calls
  if (assistantMessage.tool_calls) {
    const toolResults = assistantMessage.tool_calls.map(call => {
      if (call.function.name === 'get_weather') {
        const args = JSON.parse(call.function.arguments)
        return {
          tool_call_id: call.id,
          role: 'tool' as const,
          content: JSON.stringify(getWeather(args.location, args.unit))
        }
      }
      return { tool_call_id: call.id, role: 'tool' as const, content: 'Unknown function' }
    })

    // Get final response with tool results
    const finalResponse = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        { role: 'user', content: message },
        assistantMessage,
        ...toolResults
      ]
    })

    return finalResponse.choices[0].message.content
  }

  return assistantMessage.content
}`,
    'cost-tracking': `import { OpenAI } from 'openai'
import { encoding_for_model } from 'tiktoken'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// Pricing per 1K tokens (as of 2024)
const PRICING = {
  'gpt-4-turbo': { input: 0.01, output: 0.03 },
  'gpt-4': { input: 0.03, output: 0.06 },
  'gpt-3.5-turbo': { input: 0.0005, output: 0.0015 }
}

interface CostTracker {
  totalInputTokens: number
  totalOutputTokens: number
  totalCost: number
  requests: number
}

const tracker: CostTracker = {
  totalInputTokens: 0,
  totalOutputTokens: 0,
  totalCost: 0,
  requests: 0
}

function countTokens(text: string, model: string): number {
  const enc = encoding_for_model(model as any)
  const tokens = enc.encode(text)
  enc.free()
  return tokens.length
}

async function chatWithTracking(message: string, model = 'gpt-4-turbo') {
  const inputTokens = countTokens(message, model)

  const response = await openai.chat.completions.create({
    model,
    messages: [{ role: 'user', content: message }]
  })

  const outputTokens = response.usage?.completion_tokens || 0
  const pricing = PRICING[model as keyof typeof PRICING]
  const cost = (inputTokens * pricing.input + outputTokens * pricing.output) / 1000

  // Update tracker
  tracker.totalInputTokens += inputTokens
  tracker.totalOutputTokens += outputTokens
  tracker.totalCost += cost
  tracker.requests++

  return {
    content: response.choices[0].message.content,
    usage: { inputTokens, outputTokens, cost: \`$\${cost.toFixed(6)}\` },
    totals: {
      tokens: tracker.totalInputTokens + tracker.totalOutputTokens,
      cost: \`$\${tracker.totalCost.toFixed(4)}\`,
      requests: tracker.requests
    }
  }
}`,
    'rag': `import { OpenAI } from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

interface Document {
  id: string
  content: string
  embedding?: number[]
}

// Simple in-memory vector store
class VectorStore {
  private documents: Document[] = []

  async addDocument(content: string): Promise<string> {
    const embedding = await this.getEmbedding(content)
    const doc: Document = { id: crypto.randomUUID(), content, embedding }
    this.documents.push(doc)
    return doc.id
  }

  async search(query: string, topK = 3): Promise<Document[]> {
    const queryEmbedding = await this.getEmbedding(query)

    const scored = this.documents.map(doc => ({
      doc,
      score: this.cosineSimilarity(queryEmbedding, doc.embedding!)
    }))

    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)
      .map(s => s.doc)
  }

  private async getEmbedding(text: string): Promise<number[]> {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text
    })
    return response.data[0].embedding
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    const dot = a.reduce((sum, val, i) => sum + val * b[i], 0)
    const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0))
    const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0))
    return dot / (magA * magB)
  }
}

// RAG Pipeline
async function ragQuery(query: string, vectorStore: VectorStore): Promise<string> {
  // 1. Retrieve relevant documents
  const relevantDocs = await vectorStore.search(query, 3)
  const context = relevantDocs.map(d => d.content).join('\\n\\n')

  // 2. Generate response with context
  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [
      {
        role: 'system',
        content: \`Answer questions based on the following context. If the answer isn't in the context, say so.

Context:
\${context}\`
      },
      { role: 'user', content: query }
    ]
  })

  return response.choices[0].message.content || ''
}

// Usage:
const store = new VectorStore()
await store.addDocument('Clarity Chat is a React component library for AI chat interfaces.')
await store.addDocument('It supports OpenAI, Anthropic, and Google AI providers.')
const answer = await ragQuery('What providers does Clarity Chat support?', store)`
  }

  const code = examples[exampleName]
  if (!code) {
    throw new NotFoundError('Example', exampleName)
  }

  return { name: exampleName, code }
}

/**
 * Validate project configuration
 */
async function validateConfig(projectPath: string) {
  const issues: string[] = []
  const warnings: string[] = []

  try {
    // Check package.json
    const packageJsonPath = path.join(projectPath, 'package.json')
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'))
    
    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies }
    if (!deps['openai'] && !deps['@anthropic-ai/sdk'] && !deps['@google/generative-ai']) {
      warnings.push('No AI provider SDK installed')
    }

    // Check .env.local
    try {
      await fs.access(path.join(projectPath, '.env.local'))
    } catch {
      warnings.push('.env.local file not found')
    }

    // Check tsconfig.json
    try {
      const tsconfigPath = path.join(projectPath, 'tsconfig.json')
      const tsconfig = JSON.parse(await fs.readFile(tsconfigPath, 'utf-8'))
      if (!tsconfig.compilerOptions?.strict) {
        warnings.push('TypeScript strict mode is not enabled')
      }
    } catch {
      // tsconfig.json is optional
    }

    return {
      valid: issues.length === 0,
      issues,
      warnings
    }
  } catch (error) {
    return {
      valid: false,
      issues: [`Failed to validate project: ${error}`],
      warnings: []
    }
  }
}

/**
 * Get model information
 */
async function getModelInfo(modelName: string) {
  logger.debug('Getting model info', { modelName })
  
  const modelInfo: Record<string, {
    provider: string
    contextWindow: number
    pricing: { input: number; output: number }
    capabilities: string[]
    bestFor: string[]
  }> = {
    'gpt-4-turbo': {
      provider: 'OpenAI',
      contextWindow: 128000,
      pricing: { input: 0.01, output: 0.03 },
      capabilities: ['text', 'code', 'functions', 'json'],
      bestFor: ['complex reasoning', 'long-form content']
    },
    'gpt-4': {
      provider: 'OpenAI',
      contextWindow: 8192,
      pricing: { input: 0.03, output: 0.06 },
      capabilities: ['text', 'code', 'functions'],
      bestFor: ['complex tasks', 'creative writing']
    },
    'claude-3-opus-20240229': {
      provider: 'Anthropic',
      contextWindow: 200000,
      pricing: { input: 0.015, output: 0.075 },
      capabilities: ['text', 'code', 'analysis', 'vision'],
      bestFor: ['complex analysis', 'research', 'long documents']
    },
    'gemini-pro': {
      provider: 'Google',
      contextWindow: 32768,
      pricing: { input: 0.00025, output: 0.0005 },
      capabilities: ['text', 'code', 'analysis'],
      bestFor: ['general tasks', 'cost efficiency']
    }
  }

  const info = modelInfo[modelName]
  if (!info) {
    throw new NotFoundError('Model', modelName)
  }

  return info
}

/**
 * Calculate cost
 */
async function calculateCost(modelName: string, promptTokens: number, completionTokens: number) {
  const info = await getModelInfo(modelName)
  const inputCost = (promptTokens * info.pricing.input) / 1000
  const outputCost = (completionTokens * info.pricing.output) / 1000
  const totalCost = inputCost + outputCost

  return {
    modelName,
    promptTokens,
    completionTokens,
    totalTokens: promptTokens + completionTokens,
    inputCost,
    outputCost,
    totalCost,
    currency: 'USD'
  }
}

/**
 * Analyze project
 */
async function analyzeProject(projectPath: string) {
  logger.info('Analyzing project', { projectPath })
  
  const analysis: {
    path: string
    fileCount: number
    hasPackageJson: boolean
    hasEnvFile: boolean
    hasTsConfig: boolean
    providers: string[]
    framework: string
  } = {
    path: projectPath,
    fileCount: 0,
    hasPackageJson: false,
    hasEnvFile: false,
    hasTsConfig: false,
    providers: [],
    framework: 'unknown'
  }

  try {
    // Check if directory exists
    try {
      await fs.access(projectPath)
    } catch {
      throw new NotFoundError('Project directory', projectPath)
    }

    // Count files
    const files = await fs.readdir(projectPath, { recursive: true })
    analysis.fileCount = files.length

    // Check for key files
    analysis.hasPackageJson = files.includes('package.json')
    analysis.hasEnvFile = files.includes('.env.local') || files.includes('.env')
    analysis.hasTsConfig = files.includes('tsconfig.json')

    // Detect providers from package.json
    if (analysis.hasPackageJson) {
      try {
        const packageJson = JSON.parse(
          await fs.readFile(path.join(projectPath, 'package.json'), 'utf-8')
        )
        const deps = { ...packageJson.dependencies, ...packageJson.devDependencies }
        
        if (deps['openai']) analysis.providers.push('OpenAI')
        if (deps['@anthropic-ai/sdk']) analysis.providers.push('Anthropic')
        if (deps['@google/generative-ai']) analysis.providers.push('Google AI')

        // Detect framework
        if (deps['next']) analysis.framework = 'Next.js'
        else if (deps['express']) analysis.framework = 'Express'
        else if (deps['hono']) analysis.framework = 'Hono'
      } catch (error) {
        logger.warn('Failed to parse package.json', { error: error instanceof Error ? error.message : 'Unknown error' })
      }
    }

    return analysis
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error
    }
    logger.error('Failed to analyze project', error instanceof Error ? error : undefined, { projectPath })
    throw new Error(`Failed to analyze project: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Helper functions
 */
function generateEnvTemplate(provider: Provider): string {
  const lines = ['# Clarity Chat Environment Variables', '']
  
  if (provider === 'openai' || provider === 'all') {
    lines.push('OPENAI_API_KEY=sk-...')
  }
  if (provider === 'anthropic' || provider === 'all') {
    lines.push('ANTHROPIC_API_KEY=sk-ant-...')
  }
  if (provider === 'google' || provider === 'all') {
    lines.push('GOOGLE_API_KEY=...')
  }
  
  return lines.join('\n')
}

function generateExampleCode(provider: Provider, framework: Framework): string {
  if (framework === 'nextjs') {
    return `import { NextRequest, NextResponse } from 'next/server'
import { OpenAI } from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: NextRequest) {
  const { message } = await req.json()
  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [{ role: 'user', content: message }]
  })
  return NextResponse.json({ content: response.choices[0].message.content })
}`
  }
  
  return `import { OpenAI } from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

async function main() {
  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [{ role: 'user', content: 'Hello!' }]
  })
  console.log(response.choices[0].message.content)
}

main()`
}

function generatePackageJson(provider: Provider, framework: Framework) {
  const deps: Record<string, string> = {}
  
  if (provider === 'openai' || provider === 'all') deps['openai'] = '^4.0.0'
  if (provider === 'anthropic' || provider === 'all') deps['@anthropic-ai/sdk'] = '^0.9.0'
  if (provider === 'google' || provider === 'all') deps['@google/generative-ai'] = '^0.1.0'
  
  if (framework === 'express') deps['express'] = '^4.18.0'
  if (framework === 'hono') deps['hono'] = '^4.0.0'
  
  return {
    name: 'clarity-chat-project',
    version: '1.0.0',
    type: 'module',
    dependencies: deps
  }
}
