import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { axe } from 'vitest-axe'
import { AxeMatchers } from 'vitest-axe'
import { Button } from '../button'

// Extend expect for this test file
expect.extend(AxeMatchers)

describe('Button Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<Button>Click me</Button>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('should be accessible with aria-label', async () => {
    const { container } = render(<Button aria-label="Close dialog">×</Button>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('should be accessible when disabled', async () => {
    const { container } = render(<Button disabled>Disabled</Button>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('should be accessible with loading state', async () => {
    const { container } = render(<Button loading>Loading</Button>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('should have proper focus management', async () => {
    const { container } = render(<Button>Focusable</Button>)
    const button = container.querySelector('button')
    expect(button).toBeInTheDocument()
    
    // Button should be focusable
    button?.focus()
    expect(document.activeElement).toBe(button)
    
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
