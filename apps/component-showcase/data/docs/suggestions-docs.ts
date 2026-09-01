import type { ComponentDoc } from '@/components/doc-panel'

export const suggestionsDocs: Record<string, ComponentDoc | ComponentDoc[]> = {
  'Follow-up Suggestions': {
    name: 'FollowUpSuggestions',
    description:
      'Displays contextual follow-up suggestion cards after an AI response. Supports grid and list layouts, animated entrances via Framer Motion springs, loading skeletons, confidence badges, keyword tags, and a customizable empty state.',
    importPath: '@clarity-chat/react',
    usageCode: `<FollowUpSuggestions
  suggestions={[
    {
      id: '1',
      title: 'Can you explain this in more detail?',
      description: 'Get a deeper explanation of the topic.',
      keywords: ['explain', 'detail'],
      confidence: 0.85,
    },
    {
      id: '2',
      title: 'Show me a code example',
      icon: <Code className="h-4 w-4" />,
      confidence: 0.72,
    },
  ]}
  onSelect={(suggestion) => sendMessage(suggestion.title)}
  layout="grid"
  title="Suggested follow-ups"
/>`,
    props: [
      {
        name: 'suggestions',
        type: 'FollowUpSuggestion[]',
        required: true,
        description:
          'Array of suggestion objects to display. Each object requires id and title; optionally includes description, keywords, icon, and confidence.',
        commonlyUsed: true,
      },
      {
        name: 'onSelect',
        type: '(suggestion: FollowUpSuggestion) => void',
        required: true,
        description: 'Callback invoked when a suggestion card is clicked.',
        commonlyUsed: true,
      },
      {
        name: 'title',
        type: 'string',
        default: '"Suggested follow-ups"',
        description: 'Heading text displayed at the top of the card.',
        commonlyUsed: true,
      },
      {
        name: 'subtitle',
        type: 'string',
        default:
          '"Keep the conversation moving with contextual prompts tailored to your last exchange."',
        description: 'Description text displayed under the heading.',
      },
      {
        name: 'layout',
        type: "'grid' | 'list'",
        default: '"grid"',
        description:
          'Layout style. "grid" renders a responsive two-column grid; "list" renders a single-column vertical stack.',
        commonlyUsed: true,
      },
      {
        name: 'isLoading',
        type: 'boolean',
        default: 'false',
        description:
          'When true, displays animated shimmer skeleton placeholders instead of suggestions.',
        commonlyUsed: true,
      },
      {
        name: 'loadingCount',
        type: 'number',
        default: '4',
        description:
          'Number of skeleton placeholder cards to render while loading.',
      },
      {
        name: 'emptyState',
        type: 'ReactNode',
        default: 'undefined',
        description:
          'Custom empty state content. When omitted and there are no suggestions, a default empty message is shown.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS class names for the root Card element.',
      },
    ],
    notes: [
      'Each FollowUpSuggestion requires id (string) and title (string). Optional fields: description (string), keywords (string[]), icon (ReactNode), and confidence (number 0-1).',
      'When a suggestion has a confidence value, a color-coded Badge is displayed: green for >= 0.75, yellow for >= 0.5, and grey otherwise.',
      'Keyword tags render as subtle Badges below the description.',
      'Cards animate in using Framer Motion springs with staggered delays.',
      'The component is wrapped in a Card with a lightbulb header icon and a count Badge showing the number of suggestions.',
    ],
  },

  'Prompt Suggestions': {
    name: 'PromptSuggestions',
    description:
      'Displays context-aware prompt suggestions organized by type and category. Supports chips, cards, and list layouts with animated transitions, category filtering, confidence sorting, and a companion usePromptSuggestions hook for generating suggestions from conversation history.',
    importPath: '@clarity-chat/react',
    usageCode: `<PromptSuggestions
  suggestions={[
    {
      id: '1',
      text: 'Help me write a function',
      label: 'Write Code',
      type: 'starter',
      icon: <Code className="h-4 w-4" />,
      category: 'Code',
    },
    {
      id: '2',
      text: 'Explain this concept',
      label: 'Explain',
      type: 'starter',
      category: 'Learning',
      confidence: 0.9,
    },
  ]}
  onSelect={(suggestion) => sendMessage(suggestion.text)}
  layout="chips"
  suggestionType="starter"
  showCategories
/>`,
    props: [
      {
        name: 'suggestions',
        type: 'PromptSuggestion[]',
        required: true,
        description:
          'Array of prompt suggestion objects. Each requires id, text, and type. Optionally includes label, description, icon, category, confidence, keywords, and usageCount.',
        commonlyUsed: true,
      },
      {
        name: 'onSelect',
        type: '(suggestion: PromptSuggestion) => void',
        required: true,
        description: 'Callback invoked when a suggestion is clicked.',
        commonlyUsed: true,
      },
      {
        name: 'messages',
        type: 'Message[]',
        default: '[]',
        description:
          'Current conversation messages for context-aware filtering and sorting.',
      },
      {
        name: 'suggestionType',
        type: "'starter' | 'follow-up' | 'quick-reply' | 'template'",
        default: '"starter"',
        description:
          'Type filter applied to the suggestions array. Only suggestions matching this type are displayed.',
        commonlyUsed: true,
      },
      {
        name: 'layout',
        type: "'chips' | 'cards' | 'list'",
        default: '"chips"',
        description:
          'Layout style. "chips" renders rounded pill buttons, "cards" renders rich Card components with icons, and "list" renders a compact vertical list.',
        commonlyUsed: true,
      },
      {
        name: 'isLoading',
        type: 'boolean',
        default: 'false',
        description:
          'When true, displays skeleton pill placeholders instead of suggestions.',
      },
      {
        name: 'maxSuggestions',
        type: 'number',
        default: '6',
        description:
          'Maximum number of suggestions displayed after filtering and sorting.',
        commonlyUsed: true,
      },
      {
        name: 'emptyState',
        type: 'ReactNode',
        default: 'undefined',
        description:
          'Custom content rendered when no suggestions match the current filters. When omitted, nothing is rendered.',
      },
      {
        name: 'showCategories',
        type: 'boolean',
        default: 'false',
        description:
          'When true, renders category filter buttons above the suggestions allowing users to filter by category.',
        commonlyUsed: true,
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS class names for the root container.',
      },
    ],
    notes: [
      'PromptSuggestion requires id (string), text (string), and type (PromptSuggestionType). Optional fields: label (string), description (string), icon (ReactNode), category (string), confidence (number 0-1), keywords (string[]), usageCount (number).',
      'When suggestionType is "follow-up", suggestions are sorted by confidence descending; otherwise they are sorted by usageCount descending.',
      'The companion hook usePromptSuggestions(messages, options?) generates context-aware suggestions from conversation history. It returns starter prompts for empty conversations and code-related follow-ups when the last message mentions code.',
      'Category filtering is managed internally. Selecting "All" resets the filter.',
      'Chips layout features gradient hover effects and spring entrance animations; cards layout includes icon scaling and arrow indicators on hover.',
    ],
  },

  'Quick Replies': [
    {
      name: 'QuickReplyBar',
      description:
        'A horizontal bar of quick reply pill buttons with an optional "show more" overflow button. Ideal for placing above or below the chat input to provide common response shortcuts.',
      importPath: '@clarity-chat/react',
      usageCode: `<QuickReplyBar
  replies={[
    { id: '1', title: 'Yes', content: 'Yes, please proceed.' },
    { id: '2', title: 'No', content: 'No, thank you.' },
    { id: '3', title: 'More info', content: 'Can you provide more details?' },
  ]}
  onSelect={(reply) => sendMessage(reply.content)}
  maxVisible={5}
  showMoreButton
/>`,
      props: [
        {
          name: 'replies',
          type: 'QuickReply[]',
          required: true,
          description:
            'Array of quick reply objects. Each requires id, title, and content. Optional fields: shortcut, category, isFavorite, usageCount, lastUsed.',
          commonlyUsed: true,
        },
        {
          name: 'onSelect',
          type: '(reply: QuickReply) => void',
          required: true,
          description: 'Callback invoked when a quick reply button is clicked.',
          commonlyUsed: true,
        },
        {
          name: 'maxVisible',
          type: 'number',
          default: '5',
          description:
            'Maximum number of reply buttons visible before the overflow button appears.',
          commonlyUsed: true,
        },
        {
          name: 'showMoreButton',
          type: 'boolean',
          default: 'true',
          description:
            'Whether to show a "+N more" button when replies exceed maxVisible.',
        },
        {
          name: 'onShowMore',
          type: '() => void',
          description:
            'Callback invoked when the "show more" button is clicked. Use to open a panel or dialog with the full list.',
        },
        {
          name: 'className',
          type: 'string',
          description:
            'Additional CSS class names for the root flex container.',
        },
      ],
      notes: [
        'QuickReply requires id (string), title (string), and content (string). Optional fields: shortcut (string), category (string), isFavorite (boolean), usageCount (number), lastUsed (Date).',
        'Each reply renders as a QuickReplyButton with rounded-full pill styling.',
        'The overflow button displays the count of hidden replies.',
      ],
    },
    {
      name: 'QuickRepliesPanel',
      description:
        'A full-featured panel for browsing, searching, and managing quick replies. Includes favorites, recent replies, category navigation, and optional edit/delete/favorite actions via dropdown menus.',
      importPath: '@clarity-chat/react',
      usageCode: `<QuickRepliesPanel
  replies={replies}
  categories={[
    { id: 'greetings', name: 'Greetings', replies: greetingReplies },
    { id: 'closings', name: 'Closings', replies: closingReplies },
  ]}
  onSelect={(reply) => sendMessage(reply.content)}
  onEdit={(reply) => openEditor(reply)}
  onDelete={(reply) => removeReply(reply.id)}
  onToggleFavorite={(reply) => toggleFav(reply.id)}
  searchable
/>`,
      props: [
        {
          name: 'replies',
          type: 'QuickReply[]',
          required: true,
          description:
            'Full array of quick replies displayed in the "All Replies" section and used for search.',
          commonlyUsed: true,
        },
        {
          name: 'categories',
          type: 'QuickReplyCategory[]',
          description:
            'Optional array of categories, each containing an id, name, and replies array. Enables category-based navigation.',
          commonlyUsed: true,
        },
        {
          name: 'onSelect',
          type: '(reply: QuickReply) => void',
          required: true,
          description: 'Callback invoked when a reply item is clicked.',
          commonlyUsed: true,
        },
        {
          name: 'onEdit',
          type: '(reply: QuickReply) => void',
          description:
            'Callback for the "Edit" action in the item dropdown menu. When provided, the edit option appears.',
        },
        {
          name: 'onDelete',
          type: '(reply: QuickReply) => void',
          description:
            'Callback for the "Delete" action in the item dropdown menu. When provided, the delete option appears.',
        },
        {
          name: 'onToggleFavorite',
          type: '(reply: QuickReply) => void',
          description:
            'Callback for toggling the favorite state. When provided, a star toggle appears in the dropdown.',
        },
        {
          name: 'searchable',
          type: 'boolean',
          default: 'true',
          description:
            'Show the search input at the top of the panel for filtering replies by title or content.',
          commonlyUsed: true,
        },
        {
          name: 'className',
          type: 'string',
          description:
            'Additional CSS class names for the root flex container.',
        },
      ],
      notes: [
        'The panel automatically groups replies into Favorites (isFavorite === true) and Recent (sorted by lastUsed) sections.',
        'Search filters replies by title and content (case-insensitive).',
        'Category navigation is togglable: clicking an active category deselects it and returns to the full list.',
        'The companion hook useQuickReplies(initialReplies) provides replies state plus addReply, updateReply, deleteReply, useReply, toggleFavorite, and setReplies helpers.',
        'QuickReplyTrigger wraps the panel in a Dialog, providing a button that opens the full panel as a modal.',
      ],
    },
    {
      name: 'QuickReplyButton',
      description:
        'A single rounded-pill quick reply button with configurable variant and size. Used internally by QuickReplyBar but can also be used standalone.',
      importPath: '@clarity-chat/react',
      usageCode: `<QuickReplyButton
  reply={{ id: '1', title: 'Yes', content: 'Yes, proceed.' }}
  onClick={(reply) => sendMessage(reply.content)}
  variant="outline"
  size="sm"
/>`,
      props: [
        {
          name: 'reply',
          type: 'QuickReply',
          required: true,
          description: 'The quick reply object to render.',
          commonlyUsed: true,
        },
        {
          name: 'onClick',
          type: '(reply: QuickReply) => void',
          required: true,
          description: 'Callback invoked when the button is clicked.',
          commonlyUsed: true,
        },
        {
          name: 'variant',
          type: "'default' | 'outline' | 'ghost'",
          default: '"outline"',
          description:
            'Visual variant controlling background, border, and hover styles.',
          commonlyUsed: true,
        },
        {
          name: 'size',
          type: "'sm' | 'md' | 'lg'",
          default: '"sm"',
          description: 'Size preset controlling padding and font size.',
        },
        {
          name: 'className',
          type: 'string',
          description: 'Additional CSS class names for the button element.',
        },
      ],
    },
  ],

  'Response Actions': {
    name: 'ResponseActions',
    description:
      'A toolbar of action buttons displayed on AI responses. Includes built-in copy, regenerate, like, and dislike actions with loading states, keyboard shortcuts, tooltips, and active/selected styling. Supports four layout variants and fully custom actions.',
    importPath: '@clarity-chat/react',
    usageCode: `<ResponseActions
  variant="inline"
  size="sm"
  onCopy={() => copyToClipboard(content)}
  onRegenerate={() => regenerateResponse()}
  onLike={() => sendFeedback('like')}
  onDislike={() => sendFeedback('dislike')}
  feedback={feedback}
  copied={copied}
  isRegenerating={isRegenerating}
/>`,
    props: [
      {
        name: 'variant',
        type: "'inline' | 'toolbar' | 'floating' | 'minimal'",
        default: '"inline"',
        description:
          'Visual layout variant. "inline" renders compact icon buttons; "toolbar" adds labels and shortcut hints; "floating" and "minimal" provide alternative positioning styles.',
        commonlyUsed: true,
      },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg'",
        default: '"sm"',
        description:
          'Size preset controlling button dimensions (sm: 24px, md: 32px, lg: 40px).',
        commonlyUsed: true,
      },
      {
        name: 'actions',
        type: 'ResponseAction[]',
        description:
          'Custom actions array that replaces all built-in actions. Each action requires id, label, and icon. Optional: tooltip, shortcut, isLoading, isDisabled, isActive, onClick.',
        commonlyUsed: true,
      },
      {
        name: 'showCopy',
        type: 'boolean',
        default: 'true',
        description: 'Show the built-in copy action button.',
        commonlyUsed: true,
      },
      {
        name: 'showRegenerate',
        type: 'boolean',
        default: 'true',
        description: 'Show the built-in regenerate action button.',
        commonlyUsed: true,
      },
      {
        name: 'showLike',
        type: 'boolean',
        default: 'true',
        description: 'Show the built-in like (thumbs up) action button.',
      },
      {
        name: 'showDislike',
        type: 'boolean',
        default: 'true',
        description: 'Show the built-in dislike (thumbs down) action button.',
      },
      {
        name: 'onCopy',
        type: '() => void',
        description:
          'Handler for the copy action. The copy button only appears when both showCopy is true and onCopy is provided.',
        commonlyUsed: true,
      },
      {
        name: 'onRegenerate',
        type: '() => void',
        description:
          'Handler for the regenerate action. The button only appears when both showRegenerate is true and onRegenerate is provided.',
        commonlyUsed: true,
      },
      {
        name: 'onLike',
        type: '() => void',
        description:
          'Handler for the like action. The button only appears when both showLike is true and onLike is provided.',
      },
      {
        name: 'onDislike',
        type: '() => void',
        description:
          'Handler for the dislike action. The button only appears when both showDislike is true and onDislike is provided.',
      },
      {
        name: 'feedback',
        type: "'like' | 'dislike' | null",
        description:
          'Current feedback state. Controls the filled/active styling of the like and dislike buttons.',
        commonlyUsed: true,
      },
      {
        name: 'copied',
        type: 'boolean',
        default: 'false',
        description:
          'Whether the copy action succeeded. When true, the copy icon is replaced with a check icon and the label reads "Copied!".',
      },
      {
        name: 'isRegenerating',
        type: 'boolean',
        default: 'false',
        description:
          'Whether a regeneration is in progress. When true, the regenerate button shows a spinning loader.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS class names for the root toolbar element.',
      },
    ],
    notes: [
      'The ResponseAction interface requires id (string), label (string), and icon (ReactNode). Optional fields: tooltip (string), shortcut (string), isLoading (boolean), isDisabled (boolean), isActive (boolean), onClick (() => void).',
      'When the actions prop is provided, all built-in actions (copy, regenerate, like, dislike) are replaced entirely.',
      'The toolbar uses role="toolbar" and aria-label="Response actions" for accessibility. Each button has an aria-label matching its label.',
      'The companion hook useResponseActions({ content, onRegenerate, onFeedback }) manages copied, feedback, and isRegenerating state automatically, returning handleCopy, handleRegenerate, handleLike, and handleDislike handlers.',
      'Buttons respect the useReducedMotion preference, disabling scale animations when the user prefers reduced motion.',
      'The "toolbar" variant shows labels and keyboard shortcut hints (e.g., Cmd+C, Cmd+R) alongside icons.',
    ],
  },

  'Suggestion Chips': [
    {
      name: 'SuggestionChips',
      description:
        'A flexible collection of selectable suggestion chip buttons supporting horizontal scrolling, vertical stacking, wrap, and grid layouts. Includes an expandable overflow mechanism and delegated rendering to individual SuggestionChip components.',
      importPath: '@clarity-chat/react',
      usageCode: `<SuggestionChips
  suggestions={[
    { id: 'react', label: 'React' },
    { id: 'ts', label: 'TypeScript', icon: <Code className="h-3.5 w-3.5" /> },
    { id: 'node', label: 'Node.js' },
    { id: 'python', label: 'Python' },
  ]}
  onSelect={(suggestion) => addTopic(suggestion.label)}
  variant="outline"
  size="md"
  layout="wrap"
  maxVisible={6}
/>`,
      props: [
        {
          name: 'suggestions',
          type: 'Suggestion[]',
          required: true,
          description:
            'Array of suggestion objects. Each requires id and label. Optional fields: prompt, icon, category, disabled.',
          commonlyUsed: true,
        },
        {
          name: 'onSelect',
          type: '(suggestion: Suggestion) => void',
          required: true,
          description: 'Callback invoked when a chip is clicked.',
          commonlyUsed: true,
        },
        {
          name: 'variant',
          type: "'default' | 'outline' | 'ghost' | 'pill'",
          default: '"outline"',
          description:
            'Visual variant passed to each SuggestionChip. "pill" renders a rounded-full border style.',
          commonlyUsed: true,
        },
        {
          name: 'size',
          type: "'sm' | 'md' | 'lg'",
          default: '"md"',
          description:
            'Size preset controlling chip height, padding, and font size (sm: h-7, md: h-8, lg: h-10).',
          commonlyUsed: true,
        },
        {
          name: 'layout',
          type: "'horizontal' | 'vertical' | 'wrap' | 'grid'",
          default: '"horizontal"',
          description:
            'Layout mode. "horizontal" uses a ScrollArea with horizontal overflow; "vertical" stacks chips in a column; "wrap" uses flex-wrap; "grid" uses a two-column grid.',
          commonlyUsed: true,
        },
        {
          name: 'showIcon',
          type: 'boolean',
          default: 'true',
          description:
            'Whether to show icons on each chip. When true, uses the suggestion icon or a default Sparkles icon.',
        },
        {
          name: 'showArrow',
          type: 'boolean',
          default: 'false',
          description:
            'Whether to show a trailing ArrowRight icon on each chip.',
        },
        {
          name: 'maxVisible',
          type: 'number',
          description:
            'Maximum number of chips to show before displaying a "+N more" expand button. When omitted, all suggestions are shown.',
          commonlyUsed: true,
        },
        {
          name: 'className',
          type: 'string',
          description: 'Additional CSS class names for the root container.',
        },
      ],
      notes: [
        'The Suggestion interface requires id (string) and label (string). Optional fields: prompt (string), icon (ReactNode), category (string), disabled (boolean).',
        'The "horizontal" layout wraps chips in a ScrollArea with a horizontal ScrollBar for overflow.',
        'When maxVisible is set, a "show more" button reveals all chips. The expand is one-way (no collapse back).',
        'Individual chips are rendered via SuggestionChip, which can also be used standalone for custom layouts.',
      ],
    },
    {
      name: 'SuggestionGroup',
      description:
        'Groups suggestions under a titled header with optional icon and collapsible behavior. Renders chips internally using SuggestionChips in "wrap" layout.',
      importPath: '@clarity-chat/react',
      usageCode: `<SuggestionGroup
  title="Code"
  icon={<Code className="h-4 w-4" />}
  suggestions={codeSuggestions}
  onSelect={(s) => sendMessage(s.prompt ?? s.label)}
  collapsible
  defaultCollapsed={false}
/>`,
      props: [
        {
          name: 'title',
          type: 'string',
          description: 'Header text for the group.',
          commonlyUsed: true,
        },
        {
          name: 'icon',
          type: 'ReactNode',
          description: 'Optional icon rendered before the title.',
        },
        {
          name: 'suggestions',
          type: 'Suggestion[]',
          required: true,
          description: 'Array of suggestion objects for this group.',
          commonlyUsed: true,
        },
        {
          name: 'onSelect',
          type: '(suggestion: Suggestion) => void',
          required: true,
          description: 'Callback invoked when a chip in the group is clicked.',
          commonlyUsed: true,
        },
        {
          name: 'collapsible',
          type: 'boolean',
          default: 'false',
          description:
            'When true, clicking the header toggles the visibility of the chips.',
          commonlyUsed: true,
        },
        {
          name: 'defaultCollapsed',
          type: 'boolean',
          default: 'false',
          description: 'Initial collapsed state when collapsible is true.',
        },
        {
          name: 'variant',
          type: "'default' | 'outline' | 'ghost' | 'pill'",
          default: '"outline"',
          description: 'Visual variant passed through to each chip.',
        },
        {
          name: 'className',
          type: 'string',
          description: 'Additional CSS class names for the root container.',
        },
      ],
      notes: [
        'The header renders as a button for accessibility when collapsible is true, with a rotating ArrowRight chevron indicator.',
        'Internally delegates to SuggestionChips with layout="wrap".',
      ],
    },
    {
      name: 'QuickActions',
      description:
        'Card-based or button-based suggestion grid for prominent action items. Supports "card", "button", and "minimal" variants with configurable column counts.',
      importPath: '@clarity-chat/react',
      usageCode: `<QuickActions
  actions={[
    { id: 'code', label: 'Coding Assistant', icon: <Code className="h-4 w-4" />, category: 'Specialized' },
    { id: 'writing', label: 'Writing Assistant', icon: <FileText className="h-4 w-4" />, category: 'Specialized' },
  ]}
  onSelect={(action) => startSession(action.id)}
  columns={2}
  variant="card"
/>`,
      props: [
        {
          name: 'actions',
          type: 'Suggestion[]',
          required: true,
          description: 'Array of action items to render in the grid.',
          commonlyUsed: true,
        },
        {
          name: 'onSelect',
          type: '(suggestion: Suggestion) => void',
          required: true,
          description:
            'Callback invoked when an action card or button is clicked.',
          commonlyUsed: true,
        },
        {
          name: 'columns',
          type: '1 | 2 | 3 | 4',
          default: '2',
          description: 'Number of grid columns.',
          commonlyUsed: true,
        },
        {
          name: 'variant',
          type: "'card' | 'button' | 'minimal'",
          default: '"card"',
          description:
            'Visual variant. "card" renders bordered cards with icons and descriptions; "button" renders outlined Button components; "minimal" renders compact inline text buttons.',
          commonlyUsed: true,
        },
        {
          name: 'className',
          type: 'string',
          description:
            'Additional CSS class names for the root grid container.',
        },
      ],
      notes: [
        'The "card" variant shows a prominent icon area, label, optional category subtitle, and a hover-reveal arrow indicator.',
        'The "button" variant uses the primitives Button component with an icon + label layout.',
        'The "minimal" variant renders lightweight inline buttons suitable for tight spaces.',
        'All variants support the disabled field on individual Suggestion objects.',
      ],
    },
  ],
}
