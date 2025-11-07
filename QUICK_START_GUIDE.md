# Quick Start Guide: Implementing Blueprint Features

**Ready to get started?** This guide walks you through implementing the 4 new features in order of priority.

---

## 🚀 Priority Order (Recommended)

1. **Virtual Scrolling** (Easiest, highest performance impact) - 1 day
2. **LaTeX/Math Rendering** (Easy, quick win) - 1 day
3. **Advanced Export** (Medium, high user value) - 2 days
4. **Conversation Branching** (Complex, highest UX impact) - 3-4 days

---

## 📋 Prerequisites

### Install Dependencies

```bash
cd /workspace
npm install --save \
  react-window \
  react-virtualized-auto-sizer \
  remark-math \
  rehype-katex \
  katex \
  jszip
```

### Update package.json

Add to `packages/react/package.json` dependencies:

```json
{
  "dependencies": {
    "react-window": "^1.8.10",
    "react-virtualized-auto-sizer": "^1.0.24",
    "remark-math": "^6.0.0",
    "rehype-katex": "^7.0.0",
    "katex": "^0.16.9",
    "jszip": "^3.10.1"
  }
}
```

---

## 1️⃣ Virtual Scrolling (Day 1)

### Step 1: Install Dependencies (5 min)

```bash
npm install react-window react-virtualized-auto-sizer
```

### Step 2: Copy Component (5 min)

The file `virtualized-message-list.tsx` is already created at:
```
packages/react/src/components/virtualized-message-list.tsx
```

### Step 3: Export in Index (5 min)

Add to `packages/react/src/index.ts`:

```typescript
// Virtual scrolling
export {
  VirtualizedMessageList,
  MessageList,
  useMessageListScroll,
  useJumpToBottom,
  useMessageListPerformance,
} from './components/virtualized-message-list'

export type {
  VirtualizedMessageListProps,
  MessageListProps,
} from './components/virtualized-message-list'
```

### Step 4: Update Existing MessageList (30 min)

Replace your current MessageList component with the smart version:

```tsx
// Before (in your current chat components)
{messages.map((msg) => (
  <MessageBubble key={msg.id} message={msg} />
))}

// After
import { MessageList } from '@clarity-chat/react'

<MessageList
  messages={messages}
  renderMessage={(msg) => <MessageBubble message={msg} />}
  virtualizationThreshold={100}
  autoScrollToBottom={true}
/>
```

### Step 5: Test (2 hours)

Create test file: `packages/react/src/components/__tests__/virtualized-message-list.test.tsx`

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MessageList } from '../virtualized-message-list'

describe('VirtualizedMessageList', () => {
  it('uses standard rendering for small lists', () => {
    const messages = Array.from({ length: 50 }, (_, i) => ({
      id: `msg-${i}`,
      role: 'user' as const,
      content: `Message ${i}`,
    }))

    render(
      <MessageList
        messages={messages}
        renderMessage={(msg) => <div>{msg.content}</div>}
      />
    )

    expect(screen.getByText('Message 0')).toBeInTheDocument()
  })

  it('uses virtualization for large lists', () => {
    const messages = Array.from({ length: 200 }, (_, i) => ({
      id: `msg-${i}`,
      role: 'user' as const,
      content: `Message ${i}`,
    }))

    render(
      <MessageList
        messages={messages}
        renderMessage={(msg) => <div>{msg.content}</div>}
        virtualizationThreshold={100}
      />
    )

    // Should render but not all messages visible
    expect(messages.length).toBe(200)
  })
})
```

### Step 6: Create Example (1 hour)

Create: `examples/virtual-scrolling-demo/`

```typescript
// examples/virtual-scrolling-demo/page.tsx
import { MessageList } from '@clarity-chat/react'
import { useState } from 'react'

