/**
 * docs command - Open documentation or search
 */

import chalk from 'chalk'
import open from 'open'
import { getLogger } from '../utils/logger.js'

const logger = getLogger('docs')

interface DocsOptions {
  offline?: boolean
}

const DOCS_URLS = {
  main: 'https://clarity-chat.dev',
  'chat-interface': 'https://clarity-chat.dev/components/chat-interface',
  'model-selector': 'https://clarity-chat.dev/components/model-selector',
  'streaming': 'https://clarity-chat.dev/guides/streaming',
  'api-keys': 'https://clarity-chat.dev/guides/api-keys',
  'examples': 'https://clarity-chat.dev/examples',
}

export async function docsCommand(query?: string, options?: DocsOptions) {
  console.log('\n' + chalk.bold.cyan('📚 Clarity Chat Documentation\n'))

  if (options?.offline) {
    console.log(chalk.yellow('Offline documentation not yet available'))
    console.log(chalk.gray('Visit: ') + chalk.cyan('https://clarity-chat.dev'))
    return
  }

  let url = DOCS_URLS.main

  if (query) {
    // Try to find specific doc page
    const lowerQuery = query.toLowerCase()
    const matchedKey = Object.keys(DOCS_URLS).find(key => 
      key.toLowerCase().includes(lowerQuery) || lowerQuery.includes(key)
    )

    if (matchedKey) {
      url = DOCS_URLS[matchedKey as keyof typeof DOCS_URLS]
      console.log(chalk.green(`Opening docs for: ${matchedKey}\n`))
    } else {
      // Use search
      url = `${DOCS_URLS.main}/search?q=${encodeURIComponent(query)}`
      console.log(chalk.green(`Searching docs for: "${query}"\n`))
    }
  } else {
    console.log(chalk.green('Opening main documentation...\n'))
  }

  try {
    await open(url)
    console.log(chalk.gray(`Opened: ${url}`))
  } catch (error) {
    logger.error('Failed to open browser')
    console.log(chalk.yellow('\nManually visit: ') + chalk.cyan(url))
  }
}
