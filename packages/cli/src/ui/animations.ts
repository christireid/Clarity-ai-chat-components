/**
 * Beautiful animation utilities
 * Creates smooth, eye-catching animations
 */

import chalk from 'chalk'
import { createSpinner } from './progress.js'

/**
 * Animate text typing effect
 */
export async function typeText(text: string, delay: number = 50): Promise<void> {
  for (const char of text) {
    process.stdout.write(char)
    await new Promise(resolve => setTimeout(resolve, delay))
  }
  process.stdout.write('\n')
}

/**
 * Create a pulsing effect
 */
export function createPulse(text: string, color: string = 'cyan'): string {
  // Simple pulsing effect using bold
  const colorFn = chalk[color as keyof typeof chalk] as typeof chalk.cyan
  return typeof colorFn === 'function' ? colorFn(text) : chalk.bold(text)
}

/**
 * Create a rainbow text effect
 */
export function createRainbowText(text: string): string {
  const colors = ['red', 'yellow', 'green', 'cyan', 'blue', 'magenta'] as const
  return text.split('').map((char, index) => {
    const colorName = colors[index % colors.length]
    const colorFn = chalk[colorName] as typeof chalk.cyan
    return typeof colorFn === 'function' ? colorFn(char) : char
  }).join('')
}

/**
 * Create a shimmer effect
 */
export function createShimmer(text: string): string {
  // Alternating bold for shimmer effect
  return text.split('').map((char, index) => {
    return index % 2 === 0 ? chalk.bold(char) : char
  }).join('')
}

/**
 * Animate a loading sequence
 */
export async function animateLoading(
  messages: string[],
  duration: number = 2000
): Promise<void> {
  const spinner = createSpinner(messages[0])
  spinner.start()

  let currentIndex = 0
  const interval = setInterval(() => {
    currentIndex = (currentIndex + 1) % messages.length
    spinner.text = messages[currentIndex]
  }, duration / messages.length)

  return new Promise(resolve => {
    setTimeout(() => {
      clearInterval(interval)
      spinner.stop()
      resolve()
    }, duration)
  })
}

/**
 * Create a countdown animation
 */
export async function countdown(seconds: number, message: string = 'Starting'): Promise<void> {
  for (let i = seconds; i > 0; i--) {
    process.stdout.write(`\r${chalk.bold.cyan(message)} in ${chalk.bold.yellow(i.toString())}...`)
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  process.stdout.write(`\r${chalk.bold.green(message)} now!                    \n`)
}

/**
 * Create a progress animation
 */
export async function animateProgress(
  total: number,
  callback: (current: number) => Promise<void>
): Promise<void> {
  for (let i = 0; i <= total; i++) {
    const percent = Math.round((i / total) * 100)
    const filled = Math.round((i / total) * 20)
    const bar = '█'.repeat(filled) + '░'.repeat(20 - filled)
    process.stdout.write(`\r${chalk.cyan(`Progress: [${bar}] ${percent}%`)}`)
    await callback(i)
    await new Promise(resolve => setTimeout(resolve, 50))
  }
  process.stdout.write('\n')
}
