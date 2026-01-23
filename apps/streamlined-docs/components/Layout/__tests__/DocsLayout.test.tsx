import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { DocsLayout } from '../DocsLayout'

// Mock the navigation modules
vi.mock('next/navigation', () => ({
  usePathname: () => '/learn/quick-start',
}))

// Mock the child components
vi.mock('@/components/Navigation/Sidebar', () => ({
  Sidebar: ({ navigation }: { navigation: unknown[] }) => (
    <nav data-testid="sidebar">Sidebar ({navigation.length} items)</nav>
  ),
}))

vi.mock('@/components/Enhanced/TableOfContents', () => ({
  TableOfContents: () => <div data-testid="toc">Table of Contents</div>,
}))

vi.mock('@/components/Navigation/AutoPagination', () => ({
  AutoPagination: () => <nav data-testid="pagination">Pagination</nav>,
}))

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      store = {}
    }),
  }
})()

Object.defineProperty(window, 'localStorage', { value: localStorageMock })

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock requestAnimationFrame
Object.defineProperty(window, 'requestAnimationFrame', {
  value: vi.fn((cb: (time: number) => void) => {
    cb(0)
    return 0
  }),
})

Object.defineProperty(window, 'cancelAnimationFrame', {
  value: vi.fn(),
})

const mockNavigation = [
  {
    title: 'Getting Started',
    items: [
      { title: 'Quick Start', href: '/learn/quick-start' },
      { title: 'Installation', href: '/learn/installation' },
    ],
  },
]

describe('DocsLayout', () => {
  beforeEach(() => {
    localStorageMock.clear()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should render skeleton while mounting', () => {
    // The skeleton is shown before mounting
    const { container } = render(
      <DocsLayout navigation={mockNavigation}>
        <div>Content</div>
      </DocsLayout>
    )

    // Initially shows skeleton (animate-pulse elements)
    expect(container.querySelector('.animate-pulse')).toBeTruthy()
  })

  it('should render content after mounting', async () => {
    render(
      <DocsLayout navigation={mockNavigation}>
        <div data-testid="content">Page Content</div>
      </DocsLayout>
    )

    await waitFor(() => {
      expect(screen.getByTestId('content')).toBeInTheDocument()
    })
  })

  it('should render sidebar with navigation', async () => {
    render(
      <DocsLayout navigation={mockNavigation}>
        <div>Content</div>
      </DocsLayout>
    )

    await waitFor(() => {
      expect(screen.getByTestId('sidebar')).toBeInTheDocument()
    })
  })

  it('should render table of contents', async () => {
    render(
      <DocsLayout navigation={mockNavigation}>
        <div>Content</div>
      </DocsLayout>
    )

    await waitFor(() => {
      expect(screen.getByTestId('toc')).toBeInTheDocument()
    })
  })

  it('should render pagination', async () => {
    render(
      <DocsLayout navigation={mockNavigation}>
        <div>Content</div>
      </DocsLayout>
    )

    await waitFor(() => {
      expect(screen.getByTestId('pagination')).toBeInTheDocument()
    })
  })

  it('should have accessible sidebar toggle button', async () => {
    render(
      <DocsLayout navigation={mockNavigation}>
        <div>Content</div>
      </DocsLayout>
    )

    await waitFor(() => {
      const toggleButton = screen.getByRole('button', { name: /hide sidebar/i })
      expect(toggleButton).toBeInTheDocument()
      expect(toggleButton).toHaveAttribute('aria-expanded', 'true')
      expect(toggleButton).toHaveAttribute('aria-controls', 'docs-sidebar')
    })
  })

  it('should toggle sidebar visibility when button clicked', async () => {
    render(
      <DocsLayout navigation={mockNavigation}>
        <div>Content</div>
      </DocsLayout>
    )

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /hide sidebar/i })
      ).toBeInTheDocument()
    })

    const toggleButton = screen.getByRole('button', { name: /hide sidebar/i })
    fireEvent.click(toggleButton)

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /show sidebar/i })
      ).toBeInTheDocument()
    })
  })

  it('should have accessible resize handle', async () => {
    render(
      <DocsLayout navigation={mockNavigation}>
        <div>Content</div>
      </DocsLayout>
    )

    await waitFor(() => {
      const resizeHandle = screen.getByRole('separator')
      expect(resizeHandle).toBeInTheDocument()
      expect(resizeHandle).toHaveAttribute('aria-orientation', 'vertical')
      expect(resizeHandle).toHaveAttribute('aria-valuenow')
      expect(resizeHandle).toHaveAttribute('aria-valuemin', '200')
      expect(resizeHandle).toHaveAttribute('aria-valuemax', '400')
    })
  })

  it('should persist sidebar state to localStorage', async () => {
    render(
      <DocsLayout navigation={mockNavigation}>
        <div>Content</div>
      </DocsLayout>
    )

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /hide sidebar/i })
      ).toBeInTheDocument()
    })

    const toggleButton = screen.getByRole('button', { name: /hide sidebar/i })
    fireEvent.click(toggleButton)

    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'docs-sidebar-visible',
        'false'
      )
    })
  })

  it('should have mobile sidebar toggle', async () => {
    render(
      <DocsLayout navigation={mockNavigation}>
        <div>Content</div>
      </DocsLayout>
    )

    await waitFor(() => {
      const mobileToggle = screen.getByRole('button', {
        name: /open navigation menu/i,
      })
      expect(mobileToggle).toBeInTheDocument()
      expect(mobileToggle).toHaveAttribute(
        'aria-controls',
        'docs-sidebar-mobile'
      )
    })
  })

  it('should toggle mobile sidebar when mobile button clicked', async () => {
    render(
      <DocsLayout navigation={mockNavigation}>
        <div>Content</div>
      </DocsLayout>
    )

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /open navigation menu/i })
      ).toBeInTheDocument()
    })

    const mobileToggle = screen.getByRole('button', {
      name: /open navigation menu/i,
    })
    fireEvent.click(mobileToggle)

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /close navigation menu/i })
      ).toBeInTheDocument()
    })
  })

  it('should have proper article structure for content', async () => {
    render(
      <DocsLayout navigation={mockNavigation}>
        <h1>Test Heading</h1>
        <p>Test content</p>
      </DocsLayout>
    )

    await waitFor(() => {
      const article = document.querySelector('article')
      expect(article).toBeInTheDocument()
      expect(article).toHaveClass('prose')
    })
  })

  it('should handle keyboard navigation on resize handle', async () => {
    render(
      <DocsLayout navigation={mockNavigation}>
        <div>Content</div>
      </DocsLayout>
    )

    await waitFor(() => {
      expect(screen.getByRole('separator')).toBeInTheDocument()
    })

    const resizeHandle = screen.getByRole('separator')

    // Should be focusable
    expect(resizeHandle).toHaveAttribute('tabIndex', '0')

    // Should have keyboard instructions in aria-label
    expect(resizeHandle.getAttribute('aria-label')).toContain(
      'left/right arrows'
    )
  })
})
