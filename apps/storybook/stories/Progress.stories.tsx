import type { Meta, StoryObj } from '@storybook/react'
import { Progress } from '@clarity-chat/react'
import { useState, useEffect } from 'react'
import { expect, userEvent, within } from '@storybook/test'

/**
 * Progress Indicators
 *
 * **Visual feedback for:**
 * - Task completion
 * - File uploads
 * - Data processing
 * - Multi-step workflows
 * - Loading states
 *
 * **Key Features:**
 * - Smooth animations
 * - Customizable colors
 * - Multiple sizes
 * - Indeterminate state
 * - Label support
 *
 * **Design Philosophy:**
 * - Clear: Users always know progress status
 * - Smooth: Animated transitions feel natural
 * - Flexible: Works for many use cases
 * - Accessible: ARIA attributes for screen readers
 */
const meta = {
  title: 'Components/Progress',
  component: Progress,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Progress indicators that provide visual feedback for tasks, uploads, and loading states with smooth animations.',
      },
    },
    status: {
      type: 'stable',
    },
    badges: ['stable', 'tested', 'accessible'],
  },
  tags: ['autodocs', 'stable'],
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Current progress value (0-100)',
    },
    max: {
      control: 'number',
      description: 'Maximum value for progress',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof Progress>

export default meta
type Story = StoryObj<typeof meta>

// ============================================================================
// Basic Progress
// ============================================================================

export const Default: Story = {
  args: {
    value: 45,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test progress bar renders with correct role and value
    const progressBar = canvas.getByRole('progressbar')
    await expect(progressBar).toBeInTheDocument()
    await expect(progressBar).toHaveAttribute('aria-valuenow', '45')
    await expect(progressBar).toHaveAttribute('aria-valuemin', '0')
    await expect(progressBar).toHaveAttribute('aria-valuemax', '100')
  },
}

export const Empty: Story = {
  args: {
    value: 0,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test empty progress bar (0%)
    const progressBar = canvas.getByRole('progressbar')
    await expect(progressBar).toBeInTheDocument()
    await expect(progressBar).toHaveAttribute('aria-valuenow', '0')
  },
}

export const Half: Story = {
  args: {
    value: 50,
  },
}

export const AlmostComplete: Story = {
  args: {
    value: 95,
  },
}

export const Complete: Story = {
  args: {
    value: 100,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test complete progress bar (100%)
    const progressBar = canvas.getByRole('progressbar')
    await expect(progressBar).toBeInTheDocument()
    await expect(progressBar).toHaveAttribute('aria-valuenow', '100')
  },
}

// ============================================================================
// Sizes
// ============================================================================

export const Sizes: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-medium">Small</p>
        <Progress value={60} className="h-1" />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Default</p>
        <Progress value={60} className="h-2" />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Large</p>
        <Progress value={60} className="h-4" />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Extra Large</p>
        <Progress value={60} className="h-6" />
      </div>
    </div>
  ),
}

// ============================================================================
// Colors
// ============================================================================

export const ColorVariants: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-medium">Blue (Default)</p>
        <Progress value={75} />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Green (Success)</p>
        <Progress value={75} className="[&>div]:bg-green-500" />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Red (Error)</p>
        <Progress value={75} className="[&>div]:bg-red-500" />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Yellow (Warning)</p>
        <Progress value={75} className="[&>div]:bg-yellow-500" />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Purple (Custom)</p>
        <Progress value={75} className="[&>div]:bg-purple-500" />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Gradient</p>
        <Progress
          value={75}
          className="[&>div]:bg-gradient-to-r [&>div]:from-blue-500 [&>div]:to-purple-600"
        />
      </div>
    </div>
  ),
}

// ============================================================================
// Animated Progress
// ============================================================================

export const AnimatedProgress: Story = {
  render: () => {
    const [progress, setProgress] = useState(0)

    useEffect(() => {
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            return 0
          }
          return prev + 1
        })
      }, 50)

      return () => clearInterval(timer)
    }, [])

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Loading...</span>
          <span className="text-sm font-medium">{progress}%</span>
        </div>
        <Progress value={progress} />
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Smooth animated progress that automatically fills.',
      },
    },
  },
}

export const StepProgress: Story = {
  render: () => {
    const [step, setStep] = useState(0)
    const steps = [0, 25, 50, 75, 100]

    const nextStep = () => {
      setStep((prev) => (prev + 1) % steps.length)
    }

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              Step {Math.min(step + 1, steps.length)} of {steps.length}
            </span>
            <span className="text-sm font-medium">{steps[step]}%</span>
          </div>
          <Progress value={steps[step]} />
        </div>

        <button
          onClick={nextStep}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Next Step
        </button>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Progress with discrete steps, useful for multi-step workflows.',
      },
    },
  },
}

