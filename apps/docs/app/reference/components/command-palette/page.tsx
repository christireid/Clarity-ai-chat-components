'use client'

import { useState, useEffect, useMemo } from 'react'
import { ToastProvider, CommandPalette } from '@clarity-chat/react'
import type { CommandItem } from '@clarity-chat/react'
import { Badge } from '@clarity-chat/primitives'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Pagination } from '@/components/Navigation/Pagination'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { ViewInStorybook } from '@/components/Links/StorybookLink'
import { ComponentPreview } from '@/components/Demo/ComponentPreview'
import { ScrollReveal, ScrollRevealItem } from '@/components/UI/ScrollReveal'
import { 
  MessageSquare, 
  Search, 
  Settings, 
  Moon, 
  Sun, 
  LogOut,
  Terminal,
  Calculator,
  Calendar
} from 'lucide-react'


function BasicCommandPaletteDemo() {
  const [open, setOpen] = useState(false)
  const [lastAction, setLastAction] = useState<string | null>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const commands: CommandItem[] = [
    {
      id: 'new-chat',
      label: 'New Chat',
      icon: <MessageSquare className="w-4 h-4" />,
      group: 'Actions',
      shortcut: '⌘N',
      onSelect: () => setLastAction('Created new chat'),
    },
    {
      id: 'search',
      label: 'Search Messages',
      icon: <Search className="w-4 h-4" />,
      group: 'Actions',
      shortcut: '⌘F',
      onSelect: () => setLastAction('Opened search'),
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-4 h-4" />,
      group: 'System',
      onSelect: () => setLastAction('Opened settings'),
    },
    {
      id: 'theme',
      label: 'Toggle Theme',
      icon: <Moon className="w-4 h-4" />,
      group: 'System',
      shortcut: '⌘D',
      onSelect: () => setLastAction('Toggled theme'),
    },
  ]

  return (
    <div className="flex flex-col items-center justify-center p-8 border rounded-lg bg-background min-h-[200px]">
      <button 
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors shadow-sm font-medium flex items-center gap-2"
      >
        <Terminal className="w-4 h-4" />
        Open Command Palette (⌘K)
      </button>
      
      {lastAction && (
        <div className="mt-4 text-sm text-muted-foreground animate-in fade-in slide-in-from-bottom-2">
          Last action: <span className="font-semibold text-foreground">{lastAction}</span>
        </div>
      )}

      <CommandPalette
        items={commands}
        open={open}
        onClose={() => setOpen(false)}
        placeholder="Type a command or search..."
      />
    </div>
  )
}

const commandPaletteProps: Prop[] = [
  {
    name: 'items',
    type: 'CommandItem[]',
    required: true,
    description: 'Array of command items to display',
  },
  {
    name: 'open',
    type: 'boolean',
    required: true,
    description: 'Controls visibility of the command palette',
  },
  {
    name: 'onClose',
    type: '() => void',
    required: true,
    description: 'Callback when palette should close',
  },
  {
    name: 'onSelect',
    type: '(item: CommandItem) => void',
    description: 'Callback when an item is selected',
  },
  {
    name: 'placeholder',
    type: 'string',
    default: '"Type a command or search..."',
    description: 'Search input placeholder text',
  },
  {
    name: 'emptyText',
    type: 'string',
    default: '"No results found"',
    description: 'Text shown when search has no results',
  },
  {
    name: 'groups',
    type: 'string[]',
    description: 'Custom group ordering',
  },
  {
    name: 'showIcons',
    type: 'boolean',
    default: 'true',
    description: 'Show command icons',
  },
  {
    name: 'showShortcuts',
    type: 'boolean',
    default: 'true',
    description: 'Show keyboard shortcuts',
  },
  {
    name: 'maxHeight',
    type: 'string',
    default: '"400px"',
    description: 'Maximum height of results list',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes',
  },
]

