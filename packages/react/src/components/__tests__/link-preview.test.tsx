import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  LinkPreview,
  LinkPreviewSkeleton,
  LinkPreviewError,
  LinkPreviewCompact,
  InlineLink,
  SmartLinkPreview,
  useLinkPreview,
  type LinkMetadata,
} from '../link-preview'
import { renderHook } from '@testing-library/react'

// Mock matchMedia
const mockMatchMedia = vi.fn().mockImplementation((query: string) => ({
  matches: query === '(prefers-reduced-motion: reduce)' ? false : false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}))

// Mock window.open
const mockWindowOpen = vi.fn()

beforeEach(() => {
  vi.stubGlobal('matchMedia', mockMatchMedia)
  vi.stubGlobal('open', mockWindowOpen)
  vi.useFakeTimers()
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.useRealTimers()
  vi.clearAllMocks()
})

// Sample metadata for tests
const sampleMetadata: LinkMetadata = {
  url: 'https://example.com/article',
  title: 'Example Article Title',
  description: 'This is a sample description for testing purposes.',
  image: 'https://example.com/image.jpg',
  siteName: 'Example Site',
  favicon: 'https://example.com/favicon.ico',
  type: 'article',
}

const minimalMetadata: LinkMetadata = {
  url: 'https://example.com',
}

// ============================================================================
// LinkPreview Component Tests
// ============================================================================

