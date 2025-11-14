/**
 * Beautiful table formatting utilities
 * Enhanced with colors, alignment, and styling
 */

import chalk from 'chalk'

export interface TableColumn {
  header: string
  key?: string
  width?: number
  align?: 'left' | 'center' | 'right'
  color?: (text: string) => string
}

export interface TableOptions {
  border?: boolean
  padding?: number
  headerColor?: (text: string) => string | string
  compact?: boolean
  align?: 'left' | 'center' | 'right'
}

const BORDER_CHARS = {
  topLeft: '┌',
  topRight: '┐',
  bottomLeft: '└',
  bottomRight: '┘',
  topMiddle: '┬',
  bottomMiddle: '┴',
  leftMiddle: '├',
  rightMiddle: '┤',
  middle: '┼',
  horizontal: '─',
  vertical: '│',
}

/**
 * Create a beautiful table
 */
export function table(
  data: Record<string, any>[] | string[][],
  columns: TableColumn[],
  options: TableOptions = {}
): string {
  const {
    border = true,
    padding = 1,
    headerColor = chalk.bold.cyan,
    compact = false,
  } = options

  // Normalize data to array of arrays
  const rows: string[][] = Array.isArray(data[0]) && typeof data[0][0] === 'string'
    ? data as string[][]
    : (data as Record<string, any>[]).map(row =>
        columns.map(col => {
          const value = col.key ? row[col.key] : row[col.header]
          return value != null ? String(value) : ''
        })
      )

  // Calculate column widths
  const widths = columns.map((col, i) => {
    const headerWidth = col.header.length
    const dataWidth = Math.max(...rows.map(row => (row[i] || '').length))
    return col.width || Math.max(headerWidth, dataWidth) + (padding * 2)
  })

  const output: string[] = []

  // Top border
  if (border) {
    const topBorder =
      BORDER_CHARS.topLeft +
      widths.map(w => BORDER_CHARS.horizontal.repeat(w)).join(BORDER_CHARS.topMiddle) +
      BORDER_CHARS.topRight
    output.push(chalk.dim(topBorder))
  }

  // Header
  const headerCells = columns.map((col, i) => {
    const text = col.header
    const width = widths[i]
    const pad = ' '.repeat(padding)
    
    let aligned: string
    if (col.align === 'center') {
      const totalPad = width - text.length - (padding * 2)
      const leftPad = Math.floor(totalPad / 2)
      const rightPad = totalPad - leftPad
      aligned = ' '.repeat(leftPad) + text + ' '.repeat(rightPad)
    } else if (col.align === 'right') {
      const totalPad = width - text.length - (padding * 2)
      aligned = ' '.repeat(totalPad) + text
    } else {
      aligned = text.padEnd(width - (padding * 2))
    }
    
    return pad + headerColor(aligned) + pad
  })

  output.push(
    border
      ? chalk.dim(BORDER_CHARS.vertical) + headerCells.join(chalk.dim(BORDER_CHARS.vertical)) + chalk.dim(BORDER_CHARS.vertical)
      : headerCells.join('  ')
  )

  // Header separator
  if (border) {
    const separator =
      BORDER_CHARS.leftMiddle +
      widths.map(w => BORDER_CHARS.horizontal.repeat(w)).join(BORDER_CHARS.middle) +
      BORDER_CHARS.rightMiddle
    output.push(chalk.dim(separator))
  } else if (!compact) {
    output.push('')
  }

  // Data rows
  rows.forEach((row, rowIndex) => {
    const cells = columns.map((col, i) => {
      const text = row[i] || ''
      const width = widths[i]
      const pad = ' '.repeat(padding)
      const colorFn = col.color || ((t: string) => t)
      
      let aligned: string
      if (col.align === 'center') {
        const totalPad = width - text.length - (padding * 2)
        const leftPad = Math.floor(totalPad / 2)
        const rightPad = totalPad - leftPad
        aligned = ' '.repeat(leftPad) + text + ' '.repeat(rightPad)
      } else if (col.align === 'right') {
        const totalPad = width - text.length - (padding * 2)
        aligned = ' '.repeat(totalPad) + text
      } else {
        aligned = text.padEnd(width - (padding * 2))
      }
      
      return pad + colorFn(aligned) + pad
    })

    output.push(
      border
        ? chalk.dim(BORDER_CHARS.vertical) + cells.join(chalk.dim(BORDER_CHARS.vertical)) + chalk.dim(BORDER_CHARS.vertical)
        : cells.join('  ')
    )

    // Row separator (except for last row)
    if (border && rowIndex < rows.length - 1 && !compact) {
      const separator =
        BORDER_CHARS.leftMiddle +
        widths.map(w => BORDER_CHARS.horizontal.repeat(w)).join(BORDER_CHARS.middle) +
        BORDER_CHARS.rightMiddle
      output.push(chalk.dim(separator))
    }
  })

  // Bottom border
  if (border) {
    const bottomBorder =
      BORDER_CHARS.bottomLeft +
      widths.map(w => BORDER_CHARS.horizontal.repeat(w)).join(BORDER_CHARS.bottomMiddle) +
      BORDER_CHARS.bottomRight
    output.push(chalk.dim(bottomBorder))
  }

  return output.join('\n')
}

