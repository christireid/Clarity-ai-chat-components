# Wave 3.3 Agent 32: Code Splitter - Quick Wins

**Agent Type**: `frontend-developer:frontend-developer` **Priority**: P0 - Critical **Target
Savings**: 3.9 MB (86% of Wave 3 target) **Estimated Time**: 3.5 hours **Risk Level**: Low

---

## Mission Objective

Implement high-impact, low-risk bundle optimizations to achieve immediate 3.9 MB reduction through:

1. Route splitting Monaco Editor
2. Externalizing AI SDKs from client bundle
3. Removing redundant Highlight.js dependency

---

## Task 1: Route Split Monaco Editor (Target: -2.8 MB)

### Problem Analysis

- Monaco Editor (2.8 MB) is currently loaded in main bundle
- Used ONLY in `/playground` route (1% of users)
- 99% of users pay the cost for a feature they never use

### Current State

**File**: `apps/streamlined-docs/components/Playground/CodeEditor.tsx`

```typescript
// Current implementation (BAD):
import { Editor } from '@monaco-editor/react'

export function CodeEditor({ code, onChange }: CodeEditorProps) {
  return <Editor value={code} onChange={onChange} />
}
```

### Implementation Steps

#### Step 1.1: Create Monaco Wrapper Component

**File**: `apps/streamlined-docs/components/Playground/MonacoEditorWrapper.tsx` (NEW)

```typescript
'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { CodeEditorSkeleton } from './CodeEditorSkeleton'

// Dynamic import - Monaco only loads when this component renders
const MonacoEditor = dynamic(() => import('@monaco-editor/react').then(mod => ({ default: mod.Editor })), {
  loading: () => <CodeEditorSkeleton />,
  ssr: false // Monaco requires browser APIs
})

interface MonacoEditorWrapperProps {
  value: string
  onChange: (value: string | undefined) => void
  language?: string
  theme?: 'vs-dark' | 'light'
  height?: string
}

export function MonacoEditorWrapper({
  value,
  onChange,
  language = 'typescript',
  theme = 'vs-dark',
  height = '600px'
}: MonacoEditorWrapperProps) {
  return (
    <Suspense fallback={<CodeEditorSkeleton />}>
      <MonacoEditor
        height={height}
        language={language}
        theme={theme}
        value={value}
        onChange={onChange}
        options={{
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 14,
          lineNumbers: 'on',
          automaticLayout: true,
        }}
      />
    </Suspense>
  )
}
```

**Why This Works**:

- `dynamic()` creates a separate chunk for Monaco
- `ssr: false` prevents server-side bundle pollution
- Loading skeleton provides instant feedback
- Only users who visit `/playground` download Monaco

#### Step 1.2: Create Loading Skeleton

**File**: `apps/streamlined-docs/components/Playground/CodeEditorSkeleton.tsx` (NEW)

```typescript
export function CodeEditorSkeleton() {
  return (
    <div className="w-full rounded-lg border border-neutral-200 bg-neutral-50 p-4 animate-pulse">
      <div className="space-y-3">
        {/* Line numbers */}
        <div className="flex gap-3">
          <div className="w-8 h-4 bg-neutral-200 rounded" />
          <div className="flex-1 h-4 bg-neutral-200 rounded" />
        </div>
        <div className="flex gap-3">
          <div className="w-8 h-4 bg-neutral-200 rounded" />
          <div className="flex-1 h-4 bg-neutral-200 rounded w-3/4" />
        </div>
        <div className="flex gap-3">
          <div className="w-8 h-4 bg-neutral-200 rounded" />
          <div className="flex-1 h-4 bg-neutral-200 rounded w-5/6" />
        </div>
        {/* Loading indicator */}
        <div className="mt-6 text-center text-sm text-neutral-500">
          Loading code editor...
        </div>
      </div>
    </div>
  )
}
```

#### Step 1.3: Update CodeEditor Component

**File**: `apps/streamlined-docs/components/Playground/CodeEditor.tsx` (MODIFY)

