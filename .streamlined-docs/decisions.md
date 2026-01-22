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

## Future Decisions
Will be documented as phases progress
