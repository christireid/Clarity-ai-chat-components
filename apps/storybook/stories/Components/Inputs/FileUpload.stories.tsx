import type { Meta, StoryObj } from '@storybook/react-vite'
import { FileUpload } from '@clarity-chat/react'
import { expect, within, userEvent } from 'storybook/test'
import type { MessageAttachment } from '@clarity-chat/types'

/**
 * **FileUpload Component - Enhanced**
 *
 * A feature-rich, accessible file upload component with drag-and-drop support,
 * comprehensive validation, progress tracking, and screen reader announcements.
 *
 * **Key Features:**
 * - Full keyboard accessibility (Enter/Space to open file dialog)
 * - Screen reader announcements via aria-live
 * - Drag accept/reject visual states with real-time validation
 * - Upload progress tracking with cancel support
 * - Image preview thumbnails
 * - Retry failed uploads
 * - Reduced motion support
 * - Comprehensive error handling with actionable suggestions
 *
 * **Accessibility (WCAG 2.1 AA):**
 * - Keyboard navigable dropzone
 * - Focus visible indicators
 * - aria-live announcements for all state changes
 * - aria-label with full context
 * - Alternative to drag-drop always visible
 *
 * **Use Cases:**
 * - Document uploads in chat interfaces
 * - Image galleries and media uploads
 * - Multi-file batch processing
 * - Form attachments
 */
const meta: Meta<typeof FileUpload> = {
  title: 'Components/Inputs/FileUpload',
  component: FileUpload,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Accessible file upload component with drag-and-drop, validation, progress tracking, and comprehensive feedback.

## Features

- **Accessibility First**: Full keyboard navigation, screen reader announcements, focus management
- **Visual Feedback**: Drag accept/reject states, upload progress, success celebration
- **Comprehensive Validation**: File type, size, and count validation with clear error messages
- **Progress Tracking**: Real-time upload progress with cancel support
- **Image Previews**: Automatic thumbnail generation for image files
- **Error Recovery**: Retry failed uploads with actionable suggestions
- **Reduced Motion**: Respects user preference for reduced motion

## Basic Usage

\`\`\`tsx
<FileUpload
  onUpload={async (files) => {
    // Upload files to your server
    const results = await uploadToServer(files)
    return results
  }}
  maxFiles={5}
  maxFileSize={10 * 1024 * 1024} // 10MB
  acceptedFileTypes={['image/*', 'application/pdf']}
  onError={(error) => console.error(error)}
/>
\`\`\`
        `,
      },
    },
    status: {
      type: 'stable',
    },
    badges: ['stable', 'accessible', 'tested'],
  },
  tags: ['autodocs', 'stable'],
  argTypes: {
    onUpload: {
      description: 'Async handler called when files are ready to upload. Receives files and optional AbortController.',
      action: 'upload',
    },
    onFilesSelected: {
      description: 'Callback when files are selected (before upload)',
      action: 'files-selected',
    },
    onProgress: {
      description: 'Callback for upload progress updates',
      action: 'progress',
    },
    onError: {
      description: 'Callback when an error occurs',
      action: 'error',
    },
    maxFiles: {
      description: 'Maximum number of files allowed',
      control: { type: 'number', min: 1, max: 20 },
    },
    maxFileSize: {
      description: 'Maximum file size in bytes',
      control: { type: 'number', min: 1024, max: 100 * 1024 * 1024 },
    },
    minFileSize: {
      description: 'Minimum file size in bytes',
      control: { type: 'number', min: 0, max: 1024 * 1024 },
    },
    acceptedFileTypes: {
      description: 'Accepted file types (MIME types or extensions)',
      control: 'object',
    },
    disabled: {
      description: 'Disable file upload',
      control: 'boolean',
    },
    showPreviews: {
      description: 'Show image preview thumbnails',
      control: 'boolean',
    },
    autoUpload: {
      description: 'Auto-upload files immediately after selection',
      control: 'boolean',
    },
    label: {
      description: 'Custom label for the dropzone',
      control: 'text',
    },
    description: {
      description: 'Custom description text',
      control: 'text',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '500px' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof FileUpload>

// Simulated upload function with progress
const simulateUpload = (files: File[]): Promise<MessageAttachment[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        files.map((file) => ({
          id: `${Date.now()}-${file.name}`,
          name: file.name,
          type: file.type.startsWith('image/') ? 'image' : 'document',
          url: URL.createObjectURL(file),
          size: file.size,
          mimeType: file.type,
        }))
      )
    }, 1500)
  })
}

// Simulated upload that fails
const simulateFailedUpload = (): Promise<MessageAttachment[]> => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error('Network error: Unable to connect to server'))
    }, 1000)
  })
}

export const Default: Story = {
  args: {
    onUpload: simulateUpload,
    maxFiles: 5,
    maxFileSize: 10 * 1024 * 1024, // 10MB
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test dropzone renders
    await expect(canvas.getByText(/click to upload or drag and drop/i)).toBeInTheDocument()

    // Test keyboard hint displays
    await expect(canvas.getByText('Enter')).toBeInTheDocument()

    // Test file size limit displays
    await expect(canvas.getByText(/10.*MB/i)).toBeInTheDocument()
  },
}

