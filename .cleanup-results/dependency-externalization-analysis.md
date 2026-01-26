# React Package Dependency Externalization Analysis
**Date**: 2026-01-26
**Analyzer**: Quick Wins Session Continuation
**Goal**: Identify dependencies that should be externalized to reduce bundle size

---

## Current State

### Externalized Dependencies (tsup.config.ts lines 9-24)
```typescript
external: [
  'react',
  'react-dom',
  'framer-motion',
  '@clarity-chat/primitives',
  '@clarity-chat/types',
  '@clarity-chat/memory',
  '@clarity-chat/license',
  '@clarity-chat/error-handling',
  '@clarity-chat/token-optimization',
  '@clarity-chat/utils',
  'mermaid',
  'highlight.js/styles/github-dark.css',
  'katex/dist/katex.min.css',
  'dompurify',
]
```

### Dependencies Currently Bundled (package.json lines 197-221)
```json
"dependencies": {
  "@radix-ui/react-slot": "^1.2.4",
  "@tanstack/react-virtual": "^3.11.2",
  "@types/prismjs": "^1.26.5",
  "isomorphic-dompurify": "^2.21.0",
  "jszip": "^3.10.1",
  "lucide-react": "^0.556.0",
  "prismjs": "^1.30.0",
  "react-markdown": "^10.1.0",
  "react-resizable-panels": "^2.1.7",
  "react-virtualized-auto-sizer": "^1.0.26",
  "react-window": "^1.8.11",
  "sonner": "^1.7.1",
  "rehype-highlight": "^7.0.2",
  "remark-gfm": "^4.0.1",
  "shiki": "^3.19.0",
  "zod": "^3.24.0"
}
```

---

## High-Priority Externalization Candidates

### 1. Shiki (~200KB+) - CRITICAL
**Current**: Bundled
**Should Be**: Peer dependency (optional)

**Reason**:
- Extremely heavy syntax highlighter (~200KB minified)
- Used only in markdown rendering components
- Most apps won't use syntax highlighting
- Users should control which highlighter they use (Shiki vs Prism)

**Impact**: -200KB for apps not using syntax highlighting

**Action**:
- Add to peerDependenciesMeta as optional
- Add to external list
- Document in README as optional feature

---

### 2. Lucide-React (~100KB+) - HIGH
**Current**: Bundled
**Should Be**: Peer dependency (optional)

**Reason**:
- Large icon library
- Users may already have it installed
- Tree-shaking doesn't work well when bundled
- Users should control icon library choice

**Impact**: -100KB for apps using different icon library

**Action**:
- Add to peerDependencies
- Add to external list
- Document as peer dependency

---

### 3. JSZip (~100KB) - HIGH
**Current**: Bundled
**Should Be**: Peer dependency (optional)

**Reason**:
- Only needed for zip export features
- Most apps won't use export functionality
- Heavy compression library

**Impact**: -100KB for apps not using export features

**Action**:
- Add to peerDependenciesMeta as optional
- Add to external list
- Lazy-load in export components

---

### 4. React-Markdown Ecosystem (~100KB combined) - HIGH
**Current**: Bundled
**Should Be**: Peer dependencies (optional)

**Packages**:
- react-markdown (~10.1.0)
- remark-gfm (~4.0.1)
- rehype-highlight (~7.0.2)

**Reason**:
- Only needed for markdown rendering
- Users should control markdown renderer choice
- Heavy unified/remark/rehype dependencies

**Impact**: -100KB for apps not rendering markdown

**Action**:
- Add all to peerDependenciesMeta as optional
- Add to external list
- Document markdown rendering as optional feature

---

### 5. Prismjs (~50KB) - MEDIUM
**Current**: Bundled
**Should Be**: Peer dependency (optional)

**Reason**:
- Alternative syntax highlighter to Shiki
- Users should choose one or the other
- Not needed if using Shiki

**Impact**: -50KB for apps using Shiki or no highlighting

