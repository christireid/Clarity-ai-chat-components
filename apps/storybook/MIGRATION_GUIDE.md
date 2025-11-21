# Migration Guide: Storybook Redesign

> Guide to navigating the redesigned Storybook structure

## Overview

The Storybook has been completely reorganized for better usability and discoverability. This guide helps you find components, hooks, and patterns in the new structure.

**Key Changes:**
- ✨ Clear 7-section organization (was: flat structure with 132+ stories)
- 📚 20 new documented patterns with best practices
- 🎨 11 professional theme presets (was: basic light/dark)
- 🗂️ Organized into logical categories with overview pages
- ⚡ Zero critical errors (was: multiple build issues)

---

## Quick Reference: Where Did Everything Go?

### Finding Components

| Old Location | New Location | Section |
|--------------|--------------|---------|
| `Button.stories.tsx` (root) | Components → UI → Button | Components/UI |
| `Message.stories.tsx` (root) | Components → Chat → Message | Components/Chat |
| `ChatInput.stories.tsx` (root) | Components → Chat → ChatInput | Components/Chat |
| `ChatWindow.stories.tsx` (root) | Components → Chat → ChatWindow | Components/Chat |
| `StreamingMessage.stories.tsx` | Components → Streaming → StreamingMessage | Components/Streaming |
| `TokenOptimizationDashboard` | Components → Token Optimization → Dashboard | Components/Token-Optimization |
| `SSOConfigWizard` | Components → Enterprise → SSO Config Wizard | Components/Enterprise |
| `Dialog.stories.tsx` | Components → UI → Dialog | Components/UI |
| `Toast.stories.tsx` | Components → UI → Toast | Components/UI |

### Finding Hooks

| Old Location | New Location | Section |
|--------------|--------------|---------|
| `useChat.stories.tsx` (root) | Hooks → Chat → useChat | Hooks/Chat |
| `useStreaming.stories.tsx` (root) | Hooks → Streaming → useStreaming | Hooks/Streaming |
| `useDebounce.stories.tsx` | Hooks → Performance → useDebounce | Hooks/Performance |
| `useToggle.stories.tsx` | Hooks → UI → useToggle | Hooks/UI |
| `useLocalStorage.stories.tsx` | Hooks → State → useLocalStorage | Hooks/State |
| `useMessageOperations` | Hooks → Chat → useMessageOperations | Hooks/Chat |
| `useTokenOptimization` | Hooks → AI → useTokenOptimization | Hooks/AI |

### Finding Advanced Features

| Old Location | New Location | Section |
|--------------|--------------|---------|
| `Agent.stories.tsx` | Advanced → AI → Agent | Advanced/AI |
| `RAG.stories.tsx` | Advanced → AI → RAG | Advanced/AI |
| `Memory.stories.tsx` | Advanced → Memory → Memory Store | Advanced/Memory |
| `WebSocket.stories.tsx` | Advanced → Streaming → WebSocket | Advanced/Streaming |
| `RBAC.stories.tsx` | Advanced → Enterprise → RBAC | Advanced/Enterprise |
| `MultiTenancy.stories.tsx` | Advanced → Enterprise → Multi-tenancy | Advanced/Enterprise |

### Finding Examples

| Old Location | New Location | Section |
|--------------|--------------|---------|
| `SimpleChat.stories.tsx` | Examples → Simple Chat | Examples |
| `StreamingChat.stories.tsx` | Examples → Streaming | Examples |
| `FinancialAdvisor.stories.tsx` | Examples → Financial Advisor | Examples |
| `HealthcareAssistant.stories.tsx` | Examples → Healthcare Assistant | Examples |

---

## Navigation: Old vs New

### Old Structure (Before)
```
stories/
├── Button.stories.tsx
├── Message.stories.tsx
├── ChatInput.stories.tsx
├── useChat.stories.tsx
├── useStreaming.stories.tsx
├── Agent.stories.tsx
├── RAG.stories.tsx
└── ... 132+ files at root level
```

**Problems:**
- ❌ No clear categorization
- ❌ Hard to find related components
- ❌ No best practices documentation
- ❌ Overwhelming for new users

### New Structure (After)
```
stories/
├── Welcome/              # Start here!
├── Foundation/           # Design system
├── Components/           # UI components (organized by type)
├── Advanced/             # Advanced features
├── Hooks/                # React hooks (organized by category)
├── Examples/             # Complete use cases
└── Patterns/             # Best practices ⭐ NEW!
```

**Benefits:**
- ✅ Clear 7-section hierarchy
- ✅ Find anything in ≤3 clicks
- ✅ Overview pages for each section
- ✅ 20 documented patterns

---

## How to Find What You Need

### Method 1: Browse by Section

1. **Start with section overview pages:**
   - Components → Overview (catalog of all components)
   - Hooks → Overview (catalog of all hooks)
   - Advanced → Overview (catalog of advanced features)
   - Patterns → Overview (best practices library)

