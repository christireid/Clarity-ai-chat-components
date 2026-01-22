# Design & Implementation Decisions

This document tracks all major design and implementation decisions made during the creation of the Streamlined Docs site.

## Phase 0 Decisions
- **Decision:** Create streamlined docs as a separate app at `/apps/streamlined-docs`
- **Rationale:** Complete isolation from existing docs, independent deployment, no risk of breaking existing docs

## Phase 1 Decisions

### Content Stripping Strategy
- **Decision:** Create a universal `EmptyContentPage` component and replace all 453 page.tsx files with it
- **Rationale:**
  - Maintains routing structure while removing all content
  - Consistent empty-state experience across all pages
  - Component-based approach allows easy customization per section
  - Automated script ensures complete and consistent content removal

### Removed Assets
- **Decision:** Deleted `content/` and `cookbook/` directories entirely
- **Rationale:** These contained MDX/markdown documentation prose that must be removed per requirements

### Empty State Design
- **Decision:** Show page title, section badge, and explicit "Content intentionally omitted" message
- **Rationale:**
  - Makes it clear this is intentional, not broken
  - Maintains visual hierarchy and layout structure
  - Path indicator aids development and debugging
  - Glassmorphism styling maintains design consistency

## Phase 2 Decisions

### IA Restructuring
- **Decision:** Consolidate 10+ top-level sections into 6 (Home, Get Started, Build, Explore, API, About)
- **Rationale:**
  - Eliminates redundancy (Guides/Cookbook/Learn/Examples consolidated)
  - Follows user journey: Learn → Build → Explore
  - Reduces cognitive load - fewer choices
  - Mobile-friendly (5 nav items fit in mobile menu)

### Naming Conventions
- **Decision:** Use action-oriented, user-centric names
  - "Get Started" instead of "Learn"
  - "Build" instead of "Guides"
  - "API" instead of "Reference"
  - "Explore" instead of "Demos/Examples"
- **Rationale:** Action verbs clarify purpose and reduce ambiguity

### Depth Constraints
- **Decision:** Maximum 3 levels deep (including home), no more than 10 items per category
- **Rationale:**
  - Prevents navigation hell
  - Mobile-first constraint (deep nesting breaks mobile UX)
  - Forces information density and clear categorization

### Page Reduction
- **Decision:** Reduce from 453 pages to ~80 pages (82% reduction)
- **Rationale:**
  - Most original pages were redundant or overly granular
  - Streamlined IA groups related content
  - Easier to maintain and navigate
  - Future content can be added without structural changes

## Additional Optimization (Post Phase 9)

### Remove Individual Pages
- **Decision:** Remove all individual component, hook, guide, tutorial, recipe, demo, and example pages
- **Rationale:**
  - Further streamline the shell to focus on structure, not individual items
  - Keep only hub pages and category pages
  - **Result:** 401 pages removed (90.5% reduction from 443 to 42 pages)
  - Structural pages only: section hubs + category pages
- **Final count:** 42 pages total (vs 453 originally - **91% total reduction**)

### Pages Kept (42 total)
- Homepage + top-level section pages
- Category pages within sections (e.g., `/reference/components`, `/reference/hooks`)
- Hub pages (e.g., `/guides`, `/demos`, `/examples`, `/cookbook`)

### Pages Removed (401 total)
- All individual component pages (e.g., `/reference/components/avatar`)
- All individual hook pages (e.g., `/reference/hooks/use-chat`)
- All individual guide pages (e.g., `/guides/streaming`)
- All individual tutorial pages (e.g., `/learn/tutorials/building-first-chatbot`)
- All individual recipe pages (e.g., `/cookbook/authentication`)
- All individual demo pages (e.g., `/demos/zero-to-chat`)
- All individual example pages (e.g., `/examples/simple-chat`)

## Route Restructuring (IA Implementation)

### Implement Designed IA in Routes
- **Decision:** Restructure all routes to match the designed IA
- **Rationale:**
  - Original routes didn't match the designed 6-section IA
  - Alignment needed for consistency between design and implementation
  - Cleaner, more intuitive URL structure

### Route Changes
**Renamed:**
- `/learn` → `/get-started`
- `/reference` → `/api`
- `/guides` → `/build`

**Consolidated:**
- `/demos`, `/examples`, `/cookbook` → `/explore` (with subdirectories)

**Removed:**
- `/tools`, `/commercial`, `/research`, `/integrations`
- `/enterprise`, `/enterprise-standalone`
- `/examples-catalog`, `/playground-demo`, `/compare`

**Kept:**
- `/about`, `/contributing`, `/changelog`, `/license`
- `/playground`, `/why-clarity`

### Final Route Structure (10 top-level routes)
```
/
├── /get-started (was /learn)
├── /build (was /guides)
├── /explore (new, consolidates demos/examples/cookbook)
│   ├── /explore/demos
│   ├── /explore/examples
│   └── /explore/recipes (was cookbook)
├── /api (was /reference)
├── /about
├── /contributing
├── /changelog
├── /license
├── /playground
└── /why-clarity
```

**Result:** Clean alignment with designed IA, from 22 top-level routes to 10

## Future Decisions
Will be documented as phases progress
