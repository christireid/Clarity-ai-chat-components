# Streaming Shimmer/Typing Animation Component Specification

**Version**: 1.0 **Date**: 2026-01-27 **Status**: Draft **Author**: Claude Code

---

## Executive Summary

This specification defines a high-performance, AI-native **Streaming Shimmer/Typing Animation**
component designed for real-time chat interfaces. The component combines the best practices from
Magic UI's typing effects and shadcn/ui AI's streaming animations to create a polished, accessible,
and performant solution for displaying AI-generated content as it streams in.

**Primary Use Cases**:

- Character-by-character typing animation for LLM responses
- Shimmer/skeleton loading states during content generation
- Progressive text reveal for streaming markdown
- Token-aware animation timing based on generation speed
- Multi-cursor support for parallel streaming

**Key Differentiators**:

- Token-budget aware animation timing
- Streaming performance optimized for real-time updates
- Multiple animation modes (typing, shimmer, fade-in)
- Built-in markdown streaming support
- Accessibility-first with motion preferences
- Framework-agnostic core design

---

## Design Philosophy

### 1. Animation as Communication

Animations should communicate state and progress, not just provide visual decoration:

- **Typing animations** signal that AI is actively generating content
- **Shimmer effects** indicate processing without blocking the interface
- **Progressive reveal** reduces cognitive load during long responses
- **Cursor variations** provide visual feedback on generation state

### 2. Performance First

Streaming text requires high-performance rendering:

- **CSS-first animations** leverage GPU acceleration
- **Virtualization support** for long streaming responses
- **Minimal DOM updates** through efficient diffing
- **60fps target** for smooth, non-janky animation
- **Hardware acceleration** via `transform-gpu` and `will-change`

### 3. Restraint and Intentionality

Following Magic UI's philosophy, animations enhance rather than dominate:

- **Subtle by default** - professional appearance without distraction
- **Configurable intensity** - users can adjust to preference
- **Respects motion preferences** - honors `prefers-reduced-motion`
- **Skippable** - users can click to complete animation instantly
- **Context-aware timing** - adapts to content length and type

---

## Component Architecture

### Core Components

```
StreamingText/
├── StreamingText.tsx          # Main orchestrator component
├── TypingAnimation.tsx        # Character-by-character typing
├── ShimmerLoader.tsx          # Skeleton/shimmer loading state
├── CursorRenderer.tsx         # Animated cursor variants
├── StreamingMarkdown.tsx      # Markdown-aware streaming
└── TokenAwareTimer.tsx        # Token budget integration
```

### Component Hierarchy

```tsx
<StreamingText>
  <ShimmerLoader /> {/* Shows while waiting for first token */}
  <TypingAnimation>
    {' '}
    {/* Character-by-character display */}
    <StreamingMarkdown /> {/* Markdown parsing during stream */}
    <CursorRenderer /> {/* Animated cursor */}
  </TypingAnimation>
</StreamingText>
```

---

## API Design

### StreamingText Component

**Primary API**:

```tsx
interface StreamingTextProps {
  // Content
  content: string // Text to display
  stream?: ReadableStream<string> // Alternative: streaming source
  isComplete?: boolean // Whether streaming is finished

  // Animation Mode
  mode?: 'typing' | 'shimmer' | 'fade' | 'instant' // Animation style
  typingSpeed?: number | 'auto' | 'token-aware' // Characters per second

  // Cursor
  cursor?: 'line' | 'block' | 'underscore' | 'none' // Cursor style
  cursorBlink?: boolean // Whether cursor blinks
  cursorColor?: string // Custom cursor color

  // Behavior
  skipOnClick?: boolean // Click to complete animation
  pauseOnHover?: boolean // Pause when hovering
  autoCollapse?: boolean // Collapse long content

  // Token Budget Integration
  tokenBudget?: number // Available tokens
  tokenUsed?: number // Tokens consumed
  onTokenUpdate?: (used: number) => void // Token consumption callback

  // Markdown
  enableMarkdown?: boolean // Parse markdown during streaming
  markdownComponents?: Record<string, any> // Custom markdown renderers

  // Performance
  batchSize?: number // Characters per render batch
  maxFrameTime?: number // Max ms per animation frame

  // Styling
  className?: string // Additional CSS classes
  style?: React.CSSProperties // Inline styles

  // Accessibility
  announceCompletion?: boolean // Screen reader announcement
  reducedMotion?: boolean // Force reduced motion

  // Callbacks
  onStart?: () => void // Animation started
  onProgress?: (progress: number) => void // Animation progress (0-1)
  onComplete?: () => void // Animation finished
  onSkip?: () => void // User skipped animation
}
```

