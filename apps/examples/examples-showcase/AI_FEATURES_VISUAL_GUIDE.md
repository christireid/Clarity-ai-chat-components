# AI Features Visual Guide

## Component Layout Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    AI Features Showcase                      │
│          Explore AI-specific components for building         │
│                  intelligent applications                    │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────────┬──────────────────────────┐
│  1. Model Selector       │  2. Token Usage & Budget │
├──────────────────────────┼──────────────────────────┤
│  3. AI Status Indicator  │  4. Prompt Templates     │
├──────────────────────────┴──────────────────────────┤
│  5. Knowledge Base Viewer                           │
├─────────────────────────────────────────────────────┤
│  6. Coming Soon Features                            │
└─────────────────────────────────────────────────────┘
```

## 1. Model Selector

### Visual Structure
```
┌─────────────────────────────────────┐
│ Model Selector                      │
│ Choose from multiple AI providers   │
├─────────────────────────────────────┤
│                                     │
│ OPENAI                              │
│ ┌─────────────────────────────┐   │
│ │ GPT-4o                    ✓ │   │ ← Selected
│ │ Most capable model...       │   │
│ └─────────────────────────────┘   │
│ ┌─────────────────────────────┐   │
│ │ GPT-4 Turbo                 │   │
│ │ Fast and powerful...        │   │
│ └─────────────────────────────┘   │
│ ┌─────────────────────────────┐   │
│ │ GPT-3.5 Turbo               │   │
│ │ Fast and economical         │   │
│ └─────────────────────────────┘   │
│                                     │
│ ANTHROPIC                           │
│ ┌─────────────────────────────┐   │
│ │ Claude 3.5 Sonnet           │   │
│ │ Best balance of...          │   │
│ └─────────────────────────────┘   │
│   [... more models ...]            │
│                                     │
├─────────────────────────────────────┤
│ Selected Model                      │
│ ┌─────────────────────────────┐   │
│ │ Model: GPT-4o               │   │
│ │ Max Tokens: 128,000         │   │
│ │ Cost: $0.0025/1K tokens     │   │
│ └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

### Features
- ✅ Provider grouping (OpenAI, Anthropic, Google)
- ✅ 8 models total across 3 providers
- ✅ Visual selection indicator (checkmark)
- ✅ Model descriptions
- ✅ Hover effects with slide animation
- ✅ Selected model info panel

## 2. Token Usage & Budget

### Visual Structure
```
┌─────────────────────────────────────┐
│ Token Usage & Budget                │
│ Monitor token consumption           │
├─────────────────────────────────────┤
│                                     │
│  Token Usage Meter                  │
│  ┌───────────────────────────────┐ │
│  │  2,500 / 10,000               │ │
│  │  [████████░░░░░░░░] 25%       │ │
│  │  [Chart visualization]        │ │
│  └───────────────────────────────┘ │
│                                     │
│  Budget Bar                         │
│  ┌───────────────────────────────┐ │
│  │ [██████████████░░░░░░] 70%    │ │ ← Warning
│  │ ⚠ Approaching limit           │ │
│  └───────────────────────────────┘ │
│                                     │
│     [Reset Budget]                  │
│                                     │
│  Usage Statistics                   │
│  ┌─────────┬─────────┬──────────┐ │
│  │ USAGE   │ REMAIN  │ EST COST │ │
│  │ 25.0%   │ 7,500   │ $0.0063  │ │
│  └─────────┴─────────┴──────────┘ │
└─────────────────────────────────────┘
```

### Features
- ✅ Real-time token counter
- ✅ Visual progress bar
- ✅ Chart visualization (when available)
- ✅ Warning thresholds (70% yellow, 90% red)
- ✅ Reset functionality
- ✅ Usage statistics grid
- ✅ Auto-incrementing simulation (+100 tokens every 5s)
- ✅ Cost estimation based on model

## 3. AI Status Indicator

### Visual Structure
```
┌─────────────────────────────────────┐
│ AI Status Indicator                 │
│ Visual feedback for AI states       │
├─────────────────────────────────────┤
│                                     │
│  Status Bar                         │
│  ┌───────────────────────────────┐ │
│  │ ⚙ Processing data...          │ │ ← Animated
│  │ [████████████░░░░░░] 60%      │ │
│  └───────────────────────────────┘ │
│                                     │
│  Current Status                     │
│  ┌───────────────────────────────┐ │
│  │ [Processing]                  │ │ ← Color coded
│  │ Processing data...            │ │
│  └───────────────────────────────┘ │
│                                     │
│  Available States                   │
│  ┌────┬────┬────┬────┬────┬────┐ │
│  │Idle│Think│Proc│Strm│Done│Err │ │
│  └────┴────┴────┴────┴────┴────┘ │
└─────────────────────────────────────┘
```

