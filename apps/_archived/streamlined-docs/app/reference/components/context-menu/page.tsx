'use client'

/**
 * ContextMenu Component - API Reference Documentation
 *
 * Right-click context menu with keyboard navigation, nested submenus,
 * and custom actions for building rich contextual interfaces.
 */

import * as React from 'react'
import {
  Menu,
  MousePointerClick,
  Keyboard,
  List,
  Layers,
  Copy,
  Check,
  Edit,
  Trash2,
  Download,
  Share2,
  Settings,
  ChevronRight,
  Zap,
  Terminal,
} from 'lucide-react'
import { cn } from '../../../../../lib/utils'
import { durations } from '../../../../../lib/animations'
import { DocumentationPage } from '../../../../../components/Docs/DocumentationPage'
import { CodeBlock } from '../../../../../components/Docs/CodeBlock'
import type {
  Badge,
  FeatureHighlight,
  RelatedAPI,
  FooterLink,
  TocItem,
} from '../../../../../components/Docs/DocumentationPage'

// ISR Configuration: API documentation changes with code updates
export const revalidate = 3600

// ============================================================================
// Props Table Component
// ============================================================================

interface PropDefinition {
  name: string
  type: string
  default?: string
  required?: boolean
  description: string
  deprecated?: boolean
  deprecatedMessage?: string
}

