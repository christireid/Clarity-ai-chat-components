/**
 * Beautiful box drawing utilities
 * Inspired by https://github.com/charmbracelet/lipgloss
 */

import chalk from 'chalk'

export interface BoxOptions {
  title?: string
  titleAlign?: 'left' | 'center' | 'right'
  padding?: number
  margin?: number
  borderStyle?: 'single' | 'double' | 'rounded' | 'bold' | 'none'
  borderColor?: (text: string) => string
  width?: number
  height?: number
}

const BORDER_STYLES = {
  single: {
    topLeft: '┌',
    topRight: '┐',
    bottomLeft: '└',
    bottomRight: '┘',
    horizontal: '─',
    vertical: '│',
  },
  double: {
    topLeft: '╔',
    topRight: '╗',
    bottomLeft: '╚',
    bottomRight: '╝',
    horizontal: '═',
    vertical: '║',
  },
  rounded: {
    topLeft: '╭',
    topRight: '╮',
    bottomLeft: '╰',
    bottomRight: '╯',
    horizontal: '─',
    vertical: '│',
  },
  bold: {
    topLeft: '┏',
    topRight: '┓',
    bottomLeft: '┗',
    bottomRight: '┛',
    horizontal: '━',
    vertical: '┃',
  },
  none: {
    topLeft: '',
    topRight: '',
    bottomLeft: '',
    bottomRight: '',
    horizontal: '',
    vertical: '',
  },
}

/**
 * Create a beautiful box around text
 */
export function box(content: string, options: BoxOptions = {}): string {
  const {
    title = '',
    titleAlign = 'left',
    padding = 1,
    margin = 0,
    borderStyle = 'rounded',
    borderColor = chalk.cyan,
    width,
  } = options

  const style = BORDER_STYLES[borderStyle]
  const lines = content.split('\n')
  
  // Calculate content width
  const contentWidth = width || Math.max(...lines.map(line => line.length)) + padding * 2
  const innerWidth = contentWidth - padding * 2

  // Build the box
  const output: string[] = []

  // Add top margin
  for (let i = 0; i < margin; i++) {
    output.push('')
  }

  // Top border with title
  if (title) {
    const titleText = ` ${title} `
    const remainingWidth = contentWidth - titleText.length - 2
    
    let topBorder = ''
    if (titleAlign === 'left') {
      topBorder =
        style.topLeft +
        titleText +
        style.horizontal.repeat(remainingWidth) +
        style.topRight
    } else if (titleAlign === 'center') {
      const leftPad = Math.floor(remainingWidth / 2)
      const rightPad = remainingWidth - leftPad
      topBorder =
        style.topLeft +
        style.horizontal.repeat(leftPad) +
        titleText +
        style.horizontal.repeat(rightPad) +
        style.topRight
    } else {
      topBorder =
        style.topLeft +
        style.horizontal.repeat(remainingWidth) +
        titleText +
        style.topRight
    }
    
    output.push(' '.repeat(margin) + borderColor(topBorder))
  } else {
    output.push(
      ' '.repeat(margin) +
        borderColor(style.topLeft + style.horizontal.repeat(contentWidth) + style.topRight)
    )
  }

  // Add top padding
  for (let i = 0; i < padding; i++) {
    output.push(
      ' '.repeat(margin) +
        borderColor(style.vertical) +
        ' '.repeat(contentWidth) +
        borderColor(style.vertical)
    )
  }

  // Content lines
  lines.forEach(line => {
    const padded = line.padEnd(innerWidth)
    output.push(
      ' '.repeat(margin) +
        borderColor(style.vertical) +
        ' '.repeat(padding) +
        padded +
        ' '.repeat(padding) +
        borderColor(style.vertical)
    )
  })

  // Add bottom padding
  for (let i = 0; i < padding; i++) {
    output.push(
      ' '.repeat(margin) +
        borderColor(style.vertical) +
        ' '.repeat(contentWidth) +
        borderColor(style.vertical)
    )
  }

  // Bottom border
  output.push(
    ' '.repeat(margin) +
      borderColor(style.bottomLeft + style.horizontal.repeat(contentWidth) + style.bottomRight)
  )

  // Add bottom margin
  for (let i = 0; i < margin; i++) {
    output.push('')
  }

  return output.join('\n')
}

/**
 * Create a simple panel
 */
