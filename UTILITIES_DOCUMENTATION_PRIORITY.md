# Utilities Documentation Priority Guide

**Purpose:** Identify the 20% of utilities that provide 80% of developer value
**Goal:** Create lean, focused documentation for the docs site
**Date:** 2026-01-21

---

## 🎯 Top Priority: Essential Utilities (Document First)

These are the **must-know utilities** that every developer using Clarity Chat will need.

### **1. Format Utilities** (Highest Usage)
**Package:** `@clarity-chat/utils/format`
**Why:** Used in every UI that displays data

| Function | Use Case | Priority |
|----------|----------|----------|
| `formatBytes()` | File sizes, memory usage | ⭐⭐⭐⭐⭐ |
| `formatDuration()` | Response times, timestamps | ⭐⭐⭐⭐⭐ |
| `formatNumber()` | Counts, metrics | ⭐⭐⭐⭐ |
| `formatPercent()` | Progress, rates | ⭐⭐⭐⭐ |
| `truncate()` | Message previews | ⭐⭐⭐⭐ |

**Doc Page:** "Formatting Utilities" (1 page, ~200 lines)

---

### **2. Message Utilities** (Core Functionality)
**Package:** `@clarity-chat/react/utils/message`
**Why:** Essential for working with chat messages

| Function | Use Case | Priority |
|----------|----------|----------|
| `convertCoreMessageToMessage()` | SDK integration | ⭐⭐⭐⭐⭐ |
| `convertMessageToCoreMessage()` | SDK integration | ⭐⭐⭐⭐⭐ |
| `formatMessagesForAPI()` | API requests | ⭐⭐⭐⭐⭐ |
| `truncateMessagesToTokenLimit()` | Token management | ⭐⭐⭐⭐ |

**Doc Page:** "Message Utilities" (1 page, ~300 lines)

---

### **3. Error Handling** (Critical for Production)
**Package:** `@clarity-chat/error-handling`
**Why:** Every app needs robust error handling

| Component/Hook | Use Case | Priority |
|----------------|----------|----------|
| `<ErrorBoundary>` | Catch React errors | ⭐⭐⭐⭐⭐ |
| `useErrorHandler()` | Handle async errors | ⭐⭐⭐⭐⭐ |
| `<ErrorDisplay>` | Show user-friendly errors | ⭐⭐⭐⭐ |
| Error classes | Type-safe error handling | ⭐⭐⭐⭐ |

**Doc Page:** "Error Handling Guide" (1 page, ~400 lines with examples)

---

### **4. Validation Utilities** (Common Need)
**Package:** `@clarity-chat/utils/validation`
**Why:** Input validation is universal

| Function | Use Case | Priority |
|----------|----------|----------|
| `isString()` / `isNumber()` / `isBoolean()` | Type guards | ⭐⭐⭐⭐⭐ |
| `assertDefined()` | Null checks | ⭐⭐⭐⭐ |
| `isValidEmail()` / `isValidUrl()` | Form validation | ⭐⭐⭐⭐ |
| `pick()` / `omit()` | Object utilities | ⭐⭐⭐ |

**Doc Page:** "Validation & Type Guards" (1 page, ~250 lines)

---

### **5. Async Utilities** (Frequently Used)
**Package:** `@clarity-chat/utils/async`
**Why:** Common patterns every developer needs

| Function | Use Case | Priority |
|----------|----------|----------|
| `retry()` | Network resilience | ⭐⭐⭐⭐⭐ |
| `timeout()` | Request timeouts | ⭐⭐⭐⭐ |
| `debounce()` | Search input | ⭐⭐⭐⭐ |
| `throttle()` | Scroll handlers | ⭐⭐⭐⭐ |
| `sleep()` | Testing, delays | ⭐⭐⭐ |

**Doc Page:** "Async Utilities" (1 page, ~300 lines)

---

### **6. Cache & Memoization** (Performance)
**Package:** `@clarity-chat/utils/cache`
**Why:** Critical for performance optimization

| Utility | Use Case | Priority |
|---------|----------|----------|
| `memoize()` | Cache expensive calculations | ⭐⭐⭐⭐⭐ |
| `memoizeAsync()` | Cache API calls | ⭐⭐⭐⭐⭐ |
| `LRUCache` | General caching | ⭐⭐⭐⭐ |
| `TTLCache` | Time-based caching | ⭐⭐⭐ |

**Doc Page:** "Caching & Memoization" (1 page, ~350 lines)

---

## 📚 Secondary Priority: Important Utilities (Document Second)

These utilities are important for specific use cases.

### **7. Token Optimization** (AI-Specific)
**Package:** `@clarity-chat/react/utils/tokenization`
**Focus on:** Top 3-4 most-used functions only

| Function | Use Case | Priority |
|----------|----------|----------|
| `estimateTokens()` | Quick token counting | ⭐⭐⭐⭐ |
| `countTokens()` | Accurate counting | ⭐⭐⭐⭐ |
| `truncateToTokenBudget()` | Stay within limits | ⭐⭐⭐ |

**Doc Page:** "Token Management Essentials" (1 page, ~200 lines - overview only)
**Note:** Link to full API reference for advanced features

---

### **8. Memory Management** (AI-Specific)
**Package:** `@clarity-chat/memory`
**Focus on:** Core API only

| API | Use Case | Priority |
|-----|----------|----------|
| `clarityMemory()` | Factory function | ⭐⭐⭐⭐ |
| Basic CRUD operations | Add/recall memories | ⭐⭐⭐⭐ |
| Configuration | Setup guide | ⭐⭐⭐ |

**Doc Page:** "Memory System Quick Start" (1 page, ~250 lines)
**Note:** Link to full docs for advanced features

---

