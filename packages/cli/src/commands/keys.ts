/**
 * keys command - Manage API keys
 */

import chalk from 'chalk'
import prompts from 'prompts'
import ora from 'ora'
import fs from 'fs-extra'
import path from 'path'
import { getLogger } from '../utils/logger.js'

const logger = getLogger('keys')

interface KeysOptions {
  add?: string
  list?: boolean
  remove?: string
  validate?: boolean
}

const PROVIDERS = {
  openai: {
    name: 'OpenAI',
    envVar: 'OPENAI_API_KEY',
    testUrl: 'https://api.openai.com/v1/models',
    icon: '🤖',
    docs: 'https://platform.openai.com/api-keys'
  },
  anthropic: {
    name: 'Anthropic',
    envVar: 'ANTHROPIC_API_KEY',
    testUrl: 'https://api.anthropic.com/v1/models',
    icon: '🧠',
    docs: 'https://console.anthropic.com/account/keys'
  },
  google: {
    name: 'Google AI',
    envVar: 'GOOGLE_API_KEY',
    testUrl: 'https://generativelanguage.googleapis.com/v1/models',
    icon: '🔍',
    docs: 'https://makersuite.google.com/app/apikey'
  },
}

export async function keysCommand(options: KeysOptions) {
  console.log('\n' + chalk.bold.cyan('🔑 API Key Manager\n'))

  const cwd = process.cwd()
  const envPath = path.join(cwd, '.env.local')

  // List keys
  if (options.list) {
    await listKeys(envPath)
    return
  }

  // Add key
  if (options.add) {
    await addKey(options.add, envPath)
    return
  }

  // Remove key
  if (options.remove) {
    await removeKey(options.remove, envPath)
    return
  }

  // Validate keys
  if (options.validate) {
    await validateKeys(envPath)
    return
  }

  // Interactive menu
  const { action } = await prompts({
    type: 'select',
    name: 'action',
    message: 'What would you like to do?',
    choices: [
      { title: '➕ Add API key', value: 'add' },
      { title: '📋 List configured keys', value: 'list' },
      { title: '✅ Validate keys', value: 'validate' },
      { title: '❌ Remove key', value: 'remove' },
    ]
  })

  switch (action) {
    case 'add': {
      const { provider } = await prompts({
        type: 'select',
        name: 'provider',
        message: 'Select provider:',
        choices: Object.entries(PROVIDERS).map(([key, value]) => ({
          title: `${value.icon} ${value.name}`,
          value: key
        }))
      })
      await addKey(provider, envPath)
      break
    }
    case 'list':
      await listKeys(envPath)
      break
    case 'validate':
      await validateKeys(envPath)
      break
    case 'remove': {
      const { provider } = await prompts({
        type: 'select',
        name: 'provider',
        message: 'Select provider to remove:',
        choices: Object.entries(PROVIDERS).map(([key, value]) => ({
          title: `${value.icon} ${value.name}`,
          value: key
        }))
      })
      await removeKey(provider, envPath)
      break
    }
  }
}

async function addKey(provider: string, envPath: string) {
  const providerConfig = PROVIDERS[provider as keyof typeof PROVIDERS]
  
  if (!providerConfig) {
    logger.error(`Unknown provider: ${provider}`)
    console.log(chalk.yellow('\nAvailable providers:'))
    Object.keys(PROVIDERS).forEach(key => {
      console.log(chalk.cyan(`  • ${key}`))
    })
    return
  }

  console.log(chalk.gray(`\n📚 Get your key: ${providerConfig.docs}\n`))

  const { apiKey } = await prompts({
    type: 'password',
    name: 'apiKey',
    message: `Enter your ${providerConfig.name} API key:`,
    validate: (value: string) => value.length > 0 ? true : 'API key is required'
  })

  if (!apiKey) {
    logger.error('API key not provided')
    return
  }

  // Read or create .env.local
  let envContent = ''
  if (await fs.pathExists(envPath)) {
    envContent = await fs.readFile(envPath, 'utf-8')
  } else {
    envContent = '# Clarity Chat API Keys\n# Never commit this file!\n\n'
  }

  // Update or add the key
  const envVar = providerConfig.envVar
  const keyRegex = new RegExp(`^${envVar}=.*$`, 'm')
  
  if (keyRegex.test(envContent)) {
    envContent = envContent.replace(keyRegex, `${envVar}=${apiKey}`)
  } else {
    envContent += `${envVar}=${apiKey}\n`
  }

  await fs.writeFile(envPath, envContent, 'utf-8')
  
  console.log(chalk.green(`\n✅ ${providerConfig.name} API key saved to .env.local`))
  console.log(chalk.yellow('⚠️  Restart your dev server to use the new key'))
}

