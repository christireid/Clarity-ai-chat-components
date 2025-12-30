# QA Docs Audit - Audit Log

## Audit Summary

| Severity      | Count | Status |
| ------------- | ----- | ------ |
| P0 (Critical) | 3     | Open   |
| P1 (Major)    | 8     | Open   |
| P2 (Polish)   | 15+   | Open   |

---

## P0 - Critical Issues (Breaks Functionality)

### P0-001: TypeScript `logger` undefined in production code

**Files**:

- `content/blog/scripts/check-pricing-freshness.ts` (30+ references)
- `lib/ai/feedbackStore.ts` (lines 160, 212, 215)
- `lib/ai/sessionStore.ts` (lines 276, 279)

**Repro**: Run `pnpm typecheck` **Expected**: No errors **Actual**:
`error TS2304: Cannot find name 'logger'` **Fix Direction**: Import or define logger utility

---

### P0-002: `lib/ai/streaming.ts` variable redeclaration and namespace errors

**File**: `lib/ai/streaming.ts` **Errors**:

- Line 207: `error TS2451: Cannot redeclare block-scoped variable 'tools'`
- Line 219: Same redeclaration error
- Line 220: `error TS2339: Property 'executeToolCall' does not exist on type 'Tool[]'`
- Lines 277, 324: `error TS2503: Cannot find namespace 'tools'`

**Repro**: Run `pnpm typecheck` **Expected**: Clean build **Actual**: Type errors prevent proper
type safety **Fix Direction**: Rename variable or fix scoping issue

---

### P0-003: Animation library exports missing

**File**: `lib/__tests__/animations.test.ts` **Errors**:

- Line 20: `fadeInLeft` not exported
- Line 21: `fadeInRight` not exported
- Line 22: `slideUp` not exported
- Line 23: `slideDown` not exported
- Line 24: `scaleUp` not exported
- Line 25: `scaleDown` not exported
- Line 26: `rotateIn` not exported
- Line 27: `scrollReveal` not exported

**Repro**: Run `pnpm typecheck` **Expected**: Exports exist **Actual**: Missing named exports **Fix
Direction**: Add exports to `lib/animations.ts`

---

## P1 - Major Issues (Incorrect Behavior)

### P1-001: framer-motion Variant type incompatibility

**File**: `lib/animations.ts` **Lines**: 248, 258, 268, 450, 455 **Errors**: `once` and `duration`
properties don't exist in `Variant` type

**Impact**: TypeScript strict mode violations **Fix Direction**: Use proper framer-motion types or
type assertions

---

### P1-002: NODE_ENV assignment in tests

**Files**:

- `lib/ai/__tests__/chat-analytics.test.ts` (20+ occurrences)
- `lib/ai/promptValidation.test.ts` (4 occurrences)

**Error**: `Cannot assign to 'NODE_ENV' because it is a read-only property` **Fix Direction**: Use
`vi.stubEnv()` or mock process.env properly

---

### P1-003: ESLint animation accessibility violations (439 errors)

**Pattern**: `clarity-animations/require-reduced-motion` **Files**: Multiple components across docs

**Components Affected**:

- `HeroSection.tsx`
- `Navigation.tsx`
- `Footer.tsx`
- `SearchPalette.tsx`
- `ShareButton.tsx`
- `PageTransition.tsx`
- `ScrollProgress.tsx`
- `Toast.tsx`
- And 30+ more

**Impact**: Animations don't respect `prefers-reduced-motion` **Fix Direction**: Add
`useReducedMotion` hook or conditional rendering

---

### P1-004: Playwright accessibility API deprecated

**File**: `tests/visual/docs-assistant.spec.ts:161` **Error**:
`Property 'accessibility' does not exist on type 'Page'`

**Fix Direction**: Use `@axe-core/playwright` instead

---

### P1-005: Analytics PerformanceEntry type issues

**File**: `lib/analytics.ts` **Lines**: 68, 81, 82 **Errors**: Properties don't exist on
`PerformanceEntry` type

**Fix Direction**: Use proper Performance API types

---

### P1-006: tokenUtils test logger undefined

