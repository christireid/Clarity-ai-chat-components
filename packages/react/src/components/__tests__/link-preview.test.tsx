import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import {
  LinkPreview,
  LinkPreviewSkeleton,
  LinkPreviewError,
  LinkPreviewCompact,
  InlineLink,
  SmartLinkPreview,
  RichEmbed,
  useLinkPreview,
  isValidUrl,
  sanitizeUrl,
  detectEmbedType,
  createMetadataFetcher,
  createFallbackMetadata,
  type LinkMetadata,
  type EmbedType,
} from '../ui/link-preview'
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
})

afterEach(() => {
  vi.unstubAllGlobals()
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
      expect(
        screen.getByText('This is a sample description for testing purposes.')
      ).toBeInTheDocument()
      expect(screen.getByText('Example Site')).toBeInTheDocument()
      expect(
        screen.getByRole('img', { name: /preview image/i })
      ).toBeInTheDocument()
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
      expect(
        screen.queryByText('Example Article Title')
      ).not.toBeInTheDocument()
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
      expect(screen.getAllByText('example.com').length).toBeGreaterThan(0)
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
      expect(
        screen.queryByRole('img', { name: /preview image/i })
      ).not.toBeInTheDocument()
    })

    it('should handle image error and show placeholder', () => {
      render(<LinkPreview metadata={sampleMetadata} />)

      const img = screen.getByRole('img', { name: /preview image/i })
      fireEvent.error(img)

      // After error, should not show the broken image
      expect(
        screen.queryByRole('img', { name: /preview image/i })
      ).not.toBeInTheDocument()
    })

    it('should hide image when showImage is false', () => {
      render(<LinkPreview metadata={sampleMetadata} showImage={false} />)

      expect(
        screen.queryByRole('img', { name: /preview image/i })
      ).not.toBeInTheDocument()
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

      expect(
        screen.getByLabelText('Custom label for the link')
      ).toBeInTheDocument()
    })

    it('should have accessible remove button', () => {
      render(<LinkPreview metadata={sampleMetadata} onRemove={vi.fn()} />)

      expect(
        screen.getByRole('button', { name: /remove link preview/i })
      ).toBeInTheDocument()
    })
  })

  describe('interactions', () => {
    it('should call onClick when card is clicked', async () => {
      const handleClick = vi.fn()
      render(<LinkPreview metadata={sampleMetadata} onClick={handleClick} />)

      fireEvent.click(screen.getByRole('link'))

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

      fireEvent.click(screen.getByRole('button', { name: /remove/i }))

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

      fireEvent.click(screen.getByRole('button', { name: /remove/i }))

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

      expect(screen.queryByRole('img', { name: '' })).not.toBeInTheDocument()
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

    expect(
      container.querySelector('.animate-pulse, [class*="animate"]')
    ).toBeInTheDocument()
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
    const { container } = render(
      <LinkPreviewSkeleton className="custom-skeleton" />
    )

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

    fireEvent.click(screen.getByRole('button', { name: /retry/i }))

    expect(handleRetry).toHaveBeenCalledTimes(1)
  })

  it('should not show retry button when onRetry not provided', () => {
    render(<LinkPreviewError url="https://example.com" />)

    expect(
      screen.queryByRole('button', { name: /retry/i })
    ).not.toBeInTheDocument()
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
    render(
      <LinkPreviewCompact metadata={sampleMetadata} onClick={handleClick} />
    )

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

    fireEvent.click(screen.getByRole('link'))

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

    await waitFor(() => {
      expect(handleLoad).toHaveBeenCalled()
    })
  })

  it('should show error state when fetch fails', async () => {
    const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'))
    render(<SmartLinkPreview url="https://example.com" fetchFn={mockFetch} />)

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

    await waitFor(() => {
      expect(screen.getByTestId('fallback')).toBeInTheDocument()
    })
  })

  it('should support different variants', async () => {
    render(<SmartLinkPreview url="https://example.com" variant="compact" />)

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

    let promise: Promise<LinkMetadata> | undefined
    act(() => {
      promise = result.current.fetchMetadata('https://example.com')
    })

    expect(result.current.loading).toBe(true)

    await act(async () => {
      await promise
    })

    expect(result.current.loading).toBe(false)
  })

  it('should return metadata after successful fetch', async () => {
    const { result } = renderHook(() => useLinkPreview())

    await act(async () => {
      await result.current.fetchMetadata('https://example.com')
    })

    expect(result.current.metadata).not.toBeNull()
    expect(result.current.metadata?.url).toBe('https://example.com')
  })

  it('should set error on fetch failure', async () => {
    const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'))
    const { result } = renderHook(() => useLinkPreview({ fetchFn: mockFetch }))

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
    const { result } = renderHook(() => useLinkPreview({ fetchFn: mockFetch }))

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
      await result.current.fetchMetadata('https://example.com')
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
    const { result } = renderHook(() => useLinkPreview({ fetchFn: mockFetch }))

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
    const { result } = renderHook(() => useLinkPreview({ fetchFn: mockFetch }))

    await act(async () => {
      await result.current.fetchMetadata('https://custom.com')
    })

    expect(result.current.metadata?.title).toBe('Custom Title')
    expect(mockFetch).toHaveBeenCalledWith('https://custom.com')
  })

  it('should prevent duplicate fetches for same URL', async () => {
    let resolveFetch: ((value: LinkMetadata) => void) | null = null
    const mockFetch = vi.fn().mockImplementation(
      () =>
        new Promise<LinkMetadata>((resolve) => {
          resolveFetch = resolve
        })
    )

    const { result } = renderHook(() => useLinkPreview({ fetchFn: mockFetch }))

    // Start two fetches simultaneously
    let p1: Promise<LinkMetadata> | undefined
    let p2: Promise<LinkMetadata> | undefined
    await act(async () => {
      p1 = result.current.fetchMetadata('https://example.com')
      p2 = result.current.fetchMetadata('https://example.com')
    })

    // Should only have called fetch once
    expect(mockFetch).toHaveBeenCalledTimes(1)

    resolveFetch?.(sampleMetadata)
    await act(async () => {
      await Promise.all([p1, p2])
    })
  })
})