export default function CommandPalettePage() {
  return (
    <ToastProvider>
      <div className="docs-content">
        <Breadcrumbs />

        <ScrollReveal>
          <div className="flex gap-2 mb-3">
            <Badge variant="subtle" size="sm">Component</Badge>
            <Badge variant="info" size="sm">Interactive</Badge>
          </div>

          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-brand-500 to-brand-600 bg-clip-text text-transparent">
              CommandPalette
            </h1>

            <p className="text-xl text-text-secondary leading-relaxed">
              A keyboard-driven command palette interface, inspired by Spotlight and macOS.
              Give your power users super-powers with instant access to actions and navigation.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <ViewInStorybook component="CommandPalette" />
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <Callout type="tip" className="mb-8">
            <p>
              The CommandPalette is accessible by default, managing focus trap, keyboard navigation,
              and screen reader announcements automatically.
            </p>
          </Callout>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <h2 id="demo">Interactive Demo</h2>
          <ComponentPreview
            title="Command Palette"
            description="Press Cmd+K or click the button to open."
            code={`import { useState, useEffect } from 'react'
import { CommandPalette, CommandItem } from '@clarity-chat/react'
import { MessageSquare, Search, Settings } from 'lucide-react'

function Demo() {
  const [open, setOpen] = useState(false)

  // Toggle with Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const commands = [
    {
      id: 'new',
      label: 'New Chat',
      icon: <MessageSquare className="w-4 h-4" />,
      shortcut: '⌘N',
      onSelect: () => console.log('New Chat'),
    },
    // ... more commands
  ]

  return (
    <>
      <button onClick={() => setOpen(true)}>Open Palette</button>
      <CommandPalette
        open={open}
        onClose={() => setOpen(false)}
        items={commands}
      />
    </>
  )
}`}
          >
            <BasicCommandPaletteDemo />
          </ComponentPreview>
        </ScrollReveal>

        <ScrollReveal delay={0.4}>
          <h2 id="import">Import</h2>
          <EnhancedCodeBlock
            code={`import { CommandPalette } from '@clarity-chat/react'
import type { CommandItem } from '@clarity-chat/react'`}
            language="tsx"
          />
        </ScrollReveal>

        <ScrollReveal delay={0.5}>
          <h2 id="configuration">Configuration</h2>
          
          <div className="grid md:grid-cols-2 gap-8 my-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Command Items</h3>
              <p className="mb-4 text-muted-foreground">
                Define your commands with labels, icons, groups, and shortcuts.
              </p>
              <EnhancedCodeBlock
                language="tsx"
                code={`const commands: CommandItem[] = [
  {
    id: 'save',
    label: 'Save Changes',
    icon: <SaveIcon />,
    group: 'File',
    shortcut: '⌘S',
    onSelect: () => save(),
  }
]`}
              />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Grouping</h3>
              <p className="mb-4 text-muted-foreground">
                Organize commands into logical sections. The component handles rendering group headers.
              </p>
              <EnhancedCodeBlock
                language="tsx"
                code={`<CommandPalette
  items={commands}
  groups={['Recent', 'File', 'Edit']} // Custom order
/>`}
              />
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.6}>
          <h2 id="dynamic-commands">Dynamic Commands</h2>
          <p className="mb-4">
            You can generate commands dynamically based on application state:
          </p>
          <EnhancedCodeBlock
            language="tsx"
            code={`function useCommands() {
  const { theme, setTheme } = useTheme()
  
  return useMemo(() => [
    {
      id: 'theme',
      label: theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode',
      icon: theme === 'dark' ? <Sun /> : <Moon />,
      onSelect: () => setTheme(theme === 'dark' ? 'light' : 'dark'),
    }
  ], [theme])
}`}
          />
        </ScrollReveal>

        <ScrollReveal delay={0.7}>
          <h2 id="props">Props</h2>
          <PropsTable props={commandPaletteProps} />
        </ScrollReveal>

        <ScrollReveal delay={0.8}>
          <h2 id="accessibility">Accessibility</h2>
          <ul className="mb-8 space-y-2">
            <li>✅ <strong>Focus Trap:</strong> Keeps focus within the modal when open</li>
            <li>✅ <strong>Keyboard Navigation:</strong> Arrow keys to move, Enter to select</li>
            <li>✅ <strong>Screen Reader:</strong> Announces results and selection</li>
            <li>✅ <strong>ARIA:</strong> Proper roles for combobox/listbox pattern</li>
          </ul>
        </ScrollReveal>

        <ScrollReveal delay={0.9}>
          <h2 id="related">Related</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <a href="/reference/components/advanced-chat-input" className="p-4 border rounded-lg hover:border-brand-500 transition-colors">
              <h3 className="font-semibold mb-1">AdvancedChatInput</h3>
              <p className="text-sm text-muted-foreground">Inline commands with / slash menu</p>
            </a>
            <a href="/reference/hooks/use-keyboard-shortcuts" className="p-4 border rounded-lg hover:border-brand-500 transition-colors">
              <h3 className="font-semibold mb-1">useKeyboardShortcuts</h3>
              <p className="text-sm text-muted-foreground">Hook for global shortcuts</p>
            </a>
          </div>
        </ScrollReveal>

        <Pagination
          prev={{
            title: 'TypingIndicator',
            href: '/reference/components/typing-indicator',
          }}
          next={{
            title: 'ContextMenu',
            href: '/reference/components/context-menu',
          }}
        />
      </div>
    </ToastProvider>
  )
}
