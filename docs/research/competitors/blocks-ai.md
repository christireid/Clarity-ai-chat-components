# Blocks.so AI - Competitive Analysis

## Configuration System Research

**Research Date:** 2026-01-27 **URL:** https://blocks.so/ai **Focus:** Configuration options,
composition patterns, and customization approaches

---

## Executive Summary

Blocks.so provides 4 free AI chat component blocks that demonstrate a **copy-paste,
composition-based approach** to configuration. Rather than providing a complex configuration API,
they offer discrete component variants with progressively disclosed features through UI controls
(dropdowns, toggles, menus).

**Key Insight:** Configuration happens through **component selection + UI-based feature toggles**
rather than programmatic configuration objects.

---

## Component Catalog

### ai-01: AI Chat with Voice Input

- **Core Feature:** Voice input integration
- **UI Pattern:** Expandable textarea with dropdown menus
- **Use Case:** Voice-first conversational AI

### ai-02: AI Chat with Model Selection

- **Core Feature:** Multi-model support
- **Configuration:** Model picker with performance settings
- **Models Supported:** GPT-5, GPT-4o, GPT-4, Claude 3.5 Sonnet
- **UI Indicator:** "MAX" badge for premium models

### ai-03: AI Chat Compact Interface

- **Core Feature:** Minimal footprint design
- **Configuration:** Multi-dropdown controls for:
  - Agent vs Assistant mode toggle
  - Performance levels (High/Medium/Low)
  - Compute source (Local/Cloud)
- **Use Case:** Space-constrained interfaces

### ai-04: AI Chat with File Attachments

- **Core Feature:** Advanced file handling
- **Configuration:** Settings toggles for:
  - Auto-complete
  - Streaming mode
  - Chat history display
- **File Support:** Drag-and-drop with image preview
- **UI Controls:** Attachment badges with removal buttons

---

## Configuration Architecture

### 1. Configuration Levels

#### Level 1: Component Selection

**Pattern:** Choose the pre-built block matching your primary feature need

- Need voice? → Use ai-01
- Need multi-model? → Use ai-02
- Need compact UI? → Use ai-03
- Need file uploads? → Use ai-04

#### Level 2: UI-Based Feature Toggles

**Pattern:** Runtime configuration through interactive controls

- Dropdown menus expose mode options (Agent/Assistant, Local/Cloud)
- Toggle switches enable/disable features (auto-complete, streaming, history)
- Select dropdowns switch between variants (models, performance levels)

#### Level 3: Code Customization

**Pattern:** Direct modification of copied code

- Edit Tailwind CSS classes for styling
- Modify shadcn/ui component props
- Adjust icon selections from Tabler icon set
- Configure callbacks (onSubmit, onChange)

### 2. Configuration Options (Exhaustive List)

#### Model Configuration

- **Model Selection:** GPT-5, GPT-4o, GPT-4, Claude 3.5 Sonnet
- **Model Tier Indicator:** "MAX" badge for premium models
- **Default:** Not specified (likely GPT-4o)

#### Compute Configuration

- **Source:** Local vs Cloud execution
- **Performance Levels:**
  - High performance
  - Medium performance
  - Low performance
- **Default:** Inferred as "Local" with medium performance

#### Interface Modes

- **Agent Mode:** Agent vs Assistant selection
- **Deep Research Mode:** Available through dropdown
- **Code Interpreter:** Available through dropdown
- **Web Search:** Available through dropdown
- **Default:** Standard assistant mode

#### Input Configuration

- **Text Input:** Expandable textarea with auto-resize
- **Voice Input:** Available in ai-01
- **File Upload:** Available in ai-04
  - Drag-and-drop support
  - Image preview generation
  - File removal functionality
- **Placeholder Text:** Customizable
- **Default:** Text-only input

#### Output Configuration

- **Streaming Mode:** Boolean toggle (on/off)
- **Chat History Display:** Boolean toggle (show/hide)
- **Auto-complete:** Boolean toggle (enabled/disabled)
- **Default:** All disabled for minimal UI

#### Visual Configuration

- **Layout:** Compact vs Expanded states
- **Theme Support:** Light and dark modes via Tailwind classes
- **Icons:** Tabler icon substitution
- **Responsive Design:** Grid layouts adapt to container size
- **Dynamic Styling:** `cn()` utility for conditional classes

