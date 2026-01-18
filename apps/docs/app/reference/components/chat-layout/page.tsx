'use client'

import { ChatLayout, ChatWindow } from '@clarity-chat/react'
import type { Message } from '@clarity-chat/types'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { ComponentPreview } from '@/components/Demo/ComponentPreview'
import { ViewInStorybook } from '@/components/Links/StorybookLink'

function BasicLayoutDemo() {
  const messages: Message[] = [
    {
      id: '1',
      chatId: 'demo-chat',
      role: 'assistant',
      content: 'Hello! I am running inside a ChatLayout.',
      status: 'sent',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  return (
    <div className="h-[400px] w-full border border-border rounded-lg overflow-hidden">
      <ChatLayout
        header={<div className="p-4 border-b bg-card">Header</div>}
        sidebar={
          <div className="p-4 border-r w-64 bg-muted/30">Sidebar Content</div>
        }
        footer={<div className="p-4 border-t bg-card">Footer</div>}
        className=""
      >
        <ChatWindow
          messages={messages}
          onSendMessage={() => {}}
          onStopGeneration={() => {}}
          onMessageCopy={() => {}}
          onMessageFeedback={() => {}}
          onMessageRetry={() => {}}
          onEditMessage={() => {}}
          onRegenerateMessage={() => {}}
          onDeleteMessage={() => {}}
          aiStatus={undefined}
          editingMessageId={null}
          onSaveEdit={() => {}}
          onCancelEdit={() => {}}
          emptyState={undefined}
          showHeader={false}
          sessionTitle=""
          sessionSubtitle=""
          headerActions={undefined}
          showMessageCount={false}
          onExport={undefined}
          onClear={undefined}
          error={null}
          onRetry={undefined}
          onDismissError={undefined}
          className="h-full border-0 shadow-none rounded-none"
        />
      </ChatLayout>
    </div>
  )
}

const chatLayoutProps: Prop[] = [
  {
    name: 'children',
    type: 'ReactNode',
    required: true,
    description: 'The main content area (typically ChatWindow).',
  },
  {
    name: 'sidebar',
    type: 'ReactNode',
    description: 'Optional sidebar content (left side).',
  },
  {
    name: 'header',
    type: 'ReactNode',
    description: 'Optional header content (top).',
  },
  {
    name: 'footer',
    type: 'ReactNode',
    description: 'Optional footer content (bottom).',
  },
  {
    name: 'variant',
    type: "'default' | 'split' | 'full'",
    default: "'default'",
    description: 'Layout variant. "split" makes sidebar wider (50%).',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes.',
  },
]

export default function ChatLayoutPage() {
  return (
    <>
      <Breadcrumbs />

      <h1>ChatLayout</h1>

      <p className="lead">
        A mid-level layout component that provides a consistent structure for
        chat applications with optional sidebar, header, and footer slots.
      </p>

      <ViewInStorybook component="ChatLayout" />

      <h2 id="import">Import</h2>

      <EnhancedCodeBlock
        code={`import { ChatLayout } from '@clarity-chat/react'`}
        language="tsx"
      />

      <h2 id="usage">Usage</h2>

      <ComponentPreview
        title="Basic Layout"
        description="A standard chat layout with header, sidebar, and footer."
        code={`<ChatLayout
  header={<Header />}
  sidebar={<Sidebar />}
  footer={<Footer />}
>
  <ChatWindow messages={messages} />
</ChatLayout>`}
      >
        <BasicLayoutDemo />
      </ComponentPreview>

      <h2 id="props">Props</h2>

      <PropsTable props={chatLayoutProps} />
    </>
  )
}
