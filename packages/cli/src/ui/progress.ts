/**
 * Beautiful progress indicators
 * Creates eye-catching progress bars and spinners
 */

import ora, { Ora } from 'ora'
import chalk from 'chalk'

// Optional cli-progress - gracefully handle if not available
// Will use fallback implementation

export interface ProgressOptions {
  text?: string
  color?: 'cyan' | 'green' | 'blue' | 'yellow' | 'magenta'
  spinner?: 'dots' | 'dots2' | 'dots3' | 'dots4' | 'dots5' | 'dots6' | 'dots7' | 'dots8' | 'dots9' | 'dots10' | 'dots11' | 'dots12' | 'line' | 'line2' | 'pipe' | 'simpleDots' | 'simpleDotsScrolling' | 'star' | 'star2' | 'flip' | 'hamburger' | 'growVertical' | 'growHorizontal' | 'balloon' | 'balloon2' | 'noise' | 'bounce' | 'boxBounce' | 'boxBounce2' | 'triangle' | 'arc' | 'circle' | 'squareCorners' | 'circleQuarters' | 'circleHalves' | 'squish' | 'toggle' | 'toggle2' | 'toggle3' | 'toggle4' | 'toggle5' | 'toggle6' | 'toggle7' | 'toggle8' | 'toggle9' | 'toggle10' | 'toggle11' | 'toggle12' | 'toggle13' | 'arrow' | 'arrow2' | 'arrow3' | 'bouncingBar' | 'bouncingBall' | 'smiley' | 'monkey' | 'hearts' | 'clock' | 'earth' | 'moon' | 'runner' | 'pong' | 'shark' | 'dqpb' | 'weather' | 'christmas' | 'grenade' | 'point' | 'layer' | 'betaWave' | 'fingerDance' | 'fistBump' | 'soccerHeader' | 'mindblown' | 'speaker' | 'orangePulse' | 'bluePulse' | 'orangeBluePulse' | 'timeTravel' | 'aesthetic'
}

/**
 * Create a beautiful spinner
 */
export function createSpinner(text: string, options: ProgressOptions = {}): Ora {
  const {
    color = 'cyan',
    spinner = 'dots',
  } = options

  const spinnerInstance = ora({
    text: chalk[color as keyof typeof chalk](text) || text,
    spinner,
    color: color as any,
  })

  return spinnerInstance
}

/**
 * Create a progress bar
 */
export async function createProgressBar(total: number, options: { title?: string; format?: string } = {}) {
  const {
    title = 'Progress',
    format,
  } = options

  // Try to use cli-progress if available, otherwise use fallback
  try {
    const cliProgress = await import('cli-progress')
    const { SingleBar, Presets } = cliProgress
    const defaultFormat = `${title} |${chalk.cyan('{bar}')}| {percentage}% | {value}/{total} | ETA: {eta}s`
    const bar = new SingleBar({
      format: format || defaultFormat,
      barCompleteChar: '\u2588',
      barIncompleteChar: '\u2591',
      hideCursor: true,
      clearOnComplete: true,
      ...Presets.shades_classic,
    })
    return bar
  } catch {
    // Fallback simple progress
  }
  
  // Fallback simple progress
  return {
    start: (total: number, startValue: number, payload: any) => {},
    update: (value: number, payload?: any) => {
      const percent = Math.round((value / total) * 100)
      const filled = Math.round((value / total) * 20)
      const bar = '█'.repeat(filled) + '░'.repeat(20 - filled)
      process.stdout.write(`\r${title} |${chalk.cyan(bar)}| ${percent}%`)
    },
    stop: () => {
      process.stdout.write('\n')
    },
    setTotal: (total: number) => {},
  }
}

/**
 * Create a multi-step progress indicator
 */
export function createMultiStepProgress(steps: string[]) {
  const currentStep = { index: 0 }

  const update = (stepIndex: number, status: 'pending' | 'active' | 'complete' | 'error') => {
    const icons = {
      pending: chalk.gray('○'),
      active: chalk.cyan('◐'),
      complete: chalk.green('●'),
      error: chalk.red('✖'),
    }

    const colors = {
      pending: chalk.gray,
      active: chalk.cyan.bold,
      complete: chalk.green,
      error: chalk.red,
    }

    return steps.map((step, index) => {
      if (index < stepIndex) {
        return `${icons.complete} ${colors.complete(step)}`
      } else if (index === stepIndex) {
        return `${icons[status]} ${colors[status](step)}`
      } else {
        return `${icons.pending} ${colors.pending(step)}`
      }
    }).join('\n')
  }

  return {
    update,
    next: () => {
      currentStep.index++
      return currentStep.index
    },
    getCurrent: () => currentStep.index,
  }
}

/**
 * Create a beautiful loading message with animation
 */
export function createLoadingMessage(messages: string[], interval: number = 2000): () => void {
  let currentIndex = 0
  const spinner = createSpinner(messages[0])

  spinner.start()

  const intervalId = setInterval(() => {
    currentIndex = (currentIndex + 1) % messages.length
    spinner.text = messages[currentIndex]
  }, interval)

  return () => {
    clearInterval(intervalId)
    spinner.stop()
  }
}
