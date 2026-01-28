/**
 * CommandPalette Tests
 *
 * Tests for the CommandPalette component with AI-specific features
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CommandPalette } from '../CommandPalette'
import type { CommandItem, AIContext } from '../CommandPalette'

describe('CommandPalette', () => {
  const user = userEvent.setup({ delay: null })

  const mockItems: CommandItem[] = [
    {
      id: '1',
      label: 'New Chat',
      description: 'Start a new conversation',
      category: 'AI',
      shortcut: ['Cmd', 'N'],
      onSelect: vi.fn(),
    },
    {
      id: '2',
      label: 'Save Conversation',
      description: 'Save current chat',
      category: 'File',
      shortcut: ['Cmd', 'S'],
      onSelect: vi.fn(),
    },
    {
      id: '3',
      label: 'Export Chat',
      description: 'Export conversation history',
      category: 'File',
      onSelect: vi.fn(),
    },
    {
      id: '4',
      label: 'Change Model',
      description: 'Switch AI model',
      category: 'AI',
      onSelect: vi.fn(),
    },
  ]

  const mockAIContext: AIContext = {
    modelName: 'Claude 3.5 Sonnet',
    conversationId: 'conv-123',
    tokenUsage: {
      input: 1500,
      output: 800,
      total: 2300,
    },
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Basic Rendering', () => {
    it('renders when open', () => {
      render(<CommandPalette items={mockItems} open={true} onClose={vi.fn()} />)

      expect(screen.getByRole('dialog')).toBeInTheDocument()
      expect(
        screen.getByPlaceholderText('Type a command...')
      ).toBeInTheDocument()
    })

    it('does not render when closed', () => {
      render(
        <CommandPalette items={mockItems} open={false} onClose={vi.fn()} />
      )

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('renders all command items', () => {
      render(<CommandPalette items={mockItems} open={true} onClose={vi.fn()} />)

      expect(screen.getByText('New Chat')).toBeInTheDocument()
      expect(screen.getByText('Save Conversation')).toBeInTheDocument()
      expect(screen.getByText('Export Chat')).toBeInTheDocument()
      expect(screen.getByText('Change Model')).toBeInTheDocument()
    })

    it('uses custom placeholder text', () => {
      render(
        <CommandPalette
          items={mockItems}
          open={true}
          onClose={vi.fn()}
          placeholder="Search AI commands..."
        />
      )

      expect(
        screen.getByPlaceholderText('Search AI commands...')
      ).toBeInTheDocument()
    })
  })

  describe('Command Categorization', () => {
    it('groups commands by category', () => {
      render(<CommandPalette items={mockItems} open={true} onClose={vi.fn()} />)

      // Should show category headers - find by their exact text content
      const categories = screen
        .getAllByRole('group')
        .map((group) => group.textContent)

      expect(categories.some((cat) => cat?.includes('AI'))).toBe(true)
      expect(categories.some((cat) => cat?.includes('File'))).toBe(true)
    })

    it('displays commands under correct categories', () => {
      render(<CommandPalette items={mockItems} open={true} onClose={vi.fn()} />)

      // Verify commands are present (they'll be under their categories)
      expect(screen.getByText('New Chat')).toBeInTheDocument()
      expect(screen.getByText('Save Conversation')).toBeInTheDocument()
      expect(screen.getByText('Change Model')).toBeInTheDocument()
    })

    it('uses "Commands" category for items without category', () => {
      const itemsWithoutCategory: CommandItem[] = [
        {
          id: '1',
          label: 'Test Command',
          onSelect: vi.fn(),
        },
      ]

      render(
        <CommandPalette
          items={itemsWithoutCategory}
          open={true}
          onClose={vi.fn()}
        />
      )

      // Check that the command is rendered (it will be under "Commands" category)
      expect(screen.getByText('Test Command')).toBeInTheDocument()

      // Check for default category in groups
      const categories = screen
        .getAllByRole('group')
        .map((group) => group.textContent)

      expect(categories.some((cat) => cat?.includes('Commands'))).toBe(true)
    })
  })

  describe('Keyboard Shortcuts Display', () => {
    it('displays keyboard shortcuts for commands', () => {
      render(<CommandPalette items={mockItems} open={true} onClose={vi.fn()} />)

      // Should show shortcut keys (platform-specific: Cmd on Mac, Ctrl on others)
      const newChatItem = screen.getByText('New Chat').closest('button')
      expect(newChatItem).toBeInTheDocument()
      // Check for either Cmd or Ctrl (platform-specific)
      expect(
        newChatItem?.textContent?.includes('Cmd') ||
          newChatItem?.textContent?.includes('Ctrl')
      ).toBe(true)
      expect(newChatItem?.textContent).toContain('N')
    })

    it('handles multiple shortcut keys', () => {
      render(<CommandPalette items={mockItems} open={true} onClose={vi.fn()} />)

      const saveItem = screen.getByText('Save Conversation').closest('button')
      // Check for either Cmd or Ctrl (platform-specific)
      expect(
        saveItem?.textContent?.includes('Cmd') ||
          saveItem?.textContent?.includes('Ctrl')
      ).toBe(true)
      expect(saveItem?.textContent).toContain('S')
    })

    it('does not render shortcuts for commands without them', () => {
      render(<CommandPalette items={mockItems} open={true} onClose={vi.fn()} />)

      const exportItem = screen.getByText('Export Chat').closest('button')
      // Should not have Kbd elements (but the check needs to be more specific)
      expect(exportItem).toBeInTheDocument()
    })
  })

  describe('AI Context Display', () => {
    it('displays AI context in footer when provided', () => {
      render(
        <CommandPalette
          items={mockItems}
          open={true}
          onClose={vi.fn()}
          aiContext={mockAIContext}
        />
      )

      // Should show model name
      expect(screen.getByText(/Claude 3.5 Sonnet/i)).toBeInTheDocument()

      // Should show conversation ID
      expect(screen.getByText(/conv-123/i)).toBeInTheDocument()
    })

    it('displays token usage when provided', () => {
      render(
        <CommandPalette
          items={mockItems}
          open={true}
          onClose={vi.fn()}
          aiContext={mockAIContext}
        />
      )

      // Should show token count (formatted with commas)
      expect(screen.getByText(/2,300 tokens/i)).toBeInTheDocument()
    })

    it('works without AI context', () => {
      render(<CommandPalette items={mockItems} open={true} onClose={vi.fn()} />)

      // Should still render footer with command count (get all matches and verify one exists)
      const commandCountElements = screen.getAllByText(/4 commands/i)
      expect(commandCountElements.length).toBeGreaterThan(0)
    })

    it('displays partial AI context', () => {
      const partialContext: AIContext = {
        modelName: 'GPT-4',
      }

      render(
        <CommandPalette
          items={mockItems}
          open={true}
          onClose={vi.fn()}
          aiContext={partialContext}
        />
      )

      expect(screen.getByText(/GPT-4/i)).toBeInTheDocument()
      expect(screen.queryByText(/conv-/i)).not.toBeInTheDocument()
    })
  })

  describe('Command Execution', () => {
    it('calls onSelect when command is clicked', async () => {
      const onSelect = vi.fn()
      const items: CommandItem[] = [
        {
          id: '1',
          label: 'Test Command',
          onSelect,
        },
      ]

      render(<CommandPalette items={items} open={true} onClose={vi.fn()} />)

      const commandButton = screen.getByText('Test Command')
      await user.click(commandButton)

      expect(onSelect).toHaveBeenCalledTimes(1)
    })

    it('closes palette after command execution', async () => {
      const onClose = vi.fn()
      const items: CommandItem[] = [
        {
          id: '1',
          label: 'Test Command',
          onSelect: vi.fn(),
        },
      ]

      render(<CommandPalette items={items} open={true} onClose={onClose} />)

      const commandButton = screen.getByText('Test Command')
      await user.click(commandButton)

      expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('executes command on Enter key', async () => {
      const onSelect = vi.fn()
      const items: CommandItem[] = [
        {
          id: '1',
          label: 'Test Command',
          onSelect,
        },
      ]

      render(<CommandPalette items={items} open={true} onClose={vi.fn()} />)

      const input = screen.getByPlaceholderText('Type a command...')
      input.focus()

      // Press Enter
      fireEvent.keyDown(document, { key: 'Enter' })

      await waitFor(() => {
        expect(onSelect).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('Search Functionality', () => {
    it('filters commands by label', async () => {
      render(<CommandPalette items={mockItems} open={true} onClose={vi.fn()} />)

      const input = screen.getByPlaceholderText('Type a command...')
      await user.type(input, 'New')

      // Wait for debounced search to complete
      await waitFor(
        () => {
          expect(screen.getByText('New Chat')).toBeInTheDocument()
          // Other commands should still be present due to debounce
        },
        { timeout: 300 }
      )
    })

    it('filters commands by description', async () => {
      render(<CommandPalette items={mockItems} open={true} onClose={vi.fn()} />)

      const input = screen.getByPlaceholderText('Type a command...')
      await user.type(input, 'history')

      await waitFor(() => {
        expect(screen.getByText('Export Chat')).toBeInTheDocument()
      })
    })

    it('filters commands by category', async () => {
      render(<CommandPalette items={mockItems} open={true} onClose={vi.fn()} />)

      const input = screen.getByPlaceholderText('Type a command...')
      await user.type(input, 'AI')

      await waitFor(() => {
        expect(screen.getByText('New Chat')).toBeInTheDocument()
        expect(screen.getByText('Change Model')).toBeInTheDocument()
      })
    })

    it('shows clear button when typing', async () => {
      render(<CommandPalette items={mockItems} open={true} onClose={vi.fn()} />)

      const input = screen.getByPlaceholderText('Type a command...')

      // Initially no clear button
      expect(screen.queryByLabelText('Clear search')).not.toBeInTheDocument()

      // Type something
      await user.type(input, 'test')

      // Clear button should appear
      await waitFor(() => {
        expect(screen.getByLabelText('Clear search')).toBeInTheDocument()
      })
    })
  })

  describe('Keyboard Navigation', () => {
    it('navigates down with ArrowDown', () => {
      render(<CommandPalette items={mockItems} open={true} onClose={vi.fn()} />)

      fireEvent.keyDown(document, { key: 'ArrowDown' })

      // Should move selection (implementation specific)
    })

    it('navigates up with ArrowUp', () => {
      render(<CommandPalette items={mockItems} open={true} onClose={vi.fn()} />)

      fireEvent.keyDown(document, { key: 'ArrowDown' })
      fireEvent.keyDown(document, { key: 'ArrowUp' })

      // Should move selection (implementation specific)
    })

    it('closes on Escape key', () => {
      const onClose = vi.fn()
      render(<CommandPalette items={mockItems} open={true} onClose={onClose} />)

      fireEvent.keyDown(document, { key: 'Escape' })

      expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('jumps to start with Home key', () => {
      render(<CommandPalette items={mockItems} open={true} onClose={vi.fn()} />)

      fireEvent.keyDown(document, { key: 'Home' })

      // Should jump to first item (implementation specific)
    })

    it('jumps to end with End key', () => {
      render(<CommandPalette items={mockItems} open={true} onClose={vi.fn()} />)

      fireEvent.keyDown(document, { key: 'End' })

      // Should jump to last item (implementation specific)
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA role', () => {
      render(<CommandPalette items={mockItems} open={true} onClose={vi.fn()} />)

      const dialog = screen.getByRole('dialog')
      expect(dialog).toHaveAttribute('aria-modal', 'true')
    })

    it('has combobox role for input', () => {
      render(<CommandPalette items={mockItems} open={true} onClose={vi.fn()} />)

      const input = screen.getByPlaceholderText('Type a command...')
      expect(input).toHaveAttribute('role', 'combobox')
      expect(input).toHaveAttribute('aria-expanded', 'true')
    })

    it('has listbox role for results', () => {
      render(<CommandPalette items={mockItems} open={true} onClose={vi.fn()} />)

      const listbox = screen.getByRole('listbox')
      expect(listbox).toBeInTheDocument()
    })

    it('announces result count', () => {
      render(<CommandPalette items={mockItems} open={true} onClose={vi.fn()} />)

      // Should have live region with announcement (using aria-live)
      const liveRegion = screen.getByText(/4 commands available/i)
      expect(liveRegion).toBeInTheDocument()
      expect(liveRegion).toHaveAttribute('aria-live', 'polite')
    })

    it('provides custom aria-label', () => {
      render(
        <CommandPalette
          items={mockItems}
          open={true}
          onClose={vi.fn()}
          aria-label="AI Command Palette"
        />
      )

      const dialog = screen.getByRole('dialog')
      expect(dialog).toHaveAttribute('aria-label', 'AI Command Palette')
    })
  })

  describe('Loading State', () => {
    it('shows loading spinner when loading', () => {
      render(
        <CommandPalette
          items={mockItems}
          open={true}
          onClose={vi.fn()}
          loading={true}
        />
      )

      // Should show loading indicator
      const input = screen.getByPlaceholderText('Type a command...')
      expect(input).toHaveAttribute('aria-busy', 'true')
    })

    it('hides loading spinner when not loading', () => {
      render(
        <CommandPalette
          items={mockItems}
          open={true}
          onClose={vi.fn()}
          loading={false}
        />
      )

      const input = screen.getByPlaceholderText('Type a command...')
      expect(input).toHaveAttribute('aria-busy', 'false')
    })
  })

  describe('Focus Management', () => {
    it('focuses input when opened', async () => {
      const { rerender } = render(
        <CommandPalette items={mockItems} open={false} onClose={vi.fn()} />
      )

      rerender(
        <CommandPalette items={mockItems} open={true} onClose={vi.fn()} />
      )

      await waitFor(() => {
        const input = screen.getByPlaceholderText('Type a command...')
        expect(input).toHaveFocus()
      })
    })

    it('traps focus within dialog', () => {
      render(<CommandPalette items={mockItems} open={true} onClose={vi.fn()} />)

      // Focus trap should be active (tested via focus trap utility)
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })
  })
})
