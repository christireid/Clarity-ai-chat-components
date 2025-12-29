/**
 * Sonner Toast Component Tests
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'

// Use vi.hoisted() to define mocks that will be hoisted with vi.mock
const { mockToast } = vi.hoisted(() => ({
  mockToast: {
    success: vi.fn().mockReturnValue('toast-1'),
    error: vi.fn().mockReturnValue('toast-2'),
    info: vi.fn().mockReturnValue('toast-3'),
    warning: vi.fn().mockReturnValue('toast-4'),
    loading: vi.fn().mockReturnValue('toast-5'),
    promise: vi.fn().mockReturnValue({ unwrap: () => Promise.resolve() }),
    custom: vi.fn().mockReturnValue('toast-6'),
    message: vi.fn().mockReturnValue('toast-7'),
    dismiss: vi.fn(),
  },
}))

vi.mock('sonner', () => ({
  Toaster: ({ position, richColors, closeButton }: any) => (
    <div
      data-testid="sonner-toaster"
      data-position={position}
      data-rich-colors={String(richColors)}
      data-close-button={String(closeButton)}
    />
  ),
  toast: mockToast,
}))

import { ClarityToaster, toast } from '../sonner-toast'

describe('ClarityToaster', () => {
  describe('Rendering', () => {
    it('should render the Sonner Toaster', () => {
      render(<ClarityToaster />)

      expect(screen.getByTestId('sonner-toaster')).toBeInTheDocument()
    })

    it('should use default position of bottom-right', () => {
      render(<ClarityToaster />)

      expect(screen.getByTestId('sonner-toaster')).toHaveAttribute(
        'data-position',
        'bottom-right'
      )
    })

    it('should apply custom position', () => {
      render(<ClarityToaster position="top-center" />)

      expect(screen.getByTestId('sonner-toaster')).toHaveAttribute(
        'data-position',
        'top-center'
      )
    })

    it('should enable rich colors by default', () => {
      render(<ClarityToaster />)

      expect(screen.getByTestId('sonner-toaster')).toHaveAttribute(
        'data-rich-colors',
        'true'
      )
    })

    it('should enable close button by default', () => {
      render(<ClarityToaster />)

      expect(screen.getByTestId('sonner-toaster')).toHaveAttribute(
        'data-close-button',
        'true'
      )
    })

    it('should allow disabling rich colors', () => {
      render(<ClarityToaster richColors={false} />)

      expect(screen.getByTestId('sonner-toaster')).toHaveAttribute(
        'data-rich-colors',
        'false'
      )
    })
  })

  describe('displayName', () => {
    it('should have correct displayName', () => {
      expect(ClarityToaster.displayName).toBe('ClarityToaster')
    })
  })
})

describe('toast API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('toast.success', () => {
    it('should call sonner toast.success with message', () => {
      toast.success('Success message')

      expect(mockToast.success).toHaveBeenCalledWith(
        'Success message',
        expect.any(Object)
      )
    })

    it('should support title option', () => {
      toast.success('Details here', { title: 'Success!' })

      expect(mockToast.success).toHaveBeenCalledWith('Success!', {
        description: 'Details here',
        duration: undefined,
        id: undefined,
        action: undefined,
        cancel: undefined,
        onDismiss: undefined,
        onAutoClose: undefined,
      })
    })

    it('should support duration option', () => {
      toast.success('Message', { duration: 5000 })

      expect(mockToast.success).toHaveBeenCalledWith(
        'Message',
        expect.objectContaining({ duration: 5000 })
      )
    })

    it('should return toast ID', () => {
      const id = toast.success('Message')
      expect(id).toBe('toast-1')
    })
  })

  describe('toast.error', () => {
    it('should call sonner toast.error', () => {
      toast.error('Error message')

      expect(mockToast.error).toHaveBeenCalledWith(
        'Error message',
        expect.any(Object)
      )
    })

    it('should support action option', () => {
      const onClick = vi.fn()
      toast.error('Failed', {
        action: { label: 'Retry', onClick },
      })

      expect(mockToast.error).toHaveBeenCalledWith(
        'Failed',
        expect.objectContaining({
          action: { label: 'Retry', onClick },
        })
      )
    })
  })

  describe('toast.info', () => {
    it('should call sonner toast.info', () => {
      toast.info('Info message')

      expect(mockToast.info).toHaveBeenCalledWith(
        'Info message',
        expect.any(Object)
      )
    })
  })

  describe('toast.warning', () => {
    it('should call sonner toast.warning', () => {
      toast.warning('Warning message')

      expect(mockToast.warning).toHaveBeenCalledWith(
        'Warning message',
        expect.any(Object)
      )
    })
  })

  describe('toast.loading', () => {
    it('should call sonner toast.loading', () => {
      toast.loading('Loading...')

      expect(mockToast.loading).toHaveBeenCalledWith('Loading...', {
        id: undefined,
        description: undefined,
        onDismiss: undefined,
      })
    })
  })

  describe('toast.promise', () => {
    it('should call sonner toast.promise', () => {
      const promise = Promise.resolve('data')
      toast.promise(promise, {
        loading: 'Loading...',
        success: 'Done!',
        error: 'Failed',
      })

      expect(mockToast.promise).toHaveBeenCalledWith(promise, {
        loading: 'Loading...',
        success: 'Done!',
        error: 'Failed',
        description: undefined,
        duration: undefined,
      })
    })
  })

  describe('toast.custom', () => {
    it('should call sonner toast.custom with render function', () => {
      const content = <div>Custom content</div>
      toast.custom(content)

      expect(mockToast.custom).toHaveBeenCalledWith(
        expect.any(Function),
        expect.any(Object)
      )
    })
  })

  describe('toast.message', () => {
    it('should call sonner toast.message', () => {
      toast.message('Neutral message')

      expect(mockToast.message).toHaveBeenCalledWith(
        'Neutral message',
        expect.any(Object)
      )
    })
  })

  describe('toast.dismiss', () => {
    it('should call sonner toast.dismiss with ID', () => {
      toast.dismiss('toast-1')

      expect(mockToast.dismiss).toHaveBeenCalledWith('toast-1')
    })

    it('should call sonner toast.dismiss without ID to dismiss all', () => {
      toast.dismiss()

      expect(mockToast.dismiss).toHaveBeenCalledWith()
    })
  })
})
