/**
 * Beautiful spinner using Charm-style animations
 * Inspired by https://github.com/charmbracelet/bubbletea
 */

import chalk from 'chalk'

const SPINNER_FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
const DOTS_FRAMES = ['⣾', '⣽', '⣻', '⢿', '⡿', '⣟', '⣯', '⣷']
const ARROW_FRAMES = ['←', '↖', '↑', '↗', '→', '↘', '↓', '↙']
const PULSE_FRAMES = ['●', '◐', '○', '◑']

export class Spinner {
  private frames: string[]
  private frameIndex: number = 0
  private interval: NodeJS.Timeout | null = null
  private text: string = ''
  private color: (text: string) => string = chalk.cyan

  constructor(type: 'dots' | 'arrow' | 'pulse' | 'default' = 'default') {
    switch (type) {
      case 'dots':
        this.frames = DOTS_FRAMES
        break
      case 'arrow':
        this.frames = ARROW_FRAMES
        break
      case 'pulse':
        this.frames = PULSE_FRAMES
        break
      default:
        this.frames = SPINNER_FRAMES
    }
  }

  start(text: string = '') {
    this.text = text
    this.frameIndex = 0
    
    // Hide cursor
    process.stdout.write('\x1B[?25l')
    
    this.interval = setInterval(() => {
      this.render()
      this.frameIndex = (this.frameIndex + 1) % this.frames.length
    }, 80)
  }

  update(text: string) {
    this.text = text
  }

  succeed(text?: string) {
    this.stop()
    const message = text || this.text
    console.log(chalk.green('✓') + ' ' + message)
  }

  fail(text?: string) {
    this.stop()
    const message = text || this.text
    console.log(chalk.red('✗') + ' ' + message)
  }

  warn(text?: string) {
    this.stop()
    const message = text || this.text
    console.log(chalk.yellow('⚠') + ' ' + message)
  }

  info(text?: string) {
    this.stop()
    const message = text || this.text
    console.log(chalk.blue('ℹ') + ' ' + message)
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = null
    }
    
    // Clear line and show cursor
    process.stdout.write('\r\x1B[K')
    process.stdout.write('\x1B[?25h')
  }

  private render() {
    const frame = this.color(this.frames[this.frameIndex])
    process.stdout.write(`\r${frame} ${this.text}`)
  }
}

/**
 * Multi-spinner for parallel operations
 */
export class MultiSpinner {
  private spinners: Map<string, { text: string; status: 'pending' | 'success' | 'error' }> = new Map()
  private interval: NodeJS.Timeout | null = null
  private frameIndex: number = 0

  add(id: string, text: string) {
    this.spinners.set(id, { text, status: 'pending' })
    if (!this.interval) {
      this.start()
    }
  }

  update(id: string, text: string) {
    const spinner = this.spinners.get(id)
    if (spinner) {
      spinner.text = text
    }
  }

  succeed(id: string, text?: string) {
    const spinner = this.spinners.get(id)
    if (spinner) {
      spinner.status = 'success'
      if (text) spinner.text = text
    }
    this.checkComplete()
  }

  fail(id: string, text?: string) {
    const spinner = this.spinners.get(id)
    if (spinner) {
      spinner.status = 'error'
      if (text) spinner.text = text
    }
    this.checkComplete()
  }

  private start() {
    process.stdout.write('\x1B[?25l') // Hide cursor
    
    this.interval = setInterval(() => {
      this.render()
      this.frameIndex = (this.frameIndex + 1) % SPINNER_FRAMES.length
    }, 80)
  }

  private render() {
    // Move cursor up to start of spinners
    if (this.spinners.size > 1) {
      process.stdout.write(`\x1B[${this.spinners.size}A`)
    }
    
    // Render each spinner
    this.spinners.forEach((spinner) => {
      process.stdout.write('\r\x1B[K') // Clear line
      
      if (spinner.status === 'pending') {
        const frame = chalk.cyan(SPINNER_FRAMES[this.frameIndex])
        process.stdout.write(`${frame} ${spinner.text}`)
      } else if (spinner.status === 'success') {
        process.stdout.write(chalk.green('✓') + ' ' + spinner.text)
      } else {
        process.stdout.write(chalk.red('✗') + ' ' + spinner.text)
      }
      
      process.stdout.write('\n')
    })
  }

  private checkComplete() {
    const allComplete = Array.from(this.spinners.values()).every(
      s => s.status !== 'pending'
    )
    
    if (allComplete && this.interval) {
      clearInterval(this.interval)
      this.interval = null
      process.stdout.write('\x1B[?25h') // Show cursor
    }
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = null
    }
    process.stdout.write('\x1B[?25h') // Show cursor
  }
}

/**
 * Progress bar with Charm-style visualization
 */
export class ProgressBar {
  private total: number
  private current: number = 0
  private text: string = ''
  private width: number = 40

  constructor(total: number, text: string = '') {
    this.total = total
    this.text = text
  }

  update(current: number, text?: string) {
    this.current = current
    if (text) this.text = text
    this.render()
  }

  increment(text?: string) {
    this.current++
    if (text) this.text = text
    this.render()
  }

  complete(text?: string) {
    this.current = this.total
    if (text) this.text = text
    this.render()
    console.log() // New line after completion
  }

  private render() {
    const percent = Math.min(100, Math.floor((this.current / this.total) * 100))
    const filled = Math.floor((this.width * this.current) / this.total)
    const empty = this.width - filled

    const bar =
      chalk.cyan('█').repeat(filled) +
      chalk.gray('░').repeat(empty)

    const percentage = chalk.bold(`${percent}%`)
    const progress = chalk.gray(`[${this.current}/${this.total}]`)

    process.stdout.write(`\r${bar} ${percentage} ${progress} ${this.text}`)
  }
}

