/**
 * keys command - Manage API keys
 * Enhanced with beautiful UI components
 */

import chalk from 'chalk'
import prompts from 'prompts'
import fs from 'fs-extra'
import path from 'path'
import { getLogger } from '../utils/logger.js'
import { sectionHeader } from '../ui/banner.js'
import { table, TableColumn, keyValueTable } from '../ui/table.js'
import { createSpinner } from '../ui/progress.js'
import { successBox, warningBox, infoBox } from '../ui/box.js'

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
    docs: 'https://platform.openai.com/api-keys',
    color: chalk.green,
  },
  anthropic: {
    name: 'Anthropic',
    envVar: 'ANTHROPIC_API_KEY',
    testUrl: 'https://api.anthropic.com/v1/models',
    icon: '🧠',
    docs: 'https://console.anthropic.com/account/keys',
    color: chalk.magenta,
  },
  google: {
    name: 'Google AI',
    envVar: 'GOOGLE_API_KEY',
    testUrl: 'https://generativelanguage.googleapis.com/v1/models',
    icon: '🔍',
    docs: 'https://makersuite.google.com/app/apikey',
    color: chalk.blue,
  },
}

export async function keysCommand(options: KeysOptions) {
  console.log()
  console.log(sectionHeader('🔑 API Key Manager'))
  console.log()

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

  console.log()
  console.log(infoBox(
    `Get your API key: ${chalk.cyan(providerConfig.docs)}`,
    `${providerConfig.icon} ${providerConfig.name}`
  ))
  console.log()

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
  
  console.log()
  console.log(successBox(
    `${providerConfig.name} API key saved to .env.local\n\n${chalk.yellow('⚠️  Restart your dev server to use the new key')}`,
    '✓ Key Saved'
  ))
  console.log()
}

async function listKeys(envPath: string) {
  if (!await fs.pathExists(envPath)) {
    console.log(warningBox(
      'No .env.local file found\n\nRun: clarity-chat keys add to add keys',
      '⚠ No Keys'
    ))
    console.log()
    return
  }

  const envContent = await fs.readFile(envPath, 'utf-8')
  
  // Create table data
  const columns: TableColumn[] = [
    { header: 'Provider', width: 20, color: chalk.white },
    { header: 'Status', width: 15, align: 'center' },
    { header: 'Key Preview', width: 20 },
  ]

  const tableData = Object.entries(PROVIDERS).map(([key, config]) => {
    const regex = new RegExp(`^${config.envVar}=(.+)$`, 'm')
    const match = envContent.match(regex)
    
    if (match && match[1] && !match[1].includes('your_')) {
      const maskedKey = match[1].slice(0, 8) + '...' + match[1].slice(-4)
      return [
        `${config.icon} ${config.name}`,
        chalk.green('✓ Configured'),
        chalk.gray(maskedKey),
      ]
    } else {
      return [
        `${config.icon} ${config.name}`,
        chalk.gray('Not configured'),
        chalk.gray('—'),
      ]
    }
  })

  console.log(sectionHeader('📋 Configured API Keys'))
  console.log()
  console.log(table(tableData, columns))
  console.log()
}

async function removeKey(provider: string, envPath: string) {
  const providerConfig = PROVIDERS[provider as keyof typeof PROVIDERS]
  
  if (!providerConfig) {
    logger.error(`Unknown provider: ${provider}`)
    return
  }

  if (!await fs.pathExists(envPath)) {
    console.log(warningBox('No .env.local file found', '⚠ Not Found'))
    console.log()
    return
  }

  const envContent = await fs.readFile(envPath, 'utf-8')
  const envVar = providerConfig.envVar
  const keyRegex = new RegExp(`^${envVar}=.*$`, 'm')
  
  if (!keyRegex.test(envContent)) {
    console.log(warningBox(
      `${providerConfig.name} key not found in .env.local`,
      '⚠ Not Found'
    ))
    console.log()
    return
  }

  const { confirm } = await prompts({
    type: 'confirm',
    name: 'confirm',
    message: `Remove ${providerConfig.name} API key?`,
    initial: false
  })

  if (!confirm) {
    console.log(chalk.gray('\nCancelled'))
    return
  }

  const updatedContent = envContent.replace(keyRegex, '')
  await fs.writeFile(envPath, updatedContent, 'utf-8')
  
  console.log()
  console.log(successBox(
    `${providerConfig.name} API key removed`,
    '✓ Removed'
  ))
  console.log()
}

async function validateKeys(envPath: string) {
  if (!await fs.pathExists(envPath)) {
    console.log(warningBox('No .env.local file found', '⚠ Not Found'))
    console.log()
    return
  }

  const envContent = await fs.readFile(envPath, 'utf-8')
  
  console.log(sectionHeader('✅ Validating API Keys'))
  console.log()

  const results: Array<{ provider: string; status: 'valid' | 'invalid' | 'not-configured' | 'error' }> = []

  for (const [key, config] of Object.entries(PROVIDERS)) {
    const regex = new RegExp(`^${config.envVar}=(.+)$`, 'm')
    const match = envContent.match(regex)
    
    if (!match || !match[1] || match[1].includes('your_')) {
      results.push({ provider: config.name, status: 'not-configured' })
      continue
    }

    const spinner = createSpinner(`Testing ${config.name}...`)
    spinner.start()
    
    try {
      const response = await fetch(config.testUrl, {
        headers: {
          'Authorization': key === 'openai' ? `Bearer ${match[1]}` : ``,
          'x-api-key': key === 'anthropic' ? match[1] : '',
        }
      })
      
      if (response.ok || response.status === 200) {
        spinner.succeed(`${config.icon} ${config.name}: Valid`)
        results.push({ provider: config.name, status: 'valid' })
      } else {
        spinner.fail(`${config.icon} ${config.name}: Invalid (${response.status})`)
        results.push({ provider: config.name, status: 'invalid' })
      }
    } catch (error) {
      spinner.fail(`${config.icon} ${config.name}: Failed to validate`)
      results.push({ provider: config.name, status: 'error' })
    }
  }

  console.log()

  // Summary
  const validCount = results.filter(r => r.status === 'valid').length
  const invalidCount = results.filter(r => r.status === 'invalid').length
  const notConfiguredCount = results.filter(r => r.status === 'not-configured').length

  const summary = {
    'Valid': chalk.green(validCount.toString()),
    'Invalid': chalk.red(invalidCount.toString()),
    'Not Configured': chalk.gray(notConfiguredCount.toString()),
  }

  console.log(infoBox(
    Object.entries(summary)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n'),
    'Validation Summary'
  ))
  console.log()
}
