#!/usr/bin/env tsx
/**
 * Example Generator Script
 *
 * Generates new example apps from the template with consistent structure.
 *
 * Usage:
 *   pnpm generate:example --name "my-example" --title "My Example" --description "Example description"
 *   pnpm generate:example --interactive
 */

import fs from 'fs/promises'
import path from 'path'

interface ExampleConfig {
  name: string // slug (e.g., "streaming-chat")
  title: string // display name (e.g., "Streaming Chat")
  description: string // short description
  subtitle?: string // header subtitle
  icon?: string // emoji icon
  features?: string[] // list of features
  envVars?: string // custom env vars
  usageInstructions?: string
}

const TEMPLATE_DIR = path.join(process.cwd(), 'apps/examples/_template')
const EXAMPLES_DIR = path.join(process.cwd(), 'apps/examples')

// Parse command line arguments
function parseArgs(): Partial<ExampleConfig> & { interactive?: boolean } {
  const args = process.argv.slice(2)
  const config: Partial<ExampleConfig> & { interactive?: boolean } = {}

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    const next = args[i + 1]

    switch (arg) {
      case '--name':
        config.name = next
        i++
        break
      case '--title':
        config.title = next
        i++
        break
      case '--description':
        config.description = next
        i++
        break
      case '--subtitle':
        config.subtitle = next
        i++
        break
      case '--icon':
        config.icon = next
        i++
        break
      case '--interactive':
      case '-i':
        config.interactive = true
        break
    }
  }

  return config
}

// Interactive prompts
async function promptForConfig(): Promise<ExampleConfig> {
  const readline = await import('readline')
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  const question = (prompt: string): Promise<string> =>
    new Promise((resolve) => rl.question(prompt, resolve))

  console.log('\n📝 Creating new Clarity Chat example\n')

  const name = (await question('Example slug (e.g., streaming-chat): ')).trim()
  const title = (await question('Example title (e.g., Streaming Chat): ')).trim()
  const description = (await question('Description: ')).trim()
  const subtitle = (await question('Subtitle (optional): ')).trim() || `${title} example`
  const icon = (await question('Icon emoji (default: 💬): ')).trim() || '💬'

  rl.close()

  return {
    name: name || `example-${Date.now()}`,
    title: title || 'New Example',
    description: description || 'A Clarity Chat example',
    subtitle,
    icon,
    usageInstructions: `This example demonstrates ${title.toLowerCase()}. Interact with the components to see them in action.`,
  }
}

// Convert config to placeholders map
function createPlaceholders(config: ExampleConfig): Record<string, string> {
  const componentName = config.name
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')

  return {
    '{{EXAMPLE_NAME}}': config.name,
    '{{EXAMPLE_TITLE}}': config.title,
    '{{EXAMPLE_DESCRIPTION}}': config.description,
    '{{EXAMPLE_SUBTITLE}}': config.subtitle || `${config.title} example`,
    '{{EXAMPLE_ICON}}': config.icon || '💬',
    '{{EXAMPLE_SLUG}}': config.name,
    '{{EXAMPLE_COMPONENT_NAME}}': componentName,
    '{{FEATURE_LIST}}': config.features?.map((f) => `- ${f}`).join('\n') || '- Feature 1\n- Feature 2',
    '{{ENV_VARS}}': config.envVars || 'OPENAI_API_KEY=sk-...',
    '{{USAGE_INSTRUCTIONS}}': config.usageInstructions || 'Instructions will be added here.',
    '{{IMPLEMENTATION_DETAILS}}': '- Implementation details will be added here.',
    '{{RELATED_EXAMPLES}}': '- [Streaming Chat](../streaming-chat/)\n- [RAG Pipeline](../rag-pipeline/)',
    '{{CUSTOM_ENV_VARS}}': '',
  }
}

// Replace placeholders in content
function replacePlaceholders(content: string, placeholders: Record<string, string>): string {
  let result = content
  for (const [placeholder, value] of Object.entries(placeholders)) {
    result = result.replaceAll(placeholder, value)
  }
  return result
}

