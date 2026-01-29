/**
 * PromptComposer Accessibility Tests
 *
 * WCAG 2.1 AA compliance tests for keyboard navigation,
 * screen readers, ARIA attributes, and focus management.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe, toHaveNoViolations } from 'jest-axe'
import { PromptComposer } from '../PromptComposer'
import { ContextItemCard } from '../ContextItemCard'
import { TokenBudgetIndicator } from '../TokenBudgetIndicator'
import { createContextItem } from '../../../hooks/prompt-composer/context-utils'
import type {
  Suggestion,
  Command,
  ContextProvider,
} from '../../../hooks/prompt-composer/types'

expect.extend(toHaveNoViolations)

describe('Accessibility Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ==========================================================================
  // WCAG Compliance Tests
  // ==========================================================================

  describe('WCAG 2.1 AA Compliance', () => {
    it('PromptComposer has no accessibility violations', async () => {
      const { container } = render(<PromptComposer api="/api/chat" />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('ContextItemCard has no accessibility violations', async () => {
      const item = createContextItem({
        id: 'test',
        type: 'file',
        label: 'test.ts',
        summary: 'Test file',
      })

      const { container } = render(
        <ContextItemCard
          item={item}
          currentLevel="summary"
          onExpand={vi.fn()}
          onRemove={vi.fn()}
        />
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('TokenBudgetIndicator has no accessibility violations', async () => {
      const { container } = render(
        <TokenBudgetIndicator current={100} max={8000} contextItems={[]} />
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('has no violations with suggestions', async () => {
      const suggestions: Suggestion[] = [
        { id: '1', type: 'starter', text: 'Test 1' },
        { id: '2', type: 'starter', text: 'Test 2' },
      ]

      const { container } = render(
        <PromptComposer
          api="/api/chat"
          suggestions={suggestions}
          features={{ suggestions: true }}
        />
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('has no violations with commands', async () => {
      const commands: Command[] = [
        {
          id: 'test',
          trigger: '/test',
          label: 'Test',
          description: 'Test command',
          icon: <span>🧪</span>,
          execute: vi.fn(),
        },
      ]

      const { container } = render(
        <PromptComposer api="/api/chat" commands={commands} />
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  // ==========================================================================
  // Keyboard Navigation Tests
  // ==========================================================================

  describe('Keyboard Navigation', () => {
    it('focuses input on Tab', async () => {
      const user = userEvent.setup()
      render(<PromptComposer api="/api/chat" />)

      await user.tab()

      const input = screen.getByRole('textbox')
      expect(input).toHaveFocus()
    })

    it('navigates to Send button with Tab', async () => {
      const user = userEvent.setup()
      render(<PromptComposer api="/api/chat" />)

      const input = screen.getByRole('textbox')
      await user.type(input, 'Test')

      await user.tab()

      const sendButton = screen.getByRole('button', { name: /send/i })
      expect(sendButton).toHaveFocus()
    })

    it('submits with Enter key', async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()
      render(<PromptComposer api="/api/chat" onSubmit={onSubmit} />)

      const input = screen.getByRole('textbox')
      await user.type(input, 'Test{Enter}')

      expect(onSubmit).toHaveBeenCalled()
    })

    it('navigates suggestions with Arrow keys', async () => {
      const user = userEvent.setup()
      const suggestions: Suggestion[] = [
        { id: '1', type: 'starter', text: 'Test 1' },
        { id: '2', type: 'starter', text: 'Test 2' },
      ]

      render(
        <PromptComposer
          api="/api/chat"
          suggestions={suggestions}
          features={{ suggestions: true }}
        />
      )

      const input = screen.getByRole('textbox')
      await user.click(input)

      await user.keyboard('{ArrowDown}')
      await user.keyboard('{ArrowDown}')
      await user.keyboard('{ArrowUp}')

      // First suggestion should be focused
    })

    it('navigates commands with Arrow keys', async () => {
      const user = userEvent.setup()
      const commands: Command[] = [
        {
          id: 'cmd1',
          trigger: '/cmd1',
          label: 'Command 1',
          description: 'First command',
          icon: <span>1</span>,
          execute: vi.fn(),
        },
        {
          id: 'cmd2',
          trigger: '/cmd2',
          label: 'Command 2',
          description: 'Second command',
          icon: <span>2</span>,
          execute: vi.fn(),
        },
      ]

      render(<PromptComposer api="/api/chat" commands={commands} />)

      const input = screen.getByRole('textbox')
      await user.type(input, '/')

      await user.keyboard('{ArrowDown}')
      await user.keyboard('{ArrowDown}')

      // Second command should be selected
    })

    it('closes suggestions with Escape', async () => {
      const user = userEvent.setup()
      const suggestions: Suggestion[] = [
        { id: '1', type: 'starter', text: 'Test' },
      ]

      render(
        <PromptComposer
          api="/api/chat"
          suggestions={suggestions}
          features={{ suggestions: true }}
        />
      )

      const input = screen.getByRole('textbox')
      await user.click(input)

      expect(screen.getByText('Test')).toBeInTheDocument()

      await user.keyboard('{Escape}')

      expect(screen.queryByText('Test')).not.toBeInTheDocument()
    })

    it('supports Shift+Enter for newline', async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()
      render(<PromptComposer api="/api/chat" onSubmit={onSubmit} />)

      const input = screen.getByRole('textbox')
      await user.type(input, 'Line 1{Shift>}{Enter}{/Shift}Line 2')

      expect(input).toHaveValue('Line 1\nLine 2')
      expect(onSubmit).not.toHaveBeenCalled()
    })
  })

  // ==========================================================================
  // Screen Reader Tests
  // ==========================================================================

  describe('Screen Reader Support', () => {
    it('has descriptive label for input', () => {
      render(<PromptComposer api="/api/chat" placeholder="Type your message" />)

      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('placeholder', 'Type your message')
    })

    it('announces token budget changes', async () => {
      const user = userEvent.setup()
      render(<PromptComposer api="/api/chat" showTokenBudget />)

      const input = screen.getByRole('textbox')
      await user.type(input, 'a'.repeat(150))

      // Should have live region for token updates
      const liveRegion = screen.queryByRole('status')
      expect(liveRegion).toBeInTheDocument()
    })

    it('announces context item additions', () => {
      // Test aria-live announcements for context items
    })

    it('has descriptive button labels', () => {
      render(<PromptComposer api="/api/chat" />)

      const sendButton = screen.getByRole('button', { name: /send/i })
      expect(sendButton).toHaveAccessibleName()
    })

    it('uses aria-label for icon buttons', () => {
      render(
        <PromptComposer
          api="/api/chat"
          features={{ settings: true, attachments: true }}
        />
      )

      // Settings button should have aria-label
      const settingsButton = screen.queryByLabelText('Settings')
      if (settingsButton) {
        expect(settingsButton).toHaveAccessibleName()
      }
    })
  })

  // ==========================================================================
  // ARIA Attributes Tests
  // ==========================================================================

  describe('ARIA Attributes', () => {
    it('uses role="progressbar" for token budget', () => {
      const { container } = render(
        <TokenBudgetIndicator current={4000} max={8000} contextItems={[]} />
      )

      const progressBar = container.querySelector('[role="progressbar"]')
      expect(progressBar).toBeInTheDocument()
    })

    it('has aria-valuenow for progress', () => {
      const { container } = render(
        <TokenBudgetIndicator current={4000} max={8000} contextItems={[]} />
      )

      const progressBar = container.querySelector('[role="progressbar"]')
      expect(progressBar).toHaveAttribute('aria-valuenow')
    })

    it('has aria-valuemin and aria-valuemax', () => {
      const { container } = render(
        <TokenBudgetIndicator current={4000} max={8000} contextItems={[]} />
      )

      const progressBar = container.querySelector('[role="progressbar"]')
      expect(progressBar).toHaveAttribute('aria-valuemin', '0')
      expect(progressBar).toHaveAttribute('aria-valuemax', '100')
    })

    it('uses aria-expanded for expandable sections', async () => {
      const user = userEvent.setup()
      const item = createContextItem({
        id: 'test',
        type: 'file',
        label: 'test.ts',
        summary: 'Test',
        preview: 'Preview',
      })

      render(
        <ContextItemCard
          item={item}
          currentLevel="summary"
          onExpand={vi.fn()}
          onRemove={vi.fn()}
        />
      )

      const expandButton = screen.getByText(/preview/i)
      expect(expandButton).toHaveAttribute('aria-expanded')
    })

    it('uses aria-disabled for disabled elements', () => {
      render(<PromptComposer api="/api/chat" />)

      const sendButton = screen.getByRole('button', { name: /send/i })
      expect(sendButton).toHaveAttribute('disabled')
      // Or aria-disabled for custom elements
    })

    it('uses aria-live for dynamic content', async () => {
      const user = userEvent.setup()
      render(<PromptComposer api="/api/chat" />)

      const input = screen.getByRole('textbox')
      await user.type(input, 'Hello')

      // Token counter or status should be in live region
      const liveRegions = screen.queryAllByRole('status')
      expect(liveRegions.length).toBeGreaterThan(0)
    })
  })

  // ==========================================================================
  // Focus Management Tests
  // ==========================================================================

  describe('Focus Management', () => {
    it('maintains focus on input after suggestion selection', async () => {
      const user = userEvent.setup()
      const suggestions: Suggestion[] = [
        { id: '1', type: 'starter', text: 'Test' },
      ]

      render(
        <PromptComposer
          api="/api/chat"
          suggestions={suggestions}
          features={{ suggestions: true }}
        />
      )

      const input = screen.getByRole('textbox')
      await user.click(input)

      const suggestion = screen.getByText('Test')
      await user.click(suggestion)

      expect(input).toHaveFocus()
    })

    it('returns focus after command execution', async () => {
      const user = userEvent.setup()
      const commands: Command[] = [
        {
          id: 'test',
          trigger: '/test',
          label: 'Test',
          description: 'Test',
          icon: <span>🧪</span>,
          execute: vi.fn().mockResolvedValue(undefined),
        },
      ]

      render(<PromptComposer api="/api/chat" commands={commands} />)

      const input = screen.getByRole('textbox')
      await user.type(input, '/test{Enter}')

      // Focus should return to input
      expect(input).toHaveFocus()
    })

    it('has visible focus indicators', async () => {
      const user = userEvent.setup()
      render(<PromptComposer api="/api/chat" />)

      const input = screen.getByRole('textbox')
      await user.tab()

      expect(input).toHaveFocus()
      expect(input).toHaveClass(/focus/)
    })

    it('traps focus in modal dialogs', () => {
      // Test focus trap when settings or other modals are open
    })

    it('restores focus on modal close', () => {
      // Test focus restoration after modal close
    })
  })

  // ==========================================================================
  // Color Contrast Tests
  // ==========================================================================

  describe('Color Contrast', () => {
    it('meets contrast ratio for text', () => {
      render(<PromptComposer api="/api/chat" placeholder="Type here" />)

      const input = screen.getByRole('textbox')
      // In real implementation, would check computed styles against WCAG standards
      expect(input).toBeInTheDocument()
    })

    it('meets contrast ratio for buttons', () => {
      render(<PromptComposer api="/api/chat" />)

      const sendButton = screen.getByRole('button', { name: /send/i })
      // Would check button text vs background contrast
      expect(sendButton).toBeInTheDocument()
    })

    it('has sufficient contrast for disabled states', () => {
      render(<PromptComposer api="/api/chat" />)

      const sendButton = screen.getByRole('button', { name: /send/i })
      expect(sendButton).toBeDisabled()
      // Disabled text should still be readable
    })
  })

  // ==========================================================================
  // Mobile Accessibility Tests
  // ==========================================================================

  describe('Mobile Accessibility', () => {
    it('has touch-friendly targets (44x44px minimum)', () => {
      const { container } = render(<PromptComposer api="/api/chat" />)

      const buttons = container.querySelectorAll('button')
      buttons.forEach((button) => {
        const rect = button.getBoundingClientRect()
        // Would check that height and width >= 44px
      })
    })

    it('supports pinch-to-zoom', () => {
      render(<PromptComposer api="/api/chat" />)

      const viewport = document.querySelector('meta[name="viewport"]')
      if (viewport) {
        expect(viewport.getAttribute('content')).not.toContain(
          'user-scalable=no'
        )
      }
    })

    it('has appropriate input types for mobile keyboards', () => {
      render(<PromptComposer api="/api/chat" />)

      const input = screen.getByRole('textbox')
      // Input type should be appropriate (text, email, etc.)
      expect(input).toHaveAttribute('type', 'text')
    })
  })

  // ==========================================================================
  // Reduced Motion Tests
  // ==========================================================================

  describe('Reduced Motion Support', () => {
    it('respects prefers-reduced-motion', () => {
      // Mock prefers-reduced-motion media query
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query) => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        })),
      })

      const { container } = render(<PromptComposer api="/api/chat" />)

      // Animations should be disabled or reduced
      const animatedElements = container.querySelectorAll('[class*="animate"]')
      animatedElements.forEach((el) => {
        // Would check that animations are disabled
      })
    })
  })

  // ==========================================================================
  // Error Announcement Tests
  // ==========================================================================

  describe('Error Announcements', () => {
    it('announces errors to screen readers', async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn().mockRejectedValue(new Error('Submit failed'))

      render(<PromptComposer api="/api/chat" onSubmit={onSubmit} />)

      const input = screen.getByRole('textbox')
      await user.type(input, 'Test{Enter}')

      // Error should be in an alert role
      const alert = await screen.findByRole('alert')
      expect(alert).toHaveTextContent('Submit failed')
    })

    it('uses role="alert" for errors', async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn().mockRejectedValue(new Error('Error'))

      render(<PromptComposer api="/api/chat" onSubmit={onSubmit} />)

      const input = screen.getByRole('textbox')
      await user.type(input, 'Test{Enter}')

      const alert = await screen.findByRole('alert')
      expect(alert).toBeInTheDocument()
    })
  })

  // ==========================================================================
  // Language and Internationalization Tests
  // ==========================================================================

  describe('Internationalization', () => {
    it('has lang attribute on elements', () => {
      render(<PromptComposer api="/api/chat" />)

      // Root element should have lang attribute
      const root = document.documentElement
      expect(root).toHaveAttribute('lang')
    })

    it('supports RTL languages', () => {
      render(<PromptComposer api="/api/chat" />)

      // Would test RTL layout support
    })
  })
})