describe('LinkPreview', () => {
  describe('rendering', () => {
    it('should render card variant with all metadata', () => {
      render(<LinkPreview metadata={sampleMetadata} />)

      expect(screen.getByText('Example Article Title')).toBeInTheDocument()
      expect(screen.getByText('This is a sample description for testing purposes.')).toBeInTheDocument()
      expect(screen.getByText('Example Site')).toBeInTheDocument()
      expect(screen.getByRole('img', { name: /preview image/i })).toBeInTheDocument()
    })

    it('should render compact variant correctly', () => {
      render(<LinkPreview metadata={sampleMetadata} variant="compact" />)

      expect(screen.getByText('Example Article Title')).toBeInTheDocument()
      expect(screen.getByText('example.com')).toBeInTheDocument()
    })

    it('should render inline variant correctly', () => {
      render(<LinkPreview metadata={sampleMetadata} variant="inline" />)

      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('href', 'https://example.com/article')
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    })

    it('should show skeleton while loading', () => {
      render(<LinkPreview metadata={sampleMetadata} loading />)

      // Should not show the title when loading
      expect(screen.queryByText('Example Article Title')).not.toBeInTheDocument()
    })

    it('should show fallback when provided and metadata url is missing', () => {
      const fallbackMetadata = { url: '' } as LinkMetadata
      render(
        <LinkPreview
          metadata={fallbackMetadata}
          fallback={<div data-testid="fallback">Fallback content</div>}
        />
      )

      expect(screen.getByTestId('fallback')).toBeInTheDocument()
    })

    it('should handle missing optional fields gracefully', () => {
      render(<LinkPreview metadata={minimalMetadata} />)

      // Should show domain when no title
      expect(screen.getByText('example.com')).toBeInTheDocument()
    })

    it('should apply custom className', () => {
      const { container } = render(
        <LinkPreview metadata={sampleMetadata} className="custom-class" />
      )

      expect(container.querySelector('.custom-class')).toBeInTheDocument()
    })
  })

  describe('image handling', () => {
    it('should display OG image when available', () => {
      render(<LinkPreview metadata={sampleMetadata} />)

      const img = screen.getByRole('img', { name: /preview image/i })
      expect(img).toHaveAttribute('src', 'https://example.com/image.jpg')
    })

    it('should show placeholder when no image available', () => {
      render(<LinkPreview metadata={minimalMetadata} />)

      // Should not have an img element for the preview image
      expect(screen.queryByRole('img', { name: /preview image/i })).not.toBeInTheDocument()
    })

    it('should handle image error and show placeholder', () => {
      render(<LinkPreview metadata={sampleMetadata} />)

      const img = screen.getByRole('img', { name: /preview image/i })
      fireEvent.error(img)

      // After error, should not show the broken image
      expect(screen.queryByRole('img', { name: /preview image/i })).not.toBeInTheDocument()
    })

    it('should hide image when showImage is false', () => {
      render(<LinkPreview metadata={sampleMetadata} showImage={false} />)

      expect(screen.queryByRole('img', { name: /preview image/i })).not.toBeInTheDocument()
    })

    it('should lazy load images', () => {
      render(<LinkPreview metadata={sampleMetadata} />)

      const img = screen.getByRole('img', { name: /preview image/i })
      expect(img).toHaveAttribute('loading', 'lazy')
    })
  })

  describe('accessibility', () => {
    it('should have proper ARIA labels when clickable', () => {
      render(<LinkPreview metadata={sampleMetadata} onClick={vi.fn()} />)

      expect(
        screen.getByRole('link', { name: /open link: example article title/i })
      ).toBeInTheDocument()
    })

    it('should have proper ARIA labels when not clickable', () => {
      render(<LinkPreview metadata={sampleMetadata} />)

      expect(
        screen.getByLabelText(/link preview: example article title/i)
      ).toBeInTheDocument()
    })

    it('should be keyboard navigable when clickable', () => {
      const handleClick = vi.fn()
      render(<LinkPreview metadata={sampleMetadata} onClick={handleClick} />)

      const card = screen.getByRole('link')
      expect(card).toHaveAttribute('tabIndex', '0')
    })

    it('should have visible focus states', () => {
      const handleClick = vi.fn()
      render(<LinkPreview metadata={sampleMetadata} onClick={handleClick} />)

      const card = screen.getByRole('link')
      expect(card.className).toContain('focus-visible:ring-2')
    })

    it('should support custom aria-label', () => {
      render(
        <LinkPreview
          metadata={sampleMetadata}
          onClick={vi.fn()}
          aria-label="Custom label for the link"
        />
      )

      expect(screen.getByLabelText('Custom label for the link')).toBeInTheDocument()
    })

    it('should have accessible remove button', () => {
      render(<LinkPreview metadata={sampleMetadata} onRemove={vi.fn()} />)

      expect(screen.getByRole('button', { name: /remove link preview/i })).toBeInTheDocument()
    })
  })

  describe('interactions', () => {
    it('should call onClick when card is clicked', async () => {
      const handleClick = vi.fn()
      render(<LinkPreview metadata={sampleMetadata} onClick={handleClick} />)

      await userEvent.click(screen.getByRole('link'))

      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('should trigger onClick on Enter key', () => {
      const handleClick = vi.fn()
      render(<LinkPreview metadata={sampleMetadata} onClick={handleClick} />)

      const card = screen.getByRole('link')
      fireEvent.keyDown(card, { key: 'Enter' })

      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('should trigger onClick on Space key', () => {
      const handleClick = vi.fn()
      render(<LinkPreview metadata={sampleMetadata} onClick={handleClick} />)

      const card = screen.getByRole('link')
      fireEvent.keyDown(card, { key: ' ' })

      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('should call onRemove when remove button is clicked', async () => {
      const handleRemove = vi.fn()
      render(<LinkPreview metadata={sampleMetadata} onRemove={handleRemove} />)

      await userEvent.click(screen.getByRole('button', { name: /remove/i }))

      expect(handleRemove).toHaveBeenCalledTimes(1)
    })

    it('should not trigger onClick when remove button is clicked', async () => {
      const handleClick = vi.fn()
      const handleRemove = vi.fn()
      render(
        <LinkPreview
          metadata={sampleMetadata}
          onClick={handleClick}
          onRemove={handleRemove}
        />
      )

      await userEvent.click(screen.getByRole('button', { name: /remove/i }))

      expect(handleRemove).toHaveBeenCalledTimes(1)
      expect(handleClick).not.toHaveBeenCalled()
    })

    it('should show cursor-pointer when clickable', () => {
      render(<LinkPreview metadata={sampleMetadata} onClick={vi.fn()} />)

      const card = screen.getByRole('link')
      expect(card.className).toContain('cursor-pointer')
    })
  })

  describe('display options', () => {
    it('should hide description when showDescription is false', () => {
      render(<LinkPreview metadata={sampleMetadata} showDescription={false} />)

      expect(
        screen.queryByText('This is a sample description for testing purposes.')
      ).not.toBeInTheDocument()
    })

    it('should hide favicon when showFavicon is false', () => {
      render(<LinkPreview metadata={sampleMetadata} showFavicon={false} />)

      expect(
        screen.queryByRole('img', { name: '' })
      ).not.toBeInTheDocument()
    })

    it('should hide domain badge when showDomain is false', () => {
      render(<LinkPreview metadata={sampleMetadata} showDomain={false} />)

      // Domain badge should not be present
      const badges = screen.queryAllByText('example.com')
      // Should only show site name, not the domain badge
      expect(badges.length).toBeLessThanOrEqual(1)
    })
  })
})

// ============================================================================
// LinkPreviewSkeleton Tests
// ============================================================================

describe('LinkPreviewSkeleton', () => {
  it('should render card skeleton by default', () => {
    const { container } = render(<LinkPreviewSkeleton />)

    expect(container.querySelector('.animate-pulse, [class*="animate"]')).toBeInTheDocument()
  })

  it('should render compact skeleton', () => {
    const { container } = render(<LinkPreviewSkeleton variant="compact" />)

    expect(container.querySelector('.animate-pulse')).toBeInTheDocument()
  })

  it('should render inline skeleton', () => {
    const { container } = render(<LinkPreviewSkeleton variant="inline" />)

    expect(container.querySelector('.animate-pulse')).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    const { container } = render(<LinkPreviewSkeleton className="custom-skeleton" />)

    expect(container.querySelector('.custom-skeleton')).toBeInTheDocument()
  })
})

// ============================================================================
// LinkPreviewError Tests
// ============================================================================

describe('LinkPreviewError', () => {
  it('should render error state with domain', () => {
    render(<LinkPreviewError url="https://failed.example.com/page" />)

    expect(screen.getByText('Failed to load preview')).toBeInTheDocument()
    expect(screen.getByText('failed.example.com')).toBeInTheDocument()
  })

  it('should display error message when provided', () => {
    render(
      <LinkPreviewError
        url="https://example.com"
        error="Network error occurred"
      />
    )

    expect(screen.getByText('Network error occurred')).toBeInTheDocument()
  })

  it('should render retry button when onRetry provided', () => {
    render(<LinkPreviewError url="https://example.com" onRetry={vi.fn()} />)

    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument()
  })

  it('should call onRetry when retry button clicked', async () => {
    const handleRetry = vi.fn()
    render(<LinkPreviewError url="https://example.com" onRetry={handleRetry} />)

    await userEvent.click(screen.getByRole('button', { name: /retry/i }))

    expect(handleRetry).toHaveBeenCalledTimes(1)
  })

  it('should not show retry button when onRetry not provided', () => {
    render(<LinkPreviewError url="https://example.com" />)

    expect(screen.queryByRole('button', { name: /retry/i })).not.toBeInTheDocument()
  })
})

// ============================================================================
// LinkPreviewCompact Tests
// ============================================================================

describe('LinkPreviewCompact', () => {
  it('should render compact card with metadata', () => {
    render(<LinkPreviewCompact metadata={sampleMetadata} />)

    expect(screen.getByText('Example Article Title')).toBeInTheDocument()
    expect(screen.getByText('example.com')).toBeInTheDocument()
  })

  it('should show favicon when available', () => {
    render(<LinkPreviewCompact metadata={sampleMetadata} />)

    const favicon = screen.getByRole('img')
    expect(favicon).toHaveAttribute('src', 'https://example.com/favicon.ico')
  })

  it('should hide favicon when showFavicon is false', () => {
    render(<LinkPreviewCompact metadata={sampleMetadata} showFavicon={false} />)

    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('should be keyboard accessible when clickable', () => {
    const handleClick = vi.fn()
    render(<LinkPreviewCompact metadata={sampleMetadata} onClick={handleClick} />)

    const card = screen.getByRole('link')
    fireEvent.keyDown(card, { key: 'Enter' })

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should show arrow icon when clickable', () => {
    render(<LinkPreviewCompact metadata={sampleMetadata} onClick={vi.fn()} />)

    // Arrow icon should be present (SVG)
    const card = screen.getByRole('link')
    expect(card.querySelector('svg')).toBeInTheDocument()
  })

  it('should show domain when no title', () => {
    render(<LinkPreviewCompact metadata={minimalMetadata} />)

    expect(screen.getByText('example.com')).toBeInTheDocument()
  })
})

// ============================================================================
// InlineLink Tests
// ============================================================================

describe('InlineLink', () => {
  it('should render link with correct attributes', () => {
    render(<InlineLink url="https://example.com" />)

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', 'https://example.com')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('should render children as link text', () => {
    render(<InlineLink url="https://example.com">Click here</InlineLink>)

    expect(screen.getByText('Click here')).toBeInTheDocument()
  })

  it('should show URL when no children provided', () => {
    render(<InlineLink url="https://example.com" />)

    expect(screen.getByText('https://example.com')).toBeInTheDocument()
  })

  it('should call onPreview and prevent default when provided', async () => {
    const handlePreview = vi.fn()
    render(<InlineLink url="https://example.com" onPreview={handlePreview} />)

    await userEvent.click(screen.getByRole('link'))

    expect(handlePreview).toHaveBeenCalledWith('https://example.com')
  })

  it('should apply custom className', () => {
    render(<InlineLink url="https://example.com" className="custom-link" />)

    const link = screen.getByRole('link')
    expect(link).toHaveClass('custom-link')
  })

  it('should not show preview when showHoverPreview is false', async () => {
    render(<InlineLink url="https://example.com" showHoverPreview={false} />)

    const link = screen.getByRole('link')
    fireEvent.mouseEnter(link)

    // Wait for any potential preview to appear
    await act(async () => {
      vi.advanceTimersByTime(500)
    })

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })

  it('should have focus states', () => {
    render(<InlineLink url="https://example.com" />)

    const link = screen.getByRole('link')
    expect(link.className).toContain('focus-visible:ring-2')
  })
})

// ============================================================================
// SmartLinkPreview Tests
// ============================================================================

describe('SmartLinkPreview', () => {
  it('should fetch metadata on mount', async () => {
    render(<SmartLinkPreview url="https://example.com" />)

    // Initially shows loading
    await waitFor(() => {
      // Either loading or content should be visible
      expect(document.body.textContent).toBeTruthy()
    })
  })

  it('should call onLoad when metadata is loaded', async () => {
    const handleLoad = vi.fn()
    render(<SmartLinkPreview url="https://example.com" onLoad={handleLoad} />)

    await act(async () => {
      vi.advanceTimersByTime(600) // Mock fetch delay
    })

    await waitFor(() => {
      expect(handleLoad).toHaveBeenCalled()
    })
  })

  it('should show error state when fetch fails', async () => {
    const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'))
    render(
      <SmartLinkPreview url="https://example.com" fetchFn={mockFetch} />
    )

    await act(async () => {
      vi.advanceTimersByTime(100)
    })

    await waitFor(() => {
      expect(screen.getByText('Failed to load preview')).toBeInTheDocument()
    })
  })

  it('should call onError when fetch fails', async () => {
    const handleError = vi.fn()
    const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'))

    render(
      <SmartLinkPreview
        url="https://example.com"
        fetchFn={mockFetch}
        onError={handleError}
      />
    )

    await act(async () => {
      vi.advanceTimersByTime(100)
    })

    await waitFor(() => {
      expect(handleError).toHaveBeenCalled()
    })
  })

  it('should show fallback when provided and fetch fails', async () => {
    const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'))

    render(
      <SmartLinkPreview
        url="https://example.com"
        fetchFn={mockFetch}
        fallback={<div data-testid="fallback">Custom fallback</div>}
      />
    )

    await act(async () => {
      vi.advanceTimersByTime(100)
    })

    await waitFor(() => {
      expect(screen.getByTestId('fallback')).toBeInTheDocument()
    })
  })

  it('should support different variants', async () => {
    render(<SmartLinkPreview url="https://example.com" variant="compact" />)

    await act(async () => {
      vi.advanceTimersByTime(600)
    })

    // Should render compact variant
    await waitFor(() => {
      expect(screen.getByText('example.com')).toBeInTheDocument()
    })
  })
})

// ============================================================================
// useLinkPreview Hook Tests
// ============================================================================

describe('useLinkPreview', () => {
  it('should return initial state', () => {
    const { result } = renderHook(() => useLinkPreview())

    expect(result.current.loading).toBe(false)
    expect(result.current.metadata).toBeNull()
    expect(result.current.error).toBeNull()
  })

  it('should set loading state when fetching', async () => {
    const { result } = renderHook(() => useLinkPreview())

    act(() => {
      result.current.fetchMetadata('https://example.com')
    })

    expect(result.current.loading).toBe(true)

    await act(async () => {
      vi.advanceTimersByTime(600)
    })

    expect(result.current.loading).toBe(false)
  })

  it('should return metadata after successful fetch', async () => {
    const { result } = renderHook(() => useLinkPreview())

    await act(async () => {
      result.current.fetchMetadata('https://example.com')
      vi.advanceTimersByTime(600)
    })

    expect(result.current.metadata).not.toBeNull()
    expect(result.current.metadata?.url).toBe('https://example.com')
  })

  it('should set error on fetch failure', async () => {
    const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'))
    const { result } = renderHook(() =>
      useLinkPreview({ fetchFn: mockFetch })
    )

    await act(async () => {
      try {
        await result.current.fetchMetadata('https://example.com')
      } catch {
        // Expected error
      }
    })

    expect(result.current.error).toBe('Network error')
  })

  it('should cache metadata', async () => {
    const mockFetch = vi.fn().mockResolvedValue(sampleMetadata)
    const { result } = renderHook(() =>
      useLinkPreview({ fetchFn: mockFetch })
    )

    // First fetch
    await act(async () => {
      await result.current.fetchMetadata('https://example.com')
    })

    // Second fetch should use cache
    await act(async () => {
      await result.current.fetchMetadata('https://example.com')
    })

    expect(mockFetch).toHaveBeenCalledTimes(1)
  })

  it('should reset state', async () => {
    const { result } = renderHook(() => useLinkPreview())

    await act(async () => {
      result.current.fetchMetadata('https://example.com')
      vi.advanceTimersByTime(600)
    })

    expect(result.current.metadata).not.toBeNull()

    act(() => {
      result.current.reset()
    })

    expect(result.current.metadata).toBeNull()
    expect(result.current.error).toBeNull()
    expect(result.current.loading).toBe(false)
  })

  it('should clear cache', async () => {
    const mockFetch = vi.fn().mockResolvedValue(sampleMetadata)
    const { result } = renderHook(() =>
      useLinkPreview({ fetchFn: mockFetch })
    )

    // First fetch
    await act(async () => {
      await result.current.fetchMetadata('https://example.com')
    })

    // Clear cache
    act(() => {
      result.current.clearCache()
    })

    // Fetch again should call fetchFn
    await act(async () => {
      await result.current.fetchMetadata('https://example.com')
    })

    expect(mockFetch).toHaveBeenCalledTimes(2)
  })

  it('should use custom fetch function', async () => {
    const customMetadata: LinkMetadata = {
      url: 'https://custom.com',
      title: 'Custom Title',
    }
    const mockFetch = vi.fn().mockResolvedValue(customMetadata)
    const { result } = renderHook(() =>
      useLinkPreview({ fetchFn: mockFetch })
    )

    await act(async () => {
      await result.current.fetchMetadata('https://custom.com')
    })

    expect(result.current.metadata?.title).toBe('Custom Title')
    expect(mockFetch).toHaveBeenCalledWith('https://custom.com')
  })

  it('should prevent duplicate fetches for same URL', async () => {
    const mockFetch = vi.fn().mockImplementation(async () => {
      await new Promise((r) => setTimeout(r, 100))
      return sampleMetadata
    })

    const { result } = renderHook(() =>
      useLinkPreview({ fetchFn: mockFetch })
    )

    // Start two fetches simultaneously
    await act(async () => {
      result.current.fetchMetadata('https://example.com')
      result.current.fetchMetadata('https://example.com')
      vi.advanceTimersByTime(200)
    })

    // Should only have called fetch once
    expect(mockFetch).toHaveBeenCalledTimes(1)
  })
})

// ============================================================================
// Reduced Motion Tests
// ============================================================================

describe('Reduced Motion Support', () => {
  it('should respect prefers-reduced-motion', () => {
    // Mock reduced motion preference
    vi.stubGlobal('matchMedia', vi.fn().mockImplementation((query: string) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })))

    render(<LinkPreview metadata={sampleMetadata} onClick={vi.fn()} />)

    // Should not show the animated bottom border effect
    const card = screen.getByRole('link')
    // In reduced motion mode, the animated border should not be rendered
    expect(card.querySelector('[class*="transition-transform"]')).not.toBeInTheDocument()
  })
})

// ============================================================================
// Domain Extraction Tests
// ============================================================================

describe('Domain Extraction', () => {
  it('should extract domain from URL', () => {
    render(<LinkPreview metadata={{ url: 'https://www.example.com/path' }} />)

    expect(screen.getByText('example.com')).toBeInTheDocument()
  })

  it('should remove www prefix from domain', () => {
    render(<LinkPreview metadata={{ url: 'https://www.test.example.com/path' }} />)

    expect(screen.getByText('test.example.com')).toBeInTheDocument()
  })

  it('should handle invalid URLs gracefully', () => {
    render(<LinkPreview metadata={{ url: 'not-a-valid-url' }} />)

    expect(screen.getByText('not-a-valid-url')).toBeInTheDocument()
  })
})
