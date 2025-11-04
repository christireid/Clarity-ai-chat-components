import type { Meta, StoryObj } from '@storybook/react'
import { MultiModalPreview } from '@clarity-chat/react'
import type { AttachmentPreview } from '@clarity-chat/react'

const meta: Meta<typeof MultiModalPreview> = {
  title: 'Components/MultiModalPreview',
  component: MultiModalPreview,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Preview and manage multimodal attachments including images, audio, video, files, and links. Shows processing status and metadata.',
      },
    },
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof MultiModalPreview>

const mockAttachments: AttachmentPreview[] = [
  {
    id: '1',
    type: 'image',
    title: 'Screenshot.png',
    description: 'UI mockup',
    thumbnailUrl: 'https://via.placeholder.com/150',
    status: 'ready',
    sizeLabel: '2.4 MB',
  },
  {
    id: '2',
    type: 'audio',
    title: 'Recording.mp3',
    description: 'Voice note',
    status: 'ready',
    durationMs: 45000,
    sizeLabel: '1.2 MB',
  },
  {
    id: '3',
    type: 'video',
    title: 'Demo.mp4',
    description: 'Product demo',
    thumbnailUrl: 'https://via.placeholder.com/150',
    status: 'processing',
    durationMs: 120000,
    sizeLabel: '15.8 MB',
  },
]

export const Default: Story = {
  args: {
    attachments: mockAttachments,
  },
}

export const AllTypes: Story = {
  args: {
    attachments: [
      {
        id: '1',
        type: 'image',
        title: 'Photo.jpg',
        status: 'ready',
        thumbnailUrl: 'https://via.placeholder.com/150',
      },
      {
        id: '2',
        type: 'audio',
        title: 'Audio.mp3',
        status: 'ready',
        durationMs: 60000,
      },
      {
        id: '3',
        type: 'video',
        title: 'Video.mp4',
        status: 'ready',
        thumbnailUrl: 'https://via.placeholder.com/150',
        durationMs: 180000,
      },
      {
        id: '4',
        type: 'file',
        title: 'Document.pdf',
        status: 'ready',
        sizeLabel: '3.2 MB',
      },
      {
        id: '5',
        type: 'link',
        title: 'External Link',
        description: 'https://example.com',
        status: 'ready',
      },
    ],
  },
}

export const WithActions: Story = {
  args: {
    attachments: mockAttachments,
    onOpen: (attachment) => {
      console.log('Opening:', attachment.id)
      alert(`Opening: ${attachment.title}`)
    },
    onRetry: (attachment) => {
      console.log('Retrying:', attachment.id)
      alert(`Retrying: ${attachment.title}`)
    },
    onRemove: (attachment) => {
      console.log('Removing:', attachment.id)
      alert(`Removed: ${attachment.title}`)
    },
  },
}

export const ProcessingStates: Story = {
  args: {
    attachments: [
      {
        id: '1',
        type: 'image',
        title: 'Processing...',
        status: 'processing',
      },
      {
        id: '2',
        type: 'video',
        title: 'Ready',
        status: 'ready',
      },
      {
        id: '3',
        type: 'audio',
        title: 'Failed',
        status: 'failed',
      },
    ],
  },
}

export const CustomTitle: Story = {
  args: {
    attachments: mockAttachments,
    title: 'Attachments',
    subtitle: 'View all files and media in this conversation',
  },
}
