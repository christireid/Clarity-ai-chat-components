/**
 * generate command - Generate code (component, hook, adapter, test)
 */

import chalk from 'chalk'
import prompts from 'prompts'
import ora from 'ora'
import path from 'path'
import fs from 'fs-extra'
import { getLogger } from '../utils/logger.js'
import { ValidationError, NotFoundError, handleError } from '../utils/errors.js'
import { GenerateTypeSchema, validate, validateComponentName } from '../utils/validation.js'
import { validatePath } from '../utils/security.js'
import { loadConfig } from '../utils/config.js'
import { success, info } from '../utils/output.js'

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
  try {
    // Validate generator type
    const validatedType = validate(GenerateTypeSchema, type, 'Invalid generator type')
    
    const generator = GENERATORS[validatedType as keyof typeof GENERATORS]
    
    if (!generator) {
      throw new NotFoundError(
        `Generator type "${validatedType}" not found`,
        [
          'Available types: component, hook, adapter, test',
          'Run: clarity-chat generate --help for more info',
        ]
      )
    }

    info(`⚡ Code Generator: ${generator.name}`)

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
      throw new ValidationError('Name is required', ['Provide --name option or enter name when prompted'])
    }

    // Validate component name format
    const validatedName = validateComponentName(name)

    // Determine output path
    const cwd = process.cwd()
    const config = await loadConfig(cwd)
    
    let outputPath = options.output
    
    if (!outputPath) {
      const defaultPaths: Record<string, string> = {
        component: config.paths?.components || './src/components',
        hook: config.paths?.hooks || './src/hooks',
        adapter: config.paths?.adapters || './src/lib/adapters',
        test: './src/__tests__',
      }
      outputPath = defaultPaths[validatedType] || './src'
    }

    // Validate path
    const fullPath = validatePath(outputPath, cwd)
  
    // Confirm generation
    info(`Type: ${generator.name}`)
    info(`Name: ${validatedName}`)
    info(`Path: ${fullPath}`)

    const { confirm } = await prompts({
      type: 'confirm',
      name: 'confirm',
      message: 'Generate file?',
      initial: true
    })

    if (!confirm) {
      info('Cancelled')
      return
    }

    const spinner = ora('Generating code...').start()

    // Ensure directory exists
    await fs.ensureDir(fullPath)

    // Generate file
    const extension = validatedType === 'component' ? '.tsx' : validatedType === 'test' ? '.test.ts' : '.ts'
    const fileName = `${validatedName}${extension}`
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
        info('Cancelled')
        return
      }
    }

    const content = generator.template(validatedName)
    await fs.writeFile(filePath, content, 'utf-8')

    spinner.succeed('Code generated')
    success(`File created: ${filePath}`)
    info('Open it in your editor and start coding!')

  } catch (error) {
    handleError(error)
  }
}
