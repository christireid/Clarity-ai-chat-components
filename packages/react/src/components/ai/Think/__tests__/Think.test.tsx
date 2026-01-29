/**
 * Tests for Think component
 */

import * as React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Think } from '../Think'
import { useThink } from '../useThink'
import type { ThinkStep } from '../types'

describe('Think Component', () => {
  it('renders with default props', () => {
    render(<Think content="Test content" />)
    expect(screen.getByText('Thinking')).toBeInTheDocument()
  })

  it('renders custom title', () => {
    render(<Think title="Custom Title" content="Test content" />)
    expect(screen.getByText('Custom Title')).toBeInTheDocument()
  })

  it('renders content when expanded', () => {
    render(<Think content="Test content" defaultExpanded />)
    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('toggles expansion on click when collapsible', () => {
    render(<Think content="Test content" collapsible />)

    const header = screen.getByRole('button')
    fireEvent.click(header)

    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('renders steps', () => {
    const steps: ThinkStep[] = [
      { text: 'Step 1', status: 'complete' },
      { text: 'Step 2', status: 'active' },
      { text: 'Step 3', status: 'pending' },
    ]

    render(<Think steps={steps} defaultExpanded />)

    expect(screen.getByText('Step 1')).toBeInTheDocument()
    expect(screen.getByText('Step 2')).toBeInTheDocument()
    expect(screen.getByText('Step 3')).toBeInTheDocument()
  })

  it('shows streaming indicator when isStreaming is true', () => {
    render(<Think content="Test" isStreaming defaultExpanded />)
    expect(screen.getByText('▋')).toBeInTheDocument()
  })

  it('supports controlled expansion', () => {
    const onExpandedChange = vi.fn()
    const { rerender } = render(
      <Think content="Test" expanded={false} onExpandedChange={onExpandedChange} />
    )

    expect(screen.queryByText('Test')).not.toBeInTheDocument()

    rerender(<Think content="Test" expanded={true} onExpandedChange={onExpandedChange} />)
    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  it('applies variant styles', () => {
    const { container } = render(<Think content="Test" variant="bordered" />)
    expect(container.querySelector('.border')).toBeInTheDocument()
  })

  it('handles keyboard navigation', () => {
    const onExpandedChange = vi.fn()
    render(<Think content="Test" onExpandedChange={onExpandedChange} collapsible />)

    const header = screen.getByRole('button')
    fireEvent.keyDown(header, { key: 'Enter' })

    expect(onExpandedChange).toHaveBeenCalledWith(true)
  })

  it('respects disableAnimations prop', () => {
    render(<Think content="Test" disableAnimations defaultExpanded />)
    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  it('displays step duration for completed steps', () => {
    const steps: ThinkStep[] = [
      { text: 'Step 1', status: 'complete', duration: 1500 },
    ]

    render(<Think steps={steps} defaultExpanded />)
    expect(screen.getByText('1.5s')).toBeInTheDocument()
  })
})

describe('useThink Hook', () => {
  it('initializes with default state', () => {
    const TestComponent = () => {
      const think = useThink()
      return (
        <div>
          <span data-testid="expanded">{think.expanded.toString()}</span>
          <span data-testid="steps-count">{think.steps.length}</span>
        </div>
      )
    }

    render(<TestComponent />)
    expect(screen.getByTestId('expanded')).toHaveTextContent('false')
    expect(screen.getByTestId('steps-count')).toHaveTextContent('0')
  })

  it('adds steps', () => {
    const TestComponent = () => {
      const think = useThink()
      return (
        <div>
          <button onClick={() => think.addStep('Test step', 'active')}>Add Step</button>
          <span data-testid="steps-count">{think.steps.length}</span>
        </div>
      )
    }

    render(<TestComponent />)
    const button = screen.getByText('Add Step')
    fireEvent.click(button)

    expect(screen.getByTestId('steps-count')).toHaveTextContent('1')
  })

  it('updates step status', () => {
    const TestComponent = () => {
      const think = useThink()

      React.useEffect(() => {
        think.addStep('Test step', 'active')
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [])

      return (
        <div>
          <button onClick={() => think.updateStepStatus(0, 'complete', 1000)}>
            Complete Step
          </button>
          <span data-testid="step-status">{think.steps[0]?.status || 'none'}</span>
        </div>
      )
    }

    render(<TestComponent />)
    const button = screen.getByText('Complete Step')
    fireEvent.click(button)

    expect(screen.getByTestId('step-status')).toHaveTextContent('complete')
  })

  it('clears steps', () => {
    const TestComponent = () => {
      const think = useThink()

      React.useEffect(() => {
        think.addStep('Step 1')
        think.addStep('Step 2')
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [])

      return (
        <div>
          <button onClick={think.clearSteps}>Clear</button>
          <span data-testid="steps-count">{think.steps.length}</span>
        </div>
      )
    }

    render(<TestComponent />)
    expect(screen.getByTestId('steps-count')).toHaveTextContent('2')

    const button = screen.getByText('Clear')
    fireEvent.click(button)

    expect(screen.getByTestId('steps-count')).toHaveTextContent('0')
  })

  it('auto-expands when adding steps if autoExpand is true', () => {
    const TestComponent = () => {
      const think = useThink({ autoExpand: true })

      return (
        <div>
          <button onClick={() => think.addStep('Test')}>Add</button>
          <span data-testid="expanded">{think.expanded.toString()}</span>
        </div>
      )
    }

    render(<TestComponent />)
    expect(screen.getByTestId('expanded')).toHaveTextContent('false')

    const button = screen.getByText('Add')
    fireEvent.click(button)

    expect(screen.getByTestId('expanded')).toHaveTextContent('true')
  })
})
