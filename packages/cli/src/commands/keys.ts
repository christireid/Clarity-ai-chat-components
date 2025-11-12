/**
 * keys command - Manage API keys
 */

import chalk from 'chalk'
import prompts from 'prompts'
import ora from 'ora'
import fs from 'fs-extra'
import path from 'path'
import { getLogger } from '../utils/logger.js'
import { ValidationError, NotFoundError, handleError } from '../utils/errors.js'
import { ProviderSchema, validate } from '../utils/validation.js'
import { validatePath, maskSensitive, validateApiKeyFormat, ensureEnvInGitignore } from '../utils/security.js'
import { success, info, warn, error, outputJson } from '../utils/output.js'
import { createBanner } from '../ui/banner.js'
import { successMessage, infoMessage, warningMessage } from '../ui/messages.js'
import { createSpinner } from '../ui/progress.js'
import { createListTable } from '../ui/table.js'

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
  if (!process.argv.includes('--json') && !process.argv.includes('--quiet')) {
    console.log('\n')
    console.log(createBanner('API Key Manager', { gradient: 'retro' }))
    console.log()
  }

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
  // Validate provider
  const validatedProvider = validate(ProviderSchema, provider, 'Invalid provider')
  
  const providerConfig = PROVIDERS[validatedProvider as keyof typeof PROVIDERS]
  
  if (!providerConfig) {
    throw new NotFoundError(
      `Provider "${validatedProvider}" not found`,
      [
        'Available providers: openai, anthropic, google',
        'Run: clarity-chat keys --help for more info',
      ]
    )
  }

  if (!process.argv.includes('--json') && !process.argv.includes('--quiet')) {
    console.log()
    console.log(infoMessage(`Get your API key: ${chalk.underline.cyan(providerConfig.docs)}`, {
      title: '📚 Documentation',
      borderColor: 'blue',
    }))
    console.log()
  }

  const { apiKey } = await prompts({
    type: 'password',
    name: 'apiKey',
    message: `Enter your ${providerConfig.name} API key:`,
    validate: (value: string) => {
      if (!value || value.length === 0) {
        return 'API key is required'
      }
      // Basic format validation
      if (!validateApiKeyFormat(value, validatedProvider as 'openai' | 'anthropic' | 'google')) {
        return `Invalid ${providerConfig.name} API key format`
      }
      return true
    }
  })

  if (!apiKey) {
    throw new ValidationError('API key not provided', ['Provide a valid API key'])
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
  
  // Ensure .env.local is in .gitignore
  const cwd = path.dirname(envPath)
  await ensureEnvInGitignore(cwd)
  
  if (!process.argv.includes('--json') && !process.argv.includes('--quiet')) {
    console.log()
    console.log(successMessage(`${providerConfig.name} API key saved to .env.local`, {
      title: '✅ Saved',
      borderColor: 'green',
    }))
    console.log()
    console.log(warningMessage('Restart your dev server to use the new key', {
      title: '⚠️  Note',
      borderColor: 'yellow',
    }))
  } else {
    success(`${providerConfig.name} API key saved to .env.local`)
    warn('Restart your dev server to use the new key')
  }
}

async function listKeys(envPath: string) {
  if (!await fs.pathExists(envPath)) {
    warn('No .env.local file found')
    info('Run: clarity-chat keys add to add keys')
    return
  }

  const envContent = await fs.readFile(envPath, 'utf-8')
  
  const keys: Record<string, { configured: boolean; masked?: string }> = {}
  
  Object.entries(PROVIDERS).forEach(([key, config]) => {
    const regex = new RegExp(`^${config.envVar}=(.+)$`, 'm')
    const match = envContent.match(regex)
    
    if (match && match[1] && !match[1].includes('your_') && !match[1].includes('_key_here')) {
      keys[config.name] = {
        configured: true,
        masked: maskSensitive(match[1], 4),
      }
    } else {
      keys[config.name] = {
        configured: false,
      }
    }
  })

  if (process.argv.includes('--json')) {
    outputJson(keys)
    return
  }

  if (!process.argv.includes('--quiet')) {
    console.log()
    console.log(infoMessage('Configured API Keys', {
      title: '🔑 Keys',
      borderColor: 'blue',
    }))
    console.log()
    
    const keyList = Object.entries(PROVIDERS).map(([key, config]) => {
      const keyInfo = keys[config.name]
      return {
        key: `${config.icon} ${config.name}`,
        value: keyInfo.configured && keyInfo.masked ? keyInfo.masked : 'Not configured',
        color: keyInfo.configured ? 'green' : 'gray',
      }
    })
    
    const listItems = keyList.map(item => ({
      label: item.key,
      value: item.value,
      color: item.color ? (text: string) => chalk[item.color as keyof typeof chalk](text) : undefined
    }))
    console.log(createListTable(listItems))
  } else {
    info('Configured API Keys:\n')
    Object.entries(PROVIDERS).forEach(([key, config]) => {
      const keyInfo = keys[config.name]
      if (keyInfo.configured && keyInfo.masked) {
        success(`${config.icon} ${config.name}: ${keyInfo.masked}`)
      } else {
        console.log(chalk.gray(`⬜ ${config.icon} ${config.name}: Not configured`))
      }
    })
  }
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
