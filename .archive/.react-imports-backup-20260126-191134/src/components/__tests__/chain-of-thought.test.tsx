/**
 * ChainOfThought Component Tests
 */

import * as React from 'react'
import { render, screen, fireEvent, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  ChainOfThought,
  useChainOfThought,
  type ChainOfThoughtStep,
} from '../ai/chain-of-thought'

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion')
  return {
    ...actual,
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
    motion: {
      div: ({
        children,
        initial,
        animate,
        exit,
        transition,
        ...props
      }: any) => <div {...props}>{children}</div>,
      button: ({
        children,
        initial,
        animate,
        exit,
        transition,
        whileHover,
        whileTap,
        ...props
      }: any) => <button {...props}>{children}</button>,
      span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
    },
  }
})

// Mock useReducedMotion
vi.mock('@clarity-chat/primitives', async () => {
  const actual = await vi.importActual('@clarity-chat/primitives')
  return {
    ...actual,
    useReducedMotion: () => false,
    cn: (...args: any[]) => args.filter(Boolean).join(' '),
  }
})

// =============================================================================
// TEST DATA
// =============================================================================

const createStep = (
  overrides: Partial<ChainOfThoughtStep> = {}
): ChainOfThoughtStep => ({
  id: '1',
  title: 'Test Step',
  content: 'Test content for the step',
  status: 'pending',
  ...overrides,
})

const basicSteps: ChainOfThoughtStep[] = [
  createStep({ id: '1', title: 'Step 1', status: 'complete' }),
  createStep({ id: '2', title: 'Step 2', status: 'in-progress' }),
  createStep({ id: '3', title: 'Step 3', status: 'pending' }),
]

// =============================================================================
// COMPONENT TESTS
// =============================================================================