---

## Composition System

### Composition Philosophy

**Principle:** Pre-composed blocks rather than atomic composition

Unlike systems that provide primitives for composition (atoms → molecules → organisms), Blocks.so
provides **complete organism-level components** that users copy and customize.

### Composition Hierarchy

```
Block (Complete Component)
├── shadcn/ui Primitives
│   ├── Button
│   ├── Textarea
│   ├── Dropdown Menu
│   ├── Select
│   ├── Badge
│   ├── Switch
│   └── Label
├── Layout Structure
│   ├── Input Layer (textarea, file input, drag-drop zone)
│   ├── Control Panel (dropdowns, toggles)
│   └── Action Buttons (submit, attach, settings)
└── Feature Logic
    ├── State management
    ├── Event handlers
    └── UI interactions
```

### No Runtime Composition

- Blocks are **standalone units**
- No documented slot system
- No provider/context-based composition
- No programmatic component assembly

### Customization = Fork and Modify

Users compose by:

1. Copying the block code
2. Modifying the copied code directly
3. Replacing shadcn/ui components if needed
4. Adjusting Tailwind classes for styling

---

## Prebuilt vs Composable Patterns

### Prebuilt Templates (What They Offer)

**4 Complete AI Chat Blocks:**

- Each is a self-contained, robust component
- Include all HTML, React, TypeScript, and styling
- No assembly required

**Implementation Model:**

```typescript
// Blocks.so approach: Copy entire component
import { AIChatWithModelSelection } from '@/components/ai-02'

<AIChatWithModelSelection
  onSubmit={handleSubmit}
  value={input}
  onChange={setInput}
/>
```

### Composable Patterns (What They Don't Offer)

**No Atomic Building Blocks:**

```typescript
// NOT the Blocks.so approach:
<AIChat>
  <AIChat.Input>
    <ModelSelector models={['gpt-4', 'claude']} />
    <VoiceInput />
  </AIChat.Input>
  <AIChat.Messages />
  <AIChat.PerformanceToggle />
</AIChat>
```

**Key Difference:** Blocks.so optimizes for **speed of implementation** (copy-paste) over
**flexibility of composition** (programmatic assembly).

---

## User Customization Patterns

### Pattern 1: Progressive Disclosure

**How it works:** Hide advanced features behind dropdown menus

```
[Simple Interface] → Click Dropdown → [Advanced Options Revealed]
```

**Benefits:**

- Maintains clean UI for basic use cases
- Prevents overwhelming users with options
- Easy discoverability of advanced features

**Implementation:**

- Dropdown menus trigger visibility of additional controls
- Feature toggles show/hide related UI elements
- Settings panels collapse/expand on demand

### Pattern 2: Boolean Feature Toggles

**How it works:** Switch components for specific features

```typescript
// ai-04 pattern
<Switch checked={autoComplete} onCheckedChange={setAutoComplete} />
<Switch checked={streaming} onCheckedChange={setStreaming} />
<Switch checked={showHistory} onCheckedChange={setShowHistory} />
```

**Benefits:**

- Clear on/off states
- Easy to understand
- No complex configuration objects

### Pattern 3: Variant Selection

**How it works:** Dropdown selects between predefined variants

```typescript
// Model selection dropdown
<Select value={model} onValueChange={setModel}>
  <SelectItem value="gpt-5">GPT-5</SelectItem>
  <SelectItem value="gpt-4o">GPT-4o</SelectItem>
  <SelectItem value="gpt-4">GPT-4</SelectItem>
  <SelectItem value="claude-3.5">Claude 3.5 Sonnet</SelectItem>
</Select>
```

**Benefits:**

- Guided choices (no invalid configurations)
- Visual selection interface
- Easy to extend with new variants

### Pattern 4: Direct Code Modification

**How it works:** Users edit the copied component code

```typescript
// Users can modify:
- Placeholder text
- Button labels
- Icon selections
- Tailwind classes
- Component structure
- Event handlers
```

**Benefits:**

- Ultimate flexibility
- No API limitations
- Full control over implementation

**Drawbacks:**

- Maintenance burden (no upstream updates)
- Requires understanding component internals
- Can lead to fragmentation

