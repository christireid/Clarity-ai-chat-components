/**
 * Beautiful prompts using @clack/prompts
 * Provides graceful cancellation, cleanup handling, and consistent UX
 */

import * as p from '@clack/prompts'
import pc from 'picocolors'
import gradient from 'gradient-string'

// Brand gradient for Clarity Chat
const clarityGradient = gradient(['#6366f1', '#8b5cf6', '#a855f7'])

// Store cleanup functions for graceful CTRL+C handling
const cleanupFunctions: Array<() => Promise<void> | void> = []

/**
 * Register a cleanup function to be called on cancellation
 */
export function onCleanup(fn: () => Promise<void> | void): void {
  cleanupFunctions.push(fn)
}

/**
 * Clear all registered cleanup functions
 */
export function clearCleanup(): void {
  cleanupFunctions.length = 0
}

/**
 * Execute all cleanup functions
 */
async function runCleanup(): Promise<void> {
  for (const fn of cleanupFunctions) {
    try {
      await fn()
    } catch {
      // Ignore cleanup errors
    }
  }
  cleanupFunctions.length = 0
}

/**
 * Handle user cancellation gracefully
 */
export function handleCancel(message?: string): never {
  runCleanup()
  p.cancel(message || 'Operation cancelled.')
  process.exit(0)
}

/**
 * Check if a value is a cancellation symbol
 * If cancelled, exits gracefully
 */
export function checkCancel<T>(value: T | symbol, message?: string): T {
  if (p.isCancel(value)) {
    handleCancel(message)
  }
  return value as T
}

/**
 * Setup CTRL+C handler for graceful cancellation
 */
export function setupCancelHandler(): void {
  const handler = async () => {
    await runCleanup()
    console.log('\n')
    p.cancel('Operation cancelled.')
    process.exit(0)
  }

  process.on('SIGINT', handler)
  process.on('SIGTERM', handler)
}

/**
 * Display branded intro banner
 */
export function showIntro(title: string, version?: string): void {
  console.log()
  const versionText = version ? pc.dim(` v${version}`) : ''
  p.intro(clarityGradient(` ${title} `) + versionText)
}

/**
 * Display branded outro with success message
 */
export function showOutro(message: string): void {
  p.outro(pc.green(`✓ ${message}`))
}

/**
 * Display next steps after command completion
 */
export function showNextSteps(steps: string[], title?: string): void {
  const content = steps
    .map((step, i) => `${pc.cyan(`${i + 1}.`)} ${step}`)
    .join('\n')
  p.note(content, title || 'Next steps')
}

/**
 * Display files that were created
 */
export function showFilesCreated(files: string[], baseDir?: string): void {
  const relativePaths = baseDir
    ? files.map((f) => f.replace(baseDir, '.'))
    : files
  const content = relativePaths.map((f) => `${pc.green('+')} ${f}`).join('\n')
  p.note(content, 'Files created')
}

/**
 * Display a warning note
 */
export function showWarning(message: string, title?: string): void {
  p.note(pc.yellow(message), title || pc.yellow('⚠ Warning'))
}

/**
 * Display an info note
 */
export function showInfo(message: string, title?: string): void {
  p.note(message, title || pc.blue('ℹ Info'))
}

/**
 * Log messages with icons
 */
export const log = {
  success: (message: string) => p.log.success(pc.green(message)),
  error: (message: string) => p.log.error(pc.red(message)),
  warning: (message: string) => p.log.warn(pc.yellow(message)),
  info: (message: string) => p.log.info(message),
  step: (message: string) => p.log.step(message),
  message: (message: string) => p.log.message(message),
}

/**
 * Prompt for text input with validation
 */
export async function promptText(options: {
  message: string
  placeholder?: string
  defaultValue?: string
  validate?: (value: string) => string | undefined
  initialValue?: string
}): Promise<string> {
  const result = await p.text({
    message: options.message,
    placeholder: options.placeholder,
    defaultValue: options.defaultValue,
    initialValue: options.initialValue,
    validate: options.validate,
  })

  return checkCancel(result)
}

/**
 * Prompt for confirmation
 */
export async function promptConfirm(options: {
  message: string
  initialValue?: boolean
}): Promise<boolean> {
  const result = await p.confirm({
    message: options.message,
    initialValue: options.initialValue ?? true,
  })

  return checkCancel(result)
}

/**
 * Prompt for single selection
 */
export async function promptSelect<T extends string>(options: {
  message: string
  options: Array<{ value: T; label: string; hint?: string }>
  initialValue?: T
}): Promise<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = await p.select({
    message: options.message,
    options: options.options as any,
    initialValue: options.initialValue,
  })

  return checkCancel(result) as T
}

/**
 * Prompt for multiple selection
 */
export async function promptMultiselect<T extends string>(options: {
  message: string
  options: Array<{ value: T; label: string; hint?: string }>
  required?: boolean
  initialValues?: T[]
}): Promise<T[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = await p.multiselect({
    message: options.message,
    options: options.options as any,
    required: options.required ?? false,
    initialValues: options.initialValues,
  })

  return checkCancel(result) as T[]
}

/**
 * Group multiple prompts together
 */
export async function promptGroup<T extends Record<string, unknown>>(
  prompts: Parameters<typeof p.group>[0],
  options?: { onCancel?: () => void }
): Promise<T> {
  const result = await p.group(prompts, {
    onCancel: () => {
      options?.onCancel?.()
      handleCancel()
    },
  })

  return result as T
}

/**
 * Create a spinner for async operations
 */
export function createSpinner(): ReturnType<typeof p.spinner> {
  return p.spinner()
}

/**
 * Run tasks with progress indication
 */
export async function runTasks<T>(
  tasks: Array<{
    title: string
    task: () => Promise<T>
    enabled?: boolean
  }>
): Promise<T[]> {
  const results: T[] = []
  const enabledTasks = tasks.filter((t) => t.enabled !== false)

  for (const [index, { title, task }] of enabledTasks.entries()) {
    const s = p.spinner()
    s.start(`[${index + 1}/${enabledTasks.length}] ${title}`)

    try {
      const result = await task()
      results.push(result)
      s.stop(pc.green(`✓ ${title}`))
    } catch (error) {
      s.stop(pc.red(`✗ ${title}`))
      throw error
    }
  }

  return results
}

/**
 * Display a task list summary
 */
export function showTaskSummary(
  tasks: Array<{ title: string; status: 'success' | 'error' | 'skipped' }>
): void {
  const content = tasks
    .map(({ title, status }) => {
      const icon =
        status === 'success'
          ? pc.green('✓')
          : status === 'error'
            ? pc.red('✗')
            : pc.dim('○')
      return `${icon} ${title}`
    })
    .join('\n')

  p.note(content, 'Summary')
}

// Re-export @clack/prompts for advanced usage
export { p as clack }
