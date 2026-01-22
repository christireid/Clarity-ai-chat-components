# Information Architecture

**Status:** Designed and finalized
**Date:** 2026-01-22
**Phase:** PHASE 2

## Design Principles

1. **User Mental Models First** - Organize by user journey, not internal taxonomy
2. **Shallow Hierarchy** - Maximum 3 levels deep
3. **Clear Purpose** - Every section must serve a distinct user need
4. **No Redundancy** - Single source of truth for each concept
5. **Progressive Disclosure** - Start simple, reveal complexity as needed

## Analysis of Current IA

### Current Structure (Problems Identified)

**Existing Top-Level Sections:**
- Home
- Learn
- Reference
- Guides
- Cookbook
- Demos
- Examples
- Tools
- Enterprise
- About/Contributing/Changelog/etc.

**Key Issues:**
1. **Overlap** - "Learn/Guides" vs "Guides" creates confusion
2. **Too Many Entry Points** - 10+ top-level sections overwhelm users
3. **Unclear Distinctions** - "Examples" vs "Cookbook" vs "Demos" are conceptually similar
4. **Deep Nesting** - Some sections go 4-5 levels deep
5. **Redundant Paths** - Same content accessible from multiple places

## Streamlined IA (Finalized)

### Top-Level Structure (6 sections)

```
┌─────────────────────────────────────────────────────────┐
│                         HOME                            │
│  Hero • Value Prop • Quick Demo • Get Started CTA       │
└─────────────────────────────────────────────────────────┘
                            ↓
┌──────────┬──────────┬──────────┬──────────┬──────────┐
│   GET    │  BUILD   │ EXPLORE  │   API    │  ABOUT   │
│ STARTED  │          │          │          │          │
└──────────┴──────────┴──────────┴──────────┴──────────┘
```

### 1. HOME
**Purpose:** First impression, value proposition, immediate entry point
**Content:**
- Hero with value prop
- Key differentiators (Token Optimization, 155+ components)
- Live demo preview
- Installation snippet
- CTA to Get Started

**User Need:** "What is this? Why should I care? Can I try it?"

---

### 2. GET STARTED
**Purpose:** Get users productive in < 10 minutes
**Path:** `/get-started`

**Structure:**
```
GET STARTED
├── Quick Start (3-5 min path to first chat)
├── Installation
├── Your First Chat
├── Core Concepts
│   ├── Components
│   ├── Hooks
│   ├── Styling
│   └── State
└── Next Steps
```

**User Need:** "Show me how to get this working, fast"

**Rationale:**
- Single, linear path for new users
- No branching until core concepts are understood
- Removed: Multiple "getting started" variants, tutorials section
- **Max Depth:** 2 levels

---

### 3. BUILD
**Purpose:** Task-based guides for building features
**Path:** `/build`

**Structure:**
```
BUILD
├── Basics
│   ├── Streaming Responses
│   ├── Message History
│   ├── Custom Styling
│   └── Error Handling
├── AI Features
│   ├── RAG Integration
│   ├── Tool Calling
│   ├── Multi-Agent Systems
│   └── Token Optimization
├── Production
│   ├── Authentication
│   ├── Performance
│   ├── Security
│   ├── Deployment
│   └── Monitoring
└── Enterprise
    ├── RBAC
    ├── Multi-Tenancy
    ├── SSO
    └── Compliance
```

**User Need:** "I need to implement X feature"

**Rationale:**
- Organized by user goal, not technology
- Combines former "Guides", "Cookbook", "Learn/Guides"
- Progressive complexity: Basics → AI → Production → Enterprise
- **Max Depth:** 2 levels

---

### 4. EXPLORE
**Purpose:** Interactive examples and demos
**Path:** `/explore`

**Structure:**
```
EXPLORE
├── Interactive Demos
│   ├── Zero to Chat (quickest demo)
│   ├── Streaming in Action
│   ├── Token Optimization
│   ├── RAG Document Chat
│   └── Tool Calling / Agents
├── Example Apps
│   ├── Customer Support Bot
│   ├── Code Assistant
│   ├── Education Tutor
│   └── Healthcare Assistant
└── Playground
    └── Live Code Editor
```

**User Need:** "Show me what's possible"

**Rationale:**
- Consolidates Demos, Examples, Cookbook (redundancy eliminated)
- Organized by interactivity level: Demos (watch) → Examples (explore) → Playground (experiment)
- Focused on showcasing capabilities, not teaching implementation
- **Max Depth:** 2 levels

---

### 5. API
**Purpose:** Comprehensive API reference
**Path:** `/api`