---

## Mix-and-Match Capabilities

### Current Capabilities

**Within a Single Block:**

- Can combine multiple feature toggles
- Can switch between models/modes
- Can enable multiple input types (text + voice OR text + files)

**Example Combinations (ai-04):**

```
Configuration A: Auto-complete ON + Streaming ON + History OFF
Configuration B: Auto-complete OFF + Streaming ON + History ON
Configuration C: All features OFF (minimal UI)
```

### Limitations

**Cannot Mix Across Blocks:**

- Cannot combine voice input (ai-01) + file attachments (ai-04)
- Cannot merge model selection (ai-02) + compact UI (ai-03)
- Each block is isolated

**To Mix Features, Users Must:**

1. Choose the closest block
2. Copy code from another block
3. Manually integrate the features
4. Test the merged implementation

---

## Configuration Management

### No Configuration API

Blocks.so does **not** provide:

- Configuration objects
- Props-based configuration
- JSON/YAML configuration files
- Configuration presets or themes
- Configuration inheritance

### Runtime State Management

Configuration is **React state**:

```typescript
const [model, setModel] = useState('gpt-4o')
const [performance, setPerformance] = useState('medium')
const [agentMode, setAgentMode] = useState(false)
const [streaming, setStreaming] = useState(false)
```

### No Persistence Layer

- No built-in configuration saving
- No user preference storage
- Users must implement their own persistence

---

## Visual Configuration Examples

### ai-02: Model Selection Interface

```
┌─────────────────────────────────────────┐
│ Select Model: [GPT-4o ▼] [MAX]         │
├─────────────────────────────────────────┤
│                                         │
│ [Type your message here...            ] │
│                                         │
└─────────────────────────────────────────┘
```

### ai-03: Compact Multi-Control

```
┌──────────────────────────────────────────┐
│ Mode: [Agent ▼] Performance: [High ▼]   │
│ Compute: [Local ▼]                       │
├──────────────────────────────────────────┤
│ [Message input...                      ] │
└──────────────────────────────────────────┘
```

### ai-04: File Attachment with Toggles

```
┌──────────────────────────────────────────┐
│ Settings:                                │
│ [✓] Auto-complete                        │
│ [✓] Streaming                            │
│ [ ] Show history                         │
├──────────────────────────────────────────┤
│ Files: [image.png ✕] [doc.pdf ✕]        │
│ [Drag files here or click to upload]    │
├──────────────────────────────────────────┤
│ [Type message...                       ] │
└──────────────────────────────────────────┘
```

---

## Technical Implementation Details

### Stack Dependencies

- **UI Framework:** React with "use client" directive (Next.js optimized)
- **Component Library:** shadcn/ui (Radix UI primitives)
- **Styling:** Tailwind CSS with custom classes
- **Icons:** Tabler Icons
- **Type Safety:** TypeScript throughout

### Key Utilities

#### `cn()` Function

Merges conditional Tailwind classes:

```typescript
className={cn(
  "flex items-center gap-2",
  isCompact && "text-sm",
  isDisabled && "opacity-50 cursor-not-allowed"
)}
```

#### Dynamic Height Adjustment

Textarea auto-expands based on content:

```typescript
<textarea
  className="resize-none"
  rows={1}
  onInput={(e) => {
    e.currentTarget.style.height = 'auto'
    e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px'
  }}
/>
```

### Installation Pattern

**Copy-Paste, No npm install:**

```bash
# NOT their approach:
npm install @blocks/ai-chat

# Their approach:
# 1. Copy component code from website
# 2. Paste into your project
# 3. Ensure shadcn/ui dependencies exist
# 4. Customize as needed
```

---

## Complexity Management Strategy

### Progressive Disclosure Hierarchy

**Level 1: Default Simple UI**

- Textarea input
- Single submit button
- Minimal visual noise

**Level 2: Common Features (1 click away)**

- Model selection dropdown
- Mode toggles (Agent/Assistant)
- File attachment button

**Level 3: Advanced Options (2 clicks away)**

- Performance settings
- Compute source selection
- Feature toggles menu

### Preventing Configuration Overload

**Strategies Used:**

