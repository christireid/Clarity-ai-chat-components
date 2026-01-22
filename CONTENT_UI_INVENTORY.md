# Content UI Components & Hooks Inventory

**Generated**: January 21, 2026  
**Scope**: Content-presentation components and hooks in `@clarity-chat/react` and `@clarity-chat/primitives`  
**Purpose**: Audit, classify, and track remediation of content UI elements

---

## Table of Contents

- [Overview](#overview)
- [@clarity-chat/primitives Content Components](#clarity-chat-primitives-content-components)
- [@clarity-chat/react Content Components](#clarity-chat-react-content-components)
- [Content Hooks](#content-hooks)
- [Public API Mapping](#public-api-mapping)
- [Storybook Coverage](#storybook-coverage)
- [Design Token Usage](#design-token-usage)
- [Accessibility Notes](#accessibility-notes)
- [Priority Classification](#priority-classification)

---

## Overview

This inventory focuses on **content-presentation** UI elements that primarily display information to users, as opposed to interactive chat/AI components. Content components excel at rendering different types of content correctly, maintaining visual consistency, and providing proper semantic structure.

### Classification Criteria

**Content Components** are distinguished by:
- Primary purpose of presenting information vs accepting input/triggering actions
- Rare complex state management (primarily presentation state)
- Need to excel at rendering text, images, media, structured data
- Must maintain visual consistency and semantic correctness
- Often appear many times across pages (performance-critical)

**Categories**:
- **Primitives**: Basic building blocks (Card, Badge, Avatar, etc.)
- **Layout**: Spatial organization (containers, grids, spacers)
- **Typography**: Text presentation (headings, paragraphs, lists)
- **Media**: Rich content (images, videos, documents)
- **Code**: Syntax-highlighted code display
- **States**: Loading, empty, error states
- **Interactive Content**: Copy buttons, expandable content

---

## @clarity-chat/primitives Content Components

### Core UI Primitives

| Component | Location | Exports | Category | Description | Public API |
|-----------|----------|---------|----------|-------------|------------|
| **Avatar** | `components/avatar.tsx` | `Avatar` | Media | User/profile image display | ✅ Public |
| **Badge** | `components/badge.tsx` | `Badge` | Display | Status/label indicators | ✅ Public |
| **Button** | `components/ui/button-enhanced.tsx` | `Button`, `buttonVariants` | Interactive | Enhanced button with loading states | ✅ Public |
| **Card** | `components/card.tsx` | `Card`, `CardHeader`, `CardFooter`, `CardTitle`, `CardDescription`, `CardContent` | Layout | Content containers with sections | ✅ Public |
| **Checkbox** | `components/ui/checkbox.tsx` | `Checkbox` | Form | Form input (content context) | ✅ Public |
| **Dialog** | `components/ui/dialog.tsx` | `Dialog`, `DialogPortal`, `DialogOverlay`, `DialogTrigger`, `DialogClose`, `DialogContent`, `DialogHeader`, `DialogBody`, `DialogFooter`, `DialogTitle`, `DialogDescription` | Layout | Modal content containers | ✅ Public |
| **DropdownMenu** | `components/ui/dropdown-menu.tsx` | `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem`, `DropdownMenuCheckboxItem`, `DropdownMenuRadioItem`, `DropdownMenuLabel`, `DropdownMenuSeparator`, `DropdownMenuShortcut`, `DropdownMenuGroup`, `DropdownMenuPortal`, `DropdownMenuSub`, `DropdownMenuSubContent`, `DropdownMenuSubTrigger`, `DropdownMenuRadioGroup` | Navigation | Menu content containers | ✅ Public |
| **Input** | `components/input.tsx` | `Input` | Form | Text input fields | ✅ Public |
| **Label** | `components/label.tsx` | `Label` | Typography | Form labels and text labels | ✅ Public |
| **Popover** | `components/ui/popover.tsx` | `Popover`, `PopoverTrigger`, `PopoverContent` | Layout | Floating content containers | ✅ Public |
| **ScrollArea** | `components/scroll-area.tsx` | `ScrollArea` | Layout | Custom scrollable containers | ✅ Public |
| **Select** | `components/ui/select.tsx` | `Select`, `SelectGroup`, `SelectValue`, `SelectTrigger`, `SelectContent`, `SelectLabel`, `SelectItem`, `SelectSeparator`, `SelectScrollUpButton`, `SelectScrollDownButton` | Form | Selection dropdowns | ✅ Public |
| **Switch** | `components/ui/switch.tsx` | `Switch` | Form | Toggle switches | ✅ Public |
| **Tabs** | `components/ui/tabs.tsx` | `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` | Layout | Tabbed content organization | ✅ Public |
| **Textarea** | `components/textarea.tsx` | `Textarea` | Form | Multi-line text input | ✅ Public |
| **Tooltip** | `components/tooltip.tsx` | `Tooltip`, `SimpleTooltip` | Display | Contextual help text | ✅ Public |

### Enhanced Components

| Component | Location | Exports | Category | Description | Public API |
|-----------|----------|---------|----------|-------------|------------|
| **Enhanced Button** | `components/button.tsx` | `Button as EnhancedButton`, `buttonVariants as enhancedButtonVariants` | Interactive | Button with ripple effects and announcements | ✅ Public |
| **Enhanced Checkbox** | `components/checkbox.tsx` | `Checkbox as EnhancedCheckbox` | Form | Checkbox with accessibility announcements | ✅ Public |
| **Enhanced Dialog** | `components/dialog.tsx` | `Dialog as EnhancedDialog`, `DialogTrigger as EnhancedDialogTrigger`, `DialogContent as EnhancedDialogContent`, `DialogHeader as EnhancedDialogHeader`, `DialogTitle as EnhancedDialogTitle`, `DialogDescription as EnhancedDialogDescription`, `DialogBody as EnhancedDialogBody`, `DialogFooter as EnhancedDialogFooter`, `DialogClose as EnhancedDialogClose` | Layout | Dialog with animations and focus trap | ✅ Public |

### Icons & Utilities

| Component | Location | Exports | Category | Description | Public API |
|-----------|----------|---------|----------|-------------|------------|
| **Icons** | `components/icons.tsx` | `LoadingIcon`, `SuccessIcon`, `ErrorIcon`, `CloseIcon`, `CharacterCount` | Display | Icon components and utilities | ✅ Public |
| **Kbd** | `components/kbd.tsx` | `Kbd`, `useFormattedShortcut` | Display | Keyboard shortcut display | ✅ Public |

### Compound Components

| Component | Location | Exports | Category | Description | Public API |
|-----------|----------|---------|----------|-------------|------------|
| **InputCompound** | `components/input-compound.tsx` | `InputCompound`, `InputRoot`, `InputLabel`, `InputField`, `InputError`, `InputHelper`, `InputCharacterCount`, `InputFooter` | Form | Composable input with label/error/help | ✅ Public |

---

## @clarity-chat/react Content Components

### UI State Components

| Component | Location | Exports | Category | Description | Public API |
|-----------|----------|---------|----------|-------------|------------|
| **EmptyState** | `components/ui/empty-state.tsx` | `EmptyState`, `EmptyChatState`, `NoSearchResultsState`, `NoConversationsState`, `ErrorState`, `SuccessState` | States | Empty and error state displays | ✅ Public |
| **Skeleton** | `components/ui/skeleton.tsx` | `Skeleton`, `SkeletonText`, `SkeletonCircle`, `SkeletonRectangle`, `SkeletonPulse` | States | Loading state placeholders | ✅ Public |
| **Progress** | `components/ui/progress.tsx` | `Progress`, `CircularProgress` | States | Progress indicators | ✅ Public |
| **LinkPreview** | `components/ui/link-preview.tsx` | `LinkPreview`, `LinkPreviewSkeleton`, `LinkPreviewError`, `LinkPreviewCompact`, `InlineLink`, `SmartLinkPreview`, `RichEmbed`, `useLinkPreview`, `isValidUrl`, `sanitizeUrl`, `detectEmbedType`, `createMetadataFetcher`, `createFallbackMetadata` | Media | Link previews and embeds | ✅ Public |

### Feedback Components

| Component | Location | Exports | Category | Description | Public API |
|-----------|----------|---------|----------|-------------|------------|
| **Toast** | `components/ui/toast.tsx` | `ToastItem`, `ToastContainer`, `ToastProvider`, `useToast` | States | Toast notification system | ✅ Public |
| **Sonner Toast** | `components/ui/sonner-toast.tsx` | `ClarityToaster`, `toast` | States | Alternative toast system | ✅ Public |

### Code Display Components

| Component | Location | Exports | Category | Description | Public API |
|-----------|----------|---------|----------|-------------|------------|
| **CodeBlock** | `components/code/CodeBlock.tsx` | `CodeBlock` | Code | Syntax-highlighted code blocks | ✅ Public |
| **StreamingCodeBlock** | `components/code/StreamingCodeBlock.tsx` | `StreamingCodeBlock` | Code | Code blocks with streaming support | ✅ Public |
| **InlineCode** | `components/code/InlineCode.tsx` | `InlineCode` | Code | Inline code formatting | ✅ Public |
| **CodeBlockHeader** | `components/code/CodeBlockHeader.tsx` | `CodeBlockHeader` | Code | Code block headers | ❌ Internal |
| **CodeBlockCopyButton** | `components/code/CodeBlockCopyButton.tsx` | `CodeBlockCopyButton` | Code | Copy buttons for code | ❌ Internal |
| **LineNumbers** | `components/code/LineNumbers.tsx` | `LineNumbers` | Code | Line numbers for code | ❌ Internal |

### AI Content Components

| Component | Location | Exports | Category | Description | Public API |
|-----------|----------|---------|----------|-------------|------------|
| **MarkdownRendererEnhanced** | `components/ai/enhanced-markdown-renderer.tsx` | `MarkdownRendererEnhanced` | Typography | Enhanced markdown rendering | ✅ Public |
| **EnhancedMarkdownRenderer** | `components/ai/markdown-renderer-enhanced.tsx` | `EnhancedMarkdownRenderer` | Typography | Alternative enhanced markdown | ✅ Public |
| **MessageMarkdownRenderer** | `components/message/markdown-renderer.tsx` | `MessageMarkdownRenderer` | Typography | Message-specific markdown | ✅ Public |
| **EnhancedCodeBlock** | `components/ai/enhanced-code-block.tsx` | `EnhancedCodeBlock` | Code | AI-enhanced code blocks | ✅ Public |

### Media Components

| Component | Location | Exports | Category | Description | Public API |
|-----------|----------|---------|----------|-------------|------------|
| **DocumentViewer** | `components/media/document-viewer.tsx` | `DocumentViewer` | Media | Document display component | ✅ Public |
| **MultiModalPreview** | `components/media/multi-modal-preview.tsx` | `MultiModalPreview` | Media | Multi-modal content preview | ✅ Public |
| **DocumentIntegration** | `components/media/document-integration.tsx` | `DocumentIntegration`, `useDocumentIntegration` | Media | Document integration utilities | ✅ Public |

---

## Content Hooks

### @clarity-chat/primitives Hooks

| Hook | Location | Exports | Category | Description | Public API |
|------|----------|---------|----------|-------------|------------|
| **useReducedMotion** | `hooks/use-reduced-motion.ts` | `useReducedMotion`, `getReducedMotionPreference` | Accessibility | Reduced motion detection | ✅ Public |
| **useBodyScrollLock** | `hooks/use-body-scroll-lock.ts` | `useBodyScrollLock` | Layout | Body scroll locking | ✅ Public |
| **useRippleEffect** | `hooks/use-ripple-effect.ts` | `useRippleEffect` | Interaction | Ripple effect management | ✅ Public |
| **useControllableState** | `hooks/use-controllable-state.ts` | `useControllableState`, `useControllableBoolean` | State | Controllable state management | ✅ Public |
| **useComposedRefs** | `hooks/use-composed-refs.ts` | `composeRefs`, `useComposedRefs`, `useForwardedRef` | Utils | Ref composition utilities | ✅ Public |
| **useMagnetic** | `hooks/use-magnetic.ts` | `useMagnetic` | Interaction | Magnetic interaction effects | ✅ Public |

### @clarity-chat/react UI Hooks

| Hook | Location | Exports | Category | Description | Public API |
|------|----------|---------|----------|-------------|------------|
| **useMediaQuery** | `hooks/ui/use-media-query.ts` | `useMediaQuery`, `useBreakpoint` | Responsive | Media query and breakpoint detection | ✅ Public |
| **useIntersectionObserver** | `hooks/ui/use-intersection-observer.tsx` | `useIntersectionObserver` | Performance | Intersection observer for lazy loading | ✅ Public |
| **useReducedMotion** | `hooks/ui/use-reduced-motion.ts` | `useReducedMotion`, `getReducedMotionPreference` | Accessibility | Reduced motion detection (re-export) | ✅ Public |
| **useWindowSize** | `hooks/ui/use-window-size.tsx` | `useWindowSize` | Responsive | Window dimension tracking | ✅ Public |
| **useClipboard** | `hooks/ui/use-clipboard.tsx` | `useClipboard` | Utils | Clipboard operations | ✅ Public |
| **useDebounce** | `hooks/ui/use-debounce.ts` | `useDebounce` | Performance | Debouncing utilities | ✅ Public |
| **useThrottle** | `use-throttle.ts` | `useThrottledCallback` | Performance | Throttling utilities | ✅ Public |
| **useToggle** | `hooks/ui/use-toggle.tsx` | `useToggle` | State | Toggle state management | ✅ Public |
| **usePrevious** | `hooks/ui/use-previous.tsx` | `usePrevious` | Utils | Previous value tracking | ✅ Public |
| **useMounted** | `hooks/ui/use-mounted.ts` | `useMounted`, `useIsMounted` | Lifecycle | Mount state tracking | ✅ Public |
| **useMergedRef** | `hooks/ui/use-merged-ref.ts` | `useMergedRef`, `mergeRefs`, `useMergedRefWithCleanup`, `assignRef` | Utils | Ref merging utilities | ✅ Public |
| **useEventListener** | `hooks/ui/use-event-listener.ts` | `useEventListener` | Utils | Event listener management | ✅ Public |
| **useAutoScroll** | `hooks/ui/use-auto-scroll.tsx` | `useAutoScroll` | Behavior | Auto-scrolling functionality | ✅ Public |
| **useSafeTimeout** | `hooks/ui/use-safe-timeout.ts` | `useSafeTimeout` | Utils | Safe timeout management | ✅ Public |
| **useThemeColor** | `hooks/ui/useThemeColor.ts` | `useThemeColor` | Theming | Theme color access | ✅ Public |

---

## Public API Mapping

### @clarity-chat/primitives Exports (`packages/primitives/src/index.ts`)

#### Core Components (Default - shadcn/ui based)
- `Button`, `ButtonProps`, `ButtonState` (enhanced with loading)
- `Dialog*` components (full dialog system)
- `DropdownMenu*` components (full menu system)
- `Popover*` components (floating content)
- `Tooltip`, `SimpleTooltip`, `TooltipProps`
- `Checkbox`
- `Drawer*` components (drawer system)
- `Tabs*` components (tab system)
- `Input`, `Textarea`, `Label`
- `ScrollArea`
- `Select*` components (selection system)

#### Other Components
- `Avatar`, `AvatarProps`
- `Badge`, `BadgeProps`
- `Card*` components
- `ErrorMessage`, `ErrorMessageProps`
- `LoadingIcon`, `SuccessIcon`, `ErrorIcon`, `CloseIcon`, `CharacterCount`, `CharacterCountProps`
- `Kbd`, `KbdProps`, `KbdPlatform`, `KbdSize`, `KbdVariant`

#### Compound Components
- `InputCompound*` components (full input system)

#### Hooks
- `useRippleEffect`, `RippleType`
- `useBodyScrollLock`
- `useReducedMotion`, `getReducedMotionPreference`
- `useControllableState`, `useControllableBoolean`, `UseControllableStateOptions`
- `composeRefs`, `useComposedRefs`, `useForwardedRef`
- `useMagnetic`, `UseMagneticOptions`

#### Utils
- `cn` (className utility)
- `glassVariants`, `glassButtonVariants`, `GRADIENT_SEMANTIC_MAP`, `getSemanticGradient`
- `generateAriaId`, `resetAriaIdCounter`, `announce`, `clearAnnouncement`, `getFocusableElements`, `getFirstFocusableElement`, `getLastFocusableElement`, `focusFirstElement`, `saveFocus`, `Keys`, `isKey`, `isActivationKey`, `getErrorAriaAttributes`, `getLoadingAriaAttributes`, `getExpandedAriaAttributes`
- `durations`, `springPresets`, `easingPresets`, `noAnimation`, `fadeVariants`, `scaleVariants`, `slideUpVariants`, `slideDownVariants`, `slideLeftVariants`, `slideRightVariants`, `popVariants`, `collapseVariants`, `getReducedMotionVariants`, `getReducedMotionTransition`, `interactiveVariants`, `getReducedMotionInteractive`, `staggerContainerVariants`, `staggerItemVariants`, `animationPresets`

### @clarity-chat/react Content Exports (`packages/react/src/public-api.ts`)

#### UI Components
- `EmptyState`, `EmptyChatState`, `NoSearchResultsState`, `NoConversationsState`, `ErrorState`, `SuccessState`
- `Skeleton`, `SkeletonText`, `SkeletonCircle`, `SkeletonRectangle`, `SkeletonPulse`
- `Progress`, `CircularProgress`
- `LinkPreview*` components and utilities

#### Code Components
- `CodeBlock`, `CodeBlockProps`, `CodeFontFamily`
- `StreamingCodeBlock`, `StreamingCodeBlockProps`
- `InlineCode`, `InlineCodeProps`
- `parseCodeBlocks`, `hasCodeBlocks`, `extractCodeBlocks`, `parseLineRanges`, `escapeHtml`, `normalizeLanguage`, `detectLanguage`, `getLanguageDisplayName`, `extractLanguageFromClassName`, `countLines`, `truncateCode`, `COMMON_LANGUAGES`, `LANGUAGE_DISPLAY_NAMES`, `ParsedCodeBlock`, `CommonLanguage`
- `CODE_THEMES`, `DEFAULT_DARK_THEME`, `DEFAULT_LIGHT_THEME`, `CodeThemeName`, `CodeThemeDefinition`

#### AI Content Components
- `MarkdownRendererEnhanced`, `MarkdownRendererProps`
- `EnhancedMarkdownRenderer`
- `MessageMarkdownRenderer`

#### Media Components
- `DocumentViewer`
- `MultiModalPreview`
- `DocumentIntegration`, `useDocumentIntegration`

#### Hooks
- `useClipboard`
- `useDebounce`
- `useThrottledCallback` (throttle)
- `useToggle`
- `usePrevious`
- `useMounted`, `useIsMounted`
- `useMergedRef`, `mergeRefs`, `useMergedRefWithCleanup`, `assignRef`, `ReactRef`
- `useWindowSize`
- `useIntersectionObserver`
- `useEventListener`
- `useMediaQuery`, `useBreakpoint`
- `useReducedMotion`, `getReducedMotionPreference`
- `useAutoScroll`, `UseAutoScrollOptions`, `UseAutoScrollReturn`
- `useSafeTimeout`
- `useThemeColor`

---

## Storybook Coverage

### @clarity-chat/primitives Components

| Component | Storybook Path | Status | Notes |
|-----------|----------------|--------|-------|
| Avatar | `Primitives/Avatar` | ✅ Complete | Basic variants and sizes |
| Badge | `Primitives/Badge` | ✅ Complete | All variants and states |
| Button | `Primitives/Button` | ✅ Complete | All variants, states, loading |
| Card | `Primitives/Card` | ✅ Complete | All compound variants |
| Checkbox | `Primitives/Checkbox` | ✅ Complete | States and accessibility |
| Dialog | `Primitives/Dialog` | ✅ Complete | Full dialog system |
| Input | `Primitives/Input` | ✅ Complete | All variants and states |
| Label | `Primitives/Label` | ✅ Complete | Basic usage |
| ScrollArea | `Primitives/ScrollArea` | ⚠️ Partial | Basic functionality |
| Select | `Primitives/Select` | ✅ Complete | Full select system |
| Switch | `Primitives/Switch` | ✅ Complete | States and accessibility |
| Tabs | `Primitives/Tabs` | ✅ Complete | All orientations |
| Textarea | `Primitives/Textarea` | ✅ Complete | All variants and states |
| Tooltip | `Primitives/Tooltip` | ✅ Complete | All variants |

### @clarity-chat/react Content Components

| Component | Storybook Path | Status | Notes |
|-----------|----------------|--------|-------|
| EmptyState | `Components/DataDisplay/EmptyState` | ✅ Complete | All state variants |
| Skeleton | `Components/DataDisplay/Skeleton` | ✅ Complete | All variants and animations |
| Progress | `Components/DataDisplay/Progress` | ✅ Complete | Linear and circular |
| LinkPreview | `Components/UI/LinkPreview` | ⚠️ Partial | Basic functionality, needs expansion |
| CodeBlock | `Components/Code/CodeBlock` | ✅ Complete | All themes and features |
| StreamingCodeBlock | `Components/Code/StreamingCodeBlock` | ✅ Complete | Streaming simulation |
| InlineCode | `Components/Code/InlineCode` | ✅ Complete | Basic variants |
| MarkdownRenderer | `Components/DataDisplay/MarkdownRenderer` | ⚠️ Partial | Basic markdown, needs expansion |
| DocumentViewer | `Components/Media/DocumentViewer` | ❌ Missing | Needs creation |
| MultiModalPreview | `Components/Media/MultiModalPreview` | ❌ Missing | Needs creation |

---

## Design Token Usage

### Color Tokens Used

#### @clarity-chat/primitives Components
- **Semantic Colors**: `primary`, `secondary`, `destructive`, `muted`, `accent`, `success`, `warning`, `info`
- **Component Colors**: `card`, `popover`, `border`, `input`, `ring`
- **Text Colors**: `foreground`, `muted-foreground`, `primary-foreground`, etc.

#### @clarity-chat/react Content Components
- **UI Colors**: `background`, `foreground`, `muted`, `accent`
- **State Colors**: `success`, `warning`, `info`, `destructive`
- **Code Themes**: 15+ syntax highlighting themes (GitHub, Night Owl, Dracula, etc.)

### Spacing Tokens Used
- **Scale**: `0.5`, `1`, `1.5`, `2`, `2.5`, `3`, `3.5`, `4`, `5`, `6`, `7`, `8`, `9`, `10`, `11`, `12`, `14`, `16`, `20`, `24`, `28`, `32`, `36`, `40`, `44`, `48`, `52`, `56`, `60`, `64`, `72`, `80`, `96`
- **Semantic**: `px`, `0.5`, `1`, `2`, `3`, `4`, `6`, `8`, `12`, `16`, `24`

### Typography Tokens Used
- **Font Families**: `font-sans`, `font-mono` (for code)
- **Font Sizes**: `text-xs` through `text-9xl`
- **Font Weights**: `font-thin` through `font-black`
- **Line Heights**: `leading-none` through `leading-relaxed`
- **Letter Spacing**: `tracking-tighter` through `tracking-wider`

### Border Radius Tokens Used
- **Scale**: `rounded-none`, `rounded-sm`, `rounded`, `rounded-md`, `rounded-lg`, `rounded-xl`, `rounded-2xl`, `rounded-3xl`, `rounded-full`

### Shadow Tokens Used
- **Scale**: `shadow-xs`, `shadow-sm`, `shadow`, `shadow-md`, `shadow-lg`, `shadow-xl`, `shadow-2xl`

---

## Accessibility Notes

### Semantic Structure

#### @clarity-chat/primitives
- **Avatar**: Uses `img` with `alt` prop
- **Button**: Proper `button` element, loading states announced
- **Card**: Semantic sections with `CardHeader`, `CardTitle`, etc.
- **Checkbox**: Proper `input[type="checkbox"]` with labels
- **Dialog**: Uses dialog role, focus management
- **Input/Label**: Proper form associations
- **Select**: ARIA combobox implementation
- **Switch**: Proper checkbox role
- **Tabs**: ARIA tabs implementation
- **Tooltip**: ARIA tooltip pattern

#### @clarity-chat/react Content Components
- **EmptyState**: Uses appropriate headings and descriptions
- **Skeleton**: Announces loading state
- **Progress**: ARIA progressbar implementation
- **LinkPreview**: Proper link semantics
- **CodeBlock**: Uses `pre` and `code` elements
- **MarkdownRenderer**: Semantic HTML output

### Keyboard Navigation
- All interactive elements keyboard accessible
- Focus management in dialogs/modals
- Tab order logical and complete

### Screen Reader Support
- Proper ARIA labels and descriptions
- Loading states announced
- Error states communicated
- Code content properly marked

### Reduced Motion
- Respects `prefers-reduced-motion`
- Animations can be disabled
- Essential functionality preserved

---

## Priority Classification

### Critical Priority (P0) - Core Foundation
**Must be fixed first - blocks everything else**

1. **Public API Consistency**: Resolve duplicate implementations (multiple markdown renderers, toast systems, reduced-motion hooks)
2. **Storybook Build Blockers**: Fix commented-out exports preventing builds
3. **Core Hooks**: `useIntersectionObserver`, `useMediaQuery`, `useReducedMotion` (performance/accessibility critical)
4. **Typography Components**: Markdown renderers, code blocks (semantic correctness)
5. **State Components**: Empty states, skeletons, progress (ubiquitous usage)

### High Priority (P1) - Core Functionality
**Critical for content presentation**

6. **Visual Consistency**: Hard-coded values → design tokens
7. **Responsive Behavior**: Media queries, viewport handling
8. **Accessibility Compliance**: ARIA, contrast, keyboard navigation
9. **Performance**: Hook cleanup, lazy loading, rerenders
10. **Theming**: Light/dark mode consistency

### Medium Priority (P2) - Enhanced Features
**Important but not blocking**

11. **Advanced Media**: Document viewers, multi-modal previews
12. **Rich Interactions**: Copy buttons, expandable content
13. **Animation Polish**: Consistent timing, reduced motion
14. **Error Handling**: Graceful degradation, user feedback

### Lower Priority (P3) - Polish & Utilities
**Nice-to-have enhancements**

15. **Additional Stories**: Complete Storybook coverage
16. **Documentation**: Inline docs, usage examples
17. **Performance Optimization**: Bundle size, memory usage
18. **Cross-browser Testing**: Edge cases and compatibility

---

## Duplicate/Overlapping Implementations

### Multiple Toast Systems
- **Sonner Toast**: `components/ui/sonner-toast.tsx` - Modern, feature-rich
- **Custom Toast**: `components/ui/toast.tsx` - Custom implementation
- **Issue**: Both exported in public API, potential confusion
- **Recommendation**: Standardize on one (likely Sonner for features)

### Multiple Reduced Motion Hooks
- **Primitives**: `hooks/use-reduced-motion.ts`
- **React**: `hooks/ui/use-reduced-motion.ts` (re-export)
- **Issue**: Duplication, potential inconsistency
- **Recommendation**: Consolidate to single implementation

### Multiple Markdown Renderers
- **EnhancedMarkdownRenderer**: `components/ai/markdown-renderer-enhanced.tsx`
- **MarkdownRendererEnhanced**: `components/ai/enhanced-markdown-renderer.tsx`
- **MessageMarkdownRenderer**: `components/message/markdown-renderer.tsx`
- **Issue**: Three similar implementations
- **Recommendation**: Consolidate to one with feature flags

### Commented-Out Exports
- **Location**: `components/ui/index.ts`
- **Issue**: Dashboard skeleton exports commented out, breaking Storybook builds
- **Recommendation**: Either implement or remove properly

---

## Implementation Notes

### Current State Assessment
- **Total Components**: ~45 content components + ~25 hooks
- **Public API Surface**: ~80+ exports across two packages
- **Storybook Coverage**: ~70% complete, some missing stories
- **Design Token Usage**: Mostly consistent, some hard-coded values remain
- **Accessibility**: Generally good, some semantic improvements needed
- **Performance**: Hooks need cleanup verification for React 19

### Remediation Approach
1. **Fix build blockers first** (commented exports, missing stories)
2. **Consolidate duplicates** (toast systems, markdown renderers)
3. **Standardize tokens** (hard-coded → design tokens)
4. **Enhance accessibility** (semantic HTML, ARIA improvements)
5. **Verify responsive behavior** (viewport testing)
6. **Performance audit** (hook cleanup, lazy loading)
7. **Remove deprecated code** (after functional parity confirmed)

---

*This inventory will be updated as remediation progresses. Last updated: January 21, 2026*