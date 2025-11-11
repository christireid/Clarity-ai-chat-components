/**
 * add command - Add a component to your project
 */

import chalk from 'chalk'
import ora from 'ora'
import path from 'path'
import fs from 'fs-extra'
import { execa } from 'execa'
import { getLogger } from '../utils/logger.js'
import { ValidationError, NotFoundError, handleError } from '../utils/errors.js'
import { ComponentSchema, validate, PathSchema } from '../utils/validation.js'
import { validatePath, validateProjectPath } from '../utils/security.js'
import { loadConfig } from '../utils/config.js'
import { outputJson, success, info } from '../utils/output.js'
import { detectPackageManager } from '../utils/detect.js'
import { installDependencies } from '../utils/install.js'
import { createBanner } from '../ui/banner.js'
import { successMessage, infoMessage } from '../ui/messages.js'
import { createSpinner } from '../ui/progress.js'
import { createStatusTable } from '../ui/table.js'

const logger = getLogger('add')

interface AddOptions {
  path?: string
  deps?: boolean
  batch?: string
}

const COMPONENTS = {
  'chat-interface': {
    name: 'Chat Interface',
    files: ['ChatInterface.tsx', 'ChatMessage.tsx', 'ChatInput.tsx'],
    dependencies: ['@clarity-chat/react', '@clarity-chat/primitives'],
    description: '💬 Full-featured chat UI component'
  },
  'model-selector': {
    name: 'Model Selector',
    files: ['ModelSelector.tsx'],
    dependencies: ['@clarity-chat/react', '@clarity-chat/types'],
    description: '🤖 Dropdown to select AI models'
  },
  'token-counter': {
    name: 'Token Counter',
    files: ['TokenCounter.tsx'],
    dependencies: ['@clarity-chat/react'],
    description: '📊 Real-time token usage display'
  },
  'cost-estimator': {
    name: 'Cost Estimator',
    files: ['CostEstimator.tsx'],
    dependencies: ['@clarity-chat/react', '@clarity-chat/types'],
    description: '💰 Calculate API costs in real-time'
  },
  'streaming-handler': {
    name: 'Streaming Handler',
    files: ['useStreaming.ts', 'StreamingProvider.tsx'],
    dependencies: ['@clarity-chat/primitives'],
    description: '⚡ SSE streaming utilities'
  },
}

export async function addCommand(component: string, options: AddOptions) {
  try {
    // Handle batch mode
    if (options.batch) {
      if (!process.argv.includes('--json') && !process.argv.includes('--quiet')) {
        console.log('\n')
        console.log(createBanner('Add Components', { gradient: 'rainbow', border: true, borderColor: 'cyan' }))
      }
      
      const { batchAddComponents } = await import('../utils/batch.js')
      const components = options.batch.split(',').map(c => c.trim())
      const result = await batchAddComponents(components, {
        path: options.path,
        deps: options.deps !== false,
      })
      
      if (result.failed.length > 0) {
        warn(`${result.failed.length} components failed to add`)
        process.exit(1)
      }
      
      if (!process.argv.includes('--json') && !process.argv.includes('--quiet')) {
        console.log('\n')
        console.log(successMessage(`Successfully added ${result.successful.length} components!`, {
          title: '✨ Complete',
          borderColor: 'green',
        }))
      } else {
        success(`Successfully added ${result.successful.length} components`)
      }
      return
    }

    // Validate component name
    const validatedComponent = validate(ComponentSchema, component, 'Invalid component name')
    
    const componentConfig = COMPONENTS[validatedComponent as keyof typeof COMPONENTS]
    
    if (!componentConfig) {
      throw new NotFoundError(
        `Component "${validatedComponent}" not found`,
        [
          'Run: clarity-chat browse to see all available components',
          'Check component name spelling',
        ]
      )
    }

    if (!process.argv.includes('--json') && !process.argv.includes('--quiet')) {
      console.log('\n')
      console.log(createBanner(`Add ${componentConfig.name}`, { gradient: 'cristal', border: true, borderColor: 'cyan' }))
    }

    info(`Adding component: ${validatedComponent}`)

    const spinner = createSpinner('Preparing installation...', { color: 'cyan' })
    spinner.start()

    const cwd = process.cwd()
    
    // Load config for default paths
    const config = await loadConfig(cwd)
    const defaultPath = config.paths?.components || './src/components/clarity-chat'
    
    // Validate and resolve path
    const targetPath = options.path 
      ? validatePath(options.path, cwd)
      : path.join(cwd, defaultPath)

    // Ensure directory exists
    await fs.ensureDir(targetPath)
    spinner.text = 'Copying component files...'

    // Copy component files
    const templatesDir = path.join(__dirname, '..', '..', 'templates', 'components', validatedComponent)
    
    if (await fs.pathExists(templatesDir)) {
      for (const file of componentConfig.files) {
        const sourcePath = path.join(templatesDir, file)
        const destPath = path.join(targetPath, file)
        
        if (await fs.pathExists(sourcePath)) {
          await fs.copy(sourcePath, destPath)
          logger.info(`Copied ${file}`)
        }
      }
    } else {
      spinner.warn('Template files not found, creating placeholder...')
      // Create placeholder file
      await fs.writeFile(
        path.join(targetPath, `${componentConfig.name.replace(/\s+/g, '')}.tsx`),
        `// ${componentConfig.name}\n// TODO: Implement component\n\nexport function ${componentConfig.name.replace(/\s+/g, '')}() {\n  return <div>Component placeholder</div>\n}\n`,
        'utf-8'
      )
    }

    spinner.succeed('Component files copied')

    // Install dependencies
    if (options.deps !== false && componentConfig.dependencies.length > 0) {
      spinner.start('Installing dependencies...')
      
      try {
        const packageManager = await detectPackageManager(cwd)
        await installDependencies(cwd, packageManager, componentConfig.dependencies)
        spinner.succeed('Dependencies installed')
      } catch (error) {
        spinner.fail('Failed to install dependencies')
        logger.error(error)
        throw new ValidationError(
          'Failed to install dependencies',
          [
            'Check your internet connection',
            'Verify package manager is installed',
            'Run with --no-deps to skip dependency installation',
          ]
        )
      }
    }

    spinner.succeed('Component added successfully')
    
    if (!process.argv.includes('--json') && !process.argv.includes('--quiet')) {
      console.log('\n')
      console.log(successMessage(`Component "${validatedComponent}" added successfully!`, {
        title: '✅ Added',
        borderColor: 'green',
      }))
      console.log()
      console.log(infoMessage(`Import it in your code:\n\n${chalk.bold.cyan(`import { ${componentConfig.name.replace(/\s+/g, '')} } from '@/components/clarity-chat'`)}`, {
        title: '💻 Usage',
        borderColor: 'blue',
      }))
      console.log()
      console.log(chalk.gray('📚 View docs: ') + chalk.bold.cyan(`clarity-chat docs ${validatedComponent}`))
    } else {
      success(`Component "${validatedComponent}" added successfully!`)
      info(`Import it in your code:`)
      console.log(chalk.cyan(`  import { ${componentConfig.name.replace(/\s+/g, '')} } from '@/components/clarity-chat'`))
    }

  } catch (error) {
    handleError(error)
  }
}