### **9. Configuration** (Setup)
**Package:** `@clarity-chat/utils/config-manager`

| API | Use Case | Priority |
|-----|----------|----------|
| `createConfigManager()` | Type-safe config | ⭐⭐⭐ |
| Basic validation | Config validation | ⭐⭐⭐ |

**Doc Page:** "Configuration Management" (1 page, ~200 lines)

---

### **10. Logger** (Debugging)
**Package:** `@clarity-chat/utils/logger`

| API | Use Case | Priority |
|-----|----------|----------|
| `logger` instance | Basic logging | ⭐⭐⭐ |
| Log levels | Configuration | ⭐⭐⭐ |

**Doc Page:** "Logging" (1 page, ~150 lines)

---

## 🔍 Low Priority: Specialized Utilities (Reference Only)

Don't create dedicated doc pages. Instead, provide:
- **API Reference** (auto-generated from JSDoc)
- **Examples in context** (show usage in relevant guides)
- **Link from main docs** when mentioned

### Specialized Utilities (Reference Only)
- Security utilities (sanitize, safe-evaluate)
- Advanced token optimization (30+ functions)
- Streaming utilities
- TOON format
- Mobile detection
- Performance monitoring
- Advanced error recovery
- Circuit breakers
- Request batching
- And ~300 other utilities

**Approach:** Auto-generate API reference, link when relevant

---

## 📖 Documentation Strategy

### **For Docs Site** (Maximum 10 Pages)

1. **Formatting Utilities** - 1 page
2. **Message Utilities** - 1 page
3. **Error Handling Guide** - 1 page
4. **Validation & Type Guards** - 1 page
5. **Async Utilities** - 1 page
6. **Caching & Memoization** - 1 page
7. **Token Management Essentials** - 1 page
8. **Memory System Quick Start** - 1 page
9. **Configuration Management** - 1 page
10. **Logging** - 1 page

**Total:** ~2,500 lines of focused, practical documentation

### **For API Reference** (Auto-Generated)

- Complete JSDoc for all 400+ utilities
- Searchable API reference
- Examples in JSDoc comments
- Link from main docs

### **For Examples Section**

- Show utilities in context of real use cases
- "Building a Chat App" tutorial using key utilities
- "Performance Optimization" guide using caching
- "Error Handling Best Practices" with examples

---

## 🎯 Success Criteria

### Developer Can Answer:
✅ "What formatting utilities are available?"
✅ "How do I handle errors in my chat app?"
✅ "How do I convert between message formats?"
✅ "What's the easiest way to cache API calls?"
✅ "How do I validate user input?"
✅ "How do I make my code more resilient?"

### Developer Can Find:
✅ The 20 most important utilities in 10 focused pages
✅ Complete API reference for everything else
✅ Examples showing real-world usage
✅ Links to relevant utilities in context

---

## 📊 Impact Analysis

### Current Problem:
- 400+ utilities → overwhelming
- No clear starting point
- Hard to know what's important
- Developers re-implement basic utilities

### Solution:
- **10 focused pages** → easy to navigate
- **Clear priorities** → know what to learn first
- **Practical examples** → copy-paste ready
- **Complete reference** → findable when needed

### Benefits:
- ✅ **80/20 rule** - Document 20% that's used 80% of the time
- ✅ **Lower cognitive load** - Focused, not overwhelming
- ✅ **Faster onboarding** - Developers productive quickly
- ✅ **Better discoverability** - Easy to find what you need
- ✅ **Maintainable** - Less docs to keep updated

---

## 🚀 Implementation Plan

### Phase 1: Create Core Pages (Week 1)
1. ✅ Format utilities page
2. ✅ Message utilities page
3. ✅ Error handling guide
4. ✅ Validation utilities page
5. ✅ Async utilities page

### Phase 2: Add Important Pages (Week 2)
6. ✅ Caching & memoization page
7. ✅ Token management essentials
8. ✅ Memory quick start
9. ✅ Configuration management
10. ✅ Logging page

### Phase 3: Auto-Generate Reference (Week 3)
- Set up JSDoc → API reference generation
- Ensure all utilities have proper JSDoc
- Create searchable reference site
- Add "See also" links between pages

### Phase 4: Add Contextual Examples (Week 4)
- Tutorial: "Building Your First Chat App"
- Guide: "Performance Optimization"
- Guide: "Production-Ready Error Handling"
- Cookbook: "Common Patterns"

---

## 📋 Template for Each Doc Page

```markdown
# [Utility Category Name]

> One-sentence description of what these utilities do and why they're important.

## When to Use

- Use case 1
- Use case 2
- Use case 3

## Quick Start

[Minimal working example showing most common usage]

## Core Functions

### functionName()

**Purpose:** One sentence describing what it does

**Usage:**
[code example]

**Parameters:**
- param1: description
- param2: description

**Returns:** description

**Common Patterns:**
[2-3 real-world examples]

**See Also:** [Links to related utilities]

## Best Practices

- Tip 1
- Tip 2
- Tip 3

## API Reference

[Link to full auto-generated reference]
```

---

## ✅ Next Steps

1. **Approve this prioritization** - Confirm top 10 utilities to document
2. **Create doc pages** - Write 10 focused pages (~250 lines each)
3. **Auto-generate reference** - Set up JSDoc extraction
4. **Add examples** - Show utilities in context
5. **Get feedback** - Iterate based on developer needs

---

**This approach gives developers:**
- 🎯 **Clarity** - Know what's important
- ⚡ **Speed** - Get started quickly
- 📖 **Depth** - Find details when needed
- ✨ **Confidence** - Best practices included

**Instead of overwhelming with 400+ utilities, we guide developers to the 20-30 they actually need! 🚀**
