# FollowUpSuggestions Visual Context Guide

## Conversation Scenarios Visualization

This guide shows the different conversation contexts and their corresponding follow-up suggestions.

---

## 1. Getting Started Context

### Conversation
```
┌─────────────────────────────────────────────┐
│ 🤖 Assistant                                │
│ Hi! I'm your AI assistant.                  │
│ How can I help you today?                   │
└─────────────────────────────────────────────┘
```

### Follow-Up Suggestions (Chips Layout)
```
┌─────────────┐ ┌────────────┐ ┌─────────┐ ┌──────────┐
│ ℹ️  Features │ │ 💻 Code Help│ │ 📄 Analyze│ │ 🔍 Examples│
│  95%        │ │  90%       │ │  85%     │ │  80%       │
└─────────────┘ └────────────┘ └─────────┘ └──────────┘
```

**Categories**: Questions, Actions, Explore

---

## 2. Code Discussion Context

### Conversation
```
┌─────────────────────────────────────────────┐
│ 👤 User                                     │
│ How do I implement a binary search tree     │
│ in TypeScript?                              │
├─────────────────────────────────────────────┤
│ 🤖 Assistant                                │
│ Here's a TypeScript implementation of a     │
│ binary search tree with insert, search,     │
│ and delete operations...                    │
└─────────────────────────────────────────────┘
```

### Follow-Up Suggestions (Cards Layout)
```
┌───────────────────────────────┐ ┌───────────────────────────────┐
│ ℹ️  Time Complexity (95%)     │ │ 💻 Unit Tests (92%)           │
│ Analyze algorithm performance │ │ Generate test cases           │
└───────────────────────────────┘ └───────────────────────────────┘
┌───────────────────────────────┐ ┌───────────────────────────────┐
│ ⚡ Balance Tree (88%)         │ │ 🔍 Compare (85%)              │
│ Implement AVL or Red-Black    │ │ BST vs Hash Table vs Array    │
└───────────────────────────────┘ └───────────────────────────────┘
```

**Categories**: Understanding, Actions, Explore

---

## 3. Customer Support Context

### Conversation
```
┌─────────────────────────────────────────────┐
│ 👤 User                                     │
│ I'm having trouble with my order #12345     │
├─────────────────────────────────────────────┤
│ 🤖 Assistant                                │
│ I found your order. It appears to be in     │
│ transit and should arrive by tomorrow.      │
│ Would you like tracking details?            │
└─────────────────────────────────────────────┘
```

### Follow-Up Suggestions (Chips Layout - Quick Replies)
```
┌───────────────────┐ ┌──────────────────┐ ┌─────────────────┐
│ ✓ Track Order     │ │ ❓ Delivery Issues│ │ 📍 Change Address│
│   98%             │ │   85%            │ │   80%            │
└───────────────────┘ └──────────────────┘ └─────────────────┘
┌───────────────────┐
│ 👤 Human Support  │
│   75%             │
└───────────────────┘
```

**Categories**: Quick Reply, Questions, Actions, Escalate

---

## 4. Research Assistant Context

### Conversation
```
┌─────────────────────────────────────────────┐
│ 👤 User                                     │
│ Tell me about the impact of AI on           │
│ healthcare                                  │
├─────────────────────────────────────────────┤
│ 🤖 Assistant                                │
│ AI is transforming healthcare in multiple   │
│ ways: diagnostic imaging, drug discovery,   │
│ personalized treatment, and administrative  │
│ efficiency...                               │
└─────────────────────────────────────────────┘
```

### Follow-Up Suggestions (List Layout)
```
┌─────────────────────────────────────────────────┐
│ 🔍 Diagnostics (90%)                            │
│    Radiology, pathology, and more               │
├─────────────────────────────────────────────────┤
│ ❓ Ethics (88%)                                 │
│    Privacy, bias, and accountability            │
├─────────────────────────────────────────────────┤
│ 📄 Papers (85%)                                 │
│    Latest academic publications                 │
├─────────────────────────────────────────────────┤
│ 🌍 International (82%)                          │
│    Global AI adoption in medicine               │
├─────────────────────────────────────────────────┤
│ 📝 Summarize (80%)                              │
│    Generate structured overview                 │
└─────────────────────────────────────────────────┘
```

