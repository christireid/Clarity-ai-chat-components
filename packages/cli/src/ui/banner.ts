/**
 * Beautiful banner utilities
 * Creates eye-catching headers and banners
 */

import gradient from 'gradient-string'
import chalk from 'chalk'
import boxen from 'boxen'

// Optional figlet - gracefully handle if not available
// Will be loaded dynamically if needed

export interface BannerOptions {
  text?: string
  gradient?: 'pastel' | 'rainbow' | 'cristal' | 'atlas' | 'retro' | 'summer' | 'teen'
  style?: 'default' | '3d' | 'banner' | 'block'
  padding?: number
  margin?: number
  border?: boolean
  borderColor?: 'cyan' | 'green' | 'blue' | 'magenta' | 'yellow'
}

/**
 * Create a beautiful gradient banner
 */
export function createBanner(text: string, options: BannerOptions = {}): string {
  const {
    gradient: gradientType = 'pastel',
    style = 'default',
    padding = 1,
    margin = 1,
    border = true,
    borderColor = 'cyan',
  } = options

  // Create ASCII art if style is specified
  let bannerText = text
  if (style !== 'default') {
    // Try to use figlet if available (async loading would require function to be async)
    // For now, use gradient text without ASCII art
    // ASCII art can be added later if figlet is properly installed
  }

  // Apply gradient
  const gradients: Record<string, (text: string) => string> = {
    pastel: gradient.pastel,
    rainbow: gradient.rainbow,
    cristal: gradient.cristal,
    atlas: gradient.atlas,
    retro: gradient.retro,
    summer: gradient.summer,
    teen: gradient.teen,
  }

  const gradientFn = gradients[gradientType] || gradients.pastel
  const gradientText = gradientFn(bannerText)

  // Wrap in box if requested
  if (border) {
    return boxen(gradientText, {
      padding,
      margin,
      borderStyle: 'round',
      borderColor,
      title: 'Clarity Chat',
      titleAlignment: 'center',
    })
  }

  return gradientText
}

/**
 * Create a simple gradient header
 */
export function createHeader(text: string, gradientType: BannerOptions['gradient'] = 'pastel'): string {
  const gradients: Record<string, (text: string) => string> = {
    pastel: gradient.pastel,
    rainbow: gradient.rainbow,
    cristal: gradient.cristal,
    atlas: gradient.atlas,
    retro: gradient.retro,
    summer: gradient.summer,
    teen: gradient.teen,
  }

  const gradientFn = gradients[gradientType] || gradients.pastel
  return gradientFn(text)
}

/**
 * Create a section divider
 */
export function createDivider(length: number = 60, char: string = '─', color: string = 'gray'): string {
  const divider = char.repeat(length)
  return chalk[color as keyof typeof chalk](divider) || divider
}

/**
 * Create a title with underline
 */
export function createTitle(text: string, color: string = 'cyan'): string {
  const underline = '─'.repeat(text.length + 2)
  return `${chalk[color as keyof typeof chalk].bold(text)}\n${chalk[color as keyof typeof chalk](underline)}`
}
