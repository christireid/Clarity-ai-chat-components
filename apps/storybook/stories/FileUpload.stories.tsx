import type { Meta, StoryObj } from '@storybook/react'
import { FileUpload } from '@clarity-chat/react'

const meta: Meta<typeof FileUpload> = {
  title: 'Components/FileUpload',
  component: FileUpload,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Drag and drop file upload component with progress tracking.',
      },
    },
  },
  tags: ['autodocs'],
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