2. **Navigate to subcategory:**
   - Example: Components → Chat → Message

3. **View component documentation**

### Method 2: Use Search

1. Press `/` or click search icon
2. Type component/hook name (e.g., "useChat", "Message")
3. Navigate directly to the story

### Method 3: Use Quick Links

Navigate to **Welcome → Navigation** for quick links to common sections.

---

## Common Tasks in New Structure

### Task: "I want to build a chat interface"

**Old Way:** Search through 132+ stories at root level

**New Way:**
1. Visit **Patterns → Chat → Overview**
2. Read about multi-turn conversation patterns
3. Check **Components → Chat → Overview** for available components
4. View **Examples → Simple Chat** for complete implementation

### Task: "I need a streaming response"

**Old Way:** Find `useStreaming.stories.tsx` in flat list

**New Way:**
1. Visit **Patterns → AI → Streaming Responses**
2. Check **Hooks → Streaming → useStreaming**
3. View working example: **Patterns → AI → Streaming** story

### Task: "I want to customize the theme"

**Old Way:** Basic light/dark switcher

**New Way:**
1. Use theme switcher toolbar (11 professional presets!)
2. Visit **Foundation → Colors & Themes** for customization guide
3. Themes include: Professional, Healthcare, Finance, Midnight, Cyberpunk, Forest

### Task: "I need form validation patterns"

**Old Way:** No patterns documentation existed

**New Way:**
1. Visit **Patterns → Forms → Overview**
2. Read about validation patterns
3. View working example: **Patterns → Forms → Multi-step Forms**

### Task: "I want to see complete examples"

**Old Way:** Examples scattered throughout stories

**New Way:**
1. Visit **Examples → Overview**
2. Browse 7 complete use cases
3. Copy working code directly

---

## Breaking Changes

### ⚠️ No Breaking Changes to Components or Hooks

**Good News:** All component and hook APIs remain unchanged. Only the Storybook organization changed.

**Your Code:** No changes needed to your application code
**Imports:** All imports still work exactly the same way
```typescript
// These still work unchanged
import { Message, ChatInput, ChatWindow } from '@clarity-chat/react'
import { useChat, useStreaming } from '@clarity-chat/react'
```

### What Changed: Storybook Organization Only

| What Changed | Impact |
|--------------|--------|
| Story file locations | None - only Storybook navigation affected |
| Story titles | None - only breadcrumbs in Storybook UI |
| Component APIs | None - all components work the same |
| Hook APIs | None - all hooks work the same |
| Theme system | Enhanced - 11 themes instead of 2 |

---

## New Features & Additions

### 1. Patterns Section ⭐ NEW!

**What is it?**
A comprehensive library of 20 documented patterns with best practices for building production-ready chat interfaces.

**How to use:**
1. Visit **Patterns → Overview**
2. Choose category: Chat, Forms, Layout, or AI
3. Read pattern documentation
4. View working examples

**Categories:**
- **Chat Patterns** (5) - Multi-turn conversations, branching, threading, typing indicators, reactions
- **Form Patterns** (5) - Multi-step forms, validation, file uploads, auto-save, state management
- **Layout Patterns** (5) - Mobile-first, split-view, responsive sidebar, modals, virtual scrolling
- **AI Patterns** (5) - Streaming, token optimization, RAG, tool calling, multi-modal input

### 2. Overview Pages

Each major section now has an overview page:
- **Components → Overview** - All components catalog
- **Advanced → Overview** - Advanced features catalog
- **Hooks → Overview** - All hooks catalog
- **Patterns → Overview** - Patterns library catalog
- **Examples → Overview** - Complete examples catalog

### 3. Professional Themes

11 professional theme presets (WCAG AA compliant):

**Light Themes:**
- Professional Light (default)
- Healthcare Light
- Finance Light

**Dark Themes:**
- Professional Dark
- Healthcare Dark
- Finance Dark
- Midnight
- Cyberpunk
- Forest

**Neutral:**
- System (auto light/dark)
- Minimal Light

Access via theme switcher in toolbar.

### 4. Foundation Section

New section documenting design system fundamentals:
- Getting Started
- Design Principles
- Colors & Themes
- Typography
- Layout & Spacing
- Accessibility

### 5. Welcome Section

Improved onboarding:
- Welcome → Introduction
- Welcome → What's New
- Welcome → Navigation Guide
- Welcome → Getting Started

---

## Tips for Using the New Structure

### For First-Time Users

1. **Start with Welcome → Introduction**
2. **Browse Foundation → Getting Started**
3. **Explore Patterns → Overview** for best practices
4. **Check Examples → Overview** for complete use cases

### For Returning Users

1. **Use search** (press `/`) to find familiar components
2. **Check section overviews** to see what's in each category
3. **Explore new Patterns section** for best practices
4. **Try new theme presets** with toolbar switcher

### For Developers Building Features

1. **Start with Patterns** to find recommended approaches
2. **Check Components** for available UI elements
3. **Review Hooks** for state management
4. **Reference Advanced** for complex features
5. **Study Examples** for complete implementations

