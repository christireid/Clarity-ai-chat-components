import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Kbd, useFormattedShortcut } from '../kbd'
import * as React from 'react'

// Mock navigator.platform for platform detection
const mockNavigator = (platform: string, userAgent: string = '') => {
  Object.defineProperty(navigator, 'platform', {
    value: platform,
    configurable: true,
  })
  Object.defineProperty(navigator, 'userAgent', {
    value: userAgent,
    configurable: true,
  })
}

describe('Kbd Component', () => {
  const originalPlatform = navigator.platform
  const originalUserAgent = navigator.userAgent

  afterEach(() => {
    mockNavigator(originalPlatform, originalUserAgent)
  })

  describe('Rendering', () => {
    it('should render a kbd element', () => {
      render(<Kbd shortcut="k" />)
      expect(screen.getByText('K')).toBeInTheDocument()
    })

    it('should render multiple keys with separator', () => {
      mockNavigator('Win32')
      render(<Kbd shortcut="ctrl+k" />)
      expect(screen.getByText('Ctrl')).toBeInTheDocument()
      expect(screen.getByText('K')).toBeInTheDocument()
    })

    it('should render array shortcuts', () => {
      mockNavigator('Win32')
      render(<Kbd shortcut={['ctrl', 'shift', 'k']} />)
      expect(screen.getByText('Ctrl')).toBeInTheDocument()
      expect(screen.getByText('Shift')).toBeInTheDocument()
      expect(screen.getByText('K')).toBeInTheDocument()
    })
  })

  describe('Platform Detection', () => {
    it('should use Mac symbols on Mac platform', () => {
      mockNavigator('MacIntel')
      render(<Kbd shortcut="mod+k" />)
      expect(screen.getByText('K')).toBeInTheDocument()
    })

    it('should use Windows/Linux text on Windows', () => {
      mockNavigator('Win32')
      render(<Kbd shortcut="mod+k" />)
      expect(screen.getByText('Ctrl')).toBeInTheDocument()
      expect(screen.getByText('K')).toBeInTheDocument()
    })

    it('should respect platform override', () => {
      mockNavigator('Win32') // Actually Windows
      render(<Kbd shortcut="mod+k" platform="mac" />)
      // On forced Mac, should use Mac symbol
      expect(screen.getByText('K')).toBeInTheDocument()
    })
  })

  describe('Key Mappings', () => {
    beforeEach(() => {
      mockNavigator('MacIntel')
    })

    it('should map mod to command on Mac', () => {
      render(<Kbd shortcut="mod" platform="mac" data-testid="kbd" />)
      // Mac uses symbol for command (⌘)
      const kbd = screen.getByTestId('kbd')
      expect(kbd).toBeInTheDocument()
      expect(kbd.textContent).toContain('⌘')
    })

    it('should handle arrow keys', () => {
      render(<Kbd shortcut="up" />)
      expect(screen.getByText('↑')).toBeInTheDocument()
    })

    it('should handle function keys', () => {
      render(<Kbd shortcut="f1" />)
      expect(screen.getByText('F1')).toBeInTheDocument()
    })

    it('should handle single letters', () => {
      render(<Kbd shortcut="a" />)
      expect(screen.getByText('A')).toBeInTheDocument()
    })
  })

  describe('Sizes', () => {
    it('should render with default md size', () => {
      render(<Kbd shortcut="k" data-testid="kbd" />)
      const kbd = screen.getByTestId('kbd')
      expect(kbd).toHaveClass('text-xs')
    })

    it('should render with sm size', () => {
      render(<Kbd shortcut="k" size="sm" data-testid="kbd" />)
      const kbd = screen.getByTestId('kbd')
      expect(kbd).toHaveClass('text-[10px]')
    })

    it('should render with lg size', () => {
      render(<Kbd shortcut="k" size="lg" data-testid="kbd" />)
      const kbd = screen.getByTestId('kbd')
      expect(kbd).toHaveClass('text-sm')
    })
  })

  describe('Variants', () => {
    it('should render with default variant', () => {
      render(<Kbd shortcut="k" data-testid="kbd" />)
      const kbd = screen.getByTestId('kbd')
      expect(kbd).toHaveClass('bg-muted')
    })

    it('should render with outline variant', () => {
      render(<Kbd shortcut="k" variant="outline" data-testid="kbd" />)
      const kbd = screen.getByTestId('kbd')
      expect(kbd).toHaveClass('bg-transparent')
    })

    it('should render with ghost variant', () => {
      render(<Kbd shortcut="k" variant="ghost" data-testid="kbd" />)
      const kbd = screen.getByTestId('kbd')
      expect(kbd).toHaveClass('bg-transparent')
    })
  })

  describe('Separator', () => {
    it('should use platform-specific separator by default', () => {
      mockNavigator('Win32')
      render(<Kbd shortcut="ctrl+k" data-testid="kbd" />)
      expect(screen.getByText('+')).toBeInTheDocument()
    })

    it('should hide separator when set to none', () => {
      mockNavigator('Win32')
      render(<Kbd shortcut="ctrl+k" separator="none" data-testid="kbd" />)
      expect(screen.queryByText('+')).not.toBeInTheDocument()
    })

    it('should use custom separator', () => {
      render(<Kbd shortcut="ctrl+k" separator="-" data-testid="kbd" />)
      expect(screen.getByText('-')).toBeInTheDocument()
    })
  })

  describe('Custom className', () => {
    it('should accept custom className', () => {
      render(<Kbd shortcut="k" className="custom-class" data-testid="kbd" />)
      const kbd = screen.getByTestId('kbd')
      expect(kbd).toHaveClass('custom-class')
    })
  })

  describe('ForwardRef', () => {
    it('should forward ref to kbd element', () => {
      const ref = React.createRef<HTMLElement>()
      render(<Kbd shortcut="k" ref={ref} />)
      expect(ref.current).toBeInstanceOf(HTMLElement)
      expect(ref.current?.tagName).toBe('KBD')
    })
  })
})

describe('useFormattedShortcut Hook', () => {
  const TestComponent = ({
    shortcut,
    options,
  }: {
    shortcut: string | string[]
    options?: {
      platform?: 'mac' | 'windows' | 'linux' | 'auto'
      separator?: string | 'auto' | 'none'
    }
  }) => {
    const formatted = useFormattedShortcut(shortcut, options)
    return <div data-testid="result">{formatted}</div>
  }

  it('should format shortcut string', () => {
    render(<TestComponent shortcut="mod+k" options={{ platform: 'windows' }} />)
    expect(screen.getByTestId('result')).toHaveTextContent('Ctrl+K')
  })

  it('should format shortcut array', () => {
    render(
      <TestComponent
        shortcut={['ctrl', 'shift', 'k']}
        options={{ platform: 'windows' }}
      />
    )
    expect(screen.getByTestId('result')).toHaveTextContent('Ctrl+Shift+K')
  })

  it('should use no separator on Mac', () => {
    render(<TestComponent shortcut="mod+k" options={{ platform: 'mac' }} />)
    // Mac should join without separator by default
    const result = screen.getByTestId('result')
    expect(result.textContent).not.toContain('+')
  })
})
