// TODO: Draggable and DropZone are planned but not yet implemented
// in @clarity-chat/react. This page documents the intended API and features.

'use client'

import { useState } from 'react'
import { ToastProvider } from '@clarity-chat/react'
// TODO: Uncomment when implemented:
// import {
//   Draggable,
//   DropZone,
// } from '@clarity-chat/react'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Pagination } from '@/components/Navigation/Pagination'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { ComponentPreview } from '@/components/Demo/ComponentPreview'
import { ViewInStorybook } from '@/components/Links/StorybookLink'
import { ScrollReveal, ScrollRevealItem } from '@/components/UI/ScrollReveal'

// Placeholder demo component - shows Coming Soon notice
function BasicDragDemo() {
  return (
    <div className="flex gap-8 items-center justify-center p-8 bg-background border rounded-lg min-h-[300px]">
      <div className="text-center">
        <div className="w-24 h-24 bg-blue-500/20 rounded-lg shadow-lg flex items-center justify-center text-blue-600 font-bold border-2 border-dashed border-blue-500/50 mb-4">
          Drag Me
        </div>
        <p className="text-muted-foreground text-sm">Coming Soon</p>
      </div>

      <div className="w-48 h-48 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl flex flex-col items-center justify-center bg-muted/30">
        <p className="text-sm text-muted-foreground font-medium">Drop Zone</p>
        <p className="text-xs text-muted-foreground mt-2">Not yet implemented</p>
      </div>
    </div>
  )
}

const draggableProps: Prop[] = [
  {
    name: 'dragId',
    type: 'string',
    required: true,
    description: 'Unique identifier for the draggable item.',
  },
  {
    name: 'children',
    type: 'ReactNode',
    required: true,
    description: 'Content to be made draggable.',
  },
  {
    name: 'onDragStart',
    type: '() => void',
    description: 'Callback when dragging starts.',
  },
  {
    name: 'onDragEnd',
    type: '(info: DragInfo) => void',
    description: 'Callback when dragging ends.',
  },
  {
    name: 'onDrop',
    type: '(targetId: string | null) => void',
    description: 'Callback when item is dropped onto a valid drop zone.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Disable dragging interaction.',
  },
  {
    name: 'axis',
    type: "'x' | 'y' | 'both'",
    default: "'both'",
    description: 'Constrain movement to a specific axis.',
  },
  {
    name: 'showGhost',
    type: 'boolean',
    default: 'true',
    description: 'Show a ghost preview while dragging.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes.',
  },
]

const dropZoneProps: Prop[] = [
  {
    name: 'dropId',
    type: 'string',
    required: true,
    description: 'Unique identifier for the drop zone.',
  },
  {
    name: 'onDrop',
    type: '(dragId: string | null) => void',
    description: 'Callback when an item is dropped into this zone.',
  },
  {
    name: 'acceptTypes',
    type: 'string[]',
    description: 'Array of accepted drag identifiers (optional filtering).',
  },
  {
    name: 'activeClassName',
    type: 'string',
    description: 'CSS class applied when a valid item is dragged over.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes.',
  },
]