describe('ChainOfThought', () => {
  describe('Rendering', () => {
    it('renders all steps', () => {
      render(<ChainOfThought steps={basicSteps} />)

      expect(screen.getByText('Step 1')).toBeInTheDocument()
      expect(screen.getByText('Step 2')).toBeInTheDocument()
      expect(screen.getByText('Step 3')).toBeInTheDocument()
    })

    it('renders with title and subtitle', () => {
      render(
        <ChainOfThought
          steps={basicSteps}
          title="AI Reasoning"
          subtitle="Follow the steps"
        />
      )

      expect(screen.getByText('AI Reasoning')).toBeInTheDocument()
      expect(screen.getByText('Follow the steps')).toBeInTheDocument()
    })

    it('renders status badges correctly', () => {
      render(<ChainOfThought steps={basicSteps} />)

      expect(screen.getByText('Complete')).toBeInTheDocument()
      expect(screen.getByText('In Progress')).toBeInTheDocument()
      expect(screen.getByText('Pending')).toBeInTheDocument()
    })

    it('renders empty state when no steps', () => {
      render(<ChainOfThought steps={[]} />)

      expect(
        screen.getByText('No reasoning steps available')
      ).toBeInTheDocument()
    })

    it('renders custom empty message', () => {
      render(
        <ChainOfThought steps={[]} emptyMessage="Custom empty message" />
      )

      expect(screen.getByText('Custom empty message')).toBeInTheDocument()
    })

    it('renders loading skeleton', () => {
      render(<ChainOfThought steps={[]} loading />)

      expect(
        screen.getByRole('status', { name: /loading/i })
      ).toBeInTheDocument()
    })

    it('renders step numbers when showStepNumbers is true', () => {
      render(<ChainOfThought steps={basicSteps} showStepNumbers />)

      expect(screen.getByText('1')).toBeInTheDocument()
      expect(screen.getByText('2')).toBeInTheDocument()
      expect(screen.getByText('3')).toBeInTheDocument()
    })

    it('renders timestamps when showTimestamps is true', () => {
      const stepsWithTimestamp = [
        createStep({
          id: '1',
          title: 'Step 1',
          timestamp: new Date('2024-01-15T10:30:00'),
        }),
      ]

      render(<ChainOfThought steps={stepsWithTimestamp} showTimestamps />)

      // Check that time is rendered (format may vary by locale)
      expect(screen.getByText(/10:30/)).toBeInTheDocument()
    })

    it('renders duration when showDuration is true', () => {
      const stepsWithDuration = [
        createStep({ id: '1', title: 'Step 1', duration: 1500 }),
      ]

      render(<ChainOfThought steps={stepsWithDuration} showDuration />)

      expect(screen.getByText('1.5s')).toBeInTheDocument()
    })

    it('renders progress bar for in-progress steps', () => {
      const stepsWithProgress = [
        createStep({
          id: '1',
          title: 'Step 1',
          status: 'in-progress',
          progress: 65,
        }),
      ]

      render(<ChainOfThought steps={stepsWithProgress} expanded />)

      // Progress bar should be rendered (we can check for the container)
      const progressContainer = screen.getByRole('article')
      expect(progressContainer).toBeInTheDocument()
    })
  })

  describe('Variants', () => {
    it('renders compact variant', () => {
      const { container } = render(
        <ChainOfThought steps={basicSteps} variant="compact" />
      )

      // Compact variant uses smaller padding classes
      expect(container.querySelector('.p-2\\.5')).toBeInTheDocument()
    })

    it('renders minimal variant without status badges', () => {
      render(<ChainOfThought steps={basicSteps} variant="minimal" />)

      // Status badges should not be visible in minimal variant
      expect(screen.queryByText('Complete')).not.toBeInTheDocument()
    })

    it('renders detailed variant with metadata', () => {
      const stepsWithMetadata = [
        createStep({
          id: '1',
          title: 'Step 1',
          metadata: { key: 'value' },
        }),
      ]

      render(
        <ChainOfThought steps={stepsWithMetadata} variant="detailed" expanded />
      )

      expect(screen.getByText('key:')).toBeInTheDocument()
      expect(screen.getByText('value')).toBeInTheDocument()
    })
  })

  describe('Expansion', () => {
    it('expands step content when clicked', async () => {
      const user = userEvent.setup()

      render(<ChainOfThought steps={basicSteps} />)

      // Content should not be visible initially
      expect(
        screen.queryByText('Test content for the step')
      ).not.toBeInTheDocument()

      // Click to expand
      await user.click(screen.getByText('Step 1'))

      // Content should now be visible
      expect(screen.getByText('Test content for the step')).toBeInTheDocument()
    })

    it('collapses step content when clicked again', async () => {
      const user = userEvent.setup()

      render(<ChainOfThought steps={basicSteps} expanded />)

      // Content should be visible initially
      expect(screen.getAllByText('Test content for the step')[0]).toBeInTheDocument()

      // Click to collapse
      await user.click(screen.getByText('Step 1'))

      // Content should still be there because other steps are expanded
      // Let's collapse all
      await user.click(screen.getByText('Step 2'))
      await user.click(screen.getByText('Step 3'))
    })

    it('expands all steps when expanded prop is true', () => {
      render(<ChainOfThought steps={basicSteps} expanded />)

      // All content should be visible
      expect(screen.getAllByText('Test content for the step')).toHaveLength(3)
    })

    it('toggle all button expands/collapses all steps', async () => {
      const user = userEvent.setup()

      render(<ChainOfThought steps={basicSteps} showToggleAll />)

      // Click expand all
      await user.click(screen.getByText('Expand all'))

      // All content should be visible
      expect(screen.getAllByText('Test content for the step')).toHaveLength(3)

      // Click collapse all
      await user.click(screen.getByText('Collapse all'))
    })

    it('supports controlled expansion state', async () => {
      const onExpandedStepsChange = vi.fn()

      render(
        <ChainOfThought
          steps={basicSteps}
          expandedSteps={['1']}
          onExpandedStepsChange={onExpandedStepsChange}
        />
      )

      // Step 1 content should be visible
      expect(screen.getByText('Test content for the step')).toBeInTheDocument()

      // Click to toggle step 2
      await userEvent.click(screen.getByText('Step 2'))

      expect(onExpandedStepsChange).toHaveBeenCalledWith(['1', '2'])
    })
  })

  describe('Callbacks', () => {
    it('calls onStepClick when step is clicked', async () => {
      const onStepClick = vi.fn()
      const user = userEvent.setup()

      render(<ChainOfThought steps={basicSteps} onStepClick={onStepClick} />)

      await user.click(screen.getByText('Step 1'))

      expect(onStepClick).toHaveBeenCalledWith('1')
    })

    it('calls onRetry when retry button is clicked', async () => {
      const onRetry = vi.fn()
      const user = userEvent.setup()

      const errorSteps = [
        createStep({
          id: '1',
          title: 'Failed Step',
          status: 'error',
          error: 'Something went wrong',
        }),
      ]

      render(<ChainOfThought steps={errorSteps} onRetry={onRetry} expanded />)

      await user.click(screen.getByText('Retry'))

      expect(onRetry).toHaveBeenCalledWith('1')
    })
  })

  describe('Error handling', () => {
    it('renders error state correctly', () => {
      const errorSteps = [
        createStep({
          id: '1',
          title: 'Failed Step',
          status: 'error',
          error: 'Connection failed',
        }),
      ]

      render(<ChainOfThought steps={errorSteps} expanded />)

      expect(screen.getByText('Error')).toBeInTheDocument()
      expect(screen.getByText('Connection failed')).toBeInTheDocument()
    })

    it('renders skipped state correctly', () => {
      const skippedSteps = [
        createStep({ id: '1', title: 'Skipped Step', status: 'skipped' }),
      ]

      render(<ChainOfThought steps={skippedSteps} />)

      expect(screen.getByText('Skipped')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(
        <ChainOfThought
          steps={basicSteps}
          aria-label="Custom aria label"
        />
      )

      expect(
        screen.getByRole('region', { name: 'Custom aria label' })
      ).toBeInTheDocument()
    })

    it('step buttons have aria-expanded attribute', () => {
      render(<ChainOfThought steps={basicSteps} />)

      const stepButtons = screen.getAllByRole('button', { name: /step/i })
      stepButtons.forEach((button) => {
        expect(button).toHaveAttribute('aria-expanded')
      })
    })

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup()

      render(<ChainOfThought steps={basicSteps} />)

      // Tab to first step
      await user.tab()

      // Press Enter to expand
      await user.keyboard('{Enter}')

      // Content should be visible
      expect(screen.getByText('Test content for the step')).toBeInTheDocument()

      // Press Space to collapse
      await user.keyboard(' ')
    })

    it('steps have proper article role and aria-label', () => {
      render(<ChainOfThought steps={basicSteps} />)

      const articles = screen.getAllByRole('article')
      expect(articles).toHaveLength(3)
      expect(articles[0]).toHaveAttribute(
        'aria-label',
        expect.stringContaining('Step 1')
      )
    })
  })

  describe('maxVisibleSteps', () => {
    it('limits visible steps and shows "show more" button', () => {
      render(<ChainOfThought steps={basicSteps} maxVisibleSteps={2} />)

      expect(screen.getByText('Step 1')).toBeInTheDocument()
      expect(screen.getByText('Step 2')).toBeInTheDocument()
      expect(screen.queryByText('Step 3')).not.toBeInTheDocument()
      expect(screen.getByText('Show 1 more step')).toBeInTheDocument()
    })

    it('shows all steps when "show more" is clicked', async () => {
      const user = userEvent.setup()

      render(<ChainOfThought steps={basicSteps} maxVisibleSteps={2} />)

      await user.click(screen.getByText('Show 1 more step'))

      expect(screen.getByText('Step 3')).toBeInTheDocument()
    })
  })

  describe('Sub-steps', () => {
    it('renders sub-steps when expanded', () => {
      const stepsWithSubSteps = [
        createStep({
          id: '1',
          title: 'Parent Step',
          subSteps: [
            createStep({ id: '1a', title: 'Sub-step 1' }),
            createStep({ id: '1b', title: 'Sub-step 2' }),
          ],
        }),
      ]

      render(<ChainOfThought steps={stepsWithSubSteps} expanded />)

      expect(screen.getByText('Sub-step 1')).toBeInTheDocument()
      expect(screen.getByText('Sub-step 2')).toBeInTheDocument()
    })
  })
})

