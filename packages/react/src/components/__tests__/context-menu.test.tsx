import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ContextMenu, ContextMenuItem } from '../context-menu'

describe('ContextMenu Component', () => {
  const mockItems: ContextMenuItem[] = [
    {
      id: 'copy',
      label: 'Copy',
      shortcut: 'mod+c',
      onSelect: vi.fn(),
    },
    {
      id: 'paste',
      label: 'Paste',
      shortcut: 'mod+v',
      onSelect: vi.fn(),
    },
    {
      id: 'delete',
      label: 'Delete',
      danger: true,
      onSelect: vi.fn(),
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render children', () => {
      render(
        <ContextMenu items={mockItems}>
          <div data-testid="trigger">Right-click me</div>
        </ContextMenu>
      )
      expect(screen.getByTestId('trigger')).toBeInTheDocument()
    })

    it('should not show menu initially', () => {
      render(
        <ContextMenu items={mockItems}>
          <div>Content</div>
        </ContextMenu>
      )
      expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    })

    it('should accept aria-label prop', () => {
      render(
        <ContextMenu items={mockItems} aria-label="Custom context menu">
          <div>Content</div>
        </ContextMenu>
      )
      // Component renders but menu is not visible until context menu event
      expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    })
  })

  describe('Component Interface', () => {
    it('should accept items with all properties', () => {
      const itemsWithAllProps: ContextMenuItem[] = [
        {
          id: 'test',
          label: 'Test',
          icon: <span>icon</span>,
          shortcut: 'mod+t',
          danger: false,
          disabled: false,
          separator: false,
          submenu: [],
          onSelect: vi.fn(),
        },
      ]

      render(
        <ContextMenu items={itemsWithAllProps}>
          <div data-testid="trigger">Content</div>
        </ContextMenu>
      )
      expect(screen.getByTestId('trigger')).toBeInTheDocument()
    })

    it('should accept className prop', () => {
      render(
        <ContextMenu items={mockItems} className="custom-class">
          <div data-testid="trigger">Content</div>
        </ContextMenu>
      )
      expect(screen.getByTestId('trigger')).toBeInTheDocument()
    })

    it('should handle separator items', () => {
      const itemsWithSeparator: ContextMenuItem[] = [
        { id: '1', label: 'Item 1', onSelect: vi.fn() },
        { id: 'sep', label: '', separator: true },
        { id: '2', label: 'Item 2', onSelect: vi.fn() },
      ]

      render(
        <ContextMenu items={itemsWithSeparator}>
          <div data-testid="trigger">Content</div>
        </ContextMenu>
      )
      expect(screen.getByTestId('trigger')).toBeInTheDocument()
    })

    it('should handle submenu items', () => {
      const itemsWithSubmenu: ContextMenuItem[] = [
        {
          id: 'parent',
          label: 'Parent',
          submenu: [
            { id: 'child1', label: 'Child 1', onSelect: vi.fn() },
            { id: 'child2', label: 'Child 2', onSelect: vi.fn() },
          ],
        },
      ]

      render(
        <ContextMenu items={itemsWithSubmenu}>
          <div data-testid="trigger">Content</div>
        </ContextMenu>
      )
      expect(screen.getByTestId('trigger')).toBeInTheDocument()
    })
  })
})