function PropsTable({
  props,
  title,
}: {
  props: PropDefinition[]
  title?: string
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border/50">
      {title && (
        <div className="px-4 py-3 bg-muted/30 border-b border-border/50">
          <h4 className="font-semibold text-foreground">{title}</h4>
        </div>
      )}
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/50 bg-muted/20">
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Name
            </th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Type
            </th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Default
            </th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Description
            </th>
          </tr>
        </thead>
        <tbody>
          {props.map((prop, index) => (
            <tr
              key={prop.name}
              className={cn(
                'border-b border-border/30 last:border-b-0',
                index % 2 === 0 ? 'bg-transparent' : 'bg-muted/10',
                prop.deprecated && 'opacity-60'
              )}
            >
              <td className="px-4 py-3 font-mono text-sm">
                <span
                  className={cn(
                    'text-brand-600 dark:text-brand-400',
                    prop.deprecated && 'line-through'
                  )}
                >
                  {prop.name}
                </span>
                {prop.required && (
                  <span className="ml-1 text-red-500" title="Required">
                    *
                  </span>
                )}
                {prop.deprecated && (
                  <span className="ml-2 px-1.5 py-0.5 text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded">
                    deprecated
                  </span>
                )}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-muted-foreground max-w-[200px] break-words">
                {prop.type}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-neutral-500">
                {prop.default || '-'}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {prop.description}
                {prop.deprecatedMessage && (
                  <span className="block mt-1 text-xs text-amber-600 dark:text-amber-400">
                    {prop.deprecatedMessage}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ============================================================================
// Section Components
// ============================================================================

function Section({
  id,
  title,
  children,
  className,
}: {
  id: string
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section id={id} className={cn('scroll-mt-24', className)}>
      <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
        <a
          href={`#${id}`}
          className="hover:text-brand-500 transition-colors group"
        >
          {title}
          <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">
            #
          </span>
        </a>
      </h2>
      {children}
    </section>
  )
}

function SubSection({
  id,
  title,
  children,
}: {
  id: string
  title: string
  children: React.ReactNode
}) {
  return (
    <div id={id} className="scroll-mt-24 mt-8">
      <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
        <a
          href={`#${id}`}
          className="hover:text-brand-500 transition-colors group"
        >
          {title}
          <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 text-base">
            #
          </span>
        </a>
      </h3>
      {children}
    </div>
  )
}

// ============================================================================
// Live Demo Component
// ============================================================================

function LiveDemo() {
  const [actionLog, setActionLog] = React.useState<string[]>([])

  const addLog = (action: string) => {
    setActionLog((prev) => [...prev.slice(-4), action])
  }

  const menuItems = [
    {
      id: 'copy',
      label: 'Copy',
      icon: <Copy className="w-4 h-4" />,
      shortcut: '⌘C',
      onSelect: () => addLog('Copy action triggered'),
    },
    {
      id: 'edit',
      label: 'Edit',
      icon: <Edit className="w-4 h-4" />,
      shortcut: '⌘E',
      onSelect: () => addLog('Edit action triggered'),
    },
    {
      id: 'separator-1',
      label: '',
      separator: true,
    },
    {
      id: 'share',
      label: 'Share',
      icon: <Share2 className="w-4 h-4" />,
      submenu: [
        {
          id: 'share-email',
          label: 'Email',
          onSelect: () => addLog('Share via Email'),
        },
        {
          id: 'share-link',
          label: 'Copy Link',
          onSelect: () => addLog('Copy Link'),
        },
        {
          id: 'share-export',
          label: 'Export',
          submenu: [
            {
              id: 'export-pdf',
              label: 'PDF',
              onSelect: () => addLog('Export as PDF'),
            },
            {
              id: 'export-json',
              label: 'JSON',
              onSelect: () => addLog('Export as JSON'),
            },
          ],
        },
      ],
    },
    {
      id: 'download',
      label: 'Download',
      icon: <Download className="w-4 h-4" />,
      shortcut: '⌘D',
      onSelect: () => addLog('Download action triggered'),
    },
    {
      id: 'separator-2',
      label: '',
      separator: true,
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: <Trash2 className="w-4 h-4" />,
      shortcut: '⌫',
      danger: true,
      onSelect: () => addLog('Delete action triggered (danger)'),
    },
  ]

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <Terminal className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
          <div className="flex-1">
            <h4 className="font-semibold text-foreground mb-2">
              Interactive Demo
            </h4>
            <p className="text-sm text-muted-foreground mb-3">
              Right-click on the demo area below to open the context menu. Try
              keyboard navigation with arrow keys, submenu exploration, and
              type-ahead search.
            </p>
          </div>
        </div>
      </div>

      {/* Demo Area */}
      <div className="relative">
        <div
          className="min-h-[300px] rounded-lg border-2 border-dashed border-border/50 bg-muted/20 flex items-center justify-center cursor-context-menu hover:bg-muted/30 transition-colors"
          onContextMenu={(e) => {
            e.preventDefault()
            addLog('Context menu opened')
          }}
        >
          <div className="text-center">
            <MousePointerClick className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-muted-foreground font-medium">
              Right-click anywhere in this area
            </p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              Context menu with nested submenus and keyboard shortcuts
            </p>
          </div>
        </div>

        {/* Action Log */}
        {actionLog.length > 0 && (
          <div className="mt-4 p-4 rounded-lg bg-muted/30 border border-border/50">
            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Action Log
            </h4>
            <div className="space-y-1 text-xs font-mono">
              {actionLog.map((action, i) => (
                <div key={i} className="text-muted-foreground">
                  {new Date().toLocaleTimeString()}: {action}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Keyboard Hints */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="p-3 rounded-lg bg-muted/20 border border-border/50">
          <Keyboard className="w-4 h-4 text-brand-500 mb-1" />
          <p className="font-medium text-foreground">Keyboard Navigation</p>
          <p className="text-muted-foreground mt-1">
            Use ↑↓ arrows to navigate, → to open submenus, ← to go back
          </p>
        </div>
        <div className="p-3 rounded-lg bg-muted/20 border border-border/50">
          <Menu className="w-4 h-4 text-brand-500 mb-1" />
          <p className="font-medium text-foreground">Type-ahead Search</p>
          <p className="text-muted-foreground mt-1">
            Type letters to jump to menu items starting with those characters
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Props Data
// ============================================================================

const contextMenuProps: PropDefinition[] = [
  {
    name: 'items',
    type: 'ContextMenuItem[]',
    required: true,
    description: 'Array of menu items to display in the context menu',
  },
  {
    name: 'children',
    type: 'React.ReactNode',
    required: true,
    description: 'Content that triggers the context menu on right-click',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes for the trigger container',
  },
  {
    name: 'aria-label',
    type: 'string',
    default: 'Context menu',
    description: 'Accessible label for the context menu',
  },
]

const menuItemProps: PropDefinition[] = [
  {
    name: 'id',
    type: 'string',
    required: true,
    description: 'Unique identifier for the menu item',
  },
  {
    name: 'label',
    type: 'string',
    required: true,
    description: 'Display label for the menu item',
  },
  {
    name: 'icon',
    type: 'React.ReactNode',
    description: 'Optional icon to display before the label',
  },
  {
    name: 'shortcut',
    type: 'string',
    description: 'Keyboard shortcut display (e.g., "⌘C", "Ctrl+V")',
  },
  {
    name: 'danger',
    type: 'boolean',
    default: 'false',
    description: 'Apply destructive styling (red text)',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Disable the menu item',
  },
  {
    name: 'separator',
    type: 'boolean',
    default: 'false',
    description: 'Render as a visual separator instead of an item',
  },
  {
    name: 'submenu',
    type: 'ContextMenuItem[]',
    description: 'Nested submenu items for multi-level menus',
  },
  {
    name: 'onSelect',
    type: '() => void',
    description: 'Callback when the menu item is selected',
  },
]

// ============================================================================
// Code Examples
// ============================================================================

const basicUsageCode = `import { ContextMenu } from '@clarity-chat/react'
import { Copy, Edit, Trash2 } from 'lucide-react'

function MessageComponent() {
  const menuItems = [
    {
      id: 'copy',
      label: 'Copy',
      icon: <Copy className="w-4 h-4" />,
      shortcut: '⌘C',
      onSelect: () => handleCopy(),
    },
    {
      id: 'edit',
      label: 'Edit',
      icon: <Edit className="w-4 h-4" />,
      shortcut: '⌘E',
      onSelect: () => handleEdit(),
    },
    {
      id: 'separator',
      label: '',
      separator: true,
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: <Trash2 className="w-4 h-4" />,
      danger: true,
      onSelect: () => handleDelete(),
    },
  ]

  return (
    <ContextMenu items={menuItems}>
      <div className="p-4 border rounded">
        Right-click for options
      </div>
    </ContextMenu>
  )
}`

const nestedMenuCode = `import { ContextMenu } from '@clarity-chat/react'
import { Share2, Mail, Link, Download } from 'lucide-react'

function DocumentViewer() {
  const menuItems = [
    {
      id: 'share',
      label: 'Share',
      icon: <Share2 className="w-4 h-4" />,
      submenu: [
        {
          id: 'email',
          label: 'Email',
          icon: <Mail className="w-4 h-4" />,
          onSelect: () => shareViaEmail(),
        },
        {
          id: 'link',
          label: 'Copy Link',
          icon: <Link className="w-4 h-4" />,
          onSelect: () => copyLink(),
        },
      ],
    },
    {
      id: 'export',
      label: 'Export',
      icon: <Download className="w-4 h-4" />,
      submenu: [
        {
          id: 'pdf',
          label: 'Export as PDF',
          onSelect: () => exportPDF(),
        },
        {
          id: 'json',
          label: 'Export as JSON',
          onSelect: () => exportJSON(),
        },
        {
          id: 'csv',
          label: 'Export as CSV',
          onSelect: () => exportCSV(),
        },
      ],
    },
  ]

  return (
    <ContextMenu items={menuItems}>
      <article className="prose">
        {/* Document content */}
      </article>
    </ContextMenu>
  )
}`

const withIconsCode = `import { ContextMenu } from '@clarity-chat/react'
import {
  Copy, Edit, Download, Share2, Bookmark,
  Trash2, Archive, Flag
} from 'lucide-react'

function RichContextMenu() {
  const menuItems = [
    {
      id: 'copy',
      label: 'Copy',
      icon: <Copy className="w-4 h-4" />,
      shortcut: '⌘C',
      onSelect: () => navigator.clipboard.writeText(content),
    },
    {
      id: 'edit',
      label: 'Edit',
      icon: <Edit className="w-4 h-4" />,
      shortcut: '⌘E',
      onSelect: () => setEditing(true),
    },
    {
      id: 'sep-1',
      label: '',
      separator: true,
    },
    {
      id: 'download',
      label: 'Download',
      icon: <Download className="w-4 h-4" />,
      shortcut: '⌘D',
      onSelect: () => downloadItem(),
    },
    {
      id: 'share',
      label: 'Share',
      icon: <Share2 className="w-4 h-4" />,
      onSelect: () => openShareDialog(),
    },
    {
      id: 'bookmark',
      label: 'Bookmark',
      icon: <Bookmark className="w-4 h-4" />,
      shortcut: '⌘B',
      onSelect: () => addBookmark(),
    },
    {
      id: 'sep-2',
      label: '',
      separator: true,
    },
    {
      id: 'archive',
      label: 'Archive',
      icon: <Archive className="w-4 h-4" />,
      onSelect: () => archiveItem(),
    },
    {
      id: 'flag',
      label: 'Report',
      icon: <Flag className="w-4 h-4" />,
      onSelect: () => reportItem(),
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: <Trash2 className="w-4 h-4" />,
      shortcut: '⌫',
      danger: true,
      onSelect: () => deleteItem(),
    },
  ]

  return (
    <ContextMenu items={menuItems}>
      <div className="content">
        {/* Your content */}
      </div>
    </ContextMenu>
  )
}`

const keyboardShortcutsCode = `import { ContextMenu } from '@clarity-chat/react'
import { useHotkeys } from '@/hooks/useHotkeys'

function KeyboardAwareMenu() {
  // Define keyboard shortcuts that match menu items
  useHotkeys('mod+c', () => handleCopy())
  useHotkeys('mod+e', () => handleEdit())
  useHotkeys('mod+d', () => handleDownload())
  useHotkeys('backspace', () => handleDelete())

  const menuItems = [
    {
      id: 'copy',
      label: 'Copy',
      shortcut: '⌘C', // macOS
      onSelect: handleCopy,
    },
    {
      id: 'edit',
      label: 'Edit',
      shortcut: '⌘E',
      onSelect: handleEdit,
    },
    {
      id: 'download',
      label: 'Download',
      shortcut: '⌘D',
      onSelect: handleDownload,
    },
    {
      id: 'separator',
      label: '',
      separator: true,
    },
    {
      id: 'delete',
      label: 'Delete',
      shortcut: '⌫',
      danger: true,
      onSelect: handleDelete,
    },
  ]

  return (
    <ContextMenu items={menuItems} aria-label="Message actions">
      <div className="message">
        {/* Message content */}
      </div>
    </ContextMenu>
  )
}`

const disabledItemsCode = `import { ContextMenu } from '@clarity-chat/react'
import { Copy, Edit, Lock } from 'lucide-react'

function ConditionalMenu({ canEdit, canDelete }: Props) {
  const menuItems = [
    {
      id: 'copy',
      label: 'Copy',
      icon: <Copy className="w-4 h-4" />,
      onSelect: () => handleCopy(),
      // Always enabled
    },
    {
      id: 'edit',
      label: 'Edit',
      icon: <Edit className="w-4 h-4" />,
      disabled: !canEdit, // Conditional disable
      onSelect: () => handleEdit(),
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: <Trash2 className="w-4 h-4" />,
      disabled: !canDelete,
      danger: true,
      onSelect: () => handleDelete(),
    },
    {
      id: 'locked',
      label: 'Admin Only',
      icon: <Lock className="w-4 h-4" />,
      disabled: true, // Always disabled
      onSelect: () => {}, // No-op
    },
  ]

  return (
    <ContextMenu items={menuItems}>
      <div className="content">
        {/* Content */}
      </div>
    </ContextMenu>
  )
}`

const typescriptCode = `// Main component props
interface ContextMenuProps {
  /** Array of menu items to display */
  items: ContextMenuItem[]
  /** Content that triggers the context menu */
  children: React.ReactNode
  /** Additional CSS classes */
  className?: string
  /** Accessible label for the context menu */
  'aria-label'?: string
}

// Menu item configuration
interface ContextMenuItem {
  /** Unique identifier */
  id: string
  /** Display label */
  label: string
  /** Optional icon */
  icon?: React.ReactNode
  /** Keyboard shortcut display */
  shortcut?: string
  /** Apply destructive styling */
  danger?: boolean
  /** Disable the item */
  disabled?: boolean
  /** Render as separator */
  separator?: boolean
  /** Nested submenu items */
  submenu?: ContextMenuItem[]
  /** Selection callback */
  onSelect?: () => void
}

// Usage with types
const menuItems: ContextMenuItem[] = [
  {
    id: 'copy',
    label: 'Copy',
    shortcut: '⌘C',
    onSelect: () => handleCopy(),
  },
]

function MyComponent() {
  return (
    <ContextMenu items={menuItems} aria-label="Actions">
      <div>Content</div>
    </ContextMenu>
  )
}`

// ============================================================================
// Page Configuration
// ============================================================================

const badges: Badge[] = [{ label: 'Stable', variant: 'stable' }]

const features: FeatureHighlight[] = [
  {
    icon: MousePointerClick,
    label: 'Right-Click Actions',
    description: 'Native context menu experience',
  },
  {
    icon: Keyboard,
    label: 'Keyboard Navigation',
    description: 'Arrow keys and shortcuts',
  },
  {
    icon: Layers,
    label: 'Nested Menus',
    description: 'Multi-level menu support',
  },
  {
    icon: Settings,
    label: 'Custom Triggers',
    description: 'Configurable activation',
  },
]

const tableOfContents: TocItem[] = [
  { id: 'overview', title: 'Overview' },
  { id: 'installation', title: 'Installation' },
  { id: 'demo', title: 'Live Demo' },
  {
    id: 'props',
    title: 'Props API',
    children: [
      { id: 'context-menu-props', title: 'ContextMenu Props' },
      { id: 'menu-item-props', title: 'MenuItem Interface' },
    ],
  },
  {
    id: 'examples',
    title: 'Code Examples',
    children: [
      { id: 'example-basic', title: 'Basic Usage' },
      { id: 'example-nested', title: 'Nested Submenus' },
      { id: 'example-icons', title: 'With Icons' },
      { id: 'example-shortcuts', title: 'Keyboard Shortcuts' },
      { id: 'example-disabled', title: 'Disabled Items' },
    ],
  },
  {
    id: 'menu-structure',
    title: 'Menu Structure',
    children: [
      { id: 'menu-items', title: 'Menu Items' },
      { id: 'separators', title: 'Separators' },
      { id: 'submenus', title: 'Submenus' },
      { id: 'danger-actions', title: 'Danger Actions' },
    ],
  },
  { id: 'keyboard-nav', title: 'Keyboard Navigation' },
  { id: 'typescript', title: 'TypeScript' },
  { id: 'accessibility', title: 'Accessibility' },
  { id: 'related', title: 'Related' },
]

const relatedAPIs: RelatedAPI[] = [
  {
    name: 'DropdownMenu',
    type: 'component',
    description: 'Button-triggered dropdown menu with similar features',
    href: '/reference/components/dropdown-menu',
  },
  {
    name: 'MenuItem',
    type: 'component',
    description: 'Individual menu item component for custom menus',
    href: '/reference/components/menu-item',
  },
  {
    name: 'useContextMenu',
    type: 'hook',
    description: 'Hook for programmatic context menu control',
    href: '/reference/hooks/use-context-menu',
  },
]

const footerNavigation: FooterLink[] = [
  {
    label: 'CommandPalette',
    href: '/reference/components/command-palette',
    direction: 'previous',
  },
  {
    label: 'DropdownMenu',
    href: '/reference/components/dropdown-menu',
    direction: 'next',
  },
]

// ============================================================================
// Main Page Component
// ============================================================================

export default function ContextMenuPage() {
  return (
    <DocumentationPage
      title="ContextMenu"
      description="Right-click context menu with keyboard navigation, nested submenus, and custom actions"
      icon={Menu}
      badges={badges}
      packageName="@clarity-chat/react"
      features={features}
      tableOfContents={tableOfContents}
      relatedAPIs={relatedAPIs}
      footerNavigation={footerNavigation}
    >
      {/* Overview Section */}
      <Section id="overview" title="Overview">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p className="text-muted-foreground leading-relaxed">
            The ContextMenu component provides a native right-click menu
            experience with full keyboard navigation support. It's perfect for
            adding contextual actions to messages, files, images, or any
            interactive content in your chat interface.
          </p>

          <div className="grid md:grid-cols-2 gap-4 mt-6 not-prose">
            <div className="p-4 rounded-lg border border-border/50 bg-card">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <MousePointerClick className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">
                    Native Experience
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Right-click activation with automatic positioning to stay
                    within viewport bounds.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-border/50 bg-card">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <Keyboard className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">
                    Keyboard First
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Arrow keys, type-ahead search, Home/End navigation, and
                    escape to close.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-border/50 bg-card">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <Layers className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">
                    Nested Submenus
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Multi-level menu support with hover and keyboard navigation
                    between levels.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-border/50 bg-card">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <Zap className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">
                    Flexible Configuration
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Icons, shortcuts, separators, disabled states, and danger
                    styling.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Installation Section */}
      <Section id="installation" title="Installation">
        <div className="space-y-4">
          <CodeBlock
            code="npm install @clarity-chat/react"
            language="bash"
            filename="Terminal"
            showLineNumbers={false}
          />

          <p className="text-muted-foreground">
            Import the component and start using it:
          </p>

          <CodeBlock
            code={`import { ContextMenu } from '@clarity-chat/react'`}
            language="typescript"
            showLineNumbers={false}
          />
        </div>
      </Section>

      {/* Live Demo Section */}
      <Section id="demo" title="Live Demo">
        <p className="text-muted-foreground mb-6">
          Right-click in the demo area below to open the context menu. Try
          navigating with arrow keys, exploring nested submenus, and using
          type-ahead search.
        </p>

        <LiveDemo />
      </Section>

      {/* Props API Section */}
      <Section id="props" title="Props API">
        <SubSection id="context-menu-props" title="ContextMenu Props">
          <p className="text-sm text-muted-foreground mb-4">
            Main component props for the ContextMenu wrapper:
          </p>
          <PropsTable props={contextMenuProps} />
        </SubSection>

        <SubSection id="menu-item-props" title="MenuItem Interface">
          <p className="text-sm text-muted-foreground mb-4">
            Configuration options for individual menu items:
          </p>
          <PropsTable props={menuItemProps} />
        </SubSection>
      </Section>

      {/* Code Examples Section */}
      <Section id="examples" title="Code Examples">
        <SubSection id="example-basic" title="Basic Usage">
          <p className="text-muted-foreground mb-4">
            Simple context menu with copy, edit, and delete actions:
          </p>
          <CodeBlock
            code={basicUsageCode}
            language="tsx"
            filename="MessageActions.tsx"
          />
        </SubSection>

        <SubSection id="example-nested" title="Nested Submenus">
          <p className="text-muted-foreground mb-4">
            Multi-level menus for organizing related actions:
          </p>
          <CodeBlock
            code={nestedMenuCode}
            language="tsx"
            filename="DocumentMenu.tsx"
          />
        </SubSection>

        <SubSection id="example-icons" title="With Icons">
          <p className="text-muted-foreground mb-4">
            Rich menu items with icons and keyboard shortcuts:
          </p>
          <CodeBlock
            code={withIconsCode}
            language="tsx"
            filename="RichMenu.tsx"
          />
        </SubSection>

        <SubSection id="example-shortcuts" title="Keyboard Shortcuts">
          <p className="text-muted-foreground mb-4">
            Integrate with global keyboard shortcuts:
          </p>
          <CodeBlock
            code={keyboardShortcutsCode}
            language="tsx"
            filename="KeyboardMenu.tsx"
          />
        </SubSection>

        <SubSection id="example-disabled" title="Disabled Items">
          <p className="text-muted-foreground mb-4">
            Conditionally disable menu items based on permissions:
          </p>
          <CodeBlock
            code={disabledItemsCode}
            language="tsx"
            filename="ConditionalMenu.tsx"
          />
        </SubSection>
      </Section>

      {/* Menu Structure Section */}
      <Section id="menu-structure" title="Menu Structure">
        <div className="space-y-6">
          <SubSection id="menu-items" title="Menu Items">
            <p className="text-muted-foreground mb-4">
              Basic menu items consist of an ID, label, and optional icon and
              shortcut:
            </p>
            <CodeBlock
              code={`const item = {
  id: 'copy',
  label: 'Copy',
  icon: <Copy className="w-4 h-4" />,
  shortcut: '⌘C',
  onSelect: () => handleCopy(),
}`}
              language="typescript"
              showLineNumbers={false}
            />
          </SubSection>

          <SubSection id="separators" title="Separators">
            <p className="text-muted-foreground mb-4">
              Visual separators help group related actions:
            </p>
            <CodeBlock
              code={`{
  id: 'separator-1',
  label: '',
  separator: true,
}`}
              language="typescript"
              showLineNumbers={false}
            />
          </SubSection>

          <SubSection id="submenus" title="Submenus">
            <p className="text-muted-foreground mb-4">
              Add nested submenus with the <code>submenu</code> property:
            </p>
            <CodeBlock
              code={`{
  id: 'share',
  label: 'Share',
  icon: <Share2 className="w-4 h-4" />,
  submenu: [
    { id: 'email', label: 'Email', onSelect: () => {} },
    { id: 'link', label: 'Copy Link', onSelect: () => {} },
  ],
}`}
              language="typescript"
              showLineNumbers={false}
            />
          </SubSection>

          <SubSection id="danger-actions" title="Danger Actions">
            <p className="text-muted-foreground mb-4">
              Mark destructive actions with the <code>danger</code> flag:
            </p>
            <CodeBlock
              code={`{
  id: 'delete',
  label: 'Delete',
  icon: <Trash2 className="w-4 h-4" />,
  danger: true,
  onSelect: () => handleDelete(),
}`}
              language="typescript"
              showLineNumbers={false}
            />
          </SubSection>
        </div>
      </Section>

      {/* Keyboard Navigation Section */}
      <Section id="keyboard-nav" title="Keyboard Navigation">
        <p className="text-muted-foreground mb-4">
          ContextMenu supports comprehensive keyboard navigation following ARIA
          menu pattern guidelines:
        </p>

        <div className="overflow-x-auto rounded-lg border border-border/50">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50 bg-muted/20">
                <th className="px-4 py-3 text-left font-semibold text-foreground">
                  Key
                </th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/30">
                <td className="px-4 py-3">
                  <kbd className="px-2 py-1 text-xs rounded bg-muted border">
                    ↑
                  </kbd>{' '}
                  /{' '}
                  <kbd className="px-2 py-1 text-xs rounded bg-muted border">
                    ↓
                  </kbd>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  Navigate up/down through menu items (skips disabled items)
                </td>
              </tr>
              <tr className="border-b border-border/30 bg-muted/10">
                <td className="px-4 py-3">
                  <kbd className="px-2 py-1 text-xs rounded bg-muted border">
                    →
                  </kbd>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  Open submenu if available
                </td>
              </tr>
              <tr className="border-b border-border/30">
                <td className="px-4 py-3">
                  <kbd className="px-2 py-1 text-xs rounded bg-muted border">
                    ←
                  </kbd>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  Close submenu and return to parent
                </td>
              </tr>
              <tr className="border-b border-border/30 bg-muted/10">
                <td className="px-4 py-3">
                  <kbd className="px-2 py-1 text-xs rounded bg-muted border">
                    Enter
                  </kbd>{' '}
                  or{' '}
                  <kbd className="px-2 py-1 text-xs rounded bg-muted border">
                    Space
                  </kbd>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  Execute selected menu item
                </td>
              </tr>
              <tr className="border-b border-border/30">
                <td className="px-4 py-3">
                  <kbd className="px-2 py-1 text-xs rounded bg-muted border">
                    Esc
                  </kbd>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  Close menu (or close submenu first if open)
                </td>
              </tr>
              <tr className="border-b border-border/30 bg-muted/10">
                <td className="px-4 py-3">
                  <kbd className="px-2 py-1 text-xs rounded bg-muted border">
                    Home
                  </kbd>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  Jump to first enabled item
                </td>
              </tr>
              <tr className="border-b border-border/30">
                <td className="px-4 py-3">
                  <kbd className="px-2 py-1 text-xs rounded bg-muted border">
                    End
                  </kbd>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  Jump to last enabled item
                </td>
              </tr>
              <tr className="bg-muted/10">
                <td className="px-4 py-3">
                  <kbd className="px-2 py-1 text-xs rounded bg-muted border">
                    a-z
                  </kbd>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  Type-ahead: jump to item starting with typed letters
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* TypeScript Section */}
      <Section id="typescript" title="TypeScript">
        <p className="text-muted-foreground mb-4">
          Full type definitions for type-safe menu configuration:
        </p>
        <CodeBlock
          code={typescriptCode}
          language="typescript"
          filename="types.ts"
          showLineNumbers
        />
      </Section>

      {/* Accessibility Section */}
      <Section id="accessibility" title="Accessibility">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p className="text-muted-foreground leading-relaxed mb-4">
            ContextMenu implements the ARIA menu pattern with comprehensive
            keyboard support and screen reader compatibility:
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <div className="p-4 rounded-lg border border-border/50 bg-card">
            <div className="flex items-start gap-3">
              <Keyboard className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="font-semibold text-foreground mb-1">
                  Full Keyboard Support
                </h4>
                <p className="text-sm text-muted-foreground">
                  Arrow keys, Enter/Space, Escape, Home/End, and type-ahead
                  search for complete keyboard navigation.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg border border-border/50 bg-card">
            <div className="flex items-start gap-3">
              <List className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-semibold text-foreground mb-1">
                  ARIA Menu Pattern
                </h4>
                <p className="text-sm text-muted-foreground">
                  Proper roles (menu, menuitem), labels, and activedescendant
                  for screen readers.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg border border-border/50 bg-card">
            <div className="flex items-start gap-3">
              <Settings className="w-5 h-5 text-purple-500 mt-0.5" />
              <div>
                <h4 className="font-semibold text-foreground mb-1">
                  Focus Management
                </h4>
                <p className="text-sm text-muted-foreground">
                  Focus trap while open, automatic restoration on close, and
                  visible focus indicators.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg border border-border/50 bg-card">
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-amber-500 mt-0.5" />
              <div>
                <h4 className="font-semibold text-foreground mb-1">
                  Reduced Motion
                </h4>
                <p className="text-sm text-muted-foreground">
                  Respects prefers-reduced-motion for users sensitive to
                  animations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </DocumentationPage>
  )
}
