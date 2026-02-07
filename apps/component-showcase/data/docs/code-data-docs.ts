import type { ComponentDoc } from '@/components/doc-panel'

export const codeDataDocs: Record<string, ComponentDoc | ComponentDoc[]> = {
  // ===========================================================================
  // Code Block
  // ===========================================================================
  'Code Block': [
    {
      name: 'CodeBlock',
      description:
        'Syntax-highlighted code display powered by Shiki (VS Code engine). Supports 15+ themes, line numbers, line highlighting, diff visualization, copy/download, expand/collapse for long blocks, and premium font options with ligature support.',
      importPath: '@clarity-chat/react',
      usageCode: `<CodeBlock
  language="typescript"
  theme="github-dark"
  title="example.ts"
  showLineNumbers
  highlightLines="2,5-7"
  showCopyButton
  maxHeight={300}
>
  {\`const greeting = "Hello, World!"
console.log(greeting)\`}
</CodeBlock>`,
      props: [
        {
          name: 'language',
          type: 'string',
          description:
            'Programming language for syntax highlighting (e.g. "typescript", "python", "jsx").',
          commonlyUsed: true,
        },
        {
          name: 'code',
          type: 'string',
          required: true,
          description: 'The code prop.',
        },
        {
          name: 'filename',
          type: 'string',
          description:
            'Filename used for download. Defaults to code.{language} if not provided.',
        },
        {
          name: 'showLineNumbers',
          type: 'boolean',
          default: 'false',
          description: 'Show line numbers in the gutter.',
          commonlyUsed: true,
        },
        {
          name: 'highlightLines',
          type: 'number[]',
          description:
            'Lines to highlight, specified as a comma-separated range string (e.g. "2,5-7,10").',
          commonlyUsed: true,
        },
        {
          name: 'className',
          type: 'string',
          description: 'Additional CSS class applied to the outer container.',
        },
        {
          name: 'children',
          type: 'string',
          required: true,
          description: 'The code content to display.',
          commonlyUsed: true,
        },
        {
          name: 'theme',
          type: 'CodeThemeName | BundledTheme',
          default: '"night-owl"',
          description:
            'Color theme from predefined themes or a custom Shiki theme. Predefined options include "github-dark", "one-dark-pro", "dracula", "material-theme-darker", "nord", "github-light", and more.',
          commonlyUsed: true,
        },
        {
          name: 'startingLineNumber',
          type: 'number',
          default: '1',
          description: 'Starting line number when line numbers are displayed.',
        },
        {
          name: 'addedLines',
          type: 'string',
          description:
            'Lines marked as added in a diff view (e.g. "2,4-5"). Renders with green background.',
        },
        {
          name: 'removedLines',
          type: 'string',
          description:
            'Lines marked as removed in a diff view (e.g. "3,6"). Renders with red background.',
        },
        {
          name: 'title',
          type: 'string',
          description: 'Title or filename to display in the header bar.',
          commonlyUsed: true,
        },
        {
          name: 'showCopyButton',
          type: 'boolean',
          default: 'true',
          description: 'Show the copy-to-clipboard button in the header.',
          commonlyUsed: true,
        },
        {
          name: 'showLanguageBadge',
          type: 'boolean',
          default: 'true',
          description: 'Show a language badge in the header.',
        },
        {
          name: 'maxHeight',
          type: 'number',
          description:
            'Maximum height in pixels before showing an expand/collapse button.',
          commonlyUsed: true,
        },
        {
          name: 'wordWrap',
          type: 'boolean',
          default: 'false',
          description: 'Enable word wrap for long lines.',
        },
        {
          name: 'fontFamily',
          type: "'fira-code' | 'jetbrains-mono' | 'source-code-pro' | 'system'",
          default: '"fira-code"',
          description: 'Font family for the code content.',
        },
        {
          name: 'enableLigatures',
          type: 'boolean',
          default: 'true',
          description: 'Enable font ligatures (e.g. =>, !==, <=).',
        },
        {
          name: 'onCopy',
          type: '() => void',
          description: 'Callback invoked when code is copied to clipboard.',
        },
        {
          name: 'autoDetectLanguage',
          type: 'boolean',
          default: 'true',
          description:
            'Auto-detect the programming language if none is provided.',
        },
        {
          name: 'showDownloadButton',
          type: 'boolean',
          default: 'false',
          description: 'Show a download button in the header.',
        },
        {
          name: 'onDownload',
          type: '() => void',
          description: 'Callback invoked when the code is downloaded.',
        },
        {
          name: 'enableKeyboardShortcuts',
          type: 'boolean',
          default: 'false',
          description:
            'Enable keyboard shortcuts: Cmd+Shift+C to copy, Cmd+Shift+D to download, Cmd+Shift+E to expand/collapse.',
        },
      ],
      notes: [
        'Requires the "shiki" peer dependency for syntax highlighting. Install with: npm install shiki.',
        'Falls back to plain <pre><code> rendering without syntax highlighting when shiki is unavailable.',
        'Shiki adds approximately 200KB to the bundle (loaded on demand).',
        'Supports WCAG 2.1 AA accessibility with keyboard navigation and ARIA attributes.',
        'Syntax highlighting can be explicitly disabled via the CLARITY_DISABLE_SYNTAX_HIGHLIGHTING environment variable.',
      ],
      sourceFile: 'components/clarity/code-block.tsx',
    },
    {
      name: 'InlineCode',
      description:
        'Inline code snippet component styled with the Night Owl theme. Supports optional click-to-copy functionality with accessible keyboard interaction and visual feedback.',
      importPath: '@clarity-chat/react',
      usageCode: `<p>
  Use the <InlineCode>useState</InlineCode> hook to manage
  state.
</p>

{
  /* With copy-on-click */
}
<InlineCode
  enableCopy
  onCopy={() => console.log('Copied!')}
>
  npm install @clarity-chat/react
</InlineCode>`,
      props: [
        {
          name: 'code',
          type: 'string',
          required: true,
          description: 'The code prop.',
        },
        {
          name: 'className',
          type: 'string',
          description: 'Additional CSS class.',
        },
        {
          name: 'children',
          type: 'string',
          required: true,
          description: 'The code content to display inline.',
          commonlyUsed: true,
        },
        {
          name: 'enableCopy',
          type: 'boolean',
          default: 'false',
          description:
            'Enable click-to-copy functionality. When enabled, the element becomes a button with keyboard support.',
          commonlyUsed: true,
        },
        {
          name: 'onCopy',
          type: '() => void',
          description: 'Callback invoked when the inline code is copied.',
        },
      ],
      notes: [
        'Uses Night Owl theming via CSS custom properties, consistent with CodeBlock.',
        'When enableCopy is true, the element gains role="button", tabIndex, and responds to Enter/Space key presses.',
        'Shows a checkmark indicator for 2 seconds after a successful copy.',
      ],
      sourceFile: 'components/clarity/code-block.tsx',
    },
  ],

  // ===========================================================================
  // Code Diff
  // ===========================================================================
  'Code Diff': {
    name: 'CodeBlock',
    description:
      'CodeBlock used in diff mode. Pass addedLines and removedLines props to visualize code changes with green/red highlighting and optional line numbers in the gutter.',
    importPath: '@clarity-chat/react',
    usageCode: `<CodeBlock
  language="tsx"
  title="Counter.tsx"
  showLineNumbers
  addedLines="2,4-5"
  removedLines="1,3"
  theme="github-dark"
>
  {\`import { useState, useEffect } from "react"

function Counter() {
  const [count, setCount] = useState(0)

  return (
    <button onClick={() => setCount(c => c + 1)}>{count}</button>
  )
}\`}
</CodeBlock>`,
    props: [
      {
        name: 'language',
        type: 'string',
        description: 'Programming language for syntax highlighting.',
        commonlyUsed: true,
      },
      {
        name: 'code',
        type: 'string',
        required: true,
        description: 'The code prop.',
      },
      {
        name: 'filename',
        type: 'string',
        description: 'Filename for download.',
      },
      {
        name: 'showLineNumbers',
        type: 'boolean',
        default: 'false',
        description:
          'Show line numbers in the gutter. The gutter reflects diff colors for added/removed lines.',
        commonlyUsed: true,
      },
      {
        name: 'highlightLines',
        type: 'number[]',
        description:
          'Lines to highlight separately from diff markers (e.g. "7-9").',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS class.',
      },
      {
        name: 'children',
        type: 'string',
        required: true,
        description: 'The code content to display.',
        commonlyUsed: true,
      },
      {
        name: 'addedLines',
        type: 'string',
        description:
          'Comma-separated line ranges marked as added (e.g. "2,4-5"). Renders with a green background.',
        commonlyUsed: true,
      },
      {
        name: 'removedLines',
        type: 'string',
        description:
          'Comma-separated line ranges marked as removed (e.g. "1,3"). Renders with a red background.',
        commonlyUsed: true,
      },
      {
        name: 'title',
        type: 'string',
        description: 'Filename displayed in the header (e.g. "Counter.tsx").',
        commonlyUsed: true,
      },
      {
        name: 'theme',
        type: 'CodeThemeName | BundledTheme',
        default: '"night-owl"',
        description: 'Color theme for the diff view.',
        commonlyUsed: true,
      },
      {
        name: 'showCopyButton',
        type: 'boolean',
        default: 'true',
        description: 'Show copy button in the header.',
      },
      {
        name: 'showLanguageBadge',
        type: 'boolean',
        default: 'true',
        description: 'Show language badge in the header.',
      },
      {
        name: 'startingLineNumber',
        type: 'number',
        default: '1',
        description: 'Starting line number for the gutter.',
      },
      {
        name: 'maxHeight',
        type: 'number',
        description: 'Maximum height in pixels before showing expand/collapse.',
      },
      {
        name: 'wordWrap',
        type: 'boolean',
        default: 'false',
        description: 'Enable word wrap for long lines.',
      },
      {
        name: 'fontFamily',
        type: "'fira-code' | 'jetbrains-mono' | 'source-code-pro' | 'system'",
        default: '"fira-code"',
        description: 'Font family for the code content.',
      },
      {
        name: 'enableLigatures',
        type: 'boolean',
        default: 'true',
        description: 'Enable font ligatures.',
      },
      {
        name: 'onCopy',
        type: '() => void',
        description: 'Callback when code is copied.',
      },
      {
        name: 'autoDetectLanguage',
        type: 'boolean',
        default: 'true',
        description: 'Auto-detect language if not provided.',
      },
      {
        name: 'showDownloadButton',
        type: 'boolean',
        default: 'false',
        description: 'Show download button in the header.',
      },
      {
        name: 'onDownload',
        type: '() => void',
        description: 'Callback when code is downloaded.',
      },
      {
        name: 'enableKeyboardShortcuts',
        type: 'boolean',
        default: 'false',
        description:
          'Enable keyboard shortcuts for copy, download, and expand.',
      },
    ],
    notes: [
      'This is the same CodeBlock component used with its diff-specific props (addedLines and removedLines).',
      'Added lines get a green tinted background; removed lines get a red tinted background.',
      'Line numbers in the gutter also reflect diff coloring when showLineNumbers is enabled.',
      'Diff highlighting is applied via Shiki transformers and works alongside regular line highlighting.',
    ],
    sourceFile: 'components/clarity/code-block.tsx',
  },

  // ===========================================================================
  // Terminal
  // ===========================================================================
  Terminal: {
    name: 'Terminal',
    description:
      'Interactive terminal component with Night Owl theming, streaming output support, command history navigation, and multiple theme presets. Supports both display-only and interactive modes.',
    importPath: '@clarity-chat/react',
    usageCode: `<Terminal
  title="Terminal"
  theme="night-owl"
  prompt="\$"
  lines={[
    {
      type: 'command',
      content: 'npm install @clarity-chat/react',
    },
    {
      type: 'output',
      content: 'Installing dependencies...',
    },
    { type: 'success', content: 'Done in 2.3s' },
    { type: 'error', content: 'WARN deprecated package' },
  ]}
  showControls
  maxHeight={400}
/>

{
  /* Interactive mode */
}
<Terminal
  interactive
  onCommand={(cmd) => handleCommand(cmd)}
  prompt=">"
/>`,
    props: [
      {
        name: 'lines',
        type: 'TerminalLine[]',
        default: '[]',
        description:
          'Array of terminal lines. Each line has a type ("command" | "output" | "error" | "success" | "warning" | "info" | "system") and content string.',
        commonlyUsed: true,
      },
      {
        name: 'title',
        type: 'string',
        default: '"Terminal"',
        description: 'Terminal window title displayed in the header.',
        commonlyUsed: true,
      },
      {
        name: 'theme',
        type: 'TerminalTheme',
        default: '"night-owl"',
        description: 'Color theme preset for the terminal.',
        commonlyUsed: true,
      },
      {
        name: 'prompt',
        type: 'string',
        default: '"$"',
        description:
          'Command prompt symbol displayed before command-type lines and the interactive input.',
        commonlyUsed: true,
      },
      {
        name: 'cwd',
        type: 'string',
        description:
          'Current working directory displayed in the header alongside the title.',
      },
      {
        name: 'interactive',
        type: 'boolean',
        default: 'false',
        description:
          'Enable interactive mode with a text input at the bottom for typing commands.',
        commonlyUsed: true,
      },
      {
        name: 'isStreaming',
        type: 'boolean',
        default: 'false',
        description:
          'Whether the terminal output is currently streaming. Shows a blinking cursor at the end.',
        commonlyUsed: true,
      },
      {
        name: 'showLineNumbers',
        type: 'boolean',
        default: 'false',
        description: 'Show line numbers in the terminal output.',
      },
      {
        name: 'showTimestamps',
        type: 'boolean',
        default: 'false',
        description:
          'Show timestamps for each line (requires timestamp on TerminalLine).',
      },
      {
        name: 'showControls',
        type: 'boolean',
        default: 'true',
        description:
          'Show macOS-style window control buttons (red/yellow/green) in the header.',
        commonlyUsed: true,
      },
      {
        name: 'maxHeight',
        type: 'number | string',
        default: '400',
        description:
          'Maximum height of the terminal content area before scrolling.',
      },
      {
        name: 'onCommand',
        type: '(command: string) => void',
        description:
          'Callback invoked when the user submits a command in interactive mode.',
        commonlyUsed: true,
      },
      {
        name: 'onCopy',
        type: '(content: string) => void',
        description:
          'Callback invoked when the user copies terminal output via the copy button.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS class applied to the outer container.',
      },
    ],
    notes: [
      'TerminalLine objects support: id (optional unique ID), type, content, timestamp (Date), isStreaming (boolean), and prompt (custom per-line prompt).',
      'In interactive mode, arrow up/down navigates command history.',
      'Auto-scrolls to the bottom when new lines are added.',
      'Uses Framer Motion for entry animations; respects prefers-reduced-motion.',
      'A companion useTerminal() hook is available for managing terminal state (addLine, addCommand, addOutput, addError, addSuccess, clear, updateLastLine, setStreaming).',
    ],
    sourceFile: 'components/clarity/terminal.tsx',
  },

  // ===========================================================================
  // Data Table
  // ===========================================================================
  'Data Table': {
    name: 'DataTable',
    description:
      'Tabular data display component with built-in column sorting, search/filtering, pagination, row selection, loading states, and empty states. Supports both client-side and server-side data processing.',
    importPath: '@clarity-chat/react',
    usageCode: `<DataTable
  columns={[
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <Badge
          variant={
            value === 'active' ? 'success' : 'secondary'
          }
        >
          {value as string}
        </Badge>
      ),
    },
  ]}
  data={users}
  searchable
  paginated
  pageSize={10}
  selectable
  onRowClick={(row) => console.log(row)}
  onSort={(key, dir) => console.log(key, dir)}
/>`,
    props: [
      {
        name: 'columns',
        type: 'DataTableColumn<T>[]',
        required: true,
        description:
          'Column definitions. Each column has key, label, and optional sortable, width, align, render, and hidden properties.',
        commonlyUsed: true,
      },
      {
        name: 'data',
        type: 'T[]',
        required: true,
        description: 'Array of data objects to display in the table.',
        commonlyUsed: true,
      },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg'",
        default: '"md"',
        description: 'Size preset affecting row padding and font size.',
      },
      {
        name: 'selectable',
        type: 'boolean',
        default: 'false',
        description:
          'Enable row selection with checkboxes. Includes a select-all checkbox in the header.',
        commonlyUsed: true,
      },
      {
        name: 'selectedKeys',
        type: 'string[]',
        default: '[]',
        description: 'Controlled selected row keys.',
      },
      {
        name: 'rowKey',
        type: 'string',
        default: '"id"',
        description: 'Field name used as the unique key for each row.',
      },
      {
        name: 'searchable',
        type: 'boolean',
        default: 'false',
        description:
          'Enable the search input above the table for filtering rows.',
        commonlyUsed: true,
      },
      {
        name: 'searchPlaceholder',
        type: 'string',
        default: '"Search..."',
        description: 'Placeholder text for the search input.',
      },
      {
        name: 'paginated',
        type: 'boolean',
        default: 'false',
        description: 'Enable pagination controls below the table.',
        commonlyUsed: true,
      },
      {
        name: 'pageSize',
        type: 'number',
        default: '10',
        description: 'Number of rows per page when pagination is enabled.',
        commonlyUsed: true,
      },
      {
        name: 'currentPage',
        type: 'number',
        description:
          'Controlled current page number. When provided, pagination becomes controlled externally.',
      },
      {
        name: 'totalItems',
        type: 'number',
        description:
          'Total item count for server-side pagination. When provided, pagination is calculated from this value instead of data.length.',
      },
      {
        name: 'isLoading',
        type: 'boolean',
        default: 'false',
        description: 'Show a loading spinner inside the table body.',
        commonlyUsed: true,
      },
      {
        name: 'emptyMessage',
        type: 'string',
        default: '"No data available"',
        description: 'Message displayed when data is empty.',
      },
      {
        name: 'defaultSortKey',
        type: 'string',
        description: 'Column key to sort by on initial render.',
      },
      {
        name: 'defaultSortDirection',
        type: "'asc' | 'desc'",
        default: '"asc"',
        description: 'Initial sort direction.',
      },
      {
        name: 'onSort',
        type: '(key: string, direction: SortDirection) => void',
        description:
          'Callback when sort changes. Useful for server-side sorting.',
      },
      {
        name: 'onSelectionChange',
        type: '(keys: string[]) => void',
        description: 'Callback when row selection changes.',
      },
      {
        name: 'onRowClick',
        type: '(row: T, index: number) => void',
        description: 'Callback when a row is clicked.',
        commonlyUsed: true,
      },
      {
        name: 'onPageChange',
        type: '(page: number) => void',
        description: 'Callback when the page changes.',
      },
      {
        name: 'onSearch',
        type: '(query: string) => void',
        description:
          'Callback when the search query changes. Useful for server-side filtering.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS class applied to the outer container.',
      },
    ],
    notes: [
      'DataTableColumn supports a render function for custom cell rendering: (value, row, index) => ReactNode.',
      'Client-side sorting and filtering are built in. Use onSort and onSearch callbacks for server-side processing.',
      'The component is generic: DataTable<T> where T defaults to Record<string, unknown>.',
      'Uses Framer Motion for row animations; respects prefers-reduced-motion.',
      'Pagination shows up to 5 page buttons with smart windowing around the current page.',
    ],
    sourceFile: 'components/clarity/data-table.tsx',
  },

  // ===========================================================================
  // Test Results
  // ===========================================================================
  'Test Results': {
    name: 'TestResults',
    description:
      'Test execution results display supporting pass/fail/skip/pending/running statuses, suite grouping with collapsible sections, error messages with stack traces, a summary progress bar, and duration tracking.',
    importPath: '@clarity-chat/react',
    usageCode: `<TestResults
  title="Unit Tests"
  showSummary
  showDurations
  collapsePassedSuites
  suites={[
    {
      name: 'utils.test.ts',
      tests: [
        {
          name: 'should format date',
          status: 'pass',
          duration: 5,
        },
        {
          name: 'should parse JSON',
          status: 'pass',
          duration: 8,
        },
        {
          name: 'should validate input',
          status: 'fail',
          duration: 23,
          error: 'Expected "valid" but got "invalid"',
          stack: 'at validate (utils.ts:42)',
        },
        { name: 'should submit form', status: 'skip' },
      ],
    },
  ]}
  onTestClick={(test, suite) =>
    console.log(test.name, suite.name)
  }
/>`,
    props: [
      {
        name: 'suites',
        type: 'TestSuite[]',
        required: true,
        description:
          'Array of test suites. Each suite has name, tests (TestCase[]), optional nested suites, duration, file, and isRunning.',
        commonlyUsed: true,
      },
      {
        name: 'title',
        type: 'string',
        description: 'Title displayed at the top of the results panel.',
        commonlyUsed: true,
      },
      {
        name: 'showSummary',
        type: 'boolean',
        default: 'true',
        description:
          'Show summary statistics (passed, failed, skipped, total) and a progress bar.',
        commonlyUsed: true,
      },
      {
        name: 'showDurations',
        type: 'boolean',
        default: 'true',
        description:
          'Show test and suite durations. Formats automatically (ms or seconds).',
        commonlyUsed: true,
      },
      {
        name: 'collapsePassedSuites',
        type: 'boolean',
        default: 'false',
        description:
          'Collapse test suites that have all passing tests by default. Failed suites remain expanded.',
        commonlyUsed: true,
      },
      {
        name: 'showOnlyFailed',
        type: 'boolean',
        default: 'false',
        description: 'Filter to show only failed tests within each suite.',
      },
      {
        name: 'onTestClick',
        type: '(test: TestCase, suite: TestSuite) => void',
        description:
          'Callback when a test case is clicked. Useful for navigating to the test file.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS class applied to the outer container.',
      },
    ],
    notes: [
      'TestCase supports: name, status ("pass" | "fail" | "skip" | "pending" | "running"), duration (ms), error, stack, retries, and file.',
      'TestSuite supports: name, file, tests, nested suites (for describe blocks), duration, and isRunning.',
      'Failed tests automatically show their error message expanded; other tests can be clicked to toggle details.',
      'The summary progress bar animates with staggered segments for passed, failed, and skipped counts.',
      'Uses Framer Motion for animations; respects prefers-reduced-motion.',
    ],
    sourceFile: 'components/clarity/sandbox.tsx',
  },
}