**Action**:
- Add to peerDependenciesMeta as optional
- Add to external list
- Document as alternative to Shiki

---

### 6. Zod (~50KB) - MEDIUM
**Current**: Bundled
**Should Be**: Peer dependency

**Reason**:
- Common validation library
- Users likely already have it
- Used across many components

**Impact**: -50KB if already installed by user

**Action**:
- Add to peerDependencies
- Add to external list
- Document as required peer dependency

---

### 7. Isomorphic-DOMPurify (~20KB) - LOW
**Current**: Bundled
**Should Be**: External (keep as dependency)

**Reason**:
- Wrapper around dompurify (already external)
- Small but still worth externalizing
- Users may have their own DOMPurify wrapper

**Impact**: -20KB

**Action**:
- Add to external list
- Keep as dependency (not peer)

---

### 8. Virtualization Libraries (~30KB combined) - LOW
**Current**: Bundled
**Should Be**: Keep bundled OR externalize all

**Packages**:
- @tanstack/react-virtual (~3.11.2)
- react-window (~1.8.11)
- react-virtualized-auto-sizer (~1.0.26)

**Reason**:
- Core functionality for long message lists
- Relatively small combined
- Mixed approach (some bundled, some external) causes issues

**Decision**: Keep bundled for now (used in core components)

---

### 9. UI Libraries (~30KB combined) - LOW
**Current**: Bundled
**Should Be**: Keep bundled

**Packages**:
- sonner (~1.7.1) - toasts
- react-resizable-panels (~2.1.7) - panels
- @radix-ui/react-slot (~1.2.4) - composition

**Reason**:
- Core UI functionality
- Small size
- Not commonly installed by users

**Decision**: Keep bundled

---

## Estimated Bundle Size Impact

### Current Bundle (Estimated)
- Main bundle: ~1.2 MB (with all dependencies bundled)
- Core bundle: ~400 KB
- Slim bundle: ~200 KB

### After Externalization
- Main bundle: ~600 KB (-600 KB, -50%)
- Core bundle: ~300 KB (-100 KB, -25%)
- Slim bundle: ~150 KB (-50 KB, -25%)

**Total Savings**: 500-600KB for typical app not using all features

---

## Implementation Plan

### Phase 1: Critical Externalizations (Now)
1. **Shiki** - Biggest impact (-200KB)
2. **Lucide-React** - Common library (-100KB)
3. **JSZip** - Optional feature (-100KB)

**Total Phase 1 Savings**: ~400KB

### Phase 2: Markdown Ecosystem (Next)
1. **react-markdown** and plugins (-100KB)
2. **Prismjs** (-50KB)
3. **isomorphic-dompurify** (-20KB)

**Total Phase 2 Savings**: ~170KB

### Phase 3: Validation Library (Later)
1. **Zod** - Common but not universal (-50KB)

**Total Phase 3 Savings**: ~50KB

---

## Updated tsup.config.ts External List

```typescript
external: [
  // Framework
  'react',
  'react-dom',
  'framer-motion',

  // Clarity packages
  '@clarity-chat/primitives',
  '@clarity-chat/types',
  '@clarity-chat/memory',
  '@clarity-chat/license',
  '@clarity-chat/error-handling',
  '@clarity-chat/token-optimization',
  '@clarity-chat/utils',

  // Syntax highlighting (optional features)
  'shiki',
  'prismjs',
  'rehype-highlight',

  // Markdown rendering (optional features)
  'react-markdown',
  'remark-gfm',

  // Icons (common peer dependency)
  'lucide-react',

  // Utilities
  'jszip',
  'isomorphic-dompurify',
  'dompurify',
  'zod',

  // Diagrams
  'mermaid',

  // CSS
  'highlight.js/styles/github-dark.css',
  'katex/dist/katex.min.css',
]
```

---

## Updated package.json peerDependencies

