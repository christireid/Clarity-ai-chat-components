# Documentation Fixes Checklist

**Based on**: Documentation Accuracy Report (January 27, 2026) **Overall Score**: 78/100 **Target
Score**: 90/100

---

## Critical Fixes (Do First - 4 hours total)

### 1. Fix Broken Internal Links (2 hours)

**Files to Update**:

```bash
# Missing files - Create or redirect
/docs/migrating-from-vercel.md → Create or redirect to /docs/migration.md
/packages/react/API_REFERENCE.md → Create or link to online docs
/MIGRATION_GUIDES.md → Create or remove references
/TEST_PARALLELIZATION.md → Create or remove references
/WAVE_3_COMPLETE.md → Already exists? Verify path
```

**Fix in README.md**:

```markdown
# Line 778: Update link

- [Migration](./docs/migrating-from-vercel.md) → [Migration](./docs/migration.md)

# Line 776: Verify API Reference link

- [React API](./packages/react/README.md) → Keep as is (correct)
```

### 2. Update Example Clone Paths (30 minutes)

**File**: `/examples/basic-chat/README.md` (Line 21)

```bash
# ❌ Current (broken)
npx degit clarity-chat/clarity-chat/examples/basic-chat my-chat-app

# ✅ Fixed
npx degit christireid/Clarity-ai-chat-components/examples/basic-chat my-chat-app
```

**Also check these examples**:

- `/examples/streaming-chat/README.md`
- `/examples/multi-provider/README.md`
- `/examples/tool-calling/README.md`
- `/examples/token-optimization/README.md`

### 3. Document New Components (4 hours)

**Missing from API Reference**:

1. **SlashCommandMenu**
   - File: `packages/react/src/components/chat/SlashCommandMenu.tsx`
   - Add to: `packages/react/README.md` section on Components
   - Example usage:

   ```tsx
   import { SlashCommandMenu } from '@clarity-chat/react'

   ;<SlashCommandMenu
     commands={[
       { name: 'summarize', description: 'Summarize conversation' },
       { name: 'export', description: 'Export as PDF' },
     ]}
     onSelect={(command) => console.log(command)}
   />
   ```

2. **ChatSyncStatus**
   - File: `packages/react/src/components/...` (find exact location)
   - Add to README with example

3. **TemplateMarketplace**
   - File: `packages/react/src/components/prompt/TemplateMarketplace.tsx`
   - Already in main README (line 449)
   - Add to packages/react/README.md

### 4. Verify Bundle Size Claims (1 hour)

**Action**:

```bash
cd packages/react
ANALYZE=true pnpm build
# Review output and update README.md lines 107-115
```

**Update these claims**:

- Line 109: `| Core only | ~370KB | Basic chat |`
- Line 115: `| core-minimal bundle | **~30KB** | Headless, bring your own UI |`

---

## High Priority Fixes (Next 2 Days - 16 hours total)

### 5. Improve JSDoc Coverage (8 hours)

**Target files** (lowest coverage first):

#### tool-orchestrator.ts

```bash
File: packages/react/src/core/tool-orchestrator.ts
Current: 2 JSDoc blocks / 8 exports = 25%
Target: 8 JSDoc blocks / 8 exports = 100%
```

Add JSDoc to:

- `registerTool()`
- `executeTool()`
- `getToolRegistry()`
- `validateToolSchema()`
- etc.

Template:

````typescript
/**
 * Registers a new tool in the orchestrator
 *
 * @param tool - Tool definition with name, description, and execute function
 * @param tool.name - Unique identifier for the tool
 * @param tool.description - Human-readable description for LLM
 * @param tool.parameters - JSON Schema for tool parameters
 * @param tool.execute - Function to execute when tool is called
 * @throws {Error} If tool name is already registered
 *
 * @example
 * ```typescript
 * registerTool({
 *   name: 'weather',
 *   description: 'Get current weather',
 *   parameters: {
 *     type: 'object',
 *     properties: {
 *       city: { type: 'string' }
 *     }
 *   },
 *   execute: async ({ city }) => {
 *     return await getWeather(city)
 *   }
 * })
 * ```
 */
export function registerTool(tool: ToolDefinition) {
  // implementation
}
````

#### strategy-router.ts

```bash
File: packages/react/src/prompt/core/strategy-router.ts
Add @example blocks to complex routing logic
```

#### token-optimization package

```bash
Files: packages/token-optimization/src/**/*.ts
Current coverage: 58%
Target: 80%+

Focus on:
- AccurateTokenCounter class
- ProviderNativeCounter class
- All exported functions in src/index.ts
```

### 6. Standardize Type Exports (3 hours)

**File**: `packages/react/src/public-api.ts`

