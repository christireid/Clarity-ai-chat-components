/**
 * Beautiful banner utilities
 * Enhanced with gradients and ASCII art
 */

import pc from 'picocolors'
import gradient from 'gradient-string'


export interface BannerOptions {
  gradient?:
    | 'pastel'
    | 'rainbow'
    | 'cristal'
    | 'retro'
    | 'atlas'
    | 'summer'
    | 'morning'
  color?: 'cyan' | 'green' | 'blue' | 'magenta' | 'yellow'
  padding?: number
  margin?: number
  border?: boolean
  style?: 'bold'
}

const GRADIENTS = {
  pastel: gradient.pastel,
  rainbow: gradient.rainbow,
  cristal: gradient.cristal,
  retro: gradient.retro,
  atlas: gradient.atlas,
  summer: gradient.summer,
  morning: gradient.morning,
} as const

const COLORS = {
  cyan: pc.cyan,
  green: pc.green,
  blue: pc.blue,
  magenta: pc.magenta,
  yellow: pc.yellow,
} as const

/**
 * Create a beautiful banner with ASCII art
 */
export function createBanner(
  text: string | string[],
  options: BannerOptions = {}
): string {
  const {
    gradient: gradientType = 'pastel',
    color,
    padding = 1,
    margin = 1,
  } = options

  const lines = Array.isArray(text) ? text : [text]

  // Add padding
  const paddedLines = lines.map(
    (line) => ' '.repeat(padding) + line + ' '.repeat(padding)
  )

  // Add top margin
  const topMargin = '\n'.repeat(margin)

  // Add bottom margin
  const bottomMargin = '\n'.repeat(margin)

  // Apply gradient or color
  let formatted: string
  if (gradientType && GRADIENTS[gradientType]) {
    formatted = GRADIENTS[gradientType].multiline(paddedLines.join('\n'))
  } else if (color && COLORS[color]) {
    formatted = paddedLines.map((line) => COLORS[color](line)).join('\n')
  } else {
    formatted = paddedLines.join('\n')
  }

  return topMargin + formatted + bottomMargin
}

/**
 * Clarity Chat ASCII banner
 */
export const CLARITY_BANNER = [
  '  ____  _               _ _         ____  _           _   ',
  ' / ___|| | __ _ _ __(_) |_ _   _/ ___|| |__   __ _| |_ ',
  "| |    | |/ _` | '__| | __| | | | |    | '_ \\ / _` | __|",
  '| |___ | | (_| | |  | | |_| |_| | |___ | | | | (_| | |_ ',
  ' \\____|_|\\__,_|_|  |_|\\__|\\__, |\\____|_| |_|\\__,_|\\__|',
  '                           |___/                          ',
]

/**
 * Display Clarity Chat banner
 */
export function displayBanner(options: BannerOptions = {}): void {
  console.log(createBanner(CLARITY_BANNER, { gradient: 'pastel', ...options }))
}

/**
 * Create a section header
 */
export function sectionHeader(title: string, icon?: string): string {
  const iconText = icon ? `${icon} ` : ''
  return pc.bold(pc.cyan(`${iconText}${title}`))
}

/**
 * Create a subsection header
 */
export function subsectionHeader(title: string): string {
  return pc.bold(title)
}

/**
 * Create a divider line
 */
export function createDivider(text?: string, width: number = 60): string {
  if (text) {
    const padding = Math.max(0, Math.floor((width - text.length - 2) / 2))
    const line = '─'.repeat(padding)
    return pc.gray(`${line} ${text} ${line}`)
  }
  return pc.gray('─'.repeat(width))
}
