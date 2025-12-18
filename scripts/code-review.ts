#!/usr/bin/env tsx
/**
 * Interactive Code Review Script
 *
 * Generates review prompts based on selected review type and files.
 * Output can be copied directly to your AI assistant of choice.
 *
 * Usage:
 *   pnpm review                    # Interactive mode
 *   pnpm review --type security    # Run security review
 *   pnpm review --file src/foo.tsx # Review specific file
 *   pnpm review --staged           # Review staged changes
 *   pnpm review --help             # Show help
 */

import * as fs from 'fs'
import * as path from 'path'
import * as readline from 'readline'
import { execSync } from 'child_process'

// ANSI colors
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
}

// Review types and their descriptions
const REVIEW_TYPES = {
  full: {
    name: 'Full Review',
    description:
      'All domains: security, performance, TypeScript, Tailwind, architecture',
    promptFile: '.claude/commands/review-full.md',
    icon: '🔍',
  },
  react: {
    name: 'React/NextJS',
    description: 'Architecture, patterns, Server/Client components',
    promptFile: '.claude/commands/review-react.md',
    icon: '⚛️',
  },
  security: {
    name: 'Security',
    description: 'XSS, CSRF, input validation, Server Actions',
    promptFile: '.claude/commands/review-security.md',
    icon: '🔒',
  },
  performance: {
    name: 'Performance',
    description: 'Memoization, code splitting, re-renders',
    promptFile: '.claude/commands/review-performance.md',
    icon: '⚡',
  },
  typescript: {
    name: 'TypeScript',
    description: 'Strict mode, type safety, generics',
    promptFile: '.claude/commands/review-typescript.md',
    icon: '📘',
  },
  tailwind: {
    name: 'Tailwind CSS',
    description: 'Design system, dark mode, responsive',
    promptFile: '.claude/commands/review-tailwind.md',
    icon: '🎨',
  },
  'clarity-chat': {
    name: 'Clarity Chat',
    description: 'Hook usage, streaming, memory, tools',
    promptFile: '.claude/commands/review-clarity-chat.md',
    icon: '💬',
  },
} as const

type ReviewType = keyof typeof REVIEW_TYPES

interface Options {
  type?: ReviewType
  file?: string
  staged?: boolean
  output?: 'console' | 'clipboard' | 'file'
  help?: boolean
}

function printHeader(): void {
  console.log(`
${colors.cyan}╔═══════════════════════════════════════════════════════════╗
║  ${colors.bold}Clarity Chat - Code Review Generator${colors.reset}${colors.cyan}                    ║
║  Generate AI-ready prompts for code review                  ║
╚═══════════════════════════════════════════════════════════╝${colors.reset}
`)
}

function printHelp(): void {
  console.log(`
${colors.bold}Usage:${colors.reset}
  pnpm review [options]

${colors.bold}Options:${colors.reset}
  --type <type>    Review type: ${Object.keys(REVIEW_TYPES).join(', ')}
  --file <path>    File or directory to review
  --staged         Review staged git changes
  --output <mode>  Output mode: console (default), clipboard, file
  --help           Show this help

${colors.bold}Examples:${colors.reset}
  ${colors.dim}# Interactive mode${colors.reset}
  pnpm review

  ${colors.dim}# Review a specific file for security issues${colors.reset}
  pnpm review --type security --file src/actions/user.ts

  ${colors.dim}# Full review of staged changes${colors.reset}
  pnpm review --type full --staged

  ${colors.dim}# Performance review, copy to clipboard${colors.reset}
  pnpm review --type performance --file src/components/ --output clipboard

${colors.bold}Review Types:${colors.reset}
`)

  for (const [key, config] of Object.entries(REVIEW_TYPES)) {
    console.log(
      `  ${config.icon} ${colors.bold}${key}${colors.reset} - ${config.description}`
    )
  }

  console.log('')
}