**Example Usage**:

```tsx
// Basic typing animation
<StreamingText
  content={aiResponse}
  mode="typing"
  typingSpeed={30}
  cursor="line"
/>

// Token-aware streaming
<StreamingText
  content={aiResponse}
  mode="typing"
  typingSpeed="token-aware"
  tokenBudget={1000}
  tokenUsed={tokenCount}
  onTokenUpdate={handleTokenUpdate}
/>

// Markdown streaming
<StreamingText
  stream={responseStream}
  mode="typing"
  enableMarkdown
  cursor="block"
  skipOnClick
/>

// Shimmer loading state
<StreamingText
  content=""
  mode="shimmer"
  className="h-20"
/>
```

---

## Animation Modes

### 1. Typing Animation

**Character-by-character reveal** mimicking human typing:

**Features**:

- Variable typing speed (10-100 characters/second)
- Realistic pause patterns (punctuation, newlines)
- Multiple cursor styles
- Cursor blink animation
- Skip ahead on click

**Implementation Strategy**:

```typescript
// CSS-first approach for cursor
@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.typing-cursor {
  animation: blink 1s step-end infinite;
  will-change: opacity;
}

// JavaScript controls character reveal timing
const typingLoop = (content: string, speed: number) => {
  let charIndex = 0;
  const intervalMs = 1000 / speed;

  const interval = setInterval(() => {
    if (charIndex >= content.length) {
      clearInterval(interval);
      onComplete?.();
      return;
    }

    // Pause longer at punctuation
    const char = content[charIndex];
    const pauseMultiplier = /[.!?]/.test(char) ? 3 : 1;

    setDisplayedContent(content.slice(0, charIndex + 1));
    charIndex++;

    // Dynamic timing adjustment
    setTimeout(() => {}, intervalMs * pauseMultiplier);
  }, intervalMs);
};
```

**Animation Variables**:

```css
:root {
  --typing-speed: 30; /* characters per second */
  --typing-cursor-width: 2px; /* cursor width */
  --typing-cursor-height: 1em; /* cursor height */
  --typing-blink-duration: 1s; /* blink cycle duration */
  --typing-pause-punctuation: 3; /* pause multiplier for . ! ? */
  --typing-pause-newline: 2; /* pause multiplier for \n */
}
```

**Typing Speed Modes**:

- **Numeric** (e.g., `30`): Fixed characters per second
- **`auto`**: Adapts based on content length (faster for long responses)
- **`token-aware`**: Syncs with actual token generation speed from LLM

### 2. Shimmer Loader

**Skeleton loading state** with animated shimmer effect:

**Features**:

- Gradient shimmer passing over content
- Configurable shimmer speed and direction
- Respects reduced motion preferences
- Smooth transition to typed content

**Implementation Strategy**:

```css
/* Shimmer animation from Magic UI */
@keyframes shimmer-slide {
  0% {
    background-position: -100% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.shimmer-loader {
  background: linear-gradient(
    90deg,
    var(--muted) 0%,
    var(--muted-foreground) / 10% 50%,
    var(--muted) 100%
  );
  background-size: 200% 100%;
  animation: shimmer-slide 2s linear infinite;
  will-change: background-position;
  transform: translateZ(0); /* Force GPU acceleration */
}
```

**Shimmer Variants**:

```tsx
<ShimmerLoader variant="single-line" />    {/* Single text line */}
<ShimmerLoader variant="multi-line" />     {/* Multiple text lines */}
<ShimmerLoader variant="code-block" />     {/* Code block skeleton */}
<ShimmerLoader variant="custom" height={100} /> {/* Custom height */}
```

**Animation Variables**:

```css
:root {
  --shimmer-duration: 2s; /* shimmer cycle duration */
  --shimmer-color-from: var(--muted); /* start color */
  --shimmer-color-via: oklch(1 0 0 / 10%); /* shimmer highlight */
  --shimmer-color-to: var(--muted); /* end color */
  --shimmer-angle: 90deg; /* shimmer direction */
}
```

### 3. Fade-In Animation

**Progressive opacity reveal** for subtle appearance:

