# Example Consolidation Plan

## Overview

Plan for consolidating and organizing the 24 example files in `src/examples/`.

**Date**: Post-Phase 4 Cleanup  
**Status**: ⏳ Planning Complete, Ready for Implementation

---

## 📊 Current State

### Example Files (24 total)

**Phase 4 Examples** (Recommended) ⭐:
1. `hello-world-examples.tsx` - 5 simple examples (1-12 LOC)
2. `intermediate-examples.tsx` - 4 real-world examples (35-50 LOC)
3. `advanced-examples.tsx` - 4 enterprise examples (70-100 LOC)

**Legacy Examples** (Functional but may use older patterns):
4. `basic-clarity-chat-example.tsx` - Basic usage with `useClarityChat`
5. `clarity-chat-quickstart.tsx` - Quickstart examples
6. `advanced-clarity-chat-example.tsx` - Advanced features
7. `clarity-chat-with-memory-example.tsx` - Memory examples
8. `clarity-chat-error-handling-example.tsx` - Error handling
9. `clarity-chat-websocket-example.tsx` - WebSocket examples
10. `happy-path-workflows.tsx` - Happy path workflows
11. `composable-examples.tsx` - Composable patterns
12. `recipe-examples.tsx` - Recipe components
13. `unified-chat-examples.tsx` - Unified chat examples
14. `combined-structured-tools-example.tsx` - Structured tools
15. `tool-ui-components.tsx` - Tool UI components
16. `generative-ui-tools.tsx` - Generative UI tools
17. `nextjs-integration-example.tsx` - Next.js integration
18. `generative-ui-integrated.tsx` - Generative UI integrated
19. `streaming-chat-example.tsx` - Streaming examples
20. `product-recommendation-object.tsx` - Product recommendation
21. `clarity-chat-advanced-example.tsx` - Advanced example

**Prompt Examples** (In subdirectory):
22. `src/prompt/examples/advanced-optimization-example.tsx`
23. `src/prompt/examples/prompt-optimization-example.tsx`
24. `src/prompt/examples/quick-start-example.tsx`

---

## 🎯 Consolidation Strategy

### Phase 1: Keep Phase 4 Examples ✅

**Keep** (These are the current standard):
- ✅ `hello-world-examples.tsx`
- ✅ `intermediate-examples.tsx`
- ✅ `advanced-examples.tsx`

**Reason**: These follow Phase 4 architecture and are well-organized.

---

### Phase 2: Review Legacy Examples

**Analysis Needed**:

1. **`clarity-chat-quickstart.tsx`** vs **`hello-world-examples.tsx`**
   - **Overlap**: Both show simplest usage
   - **Difference**: `quickstart` uses inline styles, `hello-world` uses className
   - **Recommendation**: Keep `hello-world-examples.tsx`, archive `quickstart`

2. **`basic-clarity-chat-example.tsx`** vs **`intermediate-examples.tsx`**
   - **Overlap**: Both show `useClarityChat` usage
   - **Difference**: `basic` shows manual conversion, `intermediate` shows `useChat`
   - **Recommendation**: Keep `intermediate-examples.tsx`, update `basic` or archive

3. **`advanced-clarity-chat-example.tsx`** vs **`advanced-examples.tsx`**
   - **Overlap**: Both show advanced patterns
   - **Difference**: `advanced-clarity-chat` may use older patterns
   - **Recommendation**: Review and consolidate into `advanced-examples.tsx`

---

### Phase 3: Organize by Feature

**Proposed Structure**:

```
src/examples/
├── README.md (already created)
├── hello-world-examples.tsx (keep)
├── intermediate-examples.tsx (keep)
├── advanced-examples.tsx (keep)
├── memory/
│   ├── memory-basic.tsx (consolidate memory examples)
│   └── memory-advanced.tsx
├── websocket/
│   └── websocket-example.tsx (consolidate websocket examples)
├── error-handling/
│   └── error-handling-example.tsx (consolidate error examples)
├── tools/
│   ├── tool-ui-basic.tsx (consolidate tool examples)
│   └── tool-ui-advanced.tsx
├── integrations/
│   ├── nextjs-integration.tsx (keep)
│   └── streaming-example.tsx (consolidate streaming)
└── archive/ (move outdated examples here)
    ├── basic-clarity-chat-example.tsx
    ├── clarity-chat-quickstart.tsx
    └── ...
```

---

## 📋 Action Plan

### Step 1: Review All Examples

- [ ] Review each of the 24 example files
- [ ] Identify duplicates and overlaps
- [ ] Categorize by feature/pattern
- [ ] Document findings

### Step 2: Consolidate Similar Examples

- [ ] Merge `clarity-chat-quickstart.tsx` into `hello-world-examples.tsx`
- [ ] Merge `basic-clarity-chat-example.tsx` patterns into `intermediate-examples.tsx`
- [ ] Merge `advanced-clarity-chat-example.tsx` into `advanced-examples.tsx`
- [ ] Consolidate memory examples
- [ ] Consolidate websocket examples
- [ ] Consolidate error handling examples
- [ ] Consolidate tool examples

### Step 3: Organize by Feature

- [ ] Create feature directories (memory, websocket, tools, etc.)
- [ ] Move examples to appropriate directories
- [ ] Update imports and references
- [ ] Update documentation

### Step 4: Archive Outdated Examples

- [ ] Create `archive/` directory
- [ ] Move outdated examples to archive
- [ ] Add deprecation notices
- [ ] Update README

### Step 5: Update Documentation

- [ ] Update `src/examples/README.md`
- [ ] Update main README
- [ ] Update tutorials
- [ ] Update API documentation

---

## 🎯 Benefits

### Organization

- **Before**: 24 files in one directory
- **After**: Organized by feature, clear structure
- **Improvement**: Easier to find relevant examples

### Maintenance

- **Before**: Duplicate examples, hard to maintain
- **After**: Consolidated examples, single source of truth
- **Improvement**: Easier to maintain and update

### Developer Experience

- **Before**: Overwhelming choice, unclear which to use
- **After**: Clear organization, recommended examples
- **Improvement**: Better developer experience

---

## ⚠️ Considerations

### Backward Compatibility

- **Issue**: Examples may be imported elsewhere
- **Solution**: 
  - Keep archive for deprecated examples
  - Add deprecation notices
  - Provide migration guide

### Testing

- **Issue**: Examples may be used in tests
- **Solution**:
  - Update test imports
  - Verify all examples still work
  - Run full test suite

---

## 📈 Success Metrics

### Before

- 24 example files
- Some duplicates
- Unclear organization
- Hard to find relevant examples

### After

- ~10-12 organized example files
- No duplicates
- Clear organization by feature
- Easy to find relevant examples

---

## 📚 Related Documents

- [src/examples/README.md](./src/examples/README.md) - Examples documentation
- [CLEANUP_PLAN.md](./CLEANUP_PLAN.md) - Overall cleanup plan
- [OPTIMIZATION_SUMMARY.md](./OPTIMIZATION_SUMMARY.md) - Optimization opportunities

---

**Last Updated**: Post-Phase 4 Cleanup  
**Status**: ⏳ Planning complete, ready for implementation