function parseArgs(args: string[]): Options {
  const options: Options = {}

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]

    if (arg === '--help' || arg === '-h') {
      options.help = true
    } else if (arg === '--type' || arg === '-t') {
      const value = args[++i]
      if (value && value in REVIEW_TYPES) {
        options.type = value as ReviewType
      } else {
        console.error(
          `${colors.red}Invalid review type: ${value}${colors.reset}`
        )
        console.error(`Valid types: ${Object.keys(REVIEW_TYPES).join(', ')}`)
        process.exit(1)
      }
    } else if (arg === '--file' || arg === '-f') {
      options.file = args[++i]
    } else if (arg === '--staged' || arg === '-s') {
      options.staged = true
    } else if (arg === '--output' || arg === '-o') {
      const value = args[++i] as 'console' | 'clipboard' | 'file'
      if (['console', 'clipboard', 'file'].includes(value)) {
        options.output = value
      }
    }
  }

  return options
}

function createReadline(): readline.Interface {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })
}

async function prompt(
  rl: readline.Interface,
  question: string
): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, resolve)
  })
}

async function selectReviewType(rl: readline.Interface): Promise<ReviewType> {
  console.log(`${colors.bold}Select review type:${colors.reset}\n`)

  const types = Object.entries(REVIEW_TYPES)
  types.forEach(([_key, config], index) => {
    console.log(
      `  ${colors.cyan}${index + 1}${colors.reset}) ${config.icon} ${config.name} - ${colors.dim}${config.description}${colors.reset}`
    )
  })

  console.log('')
  const answer = await prompt(
    rl,
    `${colors.yellow}Enter number (1-${types.length}):${colors.reset} `
  )
  const index = parseInt(answer, 10) - 1

  if (index >= 0 && index < types.length) {
    return types[index][0] as ReviewType
  }

  console.log(
    `${colors.yellow}Invalid selection, defaulting to 'full'${colors.reset}`
  )
  return 'full'
}

async function selectFile(rl: readline.Interface): Promise<string> {
  console.log(
    `\n${colors.bold}Enter file or directory to review:${colors.reset}`
  )
  console.log(
    `${colors.dim}(Press Enter to review staged changes, or type a path)${colors.reset}\n`
  )

  const answer = await prompt(rl, `${colors.yellow}Path:${colors.reset} `)

  if (!answer.trim()) {
    return 'staged'
  }

  // Validate path exists
  if (!fs.existsSync(answer)) {
    console.log(
      `${colors.yellow}Warning: Path does not exist, will use as pattern${colors.reset}`
    )
  }

  return answer.trim()
}

function getStagedFiles(): string[] {
  try {
    const output = execSync('git diff --cached --name-only --diff-filter=ACM', {
      encoding: 'utf-8',
    })
    return output
      .split('\n')
      .filter((f) => f.trim())
      .filter((f) => /\.(tsx?|jsx?)$/.test(f))
  } catch {
    return []
  }
}

function getFilesFromPath(filePath: string): string[] {
  const fullPath = path.resolve(filePath)

  if (!fs.existsSync(fullPath)) {
    return [filePath] // Return as-is, might be a pattern
  }

  const stat = fs.statSync(fullPath)

  if (stat.isFile()) {
    return [fullPath]
  }

  if (stat.isDirectory()) {
    // Get all TypeScript/JavaScript files recursively
    const files: string[] = []

    function walk(dir: string): void {
      const entries = fs.readdirSync(dir, { withFileTypes: true })
      for (const entry of entries) {
        const entryPath = path.join(dir, entry.name)
        if (
          entry.isDirectory() &&
          !entry.name.startsWith('.') &&
          entry.name !== 'node_modules'
        ) {
          walk(entryPath)
        } else if (entry.isFile() && /\.(tsx?|jsx?)$/.test(entry.name)) {
          files.push(entryPath)
        }
      }
    }

    walk(fullPath)
    return files.slice(0, 10) // Limit to 10 files
  }

  return []
}

function readFileContent(filePath: string): string {
  try {
    return fs.readFileSync(filePath, 'utf-8')
  } catch {
    return `// Unable to read file: ${filePath}`
  }
}

