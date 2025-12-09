/**
 * SearchPalette Component Tests
 *
 * @vitest-environment happy-dom
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Mock next/navigation
const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    prefetch: vi.fn(),
  }),
}))

// Mock hook metadata
vi.mock('@/lib/hook-metadata', () => ({
  hookMetadata: [
    {
      name: 'useClarityChat',
      description: 'Main chat hook for AI conversations',
      href: '/reference/hooks/use-clarity-chat',
      category: 'chat',
      useCases: ['Build chat interfaces', 'Manage conversations'],
    },
    {
      name: 'useThreadManager',
      description: 'Manage multiple chat threads',
      href: '/reference/hooks/use-thread-manager',
      category: 'chat',
      useCases: ['Multi-thread support'],
    },
    {
      name: 'useTokenTracker',
      description: 'Track token usage in real-time',
      href: '/reference/hooks/use-token-tracker',
      category: 'utility',
      useCases: ['Monitor API usage'],
    },
  ],
  categoryConfig: {
    chat: {
      label: 'Chat',
      colorClass: 'text-amber-600',
    },
    utility: {
      label: 'Utility',
      colorClass: 'text-gray-600',
    },
  },
}))

// Import after mocks
import { SearchPalette } from './SearchPalette'

describe('SearchPalette', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders search trigger button', () => {
      render(<SearchPalette />)
      expect(screen.getByLabelText('Search documentation')).toBeInTheDocument()
    })

    it('shows keyboard shortcut hint', () => {
      render(<SearchPalette />)
      expect(screen.getByText('K')).toBeInTheDocument()
    })

    it('does not show modal initially', () => {
      render(<SearchPalette />)
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  describe('Opening Modal', () => {
    it('opens modal when trigger button is clicked', async () => {
      const user = userEvent.setup()
      render(<SearchPalette />)

      await user.click(screen.getByLabelText('Search documentation'))

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })
    })

    it('opens modal with Cmd+K', async () => {
      render(<SearchPalette />)

      fireEvent.keyDown(document, { key: 'k', metaKey: true })

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })
    })

    it('opens modal with Ctrl+K', async () => {
      render(<SearchPalette />)

      fireEvent.keyDown(document, { key: 'k', ctrlKey: true })

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })
    })

    it('opens modal with / key', async () => {
      render(<SearchPalette />)

      fireEvent.keyDown(document, { key: '/' })

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })
    })

    it('focuses search input when opened', async () => {
      const user = userEvent.setup()
      render(<SearchPalette />)

      await user.click(screen.getByLabelText('Search documentation'))

      await waitFor(() => {
        expect(
          screen.getByPlaceholderText('Search hooks, guides, and more...')
        ).toHaveFocus()
      })
    })
  })

  describe('Closing Modal', () => {
    it('closes modal with Escape key', async () => {
      const user = userEvent.setup()
      render(<SearchPalette />)

      await user.click(screen.getByLabelText('Search documentation'))
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })

      await user.keyboard('{Escape}')

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })
    })

    it('closes modal when clicking backdrop', async () => {
      const user = userEvent.setup()
      render(<SearchPalette />)

      await user.click(screen.getByLabelText('Search documentation'))
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })

      // Click the backdrop
      const backdrop = document.querySelector('.bg-black\\/50')
      if (backdrop) {
        await user.click(backdrop)
      }

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })
    })

    it('clears query when closed', async () => {
      const user = userEvent.setup()
      render(<SearchPalette />)

      // Open and type
      await user.click(screen.getByLabelText('Search documentation'))
      await user.type(screen.getByPlaceholderText('Search hooks, guides, and more...'), 'chat')

      // Close
      await user.keyboard('{Escape}')

      // Reopen
      await user.click(screen.getByLabelText('Search documentation'))

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Search hooks, guides, and more...')).toHaveValue('')
      })
    })
  })

  describe('Search Functionality', () => {
    it('shows quick access items when no query', async () => {
      const user = userEvent.setup()
      render(<SearchPalette />)

      await user.click(screen.getByLabelText('Search documentation'))

      await waitFor(() => {
        expect(screen.getByText('Quick Access')).toBeInTheDocument()
      })
    })

    it('filters results based on query', async () => {
      const user = userEvent.setup()
      render(<SearchPalette />)

      await user.click(screen.getByLabelText('Search documentation'))
      await user.type(screen.getByPlaceholderText('Search hooks, guides, and more...'), 'token')

      await waitFor(() => {
        expect(screen.getByText('useTokenTracker')).toBeInTheDocument()
        expect(screen.queryByText('useClarityChat')).not.toBeInTheDocument()
      })
    })

    it('shows no results message when no matches', async () => {
      const user = userEvent.setup()
      render(<SearchPalette />)

      await user.click(screen.getByLabelText('Search documentation'))
      await user.type(
        screen.getByPlaceholderText('Search hooks, guides, and more...'),
        'xyznonexistent'
      )

      await waitFor(() => {
        expect(screen.getByText('No results found')).toBeInTheDocument()
      })
    })

    it('highlights matching text in results', async () => {
      const user = userEvent.setup()
      render(<SearchPalette />)

      await user.click(screen.getByLabelText('Search documentation'))
      await user.type(screen.getByPlaceholderText('Search hooks, guides, and more...'), 'chat')

      await waitFor(() => {
        const mark = document.querySelector('mark')
        expect(mark).toBeInTheDocument()
      })
    })
  })

  describe('Keyboard Navigation', () => {
    it('navigates down with Arrow Down', async () => {
      const user = userEvent.setup()
      render(<SearchPalette />)

      await user.click(screen.getByLabelText('Search documentation'))
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })

      // First item should be selected by default
      await user.keyboard('{ArrowDown}')

      // Check that second item is now selected
      const buttons = screen.getAllByRole('button')
      const resultButtons = buttons.filter((btn) =>
        btn.classList.contains('w-full')
      )

      // Second result button should have selected styling
      expect(resultButtons[1]?.className).toContain('bg-brand-100')
    })

    it('navigates up with Arrow Up', async () => {
      const user = userEvent.setup()
      render(<SearchPalette />)

      await user.click(screen.getByLabelText('Search documentation'))

      // Move down twice then up once
      await user.keyboard('{ArrowDown}')
      await user.keyboard('{ArrowDown}')
      await user.keyboard('{ArrowUp}')

      // Should be on second item
      const buttons = screen.getAllByRole('button')
      const resultButtons = buttons.filter((btn) =>
        btn.classList.contains('w-full')
      )

      expect(resultButtons[1]?.className).toContain('bg-brand-100')
    })

    it('selects item with Enter', async () => {
      const user = userEvent.setup()
      render(<SearchPalette />)

      await user.click(screen.getByLabelText('Search documentation'))
      await user.type(screen.getByPlaceholderText('Search hooks, guides, and more...'), 'token')

      await waitFor(() => {
        expect(screen.getByText('useTokenTracker')).toBeInTheDocument()
      })

      await user.keyboard('{Enter}')

      expect(mockPush).toHaveBeenCalledWith('/reference/hooks/use-token-tracker')
    })
  })

  describe('Selection', () => {
    it('navigates to selected result on click', async () => {
      const user = userEvent.setup()
      render(<SearchPalette />)

      await user.click(screen.getByLabelText('Search documentation'))
      await user.type(screen.getByPlaceholderText('Search hooks, guides, and more...'), 'token')

      await waitFor(() => {
        expect(screen.getByText('useTokenTracker')).toBeInTheDocument()
      })

      await user.click(screen.getByText('useTokenTracker'))

      expect(mockPush).toHaveBeenCalledWith('/reference/hooks/use-token-tracker')
    })

    it('closes modal after selection', async () => {
      const user = userEvent.setup()
      render(<SearchPalette />)

      await user.click(screen.getByLabelText('Search documentation'))
      await user.type(screen.getByPlaceholderText('Search hooks, guides, and more...'), 'token')

      await waitFor(() => {
        expect(screen.getByText('useTokenTracker')).toBeInTheDocument()
      })

      await user.click(screen.getByText('useTokenTracker'))

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })
    })
  })

  describe('Accessibility', () => {
    it('has proper dialog role', async () => {
      const user = userEvent.setup()
      render(<SearchPalette />)

      await user.click(screen.getByLabelText('Search documentation'))

      await waitFor(() => {
        const dialog = screen.getByRole('dialog')
        expect(dialog).toHaveAttribute('aria-modal', 'true')
        expect(dialog).toHaveAttribute('aria-label', 'Search documentation')
      })
    })

    it('has proper input attributes', async () => {
      const user = userEvent.setup()
      render(<SearchPalette />)

      await user.click(screen.getByLabelText('Search documentation'))

      const input = screen.getByPlaceholderText('Search hooks, guides, and more...')
      expect(input).toHaveAttribute('autocomplete', 'off')
      expect(input).toHaveAttribute('spellcheck', 'false')
    })

    it('shows keyboard navigation hints', async () => {
      const user = userEvent.setup()
      render(<SearchPalette />)

      await user.click(screen.getByLabelText('Search documentation'))

      await waitFor(() => {
        expect(screen.getByText('Navigate')).toBeInTheDocument()
        expect(screen.getByText('Select')).toBeInTheDocument()
        expect(screen.getByText('Close')).toBeInTheDocument()
      })
    })
  })
})