export default function VirtualScrollingDemo() {
  const [messages] = useState(() => 
    Array.from({ length: 10000 }, (_, i) => ({
      id: `msg-${i}`,
      role: i % 2 === 0 ? 'user' : 'assistant',
      content: `This is message number ${i}. Testing virtual scrolling performance!`,
    }))
  )

  return (
    <div className="h-screen flex flex-col">
      <header className="p-4 bg-gray-800 text-white">
        <h1>Virtual Scrolling Demo</h1>
        <p>Rendering {messages.length.toLocaleString()} messages efficiently</p>
      </header>
      
      <div className="flex-1">
        <MessageList
          messages={messages}
          renderMessage={(msg) => (
            <div className={`p-4 ${msg.role === 'user' ? 'bg-blue-50' : 'bg-gray-50'}`}>
              <strong>{msg.role}:</strong> {msg.content}
            </div>
          )}
          virtualizationThreshold={100}
          autoScrollToBottom={false}
        />
      </div>
    </div>
  )
}
```

### ✅ Done! Virtual scrolling implemented.

---

## 2️⃣ LaTeX/Math Rendering (Day 2)

### Step 1: Install Dependencies (5 min)

```bash
npm install remark-math rehype-katex katex
```

### Step 2: Copy Component (5 min)

File already created at:
```
packages/react/src/components/markdown-renderer-enhanced.tsx
```

### Step 3: Import KaTeX CSS (10 min)

Add to your global CSS or component:

```typescript
// In markdown-renderer-enhanced.tsx (already included)
import 'katex/dist/katex.min.css'
```

Or add to your global styles:

```css
/* In packages/react/src/styles/index.css */
@import 'katex/dist/katex.min.css';
```

### Step 4: Update Exports (5 min)

Add to `packages/react/src/index.ts`:

```typescript
// Enhanced markdown with LaTeX
export {
  MarkdownRendererEnhanced,
  validateLatex,
  extractMathExpressions,
  previewLatex,
  MATH_EXAMPLES,
} from './components/markdown-renderer-enhanced'

export type {
  MarkdownRendererProps,
} from './components/markdown-renderer-enhanced'
```

### Step 5: Replace Existing Markdown Renderer (30 min)

```tsx
// Before
import ReactMarkdown from 'react-markdown'

<ReactMarkdown>{content}</ReactMarkdown>

// After
import { MarkdownRendererEnhanced } from '@clarity-chat/react'

<MarkdownRendererEnhanced
  content={content}
  enableMath={true}
  enableHighlight={true}
  showLineNumbers={true}
  enableCodeCopy={true}
/>
```

### Step 6: Test (1 hour)

```typescript
// packages/react/src/components/__tests__/markdown-renderer-enhanced.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MarkdownRendererEnhanced, validateLatex } from '../markdown-renderer-enhanced'

describe('MarkdownRendererEnhanced', () => {
  it('renders inline math', () => {
    const content = 'The formula $E = mc^2$ is famous.'
    
    render(<MarkdownRendererEnhanced content={content} enableMath={true} />)
    
    // KaTeX will render the math
    expect(screen.getByText(/The formula/)).toBeInTheDocument()
  })

  it('renders block math', () => {
    const content = '$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$'
    
    render(<MarkdownRendererEnhanced content={content} enableMath={true} />)
    
    // Math block should be rendered
    const mathElement = document.querySelector('.math-block')
    expect(mathElement).toBeTruthy()
  })

  it('validates LaTeX syntax', () => {
    expect(validateLatex('E = mc^2').valid).toBe(true)
    expect(validateLatex('E = mc^2}').valid).toBe(false) // Unmatched brace
  })
})
```

### Step 7: Create Example (1 hour)

```typescript
// examples/latex-math-demo/page.tsx
import { MarkdownRendererEnhanced, MATH_EXAMPLES } from '@clarity-chat/react'
import { useState } from 'react'

