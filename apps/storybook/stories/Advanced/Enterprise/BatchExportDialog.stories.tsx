import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import {
  BatchExportDialog,
  type BatchExportResource,
  type BatchExportProgress,
} from '@clarity-chat/react'
import { Button } from '@clarity-chat/primitives'

const meta: Meta<typeof BatchExportDialog> = {
  title: 'Advanced/Enterprise/BatchExportDialog',
  component: BatchExportDialog,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof BatchExportDialog>

const sampleResources: BatchExportResource[] = [
  {
    id: 'conv-1',
    name: 'Python Programming Help',
    type: 'chat',
    messageCount: 45,
    lastModified: new Date('2024-01-15'),
    size: 125000,
  },
  {
    id: 'conv-2',
    name: 'Project Planning Discussion',
    type: 'chat',
    messageCount: 32,
    lastModified: new Date('2024-01-14'),
    size: 89000,
  },
  {
    id: 'conv-3',
    name: 'Code Review Session',
    type: 'chat',
    messageCount: 67,
    lastModified: new Date('2024-01-13'),
    size: 210000,
  },
  {
    id: 'conv-4',
    name: 'Learning JavaScript',
    type: 'chat',
    messageCount: 28,
    lastModified: new Date('2024-01-12'),
    size: 75000,
  },
]

const InteractiveWrapper = (args: any) => {
  const [open, setOpen] = useState(false)
  const [progress, setProgress] = useState<BatchExportProgress[]>([])

  const handleExport = async (options: {
    resourceIds: string[]
    format: string
    includeMetadata: boolean
    includeImages: boolean
    includeAttachments: boolean
  }) => {
    console.log('Exporting:', options)
    
    // Simulate progress
    const newProgress: BatchExportProgress[] = options.resourceIds.map((id) => ({
      resourceId: id,
      status: 'pending',
      progress: 0,
    }))
    setProgress(newProgress)

    // Simulate export progress
    for (const resourceId of options.resourceIds) {
      const index = newProgress.findIndex((p) => p.resourceId === resourceId)
      if (index !== -1) {
        newProgress[index].status = 'exporting'
        setProgress([...newProgress])

        // Simulate progress updates
        for (let p = 0; p <= 100; p += 25) {
          await new Promise((resolve) => setTimeout(resolve, 200))
          newProgress[index].progress = p
          setProgress([...newProgress])
        }

        newProgress[index].status = 'completed'
        newProgress[index].progress = 100
        setProgress([...newProgress])
      }
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Batch Export</Button>
      <BatchExportDialog
        {...args}
        open={open}
        onOpenChange={setOpen}
        onExport={handleExport}
        progress={progress}
      />
    </>
  )
}

export const Default: Story = {
  render: InteractiveWrapper,
  args: {
    resources: sampleResources,
  },
}

export const WithProgress: Story = {
  render: InteractiveWrapper,
  args: {
    resources: sampleResources,
  },
}

export const ManyResources: Story = {
  render: InteractiveWrapper,
  args: {
    resources: Array.from({ length: 20 }, (_, i) => ({
      id: `conv-${i}`,
      name: `Conversation ${i + 1}`,
      type: 'chat' as const,
      messageCount: Math.floor(Math.random() * 100) + 10,
      lastModified: new Date(2024, 0, 15 - i),
      size: Math.floor(Math.random() * 200000) + 50000,
    })),
  },
}

export const WithErrors: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    const [progress, setProgress] = useState<BatchExportProgress[]>([
      {
        resourceId: 'conv-1',
        status: 'completed',
        progress: 100,
      },
      {
        resourceId: 'conv-2',
        status: 'error',
        progress: 0,
        error: 'Export failed: File too large',
      },
      {
        resourceId: 'conv-3',
        status: 'exporting',
        progress: 45,
      },
    ])

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Batch Export</Button>
        <BatchExportDialog
          open={open}
          onOpenChange={setOpen}
          resources={sampleResources}
          onExport={async () => {}}
          progress={progress}
        />
      </>
    )
  },
}
