/**
 * Beautiful table formatting utilities
 * Enhanced with colors, alignment, and styling
 */

import chalk from 'chalk'
import { dim, bold } from 'chalk'

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
  headerColor?: (text: string) => string
  compact?: boolean
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
    output.push(dim(topBorder))
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
      ? dim(BORDER_CHARS.vertical) + headerCells.join(dim(BORDER_CHARS.vertical)) + dim(BORDER_CHARS.vertical)
      : headerCells.join('  ')
  )

  // Header separator
  if (border) {
    const separator =
      BORDER_CHARS.leftMiddle +
      widths.map(w => BORDER_CHARS.horizontal.repeat(w)).join(BORDER_CHARS.middle) +
      BORDER_CHARS.rightMiddle
    output.push(dim(separator))
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
        ? dim(BORDER_CHARS.vertical) + cells.join(dim(BORDER_CHARS.vertical)) + dim(BORDER_CHARS.vertical)
        : cells.join('  ')
    )

    // Row separator (except for last row)
    if (border && rowIndex < rows.length - 1 && !compact) {
      const separator =
        BORDER_CHARS.leftMiddle +
        widths.map(w => BORDER_CHARS.horizontal.repeat(w)).join(BORDER_CHARS.middle) +
        BORDER_CHARS.rightMiddle
      output.push(dim(separator))
    }
  })

  // Bottom border
  if (border) {
    const bottomBorder =
      BORDER_CHARS.bottomLeft +
      widths.map(w => BORDER_CHARS.horizontal.repeat(w)).join(BORDER_CHARS.bottomMiddle) +
      BORDER_CHARS.bottomRight
    output.push(dim(bottomBorder))
  }

  return output.join('\n')
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
      return `${dim(label)}  ${colorFn(item.value)}`
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
  const { labelColor = dim, valueColor = (t: string) => t } = options
  const maxKeyWidth = Math.max(...Object.keys(data).map(key => key.length))
  
  return Object.entries(data)
    .map(([key, value]) => {
      const label = labelColor(key.padEnd(maxKeyWidth))
      const val = valueColor(String(value))
      return `${label}  ${val}`
    })
    .join('\n')
}
