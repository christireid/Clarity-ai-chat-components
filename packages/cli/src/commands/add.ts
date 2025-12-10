/**
 * add command - Add a component to your project
 * Enhanced with beautiful UI components
 */

import pc from 'picocolors'
import path from 'path'
import fs from 'fs-extra'
import { execa } from 'execa'
import { getLogger } from '../utils/logger.js'
import { sectionHeader } from '../ui/banner.js'
import { table, type TableColumn } from '../ui/table.js'
import { createSpinner } from '../ui/progress.js'
import { successBox, errorBox, infoBox } from '../ui/box.js'

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
    description: '💬 Full-featured chat UI component',
    icon: '💬',
  },
  'model-selector': {
    name: 'Model Selector',
    files: ['ModelSelector.tsx'],
    dependencies: ['@clarity-chat/react', '@clarity-chat/types'],
    description: '🤖 Dropdown to select AI models',
    icon: '🤖',
  },
  'token-counter': {
    name: 'Token Counter',
    files: ['TokenCounter.tsx'],
    dependencies: ['@clarity-chat/react'],
    description: '📊 Real-time token usage display',
    icon: '📊',
  },
  'cost-estimator': {
    name: 'Cost Estimator',
    files: ['CostEstimator.tsx'],
    dependencies: ['@clarity-chat/react', '@clarity-chat/types'],
    description: '💰 Calculate API costs in real-time',
    icon: '💰',
  },
  'streaming-handler': {
    name: 'Streaming Handler',
    files: ['useStreaming.ts', 'StreamingProvider.tsx'],
    dependencies: ['@clarity-chat/primitives'],
    description: '⚡ SSE streaming utilities',
    icon: '⚡',
  },
}

async function detectPackageManager(cwd: string): Promise<string> {
  if (await fs.pathExists(path.join(cwd, 'package-lock.json'))) return 'npm'
  if (await fs.pathExists(path.join(cwd, 'yarn.lock'))) return 'yarn'
  if (await fs.pathExists(path.join(cwd, 'pnpm-lock.yaml'))) return 'pnpm'
  return 'npm'
}

export async function addCommand(component: string, options: AddOptions) {
  console.log()
  console.log(sectionHeader('➕ Add Component'))
  console.log()

  const componentConfig = COMPONENTS[component as keyof typeof COMPONENTS]

  if (!componentConfig) {
    logger.error(`Component "${component}" not found`)

    // Display available components in a beautiful table
    const columns: TableColumn[] = [
      { header: 'Component', width: 25, color: pc.yellow },
      { header: 'Description', width: 40 },
    ]

    const componentData = Object.entries(COMPONENTS).map(([key, value]) => [
      `${value.icon} ${key}`,
      value.description,
    ])

    console.log()
    console.log(sectionHeader('📦 Available Components'))
    console.log(table(componentData, columns))
    console.log()

    process.exit(1)
  }

  // Display component info
  console.log(
    infoBox(
      `${componentConfig.icon} ${componentConfig.name}\n${componentConfig.description}`,
      'Component Info'
    )
  )
  console.log()

  const spinner = createSpinner('Preparing installation...')
  spinner.start()

  try {
    const cwd = process.cwd()
    const targetPath = path.join(
      cwd,
      options.path || './src/components/clarity-chat'
    )

    // Ensure directory exists
    await fs.ensureDir(targetPath)
    spinner.text = 'Copying component files...'

    // Copy component files
    const templatesDir = path.join(
      __dirname,
      '..',
      '..',
      'templates',
      'components',
      component
    )

    const copiedFiles: string[] = []

    if (await fs.pathExists(templatesDir)) {
      for (const file of componentConfig.files) {
        const sourcePath = path.join(templatesDir, file)
        const destPath = path.join(targetPath, file)

        if (await fs.pathExists(sourcePath)) {
          await fs.copy(sourcePath, destPath)
          copiedFiles.push(file)
          logger.info(`Copied ${file}`)
        }
      }
    } else {
      spinner.warn('Template files not found, creating placeholder...')
      // Create placeholder file
      const placeholderFile = `${componentConfig.name.replace(/\s+/g, '')}.tsx`
      await fs.writeFile(
        path.join(targetPath, placeholderFile),
        `// ${componentConfig.name}\n// TODO: Implement component\n\nexport function ${componentConfig.name.replace(/\s+/g, '')}() {\n  return <div>Component placeholder</div>\n}\n`,
        'utf-8'
      )
      copiedFiles.push(placeholderFile)
    }

    spinner.succeed('Component files copied')

    // Install dependencies
    if (options.deps !== false && componentConfig.dependencies.length > 0) {
      spinner.start('Installing dependencies...')

      try {
        const packageManager = await detectPackageManager(cwd)
        const installCmd = packageManager === 'yarn' ? 'add' : 'install'

        await execa(
          packageManager,
          [installCmd, ...componentConfig.dependencies],
          { cwd }
        )
        spinner.succeed('Dependencies installed')
      } catch (error) {
        spinner.fail('Failed to install dependencies')
        logger.error(error instanceof Error ? error : new Error(String(error)))
      }
    }

    // Success message
    console.log()
    const componentName = componentConfig.name.replace(/\s+/g, '')
    const importPath = options.path
      ? `'${options.path}/${componentName}'`
      : `'@/components/clarity-chat/${componentName}'`

    const successContent = [
      pc.bold('Component added successfully!'),
      '',
      pc.white('Files created:'),
      ...copiedFiles.map((file) => pc.cyan(`  • ${file}`)),
      '',
      pc.white('Import it in your code:'),
      pc.cyan(`  import { ${componentName} } from ${importPath}`),
      '',
      pc.gray('📚 View docs: ') + pc.bold(`clarity-chat docs ${component}`),
    ].join('\n')

    console.log(successBox(successContent, '✓ Success'))
    console.log()
  } catch (error) {
    spinner.fail('Failed to add component')
    logger.error(error instanceof Error ? error : new Error(String(error)))
    console.log()
    console.log(
      errorBox('Failed to add component. Check the error above.', '✗ Error')
    )
    console.log()
    process.exit(1)
  }
}