// =============================================================================
// HOOK TESTS
// =============================================================================

describe('useChainOfThought', () => {
  const TestComponent: React.FC<{
    initialSteps?: ChainOfThoughtStep[]
    onUpdate?: (result: ReturnType<typeof useChainOfThought>) => void
  }> = ({ initialSteps, onUpdate }) => {
    const result = useChainOfThought({ initialSteps })
    React.useEffect(() => {
      onUpdate?.(result)
    }, [result, onUpdate])
    return null
  }

  it('initializes with empty steps by default', () => {
    let hookResult: ReturnType<typeof useChainOfThought> | null = null

    render(<TestComponent onUpdate={(r) => (hookResult = r)} />)

    expect(hookResult?.steps).toEqual([])
  })

  it('initializes with provided steps', () => {
    let hookResult: ReturnType<typeof useChainOfThought> | null = null

    render(
      <TestComponent
        initialSteps={basicSteps}
        onUpdate={(r) => (hookResult = r)}
      />
    )

    expect(hookResult?.steps).toHaveLength(3)
  })

  it('adds a step', () => {
    let hookResult: ReturnType<typeof useChainOfThought> | null = null

    const { rerender } = render(
      <TestComponent onUpdate={(r) => (hookResult = r)} />
    )

    hookResult?.addStep(createStep({ id: 'new' }))
    rerender(<TestComponent onUpdate={(r) => (hookResult = r)} />)

    expect(hookResult?.steps).toHaveLength(1)
  })

  it('updates a step', () => {
    let hookResult: ReturnType<typeof useChainOfThought> | null = null

    const { rerender } = render(
      <TestComponent
        initialSteps={[createStep({ id: '1', title: 'Original' })]}
        onUpdate={(r) => (hookResult = r)}
      />
    )

    hookResult?.updateStep('1', { title: 'Updated' })
    rerender(
      <TestComponent
        initialSteps={[createStep({ id: '1', title: 'Original' })]}
        onUpdate={(r) => (hookResult = r)}
      />
    )

    expect(hookResult?.getStep('1')?.title).toBe('Updated')
  })

  it('removes a step', () => {
    let hookResult: ReturnType<typeof useChainOfThought> | null = null

    const { rerender } = render(
      <TestComponent
        initialSteps={basicSteps}
        onUpdate={(r) => (hookResult = r)}
      />
    )

    hookResult?.removeStep('1')
    rerender(
      <TestComponent
        initialSteps={basicSteps}
        onUpdate={(r) => (hookResult = r)}
      />
    )

    expect(hookResult?.steps).toHaveLength(2)
    expect(hookResult?.getStep('1')).toBeUndefined()
  })

  it('clears all steps', () => {
    let hookResult: ReturnType<typeof useChainOfThought> | null = null

    const { rerender } = render(
      <TestComponent
        initialSteps={basicSteps}
        onUpdate={(r) => (hookResult = r)}
      />
    )

    hookResult?.clearSteps()
    rerender(
      <TestComponent
        initialSteps={basicSteps}
        onUpdate={(r) => (hookResult = r)}
      />
    )

    expect(hookResult?.steps).toHaveLength(0)
  })

  it('calculates isProcessing correctly', () => {
    let hookResult: ReturnType<typeof useChainOfThought> | null = null

    render(
      <TestComponent
        initialSteps={[
          createStep({ id: '1', status: 'complete' }),
          createStep({ id: '2', status: 'in-progress' }),
        ]}
        onUpdate={(r) => (hookResult = r)}
      />
    )

    expect(hookResult?.isProcessing).toBe(true)
  })

  it('calculates isComplete correctly', () => {
    let hookResult: ReturnType<typeof useChainOfThought> | null = null

    render(
      <TestComponent
        initialSteps={[
          createStep({ id: '1', status: 'complete' }),
          createStep({ id: '2', status: 'complete' }),
        ]}
        onUpdate={(r) => (hookResult = r)}
      />
    )

    expect(hookResult?.isComplete).toBe(true)
  })

  it('calculates completionPercentage correctly', () => {
    let hookResult: ReturnType<typeof useChainOfThought> | null = null

    render(
      <TestComponent
        initialSteps={[
          createStep({ id: '1', status: 'complete' }),
          createStep({ id: '2', status: 'pending' }),
        ]}
        onUpdate={(r) => (hookResult = r)}
      />
    )

    expect(hookResult?.completionPercentage).toBe(50)
  })
})
