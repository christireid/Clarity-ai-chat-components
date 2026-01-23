import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Skeleton, SkeletonText, SkeletonAvatar, SkeletonCard } from '../skeleton'

describe('Zero-Dependency Skeleton Components', () => {
  it('renders base Skeleton with shimmer animation', () => {
    const { container } = render(<Skeleton variant="shimmer" width={100} height={20} />)
    const skeleton = container.firstChild
    
    expect(skeleton).toHaveClass('skeleton-shimmer')
    expect(skeleton).toHaveStyle({ width: '100px', height: '20px' })
  })

  it('renders base Skeleton with pulse animation', () => {
    const { container } = render(<Skeleton variant="pulse" />)
    const skeleton = container.firstChild
    
    expect(skeleton).toHaveClass('skeleton-pulse')
  })

  it('renders SkeletonText with multiple lines', () => {
    render(<SkeletonText lines={3} variant="shimmer" />)
    
    const skeletons = screen.getAllByRole('status')
    expect(skeletons).toHaveLength(3)
  })

  it('renders SkeletonAvatar', () => {
    const { container } = render(<SkeletonAvatar size={40} variant="shimmer" />)
    const skeleton = container.firstChild
    
    expect(skeleton).toHaveStyle({ width: '40px', height: '40px' })
    expect(skeleton).toHaveClass('rounded-full')
  })

  it('renders SkeletonCard with all sections', () => {
    render(<SkeletonCard showImage showHeader showFooter variant="shimmer" />)
    
    // Should render without errors and maintain structure
    const card = screen.getByRole('status')
    expect(card).toBeInTheDocument()
  })

  it('applies correct border radius classes', () => {
    const { container, rerender } = render(<Skeleton rounded="none" />)
    
    expect(container.firstChild).toHaveClass('rounded-none')
    
    rerender(<Skeleton rounded="full" />)
    expect(container.firstChild).toHaveClass('rounded-full')
  })

  it('renders without animation when variant is none', () => {
    const { container } = render(<Skeleton variant="none" />)
    const skeleton = container.firstChild

    expect(skeleton).not.toHaveClass('skeleton-pulse')
    expect(skeleton).not.toHaveClass('skeleton-shimmer')
  })

  it('respects prefers-reduced-motion preference', () => {
    // Mock the useReducedMotion hook to return true
    const matchMediaMock = vi.fn().mockImplementation((query) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: matchMediaMock,
    })

    const { container } = render(<Skeleton variant="shimmer" />)
    const skeleton = container.firstChild

    // With reduced motion, should not have animation
    // The component sets variant to 'none' when prefersReducedMotion is true
    expect(skeleton).not.toHaveClass('skeleton-shimmer')
    expect(skeleton).not.toHaveClass('skeleton-pulse')
  })
})