### Status Colors
```
Idle       → Gray    [    ]
Thinking   → Blue    [ 🤔 ]
Processing → Purple  [ ⚙ ]
Streaming  → Cyan    [ 📡 ]
Complete   → Green   [ ✓ ]
Error      → Red     [ ⚠ ]
```

### Features
- ✅ 6 distinct status states
- ✅ Auto-cycling demo (3 seconds per state)
- ✅ Progress bar for processing/streaming
- ✅ Status-specific messages
- ✅ Color-coded badges
- ✅ Status legend showing all states

## 4. Prompt Template Selector

### Visual Structure
```
┌─────────────────────────────────────┐
│ Prompt Template Selector            │
│ Pre-built prompt templates          │
├─────────────────────────────────────┤
│                                     │
│  [Search templates...]              │
│                                     │
│  Template Grid                      │
│  ┌───────┬───────┬───────┬───────┐ │
│  │ 🔍    │ 💡    │ 🐛    │ 🔌    │ │
│  │ Code  │Explain│Debug  │ API   │ │
│  │Review │Concept│Help   │Design │ │
│  └───────┴───────┴───────┴───────┘ │
│  ┌───────┐                         │
│  │ 📝    │                         │
│  │Summar │                         │
│  │ ize   │                         │
│  └───────┘                         │
│                                     │
│  Selected: Code Review              │
│  ┌───────────────────────────────┐ │
│  │ 🔍 Code Review                │ │
│  │ Review code for best practices│ │
│  │                               │ │
│  │ ```                           │ │
│  │ Review the following code:    │ │
│  │                               │ │
│  │ {{code}}                      │ │ ← Variables
│  │ ```                           │ │
│  │                               │ │
│  │ [code] [review]               │ │ ← Tags
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Templates
1. **🔍 Code Review** - Review code for best practices
2. **💡 Explain Concept** - Explain technical concepts simply
3. **🐛 Debug Help** - Get help debugging issues
4. **🔌 API Design** - Design RESTful APIs
5. **📝 Summarize** - Summarize long content

### Features
- ✅ 5 pre-built templates
- ✅ Grid layout with icons
- ✅ Search functionality
- ✅ Template preview on selection
- ✅ Variable placeholders ({{variable}})
- ✅ Tag-based categorization
- ✅ Code block formatting

## 5. Knowledge Base Viewer

### Visual Structure
```
┌─────────────────────────────────────────────────────────┐
│ Knowledge Base Viewer                                   │
│ Browse available knowledge sources for RAG              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Knowledge Sources Grid                                 │
│  ┌──────────────┬──────────────┬──────────────┐       │
│  │ 📚           │ 💻           │ ⭐           │       │
│  │ API Docs     │ Code Examples│ Best Practices│      │
│  │ Complete API │ Production   │ Industry best│       │
│  │ reference    │ code samples │ practices    │       │
│  │ 156 items    │ 89 items     │ 45 items     │       │
│  │ 2 hours ago  │ 1 day ago    │ 3 days ago   │       │
│  │ [View]       │ [View]       │ [View]       │       │
│  └──────────────┴──────────────┴──────────────┘       │
│  ┌──────────────┐                                      │
│  │ 🔧           │                                      │
│  │Troubleshoot  │                                      │
│  │ Common issues│                                      │
│  │ 67 items     │                                      │
│  │ 1 week ago   │                                      │
│  │ [View]       │                                      │
│  └──────────────┘                                      │
└─────────────────────────────────────────────────────────┘
```

### Knowledge Sources
1. **📚 API Documentation** - 156 items, Updated 2 hours ago
2. **💻 Code Examples** - 89 items, Updated 1 day ago
3. **⭐ Best Practices** - 45 items, Updated 3 days ago
4. **🔧 Troubleshooting** - 67 items, Updated 1 week ago

### Features
- ✅ Grid layout (auto-fill minmax pattern)
- ✅ Icon-based categorization
- ✅ Item count display
- ✅ Last updated timestamps
- ✅ Hover effects with elevation
- ✅ Action buttons
- ✅ Responsive grid (1-4 columns)

## 6. Coming Soon Features

### Visual Structure
```
┌─────────────────────────────────────────────────────────┐
│ Coming Soon                                             │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────┬─────────┬─────────┬─────────┐           │
│  │   👤    │   ⚙️    │   📊    │   🎯    │           │
│  │         │         │         │         │           │
│  │ Persona │   RAG   │  Model  │ Intent  │           │
│  │  Panel  │ Config  │Comparis │Classifi│           │
│  │         │  Panel  │   on    │   er   │           │
│  │         │         │         │         │           │
│  │Configure│Fine-tune│Side-by- │Classify│           │
│  │AI pers- │RAG set- │side mod-│user in-│           │
│  │onas...  │tings... │el perf..│tent... │           │
│  └─────────┴─────────┴─────────┴─────────┘           │
└─────────────────────────────────────────────────────────┘
```

### Planned Features
1. **👤 PersonaPanel** - Configure AI personas with custom behaviors and avatars
2. **⚙️ RAGConfigPanel** - Fine-tune RAG settings for optimal retrieval
3. **📊 ModelComparison** - Side-by-side model performance comparison
4. **🎯 IntentClassifier** - Classify user intent with confidence scores

## Design System

### Color Palette
```
Primary:    hsl(var(--primary))       # Brand color
Accent:     hsl(var(--accent))        # Highlight color
Foreground: hsl(var(--foreground))    # Main text
Muted:      hsl(var(--muted))         # Secondary text
Border:     hsl(var(--border))        # Borders

