# Coss UI (formerly Origin UI)

## Overview

- **Documentation URL**: https://coss.com/ui/docs
- **Component Library**: https://coss.com/ui
- **Repository**: https://github.com/cosscom/coss
- **License**: Open Source
- **Maintained by**: Coss.com (Cal.com parent company)
- **Framework**: React, Tailwind CSS
- **Based on**: Base UI (React primitives)
- **Maintenance Status**: Actively maintained
- **Design**: Cal.com's iconic design system

## Project Philosophy

Coss UI (formerly Origin UI) is a **beautiful component library** based on Cal.com's iconic design,
built from the ground up on Base UI primitives. It represents modern, accessible component design
with a focus on:

- **Base UI Foundation**: Built on robust, accessible primitives
- **Design Excellence**: Cal.com's polished, professional aesthetic
- **Accessibility-First**: WCAG compliance built into every component
- **Keyboard Navigation**: First-class keyboard UX
- **Unopinionated Primitives**: Flexible, customizable foundation
- **Robust**: Battle-tested in Cal.com

**Design Principles**:

- **Accessibility**: Keyboard navigation and screen reader support built-in
- **Composability**: Build complex UIs from simple primitives
- **Flexibility**: Style and customize without limitations
- **Quality**: Polished, robust components

## Command Palette Component (CRITICAL STUDY)

### Overview

The **Command Palette** is Coss UI's standout component for command/search interfaces. It's a
comprehensive, accessible implementation that serves as excellent inspiration for Clarity's planned
command components.

**Documentation**: https://coss.com/ui/docs/components/command

### Component Architecture

#### Core Components

1. **Command** (`CommandRoot`)
   - Alias for Autocomplete.Root with sensible defaults
   - Configuration: `autoHighlight="always"`, `keepHighlight={true}`, `open={true}`
   - Handles search, keyboard navigation, and selection

2. **CommandDialog** (`DialogRoot`)
   - Wrapper for full-screen/modal command palette
   - Provides dialog root functionality
   - Manages open/close state

3. **CommandDialogTrigger** (`CommandDialogTrigger`)
   - Button that opens the command dialog
   - Renders as button by default
   - Keyboard shortcut support (typically Cmd+K / Ctrl+K)

4. **CommandDialogPopup** (`DialogPopup`)
   - The popup content container
   - Displays command palette inside dialog
   - Handles positioning and overlay

5. **CommandInput** (`AutocompleteInput`)
   - Search input field with integrated search icon
   - Includes search icon via `startAddon`
   - Sized to `lg` by default
   - Auto-focus on open

6. **CommandList** (`AutocompleteList`)
   - Scrollable container for command items
   - Wraps items with scroll functionality
   - Virtual scrolling for large lists

7. **CommandPanel** (`CommandPanel`)
   - Container for standalone command interfaces
   - Provides bordered, elevated appearance
   - Used outside of dialogs

8. **CommandEmpty** (`AutocompleteEmpty`)
   - Message when no results found
   - "No results found" state
   - Customizable empty state UI

9. **CommandCollection** (`AutocompleteCollection`)
   - Groups items within CommandGroup
   - Used when data is grouped
   - Alias for AutocompleteCollection

### Key Features

#### 1. Search Functionality

**Built-in Search**:

- Real-time filtering as user types
- Fuzzy matching support
- Highlight matched text
- Clear search button

**Implementation**:

```tsx
<Command>
  <CommandInput placeholder="Type a command or search..." autoFocus />
  <CommandList>
    <CommandEmpty>No results found.</CommandEmpty>
    {/* Command items */}
  </CommandList>
</Command>
```

#### 2. Keyboard Navigation

**Full Keyboard Support**:

- **Arrow Up/Down**: Navigate through items
- **Enter**: Execute selected command
- **Escape**: Close command palette
- **Tab**: Navigate between groups
- **Ctrl/Cmd + K**: Open command palette (common convention)
- **Home/End**: Jump to first/last item

**Accessibility**:

- Auto-highlight first item
- Keep highlight visible during navigation
- Screen reader announcements
- Focus management
- ARIA attributes

#### 3. Grouping & Organization

**Command Groups**:

