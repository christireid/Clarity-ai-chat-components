# Citation Card Interactive Showcase

## Overview

Comprehensive interactive demonstration of citation components with various formats, hover states, source previews, glassmorphism styling, and smooth transitions.

## Files Created

### 1. `src/components/CitationCardShowcase.tsx`
Main showcase component featuring:
- **Citation Formats** - High/medium/low confidence examples
- **Display Variants** - Inline, card, and list layouts
- **Interactive States** - Hover effects, click-to-expand, preview tooltips
- **Real-World Examples** - Academic, technical docs, legal, and news citations

### 2. `src/components/CitationCardShowcase.css`
Glassmorphism styling including:
- Backdrop blur effects
- Gradient overlays
- Smooth transitions
- Responsive design
- Interactive hover states
- Animation presets

## Integration Instructions

### Step 1: Add Import to App.tsx

```tsx
import { CitationCardShowcase } from './components/CitationCardShowcase'
import './components/CitationCardShowcase.css'
```

### Step 2: Add View Type

```tsx
type View =
  | 'components'
  | 'templates'
  | 'themes'
  | 'playground'
  | 'token-optimization'
  | 'prompt-suggestions'
  | 'follow-up-suggestions'
  | 'network-status'
  | 'voice-input'
  | 'citations'  // Add this
```

### Step 3: Add Case to renderView()

```tsx
case 'citations':
  return <CitationCardShowcase />
```

### Step 4: Add Navigation Button

```tsx
<button
  className={currentView === 'citations' ? 'active' : ''}
  onClick={() => setCurrentView('citations')}
>
  Citations
</button>
```

## Features Demonstrated

### 1. Citation Formats
- **High Confidence (95%)** - Academic research with full metadata
- **Medium Confidence (88%)** - Technical documentation
- **Low Confidence (72%)** - Health studies with limited data

### 2. Display Variants
- **Inline** - Compact citations within text flow
- **Card** - Detailed expandable cards
- **List** - Clean list view with hover previews
- **Grouped** - Sources organized by domain

### 3. Interactive States

#### Hover Effects
- Glassmorphism glow on hover
- Shadow elevation changes
- Backdrop blur intensification
- Border gradient animation

#### Click States
- Expand/collapse citations
- View full content
- Copy citation text
- Open source links

#### Transition Effects
- Fade-in animations
- Slide-up entry
- Stagger timing for lists
- Smooth state changes

### 4. Real-World Examples

#### Academic Research
```tsx
{
  source: 'Nature - Climate Change Impact Study',
  confidence: 0.95,
  metadata: {
    author: 'Dr. Sarah Chen et al.',
    date: '2024-01-15',
    journal: 'Nature Climate Change',
    doi: '10.1038/nclimate.2024.001'
  }
}
```

#### Technical Documentation
```tsx
{
  source: 'React Documentation - Hooks API',
  confidence: 0.98,
  metadata: {
    version: 'React 18',
    category: 'Hooks'
  }
}
```

#### Legal Documents
```tsx
{
  source: 'GDPR Article 17 - Right to Erasure',
  confidence: 0.99,
  metadata: {
    regulation: 'GDPR',
    article: '17',
    effectiveDate: '2018-05-25'
  }
}
```

#### News Articles
```tsx
{
  source: 'The New York Times - Economic Analysis',
  confidence: 0.85,
  metadata: {
    author: 'Economics Desk',
    date: '2024-02-15',
    section: 'Business'
  }
}
```

## Component APIs Used

### CitationCard
```tsx
<CitationCard
  citation={{
    source: string
    chunkText: string
    confidence: number
    url?: string
    metadata?: Record<string, any>
  }}
  showConfidence={true}
  defaultExpanded={false}
  previewLength={150}
  onSourceClick={(url) => void}
  onClick={(citation) => void}
/>
```

### SourceCitation
```tsx
<SourceCitation
  sources={Source[]}
  variant="card" | "inline" | "list"
  size="sm" | "md" | "lg"
  showConfidence={true}
  showDomain={true}
  showFavicons={true}
  expandOnHover={true}
  groupByDomain={false}
  maxVisible={number}
  onSourceClick={(source, index) => void}
/>
```

## Styling Features

### Glassmorphism Effects
```css
.variant-preview {
  backdrop-filter: blur(12px);
  background: linear-gradient(
    135deg,
    hsl(var(--card) / 0.8),
    hsl(var(--muted) / 0.4)
  );
  border: 1px solid hsl(var(--border) / 0.4);
}
```

### Hover Transitions
```css
.hover-demo-card:hover {
  transform: translateY(-4px) scale(1.01);
  box-shadow:
    0 20px 40px hsl(var(--primary) / 0.15),
    0 10px 20px hsl(var(--primary) / 0.1);
  backdrop-filter: blur(16px);
}
```

### Smooth Animations
```css
@keyframes fadeSlideIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

## Usage Examples

### Basic Usage
```tsx
import { CitationCardShowcase } from './components/CitationCardShowcase'
import './components/CitationCardShowcase.css'

function App() {
  return <CitationCardShowcase />
}
```

### Custom Citations
```tsx
const customCitation = {
  source: 'My Source',
  chunkText: 'Citation content...',
  confidence: 0.9,
  url: 'https://example.com',
  metadata: {
    author: 'John Doe',
    date: '2024-01-15'
  }
}

<CitationCard citation={customCitation} showConfidence />
```

### Inline Citations in Text
```tsx
<p>
  According to recent research
  <SourceCitation
    sources={sources}
    variant="inline"
    size="sm"
    expandOnHover
  />
  the findings show...
</p>
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Requires support for:
- CSS backdrop-filter
- CSS Grid
- CSS Custom Properties
- Flexbox

## Performance Considerations

- Lazy loading for favicon images
- Optimized animations with `will-change`
- Reduced motion support via `prefers-reduced-motion`
- Virtual scrolling for large citation lists
- Memoized components to prevent unnecessary re-renders

## Accessibility

- Full keyboard navigation support
- ARIA labels and roles
- Screen reader compatible
- Focus management
- High contrast mode support
- Reduced motion preferences respected

## Testing

### Manual Testing Checklist
- [ ] Hover over cards to see glassmorphism effect
- [ ] Click cards to expand/collapse
- [ ] Test inline citations with hover tooltips
- [ ] Switch between display variants
- [ ] Verify confidence badges render correctly
- [ ] Test external link opening
- [ ] Check responsive behavior
- [ ] Verify theme compatibility
- [ ] Test keyboard navigation
- [ ] Check reduced motion mode

### Browser Testing
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile Safari
- [ ] Mobile Chrome

## Future Enhancements

1. **Citation Export** - Download as BibTeX, APA, MLA
2. **Search & Filter** - Find citations by keyword
3. **Sort Options** - By confidence, date, source
4. **Citation Groups** - Organize by topic
5. **Custom Styles** - User-defined color schemes
6. **Bulk Actions** - Select multiple citations
7. **Citation Notes** - Add personal annotations
8. **Related Sources** - Show similar citations

## Dependencies

- `@clarity-chat/react` - Core components
- `framer-motion` - Animations
- `@clarity-chat/primitives` - UI primitives
- React 18+

## License

MIT - Same as Clarity Chat Components

## Author

Clarity Chat Components Team

## Last Updated

2024-02-04
