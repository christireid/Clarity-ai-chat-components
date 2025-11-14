/**
 * Beautiful box formatting utilities for dev-tools
 * Using chalk-only implementation (boxen available but optional)
 */

import chalk from 'chalk'

export interface BoxOptions {
  title?: string
  padding?: number
  margin?: number
  borderStyle?: 'single' | 'double' | 'round' | 'bold' | 'singleDouble' | 'doubleSingle' | 'classic'
  borderColor?: (text: string) => string | string
  titleColor?: (text: string) => string
  backgroundColor?: string
  align?: 'left' | 'center' | 'right'
}

/**
 * Create a beautiful box using Unicode characters
 */
export function box(content: string, options: BoxOptions = {}): string {
  const {
    title,
    padding = 1,
    margin = 0,
    borderStyle = 'round',
    borderColor = 'cyan',
    titleColor = chalk.bold.cyan,
    align = 'left',
  } = options

  const borderColorFn = typeof borderColor === 'function' 
    ? borderColor 
    : (text: string) => {
        const colors: Record<string, (text: string) => string> = {
          cyan: chalk.cyan,
          green: chalk.green,
          red: chalk.red,
          yellow: chalk.yellow,
          blue: chalk.blue,
          magenta: chalk.magenta,
          white: chalk.white,
          gray: chalk.gray,
        }
        return colors[borderColor]?.(text) || text
      }

  // Choose border characters based on style
  const borders: Record<string, { tl: string; tr: string; bl: string; br: string; h: string; v: string }> = {
    round: { tl: '╭', tr: '╮', bl: '╰', br: '╯', h: '─', v: '│' },
    single: { tl: '┌', tr: '┐', bl: '└', br: '┘', h: '─', v: '│' },
    double: { tl: '╔', tr: '╗', bl: '╚', br: '╝', h: '═', v: '║' },
    bold: { tl: '┏', tr: '┓', bl: '┗', br: '┛', h: '━', v: '┃' },
  }

  const chars = borders[borderStyle] || borders.round

  // Split content into lines
  const lines = content.split('\n')
  const maxWidth = Math.max(...lines.map(l => l.length), title ? title.length + 4 : 0)
  const width = maxWidth + (padding * 2)

  const output: string[] = []

  // Top margin
  for (let i = 0; i < margin; i++) {
    output.push('')
  }

  // Top border
  const topBorder = chars.tl + chars.h.repeat(width) + chars.tr
  output.push(borderColorFn(topBorder))

  // Title line (if provided)
  if (title) {
    const titleText = titleColor(title)
    const titleLine = chars.v + ' '.repeat(padding) + titleText + ' '.repeat(width - title.length - padding) + chars.v
    output.push(borderColorFn(titleLine))
    const separator = chars.v + chars.h.repeat(width) + chars.v
    output.push(borderColorFn(separator))
  }

  // Content lines
  for (const line of lines) {
    const paddedLine = ' '.repeat(padding) + line + ' '.repeat(width - line.length - padding)
    output.push(borderColorFn(chars.v + paddedLine + chars.v))
  }

  // Bottom border
  const bottomBorder = chars.bl + chars.h.repeat(width) + chars.br
  output.push(borderColorFn(bottomBorder))

  // Bottom margin
  for (let i = 0; i < margin; i++) {
    output.push('')
  }

  return output.join('\n')
}

/**
 * Create a success box
 */
export function successBox(content: string, title?: string): string {
  return box(content, {
    title: title || '✓ Success',
    padding: 1,
    borderStyle: 'round',
    borderColor: chalk.green,
    titleColor: chalk.bold.green,
  })
}

/**
 * Create an error box
 */
export function errorBox(content: string, title?: string): string {
  return box(content, {
    title: title || '✗ Error',
    padding: 1,
    borderStyle: 'round',
    borderColor: chalk.red,
    titleColor: chalk.bold.red,
  })
}

/**
 * Create a warning box
 */
export function warningBox(content: string, title?: string): string {
  return box(content, {
    title: title || '⚠ Warning',
    padding: 1,
    borderStyle: 'round',
    borderColor: chalk.yellow,
    titleColor: chalk.bold.yellow,
  })
}

/**
 * Create an info box
 */
export function infoBox(content: string, title?: string): string {
  return box(content, {
    title: title || 'ℹ Info',
    padding: 1,
    borderStyle: 'round',
    borderColor: chalk.cyan,
    titleColor: chalk.bold.cyan,
  })
}