```tsx
<CommandList>
  <CommandGroup heading="Suggestions">
    <CommandItem>Calendar</CommandItem>
    <CommandItem>Search Emoji</CommandItem>
  </CommandGroup>

  <CommandGroup heading="Settings">
    <CommandItem>Profile</CommandItem>
    <CommandItem>Billing</CommandItem>
  </CommandGroup>
</CommandList>
```

**Features**:

- Group headings
- Visual separators
- Collapsible groups (optional)
- Multiple groups per list

#### 4. Visual Design

**Design Characteristics**:

- Clean, modern aesthetic
- Subtle shadows and borders
- Smooth animations
- Hover states
- Selected item highlight
- Loading states
- Icon support

**Styling**:

- Tailwind CSS-based
- Easy customization
- Dark mode support
- Responsive design

### Usage Patterns

#### Basic Command Palette

```tsx
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@coss/ui'

function CommandPalette() {
  return (
    <Command>
      <CommandInput placeholder="Type a command..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem onSelect={() => console.log('Calendar')}>📅 Calendar</CommandItem>
          <CommandItem onSelect={() => console.log('Search')}>🔍 Search Emoji</CommandItem>
          <CommandItem onSelect={() => console.log('Calculator')}>🧮 Calculator</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
```

#### Dialog-Based Command Palette

```tsx
import {
  CommandDialog,
  CommandDialogTrigger,
  CommandDialogPopup,
  CommandInput,
  CommandList,
  CommandItem,
} from '@coss/ui'

function App() {
  const [open, setOpen] = useState(false)

  // Keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandDialogTrigger>
        Open Command Palette
        <kbd>⌘K</kbd>
      </CommandDialogTrigger>

      <CommandDialogPopup>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandItem>Action 1</CommandItem>
          <CommandItem>Action 2</CommandItem>
        </CommandList>
      </CommandDialogPopup>
    </CommandDialog>
  )
}
```

#### With Icons and Shortcuts

```tsx
<CommandList>
  <CommandItem>
    <div className="flex items-center gap-2">
      <FileIcon />
      <span>New File</span>
    </div>
    <kbd className="ml-auto">⌘N</kbd>
  </CommandItem>

  <CommandItem>
    <div className="flex items-center gap-2">
      <FolderIcon />
      <span>Open Folder</span>
    </div>
    <kbd className="ml-auto">⌘O</kbd>
  </CommandItem>
</CommandList>
```

### Technical Implementation

#### Base UI Foundation

**Why Base UI?**:

- Robust, accessible primitives
- Handles keyboard navigation automatically
- Focus management built-in
- Screen reader support
- No imposed design decisions
- Full customization freedom

**Benefits**:

- Accessibility handled by Base UI
- Keyboard navigation automatic
- ARIA attributes included
- Focus trap in dialogs
- Escape key handling

#### Autocomplete Primitive

The Command component builds on `Autocomplete.Root`:

**Features**:

- Filter/search logic
- Keyboard navigation
- Item selection
- Highlight management
- Value tracking

**Configuration**:

```tsx
<Autocomplete.Root
  autoHighlight="always" // Always highlight an item
  keepHighlight={true} // Maintain highlight
  open={true} // Keep open
>
  {/* Command palette content */}
</Autocomplete.Root>
```

## Design Patterns for Clarity

### What to Learn from Coss UI Command Palette

#### 1. Component Hierarchy

**Modular Structure**:

```
CommandRoot (search & state)
├── CommandInput (search field)
├── CommandList (scrollable container)
│   ├── CommandEmpty (no results)
│   ├── CommandGroup (categorization)
│   │   ├── CommandItem (individual commands)
│   │   └── CommandItem
│   └── CommandGroup
└── CommandShortcuts (keyboard hints)
```

**Apply to Clarity**:

- Similar hierarchy for chat commands
- Separate input, list, and items
- Grouping for command categories
- Empty states for no matches

#### 2. Keyboard Navigation

**Essential Patterns**:

- Auto-highlight first item
- Arrow key navigation
- Enter to execute
- Escape to close
- Keyboard shortcuts displayed
- Focus management

**Apply to Clarity**:

- `/command` trigger in chat
- Arrow keys to navigate suggestions
- Enter to execute command
- Tab to autocomplete
- Visual keyboard hints

#### 3. Search & Filtering

**Smart Search**:

- Real-time filtering
- Fuzzy matching
- Highlight matched text
- Clear button
- Search history

**Apply to Clarity**:

