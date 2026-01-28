# Reasoning/Chain-of-Thought Visualization Component Specification

**Version:** 1.0.0 **Status:** Draft **Created:** 2026-01-27 **Component Name:** `ReasoningDisplay`
/ `ChainOfThoughtVisualization`

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Research Foundation](#research-foundation)
3. [Use Cases](#use-cases)
4. [Component API](#component-api)
5. [Visual Design](#visual-design)
6. [Data Model](#data-model)
7. [User Interactions](#user-interactions)
8. [Implementation Details](#implementation-details)
9. [Integration Examples](#integration-examples)
10. [Accessibility](#accessibility)
11. [Performance Considerations](#performance-considerations)
12. [Testing Strategy](#testing-strategy)
13. [Future Enhancements](#future-enhancements)

---

## Executive Summary

The Reasoning Visualization component provides transparent insight into AI thinking processes by
displaying step-by-step reasoning, internal deliberation, and decision-making logic. This addresses
the critical need for AI transparency and builds user trust by showing **how** the AI reached its
conclusion, not just **what** it concluded.

### Key Features

- **Progressive Disclosure:** Reasoning collapsed by default, expandable on demand
- **Step-by-Step Visualization:** Clear visual hierarchy of thinking steps
- **Contextual Display:** Embedded within message flow or standalone panel
- **Multiple Formats:** Support for text reasoning, structured steps, and reflection
- **Responsive Design:** Adapts from mobile to desktop
- **Accessibility First:** Keyboard navigation, screen reader support, ARIA labels

### Primary Value Propositions

1. **Transparency:** Users understand AI decision-making process
2. **Trust:** Visible reasoning builds confidence in AI responses
3. **Education:** Users learn how to think about complex problems
4. **Debugging:** Developers identify issues in AI logic
5. **Quality Assurance:** Verify AI is using correct information and logic

---

## Research Foundation

### Competitor Analysis

#### Vercel AI SDK - Message Parts System

Vercel AI SDK includes reasoning as a **message part type**:

```typescript
type UIMessagePart =
  | { type: 'text'; text: string }
  | { type: 'reasoning'; text: string } // 👈 Native reasoning support
  | { type: 'tool-call'; toolName: string; args: unknown; toolCallId: string }
  | { type: 'tool-result'; toolName: string; result: unknown; toolCallId: string }
```

**Key Insight:** Reasoning is a first-class message component, not an afterthought.

**Pattern to Adopt:**

- Treat reasoning as a distinct message part with its own rendering logic
- Support reasoning within streaming responses (progressive disclosure)
- Enable metadata tracking (token usage, timing)

#### Prompt Kit - Chain of Thought Component

Prompt Kit provides dedicated `ChainOfThought` and `Reasoning` components:

**Features:**

- Collapsible sections to reduce visual clutter
- Step-by-step thinking visualization
- Visual distinction from regular message content
- Integration with message actions (copy, expand, collapse)

**Pattern to Adopt:**

- Collapsible by default with expand/collapse controls
- Visual differentiation (background color, border, icon)
- Clear labeling ("AI Reasoning", "Thinking Steps")
- Smooth expand/collapse animations

### Internal Architecture

Clarity already implements Chain-of-Thought prompting
(`apps/streamlined-docs/lib/ai/prompts/cot.ts`):

```typescript
export function generateCoTPrompt(
  query: string,
  complexity: QueryComplexity,
  context: string[]
): CoTPrompt {
  // Simple queries: Direct answers
  // Moderate queries: Structured thinking
  // Complex queries: Full Chain-of-Thought reasoning
}
```

**Complexity Levels:**

- **Simple:** Direct, concise answers (no reasoning needed)
- **Moderate:** Structured steps (1-3 steps)
- **Complex:** Full CoT with sub-questions and synthesis (3-7 steps)

**Pattern to Adopt:**

- Component adapts visual complexity based on reasoning depth
- Simple reasoning: Single collapsible section
- Complex reasoning: Multi-step accordion or stepper UI

### Research-Backed Prompting

From `cot.ts` comments:

> "Let's think step by step" significantly improves reasoning accuracy (Kojima et al., 2022 - Large
> Language Models are Zero-Shot Reasoners)

**Reflective CoT Pattern:**

```
Initial reasoning → Reflection → Revised answer
```

**Pattern to Adopt:**

- Support both linear and reflective reasoning patterns
- Show revision process when AI corrects itself
- Highlight differences between initial and refined answers

---

## Use Cases

### 1. Documentation Assistant (Current Implementation)

**Scenario:** User asks complex question about component integration

**Reasoning Display:**

```
🧠 How I arrived at this answer:

Step 1: Understanding the question
  → Breaking down "integrate with Next.js App Router"
  → Identifying key requirements: SSR, streaming, route handlers

Step 2: Analyzing the documentation
  → Found: App Router integration guide (page 42)
  → Found: Streaming setup examples (page 58)
  → Found: API route patterns (page 63)

Step 3: Providing a comprehensive answer
  → Synthesizing installation + configuration + examples
  → Verifying compatibility with Next.js 15

✅ Final Answer: [Complete answer with code examples]
```

### 2. Code Review Assistant

**Scenario:** AI suggests refactoring approach

**Reasoning Display:**

```
💡 My reasoning for this recommendation:

1. Identified Issue
   Performance bottleneck in MessageList rendering
   → Causing re-renders on every parent update
   → Not using React.memo for memoization

2. Considered Alternatives
   ✓ React.memo (simplest, most effective)
   ✗ useMemo for entire component (unnecessary complexity)
   ✗ Virtual scrolling (overkill for <100 messages)

3. Decision
   Chose React.memo because:
   → Minimal code change
   → Proven performance improvement
   → Maintains code readability

Risk: None (backwards compatible)
```

### 3. Troubleshooting Assistant

**Scenario:** User reports component not rendering

**Reasoning Display:**

```
🔍 Troubleshooting steps:

Initial hypothesis: Missing import or props
  ❌ Checked imports → All correct
  ❌ Checked props → Valid types

Reflection: Could be CSS issue
  ✅ Found: Component has width: 0 (hidden)
  → Parent container has display: none

Root cause: Conditional rendering logic bug
  → Component rendered but not visible

Solution: Fix parent container display logic
```

### 4. Multi-Step Tool Execution

**Scenario:** AI uses multiple tools to answer question

**Reasoning Display:**

```
⚙️ Tools I used to answer:

Step 1: Search documentation
   → Tool: searchDocs("token optimization")
   → Result: 15 relevant pages found

Step 2: Retrieve specific examples
   → Tool: getCodeExample("useTokenBudget")
   → Result: 3 example implementations

Step 3: Calculate token estimates
   → Tool: estimateTokens(userPrompt)
   → Result: 1,247 tokens

Synthesis: Combined search results + examples + calculations
```

---

## Component API

### Core Component: `ReasoningDisplay`

```typescript
import React from 'react'

export interface ReasoningStep {
  /** Unique step identifier */
  id: string

  /** Step number (1, 2, 3...) */
  stepNumber: number

  /** Step title/summary */
  title: string

  /** Detailed reasoning content */
  content: string

  /** Step type */
  type: 'analysis' | 'hypothesis' | 'decision' | 'reflection' | 'tool-execution'

  /** Visual indicator */
  status?: 'thinking' | 'complete' | 'revised' | 'error'

  /** Metadata */
  metadata?: {
    tokensUsed?: number
    duration?: number
    confidence?: number
    sources?: string[]
  }

  /** Nested sub-steps */
  substeps?: ReasoningStep[]
}

export interface ReasoningDisplayProps {
  /** Reasoning steps */
  steps: ReasoningStep[]

  /** Overall reasoning summary */
  summary?: string

  /** Initial collapsed/expanded state */
  defaultCollapsed?: boolean

  /** Show/hide toggle button */
  collapsible?: boolean

  /** Display mode */
  mode?: 'inline' | 'panel' | 'sidebar'

  /** Visual theme */
  theme?: 'light' | 'dark' | 'auto'

  /** Complexity level (affects visual presentation) */
  complexity?: 'simple' | 'moderate' | 'complex'

  /** Show metadata (tokens, timing) */
  showMetadata?: boolean

  /** Show step numbers */
  showStepNumbers?: boolean

  /** Animation on expand/collapse */
  animated?: boolean

  /** Custom icon for reasoning header */
  icon?: React.ReactNode

  /** Callback when user expands/collapses */
  onToggle?: (isExpanded: boolean) => void

  /** Callback when user copies reasoning */
  onCopy?: (steps: ReasoningStep[]) => void

  /** Additional CSS classes */
  className?: string

  /** Aria label */
  ariaLabel?: string
}

export function ReasoningDisplay({
  steps,
  summary,
  defaultCollapsed = true,
  collapsible = true,
  mode = 'inline',
  theme = 'auto',
  complexity = 'moderate',
  showMetadata = false,
  showStepNumbers = true,
  animated = true,
  icon,
  onToggle,
  onCopy,
  className,
  ariaLabel = 'AI reasoning process',
}: ReasoningDisplayProps): JSX.Element
```

### Alternative: Simpler Text-Based Reasoning

```typescript
export interface SimpleReasoningProps {
  /** Raw reasoning text */
  reasoning: string

  /** Initial collapsed state */
  defaultCollapsed?: boolean

  /** Additional props */
  className?: string
  onToggle?: (isExpanded: boolean) => void
}

export function SimpleReasoning({
  reasoning,
  defaultCollapsed = true,
  className,
  onToggle,
}: SimpleReasoningProps): JSX.Element
```

### Integration with Message Component

```typescript
import type { ReasoningStep } from '@clarity-chat/react'

export interface MessagePart {
  type: 'text' | 'reasoning' | 'tool-call' | 'tool-result' | 'file'

  // Text part
  text?: string

  // Reasoning part
  reasoning?: {
    steps: ReasoningStep[]
    summary?: string
  }

  // Tool call part
  toolCall?: {
    toolName: string
    args: unknown
    result?: unknown
  }

  // File part
  file?: {
    fileName: string
    fileUrl: string
    mediaType: string
  }
}

export interface MessageProps {
  /** Message ID */
  id: string

  /** Message role */
  role: 'user' | 'assistant' | 'system'

  /** Message parts (multi-part messages) */
  parts: MessagePart[]

  /** Show reasoning inline or in popover */
  reasoningDisplay?: 'inline' | 'popover' | 'sidebar'
}
```

---

## Visual Design

### Design Principles

1. **Progressive Disclosure:** Collapsed by default to reduce cognitive load
2. **Clear Visual Hierarchy:** Distinct from message content
3. **Scannable:** Step numbers, icons, and formatting aid quick comprehension
4. **Accessible:** High contrast, keyboard navigation, screen reader support
5. **Responsive:** Adapts from mobile (320px) to desktop (2560px+)

### Layout Patterns

#### Pattern 1: Inline Collapsible Section

```
┌─────────────────────────────────────────┐
│ 🤖 Assistant                            │
│                                         │
│ [Final answer content here...]          │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ 🧠 Show reasoning ▼                 │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘

[User clicks "Show reasoning"]

┌─────────────────────────────────────────┐
│ 🤖 Assistant                            │
│                                         │
│ [Final answer content here...]          │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ 🧠 Reasoning ▲                      │ │
│ │                                     │ │
│ │ Step 1: Understanding the question  │ │
│ │ → Breaking down key requirements    │ │
│ │                                     │ │
│ │ Step 2: Analyzing documentation     │ │
│ │ → Found: Installation guide (p.12)  │ │
│ │ → Found: API reference (p.34)       │ │
│ │                                     │ │
│ │ Step 3: Providing comprehensive...  │ │
│ │ → Synthesizing examples + API docs  │ │
│ │                                     │ │
│ │ [Copy Reasoning] [Collapse]         │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

#### Pattern 2: Sidebar Panel

```
┌──────────────────┬─────────────────────┐
│ 🤖 Assistant     │ 🧠 Reasoning        │
│                  │                     │
│ [Answer here...] │ Step 1: Analysis    │
│                  │ → Identified key... │
│                  │                     │
│                  │ Step 2: Synthesis   │
│                  │ → Combined docs...  │
│                  │                     │
│                  │ [Copy] [Close]      │
└──────────────────┴─────────────────────┘
```

#### Pattern 3: Popover/Tooltip

```
┌─────────────────────────────────────────┐
│ 🤖 Assistant              [🧠 Why?]     │
│                               ↓         │
│ [Answer here...]    ┌──────────────────┐│
│                     │ Step 1: I...     ││
│                     │ Step 2: Then...  ││
│                     │                  ││
│                     │ [Copy] [✕]       ││
│                     └──────────────────┘│
└─────────────────────────────────────────┘
```

### Visual Elements

#### Step Indicator

```
┌─────────────────────────────────────┐
│ 1️⃣ Step 1: Understanding            │
│    → Identified key requirements    │
│    → Breaking down sub-questions    │
└─────────────────────────────────────┘
```

#### Status Icons

- 🧠 Thinking/Analysis
- ✅ Complete
- 🔄 Revised
- ⚠️ Warning/Caveat
- 🔍 Investigation
- 💡 Insight
- ⚙️ Tool execution
- 📚 Research

#### Metadata Display

```
┌─────────────────────────────────────┐
│ Step 2: Analyzing documentation     │
│ → Found 15 relevant pages           │
│ → Extracted 3 code examples         │
│                                     │
│ 📊 245 tokens • 1.2s • 89% confidence│
└─────────────────────────────────────┘
```

### Color System

**Light Mode:**

- Background: `bg-blue-50` (subtle blue tint)
- Border: `border-blue-200`
- Text: `text-gray-800`
- Step numbers: `text-blue-600`
- Icons: `text-blue-500`

**Dark Mode:**

- Background: `bg-blue-950/30`
- Border: `border-blue-800`
- Text: `text-gray-100`
- Step numbers: `text-blue-400`
- Icons: `text-blue-400`

**Accessibility:**

- All text meets WCAG 2.1 AA contrast (4.5:1 minimum)
- Step numbers and icons are supplementary (not sole indicators)

### Typography

- **Step Titles:** `text-sm font-medium`
- **Step Content:** `text-sm font-normal`
- **Metadata:** `text-xs text-muted-foreground`
- **Summary:** `text-sm font-semibold`

### Spacing

- **Container Padding:** `p-4`
- **Step Spacing:** `space-y-3`
- **Substep Indentation:** `ml-4` or `pl-4`
- **Border Radius:** `rounded-md`

### Responsive Breakpoints

```tsx
// Mobile (< 640px)
<div className="w-full p-3 text-sm">
  {/* Compact view, minimal metadata */}
</div>

// Tablet (640px - 1024px)
<div className="w-full p-4 text-sm">
  {/* Standard view, show key metadata */}
</div>

// Desktop (> 1024px)
<div className="max-w-2xl p-4 text-base">
  {/* Full view, all metadata visible */}
</div>
```

---

## Data Model

### Message Format with Reasoning

```typescript
export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string

  /** Multi-part message support */
  parts?: MessagePart[]

  /** Metadata */
  metadata?: {
    tokensUsed?: number
    duration?: number
    model?: string
    timestamp?: Date
  }
}

export interface MessagePart {
  type: 'text' | 'reasoning' | 'tool-call' | 'tool-result'

  // Text part
  text?: string

  // Reasoning part
  reasoning?: ReasoningData

  // Tool call part
  toolCall?: ToolCallData

  // Tool result part
  toolResult?: ToolResultData
}

export interface ReasoningData {
  /** Type of reasoning */
  type: 'linear' | 'reflective' | 'multi-step'

  /** Reasoning steps */
  steps: ReasoningStep[]

  /** Overall summary */
  summary?: string

  /** Complexity level */
  complexity: 'simple' | 'moderate' | 'complex'

  /** Metadata */
  metadata?: {
    totalTokens?: number
    duration?: number
    confidence?: number
  }
}

export interface ReasoningStep {
  id: string
  stepNumber: number
  title: string
  content: string
  type: 'analysis' | 'hypothesis' | 'decision' | 'reflection' | 'tool-execution'
  status?: 'thinking' | 'complete' | 'revised' | 'error'

  /** Nested substeps */
  substeps?: ReasoningStep[]

  /** Metadata per step */
  metadata?: {
    tokensUsed?: number
    duration?: number
    confidence?: number
    sources?: string[]
  }
}
```

### Example Data Structure

```typescript
const messageWithReasoning: Message = {
  id: 'msg-123',
  role: 'assistant',
  content: '', // Empty for multi-part
  parts: [
    {
      type: 'reasoning',
      reasoning: {
        type: 'multi-step',
        complexity: 'complex',
        summary: 'Analyzed documentation and synthesized comprehensive answer',
        steps: [
          {
            id: 'step-1',
            stepNumber: 1,
            title: 'Understanding the question',
            content: 'Breaking down "integrate with Next.js App Router"',
            type: 'analysis',
            status: 'complete',
            substeps: [
              {
                id: 'substep-1-1',
                stepNumber: 1,
                title: 'Identified key requirements',
                content: 'SSR, streaming, route handlers',
                type: 'analysis',
                status: 'complete',
              },
            ],
          },
          {
            id: 'step-2',
            stepNumber: 2,
            title: 'Analyzing the documentation',
            content: 'Searching for relevant integration guides',
            type: 'tool-execution',
            status: 'complete',
            metadata: {
              tokensUsed: 450,
              duration: 1200,
              sources: ['page-42', 'page-58', 'page-63'],
            },
          },
          {
            id: 'step-3',
            stepNumber: 3,
            title: 'Providing comprehensive answer',
            content: 'Synthesizing installation steps, configuration, and examples',
            type: 'decision',
            status: 'complete',
          },
        ],
        metadata: {
          totalTokens: 1247,
          duration: 3400,
          confidence: 0.92,
        },
      },
    },
    {
      type: 'text',
      text: 'To integrate Clarity Chat with Next.js App Router, follow these steps:\n\n1. Install dependencies...',
    },
  ],
  metadata: {
    tokensUsed: 2100,
    duration: 4500,
    model: 'gpt-4o',
    timestamp: new Date(),
  },
}
```

---

## User Interactions

### 1. Expand/Collapse

**Trigger:** Click on header or toggle button

**Behavior:**

- Smooth animation (200ms ease-in-out)
- Icon rotates (▼ → ▲)
- Content slides down/up
- Focus moves to first step when expanding
- ARIA attributes update (`aria-expanded`)

**Keyboard:**

- `Enter` or `Space`: Toggle expand/collapse
- `Tab`: Focus next interactive element
- `Shift+Tab`: Focus previous element

### 2. Copy Reasoning

**Trigger:** Click "Copy" button

**Behavior:**

- Copies formatted reasoning text to clipboard
- Shows temporary success toast ("Reasoning copied!")
- Formats steps as plain text or markdown

**Copied Format:**

```markdown
🧠 AI Reasoning

Step 1: Understanding the question → Breaking down key requirements → Identifying components needed

Step 2: Analyzing documentation → Found: Installation guide (page 12) → Found: API reference
(page 34)

Step 3: Providing comprehensive answer → Synthesized examples + API documentation
```

### 3. Step Navigation (Complex Reasoning)

**Trigger:** Click on step headers (accordion mode)

**Behavior:**

- Each step is individually collapsible
- Substeps indent and nest visually
- Only one top-level step expanded at a time (optional)

### 4. Metadata Toggle

**Trigger:** Click "Show details" or info icon

**Behavior:**

- Reveals token usage, timing, confidence
- Inline or popover display
- Accessible via keyboard

### 5. Link to Sources

**Trigger:** Click on source citation

**Behavior:**

- Opens documentation page or section
- Highlights referenced content
- Accessible via keyboard

---

## Implementation Details

### File Structure

```
packages/react/src/components/reasoning/
├── ReasoningDisplay.tsx           # Main component
├── ReasoningStep.tsx              # Individual step
├── SimpleReasoning.tsx            # Simplified text version
├── ReasoningHeader.tsx            # Collapsible header
├── ReasoningMetadata.tsx          # Metadata display
├── reasoning.types.ts             # TypeScript types
├── reasoning.utils.ts             # Utility functions
└── __tests__/
    ├── ReasoningDisplay.test.tsx
    ├── ReasoningStep.test.tsx
    └── reasoning.utils.test.tsx
```

### Core Component Implementation

```tsx
// packages/react/src/components/reasoning/ReasoningDisplay.tsx

import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDownIcon, ChevronUpIcon, BrainIcon, CopyIcon } from 'lucide-react'
import { cn } from '@clarity-chat/primitives'
import { ReasoningStep } from './ReasoningStep'
import { ReasoningMetadata } from './ReasoningMetadata'
import type { ReasoningDisplayProps, ReasoningStep as Step } from './reasoning.types'

export function ReasoningDisplay({
  steps,
  summary,
  defaultCollapsed = true,
  collapsible = true,
  mode = 'inline',
  theme = 'auto',
  complexity = 'moderate',
  showMetadata = false,
  showStepNumbers = true,
  animated = true,
  icon,
  onToggle,
  onCopy,
  className,
  ariaLabel = 'AI reasoning process',
}: ReasoningDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(!defaultCollapsed)

  const handleToggle = useCallback(() => {
    const newState = !isExpanded
    setIsExpanded(newState)
    onToggle?.(newState)
  }, [isExpanded, onToggle])

  const handleCopy = useCallback(() => {
    const text = formatReasoningAsText(steps, summary)
    navigator.clipboard.writeText(text)
    onCopy?.(steps)
    // Show toast notification
  }, [steps, summary, onCopy])

  const ToggleIcon = isExpanded ? ChevronUpIcon : ChevronDownIcon

  return (
    <div
      className={cn(
        'reasoning-display rounded-md border',
        'bg-blue-50 dark:bg-blue-950/30',
        'border-blue-200 dark:border-blue-800',
        mode === 'sidebar' && 'h-full overflow-y-auto',
        className
      )}
      role="region"
      aria-label={ariaLabel}
    >
      {/* Header */}
      <button
        onClick={handleToggle}
        disabled={!collapsible}
        className={cn(
          'flex w-full items-center justify-between p-4',
          'text-sm font-medium',
          'text-gray-800 dark:text-gray-100',
          collapsible && 'hover:bg-blue-100/50 dark:hover:bg-blue-900/20',
          'transition-colors duration-150',
          'focus-visible:outline-none focus-visible:ring-2',
          'focus-visible:ring-blue-500 focus-visible:ring-offset-2'
        )}
        aria-expanded={isExpanded}
        aria-controls="reasoning-content"
      >
        <div className="flex items-center gap-2">
          {icon || <BrainIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
          <span>{isExpanded ? 'Reasoning' : 'Show reasoning'}</span>
          {summary && !isExpanded && (
            <span className="text-xs text-muted-foreground">· {steps.length} steps</span>
          )}
        </div>
        {collapsible && <ToggleIcon className="h-4 w-4" aria-hidden="true" />}
      </button>

      {/* Content */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            id="reasoning-content"
            initial={animated ? { height: 0, opacity: 0 } : {}}
            animate={animated ? { height: 'auto', opacity: 1 } : {}}
            exit={animated ? { height: 0, opacity: 0 } : {}}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="border-t border-blue-200 dark:border-blue-800 p-4 space-y-3">
              {/* Summary */}
              {summary && (
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">{summary}</p>
              )}

              {/* Steps */}
              <div className="space-y-3">
                {steps.map((step) => (
                  <ReasoningStep
                    key={step.id}
                    step={step}
                    showStepNumber={showStepNumbers}
                    showMetadata={showMetadata}
                    complexity={complexity}
                  />
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={handleCopy}
                  className={cn(
                    'inline-flex items-center gap-1.5 px-3 py-1.5',
                    'text-xs font-medium rounded-md',
                    'bg-blue-100 dark:bg-blue-900/30',
                    'text-blue-700 dark:text-blue-300',
                    'hover:bg-blue-200 dark:hover:bg-blue-800/40',
                    'transition-colors duration-150',
                    'focus-visible:outline-none focus-visible:ring-2',
                    'focus-visible:ring-blue-500'
                  )}
                  aria-label="Copy reasoning to clipboard"
                >
                  <CopyIcon className="h-3 w-3" aria-hidden="true" />
                  Copy Reasoning
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Utility: Format reasoning as text
function formatReasoningAsText(steps: Step[], summary?: string): string {
  let text = '🧠 AI Reasoning\n\n'

  if (summary) {
    text += `${summary}\n\n`
  }

  steps.forEach((step) => {
    text += `Step ${step.stepNumber}: ${step.title}\n`
    text += `${step.content}\n`

    if (step.substeps) {
      step.substeps.forEach((substep) => {
        text += `  → ${substep.title}\n`
        text += `    ${substep.content}\n`
      })
    }

    text += '\n'
  })

  return text.trim()
}

ReasoningDisplay.displayName = 'ReasoningDisplay'
```

### Individual Step Component

```tsx
// packages/react/src/components/reasoning/ReasoningStep.tsx

import React from 'react'
import { CheckCircleIcon, RefreshCwIcon, AlertCircleIcon } from 'lucide-react'
import { cn } from '@clarity-chat/primitives'
import { ReasoningMetadata } from './ReasoningMetadata'
import type { ReasoningStep as Step } from './reasoning.types'

interface ReasoningStepProps {
  step: Step
  showStepNumber?: boolean
  showMetadata?: boolean
  complexity?: 'simple' | 'moderate' | 'complex'
}

export function ReasoningStep({
  step,
  showStepNumber = true,
  showMetadata = false,
  complexity = 'moderate',
}: ReasoningStepProps) {
  const StatusIcon = getStatusIcon(step.status)

  return (
    <div
      className={cn(
        'reasoning-step space-y-2',
        step.substeps && step.substeps.length > 0 && 'pb-2'
      )}
    >
      {/* Step Header */}
      <div className="flex items-start gap-2">
        {showStepNumber && (
          <span className="flex-shrink-0 font-semibold text-blue-600 dark:text-blue-400">
            {step.stepNumber}.
          </span>
        )}
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-medium text-gray-800 dark:text-gray-100">{step.title}</h4>
            {step.status && StatusIcon && (
              <StatusIcon
                className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400"
                aria-label={`Status: ${step.status}`}
              />
            )}
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-200">{step.content}</p>
        </div>
      </div>

      {/* Substeps */}
      {step.substeps && step.substeps.length > 0 && (
        <div className="ml-6 space-y-2 border-l-2 border-blue-200 dark:border-blue-800 pl-4">
          {step.substeps.map((substep) => (
            <div key={substep.id} className="text-sm text-gray-600 dark:text-gray-300">
              <span className="text-blue-500 dark:text-blue-400">→</span> {substep.content}
            </div>
          ))}
        </div>
      )}

      {/* Metadata */}
      {showMetadata && step.metadata && (
        <ReasoningMetadata metadata={step.metadata} className="ml-6" />
      )}
    </div>
  )
}

function getStatusIcon(status?: string) {
  switch (status) {
    case 'complete':
      return CheckCircleIcon
    case 'revised':
      return RefreshCwIcon
    case 'error':
      return AlertCircleIcon
    default:
      return null
  }
}

ReasoningStep.displayName = 'ReasoningStep'
```

### Metadata Component

```tsx
// packages/react/src/components/reasoning/ReasoningMetadata.tsx

import React from 'react'
import { ClockIcon, ZapIcon, TargetIcon } from 'lucide-react'
import { cn } from '@clarity-chat/primitives'
import { formatDuration } from '@clarity-chat/utils'

interface ReasoningMetadataProps {
  metadata: {
    tokensUsed?: number
    duration?: number
    confidence?: number
    sources?: string[]
  }
  className?: string
}

export function ReasoningMetadata({ metadata, className }: ReasoningMetadataProps) {
  const { tokensUsed, duration, confidence, sources } = metadata

  return (
    <div
      className={cn('flex flex-wrap items-center gap-3 text-xs text-muted-foreground', className)}
    >
      {tokensUsed && (
        <div className="flex items-center gap-1">
          <ZapIcon className="h-3 w-3" aria-hidden="true" />
          <span>{tokensUsed.toLocaleString()} tokens</span>
        </div>
      )}

      {duration && (
        <div className="flex items-center gap-1">
          <ClockIcon className="h-3 w-3" aria-hidden="true" />
          <span>{formatDuration(duration)}</span>
        </div>
      )}

      {confidence && (
        <div className="flex items-center gap-1">
          <TargetIcon className="h-3 w-3" aria-hidden="true" />
          <span>{Math.round(confidence * 100)}% confidence</span>
        </div>
      )}

      {sources && sources.length > 0 && (
        <div className="flex items-center gap-1">
          <span>📚 {sources.length} sources</span>
        </div>
      )}
    </div>
  )
}

ReasoningMetadata.displayName = 'ReasoningMetadata'
```

---

## Integration Examples

### Example 1: Simple Usage

```tsx
import { ReasoningDisplay } from '@clarity-chat/react'

function ChatMessage({ message }) {
  const reasoningPart = message.parts.find((p) => p.type === 'reasoning')

  return (
    <div className="chat-message">
      {/* Regular message content */}
      <div>{message.content}</div>

      {/* Reasoning display */}
      {reasoningPart && (
        <ReasoningDisplay
          steps={reasoningPart.reasoning.steps}
          summary={reasoningPart.reasoning.summary}
          defaultCollapsed={true}
        />
      )}
    </div>
  )
}
```

### Example 2: With Vercel AI SDK

```tsx
import { useChat } from '@ai-sdk/react'
import { ReasoningDisplay } from '@clarity-chat/react'

function Chat() {
  const { messages } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  })

  return (
    <div>
      {messages.map((msg) => (
        <div key={msg.id}>
          {msg.parts.map((part, i) => {
            if (part.type === 'reasoning') {
              return (
                <ReasoningDisplay
                  key={i}
                  steps={parseReasoningSteps(part.text)}
                  showMetadata={true}
                />
              )
            }

            if (part.type === 'text') {
              return <div key={i}>{part.text}</div>
            }

            return null
          })}
        </div>
      ))}
    </div>
  )
}

// Helper: Parse reasoning text into steps
function parseReasoningSteps(reasoningText: string): ReasoningStep[] {
  // Implementation depends on format
  // Could be JSON, markdown, or plain text
}
```

### Example 3: Custom Streaming Implementation

```tsx
import { useState } from 'react'
import { ReasoningDisplay } from '@clarity-chat/react'

function StreamingReasoning() {
  const [steps, setSteps] = useState<ReasoningStep[]>([])

  async function handleStream() {
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ query: 'Complex question' }),
    })

    const reader = response.body.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value)
      const lines = chunk.split('\n')

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = JSON.parse(line.slice(6))

          if (data.type === 'reasoning-step') {
            setSteps((prev) => [...prev, data.step])
          }
        }
      }
    }
  }

  return (
    <div>
      <button onClick={handleStream}>Start Reasoning</button>
      {steps.length > 0 && <ReasoningDisplay steps={steps} defaultCollapsed={false} />}
    </div>
  )
}
```

### Example 4: Server Component (Next.js)

```tsx
// app/chat/[id]/page.tsx (Server Component)
import { ReasoningDisplay } from '@clarity-chat/react'
import { getConversation } from '@/lib/db'

export default async function ConversationPage({ params }) {
  const conversation = await getConversation(params.id)

  return (
    <div>
      {conversation.messages.map((msg) => (
        <div key={msg.id}>
          <p>{msg.content}</p>

          {msg.reasoning && (
            <ReasoningDisplay
              steps={msg.reasoning.steps}
              summary={msg.reasoning.summary}
              showMetadata={true}
            />
          )}
        </div>
      ))}
    </div>
  )
}
```

---

## Accessibility

### WCAG 2.1 AA Compliance

#### 1. Keyboard Navigation

- **Tab:** Focus reasoning header
- **Enter/Space:** Expand/collapse reasoning
- **Tab:** Navigate through steps and actions
- **Escape:** Collapse reasoning (if expanded)

#### 2. Screen Reader Support

```tsx
// ARIA attributes
<div
  role="region"
  aria-label="AI reasoning process"
  aria-live="polite" // Announce updates
>
  <button
    aria-expanded={isExpanded}
    aria-controls="reasoning-content"
    aria-label={isExpanded ? 'Hide reasoning' : 'Show reasoning'}
  >
    {/* Toggle button */}
  </button>

  <div id="reasoning-content" role="list">
    {steps.map((step) => (
      <div key={step.id} role="listitem">
        <h4 id={`step-${step.id}-title`}>
          Step {step.stepNumber}: {step.title}
        </h4>
        <p aria-labelledby={`step-${step.id}-title`}>{step.content}</p>
      </div>
    ))}
  </div>
</div>
```

#### 3. Color Contrast

- Text: 4.5:1 minimum (WCAG AA)
- Interactive elements: 3:1 minimum
- Icons supplementary (not sole indicators)

#### 4. Focus Management

```tsx
// Focus first step when expanding
useEffect(() => {
  if (isExpanded && firstStepRef.current) {
    firstStepRef.current.focus()
  }
}, [isExpanded])
```

#### 5. Reduced Motion

```tsx
import { useReducedMotion } from '@clarity-chat/utils'

function ReasoningDisplay({ animated = true, ...props }) {
  const prefersReducedMotion = useReducedMotion()
  const shouldAnimate = animated && !prefersReducedMotion

  return (
    <motion.div
      initial={shouldAnimate ? { opacity: 0 } : {}}
      animate={shouldAnimate ? { opacity: 1 } : {}}
      transition={{ duration: shouldAnimate ? 0.2 : 0 }}
    >
      {/* Content */}
    </motion.div>
  )
}
```

---

## Performance Considerations

### 1. Lazy Rendering

```tsx
// Only render reasoning when expanded
{
  isExpanded && <ReasoningContent steps={steps} />
}
```

### 2. Virtualization for Long Reasoning

```tsx
import { useVirtualizer } from '@tanstack/react-virtual'

function LongReasoning({ steps }) {
  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: steps.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80,
  })

  return (
    <div ref={parentRef} style={{ height: '400px', overflow: 'auto' }}>
      {/* Virtual items */}
    </div>
  )
}
```

### 3. Memoization

```tsx
const ReasoningDisplay = React.memo(function ReasoningDisplay(props) {
  // Component implementation
})

const formatSteps = useMemo(() => {
  return steps.map((s) => formatStep(s))
}, [steps])
```

### 4. Code Splitting

```tsx
// Lazy load reasoning component
const ReasoningDisplay = React.lazy(() => import('./ReasoningDisplay'))

function Message({ message }) {
  return (
    <div>
      <Suspense fallback={<ReasoningSkeleton />}>
        {message.reasoning && <ReasoningDisplay {...message.reasoning} />}
      </Suspense>
    </div>
  )
}
```

### 5. Streaming Optimization

```tsx
// Batch step updates to reduce re-renders
const [steps, setSteps] = useState([])
const stepsBuffer = useRef([])

useEffect(() => {
  const flushInterval = setInterval(() => {
    if (stepsBuffer.current.length > 0) {
      setSteps((prev) => [...prev, ...stepsBuffer.current])
      stepsBuffer.current = []
    }
  }, 100) // Flush every 100ms

  return () => clearInterval(flushInterval)
}, [])

function addStep(step) {
  stepsBuffer.current.push(step)
}
```

---

## Testing Strategy

### 1. Unit Tests

```tsx
// __tests__/ReasoningDisplay.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { ReasoningDisplay } from '../ReasoningDisplay'

describe('ReasoningDisplay', () => {
  const mockSteps = [
    {
      id: '1',
      stepNumber: 1,
      title: 'Analysis',
      content: 'Analyzing question',
      type: 'analysis',
    },
  ]

  it('renders in collapsed state by default', () => {
    render(<ReasoningDisplay steps={mockSteps} />)
    expect(screen.queryByText('Analysis')).not.toBeInTheDocument()
  })

  it('expands when toggle button clicked', () => {
    render(<ReasoningDisplay steps={mockSteps} />)

    fireEvent.click(screen.getByRole('button', { name: /show reasoning/i }))

    expect(screen.getByText('Analysis')).toBeInTheDocument()
  })

  it('calls onToggle callback', () => {
    const onToggle = vi.fn()
    render(<ReasoningDisplay steps={mockSteps} onToggle={onToggle} />)

    fireEvent.click(screen.getByRole('button', { name: /show reasoning/i }))

    expect(onToggle).toHaveBeenCalledWith(true)
  })

  it('copies reasoning to clipboard', async () => {
    const writeText = vi.fn()
    Object.assign(navigator, {
      clipboard: { writeText },
    })

    render(<ReasoningDisplay steps={mockSteps} defaultCollapsed={false} />)

    fireEvent.click(screen.getByRole('button', { name: /copy reasoning/i }))

    expect(writeText).toHaveBeenCalled()
  })
})
```

### 2. Integration Tests

```tsx
// __tests__/integration/MessageWithReasoning.test.tsx
import { render, screen } from '@testing-library/react'
import { ChatMessage } from '@/components/ChatMessage'

describe('Message with Reasoning', () => {
  it('displays reasoning alongside message content', () => {
    const message = {
      id: '1',
      role: 'assistant',
      parts: [
        { type: 'reasoning', reasoning: { steps: mockSteps } },
        { type: 'text', text: 'Final answer' },
      ],
    }

    render(<ChatMessage message={message} />)

    expect(screen.getByText('Final answer')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /show reasoning/i })).toBeInTheDocument()
  })
})
```

### 3. Accessibility Tests

```tsx
import { axe } from 'jest-axe'

describe('ReasoningDisplay Accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<ReasoningDisplay steps={mockSteps} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('supports keyboard navigation', () => {
    render(<ReasoningDisplay steps={mockSteps} />)

    const button = screen.getByRole('button')
    button.focus()

    expect(document.activeElement).toBe(button)

    fireEvent.keyDown(button, { key: 'Enter' })
    expect(screen.getByText('Analysis')).toBeInTheDocument()
  })
})
```

### 4. Visual Regression Tests (Playwright)

```tsx
// e2e/reasoning-display.spec.ts
import { test, expect } from '@playwright/test'

