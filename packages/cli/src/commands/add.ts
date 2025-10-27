/**
 * add command - Add a component to your project
 */

import chalk from 'chalk'
import ora from 'ora'
import path from 'path'
import fs from 'fs-extra'
import { execa } from 'execa'
import { getLogger } from '../utils/logger.js'

const logger = getLogger('add')

interface AddOptions {
  path?: string
  deps?: boolean
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
  console.log('\n')
  console.log(chalk.bold.cyan(`➕ Adding component: ${component}\n`))

  const componentConfig = COMPONENTS[component as keyof typeof COMPONENTS]
  
  if (!componentConfig) {
    logger.error(`Component "${component}" not found`)
    console.log(chalk.yellow('\nAvailable components:'))
    Object.entries(COMPONENTS).forEach(([key, value]) => {
      console.log(chalk.cyan(`  • ${key}`) + chalk.gray(` - ${value.description}`))
    })
    process.exit(1)
  }

  const spinner = ora('Preparing installation...').start()

  try {
    const cwd = process.cwd()
    const targetPath = path.join(cwd, options.path || './src/components/clarity-chat')

    // Ensure directory exists
    await fs.ensureDir(targetPath)
    spinner.text = 'Copying component files...'

    // Copy component files
    const templatesDir = path.join(__dirname, '..', '..', 'templates', 'components', component)
    
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
        const installCmd = packageManager === 'yarn' ? 'add' : 'install'
        
        await execa(packageManager, [installCmd, ...componentConfig.dependencies], { cwd })
        spinner.succeed('Dependencies installed')
      } catch (error) {
        spinner.fail('Failed to install dependencies')
        logger.error(error)
      }
    }

    // Success message
    console.log('\n' + chalk.green('✅ Component added successfully!\n'))
    console.log(chalk.white('Import it in your code:\n'))
    console.log(chalk.cyan(`  import { ${componentConfig.name.replace(/\s+/g, '')} } from '@/components/clarity-chat'\n`))
    console.log(chalk.gray('📚 View docs: ') + chalk.bold('clarity-chat docs ' + component))

  } catch (error) {
    spinner.fail('Failed to add component')
    logger.error(error)
    process.exit(1)
  }
}

async function detectPackageManager(cwd: string): Promise<string> {
  if (await fs.pathExists(path.join(cwd, 'package-lock.json'))) return 'npm'
  if (await fs.pathExists(path.join(cwd, 'yarn.lock'))) return 'yarn'
  if (await fs.pathExists(path.join(cwd, 'pnpm-lock.yaml'))) return 'pnpm'
  return 'npm'
}