// ============================================================================
// Real-World Use Cases
// ============================================================================

export const FileUpload: Story = {
  render: () => {
    const [uploading, setUploading] = useState(false)
    const [progress, setProgress] = useState(0)

    const startUpload = () => {
      setUploading(true)
      setProgress(0)

      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            setTimeout(() => setUploading(false), 500)
            return 100
          }
          return prev + Math.random() * 15
        })
      }, 200)
    }

    return (
      <div className="space-y-4 max-w-md">
        <div className="p-4 border border-dashed border-border/50 rounded-lg text-center">
          <p className="text-sm text-muted-foreground mb-3">
            Drop files here or click to upload
          </p>
          <button
            onClick={startUpload}
            disabled={uploading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Upload File'}
          </button>
        </div>

        {uploading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">document.pdf</span>
              <span className="text-sm font-medium">
                {Math.round(progress)}%
              </span>
            </div>
            <Progress value={progress} />
          </div>
        )}
      </div>
    )
  },
}

export const DataProcessing: Story = {
  render: () => {
    const [processing, setProcessing] = useState(false)
    const [progress, setProgress] = useState(0)
    const [currentTask, setCurrentTask] = useState('')

    const tasks = [
      { name: 'Reading file...', duration: 1000 },
      { name: 'Parsing data...', duration: 1500 },
      { name: 'Validating records...', duration: 2000 },
      { name: 'Importing to database...', duration: 1500 },
      { name: 'Finalizing...', duration: 500 },
    ]

    const startProcessing = async () => {
      setProcessing(true)
      setProgress(0)

      for (let i = 0; i < tasks.length; i++) {
        setCurrentTask(tasks[i].name)
        const startProgress = (i / tasks.length) * 100
        const endProgress = ((i + 1) / tasks.length) * 100

        await new Promise((resolve) => {
          const duration = tasks[i].duration
          const steps = 20
          const stepDuration = duration / steps
          let step = 0

          const interval = setInterval(() => {
            step++
            const progress =
              startProgress + ((endProgress - startProgress) * step) / steps
            setProgress(progress)

            if (step >= steps) {
              clearInterval(interval)
              resolve(null)
            }
          }, stepDuration)
        })
      }

      setProcessing(false)
      setCurrentTask('Complete!')
    }

    return (
      <div className="space-y-4 max-w-md">
        <button
          onClick={startProcessing}
          disabled={processing}
          className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
        >
          {processing ? 'Processing...' : 'Process Data'}
        </button>

        {(processing || progress === 100) && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{currentTask}</span>
              <span className="text-sm font-medium">
                {Math.round(progress)}%
              </span>
            </div>
            <Progress
              value={progress}
              className={progress === 100 ? '[&>div]:bg-green-500' : ''}
            />
          </div>
        )}
      </div>
    )
  },
}

