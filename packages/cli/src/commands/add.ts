/**
 * add command - Add a component to your project
 * Enhanced with beautiful UI components
 *
 * Uses the centralized COMPONENT_REGISTRY for component metadata,
 * ensuring consistency across the CLI.
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
import {
  COMPONENT_REGISTRY,
  getComponent,
  resolveComponentDependencies,
} from '../registry/index.js'

const logger = getLogger('add')

interface AddOptions {
  path?: string
  deps?: boolean
  batch?: string
  dryRun?: boolean
  yes?: boolean
  force?: boolean
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

  // Use centralized registry to get component config
  const componentConfig = getComponent(component)

  if (!componentConfig) {
    logger.error(`Component "${component}" not found`)

    // Display available components in a beautiful table using registry
    const columns: TableColumn[] = [
      { header: 'Component', width: 25, color: pc.yellow },
      { header: 'Category', width: 12 },
      { header: 'Description', width: 40 },
    ]

    const componentData = Object.values(COMPONENT_REGISTRY).map((comp) => [
      `${comp.icon} ${comp.slug}`,
      comp.category,
      comp.description,
    ])

    console.log()
    console.log(sectionHeader('📦 Available Components'))
    console.log(table(componentData, columns))
    console.log()
    console.log(pc.gray('Use: clarity-chat add <component>'))
    console.log()

    process.exit(1)
  }

  // Resolve dependencies (includes transitive registry dependencies)
  const allComponents = resolveComponentDependencies(component)
  const hasRegistryDeps = allComponents.length > 1

  // Display component info with dependency tree
  const infoLines = [
    `${componentConfig.icon} ${componentConfig.name}`,
    componentConfig.description,
    '',
    `Category: ${componentConfig.category}`,
    `Files: ${componentConfig.files.length}`,
  ]

  if (hasRegistryDeps) {
    infoLines.push('')
    infoLines.push('Includes dependencies:')
    allComponents
      .filter((c) => c !== component)
      .forEach((dep) => {
        const depConfig = getComponent(dep)
        if (depConfig) {
          infoLines.push(`  ${depConfig.icon} ${dep}`)
        }
      })
  }

  console.log(infoBox(infoLines.join('\n'), 'Component Info'))
  console.log()

  // Dry run mode - show what would be added without making changes
  if (options.dryRun) {
    console.log(pc.yellow('📋 Dry run - no files will be created'))
    console.log()
    console.log(pc.bold('Would create:'))
    componentConfig.files.forEach((file) => {
      console.log(pc.cyan(`  + ${file}`))
    })
    console.log()
    console.log(pc.bold('Would install:'))
    componentConfig.dependencies.forEach((dep) => {
      console.log(pc.cyan(`  + ${dep}`))
    })
    console.log()
    return
  }

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

    // Copy component files from registry-defined file list
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

        // Check for existing files
        if ((await fs.pathExists(destPath)) && !options.force) {
          spinner.warn(
            `Skipping ${file} (already exists, use --force to overwrite)`
          )
          continue
        }

        if (await fs.pathExists(sourcePath)) {
          await fs.copy(sourcePath, destPath)
          copiedFiles.push(file)
          logger.info(`Copied ${file}`)
        }
      }
    } else {
      spinner.warn('Template files not found, creating placeholder...')
      // Create placeholder file using registry name
      const placeholderFile = `${componentConfig.name.replace(/\s+/g, '')}.tsx`
      const destPath = path.join(targetPath, placeholderFile)

      if ((await fs.pathExists(destPath)) && !options.force) {
        spinner.warn('Placeholder already exists, skipping')
      } else {
        await fs.writeFile(
          destPath,
          `// ${componentConfig.name}\n// TODO: Implement component\n// Docs: ${componentConfig.docs}\n\nexport function ${componentConfig.name.replace(/\s+/g, '')}() {\n  return <div>Component placeholder</div>\n}\n`,
          'utf-8'
        )
        copiedFiles.push(placeholderFile)
      }
    }

    spinner.succeed('Component files copied')

    // Collect all dependencies from registry config
    const allDependencies = [
      ...componentConfig.dependencies,
      ...componentConfig.devDependencies.map((d) => `${d} --save-dev`),
    ]

    // Install dependencies
    if (options.deps !== false && allDependencies.length > 0) {
      spinner.start('Installing dependencies...')

      try {
        const packageManager = await detectPackageManager(cwd)
        const installCmd = packageManager === 'yarn' ? 'add' : 'install'

        // Install regular dependencies
        if (componentConfig.dependencies.length > 0) {
          await execa(
            packageManager,
            [installCmd, ...componentConfig.dependencies],
            { cwd }
          )
        }

        // Install dev dependencies
        if (componentConfig.devDependencies.length > 0) {
          const devFlag = packageManager === 'yarn' ? '--dev' : '--save-dev'
          await execa(
            packageManager,
            [installCmd, devFlag, ...componentConfig.devDependencies],
            { cwd }
          )
        }

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
      pc.gray('📚 View docs: ') + pc.cyan(componentConfig.docs),
    ].join('\n')

    console.log(successBox(successContent, '✓ Success'))

    // Show usage example if available
    if (componentConfig.examples.length > 0) {
      console.log()
      console.log(pc.bold('Example usage:'))
      console.log(pc.gray('─'.repeat(40)))
      console.log(pc.cyan(componentConfig.examples[0].code))
      console.log()
    }
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