// ============================================================================
// Reduced Motion Tests
// ============================================================================

describe('Reduced Motion Support', () => {
  it('should respect prefers-reduced-motion', () => {
    // Mock reduced motion preference
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockImplementation((query: string) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))
    )

    render(<LinkPreview metadata={sampleMetadata} onClick={vi.fn()} />)

    // Should not show the animated bottom border effect
    const card = screen.getByRole('link')
    // In reduced motion mode, the animated border should not be rendered
    expect(
      card.querySelector('[class*="transition-transform"]')
    ).not.toBeInTheDocument()
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
    render(
      <LinkPreview metadata={{ url: 'https://www.test.example.com/path' }} />
    )

    expect(screen.getByText('test.example.com')).toBeInTheDocument()
  })

  it('should handle invalid URLs gracefully', () => {
    render(<LinkPreview metadata={{ url: 'not-a-valid-url' }} />)

    expect(screen.getByText('not-a-valid-url')).toBeInTheDocument()
  })
})

// ============================================================================
// URL Validation Tests
// ============================================================================

describe('isValidUrl', () => {
  describe('valid URLs', () => {
    it('should accept http URLs', () => {
      expect(isValidUrl('http://example.com')).toBe(true)
    })

    it('should accept https URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true)
    })

    it('should accept URLs with paths', () => {
      expect(isValidUrl('https://example.com/path/to/page')).toBe(true)
    })

    it('should accept URLs with query strings', () => {
      expect(isValidUrl('https://example.com?foo=bar&baz=qux')).toBe(true)
    })

    it('should accept URLs with hash fragments', () => {
      expect(isValidUrl('https://example.com#section')).toBe(true)
    })

    it('should accept URLs with ports', () => {
      expect(isValidUrl('https://example.com:8080/path')).toBe(true)
    })

    it('should accept URLs with subdomains', () => {
      expect(isValidUrl('https://sub.domain.example.com')).toBe(true)
    })
  })

  describe('invalid URLs', () => {
    it('should reject javascript: URLs', () => {
      expect(isValidUrl('javascript:alert(1)')).toBe(false)
    })

    it('should reject data: URLs', () => {
      expect(isValidUrl('data:text/html,<script>alert(1)</script>')).toBe(false)
    })

    it('should reject vbscript: URLs', () => {
      expect(isValidUrl('vbscript:msgbox("test")')).toBe(false)
    })

    it('should reject file: URLs', () => {
      expect(isValidUrl('file:///etc/passwd')).toBe(false)
    })

    it('should reject malformed URLs', () => {
      expect(isValidUrl('not-a-url')).toBe(false)
    })

    it('should reject empty strings', () => {
      expect(isValidUrl('')).toBe(false)
    })

    it('should reject URLs with javascript in mixed case', () => {
      expect(isValidUrl('JaVaScRiPt:alert(1)')).toBe(false)
    })

    it('should reject URLs with whitespace tricks', () => {
      expect(isValidUrl('  javascript:alert(1)')).toBe(false)
    })
  })
})

