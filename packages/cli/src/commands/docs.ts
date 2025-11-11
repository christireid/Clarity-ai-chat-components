/**
 * docs command - Open documentation or search
 */

import chalk from 'chalk'
import open from 'open'
import { getLogger } from '../utils/logger.js'
import { createBanner } from '../ui/banner.js'
import { successMessage, infoMessage, tipMessage } from '../ui/messages.js'
import { createSpinner } from '../ui/progress.js'
import { handleError } from '../utils/errors.js'

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
  await createBanner('📚 Documentation', {
    gradient: true,
    style: 'bold',
  })
  console.log()

  if (options?.offline) {
    infoMessage('Offline documentation not yet available')
    tipMessage('Visit: https://clarity-chat.dev')
    return
  }

  let url = DOCS_URLS.main
  let action = 'Opening main documentation...'

  if (query) {
    // Try to find specific doc page
    const lowerQuery = query.toLowerCase()
    const matchedKey = Object.keys(DOCS_URLS).find(key => 
      key.toLowerCase().includes(lowerQuery) || lowerQuery.includes(key)
    )

    if (matchedKey) {
      url = DOCS_URLS[matchedKey as keyof typeof DOCS_URLS]
      action = `Opening docs for: ${matchedKey}`
    } else {
      // Use search
      url = `${DOCS_URLS.main}/search?q=${encodeURIComponent(query)}`
      action = `Searching docs for: "${query}"`
    }
  }

  const spinner = await createSpinner(action, { color: 'cyan' })
  
  try {
    spinner.start()
    await open(url)
    spinner.succeed()
    
    successMessage(`Documentation opened successfully!`)
    infoMessage(`URL: ${url}`)
    console.log()
  } catch (error) {
    spinner.fail()
    logger.error('Failed to open browser')
    tipMessage(`Manually visit: ${url}`)
    handleError(error)
  }
}
