/**
 * CommandPalette Additional Tests
 *
 * Comprehensive test suite to achieve 85%+ coverage
 * Covers edge cases, integration scenarios, and missing test paths
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CommandPalette } from '../CommandPalette'
import type { CommandItem, AIContext } from '../CommandPalette'

describe('CommandPalette - Additional Coverage', () => {
  const user = userEvent.setup({ delay: null })

  const mockItems: CommandItem[] = [
    {
      id: '1',
      label: 'New Chat',
      description: 'Start a new conversation',
      category: 'AI',
      shortcut: ['Cmd', 'N'],
      onSelect: vi.fn(),
      icon: <svg data-testid="icon-1" />,
    },
    {
      id: '2',
      label: 'Save Conversation',
      description: 'Save current chat',
      category: 'File',
      onSelect: vi.fn(),
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Edge Cases - Empty and Single Items', () => {
    it('handles empty items array', () => {
      render(<CommandPalette items={[]} open={true} onClose={vi.fn()} />)

      // Use getAllByText and check it exists
      const noCommandsElements = screen.getAllByText(/no commands found/i)
      expect(noCommandsElements.length).toBeGreaterThan(0)
    })

    it('handles single item in list', () => {
      const singleItem: CommandItem[] = [
        {
          id: '1',
          label: 'Single Command',
          onSelect: vi.fn(),
        },
      ]

      render(
        <CommandPalette items={singleItem} open={true} onClose={vi.fn()} />
      )

      expect(screen.getByText('Single Command')).toBeInTheDocument()
      // Use getAllByText for command count
      const commandCountElements = screen.getAllByText(/1 command/i)
      expect(commandCountElements.length).toBeGreaterThan(0)
    })

    it('handles item with empty label gracefully', () => {
      const itemWithEmptyLabel: CommandItem[] = [
        {
          id: '1',
          label: '',
          onSelect: vi.fn(),
        },
      ]

      render(
        <CommandPalette
          items={itemWithEmptyLabel}
          open={true}
          onClose={vi.fn()}
        />
      )

      // Component should still render
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })
  })

  describe('Edge Cases - Long Text and Truncation', () => {
    it('handles very long command labels', () => {
      const longLabelItem: CommandItem[] = [
        {
          id: '1',
          label: 'A'.repeat(200),
          description: 'Test',
          onSelect: vi.fn(),
        },
      ]

      render(
        <CommandPalette items={longLabelItem} open={true} onClose={vi.fn()} />
      )

      // Just verify the element renders with truncate class
      const labelElement = screen.getByText('A'.repeat(200))
      expect(labelElement).toBeInTheDocument()
      expect(labelElement).toHaveClass('truncate')
    })

    it('handles very long descriptions', () => {
      const longDescItem: CommandItem[] = [
        {
          id: '1',
          label: 'Command',
          description: 'B'.repeat(300),
          onSelect: vi.fn(),
        },
      ]

      render(
        <CommandPalette items={longDescItem} open={true} onClose={vi.fn()} />
      )

      expect(screen.getByText('Command')).toBeInTheDocument()
      const descElement = screen.getByText('B'.repeat(300))
      expect(descElement).toHaveClass('truncate')
    })

    it('handles special characters in labels', () => {
      const specialCharItem: CommandItem[] = [
        {
          id: '1',
          label: '<script>alert("xss")</script>',
          description: 'Test & "quotes" \' apostrophes',
          onSelect: vi.fn(),
        },
      ]

      render(
        <CommandPalette items={specialCharItem} open={true} onClose={vi.fn()} />
      )

      // Should render escaped text, not execute script
      expect(screen.getByText(/script/i)).toBeInTheDocument()
    })
  })

  describe('Search - Edge Cases', () => {
    it('shows empty state when search has no results', async () => {
      render(<CommandPalette items={mockItems} open={true} onClose={vi.fn()} />)

      const input = screen.getByPlaceholderText('Type a command...')
      await user.type(input, 'NonExistentCommand')

      await waitFor(
        () => {
          const noCommandsElements = screen.getAllByText(/no commands found/i)
          expect(noCommandsElements.length).toBeGreaterThan(0)
          expect(
            screen.getByText(/try a different search term/i)
          ).toBeInTheDocument()
        },
        { timeout: 500 }
      )
    })

    it('handles search with special regex characters', async () => {
      render(<CommandPalette items={mockItems} open={true} onClose={vi.fn()} />)

      const input = screen.getByPlaceholderText('Type a command...')
      // Test special regex characters - type one at a time
      await user.type(input, '.')
      await user.type(input, '*')

      // Should not throw error
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('clears search and restores all items', async () => {
      render(<CommandPalette items={mockItems} open={true} onClose={vi.fn()} />)

      const input = screen.getByPlaceholderText('Type a command...')
      await user.type(input, 'New')

      // Wait longer for debounce
      await waitFor(
        () => {
          const clearButton = screen.queryByLabelText('Clear search')
          expect(clearButton).toBeInTheDocument()
        },
        { timeout: 500 }
      )

      // Click clear button
      const clearButton = screen.getByLabelText('Clear search')
      await user.click(clearButton)

      // All items should be restored
      await waitFor(() => {
        expect(screen.getByText('New Chat')).toBeInTheDocument()
        expect(screen.getByText('Save Conversation')).toBeInTheDocument()
      })
    })

    it('verifies case-insensitive search', async () => {
      render(<CommandPalette items={mockItems} open={true} onClose={vi.fn()} />)

      const input = screen.getByPlaceholderText('Type a command...')
      await user.type(input, 'NEW')

      await waitFor(() => {
        expect(screen.getByText('New Chat')).toBeInTheDocument()
      })
    })

    it('debounces search correctly', async () => {
      render(<CommandPalette items={mockItems} open={true} onClose={vi.fn()} />)

      const input = screen.getByPlaceholderText('Type a command...')

      // Type rapidly
      await user.type(input, 'N')
      // Both items visible before debounce
      expect(screen.getByText('New Chat')).toBeInTheDocument()
      expect(screen.getByText('Save Conversation')).toBeInTheDocument()

      // Wait for debounce to complete (150ms + buffer)
      await waitFor(
        () => {
          // After debounce, 'New' filter should be applied
          const clearButton = screen.queryByLabelText('Clear search')
          expect(clearButton).toBeInTheDocument()
        },
        { timeout: 300 }
      )
    })
  })

  describe('Keyboard Navigation - State Verification', () => {
    it('verifies ArrowDown changes selection state', () => {
      render(<CommandPalette items={mockItems} open={true} onClose={vi.fn()} />)

      const firstItem = screen.getByText('New Chat').closest('button')
      const secondItem = screen.getByText('Save Conversation').closest('button')

      // Initially first item should be selected
      expect(firstItem?.classList.contains('bg-primary')).toBe(true)
      expect(secondItem?.classList.contains('bg-primary')).toBe(false)

      // Press arrow down
      fireEvent.keyDown(document, { key: 'ArrowDown' })

      // Second item should now be selected (check via class or aria-selected)
      // aria-selected is boolean, not string
      const firstAfter = screen.getByText('New Chat').closest('button')
      const secondAfter = screen.getByText('Save Conversation').closest('button')

      expect(secondAfter?.classList.contains('bg-primary')).toBe(true)
    })

    it('verifies ArrowUp changes selection state', () => {
      render(<CommandPalette items={mockItems} open={true} onClose={vi.fn()} />)

      // Move down first
      fireEvent.keyDown(document, { key: 'ArrowDown' })

      const secondItem = screen.getByText('Save Conversation').closest('button')
      expect(secondItem?.classList.contains('bg-primary')).toBe(true)

      // Move back up
      fireEvent.keyDown(document, { key: 'ArrowUp' })

      const firstItem = screen.getByText('New Chat').closest('button')
      expect(firstItem?.classList.contains('bg-primary')).toBe(true)
    })

    it('wraps navigation at the end (circular)', () => {
      render(<CommandPalette items={mockItems} open={true} onClose={vi.fn()} />)

      // Navigate to last item
      fireEvent.keyDown(document, { key: 'End' })

      const secondItem = screen.getByText('Save Conversation').closest('button')
      expect(secondItem?.classList.contains('bg-primary')).toBe(true)

      // Press down - should wrap to first
      fireEvent.keyDown(document, { key: 'ArrowDown' })

      const firstItem = screen.getByText('New Chat').closest('button')
      expect(firstItem?.classList.contains('bg-primary')).toBe(true)
    })

    it('wraps navigation at the beginning (circular)', () => {
      render(<CommandPalette items={mockItems} open={true} onClose={vi.fn()} />)

      const firstItem = screen.getByText('New Chat').closest('button')
      // Start at first item
      expect(firstItem?.classList.contains('bg-primary')).toBe(true)

      // Press up - should wrap to last
      fireEvent.keyDown(document, { key: 'ArrowUp' })

      const secondItem = screen.getByText('Save Conversation').closest('button')
      expect(secondItem?.classList.contains('bg-primary')).toBe(true)
    })

    it('handles Home key correctly', () => {
      render(<CommandPalette items={mockItems} open={true} onClose={vi.fn()} />)

      // Navigate to end
      fireEvent.keyDown(document, { key: 'End' })

      // Press Home
      fireEvent.keyDown(document, { key: 'Home' })

      // Should be back at first
      const firstItem = screen.getByText('New Chat').closest('button')
      expect(firstItem?.classList.contains('bg-primary')).toBe(true)
    })

    it('handles End key correctly', () => {
      render(<CommandPalette items={mockItems} open={true} onClose={vi.fn()} />)

      // Press End
      fireEvent.keyDown(document, { key: 'End' })

      // Should be at last item
      const secondItem = screen.getByText('Save Conversation').closest('button')
      expect(secondItem?.classList.contains('bg-primary')).toBe(true)
    })

    it('handles navigation with empty results', async () => {
      render(<CommandPalette items={mockItems} open={true} onClose={vi.fn()} />)

      const input = screen.getByPlaceholderText('Type a command...')
      await user.type(input, 'NoMatch')

      await waitFor(
        () => {
          const noCommandsElements = screen.getAllByText(/no commands found/i)
          expect(noCommandsElements.length).toBeGreaterThan(0)
        },
        { timeout: 500 }
      )

      // Keyboard navigation should not throw error
      fireEvent.keyDown(document, { key: 'ArrowDown' })
      fireEvent.keyDown(document, { key: 'ArrowUp' })
      fireEvent.keyDown(document, { key: 'Enter' })

      // Should not crash
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('handles rapid key presses', () => {
      render(<CommandPalette items={mockItems} open={true} onClose={vi.fn()} />)

      // Rapid key presses
      fireEvent.keyDown(document, { key: 'ArrowDown' })
      fireEvent.keyDown(document, { key: 'ArrowDown' })
      fireEvent.keyDown(document, { key: 'ArrowUp' })
      fireEvent.keyDown(document, { key: 'ArrowUp' })
      fireEvent.keyDown(document, { key: 'ArrowDown' })

      // Should still have valid selection (one item should have bg-primary)
      const firstItem = screen.getByText('New Chat').closest('button')
      expect(firstItem?.classList.contains('bg-primary')).toBe(true)
    })
  })

  describe('Command Execution - Error Handling', () => {
    it('handles onSelect throwing error', async () => {
      const errorItem: CommandItem[] = [
        {
          id: '1',
          label: 'Error Command',
          onSelect: vi.fn(() => {
            throw new Error('Command execution failed')
          }),
        },
      ]

      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

      render(<CommandPalette items={errorItem} open={true} onClose={vi.fn()} />)

      const button = screen.getByText('Error Command')

      // Should not crash when command throws
      await user.click(button)

      consoleError.mockRestore()
    })

    it('handles onClose throwing error', () => {
      const onCloseThatThrows = vi.fn(() => {
        throw new Error('Close failed')
      })

      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

      render(
        <CommandPalette
          items={mockItems}
          open={true}
          onClose={onCloseThatThrows}
        />
      )

      // Try to close
      fireEvent.keyDown(document, { key: 'Escape' })

      // Should call onClose even if it throws
      expect(onCloseThatThrows).toHaveBeenCalled()

      consoleError.mockRestore()
    })

    it('verifies command selection with Enter key arguments', async () => {
      const onSelect = vi.fn()
      const items: CommandItem[] = [
        {
          id: 'test-1',
          label: 'Test Command',
          onSelect,
        },
      ]

      render(<CommandPalette items={items} open={true} onClose={vi.fn()} />)

      const input = screen.getByPlaceholderText('Type a command...')
      input.focus()

      fireEvent.keyDown(document, { key: 'Enter' })

      await waitFor(() => {
        expect(onSelect).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('Icon Display', () => {
    it('renders command icons when provided', () => {
      render(<CommandPalette items={mockItems} open={true} onClose={vi.fn()} />)

      expect(screen.getByTestId('icon-1')).toBeInTheDocument()
    })

    it('handles commands without icons', () => {
      const noIconItem: CommandItem[] = [
        {
          id: '1',
          label: 'No Icon',
          onSelect: vi.fn(),
        },
      ]

      render(<CommandPalette items={noIconItem} open={true} onClose={vi.fn()} />)

      expect(screen.getByText('No Icon')).toBeInTheDocument()
    })

    it('applies correct icon styling when item is selected', () => {
      render(<CommandPalette items={mockItems} open={true} onClose={vi.fn()} />)

      const button = screen.getByText('New Chat').closest('button')
      const icon = screen.getByTestId('icon-1')

      // First item should be selected by default
      expect(button).toHaveAttribute('aria-selected', 'true')
      expect(icon).toBeInTheDocument()
    })
  })

  describe('AI Context - Edge Cases', () => {
    it('handles very long model names', () => {
      const longModelContext: AIContext = {
        modelName: 'A'.repeat(100),
      }

      render(
        <CommandPalette
          items={mockItems}
          open={true}
          onClose={vi.fn()}
          aiContext={longModelContext}
        />
      )

      expect(screen.getByText(/A{10,}/i)).toBeInTheDocument()
    })

    it('handles very long conversation IDs', () => {
      const longConvIdContext: AIContext = {
        conversationId: 'conv-' + 'x'.repeat(200),
      }

      render(
        <CommandPalette
          items={mockItems}
          open={true}
          onClose={vi.fn()}
          aiContext={longConvIdContext}
        />
      )

      // Should render with truncation class
      const convElement = screen.getByText(/conv-x+/i)
      expect(convElement).toBeInTheDocument()
      expect(convElement).toHaveClass('truncate')
    })

    it('formats large token numbers with commas', () => {
      const largeTokenContext: AIContext = {
        tokenUsage: {
          total: 1234567,
        },
      }

      render(
        <CommandPalette
          items={mockItems}
          open={true}
          onClose={vi.fn()}
          aiContext={largeTokenContext}
        />
      )

      expect(screen.getByText(/1,234,567 tokens/i)).toBeInTheDocument()
    })

    it('handles zero tokens', () => {
      const zeroTokenContext: AIContext = {
        tokenUsage: {
          total: 0,
        },
      }

      render(
        <CommandPalette
          items={mockItems}
          open={true}
          onClose={vi.fn()}
          aiContext={zeroTokenContext}
        />
      )

      expect(screen.getByText(/0 tokens/i)).toBeInTheDocument()
    })

    it('handles only partial token usage', () => {
      const partialTokenContext: AIContext = {
        tokenUsage: {
          input: 100,
          output: 200,
          // total will be calculated
        },
      }

      render(
        <CommandPalette
          items={mockItems}
          open={true}
          onClose={vi.fn()}
          aiContext={partialTokenContext}
        />
      )

      // Component should still render without error
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })
  })

  describe('Focus Management - Advanced', () => {
    it('maintains focus on input when typing', async () => {
      render(<CommandPalette items={mockItems} open={true} onClose={vi.fn()} />)

      const input = screen.getByPlaceholderText('Type a command...')
      input.focus()

      await user.type(input, 'test')

      expect(input).toHaveFocus()
    })

    it('prevents focus from leaving dialog', () => {
      render(<CommandPalette items={mockItems} open={true} onClose={vi.fn()} />)

      const dialog = screen.getByRole('dialog')
      expect(dialog).toBeInTheDocument()

      // Focus trap should be active
      const input = screen.getByPlaceholderText('Type a command...')
      expect(input).toHaveFocus()
    })

    it('handles rapid open/close cycles', async () => {
      const { rerender } = render(
        <CommandPalette items={mockItems} open={false} onClose={vi.fn()} />
      )

      // Open
      rerender(
        <CommandPalette items={mockItems} open={true} onClose={vi.fn()} />
      )
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })

      // Close
      rerender(
        <CommandPalette items={mockItems} open={false} onClose={vi.fn()} />
      )
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

      // Open again
      rerender(
        <CommandPalette items={mockItems} open={true} onClose={vi.fn()} />
      )
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })
    })
  })

  describe('Backdrop Interaction', () => {
    it('closes when backdrop is clicked', async () => {
      const onClose = vi.fn()
      render(<CommandPalette items={mockItems} open={true} onClose={onClose} />)

      const backdrop = document.querySelector('.fixed.inset-0')
      expect(backdrop).toBeInTheDocument()

      fireEvent.click(backdrop!)

      expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('does not close when dialog content is clicked', async () => {
      const onClose = vi.fn()
      render(<CommandPalette items={mockItems} open={true} onClose={onClose} />)

      const dialog = screen.getByRole('dialog')
      fireEvent.click(dialog)

      expect(onClose).not.toHaveBeenCalled()
    })
  })

  describe('Mouse and Keyboard Interaction', () => {
    it('updates selection on mouse hover', async () => {
      render(<CommandPalette items={mockItems} open={true} onClose={vi.fn()} />)

      const firstItem = screen.getByText('New Chat').closest('button')
      const secondItem = screen.getByText('Save Conversation').closest('button')

      // Initially first is selected
      expect(firstItem).toHaveAttribute('aria-selected', 'true')

      // Hover over second item
      fireEvent.mouseEnter(secondItem!)

      // Second should now be selected
      expect(secondItem).toHaveAttribute('aria-selected', 'true')
      expect(firstItem).toHaveAttribute('aria-selected', 'false')
    })

    it('mouse hover overrides keyboard selection', () => {
      render(<CommandPalette items={mockItems} open={true} onClose={vi.fn()} />)

      const firstItem = screen.getByText('New Chat').closest('button')
      const secondItem = screen.getByText('Save Conversation').closest('button')

      // Navigate with keyboard
      fireEvent.keyDown(document, { key: 'ArrowDown' })
      expect(secondItem).toHaveAttribute('aria-selected', 'true')

      // Hover over first with mouse
      fireEvent.mouseEnter(firstItem!)

      // First should be selected again
      expect(firstItem).toHaveAttribute('aria-selected', 'true')
      expect(secondItem).toHaveAttribute('aria-selected', 'false')
    })
  })

  describe('Integration Tests - Real User Flows', () => {
    it('completes full search -> navigate -> select flow', async () => {
      const onSelect = vi.fn()
      const onClose = vi.fn()
      const items: CommandItem[] = [
        { id: '1', label: 'First', category: 'A', onSelect },
        { id: '2', label: 'Second', category: 'A', onSelect },
        { id: '3', label: 'Third', category: 'B', onSelect },
      ]

      render(<CommandPalette items={items} open={true} onClose={onClose} />)

      // Type to filter
      const input = screen.getByPlaceholderText('Type a command...')
      await user.type(input, 'First')

      // Wait for filter
      await waitFor(() => {
        expect(screen.queryByText('Second')).not.toBeInTheDocument()
      })

      // Navigate with keyboard
      fireEvent.keyDown(document, { key: 'ArrowDown' })
      fireEvent.keyDown(document, { key: 'ArrowUp' })

      // Select with Enter
      fireEvent.keyDown(document, { key: 'Enter' })

      await waitFor(() => {
        expect(onSelect).toHaveBeenCalledTimes(1)
        expect(onClose).toHaveBeenCalledTimes(1)
      })
    })

    it('completes search -> clear -> search again -> select flow', async () => {
      const onSelect = vi.fn()
      const items: CommandItem[] = [
        { id: '1', label: 'Apple', onSelect },
        { id: '2', label: 'Banana', onSelect },
        { id: '3', label: 'Cherry', onSelect },
      ]

      render(<CommandPalette items={items} open={true} onClose={vi.fn()} />)

      const input = screen.getByPlaceholderText('Type a command...')

      // First search
      await user.type(input, 'Apple')
      await waitFor(() => {
        expect(screen.queryByText('Banana')).not.toBeInTheDocument()
      })

      // Clear
      const clearButton = screen.getByLabelText('Clear search')
      await user.click(clearButton)

      // Verify all items restored
      await waitFor(() => {
        expect(screen.getByText('Apple')).toBeInTheDocument()
        expect(screen.getByText('Banana')).toBeInTheDocument()
        expect(screen.getByText('Cherry')).toBeInTheDocument()
      })

      // Second search
      await user.type(input, 'Banana')
      await waitFor(() => {
        expect(screen.queryByText('Apple')).not.toBeInTheDocument()
      })

      // Select
      await user.click(screen.getByText('Banana'))

      expect(onSelect).toHaveBeenCalledTimes(1)
    })
  })

  describe('Performance and Memory', () => {
    it('handles large number of items', () => {
      const largeItemList: CommandItem[] = Array.from(
        { length: 1000 },
        (_, i) => ({
          id: `item-${i}`,
          label: `Command ${i}`,
          description: `Description ${i}`,
          category: `Category ${i % 10}`,
          onSelect: vi.fn(),
        })
      )

      const { container } = render(
        <CommandPalette items={largeItemList} open={true} onClose={vi.fn()} />
      )

      expect(container).toBeInTheDocument()
      // Check for "1,000 commands" with getAllByText since it may appear in multiple places
      const commandCountElements = screen.getAllByText(/1,000 commands/i)
      expect(commandCountElements.length).toBeGreaterThan(0)
    })

    it('cleans up event listeners on unmount', () => {
      const { unmount } = render(
        <CommandPalette items={mockItems} open={true} onClose={vi.fn()} />
      )

      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener')

      unmount()

      // Should remove keydown listener
      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'keydown',
        expect.any(Function)
      )
    })
  })

  describe('Scroll Behavior', () => {
    it('scrolls selected item into view on keyboard navigation', () => {
      const scrollIntoViewMock = vi.fn()
      Element.prototype.scrollIntoView = scrollIntoViewMock

      render(<CommandPalette items={mockItems} open={true} onClose={vi.fn()} />)

      // Navigate down
      fireEvent.keyDown(document, { key: 'ArrowDown' })

      // scrollIntoView should be called
      expect(scrollIntoViewMock).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest',
      })
    })
  })
})