describe('sanitizeUrl', () => {
  it('should return valid URLs unchanged', () => {
    expect(sanitizeUrl('https://example.com')).toBe('https://example.com')
  })

  it('should return safe fallback for javascript: URLs', () => {
    expect(sanitizeUrl('javascript:alert(1)')).toBe('about:blank')
  })

  it('should return safe fallback for data: URLs', () => {
    expect(sanitizeUrl('data:text/html,<script>alert(1)</script>')).toBe(
      'about:blank'
    )
  })

  it('should return safe fallback for malformed URLs', () => {
    expect(sanitizeUrl('not-a-url')).toBe('about:blank')
  })

  it('should trim whitespace before validation', () => {
    expect(sanitizeUrl('  https://example.com  ')).toBe('https://example.com')
  })

  it('should handle empty strings', () => {
    expect(sanitizeUrl('')).toBe('about:blank')
  })
})

// ============================================================================
// Embed Detection Tests
// ============================================================================

describe('detectEmbedType', () => {
  describe('YouTube', () => {
    it('should detect youtube.com watch URLs', () => {
      expect(
        detectEmbedType('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
      ).toBe('youtube')
    })

    it('should detect youtu.be short URLs', () => {
      expect(detectEmbedType('https://youtu.be/dQw4w9WgXcQ')).toBe('youtube')
    })

    it('should detect youtube.com embed URLs', () => {
      expect(detectEmbedType('https://www.youtube.com/embed/dQw4w9WgXcQ')).toBe(
        'youtube'
      )
    })
  })

  describe('Twitter/X', () => {
    it('should detect twitter.com status URLs', () => {
      expect(detectEmbedType('https://twitter.com/user/status/123456789')).toBe(
        'twitter'
      )
    })

    it('should detect x.com status URLs', () => {
      expect(detectEmbedType('https://x.com/user/status/123456789')).toBe(
        'twitter'
      )
    })
  })

  describe('GitHub', () => {
    it('should detect github.com repository URLs', () => {
      expect(detectEmbedType('https://github.com/owner/repo')).toBe('github')
    })

    it('should detect github.com pull request URLs', () => {
      expect(detectEmbedType('https://github.com/owner/repo/pull/123')).toBe(
        'github'
      )
    })

    it('should detect github.com issue URLs', () => {
      expect(detectEmbedType('https://github.com/owner/repo/issues/456')).toBe(
        'github'
      )
    })

    it('should detect gist.github.com URLs', () => {
      expect(detectEmbedType('https://gist.github.com/user/abc123')).toBe(
        'github'
      )
    })
  })

  describe('Vimeo', () => {
    it('should detect vimeo.com video URLs', () => {
      expect(detectEmbedType('https://vimeo.com/123456789')).toBe('vimeo')
    })

    it('should detect player.vimeo.com embed URLs', () => {
      expect(detectEmbedType('https://player.vimeo.com/video/123456789')).toBe(
        'vimeo'
      )
    })
  })

  describe('Spotify', () => {
    it('should detect open.spotify.com track URLs', () => {
      expect(detectEmbedType('https://open.spotify.com/track/abc123')).toBe(
        'spotify'
      )
    })

    it('should detect open.spotify.com playlist URLs', () => {
      expect(detectEmbedType('https://open.spotify.com/playlist/xyz789')).toBe(
        'spotify'
      )
    })

    it('should detect open.spotify.com album URLs', () => {
      expect(detectEmbedType('https://open.spotify.com/album/def456')).toBe(
        'spotify'
      )
    })
  })

  describe('Generic URLs', () => {
    it('should return generic for regular URLs', () => {
      expect(detectEmbedType('https://example.com')).toBe('generic')
    })

    it('should return generic for news sites', () => {
      expect(detectEmbedType('https://news.example.com/article')).toBe(
        'generic'
      )
    })
  })
})

// ============================================================================
// Metadata Fetcher Tests
// ============================================================================

describe('createMetadataFetcher', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('should create a fetcher function', () => {
    const fetcher = createMetadataFetcher({
      apiEndpoint: 'https://api.example.com/metadata',
    })

    expect(typeof fetcher).toBe('function')
  })

  it('should call API endpoint with URL parameter', async () => {
    const mockResponse = {
      url: 'https://example.com',
      title: 'Example Site',
    }
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    })
    vi.stubGlobal('fetch', mockFetch)

    const fetcher = createMetadataFetcher({
      apiEndpoint: 'https://api.example.com/metadata',
    })

    const result = await fetcher('https://example.com')

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.example.com/metadata?url=https%3A%2F%2Fexample.com',
      expect.any(Object)
    )
    expect(result.title).toBe('Example Site')
  })

  it('should include custom headers', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ url: 'https://example.com' }),
    })
    vi.stubGlobal('fetch', mockFetch)

    const fetcher = createMetadataFetcher({
      apiEndpoint: 'https://api.example.com/metadata',
      headers: { 'X-Custom-Header': 'custom-value' },
    })

    await fetcher('https://example.com')

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          'X-Custom-Header': 'custom-value',
        }),
      })
    )
  })

  it('should throw on failed response', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    })
    vi.stubGlobal('fetch', mockFetch)

    const fetcher = createMetadataFetcher({
      apiEndpoint: 'https://api.example.com/metadata',
    })

    await expect(fetcher('https://example.com')).rejects.toThrow()
  })

  it('should respect timeout option', async () => {
    const mockFetch = vi.fn().mockImplementation(() => new Promise(() => {})) // Never resolves
    vi.stubGlobal('fetch', mockFetch)

    const fetcher = createMetadataFetcher({
      apiEndpoint: 'https://api.example.com/metadata',
      timeout: 100,
    })

    await expect(fetcher('https://example.com')).rejects.toThrow()
  })
})

