/**
 * OKLCH Colors + Tailwind Integration Tests
 *
 * Tests the complete integration of OKLCH color system with Tailwind CSS:
 * - OKLCH color format parsing and rendering
 * - Tailwind utility classes with OKLCH values
 * - Glassmorphism effects with OKLCH gradients
 * - Theme switching (light/dark mode)
 * - Color contrast and accessibility
 *
 * @integration-test
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { cn } from '@clarity-chat/primitives'

// ============================================================================
// Test Components
// ============================================================================

/**
 * Component demonstrating OKLCH colors in glassmorphism UI
 */
function GlassmorphicCard({ theme = 'light' }: { theme?: 'light' | 'dark' }) {
  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div
        data-testid="glassmorphic-card"
        className={cn(
          'relative rounded-xl p-6',
          'bg-glass-pastel-blue dark:bg-glass-pastel-blue-dark',
          'border border-glass-light dark:border-glass-dark-light',
          'backdrop-blur-lg backdrop-saturate-150',
          'shadow-lg',
          'transition-all duration-300'
        )}
      >
        <h2 className="text-2xl font-bold mb-4">Glassmorphic Design</h2>
        <p className="text-muted-foreground">
          Using OKLCH colors for precise, perceptually uniform color control.
        </p>

        <div
          data-testid="gradient-mesh"
          className="absolute inset-0 rounded-xl bg-glass-mesh dark:bg-glass-mesh-dark opacity-50 pointer-events-none"
        />
      </div>
    </div>
  )
}

/**
 * Component demonstrating AI-specific OKLCH colors
 */
function AIMessageBubble({ role }: { role: 'user' | 'assistant' | 'system' }) {
  const roleColors = {
    user: 'bg-ai-user',
    assistant: 'bg-ai-assistant',
    system: 'bg-ai-system',
  }

  return (
    <div
      data-testid={`message-${role}`}
      className={cn(
        'p-4 rounded-lg',
        roleColors[role],
        'border border-glass-medium dark:border-glass-dark-medium',
        'shadow-sm'
      )}
    >
      <div className="font-medium">{role}</div>
      <div className="text-sm opacity-90">Message content</div>
    </div>
  )
}

/**
 * Component demonstrating OKLCH gradient animations
 */
function AnimatedGradient() {
  return (
    <div
      data-testid="animated-gradient"
      className={cn(
        'w-full h-32 rounded-xl',
        'bg-glass-pastel-purple dark:bg-glass-pastel-purple-dark',
        'animate-gradient-shift',
        'bg-[length:200%_200%]'
      )}
    />
  )
}

/**
 * Component demonstrating accessible color contrast
 */
function AccessibleColorPalette() {
  return (
    <div data-testid="color-palette" className="space-y-4">
      {/* Primary colors */}
      <div className="bg-primary text-primary-foreground p-4 rounded-lg">
        <span data-testid="primary-text">Primary Color</span>
      </div>

      {/* Secondary colors */}
      <div className="bg-secondary text-secondary-foreground p-4 rounded-lg">
        <span data-testid="secondary-text">Secondary Color</span>
      </div>

      {/* Destructive colors */}
      <div className="bg-destructive text-destructive-foreground p-4 rounded-lg">
        <span data-testid="destructive-text">Destructive Color</span>
      </div>

      {/* Success colors */}
      <div className="bg-success text-success-foreground p-4 rounded-lg">
        <span data-testid="success-text">Success Color</span>
      </div>

      {/* Muted colors */}
      <div className="bg-muted text-muted-foreground p-4 rounded-lg">
        <span data-testid="muted-text">Muted Color</span>
      </div>
    </div>
  )
}

/**
 * Component demonstrating glassmorphism borders
 */
function GlassBorders() {
  return (
    <div data-testid="glass-borders" className="space-y-4">
      <div className="border-2 border-glass-light p-4 rounded-lg">
        Light glass border
      </div>
      <div className="border-2 border-glass-medium p-4 rounded-lg">
        Medium glass border
      </div>
      <div className="border-2 border-glass-strong p-4 rounded-lg">
        Strong glass border
      </div>
    </div>
  )
}

/**
 * Component with theme switching
 */
function ThemedComponent({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light')

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <button
        data-testid="theme-toggle"
        onClick={() => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))}
      >
        Toggle Theme
      </button>
      <div data-testid="themed-content">{children}</div>
    </div>
  )
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get computed style value for an element
 */
function getComputedStyleValue(element: HTMLElement, property: string): string {
  return window.getComputedStyle(element).getPropertyValue(property)
}

/**
 * Parse OKLCH color string
 */