- Filter AI commands by name
- Match command descriptions
- Show parameter hints
- Recent commands

#### 4. Visual Feedback

**UI Patterns**:

- Hover states
- Selected item highlight
- Smooth transitions
- Loading indicators
- Success/error feedback

**Apply to Clarity**:

- Highlight selected command
- Show command availability
- Parameter validation feedback
- Execution status

#### 5. Accessibility

**A11y Features**:

- Screen reader support
- Keyboard-only navigation
- Focus visible indicators
- ARIA labels
- Semantic HTML

**Apply to Clarity**:

- Full keyboard support for commands
- Screen reader announces commands
- Focus management in command palette
- ARIA attributes for command states

### Command Palette vs Chat Commands

**Similarities**:

- Search/filter functionality
- Keyboard navigation
- Grouped commands
- Quick access patterns

**Differences**:

- Command palette: Separate overlay
- Chat commands: Inline in input field
- Command palette: Full-screen focus
- Chat commands: Contextual to conversation

**Hybrid Approach for Clarity**:

```tsx
// Inline command suggestions (primary)
<ChatInput>
  <Input value="/help" />
  <CommandSuggestions>
    <CommandItem>/help - Show available commands</CommandItem>
    <CommandItem>/clear - Clear conversation</CommandItem>
  </CommandSuggestions>
</ChatInput>

// Full command palette (secondary, Cmd+K)
<CommandDialog>
  <CommandInput placeholder="Search commands..." />
  <CommandList>
    <CommandGroup heading="AI Commands">
      <CommandItem>/analyze - Analyze code</CommandItem>
      <CommandItem>/explain - Explain concept</CommandItem>
    </CommandGroup>
  </CommandList>
</CommandDialog>
```

## Strengths of Coss UI

### Overall Library

1. **Design Excellence**: Beautiful, professional aesthetic from Cal.com
2. **Base UI Foundation**: Robust, accessible primitives
3. **Robust**: Battle-tested in real applications
4. **Accessibility**: WCAG-compliant out of the box
5. **Keyboard Navigation**: First-class keyboard UX
6. **Composability**: Build complex UIs from primitives
7. **Customization**: Full control over styling and behavior

### Command Palette Specifically

1. **Complete Implementation**: Comprehensive command palette solution
2. **Keyboard-First**: Excellent keyboard navigation
3. **Search**: Real-time filtering and fuzzy matching
4. **Grouping**: Organize commands into categories
5. **Visual Polish**: Smooth animations and transitions
6. **Accessibility**: Screen reader and keyboard support
7. **Flexibility**: Use in dialog or standalone
8. **Icons & Shortcuts**: Visual aids for discoverability

## Weaknesses

### Overall Library

1. **Not AI-Specific**: General-purpose component library
2. **No Chat Components**: No built-in chat or messaging UI
3. **Limited Scope**: Smaller component library than MUI/Ant Design
4. **Learning Curve**: Base UI primitives require understanding
5. **Documentation**: Still building comprehensive docs

### Command Palette Specifically

1. **Not AI-Focused**: General command palette, not AI-specific
2. **No AI Context**: Doesn't understand AI commands or parameters
3. **Static Commands**: No dynamic command generation
4. **No Parameter Input**: Limited support for command parameters
5. **No Command History**: No built-in command history

## Strategic Insights for Clarity

### Command Component Design

**Inspiration from Coss UI Command Palette**:

1. **Modular Architecture**: Separate Root, Input, List, Item components
2. **Keyboard-First**: Arrow navigation, Enter to execute, Escape to close
3. **Search & Filter**: Real-time filtering with fuzzy matching
4. **Visual Design**: Clean, modern aesthetic with smooth animations
5. **Accessibility**: Full keyboard and screen reader support
6. **Grouping**: Organize commands by category
7. **Shortcuts**: Display keyboard shortcuts visually
8. **Empty States**: Clear messaging when no results

### Clarity's Chat Command Component

**Proposed Architecture** (inspired by Coss UI):

