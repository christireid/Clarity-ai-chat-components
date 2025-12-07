import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '../dropdown-menu'

describe('DropdownMenu Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render dropdown menu when open', () => {
      render(
        <DropdownMenu open>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
      expect(screen.getByText('Item 1')).toBeInTheDocument()
    })

    it('should not render dropdown menu when closed', () => {
      render(
        <DropdownMenu open={false}>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
      expect(screen.queryByText('Item 1')).not.toBeInTheDocument()
    })

    it('should render trigger', () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Trigger</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
      expect(screen.getByText('Trigger')).toBeInTheDocument()
    })

    it('should render all menu items', () => {
      render(
        <DropdownMenu open>
          <DropdownMenuContent>
            <DropdownMenuLabel>Label</DropdownMenuLabel>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Item 2</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
      expect(screen.getByText('Label')).toBeInTheDocument()
      expect(screen.getByText('Item 1')).toBeInTheDocument()
      expect(screen.getByText('Item 2')).toBeInTheDocument()
    })
  })

  describe('Interactions', () => {
    it('should open dropdown when trigger is clicked', async () => {
      const user = userEvent.setup()
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )

      const trigger = screen.getByText('Open')
      await user.click(trigger)

      expect(screen.getByText('Item')).toBeInTheDocument()
    })

    it('should call onClick when menu item is clicked', async () => {
      const user = userEvent.setup()
      const mockOnClick = vi.fn()
      render(
        <DropdownMenu open>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={mockOnClick}>Click me</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )

      const item = screen.getByText('Click me')
      await user.click(item)

      expect(mockOnClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('Controlled vs Uncontrolled', () => {
    it('should work as controlled component', () => {
      const mockOnOpenChange = vi.fn()
      render(
        <DropdownMenu open={true} onOpenChange={mockOnOpenChange}>
          <DropdownMenuTrigger>Trigger</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
      expect(screen.getByText('Item')).toBeInTheDocument()
    })

    it('should work as uncontrolled component', () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Trigger</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
      expect(screen.getByText('Item')).toBeInTheDocument()
    })
  })

  describe('Disabled State', () => {
    it('should disable trigger when disabled', () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger disabled>Disabled</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
      const trigger = screen.getByText('Disabled')
      expect(trigger).toBeDisabled()
    })

    it('should disable menu item when disabled', () => {
      render(
        <DropdownMenu open>
          <DropdownMenuContent>
            <DropdownMenuItem disabled>Disabled Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
      // Radix UI uses data-disabled attribute instead of disabled attribute
      const item = screen.getByRole('menuitem', { name: 'Disabled Item' })
      expect(item).toHaveAttribute('data-disabled')
    })
  })

  describe('Error Handling', () => {
    it('should throw error when DropdownMenuTrigger used outside DropdownMenu context', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      expect(() => {
        render(<DropdownMenuTrigger>Trigger</DropdownMenuTrigger>)
      }).toThrow()

      consoleSpy.mockRestore()
    })
  })

  describe('Accessibility', () => {
    it('should have proper menu role', () => {
      render(
        <DropdownMenu open>
          <DropdownMenuContent>
            <DropdownMenuItem>Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
      expect(screen.getByRole('menu')).toBeInTheDocument()
    })

    it('should have proper menuitem role', () => {
      render(
        <DropdownMenu open>
          <DropdownMenuContent>
            <DropdownMenuItem>Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
      expect(screen.getByRole('menuitem')).toBeInTheDocument()
    })
  })
})
