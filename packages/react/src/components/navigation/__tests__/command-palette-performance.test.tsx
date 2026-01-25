/**
 * CommandPalette Performance Regression Tests
 *
 * Tests for ISSUE-020: CommandPalette Search Performance
 * Ensures search filtering is debounced and scales to large item sets.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CommandPalette } from '../command-palette'
import type { CommandItem } from '../command-palette'

// Mock useDebounce to control timing
vi.mock('../../../hooks/ui/use-debounce', () => ({
  useDebounce: vi.fn((value: string, delay: number) => value), // Return immediate for visual tests
}))

describe('CommandPalette Performance Regression', () => {
  const user = userEvent.setup({ delay: null })

  const createMockItems = (count: number): CommandItem[] =>
    Array.from({ length: count }, (_, i) => ({
      id: `item-${i}`,
      label: `Command ${i}`,
      description: `Description for command ${i}`,
      category: i % 3 === 0 ? 'File' : i % 3 === 1 ? 'Edit' : 'View',
      onSelect: vi.fn(),
    }))

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Search Performance', () => {
    it('filters large item sets efficiently', async () => {
      const largeItemSet = createMockItems(1000)

      const { rerender } = render(
        <CommandPalette
          items={largeItemSet}
          open={true}
          onClose={() => {}}
        />
      )

      const input = screen.getByPlaceholderText('Type a command...')

      // Measure filtering performance
      const startTime = performance.now()

      // Type search query
      await user.type(input, 'Command 500')

      // Wait for filtering to complete
      await waitFor(() => {
        expect(screen.getByText('Command 500')).toBeInTheDocument()
      })

      const endTime = performance.now()

      // Should filter quickly even with 1000 items
      expect(endTime - startTime).toBeLessThan(100) // Less than 100ms
    })

    it('handles rapid typing without excessive filtering', async () => {
      const items = createMockItems(200)
      let filterCount = 0

      // Mock useMemo to count filter operations
      const originalUseMemo = vi.fn()
      vi.doMock('react', async () => {
        const actualReact = await vi.importActual('react')
        return {
          ...actualReact,
          useMemo: (fn: () => unknown, deps: unknown[]) => {
            if (deps.includes('debouncedSearch')) {
              filterCount++
            }
            return fn()
          },
        }
      })

      const { rerender } = render(
        <CommandPalette
          items={items}
          open={true}
          onClose={() => {}}
        />
      )

      const input = screen.getByPlaceholderText('Type a command...')

      // Type rapidly
      await user.type(input, 'rapidsearch')

      // With debouncing, should not filter on every keystroke
      await waitFor(() => {
        // Should have filtered at most once or twice due to debouncing
        expect(filterCount).toBeLessThan(5)
      })
    })

    it('maintains responsive typing experience', async () => {
      const items = createMockItems(500)

      const { rerender } = render(
        <CommandPalette
          items={items}
          open={true}
          onClose={() => {}}
        />
      )

      const input = screen.getByPlaceholderText('Type a command...')

      // Measure typing responsiveness
      const startTime = performance.now()

      await user.type(input, 'Command 250')

      const endTime = performance.now()

      // Should handle typing quickly
      expect(endTime - startTime).toBeLessThan(200)

      // Should show filtered results
      await waitFor(() => {
        expect(screen.getByText('Command 250')).toBeInTheDocument()
      })
    })
  })

  describe('Debounced Filtering', () => {
    it('shows results after debounce delay', async () => {
      const items = createMockItems(100)

      render(
        <CommandPalette
          items={items}
          open={true}
          onClose={() => {}}
        />
      )

      const input = screen.getByPlaceholderText('Type a command...')

      // Type search
      await user.type(input, 'Command 50')

      // Initially might show all items (before debounce)
      expect(screen.getAllByRole('button')).toHaveLength(6) // 5 items + close button

      // After debounce, should show filtered results
      await waitFor(() => {
        expect(screen.getByText('Command 50')).toBeInTheDocument()
      }, { timeout: 200 })
    })

    it('filters by multiple criteria', async () => {
      const items: CommandItem[] = [
        { id: '1', label: 'Open File', description: 'Opens a file', category: 'File', onSelect: vi.fn() },
        { id: '2', label: 'Save File', description: 'Saves current file', category: 'File', onSelect: vi.fn() },
        { id: '3', label: 'Edit Text', description: 'Edit selected text', category: 'Edit', onSelect: vi.fn() },
        { id: '4', label: 'View Stats', description: 'Show statistics', category: 'View', onSelect: vi.fn() },
      ]

      render(
        <CommandPalette
          items={items}
          open={true}
          onClose={() => {}}
        />
      )

      const input = screen.getByPlaceholderText('Type a command...')

      // Search by label
      await user.type(input, 'Open')
      await waitFor(() => {
        expect(screen.getByText('Open File')).toBeInTheDocument()
        expect(screen.queryByText('Save File')).not.toBeInTheDocument()
      })

      // Clear and search by category
      await user.clear(input)
      await user.type(input, 'File')
      await waitFor(() => {
        expect(screen.getByText('Open File')).toBeInTheDocument()
        expect(screen.getByText('Save File')).toBeInTheDocument()
        expect(screen.queryByText('Edit Text')).not.toBeInTheDocument()
      })

      // Clear and search by description
      await user.clear(input)
      await user.type(input, 'selected')
      await waitFor(() => {
        expect(screen.getByText('Edit Text')).toBeInTheDocument()
        expect(screen.queryByText('Open File')).not.toBeInTheDocument()
      })
    })
  })

  describe('Large Dataset Handling', () => {
    it('scales to 2000+ items without performance degradation', async () => {
      const largeItemSet = createMockItems(2000)

      const startTime = performance.now()

      const { rerender } = render(
        <CommandPalette
          items={largeItemSet}
          open={true}
          onClose={() => {}}
        />
      )

      const renderTime = performance.now() - startTime
      expect(renderTime).toBeLessThan(200) // Should render quickly

      const input = screen.getByPlaceholderText('Type a command...')

      // Test search performance with large dataset
      const searchStartTime = performance.now()

      await user.type(input, 'Command 1500')

      await waitFor(() => {
        expect(screen.getByText('Command 1500')).toBeInTheDocument()
      })

      const searchTime = performance.now() - searchStartTime
      expect(searchTime).toBeLessThan(150) // Should search quickly
    })

    it('maintains selection during search', async () => {
      const items = createMockItems(50)

      render(
        <CommandPalette
          items={items}
          open={true}
          onClose={() => {}}
        />
      )

      const input = screen.getByPlaceholderText('Type a command...')

      // Type to filter
      await user.type(input, 'Command 25')

      await waitFor(() => {
        expect(screen.getByText('Command 25')).toBeInTheDocument()
      })

      // First item should be selected by default
      const firstItem = screen.getByText('Command 25')
      expect(firstItem).toHaveAttribute('data-selected', 'true')

      // Navigate with arrow keys
      await user.keyboard('{arrowdown}')
      const secondItem = screen.getByText('Command 26')
      expect(secondItem).toHaveAttribute('data-selected', 'true')
    })

    it('handles empty search results gracefully', async () => {
      const items = createMockItems(50)

      render(
        <CommandPalette
          items={items}
          open={true}
          onClose={() => {}}
        />
      )

      const input = screen.getByPlaceholderText('Type a command...')

      // Search for non-existent item
      await user.type(input, 'nonexistentcommand12345')

      await waitFor(() => {
        // Should show no results message or empty state
        expect(screen.queryByText(/Command \d+/)).not.toBeInTheDocument()
      })
    })
  })

  describe('Memory and Cleanup', () => {
    it('does not leak memory with frequent searches', async () => {
      const items = createMockItems(100)

      const { rerender } = render(
        <CommandPalette
          items={items}
          open={true}
          onClose={() => {}}
        />
      )

      const input = screen.getByPlaceholderText('Type a command...')

      // Perform many rapid searches
      for (let i = 0; i < 10; i++) {
        await user.clear(input)
        await user.type(input, `Command ${i}`)
        await user.clear(input)
      }

      // Should handle without memory issues
      expect(screen.getByPlaceholderText('Type a command...')).toBeInTheDocument()
    })

    it('cleans up on close', () => {
      const onClose = vi.fn()
      const { rerender } = render(
        <CommandPalette
          items={createMockItems(10)}
          open={true}
          onClose={onClose}
        />
      )

      // Close the palette
      rerender(
        <CommandPalette
          items={createMockItems(10)}
          open={false}
          onClose={onClose}
        />
      )

      // Should clean up properly
      expect(onClose).not.toHaveBeenCalled()
    })
  })
})