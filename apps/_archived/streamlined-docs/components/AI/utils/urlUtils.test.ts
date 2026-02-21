/**
 * URL Utilities Tests
 *
 * @vitest-environment happy-dom
 */

import { describe, it, expect } from 'vitest'
import {
  generateUrlFromTitle,
  normalizeSourceUrl,
  normalizeLinksInContent,
} from './urlUtils'

describe('generateUrlFromTitle', () => {
  it('returns /learn for empty title', () => {
    expect(generateUrlFromTitle('')).toBe('/learn')
    expect(generateUrlFromTitle('   ')).toBe('/learn')
  })

  it('maps getting started to /learn', () => {
    expect(generateUrlFromTitle('Getting Started Guide')).toBe('/learn')
    expect(generateUrlFromTitle('Quickstart')).toBe('/learn')
    expect(generateUrlFromTitle('Introduction to Clarity')).toBe('/learn')
  })

  it('maps installation to /guides/installation', () => {
    expect(generateUrlFromTitle('Installation Guide')).toBe(
      '/guides/installation'
    )
  })

  it('maps theming to /guides/theming', () => {
    expect(generateUrlFromTitle('Theme Customization')).toBe('/guides/theming')
    expect(generateUrlFromTitle('Styling Guide')).toBe('/guides/theming')
  })

  it('maps hooks to /reference/hooks', () => {
    expect(generateUrlFromTitle('Custom Hooks Reference')).toBe(
      '/reference/hooks'
    )
  })

  it('maps components to /reference/components', () => {
    expect(generateUrlFromTitle('UI Components')).toBe('/reference/components')
  })

  it('returns /learn for unmatched titles', () => {
    expect(generateUrlFromTitle('Random Topic')).toBe('/learn')
  })

  it('is case insensitive', () => {
    expect(generateUrlFromTitle('GETTING STARTED')).toBe('/learn')
    expect(generateUrlFromTitle('Installation')).toBe('/guides/installation')
  })
})

describe('normalizeSourceUrl', () => {
  it('returns title-based URL for empty URL', () => {
    expect(normalizeSourceUrl('', 'Getting Started')).toBe('/learn')
    expect(normalizeSourceUrl('#', 'Installation')).toBe('/guides/installation')
  })

  it('returns title-based URL for invalid URL', () => {
    expect(normalizeSourceUrl('undefined', 'Hooks')).toBe('/reference/hooks')
    expect(normalizeSourceUrl('   ', 'Components')).toBe(
      '/reference/components'
    )
  })

  it('preserves absolute URLs', () => {
    expect(normalizeSourceUrl('https://example.com', 'Test')).toBe(
      'https://example.com'
    )
    expect(normalizeSourceUrl('http://example.com/path', 'Test')).toBe(
      'http://example.com/path'
    )
  })

  it('preserves valid documentation paths', () => {
    expect(normalizeSourceUrl('/learn', 'Test')).toBe('/learn')
    expect(normalizeSourceUrl('/guides/theming', 'Test')).toBe(
      '/guides/theming'
    )
    expect(normalizeSourceUrl('/reference/hooks/useChat', 'Test')).toBe(
      '/reference/hooks/useChat'
    )
    expect(normalizeSourceUrl('/examples/basic', 'Test')).toBe(
      '/examples/basic'
    )
  })

  it('falls back to title-based URL for invalid paths', () => {
    expect(normalizeSourceUrl('/invalid/path', 'Getting Started')).toBe(
      '/learn'
    )
    expect(normalizeSourceUrl('relative/path', 'Hooks')).toBe(
      '/reference/hooks'
    )
  })
})

describe('normalizeLinksInContent', () => {
  it('preserves external links', () => {
    const content = 'Check out [Google](https://google.com)'
    expect(normalizeLinksInContent(content)).toBe(content)
  })

  it('preserves anchor links', () => {
    const content = 'See [section](#my-section)'
    expect(normalizeLinksInContent(content)).toBe(content)
  })

  it('normalizes invalid internal links', () => {
    const content = 'Read the [Getting Started](invalid-path) guide'
    const result = normalizeLinksInContent(content)
    expect(result).toBe('Read the [Getting Started](/learn) guide')
  })

  it('preserves valid documentation links', () => {
    const content = 'Check the [Hooks](/reference/hooks) reference'
    expect(normalizeLinksInContent(content)).toBe(content)
  })

  it('handles multiple links', () => {
    const content = `
Start with [intro](bad) then check [hooks](hook-guide).
External [docs](https://docs.example.com) are also helpful.
`
    const result = normalizeLinksInContent(content)

    expect(result).toContain('[intro](/learn)')
    expect(result).toContain('[hooks](/reference/hooks)')
    expect(result).toContain('[docs](https://docs.example.com)')
  })

  it('handles content without links', () => {
    const content = 'Just some plain text without any links.'
    expect(normalizeLinksInContent(content)).toBe(content)
  })
})
