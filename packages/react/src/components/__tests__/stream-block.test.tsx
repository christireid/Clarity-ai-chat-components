import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import type { StreamableValueLike } from '../../hooks/streaming/use-streamable-ui'
import { StreamBlock } from '../stream-block'

vi.mock('@clarity-chat/primitives', () => ({
  cn: (...classes: Array<string | undefined>) =>
    classes.filter(Boolean).join(' '),
}))

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
  it('supports streamable value objects', async () => {
    const listeners = new Set<(value: string) => void>()
    const streamable: StreamableValueLike<string> = {
      subscribe(listener) {
        listeners.add(listener)
        return () => listeners.delete(listener)
      },
    }

    render(<StreamBlock source={streamable} />)

    const [listener] = Array.from(listeners)
    listener?.('first')

    await waitFor(() => {
      expect(screen.getByText('first')).toBeInTheDocument()
    })
  })
})
