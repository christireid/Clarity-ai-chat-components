import type { ComponentDoc } from '@/components/doc-panel'

export const navigationDocs: Record<string, ComponentDoc | ComponentDoc[]> = {
  // ===========================================================================
  // Command Palette
  // ===========================================================================
  'Command Palette': [
    {
      name: 'CommandPalette',
      description:
        'Accessible command palette modal with fuzzy search, grouped results, keyboard navigation, focus trap, and optional AI context footer. Renders via a portal with animated backdrop and reduced-motion support.',
      importPath: '@clarity-chat/react',
      usageCode: `<CommandPalette
  items={[
    {
      id: 'new-chat',
      label: 'New Chat',
      description: 'Start a new conversation',
      icon: <Plus className="h-4 w-4" />,
      shortcut: ['Cmd', 'N'],
      category: 'Actions',
      onSelect: () => createChat(),
    },
    {
      id: 'search',
      label: 'Search Messages',
      icon: <Search className="h-4 w-4" />,
      shortcut: ['Cmd', 'K'],
      category: 'Navigation',
      onSelect: () => openSearch(),
    },
  ]}
  open={isOpen}
  onClose={() => setIsOpen(false)}
  placeholder="Type a command..."
  aiContext={{
    modelName: 'Claude 3.5 Sonnet',
    conversationId: 'abc-123',
    tokenUsage: { total: 1500 },
  }}
/>`,
      props: [
        {
          name: 'items',
          type: 'CommandItem[]',
          required: true,
          description:
            'Array of command items to display. Each item requires id, label, and onSelect. Supports optional description, icon, shortcut key array, and category for grouping.',
          commonlyUsed: true,
        },
        {
          name: 'open',
          type: 'boolean',
          required: true,
          description: 'Controls whether the command palette is visible.',
          commonlyUsed: true,
        },
        {
          name: 'onClose',
          type: '() => void',
          required: true,
          description:
            'Callback invoked when the palette should close (Escape key, backdrop click, or item selection).',
          commonlyUsed: true,
        },
        {
          name: 'placeholder',
          type: 'string',
          default: '"Type a command..."',
          description: 'Placeholder text shown in the search input.',
          commonlyUsed: true,
        },
        {
          name: 'className',
          type: 'string',
          description: 'Additional CSS class names for the palette container.',
        },
        {
          name: 'loading',
          type: 'boolean',
          default: 'false',
          description:
            'Show a loading spinner in place of the search icon during async operations.',
        },
        {
          name: 'aria-label',
          type: 'string',
          default: '"Command palette"',
          description: 'Accessible label for the command palette dialog.',
        },
        {
          name: 'aiContext',
          type: 'AIContext',
          description:
            'AI context information displayed in the footer. Supports modelName, conversationId, tokenUsage ({ input, output, total }), and metadata.',
          commonlyUsed: true,
        },
        {
          name: 'ref',
          type: 'React.Ref<HTMLDivElement>',
          description: 'Ref forwarded to the root div element.',
        },
      ],
      notes: [
        'Items are automatically grouped by the category field and rendered under category headings.',
        'Search is debounced at 150ms and filters across label, description, and category.',
        'Keyboard navigation: Arrow Up/Down to navigate, Enter to select, Escape to close, Home/End to jump.',
        'Focus is trapped inside the palette when open and restored to the previously focused element on close.',
        'Renders through a portal to document.body to avoid z-index issues.',
        'The CommandItem interface requires id (string), label (string), and onSelect (() => void). Optional fields: description, icon (ReactNode), shortcut (string[]), category.',
      ],
      sourceFile: 'components/clarity/chat/CommandPalette.tsx',
    },
    {
      name: 'CommandPaletteEnhanced',
      description:
        'Advanced command palette with fuzzy search scoring, match highlighting, recent commands persistence, nested command navigation with breadcrumbs, and Vim-style keyboard shortcuts (Ctrl+J/K).',
      importPath: '@clarity-chat/react',
      usageCode: `<CommandPaletteEnhanced
  commands={[
    {
      id: 'file',
      label: 'File',
      icon: <FileText className="h-4 w-4" />,
      category: 'Menu',
      onSelect: () => {},
      children: [
        {
          id: 'new',
          label: 'New File',
          shortcut: 'Cmd+N',
          onSelect: () => newFile(),
        },
        {
          id: 'open',
          label: 'Open File',
          shortcut: 'Cmd+O',
          onSelect: () => openFile(),
        },
      ],
    },
  ]}
  open={isOpen}
  onClose={() => setIsOpen(false)}
  enableRecents
  maxRecents={5}
/>`,
      props: [
        {
          name: 'commands',
          type: 'CommandAction[]',
          required: true,
          description:
            'Array of command actions. Each requires id, label, and onSelect. Supports description, icon, shortcut (string or string[]), category, keywords for search, disabled state, children for nesting, and preview content.',
          commonlyUsed: true,
        },
        {
          name: 'open',
          type: 'boolean',
          required: true,
          description: 'Controls whether the enhanced palette is visible.',
          commonlyUsed: true,
        },
        {
          name: 'onClose',
          type: '() => void',
          required: true,
          description: 'Callback invoked when the palette should close.',
          commonlyUsed: true,
        },
        {
          name: 'placeholder',
          type: 'string',
          default: '"Type a command or search..."',
          description: 'Placeholder text for the search input.',
        },
        {
          name: 'enableRecents',
          type: 'boolean',
          default: 'true',
          description:
            'Enable recent commands tracking. Recent commands appear in a separate section at the top when no search query is active.',
          commonlyUsed: true,
        },
        {
          name: 'maxRecents',
          type: 'number',
          default: '5',
          description:
            'Maximum number of recent commands to display and persist.',
        },
        {
          name: 'storageKey',
          type: 'string',
          default: '"clarity-command-palette-recents"',
          description: 'localStorage key used for persisting recent commands.',
        },
        {
          name: 'className',
          type: 'string',
          description: 'Additional CSS class names for the palette container.',
        },
        {
          name: 'emptyState',
          type: 'React.ReactNode',
          description:
            'Custom content rendered when no commands match the search query. Defaults to a built-in empty state with icon and message.',
        },
        {
          name: 'footer',
          type: 'React.ReactNode',
          description:
            'Custom footer content. Defaults to keyboard navigation hints and command count.',
        },
      ],
      notes: [
        'Fuzzy search scores matches by consecutive characters, word boundary bonuses, and string length. Results are sorted by score.',
        'Matched characters in labels are highlighted with a <mark> element.',
        'Recent commands persist in localStorage and are loaded SSR-safely after hydration.',
        'Nested commands display a breadcrumb trail for navigation. Backspace on empty input navigates back.',
        'Supports Vim-style navigation: Ctrl+J (down), Ctrl+K (up), Tab/Shift+Tab for cycling.',
        'The CommandAction interface extends CommandItem with keywords (string[]), disabled (boolean), children (CommandAction[]), and preview (ReactNode).',
      ],
      sourceFile: 'components/navigation/CommandPaletteEnhanced.tsx',
    },
  ],

  // ===========================================================================
  // Conversation List
  // ===========================================================================
  'Conversation List': {
    name: 'ContextMenu',
    description:
      'Right-click context menu component with nested submenus, keyboard navigation, type-ahead search, danger item styling, and automatic viewport boundary detection. Ideal for conversation item actions like pin, archive, and delete.',
    importPath: '@clarity-chat/react',
    usageCode: `<ContextMenu
  items={[
    {
      id: 'pin',
      label: 'Pin Conversation',
      icon: <Pin className="h-4 w-4" />,
      shortcut: 'P',
      onSelect: () => pinConversation(),
    },
    {
      id: 'archive',
      label: 'Archive',
      icon: <Archive className="h-4 w-4" />,
      onSelect: () => archiveConversation(),
    },
    { id: 'sep1', label: '', separator: true },
    {
      id: 'delete',
      label: 'Delete',
      icon: <Trash2 className="h-4 w-4" />,
      danger: true,
      onSelect: () => deleteConversation(),
    },
  ]}
  aria-label="Conversation actions"
>
  <ConversationCard conversation={conversation} />
</ContextMenu>`,
    props: [
      {
        name: 'items',
        type: 'ContextMenuItem[]',
        required: true,
        description:
          'Array of menu items. Each requires id and label. Supports icon, shortcut (string), danger styling, disabled state, separator flag, nested submenu array, and onSelect callback.',
        commonlyUsed: true,
      },
      {
        name: 'children',
        type: 'React.ReactNode',
        required: true,
        description:
          'The content that triggers the context menu on right-click.',
        commonlyUsed: true,
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS class names for the wrapper div.',
      },
      {
        name: 'aria-label',
        type: 'string',
        default: '"Context menu"',
        description: 'Accessible label for the context menu.',
      },
      {
        name: 'ref',
        type: 'React.Ref<HTMLDivElement>',
        description: 'Ref forwarded to the wrapper div element.',
      },
    ],
    notes: [
      'Activated via right-click (onContextMenu). The menu auto-positions to stay within viewport boundaries.',
      'Keyboard navigation: Arrow Up/Down to move, Enter/Space to select, Escape to close (closes submenu first), Home/End to jump, ArrowRight to open submenu, ArrowLeft to close submenu.',
      'Type-ahead: typing letters focuses the first item whose label starts with the typed string. Resets after 500ms of inactivity.',
      'The ContextMenuItem interface supports id (string), label (string), icon (ReactNode), shortcut (string), danger (boolean), disabled (boolean), separator (boolean), submenu (ContextMenuItem[]), and onSelect (() => void).',
      'Separator items are rendered as horizontal dividers and excluded from keyboard navigation.',
      'Danger items receive destructive text color and red hover background.',
      'Focus is trapped inside the menu and restored to the trigger element on close.',
    ],
    sourceFile: 'components/navigation/ContextMenu.tsx',
  },

  // ===========================================================================
  // Activity History
  // ===========================================================================
  'Activity History': {
    name: 'KeyboardShortcutsModal',
    description:
      'Searchable modal dialog that displays keyboard shortcuts organized by category. Features fuzzy search, platform-aware key rendering (macOS vs Windows/Linux), sequence shortcut indicators, and keyboard navigation through results.',
    importPath: '@clarity-chat/react',
    usageCode: `<KeyboardShortcutsModal
  open={isOpen}
  onClose={() => setIsOpen(false)}
  title="Keyboard Shortcuts"
  shortcuts={[
    {
      id: 'new-chat',
      keys: 'Cmd+N',
      description: 'New chat',
      category: 'General',
    },
    {
      id: 'search',
      keys: 'Cmd+K',
      description: 'Search messages',
      category: 'Navigation',
    },
    {
      id: 'history',
      keys: 'Cmd+H',
      description: 'Chat history',
      category: 'Navigation',
    },
    {
      id: 'vim-nav',
      keys: ['j', 'k'],
      description: 'Navigate items',
      category: 'Navigation',
    },
    {
      id: 'sequence',
      keys: 'g i',
      description: 'Go to inbox',
      category: 'Navigation',
      isSequence: true,
    },
  ]}
/>`,
    props: [
      {
        name: 'open',
        type: 'boolean',
        required: true,
        description: 'Controls whether the modal is visible.',
        commonlyUsed: true,
      },
      {
        name: 'onClose',
        type: '() => void',
        required: true,
        description:
          'Callback invoked when the modal should close (Escape key or backdrop click).',
        commonlyUsed: true,
      },
      {
        name: 'shortcuts',
        type: 'ShortcutItem[]',
        required: true,
        description:
          'Array of shortcut items to display. Each requires id, keys (string or string[] for alternatives), and description. Supports category for grouping and isSequence for multi-step shortcuts.',
        commonlyUsed: true,
      },
      {
        name: 'title',
        type: 'string',
        default: '"Keyboard Shortcuts"',
        description: 'Title text displayed in the modal header.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS class names for the modal container.',
      },
    ],
    notes: [
      'Shortcuts are grouped by the category field and sorted by a predefined order: General, Navigation, Chat, Edit, Help.',
      'Search filters across description, category, and key strings. Escape clears the search first, then closes the modal.',
      'Keys containing a space are treated as sequence shortcuts and rendered with "then" separators between steps.',
      'Multiple keys in an array are rendered as alternatives separated by "or".',
      'Platform detection is SSR-safe: key display adapts between macOS symbols and Windows/Linux text.',
      'The ShortcutItem interface requires id (string), keys (string | string[]), and description (string). Optional: category (string), isSequence (boolean).',
      'Focus is trapped inside the modal. Search input is auto-focused with a 100ms delay for animation.',
    ],
    sourceFile: 'components/navigation/KeyboardShortcutsModal.tsx',
  },

  // ===========================================================================
  // Breadcrumbs
  // ===========================================================================
  Breadcrumbs: [
    {
      name: 'SkipLinks',
      description:
        'Visually hidden skip navigation links that appear on keyboard focus, enabling users to jump directly to landmark regions. Supports multiple targets with priority ordering, smooth scrolling, and arrow key navigation between links.',
      importPath: '@clarity-chat/react',
      usageCode: `<SkipLinks
  links={[
    {
      targetId: 'main-content',
      label: 'Skip to main content',
      priority: 100,
    },
    {
      targetId: 'chat-input',
      label: 'Skip to chat input',
      priority: 90,
    },
    {
      targetId: 'chat-messages',
      label: 'Skip to messages',
      priority: 80,
    },
    {
      targetId: 'navigation',
      label: 'Skip to navigation',
      priority: 70,
    },
  ]}
/>`,
      props: [
        {
          name: 'links',
          type: 'SkipLink[]',
          default: 'defaultSkipLinks',
          description:
            'Array of skip link configurations. Each requires targetId (element ID without #) and label. Optional priority determines display order (higher values first). Defaults to main-content, chat-input, chat-messages, and navigation.',
          commonlyUsed: true,
        },
        {
          name: 'className',
          type: 'string',
          description:
            'Additional CSS class names for the skip links container.',
        },
      ],
      notes: [
        'Links are visually hidden (sr-only) until focused via Tab key, then appear at the top-left of the viewport.',
        'Clicking a link smooth-scrolls to the target element and moves focus there. If the target lacks tabindex, -1 is set automatically.',
        'Arrow keys navigate between links; Home/End jump to first/last link.',
        'Default skip links target main-content, chat-input, chat-messages, and navigation landmark IDs.',
        'The SkipLink interface requires targetId (string) and label (string). Optional: priority (number).',
      ],
      sourceFile: 'components/navigation/SkipLinks.tsx',
    },
    {
      name: 'Landmark',
      description:
        'Wrapper component that creates an ARIA landmark region targetable by SkipLinks. Automatically sets tabindex for focus management and supports customizable HTML element rendering.',
      importPath: '@clarity-chat/react',
      usageCode: `<Landmark
  id="main-content"
  role="main"
  aria-label="Main content area"
>
  <ChatWindow />
</Landmark>

<Landmark
  id="navigation"
  role="navigation"
  aria-label="Sidebar navigation"
  as="nav"
>
  <Sidebar />
</Landmark>`,
      props: [
        {
          name: 'id',
          type: 'string',
          required: true,
          description:
            'Unique ID for the landmark element. Used as the targetId in SkipLinks.',
          commonlyUsed: true,
        },
        {
          name: 'role',
          type: "'main' | 'navigation' | 'search' | 'complementary' | 'region'",
          default: '"region"',
          description: 'ARIA role for the landmark region.',
          commonlyUsed: true,
        },
        {
          name: 'aria-label',
          type: 'string',
          description: 'Accessible label describing the landmark region.',
          commonlyUsed: true,
        },
        {
          name: 'children',
          type: 'React.ReactNode',
          required: true,
          description: 'Content rendered inside the landmark region.',
        },
        {
          name: 'className',
          type: 'string',
          description: 'Additional CSS class names for the landmark element.',
        },
        {
          name: 'as',
          type: 'React.ElementType',
          default: '"div"',
          description:
            'HTML element or component to render. Use "nav" for navigation landmarks, "main" for main content, etc.',
        },
      ],
      notes: [
        'Sets tabindex="-1" on the element so SkipLinks can programmatically focus it.',
        'Focus outline is suppressed via CSS to avoid visual artifacts when focused programmatically.',
        'Use the as prop to render semantically correct HTML elements (e.g., as="nav" for navigation regions).',
        'Pair with SkipLinks by matching the id prop to a SkipLink targetId.',
      ],
      sourceFile: 'components/navigation/SkipLinks.tsx',
    },
  ],

  // ===========================================================================
  // Quick Navigation
  // ===========================================================================
  'Quick Navigation': [
    {
      name: 'KeyboardHintsOverlay',
      description:
        'Full-screen overlay that displays positioned keyboard shortcut badges near their associated interactive elements. Badges auto-calculate position relative to target elements and reposition on scroll or resize.',
      importPath: '@clarity-chat/react',
      usageCode: `const { visible, hints } = useKeyboardHintsOverlay(
  [
    { id: 'new-chat', target: '#new-chat-btn', shortcut: 'N', description: 'New chat', position: 'top' },
    { id: 'search', target: '#search-input', shortcut: 'Cmd+K', description: 'Search' },
    { id: 'settings', target: '#settings-btn', shortcut: ',', description: 'Settings', position: 'right' },
  ],
  { modifierKey: 'alt', delay: 400 }
)

<KeyboardHintsOverlay hints={hints} visible={visible} />`,
      props: [
        {
          name: 'hints',
          type: 'KeyboardHint[]',
          required: true,
          description:
            'Array of hint objects. Each requires id, target (CSS selector string or React ref), and shortcut (string). Supports optional description and position ("top" | "bottom" | "left" | "right" | "center").',
          commonlyUsed: true,
        },
        {
          name: 'visible',
          type: 'boolean',
          required: true,
          description:
            'Controls whether the overlay and hint badges are visible.',
          commonlyUsed: true,
        },
        {
          name: 'className',
          type: 'string',
          description: 'Additional CSS class names for the overlay container.',
        },
      ],
      notes: [
        'Pair with the useKeyboardHintsOverlay hook to show hints when holding a modifier key (Alt, Ctrl, or Meta).',
        'Hint positions are recalculated on window scroll and resize events.',
        'Badges display a Kbd component with the shortcut and optional description text.',
        'The overlay is pointer-events-none to allow click-through to underlying elements.',
        'The KeyboardHint interface requires id (string), target (string | React.RefObject<HTMLElement>), and shortcut (string). Optional: description (string), position ("top" | "bottom" | "left" | "right" | "center").',
        'The ContextualKeyboardHints component auto-discovers elements with data-shortcut or aria-keyshortcuts attributes.',
      ],
      sourceFile: 'components/navigation/KeyboardHintsOverlay.tsx',
    },
    {
      name: 'KeyboardShortcutHint',
      description:
        'Dismissible floating hint that appears once per user to advertise keyboard shortcuts. Persists dismissed state to localStorage, auto-shows after a configurable delay, and auto-dismisses after a set duration.',
      importPath: '@clarity-chat/react',
      usageCode: `<KeyboardShortcutHint
  storageKey="main-shortcuts"
  message="Press ? for keyboard shortcuts"
  shortcutKey="?"
  position="bottom-right"
  showDelay={1500}
  displayDuration={8000}
  onDismiss={() => console.log('Hint dismissed')}
/>`,
      props: [
        {
          name: 'storageKey',
          type: 'string',
          default: '"default"',
          description:
            'Key used for localStorage persistence. Prefixed with "clarity-shortcut-hint-" to avoid collisions.',
          commonlyUsed: true,
        },
        {
          name: 'showDelay',
          type: 'number',
          default: '1500',
          description:
            'Delay in milliseconds before the hint appears after mount.',
        },
        {
          name: 'displayDuration',
          type: 'number',
          default: '8000',
          description:
            'Duration in milliseconds to show the hint before auto-dismissing.',
        },
        {
          name: 'position',
          type: "'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'",
          default: '"bottom-right"',
          description: 'Fixed position of the hint on the viewport.',
          commonlyUsed: true,
        },
        {
          name: 'message',
          type: 'string',
          default: '"Keyboard shortcuts available"',
          description: 'Text message displayed in the hint.',
          commonlyUsed: true,
        },
        {
          name: 'shortcutKey',
          type: 'string',
          default: '"?"',
          description:
            'The keyboard shortcut key displayed as a kbd element alongside the message.',
          commonlyUsed: true,
        },
        {
          name: 'className',
          type: 'string',
          description: 'Additional CSS class names for the hint container.',
        },
        {
          name: 'onDismiss',
          type: '() => void',
          description:
            'Callback invoked when the hint is dismissed (click or auto-dismiss).',
        },
        {
          name: 'forceShow',
          type: 'boolean',
          default: 'false',
          description:
            'Ignore localStorage dismissed state and always show the hint. Useful for development and testing.',
        },
      ],
      notes: [
        'The hint is rendered as a button; clicking it dismisses and persists the dismissed state.',
        'Escape key also dismisses the hint when it is visible.',
        'Dismissed state is stored in localStorage under "clarity-shortcut-hint-{storageKey}".',
        'Returns null when not visible, so it has zero DOM footprint when hidden.',
        'Use the useKeyboardShortcutHint hook for programmatic control over visibility, dismiss, and reset actions.',
        'The InlineShortcutHint companion component renders a compact inline shortcut badge within content areas.',
      ],
      sourceFile: 'components/navigation/KeyboardShortcutHint.tsx',
    },
  ],
}
