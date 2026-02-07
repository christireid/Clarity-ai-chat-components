import type { ComponentDoc } from '@/components/doc-panel'

export const aiReasoningDocs: Record<string, ComponentDoc | ComponentDoc[]> = {
  // ===========================================================================
  // Thinking Indicators
  // ===========================================================================
  'Thinking Indicators': [
    {
      name: 'ThinkingBar',
      description:
        'Shows AI processing status with an animated progress bar. Supports multiple status states (thinking, searching, generating, complete, error), three visual variants, and customizable messages. Fully accessible with ARIA live regions and respects reduced motion preferences.',
      importPath: '@clarity-chat/react',
      usageCode: `<ThinkingBar
  status="thinking"
  message="Analyzing your request..."
  progress={45}
  variant="default"
  estimatedTime={5}
  showDots
  onComplete={() => console.log('Done!')}
/>`,
      props: [
        {
          name: 'status',
          type: 'ThinkingBarStatus',
          required: true,
          description: 'Current processing status.',
          commonlyUsed: true,
        },
        {
          name: 'message',
          type: 'string',
          description:
            'Custom message to display. Overrides the default status message.',
          commonlyUsed: true,
        },
        {
          name: 'progress',
          type: 'number',
          description: 'Progress percentage (0-100).',
          commonlyUsed: true,
        },
        {
          name: 'variant',
          type: 'ThinkingBarVariant',
          default: '"default"',
          description: 'Visual variant of the component.',
          commonlyUsed: true,
        },
        {
          name: 'estimatedTime',
          type: 'number',
          description: 'Estimated time remaining in seconds.',
        },
        {
          name: 'className',
          type: 'string',
          description: 'Additional CSS classes for the root container.',
        },
        {
          name: 'progressClassName',
          type: 'string',
          description: 'Custom class for the progress bar track.',
        },
        {
          name: 'showDots',
          type: 'boolean',
          default: 'true',
          description: 'Whether to show animated dots after the message.',
        },
        {
          name: 'indeterminate',
          type: 'boolean',
          description:
            'Whether to animate the progress bar in indeterminate mode. Defaults to true when no progress is provided and the status is active.',
        },
        {
          name: 'onComplete',
          type: '() => void',
          description: 'Callback fired when the status reaches "complete".',
          commonlyUsed: true,
        },
        {
          name: 'aria-label',
          type: 'string',
          description:
            'Accessible label override. A descriptive label is auto-generated if omitted.',
        },
        {
          name: 'disableAnimations',
          type: 'boolean',
          default: 'false',
          description: 'Disable all animations.',
        },
        {
          name: 'icon',
          type: 'React.ReactNode',
          description:
            'Custom icon override replacing the default status icon.',
        },
      ],
      notes: [
        'Uses framer-motion for animations and respects the prefers-reduced-motion media query.',
        'The "minimal" variant renders a compact inline pill. The "detailed" variant includes a pulse ring, progress percentage, and estimated time.',
        'A companion useThinkingBar hook is available for convenient state management.',
      ],
      sourceFile: 'components/clarity/streaming.tsx',
    },
    {
      name: 'ThinkingPill',
      description:
        'Lightweight, pill-shaped thinking/loading indicator. Uses shimmer text with animated dots for a modern, polished look. A simpler alternative to ThinkingBar when you need a compact inline indicator without progress bars.',
      importPath: '@clarity-chat/react',
      usageCode: `<ThinkingPill
  message="Analyzing..."
  variant="default"
  size="md"
  showDots
  showShimmer
  onStop={() => cancelRequest()}
/>`,
      props: [
        {
          name: 'message',
          type: 'string',
          default: '"Thinking"',
          description: 'Custom message to display.',
          commonlyUsed: true,
        },
        {
          name: 'variant',
          type: 'ThinkingPillVariant',
          default: '"default"',
          description: 'Visual variant of the pill.',
          commonlyUsed: true,
        },
        {
          name: 'size',
          type: 'ThinkingPillSize',
          default: '"md"',
          description:
            'Size preset controlling padding, font size, and icon size.',
          commonlyUsed: true,
        },
        {
          name: 'showDots',
          type: 'boolean',
          default: 'true',
          description: 'Show animated dots after the message.',
        },
        {
          name: 'showShimmer',
          type: 'boolean',
          default: 'true',
          description: 'Show shimmer animation on the message text.',
        },
        {
          name: 'onStop',
          type: '() => void',
          description:
            'Callback for the stop/cancel button. When provided, a stop button is rendered.',
          commonlyUsed: true,
        },
        {
          name: 'className',
          type: 'string',
          description: 'Additional CSS class for the root element.',
        },
        {
          name: 'visible',
          type: 'boolean',
          default: 'true',
          description:
            'Whether the pill is visible. Animates in/out via AnimatePresence.',
          commonlyUsed: true,
        },
        {
          name: 'icon',
          type: 'React.ReactNode',
          description:
            'Custom icon to display. Defaults to an animated brain icon.',
        },
        {
          name: 'aria-label',
          type: 'string',
          description:
            'Accessible label. Auto-generated from the message if omitted.',
        },
        {
          name: 'disableAnimations',
          type: 'boolean',
          default: 'false',
          description: 'Disable all animations.',
        },
      ],
      notes: [
        'Uses CSS classes from globals.css: .thinking-bar, .thinking-bar-text, and .thinking-bar-stop for consistent styling.',
        'A companion useThinkingPill hook is available for managing visibility and message state with auto-hide support.',
        'The "glass" variant applies a glassmorphism effect. The "subtle" variant uses a lighter background.',
      ],
      sourceFile: 'components/ai/ThinkingPill.tsx',
    },
    {
      name: 'ThinkingIndicator',
      description:
        'Displays AI processing status with a pulsing icon, stage label, optional topic text, and progress bar. Supports multiple processing stages (thinking, researching, compiling, generating, finalizing) with distinct icons.',
      importPath: '@clarity-chat/react',
      usageCode: `<ThinkingIndicator
  status={{
    stage: 'thinking',
    topic: 'Analyzing code structure...',
    progress: 35,
    estimatedCompletion: new Date(Date.now() + 5000),
  }}
/>`,
      props: [
        {
          name: 'status',
          type: 'AIStatus',
          description:
            'AI status object containing stage, topic, progress (0-100), and estimatedCompletion (Date). Controls the icon, label, topic text, progress bar, and estimated time display.',
          commonlyUsed: true,
        },
        {
          name: 'className',
          type: 'string',
          description: 'Additional CSS classes for the root container.',
        },
      ],
      notes: [
        'The AIStatus type includes stage ("thinking" | "researching" | "compiling" | "generating" | "finalizing"), topic (string), progress (number), and estimatedCompletion (Date).',
        'Features a double pulse ring animation around the icon for active states.',
        'Respects the prefers-reduced-motion media query via useReducedMotion.',
        'Progress bar and estimated time are only rendered when their respective values are present in the status object.',
      ],
      sourceFile: 'components/clarity/thinking-indicator.tsx',
    },
  ],

  // ===========================================================================
  // Chain of Thought
  // ===========================================================================
  'Chain of Thought': {
    name: 'ChainOfThought',
    description:
      'Visualizes step-by-step AI reasoning with collapsible sections, progress indicators, and streaming support. Supports individual or bulk expand/collapse, status badges per step, retry for error steps, and full ARIA accessibility.',
    importPath: '@clarity-chat/react',
    usageCode: `<ChainOfThought
  steps={[
    {
      id: '1',
      title: 'Understanding the question',
      content:
        'Parsing user intent and extracting key concepts...',
      status: 'complete',
      duration: 300,
    },
    {
      id: '2',
      title: 'Searching knowledge base',
      content:
        'Querying relevant documentation and examples...',
      status: 'in-progress',
      progress: 60,
    },
    {
      id: '3',
      title: 'Generating response',
      content: 'Composing a comprehensive answer...',
      status: 'pending',
    },
  ]}
  title="Reasoning Process"
  subtitle="Analyzing your query"
  variant="default"
  showTimestamps={false}
  showStepNumbers
  showDuration
  showToggleAll
  expanded={false}
  onStepClick={(stepId) => console.log('Clicked:', stepId)}
/>`,
    props: [
      {
        name: 'steps',
        type: 'ThoughtStep[]',
        required: true,
        description:
          'Array of reasoning steps. Each step has id, title, content, status, and optional icon, timestamp, duration, progress, metadata, subSteps, and error fields.',
        commonlyUsed: true,
      },
      {
        name: 'title',
        type: 'string',
        description: 'Header title displayed above the steps.',
        commonlyUsed: true,
      },
      {
        name: 'showTimings',
        type: 'boolean',
        description: 'The showTimings prop.',
      },
      {
        name: 'showConfidence',
        type: 'boolean',
        description: 'The showConfidence prop.',
      },
      {
        name: 'expandedByDefault',
        type: 'boolean',
        description: 'The expandedByDefault prop.',
      },
      {
        name: 'variant',
        type: "'default' | 'compact' | 'detailed'",
        default: '"default"',
        description: 'Visual variant of the component.',
        commonlyUsed: true,
      },
      {
        name: 'className',
        type: 'string',
        description: 'Custom class name for the steps list container.',
      },
      {
        name: 'expanded',
        type: 'boolean',
        default: 'false',
        description: 'Whether all steps are expanded by default.',
        commonlyUsed: true,
      },
      {
        name: 'expandedSteps',
        type: 'string[]',
        description:
          'Controlled expanded step IDs. When provided, the component is in controlled mode.',
      },
      {
        name: 'onExpandedStepsChange',
        type: '(stepIds: string[]) => void',
        description:
          'Callback when expanded steps change. Used with expandedSteps for controlled mode.',
      },
      {
        name: 'onStepClick',
        type: '(stepId: string) => void',
        description: 'Callback when a step header is clicked.',
        commonlyUsed: true,
      },
      {
        name: 'onRetry',
        type: '(stepId: string) => void',
        description: 'Callback when retry is requested for an error step.',
      },
      {
        name: 'showTimestamps',
        type: 'boolean',
        default: 'false',
        description: 'Show timestamps on each step.',
      },
      {
        name: 'showStepNumbers',
        type: 'boolean',
        default: 'false',
        description: 'Show step numbers (1, 2, 3...) alongside step titles.',
      },
      {
        name: 'showDuration',
        type: 'boolean',
        default: 'true',
        description: 'Show duration for completed steps.',
      },
      {
        name: 'maxVisibleSteps',
        type: 'number',
        description:
          'Maximum visible steps before a "Show more" button appears. Undefined shows all.',
      },
      {
        name: 'subtitle',
        type: 'string',
        description: 'Header subtitle displayed below the title.',
      },
      {
        name: 'showToggleAll',
        type: 'boolean',
        default: 'true',
        description:
          'Show the "Expand all" / "Collapse all" toggle button in the header.',
      },
      {
        name: 'containerClassName',
        type: 'string',
        description: 'Custom class name for the outer container.',
      },
      {
        name: 'stepClassName',
        type: 'string',
        description: 'Custom class name applied to each step item.',
      },
      {
        name: 'animationSpeed',
        type: 'number',
        default: '1',
        description:
          'Animation duration multiplier (e.g. 0.5 for faster, 2 for slower).',
      },
      {
        name: 'disableAnimations',
        type: 'boolean',
        default: 'false',
        description: 'Disable all animations.',
      },
      {
        name: 'loading',
        type: 'boolean',
        default: 'false',
        description: 'When true, renders a skeleton loading state.',
      },
      {
        name: 'emptyMessage',
        type: 'string',
        default: '"No reasoning steps available"',
        description: 'Message shown when the steps array is empty.',
      },
      {
        name: 'aria-label',
        type: 'string',
        description:
          'Accessible label for the component region. Defaults to "AI Reasoning Chain".',
      },
    ],
    notes: [
      'ChainOfThoughtStep status values: "pending", "in-progress", "complete", "error", "skipped".',
      'Each step supports nested subSteps for hierarchical reasoning trees.',
      'A companion useChainOfThought hook provides addStep, updateStep, removeStep, clearSteps, and computed isProcessing / isComplete / completionPercentage values.',
      'The "compact" variant hides content and shows only titles. The "minimal" variant removes overall progress display.',
      'Supports controlled and uncontrolled expand modes via expandedSteps / onExpandedStepsChange.',
    ],
    sourceFile: 'components/clarity/chain-of-thought.tsx',
  },

  // ===========================================================================
  // Agent Panel
  // ===========================================================================
  'Agent Panel': {
    name: 'AgentPanel',
    description:
      'Unified agent execution view that displays plan steps, thinking, tool executions, and approvals. Auto-connects to AgentExecutionProvider when available. Supports slot-based composition with AgentPanel.Header, AgentPanel.Plan, AgentPanel.Thinking, AgentPanel.Tools, AgentPanel.Approvals, and AgentPanel.Footer sub-components.',
    importPath: '@clarity-chat/react',
    usageCode: `<AgentPanel
  variant="sidebar"
  connected
  showPlan
  showThinking
  showTools
  showApprovals
  title="Agent Execution"
  maxHeight="600px"
  onStepClick={(step) => console.log('Step:', step)}
  onToolClick={(tool) => console.log('Tool:', tool)}
  onApprove={(tool) => console.log('Approved:', tool)}
  onReject={(tool, reason) =>
    console.log('Rejected:', tool, reason)
  }
>
  <AgentPanel.Header>Custom Header</AgentPanel.Header>
  <AgentPanel.Footer>Custom Footer</AgentPanel.Footer>
</AgentPanel>`,
    props: [
      {
        name: 'children',
        type: 'React.ReactNode',
        description:
          'Slot components (AgentPanel.Header, AgentPanel.Plan, etc.) for customizing panel sections.',
      },
      {
        name: 'variant',
        type: 'AgentPanelVariant',
        default: '"sidebar"',
        description: 'Panel layout variant.',
        commonlyUsed: true,
      },
      {
        name: 'connected',
        type: 'boolean',
        default: 'true',
        description:
          'Auto-connect to AgentExecutionProvider. When true and a provider is present, the panel reads execution state from context.',
        commonlyUsed: true,
      },
      {
        name: 'sections',
        type: 'AgentPanelSection[]',
        default:
          "['header', 'status', 'plan', 'thinking', 'tools', 'approvals']",
        description:
          'Array of sections to show. AgentPanelSection is "header" | "status" | "plan" | "thinking" | "tools" | "approvals" | "timeline" | "footer".',
      },
      {
        name: 'showPlan',
        type: 'boolean',
        default: 'true',
        description: 'Show plan steps section.',
        commonlyUsed: true,
      },
      {
        name: 'showThinking',
        type: 'boolean',
        default: 'true',
        description: 'Show thinking steps section.',
        commonlyUsed: true,
      },
      {
        name: 'showTools',
        type: 'boolean',
        default: 'true',
        description: 'Show tool executions section.',
        commonlyUsed: true,
      },
      {
        name: 'showApprovals',
        type: 'boolean',
        default: 'true',
        description: 'Show approval cards section.',
      },
      {
        name: 'showTimeline',
        type: 'boolean',
        default: 'false',
        description: 'Show timeline section.',
      },
      {
        name: 'defaultCollapsed',
        type: 'boolean',
        default: 'false',
        description: 'Whether the panel starts collapsed.',
      },
      {
        name: 'collapsed',
        type: 'boolean',
        description: 'Controlled collapsed state.',
      },
      {
        name: 'onCollapsedChange',
        type: '(collapsed: boolean) => void',
        description: 'Callback when collapsed state changes.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Custom class name for the panel container.',
      },
      {
        name: 'style',
        type: 'React.CSSProperties',
        description: 'Custom inline styles for the panel container.',
      },
      {
        name: 'title',
        type: 'string',
        default: '"Agent Execution"',
        description: 'Title displayed in the panel header.',
      },
      {
        name: 'maxHeight',
        type: 'string | number',
        description: 'Maximum height for the scrollable content area.',
      },
      {
        name: 'onStepClick',
        type: '(step: PlanStep) => void',
        description: 'Callback when a plan step is clicked.',
        commonlyUsed: true,
      },
      {
        name: 'onToolClick',
        type: '(tool: ToolCall) => void',
        description: 'Callback when a tool card is clicked.',
      },
      {
        name: 'onApprove',
        type: '(tool: ToolCall) => void',
        description: 'Callback when a tool execution is approved.',
        commonlyUsed: true,
      },
      {
        name: 'onReject',
        type: '(tool: ToolCall, reason?: string) => void',
        description:
          'Callback when a tool execution is rejected, with an optional reason.',
        commonlyUsed: true,
      },
    ],
    notes: [
      'Slot-based composition: use AgentPanel.Header, AgentPanel.Plan, AgentPanel.Thinking, AgentPanel.Tools, AgentPanel.Approvals, and AgentPanel.Footer as children to override default section content.',
      'When connected=true and an AgentExecutionProvider is present, execution state (plan, thoughts, tools, approvals, progress, status) is read from context automatically.',
      'The sidebar variant animates between 320px (expanded) and 48px (collapsed) widths.',
      'PlanStep statuses: "pending" | "active" | "complete" | "skipped" | "failed". ToolCall statuses: "pending" | "waiting_approval" | "approved" | "rejected" | "executing" | "complete" | "error".',
      'A useConnectedAgentPanel hook is available for reading connected execution state outside the panel.',
    ],
    sourceFile: 'components/ai/AgentPanel.tsx',
  },

  // ===========================================================================
  // Thinking Blocks
  // ===========================================================================
  'Thinking Blocks': {
    name: 'ReasoningDisplay',
    description:
      'Collapsible reasoning block that shows AI thinking content with a toggle to show or hide the reasoning section. Displays a title and content in an expandable/collapsible container, useful for showing model reasoning or chain-of-thought output.',
    importPath: '@clarity-chat/react',
    usageCode: `<ReasoningDisplay
  title="Reasoning"
  content={\`Let me analyze this step by step:
1. First, I need to understand the user's requirements
2. The question involves React state management
3. I should provide a practical example
4. Include best practices and common pitfalls\`}
  isExpanded={true}
/>`,
    props: [
      {
        name: 'title',
        type: 'string',
        default: '"Reasoning"',
        description: 'Title displayed in the collapsible trigger header.',
        commonlyUsed: true,
      },
      {
        name: 'content',
        type: 'string',
        required: true,
        description:
          'The reasoning text content displayed when expanded. Rendered with whitespace preserved (pre-wrap).',
        commonlyUsed: true,
      },
      {
        name: 'isExpanded',
        type: 'boolean',
        default: 'false',
        description:
          'Initial expanded state. The component manages its own open/close state internally from this initial value.',
        commonlyUsed: true,
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS classes for the root container.',
      },
    ],
    notes: [
      'Uses the Collapsible, CollapsibleTrigger, and CollapsibleContent primitives from @clarity-chat/primitives.',
      'The header shows a Brain icon and chevron indicator that toggles between ChevronDown and ChevronRight.',
      'Content is rendered with whitespace-pre-wrap for preserving formatting in reasoning text.',
      'For step-by-step reasoning with progress tracking, use ChainOfThought instead.',
    ],
    sourceFile: 'components/clarity/streaming.tsx',
  },

  // ===========================================================================
  // Reasoning Tree
  // ===========================================================================
  'Reasoning Tree': [
    {
      name: 'ReasoningSummary',
      description:
        'Displays a model reasoning summary with an optional conclusion callout, confidence bar, and source count. Ideal for showing synthesized AI reasoning output with a visual conclusion highlight.',
      importPath: '@clarity-chat/react',
      usageCode: `<ReasoningSummary
  reasoning="The user is asking about React render optimization. I should cover three main approaches: useMemo for expensive calculations, useCallback for function memoization, and React.memo for component-level memoization."
  conclusion="Combine useMemo, useCallback, and React.memo strategically to minimize unnecessary re-renders."
  confidence={0.92}
  sources={[
    { title: 'React Docs', relevance: 0.95 },
    { title: 'Performance Guide', relevance: 0.88 },
  ]}
/>`,
      props: [
        {
          name: 'reasoning',
          type: 'string',
          required: true,
          description: 'The main reasoning text to display.',
          commonlyUsed: true,
        },
        {
          name: 'conclusion',
          type: 'string',
          description:
            'Optional conclusion text displayed in a highlighted callout box with a lightbulb icon.',
          commonlyUsed: true,
        },
        {
          name: 'confidence',
          type: 'number',
          description:
            'Confidence score between 0 and 1, displayed as a percentage with a progress bar.',
          commonlyUsed: true,
        },
        {
          name: 'sources',
          type: '{ title: string; relevance: number }[]',
          description:
            'Array of source references with title and relevance score. Displays a "Based on N sources" indicator.',
        },
        {
          name: 'className',
          type: 'string',
          description: 'Additional CSS classes for the root container.',
        },
      ],
      notes: [
        'The conclusion section renders in a green-tinted callout with a Lightbulb icon.',
        'The confidence bar is a visual indicator showing the model confidence percentage.',
        'This component is best used as a final output summary after a ChainOfThought process.',
      ],
      sourceFile: 'components/clarity/chain-of-thought.tsx',
    },
    {
      name: 'ModelReasoning',
      description:
        'Displays a step-by-step model reasoning process with status indicators (done, active, pending) and an optional result section. Each step shows a label and detail with a status icon.',
      importPath: '@clarity-chat/react',
      usageCode: `<ModelReasoning
  title="Reasoning"
  steps={[
    {
      label: 'Understanding context',
      detail: 'Parsed user query for key concepts',
      status: 'done',
    },
    {
      label: 'Analyzing requirements',
      detail: 'Identifying relevant React patterns',
      status: 'done',
    },
    {
      label: 'Generating response',
      detail: 'Composing answer with examples...',
      status: 'active',
    },
    {
      label: 'Formatting output',
      detail: 'Preparing final response',
      status: 'pending',
    },
  ]}
  result="Use React.memo, useMemo, and useCallback strategically."
/>`,
      props: [
        {
          name: 'title',
          type: 'string',
          default: '"Reasoning"',
          description: 'Title displayed at the top with a Brain icon.',
          commonlyUsed: true,
        },
        {
          name: 'steps',
          type: "{ label: string detail: string status: 'done' | 'active' | 'pending' }[]",
          required: true,
          description:
            'Array of reasoning steps. Each step includes a label, detail description, and status controlling the icon (checkmark, spinner, or circle).',
          commonlyUsed: true,
        },
        {
          name: 'result',
          type: 'string',
          description:
            'Optional result text displayed in a muted box at the bottom after all steps.',
          commonlyUsed: true,
        },
        {
          name: 'className',
          type: 'string',
          description: 'Additional CSS classes for the root container.',
        },
      ],
      notes: [
        'Status icons: "done" shows a green checkmark (CheckCircle2), "active" shows a spinning loader, "pending" shows an empty circle.',
        'This component is useful for real-time reasoning visualization where steps transition from pending to active to done.',
        'For a branching tree visualization, compose multiple ModelReasoning instances or use ReasoningSummary for the final synthesis.',
      ],
      sourceFile: 'components/clarity/chain-of-thought.tsx',
    },
  ],
}