export default function DraggablePage() {
  return (
    <ToastProvider>
      <div className="docs-content">
        <Breadcrumbs />

        <ScrollReveal>
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-brand-500 to-brand-600 bg-clip-text text-transparent">
              Draggable & DropZone
            </h1>

            <p className="text-xl text-text-secondary leading-relaxed">
              Primitives for building rich drag-and-drop interactions. Create
              sortable lists, file upload zones, and interactive canvases with
              smooth physics-based animations.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <Callout type="warning" className="mb-8">
            <p>
              <strong>Coming Soon:</strong> Draggable and DropZone are planned but not yet
              implemented in @clarity-chat/react. This page documents the intended API.
            </p>
          </Callout>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <ViewInStorybook component="Draggable" />
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <h2 id="basic-usage">Basic Usage</h2>
          <p className="mb-4">
            Wrap elements in <code>Draggable</code> to make them movable, and
            use <code>DropZone</code> to define valid drop targets.
          </p>

          <ComponentPreview
            title="Drag and Drop Demo"
            description="Drag the blue box into the drop zone."
            code={`import { useState } from 'react'
import { Draggable, DropZone } from '@clarity-chat/react'

function DragDemo() {
  const [status, setStatus] = useState('Waiting...')

  return (
    <div className="flex gap-4">
      <Draggable dragId="box-1">
        <div className="box">Drag Me</div>
      </Draggable>

      <DropZone
        dropId="zone-1"
        onDrop={(id) => setStatus(\`Dropped: \${id}\`)}
      >
        <div className="zone">
          {status}
        </div>
      </DropZone>
    </div>
  )
}`}
          >
            <BasicDragDemo />
          </ComponentPreview>
        </ScrollReveal>

        <ScrollReveal delay={0.4}>
          <h2 id="import">Import</h2>
          <EnhancedCodeBlock
            code={`// Coming soon:
import { Draggable, DropZone, useDragDrop } from '@clarity-chat/react'`}
            language="tsx"
          />
        </ScrollReveal>

        <ScrollReveal delay={0.5}>
          <section className="my-12">
            <h2 className="text-2xl font-bold mb-4">Interactive Playground</h2>
            <p className="mb-6 text-muted-foreground">
              Experiment with constraints and drag options:
            </p>
            <CodePlayground
              initialCode={`// Draggable is coming soon!
// This playground will be functional once the component is implemented.

function Example() {
  return (
    <div className="h-64 border rounded-lg bg-background relative overflow-hidden p-8">
      <p className="text-center text-muted-foreground mb-8">
        Draggable components coming soon!
      </p>

      <div className="flex justify-center gap-8">
        <div className="w-20 h-20 bg-purple-500/20 rounded-lg shadow-lg flex items-center justify-center text-purple-600 border-2 border-dashed border-purple-500/50">
          Free
        </div>

        <div className="w-20 h-20 bg-pink-500/20 rounded-lg shadow-lg flex items-center justify-center text-pink-600 border-2 border-dashed border-pink-500/50">
          X-Only
        </div>

        <div className="w-20 h-20 bg-orange-500/20 rounded-lg shadow-lg flex items-center justify-center text-orange-600 border-2 border-dashed border-orange-500/50">
          Y-Only
        </div>
      </div>
    </div>
  )
}

render(<Example />)`}
            />
          </section>
        </ScrollReveal>

        <ScrollReveal delay={0.6}>
          <h2 id="kanban-example">Kanban Board Example</h2>
          <p className="mb-4">
            Build complex interfaces like Kanban boards using{' '}
            <code>useDragDrop</code> hook:
          </p>
          <EnhancedCodeBlock
            language="tsx"
            code={`import { Draggable, DropZone, useDragDrop } from '@clarity-chat/react'

function KanbanBoard() {
  const { items, handleDrop } = useDragDrop({
    items: initialItems,
    onReorder: (newItems) => setItems(newItems)
  })

  return (
    <div className="kanban-columns">
      {columns.map(column => (
        <DropZone
          key={column.id}
          dropId={column.id}
          onDrop={(itemId) => handleDrop(itemId, column.id)}
        >
          {items
            .filter(item => item.columnId === column.id)
            .map(item => (
              <Draggable key={item.id} dragId={item.id}>
                <Card item={item} />
              </Draggable>
            ))
          }
        </DropZone>
      ))}
    </div>
  )
}`}
          />
        </ScrollReveal>

        <ScrollReveal delay={0.7}>
          <h2 id="props">Props</h2>

          <h3 className="text-xl font-semibold mt-8 mb-4">Draggable</h3>
          <PropsTable props={draggableProps} />

          <h3 className="text-xl font-semibold mt-8 mb-4">DropZone</h3>
          <PropsTable props={dropZoneProps} />
        </ScrollReveal>

        <ScrollReveal delay={0.8}>
          <h2 id="animations">Physics & Animations</h2>
          <p className="mb-4">
            Draggable uses Framer Motion under the hood for smooth, spring-based
            physics. Drag interactions feel natural and responsive with:
          </p>
          <ul className="mb-8 space-y-2">
            <li>
              <strong>Elastic constraints:</strong> Items bounce back when
              dragged too far
            </li>
            <li>
              <strong>Ghost previews:</strong> Visual feedback while dragging
            </li>
            <li>
              <strong>Drop animations:</strong> Smooth transitions when
              released
            </li>
            <li>
              <strong>Touch support:</strong> Optimized for mobile gestures
            </li>
          </ul>
        </ScrollReveal>

        <ScrollReveal delay={0.9}>
          <h2 id="related">Related</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <a
              href="/reference/components/file-upload"
              className="p-4 border rounded-lg hover:border-brand-500 transition-colors"
            >
              <h3 className="font-semibold mb-1">FileUpload</h3>
              <p className="text-sm text-muted-foreground">
                Specialized drag-and-drop for files
              </p>
            </a>
            <a
              href="/reference/components/chat-window"
              className="p-4 border rounded-lg hover:border-brand-500 transition-colors"
            >
              <h3 className="font-semibold mb-1">ChatWindow</h3>
              <p className="text-sm text-muted-foreground">
                Uses drag-and-drop for attachments
              </p>
            </a>
          </div>
        </ScrollReveal>

        <Pagination
          previous={{
            title: 'ContextMenu',
            href: '/reference/components/context-menu',
          }}
          next={{
            title: 'KeyboardHint',
            href: '/reference/components/keyboard-hint',
          }}
        />
      </div>
    </ToastProvider>
  )
}