---

## Before & After Comparison

### Before: Flat Structure
```
❌ 132+ stories at root level
❌ No categorization
❌ No patterns documentation
❌ Basic theming (light/dark only)
❌ Build errors present
❌ Hard to navigate
```

### After: Organized Structure
```
✅ 145 pages in 7 clear sections
✅ Logical categorization
✅ 20 documented patterns
✅ 11 professional themes
✅ Zero critical errors
✅ Find anything in ≤3 clicks
```

---

## Frequently Asked Questions

### Q: Do I need to update my code?
**A:** No! All component and hook APIs remain unchanged. Only Storybook navigation changed.

### Q: Where did [component name] go?
**A:** Use the search feature (press `/`) or check the "Quick Reference" table above.

### Q: What are "Patterns"?
**A:** New section documenting 20 best practices with working examples for building chat interfaces.

### Q: How do I switch themes?
**A:** Use the theme switcher in the Storybook toolbar (looks like a paint palette icon).

### Q: Can I still find everything?
**A:** Yes! Everything is now better organized. Use section overviews or search to find anything.

### Q: Where are the examples?
**A:** All examples are in **Examples** section with a new overview page.

### Q: How do I learn best practices?
**A:** Visit the new **Patterns** section for 20 documented patterns with examples.

### Q: Are there any breaking changes?
**A:** No breaking changes to any components, hooks, or APIs. Only Storybook organization changed.

---

## Section-by-Section Guide

### 1. Welcome (4 pages)
**What's here:** Introduction, navigation guide, getting started, what's new
**Start here if:** You're new to Clarity Chat Storybook

### 2. Foundation (7 pages)
**What's here:** Design principles, colors, themes, typography, layout, accessibility
**Use this for:** Understanding the design system fundamentals

### 3. Components (60 pages)
**What's here:** All UI components organized by type
**Subcategories:**
- Chat (Message, MessageList, ChatInput, ChatWindow)
- Streaming (StreamingMessage, StreamBlock)
- Token Optimization (Dashboard, Panel, Badge)
- Enterprise (SSO, Seats, API Tokens)
- UI (Button, Input, Dialog, Toast, etc.)

### 4. Advanced Features (37 pages)
**What's here:** Advanced functionality and integrations
**Subcategories:**
- AI (Agents, tool calling)
- Streaming (Real-time, WebSocket)
- Memory (Context management)
- RAG (Document retrieval)
- Enterprise (Multi-tenancy, RBAC)

### 5. Hooks (25 pages)
**What's here:** All React hooks organized by category
**Subcategories:**
- Chat (useChat, useMessageOperations)
- Streaming (useStreaming, useStreamingSSE)
- Performance (useDebounce, useThrottle)
- UI (useToggle, useMediaQuery)
- State (useLocalStorage, useIndexedDB)

### 6. Examples (8 pages)
**What's here:** Complete real-world use cases
**Includes:** Simple chat, streaming, financial advisor, healthcare assistant, model switching, virtualization

### 7. Patterns ⭐ NEW! (8 pages)
**What's here:** 20 documented patterns with best practices
**Categories:** Chat, Forms, Layout, AI
**Includes:** Working examples with code

---

## Getting Help

### If You Can't Find Something

1. **Use search** (press `/` in Storybook)
2. **Check section overviews** (each major section has one)
3. **Consult this migration guide** (see Quick Reference table)
4. **Visit Welcome → Navigation** for quick links

### If Something Doesn't Work

1. **Check browser console** for errors
2. **Verify you're using latest version** of packages
3. **Review troubleshooting** in main README.md
4. **Open an issue** on GitHub if problem persists

### Resources

- **Main README**: [/apps/storybook/README.md](./README.md)
- **Project Docs**: [/apps/docs](../docs)
- **GitHub Issues**: [Report issues](https://github.com/christireid/Clarity-ai-chat-components/issues)

---

## Timeline of Changes

- **Phase 1-2**: Foundation & initial organization (completed)
- **Phase 3**: Full reorganization into 7 sections (completed)
- **Phase 4**: Patterns section with 20 documented patterns (completed)
- **Phase 5**: Launch preparations (in progress)

**Current Status:** 145 total pages, 20 patterns, 11 themes, zero critical errors

---

## Summary: What You Need to Know

1. **No code changes needed** - All APIs unchanged
2. **Better organization** - 7 clear sections instead of flat structure
3. **New Patterns section** - 20 documented best practices
4. **More themes** - 11 professional presets
5. **Use search** - Press `/` to find anything quickly
6. **Check overviews** - Each section has a catalog page
7. **Everything is still here** - Just better organized

---

**Welcome to the redesigned Storybook!** 🎉

Find everything in ≤3 clicks, explore 20 patterns, and enjoy 11 professional themes.

For questions or feedback, visit [GitHub Issues](https://github.com/christireid/Clarity-ai-chat-components/issues).