```typescript
// BEFORE
import { Editor } from '@monaco-editor/react'

// AFTER
import { MonacoEditorWrapper } from './MonacoEditorWrapper'

export function CodeEditor({ code, onChange }: CodeEditorProps) {
  return (
    <MonacoEditorWrapper
      value={code}
      onChange={onChange}
      language="typescript"
      theme="vs-dark"
    />
  )
}
```

#### Step 1.4: Update InteractivePlayground

**File**: `apps/streamlined-docs/components/Playground/InteractivePlayground.tsx` (MODIFY)

Update import path if necessary:

```typescript
import { CodeEditor } from './CodeEditor'
// Component usage remains the same - no breaking changes
```

#### Step 1.5: Verify Route Split

**Command**:

```bash
# Build and check Monaco is in separate chunk
ANALYZE=true npm run build

# Verify Monaco chunk is isolated
ls -lh .next/static/chunks/ | grep monaco
```

**Expected Output**:

```
monaco-[hash].js  2.8M  (separate chunk, loaded only on /playground)
```

### Testing Checklist

- [ ] Build completes without errors
- [ ] Monaco chunk appears in separate file
- [ ] `/playground` page loads Monaco correctly
- [ ] Other pages do NOT load Monaco
- [ ] Loading skeleton appears briefly
- [ ] No TypeScript errors
- [ ] No console errors in browser

### Success Criteria

✅ Monaco Editor isolated to 2.8 MB separate chunk ✅ Main bundle reduced by 2.8 MB ✅ `/playground`
page still functional ✅ All other pages unaffected

---

## Task 2: Externalize AI SDKs (Target: -650 KB)

### Problem Analysis

- AI SDKs (@anthropic-ai/sdk, openai, @google/generative-ai) are server-only
- Currently bundled in client despite only being used in API routes
- 650 KB of code that should NEVER reach the browser

### Current State

**File**: `apps/streamlined-docs/next.config.ts`

```typescript
// Current config doesn't externalize AI packages
const nextConfig: NextConfig = {
  // ... existing config
}
```

### Implementation Steps

#### Step 2.1: Update Next.js Config

**File**: `apps/streamlined-docs/next.config.ts` (MODIFY)

```typescript
const nextConfig: NextConfig = {
  // ... existing config

  // Externalize server-only packages from client bundle
  serverExternalPackages: [
    // AI SDKs (server-only)
    '@anthropic-ai/sdk',
    'openai',
    '@google/generative-ai',
    '@ai-sdk/openai',
    'ai',

    // Vector DB (server-only)
    '@pinecone-database/pinecone',

    // Tokenization (server-only)
    'tiktoken',

    // Markdown processing (can be external)
    'gray-matter',
  ],

  // Optimize package imports for tree-shaking
  optimizePackageImports: ['lucide-react', '@clarity-chat/react', '@clarity-chat/primitives'],
}
```

**Why This Works**:

- `serverExternalPackages` tells Next.js to keep these packages server-only
- Prevents bundler from including them in client chunks
- No code changes needed - purely configuration

#### Step 2.2: Verify API Routes Are Server-Only

**Check**: Ensure API routes don't accidentally leak to client

```bash
# Search for AI SDK imports in client components
grep -r "@anthropic-ai/sdk" apps/streamlined-docs/components/
grep -r "openai" apps/streamlined-docs/components/

# Should return NO results (API routes are in app/api/, not components/)
```

**Expected**: No client-side imports of AI SDKs

#### Step 2.3: Add Bundle Budget

**File**: `apps/streamlined-docs/.lighthouserc.json` (NEW or MODIFY)

```json
{
  "ci": {
    "assert": {
      "preset": "lighthouse:recommended",
      "assertions": {
        "total-byte-weight": ["error", { "maxNumericValue": 700000 }],
        "main-thread-blocking": ["error", { "maxNumericValue": 2000 }]
      }
    }
  }
}
```

### Testing Checklist

- [ ] Build completes without errors
- [ ] Client bundle size reduced by ~650 KB
- [ ] API routes still function correctly
- [ ] No AI SDK code in client chunks
- [ ] All API endpoints respond correctly