**Features**:

- Word-by-word or line-by-line fade-in
- Staggered timing for sequential effect
- Smooth transitions
- Lightweight performance

**Implementation Strategy**:

```css
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in-word {
  animation: fade-in 0.3s ease-out forwards;
  animation-delay: calc(var(--word-index) * 0.05s);
}
```

**Animation Variables**:

```css
:root {
  --fade-in-duration: 0.3s; /* fade duration per word */
  --fade-in-stagger: 0.05s; /* delay between words */
  --fade-in-translate: 4px; /* subtle upward motion */
}
```

### 4. Instant Mode

**No animation** for accessibility and user preference:

- Immediately displays full content
- Honors `prefers-reduced-motion: reduce`
- Skip-ahead fallback behavior
- Zero animation overhead

---

## Cursor Variants

### Line Cursor (Default)

**Thin vertical line** mimicking text editor cursors:

```css
.cursor-line {
  display: inline-block;
  width: 2px;
  height: 1em;
  background: currentColor;
  margin-left: 2px;
  animation: blink 1s step-end infinite;
}
```

### Block Cursor

**Solid block** covering character space:

```css
.cursor-block {
  display: inline-block;
  width: 0.6em;
  height: 1em;
  background: currentColor;
  margin-left: 2px;
  animation: blink 1s step-end infinite;
}
```

### Underscore Cursor

**Horizontal line** beneath text:

```css
.cursor-underscore {
  display: inline-block;
  width: 0.6em;
  height: 2px;
  background: currentColor;
  margin-left: 2px;
  vertical-align: baseline;
  animation: blink 1s step-end infinite;
}
```

### Pulse Cursor

**Pulsing glow** indicating active generation:

```css
@keyframes pulse-glow {
  0%,
  100% {
    opacity: 1;
    box-shadow: 0 0 0 0 currentColor;
  }
  50% {
    opacity: 0.7;
    box-shadow: 0 0 8px 2px currentColor;
  }
}

.cursor-pulse {
  animation: pulse-glow 1.5s ease-in-out infinite;
}
```

---

## Token Budget Integration

### Token-Aware Timing

**Sync animation with actual LLM token generation**:

```typescript
interface TokenAwareTimingConfig {
  tokenBudget: number // Total available tokens
  tokenUsed: number // Tokens consumed so far
  estimatedTokensRemaining: number // Predicted remaining tokens
  tokensPerSecond: number // LLM generation speed
}

const calculateTypingSpeed = (config: TokenAwareTimingConfig): number => {
  const { tokensPerSecond, estimatedTokensRemaining } = config

  // Sync typing speed with token generation
  // Aim to stay slightly behind actual generation to avoid jarring stops
  const typingSpeed = Math.floor(tokensPerSecond * 0.9)

  return Math.max(10, Math.min(100, typingSpeed)) // Clamp 10-100 cps
}
```

### Token Consumption Visualization

**Visual indicator of token usage during streaming**:

```tsx
<StreamingText
  content={response}
  tokenBudget={1000}
  tokenUsed={tokenCount}
  renderTokenIndicator={(used, budget) => (
    <div className="token-progress">
      <div className="token-bar" style={{ width: `${(used / budget) * 100}%` }} />
      <span className="token-count">
        {used} / {budget}
      </span>
    </div>
  )}
/>
```

---

## Markdown Streaming Support

### Progressive Markdown Parsing

**Parse and render markdown as content streams in**:

```tsx
interface StreamingMarkdownProps {
  content: string // Current streamed content
  isComplete: boolean // Whether stream is finished
  components?: Record<string, any> // Custom renderers
  onInvalidMarkdown?: (error: Error) => void // Error handling
}

// Progressive parsing strategy
const parseStreamingMarkdown = (content: string, isComplete: boolean) => {
  // Parse complete markdown blocks as they arrive
  const completeBlocks = extractCompleteBlocks(content)
  const incompleteBlock = content.slice(completeBlocks.join('').length)

  return (
    <>
      {completeBlocks.map((block) => (
        <MarkdownBlock content={block} />
      ))}
      {!isComplete && <TypingAnimation content={incompleteBlock} />}
    </>
  )
}
```

### Markdown Block Detection

**Identify complete markdown structures during streaming**:

