/**
 * docs command - Open documentation or search
 * Enhanced with beautiful UI components
 */

import pc from 'picocolors'
import open from 'open'
import { getLogger } from '../utils/logger.js'
import { sectionHeader } from '../ui/banner.js'
import { table, type TableColumn } from '../ui/table.js'
import { infoBox, warningBox } from '../ui/box.js'

const logger = getLogger('docs')

interface DocsOptions {
  offline?: boolean
}

const DOCS_URLS = {
  main: 'https://github.com/christireid/Clarity-ai-chat-components',
  'chat-interface': 'https://github.com/christireid/Clarity-ai-chat-components/components/chat-interface',
  'model-selector': 'https://github.com/christireid/Clarity-ai-chat-components/components/model-selector',
  streaming: 'https://github.com/christireid/Clarity-ai-chat-components/guides/streaming',
  'api-keys': 'https://github.com/christireid/Clarity-ai-chat-components/guides/api-keys',
  examples: 'https://github.com/christireid/Clarity-ai-chat-components/examples',
}

export async function docsCommand(query?: string, options?: DocsOptions) {
  console.log()
  console.log(sectionHeader('📚 Clarity Chat Documentation'))
  console.log()

  if (options?.offline) {
    console.log(
      warningBox(
        'Offline documentation not yet available\n\nVisit: https://github.com/christireid/Clarity-ai-chat-components',
        '⚠ Offline Mode'
      )
    )
    console.log()
    return
  }

  let url = DOCS_URLS.main
  let docTitle = 'Main Documentation'

  if (query) {
    // Try to find specific doc page
    const lowerQuery = query.toLowerCase()
    const matchedKey = Object.keys(DOCS_URLS).find(
      (key) =>
        key.toLowerCase().includes(lowerQuery) || lowerQuery.includes(key)
    )

    if (matchedKey) {
      url = DOCS_URLS[matchedKey as keyof typeof DOCS_URLS]
      docTitle =
        matchedKey.charAt(0).toUpperCase() +
        matchedKey.slice(1).replace(/-/g, ' ')
    } else {
      // Use search
      url = `${DOCS_URLS.main}/search?q=${encodeURIComponent(query)}`
      docTitle = `Search: "${query}"`
    }
  }

  // Display available docs in a table if no query
  if (!query) {
    const columns: TableColumn[] = [
      { header: 'Topic', width: 20, color: pc.yellow },
      { header: 'Description', width: 40 },
    ]

    const docsData = Object.entries(DOCS_URLS).map(([key, value]) => {
      const description =
        key === 'main'
          ? 'Main documentation homepage'
          : key === 'chat-interface'
            ? 'Chat interface component docs'
            : key === 'model-selector'
              ? 'Model selector component docs'
              : key === 'streaming'
                ? 'Streaming guide'
                : key === 'api-keys'
                  ? 'API keys setup guide'
                  : 'Example applications'

      return [key, description]
    })

    console.log(sectionHeader('📖 Available Documentation'))
    console.log(table(docsData, columns))
    console.log()
  }

  try {
    const infoContent = [
      pc.bold(`Opening: ${docTitle}`),
      '',
      pc.gray('URL: ') + pc.cyan(url),
    ].join('\n')

    console.log(infoBox(infoContent, '📚 Opening Docs'))
    console.log()

    await open(url)
    console.log(pc.gray(`Opened in browser: ${url}`))
    console.log()
  } catch (error) {
    console.error('Failed to open browser')
    console.log()
    console.log(
      warningBox(
        `Failed to open browser automatically.\n\nManually visit: ${pc.cyan(url)}`,
        '⚠ Browser Error'
      )
    )
    console.log()
  }
}