```typescript
// Add these exports:

// Memory types
export type {
  ClarityChatMemoryInfo,
  ClarityChatTokenStats,
  ClarityChatErrorInfo,
  MemoryErrorState,
} from './hooks/use-clarity-chat/types'

// Sync types
export type { SyncStrategy, SyncConflict, SyncStatus } from './hooks/chat/use-chat-sync'

// Rate limiting types
export type {
  RateLimitConfig,
  RequestQueueItem,
  RateLimitStatus,
} from './hooks/ai/use-rate-limited-chat'
```

**Also standardize naming**:

```typescript
// ❌ Inconsistent
export type ChatSyncOptions

// ✅ Consistent
export type ClarityChatSyncOptions
```

### 7. Update Examples to New Grouped Props API (5 hours)

**Files to update**:

1. **Main README.md** - Add new API examples prominently
2. **packages/react/README.md** - Show both old and new
3. **All guide pages** in `apps/streamlined-docs/app/guides/`
4. **JSDoc examples** in component files

Example update pattern:

```tsx
// ❌ Old (still works, but deprecated)
<ChatWindow
  showHeader={true}
  headerTitle="AI Assistant"
  showMessageCount={true}
  onFeedback={(id, type) => {}}
  onCopy={(id, content) => {}}
/>

// ✅ New (recommended as of v1.0+)
<ChatWindow
  header={{
    show: true,
    title: 'AI Assistant',
    showMessageCount: true,
  }}
  messageActions={{
    onFeedback: (id, type) => {},
    onCopy: (id, content) => {},
  }}
/>
```

---

## Medium Priority Fixes (Next 2 Weeks - 30 hours total)

### 8. Add Cross-References (4 hours)

**Pattern**: Add "See also" sections

Example for `useClarityChat` README:

```markdown
## See Also

**Related Hooks**:

- [`useChatEnhanced`](../chat/use-chat-enhanced/README.md) - Lower-level hook without memory
- [`useMemory`](../memory/use-memory/README.md) - Memory management utilities
- [`useTokenBudgetMonitor`](../../token-optimization/README.md) - Token tracking

**Related Components**:

- [`ChatWindow`](../../components/chat/ChatWindow.tsx) - Pre-built UI component
- [`MemoryProvider`](../../components/providers/MemoryProvider.tsx) - Context provider

**Guides**:

- [Getting Started with Memory](/docs/guides/memory.md)
- [Token Optimization Best Practices](/docs/guides/token-optimization.md)
```

Add to:

- All hook README files (15 files)
- All major component files (20 files)
- All guide pages (8 pages)

### 9. Create Missing Guides (20 hours)

#### Error Handling Guide (6 hours)

**File**: `/docs/guides/error-handling.md`

Topics:

- ErrorBoundary usage
- Error recovery patterns
- Retry strategies
- User-facing error messages
- Logging and monitoring

#### Performance Optimization Guide (8 hours)

**File**: `/docs/guides/performance.md`

Topics:

- Virtual scrolling setup
- Lazy loading heavy components
- Memoization patterns
- Bundle size optimization
- Performance monitoring

#### Testing Guide (6 hours)

**File**: `/docs/guides/testing.md`

Topics:

- Using test utilities
- Mocking chat responses
- Testing hooks
- E2E testing with Playwright
- Accessibility testing

### 10. Add Automated Example Verification (6 hours)

**Goal**: CI fails if example code doesn't compile

**Setup**:

1. Create extraction script:

```bash
# scripts/extract-examples.js
# Extracts code blocks from:
# - All README.md files
# - All JSDoc @example blocks
# - All .tsx guide pages
```

2. Create validation script:

```bash
# scripts/validate-examples.js
# Compiles each extracted example
# Reports failures
```

3. Add to CI:

```yaml
# .github/workflows/docs-validation.yml
name: Validate Documentation Examples

on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: pnpm install

      - name: Extract examples
        run: node scripts/extract-examples.js

      - name: Validate examples
        run: node scripts/validate-examples.js
```

---

## Low Priority Fixes (Next Month - 80 hours total)

### 11. Auto-Generated API Docs (40 hours)

**Tool**: TypeDoc or API Extractor

**Setup**:

```bash
pnpm add -D typedoc @microsoft/api-extractor
```

**Configuration**:

```json
// typedoc.json
{
  "entryPoints": ["packages/react/src/public-api.ts"],
  "out": "apps/streamlined-docs/public/api",
  "plugin": ["typedoc-plugin-markdown"],
  "excludePrivate": true,
  "excludeInternal": true
}
```

**Generate**:

```bash
pnpm typedoc
# Outputs markdown to apps/streamlined-docs/public/api
```

**Integrate into docs site**:

- Add route: `/api/reference/generated/`
- Auto-regenerate on build
- Keep in sync with code

### 12. Interactive Examples (24 hours)

