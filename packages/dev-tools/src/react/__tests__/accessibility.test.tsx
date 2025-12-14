/**
 * Tests for Accessibility utilities
 * Tests screen reader announcer, skip link, focus trap, and keyboard navigation
 */

import * as React from 'react'
import { describe, it, expect, vi, beforeAll } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import {
  ScreenReaderAnnouncer,
  SkipLink,
  VisuallyHidden,
  useAnnounce,
  useFocusTrap,
  useKeyboardNavigation,
  useReducedMotion,
  useAriaIds,
  getFocusableElements,
  getDescribedByProps,
} from '../components/accessibility'

// Mock matchMedia for reduced motion tests
beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
})

describe('ScreenReaderAnnouncer', () => {
  it('renders with polite politeness by default', () => {
    render(<ScreenReaderAnnouncer message="Test message" />)

    const announcer = screen.getByRole('status')
    expect(announcer).toBeTruthy()
    expect(announcer.getAttribute('aria-live')).toBe('polite')
    expect(announcer.getAttribute('aria-atomic')).toBe('true')
  })

  it('renders with assertive politeness', () => {
    render(
      <ScreenReaderAnnouncer message="Urgent message" politeness="assertive" />
    )

    const announcer = screen.getByRole('status')
    expect(announcer.getAttribute('aria-live')).toBe('assertive')
  })

  it('displays the message', () => {
    render(<ScreenReaderAnnouncer message="Hello screen readers" />)

    expect(screen.getByText('Hello screen readers')).toBeTruthy()
  })

  it('has sr-only class for visual hiding', () => {
    const { container } = render(
      <ScreenReaderAnnouncer message="Hidden visually" />
    )

    expect(container.querySelector('.sr-only')).toBeTruthy()
  })
})

describe('useAnnounce hook', () => {
  function TestComponent() {
    const { announce, Announcer } = useAnnounce()

    return (
      <div>
        <button onClick={() => announce('Action completed')}>Trigger</button>
        <button onClick={() => announce('Error!', 'assertive')}>
          Trigger Error
        </button>
        <Announcer />
      </div>
    )
  }

  it('announces messages', async () => {
    vi.useFakeTimers()
    render(<TestComponent />)

    fireEvent.click(screen.getByText('Trigger'))

    await act(async () => {
      vi.advanceTimersByTime(100)
    })

    expect(screen.getByText('Action completed')).toBeTruthy()
    vi.useRealTimers()
  })
})

describe('SkipLink', () => {
  it('renders with default text', () => {
    render(<SkipLink targetId="main-content" />)

    expect(screen.getByText('Skip to main content')).toBeTruthy()
  })

  it('renders with custom text', () => {
    render(<SkipLink targetId="main">Skip to navigation</SkipLink>)

    expect(screen.getByText('Skip to navigation')).toBeTruthy()
  })

  it('has correct href', () => {
    render(<SkipLink targetId="main-content" />)

    const link = screen.getByRole('link')
    expect(link.getAttribute('href')).toBe('#main-content')
  })

  it('has skip-link class', () => {
    const { container } = render(<SkipLink targetId="main" />)

    expect(container.querySelector('.skip-link')).toBeTruthy()
  })

  it('focuses and scrolls target on click', () => {
    const mockFocus = vi.fn()
    const mockScrollIntoView = vi.fn()

    const mockElement = {
      focus: mockFocus,
      scrollIntoView: mockScrollIntoView,
    }

    vi.spyOn(document, 'getElementById').mockReturnValue(
      mockElement as unknown as HTMLElement
    )

    render(<SkipLink targetId="target" />)

    fireEvent.click(screen.getByRole('link'))

    expect(mockFocus).toHaveBeenCalled()
    expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' })

    vi.restoreAllMocks()
  })
})

describe('VisuallyHidden', () => {
  it('renders with sr-only class', () => {
    const { container } = render(<VisuallyHidden>Hidden text</VisuallyHidden>)

    expect(container.querySelector('.sr-only')).toBeTruthy()
    expect(screen.getByText('Hidden text')).toBeTruthy()
  })

  it('uses hidden attribute when hidden prop is true', () => {
    const { container } = render(
      <VisuallyHidden hidden>Fully hidden</VisuallyHidden>
    )

    const span = container.querySelector('span')
    expect(span?.hasAttribute('hidden')).toBe(true)
  })
})

describe('useFocusTrap', () => {
  function TestModal({ enabled = true }: { enabled?: boolean }) {
    const containerRef = React.useRef<HTMLDivElement>(null)
    useFocusTrap(containerRef, { enabled })

    return (
      <div ref={containerRef} tabIndex={-1} data-testid="modal">
        <button data-testid="first">First</button>
        <button data-testid="second">Second</button>
        <button data-testid="third">Third</button>
      </div>
    )
  }

  it('focuses first focusable element when enabled', () => {
    render(<TestModal />)

    // First button should be focused
    expect(document.activeElement).toBe(screen.getByTestId('first'))
  })

  it('does not trap focus when disabled', () => {
    const initialFocus = document.createElement('button')
    document.body.appendChild(initialFocus)
    initialFocus.focus()

    render(<TestModal enabled={false} />)

    // Focus should not have moved
    expect(document.activeElement).toBe(initialFocus)

    document.body.removeChild(initialFocus)
  })
})