````typescript
const extractCompleteBlocks = (content: string): string[] => {
  const blocks: string[] = []

  // Headers: # Title
  const headerRegex = /^#+\s+.+$/gm

  // Code blocks: ```lang\ncode\n```
  const codeBlockRegex = /```[\w]*\n[\s\S]*?\n```/g

  // Lists: - item or 1. item
  const listRegex = /^[\s]*[-*+]|(\d+\.)\s+.+$/gm

  // Paragraphs: separated by double newlines
  const paragraphRegex = /(.+?)\n\n/gs

  // Extract complete blocks in order
  // ... parsing logic

  return blocks
}
````

---

## Performance Optimization

### Batched Rendering

**Reduce DOM updates by batching character reveals**:

```typescript
interface BatchConfig {
  batchSize: number // Characters per batch
  maxFrameTime: number // Max ms per animation frame
  useRequestAnimationFrame: boolean // RAF vs setTimeout
}

const batchedTyping = (content: string, config: BatchConfig) => {
  const { batchSize, maxFrameTime } = config
  let charIndex = 0

  const renderBatch = () => {
    const startTime = performance.now()
    let charsRendered = 0

    while (
      charIndex < content.length &&
      charsRendered < batchSize &&
      performance.now() - startTime < maxFrameTime
    ) {
      charIndex++
      charsRendered++
    }

    setDisplayedContent(content.slice(0, charIndex))

    if (charIndex < content.length) {
      requestAnimationFrame(renderBatch)
    }
  }

  requestAnimationFrame(renderBatch)
}
```

### Virtualization Support

**Efficient rendering of very long streaming responses**:

```tsx
import { VirtualizedText } from '@clarity/react-virtualized'

;<StreamingText
  content={longResponse}
  virtualized
  virtualizedConfig={{
    height: 600, // Viewport height
    itemHeight: 24, // Line height
    overscan: 5, // Extra lines to render
  }}
/>
```

### GPU Acceleration

**Leverage hardware acceleration for smooth animations**:

```css
.streaming-text {
  /* Force GPU layer */
  transform: translateZ(0);
  will-change: contents;

  /* GPU-accelerated properties only */
  transition:
    opacity 0.3s ease-out,
    transform 0.3s ease-out;
}

.cursor {
  /* Dedicated layer for cursor */
  transform: translateZ(0);
  will-change: opacity;
}
```

---

## Accessibility

### Motion Preferences

**Respect user motion preferences**:

```tsx
const StreamingText: React.FC<StreamingTextProps> = (props) => {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  const effectiveMode = props.reducedMotion || prefersReducedMotion ? 'instant' : props.mode

  return <StreamingTextCore {...props} mode={effectiveMode} />
}
```

```css
@media (prefers-reduced-motion: reduce) {
  .streaming-text,
  .cursor,
  .shimmer-loader {
    animation: none !important;
    transition: none !important;
  }
}
```

### Screen Reader Support

**Announce streaming content progressively**:

```tsx
<div
  role="log"
  aria-live="polite"
  aria-atomic="false"
  aria-relevant="additions"
>
  <StreamingText content={response} />
</div>

// Announce completion
<div
  role="status"
  aria-live="polite"
  className="sr-only"
>
  {isComplete && announceCompletion && "Response complete"}
</div>
```

### Keyboard Interaction

**Keyboard controls for animation**:

- **Space**: Pause/resume typing animation
- **Escape**: Skip to full content immediately
- **Enter**: Toggle auto-collapse (for long content)

```tsx
const handleKeyDown = (e: React.KeyboardEvent) => {
  switch (e.key) {
    case ' ':
      e.preventDefault()
      togglePause()
      break
    case 'Escape':
      skipAnimation()
      break
    case 'Enter':
      toggleCollapse()
      break
  }
}

;<div onKeyDown={handleKeyDown} tabIndex={0}>
  <StreamingText {...props} />
</div>
```

---

## Theming & Customization

### CSS Variables

**Theme integration using CSS custom properties**:

```css
:root {
  /* Typing animation */
  --streaming-typing-speed: 30;
  --streaming-cursor-color: var(--primary);
  --streaming-cursor-width: 2px;
  --streaming-cursor-blink-duration: 1s;

  /* Shimmer loader */
  --streaming-shimmer-duration: 2s;
  --streaming-shimmer-from: var(--muted);
  --streaming-shimmer-via: oklch(1 0 0 / 10%);
  --streaming-shimmer-to: var(--muted);

  /* Fade-in */
  --streaming-fade-duration: 0.3s;
  --streaming-fade-stagger: 0.05s;

  /* Token indicator */
  --streaming-token-bar-bg: var(--muted);
  --streaming-token-bar-fill: var(--primary);
  --streaming-token-bar-height: 4px;
}

.dark {
  /* Dark mode overrides */
  --streaming-cursor-color: var(--primary);
  --streaming-shimmer-via: oklch(1 0 0 / 15%);
}
```