**Goal**: Every example has "Try it live" button

**Providers**:

- CodeSandbox
- StackBlitz
- Replit

**Template**:

```tsx
// Example card component
<ExampleCard
  title="Basic Chat"
  description="Simplest possible chat implementation"
  code={basicChatCode}
  liveDemo="https://codesandbox.io/s/clarity-basic-chat"
/>
```

**Generate templates** for:

- Basic chat (10 examples)
- With memory (8 examples)
- With tools (6 examples)
- Enterprise features (10 examples)

### 13. Comprehensive Migration Guide (16 hours)

**File**: `/docs/MIGRATION_COMPREHENSIVE.md`

**Sections**:

1. **v0.9 → v1.0**
   - Flat props → Grouped props
   - Old imports → New package structure
   - Deprecated hooks → New equivalents

2. **Vercel AI SDK → Clarity**
   - API mapping table
   - Code transformation examples
   - Feature comparison

3. **Automated Codemods**

   ```bash
   npx @clarity-chat/codemod migrate-to-v1
   ```

4. **Breaking Changes Log**
   - Removed: AB testing
   - Removed: Legacy calendar integration
   - Changed: Button component API
   - Changed: Memory configuration

---

## Measurement & Tracking

### Before Starting

**Baseline Metrics** (January 27, 2026):

```
Overall Score: 78/100
JSDoc Coverage: 73%
README Accuracy: 87/100
Example Validity: 82/100
Broken Links: 6
Missing Docs: 8 features
```

### After Each Phase

**Track improvements**:

```bash
# Run documentation audit script
pnpm audit:docs

# Outputs:
# - JSDoc coverage %
# - Broken link count
# - Missing type export count
# - Example compilation pass rate
```

### Target Metrics (March 2026)

```
Overall Score: 90/100
JSDoc Coverage: 85%+
README Accuracy: 95/100
Example Validity: 95/100
Broken Links: 0
Missing Docs: 0
```

---

## Priority Matrix

| Task                           | Impact | Effort | Priority | Deadline  |
| ------------------------------ | ------ | ------ | -------- | --------- |
| Fix broken links               | High   | Low    | P0       | This week |
| Update example paths           | High   | Low    | P0       | This week |
| Document new components        | High   | Medium | P0       | This week |
| Verify bundle sizes            | High   | Low    | P0       | This week |
| Improve JSDoc coverage         | Medium | High   | P1       | 2 weeks   |
| Standardize type exports       | Medium | Low    | P1       | 2 weeks   |
| Update to grouped props API    | Medium | Medium | P1       | 2 weeks   |
| Add cross-references           | Low    | Medium | P2       | 1 month   |
| Create missing guides          | Medium | High   | P2       | 1 month   |
| Automated example verification | Medium | Medium | P2       | 1 month   |
| Auto-generated API docs        | Medium | High   | P3       | 2 months  |
| Interactive examples           | Low    | High   | P3       | 2 months  |
| Comprehensive migration guide  | Low    | High   | P3       | 2 months  |

---

## Daily Checklist for Documentation Work

**Before committing any doc changes**:

- [ ] Spell check (use VS Code spell checker)
- [ ] Link check (test all relative links)
- [ ] Code formatting (use Prettier on markdown)
- [ ] Example compilation (compile code blocks if possible)
- [ ] Screenshot updates (if UI changed)
- [ ] Version references (ensure correct version numbers)
- [ ] Cross-references (add "See also" if applicable)
- [ ] Changelog update (note what was changed)

**Weekly review**:

- [ ] Check for new features merged without docs
- [ ] Review open PRs for documentation needs
- [ ] Update metrics dashboard
- [ ] Prioritize based on user feedback

**Monthly review**:

- [ ] Re-run full documentation audit
- [ ] Compare to previous month's metrics
- [ ] Celebrate improvements
- [ ] Plan next month's priorities

---

## Resources

### Tools

- [TypeDoc](https://typedoc.org/) - API documentation generator
- [markdownlint](https://github.com/DavidAnson/markdownlint) - Markdown linter
- [markdown-link-check](https://github.com/tcort/markdown-link-check) - Link validator
- [cspell](https://cspell.org/) - Spell checker

### Commands

```bash
# Lint markdown
pnpm markdownlint '**/*.md' --ignore node_modules

# Check links
pnpm markdown-link-check README.md

# Spell check
pnpm cspell '**/*.md'

# Count JSDoc
grep -r "^\/\*\*" packages/react/src --include="*.ts" | wc -l

# Find missing exports
node scripts/find-undocumented-exports.js
```

### Templates

See `/docs/templates/` for:

- JSDoc template
- README template
- Guide page template
- API reference template

---

**Last Updated**: January 27, 2026 **Next Review**: February 3, 2026 (1 week) **Owner**:
Documentation Team
