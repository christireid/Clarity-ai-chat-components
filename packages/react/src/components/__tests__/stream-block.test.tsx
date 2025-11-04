import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { StreamBlock } from '../stream-block'

describe('StreamBlock', () => {
  it('renders fallback when no content is available', () => {
    render(<StreamBlock fallback={<span>No content</span>} />)

    expect(screen.getByText('No content')).toBeInTheDocument()
  })

  it('renders streamed values from an async iterable', async () => {
    async function* generator() {
      yield 'Hello'
      await Promise.resolve()
      yield 'World'
    }

    render(<StreamBlock source={generator()} />)

    await waitFor(() => {
      expect(screen.getByText('World')).toBeInTheDocument()
    })

    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('renders error fallback when stream fails', async () => {
    async function* generator() {
      yield 'Partial'
      throw new Error('boom')
    }

    render(<StreamBlock source={generator()} errorFallback="Error" />)

    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument()
    })
  })
})