1. **Hide Until Needed:** Advanced options in collapsed menus
2. **Smart Defaults:** Components work well without configuration
3. **Visual Grouping:** Related options grouped in dropdowns
4. **Contextual Display:** Show options only when relevant
5. **Icon-Based Actions:** Common actions use icons instead of labels

### Comparison to Other Approaches

**Blocks.so Approach:**

- 4 discrete components with 5-8 configuration options each
- Total: ~25-30 configuration points across all AI blocks
- Configuration via UI controls, not props

**Alternative Complex Approach (e.g., ChatGPT API):**

- Single component with 50+ configuration props
- All options exposed in API
- Configuration via programmatic object

**Blocks.so Philosophy:** Better to have multiple simple components than one complex component with
endless configuration.

---

## Key Insights for Our Library

### 1. Configuration Philosophy

**Blocks.so teaches us:**

- Users prefer **selecting a close-match component** over **configuring a flexible one**
- Progressive disclosure prevents option paralysis
- UI-based configuration is more discoverable than API documentation

**Application to Clarity:**

```typescript
// Instead of one mega-component:
<AIChat
  voice={true}
  models={['gpt-4', 'claude']}
  fileUpload={true}
  performance="high"
  compact={false}
  streaming={true}
  // ... 50 more props
/>

// Consider discrete, focused components:
<AIChatWithVoice />
<AIChatWithModelSelection />
<AIChatWithFileUpload />
<AIChatCompact />
```

### 2. Prebuilt Templates Value

**Observation:** All 4 AI blocks are free and robust

**Lesson:** Users value **working examples** they can copy and customize over **flexible APIs** they
must learn and configure.

**Application:** Provide both:

- Atomic composable primitives (for advanced users)
- Prebuilt template compositions (for quick starts)

### 3. Feature Toggle Pattern

**Observation:** Boolean toggles for streaming, auto-complete, history

**Lesson:** Not everything needs to be a configuration prop. Some features should be user-controlled
UI elements.

**Application:**

```typescript
// Instead of prop-based:
<AIChat streaming={true} />

// Consider UI-controlled:
<AIChat>
  <StreamingToggle /> // User controls it
</AIChat>
```

### 4. Model Selection UX

**Observation:** Dropdown with visual "MAX" badge for premium models

**Lesson:** Configuration isn't just technical—it's a UX and business model concern.

**Application:** Consider how we surface:

- Model capabilities
- Cost implications
- Performance trade-offs
- Feature availability by tier

### 5. No Over-Abstraction

**Observation:** They don't try to create a universal AI chat component

**Lesson:** Better to have 4 specific solutions than 1 generic solution with 100 options.

**Application:** Don't force everything into a single component. Embrace specialization.

---

## Configuration System Comparison

### Blocks.so Configuration Pattern

```typescript
// Component selection IS configuration
import { AIChatCompact } from '@/components/ai-03'

function App() {
  const [mode, setMode] = useState<'agent' | 'assistant'>('assistant')
  const [performance, setPerformance] = useState<'high' | 'medium' | 'low'>('medium')

  return (
    <AIChatCompact
      mode={mode}
      performance={performance}
      onSubmit={handleSubmit}
    />
  )
}
```

**Characteristics:**

- Minimal API surface
- Most configuration through UI
- Pre-composed, not composable
- Copy-paste distribution

### Traditional Component Library Pattern

```typescript
// Configuration through props
import { AIChat } from '@clarity/react'

function App() {
  return (
    <AIChat
      features={{
        voice: false,
        fileUpload: false,
        modelSelection: true,
        streaming: true
      }}
      models={['gpt-4', 'claude-3.5']}
      performance="high"
      layout="compact"
      theme="dark"
    />
  )
}
```

**Characteristics:**

- Large API surface
- Programmatic configuration
- Single flexible component
- npm distribution

### Hybrid Approach (Recommended for Clarity)

```typescript
// Prebuilt compositions + atomic primitives
import { AIChatCompact } from '@clarity/react/prebuilt'
import { AIChat, ModelSelector, PerformanceToggle } from '@clarity/react'

// Option 1: Use prebuilt
<AIChatCompact defaultModel="gpt-4" />

// Option 2: Compose custom
<AIChat>
  <ModelSelector models={['gpt-4', 'claude']} />
  <PerformanceToggle />
  <AIChat.Input />
  <AIChat.Messages />
</AIChat>
```

