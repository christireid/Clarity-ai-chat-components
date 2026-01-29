/**
 * ContextItemCard Component Tests
 *
 * Tests for context item display with expansion controls.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ContextItemCard } from '../ContextItemCard'
import { createContextItem } from '../../../hooks/prompt-composer/context-utils'
import type { ContextItem } from '../../../hooks/prompt-composer/types'

describe('ContextItemCard', () => {
  const mockFileItem: ContextItem = createContextItem({
    id: 'file1',
    type: 'file',
    label: 'Button.tsx',
    description: 'src/components/Button.tsx',
    summary: 'Button component - 250 lines, exports Button, ButtonProps',
    preview: 'export function Button(props: ButtonProps) { return <button {...props} /> }',
    full: '// Full file implementation\nexport function Button(props: ButtonProps) {\n  return <button {...props} />\n}',
  })

  const mockDocItem: ContextItem = createContextItem({
    id: 'doc1',
    type: 'doc',
    label: 'API Reference',
    description: 'Complete API documentation',
    summary: 'API Reference - Authentication, endpoints, schemas',
    preview: '## Authentication\nUse JWT tokens for authentication...',
  })

  const mockOnExpand = vi.fn()
  const mockOnRemove = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ==========================================================================
  // Rendering Tests
  // ==========================================================================

  describe('Rendering', () => {
    it('renders context item label', () => {
      render(
        <ContextItemCard
          item={mockFileItem}
          currentLevel="summary"
          onExpand={mockOnExpand}
          onRemove={mockOnRemove}
        />
      )

      expect(screen.getByText('Button.tsx')).toBeInTheDocument()
    })

    it('displays item type icon', () => {
      render(
        <ContextItemCard
          item={mockFileItem}
          currentLevel="summary"
          onExpand={mockOnExpand}
          onRemove={mockOnRemove}
        />
      )

      // Should have file icon
      expect(screen.getByText(/file/i)).toBeInTheDocument()
    })

    it('shows summary content by default', () => {
      render(
        <ContextItemCard
          item={mockFileItem}
          currentLevel="summary"
          onExpand={mockOnExpand}
          onRemove={mockOnRemove}
        />
      )

      expect(screen.getByText(/Button component - 250 lines/)).toBeInTheDocument()
    })

    it('applies compact mode styles', () => {
      const { container } = render(
        <ContextItemCard
          item={mockFileItem}
          currentLevel="summary"
          onExpand={mockOnExpand}
          onRemove={mockOnRemove}
          compact
        />
      )

      expect(container.firstChild).toHaveClass(/compact/)
    })

    it('applies custom className', () => {
      const { container } = render(
        <ContextItemCard
          item={mockFileItem}
          currentLevel="summary"
          onExpand={mockOnExpand}
          onRemove={mockOnRemove}
          className="custom-class"
        />
      )

      expect(container.firstChild).toHaveClass('custom-class')
    })
  })

  // ==========================================================================
  // Token Display Tests
  // ==========================================================================

  describe('Token Display', () => {
    it('shows token count for current level', () => {
      render(
        <ContextItemCard
          item={mockFileItem}
          currentLevel="summary"
          onExpand={mockOnExpand}
          onRemove={mockOnRemove}
        />
      )

      expect(screen.getByText(/tokens/)).toBeInTheDocument()
    })

    it('updates token count on level change', () => {
      const { rerender } = render(
        <ContextItemCard
          item={mockFileItem}
          currentLevel="summary"
          onExpand={mockOnExpand}
          onRemove={mockOnRemove}
        />
      )

      const summaryTokens = screen.getByText(/\d+ tokens/)

      rerender(
        <ContextItemCard
          item={mockFileItem}
          currentLevel="preview"
          onExpand={mockOnExpand}
          onRemove={mockOnRemove}
        />
      )

      const previewTokens = screen.getByText(/\d+ tokens/)
      expect(previewTokens.textContent).not.toBe(summaryTokens.textContent)
    })

    it('formats token count with commas', () => {
      const largeItem = createContextItem({
        id: 'large',
        type: 'file',
        label: 'Large.tsx',
        summary: 'a'.repeat(10000), // Generate large content
      })

      render(
        <ContextItemCard
          item={largeItem}
          currentLevel="summary"
          onExpand={mockOnExpand}
          onRemove={mockOnRemove}
        />
      )

      // Should format large numbers with commas (if over 1000 tokens)
      const tokenText = screen.getByText(/tokens/)
      if (tokenText.textContent && tokenText.textContent.match(/\d{4,}/)) {
        expect(tokenText.textContent).toMatch(/,/)
      }
    })
  })

  // ==========================================================================
  // Expansion Tests
  // ==========================================================================

  describe('Expansion', () => {
    it('shows expand to preview button when at summary', () => {
      render(
        <ContextItemCard
          item={mockFileItem}
          currentLevel="summary"
          onExpand={mockOnExpand}
          onRemove={mockOnRemove}
        />
      )

      expect(screen.getByText(/preview/i)).toBeInTheDocument()
    })

    it('calls onExpand with preview level', async () => {
      const user = userEvent.setup()
      render(
        <ContextItemCard
          item={mockFileItem}
          currentLevel="summary"
          onExpand={mockOnExpand}
          onRemove={mockOnRemove}
        />
      )

      const expandButton = screen.getByText(/preview/i)
      await user.click(expandButton)

      expect(mockOnExpand).toHaveBeenCalledWith('preview')
    })

    it('shows expand to full button when at preview', () => {
      render(
        <ContextItemCard
          item={mockFileItem}
          currentLevel="preview"
          onExpand={mockOnExpand}
          onRemove={mockOnRemove}
        />
      )

      expect(screen.getByText(/full/i)).toBeInTheDocument()
    })

    it('calls onExpand with full level', async () => {
      const user = userEvent.setup()
      render(
        <ContextItemCard
          item={mockFileItem}
          currentLevel="preview"
          onExpand={mockOnExpand}
          onRemove={mockOnRemove}
        />
      )

      const expandButton = screen.getByText(/full/i)
      await user.click(expandButton)

      expect(mockOnExpand).toHaveBeenCalledWith('full')
    })

    it('hides expand button when at full level', () => {
      render(
        <ContextItemCard
          item={mockFileItem}
          currentLevel="full"
          onExpand={mockOnExpand}
          onRemove={mockOnRemove}
        />
      )

      expect(screen.queryByText(/expand/i)).not.toBeInTheDocument()
    })

    it('hides expand button when no preview available', () => {
      const itemWithoutPreview = createContextItem({
        id: 'file2',
        type: 'file',
        label: 'Simple.tsx',
        summary: 'Simple file',
      })

      render(
        <ContextItemCard
          item={itemWithoutPreview}
          currentLevel="summary"
          onExpand={mockOnExpand}
          onRemove={mockOnRemove}
        />
      )

      expect(screen.queryByText(/preview/i)).not.toBeInTheDocument()
    })
  })

  // ==========================================================================
  // Removal Tests
  // ==========================================================================

  describe('Removal', () => {
    it('shows remove button', () => {
      render(
        <ContextItemCard
          item={mockFileItem}
          currentLevel="summary"
          onExpand={mockOnExpand}
          onRemove={mockOnRemove}
        />
      )

      expect(screen.getByLabelText(/remove/i)).toBeInTheDocument()
    })

    it('calls onRemove when clicked', async () => {
      const user = userEvent.setup()
      render(
        <ContextItemCard
          item={mockFileItem}
          currentLevel="summary"
          onExpand={mockOnExpand}
          onRemove={mockOnRemove}
        />
      )

      const removeButton = screen.getByLabelText(/remove/i)
      await user.click(removeButton)

      expect(mockOnRemove).toHaveBeenCalled()
    })

    it('confirms removal for large items', async () => {
      const user = userEvent.setup()
      const largeItem = createContextItem({
        id: 'large',
        type: 'file',
        label: 'Large.tsx',
        summary: 'Large file',
        full: 'a'.repeat(10000),
      })

      render(
        <ContextItemCard
          item={largeItem}
          currentLevel="full"
          onExpand={mockOnExpand}
          onRemove={mockOnRemove}
        />
      )

      const removeButton = screen.getByLabelText(/remove/i)
      await user.click(removeButton)

      // Should show confirmation dialog
      expect(screen.getByText(/confirm/i)).toBeInTheDocument()
    })
  })

  // ==========================================================================
  // Content Display Tests
  // ==========================================================================

  describe('Content Display', () => {
    it('displays preview content when expanded to preview', () => {
      render(
        <ContextItemCard
          item={mockFileItem}
          currentLevel="preview"
          onExpand={mockOnExpand}
          onRemove={mockOnRemove}
        />
      )

      expect(screen.getByText(/export function Button/)).toBeInTheDocument()
    })

    it('displays full content when expanded to full', () => {
      render(
        <ContextItemCard
          item={mockFileItem}
          currentLevel="full"
          onExpand={mockOnExpand}
          onRemove={mockOnRemove}
        />
      )

      expect(screen.getByText(/Full file implementation/)).toBeInTheDocument()
    })

    it('truncates long summary in compact mode', () => {
      const longSummaryItem = createContextItem({
        id: 'long',
        type: 'file',
        label: 'Long.tsx',
        summary: 'a'.repeat(500),
      })

      const { container } = render(
        <ContextItemCard
          item={longSummaryItem}
          currentLevel="summary"
          onExpand={mockOnExpand}
          onRemove={mockOnRemove}
          compact
        />
      )

      const summaryElement = container.querySelector('.summary')
      expect(summaryElement).toHaveClass(/truncate/)
    })

    it('does not truncate in expanded mode', () => {
      const longSummaryItem = createContextItem({
        id: 'long',
        type: 'file',
        label: 'Long.tsx',
        summary: 'a'.repeat(500),
      })

      const { container } = render(
        <ContextItemCard
          item={longSummaryItem}
          currentLevel="summary"
          onExpand={mockOnExpand}
          onRemove={mockOnRemove}
          compact={false}
        />
      )

      const summaryElement = container.querySelector('.summary')
      expect(summaryElement).not.toHaveClass(/truncate/)
    })
  })

  // ==========================================================================
  // Type-Specific Tests
  // ==========================================================================

  describe('Type-Specific Rendering', () => {
    it('renders file type icon', () => {
      render(
        <ContextItemCard
          item={mockFileItem}
          currentLevel="summary"
          onExpand={mockOnExpand}
          onRemove={mockOnRemove}
        />
      )

      expect(screen.getByText(/📄|file/i)).toBeInTheDocument()
    })

    it('renders doc type icon', () => {
      render(
        <ContextItemCard
          item={mockDocItem}
          currentLevel="summary"
          onExpand={mockOnExpand}
          onRemove={mockOnRemove}
        />
      )

      expect(screen.getByText(/📖|doc/i)).toBeInTheDocument()
    })

    it('shows file path for files', () => {
      render(
        <ContextItemCard
          item={mockFileItem}
          currentLevel="summary"
          onExpand={mockOnExpand}
          onRemove={mockOnRemove}
        />
      )

      expect(screen.getByText(/src\/components/)).toBeInTheDocument()
    })

    it('shows description for docs', () => {
      render(
        <ContextItemCard
          item={mockDocItem}
          currentLevel="summary"
          onExpand={mockOnExpand}
          onRemove={mockOnRemove}
        />
      )

      expect(screen.getByText(/Complete API documentation/)).toBeInTheDocument()
    })
  })

  // ==========================================================================
  // Relevance Score Tests
  // ==========================================================================

  describe('Relevance Score', () => {
    it('displays relevance badge for high relevance', () => {
      const relevantItem = {
        ...mockFileItem,
        relevance: 0.9,
      }

      render(
        <ContextItemCard
          item={relevantItem}
          currentLevel="summary"
          onExpand={mockOnExpand}
          onRemove={mockOnRemove}
        />
      )

      expect(screen.getByText(/90%/)).toBeInTheDocument()
    })

    it('hides relevance badge for low relevance', () => {
      const lowRelevanceItem = {
        ...mockFileItem,
        relevance: 0.3,
      }

      render(
        <ContextItemCard
          item={lowRelevanceItem}
          currentLevel="summary"
          onExpand={mockOnExpand}
          onRemove={mockOnRemove}
        />
      )

      expect(screen.queryByText(/%/)).not.toBeInTheDocument()
    })
  })

  // ==========================================================================
  // Accessibility Tests
  // ==========================================================================

  describe('Accessibility', () => {
    it('has expand button with aria-label', () => {
      render(
        <ContextItemCard
          item={mockFileItem}
          currentLevel="summary"
          onExpand={mockOnExpand}
          onRemove={mockOnRemove}
        />
      )

      const expandButton = screen.getByText(/preview/i)
      expect(expandButton).toHaveAttribute('aria-label')
    })

    it('has remove button with aria-label', () => {
      render(
        <ContextItemCard
          item={mockFileItem}
          currentLevel="summary"
          onExpand={mockOnExpand}
          onRemove={mockOnRemove}
        />
      )

      const removeButton = screen.getByLabelText(/remove/i)
      expect(removeButton).toBeDefined()
    })

    it('uses semantic HTML', () => {
      const { container } = render(
        <ContextItemCard
          item={mockFileItem}
          currentLevel="summary"
          onExpand={mockOnExpand}
          onRemove={mockOnRemove}
        />
      )

      expect(container.querySelector('article')).toBeInTheDocument()
    })

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup()
      render(
        <ContextItemCard
          item={mockFileItem}
          currentLevel="summary"
          onExpand={mockOnExpand}
          onRemove={mockOnRemove}
        />
      )

      const expandButton = screen.getByText(/preview/i)
      await user.tab()
      expect(expandButton).toHaveFocus()

      await user.keyboard('{Enter}')
      expect(mockOnExpand).toHaveBeenCalled()
    })
  })

  // ==========================================================================
  // Edge Cases
  // ==========================================================================

  describe('Edge Cases', () => {
    it('handles missing description gracefully', () => {
      const itemWithoutDescription = createContextItem({
        id: 'file2',
        type: 'file',
        label: 'Simple.tsx',
        summary: 'Simple file',
      })

      render(
        <ContextItemCard
          item={itemWithoutDescription}
          currentLevel="summary"
          onExpand={mockOnExpand}
          onRemove={mockOnRemove}
        />
      )

      expect(screen.getByText('Simple.tsx')).toBeInTheDocument()
    })

    it('handles missing icon gracefully', () => {
      const itemWithoutIcon = createContextItem({
        id: 'file2',
        type: 'file',
        label: 'Simple.tsx',
        summary: 'Simple file',
      })

      render(
        <ContextItemCard
          item={itemWithoutIcon}
          currentLevel="summary"
          onExpand={mockOnExpand}
          onRemove={mockOnRemove}
        />
      )

      // Should still render with default icon
      expect(screen.getByText('Simple.tsx')).toBeInTheDocument()
    })

    it('handles very long labels', () => {
      const longLabelItem = createContextItem({
        id: 'long',
        type: 'file',
        label: 'VeryLongFileNameThatShouldBeTruncated.tsx',
        summary: 'File',
      })

      const { container } = render(
        <ContextItemCard
          item={longLabelItem}
          currentLevel="summary"
          onExpand={mockOnExpand}
          onRemove={mockOnRemove}
        />
      )

      const labelElement = screen.getByText(/VeryLongFileNameThatShouldBeTruncated/)
      expect(labelElement).toHaveClass(/truncate/)
    })
  })

  // ==========================================================================
  // Animation Tests
  // ==========================================================================

  describe('Animations', () => {
    it('applies animation classes on mount', () => {
      const { container } = render(
        <ContextItemCard
          item={mockFileItem}
          currentLevel="summary"
          onExpand={mockOnExpand}
          onRemove={mockOnRemove}
        />
      )

      expect(container.firstChild).toHaveClass(/animate/)
    })

    it('applies transition on expansion', async () => {
      const user = userEvent.setup()
      const { container } = render(
        <ContextItemCard
          item={mockFileItem}
          currentLevel="summary"
          onExpand={mockOnExpand}
          onRemove={mockOnRemove}
        />
      )

      const expandButton = screen.getByText(/preview/i)
      await user.click(expandButton)

      expect(container.firstChild).toHaveClass(/transition/)
    })
  })
})
