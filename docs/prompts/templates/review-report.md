# Code Review Report Template

Use this template to format code review findings consistently.

---

## Review Report: [Component/File Name]

**Reviewer**: [AI Assistant]
**Date**: [YYYY-MM-DD]
**Review Type**: [Full | Security | Performance | TypeScript | Tailwind | Clarity Chat]
**Files Reviewed**: [count]

---

## Summary

| Metric | Count |
|--------|-------|
| 🔴 Critical | X |
| 🟡 Improvements | X |
| 🟢 Excellent | X |
| **Overall Quality** | X/10 |

### Quick Assessment

```
Security:      ██████████ 10/10
Performance:   ████████░░  8/10
TypeScript:    █████████░  9/10
Tailwind:      ███████░░░  7/10
Architecture:  ████████░░  8/10
```

---

## 🔴 Critical Issues

> Must fix before merge

### 1. [Issue Title]

**Location**: `path/to/file.tsx:123`
**Category**: Security | Performance | Type Safety
**Impact**: High

**Problem**:
```tsx
// Current code with issue highlighted
```

**Fix**:
```tsx
// Corrected code
```

**Why it matters**: [Explanation of the risk/impact]

---

### 2. [Issue Title]

**Location**: `path/to/file.tsx:456`
...

---

## 🟡 Improvements

> Recommended enhancements

### 1. [Suggestion Title]

**Location**: `path/to/file.tsx:789`
**Category**: Performance | DX | Maintainability
**Effort**: Low | Medium | High

**Current**:
```tsx
// Current implementation
```

**Suggested**:
```tsx
// Improved implementation
```

**Benefit**: [What improves with this change]

---

## 🟢 Excellent Patterns

> Worth highlighting and replicating

### 1. [Pattern Name]

**Location**: `path/to/file.tsx:101`

```tsx
// Code that exemplifies best practices
```

**Why it's good**: [Explanation]

---

## Provider Compatibility

> For Clarity Chat components only

| Feature | OpenAI | Anthropic | Google | Notes |
|---------|--------|-----------|--------|-------|
| Streaming | ✓ | ✓ | ✓ | All providers support |
| Tool Calls | ✓ | ✓ | ⚠️ | Google has limitations |
| ... | ... | ... | ... | ... |

---

## Action Items

- [ ] Fix critical issue #1
- [ ] Fix critical issue #2
- [ ] Consider improvement #1
- [ ] Consider improvement #2

---

## Notes

[Any additional context, questions for the author, or discussion points]

---

*Generated using Clarity Chat Code Review Framework*
