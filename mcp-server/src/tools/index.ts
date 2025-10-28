/**
 * MCP Tools for Clarity Chat
 * 
 * Tools that AI agents can call to interact with Clarity Chat projects
 */

import { Tool } from '@modelcontextprotocol/sdk/types.js'
import * as fs from 'fs/promises'
import * as path from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

/**
 * Available tools
 */
export const tools: Tool[] = [
  {
    name: 'init_project',
    description: 'Initialize a new Clarity Chat project with specified provider and framework',
    inputSchema: {
      type: 'object',
      properties: {
        provider: {
          type: 'string',
          enum: ['openai', 'anthropic', 'google', 'all'],
          description: 'AI provider to use'
        },
        framework: {
          type: 'string',
          enum: ['nextjs', 'express', 'hono', 'standalone'],
          description: 'Framework to use'
        },
        projectPath: {
          type: 'string',
          description: 'Path where project should be created'
        }
      },
      required: ['provider', 'framework', 'projectPath']
    }
  },
  {
    name: 'list_examples',
    description: 'List all available Clarity Chat examples',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_example',
    description: 'Get the code for a specific Clarity Chat example',
    inputSchema: {
      type: 'object',
      properties: {
        exampleName: {
          type: 'string',
          description: 'Name of the example to retrieve'
        }
      },
      required: ['exampleName']
    }
  },
  {
    name: 'validate_config',
    description: 'Validate Clarity Chat project configuration',
    inputSchema: {
      type: 'object',
      properties: {
        projectPath: {
          type: 'string',
          description: 'Path to the project directory'
        }
      },
      required: ['projectPath']
    }
  },
  {
    name: 'get_model_info',
    description: 'Get detailed information about an AI model including pricing and capabilities',
    inputSchema: {
      type: 'object',
      properties: {
        modelName: {
          type: 'string',
          description: 'Name of the AI model'
        }
      },
      required: ['modelName']
    }
  },
  {
    name: 'calculate_cost',
    description: 'Calculate the cost for a given number of tokens with a specific model',
    inputSchema: {
      type: 'object',
      properties: {
        modelName: {
          type: 'string',
          description: 'Name of the AI model'
        },
        promptTokens: {
          type: 'number',
          description: 'Number of input tokens'
        },
        completionTokens: {
          type: 'number',
          description: 'Number of output tokens'
        }
      },
      required: ['modelName', 'promptTokens', 'completionTokens']
    }
  },
  {
    name: 'analyze_project',
    description: 'Analyze a Clarity Chat project and provide insights',
    inputSchema: {
      type: 'object',
      properties: {
        projectPath: {
          type: 'string',
          description: 'Path to the project directory'
        }
      },
      required: ['projectPath']
    }
  }
]

/**
 * Handle tool calls
 */
export async function handleToolCall(name: string, args: Record<string, any>): Promise<any> {
  switch (name) {
    case 'init_project':
      return await initProject(args.provider, args.framework, args.projectPath)
    
    case 'list_examples':
      return await listExamples()
    
    case 'get_example':
      return await getExample(args.exampleName)
    
    case 'validate_config':
      return await validateConfig(args.projectPath)
    
    case 'get_model_info':
      return await getModelInfo(args.modelName)
    
    case 'calculate_cost':
      return await calculateCost(args.modelName, args.promptTokens, args.completionTokens)
    
    case 'analyze_project':
      return await analyzeProject(args.projectPath)
    
    default:
      throw new Error(`Unknown tool: ${name}`)
  }
}

/**
 * Initialize a new project
 */
async function initProject(provider: string, framework: string, projectPath: string) {
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
}`
  }

  const code = examples[exampleName]
  if (!code) {
    throw new Error(`Example not found: ${exampleName}`)
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
  const modelInfo: Record<string, any> = {
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
    throw new Error(`Model not found: ${modelName}`)
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
  const analysis: any = {
    path: projectPath,
    fileCount: 0,
    hasPackageJson: false,
    hasEnvFile: false,
    hasTsConfig: false,
    providers: [],
    framework: 'unknown'
  }

  try {
    // Count files
    const files = await fs.readdir(projectPath, { recursive: true })
    analysis.fileCount = files.length

    // Check for key files
    analysis.hasPackageJson = files.includes('package.json')
    analysis.hasEnvFile = files.includes('.env.local') || files.includes('.env')
    analysis.hasTsConfig = files.includes('tsconfig.json')

    // Detect providers from package.json
    if (analysis.hasPackageJson) {
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
    }

    return analysis
  } catch (error) {
    throw new Error(`Failed to analyze project: ${error}`)
  }
}

/**
 * Helper functions
 */
function generateEnvTemplate(provider: string): string {
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

function generateExampleCode(provider: string, framework: string): string {
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

function generatePackageJson(provider: string, framework: string) {
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