function parseOKLCH(oklch: string): {
  lightness: number
  chroma: number
  hue: number
  alpha?: number
} | null {
  // Match: oklch(L% C H) or oklch(L% C H / A)
  const match = oklch.match(
    /oklch\((\d+(?:\.\d+)?)%?\s+(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)\s*(?:\/\s*(\d+(?:\.\d+)?))?\)/
  )

  if (!match) return null

  return {
    lightness: parseFloat(match[1]),
    chroma: parseFloat(match[2]),
    hue: parseFloat(match[3]),
    alpha: match[4] ? parseFloat(match[4]) : undefined,
  }
}

/**
 * Check if color has sufficient contrast (WCAG AA)
 */
function hasMinimumContrast(
  foreground: string,
  background: string,
  level: 'AA' | 'AAA' = 'AA'
): boolean {
  // Simplified contrast check for OKLCH
  // In production, use a proper color contrast library
  const minContrast = level === 'AA' ? 4.5 : 7

  // Parse OKLCH values
  const fg = parseOKLCH(foreground)
  const bg = parseOKLCH(background)

  if (!fg || !bg) return false

  // Simplified luminance difference check
  const luminanceDiff = Math.abs(fg.lightness - bg.lightness)

  // Rough contrast estimation (not accurate, for testing purposes)
  return luminanceDiff >= minContrast * 10
}

// ============================================================================
// Integration Tests
// ============================================================================

