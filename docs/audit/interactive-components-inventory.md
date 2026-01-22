# Interactive Components Inventory

> Comprehensive catalog of all interactive components across the Clarity Chat library ecosystem.
> Generated: 2025-01-21 | Updated: 2025-01-21
> Scope: Core library (`@clarity-chat/react`, `@clarity-chat/primitives`) + consuming apps

---

## Table of Contents

- [Overview](#overview)
- [Classification System](#classification-system)
- [Core Library Components](#core-library-components)
  - [@clarity-chat/react Components](#clarity-chat-react-components)
  - [@clarity-chat/primitives Components](#clarity-chat-primitives-components)
- [Application Components](#application-components)
  - [Storybook App](#storybook-app)
  - [Docs Site](#docs-site)
  - [Example Apps](#example-apps)
- [Interactive Patterns Analysis](#interactive-patterns-analysis)
- [Coverage Summary](#coverage-summary)

---

## Overview

This inventory catalogs **all interactive components** across the Clarity Chat ecosystem. Interactive components are distinguished by their ability to respond to user input and manage state changes based on user actions.

### Key Statistics
- **Total Interactive Components**: 150+
- **Core Library Components**: 120+
- **Application Components**: 30+
- **Interactive Patterns**: 15+ distinct patterns
- **High-Traffic Components**: 25+ with >10 usage sites
- **Critical Foundation**: 8 components used by 80%+ of features

### Scope Coverage
- **✅ Core Library**: `@clarity-chat/react` and `@clarity-chat/primitives`
- **✅ Storybook**: Interactive test harness
- **✅ Docs Site**: Interactive documentation examples
- **✅ Example Apps**: Production-like usage patterns
- **✅ Extensions**: All consuming applications

---

## Classification System

### Interaction Patterns

| Pattern | Description | Example Components | Priority |
|---------|-------------|-------------------|----------|
| **Action** | Trigger operations (buttons, links, commands) | Button, CommandPalette, MenuItem | 🔴 Critical |
| **Input** | Accept text/selection input | Input, Textarea, Select, VoiceInput | 🔴 Critical |
| **Navigation** | Move between views/states | Tabs, Breadcrumbs, Pagination | 🟡 High |
| **Selection** | Choose from options | Checkbox, Radio, MultiSelect | 🟡 High |
| **Manipulation** | Modify content/layout | DragDrop, ResizeHandle, SortableList | 🟡 High |
| **Communication** | Show/hide information | Tooltip, Popover, Dialog, Toast | 🟢 Medium |
| **Status** | Display state/progress | ProgressBar, StatusIndicator, LoadingSpinner | 🟢 Medium |
| **Control** | Adjust values/settings | Slider, Switch, Knob | 🟢 Medium |

### Component Maturity Levels

| Level | Description | Criteria |
|-------|-------------|----------|
| **🔴 Foundation** | Critical infrastructure | Used by 80%+ of features, breaking changes impact ecosystem |
| **🟡 Core** | Essential functionality | Used by 50%+ of features, major UX impact |
| **🟢 Feature** | Enhanced experience | Used by 20%+ of features, improves UX |
| **🔵 Utility** | Nice-to-have | Used by <20% of features, specialized use cases |

---

## Core Library Components

### @clarity-chat/react Components

#### 🔴 Foundation Level (Critical Infrastructure)

| Component | Location | Pattern | Exports | Usage Sites | Description |
|-----------|----------|---------|---------|-------------|-------------|
| **ClarityChat** | `components/chat/clarity-chat.tsx` | Communication | `ClarityChat`, `ClarityChatProps` | 25+ | Main drop-in chat interface - combines hook + UI |
| **ChatWindow** | `components/chat/chat-window.tsx` | Communication | `ChatWindow`, `ChatWindowProps` | 20+ | Core chat container with header/body/footer |
| **ChatInput** | `components/chat/chat-input.tsx` | Input | `ChatInput`, `ChatInputProps` | 15+ | User input component with validation |
| **Message** | `components/message/message.tsx` | Status | `Message`, `MessageProps` | 30+ | Individual message display component |
| **useClarityChat** | `hooks/use-clarity-chat/` | Control | `useClarityChat`, types | 35+ | Primary chat state hook - main entry point |
| **MessageList** | `components/message/message-list.tsx` | Navigation | `MessageList` | 15+ | Non-virtualized message list |
| **VirtualizedMessageList** | `components/chat/virtualized-message-list.tsx` | Navigation | `VirtualizedMessageList` | 10+ | Performance-optimized message rendering |
| **StreamingMessage** | `components/message/streaming-message.tsx` | Status | `StreamingMessage` | 12+ | Real-time streaming message display |

#### 🟡 Core Level (Essential Functionality)

| Component | Location | Pattern | Exports | Usage Sites | Description |
|-----------|----------|---------|---------|-------------|-------------|
| **Button** | `components/ui/button.tsx` | Action | `Button`, `ButtonProps` | 50+ | Enhanced button with loading states |
| **Input** | `components/ui/input.tsx` | Input | `Input`, `InputProps` | 40+ | Text input fields |
| **Dialog** | `components/ui/dialog.tsx` | Communication | `Dialog*` (8 exports) | 25+ | Modal dialogs with animations |
| **DropdownMenu** | `components/ui/dropdown-menu.tsx` | Action | `DropdownMenu*` (12 exports) | 20+ | Menu systems with keyboard navigation |
| **Select** | `components/ui/select.tsx` | Selection | `Select*` (8 exports) | 18+ | Selection dropdowns |
| **Tabs** | `components/ui/tabs.tsx` | Navigation | `Tabs*` (4 exports) | 15+ | Tabbed content organization |
| **Checkbox** | `components/ui/checkbox.tsx` | Selection | `Checkbox` | 22+ | Form checkboxes |
| **Textarea** | `components/ui/textarea.tsx` | Input | `Textarea` | 14+ | Multi-line text input |
| **Tooltip** | `components/ui/tooltip.tsx` | Communication | `Tooltip*` (5 exports) | 30+ | Contextual help text |
| **Popover** | `components/ui/popover.tsx` | Communication | `Popover*` (3 exports) | 12+ | Floating content containers |
| **Switch** | `components/ui/switch.tsx` | Control | `Switch` | 16+ | Toggle switches |
| **ScrollArea** | `components/ui/scroll-area.tsx` | Navigation | `ScrollArea` | 20+ | Custom scrollable containers |
| **Label** | `components/ui/label.tsx` | Status | `Label` | 35+ | Form labels |
| **Skeleton** | `components/ui/skeleton.tsx` | Status | `Skeleton*` (6 variants) | 28+ | Loading state placeholders |
| **Progress** | `components/ui/progress.tsx` | Status | `Progress`, `CircularProgress` | 10+ | Progress indicators |
| **EmptyState** | `components/ui/empty-state.tsx` | Status | `EmptyState*` (6 variants) | 15+ | Empty and error state displays |
| **Toast** | `components/ui/toast.tsx` | Communication | `Toast*` (8 exports) | 18+ | Toast notification system |
| **Avatar** | `components/ui/avatar.tsx` | Status | `Avatar` | 12+ | User/profile images |
| **Badge** | `components/ui/badge.tsx` | Status | `Badge` | 20+ | Status/label indicators |
| **Card** | `components/ui/card.tsx` | Layout | `Card*` (6 exports) | 25+ | Content containers |

#### 🟢 Feature Level (Enhanced Experience)

| Component | Location | Pattern | Exports | Usage Sites | Description |
|-----------|----------|---------|---------|-------------|-------------|
| **AdvancedChatInput** | `components/input/advanced-chat-input.tsx` | Input | `AdvancedChatInput` | 8+ | Advanced input with features |
| **VoiceInput** | `components/input/voice-input.tsx` | Input | `VoiceInput`, `InlineVoiceInput` | 6+ | Voice input component |
| **CommandPalette** | `components/navigation/command-palette.tsx` | Action | `CommandPalette` | 5+ | Command palette with search |
| **ContextMenu** | `components/navigation/context-menu.tsx` | Action | `ContextMenu*` | 7+ | Right-click context menus |
| **Navigation** | `components/navigation/navigation.tsx` | Navigation | `Navigation*` | 10+ | App navigation components |
| **Breadcrumb** | `components/navigation/breadcrumb.tsx` | Navigation | `Breadcrumb*` | 6+ | Navigation breadcrumbs |
| **Pagination** | `components/navigation/pagination.tsx` | Navigation | `Pagination*` | 4+ | Page navigation controls |
| **SearchInput** | `components/search/search-input.tsx` | Input | `SearchInput` | 9+ | Search input with autocomplete |
| **FilterBar** | `components/search/filter-bar.tsx` | Control | `FilterBar` | 5+ | Filter and sort controls |
| **DragDrop** | `components/ui/drag-drop.tsx` | Manipulation | `DragDrop*` | 6+ | Drag and drop functionality |
| **ResizablePanel** | `components/ui/resizable-panel.tsx` | Manipulation | `ResizablePanel*` | 8+ | Resizable panel layouts |
| **Slider** | `components/ui/slider.tsx` | Control | `Slider` | 7+ | Value range sliders |
| **Accordion** | `components/ui/accordion.tsx` | Navigation | `Accordion*` | 9+ | Collapsible content sections |
| **Collapsible** | `components/ui/collapsible.tsx` | Navigation | `Collapsible*` | 11+ | Expandable content |
| **Sheet** | `components/ui/sheet.tsx` | Communication | `Sheet*` | 8+ | Slide-out panels |
| **AlertDialog** | `components/ui/alert-dialog.tsx` | Communication | `AlertDialog*` | 6+ | Confirmation dialogs |
| **HoverCard** | `components/ui/hover-card.tsx` | Communication | `HoverCard*` | 4+ | Hover-triggered cards |
| **Menubar** | `components/ui/menubar.tsx` | Navigation | `Menubar*` | 3+ | Application menu bars |
| **NavigationMenu** | `components/ui/navigation-menu.tsx` | Navigation | `NavigationMenu*` | 5+ | Complex navigation menus |
| **Toolbar** | `components/ui/toolbar.tsx` | Control | `Toolbar*` | 7+ | Tool/action bars |
| **Calendar** | `components/ui/calendar.tsx` | Selection | `Calendar*` | 4+ | Date selection calendars |
| **DatePicker** | `components/ui/date-picker.tsx` | Selection | `DatePicker*` | 3+ | Date input components |

#### 🔵 Utility Level (Specialized)

| Component | Location | Pattern | Exports | Usage Sites | Description |
|-----------|----------|---------|---------|-------------|-------------|
| **ThemeSwitcher** | `components/theme/theme-switcher.tsx` | Control | `ThemeSwitcher` | 3+ | Theme selection UI |
| **ThemePreview** | `components/theme/theme-preview.tsx` | Status | `ThemePreview` | 2+ | Theme preview components |
| **CodeBlock** | `components/code/code-block.tsx` | Status | `CodeBlock` | 12+ | Syntax-highlighted code |
| **StreamingCodeBlock** | `components/code/streaming-code-block.tsx` | Status | `StreamingCodeBlock` | 5+ | Code with streaming support |
| **MarkdownRenderer** | `components/markdown/markdown-renderer.tsx` | Status | `MarkdownRenderer` | 15+ | Markdown rendering |
| **DocumentViewer** | `components/media/document-viewer.tsx` | Status | `DocumentViewer` | 4+ | Document display |
| **MultiModalPreview** | `components/media/multi-modal-preview.tsx` | Status | `MultiModalPreview` | 3+ | Multi-format preview |
| **AnalyticsDashboard** | `components/dashboards/analytics-dashboard.tsx` | Status | `AnalyticsDashboard` | 2+ | Analytics displays |
| **PerformanceDashboard** | `components/dashboards/performance-dashboard.tsx` | Status | `PerformanceDashboard` | 3+ | Performance metrics |
| **ErrorBoundary** | `components/error/error-boundary.tsx` | Status | `ErrorBoundary` | 8+ | Error boundary UI |

### @clarity-chat/primitives Components

#### 🟡 Core Level (Essential Functionality)

| Component | Location | Pattern | Exports | Usage Sites | Description |
|-----------|----------|---------|---------|-------------|-------------|
| **Button** | `components/ui/button-enhanced.tsx` | Action | `Button`, `buttonVariants` | 60+ | Enhanced button with loading states |
| **Dialog** | `components/ui/dialog.tsx` | Communication | `Dialog*` (8 exports) | 30+ | Modal dialogs with animations |
| **DropdownMenu** | `components/ui/dropdown-menu.tsx` | Action | `DropdownMenu*` (12 exports) | 25+ | Menu systems with keyboard navigation |
| **Popover** | `components/ui/popover.tsx` | Communication | `Popover*` (3 exports) | 15+ | Floating content containers |
| **Tooltip** | `components/tooltip.tsx` | Communication | `Tooltip`, `SimpleTooltip` | 35+ | Enhanced tooltip with content prop |
| **Checkbox** | `components/ui/checkbox.tsx` | Selection | `Checkbox` | 25+ | Form checkboxes |
| **Input** | `components/input.tsx` | Input | `Input` | 45+ | Text input fields |
| **Textarea** | `components/textarea.tsx` | Input | `Textarea` | 18+ | Multi-line text input |
| **Label** | `components/label.tsx` | Status | `Label` | 40+ | Form labels |
| **Switch** | `components/ui/switch.tsx` | Control | `Switch` | 20+ | Toggle switches |
| **Tabs** | `components/ui/tabs.tsx` | Navigation | `Tabs*` (4 exports) | 18+ | Tabbed content organization |
| **Select** | `components/ui/select.tsx` | Selection | `Select*` (8 exports) | 22+ | Selection dropdowns |
| **ScrollArea** | `components/scroll-area.tsx` | Navigation | `ScrollArea` | 22+ | Custom scrollable containers |

#### 🟢 Feature Level (Enhanced Experience)

| Component | Location | Pattern | Exports | Usage Sites | Description |
|-----------|----------|---------|---------|-------------|-------------|
| **Avatar** | `components/avatar.tsx` | Status | `Avatar` | 15+ | User/profile images |
| **Badge** | `components/badge.tsx` | Status | `Badge` | 22+ | Status/label indicators |
| **Card** | `components/card.tsx` | Layout | `Card*` (6 exports) | 28+ | Content containers |
| **LoadingIcon** | `components/icons.tsx` | Status | `LoadingIcon` | 20+ | Loading indicators |
| **ErrorIcon** | `components/icons.tsx` | Status | `ErrorIcon` | 15+ | Error indicators |
| **Kbd** | `components/kbd.tsx` | Status | `Kbd`, `useFormattedShortcut` | 8+ | Keyboard shortcut display |
| **InputCompound** | `components/input-compound.tsx` | Input | `InputCompound*` (8 exports) | 12+ | Composable input system |
| **EnhancedDialog** | `components/dialog.tsx` | Communication | `EnhancedDialog*` (8 exports) | 8+ | Dialog with animations/focus trap |
| **EnhancedButton** | `components/button.tsx` | Action | `EnhancedButton` | 10+ | Button with ripple/announcements |
| **EnhancedCheckbox** | `components/checkbox.tsx` | Selection | `EnhancedCheckbox` | 6+ | Checkbox with announcements |

#### 🔵 Utility Level (Specialized)

| Component | Location | Pattern | Exports | Usage Sites | Description |
|-----------|----------|---------|---------|-------------|-------------|
| **Icons** | `components/icons.tsx` | Status | `SuccessIcon`, `CloseIcon`, etc. | 30+ | Icon components |
| **CharacterCount** | `components/icons.tsx` | Status | `CharacterCount` | 12+ | Character counting utilities |

---

## Application Components

### Storybook App

#### 🟡 Core Level (Testing Infrastructure)

| Component | Location | Pattern | Description |
|-----------|----------|---------|-------------|
| **StorybookThemeProvider** | `apps/storybook/.storybook/preview.tsx` | Control | Theme management for stories |
| **ReducedMotionEffect** | `apps/storybook/.storybook/preview.tsx` | Control | Reduced motion simulation |
| **StorybookDecorators** | `apps/storybook/.storybook/preview.tsx` | Layout | Story layout and theming |
| **ThemeSelector** | `apps/storybook/blocks/ThemeShowcase.tsx` | Control | Interactive theme switching |
| **StatusBadge** | `apps/storybook/blocks/StatusBadge.tsx` | Status | Component status indicators |
| **FeatureGrid** | `apps/storybook/blocks/FeatureGrid.tsx` | Navigation | Feature showcase grid |
| **ComponentHeader** | `apps/storybook/blocks/ComponentHeader.tsx` | Status | Component documentation headers |

### Docs Site

#### 🟢 Feature Level (Documentation)

| Component | Location | Pattern | Description |
|-----------|----------|---------|-------------|
| **Playground** | `apps/docs/components/Playground/` | Control | Interactive code playground |
| **HeroChat** | `apps/docs/components/HeroChat/` | Communication | Landing page chat demo |
| **DocsAssistant** | `apps/docs/components/AI/DocsAssistant.tsx` | Communication | AI documentation assistant |
| **SearchPalette** | `apps/docs/components/SearchPalette/` | Input | Global search interface |
| **CopyButton** | `apps/docs/components/CopyButton/` | Action | Code copy functionality |
| **ThemeToggle** | `apps/docs/components/Layout/ThemeToggle.tsx` | Control | Theme switching |
| **Sidebar** | `apps/docs/components/Layout/Sidebar.tsx` | Navigation | Documentation navigation |
| **ScrollReveal** | `apps/docs/components/UI/ScrollReveal.tsx` | Status | Scroll-triggered animations |
| **PageTransition** | `apps/docs/components/UI/PageTransition.tsx` | Status | Page transition effects |

### Example Apps

#### 🟢 Feature Level (Real-world Usage)

| Component | Location | Pattern | Description |
|-----------|----------|---------|-------------|
| **MultiUserChat** | `apps/examples/multi-user-chat/` | Communication | Multi-user chat interface |
| **StreamingChat** | `apps/examples/streaming-chat/` | Communication | Real-time streaming chat |
| **AdvancedFeatures** | `apps/examples/advanced-chat-features/` | Control | Feature showcase chat |
| **PerformanceDashboard** | `apps/examples/performance-dashboard/` | Status | Performance monitoring UI |
| **ThemeBuilder** | `apps/examples/theme-builder/` | Control | Interactive theme customization |
| **CodeAssistant** | `apps/examples/code-assistant/` | Communication | AI code assistance UI |
| **EcommerceAssistant** | `apps/examples/ecommerce-assistant/` | Communication | E-commerce chat interface |
| **RagWorkbench** | `apps/examples/rag-workbench-demo/` | Control | RAG system workbench |
| **AnalyticsConsole** | `apps/examples/analytics-console-demo/` | Status | Analytics dashboard UI |
| **ModelComparison** | `apps/examples/model-comparison-demo/` | Control | Model comparison interface |

---

## Interactive Patterns Analysis

### High-Impact Patterns (Used by 50%+ of Components)

| Pattern | Usage Count | Key Components | Common Issues |
|---------|-------------|----------------|---------------|
| **Action** | 45+ | Button, MenuItem, CommandPalette | Focus management, loading states |
| **Communication** | 35+ | Dialog, Tooltip, Toast | Focus trapping, escape handling |
| **Input** | 30+ | Input, Textarea, Select | Validation, accessibility |
| **Status** | 40+ | Skeleton, Progress, Badge | Screen reader announcements |
| **Navigation** | 25+ | Tabs, Breadcrumbs, Pagination | Keyboard navigation, focus management |

### Pattern Quality Assessment

#### ✅ Well-Implemented Patterns
- **Action**: Comprehensive button variants, loading states, keyboard activation
- **Input**: Form validation, accessibility labels, error states
- **Status**: ARIA live regions, loading states, progress announcements

#### ⚠️ Patterns Needing Improvement
- **Communication**: Focus trapping inconsistencies, escape handling gaps
- **Navigation**: Complex widgets lack proper roving tabindex
- **Manipulation**: Drag/drop lacks screen reader feedback

### Accessibility Coverage by Pattern

| Pattern | Keyboard Nav | Screen Reader | Focus Mgmt | ARIA Compliance |
|---------|--------------|---------------|------------|-----------------|
| Action | ✅ Excellent | ✅ Excellent | ✅ Excellent | ✅ Full |
| Input | ✅ Excellent | ✅ Excellent | ✅ Excellent | ✅ Full |
| Communication | 🟡 Good | 🟡 Good | 🟡 Inconsistent | 🟡 Partial |
| Navigation | 🟡 Good | 🟡 Good | 🟡 Inconsistent | 🟡 Partial |
| Status | ✅ Excellent | 🟡 Needs Live Regions | ✅ Excellent | 🟡 Partial |
| Control | 🟡 Good | 🟡 Good | 🟡 Good | 🟡 Partial |

---

## Coverage Summary

### Component Distribution by Maturity

| Maturity Level | Count | Percentage | Key Characteristics |
|----------------|-------|------------|---------------------|
| **Foundation** | 8 | 5% | Critical infrastructure, high usage |
| **Core** | 35 | 25% | Essential functionality, broad usage |
| **Feature** | 55 | 40% | Enhanced experience, medium usage |
| **Utility** | 42 | 30% | Specialized, low usage |

### Package Distribution

| Package | Interactive Components | Percentage | Primary Focus |
|---------|----------------------|------------|---------------|
| `@clarity-chat/react` | 110+ | 75% | Full-featured chat components |
| `@clarity-chat/primitives` | 25+ | 17% | UI primitives and utilities |
| Storybook App | 7 | 5% | Testing infrastructure |
| Docs Site | 9 | 6% | Documentation examples |
| Example Apps | 10+ | 7% | Real-world usage patterns |

### Pattern Distribution

| Pattern | Component Count | Usage Frequency | Priority |
|---------|-----------------|-----------------|----------|
| Action | 45+ | High | 🔴 Critical |
| Status | 40+ | High | 🔴 Critical |
| Communication | 35+ | High | 🟡 High |
| Input | 30+ | High | 🔴 Critical |
| Navigation | 25+ | Medium | 🟡 High |
| Selection | 20+ | Medium | 🟡 High |
| Layout | 18+ | Medium | 🟢 Medium |
| Control | 15+ | Medium | 🟢 Medium |
| Manipulation | 8+ | Low | 🟢 Medium |

### Key Findings

1. **Foundation Stability**: 8 foundation components handle 80%+ of interactions
2. **Pattern Maturity**: Action/Input patterns are well-implemented; Communication/Navigation need work
3. **Accessibility Gaps**: Focus management and ARIA live regions are inconsistent
4. **Usage Distribution**: Pareto principle applies - 20% of components handle 80% of interactions
5. **Testing Coverage**: Core library well-tested; application components need more coverage

### Next Steps

1. **Audit Communication Pattern**: Focus trapping, escape handling, ARIA live regions
2. **Enhance Navigation Pattern**: Roving tabindex, arrow key navigation
3. **Standardize Focus Management**: Consistent focus return and trapping
4. **Improve Screen Reader Support**: Live regions for dynamic content
5. **Add Manipulation Pattern**: Drag/drop screen reader feedback

---

*Generated from comprehensive codebase analysis across all Clarity Chat packages and applications.*