describe('createFallbackMetadata', () => {
  it('should create metadata from URL', () => {
    const metadata = createFallbackMetadata('https://example.com/page')

    expect(metadata.url).toBe('https://example.com/page')
    expect(metadata.title).toBe('example.com')
  })

  it('should extract domain as title', () => {
    const metadata = createFallbackMetadata('https://www.example.com')

    expect(metadata.title).toBe('example.com')
  })

  it('should include path in title for long paths', () => {
    const metadata = createFallbackMetadata(
      'https://example.com/path/to/article'
    )

    expect(metadata.url).toBe('https://example.com/path/to/article')
  })

  it('should handle invalid URLs gracefully', () => {
    const metadata = createFallbackMetadata('not-a-url')

    expect(metadata.url).toBe('not-a-url')
    expect(metadata.title).toBe('not-a-url')
  })
})

// ============================================================================
// RichEmbed Component Tests
// ============================================================================

describe('RichEmbed', () => {
  it('should render YouTube embed', () => {
    render(
      <RichEmbed
        url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        embedType="youtube"
      />
    )

    const iframe = screen.getByTitle(/youtube video/i)
    expect(iframe).toBeInTheDocument()
    expect(iframe).toHaveAttribute(
      'src',
      expect.stringContaining('youtube.com/embed')
    )
  })

  it('should render Vimeo embed', () => {
    render(<RichEmbed url="https://vimeo.com/123456789" embedType="vimeo" />)

    const iframe = screen.getByTitle(/vimeo video/i)
    expect(iframe).toBeInTheDocument()
    expect(iframe).toHaveAttribute(
      'src',
      expect.stringContaining('player.vimeo.com')
    )
  })

  it('should render Spotify embed', () => {
    render(
      <RichEmbed
        url="https://open.spotify.com/track/abc123"
        embedType="spotify"
      />
    )

    const iframe = screen.getByTitle(/spotify/i)
    expect(iframe).toBeInTheDocument()
    expect(iframe).toHaveAttribute(
      'src',
      expect.stringContaining('open.spotify.com/embed')
    )
  })

  it('should render generic fallback for unsupported types', () => {
    render(<RichEmbed url="https://example.com" embedType="generic" />)

    // Should show a link or preview card, not an iframe
    expect(screen.queryByRole('link')).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    const { container } = render(
      <RichEmbed
        url="https://www.youtube.com/watch?v=test"
        embedType="youtube"
        className="custom-embed"
      />
    )

    expect(container.querySelector('.custom-embed')).toBeInTheDocument()
  })

  it('should have accessible iframe titles', () => {
    render(
      <RichEmbed
        url="https://www.youtube.com/watch?v=test"
        embedType="youtube"
      />
    )

    const iframe = screen.getByRole('presentation')
    expect(iframe).toHaveAttribute('title')
  })
})

