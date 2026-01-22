# Navigation Design

**Status:** Designed and finalized
**Date:** 2026-01-22
**Phase:** PHASE 3

## Navigation Philosophy

**Principle:** Navigation should be **invisible** - users should never think about it.

- **Zero Ambiguity** - Every label is immediately clear
- **Instant Feedback** - Active states show current location
- **Predictable Behavior** - No surprises, consistent patterns
- **Accessible First** - Keyboard, screen reader, and mobile optimized

---

## Navigation Types

### 1. Global Navigation (Top Nav)
### 2. Sidebar Navigation (Section Nav)
### 3. Mobile Navigation
### 4. Breadcrumbs
### 5. In-Page Navigation (TOC)

---

## 1. Global Navigation (Top Nav)

### Purpose
Primary top-level navigation visible on all pages

### Position
- Fixed at top
- Always visible (sticky)
- Glassmorphism background (backdrop blur)
- Height: 64px (desktop), 56px (mobile)

### Structure

```
┌─────────────────────────────────────────────────────────────────┐
│ [Logo] [Get Started] [Build] [Explore] [API] [About] [Theme] [Search] │
└─────────────────────────────────────────────────────────────────┘
```

### Nav Items (Left to Right)

1. **Logo / Home Link**
   - Position: Far left
   - Text: "Clarity Chat" with icon
   - Behavior: Clicks return to homepage
   - Mobile: Same (no burger menu icon here)

2. **Get Started**
   - Label: "Get Started"
   - Path: `/get-started`
   - Active: When URL starts with `/get-started`
   - Icon: 🚀 (optional, for visual hierarchy)

3. **Build**
   - Label: "Build"
   - Path: `/build`
   - Active: When URL starts with `/build`
   - Icon: 🔨 (optional)

4. **Explore**
   - Label: "Explore"
   - Path: `/explore`
   - Active: When URL starts with `/explore`
   - Icon: 🎨 (optional)

5. **API**
   - Label: "API"
   - Path: `/api`
   - Active: When URL starts with `/api`
   - Icon: 📚 (optional)

6. **About**
   - Label: "About"
   - Path: `/about`
   - Active: When URL starts with `/about`
   - Icon: ℹ️ (optional)

7. **Theme Toggle** (Far right)
   - Position: Right side, before search
   - Button: Icon (sun/moon)
   - Behavior: Cycle light → dark → system
   - Tooltip: "Toggle theme (T)"
   - Keyboard shortcut: `T`

8. **Search** (Far right)
   - Position: Rightmost
   - Button: Icon (magnifying glass)
   - Behavior: Opens Cmd+K search modal
   - Tooltip: "Search (⌘K)"
   - Keyboard shortcut: `Cmd+K` (Mac) or `Ctrl+K` (Windows/Linux)

### Visual Design

**Active State:**
- Background: Subtle gradient accent
- Border bottom: 2px solid brand color
- Text: Brand color (indigo-500)
- Font weight: Semibold

**Hover State:**
- Background: Subtle background highlight
- Transition: 150ms ease

**Responsive Behavior:**
- **Desktop (≥1024px):** All items visible
- **Tablet (768px-1023px):** Icons + labels
- **Mobile (<768px):** Hamburger menu (see Mobile Navigation section)

---

## 2. Sidebar Navigation (Section Nav)

### Purpose
Secondary navigation showing current section's structure

### Position
- Left sidebar
- Sticky positioning
- Resizable (200px - 400px, default 280px)
- Collapsible on mobile

### Structure

Each section (Get Started, Build, Explore, API, About) has its own sidebar navigation with section-specific items.

### Example: Build Section Sidebar

```
┌─────────────────────────┐
│ BUILD                   │
│                         │
│ ▾ Basics                │
│   • Streaming           │
│   • Message History     │
│   • Custom Styling      │
│   • Error Handling      │
│                         │
│ ▾ AI Features           │
│   • RAG Integration     │
│   • Tool Calling        │
│   • Multi-Agent         │
│   • Token Optimization  │
│                         │
│ ▾ Production            │
│   • Authentication      │
│   • Performance         │
│   • Security            │
│   • Deployment          │
│   • Monitoring          │
│                         │
│ ▾ Enterprise            │
│   • RBAC                │
│   • Multi-Tenancy       │
│   • SSO                 │
│   • Compliance          │
└─────────────────────────┘
```