export default function LatexMathDemo() {
  const [activeExample, setActiveExample] = useState('inline')

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">LaTeX Math Rendering Demo</h1>
      
      <div className="mb-6">
        <button onClick={() => setActiveExample('inline')} className="mr-2 px-4 py-2 bg-blue-500 text-white rounded">
          Inline Math
        </button>
        <button onClick={() => setActiveExample('block')} className="mr-2 px-4 py-2 bg-blue-500 text-white rounded">
          Block Math
        </button>
        <button onClick={() => setActiveExample('complex')} className="px-4 py-2 bg-blue-500 text-white rounded">
          Complex Example
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <MarkdownRendererEnhanced
          content={MATH_EXAMPLES[activeExample]}
          enableMath={true}
          enableHighlight={true}
        />
      </div>

      <div className="mt-6 bg-gray-100 p-4 rounded">
        <h3 className="font-bold mb-2">Markdown Source:</h3>
        <pre className="text-sm overflow-x-auto">{MATH_EXAMPLES[activeExample]}</pre>
      </div>
    </div>
  )
}
```

### ✅ Done! LaTeX rendering implemented.

---

## 3️⃣ Advanced Export (Days 3-4)

### Step 1: Install Dependencies (5 min)

```bash
npm install jszip
```

### Step 2: Copy Utilities (5 min)

File already created at:
```
packages/react/src/utils/export-utils.ts
```

### Step 3: Update Exports (5 min)

Add to `packages/react/src/index.ts`:

```typescript
// Export utilities
export {
  exportConversation,
  downloadConversation,
  exportMultipleConversations,
  calculateAnalytics,
  redactSensitiveInfo,
} from './utils/export-utils'

export type {
  ExportOptions,
  ExportFormat,
  ExportTemplate,
  ConversationAnalytics,
} from './utils/export-utils'
```

### Step 4: Create Enhanced Export Dialog (2 hours)

```typescript
// packages/react/src/components/export-dialog-enhanced.tsx
import React, { useState } from 'react'
import { downloadConversation, ExportFormat, ExportTemplate } from '../utils/export-utils'
import { Message } from '@clarity-chat/types'

export interface ExportDialogEnhancedProps {
  messages: Message[]
  isOpen: boolean
  onClose: () => void
}

