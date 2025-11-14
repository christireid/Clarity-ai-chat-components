import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Avatar } from '../avatar'

describe('Avatar Component', () => {
  describe('Rendering', () => {
    it('should render avatar with image', () => {
      render(<Avatar src="/avatar.jpg" alt="User" />)
      const img = screen.getByAltText('User')
      expect(img).toBeInTheDocument()
      expect(img).toHaveAttribute('src', '/avatar.jpg')
    })

    it('should render fallback text when no image', () => {
      render(<Avatar fallback="JD" />)
      expect(screen.getByText('JD')).toBeInTheDocument()
    })

    it('should generate fallback from alt text', () => {
      render(<Avatar alt="John Doe" />)
      expect(screen.getByText('JD')).toBeInTheDocument()
    })

    it('should use default fallback when no alt or fallback', () => {
      render(<Avatar />)
      expect(screen.getByText('?')).toBeInTheDocument()
    })

    it('should render with default size', () => {
      const { container } = render(<Avatar fallback="AB" />)
      const avatar = container.querySelector('.h-10')
      expect(avatar).toBeInTheDocument()
    })

    it('should render with xs size', () => {
      const { container } = render(<Avatar size="xs" fallback="AB" />)
      const avatar = container.querySelector('.h-6')
      expect(avatar).toBeInTheDocument()
    })

    it('should render with sm size', () => {
      const { container } = render(<Avatar size="sm" fallback="AB" />)
      const avatar = container.querySelector('.h-8')
      expect(avatar).toBeInTheDocument()
    })

    it('should render with lg size', () => {
      const { container } = render(<Avatar size="lg" fallback="AB" />)
      const avatar = container.querySelector('.h-12')
      expect(avatar).toBeInTheDocument()
    })

    it('should render with xl size', () => {
      const { container } = render(<Avatar size="xl" fallback="AB" />)
      const avatar = container.querySelector('.h-16')
      expect(avatar).toBeInTheDocument()
    })

    it('should render with 2xl size', () => {
      const { container } = render(<Avatar size="2xl" fallback="AB" />)
      const avatar = container.querySelector('.h-20')
      expect(avatar).toBeInTheDocument()
    })
  })

  describe('Image Handling', () => {
    it('should handle image load error', () => {
      const { rerender } = render(<Avatar src="/invalid.jpg" alt="User" fallback="JD" />)
      
      const img = screen.getByAltText('User')
      const errorEvent = new Event('error')
      img.dispatchEvent(errorEvent)
      
      // After error, should show fallback
      rerender(<Avatar src="/invalid.jpg" alt="User" fallback="JD" />)
      expect(screen.getByText('JD')).toBeInTheDocument()
    })

    it('should show fallback when image fails to load', async () => {
      render(<Avatar src="/broken.jpg" alt="User" fallback="FB" />)
      const img = screen.getByAltText('User')
      
      // Simulate image error by dispatching error event
      const errorEvent = new Event('error')
      img.dispatchEvent(errorEvent)
      
      // Wait for state update
      await new Promise(resolve => setTimeout(resolve, 0))
      
      // Fallback should be shown after error
      expect(screen.getByText('FB')).toBeInTheDocument()
    })
  })

  describe('Status Indicator', () => {
    it('should render online status', () => {
      const { container } = render(<Avatar status="online" fallback="AB" />)
      const status = container.querySelector('.bg-green-500')
      expect(status).toBeInTheDocument()
    })

    it('should render offline status', () => {
      const { container } = render(<Avatar status="offline" fallback="AB" />)
      const status = container.querySelector('.bg-gray-400')
      expect(status).toBeInTheDocument()
    })

    it('should render away status', () => {
      const { container } = render(<Avatar status="away" fallback="AB" />)
      const status = container.querySelector('.bg-amber-500')
      expect(status).toBeInTheDocument()
    })

    it('should render busy status', () => {
      const { container } = render(<Avatar status="busy" fallback="AB" />)
      const status = container.querySelector('.bg-red-500')
      expect(status).toBeInTheDocument()
    })

    it('should not render status when not provided', () => {
      const { container } = render(<Avatar fallback="AB" />)
      const status = container.querySelector('.bg-green-500')
      expect(status).not.toBeInTheDocument()
    })

    it('should render custom status badge', () => {
      render(<Avatar statusBadge={<span data-testid="custom-badge">Custom</span>} fallback="AB" />)
      expect(screen.getByTestId('custom-badge')).toBeInTheDocument()
    })
  })

  describe('Hover Effects', () => {
    it('should apply hoverable class when hoverable is true', () => {
      const { container } = render(<Avatar hoverable fallback="AB" />)
      const avatar = container.querySelector('.hover\\:scale-\\[1\\.02\\]')
      expect(avatar).toBeInTheDocument()
    })

    it('should not apply hoverable class by default', () => {
      const { container } = render(<Avatar fallback="AB" />)
      const avatar = container.querySelector('.hover\\:scale-105')
      expect(avatar).not.toBeInTheDocument()
    })
  })

  describe('Styling', () => {
    it('should apply default styles', () => {
      const { container } = render(<Avatar fallback="AB" />)
      const avatar = container.querySelector('.rounded-full')
      expect(avatar).toBeInTheDocument()
    })

    it('should accept custom className', () => {
      const { container } = render(<Avatar className="custom-avatar" fallback="AB" />)
      const avatar = container.querySelector('.custom-avatar')
      expect(avatar).toBeInTheDocument()
    })

    it('should have proper ring styling', () => {
      const { container } = render(<Avatar fallback="AB" />)
      const avatar = container.querySelector('.ring-2')
      expect(avatar).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper alt text for images', () => {
      render(<Avatar src="/avatar.jpg" alt="User avatar" />)
      expect(screen.getByAltText('User avatar')).toBeInTheDocument()
    })

    it('should support aria-label', () => {
      render(<Avatar aria-label="User profile picture" fallback="AB" />)
      expect(screen.getByLabelText('User profile picture')).toBeInTheDocument()
    })

    it('should be focusable when interactive', () => {
      const { container } = render(<Avatar tabIndex={0} fallback="AB" />)
      const avatar = container.querySelector('[tabindex="0"]')
      expect(avatar).toBeInTheDocument()
    })
  })

  describe('Fallback Generation', () => {
    it('should generate initials from single word', () => {
      render(<Avatar alt="John" />)
      expect(screen.getByText('J')).toBeInTheDocument()
    })

    it('should generate initials from multiple words', () => {
      render(<Avatar alt="John Doe" />)
      expect(screen.getByText('JD')).toBeInTheDocument()
    })

    it('should handle three words', () => {
      render(<Avatar alt="John Michael Doe" />)
      // Takes first letter of first two words: J + M = JM
      expect(screen.getByText('JM')).toBeInTheDocument()
    })

    it('should handle empty alt text', () => {
      render(<Avatar alt="" />)
      expect(screen.getByText('?')).toBeInTheDocument()
    })

    it('should prioritize fallback prop over alt', () => {
      render(<Avatar alt="John Doe" fallback="Custom" />)
      expect(screen.getByText('Custom')).toBeInTheDocument()
      expect(screen.queryByText('JD')).not.toBeInTheDocument()
    })
  })
})