Status Colors:
Idle:       #808080  (Gray)
Thinking:   #3B82F6  (Blue)
Processing: #8B5CF6  (Purple)
Streaming:  #0EA5E9  (Cyan)
Complete:   #10B981  (Green)
Error:      #EF4444  (Red)
```

### Typography
```
Headers:     2.5rem / 700 weight
Subtitles:   1.125rem / 400 weight
Section:     1.5rem / 600 weight
Body:        1rem / 400 weight
Small:       0.875rem / 400 weight
Tiny:        0.75rem / 400 weight
```

### Spacing
```
Section Gap:    2rem
Card Padding:   2rem
Grid Gap:       1.5rem
Element Gap:    1rem
Compact Gap:    0.5rem
```

### Border Radius
```
Cards:      16px
Buttons:    8px
Badges:     6px
Inner:      12px
```

### Glassmorphism Effect
```css
background: rgba(255, 255, 255, 0.05);
backdrop-filter: blur(10px);
border: 1px solid rgba(255, 255, 255, 0.1);
box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.1);
```

## Responsive Breakpoints

### Mobile (< 640px)
```
┌─────────────┐
│   Section   │
│   (Full)    │
├─────────────┤
│   Section   │
│   (Full)    │
├─────────────┤
│   Section   │
│   (Full)    │
└─────────────┘
```

### Tablet (640px - 768px)
```
┌───────────┬───────────┐
│ Section 1 │ Section 2 │
├───────────┴───────────┤
│     Section 3         │
├───────────┬───────────┤
│ Section 4 │ Section 5 │
└───────────┴───────────┘
```

### Desktop (> 768px)
```
┌────────────┬────────────┐
│ Section 1  │ Section 2  │
├────────────┼────────────┤
│ Section 3  │ Section 4  │
├────────────┴────────────┤
│      Section 5          │
├─────────────────────────┤
│      Section 6          │
└─────────────────────────┘
```

## Interaction States

### Buttons
```
Normal:  rgba(255, 255, 255, 0.1)
Hover:   rgba(255, 255, 255, 0.15)  + translateY(-1px)
Active:  translateY(0)
```

### Cards
```
Normal:  border: rgba(255, 255, 255, 0.1)
Hover:   border: rgba(255, 255, 255, 0.2)  + translateY(-2px)
         shadow: 0 12px 48px rgba(0, 0, 0, 0.15)
```

### Model Options
```
Normal:    border: rgba(255, 255, 255, 0.1)
Hover:     border: rgba(255, 255, 255, 0.2)  + translateX(4px)
Selected:  background: rgba(primary, 0.15)
           border: hsl(var(--primary))
```

## Animation Timing

```
Fast:     0.15s ease
Normal:   0.2s ease
Slow:     0.3s ease
Smooth:   0.3s cubic-bezier(0.4, 0, 0.2, 1)
```

## Accessibility Features

### ARIA Labels
```html
<button aria-label="Select GPT-4o model">
<div role="status" aria-live="polite">
<div aria-label="Token usage: 25%">
```

### Keyboard Navigation
- Tab: Navigate through interactive elements
- Enter: Activate selected element
- Escape: Close modals/dropdowns
- Arrow keys: Navigate within lists

### Focus Indicators
```css
.element:focus-visible {
  outline: 2px solid hsl(var(--primary));
  outline-offset: 2px;
}
```

### Color Contrast
- All text meets WCAG 2.1 AA standards (4.5:1 minimum)
- Interactive elements have 3:1 contrast
- Status badges use sufficient color differentiation

---

This visual guide provides a comprehensive overview of all AI features and their design patterns. Use it as a reference when implementing or customizing components.