### Component Variants

**Pre-built style variants**:

```tsx
<StreamingText variant="default" />   {/* Standard appearance */}
<StreamingText variant="compact" />   {/* Reduced spacing */}
<StreamingText variant="monospace" /> {/* Code/terminal style */}
<StreamingText variant="elegant" />   {/* Premium aesthetic */}
```

```css
/* Variant implementations */
.streaming-text-default {
  font-family: var(--font-geist);
  line-height: 1.6;
}

.streaming-text-monospace {
  font-family: var(--font-geist-mono);
  line-height: 1.5;
  letter-spacing: -0.01em;
}

.streaming-text-elegant {
  font-family: var(--font-geist);
  line-height: 1.8;
  font-size: 1.125rem;
  color: var(--foreground);
}
```

---

## Multi-Cursor Support

### Parallel Streaming

**Multiple concurrent streaming sources**:

```tsx
interface ParallelStreamConfig {
  streams: Array<{
    id: string
    content: string
    cursor: CursorStyle
    color?: string
  }>
}

;<StreamingText.Parallel
  streams={[
    { id: 'model-1', content: response1, cursor: 'line', color: 'blue' },
    { id: 'model-2', content: response2, cursor: 'block', color: 'green' },
  ]}
/>
```

### Multi-Agent Visualization

**Visual differentiation for multiple AI agents**:

```tsx
<StreamingText
  content={response}
  agentId="gpt-4"
  agentColor="var(--chart-1)"
  cursor="line"
/>

<StreamingText
  content={response}
  agentId="claude-3"
  agentColor="var(--chart-2)"
  cursor="block"
/>
```

---

## Error Handling

### Stream Interruption

**Handle network errors and stream failures**:

```tsx
<StreamingText
  stream={responseStream}
  onError={(error) => {
    console.error('Stream failed:', error)
    // Show error state
  }}
  fallback={<ErrorMessage error="Stream interrupted" />}
  retryable
  onRetry={handleRetry}
/>
```

### Partial Content Handling

**Gracefully handle incomplete markdown/code**:

```tsx
const handlePartialContent = (content: string, isComplete: boolean) => {
  if (!isComplete) {
    // Show partial content with indicator
    return (
      <>
        {content}
        <span className="partial-indicator">...</span>
      </>
    )
  }

  return content
}
```

---

## Testing Strategy

### Visual Regression Tests

**Capture snapshots of animation states**:

```typescript
describe('StreamingText', () => {
  it('renders shimmer loader initially', async () => {
    const { container } = render(
      <StreamingText content="" mode="shimmer" />
    );
    expect(container).toMatchSnapshot();
  });

  it('shows typing cursor', async () => {
    const { container } = render(
      <StreamingText content="Hello" cursor="line" />
    );
    expect(container.querySelector('.cursor-line')).toBeInTheDocument();
  });
});
```

### Animation Performance Tests

**Measure frame rate and timing accuracy**:

```typescript
describe('Animation Performance', () => {
  it('maintains 60fps during typing', async () => {
    const frameRates: number[] = [];

    render(
      <StreamingText
        content={longContent}
        onFrame={(fps) => frameRates.push(fps)}
      />
    );

    await waitFor(() => frameRates.length > 100);

    const averageFps = frameRates.reduce((a, b) => a + b) / frameRates.length;
    expect(averageFps).toBeGreaterThan(58); // Allow 2fps tolerance
  });

  it('typing speed accuracy', async () => {
    const typingSpeed = 30; // characters per second
    const content = 'A'.repeat(300); // 10 seconds of content

    const startTime = performance.now();

    render(
      <StreamingText
        content={content}
        typingSpeed={typingSpeed}
      />
    );

    await waitFor(() => isComplete);

    const duration = performance.now() - startTime;
    const expectedDuration = 10000; // 10 seconds

    expect(duration).toBeCloseTo(expectedDuration, -2); // 10ms tolerance
  });
});
```