```tsx
// Inline command suggestions
<ChatCommandSuggestions>
  <ChatCommandInput value="/ana" />
  <ChatCommandList>
    <ChatCommandEmpty>No matching commands</ChatCommandEmpty>
    <ChatCommandGroup heading="AI Commands">
      <ChatCommandItem command="/analyze">
        <ChatCommandIcon>🔍</ChatCommandIcon>
        <ChatCommandName>/analyze</ChatCommandName>
        <ChatCommandDescription>Analyze code or text</ChatCommandDescription>
        <ChatCommandShortcut>⌘A</ChatCommandShortcut>
      </ChatCommandItem>
    </ChatCommandGroup>
  </ChatCommandList>
</ChatCommandSuggestions>

// Full command palette (Cmd+K)
<ChatCommandDialog>
  <ChatCommandDialogTrigger />
  <ChatCommandDialogPopup>
    <ChatCommandInput placeholder="Search AI commands..." />
    <ChatCommandList>
      {/* Same structure as inline suggestions */}
    </ChatCommandList>
  </ChatCommandDialogPopup>
</ChatCommandDialog>
```

### Key Features to Implement

**From Coss UI Command Palette**:

1. ✅ Keyboard navigation (arrows, enter, escape)
2. ✅ Search/filter functionality
3. ✅ Command grouping
4. ✅ Visual feedback (hover, selected)
5. ✅ Empty states
6. ✅ Accessibility (ARIA, screen readers)
7. ✅ Smooth animations
8. ✅ Keyboard shortcut display

**Clarity-Specific Additions**:

1. ⭐ AI command parameters
2. ⭐ Command history
3. ⭐ Contextual suggestions
4. ⭐ Command validation
5. ⭐ Execution feedback
6. ⭐ Dynamic commands from AI
7. ⭐ Command aliases
8. ⭐ Command documentation inline

## Use Cases

### When to Study Coss UI

1. **Command Palette Design**: Implementing command components
2. **Keyboard Navigation**: Learning accessible keyboard patterns
3. **Search UX**: Real-time filtering and search
4. **Visual Design**: Modern, polished component aesthetic
5. **Base UI Patterns**: Understanding primitive-based architecture
6. **Accessibility**: WCAG-compliant component design

### When to Use Coss UI (General)

1. **Cal.com-Style Apps**: Want Cal.com aesthetic
2. **Base UI Projects**: Using Base UI primitives
3. **Command Palettes**: Need command palette component
4. **Accessible UIs**: Require WCAG compliance
5. **Modern Design**: Want contemporary, polished look

## Conclusion

Coss UI's **Command Palette** is an **excellent reference implementation** for Clarity's planned
command components. It demonstrates:

**Key Takeaways**:

1. **Modular Architecture**: Separate concerns with composable components
2. **Keyboard-First**: Excellent keyboard navigation and shortcuts
3. **Accessible**: Screen reader and a11y best practices
4. **Visual Polish**: Smooth animations and professional design
5. **Search UX**: Real-time filtering with fuzzy matching
6. **Grouping**: Organize commands into categories
7. **Base UI Foundation**: Built on robust, accessible primitives

**For Clarity's Command Implementation**:

**Adopt from Coss UI**:

- Component hierarchy (Root, Input, List, Item)
- Keyboard navigation patterns
- Search and filtering UX
- Visual design principles
- Accessibility patterns
- Empty state handling
- Smooth animations

**Extend for AI Use Cases**:

- Command parameters and validation
- AI-generated command suggestions
- Command execution feedback
- Integration with chat context
- Command history
- Dynamic commands
- Inline documentation

**Implementation Recommendation**: Study Coss UI's Command Palette deeply, adopt its proven
patterns, and extend with AI-specific features. Use it as the gold standard for command component
design while adding Clarity's unique AI-focused capabilities.

## Resources

- **Documentation**: https://coss.com/ui/docs
- **Command Component**: https://coss.com/ui/docs/components/command
- **Get Started**: https://coss.com/ui/docs/get-started
- **Styling**: https://coss.com/ui/docs/styling
- **GitHub**: https://github.com/cosscom/coss
- **Base UI**: https://base-ui.com/ (underlying framework)
- **Cal.com**: https://cal.com/ (design inspiration)

## References

- [Coss UI Command Component](https://coss.com/ui/docs/components/command)
- [Coss UI Documentation](https://coss.com/ui/docs)
- [Coss UI Introduction](https://coss.com/ui/docs)
- [Coss UI on Tailkits](https://tailkits.com/components/coss-ui/)
- [coss.com ui - Beautiful component library](https://www.productcool.com/product/coss-com-ui)
- [Coss GitHub Repository](https://github.com/cosscom/coss)
