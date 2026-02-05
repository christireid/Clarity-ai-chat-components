# PromptSuggestions Demo - Quick Start Guide

## 🚀 Getting Started

### Run the Demo
```bash
cd apps/examples/examples-showcase
pnpm dev
```

Navigate to **Prompt Suggestions** in the top navigation.

---

## 🎨 What You'll See

### 1. Interactive Controls Panel
**Layout Options:**
- **Chips**: Compact pill-shaped buttons
- **Cards**: Rich cards with icons and descriptions (default)
- **List**: Vertical stacked items

**Context Simulation:**
- **General**: Default suggestions
- **Code**: Development-focused prompts
- **Learn**: Educational suggestions
- **Debug**: Problem-solving prompts

**Category Toggle:**
- Show/hide category filters

### 2. Starter Prompts Section
**12 Suggestions Across 4 Categories:**

**Getting Started (3)**
- 🚀 Quick Start Guide (245 uses)
- ✨ Basic Example (189 uses)
- 🎯 Feature Overview (167 uses)

**Development (3)**
- 💻 Auth Implementation (312 uses)
- ⚡ Code Optimization (278 uses)
- ⚙️ Error Resolution (203 uses)

**Learning (3)**
- 📖 Concept Explanation (156 uses)
- 💡 Best Practices (134 uses)
- 📊 Comparison Analysis (98 uses)

**Analysis (3)**
- 📄 Document Summary (201 uses)
- 🧠 Sentiment Analysis (145 uses)
- 🔍 Pattern Recognition (112 uses)

### 3. Live Chat Simulation
Click any suggestion to:
1. Insert prompt into input field
2. Send as user message
3. Receive simulated AI response
4. Generate context-aware follow-ups

### 4. Context-Aware Follow-Ups
After sending a message, see intelligent follow-ups:

**Code Context** → Get:
- Detailed code explanations
- Testing suggestions
- Edge case analysis

**Learning Context** → Get:
- Practical examples
- Common pitfalls
- Alternative approaches

**Debug Context** → Get:
- Root cause analysis
- Prevention tips
- Better patterns

Each follow-up shows **confidence percentage** (60-92%)

### 5. Quick Reply Buttons
Fast action chips appear:
- ✅ Approve
- 🪄 Modify
- 🚀 Try Again
- ❓ Need More

### 6. Feature Highlights
Four glassmorphic cards showcase:
- 🧠 Context-Aware suggestions
- 🎯 Category-Based organization
- ⚡ Quick Actions insertion
- ✨ Smart Scoring ranking

---

## 🎯 Try These Actions

### Basic Exploration
1. **View all categories**: Leave "All" selected
2. **Filter by category**: Click a specific category button
3. **Switch layouts**: Toggle between chips, cards, and list

### Interactive Features
1. **Select a prompt**: Click any suggestion card
2. **Watch animations**: Notice smooth entrance and transitions
3. **See follow-ups**: Context-aware suggestions appear automatically
4. **Try quick replies**: Use fast action buttons

### Advanced Testing
1. **Simulate contexts**:
   - Select "Code" → Send message → See code-related follow-ups
   - Select "Learn" → Send message → See educational follow-ups
   - Select "Debug" → Send message → See debugging follow-ups

2. **Layout comparison**:
   - Cards: Best for desktop, rich information
   - Chips: Best for mobile, compact
   - List: Best for accessibility, keyboard navigation

3. **Category filtering**:
   - Toggle "Show Categories" checkbox
   - Filter by specific category
   - Notice filtered suggestion count

---

## 🎨 Design Features

### Glassmorphism
- Frosted glass cards: `backdrop-blur-xl`
- Layered gradients: `from-card/40 to-card/20`
- Soft borders: `border-border/50`
- Hover enhancements: `border-primary/50`

### Animations
- **Staggered entrance**: 50ms delay between cards
- **Spring physics**: Natural, organic motion
- **Hover effects**: Scale 1.05 + rotate 3deg
- **Message transitions**: Slide in from sides

### Colors
- **Gradient title**: Purple → Blue → Pink
- **Primary accent**: Dynamic theme colors
- **Confidence badges**: Secondary variant
- **Category buttons**: Outline/filled variants

---

## 💡 Key Concepts

### Context Awareness
The demo analyzes message content for keywords:
- "code", "function" → Code suggestions
- "explain", "how" → Learning suggestions
- "error", "fix" → Debug suggestions

### Confidence Scoring
Each follow-up suggestion includes a confidence percentage:
- **90-95%**: Highly relevant
- **80-89%**: Very relevant
- **70-79%**: Moderately relevant
- **60-69%**: Somewhat relevant

### Usage Statistics
Starter prompts show popularity:
- **300+ uses**: Very popular
- **200-299**: Popular
- **100-199**: Common
- **<100**: Niche

---

## 🔧 Technical Details

### Component Used
```tsx
<PromptSuggestions
  suggestions={prompts}
  onSelect={handlePromptSelect}
  suggestionType="starter" | "follow-up" | "quick-reply"
  layout="chips" | "cards" | "list"
  showCategories={true}
  maxSuggestions={9}
/>
```

### Suggestion Structure
```typescript
{
  id: string
  text: string              // Full prompt text
  label?: string           // Display label
  description?: string     // Helper text
  icon?: ReactNode        // Visual icon
  category?: string       // Category name
  type: PromptSuggestionType
  confidence?: number     // 0-1 score
  keywords?: string[]     // Context matching
  usageCount?: number     // Popularity
}
```

---

## 📱 Responsive Design

### Mobile (< 768px)
- Single column layout
- Compact chips by default
- Touch-friendly buttons
- Scrollable message area

### Tablet (768px - 1024px)
- Two column card grid
- Larger touch targets
- Optimized spacing

### Desktop (> 1024px)
- Three column card grid
- Rich information display
- Hover interactions
- Keyboard shortcuts

---

## ♿ Accessibility

### Keyboard Navigation
- **Tab**: Move between suggestions
- **Enter/Space**: Select suggestion
- **Escape**: Clear selection
- **Arrow Keys**: Navigate lists

### Screen Readers
- ARIA labels on all buttons
- Descriptive button text
- Status announcements
- Focus indicators

### Motion
- Respects `prefers-reduced-motion`
- Disables animations when requested
- Maintains functionality without animations

---

## 🐛 Troubleshooting

### Suggestions Not Appearing
- Check if category filter is active
- Verify suggestion type matches
- Ensure maxSuggestions is not 0

### Animations Stuttering
- Check browser hardware acceleration
- Reduce active animations
- Enable reduced motion in settings

### Context Not Detecting
- Send message with clear keywords
- Try different context simulations
- Check console for errors

---

## 📚 Learn More

### Documentation
- [Full Implementation Guide](./PROMPT_SUGGESTIONS_IMPLEMENTATION.md)
- [Component API](../../../packages/react/src/components/prompt/PromptSuggestions.tsx)
- [Storybook Examples](../../../apps/storybook/stories/Advanced/AI/PromptSuggestions.stories.tsx)

### Examples
- Starter prompts showcase
- Follow-up suggestions demo
- Quick reply integration
- Category-based filtering

---

## 🎉 Enjoy the Demo!

This demonstration showcases the full power of the PromptSuggestions component with:
- ✨ Beautiful glassmorphic design
- 🎯 Intelligent context awareness
- ⚡ Smooth, natural animations
- 🎨 Multiple layout options
- ♿ Full accessibility support

**Have fun exploring!** 🚀