### Success Criteria

✅ AI SDKs externalized from client bundle ✅ Client bundle reduced by 650 KB ✅ API routes still
functional ✅ No server-only code in client

---

## Task 3: Remove Highlight.js (Target: -450 KB)

### Problem Analysis

- Both Highlight.js (450 KB) and Prism.js (200 KB) are loaded
- They serve the same purpose: syntax highlighting
- Prism.js is already integrated and sufficient
- Highlight.js is redundant and adds unnecessary weight

### Current State

**Files Using Highlight.js**:

```bash
# Find all Highlight.js imports
grep -r "highlight.js" apps/streamlined-docs/
grep -r "import.*hljs" apps/streamlined-docs/
```

**Expected Locations**:

- Code example components
- MDX code blocks
- Possibly in legacy components

### Implementation Steps

#### Step 3.1: Audit Highlight.js Usage

**Command**:

```bash
# Create audit report
grep -rn "highlight\.js\|import.*hljs\|require.*highlight" apps/streamlined-docs/ > /tmp/hljs-audit.txt
cat /tmp/hljs-audit.txt
```

#### Step 3.2: Replace Highlight.js with Prism

For each file using Highlight.js:

**Example Replacement**:

```typescript
// BEFORE (Highlight.js)
import hljs from 'highlight.js'

function highlightCode(code: string, language: string) {
  return hljs.highlight(code, { language }).value
}

// AFTER (Prism.js - already available)
import Prism from 'prismjs'

function highlightCode(code: string, language: string) {
  return Prism.highlight(code, Prism.languages[language] || Prism.languages.javascript, language)
}
```

**Common Files to Update**:

1. `components/MDX/CodeBlock.tsx`
2. `components/Playground/CodePreview.tsx`
3. `components/AI/CodeRenderer.tsx`

#### Step 3.3: Remove Highlight.js Dependency

**File**: `apps/streamlined-docs/package.json` (MODIFY)

```bash
# Remove from package.json
npm uninstall highlight.js

# Clean install to update lock file
pnpm install
```

#### Step 3.4: Update Prism Language Support

Ensure Prism has all languages we need:

**File**: `apps/streamlined-docs/lib/prism-setup.ts` (VERIFY or CREATE)

```typescript
import Prism from 'prismjs'

// Load additional languages
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-markdown'

export { Prism }
```

### Testing Checklist

- [ ] All Highlight.js imports removed
- [ ] All code blocks use Prism.js
- [ ] Syntax highlighting still works
- [ ] All language highlighting preserved
- [ ] Build completes without errors
- [ ] No console errors
- [ ] Visual regression test passes

### Success Criteria

✅ Highlight.js completely removed ✅ Bundle reduced by 450 KB ✅ All syntax highlighting functional
✅ No visual regressions

---

## Task 4: Verification & Validation

### Bundle Size Verification

#### Step 4.1: Run Bundle Analysis

```bash
# Generate bundle report
ANALYZE=true npm run build

# Check bundle sizes
du -sh .next/static/chunks/* | sort -h | tail -20

# Compare with baseline (from WAVE_3_2_BUNDLE_ANALYSIS.md)
```

**Expected Results**:

```
Baseline (before):
- Main bundle: 1100 KB
- Monaco: Inline
- AI SDKs: Inline
- Highlight.js: Inline

After Agent 32:
- Main bundle: ~450 KB (-650 KB from externalization, -450 KB from removal)
- Monaco: 2.8 MB (separate chunk, lazy)
- AI SDKs: External (server-only)
- Highlight.js: REMOVED
```

#### Step 4.2: Lighthouse Audit

```bash
# Run Lighthouse on key pages
npm run perf:lighthouse -- --url=http://localhost:3000/
npm run perf:lighthouse -- --url=http://localhost:3000/playground
npm run perf:lighthouse -- --url=http://localhost:3000/api/reference
```

**Target Scores** (post-optimization):