test.describe('ReasoningDisplay Visual', () => {
  test('collapsed state', async ({ page }) => {
    await page.goto('/examples/reasoning')
    await expect(page.locator('.reasoning-display')).toHaveScreenshot('collapsed.png')
  })

  test('expanded state', async ({ page }) => {
    await page.goto('/examples/reasoning')
    await page.click('button:has-text("Show reasoning")')
    await expect(page.locator('.reasoning-display')).toHaveScreenshot('expanded.png')
  })
})
```

### 5. Performance Tests

```tsx
import { render } from '@testing-library/react'

describe('ReasoningDisplay Performance', () => {
  it('renders 100 steps without performance degradation', () => {
    const manySteps = Array.from({ length: 100 }, (_, i) => ({
      id: `step-${i}`,
      stepNumber: i + 1,
      title: `Step ${i + 1}`,
      content: 'Content',
      type: 'analysis',
    }))

    const start = performance.now()
    render(<ReasoningDisplay steps={manySteps} defaultCollapsed={false} />)
    const duration = performance.now() - start

    expect(duration).toBeLessThan(100) // 100ms budget
  })
})
```

---

## Future Enhancements

### Phase 2: Interactive Reasoning

1. **Editable Reasoning:** Allow users to modify reasoning steps
2. **Branching Logic:** Visualize alternative reasoning paths
3. **User Feedback:** Rate individual reasoning steps
4. **Reasoning History:** Show how reasoning evolved over conversation

### Phase 3: Advanced Visualizations

1. **Dependency Graph:** Visual tree of reasoning dependencies
2. **Confidence Heat Map:** Color-code steps by confidence level
3. **Timeline View:** Show temporal progression of thinking
4. **Comparative Reasoning:** Side-by-side reasoning for A/B testing

### Phase 4: AI-Assisted Features

1. **Auto-Summarization:** Generate reasoning summaries automatically
2. **Step Extraction:** Parse unstructured reasoning text into steps
3. **Quality Scoring:** Rate reasoning quality (clarity, logic, completeness)
4. **Explanation Generation:** AI explains its own reasoning in simpler terms

---

## Appendix

### Related Specifications

- [Message Component Specification](./message-component-spec.md)
- [Tool Execution Visualization](./tool-execution-viz-spec.md)
- [Streaming Architecture](./streaming-architecture.md)

### References

1. Kojima et al., 2022 - "Large Language Models are Zero-Shot Reasoners"
2. Vercel AI SDK Documentation - Message Parts
3. Prompt Kit Component Library - Chain of Thought
4. WCAG 2.1 Guidelines - Accessibility Standards
5. Clarity Codebase - CoT Prompting Implementation

### Glossary

- **Chain-of-Thought (CoT):** Step-by-step reasoning process
- **Reflective Reasoning:** Self-checking and revision of initial answers
- **Progressive Disclosure:** Hiding complexity until needed
- **Message Parts:** Multi-part message structure (text, reasoning, tools)
- **Streaming:** Real-time progressive rendering of content

---

**End of Specification**

This document will be updated as the component evolves based on user feedback and testing.