/**
 * Create a table (wrapper for table function)
 */
export function createTable(
  data: Record<string, any>[] | string[][],
  columns: TableColumn[],
  options: TableOptions = {}
): string {
  return table(data, columns, options)
}

/**
 * Create a list table (wrapper for listTable function)
 */
export function createListTable(
  items: Array<{ label: string; value: string; color?: (text: string) => string }>
): string {
  return listTable(items)
}

/**
 * Create a status table for doctor command
 */
export interface StatusTableRow {
  check: string
  status: 'pass' | 'warn' | 'fail'
  message: string
  category?: string
  severity?: 'info' | 'warning' | 'error'
}

export function createStatusTable(rows: StatusTableRow[]): string {
  const columns: TableColumn[] = [
    { header: 'Check', key: 'check', width: 30 },
    { header: 'Status', key: 'status', width: 10, align: 'center' },
    { header: 'Message', key: 'message' },
  ]

  const data = rows.map(row => ({
    check: row.check,
    status: row.status === 'pass' ? '✓' : row.status === 'warn' ? '⚠' : '✗',
    message: row.message,
  }))

  return table(data, columns, {
    border: true,
    headerColor: chalk.bold.cyan,
  })
}

/**
 * Create a simple list table (no borders)
 */
export function listTable(
  items: Array<{ label: string; value: string; color?: (text: string) => string }>
): string {
  const maxLabelWidth = Math.max(...items.map(item => item.label.length))
  
  return items
    .map(item => {
      const label = item.label.padEnd(maxLabelWidth)
      const colorFn = item.color || ((t: string) => t)
      return `${chalk.dim(label)}  ${colorFn(item.value)}`
    })
    .join('\n')
}

/**
 * Create a key-value table
 */
export function keyValueTable(
  data: Record<string, string | number | boolean>,
  options: { labelColor?: (text: string) => string; valueColor?: (text: string) => string } = {}
): string {
  const { labelColor = chalk.dim, valueColor = (t: string) => t } = options
  const maxKeyWidth = Math.max(...Object.keys(data).map(key => key.length))
  
  return Object.entries(data)
    .map(([key, value]) => {
      const label = labelColor(key.padEnd(maxKeyWidth))
      const val = valueColor(String(value))
      return `${label}  ${val}`
    })
    .join('\n')
}

/**
 * Create a table (alias for table function)
 */
export async function createTable(
  columns: string[] | TableColumn[],
  data: Record<string, any>[] | string[][],
  options?: TableOptions & { headerColor?: string | ((text: string) => string) }
): Promise<string> {
  const normalizedColumns: TableColumn[] = Array.isArray(columns) && typeof columns[0] === 'string'
    ? (columns as string[]).map(col => ({ 
        header: col,
        align: options?.align || 'left'
      }))
    : columns.map(col => ({
        ...col,
        align: col.align || options?.align || 'left'
      }))
  
  const tableOptions: TableOptions = {
    ...options,
    headerColor: typeof options?.headerColor === 'string' 
      ? (text: string) => chalk[options.headerColor as keyof typeof chalk](text) || text
      : options?.headerColor
  }
  
  return table(data, normalizedColumns, tableOptions)
}

/**
 * Create a list table (alias for listTable)
 */
export function createListTable(
  items: Array<{ label: string; value: string; color?: (text: string) => string }>
): string {
  return listTable(items)
}

/**
 * Create a status table
 */
export async function createStatusTable(
  items: Array<{ status: string; message: string; category?: string; severity?: string }>
): Promise<string> {
  const columns: TableColumn[] = [
    { header: 'Status', key: 'status', width: 12 },
    { header: 'Message', key: 'message' },
  ]
  
  const data = items.map(item => ({
    status: item.status,
    message: item.message,
  }))
  
  return table(data, columns, { border: true })
}