async function listKeys(envPath: string) {
  if (!await fs.pathExists(envPath)) {
    console.log(chalk.yellow('No .env.local file found'))
    console.log(chalk.gray('Run: ') + chalk.bold('clarity-chat keys add') + chalk.gray(' to add keys'))
    return
  }

  const envContent = await fs.readFile(envPath, 'utf-8')
  
  console.log(chalk.bold('Configured API Keys:\n'))
  
  Object.entries(PROVIDERS).forEach(([key, config]) => {
    const regex = new RegExp(`^${config.envVar}=(.+)$`, 'm')
    const match = envContent.match(regex)
    
    if (match && match[1] && match[1] !== 'your_' + key + '_key_here') {
      const maskedKey = match[1].slice(0, 8) + '...' + match[1].slice(-4)
      console.log(chalk.green(`✅ ${config.icon} ${config.name}: ${maskedKey}`))
    } else {
      console.log(chalk.gray(`⬜ ${config.icon} ${config.name}: Not configured`))
    }
  })
}

async function removeKey(provider: string, envPath: string) {
  const providerConfig = PROVIDERS[provider as keyof typeof PROVIDERS]
  
  if (!providerConfig) {
    logger.error(`Unknown provider: ${provider}`)
    return
  }

  if (!await fs.pathExists(envPath)) {
    console.log(chalk.yellow('No .env.local file found'))
    return
  }

  const envContent = await fs.readFile(envPath, 'utf-8')
  const envVar = providerConfig.envVar
  const keyRegex = new RegExp(`^${envVar}=.*$`, 'm')
  
  if (!keyRegex.test(envContent)) {
    console.log(chalk.yellow(`${providerConfig.name} key not found in .env.local`))
    return
  }

  const { confirm } = await prompts({
    type: 'confirm',
    name: 'confirm',
    message: `Remove ${providerConfig.name} API key?`,
    initial: false
  })

  if (!confirm) {
    console.log(chalk.gray('Cancelled'))
    return
  }

  const updatedContent = envContent.replace(keyRegex, '')
  await fs.writeFile(envPath, updatedContent, 'utf-8')
  
  console.log(chalk.green(`\n✅ ${providerConfig.name} API key removed`))
}

async function validateKeys(envPath: string) {
  if (!await fs.pathExists(envPath)) {
    console.log(chalk.yellow('No .env.local file found'))
    return
  }

  const envContent = await fs.readFile(envPath, 'utf-8')
  
  console.log(chalk.bold('Validating API Keys...\n'))
  
  for (const [key, config] of Object.entries(PROVIDERS)) {
    const regex = new RegExp(`^${config.envVar}=(.+)$`, 'm')
    const match = envContent.match(regex)
    
    if (!match || !match[1] || match[1].includes('your_')) {
      console.log(chalk.gray(`⬜ ${config.icon} ${config.name}: Not configured`))
      continue
    }

    const spinner = ora(`Testing ${config.name}...`).start()
    
    try {
      const response = await fetch(config.testUrl, {
        headers: {
          'Authorization': key === 'openai' ? `Bearer ${match[1]}` : ``,
          'x-api-key': key === 'anthropic' ? match[1] : '',
        }
      })
      
      if (response.ok || response.status === 200) {
        spinner.succeed(chalk.green(`${config.icon} ${config.name}: Valid`))
      } else {
        spinner.fail(chalk.red(`${config.icon} ${config.name}: Invalid (${response.status})`))
      }
    } catch (error) {
      spinner.fail(chalk.red(`${config.icon} ${config.name}: Failed to validate`))
    }
  }
}
