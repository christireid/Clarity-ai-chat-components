import type { Meta, StoryObj } from '@storybook/react'
import { FileUpload } from '@clarity-chat/react'

/**
 * **FileUpload Component**
 * 
 * Drag and drop file upload component with progress tracking,
 * file validation, and multiple file support.
 * 
 * **Key Features:**
 * - Drag and drop interface
 * - Click to browse files
 * - Multiple file support
 * - File size validation
 * - File type validation (accept prop)
 * - Progress tracking
 * - Error handling
 * - Accessible with keyboard navigation
 * 
 * **Use Cases:**
 * - Document uploads
 * - Image uploads
 * - Multi-file selection
 * - File sharing interfaces
 * - Attachment systems
 */
const meta: Meta<typeof FileUpload> = {
  title: 'Components/FileUpload',
  component: FileUpload,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Drag and drop file upload component with progress tracking,
file validation, and multiple file support.

## Features

- ✅ Drag and drop interface
- ✅ Click to browse files
- ✅ Multiple file support
- ✅ File size validation
- ✅ File type validation (accept prop)
- ✅ Progress tracking
- ✅ Error handling
- ✅ Accessible with keyboard navigation
- ✅ Visual feedback for drag states

## Basic Usage

\`\`\`tsx
<FileUpload
  onFilesSelected={(files) => {
    console.log('Files selected:', files)
  }}
  maxFiles={5}
  maxSize={10 * 1024 * 1024} // 10MB
  accept="image/*,.pdf"
/>
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    onFilesSelected: {
      description: 'Callback when files are selected',
      action: 'files-selected',
    },
    maxFiles: {
      description: 'Maximum number of files allowed',
      control: { type: 'number', min: 1, max: 20 },
    },
    maxSize: {
      description: 'Maximum file size in bytes',
      control: { type: 'number', min: 1024, max: 100 * 1024 * 1024 },
    },
    accept: {
      description: 'Accepted file types (e.g., "image/*", ".pdf,.doc")',
      control: 'text',
    },
    disabled: {
      description: 'Disable file upload',
      control: 'boolean',
    },
    multiple: {
      description: 'Allow multiple file selection',
      control: 'boolean',
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

export const Default: Story = {
  args: {
    onFilesSelected: (files) => {
      console.log('Files selected:', files)
    },
    maxFiles: 5,
    maxSize: 10 * 1024 * 1024, // 10MB
  },
}

export const ImageOnly: Story = {
  args: {
    onFilesSelected: (files) => {
      console.log('Images selected:', files)
    },
    accept: 'image/*',
    maxFiles: 3,
  },
}

export const SingleFile: Story = {
  args: {
    onFilesSelected: (files) => {
      console.log('File selected:', files)
    },
    maxFiles: 1,
  },
}

export const WithValidation: Story = {
  args: {
    onFilesSelected: (files) => {
      console.log('Valid files:', files)
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    accept: '.pdf,.doc,.docx',
    maxFiles: 2,
  },
}