**Characteristics:**

- Prebuilts for speed
- Primitives for flexibility
- Both copy-paste AND npm
- Best of both worlds

---

## Recommendations for Clarity

### 1. Create Prebuilt Compositions

Mirror Blocks.so's approach with ready-to-use variants:

- `<PromptWithTokenBudget />` - Token-optimized variant
- `<PromptWithModelSelection />` - Multi-model variant
- `<PromptCompact />` - Minimal UI variant
- `<PromptWithHistory />` - Conversation history variant

### 2. Implement Progressive Disclosure

Use dropdown menus and collapsible panels for advanced options:

```typescript
<Prompt>
  <Prompt.Input />
  <Prompt.AdvancedSettings>
    <TokenBudgetSlider />
    <OptimizationToggle />
    <CachingOptions />
  </Prompt.AdvancedSettings>
</Prompt>
```

### 3. Favor UI Controls Over Props

For user-facing options:

```typescript
// Instead of:
<Prompt tokenOptimization={true} />

// Consider:
<Prompt>
  <OptimizationToggle /> // User controls it
</Prompt>
```

### 4. Provide Visual Indicators

Use badges and icons to communicate:

- Feature availability (like "MAX" badge)
- Cost implications
- Performance levels
- Status indicators

### 5. Keep Configuration State Visible

Don't hide important settings in deep menus:

```typescript
// Good: One-click access to common settings
<Prompt>
  <ModelBadge /> // Shows current model
  <TokenMeter /> // Shows usage
  <OptimizationIndicator /> // Shows if enabled
</Prompt>
```

### 6. Embrace Specialization

Don't force all features into one component:

```typescript
// Good: Specialized components
<PromptWithStreaming />
<PromptWithTokenOptimization />
<PromptWithHistory />

// Bad: Mega-component
<Prompt
  streaming={true}
  tokenOptimization={true}
  history={true}
  // ... 50 more options
/>
```

---

## Conclusion

### Blocks.so's Core Philosophy

**"Discrete components over complex configuration"**

They solve the configuration complexity problem by:

1. Creating multiple specialized components
2. Limiting configuration options per component
3. Using UI controls instead of props
4. Providing complete, working examples
5. Embracing copy-paste over npm dependencies

### What This Means for Clarity

We should offer **both paradigms:**

**For rapid prototyping:** Blocks.so-style prebuilt compositions

- Ready to copy and use
- Minimal configuration needed
- Specialized for common use cases

**For production apps:** Component library-style composable primitives

- Maximum flexibility
- Programmatic control
- Composable building blocks

### The Hybrid Model

```
Prebuilt Templates (Speed)
    ↓
User copies and modifies
    ↓
Eventually needs more flexibility
    ↓
Migrates to composable primitives (Power)
```

This provides an **upgrade path** from quick-start to sophisticated implementation without forcing
users to choose one or the other upfront.

---

## Configuration Options Summary

### Complete List of All Configuration Points

**Model Configuration:**

- Model selection (GPT-5, GPT-4o, GPT-4, Claude 3.5 Sonnet)
- Model tier indicators (MAX badge)

**Compute Configuration:**

- Compute source (Local/Cloud)
- Performance level (High/Medium/Low)

**Interface Modes:**

- Agent vs Assistant mode
- Deep Research mode
- Code Interpreter mode
- Web Search mode

**Input Configuration:**

- Text input (always available)
- Voice input (ai-01)
- File upload (ai-04)
- Drag-and-drop support (ai-04)
- Placeholder text customization

**Output Configuration:**

- Streaming mode toggle
- Chat history display toggle
- Auto-complete toggle

**Visual Configuration:**

- Layout variant (Compact/Expanded)
- Theme (Light/Dark)
- Icon selection (Tabler icons)
- Responsive behavior

**Total Configuration Points:** ~20-25 discrete options across 4 components

**Average per Component:** 5-8 configuration options

**Configuration Method Distribution:**

- ~40% via dropdown menus
- ~30% via toggle switches
- ~20% via code modification
- ~10% via component selection

This manageable scope prevents configuration overload while still providing meaningful
customization.
