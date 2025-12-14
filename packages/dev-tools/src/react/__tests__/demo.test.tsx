/**
 * Tests for Demo page components
 * Tests rendering, theme switching, and component showcases
 */

import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { DemoPage, ButtonsDemo, StatusBadgesDemo } from '../components/demo'

describe('DemoPage', () => {
  it('renders with default theme', () => {
    render(<DemoPage />)

    expect(screen.getByText('Clarity Dev Tools Demo')).toBeTruthy()
    expect(
      screen.getByText('Premium Developer Tools for AI Chat Applications')
    ).toBeTruthy()
  })

  it('renders with light theme', () => {
    const { container } = render(<DemoPage theme="light" />)

    const root = container.querySelector('.demo-page')
    expect(root).toBeTruthy()
    expect(root?.classList.contains('dev-tools-dark')).toBe(false)
  })

  it('renders with dark theme', () => {
    const { container } = render(<DemoPage theme="dark" />)

    const root = container.querySelector('.demo-page')
    expect(root?.classList.contains('dev-tools-dark')).toBe(true)
  })

  it('shows theme selector', () => {
    render(<DemoPage />)

    const select = screen.getByRole('combobox', { name: /select theme/i })
    expect(select).toBeTruthy()
    expect(select).toHaveProperty('value', 'auto')
  })

  it('changes theme when selected', () => {
    const { container } = render(<DemoPage theme="light" />)

    const select = screen.getByRole('combobox', { name: /select theme/i })
    fireEvent.change(select, { target: { value: 'dark' } })

    const root = container.querySelector('.demo-page')
    expect(root?.classList.contains('dev-tools-dark')).toBe(true)
  })

  it('toggles between dashboard and icons view', () => {
    render(<DemoPage />)

    // Initially shows dashboard
    const toggleButton = screen.getByRole('button', { name: /show icons/i })
    expect(toggleButton).toBeTruthy()

    // Click to show icons
    fireEvent.click(toggleButton)
    expect(screen.getByText('Icon Library')).toBeTruthy()

    // Click to show dashboard again
    const showDashboardButton = screen.getByRole('button', {
      name: /show dashboard/i,
    })
    fireEvent.click(showDashboardButton)
  })

  it('renders features list', () => {
    render(<DemoPage />)

    expect(screen.getByText('Features')).toBeTruthy()
    expect(screen.getByText('React 19 with useOptimistic')).toBeTruthy()
    expect(screen.getByText('90+ CSS Custom Properties')).toBeTruthy()
    expect(screen.getByText('Light & Dark Mode')).toBeTruthy()
    expect(screen.getByText('Keyboard Navigation')).toBeTruthy()
    expect(screen.getByText('ARIA Accessibility')).toBeTruthy()
  })

  it('renders header content', () => {
    const { container } = render(<DemoPage />)

    const header = container.querySelector('.demo-header')
    expect(header).toBeTruthy()
    expect(header?.querySelector('h1')?.textContent).toBe(
      'Clarity Dev Tools Demo'
    )
  })
})

describe('ButtonsDemo', () => {
  it('renders all button variants', () => {
    render(<ButtonsDemo />)

    expect(screen.getByText('Button Variants')).toBeTruthy()
    expect(screen.getByRole('button', { name: /primary/i })).toBeTruthy()
    expect(screen.getByRole('button', { name: /secondary/i })).toBeTruthy()
    expect(screen.getByRole('button', { name: /ghost/i })).toBeTruthy()
    expect(screen.getByRole('button', { name: /danger/i })).toBeTruthy()
  })

  it('renders button sizes', () => {
    render(<ButtonsDemo />)

    expect(screen.getByRole('button', { name: /small/i })).toBeTruthy()
    expect(screen.getByRole('button', { name: /medium/i })).toBeTruthy()
    expect(screen.getByRole('button', { name: /large/i })).toBeTruthy()
  })

  it('renders disabled button', () => {
    render(<ButtonsDemo />)

    const disabledButton = screen.getByRole('button', { name: /disabled/i })
    expect(disabledButton).toHaveProperty('disabled', true)
  })

  it('renders button with icon', () => {
    render(<ButtonsDemo />)

    const iconButton = screen.getByRole('button', { name: /with icon/i })
    expect(iconButton).toBeTruthy()
    expect(iconButton.querySelector('svg')).toBeTruthy()
  })

  it('renders icon-only button', () => {
    render(<ButtonsDemo />)

    const iconOnlyButton = screen.getByRole('button', { name: /icon only/i })
    expect(iconOnlyButton).toBeTruthy()
    expect(iconOnlyButton.querySelector('svg')).toBeTruthy()
  })
})

describe('StatusBadgesDemo', () => {
  it('renders all status badges', () => {
    render(<StatusBadgesDemo />)

    expect(screen.getByText('Status Badges')).toBeTruthy()
    expect(screen.getByText('Success')).toBeTruthy()
    expect(screen.getByText('Warning')).toBeTruthy()
    expect(screen.getByText('Error')).toBeTruthy()
    expect(screen.getByText('Pending')).toBeTruthy()
  })

  it('badges have correct class names', () => {
    const { container } = render(<StatusBadgesDemo />)

    expect(container.querySelector('.status-badge.success')).toBeTruthy()
    expect(container.querySelector('.status-badge.warning')).toBeTruthy()
    expect(container.querySelector('.status-badge.error')).toBeTruthy()
    expect(container.querySelector('.status-badge.pending')).toBeTruthy()
  })

  it('badges contain icons', () => {
    render(<StatusBadgesDemo />)

    const badges = document.querySelectorAll('.status-badge')
    badges.forEach((badge) => {
      expect(badge.querySelector('svg')).toBeTruthy()
    })
  })
})