- Performance: 78+ (up from 68)
- FCP: <2.0s (down from 3.2s)
- LCP: <3.5s (down from 4.8s)

#### Step 4.3: Manual Testing

**Test Checklist**:

- [ ] Home page loads without Monaco
- [ ] `/playground` page loads Monaco correctly
- [ ] Code editor works in playground
- [ ] Syntax highlighting works on all doc pages
- [ ] Code examples render correctly
- [ ] No console errors across all pages
- [ ] API routes still function
- [ ] DocsAssistant (AI) still works

### Performance Benchmarks

**Create Benchmark Report**:

```bash
# Measure load times
npm run perf:measure

# Compare before/after
echo "Baseline: 1.1 MB main bundle"
echo "After Agent 32: ~450 KB main bundle"
echo "Reduction: 59%"
```

---

## Rollback Plan

### If Monaco Split Breaks Playground

```bash
# Revert MonacoEditorWrapper.tsx changes
git checkout HEAD -- apps/streamlined-docs/components/Playground/MonacoEditorWrapper.tsx
git checkout HEAD -- apps/streamlined-docs/components/Playground/CodeEditor.tsx

# Rebuild
npm run build
```

### If Externalization Breaks API Routes

```typescript
// Remove from next.config.ts
serverExternalPackages: [
  // Comment out AI SDKs temporarily
  // '@anthropic-ai/sdk',
  // 'openai',
],
```

### If Highlight.js Removal Breaks Highlighting

```bash
# Reinstall Highlight.js temporarily
npm install highlight.js

# Revert code changes
git checkout HEAD -- <affected-files>
```

---

## Success Metrics

### Bundle Size Targets

| Metric              | Before  | After        | Change         |
| ------------------- | ------- | ------------ | -------------- |
| Main Bundle         | 1100 KB | 450 KB       | -59% ✅        |
| Monaco (isolated)   | Inline  | 2.8 MB chunk | Route split ✅ |
| AI SDKs             | 650 KB  | External     | -650 KB ✅     |
| Highlight.js        | 450 KB  | Removed      | -450 KB ✅     |
| **Total Reduction** | -       | -            | **-3.9 MB** ✅ |

### Performance Targets

| Metric           | Before | Target | Success Threshold |
| ---------------- | ------ | ------ | ----------------- |
| Lighthouse Score | 68     | 78+    | ≥75 ✅            |
| FCP              | 3.2s   | <2.0s  | <2.5s ✅          |
| LCP              | 4.8s   | <3.5s  | <4.0s ✅          |

---

## Deliverables

### Files Created

1. `components/Playground/MonacoEditorWrapper.tsx` - Dynamic Monaco loader
2. `components/Playground/CodeEditorSkeleton.tsx` - Loading skeleton
3. `lib/prism-setup.ts` - Centralized Prism configuration (if needed)
4. `.lighthouserc.json` - Performance budgets

### Files Modified

1. `components/Playground/CodeEditor.tsx` - Use wrapper
2. `next.config.ts` - Externalize packages
3. `package.json` - Remove Highlight.js
4. All files using Highlight.js - Convert to Prism

### Reports Generated

1. Bundle size comparison (before/after)
2. Lighthouse audit results
3. Agent 32 completion report (`WAVE_3_3_AGENT_32_COMPLETE.md`)

---

## Coordination

### Before Starting

- [ ] Confirm no concurrent work on same files
- [ ] Run `git fetch origin` to check for updates
- [ ] Create feature branch or continue on `clean-up`

### During Execution

- [ ] Commit after each task completes
- [ ] Run tests between tasks
- [ ] Update progress in TodoWrite

### After Completion

- [ ] Generate completion report
- [ ] Update Wave 3.3 status
- [ ] Notify team of bundle size improvements
- [ ] Prepare for Agent 33 launch

---

**Agent 32 Status**: 📋 PLANNED **Ready for Execution**: ✅ YES **Dependencies**: None (Wave 3.2
analysis complete) **Next Agent**: Agent 33 (Lazy Loading Implementer)
