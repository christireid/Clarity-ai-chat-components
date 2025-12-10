#!/usr/bin/env node

/**
 * Clarity Chat CLI
 * Beautiful developer experience for AI component library
 */

import { Command } from 'commander'
import pc from 'picocolors'
import { initCommand } from './commands/init.js'
import { addCommand } from './commands/add.js'
import { keysCommand } from './commands/keys.js'
import { devCommand } from './commands/dev.js'
import { generateCommand } from './commands/generate.js'
import { docsCommand } from './commands/docs.js'
import { doctorCommand } from './commands/doctor.js'
import { upgradeCommand } from './commands/upgrade.js'
import { analyzeCommand } from './commands/analyze.js'
import { benchmarkCommand } from './commands/benchmark.js'
import { browseCommand, searchComponents } from './commands/browse.js'
import { migrateThemeCommand } from './commands/migrate-theme.js'
import { validateThemeCommand } from './commands/validate-theme.js'
import { generateCompletion } from './utils/completion.js'
import { initOutputMode } from './utils/output.js'
import { handleError, withErrorHandling } from './utils/errors.js'
import { setGlobalLogLevel, LogLevel } from './utils/logger.js'
import { checkAndNotifyUpdate } from './utils/update.js'
import { createBanner } from './ui/banner.js'

const program = new Command()

// Beautiful gradient banner - create synchronously for main entry
import gradient from 'gradient-string'

const banner = gradient.pastel.multiline(
  [
    '  ____  _               _ _         ____  _           _   ',
    ' / ___|| | __ _ _ __(_) |_ _   _/ ___|| |__   __ _| |_ ',
    "| |    | |/ _` | '__| | __| | | | |    | '_ \\ / _` | __|",
    '| |___ | | (_| | |  | | |_| |_| | |___ | | | | (_| | |_ ',
    ' \\____|_|\\__,_|_|  |_|\\__|\\__, |\\____|_| |_|\\__,_|\\__|',
    '                           |___/                          ',
  ].join('\n')
)

// Only show banner if not in JSON mode
if (!process.argv.includes('--json')) {
  console.log('\n' + banner + '\n')
}

program
  .name('clarity-chat')
  .description('🎨 Beautiful CLI for Clarity Chat - AI Component Library')
  .version('0.1.0')
  .option('--json', 'Output JSON for machine parsing')
  .option('-q, --quiet', 'Suppress non-error output')
  .option('-v, --verbose', 'Show detailed output')
  .option('--debug', 'Show debug information')
  .hook('preAction', async (thisCommand, actionCommand) => {
    // Initialize output mode from global options
    const globalOpts = thisCommand.opts()
    initOutputMode({
      json: globalOpts.json || false,
      quiet: globalOpts.quiet || false,
      verbose: globalOpts.verbose || false,
    })

    // Set log level
    if (globalOpts.debug || process.env.DEBUG) {
      setGlobalLogLevel(LogLevel.DEBUG)
    } else if (globalOpts.verbose) {
      setGlobalLogLevel(LogLevel.INFO)
    }

    // Check for updates (non-blocking, only for certain commands)
    const commandName = actionCommand.name()
    if (['init', 'add', 'dev'].includes(commandName)) {
      // Check for updates in background (don't await)
      checkAndNotifyUpdate().catch(() => {
        // Silently ignore update check errors
      })
    }
  })

// Register commands
program
  .command('init')
  .description('🚀 Initialize a new Clarity Chat project')
  .option(
    '-t, --template <template>',
    'Project template (basic, chat, rag, analytics)'
  )
  .option('-f, --framework <framework>', 'Framework (nextjs, remix, vite)')
  .option('--no-install', 'Skip dependency installation')
  .option('--no-git', 'Skip git initialization')
  .option('--dry-run', 'Show what would be created without making changes')
  .action(initCommand)

program
  .command('add <component>')
  .description('➕ Add a component to your project')
  .option('-p, --path <path>', 'Installation path', './src/components')
  .option('--no-deps', 'Skip dependency installation')
  .option('--batch <components>', 'Add multiple components (comma-separated)')
  .option('--dry-run', 'Show what would be added without making changes')
  .action(addCommand)

program
  .command('keys')
  .description('🔑 Manage API keys')
  .option(
    'add <provider>',
    'Add API key for provider (openai, anthropic, google)'
  )
  .option('list', 'List configured providers')
  .option('remove <provider>', 'Remove API key')
  .option('validate', 'Validate all API keys')
  .action(keysCommand)

program
  .command('dev')
  .description('🔥 Start development server with hot reload')
  .option('-p, --port <port>', 'Port number', '3000')
  .option('--open', 'Open in browser')
  .option('--watch', 'Watch mode (auto-restart on changes)')
  .action(devCommand)