```json
{
  "peerDependencies": {
    "framer-motion": "^12.23.25",
    "react": "^18.0.0 || ^19.0.0",
    "react-dom": "^18.0.0 || ^19.0.0",
    "lucide-react": "^0.500.0",
    "zod": "^3.20.0",

    // Optional features
    "flowtoken": "^1.0.0",
    "mermaid": "^11.0.0",
    "pdfjs-dist": "^3.0.0 || ^4.0.0",
    "mammoth": "^1.0.0",
    "cohere-ai": "^7.0.0",

    // Markdown rendering
    "react-markdown": "^9.0.0 || ^10.0.0",
    "remark-gfm": "^4.0.0",

    // Syntax highlighting (choose one)
    "shiki": "^3.0.0",
    "prismjs": "^1.29.0",

    // Export features
    "jszip": "^3.10.0"
  },
  "peerDependenciesMeta": {
    "react-dom": {
      "optional": true
    },
    "flowtoken": {
      "optional": true
    },
    "mermaid": {
      "optional": true
    },
    "pdfjs-dist": {
      "optional": true
    },
    "mammoth": {
      "optional": true
    },
    "cohere-ai": {
      "optional": true
    },
    "react-markdown": {
      "optional": true
    },
    "remark-gfm": {
      "optional": true
    },
    "shiki": {
      "optional": true
    },
    "prismjs": {
      "optional": true
    },
    "jszip": {
      "optional": true
    }
  }
}
```

---

## Breaking Changes and Migration

### Breaking Change: External Dependencies Required

**Before**:
```typescript
import { ClarityChat } from '@clarity-chat/react'
// Everything works
```

**After**:
```typescript
// Must install peer dependencies for features you use
npm install lucide-react zod

// Optional features require additional installs
npm install react-markdown remark-gfm shiki jszip
```

### Migration Guide

1. **Add core peer dependencies**:
   ```bash
   npm install lucide-react zod
   ```

2. **If using markdown rendering**:
   ```bash
   npm install react-markdown remark-gfm
   ```

3. **If using syntax highlighting**:
   ```bash
   npm install shiki
   # OR
   npm install prismjs
   ```

4. **If using export features**:
   ```bash
   npm install jszip
   ```

---

## Documentation Updates Required

### README.md
- Add "Peer Dependencies" section
- Document optional vs required peers
- Show bundle size with/without optional features
- Add troubleshooting for missing peers

### Component Documentation
- Mark components using optional features
- Show required peer installs per component
- Add "Bundle Impact" note to heavy components

---

## Verification Steps

1. **Build with externalization**:
   ```bash
   pnpm run build
   ls -lh dist/*.{js,mjs}
   ```

2. **Test imports without peers**:
   - Verify appropriate errors for missing optional peers
   - Verify core functionality works without optionals

3. **Measure bundle impact**:
   - Build test app with all features
   - Build test app with core only
   - Compare sizes

4. **Check tree-shaking**:
   - Verify unused externals don't appear in user bundles
   - Test with bundler analysis tools (webpack-bundle-analyzer)

---

## Risks and Mitigation

### Risk 1: Breaking existing users
**Mitigation**:
- Major version bump (2.0.0)
- Clear migration guide
- Detailed changelog

### Risk 2: Peer dependency hell
**Mitigation**:
- Wide version ranges in peerDependencies
- Optional for non-core features
- Clear error messages for missing peers

### Risk 3: User confusion
**Mitigation**:
- Excellent documentation
- Clear separation of core vs optional
- Install scripts/CLI helper

---

## Next Steps

1. ✅ Document analysis (this file)
2. ⏭️ Wait for build to complete (running in background)
3. ⏭️ Measure current bundle sizes
4. ⏭️ Implement Phase 1 externalizations
5. ⏭️ Test with sample app
6. ⏭️ Measure bundle savings
7. ⏭️ Update documentation
8. ⏭️ Create migration guide

---

## References

- Wave 6 Analysis: Mentioned react-markdown stack should be externalized
- Token Optimization Success: Reduced main bundle by 38KB via subpath separation
- Industry Standard: Next.js, Remix, and other frameworks externalize heavy dependencies
