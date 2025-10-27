/**
 * generate command - Generate code (component, hook, adapter, test)
 */

import chalk from 'chalk'
import prompts from 'prompts'
import ora from 'ora'
import path from 'path'
import fs from 'fs-extra'
import { getLogger } from '../utils/logger.js'

const logger = getLogger('generate')

interface GenerateOptions {
  name?: string
  output?: string
}

const GENERATORS = {
  component: {
    name: 'React Component',
    icon: '⚛️',
    template: (name: string) => `import React from 'react'

interface ${name}Props {
  // Add your props here
}

export function ${name}({ }: ${name}Props) {
  return (
    <div className="clarity-${name.toLowerCase()}">
      <h2>${name}</h2>
      {/* Add your content here */}
    </div>
  )
}
`
  },
  hook: {
    name: 'React Hook',
    icon: '🪝',
    template: (name: string) => `import { useState, useEffect } from 'react'

export function ${name}() {
  const [state, setState] = useState<any>(null)

  useEffect(() => {
    // Add your effect logic here
  }, [])

  return {
    state,
    setState,
  }
}
`
  },
  adapter: {
    name: 'Model Adapter',
    icon: '🔌',
    template: (name: string) => `import type { ChatMessage, ModelConfig, StreamChunk, TokenUsage } from '@clarity-chat/types'

export async function* stream${name}(
  messages: ChatMessage[],
  config: ModelConfig
): AsyncGenerator<StreamChunk> {
  const response = await fetch('YOUR_API_ENDPOINT', {
    method: 'POST',
    headers: {
      'Authorization': \`Bearer \${config.apiKey}\`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages,
      temperature: config.temperature || 0.7,
      max_tokens: config.maxTokens || 1000,
      stream: true,
    }),
  })

  if (!response.ok) {
    throw new Error(\`API error: \${response.status}\`)
  }

  const reader = response.body?.getReader()
  const decoder = new TextDecoder()

  if (!reader) {
    throw new Error('No response body')
  }

  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\\n')
    buffer = lines.pop() || ''

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6)
        if (data === '[DONE]') break

        try {
          const parsed = JSON.parse(data)
          // Parse your API response format here
          const content = parsed.choices?.[0]?.delta?.content
          
          if (content) {
            yield {
              type: 'content' as const,
              content,
            }
          }
        } catch (e) {
          // Ignore parse errors
        }
      }
    }
  }
}
`
  },
  test: {
    name: 'Test File',
    icon: '🧪',
    template: (name: string) => `import { describe, it, expect } from 'vitest'
import { ${name} } from './${name}'

describe('${name}', () => {
  it('should work correctly', () => {
    // Add your test here
    expect(true).toBe(true)
  })

  it('should handle edge cases', () => {
    // Add edge case tests
  })
})
`
  },
}

export async function generateCommand(type: string, options: GenerateOptions) {
  console.log('\n' + chalk.bold.cyan('⚡ Code Generator\n'))

  const generator = GENERATORS[type as keyof typeof GENERATORS]
  
  if (!generator) {
    logger.error(`Unknown generator type: ${type}`)
    console.log(chalk.yellow('\nAvailable generators:'))
    Object.entries(GENERATORS).forEach(([key, value]) => {
      console.log(chalk.cyan(`  ${value.icon} ${key}`) + chalk.gray(` - ${value.name}`))
    })
    process.exit(1)
  }

  // Get component name
  let name = options.name
  if (!name) {
    const response = await prompts({
      type: 'text',
      name: 'name',
      message: `Enter ${generator.name} name:`,
      validate: (value: string) => value.length > 0 ? true : 'Name is required'
    })
    name = response.name
  }

  if (!name) {
    logger.error('Name is required')
    process.exit(1)
  }

  // Determine output path
  const cwd = process.cwd()
  let outputPath = options.output
  
  if (!outputPath) {
    const defaultPaths: Record<string, string> = {
      component: './src/components',
      hook: './src/hooks',
      adapter: './src/lib/adapters',
      test: './src/__tests__',
    }
    outputPath = defaultPaths[type] || './src'
  }

  const fullPath = path.join(cwd, outputPath)
  
  // Confirm generation
  console.log(chalk.gray('\nGenerating:'))
  console.log(chalk.cyan(`  Type: ${generator.name}`))
  console.log(chalk.cyan(`  Name: ${name}`))
  console.log(chalk.cyan(`  Path: ${fullPath}\n`))

  const { confirm } = await prompts({
    type: 'confirm',
    name: 'confirm',
    message: 'Generate file?',
    initial: true
  })

  if (!confirm) {
    console.log(chalk.gray('Cancelled'))
    return
  }

  const spinner = ora('Generating code...').start()

  try {
    // Ensure directory exists
    await fs.ensureDir(fullPath)

    // Generate file
    const extension = type === 'component' ? '.tsx' : type === 'test' ? '.test.ts' : '.ts'
    const fileName = `${name}${extension}`
    const filePath = path.join(fullPath, fileName)

    if (await fs.pathExists(filePath)) {
      spinner.warn('File already exists')
      const { overwrite } = await prompts({
        type: 'confirm',
        name: 'overwrite',
        message: 'Overwrite existing file?',
        initial: false
      })
      
      if (!overwrite) {
        console.log(chalk.gray('Cancelled'))
        return
      }
    }

    const content = generator.template(name)
    await fs.writeFile(filePath, content, 'utf-8')

    spinner.succeed('Code generated')

    console.log('\n' + chalk.green('✅ File created:\n'))
    console.log(chalk.cyan(`  ${filePath}\n`))
    console.log(chalk.gray('Open it in your editor and start coding!'))

  } catch (error) {
    spinner.fail('Failed to generate code')
    logger.error(error)
    process.exit(1)
  }
}