program
  .command('generate <type>')
  .description('⚡ Generate code (component, hook, adapter, test)')
  .option('-n, --name <name>', 'Component/hook name')
  .option('-o, --output <path>', 'Output directory')
  .option('--dry-run', 'Show what would be generated without creating files')
  .action(generateCommand)

program
  .command('docs [query]')
  .description('📚 Open documentation or search')
  .option('--offline', 'Use offline docs')
  .action(docsCommand)

program
  .command('doctor')
  .description('🩺 Check project health and configuration')
  .option('--fix', 'Auto-fix common issues')
  .option('--dry-run', 'Show what --fix would change without applying')
  .action(doctorCommand)

program
  .command('upgrade')
  .description('🚀 Upgrade Clarity Chat packages')
  .option('-i, --interactive', 'Interactive mode for selecting packages')
  .option('-y, --yes', 'Skip confirmation prompts')
  .option('--major', 'Only show major updates')
  .option('--minor', 'Only show minor updates')
  .option('--patch', 'Only show patch updates')
  .option('--dry-run', 'Show what would be upgraded without making changes')
  .action(upgradeCommand)

program
  .command('analyze')
  .description('🔍 Analyze project usage and generate reports')
  .option('-r, --report', 'Generate detailed report files')
  .option('-v, --verbose', 'Show detailed output')
  .action(analyzeCommand)

program
  .command('benchmark')
  .description('⚡ Run performance benchmarks')
  .option('-i, --iterations <number>', 'Number of iterations', '100')
  .option('-s, --save', 'Save results to file')
  .option('-c, --compare', 'Compare with previous run')
  .action(benchmarkCommand)

program
  .command('browse')
  .description('🎨 Browse available components interactively')
  .action(browseCommand)

program
  .command('search <query>')
  .description('🔍 Search for components')
  .action(searchComponents)

program
  .command('migrate-theme')
  .description('🎨 Migrate from legacy to modern theme system')
  .option('-p, --path <path>', 'Project path to migrate', '.')
  .option('--dry-run', 'Show changes without applying them')
  .option('-i, --interactive', 'Interactive mode for selecting changes')
  .option('-y, --yes', 'Skip confirmation prompts')
  .action(migrateThemeCommand)

program
  .command('validate-theme')
  .description('✅ Validate theme configurations and accessibility')
  .option('-p, --path <path>', 'Project path to validate', '.')
  .option('--strict', 'Exit with error code if validation fails')
  .action(validateThemeCommand)

// Completion command
program
  .command('completion <shell>')
  .description('🔧 Generate shell completion script')
  .option('--install', 'Show installation instructions')
  .action(async (shell: string, options: { install?: boolean }) => {
    const validShells = ['bash', 'zsh', 'fish']
    if (!validShells.includes(shell)) {
      handleError(
        new Error(
          `Invalid shell: ${shell}. Supported: ${validShells.join(', ')}`
        )
      )
      return
    }

    const script = generateCompletion(program, shell as 'bash' | 'zsh' | 'fish')

    if (options.install) {
      // Beautiful installation instructions
      const { createBanner } = await import('./ui/banner.js')
      const { infoMessage, tipMessage, commandExample } =
        await import('./ui/messages.js')

      console.log(
        createBanner('🔧 Shell Completion', {
          gradient: 'pastel',
        })
      )
      console.log()

      switch (shell) {
        case 'bash':
          infoMessage('Add this line to your ~/.bashrc or ~/.bash_profile:')
          console.log(
            commandExample(`eval "$(clarity-chat completion ${shell})"`)
          )
          console.log()
          tipMessage('Then reload your shell: source ~/.bashrc')
          break
        case 'zsh':
          infoMessage('Add this line to your ~/.zshrc:')
          console.log(
            commandExample(`eval "$(clarity-chat completion ${shell})"`)
          )
          console.log()
          tipMessage('Then reload your shell: source ~/.zshrc')
          break
        case 'fish':
          infoMessage('Save the completion script to:')
          console.log(
            commandExample(
              `clarity-chat completion ${shell} > ~/.config/fish/completions/clarity-chat.fish`
            )
          )
          console.log()
          tipMessage(
            'Fish will automatically load completions from this directory'
          )
          break
      }
      console.log()
    } else {
      console.log(script)
    }
  })

// Error handling
program.configureOutput({
  writeErr: (str) => {
    if (!process.argv.includes('--json')) {
      process.stderr.write(str)
    }
  },
})

// Parse commands with error handling
try {
  program.parse()
} catch (error) {
  handleError(error)
}
