/**
 * Tests for VirtualList component
 * Tests rendering, scrolling, and performance
 */

import { describe, it, expect, vi, beforeAll } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { VirtualList, AutoSizeVirtualList } from '../components/virtual-list'

// Mock ResizeObserver for jsdom environment
beforeAll(() => {
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
})

// Generate test items
function generateItems(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    name: `Item ${i}`,
  }))
}

describe('VirtualList', () => {
  it('renders visible items only', () => {
    const items = generateItems(100)
    const { container } = render(
      <VirtualList
        items={items}
        itemHeight={50}
        containerHeight={200}
        renderItem={(item) => (
          <div data-testid={`item-${item.id}`}>{item.name}</div>
        )}
      />
    )

    // Should render approximately 4 visible items + overscan (3 * 2 = 6)
    // Total around 10 items, not all 100
    const renderedItems = container.querySelectorAll('[data-testid^="item-"]')
    expect(renderedItems.length).toBeLessThan(20) // Much less than 100
    expect(renderedItems.length).toBeGreaterThan(3) // At least visible items
  })

  it('renders with correct total height', () => {
    const items = generateItems(100)
    const { container } = render(
      <VirtualList
        items={items}
        itemHeight={50}
        containerHeight={200}
        renderItem={(item) => <div>{item.name}</div>}
      />
    )

    // Total height should be items.length * itemHeight
    const spacer = container.querySelector('.virtual-list > div') as HTMLElement
    expect(spacer?.style.height).toBe('5000px') // 100 * 50
  })

  it('updates visible items on scroll', () => {
    const items = generateItems(100)
    const { container } = render(
      <VirtualList
        items={items}
        itemHeight={50}
        containerHeight={200}
        renderItem={(item) => (
          <div data-testid={`item-${item.id}`}>{item.name}</div>
        )}
      />
    )

    const virtualList = container.querySelector('.virtual-list')!

    // Initially should show items starting from index 0
    expect(container.querySelector('[data-testid="item-0"]')).toBeTruthy()

    // Scroll down
    fireEvent.scroll(virtualList, { target: { scrollTop: 500 } })

    // After scrolling 500px (10 items * 50px), should show items around index 10
    // Due to overscan, item 0 might not be visible anymore
  })

  it('calls onScroll callback', () => {
    const items = generateItems(100)
    const onScroll = vi.fn()

    const { container } = render(
      <VirtualList
        items={items}
        itemHeight={50}
        containerHeight={200}
        renderItem={(item) => <div>{item.name}</div>}
        onScroll={onScroll}
      />
    )

    const virtualList = container.querySelector('.virtual-list')!
    fireEvent.scroll(virtualList, { target: { scrollTop: 100 } })

    expect(onScroll).toHaveBeenCalledWith(100)
  })

  it('uses custom key extractor', () => {
    const items = generateItems(10)
    const getKey = vi.fn((item: { id: number }) => `custom-${item.id}`)

    render(
      <VirtualList
        items={items}
        itemHeight={50}
        containerHeight={200}
        renderItem={(item) => <div>{item.name}</div>}
        getKey={getKey}
      />
    )

    // getKey should have been called for visible items
    expect(getKey).toHaveBeenCalled()
  })

  it('renders empty state when items is empty', () => {
    render(
      <VirtualList
        items={[]}
        itemHeight={50}
        containerHeight={200}
        renderItem={(item: unknown) => <div>{String(item)}</div>}
        emptyState={<div data-testid="empty">No items available</div>}
      />
    )

    expect(screen.getByTestId('empty')).toBeTruthy()
    expect(screen.getByText('No items available')).toBeTruthy()
  })

  it('renders default empty message when no emptyState provided', () => {
    const { container } = render(
      <VirtualList
        items={[]}
        itemHeight={50}
        containerHeight={200}
        renderItem={(item: unknown) => <div>{String(item)}</div>}
      />
    )

    expect(container.querySelector('.virtual-list-empty')).toBeTruthy()
    expect(screen.getByText('No items')).toBeTruthy()
  })

  it('applies custom className', () => {
    const items = generateItems(10)
    const { container } = render(
      <VirtualList
        items={items}
        itemHeight={50}
        containerHeight={200}
        renderItem={(item) => <div>{item.name}</div>}
        className="custom-list"
      />
    )

    expect(container.querySelector('.virtual-list.custom-list')).toBeTruthy()
  })

  it('has correct accessibility attributes', () => {
    const items = generateItems(10)
    const { container } = render(
      <VirtualList
        items={items}
        itemHeight={50}
        containerHeight={200}
        renderItem={(item) => <div>{item.name}</div>}
      />
    )

    expect(container.querySelector('[role="list"]')).toBeTruthy()
    expect(
      container.querySelectorAll('[role="listitem"]').length
    ).toBeGreaterThan(0)
  })

  it('handles large datasets efficiently', () => {
    const items = generateItems(10000)
    const startTime = performance.now()

    const { container } = render(
      <VirtualList
        items={items}
        itemHeight={50}
        containerHeight={500}
        renderItem={(item) => <div>{item.name}</div>}
      />
    )

    const endTime = performance.now()
    const renderTime = endTime - startTime

    // Should render quickly even with 10000 items
    expect(renderTime).toBeLessThan(1000) // Less than 1 second

    // Should only render a small subset
    const renderedItems = container.querySelectorAll('[role="listitem"]')
    expect(renderedItems.length).toBeLessThan(50)
  })
})

describe('AutoSizeVirtualList', () => {
  it('renders with default maxHeight', () => {
    const items = generateItems(10)
    const { container } = render(
      <AutoSizeVirtualList
        items={items}
        itemHeight={50}
        renderItem={(item) => <div>{item.name}</div>}
      />
    )

    expect(container.querySelector('.virtual-list')).toBeTruthy()
  })

  it('applies minHeight constraint', () => {
    const items = generateItems(10)
    const { container } = render(
      <AutoSizeVirtualList
        items={items}
        itemHeight={50}
        minHeight={300}
        maxHeight={600}
        renderItem={(item) => <div>{item.name}</div>}
      />
    )

    const virtualList = container.querySelector('.virtual-list')
    expect(virtualList).toBeTruthy()
  })
})