export function panel(content: string, title?: string): string {
  return box(content, {
    title,
    padding: 1,
    borderStyle: 'rounded',
    borderColor: chalk.cyan,
  })
}

/**
 * Create a success box
 */
export function successBox(content: string, title?: string): string {
  return box(content, {
    title: title || '✓ Success',
    padding: 1,
    borderStyle: 'rounded',
    borderColor: chalk.green,
  })
}

/**
 * Create an error box
 */
export function errorBox(content: string, title?: string): string {
  return box(content, {
    title: title || '✗ Error',
    padding: 1,
    borderStyle: 'rounded',
    borderColor: chalk.red,
  })
}

/**
 * Create a warning box
 */
export function warningBox(content: string, title?: string): string {
  return box(content, {
    title: title || '⚠ Warning',
    padding: 1,
    borderStyle: 'rounded',
    borderColor: chalk.yellow,
  })
}

/**
 * Create an info box
 */
export function infoBox(content: string, title?: string): string {
  return box(content, {
    title: title || 'ℹ Info',
    padding: 1,
    borderStyle: 'rounded',
    borderColor: chalk.blue,
  })
}

/**
 * Create a horizontal rule
 */
export function hr(width: number = 60, char: string = '─'): string {
  return chalk.gray(char.repeat(width))
}

/**
 * Create a table
 */
export interface TableColumn {
  header: string
  width?: number
  align?: 'left' | 'center' | 'right'
}

export function table(data: string[][], columns: TableColumn[]): string {
  const output: string[] = []
  
  // Calculate column widths
  const widths = columns.map((col, i) => {
    const headerWidth = col.header.length
    const dataWidth = Math.max(...data.map(row => (row[i] || '').length))
    return col.width || Math.max(headerWidth, dataWidth) + 2
  })

  // Top border
  output.push(
    chalk.gray('┌' + widths.map(w => '─'.repeat(w)).join('┬') + '┐')
  )

  // Header
  const headerRow = columns
    .map((col, i) => {
      const text = col.header
      const width = widths[i]
      const padded = text.padEnd(width - 2)
      return ` ${chalk.bold.cyan(padded)} `
    })
    .join(chalk.gray('│'))
  
  output.push(chalk.gray('│') + headerRow + chalk.gray('│'))

  // Header separator
  output.push(
    chalk.gray('├' + widths.map(w => '─'.repeat(w)).join('┼') + '┤')
  )

  // Data rows
  data.forEach((row, rowIndex) => {
    const cells = columns
      .map((col, i) => {
        const text = row[i] || ''
        const width = widths[i]
        const padded = text.padEnd(width - 2)
        return ` ${padded} `
      })
      .join(chalk.gray('│'))
    
    output.push(chalk.gray('│') + cells + chalk.gray('│'))
    
    // Row separator (except for last row)
    if (rowIndex < data.length - 1) {
      output.push(
        chalk.gray('├' + widths.map(w => '─'.repeat(w)).join('┼') + '┤')
      )
    }
  })

  // Bottom border
  output.push(
    chalk.gray('└' + widths.map(w => '─'.repeat(w)).join('┴') + '┘')
  )

  return output.join('\n')
}

/**
 * Create a tree view
 */
export interface TreeNode {
  label: string
  children?: TreeNode[]
  icon?: string
}

export function tree(nodes: TreeNode[], prefix: string = ''): string {
  const output: string[] = []
  
  nodes.forEach((node, index) => {
    const isLast = index === nodes.length - 1
    const connector = isLast ? '└─' : '├─'
    const icon = node.icon || '○'
    
    output.push(chalk.gray(prefix + connector) + ' ' + chalk.cyan(icon) + ' ' + chalk.white(node.label))
    
    if (node.children && node.children.length > 0) {
      const newPrefix = prefix + (isLast ? '  ' : '│ ')
      output.push(tree(node.children, newPrefix))
    }
  })
  
  return output.join('\n')
}

/**
 * Create a list with bullets
 */
export function list(items: string[], bullet: string = '•'): string {
  return items
    .map(item => chalk.cyan(bullet) + ' ' + chalk.white(item))
    .join('\n')
}

/**
 * Create a numbered list
 */
export function numberedList(items: string[]): string {
  return items
    .map((item, i) => chalk.cyan(`${i + 1}.`) + ' ' + chalk.white(item))
    .join('\n')
}