### Accessibility Tests

**Verify screen reader and keyboard support**:

```typescript
describe('Accessibility', () => {
  it('respects prefers-reduced-motion', () => {
    // Mock matchMedia
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: query === '(prefers-reduced-motion: reduce)',
    }));

    const { container } = render(
      <StreamingText content="Hello" mode="typing" />
    );

    // Should render instantly, not animate
    expect(container.textContent).toBe('Hello');
  });

  it('announces completion to screen readers', async () => {
    const { getByRole } = render(
      <StreamingText
        content="Hello"
        announceCompletion
      />
    );

    await waitFor(() => {
      const status = getByRole('status');
      expect(status).toHaveTextContent('Response complete');
    });
  });

  it('supports keyboard controls', async () => {
    const { container } = render(
      <StreamingText content={longContent} skipOnClick />
    );

    fireEvent.keyDown(container, { key: 'Escape' });

    // Should skip to full content
    expect(container.textContent).toBe(longContent);
  });
});
```

---

## Implementation Phases

### Phase 1: Core Typing Animation (Week 1)

**Deliverables**:

- Basic `StreamingText` component
- Typing animation with character-by-character reveal
- Line, block, and underscore cursor variants
- Skip-on-click functionality
- Basic CSS theming variables

**Success Criteria**:

- 60fps animation performance
- Accurate typing speed control
- Smooth cursor blinking
- Zero accessibility violations

### Phase 2: Shimmer & Loading States (Week 2)

**Deliverables**:

- `ShimmerLoader` component
- Shimmer animation with gradient slide
- Multiple shimmer variants (single-line, multi-line, code-block)
- Smooth transition from shimmer to typing
- Dark mode support

**Success Criteria**:

- GPU-accelerated shimmer animation
- No layout shift during shimmer-to-content transition
- Respects `prefers-reduced-motion`

### Phase 3: Markdown Streaming (Week 3)

**Deliverables**:

- `StreamingMarkdown` component
- Progressive markdown parsing
- Syntax highlighting integration
- Code block streaming support
- Custom markdown component renderers

**Success Criteria**:

- Correct markdown parsing during streaming
- No markdown rendering errors
- Syntax highlighting works with streaming code blocks

### Phase 4: Token Budget Integration (Week 4)

**Deliverables**:

- Token-aware timing algorithm
- Token consumption visualization
- Real-time token budget warnings
- Integration with `TokenBudgetMeter` component

**Success Criteria**:

- Typing speed syncs with actual token generation
- Token budget accurately tracked
- Visual warnings before budget exhaustion

### Phase 5: Performance & Polish (Week 5)

**Deliverables**:

- Batched rendering optimization
- Virtualization support for long content
- Multi-cursor parallel streaming
- Comprehensive test suite
- Documentation and examples

**Success Criteria**:

- 60fps maintained for 10,000+ character responses
- All accessibility tests passing
- 100% test coverage for core functionality
- Full documentation published

---

## Examples

### Basic Typing Animation

```tsx
import { StreamingText } from '@clarity/react'

function ChatMessage({ message }) {
  return (
    <div className="chat-message">
      <StreamingText
        content={message.content}
        isComplete={message.isComplete}
        mode="typing"
        typingSpeed={30}
        cursor="line"
        skipOnClick
      />
    </div>
  )
}
```

### Token-Aware Streaming

```tsx
import { StreamingText, TokenBudgetMeter } from '@clarity/react'

function TokenAwareChat() {
  const [tokenUsed, setTokenUsed] = useState(0)
  const tokenBudget = 1000

  return (
    <div>
      <TokenBudgetMeter used={tokenUsed} budget={tokenBudget} />

      <StreamingText
        stream={responseStream}
        mode="typing"
        typingSpeed="token-aware"
        tokenBudget={tokenBudget}
        tokenUsed={tokenUsed}
        onTokenUpdate={setTokenUsed}
        cursor="pulse"
      />
    </div>
  )
}
```

### Markdown Streaming with Syntax Highlighting

```tsx
import { StreamingText } from '@clarity/react'
import { CodeBlock } from '@clarity/react/code'

function MarkdownResponse({ response, isComplete }) {
  return (
    <StreamingText
      content={response}
      isComplete={isComplete}
      mode="typing"
      enableMarkdown
      markdownComponents={{
        code: ({ children, className }) => (
          <CodeBlock
            code={children}
            language={className?.replace('language-', '')}
            showLineNumbers
          />
        ),
      }}
    />
  )
}
```

