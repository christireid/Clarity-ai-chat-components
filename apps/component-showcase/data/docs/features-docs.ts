import type { ComponentDoc } from '@/components/doc-panel'

export const featuresDocs: Record<string, ComponentDoc | ComponentDoc[]> = {
  // ==========================================================================
  // CODE & DEV TAB
  // ==========================================================================

  'Code Diff Viewer': {
    name: 'CodeDiff',
    description:
      'Displays side-by-side or unified code diffs with syntax highlighting, line numbers, and added/removed indicators.',
    importPath: '@clarity-chat/react',
    importName: 'ClarityComponents',
    usageCode: `import { ClarityComponents } from '@clarity-chat/react'

<ClarityComponents.CodeDiff
  oldCode={oldSource}
  newCode={newSource}
  language="typescript"
  filename="MyComponent.tsx"
  showLineNumbers
  unified={false}
/>`,
    props: [
      {
        name: 'oldCode',
        type: 'string',
        description: 'Original source code for comparison.',
        commonlyUsed: true,
      },
      {
        name: 'newCode',
        type: 'string',
        description: 'Updated source code for comparison.',
        commonlyUsed: true,
      },
      {
        name: 'diff',
        type: 'DiffLine[]',
        description:
          'Pre-computed diff lines. If provided, oldCode/newCode are ignored.',
      },
      {
        name: 'language',
        type: 'string',
        description: 'Language for syntax highlighting.',
        commonlyUsed: true,
      },
      {
        name: 'filename',
        type: 'string',
        description: 'Filename displayed in the diff header.',
      },
      {
        name: 'showLineNumbers',
        type: 'boolean',
        default: 'true',
        description: 'Whether to show line numbers.',
      },
      {
        name: 'unified',
        type: 'boolean',
        default: 'false',
        description: 'Use unified diff view instead of side-by-side.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS classes.',
      },
    ],
  },

  'Test Runner': {
    name: 'TestResults',
    description:
      'Displays test execution results with pass/fail/running status, duration, and error details per test case.',
    importPath: '@clarity-chat/react',
    importName: 'ClarityComponents',
    usageCode: `import { ClarityComponents } from '@clarity-chat/react'

<ClarityComponents.TestResults
  data={testResultsData}
  onRunAll={() => runAllTests()}
  onRerunFailed={() => rerunFailed()}
  onRerunTest={(id) => rerunSingle(id)}
/>`,
    props: [
      {
        name: 'data',
        type: 'TestResultsData',
        required: true,
        description: 'Test results data including suites, cases, and summary.',
        commonlyUsed: true,
      },
      {
        name: 'onRunAll',
        type: '() => void',
        description: 'Callback to run all tests.',
        commonlyUsed: true,
      },
      {
        name: 'onRerunFailed',
        type: '() => void',
        description: 'Callback to rerun only failed tests.',
      },
      {
        name: 'onRerunTest',
        type: '(testId: string) => void',
        description: 'Callback to rerun a specific test.',
      },
      {
        name: 'onRerunSuite',
        type: '(suiteId: string) => void',
        description: 'Callback to rerun an entire test suite.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS classes.',
      },
    ],
  },

  'File Explorer': {
    name: 'FileTree',
    description:
      'Interactive file tree with expand/collapse, file type icons, and context actions for navigating project structures.',
    importPath: '@clarity-chat/react',
    importName: 'ClarityComponents',
    usageCode: `import { ClarityComponents } from '@clarity-chat/react'

<ClarityComponents.FileTree
  files={fileNodes}
  selectedFile="src/App.tsx"
  onSelect={(file) => openFile(file)}
  showActions
/>`,
    props: [
      {
        name: 'files',
        type: 'FileNode[]',
        required: true,
        description: 'Array of file/folder nodes forming the tree.',
        commonlyUsed: true,
      },
      {
        name: 'selectedFile',
        type: 'string',
        description: 'Path of the currently selected file.',
        commonlyUsed: true,
      },
      {
        name: 'onSelect',
        type: '(file: FileNode) => void',
        description: 'Callback when a file is selected.',
        commonlyUsed: true,
      },
      {
        name: 'onRename',
        type: '(file: FileNode, newName: string) => void',
        description: 'Callback for renaming a file.',
      },
      {
        name: 'onDelete',
        type: '(file: FileNode) => void',
        description: 'Callback for deleting a file.',
      },
      {
        name: 'onCopy',
        type: '(file: FileNode) => void',
        description: 'Callback for copying a file.',
      },
      {
        name: 'onPaste',
        type: '(targetDir: FileNode) => void',
        description: 'Callback for pasting into a directory.',
      },
      {
        name: 'onCreateFile',
        type: '(parentDir: FileNode) => void',
        description: 'Callback for creating a new file.',
      },
      {
        name: 'onCreateFolder',
        type: '(parentDir: FileNode) => void',
        description: 'Callback for creating a new folder.',
      },
      {
        name: 'showActions',
        type: 'boolean',
        default: 'false',
        description: 'Show context action buttons on hover.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS classes.',
      },
    ],
  },

  'Commit History': {
    name: 'CommitHistory',
    description:
      'Displays a timeline of git commits with hash, message, author, and timestamp information.',
    importPath: '@clarity-chat/react',
    importName: 'ClarityComponents',
    usageCode: `import { ClarityComponents } from '@clarity-chat/react'

<ClarityComponents.CommitHistory
  commits={[
    { hash: 'a3f2e1d', message: 'feat: Add chat', author: 'user', date: '2h ago' },
  ]}
/>`,
    props: [
      {
        name: 'commits',
        type: 'GitCommitData[]',
        required: true,
        description: 'Array of commit objects to display.',
        commonlyUsed: true,
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS classes.',
      },
    ],
  },

  'Code Sandbox': {
    name: 'Sandbox',
    description:
      'Live code editor with preview panel, run/reset controls, and output/error display.',
    importPath: '@clarity-chat/react',
    importName: 'ClarityComponents',
    usageCode: `import { ClarityComponents } from '@clarity-chat/react'

<ClarityComponents.Sandbox
  code={sourceCode}
  language="typescript"
  output={output}
  status="idle"
  showPreview
  onRun={() => executeCode()}
  onReset={() => resetCode()}
/>`,
    props: [
      {
        name: 'code',
        type: 'string',
        required: true,
        description: 'Source code to display in the editor.',
        commonlyUsed: true,
      },
      {
        name: 'title',
        type: 'string',
        default: '"Code Sandbox"',
        description: 'Title shown in the sandbox header.',
      },
      {
        name: 'language',
        type: 'string',
        description: 'Language for syntax highlighting.',
        commonlyUsed: true,
      },
      {
        name: 'output',
        type: 'string',
        description: 'Execution output text.',
        commonlyUsed: true,
      },
      {
        name: 'error',
        type: 'string',
        description: 'Error message from execution.',
      },
      {
        name: 'status',
        type: "'idle' | 'running' | 'success' | 'error'",
        default: '"idle"',
        description: 'Current execution status.',
        commonlyUsed: true,
      },
      {
        name: 'showPreview',
        type: 'boolean',
        default: 'false',
        description: 'Show a live preview panel.',
      },
      {
        name: 'previewUrl',
        type: 'string',
        description: 'URL for the preview iframe.',
      },
      {
        name: 'onRun',
        type: '() => void',
        description: 'Callback to execute the code.',
        commonlyUsed: true,
      },
      {
        name: 'onReset',
        type: '() => void',
        description: 'Callback to reset the sandbox.',
      },
      {
        name: 'collapsible',
        type: 'boolean',
        default: 'false',
        description: 'Allow collapsing the sandbox.',
      },
      {
        name: 'defaultOpen',
        type: 'boolean',
        description: 'Whether sandbox starts expanded.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS classes.',
      },
    ],
  },

  'Web Preview': {
    name: 'WebPreview',
    description:
      'Browser-style preview panel with viewport controls (mobile/tablet/desktop), navigation toolbar, and URL bar.',
    importPath: '@clarity-chat/react',
    importName: 'ClarityComponents',
    usageCode: `import { ClarityComponents } from '@clarity-chat/react'

<ClarityComponents.WebPreview
  url="https://example.com"
  title="Preview"
  defaultViewport="desktop"
  showToolbar
  allowNavigation
  onNavigate={(url) => console.log(url)}
/>`,
    props: [
      {
        name: 'url',
        type: 'string',
        description: 'URL to display in the preview iframe.',
        commonlyUsed: true,
      },
      {
        name: 'html',
        type: 'string',
        description: 'Raw HTML content to render instead of a URL.',
      },
      {
        name: 'title',
        type: 'string',
        description: 'Title shown in the browser chrome.',
      },
      {
        name: 'defaultViewport',
        type: "'mobile' | 'tablet' | 'desktop' | 'full'",
        default: '"desktop"',
        description: 'Initial viewport size.',
        commonlyUsed: true,
      },
      {
        name: 'showToolbar',
        type: 'boolean',
        default: 'true',
        description: 'Show the browser toolbar with viewport controls.',
      },
      {
        name: 'allowNavigation',
        type: 'boolean',
        default: 'false',
        description: 'Allow URL navigation within the preview.',
      },
      {
        name: 'onNavigate',
        type: '(url: string) => void',
        description: 'Callback when the user navigates to a new URL.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS classes.',
      },
    ],
  },

  // ==========================================================================
  // WORKFLOWS TAB
  // ==========================================================================

  'Human in the Loop': {
    name: 'ApprovalCard',
    description:
      'Human-in-the-loop approval components for requiring human confirmation on sensitive AI actions. Includes approval cards, dialogs, queues, and intervention buttons.',
    importPath: '@clarity-chat/react',
    importName: 'ClarityComponents',
    usageCode: `import { ClarityComponents } from '@clarity-chat/react'

<ClarityComponents.ApprovalCard
  request={approvalRequest}
  onApprove={(id) => approve(id)}
  onReject={(id, reason) => reject(id, reason)}
  showTimer
  allowModification
/>`,
    props: [
      {
        name: 'request',
        type: 'ApprovalRequest',
        required: true,
        description: 'The approval request object containing action details.',
        commonlyUsed: true,
      },
      {
        name: 'onApprove',
        type: '(id: string) => void',
        required: true,
        description: 'Callback when the action is approved.',
        commonlyUsed: true,
      },
      {
        name: 'onReject',
        type: '(id: string, reason?: string) => void',
        required: true,
        description: 'Callback when the action is rejected.',
        commonlyUsed: true,
      },
      {
        name: 'onModify',
        type: '(id: string, modification: string) => void',
        description: 'Callback for modifying an action before approval.',
      },
      {
        name: 'onSkip',
        type: '(id: string) => void',
        description: 'Callback to skip the approval.',
      },
      {
        name: 'showTimer',
        type: 'boolean',
        default: 'false',
        description: 'Show a countdown timer for the approval.',
      },
      {
        name: 'allowModification',
        type: 'boolean',
        default: 'false',
        description: 'Allow modifying the action before approving.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS classes.',
      },
    ],
  },

  'Task Orchestrator': {
    name: 'Queue',
    description:
      'Visualizes multi-step task execution with status indicators, progress tracking, and queue management.',
    importPath: '@clarity-chat/react',
    importName: 'ClarityComponents',
    usageCode: `import { ClarityComponents } from '@clarity-chat/react'

<ClarityComponents.Queue
  items={tasks}
  onCancel={(id) => cancelTask(id)}
  onRetry={(id) => retryTask(id)}
  onPrioritize={(id) => prioritize(id)}
/>`,
    props: [
      {
        name: 'items',
        type: 'QueueItem[]',
        required: true,
        description: 'Array of queued task items.',
        commonlyUsed: true,
      },
      {
        name: 'onCancel',
        type: '(id: string) => void',
        description: 'Callback to cancel a queued task.',
        commonlyUsed: true,
      },
      {
        name: 'onRetry',
        type: '(id: string) => void',
        description: 'Callback to retry a failed task.',
      },
      {
        name: 'onPrioritize',
        type: '(id: string) => void',
        description: 'Callback to prioritize a task.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS classes.',
      },
    ],
  },

  Artifacts: {
    name: 'Artifact',
    description:
      'Displays AI-generated outputs such as code, documents, or images with type indicators and action buttons.',
    importPath: '@clarity-chat/react',
    importName: 'ClarityComponents',
    usageCode: `import { ClarityComponents } from '@clarity-chat/react'

<ClarityComponents.Artifact
  type="code"
  title="Generated Component"
  content={generatedCode}
  language="tsx"
/>`,
    props: [
      {
        name: 'type',
        type: 'string',
        required: true,
        description: 'Type of artifact (code, document, image, etc.).',
        commonlyUsed: true,
      },
      {
        name: 'title',
        type: 'string',
        description: 'Title of the artifact.',
        commonlyUsed: true,
      },
      {
        name: 'content',
        type: 'string',
        description: 'Content of the artifact.',
        commonlyUsed: true,
      },
      {
        name: 'language',
        type: 'string',
        description: 'Language for code artifacts.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS classes.',
      },
    ],
  },

  'Chain of Thought': {
    name: 'ChainOfThought',
    description:
      'Visualizes AI reasoning steps with expandable detail, timing, confidence scores, and step type icons.',
    importPath: '@clarity-chat/react',
    importName: 'ClarityComponents',
    usageCode: `import { ClarityComponents } from '@clarity-chat/react'

<ClarityComponents.ChainOfThought
  steps={reasoningSteps}
  title="Reasoning Process"
  showTimings
  showConfidence
  variant="detailed"
  expandedByDefault
/>`,
    props: [
      {
        name: 'steps',
        type: 'ThoughtStep[]',
        required: true,
        description: 'Array of reasoning steps to display.',
        commonlyUsed: true,
      },
      {
        name: 'title',
        type: 'string',
        description: 'Title for the chain of thought display.',
      },
      {
        name: 'showTimings',
        type: 'boolean',
        default: 'false',
        description: 'Show duration for each step.',
        commonlyUsed: true,
      },
      {
        name: 'showConfidence',
        type: 'boolean',
        default: 'false',
        description: 'Show confidence scores for each step.',
      },
      {
        name: 'expandedByDefault',
        type: 'boolean',
        default: 'false',
        description: 'Start with all steps expanded.',
      },
      {
        name: 'variant',
        type: "'default' | 'compact' | 'detailed'",
        default: '"default"',
        description: 'Visual variant controlling detail level.',
        commonlyUsed: true,
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS classes.',
      },
    ],
  },

  Bookmarks: {
    name: 'BookmarkManager',
    description:
      'Full bookmark management with folders, tags, search, and CRUD operations for saving important content.',
    importPath: '@clarity-chat/react',
    importName: 'ClarityComponents',
    usageCode: `import { ClarityComponents } from '@clarity-chat/react'

<ClarityComponents.BookmarkManager
  bookmarks={bookmarks}
  folders={folders}
  onAddBookmark={(bm) => addBookmark(bm)}
  onDeleteBookmark={(id) => deleteBookmark(id)}
  onEditBookmark={(id, data) => editBookmark(id, data)}
  onAddFolder={(f) => addFolder(f)}
  onDeleteFolder={(id) => deleteFolder(id)}
/>`,
    props: [
      {
        name: 'bookmarks',
        type: 'BookmarkItem[]',
        required: true,
        description: 'Array of bookmark items.',
        commonlyUsed: true,
      },
      {
        name: 'folders',
        type: 'BookmarkFolder[]',
        required: true,
        description: 'Array of bookmark folders.',
        commonlyUsed: true,
      },
      {
        name: 'onAddBookmark',
        type: '(bookmark: Omit<BookmarkItem, "id" | "createdAt">) => void',
        required: true,
        description: 'Callback to add a new bookmark.',
        commonlyUsed: true,
      },
      {
        name: 'onDeleteBookmark',
        type: '(id: string) => void',
        required: true,
        description: 'Callback to delete a bookmark.',
      },
      {
        name: 'onEditBookmark',
        type: '(id: string, data: Partial<BookmarkItem>) => void',
        required: true,
        description: 'Callback to edit a bookmark.',
      },
      {
        name: 'onAddFolder',
        type: '(folder: Omit<BookmarkFolder, "id">) => void',
        required: true,
        description: 'Callback to create a folder.',
      },
      {
        name: 'onDeleteFolder',
        type: '(id: string) => void',
        required: true,
        description: 'Callback to delete a folder.',
      },
      {
        name: 'onSelectBookmark',
        type: '(bookmark: BookmarkItem) => void',
        description: 'Callback when a bookmark is selected.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS classes.',
      },
    ],
  },

  // ==========================================================================
  // DATA & FORMS TAB
  // ==========================================================================

  'Data Table': {
    name: 'DataTable',
    description:
      'Generic data table with sorting, filtering, pagination, and row selection. Supports custom column renderers.',
    importPath: '@clarity-chat/react',
    importName: 'ClarityComponents',
    usageCode: `import { ClarityComponents } from '@clarity-chat/react'

<ClarityComponents.DataTable
  data={rows}
  columns={columnDefs}
  onRowClick={(row) => selectRow(row)}
/>`,
    props: [
      {
        name: 'data',
        type: 'T[]',
        required: true,
        description: 'Array of data objects to display.',
        commonlyUsed: true,
      },
      {
        name: 'columns',
        type: 'ColumnDef<T>[]',
        required: true,
        description:
          'Column definitions with header, accessor, and render functions.',
        commonlyUsed: true,
      },
      {
        name: 'onRowClick',
        type: '(row: T) => void',
        description: 'Callback when a row is clicked.',
        commonlyUsed: true,
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS classes.',
      },
    ],
  },

  'Dynamic Form': {
    name: 'DynamicForm',
    description:
      'Generates form fields dynamically from a JSON schema. Supports text, number, select, checkbox, textarea, and more.',
    importPath: '@clarity-chat/react',
    importName: 'ClarityComponents',
    usageCode: `import { ClarityComponents } from '@clarity-chat/react'

<ClarityComponents.DynamicForm
  schema={formSchema}
  defaultValues={{ name: 'Default' }}
  onSubmit={(values) => handleSubmit(values)}
  onCancel={() => handleCancel()}
/>`,
    props: [
      {
        name: 'schema',
        type: 'FormSchema',
        required: true,
        description: 'JSON schema defining form fields.',
        commonlyUsed: true,
      },
      {
        name: 'defaultValues',
        type: 'Record<string, any>',
        description: 'Default values for form fields.',
      },
      {
        name: 'onSubmit',
        type: '(values: Record<string, any>) => void',
        required: true,
        description: 'Callback with form values on submission.',
        commonlyUsed: true,
      },
      {
        name: 'onCancel',
        type: '() => void',
        description: 'Callback when the form is cancelled.',
      },
      {
        name: 'loading',
        type: 'boolean',
        default: 'false',
        description: 'Show loading state on submit button.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS classes.',
      },
    ],
  },

  'Cost Tracker': {
    name: 'CostSummaryCard',
    description:
      'Monitors API usage costs with budget progress, cost trends, and detailed breakdown by model.',
    importPath: '@clarity-chat/react',
    importName: 'ClarityComponents',
    usageCode: `import { ClarityComponents } from '@clarity-chat/react'

<ClarityComponents.CostSummaryCard
  summary={costSummary}
  budget={{ limit: 100, period: 'monthly' }}
/>`,
    props: [
      {
        name: 'summary',
        type: 'CostSummary',
        required: true,
        description: 'Cost summary data including totals and breakdowns.',
        commonlyUsed: true,
      },
      {
        name: 'budget',
        type: 'BudgetConfig',
        description: 'Budget configuration with limit and period.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS classes.',
      },
    ],
  },

  'Environment Variables': {
    name: 'EnvVariablesManager',
    description:
      'Manages environment variables and configuration secrets with add, edit, delete, import, and export functionality. Values are masked by default.',
    importPath: '@clarity-chat/react',
    importName: 'ClarityComponents',
    usageCode: `import { ClarityComponents } from '@clarity-chat/react'

<ClarityComponents.EnvVariablesManager
  variables={envVars}
  onAdd={(v) => addVariable(v)}
  onEdit={(id, v) => editVariable(id, v)}
  onDelete={(id) => deleteVariable(id)}
/>`,
    props: [
      {
        name: 'variables',
        type: 'EnvVariable[]',
        required: true,
        description: 'Array of environment variable objects.',
        commonlyUsed: true,
      },
      {
        name: 'onAdd',
        type: '(variable: ...) => void',
        description: 'Callback to add a new variable.',
        commonlyUsed: true,
      },
      {
        name: 'onEdit',
        type: '(id: string, variable: ...) => void',
        description: 'Callback to edit a variable.',
      },
      {
        name: 'onDelete',
        type: '(id: string) => void',
        description: 'Callback to delete a variable.',
      },
      {
        name: 'onImport',
        type: '(variables: Array<{ key: string; value: string }>) => void',
        description: 'Callback to import variables from a file.',
      },
      {
        name: 'onExport',
        type: '() => void',
        description: 'Callback to export variables.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS classes.',
      },
    ],
  },

  'Citation Chips': {
    name: 'CitationChip',
    description:
      'Inline source reference chips with numbered indices, hover previews, and link-out to source URLs.',
    importPath: '@clarity-chat/react',
    importName: 'ClarityComponents',
    usageCode: `import { ClarityComponents } from '@clarity-chat/react'

<ClarityComponents.CitationChip
  index={1}
  title="React Documentation"
  url="https://react.dev"
  variant="default"
/>`,
    props: [
      {
        name: 'citation',
        type: 'Citation',
        description:
          'Full citation object. If provided, title/url are taken from it.',
      },
      {
        name: 'index',
        type: 'number',
        required: true,
        description: 'Citation number displayed in the chip.',
        commonlyUsed: true,
      },
      {
        name: 'title',
        type: 'string',
        description: 'Source title text.',
        commonlyUsed: true,
      },
      {
        name: 'url',
        type: 'string',
        description: 'Source URL for linking.',
        commonlyUsed: true,
      },
      {
        name: 'variant',
        type: "'default' | 'compact' | 'inline'",
        default: '"default"',
        description: 'Visual style variant.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS classes.',
      },
    ],
  },

  // ==========================================================================
  // UI PATTERNS TAB
  // ==========================================================================

  'Confirmation Dialogs': {
    name: 'ConfirmationDialog',
    description:
      'Modal confirmation dialog with configurable variant (default, destructive, warning), custom labels, and async confirm support.',
    importPath: '@clarity-chat/react',
    importName: 'ClarityComponents',
    usageCode: `import { ClarityComponents } from '@clarity-chat/react'

<ClarityComponents.ConfirmationDialog
  open={isOpen}
  onOpenChange={setIsOpen}
  title="Delete conversation?"
  description="This action cannot be undone."
  variant="destructive"
  onConfirm={() => deleteConversation()}
/>`,
    props: [
      {
        name: 'open',
        type: 'boolean',
        required: true,
        description: 'Whether the dialog is open.',
        commonlyUsed: true,
      },
      {
        name: 'onOpenChange',
        type: '(open: boolean) => void',
        required: true,
        description: 'Callback when open state changes.',
        commonlyUsed: true,
      },
      {
        name: 'title',
        type: 'string',
        required: true,
        description: 'Dialog title text.',
        commonlyUsed: true,
      },
      {
        name: 'description',
        type: 'string',
        description: 'Dialog description text.',
      },
      {
        name: 'variant',
        type: 'DialogVariant',
        default: '"default"',
        description: 'Visual variant (default, destructive, warning).',
        commonlyUsed: true,
      },
      {
        name: 'confirmLabel',
        type: 'string',
        default: '"Confirm"',
        description: 'Text for the confirm button.',
      },
      {
        name: 'cancelLabel',
        type: 'string',
        default: '"Cancel"',
        description: 'Text for the cancel button.',
      },
      {
        name: 'onConfirm',
        type: '() => void | Promise<void>',
        required: true,
        description: 'Callback when confirmed. Supports async.',
        commonlyUsed: true,
      },
      {
        name: 'onCancel',
        type: '() => void',
        description: 'Callback when cancelled.',
      },
      {
        name: 'loading',
        type: 'boolean',
        default: 'false',
        description: 'Show loading state on confirm button.',
      },
      {
        name: 'children',
        type: 'React.ReactNode',
        description: 'Custom dialog body content.',
      },
    ],
  },

  'Component Cards': {
    name: 'ComponentCards',
    description:
      'Demo-only component (not exported from library). Displays information cards about UI components with previews and metadata.',
    importPath: '@clarity-chat/react',
    usageCode: `// Demo-only showcase component.
// Build custom component cards using Card from @clarity-chat/primitives.
import { Card, CardHeader, CardTitle, CardContent } from '@clarity-chat/primitives'

<Card>
  <CardHeader><CardTitle>Component Name</CardTitle></CardHeader>
  <CardContent>{/* Component preview */}</CardContent>
</Card>`,
    props: [],
  },

  'Empty States': {
    name: 'EmptyState',
    description:
      'Graceful empty content display with configurable icon, title, description, and call-to-action buttons.',
    importPath: '@clarity-chat/react',
    importName: 'ClarityComponents',
    usageCode: `import { ClarityComponents } from '@clarity-chat/react'

<ClarityComponents.EmptyState
  variant="no-data"
  title="No conversations yet"
  description="Start a new conversation to get going."
  action={{ label: 'New Chat', onClick: () => createChat() }}
/>`,
    props: [
      {
        name: 'variant',
        type: 'EmptyStateVariant',
        description: 'Preset variant for common empty states.',
        commonlyUsed: true,
      },
      {
        name: 'icon',
        type: 'React.ReactNode',
        description: 'Custom icon to display.',
      },
      {
        name: 'title',
        type: 'string',
        required: true,
        description: 'Heading text.',
        commonlyUsed: true,
      },
      {
        name: 'description',
        type: 'string',
        description: 'Supporting description text.',
        commonlyUsed: true,
      },
      {
        name: 'action',
        type: '{ label: string; onClick: () => void; variant?: string }',
        description: 'Primary action button configuration.',
        commonlyUsed: true,
      },
      {
        name: 'secondaryAction',
        type: '{ label: string; onClick: () => void }',
        description: 'Secondary action button.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS classes.',
      },
    ],
  },

  'Suggestion Chips': {
    name: 'SuggestionChips',
    description:
      'Quick-action suggestion buttons in various layouts (horizontal, vertical, grid, wrap) with icon and arrow support.',
    importPath: '@clarity-chat/react',
    importName: 'ClarityComponents',
    usageCode: `import { ClarityComponents } from '@clarity-chat/react'

<ClarityComponents.SuggestionChips
  suggestions={suggestions}
  onSelect={(s) => handleSelect(s)}
  variant="pill"
  layout="wrap"
  showIcon
  maxVisible={6}
/>`,
    props: [
      {
        name: 'suggestions',
        type: 'Suggestion[]',
        required: true,
        description: 'Array of suggestion objects.',
        commonlyUsed: true,
      },
      {
        name: 'onSelect',
        type: '(suggestion: Suggestion) => void',
        required: true,
        description: 'Callback when a suggestion is selected.',
        commonlyUsed: true,
      },
      {
        name: 'variant',
        type: "'default' | 'outline' | 'ghost' | 'pill'",
        default: '"default"',
        description: 'Visual style variant.',
        commonlyUsed: true,
      },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg'",
        default: '"md"',
        description: 'Size of the chips.',
      },
      {
        name: 'layout',
        type: "'horizontal' | 'vertical' | 'wrap' | 'grid'",
        default: '"horizontal"',
        description: 'Layout arrangement.',
      },
      {
        name: 'showIcon',
        type: 'boolean',
        default: 'false',
        description: 'Show icons on chips.',
      },
      {
        name: 'showArrow',
        type: 'boolean',
        default: 'false',
        description: 'Show arrow indicator on chips.',
      },
      {
        name: 'maxVisible',
        type: 'number',
        description: 'Maximum number of visible chips before truncation.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS classes.',
      },
    ],
  },

  'Snippet Manager': {
    name: 'SnippetManager',
    description:
      'Save, organize, search, and reuse code snippets with favorites, import/export, and tag support.',
    importPath: '@clarity-chat/react',
    importName: 'ClarityComponents',
    usageCode: `import { ClarityComponents } from '@clarity-chat/react'

<ClarityComponents.SnippetManager
  snippets={snippets}
  onAdd={(s) => addSnippet(s)}
  onUse={(s) => insertSnippet(s)}
  onToggleFavorite={(id) => toggleFav(id)}
/>`,
    props: [
      {
        name: 'snippets',
        type: 'Snippet[]',
        required: true,
        description: 'Array of saved snippets.',
        commonlyUsed: true,
      },
      {
        name: 'onAdd',
        type: '(snippet: ...) => void',
        description: 'Callback to add a new snippet.',
        commonlyUsed: true,
      },
      {
        name: 'onEdit',
        type: '(id: string, snippet: Partial<Snippet>) => void',
        description: 'Callback to edit a snippet.',
      },
      {
        name: 'onDelete',
        type: '(id: string) => void',
        description: 'Callback to delete a snippet.',
      },
      {
        name: 'onUse',
        type: '(snippet: Snippet) => void',
        description: 'Callback when a snippet is used/inserted.',
        commonlyUsed: true,
      },
      {
        name: 'onToggleFavorite',
        type: '(id: string) => void',
        description: 'Toggle snippet favorite status.',
      },
      {
        name: 'onExport',
        type: '() => void',
        description: 'Callback to export all snippets.',
      },
      {
        name: 'onImport',
        type: '(snippets: Snippet[]) => void',
        description: 'Callback to import snippets.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS classes.',
      },
    ],
  },

  'Schema Display': {
    name: 'SchemaDisplay',
    description:
      'Visualizes data structures (JSON Schema, TypeScript, GraphQL) with expandable tree, type indicators, and copy support.',
    importPath: '@clarity-chat/react',
    importName: 'ClarityComponents',
    usageCode: `import { ClarityComponents } from '@clarity-chat/react'

<ClarityComponents.SchemaDisplay
  schema={jsonSchema}
  title="User Schema"
  format="json-schema"
  expandLevel={2}
  showCopyButton
/>`,
    props: [
      {
        name: 'schema',
        type: 'Record<string, unknown>',
        required: true,
        description: 'Schema object to display.',
        commonlyUsed: true,
      },
      {
        name: 'title',
        type: 'string',
        description: 'Title for the schema display.',
      },
      {
        name: 'description',
        type: 'string',
        description: 'Description text below the title.',
      },
      {
        name: 'format',
        type: "'json-schema' | 'typescript' | 'graphql'",
        default: '"json-schema"',
        description: 'Schema format for rendering.',
        commonlyUsed: true,
      },
      {
        name: 'expandLevel',
        type: 'number',
        default: '1',
        description: 'Number of levels to expand by default.',
      },
      {
        name: 'showCopyButton',
        type: 'boolean',
        default: 'false',
        description: 'Show a button to copy the schema.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS classes.',
      },
    ],
  },

  'Stats Display': {
    name: 'StatCard',
    description:
      'Key metrics display cards with value, change indicator, trend sparkline, and optional icon.',
    importPath: '@clarity-chat/react',
    importName: 'ClarityComponents',
    usageCode: `import { ClarityComponents } from '@clarity-chat/react'

<ClarityComponents.StatCard
  title="Total Messages"
  value={1234}
  change={{ value: 12, type: 'increase', period: 'vs last week' }}
  trend={[10, 15, 12, 20, 18, 25]}
/>`,
    props: [
      {
        name: 'title',
        type: 'string',
        required: true,
        description: 'Metric label.',
        commonlyUsed: true,
      },
      {
        name: 'value',
        type: 'string | number',
        required: true,
        description: 'Metric value.',
        commonlyUsed: true,
      },
      {
        name: 'change',
        type: '{ value: number; type: "increase" | "decrease" | "neutral"; period?: string }',
        description: 'Change indicator.',
        commonlyUsed: true,
      },
      {
        name: 'icon',
        type: 'React.ReactNode',
        description: 'Icon displayed beside the metric.',
      },
      {
        name: 'description',
        type: 'string',
        description: 'Additional descriptive text.',
      },
      {
        name: 'trend',
        type: 'number[]',
        description: 'Sparkline data points.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS classes.',
      },
    ],
  },

  'Before/After Comparison': {
    name: 'BeforeAfterComparison',
    description:
      'Demo-only component (not exported from library). Side-by-side or slider-based content comparison for showing changes.',
    importPath: '@clarity-chat/react',
    usageCode: `// Demo-only showcase component.
// Build comparisons using Card and grid layouts from @clarity-chat/primitives.
<div className="grid grid-cols-2 gap-4">
  <Card>Before</Card>
  <Card>After</Card>
</div>`,
    props: [],
  },

  'Link Preview': {
    name: 'LinkPreview',
    description:
      'URL preview cards with favicon, title, description, and thumbnail extracted from Open Graph metadata.',
    importPath: '@clarity-chat/react',
    importName: 'ClarityComponents',
    usageCode: `import { ClarityComponents } from '@clarity-chat/react'

<ClarityComponents.LinkPreview
  url="https://github.com/example/repo"
  title="Example Repo"
  description="A great open source project"
/>`,
    props: [
      {
        name: 'url',
        type: 'string',
        required: true,
        description: 'URL to preview.',
        commonlyUsed: true,
      },
      {
        name: 'title',
        type: 'string',
        description: 'Title text override.',
        commonlyUsed: true,
      },
      {
        name: 'description',
        type: 'string',
        description: 'Description text override.',
      },
      { name: 'image', type: 'string', description: 'Preview image URL.' },
      { name: 'favicon', type: 'string', description: 'Favicon URL.' },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS classes.',
      },
    ],
  },

  'Context Menu': {
    name: 'ContextMenu',
    description:
      'Demo-only component (not exported from library). Right-click context menus with keyboard navigation and nested submenus.',
    importPath: '@clarity-chat/react',
    usageCode: `// Demo-only showcase. Build context menus using primitives.
<div onContextMenu={(e) => { e.preventDefault(); showMenu(e) }}>
  Right-click for options
</div>`,
    props: [],
  },

  'Model Selector': {
    name: 'ModelSelector',
    description:
      'AI model selection dropdown with provider info, capability badges, and model descriptions.',
    importPath: '@clarity-chat/react',
    importName: 'ClarityComponents',
    usageCode: `import { ClarityComponents } from '@clarity-chat/react'

<ClarityComponents.ModelSelector
  models={availableModels}
  selectedModel={currentModel}
  onSelect={(model) => setModel(model)}
  showCapabilities
/>`,
    props: [
      {
        name: 'models',
        type: 'Model[]',
        description:
          'Array of available models. Uses built-in defaults if not provided.',
        commonlyUsed: true,
      },
      {
        name: 'selectedModel',
        type: 'Model | null',
        description: 'Currently selected model.',
        commonlyUsed: true,
      },
      {
        name: 'onSelect',
        type: '(model: Model) => void',
        description: 'Callback when a model is selected.',
        commonlyUsed: true,
      },
      {
        name: 'compact',
        type: 'boolean',
        default: 'false',
        description: 'Use compact display mode.',
      },
      {
        name: 'showCapabilities',
        type: 'boolean',
        default: 'false',
        description: 'Show model capability badges.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS classes.',
      },
    ],
  },

  'Keyboard Shortcuts': {
    name: 'HotkeyHelpDialog',
    description:
      'Keyboard shortcut display and help dialog showing available shortcuts grouped by category.',
    importPath: '@clarity-chat/react',
    importName: 'ClarityComponents',
    usageCode: `import { ClarityComponents } from '@clarity-chat/react'

<ClarityComponents.HotkeyHelpDialog
  open={showShortcuts}
  onOpenChange={setShowShortcuts}
/>`,
    props: [
      {
        name: 'open',
        type: 'boolean',
        required: true,
        description: 'Whether the dialog is open.',
        commonlyUsed: true,
      },
      {
        name: 'onOpenChange',
        type: '(open: boolean) => void',
        required: true,
        description: 'Callback when open state changes.',
        commonlyUsed: true,
      },
    ],
    notes: [
      'Use the useKeyboardShortcuts hook from @clarity-chat/react for registering shortcuts.',
    ],
  },

  // ==========================================================================
  // REALTIME & STATUS TAB
  // ==========================================================================

  'Progress Indicators': {
    name: 'ProgressIndicators',
    description:
      'Demo-only component (not exported from library). Various progress indicator patterns including bars, spinners, and percentage displays.',
    importPath: '@clarity-chat/react',
    usageCode: `// Use Steps or status components for progress tracking.
import { ClarityComponents } from '@clarity-chat/react'

<ClarityComponents.Steps steps={progressSteps} current={2} />`,
    props: [],
  },

  'Steps Indicator': {
    name: 'Steps',
    description:
      'Multi-step workflow progress indicator with step labels, status icons, and connecting lines.',
    importPath: '@clarity-chat/react',
    importName: 'ClarityComponents',
    usageCode: `import { ClarityComponents } from '@clarity-chat/react'

<ClarityComponents.Steps
  steps={[
    { label: 'Upload', status: 'complete' },
    { label: 'Process', status: 'current' },
    { label: 'Review', status: 'upcoming' },
  ]}
  current={1}
/>`,
    props: [
      {
        name: 'steps',
        type: 'StepItem[]',
        required: true,
        description: 'Array of step definitions.',
        commonlyUsed: true,
      },
      {
        name: 'current',
        type: 'number',
        description: 'Index of the current step.',
        commonlyUsed: true,
      },
      {
        name: 'variant',
        type: "'default' | 'compact' | 'vertical'",
        default: '"default"',
        description: 'Layout variant.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS classes.',
      },
    ],
  },

  'Realtime Status': {
    name: 'StatusBadge',
    description:
      'Live status indicators with animated dots, connection state badges, and server health displays.',
    importPath: '@clarity-chat/react',
    importName: 'ClarityComponents',
    usageCode: `import { ClarityComponents } from '@clarity-chat/react'

<ClarityComponents.StatusBadge status="online" label="Connected" pulse />`,
    props: [
      {
        name: 'status',
        type: 'string',
        required: true,
        description: 'Status value determining color and icon.',
        commonlyUsed: true,
      },
      {
        name: 'label',
        type: 'string',
        description: 'Text label for the badge.',
        commonlyUsed: true,
      },
      {
        name: 'pulse',
        type: 'boolean',
        default: 'false',
        description: 'Show animated pulse effect.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS classes.',
      },
    ],
  },

  'Task Queue': {
    name: 'Queue',
    description:
      'Queued job management display with status indicators, progress bars, and cancel/retry actions.',
    importPath: '@clarity-chat/react',
    importName: 'ClarityComponents',
    usageCode: `import { ClarityComponents } from '@clarity-chat/react'

<ClarityComponents.Queue
  items={queuedJobs}
  onCancel={(id) => cancelJob(id)}
  onRetry={(id) => retryJob(id)}
/>`,
    props: [
      {
        name: 'items',
        type: 'QueueItem[]',
        required: true,
        description: 'Array of queue items.',
        commonlyUsed: true,
      },
      {
        name: 'onCancel',
        type: '(id: string) => void',
        description: 'Callback to cancel a queued item.',
        commonlyUsed: true,
      },
      {
        name: 'onRetry',
        type: '(id: string) => void',
        description: 'Callback to retry a failed item.',
      },
      {
        name: 'onPrioritize',
        type: '(id: string) => void',
        description: 'Callback to change item priority.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS classes.',
      },
    ],
  },

  'Conversation Threads': {
    name: 'ThreadList',
    description:
      'Threaded discussion view with nested replies, timestamps, and user avatars.',
    importPath: '@clarity-chat/react',
    importName: 'ClarityComponents',
    usageCode: `import { ClarityComponents } from '@clarity-chat/react'

<ClarityComponents.ThreadList
  threads={threads}
  onSelect={(thread) => openThread(thread)}
  onDelete={(id) => deleteThread(id)}
/>`,
    props: [
      {
        name: 'threads',
        type: 'Thread[]',
        required: true,
        description: 'Array of conversation threads.',
        commonlyUsed: true,
      },
      {
        name: 'onSelect',
        type: '(thread: Thread) => void',
        description: 'Callback when a thread is selected.',
        commonlyUsed: true,
      },
      {
        name: 'onDelete',
        type: '(id: string) => void',
        description: 'Callback to delete a thread.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS classes.',
      },
    ],
  },

  'Safety Components': {
    name: 'ModerationBadge',
    description:
      'Content safety and moderation components including moderation badges, PII detection, fact-checking, and hallucination indicators.',
    importPath: '@clarity-chat/react',
    importName: 'ClarityComponents',
    usageCode: `import { ClarityComponents } from '@clarity-chat/react'

<ClarityComponents.ModerationBadge level="warning" label="Content flagged" />`,
    props: [
      {
        name: 'level',
        type: 'string',
        required: true,
        description: 'Moderation severity level.',
        commonlyUsed: true,
      },
      {
        name: 'label',
        type: 'string',
        description: 'Badge label text.',
        commonlyUsed: true,
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS classes.',
      },
    ],
    notes: [
      'Also exports PIIDetectionDisplay, FactCheckDisplay, and HallucinationIndicator.',
    ],
  },

  'Retry Logic': {
    name: 'RetryIndicator',
    description:
      'Retry logic UI with attempt counters, auto-retry countdowns, offline queue management, and send-with-retry patterns.',
    importPath: '@clarity-chat/react',
    importName: 'ClarityComponents',
    usageCode: `import { ClarityComponents } from '@clarity-chat/react'

<ClarityComponents.RetryIndicator
  attempt={2}
  maxAttempts={5}
  status="retrying"
  nextRetryIn={3000}
/>`,
    props: [
      {
        name: 'attempt',
        type: 'number',
        required: true,
        description: 'Current retry attempt number.',
        commonlyUsed: true,
      },
      {
        name: 'maxAttempts',
        type: 'number',
        description: 'Maximum number of retry attempts.',
      },
      {
        name: 'status',
        type: 'string',
        required: true,
        description: 'Current retry status.',
        commonlyUsed: true,
      },
      {
        name: 'nextRetryIn',
        type: 'number',
        description: 'Milliseconds until next retry attempt.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS classes.',
      },
    ],
  },

  // ==========================================================================
  // VOICE & MEDIA TAB
  // ==========================================================================

  'Voice Components': {
    name: 'SpeechInput',
    description:
      'Audio input and playback components including speech recognition, text-to-speech, and transcription display.',
    importPath: '@clarity-chat/react',
    importName: 'ClarityComponents',
    usageCode: `import { ClarityComponents } from '@clarity-chat/react'

<ClarityComponents.SpeechInput
  onTranscript={(text) => handleTranscript(text)}
  language="en-US"
  continuous
/>`,
    props: [
      {
        name: 'onTranscript',
        type: '(text: string) => void',
        required: true,
        description: 'Callback with recognized speech text.',
        commonlyUsed: true,
      },
      {
        name: 'language',
        type: 'string',
        default: '"en-US"',
        description: 'Speech recognition language.',
        commonlyUsed: true,
      },
      {
        name: 'continuous',
        type: 'boolean',
        default: 'false',
        description: 'Keep listening after each utterance.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS classes.',
      },
    ],
    notes: [
      'Also exports VoiceSelector, TranscriptionDisplay, TextToSpeech, and AudioTranscriber.',
    ],
  },

  'Rich Embed': {
    name: 'URLPreview',
    description:
      'Rich media embed cards for URLs, tweets, GitHub repos, YouTube videos, and Spotify tracks.',
    importPath: '@clarity-chat/react',
    importName: 'ClarityComponents',
    usageCode: `import { ClarityComponents } from '@clarity-chat/react'

<ClarityComponents.URLPreview
  url="https://github.com/example/repo"
  title="Example Repo"
  description="An awesome project"
/>`,
    props: [
      {
        name: 'url',
        type: 'string',
        required: true,
        description: 'URL to preview.',
        commonlyUsed: true,
      },
      { name: 'title', type: 'string', description: 'Title override.' },
      {
        name: 'description',
        type: 'string',
        description: 'Description override.',
      },
      { name: 'image', type: 'string', description: 'Preview image URL.' },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS classes.',
      },
    ],
    notes: [
      'Also exports TweetEmbed, GitHubRepoEmbed, YouTubeEmbed, and SpotifyEmbed.',
    ],
  },

  'Message Actions': {
    name: 'MessageActionsBar',
    description:
      'Quick action toolbar for messages with copy, edit, delete, regenerate, and custom actions.',
    importPath: '@clarity-chat/react',
    importName: 'ClarityComponents',
    usageCode: `import { ClarityComponents } from '@clarity-chat/react'

<ClarityComponents.MessageActionsBar
  messageId="msg-1"
  onCopy={() => copyMessage()}
  onEdit={() => editMessage()}
  onDelete={() => deleteMessage()}
/>`,
    props: [
      {
        name: 'messageId',
        type: 'string',
        required: true,
        description: 'ID of the associated message.',
        commonlyUsed: true,
      },
      {
        name: 'onCopy',
        type: '() => void',
        description: 'Callback to copy message content.',
        commonlyUsed: true,
      },
      {
        name: 'onEdit',
        type: '() => void',
        description: 'Callback to edit the message.',
        commonlyUsed: true,
      },
      {
        name: 'onDelete',
        type: '() => void',
        description: 'Callback to delete the message.',
      },
      {
        name: 'onRegenerate',
        type: '() => void',
        description: 'Callback to regenerate the response.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS classes.',
      },
    ],
  },

  'Read Receipts': {
    name: 'MessageStatusIndicator',
    description:
      'Message delivery status indicators showing sent, delivered, and read states with user avatars.',
    importPath: '@clarity-chat/react',
    importName: 'ClarityComponents',
    usageCode: `import { ClarityComponents } from '@clarity-chat/react'

<ClarityComponents.MessageStatusIndicator status="read" timestamp="2 min ago" />`,
    props: [
      {
        name: 'status',
        type: "'sent' | 'delivered' | 'read' | 'failed'",
        required: true,
        description: 'Current delivery status.',
        commonlyUsed: true,
      },
      {
        name: 'timestamp',
        type: 'string',
        description: 'Timestamp for the status.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS classes.',
      },
    ],
    notes: [
      'Also exports ReadReceiptAvatars, ReadReceiptList, TypingStatus, and OnlineStatusIndicator.',
    ],
  },

  'RAG Sources': {
    name: 'RetrievalResults',
    description:
      'Displays retrieved document references from RAG with relevance scores, chunk previews, and source metadata.',
    importPath: '@clarity-chat/react',
    importName: 'ClarityComponents',
    usageCode: `import { ClarityComponents } from '@clarity-chat/react'

<ClarityComponents.RetrievalResults
  results={retrievedDocuments}
  onSourceClick={(doc) => openSource(doc)}
/>`,
    props: [
      {
        name: 'results',
        type: 'RetrievalResult[]',
        required: true,
        description: 'Array of retrieved document results.',
        commonlyUsed: true,
      },
      {
        name: 'onSourceClick',
        type: '(result: RetrievalResult) => void',
        description: 'Callback when a source is clicked.',
        commonlyUsed: true,
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS classes.',
      },
    ],
    notes: [
      'Also exports ChunkDisplay, EmbeddingVisualizer, KnowledgeBaseList, and RelevanceScore.',
    ],
  },

  Calendar: {
    name: 'DatePicker',
    description:
      'Date picker component with calendar grid, month/year navigation, and date range selection support.',
    importPath: '@clarity-chat/react',
    importName: 'ClarityComponents',
    usageCode: `import { ClarityComponents } from '@clarity-chat/react'

<ClarityComponents.DatePicker
  value={selectedDate}
  onChange={(date) => setSelectedDate(date)}
/>`,
    props: [
      {
        name: 'value',
        type: 'Date',
        description: 'Currently selected date.',
        commonlyUsed: true,
      },
      {
        name: 'onChange',
        type: '(date: Date) => void',
        description: 'Callback when date selection changes.',
        commonlyUsed: true,
      },
      {
        name: 'minDate',
        type: 'Date',
        description: 'Earliest selectable date.',
      },
      { name: 'maxDate', type: 'Date', description: 'Latest selectable date.' },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS classes.',
      },
    ],
  },

  // ==========================================================================
  // AUTH & SETTINGS TAB
  // ==========================================================================

  'Login Form': {
    name: 'LoginForm',
    description:
      'Authentication form with email/password fields, social login buttons (Google, GitHub, Apple), and forgot password link.',
    importPath: '@clarity-chat/react',
    importName: 'ClarityComponents',
    usageCode: `import { ClarityComponents } from '@clarity-chat/react'

<ClarityComponents.LoginForm
  onSubmit={(email, password) => login(email, password)}
  onSocialLogin={(provider) => socialLogin(provider)}
  onForgotPassword={() => showResetFlow()}
/>`,
    props: [
      {
        name: 'onSubmit',
        type: '(email: string, password: string) => void',
        description: 'Callback with credentials on submission.',
        commonlyUsed: true,
      },
      {
        name: 'onForgotPassword',
        type: '() => void',
        description: 'Callback for forgot password link.',
      },
      {
        name: 'onSignUp',
        type: '() => void',
        description: 'Callback for sign-up link.',
      },
      {
        name: 'onSocialLogin',
        type: "(provider: 'google' | 'github' | 'apple') => void",
        description: 'Callback for social login buttons.',
        commonlyUsed: true,
      },
      {
        name: 'isLoading',
        type: 'boolean',
        default: 'false',
        description: 'Show loading state on submit.',
      },
      {
        name: 'error',
        type: 'string',
        description: 'Error message to display.',
      },
    ],
  },

  'Settings Panel': {
    name: 'SettingsPanel',
    description:
      'Configuration panel with categorized settings sections and toggle controls.',
    importPath: '@clarity-chat/react',
    importName: 'ClarityComponents',
    usageCode: `import { ClarityComponents } from '@clarity-chat/react'

<ClarityComponents.SettingsPanel
  open={showSettings}
  onClose={() => setShowSettings(false)}
/>`,
    props: [
      {
        name: 'open',
        type: 'boolean',
        required: true,
        description: 'Whether the settings panel is visible.',
        commonlyUsed: true,
      },
      {
        name: 'onClose',
        type: '() => void',
        required: true,
        description: 'Callback to close the panel.',
        commonlyUsed: true,
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS classes.',
      },
    ],
  },

  'Model Presets': {
    name: 'PresetSelector',
    description:
      'Quick configuration preset selection with save, duplicate, star, and delete actions.',
    importPath: '@clarity-chat/react',
    importName: 'ClarityComponents',
    usageCode: `import { ClarityComponents } from '@clarity-chat/react'

<ClarityComponents.PresetSelector
  presets={presets}
  selectedId={activePresetId}
  onSelect={(preset) => applyPreset(preset)}
  variant="dropdown"
/>`,
    props: [
      {
        name: 'presets',
        type: 'Preset[]',
        required: true,
        description: 'Array of available presets.',
        commonlyUsed: true,
      },
      {
        name: 'selectedId',
        type: 'string',
        description: 'ID of the currently selected preset.',
        commonlyUsed: true,
      },
      {
        name: 'onSelect',
        type: '(preset: Preset) => void',
        required: true,
        description: 'Callback when a preset is selected.',
        commonlyUsed: true,
      },
      {
        name: 'onSave',
        type: '(preset: Omit<Preset, "id">) => void',
        description: 'Save current settings as a preset.',
      },
      {
        name: 'onDelete',
        type: '(id: string) => void',
        description: 'Delete a preset.',
      },
      {
        name: 'onDuplicate',
        type: '(preset: Preset) => void',
        description: 'Duplicate a preset.',
      },
      {
        name: 'onStar',
        type: '(id: string) => void',
        description: 'Star/favorite a preset.',
      },
      {
        name: 'variant',
        type: "'dropdown' | 'button' | 'minimal'",
        default: '"dropdown"',
        description: 'Display variant.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS classes.',
      },
    ],
  },

  'MCP Manager': {
    name: 'MCPManager',
    description:
      'Model Context Protocol server management with add, remove, toggle, and refresh controls.',
    importPath: '@clarity-chat/react',
    importName: 'ClarityComponents',
    usageCode: `import { ClarityComponents } from '@clarity-chat/react'

<ClarityComponents.MCPManager
  servers={mcpServers}
  onAddServer={(url, name) => addServer(url, name)}
  onRemoveServer={(id) => removeServer(id)}
  onToggleServer={(id, enabled) => toggleServer(id, enabled)}
  onRefreshServer={(id) => refreshServer(id)}
/>`,
    props: [
      {
        name: 'servers',
        type: 'MCPServer[]',
        required: true,
        description: 'Array of MCP server configurations.',
        commonlyUsed: true,
      },
      {
        name: 'onAddServer',
        type: '(url: string, name: string) => void',
        required: true,
        description: 'Callback to add a new MCP server.',
        commonlyUsed: true,
      },
      {
        name: 'onRemoveServer',
        type: '(id: string) => void',
        required: true,
        description: 'Callback to remove a server.',
      },
      {
        name: 'onToggleServer',
        type: '(id: string, enabled: boolean) => void',
        required: true,
        description: 'Enable/disable a server.',
        commonlyUsed: true,
      },
      {
        name: 'onRefreshServer',
        type: '(id: string) => void',
        required: true,
        description: 'Refresh server connection.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS classes.',
      },
    ],
  },

  'Password Input': {
    name: 'PasswordStrengthIndicator',
    description:
      'Secure password entry with strength meter, requirement checklist, and visual indicator bars.',
    importPath: '@clarity-chat/react',
    importName: 'ClarityComponents',
    usageCode: `import { ClarityComponents } from '@clarity-chat/react'

<ClarityComponents.PasswordStrengthIndicator strength={passwordStrength} showChecks />`,
    props: [
      {
        name: 'strength',
        type: 'PasswordStrength',
        required: true,
        description: 'Password strength analysis result.',
        commonlyUsed: true,
      },
      {
        name: 'showChecks',
        type: 'boolean',
        default: 'false',
        description: 'Show individual requirement checkmarks.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS classes.',
      },
    ],
    notes: [
      'Also exports PasswordGenerator, PasswordConfirmation, and PasswordSecurityBadge.',
    ],
  },

  // ==========================================================================
  // SOCIAL & CHAT TAB
  // ==========================================================================

  Reactions: {
    name: 'ReactionBadge',
    description:
      'Emoji reaction badges for messages with toggle support, user lists, and size variants.',
    importPath: '@clarity-chat/react',
    importName: 'ClarityComponents',
    usageCode: `import { ClarityComponents } from '@clarity-chat/react'

<ClarityComponents.ReactionBadge
  reaction={{ emoji: '\u{1F44D}', count: 5, users: [], reacted: true }}
  onToggle={(emoji) => toggleReaction(emoji)}
  showUsers
/>`,
    props: [
      {
        name: 'reaction',
        type: 'Reaction',
        required: true,
        description: 'Reaction data with emoji, count, and users.',
        commonlyUsed: true,
      },
      {
        name: 'onToggle',
        type: '(emoji: string) => void',
        required: true,
        description: 'Callback to toggle the reaction.',
        commonlyUsed: true,
      },
      {
        name: 'showUsers',
        type: 'boolean',
        default: 'true',
        description: 'Show user avatars who reacted.',
      },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg'",
        default: '"md"',
        description: 'Badge size variant.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS classes.',
      },
    ],
    notes: [
      'Also exports ReactionList, ReactionPicker, QuickReactionBar, and AnimatedReaction.',
    ],
  },

  'Quick Replies': {
    name: 'QuickRepliesBar',
    description:
      'Pre-defined response options displayed as clickable chips for common quick-reply patterns.',
    importPath: '@clarity-chat/react',
    importName: 'ClarityComponents',
    usageCode: `import { ClarityComponents } from '@clarity-chat/react'

<ClarityComponents.QuickRepliesBar
  replies={quickReplies}
  onSelect={(reply) => sendQuickReply(reply)}
/>`,
    props: [
      {
        name: 'replies',
        type: 'QuickReply[]',
        required: true,
        description: 'Array of quick reply options.',
        commonlyUsed: true,
      },
      {
        name: 'onSelect',
        type: '(reply: QuickReply) => void',
        required: true,
        description: 'Callback when a quick reply is selected.',
        commonlyUsed: true,
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS classes.',
      },
    ],
    notes: [
      'Also exports QuickReplyButton, QuickRepliesPanel, and QuickReplyEditor.',
    ],
  },

  'Pinned Messages': {
    name: 'PinnedMessageBanner',
    description:
      'Highlighted important messages with pin/unpin actions, banner display, and carousel navigation.',
    importPath: '@clarity-chat/react',
    importName: 'ClarityComponents',
    usageCode: `import { ClarityComponents } from '@clarity-chat/react'

<ClarityComponents.PinnedMessageBanner
  message={pinnedMessage}
  onUnpin={() => unpinMessage()}
  onClick={() => scrollToMessage()}
/>`,
    props: [
      {
        name: 'message',
        type: 'PinnedMessage',
        required: true,
        description: 'The pinned message to display.',
        commonlyUsed: true,
      },
      {
        name: 'onUnpin',
        type: '() => void',
        description: 'Callback to unpin the message.',
        commonlyUsed: true,
      },
      {
        name: 'onClick',
        type: '() => void',
        description: 'Callback when the banner is clicked.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS classes.',
      },
    ],
    notes: ['Also exports PinnedMessagesList, PinButton, and PinnedCarousel.'],
  },

  'Social Posts': {
    name: 'TwitterPost',
    description:
      'Social media style content cards replicating Twitter, LinkedIn, and Reddit post formats.',
    importPath: '@clarity-chat/react',
    importName: 'ClarityComponents',
    usageCode: `import { ClarityComponents } from '@clarity-chat/react'

<ClarityComponents.TwitterPost
  author={{ name: 'User', handle: '@user', avatar: '...' }}
  content="Check out this AI chat library!"
  timestamp="2h"
  likes={42}
/>`,
    props: [
      {
        name: 'author',
        type: '{ name: string; handle: string; avatar?: string }',
        required: true,
        description: 'Post author information.',
        commonlyUsed: true,
      },
      {
        name: 'content',
        type: 'string',
        required: true,
        description: 'Post content text.',
        commonlyUsed: true,
      },
      { name: 'timestamp', type: 'string', description: 'Post timestamp.' },
      { name: 'likes', type: 'number', description: 'Like count.' },
      { name: 'retweets', type: 'number', description: 'Retweet count.' },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS classes.',
      },
    ],
    notes: ['Also exports LinkedInPost and RedditPost.'],
  },

  'Chat Sidebar': {
    name: 'ChatSidebar',
    description:
      'Conversation list navigation sidebar with search, projects, pin/archive actions, and collapsible layout.',
    importPath: '@clarity-chat/react',
    importName: 'ClarityComponents',
    usageCode: `import { ClarityComponents } from '@clarity-chat/react'

<ClarityComponents.ChatSidebar
  conversations={conversations}
  activeConversationId={activeId}
  onConversationSelect={(id) => selectConversation(id)}
  onNewConversation={() => createConversation()}
/>`,
    props: [
      {
        name: 'conversations',
        type: 'Conversation[]',
        required: true,
        description: 'Array of conversation objects.',
        commonlyUsed: true,
      },
      {
        name: 'projects',
        type: 'Project[]',
        description: 'Optional project folders for grouping.',
      },
      {
        name: 'activeConversationId',
        type: 'string',
        description: 'ID of the currently active conversation.',
        commonlyUsed: true,
      },
      {
        name: 'onConversationSelect',
        type: '(id: string) => void',
        required: true,
        description: 'Callback when a conversation is selected.',
        commonlyUsed: true,
      },
      {
        name: 'onNewConversation',
        type: '() => void',
        required: true,
        description: 'Callback to create a new conversation.',
        commonlyUsed: true,
      },
      {
        name: 'onDeleteConversation',
        type: '(id: string) => void',
        description: 'Delete a conversation.',
      },
      {
        name: 'onRenameConversation',
        type: '(id: string, name: string) => void',
        description: 'Rename a conversation.',
      },
      {
        name: 'onPinConversation',
        type: '(id: string) => void',
        description: 'Pin a conversation.',
      },
      {
        name: 'collapsed',
        type: 'boolean',
        default: 'false',
        description: 'Whether the sidebar is collapsed.',
      },
      {
        name: 'onToggleCollapse',
        type: '() => void',
        description: 'Toggle collapse state.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS classes.',
      },
    ],
  },

  'Copy Button': {
    name: 'CopyButton',
    description:
      'One-click clipboard copy button with copied confirmation state and multiple visual variants.',
    importPath: '@clarity-chat/react',
    importName: 'ClarityComponents',
    usageCode: `import { ClarityComponents } from '@clarity-chat/react'

<ClarityComponents.CopyButton
  text="Text to copy"
  variant="ghost"
  onCopy={(text) => console.log('Copied:', text)}
/>`,
    props: [
      {
        name: 'text',
        type: 'string',
        required: true,
        description: 'Text content to copy to clipboard.',
        commonlyUsed: true,
      },
      {
        name: 'icon',
        type: 'React.ReactNode',
        description: 'Custom icon for idle state.',
      },
      {
        name: 'copiedIcon',
        type: 'React.ReactNode',
        description: 'Custom icon for copied state.',
      },
      {
        name: 'copiedDuration',
        type: 'number',
        default: '2000',
        description: 'Duration to show copied state (ms).',
      },
      {
        name: 'onCopy',
        type: '(text: string) => void',
        description: 'Callback when copy succeeds.',
        commonlyUsed: true,
      },
      {
        name: 'onError',
        type: '(error: Error) => void',
        description: 'Callback when copy fails.',
      },
      {
        name: 'variant',
        type: "'default' | 'ghost' | 'outline' | 'minimal'",
        default: '"default"',
        description: 'Visual variant.',
      },
    ],
    notes: ['Also exports CopyToClipboard, CopyCodeBlock, and PasteButton.'],
  },

  'Conversation Manager': {
    name: 'ConversationManager',
    description:
      'Full conversation management with list, search, favorites, pinning, archival, branching, import/export, and project organization.',
    importPath: '@clarity-chat/react',
    importName: 'ClarityComponents',
    usageCode: `import { ClarityComponents } from '@clarity-chat/react'

<ClarityComponents.ConversationManager
  conversations={conversations}
  activeConversationId={activeId}
  onSelect={(id) => selectConversation(id)}
  onCreate={() => newConversation()}
  onDelete={(id) => deleteConversation(id)}
/>`,
    props: [
      {
        name: 'conversations',
        type: 'Conversation[]',
        required: true,
        description: 'Array of conversation objects.',
        commonlyUsed: true,
      },
      {
        name: 'projects',
        type: 'Project[]',
        description: 'Optional project folders.',
      },
      {
        name: 'activeConversationId',
        type: 'string',
        description: 'Currently active conversation ID.',
        commonlyUsed: true,
      },
      {
        name: 'onSelect',
        type: '(id: string) => void',
        description: 'Select a conversation.',
        commonlyUsed: true,
      },
      {
        name: 'onCreate',
        type: '() => void',
        description: 'Create a new conversation.',
        commonlyUsed: true,
      },
      {
        name: 'onDelete',
        type: '(id: string) => void',
        description: 'Delete a conversation.',
      },
      {
        name: 'onArchive',
        type: '(id: string) => void',
        description: 'Archive a conversation.',
      },
      {
        name: 'onRename',
        type: '(id: string, name: string) => void',
        description: 'Rename a conversation.',
      },
      {
        name: 'onToggleFavorite',
        type: '(id: string) => void',
        description: 'Toggle favorite status.',
      },
      {
        name: 'onExport',
        type: '(id: string) => void',
        description: 'Export a conversation.',
      },
      {
        name: 'onImport',
        type: '() => void',
        description: 'Import conversations.',
      },
    ],
  },

  // ==========================================================================
  // TOOLS & SEARCH TAB
  // ==========================================================================

  'Web Search': {
    name: 'WebSearch',
    description:
      'Search interface with query input, result cards, AI summary, and status indicators.',
    importPath: '@clarity-chat/react',
    importName: 'ClarityComponents',
    usageCode: `import { ClarityComponents } from '@clarity-chat/react'

<ClarityComponents.WebSearch
  onSearch={(query) => performSearch(query)}
  results={searchResults}
  isSearching={isSearching}
/>`,
    props: [
      {
        name: 'onSearch',
        type: '(query: SearchQuery) => void',
        description: 'Callback when a search is submitted.',
        commonlyUsed: true,
      },
      {
        name: 'results',
        type: 'SearchResult[]',
        description: 'Array of search results to display.',
        commonlyUsed: true,
      },
      {
        name: 'isSearching',
        type: 'boolean',
        default: 'false',
        description: 'Whether a search is in progress.',
      },
      {
        name: 'initialQuery',
        type: 'string',
        description: 'Pre-filled search query.',
      },
    ],
    notes: [
      'Also exports SearchResultCard, SearchResultsList, AISearchSummary, and SearchStatus.',
    ],
  },

  'Trace View': {
    name: 'TraceViewer',
    description:
      'Request execution timeline visualization with span hierarchy, duration bars, and detail panel.',
    importPath: '@clarity-chat/react',
    importName: 'ClarityComponents',
    usageCode: `import { ClarityComponents } from '@clarity-chat/react'

<ClarityComponents.TraceViewer trace={traceData} />`,
    props: [
      {
        name: 'trace',
        type: 'Trace',
        required: true,
        description: 'Trace data with spans and timing information.',
        commonlyUsed: true,
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS classes.',
      },
    ],
    notes: ['Also exports TraceList and LatencyChart.'],
  },

  'Workflow Nodes': {
    name: 'WorkflowNode',
    description:
      'Visual workflow builder nodes with configurable type, status, and action controls.',
    importPath: '@clarity-chat/react',
    importName: 'ClarityComponents',
    usageCode: `import { ClarityComponents } from '@clarity-chat/react'

<ClarityComponents.WorkflowNode
  id="node-1"
  type="llm"
  label="Process with GPT-4"
  status="running"
  onSelect={() => selectNode('node-1')}
/>`,
    props: [
      {
        name: 'id',
        type: 'string',
        required: true,
        description: 'Unique node identifier.',
        commonlyUsed: true,
      },
      {
        name: 'type',
        type: 'string',
        required: true,
        description: 'Node type (e.g., llm, tool, conditional).',
        commonlyUsed: true,
      },
      {
        name: 'label',
        type: 'string',
        required: true,
        description: 'Display label for the node.',
        commonlyUsed: true,
      },
      {
        name: 'description',
        type: 'string',
        description: 'Node description text.',
      },
      {
        name: 'icon',
        type: 'React.ReactNode',
        description: 'Custom node icon.',
      },
      {
        name: 'status',
        type: 'NodeStatus',
        description: 'Execution status of the node.',
        commonlyUsed: true,
      },
      {
        name: 'selected',
        type: 'boolean',
        default: 'false',
        description: 'Whether the node is selected.',
      },
      {
        name: 'onSelect',
        type: '() => void',
        description: 'Callback when node is selected.',
      },
      { name: 'onDelete', type: '() => void', description: 'Delete the node.' },
      {
        name: 'onDuplicate',
        type: '() => void',
        description: 'Duplicate the node.',
      },
      {
        name: 'onConfigure',
        type: '() => void',
        description: 'Configure the node.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS classes.',
      },
    ],
    notes: ['Also exports NodePalette and WorkflowStatus.'],
  },

  'Branch Picker': {
    name: 'BranchPicker',
    description:
      'Git-style branch selection with navigation arrows, branch count, and create/delete/star actions.',
    importPath: '@clarity-chat/react',
    importName: 'ClarityComponents',
    usageCode: `import { ClarityComponents } from '@clarity-chat/react'

<ClarityComponents.BranchPicker
  branches={branches}
  currentBranchIndex={0}
  onBranchChange={(index) => switchBranch(index)}
  onCreateBranch={() => createBranch()}
  showNavigation
/>`,
    props: [
      {
        name: 'branches',
        type: 'Branch[]',
        required: true,
        description: 'Array of branch objects.',
        commonlyUsed: true,
      },
      {
        name: 'currentBranchIndex',
        type: 'number',
        required: true,
        description: 'Index of the current branch.',
        commonlyUsed: true,
      },
      {
        name: 'onBranchChange',
        type: '(index: number) => void',
        required: true,
        description: 'Callback when branch changes.',
        commonlyUsed: true,
      },
      {
        name: 'onCreateBranch',
        type: '() => void',
        description: 'Create a new branch.',
      },
      {
        name: 'onDeleteBranch',
        type: '(branchId: string) => void',
        description: 'Delete a branch.',
      },
      {
        name: 'onStarBranch',
        type: '(branchId: string) => void',
        description: 'Star a branch.',
      },
      {
        name: 'variant',
        type: "'default' | 'compact' | 'minimal'",
        default: '"default"',
        description: 'Visual variant.',
      },
      {
        name: 'showBranchCount',
        type: 'boolean',
        default: 'false',
        description: 'Show total branch count.',
      },
      {
        name: 'showNavigation',
        type: 'boolean',
        default: 'false',
        description: 'Show prev/next navigation arrows.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS classes.',
      },
    ],
  },

  'Table of Contents': {
    name: 'TableOfContents',
    description:
      'Document navigation with hierarchical headings, active section highlighting, and click-to-scroll.',
    importPath: '@clarity-chat/react',
    importName: 'ClarityComponents',
    usageCode: `import { ClarityComponents } from '@clarity-chat/react'

<ClarityComponents.TableOfContents
  items={tocItems}
  activeId="section-2"
  onItemClick={(id) => scrollToSection(id)}
/>`,
    props: [
      {
        name: 'items',
        type: 'TOCItem[]',
        required: true,
        description: 'Array of table of contents items.',
        commonlyUsed: true,
      },
      {
        name: 'activeId',
        type: 'string',
        description: 'ID of the currently active section.',
        commonlyUsed: true,
      },
      {
        name: 'onItemClick',
        type: '(id: string) => void',
        description: 'Callback when an item is clicked.',
        commonlyUsed: true,
      },
      {
        name: 'title',
        type: 'string',
        default: '"On this page"',
        description: 'Title above the table of contents.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS classes.',
      },
    ],
    notes: ['Also exports AutoScrollTOC, FloatingTOC, and ProgressTOC.'],
  },

  'Sortable List': {
    name: 'SortableList',
    description:
      'Drag-and-drop reorderable list with edit, delete, duplicate actions and custom item rendering.',
    importPath: '@clarity-chat/react',
    importName: 'ClarityComponents',
    usageCode: `import { ClarityComponents } from '@clarity-chat/react'

<ClarityComponents.SortableList
  items={items}
  onReorder={(newItems) => setItems(newItems)}
  onDelete={(id) => deleteItem(id)}
/>`,
    props: [
      {
        name: 'items',
        type: 'SortableItem[]',
        required: true,
        description: 'Array of sortable items.',
        commonlyUsed: true,
      },
      {
        name: 'onReorder',
        type: '(items: SortableItem[]) => void',
        required: true,
        description: 'Callback with reordered items.',
        commonlyUsed: true,
      },
      {
        name: 'onDelete',
        type: '(id: string) => void',
        description: 'Delete an item.',
      },
      {
        name: 'onEdit',
        type: '(id: string) => void',
        description: 'Edit an item.',
      },
      {
        name: 'onDuplicate',
        type: '(id: string) => void',
        description: 'Duplicate an item.',
      },
      {
        name: 'renderItem',
        type: '(item: SortableItem, index: number) => React.ReactNode',
        description: 'Custom render function.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS classes.',
      },
    ],
    notes: [
      'Also exports PriorityList, EditableList, NumberedList, and KanbanColumn.',
    ],
  },

  // ==========================================================================
  // DEV TOOLS TAB
  // ==========================================================================

  'Developer Tools Dashboard': {
    name: 'DeveloperToolsDashboard',
    description:
      'Demo-only component (not exported from library). Comprehensive debugging dashboard combining API monitoring, profiling, and state inspection.',
    importPath: '@clarity-chat/react',
    usageCode: `// Demo-only dashboard. Use individual components:
import { ClarityComponents } from '@clarity-chat/react'

<ClarityComponents.TraceViewer trace={traceData} />`,
    props: [],
  },

  'API Inspector': {
    name: 'APIInspector',
    description:
      'Demo-only component (not exported from library). Monitor and inspect API calls with request/response details.',
    importPath: '@clarity-chat/react',
    usageCode: `// Use TraceViewer for API inspection.
import { ClarityComponents } from '@clarity-chat/react'

<ClarityComponents.TraceViewer trace={apiTrace} />`,
    props: [],
  },

  'Performance Profiler': {
    name: 'PerformanceProfiler',
    description:
      'Demo-only component (not exported from library). Track component performance metrics and render times.',
    importPath: '@clarity-chat/react',
    usageCode: `// Use StatCard for performance metrics.
import { ClarityComponents } from '@clarity-chat/react'

<ClarityComponents.StatCard title="Render Time" value="12ms" />`,
    props: [],
  },

  'State Time Travel': {
    name: 'StateTimeTravel',
    description:
      'Demo-only component (not exported from library). Debug state changes with history navigation and diff view.',
    importPath: '@clarity-chat/react',
    usageCode: `// Use CodeDiff for state comparison.
import { ClarityComponents } from '@clarity-chat/react'

<ClarityComponents.CodeDiff oldCode={prevState} newCode={curState} language="json" />`,
    props: [],
  },

  'Model Comparison': {
    name: 'ModelComparison',
    description:
      'Demo-only component (not exported from library). Compare AI model responses side-by-side with metrics.',
    importPath: '@clarity-chat/react',
    usageCode: `// Use ModelSelector and StatCard for model comparison UI.
import { ClarityComponents } from '@clarity-chat/react'

<ClarityComponents.ModelSelector models={models} onSelect={(m) => compare(m)} />`,
    props: [],
  },

  // ==========================================================================
  // ERROR HANDLING TAB
  // ==========================================================================

  'Error Display': {
    name: 'ChatError',
    description:
      'Beautiful error presentation with severity levels, error messages, and recovery actions.',
    importPath: '@clarity-chat/react',
    importName: 'ClarityComponents',
    usageCode: `import { ClarityComponents } from '@clarity-chat/react'

<ClarityComponents.ChatError
  error={error}
  onRetry={() => retryRequest()}
  onDismiss={() => dismissError()}
/>`,
    props: [
      {
        name: 'error',
        type: 'Error | string',
        required: true,
        description: 'Error object or message string.',
        commonlyUsed: true,
      },
      {
        name: 'onRetry',
        type: '() => void',
        description: 'Callback to retry the failed action.',
        commonlyUsed: true,
      },
      {
        name: 'onDismiss',
        type: '() => void',
        description: 'Callback to dismiss the error.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS classes.',
      },
    ],
    notes: ['Also exports ErrorFallback, MessageError, and NetworkError.'],
  },

  'Error Boundary': {
    name: 'ErrorBoundary',
    description:
      'React error boundary with customizable fallback UI, error logging, and recovery controls.',
    importPath: '@clarity-chat/react',
    usageCode: `import { ErrorBoundary } from '@clarity-chat/react'

<ErrorBoundary
  fallback={<div>Something went wrong</div>}
  onError={(error, info) => logError(error, info)}
>
  <ChildComponent />
</ErrorBoundary>`,
    props: [
      {
        name: 'children',
        type: 'React.ReactNode',
        required: true,
        description: 'Child components to wrap.',
        commonlyUsed: true,
      },
      {
        name: 'fallback',
        type: 'React.ReactNode',
        description: 'Custom fallback UI shown on error.',
        commonlyUsed: true,
      },
      {
        name: 'onError',
        type: '(error: Error, errorInfo: ErrorInfo) => void',
        description: 'Callback when an error is caught.',
        commonlyUsed: true,
      },
      {
        name: 'onReset',
        type: '() => void',
        description: 'Callback when the error boundary resets.',
      },
    ],
  },

  'Retry Countdown': {
    name: 'RetryCountdown',
    description:
      'Demo-only component (not exported from library). Automatic retry with visual countdown timer.',
    importPath: '@clarity-chat/react',
    usageCode: `// Use RetryIndicator for retry UI.
import { ClarityComponents } from '@clarity-chat/react'

<ClarityComponents.RetryIndicator attempt={2} maxAttempts={5} status="retrying" nextRetryIn={3000} />`,
    props: [],
  },

  'Circuit Breaker': {
    name: 'CircuitBreaker',
    description:
      'Demo-only component (not exported from library). Resilience pattern visualization showing circuit states.',
    importPath: '@clarity-chat/react',
    usageCode: `// Use StatusBadge for circuit breaker state.
import { ClarityComponents } from '@clarity-chat/react'

<ClarityComponents.StatusBadge status="open" label="Circuit Open" />`,
    props: [],
  },

  'Error Toast': {
    name: 'ErrorToast',
    description:
      'Demo-only component (not exported from library). Toast notification for transient error display.',
    importPath: '@clarity-chat/react',
    usageCode: `// Use the useToast hook for toast notifications.
import { useToast } from '@clarity-chat/react'

const { toast } = useToast()
toast({ title: 'Error', description: 'Something went wrong', variant: 'destructive' })`,
    props: [],
  },

  // ==========================================================================
  // TOKEN OPTIMIZATION TAB
  // ==========================================================================

  'Token Optimization Dashboard': {
    name: 'TokenOptimizationDashboard',
    description:
      'Comprehensive token savings and efficiency metrics dashboard with charts and optimization suggestions.',
    importPath: '@clarity-chat/react',
    importName: 'ClarityComponents',
    usageCode: `import { ClarityComponents } from '@clarity-chat/react'

<ClarityComponents.TokenOptimizationDashboard />`,
    props: [],
    notes: [
      'Self-contained dashboard. Use individual token components for more control.',
    ],
  },

  'Token Optimization Panel': {
    name: 'TokenOptimizer',
    description:
      'Compact optimization statistics with token breakdown charts, suggestions, and settings.',
    importPath: '@clarity-chat/react',
    importName: 'ClarityComponents',
    usageCode: `import { ClarityComponents } from '@clarity-chat/react'

<ClarityComponents.TokenOptimizer
  breakdown={tokenBreakdown}
  total={4500}
  limit={8000}
  suggestions={suggestions}
  settings={settings}
  onApplySuggestion={(id) => apply(id)}
/>`,
    props: [
      {
        name: 'breakdown',
        type: 'TokenBreakdown[]',
        required: true,
        description: 'Token usage breakdown by category.',
        commonlyUsed: true,
      },
      {
        name: 'total',
        type: 'number',
        required: true,
        description: 'Total tokens used.',
        commonlyUsed: true,
      },
      {
        name: 'limit',
        type: 'number',
        required: true,
        description: 'Token limit / context window size.',
        commonlyUsed: true,
      },
      {
        name: 'suggestions',
        type: 'OptimizationSuggestion[]',
        required: true,
        description: 'Optimization suggestions.',
        commonlyUsed: true,
      },
      {
        name: 'settings',
        type: 'OptimizerSettings',
        required: true,
        description: 'Current optimizer settings.',
      },
      {
        name: 'onApplySuggestion',
        type: '(id: string) => void',
        description: 'Apply an optimization suggestion.',
      },
      {
        name: 'onDismissSuggestion',
        type: '(id: string) => void',
        description: 'Dismiss a suggestion.',
      },
      {
        name: 'onSettingsChange',
        type: '(settings: OptimizerSettings) => void',
        description: 'Settings change callback.',
      },
      {
        name: 'onOptimizeAll',
        type: '() => void',
        description: 'Apply all optimizations.',
      },
    ],
  },

  'Token Cost Preview': {
    name: 'TokenCostPreview',
    description:
      'Demo-only component (not exported from library). Real-time cost estimation as you type.',
    importPath: '@clarity-chat/react',
    usageCode: `// Use TokenUsageMeter for live cost tracking.
import { TokenUsageMeter } from '@clarity-chat/react'

<TokenUsageMeter inputTokens={150} outputTokens={300} maxTokens={4096} />`,
    props: [],
  },

  'Token Usage Meter': {
    name: 'TokenUsageMeter',
    description:
      'Live token consumption display with input/output breakdown, progress bar, and threshold warnings.',
    importPath: '@clarity-chat/react',
    usageCode: `import { TokenUsageMeter } from '@clarity-chat/react'

<TokenUsageMeter inputTokens={1200} outputTokens={800} maxTokens={4096} showBreakdown />`,
    props: [
      {
        name: 'inputTokens',
        type: 'number',
        required: true,
        description: 'Number of input tokens used.',
        commonlyUsed: true,
      },
      {
        name: 'outputTokens',
        type: 'number',
        required: true,
        description: 'Number of output tokens used.',
        commonlyUsed: true,
      },
      {
        name: 'maxTokens',
        type: 'number',
        required: true,
        description: 'Maximum token limit.',
        commonlyUsed: true,
      },
      {
        name: 'showBreakdown',
        type: 'boolean',
        default: 'false',
        description: 'Show input/output breakdown.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS classes.',
      },
    ],
  },

  'Token Counter': {
    name: 'TokenCounter',
    description:
      'Compact token usage display with warning thresholds and visual indicators.',
    importPath: '@clarity-chat/react',
    usageCode: `import { TokenCounter } from '@clarity-chat/react'

<TokenCounter count={2048} limit={4096} warningThreshold={0.8} />`,
    props: [
      {
        name: 'count',
        type: 'number',
        required: true,
        description: 'Current token count.',
        commonlyUsed: true,
      },
      {
        name: 'limit',
        type: 'number',
        required: true,
        description: 'Token limit for warnings.',
        commonlyUsed: true,
      },
      {
        name: 'warningThreshold',
        type: 'number',
        default: '0.8',
        description: 'Percentage threshold for warning (0-1).',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS classes.',
      },
    ],
  },

  'Token Budget Bar': {
    name: 'TokenBudgetBar',
    description:
      'Visual progress bar for token budget utilization with color-coded thresholds.',
    importPath: '@clarity-chat/react',
    usageCode: `import { TokenBudgetBar } from '@clarity-chat/react'

<TokenBudgetBar used={3000} total={8000} warningAt={0.75} dangerAt={0.9} />`,
    props: [
      {
        name: 'used',
        type: 'number',
        required: true,
        description: 'Tokens used so far.',
        commonlyUsed: true,
      },
      {
        name: 'total',
        type: 'number',
        required: true,
        description: 'Total token budget.',
        commonlyUsed: true,
      },
      {
        name: 'warningAt',
        type: 'number',
        default: '0.75',
        description: 'Warning color threshold (0-1).',
      },
      {
        name: 'dangerAt',
        type: 'number',
        default: '0.9',
        description: 'Danger color threshold (0-1).',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS classes.',
      },
    ],
  },

  'Token Optimization Badge': {
    name: 'TokenStatusBadge',
    description:
      'Compact badge showing token optimization status and savings percentage.',
    importPath: '@clarity-chat/react',
    importName: 'ClarityComponents',
    usageCode: `import { ClarityComponents } from '@clarity-chat/react'

<ClarityComponents.TokenStatusBadge status="optimized" savings={25} />`,
    props: [
      {
        name: 'status',
        type: 'string',
        required: true,
        description: 'Optimization status label.',
        commonlyUsed: true,
      },
      {
        name: 'savings',
        type: 'number',
        description: 'Percentage of tokens saved.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS classes.',
      },
    ],
  },

  'Token ROI Calculator': {
    name: 'TokenROICalculator',
    description:
      'Demo-only component (not exported from library). Calculate ROI for token optimization strategies.',
    importPath: '@clarity-chat/react',
    usageCode: `// Use TokenOptimizer for optimization analysis.
import { ClarityComponents } from '@clarity-chat/react'

<ClarityComponents.TokenOptimizer breakdown={b} total={4500} limit={8000} suggestions={s} settings={st} />`,
    props: [],
  },

  // ==========================================================================
  // STREAMING TAB
  // ==========================================================================

  'Streaming Text Shimmer': {
    name: 'TextShimmer',
    description:
      'Shimmer animation effect for streaming text, providing visual feedback during generation.',
    importPath: '@clarity-chat/react',
    importName: 'ClarityComponents',
    usageCode: `import { ClarityComponents } from '@clarity-chat/react'

<ClarityComponents.TextShimmer text="Generating response..." isActive />`,
    props: [
      {
        name: 'text',
        type: 'string',
        required: true,
        description: 'Text to display with shimmer.',
        commonlyUsed: true,
      },
      {
        name: 'isActive',
        type: 'boolean',
        default: 'true',
        description: 'Whether shimmer is active.',
        commonlyUsed: true,
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS classes.',
      },
    ],
  },

  'Text Shimmer Placeholders': {
    name: 'TextShimmerPlaceholders',
    description:
      'Demo-only component (not exported from library). Animated loading placeholder lines simulating text.',
    importPath: '@clarity-chat/react',
    usageCode: `// Use TextShimmer for shimmer effects.
import { ClarityComponents } from '@clarity-chat/react'

<ClarityComponents.TextShimmer text="Loading content..." isActive />`,
    props: [],
  },

  'Streaming Progress': {
    name: 'StreamingProgress',
    description:
      'Progress indicator with token count, throughput (tokens/sec), and elapsed time during streaming.',
    importPath: '@clarity-chat/react',
    usageCode: `import { StreamingProgress } from '@clarity-chat/react'

<StreamingProgress status="streaming" tokensGenerated={150} tokensPerSecond={25} elapsed={6000} />`,
    props: [
      {
        name: 'status',
        type: "'idle' | 'streaming' | 'complete' | 'error'",
        required: true,
        description: 'Current streaming status.',
        commonlyUsed: true,
      },
      {
        name: 'tokensGenerated',
        type: 'number',
        description: 'Tokens generated so far.',
        commonlyUsed: true,
      },
      {
        name: 'tokensPerSecond',
        type: 'number',
        description: 'Current throughput.',
      },
      {
        name: 'elapsed',
        type: 'number',
        description: 'Elapsed time in milliseconds.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS classes.',
      },
    ],
  },

  'Streaming Cursor': {
    name: 'TypingAnimation',
    description:
      'Animated cursor for active streaming with character-by-character text reveal.',
    importPath: '@clarity-chat/react',
    importName: 'ClarityComponents',
    usageCode: `import { ClarityComponents } from '@clarity-chat/react'

<ClarityComponents.TypingAnimation
  text="Hello, how can I help you today?"
  speed={30}
  cursor
  onComplete={() => console.log('Done')}
/>`,
    props: [
      {
        name: 'text',
        type: 'string',
        required: true,
        description: 'Text to animate character by character.',
        commonlyUsed: true,
      },
      {
        name: 'speed',
        type: 'number',
        default: '30',
        description: 'Milliseconds per character.',
        commonlyUsed: true,
      },
      {
        name: 'onComplete',
        type: '() => void',
        description: 'Callback when animation finishes.',
      },
      {
        name: 'cursor',
        type: 'boolean',
        default: 'true',
        description: 'Show blinking cursor.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS classes.',
      },
    ],
  },

  'Typing Indicator': {
    name: 'TypingIndicator',
    description:
      'AI typing indicator with animated dots, multiple visual variants, and size options.',
    importPath: '@clarity-chat/react',
    usageCode: `import { TypingIndicator } from '@clarity-chat/react'

<TypingIndicator variant="dots" size="md" label="AI is thinking..." />`,
    props: [
      {
        name: 'variant',
        type: "'dots' | 'pulse' | 'wave' | 'text'",
        default: '"dots"',
        description: 'Animation style variant.',
        commonlyUsed: true,
      },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg'",
        default: '"md"',
        description: 'Size of the indicator.',
      },
      { name: 'label', type: 'string', description: 'Optional text label.' },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS classes.',
      },
    ],
  },

  'Streaming Message': {
    name: 'StreamingMessage',
    description:
      'Full streaming message with thinking indicators, tool call visualization, and progressive content rendering.',
    importPath: '@clarity-chat/react',
    usageCode: `import { StreamingMessage } from '@clarity-chat/react'

<StreamingMessage
  content={streamedContent}
  isStreaming={isStreaming}
  thinkingSteps={thinkingSteps}
  toolCalls={toolCalls}
/>`,
    props: [
      {
        name: 'content',
        type: 'string',
        required: true,
        description: 'Message content being streamed.',
        commonlyUsed: true,
      },
      {
        name: 'isStreaming',
        type: 'boolean',
        default: 'false',
        description: 'Whether content is currently streaming.',
        commonlyUsed: true,
      },
      {
        name: 'thinkingSteps',
        type: 'ThinkingStep[]',
        description: 'AI thinking/reasoning steps.',
      },
      {
        name: 'toolCalls',
        type: 'ToolCall[]',
        description: 'Tool calls made during generation.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS classes.',
      },
    ],
  },

  // ==========================================================================
  // AI ADAPTERS TAB
  // ==========================================================================

  'Multi-Provider Adapter': {
    name: 'MultiProviderAdapter',
    description:
      'Demo-only component (not exported from library). Switch between AI providers at runtime with unified API.',
    importPath: '@clarity-chat/react',
    usageCode: `// Use adapter hooks for multi-provider support.
import { useVercelAIBridge, useAnthropicBridge } from '@clarity-chat/react'

const vercel = useVercelAIBridge({ ... })
const anthropic = useAnthropicBridge({ ... })`,
    props: [],
    notes: [
      'Use createVercelAIAdapter, useVercelAIBridge, useLangChainBridge, or useAnthropicBridge.',
    ],
  },

  'Provider Health Monitor': {
    name: 'ProviderHealthMonitor',
    description:
      'Demo-only component (not exported from library). Track provider status, latency, and uptime.',
    importPath: '@clarity-chat/react',
    usageCode: `// Use StatusBadge and StatCard for health monitoring.
import { ClarityComponents } from '@clarity-chat/react'

<ClarityComponents.StatusBadge status="healthy" label="OpenAI" pulse />`,
    props: [],
  },

  'Retry & Circuit Breaker': {
    name: 'RetryCircuitBreaker',
    description:
      'Demo-only component (not exported from library). Combined retry and circuit breaker resilience patterns.',
    importPath: '@clarity-chat/react',
    usageCode: `// Use RetryIndicator and StatusBadge for resilience UI.
import { ClarityComponents } from '@clarity-chat/react'

<ClarityComponents.RetryIndicator attempt={1} maxAttempts={3} status="retrying" />`,
    props: [],
  },

  'Request Inspector': {
    name: 'RequestInspector',
    description:
      'Demo-only component (not exported from library). Debug and inspect API request/response payloads.',
    importPath: '@clarity-chat/react',
    usageCode: `// Use TraceViewer for request inspection.
import { ClarityComponents } from '@clarity-chat/react'

<ClarityComponents.TraceViewer trace={requestTrace} />`,
    props: [],
  },

  'Adapter Configuration': {
    name: 'AdapterConfiguration',
    description:
      'Demo-only component (not exported from library). Configure provider-specific settings.',
    importPath: '@clarity-chat/react',
    usageCode: `// Use SettingsPanel or DynamicForm for configuration UI.
import { ClarityComponents } from '@clarity-chat/react'

<ClarityComponents.SettingsPanel open={true} onClose={() => {}} />`,
    props: [],
  },
}