export const MultipleProgress: Story = {
  render: () => {
    const [files, setFiles] = useState([
      { name: 'document1.pdf', progress: 45 },
      { name: 'image.jpg', progress: 78 },
      { name: 'data.csv', progress: 23 },
    ])

    useEffect(() => {
      const interval = setInterval(() => {
        setFiles((prev) =>
          prev.map((file) => ({
            ...file,
            progress: Math.min(100, file.progress + Math.random() * 10),
          }))
        )
      }, 500)

      return () => clearInterval(interval)
    }, [])

    return (
      <div className="space-y-4 max-w-md">
        <h3 className="font-semibold">Uploading Files</h3>
        {files.map((file) => (
          <div key={file.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{file.name}</span>
              <span className="text-sm font-medium">
                {Math.round(file.progress)}%
              </span>
            </div>
            <Progress
              value={file.progress}
              className={file.progress === 100 ? '[&>div]:bg-green-500' : ''}
            />
          </div>
        ))}
      </div>
    )
  },
}

export const InstallationProgress: Story = {
  render: () => {
    const [installing, setInstalling] = useState(false)
    const [progress, setProgress] = useState(0)
    const [status, setStatus] = useState('Ready to install')

    const install = async () => {
      setInstalling(true)
      setProgress(0)

      const steps = [
        { status: 'Downloading dependencies...', duration: 2000 },
        { status: 'Installing packages...', duration: 3000 },
        { status: 'Building project...', duration: 2500 },
        { status: 'Running post-install scripts...', duration: 1500 },
      ]

      for (let i = 0; i < steps.length; i++) {
        setStatus(steps[i].status)
        const startProgress = (i / steps.length) * 100
        const endProgress = ((i + 1) / steps.length) * 100

        await new Promise((resolve) => {
          const duration = steps[i].duration
          const interval = setInterval(() => {
            setProgress((prev) => {
              const next =
                prev + ((endProgress - startProgress) / duration) * 100
              if (next >= endProgress) {
                clearInterval(interval)
                resolve(null)
                return endProgress
              }
              return next
            })
          }, 100)
        })
      }

      setStatus('Installation complete! ✓')
      setInstalling(false)
    }

    return (
      <div className="space-y-4 max-w-md p-6 border border-border/50 rounded-lg shadow-[0_1px_2px_0_rgb(0_0_0_/_0.05)]">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Install Application</h3>
          {progress === 100 && (
            <span className="text-green-600 dark:text-green-400 text-sm font-semibold">
              Complete
            </span>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{status}</p>
          {(installing || progress > 0) && (
            <>
              <Progress
                value={progress}
                className={progress === 100 ? '[&>div]:bg-green-500' : ''}
              />
              <p className="text-xs text-muted-foreground text-right">
                {Math.round(progress)}%
              </p>
            </>
          )}
        </div>

        <button
          onClick={install}
          disabled={installing}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {installing
            ? 'Installing...'
            : progress === 100
              ? 'Reinstall'
              : 'Install'}
        </button>
      </div>
    )
  },
}

// ============================================================================
// Interactive Demo
// ============================================================================

export const InteractiveDemo: Story = {
  render: () => {
    const [value, setValue] = useState(50)

    return (
      <div className="space-y-6 max-w-md">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm font-medium">{value}%</span>
          </div>
          <Progress value={value} />
        </div>

        <div className="space-y-3">
          <input
            type="range"
            min="0"
            max="100"
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            className="w-full"
          />

          <div className="flex gap-2">
            <button
              onClick={() => setValue(Math.max(0, value - 10))}
              className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              -10%
            </button>
            <button
              onClick={() => setValue(50)}
              className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Reset
            </button>
            <button
              onClick={() => setValue(Math.min(100, value + 10))}
              className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              +10%
            </button>
          </div>
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive demo to test progress values manually.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test initial state (50%)
    const progressBar = canvas.getByRole('progressbar')
    await expect(progressBar).toHaveAttribute('aria-valuenow', '50')

    // Test +10% button
    const increaseButton = canvas.getByRole('button', { name: '+10%' })
    await userEvent.click(increaseButton)
    await expect(progressBar).toHaveAttribute('aria-valuenow', '60')

    // Test -10% button
    const decreaseButton = canvas.getByRole('button', { name: '-10%' })
    await userEvent.click(decreaseButton)
    await expect(progressBar).toHaveAttribute('aria-valuenow', '50')

    // Test Reset button
    await userEvent.click(increaseButton)
    await userEvent.click(increaseButton)
    const resetButton = canvas.getByRole('button', { name: /reset/i })
    await userEvent.click(resetButton)
    await expect(progressBar).toHaveAttribute('aria-valuenow', '50')
  },
}

// ============================================================================
// Accessibility
// ============================================================================

export const Accessibility: Story = {
  render: () => (
    <div className="space-y-6 max-w-2xl">
      <div className="space-y-2">
        <p className="text-sm font-medium">Accessible Progress Bar</p>
        <Progress value={65} aria-label="Task completion progress" />
      </div>

      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-sm space-y-2">
        <strong>Accessibility Features:</strong>
        <ul className="list-disc list-inside space-y-1">
          <li>Uses semantic HTML progress element</li>
          <li>ARIA role="progressbar" for screen readers</li>
          <li>aria-valuenow, aria-valuemin, aria-valuemax attributes</li>
          <li>Optional aria-label for context</li>
          <li>High contrast visual indicator</li>
          <li>Smooth animations respect prefers-reduced-motion</li>
          <li>Clear visual distinction between complete and incomplete</li>
        </ul>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test progress bar has accessibility label
    const progressBar = canvas.getByRole('progressbar', {
      name: /task completion progress/i,
    })
    await expect(progressBar).toBeInTheDocument()
    await expect(progressBar).toHaveAttribute('aria-valuenow', '65')
    await expect(progressBar).toHaveAttribute('aria-label', 'Task completion progress')
  },
}
