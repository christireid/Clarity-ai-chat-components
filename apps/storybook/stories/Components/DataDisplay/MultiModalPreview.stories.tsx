import type { Meta, StoryObj } from '@storybook/react-vite'
import { MultiModalPreview } from '@clarity-chat/react'
import type { AttachmentPreview } from '@clarity-chat/react'

const meta: Meta<typeof MultiModalPreview> = {
  title: 'Components/DataDisplay/MultiModalPreview',
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
    title: 'Components/DataDisplay/MultiModalPreview',
    description: 'UI mockup',
    thumbnailUrl: 'https://via.placeholder.com/150',
    status: 'ready',
    sizeLabel: '2.4 MB',
  },
  {
    id: '2',
    type: 'audio',
    title: 'Components/DataDisplay/MultiModalPreview',
    description: 'Voice note',
    status: 'ready',
    durationMs: 45000,
    sizeLabel: '1.2 MB',
  },
  {
    id: '3',
    type: 'video',
    title: 'Components/DataDisplay/MultiModalPreview',
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
        title: 'Components/DataDisplay/MultiModalPreview',
        status: 'ready',
        thumbnailUrl: 'https://via.placeholder.com/150',
      },
      {
        id: '2',
        type: 'audio',
        title: 'Components/DataDisplay/MultiModalPreview',
        status: 'ready',
        durationMs: 60000,
      },
      {
        id: '3',
        type: 'video',
        title: 'Components/DataDisplay/MultiModalPreview',
        status: 'ready',
        thumbnailUrl: 'https://via.placeholder.com/150',
        durationMs: 180000,
      },
      {
        id: '4',
        type: 'file',
        title: 'Components/DataDisplay/MultiModalPreview',
        status: 'ready',
        sizeLabel: '3.2 MB',
      },
      {
        id: '5',
        type: 'link',
        title: 'Components/DataDisplay/MultiModalPreview',
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
        title: 'Components/DataDisplay/MultiModalPreview',
        status: 'processing',
      },
      {
        id: '2',
        type: 'video',
        title: 'Components/DataDisplay/MultiModalPreview',
        status: 'ready',
      },
      {
        id: '3',
        type: 'audio',
        title: 'Components/DataDisplay/MultiModalPreview',
        status: 'failed',
      },
    ],
  },
}

export const CustomTitle: Story = {
  args: {
    attachments: mockAttachments,
    title: 'Components/DataDisplay/MultiModalPreview',
    subtitle: 'Components/DataDisplay/MultiModalPreview',
  },
}