**Structure:**
```
API
├── Components
│   ├── Core (ClarityChat, ChatWindow, Message, etc.)
│   ├── Interactive (CommandPalette, VoiceInput, etc.)
│   ├── Streaming (StreamingMessage, etc.)
│   ├── AI (ChainOfThought, ToolExecutionCard, etc.)
│   └── UI (Avatar, Button, Badge, etc.)
├── Hooks
│   ├── Chat Hooks
│   ├── State Hooks
│   ├── Performance Hooks
│   └── Utility Hooks
├── Types
├── Utilities
└── Model Adapters
```

**User Need:** "What does this API accept? What does it return?"

**Rationale:**
- Pure reference, no tutorials or guides
- Grouped by component type
- Alphabetically sorted within groups (not in IA, but in implementation)
- Search-first experience
- **Max Depth:** 2 levels

---

### 6. ABOUT
**Purpose:** Project information and meta-content
**Path:** `/about`

**Structure:**
```
ABOUT
├── Why Clarity?
├── Comparison (vs Vercel AI SDK, etc.)
├── Changelog
├── License
├── Contributing
└── Support
```

**User Need:** "Who built this? How is it maintained? How can I contribute?"

**Rationale:**
- Non-technical, project-level information
- Separate from documentation to reduce cognitive load
- **Max Depth:** 1 level (flat)

---

## Removed Sections (with Rationale)

### 1. Separate "Guides" Section
**Why Removed:** Merged into "Build" - redundant with Learn
**Migration:** All task-based content → `/build`

### 2. Separate "Cookbook" Section
**Why Removed:** Conceptually identical to examples and demos
**Migration:** Recipe-style content → `/explore/example-apps` or `/build` (depending on purpose)

### 3. Separate "Examples" Section
**Why Removed:** Merged with Demos into "Explore"
**Migration:** All examples → `/explore/example-apps`

### 4. "Learn" as a Top-Level Section
**Why Removed:** Renamed to "Get Started" - more action-oriented and clear
**Migration:** `/learn` → `/get-started`

### 5. "Reference" as a Top-Level Section
**Why Removed:** Renamed to "API" - clearer for developers
**Migration:** `/reference` → `/api`

### 6. "Tools" Section
**Why Removed:** Insufficient content to justify top-level section
**Migration:** Move relevant tools content to `/about` or `/build/production`

### 7. "Enterprise" as a Top-Level Section
**Why Removed:** Enterprise features are part of the product, not separate documentation
**Migration:** `/enterprise` → `/build/enterprise`

### 8. Deep Nested Tutorials
**Why Removed:** Tutorials scattered across multiple sections
**Migration:** Consolidate into `/get-started/your-first-chat` and `/build/basics`

---

## Navigation Depth Rules

**Rule 1:** No section may exceed 2 levels of depth from top-level
- ✅ Good: `/build/ai-features/rag-integration`
- ❌ Bad: `/build/advanced/ai/features/rag/setup`

**Rule 2:** If a section needs more than 10 items, create subcategories
- ✅ Good: `/api/components/core` (8 components)
- ❌ Bad: `/api/components` (155+ components in flat list)

**Rule 3:** Every page must be reachable in ≤ 3 clicks from home
- Click 1: Top nav → "API"
- Click 2: Sidebar → "Components"
- Click 3: Component → "ClarityChat"

---

## URL Structure

### Pattern
```
/{section}/{category}/{page}
```

### Examples
```
/get-started/quick-start
/build/ai-features/rag-integration
/explore/demos/zero-to-chat
/api/components/clarity-chat
/about/changelog
```

### Rules
- Lowercase, kebab-case
- No abbreviations (use `rag-integration` not `rag-int`)
- No version numbers in URLs (handled by subdomain or query param)
- Permanent URLs - never break links

---

## Search & Discovery

### Primary Navigation Modes
1. **Browse** - Top nav + sidebar for systematic exploration
2. **Search** - Cmd+K instant search for known items
3. **Related** - "See Also" links for discovery

### Search Ranking Priority
1. API components/hooks (most frequent lookup)
2. Build guides (task-focused)
3. Examples/Demos (inspiration)
4. Get Started (new users)
5. About (infrequent)

---

## Mobile IA Considerations

### Mobile Navigation Strategy
- **Hamburger Menu** - Top-level sections only
- **Collapsed Sidebar** - Tap to expand categories
- **Floating Search** - Always accessible via Cmd+K or search button
- **Breadcrumbs** - Essential for orientation on mobile

