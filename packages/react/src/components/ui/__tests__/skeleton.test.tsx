// @vitest-environment jsdom
import * as matchers from '@testing-library/jest-dom/matchers'
import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import {
  Skeleton,
  SkeletonText,
  SkeletonAvatar,
  SkeletonCard,
} from '../skeleton'

expect.extend(matchers)

describe('Zero-Dependency Skeleton Components', () => {
  it('renders base Skeleton with correct classes', () => {
    const { container } = render(
      <Skeleton variant="shimmer" width={100} height={20} />
    )
    const skeleton = container.firstChild

    expect(skeleton).toHaveClass('bg-muted/60')
    expect(skeleton).toHaveStyle({ width: '100px', height: '20px' })
  })

  it('renders base Skeleton with pulse variant', () => {
    const { container } = render(<Skeleton variant="pulse" />)
    const skeleton = container.firstChild

    expect(skeleton).toHaveClass('bg-muted/60')
  })

  it('renders SkeletonText with multiple lines', () => {
    const { container } = render(<SkeletonText lines={3} variant="shimmer" />)

    // SkeletonText renders a div with space-y-2.5 containing 'lines' number of Skeletons
    // Each Skeleton has 'bg-muted/60'
    const skeletons = container.querySelectorAll('.bg-muted\\/60')
    expect(skeletons).toHaveLength(3)
  })

  it('renders SkeletonAvatar', () => {
    const { container } = render(<SkeletonAvatar size={40} variant="shimmer" />)
    const skeleton = container.firstChild

    expect(skeleton).toHaveStyle({ width: '40px', height: '40px' })
    expect(skeleton).toHaveClass('rounded-full')
  })

  it('renders SkeletonCard with all sections', () => {
    const { container } = render(
      <SkeletonCard showImage showHeader showFooter variant="shimmer" />
    )

    // SkeletonCard renders a wrapper div
    const card = container.firstChild
    expect(card).toHaveClass('rounded-lg', 'bg-card', 'shadow-sm')

    // Should contain multiple skeleton elements
    const skeletons = container.querySelectorAll('.bg-muted\\/60')
    expect(skeletons.length).toBeGreaterThan(0)
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

    // When variant is none, it still has the base class
    expect(skeleton).toHaveClass('bg-muted/60')
  })
})
