import type { HookMessage } from './types'
import { getTextContent } from './types'

/**
 * Export a conversation in the chosen format and trigger a browser download.
 */
export function exportConversation(
  messages: HookMessage[],
  format: string,
  filename = 'conversation'
): void {
  const visible = messages.filter(
    (m) => m.role === 'user' || m.role === 'assistant'
  )

  let content: string
  let mimeType: string
  let ext: string

  switch (format) {
    case 'json':
    case 'all': {
      const data = visible.map((m) => ({
        role: m.role,
        content: getTextContent(m.content),
      }))
      content = JSON.stringify(
        { messages: data, exportedAt: new Date().toISOString() },
        null,
        2
      )
      mimeType = 'application/json'
      ext = 'json'
      break
    }
    case 'text': {
      content = visible
        .map((m) => `[${m.role}]\n${getTextContent(m.content)}`)
        .join('\n\n---\n\n')
      mimeType = 'text/plain'
      ext = 'txt'
      break
    }
    case 'markdown':
    case 'report':
    case 'artifacts':
    default: {
      content = visible
        .map((m) => {
          const role = m.role === 'user' ? '**You**' : '**Assistant**'
          return `### ${role}\n\n${getTextContent(m.content)}`
        })
        .join('\n\n---\n\n')
      content = `# Conversation Export\n\n${content}`
      mimeType = 'text/markdown'
      ext = 'md'
      break
    }
  }

  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}.${ext}`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