### Mobile-Specific Shortcuts
- "Quick Start" as first menu item
- Recently viewed pages
- Bookmark/Save functionality

---

## IA Success Metrics (Future)

When content is added, these metrics will validate IA effectiveness:

1. **Time to First Success** - How long until user implements first feature?
   - Target: < 10 minutes from landing to working chat

2. **Search-to-Content Ratio** - How often do users search vs browse?
   - Target: 60% browse, 40% search (indicates good IA)

3. **Navigation Depth** - Average clicks to find content
   - Target: ≤ 2.5 clicks

4. **Bounce Rate by Section** - Which sections confuse users?
   - Target: < 40% bounce rate

5. **Cross-Section Navigation** - Do users jump between sections logically?
   - Track: Get Started → Build (expected)
   - Red flag: Get Started → About (confusion)

---

## Implementation Notes

### Phase 3 Requirements
The navigation system (Phase 3) must implement:
- Top-level nav with 5 sections (Home implicit)
- Collapsible sidebar with 2-level hierarchy
- Breadcrumbs showing current position
- Cmd+K search with section filtering
- Mobile hamburger menu

### Phase 4 Requirements
The layout system (Phase 4) must support:
- Consistent page templates per section
- Section-specific color accents (e.g., "Build" = green, "API" = blue)
- Table of contents for long pages
- Related pages component at bottom

---

## Final IA Structure (Summary)

```
Clarity Chat Docs
│
├── 🏠 Home (landing page)
│
├── 🚀 Get Started (learn the basics)
│   ├── Quick Start
│   ├── Installation
│   ├── Your First Chat
│   ├── Core Concepts
│   │   ├── Components
│   │   ├── Hooks
│   │   ├── Styling
│   │   └── State
│   └── Next Steps
│
├── 🔨 Build (task-based guides)
│   ├── Basics
│   │   ├── Streaming Responses
│   │   ├── Message History
│   │   ├── Custom Styling
│   │   └── Error Handling
│   ├── AI Features
│   │   ├── RAG Integration
│   │   ├── Tool Calling
│   │   ├── Multi-Agent Systems
│   │   └── Token Optimization
│   ├── Production
│   │   ├── Authentication
│   │   ├── Performance
│   │   ├── Security
│   │   ├── Deployment
│   │   └── Monitoring
│   └── Enterprise
│       ├── RBAC
│       ├── Multi-Tenancy
│       ├── SSO
│       └── Compliance
│
├── 🎨 Explore (interactive demos & examples)
│   ├── Interactive Demos
│   │   ├── Zero to Chat
│   │   ├── Streaming in Action
│   │   ├── Token Optimization
│   │   ├── RAG Document Chat
│   │   └── Tool Calling / Agents
│   ├── Example Apps
│   │   ├── Customer Support Bot
│   │   ├── Code Assistant
│   │   ├── Education Tutor
│   │   └── Healthcare Assistant
│   └── Playground
│
├── 📚 API (reference documentation)
│   ├── Components
│   │   ├── Core
│   │   ├── Interactive
│   │   ├── Streaming
│   │   ├── AI
│   │   └── UI
│   ├── Hooks
│   │   ├── Chat Hooks
│   │   ├── State Hooks
│   │   ├── Performance Hooks
│   │   └── Utility Hooks
│   ├── Types
│   ├── Utilities
│   └── Model Adapters
│
└── ℹ️ About (project info)
    ├── Why Clarity?
    ├── Comparison
    ├── Changelog
    ├── License
    ├── Contributing
    └── Support
```

**Total Sections:** 6 top-level
**Max Depth:** 3 levels (including home)
**Total Pages:** ~80 (vs 453 in original - 82% reduction)

---

## Rationale Summary

This IA is defensible because it:

1. **Follows User Mental Models**
   - "Get Started" → "Build" → "Explore" mirrors learning journey
   - API separate from guides (lookup vs learning)

2. **Eliminates Redundancy**
   - Single "Build" section instead of Guides/Cookbook/Learn/Guides
   - Single "Explore" section instead of Demos/Examples/Cookbook

3. **Optimizes for Common Tasks**
   - 90% of users need: Get Started → Build → API
   - Demos and About are secondary

4. **Scales Without Breaking**
   - Adding new components → `/api/components/[new]`
   - Adding new guide → `/build/[category]/[new]`
   - No structural changes needed

5. **Mobile-First**
   - 5 top-level items fit in mobile menu
   - Shallow hierarchy prevents mobile navigation hell

---

**IA Status:** ✅ FINALIZED
**Next Phase:** PHASE 3 - Navigation Design