export const ImageOnly: Story = {
  args: {
    onUpload: simulateUpload,
    acceptedFileTypes: ['image/*'],
    maxFiles: 3,
    label: 'Upload images',
    description: 'PNG, JPG, GIF up to 5MB each',
    maxFileSize: 5 * 1024 * 1024,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('Upload images')).toBeInTheDocument()
    await expect(canvas.getByText(/PNG, JPG, GIF/)).toBeInTheDocument()
  },
}

export const DocumentsOnly: Story = {
  args: {
    onUpload: simulateUpload,
    acceptedFileTypes: ['application/pdf', '.doc', '.docx', '.txt'],
    maxFiles: 10,
    maxFileSize: 25 * 1024 * 1024,
    label: 'Upload documents',
    description: 'PDF, Word, and text files up to 25MB',
  },
}

export const SingleFile: Story = {
  args: {
    onUpload: simulateUpload,
    maxFiles: 1,
    label: 'Upload a single file',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('Upload a single file')).toBeInTheDocument()
    await expect(canvas.getByText(/1.*file/i)).toBeInTheDocument()
  },
}

export const WithValidation: Story = {
  args: {
    onUpload: simulateUpload,
    maxSize: 5 * 1024 * 1024, // 5MB
    acceptedFileTypes: ['.pdf', '.doc', '.docx'],
    maxFiles: 2,
    label: 'Strict validation',
    description: 'Only PDF and Word documents, max 5MB, 2 files',
  },
}

export const Disabled: Story = {
  args: {
    onUpload: simulateUpload,
    disabled: true,
    label: 'Upload disabled',
    description: 'This upload area is currently disabled',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const dropzone = canvas.getByRole('button')
    await expect(dropzone).toHaveAttribute('aria-disabled', 'true')
  },
}

export const AutoUpload: Story = {
  args: {
    onUpload: simulateUpload,
    autoUpload: true,
    maxFiles: 5,
    label: 'Auto-upload enabled',
    description: 'Files will upload immediately when selected',
  },
}

export const WithoutPreviews: Story = {
  args: {
    onUpload: simulateUpload,
    showPreviews: false,
    acceptedFileTypes: ['image/*'],
    maxFiles: 5,
    label: 'Upload images (no previews)',
    description: 'Image previews are disabled',
  },
}

export const UploadError: Story = {
  args: {
    onUpload: simulateFailedUpload,
    maxFiles: 5,
    label: 'Upload with error simulation',
    description: 'This simulates a network error during upload',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates error handling with retry functionality. Select a file and click upload to see the error state.',
      },
    },
  },
}

export const KeyboardAccessibility: Story = {
  args: {
    onUpload: simulateUpload,
    maxFiles: 5,
    label: 'Keyboard accessible upload',
    description: 'Try navigating with Tab, Enter, and Space keys',
  },
  parameters: {
    docs: {
      description: {
        story: `
Demonstrates full keyboard accessibility:
- **Tab**: Navigate to the dropzone
- **Enter/Space**: Open file dialog
- **Focus visible**: Clear focus indicator ring
- **Screen reader**: Announcements for all actions
        `,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const dropzone = canvas.getByRole('button')

    // Focus the dropzone
    dropzone.focus()

    // Verify it has focus
    await expect(dropzone).toHaveFocus()

    // Verify aria attributes
    await expect(dropzone).toHaveAttribute('aria-label')
    await expect(dropzone).toHaveAttribute('tabIndex', '0')
  },
}

export const DragAcceptReject: Story = {
  args: {
    onUpload: simulateUpload,
    acceptedFileTypes: ['image/*'],
    maxFiles: 5,
    label: 'Drag acceptance demo',
    description: 'Drag an image (accepted) or PDF (rejected) to see visual feedback',
  },
  parameters: {
    docs: {
      description: {
        story: `
Demonstrates drag-and-drop visual states:
- **Drag Accept**: Green border and checkmark when dragging valid files
- **Drag Reject**: Red border and X when dragging invalid files
- **Drop**: Files are validated and added to the queue
        `,
      },
    },
  },
}

export const CustomStyling: Story = {
  args: {
    onUpload: simulateUpload,
    maxFiles: 5,
    className: 'max-w-md',
    label: 'Custom styled upload',
    description: 'With additional custom classes',
  },
  decorators: [
    (Story) => (
      <div className="p-8 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 rounded-xl">
        <Story />
      </div>
    ),
  ],
}

export const LargeFileHandling: Story = {
  args: {
    onUpload: simulateUpload,
    maxFiles: 3,
    maxFileSize: 100 * 1024 * 1024, // 100MB
    label: 'Large file upload',
    description: 'Supports files up to 100MB',
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates handling of larger files with appropriate size limits.',
      },
    },
  },
}

export const MinFileSizeValidation: Story = {
  args: {
    onUpload: simulateUpload,
    minFileSize: 10 * 1024, // 10KB minimum
    maxFileSize: 10 * 1024 * 1024,
    maxFiles: 5,
    label: 'Minimum file size required',
    description: 'Files must be at least 10KB',
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows validation for minimum file size requirements.',
      },
    },
  },
}