// Copy directory recursively
async function copyDir(src: string, dest: string, placeholders: Record<string, string>): Promise<void> {
  await fs.mkdir(dest, { recursive: true })

  const entries = await fs.readdir(src, { withFileTypes: true })

  // Directories to skip during copy
  const skipDirs = ['node_modules', '.git', '.next', '.turbo', 'dist', 'build', '.cache']

  for (const entry of entries) {
    // Skip excluded directories
    if (entry.isDirectory() && skipDirs.includes(entry.name)) {
      continue
    }

    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)

    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath, placeholders)
    } else {
      const content = await fs.readFile(srcPath, 'utf-8')
      const replaced = replacePlaceholders(content, placeholders)
      await fs.writeFile(destPath, replaced, 'utf-8')
    }
  }
}

// Update workspace configuration
async function updateWorkspace(_exampleName: string): Promise<void> {
  console.log('\n📦 Updating workspace configuration...')

  try {
    // Update root package.json workspace config if needed
    const rootPackageJson = path.join(process.cwd(), 'package.json')
    const rootPkg = JSON.parse(await fs.readFile(rootPackageJson, 'utf-8'))

    if (rootPkg.workspaces && Array.isArray(rootPkg.workspaces.packages)) {
      const examplePattern = 'apps/examples/*'
      if (!rootPkg.workspaces.packages.includes(examplePattern)) {
        rootPkg.workspaces.packages.push(examplePattern)
        await fs.writeFile(rootPackageJson, JSON.stringify(rootPkg, null, 2) + '\n')
        console.log('   ✓ Updated root package.json')
      }
    }
  } catch (error) {
    console.warn('   ⚠ Could not update workspace config:', error)
  }
}

// Main generator function
async function generateExample(config: ExampleConfig): Promise<void> {
  const examplePath = path.join(EXAMPLES_DIR, config.name)

  console.log(`\n🎨 Generating example: ${config.title}`)
  console.log(`   Location: ${examplePath}`)

  // Check if example already exists
  try {
    await fs.access(examplePath)
    console.error(`\n❌ Error: Example "${config.name}" already exists at ${examplePath}`)
    process.exit(1)
  } catch {
    // Good, it doesn't exist
  }

  // Check if template exists
  try {
    await fs.access(TEMPLATE_DIR)
  } catch {
    console.error(`\n❌ Error: Template not found at ${TEMPLATE_DIR}`)
    process.exit(1)
  }

  // Create placeholders
  const placeholders = createPlaceholders(config)

  // Copy template
  console.log('\n📋 Copying template files...')
  await copyDir(TEMPLATE_DIR, examplePath, placeholders)
  console.log('   ✓ Template copied')

  // Update workspace
  await updateWorkspace(config.name)

  // Success message
  console.log(`\n✅ Example created successfully!\n`)
  console.log('Next steps:')
  console.log(`   cd apps/examples/${config.name}`)
  console.log(`   pnpm install  (run from monorepo root)`)
  console.log(`   pnpm dev`)
  console.log(`\n📚 Edit the example at: apps/examples/${config.name}/src/app/page.tsx\n`)
}

// Main execution
async function main() {
  try {
    const args = parseArgs()

    let config: ExampleConfig

    if (args.interactive) {
      config = await promptForConfig()
    } else if (args.name && args.title && args.description) {
      config = {
        name: args.name,
        title: args.title,
        description: args.description,
        subtitle: args.subtitle,
        icon: args.icon,
      }
    } else {
      console.error(`
❌ Error: Missing required arguments

Usage:
  pnpm generate:example --name "my-example" --title "My Example" --description "Example description"
  pnpm generate:example --interactive

Required arguments:
  --name         Example slug (e.g., "streaming-chat")
  --title        Display title (e.g., "Streaming Chat")
  --description  Short description

Optional arguments:
  --subtitle     Header subtitle
  --icon         Emoji icon (default: 💬)
  --interactive  Interactive mode with prompts
`)
      process.exit(1)
    }

    await generateExample(config)
  } catch (error) {
    console.error('\n❌ Error generating example:', error)
    process.exit(1)
  }
}

main()
