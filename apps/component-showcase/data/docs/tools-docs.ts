import type { ComponentDoc } from '@/components/doc-panel'

export const toolsDocs: Record<string, ComponentDoc | ComponentDoc[]> = {
  // ===========================================================================
  // Tool Cards
  // ===========================================================================
  'Tool Cards': [
    {
      name: 'ToolCard',
      description:
        'Lightweight, color-coded tool execution indicator. Displays tool name, status badge, optional arguments/result, duration, and expandable content. Uses CSS classes from globals.css for consistent styling.',
      importPath: '@clarity-chat/react',
      usageCode: `<ToolCard
  name="web_search"
  status="running"
  args={{ query: 'React hooks best practices' }}
  result={null}
  size="md"
  showArgs
  showResult={false}
  duration={1200}
  expanded={false}
  onToggleExpand={() => setExpanded((e) => !e)}
/>`,
      props: [
        {
          name: 'name',
          type: 'string',
          required: true,
          description: 'Tool name displayed in the card header.',
          commonlyUsed: true,
        },
        {
          name: 'status',
          type: 'ToolCardStatus',
          required: true,
          description:
            'Current execution status. Determines the color-coded indicator and status label.',
          commonlyUsed: true,
        },
        {
          name: 'args',
          type: 'Record<string, unknown>',
          description:
            'Tool arguments/input data. Displayed in the expandable content section when showArgs is true.',
          commonlyUsed: true,
        },
        {
          name: 'result',
          type: 'unknown',
          description:
            'Result data from tool execution. Displayed in the expandable content section when showResult is true.',
          commonlyUsed: true,
        },
        {
          name: 'error',
          type: 'string',
          description:
            'Error message shown in the expandable content when the tool has failed.',
        },
        {
          name: 'size',
          type: 'ToolCardSize',
          default: '"md"',
          description:
            'Size variant controlling container padding, icon size, text size, and badge size.',
        },
        {
          name: 'showArgs',
          type: 'boolean',
          default: 'false',
          description:
            'Whether to show the tool arguments in the expandable content area.',
          commonlyUsed: true,
        },
        {
          name: 'showResult',
          type: 'boolean',
          default: 'false',
          description:
            'Whether to show the tool result in the expandable content area.',
          commonlyUsed: true,
        },
        {
          name: 'duration',
          type: 'number',
          description:
            'Execution duration in milliseconds. Displayed as a formatted time string in the metadata area.',
        },
        {
          name: 'icon',
          type: 'React.ReactNode',
          description:
            'Custom icon to display instead of the default status icon.',
        },
        {
          name: 'className',
          type: 'string',
          description: 'Additional CSS class names for the root container.',
        },
        {
          name: 'disableAnimations',
          type: 'boolean',
          default: 'false',
          description:
            'Disable all entrance and transition animations. Also respects the prefers-reduced-motion media query.',
        },
        {
          name: 'onClick',
          type: '() => void',
          description:
            'Click handler for the entire card. Makes the card interactive with a pointer cursor and button role.',
        },
        {
          name: 'onToggleExpand',
          type: '() => void',
          description:
            'Handler for expanding/collapsing the detail content section.',
          commonlyUsed: true,
        },
        {
          name: 'expanded',
          type: 'boolean',
          default: 'false',
          description:
            'Whether the expandable content section is currently visible.',
          commonlyUsed: true,
        },
      ],
      notes: [
        'Status values map to CSS classes: tool-card-pending, tool-card-running, tool-card-success, tool-card-error.',
        'The card gains a button role and cursor-pointer when onClick or onToggleExpand is provided.',
        'Expandable content is only rendered when (showArgs && args) || (showResult && result) || error is truthy.',
        'Uses framer-motion for entrance animation with opacity and scale. Reduced motion falls back to opacity only.',
      ],
      sourceFile: 'components/ai/ToolCard/ToolCard.tsx',
    },
    {
      name: 'ToolCardList',
      description:
        'List container for rendering multiple ToolCard instances with consistent sizing and spacing. Manages expand/collapse state internally for each card.',
      importPath: '@clarity-chat/react',
      usageCode: `<ToolCardList
  tools={[
    {
      id: '1',
      name: 'web_search',
      status: 'success',
      args: { query: 'React' },
      duration: 1200,
    },
    {
      id: '2',
      name: 'read_file',
      status: 'running',
      args: { path: '/src/index.ts' },
    },
    {
      id: '3',
      name: 'code_interpreter',
      status: 'error',
      error: 'Syntax error on line 5',
    },
  ]}
  size="sm"
  gap="sm"
  showArgs
  showResult
/>`,
      props: [
        {
          name: 'tools',
          type: 'Array<{ id: string name: string status: ToolCardStatus args?: Record<string, unknown> result?: unknown error?: string duration?: number }>',
          required: true,
          description:
            'Array of tool data objects to render as individual ToolCard components.',
          commonlyUsed: true,
        },
        {
          name: 'size',
          type: 'ToolCardSize',
          default: '"sm"',
          description: 'Size variant applied to all cards in the list.',
        },
        {
          name: 'gap',
          type: "'sm' | 'md' | 'lg'",
          default: '"sm"',
          description: 'Spacing between cards. Maps to Tailwind gap classes.',
        },
        {
          name: 'showArgs',
          type: 'boolean',
          default: 'false',
          description:
            'Whether to show tool arguments on all cards in the list.',
        },
        {
          name: 'showResult',
          type: 'boolean',
          default: 'false',
          description: 'Whether to show tool results on all cards in the list.',
        },
        {
          name: 'className',
          type: 'string',
          description: 'Additional CSS class names for the list container.',
        },
      ],
      notes: [
        'Expand/collapse state is managed internally via a Set of expanded tool IDs.',
        'The onToggleExpand handler is only wired when a card has expandable content (args, result, or error).',
        'Each tool object must have a unique id for proper React key assignment and expand tracking.',
      ],
      sourceFile: 'components/ai/ToolCard/ToolCardList.tsx',
    },
  ],

  // ===========================================================================
  // Tool Execution
  // ===========================================================================
  'Tool Execution': {
    name: 'ToolExecutionCard',
    description:
      'Comprehensive tool execution status card with collapsible input/output sections, a live duration timer, status badges, and retry/cancel action buttons. Designed for AI chat interfaces that display function-calling results.',
    importPath: '@clarity-chat/react',
    usageCode: `<ToolExecutionCard
  tool={{
    id: 'tool_abc123',
    name: 'web_search',
    description: 'Search the web for information',
    status: 'executing',
    input: {
      query: 'React hooks best practices',
      max_results: 5,
    },
    output: null,
    startTime: new Date(),
  }}
  onRetry={() => handleRetry('tool_abc123')}
  onCancel={() => handleCancel('tool_abc123')}
  defaultInputExpanded={false}
  defaultOutputExpanded={true}
  compact={false}
  showTimestamps={false}
/>`,
    props: [
      {
        name: 'tool',
        type: 'ToolExecution',
        required: true,
        description:
          'Tool execution data object containing id, name, description, status, input, output, error, startTime, and endTime.',
        commonlyUsed: true,
      },
      {
        name: 'onRetry',
        type: '() => void',
        description:
          'Callback when the retry button is clicked. Only shown when tool status is "error".',
        commonlyUsed: true,
      },
      {
        name: 'onCancel',
        type: '() => void',
        description:
          'Callback when the cancel button is clicked. Only shown when tool status is "executing".',
        commonlyUsed: true,
      },
      {
        name: 'defaultInputExpanded',
        type: 'boolean',
        default: 'false',
        description:
          'Whether the input parameters collapsible section is expanded by default.',
      },
      {
        name: 'defaultOutputExpanded',
        type: 'boolean',
        default: 'true',
        description:
          'Whether the output result collapsible section is expanded by default.',
      },
      {
        name: 'icon',
        type: 'React.ReactNode',
        description:
          'Custom icon to display in the card header instead of the default wrench icon.',
      },
      {
        name: 'className',
        type: 'string',
        description:
          'Additional CSS class names applied to the outermost motion wrapper.',
      },
      {
        name: 'compact',
        type: 'boolean',
        default: 'false',
        description:
          'Enable compact mode for inline display with reduced padding, smaller icons, and hidden description text.',
        commonlyUsed: true,
      },
      {
        name: 'showTimestamps',
        type: 'boolean',
        default: 'false',
        description:
          'Show formatted start and end timestamps alongside the duration.',
      },
      {
        name: 'disableAnimations',
        type: 'boolean',
        default: 'false',
        description:
          'Disable entrance and transition animations. Also respects the prefers-reduced-motion media query.',
      },
    ],
    notes: [
      'The ToolExecution interface requires: id (string), name (string), status ("pending" | "executing" | "complete" | "error"), and input (Record<string, unknown> | null). Optional fields: description, output, error, startTime, endTime.',
      'A live duration timer updates every 100ms while status is "executing". Once complete, it displays the final duration calculated from startTime to endTime.',
      'An animated progress bar appears at the bottom of the card during the "executing" state.',
      'Collapsible sections use framer-motion AnimatePresence for smooth expand/collapse with height animation.',
      'Also exports the useToolExecution hook for managing tool execution state with start(), complete(), fail(), and reset() methods.',
    ],
    sourceFile: 'components/ai/ToolExecutionCard.tsx',
  },

  // ===========================================================================
  // Search Results
  // ===========================================================================
  'Search Results': [
    {
      name: 'SearchResultCard',
      description:
        'Displays a single web search result with favicon, site name, title link, snippet text, published date, and action buttons for feedback and saving.',
      importPath: '@clarity-chat/react',
      importName: 'SearchResultCard',
      usageCode: `<SearchResultCard
  result={{
    id: 'result-1',
    title: 'Next.js 14 | Next.js',
    url: 'https://nextjs.org/blog/next-14',
    snippet:
      'Next.js 14 includes Server Actions, Partial Prerendering, and more...',
    siteName: 'nextjs.org',
    type: 'web',
    relevance: 0.95,
  }}
  onSave={(id) => handleSave(id)}
  onFeedback={(id, type) => handleFeedback(id, type)}
  compact={false}
/>`,
      props: [
        {
          name: 'result',
          type: 'SemanticSearchResult',
          required: true,
          description:
            'Search result data with id, title, url, snippet, and optional favicon, siteName, publishedDate, type, thumbnail, and relevance fields.',
          commonlyUsed: true,
        },
        {
          name: 'isExpanded',
          type: 'boolean',
          required: true,
          description: 'Whether the result is expanded',
        },
        {
          name: 'isCopied',
          type: 'boolean',
          required: true,
          description: 'Whether this result is copied',
        },
        {
          name: 'index',
          type: 'number',
          description: 'Index for staggered animations',
        },
        {
          name: 'onSelect',
          type: '(result: SemanticSearchResult) => void',
          description: 'Handler for result selection',
        },
        {
          name: 'onCopy',
          type: '(result: SemanticSearchResult) => void',
          description: 'Handler for copy action',
        },
        {
          name: 'onToggleExpand',
          type: '(messageId: string) => void',
          description: 'Handler for expand/collapse',
        },
        { name: 'animated', type: 'boolean', description: 'Use animations' },
        {
          name: 'onSave',
          type: '(id: string) => void',
          description:
            'Callback when the bookmark/save button is clicked. Receives the result ID.',
        },
        {
          name: 'onFeedback',
          type: "(id: string, type: 'positive' | 'negative') => void",
          description:
            'Callback when the thumbs up or thumbs down button is clicked. Receives the result ID and feedback type.',
        },
        {
          name: 'compact',
          type: 'boolean',
          default: 'false',
          description:
            'Enable compact mode which hides the snippet text and thumbnail, showing only the title and metadata.',
          commonlyUsed: true,
        },
      ],
      notes: [
        'Action buttons (thumbs up, thumbs down, bookmark) appear on hover via group-hover opacity transition.',
        'When favicon is not provided, a Globe icon is shown as fallback.',
        'The siteName falls back to extracting the hostname from the URL via new URL(result.url).hostname.',
        'SearchResult type fields: id (string), title (string), url (string), snippet (string), favicon? (string), siteName? (string), publishedDate? (Date), type? ("web" | "image" | "video" | "news"), thumbnail? (string), relevance? (number).',
      ],
      sourceFile: 'components/search/components/SearchResultCard.tsx',
    },
    {
      name: 'SearchResultsList',
      description:
        'Renders a list of SearchResultCard components with loading skeletons and an empty state. Handles the full lifecycle of search result display.',
      importPath: '@clarity-chat/react',
      importName: 'SearchResultsList',
      usageCode: `<SearchResultsList
  results={searchResults}
  isLoading={isSearching}
  query="Next.js 14 features"
  onSave={(id) => handleSave(id)}
  onFeedback={(id, type) => handleFeedback(id, type)}
  compact={false}
/>`,
      props: [
        {
          name: 'results',
          type: 'SearchResult[]',
          required: true,
          description: 'Array of search result objects to display.',
          commonlyUsed: true,
        },
        {
          name: 'isLoading',
          type: 'boolean',
          default: 'false',
          description:
            'When true, displays 5 skeleton placeholders instead of results.',
          commonlyUsed: true,
        },
        {
          name: 'query',
          type: 'string',
          description:
            'The search query string. Displayed in the empty state message when no results are found.',
        },
        {
          name: 'onSave',
          type: '(id: string) => void',
          description:
            'Callback passed through to each SearchResultCard for the bookmark action.',
        },
        {
          name: 'onFeedback',
          type: "(id: string, type: 'positive' | 'negative') => void",
          description:
            'Callback passed through to each SearchResultCard for thumbs up/down feedback.',
        },
        {
          name: 'compact',
          type: 'boolean',
          default: 'false',
          description:
            'Enable compact mode on all result cards, hiding snippets and thumbnails.',
        },
      ],
      notes: [
        'Loading state renders 5 skeleton rows with favicon, title, and snippet placeholders.',
        'Empty state shows a large Search icon with "No results found" and the query text if provided.',
        'Results are separated by a divider line (divide-y) in standard mode, removed in compact mode.',
      ],
      sourceFile: 'components/clarity/search-messages.tsx',
    },
  ],

  // ===========================================================================
  // Tool Approval
  // ===========================================================================
  'Tool Approval': [
    {
      name: 'ToolApprovalDialog',
      description:
        'Full-screen dialog overlay for requesting user approval before executing a tool. Displays tool name, description, arguments, risk level indicator, and an explanation of what the tool will do. Supports approve/reject with optional rejection reason.',
      importPath: '@clarity-chat/react',
      usageCode: `<ToolApprovalDialog
  toolCall={{
    id: 'call_123',
    toolName: 'run_terminal',
    args: {
      command: 'npm install lodash',
      cwd: '/project',
    },
    status: 'pending_approval',
    createdAt: Date.now(),
  }}
  toolDefinition={{
    name: 'run_terminal',
    description:
      'Execute terminal commands in the project directory',
    parameters: {
      type: 'object',
      properties: {},
      required: [],
    },
    execute: async () => {},
    requiresApproval: true,
  }}
  onApprove={(callId, reason) => {
    orchestrator.approveTool(callId, 'user')
    orchestrator.executeApprovedTool(callId)
  }}
  onReject={(callId, reason) => {
    orchestrator.rejectTool(callId, reason, 'user')
  }}
  showArguments
  showDescription
  showRiskLevel
/>`,
      props: [
        {
          name: 'toolCall',
          type: 'ToolCallRecord',
          required: true,
          description:
            'The tool call record awaiting approval. Must include id, toolName, args, status, and createdAt.',
          commonlyUsed: true,
        },
        {
          name: 'toolDefinition',
          type: 'ToolDefinition',
          description:
            'Optional tool definition for enriched UX. Provides description and requiresApproval flag for risk assessment.',
          commonlyUsed: true,
        },
        {
          name: 'onApprove',
          type: '(callId: string, reason?: string) => void',
          required: true,
          description:
            'Callback when the user clicks Approve. Receives the tool call ID.',
          commonlyUsed: true,
        },
        {
          name: 'onReject',
          type: '(callId: string, reason: string) => void',
          required: true,
          description:
            'Callback when the user confirms rejection. Receives the tool call ID and the rejection reason text.',
          commonlyUsed: true,
        },
        {
          name: 'showArguments',
          type: 'boolean',
          default: 'true',
          description:
            'Show the JSON-formatted tool arguments section in the dialog body.',
        },
        {
          name: 'showDescription',
          type: 'boolean',
          default: 'true',
          description:
            'Show the tool description section (requires toolDefinition to have a description).',
        },
        {
          name: 'showRiskLevel',
          type: 'boolean',
          default: 'true',
          description:
            'Show a color-coded risk level badge (LOW, MEDIUM, HIGH) in the dialog header.',
        },
        {
          name: 'className',
          type: 'string',
          default: '""',
          description:
            'Additional CSS class names for the dialog root element.',
        },
        {
          name: 'theme',
          type: "'light' | 'dark' | 'auto'",
          default: '"auto"',
          description:
            'Color theme for the dialog. Sets a data-theme attribute for CSS targeting.',
        },
      ],
      notes: [
        'Risk level is automatically determined from the tool name: high-risk keywords (delete, remove, execute, eval, system), medium-risk keywords (write, update, modify, create, send, database), or low.',
        'A contextual explanation is auto-generated based on tool name patterns (weather, search, database, email, file) with argument interpolation.',
        'The reject flow has two steps: clicking Reject shows an optional reason input, then Confirm Rejection sends the reason.',
        'The dialog renders with an overlay backdrop using backdrop-filter blur. It includes inline scoped styles for full portability.',
      ],
      sourceFile: 'components/tool-approval/ToolApprovalDialog.tsx',
    },
    {
      name: 'ApprovalCard',
      description:
        'An inline card component for displaying approval requests. Used for tool confirmations, permission requests, and sensitive operations. Supports expandable details, auto-reject countdown, and an "Always allow" option.',
      importPath: '@clarity-chat/react',
      usageCode: `<ApprovalCard
  title="Execute shell command?"
  description="The AI wants to run: npm install lodash"
  intent="warning"
  size="md"
  details={[
    {
      label: 'Command',
      value: 'npm install lodash',
      isCode: true,
    },
    {
      label: 'Working Directory',
      value: '/project',
      isCode: true,
    },
  ]}
  defaultDetailsExpanded={false}
  approveLabel="Approve"
  rejectLabel="Deny"
  showAlwaysAllow
  onApprove={() => executeCommand()}
  onReject={() => cancelCommand()}
  onAlwaysAllow={() => alwaysAllowTool('run_terminal')}
/>`,
      props: [
        {
          name: 'request',
          type: 'ApprovalRequest',
          required: true,
          description: 'The request prop.',
        },
        {
          name: 'onApprove',
          type: '(id: string) => void',
          required: true,
          description: 'Handler called when the approve button is clicked.',
          commonlyUsed: true,
        },
        {
          name: 'onReject',
          type: '(id: string, reason?: string) => void',
          required: true,
          description:
            'Handler called when the reject button is clicked or the auto-reject countdown expires.',
          commonlyUsed: true,
        },
        {
          name: 'onModify',
          type: '(id: string, modification: string) => void',
          description: 'The onModify prop.',
        },
        {
          name: 'onSkip',
          type: '(id: string) => void',
          description: 'The onSkip prop.',
        },
        {
          name: 'showTimer',
          type: 'boolean',
          description: 'The showTimer prop.',
        },
        {
          name: 'allowModification',
          type: 'boolean',
          description: 'The allowModification prop.',
        },
        {
          name: 'className',
          type: 'string',
          description:
            'Additional CSS class names for the root motion container.',
        },
        {
          name: 'title',
          type: 'string',
          required: true,
          description: 'Title text displayed in the card header.',
          commonlyUsed: true,
        },
        {
          name: 'description',
          type: 'string',
          description:
            'Description text displayed below the title. Serves as the ARIA-describedby content.',
          commonlyUsed: true,
        },
        {
          name: 'intent',
          type: 'ApprovalCardIntent',
          default: '"default"',
          description:
            'Intent/severity which determines the icon and color scheme of the card.',
          commonlyUsed: true,
        },
        {
          name: 'size',
          type: 'ApprovalCardSize',
          default: '"md"',
          description: 'Size preset controlling overall card dimensions.',
        },
        {
          name: 'icon',
          type: 'React.ReactNode',
          description:
            'Custom icon to display. When omitted, a default icon is chosen based on the intent value.',
        },
        {
          name: 'details',
          type: 'ApprovalDetail[]',
          description:
            'Array of label/value detail pairs displayed in a collapsible section. Each detail has label (string), value (string | ReactNode), and optional isCode (boolean) for monospace formatting.',
        },
        {
          name: 'defaultDetailsExpanded',
          type: 'boolean',
          default: 'false',
          description: 'Whether the details section is expanded by default.',
        },
        {
          name: 'approveLabel',
          type: 'string',
          default: '"Approve"',
          description: 'Label text for the approve button.',
        },
        {
          name: 'rejectLabel',
          type: 'string',
          default: '"Reject"',
          description: 'Label text for the reject button.',
        },
        {
          name: 'autoRejectIn',
          type: 'number',
          description:
            'Auto-reject countdown in seconds. When set, a countdown bar is displayed and onReject is called automatically when it reaches zero.',
        },
        {
          name: 'showAlwaysAllow',
          type: 'boolean',
          default: 'false',
          description:
            'Show an "Always allow" button that permits the user to whitelist this tool type.',
        },
        {
          name: 'isApproving',
          type: 'boolean',
          default: 'false',
          description:
            'Whether the approve action is loading. Disables all buttons and shows a spinner on the approve button.',
        },
        {
          name: 'isRejecting',
          type: 'boolean',
          default: 'false',
          description:
            'Whether the reject action is loading. Disables all buttons and shows a spinner on the reject button.',
        },
        {
          name: 'onAlwaysAllow',
          type: '() => void',
          description:
            'Handler called when the "Always allow" button is clicked. Only shown when showAlwaysAllow is true.',
        },
      ],
      notes: [
        'The card uses role="alertdialog" with aria-labelledby and aria-describedby for accessibility.',
        'Details section uses framer-motion AnimatePresence for animated expand/collapse.',
        'Auto-reject countdown uses a framer-motion linear progress bar that animates from 100% to 0% width.',
        'Intent determines both the default icon (triangle warning for danger, circle exclamation for warning, circle info for info, checkmark for default) and the CSS color scheme.',
      ],
      sourceFile: 'components/clarity/human-in-loop.tsx',
    },
  ],

  // ===========================================================================
  // Confirmation
  // ===========================================================================
  Confirmation: {
    name: 'Confirmation',
    description:
      'A confirmation dialog/card for AI actions requiring user approval. Supports multiple visual variants, customizable actions, countdown timers, keyboard shortcuts, and loading states. Can be used standalone or via the ConfirmationProvider context.',
    importPath: '@clarity-chat/react',
    usageCode: `<Confirmation
  title="Delete file?"
  description="This action cannot be undone. The file will be permanently removed."
  variant="card"
  intent="destructive"
  confirmLabel="Delete"
  cancelLabel="Cancel"
  confirmVariant="destructive"
  dismissible
  showShortcuts
  onConfirm={() => handleDelete()}
  onCancel={() => handleCancel()}
/>`,
    props: [
      {
        name: 'title',
        type: 'string',
        required: true,
        description:
          'Title text displayed in the confirmation. Used as the aria-labelledby content.',
        commonlyUsed: true,
      },
      {
        name: 'description',
        type: 'string',
        description:
          'Description text displayed below the title. Used as the aria-describedby content.',
        commonlyUsed: true,
      },
      {
        name: 'variant',
        type: 'ConfirmationVariant',
        default: '"card"',
        description:
          'Visual layout variant. Card is the default boxed layout, inline removes the dismiss button, banner spans full width, and compact reduces spacing.',
        commonlyUsed: true,
      },
      {
        name: 'intent',
        type: 'ConfirmationIntent',
        default: '"default"',
        description:
          'Intent/severity controlling the icon and color scheme. Destructive shows a triangle warning, warning shows a circle exclamation, info shows a circle info.',
        commonlyUsed: true,
      },
      {
        name: 'icon',
        type: 'React.ReactNode',
        description:
          'Custom icon to display. Overrides the auto-selected icon based on intent.',
      },
      {
        name: 'confirmLabel',
        type: 'string',
        default: '"Confirm"',
        description: 'Label for the confirm/primary action button.',
        commonlyUsed: true,
      },
      {
        name: 'cancelLabel',
        type: 'string',
        default: '"Cancel"',
        description: 'Label for the cancel/secondary action button.',
      },
      {
        name: 'confirmVariant',
        type: "'primary' | 'destructive'",
        default: '"primary"',
        description:
          'Visual variant for the confirm button. Use "destructive" for delete/remove actions.',
        commonlyUsed: true,
      },
      {
        name: 'actions',
        type: 'ConfirmationAction[]',
        description:
          'Custom actions array that overrides the default confirm/cancel buttons. Each action has label, key, variant, isLoading, isDisabled, and shortcut fields.',
      },
      {
        name: 'isConfirmLoading',
        type: 'boolean',
        default: 'false',
        description:
          'Whether the confirm button shows a loading spinner and is disabled.',
      },
      {
        name: 'dismissible',
        type: 'boolean',
        default: 'true',
        description:
          'Whether the component can be dismissed. Shows an X close button (except for inline variant) and enables Escape key handling.',
      },
      {
        name: 'autoConfirmIn',
        type: 'number',
        description:
          'Auto-confirm countdown in seconds. Displays a countdown timer and progress bar, then calls onConfirm when it reaches zero.',
      },
      {
        name: 'autoDismissIn',
        type: 'number',
        description:
          'Auto-dismiss countdown in seconds. Displays a countdown timer and progress bar, then calls onDismiss when it reaches zero.',
      },
      {
        name: 'showShortcuts',
        type: 'boolean',
        default: 'false',
        description:
          'Show keyboard shortcut hints (Esc for cancel, Cmd+Enter for confirm) next to action buttons.',
      },
      {
        name: 'onConfirm',
        type: '() => void',
        description:
          'Handler called when the confirm action is triggered (button click, Cmd/Ctrl+Enter, or auto-confirm countdown).',
        commonlyUsed: true,
      },
      {
        name: 'onCancel',
        type: '() => void',
        description:
          'Handler called when the cancel action is triggered (button click or Escape key).',
        commonlyUsed: true,
      },
      {
        name: 'onAction',
        type: '(key: string) => void',
        description:
          'Handler for custom actions. Receives the action key string. Only used when the actions prop provides custom actions.',
      },
      {
        name: 'onDismiss',
        type: '() => void',
        description:
          'Handler called when the dismiss X button is clicked or auto-dismiss countdown expires. Falls back to onCancel if not provided.',
      },
      {
        name: 'className',
        type: 'string',
        description:
          'Additional CSS class names for the root motion container.',
      },
      {
        name: 'children',
        type: 'React.ReactNode',
        description:
          'Additional content rendered between the description and the countdown/actions area.',
      },
    ],
    notes: [
      'Uses role="alertdialog" with aria-labelledby and aria-describedby for screen reader accessibility.',
      'Keyboard shortcuts: Escape dismisses/cancels, Cmd/Ctrl+Enter confirms. Always active when mounted.',
      'The ConfirmationAction interface fields: label (string), key (string), variant? ("primary" | "secondary" | "destructive" | "ghost"), isLoading? (boolean), isDisabled? (boolean), shortcut? (string).',
      'Also exports ConfirmationProvider and useConfirmation hook for imperative confirm()/alert() calls that return Promises.',
      'Auto-confirm and auto-dismiss countdowns are mutually exclusive. The countdown bar animates linearly from 100% to 0%.',
    ],
    sourceFile: 'components/ai/Confirmation.tsx',
  },

  // ===========================================================================
  // Tool Registry
  // ===========================================================================
  'Tool Registry': {
    name: 'ToolRegistry',
    description:
      'Central registry class for managing tool definitions. Provides tool discovery, validation, search with fuzzy matching, category/tag organization, namespace support, and event notifications for changes. Not a React component but a core utility used by tool UI components.',
    importPath: '@clarity-chat/react',
    importName: 'ToolRegistry',
    usageCode: `import { ToolRegistry } from '@clarity-chat/react'

const registry = new ToolRegistry()

// Register tools
registry.register({
  name: 'web_search',
  description: 'Search the web for information',
  parameters: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'Search query',
      },
    },
    required: ['query'],
  },
  execute: async (args) => fetchSearchResults(args.query),
  category: 'search',
  tags: ['web', 'search'],
})

// Query tools
const allTools = registry.getAll()
const searchTools = registry.getByCategory('search')
const results = registry.search('web')

// Listen for changes
const unsubscribe = registry.on((event) => {
  console.log(\`Tool \${event.toolName} was \${event.type}\`)
})`,
    props: [
      {
        name: 'register',
        type: '(tool: ToolDefinition) => void',
        description:
          'Register a tool definition. Validates the definition and checks for name conflicts before adding.',
        commonlyUsed: true,
      },
      {
        name: 'registerOrUpdate',
        type: '(tool: ToolDefinition, options?: { silent?: boolean }) => void',
        description:
          'Register or update a tool. Allows overwriting an existing tool with a warning in development mode. Pass { silent: true } to suppress the warning.',
      },
      {
        name: 'registerMany',
        type: '(tools: ToolDefinition[]) => void',
        description:
          'Register multiple tools at once. Calls register() for each tool in order.',
      },
      {
        name: 'unregister',
        type: '(name: string) => boolean',
        description:
          'Unregister a tool by name. Returns true if the tool was found and removed, false otherwise.',
        commonlyUsed: true,
      },
      {
        name: 'get',
        type: '(name: string) => ToolDefinition | undefined',
        description:
          'Get a tool definition by exact name. Returns undefined if not found.',
        commonlyUsed: true,
      },
      {
        name: 'has',
        type: '(name: string) => boolean',
        description: 'Check if a tool with the given name is registered.',
      },
      {
        name: 'getAll',
        type: '() => ToolDefinition[]',
        description: 'Get all registered tool definitions as an array.',
        commonlyUsed: true,
      },
      {
        name: 'getByCategory',
        type: '(category: string) => ToolDefinition[]',
        description: 'Get all tools belonging to a specific category.',
        commonlyUsed: true,
      },
      {
        name: 'getByTag',
        type: '(tag: string) => ToolDefinition[]',
        description:
          'Get all tools that include a specific tag in their tags array.',
      },
      {
        name: 'search',
        type: '(query: string) => ToolDefinition[]',
        description:
          'Search tools by query with relevance-based scoring. Searches name, displayName, description, category, and tags. Results are sorted by score (highest first).',
        commonlyUsed: true,
      },
      {
        name: 'getCategories',
        type: '() => string[]',
        description:
          'Get all unique category names across registered tools, sorted alphabetically.',
      },
      {
        name: 'getTags',
        type: '() => string[]',
        description:
          'Get all unique tag names across registered tools, sorted alphabetically.',
      },
      {
        name: 'getStats',
        type: '() => { totalTools: number; byCategory: Record<string, number>; byTag: Record<string, number> }',
        description:
          'Get registry statistics including total tool count and breakdowns by category and tag.',
      },
      {
        name: 'on',
        type: '(listener: RegistryListener) => () => void',
        description:
          'Subscribe to registry events (registered, unregistered, cleared). Returns an unsubscribe function.',
      },
      {
        name: 'clear',
        type: '() => void',
        description:
          'Remove all registered tools and emit cleared events for each.',
      },
      {
        name: 'namespace',
        type: '(namespace: string) => NamespacedRegistry',
        description:
          'Create a namespaced view of the registry. The returned NamespacedRegistry automatically prefixes tool names with "namespace." and filters queries to only matching tools.',
      },
      {
        name: 'setMaxListeners',
        type: '(n: number) => void',
        description:
          'Set the maximum number of event listeners (default: 100). Set to 0 for unlimited. Throws an error when the limit is exceeded to prevent memory leaks.',
      },
      {
        name: 'getListenerCount',
        type: '() => number',
        description: 'Get the current number of registered event listeners.',
      },
    ],
    notes: [
      'ToolRegistry is a class, not a React component. Instantiate with new ToolRegistry() or use the exported globalToolRegistry singleton.',
      'Tool names must match /^[a-zA-Z_][a-zA-Z0-9_.]*$/ (alphanumeric with underscores and dots for namespacing).',
      'Search scoring: exact name match = 100, name contains = 50, displayName contains = 30, description contains = 20, category contains = 15, tag contains = 10.',
      'The NamespacedRegistry class automatically prefixes tool names with "namespace." and only returns tools within that namespace.',
      'Also exports createToolUIRegistry() for mapping tool names to React components that render custom tool result UIs.',
    ],
  },

  // ===========================================================================
  // Tool Metrics
  // ===========================================================================
  'Tool Metrics': {
    name: 'StatsDisplay',
    description:
      'A versatile statistics and metrics display component supporting multiple layouts (grid, inline, card, compact, minimal), trend indicators, animated value transitions, sparkline mini-charts, progress rings, and goal tracking. Ideal for tool performance dashboards.',
    importPath: '@clarity-chat/react',
    usageCode: `<StatsDisplay
  title="Tool Performance"
  stats={[
    {
      id: 'web_search',
      label: 'web_search',
      value: 156,
      unit: ' calls',
      trend: 'up',
      change: 12.5,
      sparkline: [120, 130, 125, 140, 150, 156],
    },
    {
      id: 'read_file',
      label: 'read_file',
      value: 423,
      unit: ' calls',
      trend: 'up',
      change: 8.3,
    },
    {
      id: 'write_code',
      label: 'write_code',
      value: 89,
      unit: ' calls',
      trend: 'neutral',
      change: 0.2,
    },
    {
      id: 'query_database',
      label: 'query_database',
      value: 67,
      unit: ' calls',
      trend: 'down',
      change: -3.1,
    },
  ]}
  variant="grid"
  size="md"
  columns={4}
  showTrend
  showChange
  showSparklines
  animateValues
  onStatClick={(stat) =>
    console.log('Clicked:', stat.label)
  }
/>`,
    props: [
      {
        name: 'stats',
        type: 'StatData[]',
        required: true,
        description:
          'Array of stat data objects to display. Each object can include id, label, value, previousValue, change, trend, goal, unit, icon, description, sparkline, color, and isLoading fields.',
        commonlyUsed: true,
      },
      {
        name: 'variant',
        type: 'StatsDisplayVariant',
        default: '"grid"',
        description:
          'Visual layout variant. Grid arranges stats in columns, inline displays them horizontally, card wraps each stat, compact reduces spacing, and minimal shows only value and label.',
        commonlyUsed: true,
      },
      {
        name: 'size',
        type: 'StatsDisplaySize',
        default: '"md"',
        description:
          'Size preset controlling text sizes, padding, and icon dimensions.',
      },
      {
        name: 'columns',
        type: '2 | 3 | 4',
        default: '3',
        description:
          'Number of columns for the grid variant. Adds a CSS class stats-display-cols-{n}.',
      },
      {
        name: 'showTrend',
        type: 'boolean',
        default: 'true',
        description:
          'Show trend direction indicators (up arrow, down arrow, or dash) next to stat values.',
        commonlyUsed: true,
      },
      {
        name: 'showChange',
        type: 'boolean',
        default: 'true',
        description:
          'Show the percentage change value next to the trend indicator.',
        commonlyUsed: true,
      },
      {
        name: 'showProgress',
        type: 'boolean',
        default: 'true',
        description:
          'Show progress bars or progress rings when a stat has a goal value set.',
      },
      {
        name: 'showSparklines',
        type: 'boolean',
        default: 'false',
        description:
          'Show sparkline mini-charts for stats that have a sparkline data array with 2+ points.',
        commonlyUsed: true,
      },
      {
        name: 'animateValues',
        type: 'boolean',
        default: 'true',
        description:
          'Animate numeric value changes with a smooth counting transition using ease-out cubic easing over 500ms.',
      },
      {
        name: 'title',
        type: 'string',
        description:
          'Title displayed above the stats grid. Also used as the aria-label for the region.',
        commonlyUsed: true,
      },
      {
        name: 'onStatClick',
        type: '(stat: StatData) => void',
        description:
          'Click handler for individual stat items. Makes stats interactive with button role and pointer cursor.',
      },
      {
        name: 'className',
        type: 'string',
        description:
          'Additional CSS class names for the root motion container.',
      },
    ],
    notes: [
      'StatData fields: id? (string), label (string, required), value (string | number, required), previousValue? (string | number), change? (number), trend? ("up" | "down" | "neutral"), goal? (number), unit? (string), icon? (ReactNode), description? (string), sparkline? (number[]), color? (string CSS value), isLoading? (boolean).',
      'When a stat has isLoading: true, a skeleton placeholder is rendered instead of the stat content.',
      'The card variant shows progress rings around icons when both showProgress and a goal are set. Other variants use horizontal progress bars.',
      'Sparklines are drawn as SVG polylines with animated path drawing via framer-motion.',
      'Also exports the useStatsDisplay hook for managing stat state with updateStat(), addStat(), removeStat(), getTotal(), and getAverage() methods.',
      'Values are formatted with toLocaleString() for number formatting and optional unit suffixes.',
    ],
    sourceFile: 'components/ai/StatsDisplay.tsx',
  },
}