**Categories**: Deep Dive, Questions, Sources, Explore, Actions

---

## 5. Creative Writing Context

### Conversation
```
┌─────────────────────────────────────────────┐
│ 👤 User                                     │
│ Help me write a sci-fi short story about    │
│ time travel                                 │
├─────────────────────────────────────────────┤
│ 🤖 Assistant                                │
│ Here's an opening scene: Dr. Sarah Chen     │
│ stood before the temporal displacement      │
│ device, her hands trembling as she          │
│ initialized the countdown...                │
└─────────────────────────────────────────────┘
```

### Follow-Up Suggestions (Cards Layout)
```
┌───────────────────────────────┐ ┌───────────────────────────────┐
│ ▶️  Continue (95%)            │ │ 👥 Develop Characters (90%)   │
│ Generate next paragraphs      │ │ Enrich personalities          │
└───────────────────────────────┘ └───────────────────────────────┘
┌───────────────────────────────┐ ┌───────────────────────────────┐
│ 🔄 Plot Twists (88%)          │ │ 🎭 Build Tension (85%)        │
│ Add unexpected turns          │ │ Increase dramatic tension     │
└───────────────────────────────┘ └───────────────────────────────┘
```

**Categories**: Actions, Enhance, Feedback

---

## Layout Variations

### Chips Layout (Compact)
```
Best for: Quick actions, mobile interfaces

┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
│ 📝 A │ │ 💡 B │ │ 🔍 C │ │ ⚡ D │ │ 📊 E │
└──────┘ └──────┘ └──────┘ └──────┘ └──────┘

Features:
• Minimal vertical space
• Glassmorphism hover effects
• Confidence badges
• Gradient on hover
```

### Cards Layout (Detailed)
```
Best for: Complex options, desktop interfaces

┌─────────────────────┐  ┌─────────────────────┐
│ 📝 Suggestion A     │  │ 💡 Suggestion B     │
│ Detailed description│  │ Detailed description│
│ for this option     │  │ for this option     │
│                 95% │  │                 88% │
└─────────────────────┘  └─────────────────────┘

Features:
• Large touch targets
• Icon indicators
• Gradient overlays
• Arrow animations
```

### List Layout (Vertical)
```
Best for: Many options, keyboard navigation

┌──────────────────────────────────┐
│ 📝 Suggestion A                  │
│    Detailed description here     │
├──────────────────────────────────┤
│ 💡 Suggestion B                  │
│    Detailed description here     │
├──────────────────────────────────┤
│ 🔍 Suggestion C                  │
│    Detailed description here     │
└──────────────────────────────────┘

Features:
• Text-focused
• Keyboard friendly
• Subtle hover states
• Minimal animations
```

---

## Animation Flow

### Entrance Animation (Staggered)
```
Time: 0ms        50ms       100ms      150ms      200ms
       ↓          ↓          ↓          ↓          ↓
     [Chip 1]  [Chip 2]  [Chip 3]  [Chip 4]  [Chip 5]
       ↑          ↑          ↑          ↑          ↑
     Fade      Fade       Fade       Fade       Fade
     Slide     Slide      Slide      Slide      Slide
     Spring    Spring     Spring     Spring     Spring
```

### Hover Interaction
```
Normal State:
┌─────────────────┐
│  Suggestion     │  opacity: 1
│                 │  y: 0
└─────────────────┘  scale: 1
                     shadow: sm

Hover State:
┌─────────────────┐
│  Suggestion     │  opacity: 1
│                 │  y: -2px
└─────────────────┘  scale: 1.02
    ╱╲╱╲╱╲╱╲        shadow: enhanced
   Shadow Glow       gradient: active
```

### Selection Feedback
```
1. Click
   ↓
2. Scale down (0.98)
   ↓
3. Success modal appears
   ┌──────────────────┐
   │  ✓  Selected:    │
   │  "Suggestion"    │
   └──────────────────┘
   ↓
4. Fade out after 2s
   ↓
5. Return to normal
```

---

## Confidence Scoring Visual