### Sidebar Component Hierarchy

**Level 1: Section Title**
- Font: Text-lg, semibold
- Color: Text primary
- Non-clickable (label only)

**Level 2: Category (Collapsible)**
- Icon: ▸ (collapsed) / ▾ (expanded)
- Font: Text-sm, medium
- Color: Text secondary
- Hover: Text primary
- Click: Toggle expand/collapse
- Behavior: Auto-expand when child is active

**Level 3: Page Link**
- Icon: • (bullet)
- Font: Text-sm, regular
- Color: Text secondary
- Hover: Text primary, subtle background
- Active: Brand color, bold, background highlight
- Click: Navigate to page

### Sidebar Behavior

**Auto-Expand:**
- When user navigates to a page, its parent category automatically expands
- Other categories remain in their current state (don't auto-collapse)

**Collapse/Expand:**
- Click category header to toggle
- Smooth animation (300ms ease-in-out)
- State persists in localStorage (key: `sidebar-state-{section}`)

**Scroll Behavior:**
- Active item automatically scrolls into view
- Smooth scroll animation
- Active item is highlighted

**Keyboard Navigation:**
- `↑`/`↓` - Navigate between items
- `←`/`→` - Collapse/expand categories
- `Enter` - Activate link
- `Home` - Jump to first item
- `End` - Jump to last item

**Responsive Behavior:**
- **Desktop:** Always visible, resizable
- **Tablet:** Fixed width (240px), collapsible
- **Mobile:** Overlay (slide-in from left)

---

## 3. Mobile Navigation

### Purpose
Navigation for screens < 768px

### Trigger
- Hamburger icon (☰) in top-left of header
- Replaces desktop nav items

### Structure

```
┌─────────────────────┐
│ ☰  Clarity Chat     │  ← Header with hamburger
└─────────────────────┘
        ↓ (tap)
┌─────────────────────┐
│ [✕] Close           │  ← Slide-in overlay
│                     │
│ 🏠 Home             │
│ 🚀 Get Started      │
│ 🔨 Build            │
│ 🎨 Explore          │
│ 📚 API              │
│ ℹ️ About            │
│                     │
│ ─────────────────   │
│                     │
│ 🔍 Search           │
│ 🌙 Dark Mode        │
└─────────────────────┘
```

### Mobile Menu Behavior

**Opening:**
- Tap hamburger icon
- Slide-in animation from left (300ms)
- Backdrop blur overlay on content
- Body scroll locked

**Closing:**
- Tap close icon (✕)
- Tap outside menu (on backdrop)
- Swipe left on menu
- Select a nav item (auto-close)
- Animation: Slide-out to left (300ms)

**Menu Content:**
1. **Primary Nav Items** (top)
   - Same 5 sections as desktop
   - Icons + labels
   - Active state highlighted

2. **Divider** (visual separation)

3. **Utility Items** (bottom)
   - Search
   - Theme toggle

**Gestures:**
- Swipe right: Open menu (from left edge of screen)
- Swipe left: Close menu (on menu itself)

**Accessibility:**
- Focus trap: Tab cycles within menu
- Escape key: Close menu
- ARIA labels: "Main navigation menu", "Close menu"

---

## 4. Breadcrumbs

### Purpose
Show current location in hierarchy

### Position
- Top of main content area
- Below header, above page title
- Margin: 1rem top/bottom

### Structure

```
Home > Get Started > Core Concepts > Components
```

### Breadcrumb Rules

**When to Show:**
- Always show on pages ≥ 2 levels deep
- Hide on homepage
- Hide on top-level section pages (e.g., `/get-started`, `/build`)

**Max Depth:**
- Show all levels (max 4 per IA constraints)
- If exceeds 4, use ellipsis: `Home > ... > Parent > Current`

**Separators:**
- Character: `>` or `/`
- Color: Text muted
- Spacing: 0.5rem

**Link Behavior:**
- All items clickable except current page
- Current page: Bold, not clickable
- Hover: Underline

**Mobile Behavior:**
- Collapse to: `... > Parent > Current`
- Tap `...` to expand full breadcrumbs

### Example Breadcrumbs

```tsx
// Example 1: /build/ai-features/rag-integration
Home > Build > AI Features > RAG Integration
       └───┘   └─────────┘   └──────────────┘
       link    link          current (bold, no link)

// Example 2: /get-started
(no breadcrumbs - top level)

// Example 3: /api/components/core/clarity-chat
Home > API > Components > Core > ClarityChat
                                  └──────────┘
                                  current

// Example 4 (Mobile): /build/ai-features/rag-integration
... > AI Features > RAG Integration
```

---

## 5. In-Page Navigation (Table of Contents)

### Purpose
Navigate within long pages (>3 screens of content)

### Position
- Right sidebar (if space available)
- Sticky positioning
- Width: 200px
- Desktop only (hidden on tablet/mobile)

### Structure

```
┌─────────────────┐
│ ON THIS PAGE    │
│                 │
│ • Overview      │
│ • Installation  │
│ • Basic Usage   │
│ • Advanced      │
│   • Option A    │
│   • Option B    │
│ • API Reference │
│ • Examples      │
└─────────────────┘
```

### TOC Behavior

**Auto-Generation:**
- Extracted from page headings (H2, H3)
- H2 = top level
- H3 = nested (indented)
- Max depth: 2 levels

**Active State:**
- Current section highlighted (brand color)
- Updates on scroll (IntersectionObserver)
- Active section is bolded

**Click Behavior:**
- Smooth scroll to section
- Scroll offset: -80px (to account for sticky header)
- Update URL hash: `#section-id`

**Responsive:**
- Desktop (≥1280px): Always visible
- Laptop (1024px-1279px): Hidden (not enough space)
- Tablet/Mobile: Hidden

---

## Navigation State Management

### Active State Logic

**Global Nav:**
```js
// Active if URL starts with section path
isActive = pathname.startsWith('/build')
```

**Sidebar Nav:**
```js
// Active if exact match or child of path
isActive = pathname === href || pathname.startsWith(href + '/')
```

**Breadcrumbs:**
```js
// Generate from pathname segments
const segments = pathname.split('/').filter(Boolean)
const breadcrumbs = segments.map((seg, i) => ({
  label: formatLabel(seg),
  href: '/' + segments.slice(0, i + 1).join('/')
}))
```

### Persistent State

**Sidebar Collapse State:**
- Store in `localStorage`
- Key: `sidebar-collapsed-{section}-{category}`
- Value: `true` | `false`
- Restore on page load

**Theme State:**
- Store in `localStorage`
- Key: `theme`
- Value: `'light'` | `'dark'` | `'system'`
- Applied before page render (prevent flash)

---

## Keyboard Shortcuts

### Global Shortcuts (Always Available)

| Shortcut       | Action                    |
|----------------|---------------------------|
| `Cmd+K` / `Ctrl+K` | Open search           |
| `T`            | Toggle theme              |
| `/`            | Focus search              |
| `Esc`          | Close modal/menu          |
| `?`            | Show keyboard shortcuts   |

### Navigation Shortcuts (When Sidebar Focused)

| Shortcut       | Action                    |
|----------------|---------------------------|
| `↑` / `↓`      | Navigate items            |
| `←` / `→`      | Collapse/expand category  |
| `Enter`        | Activate link             |
| `Home`         | Jump to first item        |
| `End`          | Jump to last item         |
| `[` / `]`      | Previous/next page        |

### Focus Management

**Skip to Content Link:**
- First focusable element
- Visible on keyboard focus
- Jumps to `#main-content`
- Text: "Skip to content"

**Focus Trap in Modals:**
- Search modal: Focus search input on open
- Mobile menu: Focus first nav item on open
- Tab cycles within modal

**Focus Indicators:**
- Visible focus outline (2px solid brand color)
- Focus offset: 2px
- Never `outline: none` without replacement

---

## Search Integration

### Search Modal (Cmd+K)

**Trigger:**
- Cmd+K / Ctrl+K keyboard shortcut
- Click search icon in header
- Press `/` when not in input

**Modal UI:**
```
┌─────────────────────────────────────────┐
│ [🔍] Search documentation...            │  ← Input
├─────────────────────────────────────────┤
│ Suggestions                             │
│ • Quick Start                           │
│ • Build: RAG Integration                │
│ • API: ClarityChat Component            │
├─────────────────────────────────────────┤
│ Recent                                  │
│ • Token Optimization Guide              │
│ • Deployment to Vercel                  │
└─────────────────────────────────────────┘
```

**Search Features:**
- Instant results (as-you-type)
- Fuzzy matching
- Section filtering (tabs: All, Get Started, Build, API, etc.)
- Keyboard navigation (↑/↓ to select, Enter to navigate)
- Recent searches (persist in localStorage)

**Search Ranking:**
Per IA document:
1. API components/hooks
2. Build guides
3. Examples/Demos
4. Get Started
5. About

---

## Navigation Rendering Guarantees

### Server-Side Rendering (SSR)
- Navigation must render identically on server and client
- No hydration mismatches
- Active states calculated on server
- Theme preference read from cookie (not localStorage) for SSR

### Zero Layout Shift
- Navigation dimensions fixed (no content-driven sizing)
- Sidebar width: 280px (fixed)
- Header height: 64px (fixed)
- No reflow on navigation state changes

### Performance
- Navigation components are lightweight (<5kb gzipped)
- No expensive effects or observers in navigation
- Sidebar scroll position virtualized if >100 items (unlikely given IA)
- Search modal lazy-loaded (only when opened)

### Streaming Safety
- Navigation doesn't depend on page content
- Can render before main content streams in
- No layout dependencies on async data

---

## Mobile Navigation Patterns

### Gesture Support

**Swipe Navigation:**
- Swipe right (from left edge): Open mobile menu
- Swipe left (on menu): Close mobile menu
- Swipe left/right (on page): Previous/next page (optional)

**Implementation:**
```tsx
// Touch event thresholds
const SWIPE_THRESHOLD = 50 // px
const SWIPE_VELOCITY_THRESHOLD = 0.3 // px/ms
```

### Mobile Sidebar Behavior

**When Sidebar Opens:**
- Full-screen overlay (z-index: 50)
- Backdrop blur
- Body scroll locked
- Sidebar slides in from left (300ms)

**When Sidebar Closes:**
- Slides out to left (300ms)
- Backdrop fades out
- Body scroll unlocked
- Focus returns to hamburger button

### Mobile Bottom Nav (Optional)

If needed for quick access:
```
┌─────────────────────────────────────────┐
│ [Home] [Build] [API] [Search] [Menu]   │
└─────────────────────────────────────────┘
```

**Decision:** Not implementing for v1 (top nav + hamburger is sufficient)

---

## Accessibility Requirements

### ARIA Labels

**Global Nav:**
```html
<nav aria-label="Main navigation">
  <ul>
    <li><a href="/build" aria-current="page">Build</a></li>
  </ul>
</nav>
```

**Sidebar Nav:**
```html
<nav aria-label="Build section navigation">
  <button aria-expanded="true" aria-controls="basics-menu">
    Basics
  </button>
  <ul id="basics-menu">
    <li><a href="/build/basics/streaming">Streaming</a></li>
  </ul>
</nav>
```

**Mobile Menu:**
```html
<button aria-label="Open main menu" aria-expanded="false">
  ☰
</button>
```

### Screen Reader Announcements

**On Navigation:**
- Announce current page on load
- Example: "Build: RAG Integration. Main content."

**On Section Change:**
- Announce section change
- Example: "Navigated to API section."

**On Sidebar Toggle:**
- Announce state
- Example: "Basics section expanded" / "Basics section collapsed"

### Focus Management

**Skip Links:**
```html
<a href="#main-content" class="skip-link">
  Skip to content
</a>
```

**Focus Order:**
1. Skip link
2. Logo/Home
3. Global nav items
4. Theme toggle
5. Search button
6. Main content
7. Sidebar nav
8. Footer

### Keyboard Navigation

All navigation must be:
- ✅ Fully keyboard accessible
- ✅ Logical tab order
- ✅ Visible focus indicators
- ✅ Enter/Space to activate
- ✅ Escape to close modals/menus

---

## Navigation Testing Checklist

### Functional Tests

- [ ] All nav links navigate correctly
- [ ] Active states update on route change
- [ ] Breadcrumbs generate correctly
- [ ] Sidebar auto-expands to active page
- [ ] Mobile menu opens/closes
- [ ] Search modal opens with Cmd+K
- [ ] Theme toggle cycles correctly
- [ ] Keyboard shortcuts work

### Visual Tests

- [ ] Active states are clearly visible
- [ ] Hover states have sufficient contrast
- [ ] Focus indicators are visible (2px outline)
- [ ] Mobile menu doesn't clip content
- [ ] Breadcrumbs don't overflow
- [ ] Sidebar scrolls correctly

### Accessibility Tests

- [ ] All nav items have ARIA labels
- [ ] Screen reader announces pages correctly
- [ ] Keyboard navigation works (no mouse required)
- [ ] Skip link is functional
- [ ] Focus is trapped in modals
- [ ] Color contrast meets WCAG AA (4.5:1)

### Performance Tests

- [ ] Navigation renders in <100ms
- [ ] No layout shift during navigation
- [ ] Search results appear in <200ms
- [ ] Mobile menu animation is smooth (60fps)
- [ ] No hydration mismatches

### Responsive Tests

- [ ] Test on mobile (375px)
- [ ] Test on tablet (768px)
- [ ] Test on laptop (1024px)
- [ ] Test on desktop (1440px)
- [ ] Test on ultra-wide (1920px+)

---

## Implementation Notes

### Technology Stack

**Components:**
- React 19 with Server Components
- Framer Motion for animations
- Next.js Link for client-side navigation

**State Management:**
- URL state for active page (no client state)
- localStorage for sidebar collapse state
- localStorage for theme preference
- Context API for search modal state

**Styling:**
- Tailwind CSS for utility classes
- CSS custom properties for theme colors
- Framer Motion for animations

### File Structure

```
components/
├── Navigation/
│   ├── GlobalNav.tsx         # Top navigation bar
│   ├── SidebarNav.tsx        # Section sidebar
│   ├── MobileNav.tsx         # Mobile menu
│   ├── Breadcrumbs.tsx       # Breadcrumb navigation
│   ├── TOC.tsx               # Table of contents
│   ├── SearchModal.tsx       # Cmd+K search
│   └── ThemeToggle.tsx       # Theme switcher
```

### Performance Optimizations

1. **Code Splitting:**
   - Lazy load search modal (not needed on initial render)
   - Lazy load mobile menu animations

2. **Memoization:**
   - Memoize navigation config (doesn't change)
   - Memoize active state calculations

3. **Debouncing:**
   - Debounce search input (200ms)
   - Debounce sidebar resize (100ms)

---

## Final Navigation Structure (Summary)

### Desktop Experience
```
┌────────────────────────────────────────────────────────────────┐
│ [Logo] [Get Started] [Build] [Explore] [API] [About] [🌙] [🔍] │ ← Global Nav
├─────────────┬────────────────────────────────────────┬─────────┤
│             │ Home > Build > AI > RAG                │         │ ← Breadcrumbs
│             │                                        │         │
│ BUILD       │ # RAG Integration                      │ ON THIS │
│             │                                        │ PAGE    │
│ ▾ Basics    │ [Content area]                         │         │
│   • Stream  │                                        │ • Setup │ ← TOC
│             │                                        │ • Usage │
│ ▾ AI        │                                        │ • API   │
│   • RAG ← ● │                                        │         │
│   • Tools   │                                        │         │
│             │                                        │         │
│ Sidebar     │ Main Content                           │ TOC     │
└─────────────┴────────────────────────────────────────┴─────────┘
```

### Mobile Experience
```
┌─────────────────────┐
│ ☰  Clarity Chat  🔍 │ ← Compact header
├─────────────────────┤
│ ... > AI > RAG      │ ← Collapsed breadcrumbs
│                     │
│ # RAG Integration   │
│                     │
│ [Content area]      │ ← Full width
│                     │
│                     │
└─────────────────────┘
```

---

**Navigation Status:** ✅ FINALIZED
**Next Phase:** PHASE 4 - Layout System