### Multi-Agent Parallel Streaming

```tsx
import { StreamingText } from '@clarity/react'

function MultiAgentResponse({ agents }) {
  return (
    <div className="multi-agent-container">
      {agents.map((agent) => (
        <div key={agent.id} className="agent-stream">
          <div className="agent-label" style={{ color: agent.color }}>
            {agent.name}
          </div>

          <StreamingText
            content={agent.response}
            isComplete={agent.isComplete}
            mode="typing"
            cursor="line"
            cursorColor={agent.color}
            className="agent-response"
          />
        </div>
      ))}
    </div>
  )
}
```

### Shimmer Loading State

```tsx
import { StreamingText, ShimmerLoader } from '@clarity/react'

function ChatResponse({ isLoading, content, isComplete }) {
  if (isLoading && !content) {
    return <ShimmerLoader variant="multi-line" lines={3} className="response-shimmer" />
  }

  return (
    <StreamingText content={content} isComplete={isComplete} mode="typing" typingSpeed="auto" />
  )
}
```

---

## Competitive Comparison

### Magic UI Typing Animation

**Strengths**:

- Multiple cursor styles (line, block, underscore)
- Variable typing and delete speeds
- Configurable pause delays
- Looping support for demos
- Beautiful out-of-the-box aesthetics

**What We'll Improve**:

- Add token-aware timing
- Streaming markdown support
- Better accessibility (screen reader announcements)
- Performance optimization for long content
- Integration with Clarity token budget system

### shadcn/ui AI Streaming

**Strengths**:

- Native Vercel AI SDK integration
- Automatic `message.parts` parsing
- Clean, minimal design
- Excellent accessibility (Radix UI foundation)
- OKLCH color system

**What We'll Improve**:

- More animation variety (shimmer, fade-in, typing)
- Token budget visualization
- Multi-cursor parallel streaming
- Configurable typing speed modes
- Better markdown streaming performance

---

## Success Metrics

### Performance Targets

- **Frame Rate**: Maintain 60fps during animation
- **Bundle Size**: < 5KB gzipped for core component
- **Time to Interactive**: < 50ms from stream start to first render
- **Memory Usage**: < 10MB for 10,000 character response

### User Experience Goals

- **Perceived Latency**: Users feel AI is responding immediately
- **Engagement**: Users watch typing animation rather than scrolling away
- **Completion Rate**: > 80% of users watch full animation (don't skip)
- **Accessibility**: 100% WCAG 2.1 AA compliance

### Developer Experience

- **Setup Time**: < 5 minutes to implement basic typing animation
- **Customization Time**: < 15 minutes to fully theme component
- **Documentation**: All props documented with examples
- **TypeScript**: Full type safety with autocomplete

---

## Future Enhancements

### Advanced Animation Modes

- **Typewriter sound effects** (optional audio feedback)
- **Variable typing rhythm** (mimic human typing patterns)
- **Multi-speed streaming** (fast for normal text, slow for code)
- **Pause detection** (automatically pause at code blocks, lists)

### AI Integration

- **Confidence-based speed** (slow down for uncertain tokens)
- **Sentiment-aware animations** (different styles for different tones)
- **Intent detection** (adjust animation based on response type)
- **Token prediction** (show estimated completion time)

### Visual Enhancements

- **Gradient text during streaming** (subtle color shift as content appears)
- **Glow effects** (highlight new content briefly)
- **Smooth scrolling** (auto-scroll to keep cursor visible)
- **Split-screen modes** (show raw and rendered markdown simultaneously)

---

## Appendix

### Technical References

- **Magic UI Typing Animation**: https://magicui.design/docs/components/typing-animation
- **shadcn/ui AI Components**: https://www.shadcn.io/ai/
- **Framer Motion**: https://www.framer.com/motion/
- **OKLCH Color Space**: https://oklch.com/
- **WCAG 2.1 Guidelines**: https://www.w3.org/WAI/WCAG21/quickref/
- **Vercel AI SDK**: https://sdk.vercel.ai/docs

### Related Specifications

- [Token Budget Meter Component](./token-budget-meter.md) (coming soon)
- [Markdown Renderer Component](./markdown-renderer.md) (coming soon)
- [Code Block Component](./code-block.md) (coming soon)

---

**End of Specification**
