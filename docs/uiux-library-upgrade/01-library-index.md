# Phase 2: Library Index & Surface Area Mapping

> **Created**: 2025-01-XX
> **Status**: Not Started
> **Goal**: Complete inventory of all public APIs and component surface area

---

## Table of Contents

1. [Public API Inventory](#public-api-inventory)
2. [Component Catalog](#component-catalog)
3. [Hooks Catalog](#hooks-catalog)
4. [Utilities Catalog](#utilities-catalog)
5. [Context Providers](#context-providers)
6. [Duplicate/Overlap Analysis](#duplicate-overlap-analysis)
7. [Styling Architecture](#styling-architecture)
8. [Storybook Coverage](#storybook-coverage)

---

## Public API Inventory

### Export Structure

From `/packages/react/package.json` exports:

```typescript
// Main exports
import { ... } from '@clarity-chat/react'

// Modular exports
import { ... } from '@clarity-chat/react/core'
import { ... } from '@clarity-chat/react/animations'
import { ... } from '@clarity-chat/react/utils'
import { ... } from '@clarity-chat/react/prompt'
import { ... } from '@clarity-chat/react/analytics'
import { ... } from '@clarity-chat/react/memory'
import { ... } from '@clarity-chat/react/adapters'
import { ... } from '@clarity-chat/react/test-utils'

// Styles
import '@clarity-chat/react/styles.css'
```

### Current Component Count

**Claimed**: 200+ components  
**Actual**: *[To be counted]*

---

## Component Catalog

### Component Matrix Template

For each component, document:

| Component | Purpose | Required Props | Optional Props | Variants | Theming | Accessibility | Storybook | Notes |
|-----------|---------|---------------|----------------|----------|---------|---------------|-----------|-------|
| Name | Brief | List | List | Yes/No | Yes/No | WCAG Level | ✅/❌ | Issues |

### Component Categories

#### 🗨️ Chat Components
*[To be cataloged]*

#### 💬 Message Components
*[To be cataloged]*

#### ⌨️ Input Components
*[To be cataloged]*

#### 🎨 Theme Components
*[To be cataloged]*

#### 🔧 Utility Components
*[To be cataloged]*

#### 🏢 Enterprise Components
*[To be cataloged]*

#### 🎯 AI-Specific Components
*[To be cataloged]*

---

## Hooks Catalog

### Hooks Matrix Template

| Hook | Purpose | Parameters | Return Value | Dependencies | Edge Cases | Tests | Docs |
|------|---------|-----------|--------------|--------------|------------|-------|------|
| Name | Brief | Types | Types | List | Known issues | ✅/❌ | ✅/❌ |

### Current Hook Count

**Claimed**: 140+ hooks  
**Actual**: *[To be counted]*

### Hook Categories

#### 🔄 Streaming Hooks
*[To be cataloged]*

#### 💾 Memory Hooks
*[To be cataloged]*

#### 🎨 Theme Hooks
*[To be cataloged]*

#### 📊 Analytics Hooks
*[To be cataloged]*

#### 🔒 Security Hooks
*[To be cataloged]*

---

## Utilities Catalog

### Utility Functions
*[To be cataloged]*

### Helper Functions
*[To be cataloged]*

### Type Utilities
*[To be cataloged]*

---

## Context Providers

### Available Contexts

*[To be mapped]*

---

## Duplicate/Overlap Analysis

### Identified Duplicates

*[To be analyzed]*

### Overlapping Functionality

*[To be analyzed]*

### Inconsistent APIs

*[To be identified]*

---

## Styling Architecture

### Current Approach

- **Base**: Tailwind CSS
- **Variants**: class-variance-authority (CVA)
- **Utilities**: tailwind-merge, clsx

### Theme System

*[To be documented]*

### CSS Architecture

*[To be analyzed]*

---

## Storybook Coverage

### Story Files Analysis

*[To be completed]*

### Missing Stories

*[To be identified]*

### Story Quality Assessment

*[To be evaluated]*

---

## Next Steps

- [ ] Run automated component counting script
- [ ] Manually review each component file
- [ ] Document all public APIs
- [ ] Identify overlaps and inconsistencies
- [ ] Move to Phase 3: Audit
