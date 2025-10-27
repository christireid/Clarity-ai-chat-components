/**
 * init command - Initialize a new Clarity Chat project
 */

import React from 'react'
import { render } from 'ink'
import chalk from 'chalk'
import boxen from 'boxen'
import ora from 'ora'
import { execa } from 'execa'
import fs from 'fs-extra'
import path from 'path'
import { InitWizard } from '../components/InitWizard.js'
import { detectFramework, detectPackageManager } from '../utils/detect.js'
import { installDependencies } from '../utils/install.js'
import { getLogger } from '../utils/logger.js'

const logger = getLogger('init')

interface InitOptions {
  template?: string
  framework?: string
  install?: boolean
  git?: boolean
}

export async function initCommand(options: InitOptions) {
  console.log('\n')
  console.log(boxen(
    chalk.bold.cyan('🚀 Initialize Clarity Chat Project\n\n') +
    chalk.gray('Setting up your AI-powered application...'),
    { 
      padding: 1, 
      margin: 1, 
      borderStyle: 'round',
      borderColor: 'cyan'
    }
  ))

  try {
    // Detect existing setup
    const cwd = process.cwd()
    const detectedFramework = await detectFramework(cwd)
    const packageManager = await detectPackageManager(cwd)

    logger.info(`Detected framework: ${detectedFramework || 'none'}`)
    logger.info(`Package manager: ${packageManager}`)

    // Interactive setup wizard if no options provided
    let config: any
    if (!options.template && !options.framework) {
      const { waitUntilExit } = render(React.createElement(InitWizard, {
        detectedFramework,
        packageManager,
        onComplete: (result) => {
          config = result
        }
      }))
      await waitUntilExit()
    } else {
      // Use CLI options
      config = {
        framework: options.framework || detectedFramework || 'nextjs',
        template: options.template || 'basic',
        components: ['chat-interface', 'model-selector'],
        apiKeys: {},
        installDeps: options.install !== false,
        initGit: options.git !== false
      }
    }

    if (!config) {
      logger.error('Setup cancelled')
      process.exit(1)
    }

    // Create project structure
    const spinner = ora('Creating project structure...').start()
    
    await fs.ensureDir(path.join(cwd, 'src', 'components', 'clarity-chat'))
    await fs.ensureDir(path.join(cwd, 'src', 'lib'))
    
    spinner.succeed('Project structure created')

    // Copy template files
    spinner.start('Installing components...')
    
    const templatePath = path.join(__dirname, '..', '..', 'templates', config.template)
    if (await fs.pathExists(templatePath)) {
      await fs.copy(templatePath, cwd, {
        filter: (src) => !src.includes('node_modules')
      })
    }

    // Generate configuration files
    await generateConfigFiles(cwd, config)
    
    spinner.succeed('Components installed')

    // Install dependencies
    if (config.installDeps) {
      spinner.start(`Installing dependencies with ${packageManager}...`)
      
      try {
        await installDependencies(cwd, packageManager, [
          '@clarity-chat/react',
          '@clarity-chat/primitives',
          '@clarity-chat/types'
        ])
        spinner.succeed('Dependencies installed')
      } catch (error) {
        spinner.fail('Failed to install dependencies')
        logger.error(error)
      }
    }

    // Initialize git
    if (config.initGit) {
      spinner.start('Initializing git repository...')
      try {
        await execa('git', ['init'], { cwd })
        await execa('git', ['add', '.'], { cwd })
        await execa('git', ['commit', '-m', 'Initial commit with Clarity Chat'], { cwd })
        spinner.succeed('Git repository initialized')
      } catch (error) {
        spinner.warn('Git initialization skipped')
      }
    }

    // Create .env.local with placeholder keys
    const envPath = path.join(cwd, '.env.local')
    if (!await fs.pathExists(envPath)) {
      await fs.writeFile(envPath, `# Clarity Chat API Keys
# Add your API keys here (never commit this file!)

OPENAI_API_KEY=your_openai_key_here
ANTHROPIC_API_KEY=your_anthropic_key_here
GOOGLE_API_KEY=your_google_key_here
`, 'utf-8')
      logger.info('Created .env.local with placeholder keys')
    }

    // Success message
    console.log('\n')
    console.log(boxen(
      chalk.bold.green('✅ Project initialized successfully!\n\n') +
      chalk.white('Next steps:\n') +
      chalk.cyan('  1. Add your API keys to .env.local\n') +
      chalk.cyan('  2. Run ') + chalk.bold('npm run dev') + chalk.cyan(' to start development\n') +
      chalk.cyan('  3. Open ') + chalk.bold('http://localhost:3000') + chalk.cyan(' in your browser\n\n') +
      chalk.gray('Need help? Run: ') + chalk.bold('clarity-chat docs'),
      { 
        padding: 1, 
        margin: 1, 
        borderStyle: 'round',
        borderColor: 'green'
      }
    ))

  } catch (error) {
    logger.error('Initialization failed', error)
    process.exit(1)
  }
}

async function generateConfigFiles(cwd: string, config: any) {
  // Generate tailwind.config.js if needed
  const tailwindConfig = path.join(cwd, 'tailwind.config.js')
  if (!await fs.pathExists(tailwindConfig)) {
    await fs.writeFile(tailwindConfig, `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@clarity-chat/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        'clarity': {
          primary: '#3b82f6',
          secondary: '#8b5cf6',
          accent: '#06b6d4',
        }
      }
    },
  },
  plugins: [],
}
`, 'utf-8')
  }

  // Generate clarity-chat.config.js
  const clarityChatConfig = path.join(cwd, 'clarity-chat.config.js')
  await fs.writeFile(clarityChatConfig, `/** @type {import('@clarity-chat/cli').Config} */
module.exports = {
  framework: '${config.framework}',
  components: ${JSON.stringify(config.components, null, 2)},
  apiKeys: {
    openai: process.env.OPENAI_API_KEY,
    anthropic: process.env.ANTHROPIC_API_KEY,
    google: process.env.GOOGLE_API_KEY,
  },
  defaults: {
    temperature: 0.7,
    maxTokens: 1000,
    streaming: true,
  }
}
`, 'utf-8')
}
