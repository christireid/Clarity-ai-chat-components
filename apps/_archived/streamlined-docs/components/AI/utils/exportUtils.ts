/**
 * Export Utilities
 *
 * Functions for exporting chat conversations to various formats.
 */

import type { Message } from '@clarity-chat/types'

export interface ExportOptions {
  format: 'json' | 'html' | 'markdown'
  includeMetadata?: boolean
  includeImages?: boolean
}

export interface ExportResult {
  content: string
  mimeType: string
  extension: string
}

/**
 * Escape HTML special characters to prevent XSS in HTML exports
 * Also converts newlines to <br> for HTML rendering
 */
export function escapeHtml(text: string): string {
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
  return escaped.replace(/\n/g, '<br>')
}

/**
 * Generate export content in the specified format
 */
export function generateExportContent(
  messages: Message[],
  sessionId: string,
  options: ExportOptions
): ExportResult {
  const { format, includeMetadata = true } = options
  const timestamp = new Date().toLocaleString()

  switch (format) {
    case 'json':
      return {
        content: JSON.stringify(
          {
            exportedAt: timestamp,
            sessionId,
            messageCount: messages.length,
            messages: messages.map((m) => ({
              id: m.id,
              role: m.role,
              content: m.content,
              createdAt: m.createdAt,
              ...(includeMetadata && { status: m.status }),
            })),
          },
          null,
          2
        ),
        mimeType: 'application/json',
        extension: 'json',
      }

    case 'html':
      return {
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Clarity Chat Export</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 800px; margin: 2rem auto; padding: 0 1rem; }
    .message { margin: 1rem 0; padding: 1rem; border-radius: 8px; }
    .user { background: #e3f2fd; }
    .assistant { background: #f5f5f5; }
    .meta { font-size: 0.75rem; color: #666; margin-bottom: 0.5rem; }
    pre { background: #1e1e1e; color: #d4d4d4; padding: 1rem; border-radius: 4px; overflow-x: auto; }
  </style>
</head>
<body>
  <h1>Clarity Chat Documentation Assistant</h1>
  <p>Exported: ${escapeHtml(timestamp)}</p>
  <hr>
  ${messages
    .map(
      (m) => `
  <div class="message ${m.role}">
    ${includeMetadata ? `<div class="meta">${m.role === 'user' ? 'You' : 'Assistant'} • ${new Date(m.createdAt).toLocaleTimeString()}</div>` : ''}
    <div>${escapeHtml(m.content)}</div>
  </div>`
    )
    .join('')}
</body>
</html>`,
        mimeType: 'text/html',
        extension: 'html',
      }

    case 'markdown':
    default: {
      let content = '# Clarity Chat Documentation Assistant\n\n'
      content += `Exported: ${timestamp}\n\n---\n\n`
      messages.forEach((message) => {
        const role = message.role === 'user' ? 'You' : 'Assistant'
        const time = new Date(message.createdAt).toLocaleTimeString()
        content += `## ${role}${includeMetadata ? ` (${time})` : ''}\n\n${message.content}\n\n`
      })
      return {
        content,
        mimeType: 'text/markdown',
        extension: 'md',
      }
    }
  }
}

/**
 * Result of download attempt
 */
export interface DownloadResult {
  success: boolean
  error?: string
}

/**
 * Download exported content as a file (SSR-safe)
 */
export function downloadExport(result: ExportResult): DownloadResult {
  // SSR safety check
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return { success: false, error: 'Not in browser environment' }
  }

  try {
    const blob = new Blob([result.content], { type: result.mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `clarity-chat-${Date.now()}.${result.extension}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    return { success: true }
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : 'Failed to download export',
    }
  }
}