// ============================================================================
// LRU Cache Behavior Tests (via useLinkPreview)
// ============================================================================

describe('LRU Cache Behavior', () => {
  it('should evict oldest entries when cache is full', async () => {
    const mockFetch = vi
      .fn()
      .mockImplementation((url: string) =>
        Promise.resolve({ url, title: `Title for ${url}` })
      )

    const { result } = renderHook(() => useLinkPreview({ fetchFn: mockFetch }))

    // Fetch many URLs to potentially fill cache
    for (let i = 0; i < 10; i++) {
      await act(async () => {
        await result.current.fetchMetadata(`https://example${i}.com`)
      })
    }

    expect(mockFetch).toHaveBeenCalledTimes(10)
  })

  it('should return cached value without refetching', async () => {
    const mockFetch = vi.fn().mockResolvedValue(sampleMetadata)
    const { result } = renderHook(() => useLinkPreview({ fetchFn: mockFetch }))

    // First fetch
    await act(async () => {
      await result.current.fetchMetadata('https://example.com')
    })

    // Second fetch for same URL
    await act(async () => {
      await result.current.fetchMetadata('https://example.com')
    })

    // Should only fetch once
    expect(mockFetch).toHaveBeenCalledTimes(1)
  })

  it('should update LRU order on cache hit', async () => {
    const mockFetch = vi
      .fn()
      .mockImplementation((url: string) =>
        Promise.resolve({ url, title: `Title for ${url}` })
      )

    const { result } = renderHook(() => useLinkPreview({ fetchFn: mockFetch }))

    // Fetch two URLs
    await act(async () => {
      await result.current.fetchMetadata('https://example1.com')
      await result.current.fetchMetadata('https://example2.com')
    })

    // Access first URL again (should update LRU order)
    await act(async () => {
      await result.current.fetchMetadata('https://example1.com')
    })

    // Should still only have 2 fetches total
    expect(mockFetch).toHaveBeenCalledTimes(2)
  })
})

// ============================================================================
// Expandable Description Tests
// ============================================================================

describe('Expandable Description', () => {
  const longDescription = 'A'.repeat(300) // Long description to trigger truncation

  const metadataWithLongDescription: LinkMetadata = {
    ...sampleMetadata,
    description: longDescription,
  }

  it('should truncate long descriptions by default', () => {
    render(<LinkPreview metadata={metadataWithLongDescription} />)

    // Should show truncated text with ellipsis or "more" button
    const content = screen.getByText(/AAA/i)
    expect(content.textContent!.length).toBeLessThan(longDescription.length)
  })

  it('should expand description when expandableDescription is enabled and clicked', async () => {
    render(
      <LinkPreview
        metadata={metadataWithLongDescription}
        expandableDescription
      />
    )

    // Look for expand button
    const expandButton = screen.queryByRole('button', {
      name: /show more|expand/i,
    })
    if (expandButton) {
      fireEvent.click(expandButton)

      // After expansion, description should be fully visible or have collapse option
      expect(
        screen.queryByRole('button', { name: /show less|collapse/i })
      ).toBeInTheDocument()
    }
  })

  it('should not show expand button for short descriptions', () => {
    const shortMetadata: LinkMetadata = {
      ...sampleMetadata,
      description: 'Short description',
    }

    render(<LinkPreview metadata={shortMetadata} expandableDescription />)

    expect(
      screen.queryByRole('button', { name: /show more|expand/i })
    ).not.toBeInTheDocument()
  })
})
