import type { Meta, StoryObj } from '@storybook/react-vite'
import React, { useState } from 'react'
import { ResizableChatLayout, useResizableLayout } from '@clarity-chat/react'

const SidebarContent = () => (
  <div className="p-4 h-full">
    <h3 className="font-semibold mb-4">Conversations</h3>
    <div className="space-y-2">
      {['Project Planning', 'Code Review', 'Bug Fix', 'Feature Request'].map(
        (name, i) => (
          <div
            key={i}
            className="p-2 rounded hover:bg-muted cursor-pointer text-sm"
          >
            {name}
          </div>
        )
      )}
    </div>
  </div>
)

const HeaderContent = () => (
  <div className="flex items-center justify-between p-3">
    <h2 className="font-semibold">Chat Assistant</h2>
    <div className="flex gap-2">
      <button className="px-3 py-1 text-sm rounded bg-muted hover:bg-muted/80">
        Settings
      </button>
    </div>
  </div>
)

const FooterContent = () => (
  <div className="p-3 flex gap-2">
    <input
      type="text"
      placeholder="Type a message..."
      className="flex-1 px-3 py-2 rounded border bg-background"
    />
    <button className="px-4 py-2 rounded bg-primary text-primary-foreground">
      Send
    </button>
  </div>
)

const MainContent = () => (
  <div className="p-4 h-full overflow-auto">
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
            {i % 2 === 0 ? '🤖' : '👤'}
          </div>
          <div
            className={`p-3 rounded-lg max-w-[80%] ${
              i % 2 === 0 ? 'bg-muted' : 'bg-primary text-primary-foreground'
            }`}
          >
            {i % 2 === 0
              ? 'This is an assistant message with helpful information.'
              : 'This is a user message asking a question.'}
          </div>
        </div>
      ))}
    </div>
  </div>
)

const meta = {
  title: 'Components/Layout/ResizableChatLayout',
  component: ResizableChatLayout,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Flexible chat layout with resizable panels powered by react-resizable-panels. Supports sidebar, header, footer, collapsible panels, and layout persistence.',
      },
    },
  },
  argTypes: {
    defaultSidebarSize: { control: { type: 'number', min: 10, max: 50 } },
    minSidebarSize: { control: { type: 'number', min: 5, max: 30 } },
    maxSidebarSize: { control: { type: 'number', min: 30, max: 60 } },
    sidebarPosition: { control: 'radio', options: ['left', 'right'] },
    collapsible: { control: 'boolean' },
    persistLayout: { control: 'boolean' },
    direction: { control: 'radio', options: ['horizontal', 'vertical'] },
  },
  args: {
    defaultSidebarSize: 25,
    minSidebarSize: 15,
    maxSidebarSize: 40,
    sidebarPosition: 'left',
    collapsible: true,
    persistLayout: false,
    direction: 'horizontal',
  },
  decorators: [
    (Story) => (
      <div className="h-[600px] border border-border rounded-lg overflow-hidden">
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof ResizableChatLayout>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    sidebar: <SidebarContent />,
    header: <HeaderContent />,
    footer: <FooterContent />,
    children: <MainContent />,
  },
}

export const WithoutSidebar: Story = {
  args: {
    header: <HeaderContent />,
    footer: <FooterContent />,
    children: <MainContent />,
  },
  parameters: {
    docs: {
      description: {
        story: 'Layout without sidebar - useful for focused chat experiences.',
      },
    },
  },
}

export const RightSidebar: Story = {
  args: {
    sidebar: <SidebarContent />,
    header: <HeaderContent />,
    footer: <FooterContent />,
    sidebarPosition: 'right',
    children: <MainContent />,
  },
  parameters: {
    docs: {
      description: {
        story: 'Sidebar positioned on the right side of the layout.',
      },
    },
  },
}

export const MinimalLayout: Story = {
  args: {
    children: <MainContent />,
  },
  parameters: {
    docs: {
      description: {
        story: 'Minimal layout with only the main content area.',
      },
    },
  },
}

export const WithPersistence: Story = {
  args: {
    sidebar: <SidebarContent />,
    header: <HeaderContent />,
    footer: <FooterContent />,
    persistLayout: true,
    persistenceKey: 'storybook-chat-layout',
    children: <MainContent />,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Layout sizes are persisted to localStorage. Resize the sidebar and refresh - it will remember your preference.',
      },
    },
  },
}

export const CollapsibleSidebar: Story = {
  args: {
    sidebar: <SidebarContent />,
    header: <HeaderContent />,
    footer: <FooterContent />,
    collapsible: true,
    collapsedSize: 0,
    children: <MainContent />,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Sidebar can be collapsed by dragging the resize handle to the minimum size.',
      },
    },
  },
}

// Interactive story with useResizableLayout hook
const InteractiveLayoutDemo = () => {
  const { ref, collapse, expand, isCollapsed } = useResizableLayout()
  const [collapsed, setCollapsed] = useState(false)

  const handleToggle = () => {
    if (collapsed) {
      expand()
    } else {
      collapse()
    }
    setCollapsed(!collapsed)
  }

  return (
    <div className="h-[600px]">
      <div className="p-2 border-b flex gap-2">
        <button
          onClick={handleToggle}
          className="px-3 py-1 text-sm rounded bg-primary text-primary-foreground"
        >
          {collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        </button>
      </div>
      <ResizableChatLayout
        sidebar={<SidebarContent />}
        header={<HeaderContent />}
        footer={<FooterContent />}
        collapsible
        panelRef={ref}
      >
        <MainContent />
      </ResizableChatLayout>
    </div>
  )
}

export const ProgrammaticControl: Story = {
  render: () => <InteractiveLayoutDemo />,
  parameters: {
    docs: {
      description: {
        story:
          'Use the useResizableLayout hook for programmatic control over panel collapse/expand.',
      },
    },
  },
}

export const VerticalLayout: Story = {
  args: {
    sidebar: (
      <div className="p-4">
        <h3 className="font-semibold">Top Panel</h3>
        <p className="text-sm text-muted-foreground">Context or history</p>
      </div>
    ),
    direction: 'vertical',
    defaultSidebarSize: 30,
    children: <MainContent />,
  },
  parameters: {
    docs: {
      description: {
        story: 'Vertical layout with top/bottom panels instead of left/right.',
      },
    },
  },
}

export const CustomStyling: Story = {
  args: {
    sidebar: <SidebarContent />,
    header: <HeaderContent />,
    footer: <FooterContent />,
    className: 'bg-gradient-to-br from-background to-muted/30',
    children: <MainContent />,
  },
  parameters: {
    docs: {
      description: {
        story: 'Custom styling via className prop.',
      },
    },
  },
}
