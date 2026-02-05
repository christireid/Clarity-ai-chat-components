# PromptSuggestions Interactive Demo

This demo showcases the comprehensive capabilities of the `PromptSuggestions` component with engaging, functional demonstrations.

## Features Demonstrated

### 1. Context-Aware Suggestions
- **Dynamic Prompt Generation**: Suggestions adapt based on conversation history
- **Confidence Scoring**: Each follow-up shows confidence percentage (60-92%)
- **Keyword Matching**: Context-aware suggestions based on message content
- **Smart Filtering**: Automatically filters suggestions by conversation context

### 2. Category-Based Organization
- **Four Main Categories**:
  - **Getting Started**: Quick start guides and feature overviews (245+ uses)
  - **Development**: Code implementation, optimization, debugging (312+ uses)
  - **Learning**: Explanations, best practices, comparisons (156+ uses)
  - **Analysis**: Document summaries, sentiment analysis, patterns (201+ uses)
- **Filterable Interface**: Click category buttons to filter suggestions
- **Usage Statistics**: Shows popularity with usage count badges

### 3. Interactive Prompt Insertion
- **One-Click Selection**: Click any suggestion to insert into chat input
- **Immediate Feedback**: Selected prompts appear in the input field
- **Auto-Send Option**: Suggestions automatically trigger conversation
- **Smooth Transitions**: Animated message appearance and response

### 4. Glassmorphism Design
- **Frosted Glass Cards**: `backdrop-blur-xl` with gradient backgrounds
- **Layered Transparency**: `from-card/40 to-card/20` gradient layers
- **Border Styling**: Soft `border-border/50` for subtle edges
- **Hover Effects**: Enhanced glassmorphism with `border-primary/50` on hover

### 5. Smooth Animations
- **Staggered Entrance**: Cards animate in sequence with 50ms delays
- **Spring Physics**: Natural motion using Framer Motion spring animations
- **Hover Interactions**: Scale (1.05) and rotation (3deg) on icon hover
- **Fade Transitions**: Smooth opacity changes with AnimatePresence
- **Transform Effects**: Translate Y (-4px) and scale on card hover

## Layout Options

### Chips Layout
- Compact pill-shaped buttons
- Perfect for quick selections
- Minimal vertical space
- Ideal for mobile devices

### Cards Layout (Default)
- Rich information display
- Icons + labels + descriptions
- Confidence badges
- Best for desktop experiences

### List Layout
- Vertical stacked items
- Detailed descriptions
- Easy keyboard navigation
- Accessible design

## Usage Example

```tsx
import { PromptSuggestions } from '@clarity-chat/react'
import { SparklesIcon } from 'lucide-react'

const prompts = [
  {
    id: '1',
    text: 'Help me get started',
    label: 'Quick Start',
    description: 'Begin your journey',
    type: 'starter',
    icon: <SparklesIcon className="w-4 h-4" />,
    category: 'Getting Started',
    usageCount: 245
  }
]

function MyChat() {
  return (
    <PromptSuggestions
      suggestions={prompts}
      onSelect={(suggestion) => {
        console.log('Selected:', suggestion.text)
      }}
      layout="cards"
      showCategories
    />
  )
}
```

## Running the Demo

1. Navigate to the showcase app:
   ```bash
   cd apps/examples/examples-showcase
   ```

2. Start the dev server:
   ```bash
   pnpm dev
   ```

3. Open in browser and click "Prompt Suggestions" in the navigation

## Key Features

- Context-aware prompt suggestions
- Category-based organization
- Interactive prompt insertion
- Glassmorphism design
- Smooth animations
- Full accessibility support
- Mobile responsive
