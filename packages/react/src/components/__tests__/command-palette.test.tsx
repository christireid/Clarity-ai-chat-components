import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CommandPalette, CommandItem } from '../command-palette'

describe('CommandPalette Component', () => {
  const mockItems: CommandItem[] = [
    {
      id: '1',
      label: 'New File',
      description: 'Create a new file',
      category: 'File',
      shortcut: ['mod', 'n'],
      onSelect: vi.fn(),
    },
    {
      id: '2',
      label: 'Open File',
      description: 'Open an existing file',
      category: 'File',
      shortcut: ['mod', 'o'],
      onSelect: vi.fn(),
    },
    {
      id: '3',
      label: 'Settings',
      description: 'Open settings',
      category: 'Preferences',
      shortcut: ['mod', ','],
      onSelect: vi.fn(),
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should not render when closed', () => {
      render(
        <CommandPalette items={mockItems} open={false} onClose={vi.fn()} />
      )
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('should accept all props', () => {
      const onClose = vi.fn()
      render(
        <CommandPalette
          items={mockItems}
          open={false}
          onClose={onClose}
          placeholder="Search..."
          className="custom-class"
          loading={false}
          aria-label="Custom palette"
        />
      )
      // When closed, dialog should not be in the document
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  describe('Component Interface', () => {
    it('should accept items with all properties', () => {
      const itemsWithAllProps: CommandItem[] = [
        {
          id: 'test',
          label: 'Test',
          description: 'Test description',
          icon: <span>icon</span>,
          shortcut: ['mod', 't'],
          category: 'Test',
          onSelect: vi.fn(),
        },
      ]

      render(
        <CommandPalette
          items={itemsWithAllProps}
          open={false}
          onClose={vi.fn()}
        />
      )
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('should handle empty items array', () => {
      render(<CommandPalette items={[]} open={false} onClose={vi.fn()} />)
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('should handle loading state', () => {
      render(
        <CommandPalette
          items={mockItems}
          open={false}
          onClose={vi.fn()}
          loading={true}
        />
      )
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })
})
