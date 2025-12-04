import type { Meta, StoryObj } from '@storybook/react-vite'
import { Draggable } from '@clarity-chat/react'
import { useState } from 'react'

const meta: Meta<typeof Draggable> = {
  title: 'Components/Navigation/Draggable',
  component: Draggable,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Make any element draggable with support for drag constraints, drop zones, and custom drag handlers. Built on Framer Motion.',
      },
    },
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof Draggable>

export const Default: Story = {
  render: () => (
    <div className="p-8">
      <Draggable>
        <div className="w-32 h-32 bg-blue-500 rounded-lg cursor-grab active:cursor-grabbing flex items-center justify-center text-white font-semibold">
          Drag me
        </div>
      </Draggable>
    </div>
  ),
}

export const HorizontalOnly: Story = {
  render: () => (
    <div className="p-8">
      <Draggable axis="x">
        <div className="w-32 h-32 bg-green-500 rounded-lg cursor-grab active:cursor-grabbing flex items-center justify-center text-white font-semibold">
          Drag X only
        </div>
      </Draggable>
    </div>
  ),
}

export const VerticalOnly: Story = {
  render: () => (
    <div className="p-8">
      <Draggable axis="y">
        <div className="w-32 h-32 bg-purple-500 rounded-lg cursor-grab active:cursor-grabbing flex items-center justify-center text-white font-semibold">
          Drag Y only
        </div>
      </Draggable>
    </div>
  ),
}

export const WithCallbacks: Story = {
  render: () => {
    const [status, setStatus] = useState('Ready to drag')
    
    return (
      <div className="space-y-4 p-8">
        <Draggable
          onDragStart={() => setStatus('Dragging started')}
          onDragEnd={(info) => {
            setStatus(`Drag ended at (${info.point.x.toFixed(0)}, ${info.point.y.toFixed(0)})`)
          }}
        >
          <div className="w-32 h-32 bg-orange-500 rounded-lg cursor-grab active:cursor-grabbing flex items-center justify-center text-white font-semibold">
            Drag me
          </div>
        </Draggable>
        <p className="text-sm text-muted-foreground">{status}</p>
      </div>
    )
  },
}

export const WithDropZone: Story = {
  render: () => {
    const [dropped, setDropped] = useState<string | null>(null)
    
    return (
      <div className="space-y-8 p-8">
        <Draggable
          dragId="item-1"
          onDrop={(targetId) => {
            setDropped(targetId || 'outside')
            alert(`Dropped in: ${targetId || 'outside zone'}`)
          }}
        >
          <div className="w-32 h-32 bg-red-500 rounded-lg cursor-grab active:cursor-grabbing flex items-center justify-center text-white font-semibold">
            Drag me
          </div>
        </Draggable>
        
        <div className="flex gap-4">
          <div
            data-drop-zone="zone-1"
            className="w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50"
          >
            Drop Zone 1
          </div>
          <div
            data-drop-zone="zone-2"
            className="w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50"
          >
            Drop Zone 2
          </div>
        </div>
        
        {dropped && (
          <p className="text-sm text-muted-foreground">
            Last dropped in: {dropped}
          </p>
        )}
      </div>
    )
  },
}

export const MultipleDraggables: Story = {
  render: () => (
    <div className="space-y-4 p-8">
      {['Item 1', 'Item 2', 'Item 3'].map((item, index) => (
        <Draggable key={index} dragId={`item-${index}`}>
          <div className="w-full p-4 bg-blue-500 rounded-lg cursor-grab active:cursor-grabbing text-white font-semibold">
            {item} - Drag me around
          </div>
        </Draggable>
      ))}
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="p-8">
      <Draggable disabled>
        <div className="w-32 h-32 bg-gray-400 rounded-lg cursor-not-allowed flex items-center justify-center text-white font-semibold opacity-50">
          Disabled
        </div>
      </Draggable>
    </div>
  ),
}

export const WithoutGhost: Story = {
  render: () => (
    <div className="p-8">
      <Draggable showGhost={false}>
        <div className="w-32 h-32 bg-indigo-500 rounded-lg cursor-grab active:cursor-grabbing flex items-center justify-center text-white font-semibold">
          No ghost
        </div>
      </Draggable>
    </div>
  ),
}