### Confidence Levels
```
95%+ ━━━━━━━━━━ Highly Relevant (Green)
     "This is exactly what the user needs"

85-94% ━━━━━━━━  Very Relevant (Blue)
       "Strong match to user intent"

75-84% ━━━━━━   Relevant (Yellow)
       "Good option for the context"

65-74% ━━━━     Possibly Relevant (Orange)
       "May be helpful"

<65%  ━━       Low Relevance (Red)
      "Tangentially related"
```

### Confidence Slider
```
│←─────────────────────────────────────────→│
50%            75%            100%

Red Zone     Yellow Zone    Green Zone
(Uncertain)  (Relevant)     (Confident)
```

---

## Category Organization

### By Type
```
Questions (?) → Understanding & Clarification
├─ Explain more
├─ What are best practices?
└─ Compare options

Actions (⚡) → Direct Actions & Commands
├─ Show example
├─ Add tests
└─ Optimize

Explore (🔍) → Discovery & Learning
├─ Related topics
├─ Deep dive
└─ Show papers

Quick Reply (✓) → Immediate Responses
├─ Yes/No
├─ Confirm/Cancel
└─ Track/Update
```

---

## Glassmorphism Effect Breakdown

### Visual Layers
```
Layer 4: Content (text, icons)
         ↑
Layer 3: Inset highlight (top edge)
         ↑
Layer 2: Border (subtle, translucent)
         ↑
Layer 1: Background gradient + blur
         ↑
Layer 0: Page background
```

### CSS Effect
```css
/* Base layer */
background: linear-gradient(
  135deg,
  hsl(var(--card) / 0.9) 0%,
  hsl(var(--card) / 0.7) 100%
);

/* Blur effect */
backdrop-filter: blur(10px);

/* Border glow */
border: 1px solid hsl(var(--border) / 0.3);

/* Shadow depth */
box-shadow:
  0 4px 24px -4px hsl(var(--foreground) / 0.08),
  inset 0 1px 0 0 hsl(var(--foreground) / 0.05);
```

---

## Interactive States

### State Diagram
```
         ┌─────────┐
         │ LOADING │
         └────┬────┘
              │
         ┌────▼────┐
    ┌────┤  IDLE   ├────┐
    │    └─────────┘    │
    │                   │
┌───▼───┐           ┌───▼────┐
│ HOVER │           │SELECTED│
└───┬───┘           └───┬────┘
    │                   │
    └───────┬───────────┘
            │
        ┌───▼────┐
        │FEEDBACK│
        └───┬────┘
            │
        ┌───▼───┐
        │ IDLE  │
        └───────┘
```

---

## Responsive Behavior

### Desktop (>1024px)
```
┌────────────────────────────────────────┐
│  [Chip] [Chip] [Chip] [Chip] [Chip]   │
│  [Chip] [Chip] [Chip]                  │
└────────────────────────────────────────┘
```

### Tablet (768-1023px)
```
┌──────────────────────────┐
│  [Chip] [Chip] [Chip]    │
│  [Chip] [Chip]           │
└──────────────────────────┘
```

### Mobile (<767px)
```
┌─────────────┐
│   [Chip]    │
│   [Chip]    │
│   [Chip]    │
└─────────────┘
```

---

## Best Practices Checklist

✅ **Content**
- [ ] Suggestions are contextually relevant
- [ ] Labels are concise (1-3 words)
- [ ] Descriptions are helpful (8-15 words)
- [ ] Icons match the action type

✅ **Interaction**
- [ ] Hover states are clear
- [ ] Click feedback is immediate
- [ ] Keyboard navigation works
- [ ] Touch targets are large enough (44px min)

✅ **Performance**
- [ ] Animations are smooth (60fps)
- [ ] Load time is fast (<100ms)
- [ ] No layout shift occurs
- [ ] Memory usage is efficient

✅ **Accessibility**
- [ ] ARIA labels are present
- [ ] Color contrast meets WCAG AA
- [ ] Focus indicators are visible
- [ ] Screen reader compatible

---

**Visual Guide Version**: 1.0
**Last Updated**: 2026-02-04
**Related**: FOLLOWUP_SUGGESTIONS_SHOWCASE.md