export function ExportDialogEnhanced({ messages, isOpen, onClose }: ExportDialogEnhancedProps) {
  const [format, setFormat] = useState<ExportFormat>('markdown')
  const [template, setTemplate] = useState<ExportTemplate>('detailed')
  const [includeAnalytics, setIncludeAnalytics] = useState(true)
  const [privacyMode, setPrivacyMode] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)
    try {
      await downloadConversation(messages, {
        format,
        template,
        includeAnalytics,
        includeTimestamps: true,
        includeMetadata: true,
        privacyMode,
        filename: `conversation-${Date.now()}`,
      })
      onClose()
    } catch (error) {
      console.error('Export failed:', error)
      alert('Export failed. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Export Conversation</h2>

        {/* Format Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Format</label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as ExportFormat)}
            className="w-full p-2 border rounded"
          >
            <option value="json">JSON (Full data)</option>
            <option value="markdown">Markdown (Readable)</option>
            <option value="html">HTML (Shareable)</option>
            <option value="pdf">PDF (Print-ready)</option>
            <option value="txt">Text (Plain)</option>
          </select>
        </div>

        {/* Template Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Template</label>
          <select
            value={template}
            onChange={(e) => setTemplate(e.target.value as ExportTemplate)}
            className="w-full p-2 border rounded"
          >
            <option value="clean">Clean (Minimal)</option>
            <option value="detailed">Detailed (Full info)</option>
            <option value="shareable">Shareable (Privacy-friendly)</option>
            <option value="analytics">Analytics (With stats)</option>
          </select>
        </div>

        {/* Options */}
        <div className="mb-4 space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={includeAnalytics}
              onChange={(e) => setIncludeAnalytics(e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm">Include analytics</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={privacyMode}
              onChange={(e) => setPrivacyMode(e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm">Privacy mode (redact sensitive info)</span>
          </label>
        </div>

        {/* Message Count */}
        <div className="mb-4 p-3 bg-gray-100 rounded">
          <p className="text-sm text-gray-600">
            Exporting {messages.length} messages
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
            disabled={isExporting}
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={isExporting}
          >
            {isExporting ? 'Exporting...' : 'Export'}
          </button>
        </div>
      </div>
    </div>
  )
}
```

### Step 5: Test (2 hours)

Create tests for all export formats and privacy mode.

### Step 6: Create Example (1 hour)

Create a demo showing all export formats with preview.

### ✅ Done! Advanced export implemented.

---

## 4️⃣ Conversation Branching (Days 5-7)

### Step 1: Copy Component (5 min)

File already created at:
```
packages/react/src/components/conversation-branch-visualizer.tsx
```

### Step 2: Update Exports (5 min)

```typescript
// Conversation branching
export {
  ConversationBranchVisualizer,
  useBranchManagement,
} from './components/conversation-branch-visualizer'

export type {
  ConversationBranch,
  BranchNode,
  ConversationBranchVisualizerProps,
} from './components/conversation-branch-visualizer'
```

### Step 3: Integrate with Message Storage (4 hours)

Update your conversation storage to support branches:

```typescript
// In your existing conversation storage
interface ConversationWithBranches {
  id: string
  branches: ConversationBranch[]
  currentBranchId: string
  messages: Record<string, Message[]> // Messages by branch ID
}
```

### Step 4: Add Branch UI to Chat (2 hours)

```typescript
// In your main chat component
import { ConversationBranchVisualizer, useBranchManagement } from '@clarity-chat/react'

function ChatApp() {
  const {
    branches,
    currentBranchId,
    createBranch,
    switchBranch,
    deleteBranch,
    renameBranch,
  } = useBranchManagement({ conversationId: 'current' })

  return (
    <div className="flex h-screen">
      {/* Sidebar with branches */}
      <aside className="w-80 border-r overflow-y-auto">
        <ConversationBranchVisualizer
          branches={branches}
          currentBranchId={currentBranchId}
          onBranchSwitch={switchBranch}
          onBranchCreate={createBranch}
          onBranchDelete={deleteBranch}
          onBranchRename={renameBranch}
        />
      </aside>

      {/* Main chat area */}
      <main className="flex-1">
        {/* Your existing chat UI */}
      </main>
    </div>
  )
}
```

### Step 5: Add "Branch from here" Button (2 hours)

Add button to each message to create a branch:

```typescript
function MessageBubble({ message }) {
  const { createBranch } = useBranchManagement({ conversationId: 'current' })

  return (
    <div className="message">
      <div className="message-content">{message.content}</div>
      <button
        onClick={() => createBranch(currentBranchId, message.id)}
        className="text-xs text-gray-500 hover:text-blue-600"
      >
        🌿 Branch from here
      </button>
    </div>
  )
}
```

### Step 6: Test (4 hours)

Comprehensive testing of branch operations, UI interactions, and edge cases.

### Step 7: Create Example (2 hours)

Full-featured branching demo with visualization.

### ✅ Done! Conversation branching implemented.

---

## 🎯 Success Checklist

After implementing all 4 features:

- [ ] Virtual scrolling works with 10,000+ messages
- [ ] LaTeX renders correctly (inline and block)
- [ ] Export works in all 5 formats
- [ ] Branch visualization displays correctly
- [ ] All tests pass (80%+ coverage)
- [ ] Examples are working
- [ ] Documentation is updated
- [ ] Performance benchmarks met

---

## 🚀 Launch Checklist

Ready to release v2.1?

- [ ] All features implemented and tested
- [ ] Documentation updated
- [ ] Examples created
- [ ] CHANGELOG.md updated
- [ ] Version bumped to 2.1.0
- [ ] Blog post drafted
- [ ] Social media content prepared
- [ ] Product Hunt submission ready

---

## 💡 Pro Tips

1. **Start with Virtual Scrolling** - Easiest and highest impact
2. **LaTeX is Quick Win** - Takes less than a day
3. **Export is Valuable** - Users love this feature
4. **Branching is Complex** - Save for last, most UX design needed

---

## 📞 Need Help?

- Check: `BLUEPRINT_ANALYSIS_AND_ENHANCEMENTS.md` for detailed specs
- Follow: `IMPLEMENTATION_ROADMAP.md` for timeline
- Review: Component code for implementation details

**You've got this! 🚀**
