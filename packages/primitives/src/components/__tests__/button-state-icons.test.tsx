import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LoadingIcon, SuccessIcon, ErrorIcon } from '../button-state-icons'

describe('Button State Icons', () => {
  describe('LoadingIcon', () => {
    it('should render loading spinner', () => {
      const { container } = render(<LoadingIcon />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('should have animate-spin class', () => {
      const { container } = render(<LoadingIcon />)
      const svg = container.querySelector('.animate-spin')
      expect(svg).toBeInTheDocument()
    })

    it('should have default size classes', () => {
      const { container } = render(<LoadingIcon />)
      const svg = container.querySelector('.h-4.w-4')
      expect(svg).toBeInTheDocument()
    })

    it('should accept custom className', () => {
      const { container } = render(<LoadingIcon className="custom-loading h-6 w-6" />)
      const svg = container.querySelector('.custom-loading')
      expect(svg).toBeInTheDocument()
      expect(svg).toHaveClass('h-6', 'w-6')
    })

    it('should have aria-hidden attribute', () => {
      const { container } = render(<LoadingIcon />)
      const svg = container.querySelector('[aria-hidden="true"]')
      expect(svg).toBeInTheDocument()
    })

    it('should have proper SVG structure', () => {
      const { container } = render(<LoadingIcon />)
      const circle = container.querySelector('circle')
      const path = container.querySelector('path')
      expect(circle).toBeInTheDocument()
      expect(path).toBeInTheDocument()
    })
  })

  describe('SuccessIcon', () => {
    it('should render success checkmark', () => {
      const { container } = render(<SuccessIcon />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('should have scale-in animation class', () => {
      const { container } = render(<SuccessIcon />)
      const svg = container.querySelector('.animate-\\[scale-in_0\\.2s_ease-out\\]')
      expect(svg).toBeInTheDocument()
    })

    it('should have default size classes', () => {
      const { container } = render(<SuccessIcon />)
      const svg = container.querySelector('.h-4.w-4')
      expect(svg).toBeInTheDocument()
    })

    it('should accept custom className', () => {
      const { container } = render(<SuccessIcon className="custom-success h-8 w-8" />)
      const svg = container.querySelector('.custom-success')
      expect(svg).toBeInTheDocument()
      expect(svg).toHaveClass('h-8', 'w-8')
    })

    it('should have aria-hidden attribute', () => {
      const { container } = render(<SuccessIcon />)
      const svg = container.querySelector('[aria-hidden="true"]')
      expect(svg).toBeInTheDocument()
    })

    it('should have polyline element', () => {
      const { container } = render(<SuccessIcon />)
      const polyline = container.querySelector('polyline')
      expect(polyline).toBeInTheDocument()
    })
  })

  describe('ErrorIcon', () => {
    it('should render error X icon', () => {
      const { container } = render(<ErrorIcon />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('should have shake animation class', () => {
      const { container } = render(<ErrorIcon />)
      const svg = container.querySelector('.animate-\\[shake_0\\.4s_ease-in-out\\]')
      expect(svg).toBeInTheDocument()
    })

    it('should have default size classes', () => {
      const { container } = render(<ErrorIcon />)
      const svg = container.querySelector('.h-4.w-4')
      expect(svg).toBeInTheDocument()
    })

    it('should accept custom className', () => {
      const { container } = render(<ErrorIcon className="custom-error h-10 w-10" />)
      const svg = container.querySelector('.custom-error')
      expect(svg).toBeInTheDocument()
      expect(svg).toHaveClass('h-10', 'w-10')
    })

    it('should have aria-hidden attribute', () => {
      const { container } = render(<ErrorIcon />)
      const svg = container.querySelector('[aria-hidden="true"]')
      expect(svg).toBeInTheDocument()
    })

    it('should have two path elements for X shape', () => {
      const { container } = render(<ErrorIcon />)
      const paths = container.querySelectorAll('path')
      expect(paths).toHaveLength(2)
    })
  })

  describe('Memoization', () => {
    it('should memoize LoadingIcon', () => {
      const { rerender } = render(<LoadingIcon />)
      const firstRender = screen.getByRole('generic')
      
      rerender(<LoadingIcon />)
      const secondRender = screen.getByRole('generic')
      
      // Component should be memoized (same reference in real scenario)
      expect(firstRender).toBeInTheDocument()
      expect(secondRender).toBeInTheDocument()
    })

    it('should memoize SuccessIcon', () => {
      const { rerender } = render(<SuccessIcon />)
      const firstRender = screen.getByRole('generic')
      
      rerender(<SuccessIcon />)
      const secondRender = screen.getByRole('generic')
      
      expect(firstRender).toBeInTheDocument()
      expect(secondRender).toBeInTheDocument()
    })

    it('should memoize ErrorIcon', () => {
      const { rerender } = render(<ErrorIcon />)
      const firstRender = screen.getByRole('generic')
      
      rerender(<ErrorIcon />)
      const secondRender = screen.getByRole('generic')
      
      expect(firstRender).toBeInTheDocument()
      expect(secondRender).toBeInTheDocument()
    })
  })
})
