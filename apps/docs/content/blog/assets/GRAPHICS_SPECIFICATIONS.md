# Blog Graphics Specifications

This document outlines the visual assets needed for each blog post. All graphics should follow Clarity Chat's brand guidelines and be optimized for both light and dark mode.

---

## General Guidelines

### Style
- Clean, minimal aesthetic
- Use brand colors (primary blue: #3B82F6, secondary: system grays)
- Sans-serif fonts (Inter or system fonts)
- Consistent line weights and spacing
- Export at 2x for retina displays

### Formats
- Hero images: 1200x630px (OG image compatible)
- Inline graphics: 800px max width
- Animations: GIF or Lottie (under 500KB)
- Diagrams: SVG preferred for scalability

---

## Post 1: Psychology of Response Timing

**Graphics needed:**

1. **Hero: Response Timing Spectrum**
   - Horizontal timeline showing 0ms to 3000ms
   - Color-coded zones: green (0-200ms "Instant"), yellow (200-1000ms "Acceptable"), red (1000ms+ "Frustrating")
   - Simple, clean design

2. **Animation: Realistic vs Instant Typing**
   - Side-by-side comparison GIF
   - Left: Character-by-character typing with human-like delays
   - Right: Instant text dump
   - Loop duration: 3-4 seconds

3. **Diagram: Typing Speed Formula**
   - Visual showing: base delay + word delay + punctuation pause
   - Code-like styling with variables

---

## Post 2: Loading States & Progress

**Graphics needed:**

1. **Hero: Three Loading Types**
   - Triptych showing skeleton, progress bar, phase indicator
   - Each in a mini chat window mockup

2. **Animation: Skeleton to Content Transition**
   - GIF showing skeleton shimmer → fade to real content
   - Smooth, professional transition

3. **Diagram: Progress State Machine**
   - Flowchart: idle → loading → streaming → complete/error
   - Clean arrows and state boxes

---

## Post 3: Dark Mode & Theming

**Graphics needed:**

1. **Hero: Light/Dark Split Screen**
   - Same chat UI split down middle
   - Left half: light mode
   - Right half: dark mode

2. **Diagram: CSS Custom Properties Flow**
   - Shows root variables → component consumption
   - Color swatches for each theme variable

3. **Color Palette: Accessible Dark Mode**
   - Side-by-side color pairs with contrast ratios
   - Check marks for WCAG compliance

---

## Post 4: Accessibility & Screen Readers

**Graphics needed:**

1. **Hero: Accessibility Icons Grid**
   - Keyboard, screen reader, contrast, motion icons
   - Clean, recognizable symbols

2. **Diagram: ARIA Live Region Flow**
   - Shows message → aria-live container → screen reader announcement
   - Simple flowchart style

3. **Checklist Graphic: WCAG Compliance**
   - Visual checklist with AA/AAA indicators
   - Green checkmarks for passing items

---

## Post 5: Error Messages UX

**Graphics needed:**

1. **Hero: Error Message Anatomy**
   - Labeled diagram of perfect error message
   - Shows: icon, title, description, action button, reassurance

2. **Comparison: Bad vs Good Errors**
   - Before/after showing "Error 500" vs helpful message
   - Red X for bad, green check for good

3. **Flowchart: Error Classification**
   - Decision tree for error types → handling strategies

---

## Post 6: Typing Indicator Art

**Graphics needed:**

1. **Hero: Animated Typing Dots**
   - High-quality animation of professional typing indicator
   - Subtle, organic wave motion

2. **Animation: Multi-Stage Indicator**
   - GIF showing: "Reading..." → "Thinking..." → "Writing..."
   - With appropriate icons for each stage

3. **Diagram: Transition to Content**
   - Shows indicator fading as first tokens appear
   - Seamless handoff visualization

---

## Post 7: SSE vs WebSockets

**Graphics needed:**

1. **Hero: SSE vs WebSocket Comparison**
   - Split graphic showing both architectures
   - Arrows indicating data flow directions

2. **Diagram: Connection Flow**
   - SSE: HTTP request → server push → client receives
   - WebSocket: Handshake → bidirectional
   - Side-by-side comparison

3. **Decision Flowchart**
   - "Which should you use?" flowchart
   - Leads to SSE or WebSocket based on criteria

---

## Post 8: Context Windows & Token Management

**Graphics needed:**

1. **Hero: Context Window Visualization**
   - Shows 128K token window filling up
   - Gradient from empty to full

2. **Diagram: Four Strategies**
   - Quadrant showing: sliding window, token budget, summarization, RAG
   - Simple icons and brief descriptions

3. **Animation: Sliding Window**
   - Shows old messages falling off as new ones arrive
   - Clean, informative animation

---

## Post 9: Production-Ready Chat

**Graphics needed:**

1. **Hero: Layers of Production Chat**
   - Stacked layers: State → Streaming → Accessibility → Input → Integration
   - 3D isometric style

2. **Comparison Table: Tutorial vs Production**
   - Feature matrix with check/X marks
   - Dramatic difference visualization

3. **Diagram: Full Architecture**
   - Components and their connections
   - Clean system diagram style

---

## Post 10: Token Counting

**Graphics needed:**

1. **Hero: Token Breakdown Visualization**
   - Same text shown with token boundaries highlighted
   - Different colors for each token

2. **Table: Model Tokenizer Comparison**
   - Same text, different token counts per model
   - Clean comparison table design

3. **Diagram: Token Cost Breakdown**
   - Pie chart or bar showing: user messages, assistant, system prompt, overhead

---

## Post 11: Retry Pattern

**Graphics needed:**

1. **Hero: Exponential Backoff Timeline**
   - Visual timeline showing increasing delays
   - 1s → 2s → 4s pattern

2. **Pie Chart: Error Types Distribution**
   - Rate limits, timeouts, network, server, auth
   - Clean pie chart with percentages

3. **UI Mockup: Retry Banner**
   - Shows countdown, attempt number, cancel button
   - Professional UI component style

---

## Post 12: Optimistic UI

**Graphics needed:**

1. **Hero: Timeline Comparison**
   - Pessimistic: click → wait → show
   - Optimistic: click → show → confirm
   - Side-by-side timelines

2. **Diagram: Message State Machine**
   - sending → sent → (with failure path to failed → retry)
   - Clean state diagram

3. **UI Mockup: Message States**
   - Three message bubbles showing sending/sent/failed states

---

## Post 13: Cost Optimization

**Graphics needed:**

1. **Hero: Before/After Cost Chart**
   - $8,400 → $3,200 dramatic decrease
   - Clean bar chart style

2. **Waterfall Chart: Savings Breakdown**
   - Starting amount → each optimization → final amount
   - Professional financial chart style

3. **Pie Chart: Cost Distribution**
   - Where API costs go: GPT-4, embeddings, etc.

---

## Post 14: Prompt Caching

**Graphics needed:**

1. **Hero: Cache Hit Visualization**
   - Shows repeated prefix being cached
   - 50% off badge on cached portion

2. **Diagram: Prompt Structure**
   - Shows: static prefix (cached) → dynamic suffix (not cached)
   - Clear boundary indication

3. **Table: Provider Comparison**
   - OpenAI vs Anthropic vs Google caching details

---

## Post 15: Model Selection

**Graphics needed:**

1. **Hero: Model Cost Comparison**
   - Bar chart showing relative costs
   - GPT-4o-mini tiny bar, GPT-4o large bar

2. **Flowchart: Model Selection Decision Tree**
   - Task type → complexity → recommended model
   - Clean decision flowchart

3. **Pie Chart: Query Distribution After Routing**
   - Shows 65% simple, 25% standard, 10% complex

---

## Post 16: Hidden Costs

**Graphics needed:**

1. **Hero: Cost Iceberg**
   - Iceberg diagram showing visible (20%) vs hidden (80%)
   - Clean, impactful visualization

2. **Stacked Bar: DIY vs Library TCO**
   - 2-year comparison
   - Clear cost difference visualization

3. **Timeline: Build Time Comparison**
   - DIY: 10 weeks stretched timeline
   - Library: 1 week compact timeline

---

## Post 17: RAG in Production

**Graphics needed:**

1. **Hero: Demo vs Production Comparison**
   - Split screen showing clean demo vs messy production query
   - Before/after style

2. **Diagram: Chunking Strategies**
   - Fixed-size vs semantic vs hierarchical
   - Visual representation of each

3. **Flowchart: Two-Stage Retrieval**
   - Initial retrieval → reranking → final results
   - Clean pipeline visualization

---

## Post 18: AI Agents & Function Calling

**Graphics needed:**

1. **Hero: Agent Loop Diagram**
   - User → AI → Tool Call → Execute → Result → AI → Response
   - Circular or linear flow diagram

2. **Diagram: Tool Definition Structure**
   - JSON schema visualization
   - Shows parameters, types, descriptions

3. **UI Mockup: Tool Call Card**
   - Shows: icon, function name, parameters, result
   - Professional component design

---

## Post 19: Prompt Injection Security

**Graphics needed:**

1. **Hero: Attack Surface Diagram**
   - Shows direct and indirect attack vectors
   - Warning/danger style

2. **Comparison: SQL vs Prompt Injection**
   - Side-by-side showing clear vs unclear boundaries
   - Educational diagram style

3. **Diagram: Defense Layers**
   - Input → LLM → Output with filtering at each stage
   - Security-focused design

---

## Post 20: AI Memory

**Graphics needed:**

1. **Hero: Memory Types Pyramid**
   - Session → User → Semantic → Behavioral
   - Layered pyramid visualization

2. **Diagram: Stateless Reality**
   - Shows API calls as disconnected
   - Illustrates amnesia problem

3. **UI Mockup: Memory Inspector**
   - Shows user facts, delete buttons, export option
   - Privacy-focused design

---

## Post 21: 2025 Lessons

**Graphics needed:**

1. **Hero: Demo vs Production Gap**
   - Effort curve showing 25% demo → 100% production
   - Clean progress visualization

2. **Bar Chart: Expected vs Actual Costs**
   - $150/day expected vs $600/day actual
   - Dramatic comparison

3. **Checklist Graphic: UX Baseline Requirements**
   - Modern chat features checklist
   - Clean checklist style

---

## Post 22: Component Library Manifesto

**Graphics needed:**

1. **Hero: Venn Diagram**
   - Three overlapping circles: Company A, B, C
   - 80% overlap highlighted

2. **Decision Tree: Build vs Use**
   - Simple flowchart for the decision
   - Clean, actionable design

3. **Timeline Comparison: DIY vs Library**
   - 10 weeks vs 1 week visualization
   - Dramatic time savings

---

## Post 23: Production Readiness Checklist

**Graphics needed:**

1. **Hero: Checklist Overview**
   - 50 items across 10 categories visual
   - Clean, organized checklist graphic

2. **Gauge: Readiness Score**
   - 0-50 gauge showing different readiness levels
   - Color-coded zones

3. **Priority Matrix: P0/P1/P2 Items**
   - Visual priority grid
   - Clear categorization

---

## Post 24: AI Chat Analytics

**Graphics needed:**

1. **Hero: Metrics Dashboard Mockup**
   - Shows key metrics: resolution rate, TTFT, cost
   - Professional dashboard design

2. **Chart: Traditional vs AI Metrics**
   - Crossed-out traditional metrics
   - Highlighted AI-specific metrics

3. **Bar Chart: Messages Per Conversation Distribution**
   - Shows sweet spot (3-6) highlighted
   - Histogram style

---

## Implementation Notes

### Priority Order
1. Hero images for all posts (most visible)
2. Key diagrams that explain concepts
3. UI mockups for components
4. Animations (last, most effort)

### Tools Recommended
- Figma: Static graphics and mockups
- After Effects/Lottie: Animations
- D3.js: Interactive charts (if embedded)
- SVG exports: Scalability and dark mode support

### Accessibility
- All graphics need alt text
- Diagrams should have text alternatives
- Animations should respect prefers-reduced-motion
- Ensure sufficient contrast in all graphics
