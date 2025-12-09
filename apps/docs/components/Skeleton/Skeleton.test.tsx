/**
 * Skeleton Component Tests
 *
 * @vitest-environment happy-dom
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import {
  Skeleton,
  SkeletonText,
  SkeletonCard,
  SkeletonTable,
  SkeletonButton,
  ConditionalSkeleton,
} from './Skeleton'

describe('Skeleton', () => {
  describe('Base Skeleton', () => {
    it('renders without crashing', () => {
      render(<Skeleton />)
      const skeleton = document.querySelector('.bg-muted')
      expect(skeleton).toBeInTheDocument()
    })

    it('applies animate-pulse class by default', () => {
      render(<Skeleton />)
      const skeleton = document.querySelector('.animate-pulse')
      expect(skeleton).toBeInTheDocument()
    })

    it('does not animate when animate=false', () => {
      render(<Skeleton animate={false} />)
      const skeleton = document.querySelector('.animate-pulse')
      expect(skeleton).not.toBeInTheDocument()
    })

    it('applies custom width', () => {
      render(<Skeleton width="200px" />)
      const skeleton = document.querySelector('.bg-muted')
      expect(skeleton).toHaveStyle({ width: '200px' })
    })

    it('applies custom height', () => {
      render(<Skeleton height="50px" />)
      const skeleton = document.querySelector('.bg-muted')
      expect(skeleton).toHaveStyle({ height: '50px' })
    })

    it('applies different rounded values', () => {
      const { rerender } = render(<Skeleton rounded="sm" />)
      expect(document.querySelector('.rounded-sm')).toBeInTheDocument()

      rerender(<Skeleton rounded="lg" />)
      expect(document.querySelector('.rounded-lg')).toBeInTheDocument()

      rerender(<Skeleton rounded="full" />)
      expect(document.querySelector('.rounded-full')).toBeInTheDocument()
    })

    it('applies custom className', () => {
      render(<Skeleton className="custom-class" />)
      const skeleton = document.querySelector('.custom-class')
      expect(skeleton).toBeInTheDocument()
    })
  })

  describe('SkeletonText', () => {
    it('renders correct number of lines', () => {
      render(<SkeletonText lines={5} />)
      const lines = document.querySelectorAll('.bg-muted')
      expect(lines.length).toBe(5)
    })

    it('renders 3 lines by default', () => {
      render(<SkeletonText />)
      const lines = document.querySelectorAll('.bg-muted')
      expect(lines.length).toBe(3)
    })

    it('makes last line shorter', () => {
      render(<SkeletonText lines={3} />)
      const lines = document.querySelectorAll('.bg-muted')
      const lastLine = lines[lines.length - 1]
      expect(lastLine).toHaveStyle({ width: '60%' })
    })

    it('applies custom className to container', () => {
      render(<SkeletonText className="custom-container" />)
      const container = document.querySelector('.custom-container')
      expect(container).toBeInTheDocument()
    })
  })

  describe('SkeletonCard', () => {
    it('renders without crashing', () => {
      render(<SkeletonCard />)
      const card = document.querySelector('.border')
      expect(card).toBeInTheDocument()
    })

    it('shows image placeholder when showImage=true', () => {
      render(<SkeletonCard showImage />)
      const image = document.querySelector('.h-40')
      expect(image).toBeInTheDocument()
    })

    it('does not show image by default', () => {
      render(<SkeletonCard />)
      const image = document.querySelector('.h-40')
      expect(image).not.toBeInTheDocument()
    })

    it('renders title and text skeletons', () => {
      render(<SkeletonCard />)
      const skeletons = document.querySelectorAll('.bg-muted')
      expect(skeletons.length).toBeGreaterThan(0)
    })

    it('applies custom className', () => {
      render(<SkeletonCard className="custom-card" />)
      const card = document.querySelector('.custom-card')
      expect(card).toBeInTheDocument()
    })
  })

  describe('SkeletonTable', () => {
    it('renders correct number of rows', () => {
      render(<SkeletonTable rows={3} cols={4} />)
      // +1 for header row
      const rows = document.querySelectorAll('tr')
      expect(rows.length).toBe(4) // 1 header + 3 body rows
    })

    it('renders correct number of columns', () => {
      render(<SkeletonTable rows={2} cols={5} />)
      const headerCells = document.querySelectorAll('th')
      expect(headerCells.length).toBe(5)
    })

    it('renders 5 rows by default', () => {
      render(<SkeletonTable />)
      const rows = document.querySelectorAll('tbody tr')
      expect(rows.length).toBe(5)
    })

    it('renders 4 columns by default', () => {
      render(<SkeletonTable />)
      const headerCells = document.querySelectorAll('th')
      expect(headerCells.length).toBe(4)
    })

    it('applies custom className', () => {
      render(<SkeletonTable className="custom-table" />)
      const table = document.querySelector('.custom-table')
      expect(table).toBeInTheDocument()
    })
  })

  describe('SkeletonButton', () => {
    it('renders without crashing', () => {
      render(<SkeletonButton />)
      const button = document.querySelector('.bg-muted')
      expect(button).toBeInTheDocument()
    })

    it('renders with small size', () => {
      render(<SkeletonButton size="sm" />)
      const button = document.querySelector('.h-8')
      expect(button).toBeInTheDocument()
    })

    it('renders with medium size', () => {
      render(<SkeletonButton size="md" />)
      const button = document.querySelector('.h-10')
      expect(button).toBeInTheDocument()
    })

    it('renders with large size', () => {
      render(<SkeletonButton size="lg" />)
      const button = document.querySelector('.h-12')
      expect(button).toBeInTheDocument()
    })

    it('applies custom className', () => {
      render(<SkeletonButton className="custom-button" />)
      const button = document.querySelector('.custom-button')
      expect(button).toBeInTheDocument()
    })
  })

  describe('ConditionalSkeleton', () => {
    it('shows skeleton when isLoading=true', () => {
      render(
        <ConditionalSkeleton
          isLoading={true}
          skeleton={<div data-testid="skeleton">Loading...</div>}
        >
          <div data-testid="content">Content</div>
        </ConditionalSkeleton>
      )

      expect(screen.getByTestId('skeleton')).toBeInTheDocument()
      expect(screen.queryByTestId('content')).not.toBeInTheDocument()
    })

    it('shows children when isLoading=false', () => {
      render(
        <ConditionalSkeleton
          isLoading={false}
          skeleton={<div data-testid="skeleton">Loading...</div>}
        >
          <div data-testid="content">Content</div>
        </ConditionalSkeleton>
      )

      expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument()
      expect(screen.getByTestId('content')).toBeInTheDocument()
    })

    it('works with complex skeleton components', () => {
      render(
        <ConditionalSkeleton isLoading={true} skeleton={<SkeletonCard />}>
          <div data-testid="content">Content</div>
        </ConditionalSkeleton>
      )

      expect(document.querySelector('.border')).toBeInTheDocument()
      expect(screen.queryByTestId('content')).not.toBeInTheDocument()
    })
  })
})
