/**
 * Beautiful table utilities
 * Creates well-formatted tables for structured data
 */

import chalk from 'chalk'

// Optional table - gracefully handle if not available
// Will use fallback implementation

export interface TableOptions {
  border?: boolean
  padding?: number
  align?: 'left' | 'center' | 'right'
  headerStyle?: 'bold' | 'underline' | 'normal'
  headerColor?: string
  cellColor?: (row: number, col: number) => string | null
  compact?: boolean
}

/**
 * Create a beautiful table
 */
export async function createTable(
  headers: string[],
  rows: (string | number)[][],
  options: TableOptions = {}
): Promise<string> {
  const {
    border = true,
    padding = 1,
    align = 'left',
    headerStyle = 'bold',
    headerColor = 'cyan',
    cellColor,
    compact = false,
  } = options

  // Prepare data
  const data: string[][] = []
  
  // Add headers with styling
  const styledHeaders = headers.map(header => {
    let styled = header
    if (headerStyle === 'bold') {
      styled = chalk[headerColor as keyof typeof chalk].bold(header) || header
    } else if (headerStyle === 'underline') {
      styled = chalk[headerColor as keyof typeof chalk].underline(header) || header
    }
    return styled
  })
  data.push(styledHeaders)

  // Add rows with optional coloring
  rows.forEach((row, rowIndex) => {
    const styledRow = row.map((cell, colIndex) => {
      let styled = String(cell)
      if (cellColor) {
        const color = cellColor(rowIndex, colIndex)
        if (color) {
          styled = chalk[color as keyof typeof chalk](styled) || styled
        }
      }
      return styled
    })
    data.push(styledRow)
  })

  // Table configuration
  const config = {
    border: border ? {
      topBody: '─',
      topJoin: '┬',
      topLeft: '┌',
      topRight: '┐',
      bottomBody: '─',
      bottomJoin: '┴',
      bottomLeft: '└',
      bottomRight: '┘',
      bodyLeft: '│',
      bodyRight: '│',
      bodyJoin: '│',
      joinBody: '─',
      joinLeft: '├',
      joinRight: '┤',
      joinJoin: '┼',
    } : undefined,
    columnDefault: {
      paddingLeft: padding,
      paddingRight: padding,
      width: compact ? undefined : 20,
    },
    columns: headers.map(() => ({
      alignment: align,
    })),
  }

  // Try to use table library if available
  try {
    const tableLib = await import('table')
    return tableLib.table(data, config)
  } catch {
    // Fallback simple table
  }
  
  // Fallback simple table
  const colWidths = headers.map((_, colIndex) => {
    const maxWidth = Math.max(
      headers[colIndex].length,
      ...rows.map(row => String(row[colIndex] || '').length)
    )
    return Math.min(maxWidth + padding * 2, 30)
  })
  
  let result = ''
  
  // Header
  if (border) {
    result += '┌' + colWidths.map(w => '─'.repeat(w)).join('┬') + '┐\n'
  }
  result += '│' + headers.map((h, i) => {
    const paddingStr = ' '.repeat(padding)
    return paddingStr + h.padEnd(colWidths[i] - padding * 2) + paddingStr
  }).join('│') + '│\n'
  
  if (border) {
    result += '├' + colWidths.map(w => '─'.repeat(w)).join('┼') + '┤\n'
  }
  
  // Rows
  rows.forEach(row => {
    result += '│' + row.map((cell, i) => {
      const paddingStr = ' '.repeat(padding)
      return paddingStr + String(cell || '').padEnd(colWidths[i] - padding * 2) + paddingStr
    }).join('│') + '│\n'
  })
  
  if (border) {
    result += '└' + colWidths.map(w => '─'.repeat(w)).join('┴') + '┘'
  }
  
  return result
}

/**
 * Create a simple list table (key-value pairs)
 */
export function createListTable(items: Array<{ key: string; value: string; color?: string }>): string {
  const maxKeyLength = Math.max(...items.map(item => item.key.length))
  
  return items.map(item => {
    const key = item.key.padEnd(maxKeyLength)
    const color = item.color || 'gray'
    return `  ${chalk.bold(key)}  ${chalk[color as keyof typeof chalk](item.value)}`
  }).join('\n')
}

/**
 * Create a status table
 */
export async function createStatusTable(
  items: Array<{ name: string; status: 'success' | 'warning' | 'error' | 'info'; message: string }>
): Promise<string> {
  const statusIcons = {
    success: chalk.green('✅'),
    warning: chalk.yellow('⚠️'),
    error: chalk.red('❌'),
    info: chalk.blue('ℹ️'),
  }

  const statusColors = {
    success: 'green',
    warning: 'yellow',
    error: 'red',
    info: 'blue',
  }

  const rows = items.map(item => [
    `${statusIcons[item.status]} ${item.name}`,
    chalk[statusColors[item.status] as keyof typeof chalk](item.message),
  ])

  return createTable(['Item', 'Status'], rows, {
    headerColor: 'cyan',
    align: 'left',
  })
}
