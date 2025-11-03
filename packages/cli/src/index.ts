#!/usr/bin/env node

/**
 * Clarity Chat CLI
 * Beautiful developer experience for AI component library
 */

import { Command } from 'commander'
import chalk from 'chalk'
import gradient from 'gradient-string'
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

const program = new Command()

// ASCII Art Banner
const banner = gradient.pastel.multiline([
  '  ____  _               _ _         ____  _           _   ',
  ' / ___|| | __ _ _ __(_) |_ _   _/ ___|| |__   __ _| |_ ',
  '| |    | |/ _` | \'__| | __| | | | |    | \'_ \\ / _` | __|',
  '| |___ | | (_| | |  | | |_| |_| | |___ | | | | (_| | |_ ',
  ' \\____|_|\\__,_|_|  |_|\\__|\\__, |\\____|_| |_|\\__,_|\\__|',
  '                           |___/                          ',
].join('\n'))

console.log('\n' + banner + '\n')

program
  .name('clarity-chat')
  .description('🎨 Beautiful CLI for Clarity Chat - AI Component Library')
  .version('0.1.0')

// Register commands
program
  .command('init')
  .description('🚀 Initialize a new Clarity Chat project')
  .option('-t, --template <template>', 'Project template (basic, chat, rag, analytics)')
  .option('-f, --framework <framework>', 'Framework (nextjs, remix, vite)')
  .option('--no-install', 'Skip dependency installation')
  .option('--no-git', 'Skip git initialization')
  .action(initCommand)

program
  .command('add <component>')
  .description('➕ Add a component to your project')
  .option('-p, --path <path>', 'Installation path', './src/components')
  .option('--no-deps', 'Skip dependency installation')
  .action(addCommand)

program
  .command('keys')
  .description('🔑 Manage API keys')
  .option('add <provider>', 'Add API key for provider (openai, anthropic, google)')
  .option('list', 'List configured providers')
  .option('remove <provider>', 'Remove API key')
  .option('validate', 'Validate all API keys')
  .action(keysCommand)

program
  .command('dev')
  .description('🔥 Start development server with hot reload')
  .option('-p, --port <port>', 'Port number', '3000')
  .option('--open', 'Open in browser')
  .action(devCommand)

program
  .command('generate <type>')
  .description('⚡ Generate code (component, hook, adapter, test)')
  .option('-n, --name <name>', 'Component/hook name')
  .option('-o, --output <path>', 'Output directory')
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
  .action(doctorCommand)

program
  .command('upgrade')
  .description('🚀 Upgrade Clarity Chat packages')
  .option('-i, --interactive', 'Interactive mode for selecting packages')
  .option('-y, --yes', 'Skip confirmation prompts')
  .option('--major', 'Only show major updates')
  .option('--minor', 'Only show minor updates')
  .option('--patch', 'Only show patch updates')
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

// Parse commands
program.parse()
