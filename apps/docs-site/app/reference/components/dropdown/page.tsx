import React from 'react'
import { ComponentLayout } from '@/components/layouts/component-layout'
import { LiveDemo } from '@/components/live-demo'
import { ApiTable } from '@/components/api-table'
import { Callout } from '@/components/callout'
import { CodeBlock } from '@/components/code-block'

export default function DropdownPage() {
  return (
    <ComponentLayout
      title="Dropdown"
      description="A versatile dropdown menu component for displaying a list of actions, options, or navigation items with support for keyboard navigation, icons, dividers, and nested submenus."
    >
      <section>
        <h2 id="overview">Overview</h2>
        <p>
          The Dropdown component provides a popover menu for displaying lists of actions or options.
          It supports keyboard navigation, icons, dividers, disabled items, nested submenus, selection
          states, and custom trigger elements. Perfect for action menus, navigation, filters, and
          user account menus.
        </p>
      </section>

      <section>
        <h2 id="basic-usage">Basic Usage</h2>
        <LiveDemo
          code={`import { Dropdown, Button } from '@clarity/chat'

export default function BasicDropdownDemo() {
  const items = [
    { id: 'new', label: 'New File', icon: '📄' },
    { id: 'open', label: 'Open...', icon: '📂' },
    { id: 'save', label: 'Save', icon: '💾', shortcut: 'Cmd+S' },
    { type: 'separator' },
    { id: 'exit', label: 'Exit', icon: '🚪' }
  ]
  
  const handleSelect = (itemId: string) => {
    console.log('Selected:', itemId)
  }
  
  return (
    <Dropdown
      items={items}
      onSelect={handleSelect}
      trigger={
        <Button variant="outline">
          File Menu
        </Button>
      }
    />
  )
}`}
        />
      </section>

      <section>
        <h2 id="props">Props</h2>
        <ApiTable
          type="props"
          data={[
            {
              property: 'items',
              type: 'DropdownItem[]',
              required: true,
              description: 'Array of dropdown items to display'
            },
            {
              property: 'trigger',
              type: 'React.ReactNode',
              required: true,
              description: 'Element that triggers the dropdown'
            },
            {
              property: 'onSelect',
              type: '(itemId: string) => void',
              description: 'Callback fired when an item is selected'
            },
            {
              property: 'placement',
              type: "'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'right'",
              default: "'bottom-start'",
              description: 'Placement of the dropdown relative to trigger'
            },
            {
              property: 'width',
              type: "'auto' | 'trigger' | number",
              default: "'auto'",
              description: "Width of the dropdown menu ('trigger' matches trigger width)"
            },
            {
              property: 'offset',
              type: 'number',
              default: '8',
              description: 'Distance in pixels between trigger and dropdown'
            },
            {
              property: 'closeOnSelect',
              type: 'boolean',
              default: 'true',
              description: 'Whether to close dropdown after selecting an item'
            },
            {
              property: 'disabled',
              type: 'boolean',
              default: 'false',
              description: 'Whether the dropdown is disabled'
            },
            {
              property: 'maxHeight',
              type: 'number',
              description: 'Maximum height of the dropdown menu in pixels'
            },
            {
              property: 'virtualized',
              type: 'boolean',
              default: 'false',
              description: 'Enable virtual scrolling for large lists'
            },
            {
              property: 'searchable',
              type: 'boolean',
              default: 'false',
              description: 'Enable search/filter functionality'
            },
            {
              property: 'searchPlaceholder',
              type: 'string',
              default: "'Search...'",
              description: 'Placeholder text for search input'
            },
            {
              property: 'selectionMode',
              type: "'none' | 'single' | 'multiple'",
              default: "'none'",
              description: 'Item selection behavior'
            },
            {
              property: 'selectedKeys',
              type: 'Set<string>',
              description: 'Currently selected item keys (controlled)'
            },
            {
              property: 'onSelectionChange',
              type: '(keys: Set<string>) => void',
              description: 'Callback when selection changes'
            },
            {
              property: 'className',
              type: 'string',
              description: 'Additional CSS classes for the dropdown container'
            }
          ]}
        />

        <h3 className="mt-6">DropdownItem Type</h3>
        <ApiTable
          type="props"
          data={[
            {
              property: 'id',
              type: 'string',
              description: 'Unique identifier for the item'
            },
            {
              property: 'label',
              type: 'string',
              description: 'Display text for the item'
            },
            {
              property: 'type',
              type: "'item' | 'separator' | 'header' | 'submenu'",
              default: "'item'",
              description: 'Type of dropdown item'
            },
            {
              property: 'icon',
              type: 'string | React.ReactNode',
              description: 'Icon to display before the label'
            },
            {
              property: 'shortcut',
              type: 'string',
              description: 'Keyboard shortcut hint to display'
            },
            {
              property: 'disabled',
              type: 'boolean',
              description: 'Whether the item is disabled'
            },
            {
              property: 'variant',
              type: "'default' | 'danger' | 'success'",
              default: "'default'",
              description: 'Visual style of the item'
            },
            {
              property: 'items',
              type: 'DropdownItem[]',
              description: 'Nested items for submenu type'
            },
            {
              property: 'description',
              type: 'string',
              description: 'Additional description text'
            }
          ]}
        />
      </section>

      <section>
        <h2 id="placement">Placement</h2>
        <p>
          Control where the dropdown appears relative to its trigger element with precise placement options.
        </p>

        <LiveDemo
          code={`import { Dropdown, Button } from '@clarity/chat'

export default function DropdownPlacementDemo() {
  const items = [
    { id: '1', label: 'Option 1' },
    { id: '2', label: 'Option 2' },
    { id: '3', label: 'Option 3' }
  ]
  
  const placements = [
    'top-start',
    'top',
    'top-end',
    'bottom-start',
    'bottom',
    'bottom-end',
    'left',
    'right'
  ]
  
  return (
    <div className="grid grid-cols-3 gap-4 p-8">
      {placements.map((placement) => (
        <div key={placement} className="flex justify-center">
          <Dropdown
            items={items}
            placement={placement as any}
            trigger={
              <Button variant="outline" size="sm">
                {placement}
              </Button>
            }
          />
        </div>
      ))}
    </div>
  )
}`}
        />
      </section>

      <section>
        <h2 id="icons-shortcuts">Icons and Shortcuts</h2>
        <p>
          Add visual icons and keyboard shortcut hints to dropdown items for better usability.
        </p>

        <LiveDemo
          code={`import { Dropdown, Button } from '@clarity/chat'

export default function IconsShortcutsDemo() {
  const items = [
    { id: 'new', label: 'New', icon: '✨', shortcut: 'Cmd+N' },
    { id: 'open', label: 'Open', icon: '📂', shortcut: 'Cmd+O' },
    { id: 'save', label: 'Save', icon: '💾', shortcut: 'Cmd+S' },
    { id: 'saveas', label: 'Save As...', icon: '📝', shortcut: 'Cmd+Shift+S' },
    { type: 'separator' },
    { id: 'print', label: 'Print', icon: '🖨️', shortcut: 'Cmd+P' },
    { id: 'share', label: 'Share', icon: '🔗', shortcut: 'Cmd+Shift+C' },
    { type: 'separator' },
    { id: 'settings', label: 'Settings', icon: '⚙️', shortcut: 'Cmd+,' },
    { id: 'quit', label: 'Quit', icon: '🚪', shortcut: 'Cmd+Q', variant: 'danger' }
  ]
  
  return (
    <Dropdown
      items={items}
      onSelect={(id) => alert(\`Selected: \${id}\`)}
      trigger={
        <Button variant="outline">
          File Menu
        </Button>
      }
    />
  )
}`}
        />
      </section>

      <section>
        <h2 id="variants">Item Variants</h2>
        <p>
          Use different visual styles to indicate the nature of actions, especially for destructive operations.
        </p>

        <LiveDemo
          code={`import { Dropdown, Button } from '@clarity/chat'

export default function VariantsDemo() {
  const items = [
    { id: 'view', label: 'View Profile', icon: '👤' },
    { id: 'edit', label: 'Edit Profile', icon: '✏️' },
    { type: 'separator' },
    { id: 'upgrade', label: 'Upgrade Plan', icon: '⭐', variant: 'success' },
    { type: 'separator' },
    { id: 'logout', label: 'Log Out', icon: '🚪' },
    { id: 'delete', label: 'Delete Account', icon: '🗑️', variant: 'danger' }
  ]
  
  return (
    <Dropdown
      items={items}
      onSelect={(id) => alert(\`Selected: \${id}\`)}
      trigger={
        <Button variant="outline">
          Account
        </Button>
      }
    />
  )
}`}
        />
      </section>

      <section>
        <h2 id="nested-submenus">Nested Submenus</h2>
        <p>
          Create hierarchical menus with nested submenus for organizing complex actions.
        </p>

        <LiveDemo
          code={`import { Dropdown, Button } from '@clarity/chat'

export default function SubmenusDemo() {
  const items = [
    { id: 'new', label: 'New', icon: '✨', shortcut: 'Cmd+N' },
    {
      id: 'open-recent',
      label: 'Open Recent',
      icon: '📂',
      type: 'submenu',
      items: [
        { id: 'recent-1', label: 'Project Alpha' },
        { id: 'recent-2', label: 'Project Beta' },
        { id: 'recent-3', label: 'Project Gamma' },
        { type: 'separator' },
        { id: 'clear-recent', label: 'Clear Recent' }
      ]
    },
    { id: 'save', label: 'Save', icon: '💾', shortcut: 'Cmd+S' },
    { type: 'separator' },
    {
      id: 'export',
      label: 'Export',
      icon: '📤',
      type: 'submenu',
      items: [
        { id: 'pdf', label: 'Export as PDF', icon: '📄' },
        { id: 'png', label: 'Export as PNG', icon: '🖼️' },
        { id: 'svg', label: 'Export as SVG', icon: '🎨' },
        {
          id: 'advanced',
          label: 'Advanced',
          type: 'submenu',
          items: [
            { id: 'high-res', label: 'High Resolution' },
            { id: 'compressed', label: 'Compressed' },
            { id: 'batch', label: 'Batch Export' }
          ]
        }
      ]
    },
    { type: 'separator' },
    { id: 'print', label: 'Print', icon: '🖨️', shortcut: 'Cmd+P' }
  ]
  
  return (
    <Dropdown
      items={items}
      onSelect={(id) => alert(\`Selected: \${id}\`)}
      trigger={
        <Button variant="outline">
          File
        </Button>
      }
    />
  )
}`}
        />
      </section>

      <section>
        <h2 id="headers-descriptions">Headers and Descriptions</h2>
        <p>
          Add section headers and item descriptions for better organization and clarity.
        </p>

        <LiveDemo
          code={`import { Dropdown, Button } from '@clarity/chat'

export default function HeadersDescriptionsDemo() {
  const items = [
    { type: 'header', label: 'Profile' },
    {
      id: 'account',
      label: 'Account Settings',
      icon: '⚙️',
      description: 'Manage your account preferences'
    },
    {
      id: 'billing',
      label: 'Billing',
      icon: '💳',
      description: 'View and update payment methods'
    },
    { type: 'separator' },
    { type: 'header', label: 'Workspace' },
    {
      id: 'members',
      label: 'Team Members',
      icon: '👥',
      description: 'Invite and manage team members'
    },
    {
      id: 'integrations',
      label: 'Integrations',
      icon: '🔌',
      description: 'Connect external services'
    },
    { type: 'separator' },
    { type: 'header', label: 'Support' },
    {
      id: 'help',
      label: 'Help Center',
      icon: '❓',
      description: 'Browse documentation and guides'
    },
    {
      id: 'contact',
      label: 'Contact Support',
      icon: '💬',
      description: 'Get help from our team'
    }
  ]
  
  return (
    <Dropdown
      items={items}
      onSelect={(id) => alert(\`Selected: \${id}\`)}
      width={280}
      trigger={
        <Button variant="outline">
          Settings
        </Button>
      }
    />
  )
}`}
        />
      </section>

      <section>
        <h2 id="searchable">Searchable Dropdown</h2>
        <p>
          Enable search functionality for dropdowns with many items to help users find options quickly.
        </p>

        <LiveDemo
          code={`import { Dropdown, Button } from '@clarity/chat'

export default function SearchableDemo() {
  const countries = [
    { id: 'us', label: 'United States', icon: '🇺🇸' },
    { id: 'uk', label: 'United Kingdom', icon: '🇬🇧' },
    { id: 'ca', label: 'Canada', icon: '🇨🇦' },
    { id: 'au', label: 'Australia', icon: '🇦🇺' },
    { id: 'de', label: 'Germany', icon: '🇩🇪' },
    { id: 'fr', label: 'France', icon: '🇫🇷' },
    { id: 'it', label: 'Italy', icon: '🇮🇹' },
    { id: 'es', label: 'Spain', icon: '🇪🇸' },
    { id: 'jp', label: 'Japan', icon: '🇯🇵' },
    { id: 'cn', label: 'China', icon: '🇨🇳' },
    { id: 'br', label: 'Brazil', icon: '🇧🇷' },
    { id: 'in', label: 'India', icon: '🇮🇳' },
    { id: 'mx', label: 'Mexico', icon: '🇲🇽' },
    { id: 'kr', label: 'South Korea', icon: '🇰🇷' },
    { id: 'ru', label: 'Russia', icon: '🇷🇺' }
  ]
  
  return (
    <Dropdown
      items={countries}
      onSelect={(id) => alert(\`Selected country: \${id}\`)}
      searchable
      searchPlaceholder="Search countries..."
      maxHeight={300}
      trigger={
        <Button variant="outline">
          Select Country
        </Button>
      }
    />
  )
}`}
        />
      </section>

      <section>
        <h2 id="selection-modes">Selection Modes</h2>
        <p>
          Support single or multiple selection with checkboxes for building filters and multi-select menus.
        </p>

        <LiveDemo
          code={`import { Dropdown, Button } from '@clarity/chat'
import { useState } from 'react'

export default function SelectionDemo() {
  const [singleSelection, setSingleSelection] = useState(new Set(['medium']))
  const [multiSelection, setMultiSelection] = useState(new Set(['email', 'push']))
  
  const sizeItems = [
    { id: 'small', label: 'Small', description: 'For compact layouts' },
    { id: 'medium', label: 'Medium', description: 'Standard size' },
    { id: 'large', label: 'Large', description: 'For emphasis' }
  ]
  
  const notificationItems = [
    { id: 'email', label: 'Email notifications', icon: '📧' },
    { id: 'push', label: 'Push notifications', icon: '🔔' },
    { id: 'sms', label: 'SMS notifications', icon: '💬' },
    { id: 'desktop', label: 'Desktop notifications', icon: '🖥️' }
  ]
  
  return (
    <div className="flex gap-4">
      <div>
        <p className="text-sm mb-2">Single Selection:</p>
        <Dropdown
          items={sizeItems}
          selectionMode="single"
          selectedKeys={singleSelection}
          onSelectionChange={setSingleSelection}
          trigger={
            <Button variant="outline">
              Size: {Array.from(singleSelection)[0]}
            </Button>
          }
        />
      </div>
      
      <div>
        <p className="text-sm mb-2">Multiple Selection:</p>
        <Dropdown
          items={notificationItems}
          selectionMode="multiple"
          selectedKeys={multiSelection}
          onSelectionChange={setMultiSelection}
          closeOnSelect={false}
          trigger={
            <Button variant="outline">
              Notifications ({multiSelection.size})
            </Button>
          }
        />
      </div>
    </div>
  )
}`}
        />

        <Callout type="tip">
          When using <code>selectionMode="multiple"</code>, set <code>closeOnSelect={'{false}'}</code> to
          allow users to select multiple items without the dropdown closing after each selection.
        </Callout>
      </section>

      <section>
        <h2 id="disabled-items">Disabled Items</h2>
        <p>
          Disable specific items to indicate unavailable actions while keeping them visible.
        </p>

        <LiveDemo
          code={`import { Dropdown, Button } from '@clarity/chat'

export default function DisabledItemsDemo() {
  const items = [
    { id: 'undo', label: 'Undo', icon: '↶', shortcut: 'Cmd+Z', disabled: true },
    { id: 'redo', label: 'Redo', icon: '↷', shortcut: 'Cmd+Shift+Z', disabled: true },
    { type: 'separator' },
    { id: 'cut', label: 'Cut', icon: '✂️', shortcut: 'Cmd+X' },
    { id: 'copy', label: 'Copy', icon: '📋', shortcut: 'Cmd+C' },
    { id: 'paste', label: 'Paste', icon: '📄', shortcut: 'Cmd+V', disabled: true },
    { type: 'separator' },
    { id: 'select-all', label: 'Select All', icon: '☑️', shortcut: 'Cmd+A' }
  ]
  
  return (
    <Dropdown
      items={items}
      onSelect={(id) => alert(\`Selected: \${id}\`)}
      trigger={
        <Button variant="outline">
          Edit
        </Button>
      }
    />
  )
}`}
        />
      </section>

      <section>
        <h2 id="custom-triggers">Custom Triggers</h2>
        <p>
          Use any element as a dropdown trigger, including avatars, icons, or custom components.
        </p>

        <LiveDemo
          code={`import { Dropdown, Avatar } from '@clarity/chat'

export default function CustomTriggersDemo() {
  const userMenuItems = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
    { type: 'separator' },
    { id: 'logout', label: 'Log out', icon: '🚪' }
  ]
  
  const moreMenuItems = [
    { id: 'refresh', label: 'Refresh' },
    { id: 'share', label: 'Share' },
    { id: 'report', label: 'Report' }
  ]
  
  return (
    <div className="flex gap-8">
      {/* Avatar Trigger */}
      <Dropdown
        items={userMenuItems}
        onSelect={(id) => alert(\`User menu: \${id}\`)}
        trigger={
          <button className="hover:opacity-80 transition-opacity">
            <Avatar
              src="/avatar.jpg"
              name="John Doe"
              size="md"
              status="online"
            />
          </button>
        }
      />
      
      {/* Icon Trigger */}
      <Dropdown
        items={moreMenuItems}
        onSelect={(id) => alert(\`More menu: \${id}\`)}
        trigger={
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <span className="text-xl">⋮</span>
          </button>
        }
      />
      
      {/* Custom Badge Trigger */}
      <Dropdown
        items={userMenuItems}
        onSelect={(id) => alert(\`Badge menu: \${id}\`)}
        trigger={
          <button className="relative px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            Account
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </button>
        }
      />
    </div>
  )
}`}
        />
      </section>

      <section>
        <h2 id="width-control">Width Control</h2>
        <p>
          Control the dropdown width to match the trigger or set a custom width.
        </p>

        <LiveDemo
          code={`import { Dropdown, Button } from '@clarity/chat'

export default function WidthControlDemo() {
  const items = [
    { id: '1', label: 'Option 1', description: 'Short description' },
    { id: '2', label: 'Option 2', description: 'Short description' },
    { id: '3', label: 'Option 3', description: 'Short description' }
  ]
  
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm mb-2">Auto Width (default):</p>
        <Dropdown
          items={items}
          width="auto"
          trigger={<Button variant="outline">Small Trigger</Button>}
        />
      </div>
      
      <div>
        <p className="text-sm mb-2">Match Trigger Width:</p>
        <Dropdown
          items={items}
          width="trigger"
          trigger={
            <Button variant="outline" className="w-64">
              Wide Trigger Button
            </Button>
          }
        />
      </div>
      
      <div>
        <p className="text-sm mb-2">Custom Width (320px):</p>
        <Dropdown
          items={items}
          width={320}
          trigger={<Button variant="outline">Small Trigger</Button>}
        />
      </div>
    </div>
  )
}`}
        />
      </section>

      <section>
        <h2 id="advanced-patterns">Advanced Patterns</h2>

        <h3 id="command-palette">Command Palette Pattern</h3>
        <p>
          Create a searchable command palette with keyboard shortcuts and categories.
        </p>

        <LiveDemo
          code={`import { Dropdown, Button } from '@clarity/chat'
import { useState } from 'react'

export default function CommandPaletteDemo() {
  const [isOpen, setIsOpen] = useState(false)
  
  const commands = [
    { type: 'header', label: 'Navigation' },
    { id: 'home', label: 'Go to Home', icon: '🏠', shortcut: 'G then H' },
    { id: 'inbox', label: 'Go to Inbox', icon: '📥', shortcut: 'G then I' },
    { id: 'projects', label: 'Go to Projects', icon: '📁', shortcut: 'G then P' },
    { type: 'separator' },
    { type: 'header', label: 'Actions' },
    { id: 'new', label: 'Create New', icon: '✨', shortcut: 'Cmd+N' },
    { id: 'search', label: 'Search', icon: '🔍', shortcut: 'Cmd+K' },
    { id: 'settings', label: 'Open Settings', icon: '⚙️', shortcut: 'Cmd+,' },
    { type: 'separator' },
    { type: 'header', label: 'Theme' },
    { id: 'light', label: 'Light Mode', icon: '☀️' },
    { id: 'dark', label: 'Dark Mode', icon: '🌙' },
    { id: 'system', label: 'System Theme', icon: '💻' }
  ]
  
  return (
    <Dropdown
      items={commands}
      searchable
      searchPlaceholder="Type a command or search..."
      onSelect={(id) => {
        alert(\`Command: \${id}\`)
        setIsOpen(false)
      }}
      width={400}
      maxHeight={500}
      trigger={
        <Button variant="outline">
          🔍 Command Palette <kbd className="ml-2 px-2 py-0.5 text-xs bg-gray-200 dark:bg-gray-700 rounded">Cmd+K</kbd>
        </Button>
      }
    />
  )
}`}
        />

        <h3 id="filter-dropdown">Filter Dropdown Pattern</h3>
        <p>
          Build advanced filter interfaces with multi-select and visual feedback.
        </p>

        <LiveDemo
          code={`import { Dropdown, Button, Badge } from '@clarity/chat'
import { useState } from 'react'

export default function FilterDropdownDemo() {
  const [statusFilters, setStatusFilters] = useState(new Set())
  const [priorityFilters, setPriorityFilters] = useState(new Set())
  
  const statusItems = [
    { id: 'open', label: 'Open', icon: '🟢' },
    { id: 'in-progress', label: 'In Progress', icon: '🟡' },
    { id: 'review', label: 'In Review', icon: '🔵' },
    { id: 'closed', label: 'Closed', icon: '⚫' }
  ]
  
  const priorityItems = [
    { id: 'low', label: 'Low', icon: '⬇️' },
    { id: 'medium', label: 'Medium', icon: '➡️' },
    { id: 'high', label: 'High', icon: '⬆️' },
    { id: 'urgent', label: 'Urgent', icon: '🔴' }
  ]
  
  const totalFilters = statusFilters.size + priorityFilters.size
  
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Dropdown
          items={statusItems}
          selectionMode="multiple"
          selectedKeys={statusFilters}
          onSelectionChange={setStatusFilters}
          closeOnSelect={false}
          trigger={
            <Button variant="outline">
              Status
              {statusFilters.size > 0 && (
                <Badge variant="primary" className="ml-2">
                  {statusFilters.size}
                </Badge>
              )}
            </Button>
          }
        />
        
        <Dropdown
          items={priorityItems}
          selectionMode="multiple"
          selectedKeys={priorityFilters}
          onSelectionChange={setPriorityFilters}
          closeOnSelect={false}
          trigger={
            <Button variant="outline">
              Priority
              {priorityFilters.size > 0 && (
                <Badge variant="primary" className="ml-2">
                  {priorityFilters.size}
                </Badge>
              )}
            </Button>
          }
        />
        
        {totalFilters > 0 && (
          <Button
            variant="ghost"
            onClick={() => {
              setStatusFilters(new Set())
              setPriorityFilters(new Set())
            }}
          >
            Clear All
          </Button>
        )}
      </div>
      
      {totalFilters > 0 && (
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-sm font-medium mb-2">Active Filters:</p>
          <div className="flex flex-wrap gap-2">
            {Array.from(statusFilters).map((filter) => (
              <Badge key={filter} variant="primary">
                {filter}
              </Badge>
            ))}
            {Array.from(priorityFilters).map((filter) => (
              <Badge key={filter} variant="warning">
                {filter}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}`}
        />
      </section>

      <section>
        <h2 id="accessibility">Accessibility</h2>
        <p>
          The Dropdown component follows WAI-ARIA best practices for menu accessibility:
        </p>

        <ul className="space-y-2">
          <li>
            <strong>Keyboard Navigation:</strong>
            <ul className="ml-6 mt-2 space-y-1">
              <li><kbd>Space</kbd> / <kbd>Enter</kbd> - Opens/closes the dropdown (when trigger is focused)</li>
              <li><kbd>↓</kbd> - Moves focus to the next item</li>
              <li><kbd>↑</kbd> - Moves focus to the previous item</li>
              <li><kbd>Home</kbd> - Moves focus to the first item</li>
              <li><kbd>End</kbd> - Moves focus to the last item</li>
              <li><kbd>→</kbd> - Opens submenu (if focused item has submenu)</li>
              <li><kbd>←</kbd> - Closes submenu and returns to parent</li>
              <li><kbd>Esc</kbd> - Closes the dropdown</li>
              <li><kbd>Space</kbd> / <kbd>Enter</kbd> - Selects the focused item</li>
            </ul>
          </li>
          <li>
            <strong>ARIA Attributes:</strong> Uses <code>role="menu"</code>, <code>aria-haspopup</code>,
            <code>aria-expanded</code>, and proper item roles
          </li>
          <li>
            <strong>Focus Management:</strong> Maintains focus within the menu and returns focus to
            trigger on close
          </li>
          <li>
            <strong>Screen Reader Support:</strong> Announces menu state, selected items, and keyboard
            shortcuts
          </li>
          <li>
            <strong>Disabled State:</strong> Disabled items are marked with <code>aria-disabled</code>
            and are not keyboard navigable
          </li>
        </ul>

        <Callout type="tip">
          Always provide meaningful labels for dropdown items. Use icons as supplementary visuals,
          not as the sole means of conveying information.
        </Callout>
      </section>

      <section>
        <h2 id="best-practices">Best Practices</h2>

        <h3>When to Use Dropdowns</h3>
        <ul className="space-y-2">
          <li>✅ Displaying a list of actions or commands</li>
          <li>✅ Building navigation menus</li>
          <li>✅ Creating context menus for items</li>
          <li>✅ Providing user account options</li>
          <li>✅ Offering filtering and sorting options</li>
          <li>✅ Displaying a list of choices (3-15 items)</li>
        </ul>

        <h3 className="mt-4">When NOT to Use Dropdowns</h3>
        <ul className="space-y-2">
          <li>❌ For 2-3 simple options (use radio buttons or tabs instead)</li>
          <li>❌ For very long lists (consider autocomplete or virtual scrolling)</li>
          <li>❌ When all options should be visible (use checkboxes or radio buttons)</li>
          <li>❌ For critical actions that need more prominence (use dedicated buttons)</li>
        </ul>

        <h3 className="mt-4">Design Guidelines</h3>
        <Callout type="tip">
          <ul className="space-y-2">
            <li>Keep item labels short and descriptive</li>
            <li>Use consistent icon styles throughout the dropdown</li>
            <li>Group related items with separators</li>
            <li>Place destructive actions at the bottom with visual distinction</li>
            <li>Limit nesting to 2-3 levels maximum</li>
            <li>Use headers to organize long lists</li>
            <li>Show keyboard shortcuts for power users</li>
            <li>Provide search for dropdowns with many items</li>
            <li>Use appropriate placement to avoid viewport overflow</li>
          </ul>
        </Callout>

        <h3 className="mt-4">Performance Tips</h3>
        <ul className="space-y-2">
          <li>Enable <code>virtualized</code> for lists with 100+ items</li>
          <li>Use <code>maxHeight</code> to prevent extremely tall dropdowns</li>
          <li>Lazy load submenu items when possible</li>
          <li>Debounce search input for better performance</li>
        </ul>
      </section>

      <section>
        <h2 id="typescript">TypeScript</h2>
        <CodeBlock
          language="typescript"
          code={`import { ReactNode } from 'react'

type DropdownItemType = 'item' | 'separator' | 'header' | 'submenu'
type DropdownVariant = 'default' | 'danger' | 'success'
type DropdownPlacement = 
  | 'top' | 'top-start' | 'top-end'
  | 'bottom' | 'bottom-start' | 'bottom-end'
  | 'left' | 'right'

interface DropdownItem {
  id?: string
  label?: string
  type?: DropdownItemType
  icon?: string | ReactNode
  shortcut?: string
  disabled?: boolean
  variant?: DropdownVariant
  items?: DropdownItem[]
  description?: string
}

interface DropdownProps {
  // Required
  items: DropdownItem[]
  trigger: ReactNode
  
  // Callbacks
  onSelect?: (itemId: string) => void
  onSelectionChange?: (keys: Set<string>) => void
  
  // Positioning
  placement?: DropdownPlacement
  width?: 'auto' | 'trigger' | number
  offset?: number
  
  // Behavior
  closeOnSelect?: boolean
  disabled?: boolean
  maxHeight?: number
  virtualized?: boolean
  
  // Search
  searchable?: boolean
  searchPlaceholder?: string
  
  // Selection
  selectionMode?: 'none' | 'single' | 'multiple'
  selectedKeys?: Set<string>
  
  // Styling
  className?: string
}

// Example usage with TypeScript
const FileMenu: React.FC = () => {
  const [recentFiles, setRecentFiles] = useState<string[]>([])
  
  const menuItems: DropdownItem[] = [
    {
      id: 'new',
      label: 'New File',
      icon: '📄',
      shortcut: 'Cmd+N'
    },
    {
      id: 'open-recent',
      label: 'Open Recent',
      type: 'submenu',
      items: recentFiles.map((file) => ({
        id: file,
        label: file
      }))
    },
    {
      type: 'separator'
    },
    {
      id: 'quit',
      label: 'Quit',
      variant: 'danger',
      shortcut: 'Cmd+Q'
    }
  ]
  
  const handleSelect = (itemId: string) => {
    console.log('Selected:', itemId)
  }
  
  return (
    <Dropdown
      items={menuItems}
      onSelect={handleSelect}
      trigger={<Button>File</Button>}
    />
  )
}`}
        />
      </section>

      <section>
        <h2 id="related">Related</h2>
        <ul>
          <li><a href="/reference/components/menu">Menu</a> - Alternative menu component</li>
          <li><a href="/reference/components/select">Select</a> - Form select input</li>
          <li><a href="/reference/components/popover">Popover</a> - Generic popover container</li>
          <li><a href="/reference/components/context-menu">Context Menu</a> - Right-click menu</li>
          <li><a href="/reference/components/button">Button</a> - Common trigger element</li>
          <li><a href="/reference/hooks/use-disclosure">useDisclosure</a> - Hook for managing open state</li>
        </ul>
      </section>
    </ComponentLayout>
  )
}
