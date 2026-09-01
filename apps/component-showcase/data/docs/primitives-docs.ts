import type { ComponentDoc } from '@/components/doc-panel'

export const primitivesDocs: Record<string, ComponentDoc | ComponentDoc[]> = {
  // ==========================================================================
  // Button
  // ==========================================================================
  Button: {
    name: 'Button',
    description:
      'Enhanced button component built on shadcn/ui with loading states, success/error feedback, and multiple visual variants. Extends standard HTML button attributes.',
    importPath: '@clarity-chat/primitives',
    usageCode: `{/* Variants */}
<Button variant="default">Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="surface">Surface</Button>
<Button variant="success">Success</Button>
<Button variant="error">Error</Button>

{/* Sizes */}
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon">+</Button>

{/* States */}
<Button state="loading">Loading</Button>
<Button state="success">Done</Button>
<Button state="error">Failed</Button>
<Button loading>Loading (shorthand)</Button>
<Button disabled>Disabled</Button>

{/* As child (render as link, etc.) */}
<Button asChild>
  <a href="/page">Navigate</a>
</Button>`,
    props: [
      {
        name: 'variant',
        type: "'default' | 'secondary' | 'outline' | 'ghost' | 'link' | 'destructive' | 'surface' | 'success' | 'error'",
        default: "'default'",
        description: 'Visual style variant of the button.',
        commonlyUsed: true,
      },
      {
        name: 'size',
        type: "'default' | 'sm' | 'lg' | 'icon'",
        default: "'default'",
        description: 'Size variant controlling height and padding.',
        commonlyUsed: true,
      },
      {
        name: 'state',
        type: "'idle' | 'loading' | 'success' | 'error'",
        default: "'idle'",
        description:
          'Controlled visual state. Shows a spinner when loading, checkmark when success, or X icon when error. Disables the button during loading.',
        commonlyUsed: true,
      },
      {
        name: 'loading',
        type: 'boolean',
        default: 'false',
        description:
          'Shorthand for state="loading". Shows a spinner and disables the button.',
        commonlyUsed: true,
      },
      {
        name: 'asChild',
        type: 'boolean',
        default: 'false',
        description:
          'When true, renders as a Radix Slot, merging props onto the child element instead of rendering a <button>.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        description:
          'Disables the button. Also automatically set when state is "loading".',
        commonlyUsed: true,
      },
      {
        name: 'ripple',
        type: 'boolean',
        description:
          'Deprecated. Accepted for backward compatibility but has no effect.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS class names merged via cn().',
      },
      {
        name: 'children',
        type: 'React.ReactNode',
        description: 'Button content.',
        commonlyUsed: true,
      },
    ],
    notes: [
      'Also accepts all standard HTML <button> attributes (onClick, type, form, etc.).',
      'The loading state automatically disables the button to prevent double-submission.',
      'State icons (spinner, checkmark, X) are prepended before children content.',
      'Uses class-variance-authority (cva) for type-safe variant composition.',
    ],
  },

  // ==========================================================================
  // Dialog
  // ==========================================================================
  Dialog: [
    {
      name: 'Dialog',
      description:
        'Root component for modal dialogs. Wraps Radix UI Dialog.Root and manages open/closed state.',
      importPath: '@clarity-chat/primitives',
      usageCode: `const [open, setOpen] = useState(false)

<Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent size="lg" animation="default">
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>
        This is a description of the dialog.
      </DialogDescription>
    </DialogHeader>
    <div className="py-4">
      <p>Dialog content goes here.</p>
    </div>
    <DialogFooter>
      <Button variant="outline" onClick={() => setOpen(false)}>
        Cancel
      </Button>
      <Button onClick={() => setOpen(false)}>Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`,
      props: [
        {
          name: 'open',
          type: 'boolean',
          description: 'Controlled open state of the dialog.',
          commonlyUsed: true,
        },
        {
          name: 'onOpenChange',
          type: '(open: boolean) => void',
          description: 'Callback fired when the open state changes.',
          commonlyUsed: true,
        },
        {
          name: 'defaultOpen',
          type: 'boolean',
          default: 'false',
          description: 'Initial open state for uncontrolled usage.',
        },
        {
          name: 'modal',
          type: 'boolean',
          default: 'true',
          description:
            'When true, interaction with outside elements is disabled and only dialog content is visible to screen readers.',
        },
      ],
      notes: [
        'Composed from Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, and DialogClose.',
        'DialogContent includes a built-in close button (X icon) in the top-right corner.',
        'Includes a mobile-compatible focus trap that supplements Radix UI on iOS/Android.',
      ],
    },
    {
      name: 'DialogContent',
      description:
        'The content panel of a dialog. Renders inside a portal with an overlay backdrop. Supports size and animation variants.',
      importPath: '@clarity-chat/primitives',
      usageCode: `<DialogContent size="lg" animation="default">
  <DialogHeader>
    <DialogTitle>Title</DialogTitle>
    <DialogDescription>Description text</DialogDescription>
  </DialogHeader>
  <div className="py-4">Content here</div>
  <DialogFooter>
    <Button>Action</Button>
  </DialogFooter>
</DialogContent>`,
      props: [
        {
          name: 'size',
          type: "'sm' | 'md' | 'lg' | 'xl' | 'full'",
          default: "'lg'",
          description:
            'Controls the maximum width of the dialog content panel.',
          commonlyUsed: true,
        },
        {
          name: 'animation',
          type: "'default' | 'slide' | 'scale' | 'none'",
          default: "'default'",
          description: 'Animation style for enter/exit transitions.',
          commonlyUsed: true,
        },
        {
          name: 'className',
          type: 'string',
          description: 'Additional CSS class names for the content panel.',
        },
        {
          name: 'children',
          type: 'React.ReactNode',
          description:
            'Dialog content (typically DialogHeader, body, and DialogFooter).',
          commonlyUsed: true,
        },
      ],
      notes: [
        'Also accepts all Radix UI Dialog.Content props (onOpenAutoFocus, onCloseAutoFocus, onEscapeKeyDown, onPointerDownOutside, etc.).',
        'Size mapping: sm=max-w-sm, md=max-w-md, lg=max-w-lg, xl=max-w-xl, full=max-w-[90vw].',
        'DialogHeader, DialogFooter, DialogTitle, and DialogDescription are layout helpers that accept className and standard HTML div attributes.',
      ],
    },
  ],

  // ==========================================================================
  // DropdownMenu
  // ==========================================================================
  DropdownMenu: [
    {
      name: 'DropdownMenu',
      description:
        'Root component for dropdown menus. Wraps Radix UI DropdownMenu.Root with animated content and accessible keyboard navigation.',
      importPath: '@clarity-chat/primitives',
      usageCode: `<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Open Menu</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>My Account</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem>Settings</DropdownMenuItem>
    <DropdownMenuItem>Billing</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem className="text-destructive">
      Log out
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`,
      props: [
        {
          name: 'open',
          type: 'boolean',
          description: 'Controlled open state.',
          commonlyUsed: true,
        },
        {
          name: 'onOpenChange',
          type: '(open: boolean) => void',
          description: 'Callback fired when the open state changes.',
          commonlyUsed: true,
        },
        {
          name: 'defaultOpen',
          type: 'boolean',
          default: 'false',
          description: 'Initial open state for uncontrolled usage.',
        },
        {
          name: 'modal',
          type: 'boolean',
          default: 'true',
          description: 'Whether the menu should behave as a modal.',
        },
        {
          name: 'dir',
          type: "'ltr' | 'rtl'",
          description: 'Reading direction for the menu.',
        },
      ],
      notes: [
        'Composed from DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, and more.',
        'Also exports DropdownMenuCheckboxItem, DropdownMenuRadioItem, DropdownMenuRadioGroup, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent, DropdownMenuGroup, DropdownMenuPortal, and DropdownMenuShortcut.',
        'DropdownMenuContent defaults sideOffset to 4 and renders inside a portal.',
        'DropdownMenuItem and DropdownMenuLabel accept an inset prop to add left padding for alignment with icons.',
      ],
    },
    {
      name: 'DropdownMenuContent',
      description:
        'The floating content panel of a dropdown menu. Renders inside a portal with entrance/exit animations.',
      importPath: '@clarity-chat/primitives',
      usageCode: `<DropdownMenuContent sideOffset={4} align="start">
  <DropdownMenuItem>Item 1</DropdownMenuItem>
  <DropdownMenuItem>Item 2</DropdownMenuItem>
</DropdownMenuContent>`,
      props: [
        {
          name: 'sideOffset',
          type: 'number',
          default: '4',
          description: 'Distance in pixels from the trigger element.',
          commonlyUsed: true,
        },
        {
          name: 'side',
          type: "'top' | 'right' | 'bottom' | 'left'",
          default: "'bottom'",
          description: 'Preferred side of the trigger to render against.',
        },
        {
          name: 'align',
          type: "'start' | 'center' | 'end'",
          default: "'center'",
          description: 'Alignment relative to the trigger.',
        },
        {
          name: 'className',
          type: 'string',
          description: 'Additional CSS class names.',
        },
      ],
      notes: [
        'Also accepts all Radix UI DropdownMenu.Content props.',
        'Automatically constrains max-height to available viewport space.',
      ],
    },
  ],

  // ==========================================================================
  // Popover
  // ==========================================================================
  Popover: [
    {
      name: 'Popover',
      description:
        'Root component for floating popover panels. Wraps Radix UI Popover.Root for accessible, non-modal floating content.',
      importPath: '@clarity-chat/primitives',
      usageCode: `<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline">Open Popover</Button>
  </PopoverTrigger>
  <PopoverContent>
    <div className="space-y-2">
      <h4 className="font-medium">Popover Content</h4>
      <p className="text-sm text-muted-foreground">
        This is the popover content. You can put any content here.
      </p>
    </div>
  </PopoverContent>
</Popover>`,
      props: [
        {
          name: 'open',
          type: 'boolean',
          description: 'Controlled open state.',
          commonlyUsed: true,
        },
        {
          name: 'onOpenChange',
          type: '(open: boolean) => void',
          description: 'Callback fired when the open state changes.',
          commonlyUsed: true,
        },
        {
          name: 'defaultOpen',
          type: 'boolean',
          default: 'false',
          description: 'Initial open state for uncontrolled usage.',
        },
        {
          name: 'modal',
          type: 'boolean',
          default: 'false',
          description: 'Whether the popover should behave as a modal.',
        },
      ],
      notes: [
        'Composed from Popover, PopoverTrigger, PopoverContent, and PopoverAnchor.',
        'Unlike Dialog, Popover is non-modal by default and does not trap focus.',
        'PopoverContent renders inside a portal with animated entrance/exit transitions.',
      ],
    },
    {
      name: 'PopoverContent',
      description:
        'The floating content panel of a popover. Renders inside a portal with animations.',
      importPath: '@clarity-chat/primitives',
      usageCode: `<PopoverContent align="center" sideOffset={4}>
  <p>Any content can go here.</p>
</PopoverContent>`,
      props: [
        {
          name: 'align',
          type: "'start' | 'center' | 'end'",
          default: "'center'",
          description: 'Alignment relative to the trigger.',
          commonlyUsed: true,
        },
        {
          name: 'sideOffset',
          type: 'number',
          default: '4',
          description: 'Distance in pixels from the trigger element.',
          commonlyUsed: true,
        },
        {
          name: 'side',
          type: "'top' | 'right' | 'bottom' | 'left'",
          default: "'bottom'",
          description: 'Preferred side of the trigger to render against.',
        },
        {
          name: 'className',
          type: 'string',
          description: 'Additional CSS class names.',
        },
      ],
      notes: [
        'Also accepts all Radix UI Popover.Content props (onOpenAutoFocus, onCloseAutoFocus, onEscapeKeyDown, etc.).',
        'Default width is w-72 (18rem). Override with className.',
      ],
    },
  ],

  // ==========================================================================
  // Tooltip
  // ==========================================================================
  Tooltip: {
    name: 'Tooltip',
    description:
      'Enhanced tooltip wrapper that simplifies the Radix UI Tooltip into a single component with content prop, arrow, and configurable delay.',
    importPath: '@clarity-chat/primitives',
    usageCode: `{/* Basic tooltip */}
<Tooltip content="This is a tooltip">
  <Button variant="outline">Hover me</Button>
</Tooltip>

{/* With options */}
<Tooltip
  content="Detailed information here"
  side="bottom"
  align="start"
  delay={400}
  showArrow={false}
>
  <span className="cursor-help">Info</span>
</Tooltip>

{/* Controlled */}
<Tooltip
  content="Controlled tooltip"
  open={isOpen}
  onOpenChange={setIsOpen}
>
  <Button>Trigger</Button>
</Tooltip>

{/* Disabled */}
<Tooltip content="Won't show" disabled>
  <Button>No tooltip</Button>
</Tooltip>`,
    props: [
      {
        name: 'children',
        type: 'React.ReactNode',
        required: true,
        description: 'The trigger element that the tooltip is attached to.',
        commonlyUsed: true,
      },
      {
        name: 'content',
        type: 'React.ReactNode',
        required: true,
        description: 'The content to display inside the tooltip popup.',
        commonlyUsed: true,
      },
      {
        name: 'side',
        type: "'top' | 'right' | 'bottom' | 'left'",
        default: "'top'",
        description: 'Which side of the trigger to show the tooltip on.',
        commonlyUsed: true,
      },
      {
        name: 'align',
        type: "'start' | 'center' | 'end'",
        default: "'center'",
        description: 'Alignment of the tooltip relative to the trigger.',
      },
      {
        name: 'delay',
        type: 'number',
        default: '200',
        description:
          'Delay in milliseconds before the tooltip appears on hover.',
        commonlyUsed: true,
      },
      {
        name: 'showArrow',
        type: 'boolean',
        default: 'true',
        description: 'Whether to display a directional arrow on the tooltip.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS class names for the trigger wrapper.',
      },
      {
        name: 'contentClassName',
        type: 'string',
        description:
          'Additional CSS class names for the tooltip content panel.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        description:
          'When true, disables the tooltip and renders only the children.',
      },
      {
        name: 'open',
        type: 'boolean',
        description: 'Controlled open state for the tooltip.',
      },
      {
        name: 'onOpenChange',
        type: '(open: boolean) => void',
        description: 'Callback fired when the tooltip open state changes.',
      },
    ],
    notes: [
      'This is an enhanced wrapper around Radix UI Tooltip primitives. For composable low-level usage, import TooltipRoot, TooltipTrigger, TooltipContent, and TooltipProvider instead.',
      'A SimpleTooltip component is also exported as an alternative API that takes a text string prop instead of content ReactNode.',
      'The arrow is rendered as a rotated div and auto-positions based on the side prop.',
      'Negative delay values are clamped to 0.',
    ],
  },

  // ==========================================================================
  // Tabs
  // ==========================================================================
  Tabs: [
    {
      name: 'Tabs',
      description:
        'Root container for tabbed navigation. Wraps Radix UI Tabs.Root with styled list and content panels.',
      importPath: '@clarity-chat/primitives',
      usageCode: `<Tabs defaultValue="tab1" className="w-full">
  <TabsList>
    <TabsTrigger value="tab1">Overview</TabsTrigger>
    <TabsTrigger value="tab2">Settings</TabsTrigger>
    <TabsTrigger value="tab3">Analytics</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1" className="p-4 border rounded-lg mt-2">
    <h3 className="font-medium mb-2">Overview Tab</h3>
    <p className="text-sm text-muted-foreground">
      Tab content goes here.
    </p>
  </TabsContent>
  <TabsContent value="tab2" className="p-4 border rounded-lg mt-2">
    <h3 className="font-medium mb-2">Settings Tab</h3>
    <p className="text-sm text-muted-foreground">
      Configure your settings here.
    </p>
  </TabsContent>
  <TabsContent value="tab3" className="p-4 border rounded-lg mt-2">
    <h3 className="font-medium mb-2">Analytics Tab</h3>
    <p className="text-sm text-muted-foreground">
      View your analytics data.
    </p>
  </TabsContent>
</Tabs>`,
      props: [
        {
          name: 'defaultValue',
          type: 'string',
          description:
            'The value of the tab that should be active by default (uncontrolled).',
          commonlyUsed: true,
        },
        {
          name: 'value',
          type: 'string',
          description: 'The controlled active tab value.',
          commonlyUsed: true,
        },
        {
          name: 'onValueChange',
          type: '(value: string) => void',
          description: 'Callback fired when the active tab changes.',
          commonlyUsed: true,
        },
        {
          name: 'orientation',
          type: "'horizontal' | 'vertical'",
          default: "'horizontal'",
          description: 'Orientation of the tabs for keyboard navigation.',
        },
        {
          name: 'dir',
          type: "'ltr' | 'rtl'",
          description: 'Reading direction.',
        },
        {
          name: 'activationMode',
          type: "'automatic' | 'manual'",
          default: "'automatic'",
          description:
            'Whether tabs activate on focus (automatic) or require Enter/Space (manual).',
        },
        {
          name: 'className',
          type: 'string',
          description: 'Additional CSS class names for the root container.',
        },
      ],
      notes: [
        'Composed from Tabs, TabsList, TabsTrigger, and TabsContent.',
        'TabsTrigger and TabsContent both require a matching value prop.',
        'TabsList renders with a muted background and rounded container by default.',
        'Active tab triggers show elevated background with shadow.',
      ],
    },
    {
      name: 'TabsTrigger',
      description:
        'A tab button within TabsList. Must have a value matching a TabsContent.',
      importPath: '@clarity-chat/primitives',
      usageCode: `<TabsTrigger value="settings" disabled={false}>
  Settings
</TabsTrigger>`,
      props: [
        {
          name: 'value',
          type: 'string',
          required: true,
          description:
            'Unique value that links this trigger to its corresponding TabsContent.',
          commonlyUsed: true,
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: 'Prevents the tab from being activated.',
        },
        {
          name: 'className',
          type: 'string',
          description: 'Additional CSS class names.',
        },
      ],
      notes: [
        'Also accepts all Radix UI Tabs.Trigger props.',
        'Active state styles are applied automatically via data-[state=active] CSS selectors.',
      ],
    },
    {
      name: 'TabsContent',
      description:
        'Content panel associated with a tab trigger. Renders when its value matches the active tab.',
      importPath: '@clarity-chat/primitives',
      usageCode: `<TabsContent value="settings" className="p-4">
  <p>Settings content here.</p>
</TabsContent>`,
      props: [
        {
          name: 'value',
          type: 'string',
          required: true,
          description:
            'Value that links this content to its corresponding TabsTrigger.',
          commonlyUsed: true,
        },
        {
          name: 'forceMount',
          type: 'boolean',
          description:
            'When true, content is always mounted in the DOM regardless of active state.',
        },
        {
          name: 'className',
          type: 'string',
          description: 'Additional CSS class names.',
        },
      ],
      notes: [
        'Also accepts all Radix UI Tabs.Content props.',
        'Focus ring styles are applied for keyboard accessibility.',
      ],
    },
  ],

  // ==========================================================================
  // Form Elements
  // ==========================================================================
  'Form Elements': [
    {
      name: 'Input',
      description:
        'Enhanced input component with built-in label, icon slots, clearable button, character count, error/helper text, and multiple size variants.',
      importPath: '@clarity-chat/primitives',
      usageCode: `{/* Basic input with label */}
<Label htmlFor="input">Text Input</Label>
<Input
  id="input"
  placeholder="Enter text..."
  value={inputValue}
  onChange={(e) => setInputValue(e.target.value)}
/>

{/* With icon and error */}
<Input
  label="Search"
  icon={<SearchIcon />}
  error="No results found"
/>

{/* Clearable with character count */}
<Input
  label="Username"
  clearable
  onClear={() => setValue('')}
  maxLength={50}
  showCharacterCount
/>

{/* Size variants */}
<Input inputSize="sm" placeholder="Small" />
<Input inputSize="default" placeholder="Default" />
<Input inputSize="lg" placeholder="Large" />

{/* States */}
<Input placeholder="Disabled input" disabled />
<Input variant="error" placeholder="Error state" />
<Input variant="success" placeholder="Success state" />`,
      props: [
        {
          name: 'label',
          type: 'string',
          description:
            'Label text displayed above the input. Creates an associated <label> element with proper htmlFor linking.',
          commonlyUsed: true,
        },
        {
          name: 'variant',
          type: "'default' | 'error' | 'success'",
          default: "'default'",
          description:
            'Visual variant. Automatically set to "error" when error prop is provided.',
          commonlyUsed: true,
        },
        {
          name: 'inputSize',
          type: "'default' | 'sm' | 'lg'",
          default: "'default'",
          description: 'Size variant controlling height and text size.',
          commonlyUsed: true,
        },
        {
          name: 'error',
          type: 'string',
          description:
            'Error message displayed below the input. Sets aria-invalid and aria-describedby automatically.',
          commonlyUsed: true,
        },
        {
          name: 'helperText',
          type: 'string',
          description:
            'Helper text displayed below the input. Hidden when an error is shown.',
        },
        {
          name: 'icon',
          type: 'React.ReactNode',
          description: 'Icon element displayed inside the input field.',
        },
        {
          name: 'iconPosition',
          type: "'left' | 'right'",
          default: "'left'",
          description: 'Position of the icon within the input.',
        },
        {
          name: 'clearable',
          type: 'boolean',
          default: 'false',
          description: 'Show a clear (X) button when the input has a value.',
        },
        {
          name: 'onClear',
          type: '() => void',
          description: 'Callback when the clear button is clicked.',
        },
        {
          name: 'maxLength',
          type: 'number',
          description:
            'Maximum character length. When set, enables the character count display.',
        },
        {
          name: 'showCharacterCount',
          type: 'boolean',
          default: 'false',
          description:
            'Show a character counter below the input. Automatically enabled when maxLength is set.',
        },
        {
          name: 'hideLabel',
          type: 'boolean',
          default: 'false',
          description:
            'Visually hides the label while keeping it accessible to screen readers.',
        },
        {
          name: 'required',
          type: 'boolean',
          default: 'false',
          description:
            'Marks the input as required and shows an asterisk indicator in the label.',
        },
        {
          name: 'wrapperClassName',
          type: 'string',
          description: 'Additional CSS class names for the outer wrapper div.',
        },
        {
          name: 'className',
          type: 'string',
          description:
            'Additional CSS class names for the input element itself.',
        },
      ],
      notes: [
        'Also accepts all standard HTML <input> attributes (type, placeholder, disabled, onChange, value, etc.).',
        'The clear button animates in/out using Framer Motion and respects prefers-reduced-motion.',
        'Error state is set automatically when the error prop is provided, overriding the variant prop.',
        'Uses aria-describedby to link error and helper text for screen readers.',
      ],
    },
    {
      name: 'Textarea',
      description:
        'Enhanced textarea component with built-in label, auto-resize, character count, error/helper text, and multiple size variants.',
      importPath: '@clarity-chat/primitives',
      usageCode: `<Label htmlFor="textarea">Textarea</Label>
<Textarea
  id="textarea"
  placeholder="Enter longer text..."
  rows={3}
/>

{/* With auto-resize and character count */}
<Textarea
  label="Bio"
  autoResize
  maxRows={10}
  maxLength={500}
  showCharacterCount
/>

{/* With error */}
<Textarea
  label="Description"
  error="Description is required"
  required
/>`,
      props: [
        {
          name: 'label',
          type: 'string',
          description:
            'Label text displayed above the textarea. Creates an associated <label> element.',
          commonlyUsed: true,
        },
        {
          name: 'variant',
          type: "'default' | 'error' | 'success'",
          default: "'default'",
          description:
            'Visual variant. Automatically set to "error" when error prop is provided.',
          commonlyUsed: true,
        },
        {
          name: 'textareaSize',
          type: "'default' | 'sm' | 'lg'",
          default: "'default'",
          description: 'Size variant controlling minimum height and text size.',
        },
        {
          name: 'error',
          type: 'string',
          description: 'Error message displayed below the textarea.',
          commonlyUsed: true,
        },
        {
          name: 'helperText',
          type: 'string',
          description:
            'Helper text displayed below the textarea. Hidden when an error is shown.',
        },
        {
          name: 'autoResize',
          type: 'boolean',
          default: 'false',
          description:
            'Automatically adjusts the textarea height based on content.',
          commonlyUsed: true,
        },
        {
          name: 'maxRows',
          type: 'number',
          description:
            'Maximum number of rows when auto-resizing. Limits the auto-resize height.',
        },
        {
          name: 'maxLength',
          type: 'number',
          description:
            'Maximum character length. Enables the character count display.',
        },
        {
          name: 'showCharacterCount',
          type: 'boolean',
          default: 'false',
          description: 'Show a character counter below the textarea.',
        },
        {
          name: 'hideLabel',
          type: 'boolean',
          default: 'false',
          description:
            'Visually hides the label while keeping it accessible to screen readers.',
        },
        {
          name: 'required',
          type: 'boolean',
          default: 'false',
          description:
            'Marks the textarea as required and shows an asterisk in the label.',
        },
        {
          name: 'wrapperClassName',
          type: 'string',
          description: 'Additional CSS class names for the outer wrapper div.',
        },
        {
          name: 'className',
          type: 'string',
          description:
            'Additional CSS class names for the textarea element itself.',
        },
      ],
      notes: [
        'Also accepts all standard HTML <textarea> attributes (placeholder, disabled, rows, onChange, value, etc.).',
        'Auto-resize calculates height from scrollHeight and respects maxRows by computing line height from computed styles.',
        'Uses aria-describedby to link error and helper text for screen readers.',
      ],
    },
    {
      name: 'Label',
      description:
        'Accessible label component built on Radix UI Label primitive. Automatically adjusts opacity when its associated input is disabled via the peer-disabled CSS pattern.',
      importPath: '@clarity-chat/primitives',
      usageCode: `<Label htmlFor="email">Email Address</Label>
<Input id="email" type="email" />`,
      props: [
        {
          name: 'htmlFor',
          type: 'string',
          description: 'Associates the label with a form element by its id.',
          commonlyUsed: true,
        },
        {
          name: 'className',
          type: 'string',
          description: 'Additional CSS class names.',
        },
        {
          name: 'children',
          type: 'React.ReactNode',
          description: 'Label text content.',
          commonlyUsed: true,
        },
      ],
      notes: [
        'Also accepts all Radix UI Label.Root props.',
        'Uses peer-disabled CSS utility to dim the label when the associated input is disabled.',
      ],
    },
    {
      name: 'Checkbox',
      description:
        'Accessible checkbox component built on Radix UI Checkbox. Displays a checkmark indicator when checked.',
      importPath: '@clarity-chat/primitives',
      usageCode: `const [checked, setChecked] = useState(false)

<div className="flex items-center space-x-2">
  <Checkbox
    id="terms"
    checked={checked}
    onCheckedChange={(checked) => setChecked(checked as boolean)}
  />
  <Label htmlFor="terms">Accept terms and conditions</Label>
</div>`,
      props: [
        {
          name: 'checked',
          type: "boolean | 'indeterminate'",
          description: 'Controlled checked state.',
          commonlyUsed: true,
        },
        {
          name: 'onCheckedChange',
          type: "(checked: boolean | 'indeterminate') => void",
          description: 'Callback fired when the checked state changes.',
          commonlyUsed: true,
        },
        {
          name: 'defaultChecked',
          type: "boolean | 'indeterminate'",
          description: 'Initial checked state for uncontrolled usage.',
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: 'Prevents the checkbox from being toggled.',
        },
        {
          name: 'required',
          type: 'boolean',
          default: 'false',
          description: 'Makes the checkbox required for form validation.',
        },
        {
          name: 'name',
          type: 'string',
          description: 'Name attribute for form submission.',
        },
        {
          name: 'value',
          type: 'string',
          default: "'on'",
          description: 'Value attribute for form submission.',
        },
        {
          name: 'id',
          type: 'string',
          description: 'Element id, used to associate with a Label.',
          commonlyUsed: true,
        },
        {
          name: 'className',
          type: 'string',
          description: 'Additional CSS class names.',
        },
      ],
      notes: [
        'Also accepts all Radix UI Checkbox.Root props.',
        'Supports indeterminate state in addition to checked/unchecked.',
        'Pair with a Label component using matching id/htmlFor for accessibility.',
      ],
    },
    {
      name: 'Switch',
      description:
        'Enhanced toggle switch component with built-in label, description, error handling, and form compatibility. Wraps Radix UI Switch with additional features.',
      importPath: '@clarity-chat/primitives',
      usageCode: `const [enabled, setEnabled] = useState(false)

<div className="flex items-center space-x-2">
  <Switch
    id="notifications"
    checked={enabled}
    onCheckedChange={setEnabled}
  />
  <Label htmlFor="notifications">Enable notifications</Label>
</div>

{/* With built-in label and description */}
<Switch
  label="Dark Mode"
  description="Switch to dark color scheme"
  checked={isDark}
  onCheckedChange={setIsDark}
/>`,
      props: [
        {
          name: 'checked',
          type: 'boolean',
          description: 'Controlled checked state.',
          commonlyUsed: true,
        },
        {
          name: 'onCheckedChange',
          type: '(checked: boolean) => void',
          description: 'Callback fired when the switch is toggled.',
          commonlyUsed: true,
        },
        {
          name: 'defaultChecked',
          type: 'boolean',
          default: 'false',
          description: 'Initial checked state for uncontrolled usage.',
        },
        {
          name: 'label',
          type: 'React.ReactNode',
          description: 'Visible label displayed next to the switch.',
          commonlyUsed: true,
        },
        {
          name: 'description',
          type: 'React.ReactNode',
          description:
            'Optional supporting description text displayed below the label.',
        },
        {
          name: 'error',
          type: 'string',
          description: 'Error text rendered below the switch control.',
        },
        {
          name: 'align',
          type: "'center' | 'start'",
          default: "'center'",
          description:
            'Vertical alignment between the label/description and the switch thumb.',
        },
        {
          name: 'containerClassName',
          type: 'string',
          description: 'CSS class names applied to the outer wrapper.',
        },
        {
          name: 'labelSrOnly',
          type: 'boolean',
          default: 'false',
          description:
            'Visually hides the label while keeping it accessible to screen readers.',
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: 'Prevents the switch from being toggled.',
        },
        {
          name: 'name',
          type: 'string',
          description:
            'Name attribute for form submission. Renders a hidden input.',
        },
        {
          name: 'value',
          type: 'string | number | readonly string[]',
          default: "'on'",
          description: 'Value attribute for form submission.',
        },
        {
          name: 'required',
          type: 'boolean',
          default: 'false',
          description: 'Whether the field is required for form validation.',
        },
        {
          name: 'onChange',
          type: 'React.ChangeEventHandler<HTMLInputElement>',
          description:
            'Native change handler for compatibility with existing checkbox/form handlers. Fires a synthetic event from a hidden input.',
        },
        {
          name: 'id',
          type: 'string',
          description: 'Element id. Auto-generated if not provided.',
        },
        {
          name: 'className',
          type: 'string',
          description:
            'Additional CSS class names for the switch element itself.',
        },
      ],
      notes: [
        'Also accepts all Radix UI Switch.Root props.',
        'Includes a hidden <input type="checkbox"> for native form submission compatibility.',
        'The onChange handler receives a synthetic React.ChangeEvent for backward compatibility with checkbox-style handlers.',
        'Error messages are rendered using the shared ErrorMessage component with proper aria associations.',
      ],
    },
    {
      name: 'Select',
      description:
        'Accessible select dropdown built on Radix UI Select. Composed from Select, SelectTrigger, SelectValue, SelectContent, and SelectItem.',
      importPath: '@clarity-chat/primitives',
      usageCode: `const [value, setValue] = useState('')

<Select value={value} onValueChange={setValue}>
  <SelectTrigger>
    <SelectValue placeholder="Select an option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
    <SelectItem value="option3">Option 3</SelectItem>
  </SelectContent>
</Select>`,
      props: [
        {
          name: 'value',
          type: 'string',
          description: 'Controlled selected value.',
          commonlyUsed: true,
        },
        {
          name: 'onValueChange',
          type: '(value: string) => void',
          description: 'Callback fired when the selected value changes.',
          commonlyUsed: true,
        },
        {
          name: 'defaultValue',
          type: 'string',
          description: 'Initial selected value for uncontrolled usage.',
        },
        {
          name: 'open',
          type: 'boolean',
          description: 'Controlled open state of the dropdown.',
        },
        {
          name: 'onOpenChange',
          type: '(open: boolean) => void',
          description: 'Callback fired when the dropdown open state changes.',
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: 'Prevents the select from being opened.',
        },
        {
          name: 'name',
          type: 'string',
          description: 'Name attribute for form submission.',
        },
        {
          name: 'required',
          type: 'boolean',
          default: 'false',
          description: 'Makes the select required for form validation.',
        },
        {
          name: 'dir',
          type: "'ltr' | 'rtl'",
          description: 'Reading direction.',
        },
      ],
      notes: [
        'Composed from Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectLabel, SelectSeparator, and SelectGroup.',
        'SelectContent defaults position to "popper" and renders inside a portal with animations.',
        'SelectItem displays a checkmark indicator for the currently selected value.',
        'SelectTrigger renders a chevron-down icon and supports the placeholder prop via SelectValue.',
        'Also exports SelectScrollUpButton and SelectScrollDownButton for long lists.',
      ],
    },
  ],

  // ==========================================================================
  // Avatar
  // ==========================================================================
  Avatar: {
    name: 'Avatar',
    description:
      'Enhanced avatar component with image support, auto-generated initials fallback, size variants, status indicators, and hover effects. Wraps Radix UI Avatar primitives.',
    importPath: '@clarity-chat/primitives',
    usageCode: `{/* With image */}
<Avatar
  src="https://i.pravatar.cc/150?u=1"
  alt="User Name"
  size="default"
/>

{/* Different sizes */}
<Avatar src="https://i.pravatar.cc/150?u=2" alt="User" size="xs" />
<Avatar src="https://i.pravatar.cc/150?u=3" alt="User" size="sm" />
<Avatar src="https://i.pravatar.cc/150?u=4" alt="User" size="default" />
<Avatar src="https://i.pravatar.cc/150?u=5" alt="User" size="lg" />
<Avatar src="https://i.pravatar.cc/150?u=6" alt="User" size="xl" />
<Avatar src="https://i.pravatar.cc/150?u=7" alt="User" size="2xl" />

{/* Fallback with initials */}
<Avatar fallback="AB" size="lg" />
<Avatar alt="John Doe" size="lg" /> {/* Auto-generates "JD" */}

{/* With status indicator */}
<Avatar src="/avatar.jpg" alt="User" status="online" />
<Avatar src="/avatar.jpg" alt="User" status="busy" />

{/* Hoverable */}
<Avatar src="/avatar.jpg" alt="User" hoverable />`,
    props: [
      {
        name: 'src',
        type: 'string',
        description: 'URL of the avatar image.',
        commonlyUsed: true,
      },
      {
        name: 'alt',
        type: 'string',
        description:
          'Alt text for the avatar image. Also used to generate initials fallback.',
        commonlyUsed: true,
      },
      {
        name: 'fallback',
        type: 'string',
        description:
          'Explicit fallback text (e.g., initials) shown when the image is not available. Overrides auto-generated initials from alt.',
        commonlyUsed: true,
      },
      {
        name: 'size',
        type: "'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl'",
        default: "'default'",
        description:
          'Size variant controlling dimensions and text size for the fallback.',
        commonlyUsed: true,
      },
      {
        name: 'status',
        type: "'online' | 'offline' | 'away' | 'busy'",
        description:
          'Shows a colored status dot indicator at the bottom-right corner.',
        commonlyUsed: true,
      },
      {
        name: 'hoverable',
        type: 'boolean',
        default: 'false',
        description: 'Enables a subtle scale and lift effect on hover.',
      },
      {
        name: 'statusBadge',
        type: 'React.ReactNode',
        description:
          'Custom status badge content rendered at the bottom-right corner. Overrides the status dot.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS class names for the root element.',
      },
    ],
    notes: [
      'Also accepts all standard HTML div attributes except children.',
      'Fallback initials are auto-generated from the alt text by taking the first letter of each word (up to 2 characters).',
      'Status indicator sizes scale with the avatar size variant.',
      'Online and away statuses include a ping animation on the dot.',
      'Size mapping: xs=24px, sm=32px, default=40px, lg=48px, xl=64px, 2xl=80px.',
    ],
  },

  // ==========================================================================
  // Badge
  // ==========================================================================
  Badge: {
    name: 'Badge',
    description:
      'Enhanced badge component with multiple visual variants, size options, animated dot indicator, pulse animation, and glow effects.',
    importPath: '@clarity-chat/primitives',
    usageCode: `{/* Variants */}
<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="info">Info</Badge>
<Badge variant="subtle">Subtle</Badge>
<Badge variant="ghost">Ghost</Badge>

{/* Sizes */}
<Badge size="sm">Small</Badge>
<Badge size="default">Default</Badge>
<Badge size="lg">Large</Badge>

{/* With dot indicator */}
<Badge dot>Active</Badge>

{/* With pulse animation */}
<Badge variant="destructive" pulse>Alert</Badge>

{/* With glow effect */}
<Badge variant="success" glow>Live</Badge>`,
    props: [
      {
        name: 'variant',
        type: "'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info' | 'subtle' | 'ghost'",
        default: "'default'",
        description: 'Visual style variant of the badge.',
        commonlyUsed: true,
      },
      {
        name: 'size',
        type: "'sm' | 'default' | 'lg'",
        default: "'default'",
        description: 'Size variant controlling padding and text size.',
        commonlyUsed: true,
      },
      {
        name: 'dot',
        type: 'boolean',
        default: 'false',
        description: 'Show an animated dot indicator before the badge text.',
        commonlyUsed: true,
      },
      {
        name: 'pulse',
        type: 'boolean',
        default: 'false',
        description: 'Enable pulse animation for notification-style badges.',
      },
      {
        name: 'glow',
        type: 'boolean',
        default: 'false',
        description: 'Enable a glow animation effect.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS class names.',
      },
      {
        name: 'children',
        type: 'React.ReactNode',
        description: 'Badge content.',
        commonlyUsed: true,
      },
    ],
    notes: [
      'Also accepts all standard HTML <div> attributes (onClick, role, etc.).',
      'All variant buttons include a subtle hover:scale-105 effect.',
      'The dot indicator includes a ping animation for attention.',
      'Badges render as rounded-full pills with consistent spacing.',
    ],
  },

  // ==========================================================================
  // Card
  // ==========================================================================
  Card: [
    {
      name: 'Card',
      description:
        'Enhanced card container with optional hover effects, border control, and glassmorphism support. Wraps shadcn/ui Card with additional features.',
      importPath: '@clarity-chat/primitives',
      usageCode: `{/* Basic card */}
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description text</CardDescription>
  </CardHeader>
  <CardContent>
    <p className="text-sm">Card content goes here.</p>
  </CardContent>
  <CardFooter>
    <Button size="sm">Action</Button>
  </CardFooter>
</Card>

{/* Hoverable card */}
<Card hoverable>
  <CardHeader>
    <CardTitle>Interactive Card</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Hover for lift effect.</p>
  </CardContent>
</Card>

{/* Glass card */}
<Card glass glassIntensity="medium" glassGradient="blue">
  <CardContent>
    <p>Glassmorphism card</p>
  </CardContent>
</Card>`,
      props: [
        {
          name: 'hoverable',
          type: 'boolean',
          default: 'false',
          description:
            'Enables a shadow lift effect on hover with cursor pointer.',
          commonlyUsed: true,
        },
        {
          name: 'bordered',
          type: 'boolean',
          default: 'true',
          description: 'Controls whether the card has a border.',
        },
        {
          name: 'glass',
          type: 'boolean',
          default: 'false',
          description:
            'Enables glassmorphism styling with backdrop blur and transparency.',
          commonlyUsed: true,
        },
        {
          name: 'glassIntensity',
          type: "'subtle' | 'medium' | 'strong'",
          default: "'medium'",
          description:
            'Glass blur and opacity intensity level. Only applies when glass is true.',
        },
        {
          name: 'glassGradient',
          type: "'none' | 'blue' | 'purple' | 'pink' | 'green' | 'amber'",
          default: "'none'",
          description: 'OKLCH-based pastel gradient overlay for glass cards.',
        },
        {
          name: 'glassBorder',
          type: "'none' | 'light' | 'medium' | 'strong'",
          default: "'light'",
          description: 'Border style for glass cards.',
        },
        {
          name: 'glassAnimated',
          type: "'none' | 'gradient' | 'glow' | 'both'",
          default: "'none'",
          description: 'Animation effects for glass cards.',
        },
        {
          name: 'glassHover',
          type: "'none' | 'lift' | 'glow' | 'brighten'",
          default: "'none'",
          description:
            'Hover interaction style for glass cards. Defaults to "lift" when hoverable is true.',
        },
        {
          name: 'className',
          type: 'string',
          description: 'Additional CSS class names.',
        },
        {
          name: 'children',
          type: 'React.ReactNode',
          description:
            'Card content (typically CardHeader, CardContent, CardFooter).',
          commonlyUsed: true,
        },
      ],
      notes: [
        'Also accepts all standard HTML <div> attributes.',
        'Composed from Card, CardHeader, CardTitle, CardDescription, CardContent, and CardFooter.',
        'CardHeader, CardTitle, CardDescription, CardContent, and CardFooter are simple layout wrappers that accept className and standard div attributes.',
        'Glass variants are powered by the glassVariants utility from the primitives package.',
      ],
    },
    {
      name: 'CardHeader',
      description:
        'Header section of a Card. Renders with vertical spacing and padding.',
      importPath: '@clarity-chat/primitives',
      usageCode: `<CardHeader>
  <CardTitle>Title</CardTitle>
  <CardDescription>Description</CardDescription>
</CardHeader>`,
      props: [
        {
          name: 'className',
          type: 'string',
          description: 'Additional CSS class names.',
        },
        {
          name: 'children',
          type: 'React.ReactNode',
          description:
            'Header content (typically CardTitle and CardDescription).',
          commonlyUsed: true,
        },
      ],
      notes: [
        'Also accepts all standard HTML <div> attributes.',
        'Default padding is p-6 with space-y-1.5 for child spacing.',
      ],
    },
    {
      name: 'CardContent',
      description:
        'Main content section of a Card. Renders with horizontal padding and no top padding to flow after CardHeader.',
      importPath: '@clarity-chat/primitives',
      usageCode: `<CardContent>
  <p>Main content here.</p>
</CardContent>`,
      props: [
        {
          name: 'className',
          type: 'string',
          description: 'Additional CSS class names.',
        },
        {
          name: 'children',
          type: 'React.ReactNode',
          description: 'Content area children.',
          commonlyUsed: true,
        },
      ],
      notes: [
        'Also accepts all standard HTML <div> attributes.',
        'Default padding is p-6 pt-0.',
      ],
    },
    {
      name: 'CardFooter',
      description:
        'Footer section of a Card. Renders as a flex row for action buttons.',
      importPath: '@clarity-chat/primitives',
      usageCode: `<CardFooter>
  <Button size="sm">Save</Button>
  <Button size="sm" variant="outline">Cancel</Button>
</CardFooter>`,
      props: [
        {
          name: 'className',
          type: 'string',
          description: 'Additional CSS class names.',
        },
        {
          name: 'children',
          type: 'React.ReactNode',
          description: 'Footer content (typically action buttons).',
          commonlyUsed: true,
        },
      ],
      notes: [
        'Also accepts all standard HTML <div> attributes.',
        'Default layout is flex with items-center and p-6 pt-0.',
      ],
    },
  ],

  // ==========================================================================
  // ScrollArea
  // ==========================================================================
  ScrollArea: {
    name: 'ScrollArea',
    description:
      'Enhanced scrollable container wrapping Radix UI ScrollArea with custom scrollbar styling options. Provides consistent scrollbar appearance across browsers.',
    importPath: '@clarity-chat/primitives',
    usageCode: `{/* Basic scroll area */}
<ScrollArea className="h-48 border rounded-lg p-4">
  <div className="space-y-4">
    {items.map((item, i) => (
      <p key={i} className="text-sm">
        Scrollable content item {i + 1}
      </p>
    ))}
  </div>
</ScrollArea>

{/* With horizontal scrollbar */}
<ScrollArea className="h-48 w-full" showHorizontalScrollbar>
  <div className="flex gap-4 w-[200%]">
    {/* Wide content here */}
  </div>
</ScrollArea>

{/* Using custom CSS scrollbar styling */}
<ScrollArea className="h-48" useCustomScrollbar>
  <div>Content with thin CSS scrollbar</div>
</ScrollArea>`,
    props: [
      {
        name: 'showHorizontalScrollbar',
        type: 'boolean',
        default: 'false',
        description:
          'Show a horizontal scrollbar in addition to the vertical one.',
        commonlyUsed: true,
      },
      {
        name: 'useCustomScrollbar',
        type: 'boolean',
        default: 'false',
        description:
          'Fall back to a simple div with CSS-based scrollbar styling instead of the Radix UI scroll area. Useful for backward compatibility.',
      },
      {
        name: 'className',
        type: 'string',
        description:
          'Additional CSS class names. Use to set height/width constraints.',
        commonlyUsed: true,
      },
      {
        name: 'children',
        type: 'React.ReactNode',
        description: 'Scrollable content.',
        commonlyUsed: true,
      },
    ],
    notes: [
      'Also accepts all Radix UI ScrollArea.Root props.',
      'Set a fixed height (e.g., h-48, h-64) or max-height on the ScrollArea to enable scrolling.',
      'The Radix-based mode renders a custom ScrollBar component with consistent styling across browsers.',
      'The useCustomScrollbar mode uses native CSS scrollbar-thin/scrollbar-thumb utilities.',
      'A ScrollBar component is also exported for advanced usage in custom layouts.',
    ],
  },

  // ==========================================================================
  // Separator & Kbd
  // ==========================================================================
  'Separator & Kbd': [
    {
      name: 'Separator',
      description:
        'Visual divider line built on Radix UI Separator. Supports horizontal and vertical orientations with accessible semantics.',
      importPath: '@clarity-chat/primitives',
      usageCode: `{/* Horizontal separator (default) */}
<Separator />

{/* Vertical separator */}
<div className="flex items-center gap-4 h-8">
  <span>Item 1</span>
  <Separator orientation="vertical" />
  <span>Item 2</span>
</div>

{/* Non-decorative separator (announced by screen readers) */}
<Separator decorative={false} />`,
      props: [
        {
          name: 'orientation',
          type: "'horizontal' | 'vertical'",
          default: "'horizontal'",
          description: 'Direction of the separator line.',
          commonlyUsed: true,
        },
        {
          name: 'decorative',
          type: 'boolean',
          default: 'true',
          description:
            'When true, the separator is purely visual (role="none"). When false, it has role="separator" for screen readers.',
        },
        {
          name: 'className',
          type: 'string',
          description: 'Additional CSS class names.',
        },
      ],
      notes: [
        'Also accepts all Radix UI Separator.Root props.',
        'Horizontal separators render as h-[1px] w-full. Vertical separators render as h-full w-[1px].',
        'Uses the bg-border color token for consistent theming.',
      ],
    },
    {
      name: 'Kbd',
      description:
        'Keyboard shortcut indicator that displays platform-appropriate key symbols. Shows Mac symbols on macOS and text labels on Windows/Linux.',
      importPath: '@clarity-chat/primitives',
      usageCode: `{/* Basic shortcut */}
<Kbd shortcut="mod+k" />  {/* Shows ⌘K on Mac, Ctrl+K on Windows */}

{/* Multiple modifiers */}
<Kbd shortcut="mod+shift+p" />

{/* Array syntax */}
<Kbd shortcut={['mod', 'alt', 'enter']} />

{/* Force a specific platform */}
<Kbd shortcut="mod+k" platform="mac" />

{/* Variants */}
<Kbd shortcut="Escape" variant="outline" />
<Kbd shortcut="mod+s" variant="ghost" />

{/* Sizes */}
<Kbd shortcut="mod+k" size="sm" />
<Kbd shortcut="mod+k" size="md" />
<Kbd shortcut="mod+k" size="lg" />

{/* In context */}
<div className="flex items-center gap-2">
  <Kbd shortcut="mod+k" />
  <span className="text-muted-foreground">Open command palette</span>
</div>`,
      props: [
        {
          name: 'shortcut',
          type: 'string | string[]',
          required: true,
          description:
            'The keyboard shortcut to display. Use "mod" for the platform modifier (Cmd on Mac, Ctrl elsewhere). String format uses + as delimiter (e.g., "mod+k"). Array format takes individual keys (e.g., ["mod", "shift", "p"]).',
          commonlyUsed: true,
        },
        {
          name: 'platform',
          type: "'mac' | 'windows' | 'linux' | 'auto'",
          default: "'auto'",
          description:
            'Override automatic platform detection to force a specific key symbol style.',
        },
        {
          name: 'size',
          type: "'sm' | 'md' | 'lg'",
          default: "'md'",
          description: 'Size variant controlling padding and font size.',
          commonlyUsed: true,
        },
        {
          name: 'variant',
          type: "'default' | 'outline' | 'ghost'",
          default: "'default'",
          description: 'Visual style variant.',
          commonlyUsed: true,
        },
        {
          name: 'separator',
          type: "string | 'auto' | 'none'",
          default: "'auto'",
          description:
            'Separator character between keys. "auto" uses no separator on Mac and "+" on Windows/Linux. "none" removes the separator entirely.',
        },
        {
          name: 'className',
          type: 'string',
          description: 'Additional CSS class names for the <kbd> element.',
        },
      ],
      notes: [
        'Also accepts all standard HTML <kbd> element attributes.',
        'Platform is auto-detected from navigator.userAgent on mount.',
        'Recognized special keys: mod, cmd, ctrl, alt, option, shift, enter, return, backspace, delete, escape, tab, space, arrow keys, page up/down, home, end.',
        'Single letter keys are automatically uppercased.',
        'A useFormattedShortcut hook is also exported for getting the formatted shortcut string outside of a component.',
      ],
    },
  ],
}