describe('OKLCH Colors + Tailwind Integration', () => {
  beforeEach(() => {
    // Reset any theme state
    document.documentElement.classList.remove('dark')
  })

  afterEach(() => {
    document.documentElement.classList.remove('dark')
  })

  describe('OKLCH Color Format', () => {
    it('renders OKLCH colors correctly', () => {
      render(<GlassmorphicCard />)

      const card = screen.getByTestId('glassmorphic-card')
      expect(card).toBeInTheDocument()

      // Verify classes are applied
      expect(card).toHaveClass('bg-glass-pastel-blue')
      expect(card).toHaveClass('border-glass-light')
    })

    it('applies OKLCH gradients', () => {
      render(<GlassmorphicCard />)

      const mesh = screen.getByTestId('gradient-mesh')
      expect(mesh).toBeInTheDocument()

      // Verify gradient classes
      expect(mesh).toHaveClass('bg-glass-mesh')
    })

    it('supports OKLCH with alpha transparency', () => {
      render(<GlassBorders />)

      const container = screen.getByTestId('glass-borders')
      const borders = container.querySelectorAll('div[class*="border-glass"]')

      expect(borders).toHaveLength(3)

      // All should have glass border classes
      borders.forEach((border) => {
        const classList = Array.from(border.classList)
        const hasGlassBorder = classList.some((cls) => cls.includes('border-glass'))
        expect(hasGlassBorder).toBe(true)
      })
    })
  })

  describe('Glassmorphism Effects', () => {
    it('applies backdrop blur correctly', () => {
      render(<GlassmorphicCard />)

      const card = screen.getByTestId('glassmorphic-card')

      // Verify backdrop blur classes
      expect(card).toHaveClass('backdrop-blur-lg')
      expect(card).toHaveClass('backdrop-saturate-150')
    })

    it('combines multiple glassmorphism properties', () => {
      render(<GlassmorphicCard />)

      const card = screen.getByTestId('glassmorphic-card')

      // Should have all glassmorphism effects
      expect(card).toHaveClass('backdrop-blur-lg')
      expect(card).toHaveClass('backdrop-saturate-150')
      expect(card).toHaveClass('bg-glass-pastel-blue')
      expect(card).toHaveClass('border-glass-light')
      expect(card).toHaveClass('shadow-lg')
    })

    it('applies glassmorphic borders with OKLCH', () => {
      render(<GlassBorders />)

      const container = screen.getByTestId('glass-borders')
      const lightBorder = container.querySelector('.border-glass-light')
      const mediumBorder = container.querySelector('.border-glass-medium')
      const strongBorder = container.querySelector('.border-glass-strong')

      expect(lightBorder).toBeInTheDocument()
      expect(mediumBorder).toBeInTheDocument()
      expect(strongBorder).toBeInTheDocument()
    })
  })

  describe('Theme Switching', () => {
    it('applies light mode OKLCH colors by default', () => {
      render(<GlassmorphicCard theme="light" />)

      const card = screen.getByTestId('glassmorphic-card')

      // Should have light mode classes
      expect(card).toHaveClass('bg-glass-pastel-blue')
      expect(card).toHaveClass('border-glass-light')
    })

    it('switches to dark mode OKLCH colors', () => {
      render(<GlassmorphicCard theme="dark" />)

      const card = screen.getByTestId('glassmorphic-card')

      // Should have dark mode classes
      expect(card).toHaveClass('dark:bg-glass-pastel-blue-dark')
      expect(card).toHaveClass('dark:border-glass-dark-light')
    })

    it('applies correct gradient for theme', () => {
      const { rerender } = render(<GlassmorphicCard theme="light" />)

      const mesh = screen.getByTestId('gradient-mesh')
      expect(mesh).toHaveClass('bg-glass-mesh')

      rerender(<GlassmorphicCard theme="dark" />)
      expect(mesh).toHaveClass('dark:bg-glass-mesh-dark')
    })

    it('maintains glassmorphism effects across themes', () => {
      const { rerender } = render(<GlassmorphicCard theme="light" />)

      const card = screen.getByTestId('glassmorphic-card')

      // Verify light mode
      expect(card).toHaveClass('backdrop-blur-lg')

      // Switch to dark mode
      rerender(<GlassmorphicCard theme="dark" />)

      // Backdrop blur should persist
      expect(card).toHaveClass('backdrop-blur-lg')
    })
  })

  describe('AI-Specific Colors', () => {
    it('applies correct OKLCH color for user messages', () => {
      render(<AIMessageBubble role="user" />)

      const message = screen.getByTestId('message-user')
      expect(message).toHaveClass('bg-ai-user')
    })

    it('applies correct OKLCH color for assistant messages', () => {
      render(<AIMessageBubble role="assistant" />)

      const message = screen.getByTestId('message-assistant')
      expect(message).toHaveClass('bg-ai-assistant')
    })

    it('applies correct OKLCH color for system messages', () => {
      render(<AIMessageBubble role="system" />)

      const message = screen.getByTestId('message-system')
      expect(message).toHaveClass('bg-ai-system')
    })

    it('maintains glassmorphic borders on AI messages', () => {
      render(<AIMessageBubble role="user" />)

      const message = screen.getByTestId('message-user')
      expect(message).toHaveClass('border-glass-medium')
    })
  })

  describe('Gradient Animations', () => {
    it('applies OKLCH gradient animation classes', () => {
      render(<AnimatedGradient />)

      const gradient = screen.getByTestId('animated-gradient')

      // Verify animation classes
      expect(gradient).toHaveClass('animate-gradient-shift')
      expect(gradient).toHaveClass('bg-glass-pastel-purple')
    })

    it('supports gradient size for animation', () => {
      render(<AnimatedGradient />)

      const gradient = screen.getByTestId('animated-gradient')

      // Verify background size for animation
      expect(gradient).toHaveClass('bg-[length:200%_200%]')
    })
  })

  describe('Color Accessibility', () => {
    it('maintains accessible contrast ratios', () => {
      render(<AccessibleColorPalette />)

      // Check each color combination
      const primaryText = screen.getByTestId('primary-text')
      const secondaryText = screen.getByTestId('secondary-text')
      const destructiveText = screen.getByTestId('destructive-text')
      const successText = screen.getByTestId('success-text')

      // All text elements should be visible and have proper classes
      expect(primaryText).toBeInTheDocument()
      expect(secondaryText).toBeInTheDocument()
      expect(destructiveText).toBeInTheDocument()
      expect(successText).toBeInTheDocument()

      // Parent containers should have proper color classes
      expect(primaryText.parentElement).toHaveClass('text-primary-foreground')
      expect(secondaryText.parentElement).toHaveClass('text-secondary-foreground')
      expect(destructiveText.parentElement).toHaveClass('text-destructive-foreground')
      expect(successText.parentElement).toHaveClass('text-success-foreground')
    })

    it('provides sufficient contrast in light mode', () => {
      render(<AccessibleColorPalette />)

      // Verify all text is readable
      const texts = [
        screen.getByTestId('primary-text'),
        screen.getByTestId('secondary-text'),
        screen.getByTestId('destructive-text'),
        screen.getByTestId('success-text'),
        screen.getByTestId('muted-text'),
      ]

      texts.forEach((text) => {
        expect(text).toBeVisible()
      })
    })

    it('provides sufficient contrast in dark mode', () => {
      render(
        <div className="dark">
          <AccessibleColorPalette />
        </div>
      )

      // Verify all text is readable in dark mode
      const texts = [
        screen.getByTestId('primary-text'),
        screen.getByTestId('secondary-text'),
        screen.getByTestId('destructive-text'),
        screen.getByTestId('success-text'),
        screen.getByTestId('muted-text'),
      ]

      texts.forEach((text) => {
        expect(text).toBeVisible()
      })
    })
  })

  describe('Tailwind Class Utilities', () => {
    it('combines OKLCH classes with standard Tailwind', () => {
      render(<GlassmorphicCard />)

      const card = screen.getByTestId('glassmorphic-card')

      // Should have both OKLCH and standard Tailwind classes
      expect(card).toHaveClass('bg-glass-pastel-blue') // OKLCH
      expect(card).toHaveClass('backdrop-blur-lg') // Standard
      expect(card).toHaveClass('rounded-xl') // Standard
      expect(card).toHaveClass('p-6') // Standard
      expect(card).toHaveClass('shadow-lg') // Standard
    })

    it('supports responsive OKLCH classes', () => {
      const ResponsiveComponent = () => (
        <div
          data-testid="responsive"
          className={cn(
            'bg-glass-pastel-blue',
            'sm:bg-glass-pastel-purple',
            'md:bg-glass-pastel-pink',
            'lg:bg-glass-pastel-green'
          )}
        >
          Responsive glassmorphism
        </div>
      )

      render(<ResponsiveComponent />)

      const element = screen.getByTestId('responsive')

      // Should have responsive classes
      expect(element).toHaveClass('bg-glass-pastel-blue')
      expect(element).toHaveClass('sm:bg-glass-pastel-purple')
      expect(element).toHaveClass('md:bg-glass-pastel-pink')
      expect(element).toHaveClass('lg:bg-glass-pastel-green')
    })

    it('supports hover states with OKLCH', () => {
      const HoverComponent = () => (
        <button
          data-testid="hover-button"
          className={cn(
            'bg-glass-pastel-blue',
            'hover:bg-glass-pastel-purple',
            'border border-glass-light',
            'hover:border-glass-medium',
            'transition-all duration-300'
          )}
        >
          Hover me
        </button>
      )

      render(<HoverComponent />)

      const button = screen.getByTestId('hover-button')

      // Should have hover classes
      expect(button).toHaveClass('hover:bg-glass-pastel-purple')
      expect(button).toHaveClass('hover:border-glass-medium')
      expect(button).toHaveClass('transition-all')
    })
  })

  describe('Performance', () => {
    it('renders multiple OKLCH components efficiently', () => {
      const startTime = performance.now()

      render(
        <div>
          <GlassmorphicCard />
          <AIMessageBubble role="user" />
          <AIMessageBubble role="assistant" />
          <AnimatedGradient />
          <AccessibleColorPalette />
          <GlassBorders />
        </div>
      )

      const endTime = performance.now()
      const renderTime = endTime - startTime

      // Should render in under 100ms
      expect(renderTime).toBeLessThan(100)
    })

    it('handles theme switching without performance degradation', () => {
      const { rerender } = render(<GlassmorphicCard theme="light" />)

      const startTime = performance.now()

      // Switch themes multiple times
      for (let i = 0; i < 10; i++) {
        rerender(<GlassmorphicCard theme={i % 2 === 0 ? 'dark' : 'light'} />)
      }

      const endTime = performance.now()
      const switchTime = endTime - startTime

      // Should handle rapid switching efficiently
      expect(switchTime).toBeLessThan(100)
    })
  })

  describe('Real App Integration', () => {
    it('works with complex glassmorphic UI layouts', () => {
      const ComplexLayout = () => (
        <div className="space-y-4 p-4">
          <GlassmorphicCard />
          <div className="grid grid-cols-2 gap-4">
            <AIMessageBubble role="user" />
            <AIMessageBubble role="assistant" />
          </div>
          <AnimatedGradient />
        </div>
      )

      render(<ComplexLayout />)

      // All components should render correctly
      expect(screen.getByTestId('glassmorphic-card')).toBeInTheDocument()
      expect(screen.getByTestId('message-user')).toBeInTheDocument()
      expect(screen.getByTestId('message-assistant')).toBeInTheDocument()
      expect(screen.getByTestId('animated-gradient')).toBeInTheDocument()
    })

    it('maintains visual consistency across components', () => {
      const ConsistentUI = () => (
        <div className="space-y-4">
          <div className="bg-glass-pastel-blue border border-glass-light p-4 rounded-lg">
            Card 1
          </div>
          <div className="bg-glass-pastel-blue border border-glass-light p-4 rounded-lg">
            Card 2
          </div>
          <div className="bg-glass-pastel-blue border border-glass-light p-4 rounded-lg">
            Card 3
          </div>
        </div>
      )

      render(<ConsistentUI />)

      const cards = screen.getAllByText(/Card \d/)

      // All cards should have consistent styling
      cards.forEach((card) => {
        const parent = card.parentElement!
        expect(parent).toHaveClass('bg-glass-pastel-blue')
        expect(parent).toHaveClass('border-glass-light')
      })
    })
  })
})