**File**: `lib/ai/tokenUtils.test.ts:212` **Error**: `Cannot find name 'logger'`

**Fix Direction**: Import or mock logger

---

### P1-007: TypeScript errors ignored in build

**File**: `next.config.ts:82` **Issue**: `ignoreBuildErrors: true` masks 60+ TS errors

**Impact**: No compile-time type checking in production build **Fix Direction**: Fix TS errors and
remove flag

---

### P1-008: ESLint warnings (343 total)

**Categories**:

- `react/no-danger` (dangerouslySetInnerHTML) - 8 warnings
- `clarity-animations/prefer-animation-library` - 50+ warnings
- `clarity-animations/no-hardcoded-duration` - 30+ warnings

**Fix Direction**: Migrate to animation library, add sanitization docs

---

## P2 - Polish Issues

### P2-001: Code block styling inconsistency

**Routes**: Various cookbook/reference pages **Issue**: Some code blocks use different themes

---

### P2-002: Animation token hardcoding

**Pattern**: `duration: 0.15` instead of `durations.fast` **Count**: 50+ occurrences

---

### P2-003: Missing copy button on some code blocks

**Routes**: `/cookbook/*` **Expected**: All code blocks should have copy functionality

---

### P2-004: Console warnings in development

**Issue**: React hydration warnings on some pages (expected for dynamic imports)

---

## Route Coverage Summary

| Route                              | Status | HTTP | Notes                    |
| ---------------------------------- | ------ | ---- | ------------------------ |
| `/`                                | Pass   | 200  | Homepage loads correctly |
| `/demos`                           | Pass   | 200  | Demo index works         |
| `/demos/zero-to-chat`              | Pass   | 200  | Live demo functional     |
| `/demos/streaming-states`          | Pass   | 200  | Streaming demo works     |
| `/demos/tool-calling`              | Pass   | 200  | Tool calling demo works  |
| `/demos/token-visualizer`          | Pass   | 200  | Token visualizer works   |
| `/demos/accessibility-audit`       | Pass   | 200  | Accessibility demo works |
| `/demos/memory-context`            | Pass   | 200  | Memory demo works        |
| `/learn/quick-start`               | Pass   | 200  | Quick start loads        |
| `/guides`                          | Pass   | 200  | Guides index works       |
| `/reference/components`            | Pass   | 200  | Components ref works     |
| `/reference/components/chat-input` | Pass   | 200  | Component detail works   |
| `/reference/hooks`                 | Pass   | 200  | Hooks ref works          |
| `/reference/hooks/use-chat`        | Pass   | 200  | Hook detail works        |
| `/cookbook`                        | Pass   | 200  | Cookbook index works     |
| `/cookbook/streaming-setup`        | Pass   | 200  | Recipe works             |
| `/examples`                        | Pass   | 200  | Examples index works     |
| `/compare`                         | Pass   | 200  | Comparison page works    |
| `/playground`                      | Pass   | 200  | Playground works         |
| `/enterprise`                      | Pass   | 200  | Enterprise page works    |

---

## Dev Server Health

| Check             | Status                        |
| ----------------- | ----------------------------- |
| Server starts     | PASS                          |
| Homepage responds | PASS (200)                    |
| No fatal errors   | PASS                          |
| Compilation       | PASS (slow initial, fast HMR) |

---

## API Routes Health

| Route                 | Status      | Notes                    |
| --------------------- | ----------- | ------------------------ |
| `/api/chat`           | Untested    | Requires API key or mock |
| `/api/hero-chat`      | Untested    | Requires API key or mock |
| `/api/docs-assistant` | Untested    | Requires API key or mock |
| `/api/ai/health`      | Should test | Health check endpoint    |
| `/api/ai/search`      | Should test | Search API               |
| `/api/ai/components`  | Should test | Component discovery      |
| `/api/ai/hooks`       | Should test | Hook discovery           |

---

## Next Audit Iteration

1. Test API routes with mocks
2. Test interactive components (forms, inputs)
3. Visual regression testing
4. Dark mode consistency check
5. Mobile responsiveness audit
