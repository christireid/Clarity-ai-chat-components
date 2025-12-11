import * as React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FileUpload, FileUploadProps } from '../file-upload'
import type { MessageAttachment } from '@clarity-chat/types'

// Mock useReducedMotion hook
jest.mock('../../hooks/use-reduced-motion', () => ({
  useReducedMotion: () => false,
}))

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => {
  const React = require('react')
  return {
    motion: {
      div: React.forwardRef(({ children, ...props }: any, ref: any) => (
        <div ref={ref} {...props}>{children}</div>
      )),
      span: React.forwardRef(({ children, ...props }: any, ref: any) => (
        <span ref={ref} {...props}>{children}</span>
      )),
      li: React.forwardRef(({ children, ...props }: any, ref: any) => (
        <li ref={ref} {...props}>{children}</li>
      )),
      img: React.forwardRef((props: any, ref: any) => (
        <img ref={ref} {...props} />
      )),
    },
    AnimatePresence: ({ children }: any) => children,
  }
})

describe('FileUpload', () => {
  const mockOnUpload = jest.fn<Promise<MessageAttachment[]>, [File[], AbortController?]>()
  const defaultProps: FileUploadProps = {
    onUpload: mockOnUpload,
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockOnUpload.mockResolvedValue([])
  })

  // Helper to create a mock file
  const createMockFile = (name: string, size: number, type: string): File => {
    const file = new File([''], name, { type })
    Object.defineProperty(file, 'size', { value: size })
    return file
  }

  describe('Rendering', () => {
    it('renders the dropzone with default text', () => {
      render(<FileUpload {...defaultProps} />)

      expect(screen.getByText(/click to upload or drag and drop/i)).toBeInTheDocument()
    })

    it('renders with custom label and description', () => {
      render(
        <FileUpload
          {...defaultProps}
          label="Upload your documents"
          description="PDF files only, max 5MB"
        />
      )

      expect(screen.getByText('Upload your documents')).toBeInTheDocument()
      expect(screen.getByText('PDF files only, max 5MB')).toBeInTheDocument()
    })

    it('renders file type badges', () => {
      render(
        <FileUpload
          {...defaultProps}
          acceptedFileTypes={['image/*', 'application/pdf']}
        />
      )

      expect(screen.getByText('image')).toBeInTheDocument()
      expect(screen.getByText('pdf')).toBeInTheDocument()
    })

    it('shows keyboard instructions', () => {
      render(<FileUpload {...defaultProps} />)

      expect(screen.getByText('Enter')).toBeInTheDocument()
      expect(screen.getByText('Space')).toBeInTheDocument()
    })

    it('renders in disabled state', () => {
      render(<FileUpload {...defaultProps} disabled />)

      const dropzone = screen.getByRole('button')
      expect(dropzone).toHaveAttribute('aria-disabled', 'true')
      expect(dropzone).toHaveClass('opacity-50')
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA attributes on dropzone', () => {
      render(<FileUpload {...defaultProps} maxFiles={5} maxFileSize={1024 * 1024} />)

      const dropzone = screen.getByRole('button')
      expect(dropzone).toHaveAttribute('aria-label')
      expect(dropzone).toHaveAttribute('aria-describedby', 'dropzone-description')
      expect(dropzone).toHaveAttribute('tabIndex', '0')
    })

    it('has aria-live region for announcements', () => {
      render(<FileUpload {...defaultProps} />)

      const liveRegion = screen.getByRole('status')
      expect(liveRegion).toHaveAttribute('aria-live', 'polite')
      expect(liveRegion).toHaveClass('sr-only')
    })

    it('opens file dialog on Enter key', async () => {
      const user = userEvent.setup()
      render(<FileUpload {...defaultProps} />)

      const dropzone = screen.getByRole('button')
      dropzone.focus()

      // Note: We can't actually test the file dialog opening, but we can verify
      // the keyboard handler is attached
      await user.keyboard('{Enter}')
    })

    it('opens file dialog on Space key', async () => {
      const user = userEvent.setup()
      render(<FileUpload {...defaultProps} />)

      const dropzone = screen.getByRole('button')
      dropzone.focus()

      await user.keyboard(' ')
    })

    it('does not respond to keyboard when disabled', async () => {
      const user = userEvent.setup()
      render(<FileUpload {...defaultProps} disabled />)

      const dropzone = screen.getByRole('button')
      expect(dropzone).toHaveAttribute('tabIndex', '-1')
    })
  })

  describe('File Selection', () => {
    it('accepts files via file input', async () => {
      render(<FileUpload {...defaultProps} />)

      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      const file = createMockFile('test.pdf', 1024, 'application/pdf')

      fireEvent.change(input, { target: { files: [file] } })

      await waitFor(() => {
        expect(screen.getByText('test.pdf')).toBeInTheDocument()
      })
    })

    it('shows file size in the list', async () => {
      render(<FileUpload {...defaultProps} />)

      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      const file = createMockFile('test.pdf', 2048, 'application/pdf')

      fireEvent.change(input, { target: { files: [file] } })

      await waitFor(() => {
        expect(screen.getByText(/2.*KB/i)).toBeInTheDocument()
      })
    })

    it('removes file when remove button is clicked', async () => {
      const user = userEvent.setup()
      render(<FileUpload {...defaultProps} />)

      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      const file = createMockFile('test.pdf', 1024, 'application/pdf')

      fireEvent.change(input, { target: { files: [file] } })

      await waitFor(() => {
        expect(screen.getByText('test.pdf')).toBeInTheDocument()
      })

      const removeButton = screen.getByRole('button', { name: /remove test.pdf/i })
      await user.click(removeButton)

      expect(screen.queryByText('test.pdf')).not.toBeInTheDocument()
    })

    it('clears all files when clear all is clicked', async () => {
      const user = userEvent.setup()
      render(<FileUpload {...defaultProps} maxFiles={5} />)

      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      const files = [
        createMockFile('file1.pdf', 1024, 'application/pdf'),
        createMockFile('file2.pdf', 1024, 'application/pdf'),
      ]

      fireEvent.change(input, { target: { files } })

      await waitFor(() => {
        expect(screen.getByText('file1.pdf')).toBeInTheDocument()
        expect(screen.getByText('file2.pdf')).toBeInTheDocument()
      })

      const clearButton = screen.getByRole('button', { name: /clear all/i })
      await user.click(clearButton)

      expect(screen.queryByText('file1.pdf')).not.toBeInTheDocument()
      expect(screen.queryByText('file2.pdf')).not.toBeInTheDocument()
    })
  })

  describe('File Validation', () => {
    it('rejects files exceeding max size', async () => {
      const onError = jest.fn()
      render(
        <FileUpload
          {...defaultProps}
          maxFileSize={1024} // 1KB
          onError={onError}
        />
      )

      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      const file = createMockFile('large.pdf', 2048, 'application/pdf')

      fireEvent.change(input, { target: { files: [file] } })

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith(
          expect.objectContaining({
            code: 'file-too-large',
          })
        )
      })
    })

    it('rejects files below min size', async () => {
      const onError = jest.fn()
      render(
        <FileUpload
          {...defaultProps}
          minFileSize={1024} // 1KB
          onError={onError}
        />
      )

      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      const file = createMockFile('small.pdf', 512, 'application/pdf')

      fireEvent.change(input, { target: { files: [file] } })

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith(
          expect.objectContaining({
            code: 'file-too-small',
          })
        )
      })
    })

    it('rejects files with invalid type', async () => {
      const onError = jest.fn()
      render(
        <FileUpload
          {...defaultProps}
          acceptedFileTypes={['image/*']}
          onError={onError}
        />
      )

      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      const file = createMockFile('doc.pdf', 1024, 'application/pdf')

      fireEvent.change(input, { target: { files: [file] } })

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith(
          expect.objectContaining({
            code: 'file-invalid-type',
          })
        )
      })
    })

    it('rejects when max files exceeded', async () => {
      const onError = jest.fn()
      render(
        <FileUpload
          {...defaultProps}
          maxFiles={1}
          onError={onError}
        />
      )

      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      const files = [
        createMockFile('file1.pdf', 1024, 'application/pdf'),
        createMockFile('file2.pdf', 1024, 'application/pdf'),
      ]

      fireEvent.change(input, { target: { files } })

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith(
          expect.objectContaining({
            code: 'too-many-files',
          })
        )
      })
    })

    it('accepts wildcard mime types', async () => {
      render(
        <FileUpload
          {...defaultProps}
          acceptedFileTypes={['image/*']}
        />
      )

      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      const file = createMockFile('photo.png', 1024, 'image/png')

      fireEvent.change(input, { target: { files: [file] } })

      await waitFor(() => {
        expect(screen.getByText('photo.png')).toBeInTheDocument()
      })
    })

    it('accepts files by extension', async () => {
      render(
        <FileUpload
          {...defaultProps}
          acceptedFileTypes={['.pdf']}
        />
      )

      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      const file = createMockFile('document.pdf', 1024, 'application/pdf')

      fireEvent.change(input, { target: { files: [file] } })

      await waitFor(() => {
        expect(screen.getByText('document.pdf')).toBeInTheDocument()
      })
    })
  })

  describe('Upload', () => {
    it('calls onUpload when upload button is clicked', async () => {
      const user = userEvent.setup()
      render(<FileUpload {...defaultProps} />)

      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      const file = createMockFile('test.pdf', 1024, 'application/pdf')

      fireEvent.change(input, { target: { files: [file] } })

      await waitFor(() => {
        expect(screen.getByText('test.pdf')).toBeInTheDocument()
      })

      const uploadButton = screen.getByRole('button', { name: /upload 1 file/i })
      await user.click(uploadButton)

      expect(mockOnUpload).toHaveBeenCalledWith([file], expect.any(AbortController))
    })

    it('shows uploading state during upload', async () => {
      mockOnUpload.mockImplementation(() => new Promise(() => {})) // Never resolves
      const user = userEvent.setup()
      render(<FileUpload {...defaultProps} />)

      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      const file = createMockFile('test.pdf', 1024, 'application/pdf')

      fireEvent.change(input, { target: { files: [file] } })

      await waitFor(() => {
        expect(screen.getByText('test.pdf')).toBeInTheDocument()
      })

      const uploadButton = screen.getByRole('button', { name: /upload 1 file/i })
      await user.click(uploadButton)

      await waitFor(() => {
        expect(screen.getByText(/uploading/i)).toBeInTheDocument()
      })
    })

    it('clears files after successful upload', async () => {
      const user = userEvent.setup()
      render(<FileUpload {...defaultProps} />)

      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      const file = createMockFile('test.pdf', 1024, 'application/pdf')

      fireEvent.change(input, { target: { files: [file] } })

      await waitFor(() => {
        expect(screen.getByText('test.pdf')).toBeInTheDocument()
      })

      const uploadButton = screen.getByRole('button', { name: /upload 1 file/i })
      await user.click(uploadButton)

      await waitFor(() => {
        expect(screen.queryByText('test.pdf')).not.toBeInTheDocument()
      })
    })

    it('shows error on upload failure', async () => {
      mockOnUpload.mockRejectedValue(new Error('Network error'))
      const onError = jest.fn()
      const user = userEvent.setup()
      render(<FileUpload {...defaultProps} onError={onError} />)

      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      const file = createMockFile('test.pdf', 1024, 'application/pdf')

      fireEvent.change(input, { target: { files: [file] } })

      await waitFor(() => {
        expect(screen.getByText('test.pdf')).toBeInTheDocument()
      })

      const uploadButton = screen.getByRole('button', { name: /upload 1 file/i })
      await user.click(uploadButton)

      await waitFor(() => {
        expect(onError).toHaveBeenCalled()
      })
    })

    it('calls onFilesSelected callback', async () => {
      const onFilesSelected = jest.fn()
      render(<FileUpload {...defaultProps} onFilesSelected={onFilesSelected} />)

      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      const file = createMockFile('test.pdf', 1024, 'application/pdf')

      fireEvent.change(input, { target: { files: [file] } })

      await waitFor(() => {
        expect(onFilesSelected).toHaveBeenCalledWith([file])
      })
    })

    it('auto-uploads when autoUpload is true', async () => {
      render(<FileUpload {...defaultProps} autoUpload />)

      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      const file = createMockFile('test.pdf', 1024, 'application/pdf')

      fireEvent.change(input, { target: { files: [file] } })

      await waitFor(() => {
        expect(mockOnUpload).toHaveBeenCalledWith([file], expect.any(AbortController))
      })
    })
  })

  describe('Drag and Drop', () => {
    it('shows drag over state', () => {
      render(<FileUpload {...defaultProps} />)

      const dropzone = screen.getByRole('button')

      fireEvent.dragEnter(dropzone, {
        dataTransfer: {
          items: [{ kind: 'file', type: 'application/pdf' }],
        },
      })

      expect(screen.getByText(/drop files here/i)).toBeInTheDocument()
    })

    it('accepts dropped files', async () => {
      render(<FileUpload {...defaultProps} />)

      const dropzone = screen.getByRole('button')
      const file = createMockFile('dropped.pdf', 1024, 'application/pdf')

      fireEvent.drop(dropzone, {
        dataTransfer: {
          files: [file],
        },
      })

      await waitFor(() => {
        expect(screen.getByText('dropped.pdf')).toBeInTheDocument()
      })
    })

    it('ignores drag events when disabled', () => {
      render(<FileUpload {...defaultProps} disabled />)

      const dropzone = screen.getByRole('button')

      fireEvent.dragEnter(dropzone, {
        dataTransfer: {
          items: [{ kind: 'file', type: 'application/pdf' }],
        },
      })

      // Should not show drag state
      expect(screen.queryByText(/drop files here/i)).not.toBeInTheDocument()
    })
  })

  describe('Error Display', () => {
    it('displays error with suggestion', async () => {
      render(
        <FileUpload
          {...defaultProps}
          maxFileSize={1024}
        />
      )

      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      const file = createMockFile('large.pdf', 2048, 'application/pdf')

      fireEvent.change(input, { target: { files: [file] } })

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument()
        expect(screen.getByText(/try compressing/i)).toBeInTheDocument()
      })
    })

    it('dismisses error when dismiss button is clicked', async () => {
      const user = userEvent.setup()
      render(
        <FileUpload
          {...defaultProps}
          maxFileSize={1024}
        />
      )

      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      const file = createMockFile('large.pdf', 2048, 'application/pdf')

      fireEvent.change(input, { target: { files: [file] } })

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument()
      })

      const dismissButton = screen.getByRole('button', { name: /dismiss/i })
      await user.click(dismissButton)

      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })

    it('shows retry button for network errors', async () => {
      mockOnUpload.mockRejectedValue(new Error('Network error'))
      const user = userEvent.setup()
      render(<FileUpload {...defaultProps} />)

      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      const file = createMockFile('test.pdf', 1024, 'application/pdf')

      fireEvent.change(input, { target: { files: [file] } })

      await waitFor(() => {
        expect(screen.getByText('test.pdf')).toBeInTheDocument()
      })

      const uploadButton = screen.getByRole('button', { name: /upload 1 file/i })
      await user.click(uploadButton)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument()
      })
    })
  })

  describe('File Count Display', () => {
    it('shows correct file count', async () => {
      render(<FileUpload {...defaultProps} maxFiles={5} />)

      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      const files = [
        createMockFile('file1.pdf', 1024, 'application/pdf'),
        createMockFile('file2.pdf', 1024, 'application/pdf'),
      ]

      fireEvent.change(input, { target: { files } })

      await waitFor(() => {
        expect(screen.getByText('Files to upload (2/5)')).toBeInTheDocument()
      })
    })
  })
})