describe('useKeyboardNavigation', () => {
  function TestList() {
    const [selectedIndex, setSelectedIndex] = React.useState(0)
    const items = ['Item 1', 'Item 2', 'Item 3']
    const { onKeyDown } = useKeyboardNavigation({
      items,
      selectedIndex,
      onSelect: setSelectedIndex,
    })

    return (
      <ul role="listbox" onKeyDown={onKeyDown} tabIndex={0} data-testid="list">
        {items.map((item, i) => (
          <li
            key={item}
            role="option"
            aria-selected={i === selectedIndex}
            data-testid={`item-${i}`}
          >
            {item}
          </li>
        ))}
      </ul>
    )
  }

  it('moves selection down on ArrowDown', () => {
    render(<TestList />)

    const list = screen.getByTestId('list')
    fireEvent.keyDown(list, { key: 'ArrowDown' })

    expect(screen.getByTestId('item-1').getAttribute('aria-selected')).toBe(
      'true'
    )
  })

  it('moves selection up on ArrowUp', () => {
    render(<TestList />)

    const list = screen.getByTestId('list')
    // Move down first
    fireEvent.keyDown(list, { key: 'ArrowDown' })
    // Then up
    fireEvent.keyDown(list, { key: 'ArrowUp' })

    expect(screen.getByTestId('item-0').getAttribute('aria-selected')).toBe(
      'true'
    )
  })

  it('wraps around at the end', () => {
    render(<TestList />)

    const list = screen.getByTestId('list')
    fireEvent.keyDown(list, { key: 'ArrowDown' })
    fireEvent.keyDown(list, { key: 'ArrowDown' })
    fireEvent.keyDown(list, { key: 'ArrowDown' }) // Should wrap to first

    expect(screen.getByTestId('item-0').getAttribute('aria-selected')).toBe(
      'true'
    )
  })

  it('moves to first on Home', () => {
    render(<TestList />)

    const list = screen.getByTestId('list')
    fireEvent.keyDown(list, { key: 'ArrowDown' })
    fireEvent.keyDown(list, { key: 'ArrowDown' })
    fireEvent.keyDown(list, { key: 'Home' })

    expect(screen.getByTestId('item-0').getAttribute('aria-selected')).toBe(
      'true'
    )
  })

  it('moves to last on End', () => {
    render(<TestList />)

    const list = screen.getByTestId('list')
    fireEvent.keyDown(list, { key: 'End' })

    expect(screen.getByTestId('item-2').getAttribute('aria-selected')).toBe(
      'true'
    )
  })
})

describe('useReducedMotion', () => {
  function TestComponent() {
    const reducedMotion = useReducedMotion()
    return <div data-testid="result">{reducedMotion.toString()}</div>
  }

  it('returns false by default', () => {
    render(<TestComponent />)
    expect(screen.getByTestId('result').textContent).toBe('false')
  })
})

describe('useAriaIds', () => {
  function TestComponent() {
    const ids = useAriaIds('test')
    return (
      <div>
        <span data-testid="label">{ids.labelId}</span>
        <span data-testid="desc">{ids.descriptionId}</span>
        <span data-testid="error">{ids.errorId}</span>
        <span data-testid="control">{ids.controlId}</span>
      </div>
    )
  }

  it('generates unique IDs with prefix', () => {
    render(<TestComponent />)

    const labelId = screen.getByTestId('label').textContent
    const descId = screen.getByTestId('desc').textContent
    const errorId = screen.getByTestId('error').textContent
    const controlId = screen.getByTestId('control').textContent

    expect(labelId).toContain('test-label-')
    expect(descId).toContain('test-desc-')
    expect(errorId).toContain('test-error-')
    expect(controlId).toContain('test-control-')
  })
})

describe('getFocusableElements', () => {
  it('returns all focusable elements', () => {
    const container = document.createElement('div')
    container.innerHTML = `
      <button>Button</button>
      <a href="#">Link</a>
      <input type="text" />
      <select><option>Option</option></select>
      <textarea></textarea>
      <div tabindex="0">Focusable div</div>
      <div tabindex="-1">Non-focusable div</div>
      <button disabled>Disabled button</button>
    `

    const focusable = getFocusableElements(container)

    expect(focusable.length).toBe(6) // Excludes disabled and tabindex=-1
  })
})

describe('getDescribedByProps', () => {
  it('returns empty object when no descriptions', () => {
    const props = getDescribedByProps(false, false, 'error-1', 'desc-1')
    expect(props).toEqual({})
  })

  it('returns error ID when has error', () => {
    const props = getDescribedByProps(true, false, 'error-1', 'desc-1')
    expect(props).toEqual({ 'aria-describedby': 'error-1' })
  })

  it('returns description ID when has description', () => {
    const props = getDescribedByProps(false, true, 'error-1', 'desc-1')
    expect(props).toEqual({ 'aria-describedby': 'desc-1' })
  })

  it('returns both IDs when has error and description', () => {
    const props = getDescribedByProps(true, true, 'error-1', 'desc-1')
    expect(props).toEqual({ 'aria-describedby': 'error-1 desc-1' })
  })
})