function generatePrompt(
  type: ReviewType,
  files: string[],
  fileContents: Record<string, string>
): string {
  const config = REVIEW_TYPES[type]
  const promptPath = path.join(process.cwd(), config.promptFile)

  let basePrompt = ''
  if (fs.existsSync(promptPath)) {
    basePrompt = fs.readFileSync(promptPath, 'utf-8')
  } else {
    basePrompt = `# ${config.name} Review\n\n${config.description}`
  }

  // Build the code section
  const codeSection = files
    .map((file) => {
      const relativePath = path.relative(process.cwd(), file)
      const content = fileContents[file] || readFileContent(file)
      return `## File: ${relativePath}\n\n\`\`\`tsx\n${content}\n\`\`\``
    })
    .join('\n\n---\n\n')

  return `${basePrompt}\n\n---\n\n# Code to Review\n\n${codeSection}`
}

function copyToClipboard(text: string): boolean {
  try {
    // Try pbcopy (macOS)
    execSync('pbcopy', { input: text })
    return true
  } catch {
    try {
      // Try xclip (Linux)
      execSync('xclip -selection clipboard', { input: text })
      return true
    } catch {
      return false
    }
  }
}

function writeToFile(content: string): string {
  const outputPath = path.join(process.cwd(), '.review-prompt.md')
  fs.writeFileSync(outputPath, content, 'utf-8')
  return outputPath
}

async function main(): Promise<void> {
  const args = process.argv.slice(2)
  const options = parseArgs(args)

  printHeader()

  if (options.help) {
    printHelp()
    process.exit(0)
  }

  const rl = createReadline()

  try {
    // Get review type
    let reviewType = options.type
    if (!reviewType) {
      reviewType = await selectReviewType(rl)
    }

    // Get files to review
    let files: string[] = []

    if (options.staged) {
      files = getStagedFiles()
      if (files.length === 0) {
        console.log(
          `${colors.yellow}No staged TypeScript/JavaScript files found${colors.reset}`
        )
        process.exit(0)
      }
    } else if (options.file) {
      files = getFilesFromPath(options.file)
    } else {
      const selectedPath = await selectFile(rl)
      if (selectedPath === 'staged') {
        files = getStagedFiles()
        if (files.length === 0) {
          console.log(
            `${colors.yellow}No staged TypeScript/JavaScript files found${colors.reset}`
          )
          process.exit(0)
        }
      } else {
        files = getFilesFromPath(selectedPath)
      }
    }

    if (files.length === 0) {
      console.log(`${colors.red}No files to review${colors.reset}`)
      process.exit(1)
    }

    // Read file contents
    const fileContents: Record<string, string> = {}
    for (const file of files) {
      fileContents[file] = readFileContent(file)
    }

    // Generate prompt
    const prompt = generatePrompt(reviewType, files, fileContents)

    // Output
    const config = REVIEW_TYPES[reviewType]
    console.log(
      `\n${config.icon} ${colors.bold}${config.name} Review${colors.reset}`
    )
    console.log(`${colors.dim}Files: ${files.length}${colors.reset}\n`)

    const outputMode = options.output || 'console'

    if (outputMode === 'clipboard') {
      if (copyToClipboard(prompt)) {
        console.log(
          `${colors.green}✓ Prompt copied to clipboard!${colors.reset}`
        )
        console.log(
          `${colors.dim}Paste into your AI assistant to start the review.${colors.reset}`
        )
      } else {
        console.log(
          `${colors.yellow}Could not copy to clipboard. Outputting to console:${colors.reset}\n`
        )
        console.log(prompt)
      }
    } else if (outputMode === 'file') {
      const outputPath = writeToFile(prompt)
      console.log(
        `${colors.green}✓ Prompt saved to ${outputPath}${colors.reset}`
      )
    } else {
      console.log(`${colors.cyan}${'─'.repeat(60)}${colors.reset}`)
      console.log(prompt)
      console.log(`${colors.cyan}${'─'.repeat(60)}${colors.reset}`)
      console.log(
        `\n${colors.dim}Copy the above prompt to your AI assistant.${colors.reset}`
      )
    }
  } finally {
    rl.close()
  }
}

main().catch((error) => {
  console.error(`${colors.red}Error: ${error.message}${colors.reset}`)
  process.exit(1)
})
