# Code Clarity Site Revamp Plan

## Executive Summary

Transform the Code Clarity business site into a compelling showcase for the Clarity Chat component library, positioning it as the premier enterprise AI chat UI solution. The site will feature live interactive demos, real stats, and clear calls-to-action.

---

## Site Architecture

### Pages Structure

```
/                     → Landing page (Hero + Features + Stats + CTAs)
/components           → Component showcase with live demos
/components/[slug]    → Individual component documentation
/pricing              → Pricing tiers with feature comparison
/docs                 → Quick start documentation
/contact              → Contact form page
```

---

## Page-by-Page Specifications

### 1. Landing Page (`/`)

#### Hero Section
**Headline:** "Ship AI Chat UIs in Minutes, Not Months"
**Subheadline:** "200+ production-ready React components with built-in token optimization, memory persistence, and enterprise security"

**Interactive Demo:**
- Embed a live `<ClarityChat />` component with preset="professional"
- Allow visitors to actually interact with the chat
- Show theme switching (3-4 themes: Default, Midnight, Glassmorphism, Neon)

**Primary CTA:** "Get Early Access" (email signup modal)
**Secondary CTA:** "View Components →"

#### Stats Bar (Real Numbers)
```
┌─────────────────┬─────────────────┬─────────────────┬─────────────────┐
│  200+ Components│  95+ Hooks      │  15 Themes      │  60-90% Savings │
│  Ready to use   │  Full control   │  Instant style  │  On AI costs    │
└─────────────────┴─────────────────┴─────────────────┴─────────────────┘
```

#### Key Features Section (6 cards)

1. **Token Optimization** (Unique differentiator)
   - Icon: Coin/Dollar
   - "Save 60-90% on AI inference costs with automatic token budget tracking and smart context bundling"
   - Live demo: `<TokenBudgetBar />` showing real-time tracking

2. **Built-in Memory System**
   - Icon: Brain
   - "Zero-config conversation memory with multiple storage backends"
   - Demo: Show memory persistence across page refreshes

3. **150+ Animations**
   - Icon: Sparkles
   - "Framer Motion powered with full prefers-reduced-motion support"
   - Demo: Interactive animation playground with toggle

4. **Enterprise Security**
   - Icon: Shield
   - "OWASP LLM Top 10 2025 compliant with prompt injection detection"
   - Stats: 90%+ detection accuracy

5. **WCAG AAA Accessibility**
   - Icon: Accessibility
   - "Full keyboard navigation, screen reader support, high contrast modes"
   - Demo: Accessibility overlay showing ARIA regions

6. **Code Blocks with Shiki**
   - Icon: Code
   - "15+ syntax highlighting themes, diff support, copy functionality"
   - Demo: `<CodeBlock />` with language switching

#### Comparison Table
| Feature | Clarity Chat | Vercel AI SDK | assistant-ui | chatscope |
|---------|:------------:|:-------------:|:------------:|:---------:|
| Ready-to-use Components | 200+ | 0 | 0 | ~50 |
| Custom Hooks | 95+ | 3 | 10+ | ~20 |
| Theme Presets | 15 | 0 | 0 | 1 |
| Token Optimization | ✅ | ❌ | ❌ | ❌ |
| Memory System | ✅ | ❌ | ❌ | ❌ |
| RAG Pipeline | ✅ | ❌ | ❌ | ❌ |
| Accessibility | WCAG AAA | WCAG AA | WCAG AA | WCAG AA |
| TypeScript | 100% | 100% | 100% | 100% |

#### Social Proof Section
- GitHub stars badge (when public)
- "Trusted by developers building the next generation of AI products"
- Testimonial placeholders for future quotes

#### Bottom CTA Section
**"Ready to Transform Your AI Chat Experience?"**
- Left: Email signup form (for early access updates)
- Right: Contact form link (for enterprise inquiries)

---

### 2. Components Showcase (`/components`)

#### Component Categories (sidebar navigation)

**Chat Components (15)**
- ClarityChat (main)
- ChatWindow
- ChatInput
- MessageList
- FloatingChatWidget
- ResizableChatLayout
- StreamingMessage
- ThinkingIndicator
- TypingIndicator

**Message Components (10 featured)**
- Message
- MessageOptimized
- MessageThreadView
- CitationCard
- MessageActions
- EditableMessageContent

**Token Management (7)**
- TokenBudgetBar
- TokenCounter
- TokenUsageMeter
- TokenOptimizationDashboard
- TokenCostPreview

**UI & Feedback (10 featured)**
- Toast / ToastSonner
- Skeleton / SkeletonAdvanced
- FeedbackAnimation
- InteractiveCard
- AnimatedList
- Progress

**Code & AI (6)**
- CodeBlock
- StreamingCodeBlock
- EnhancedCodeBlock
- Citation
- MarkdownRendererEnhanced

**Input Components (5)**
- VoiceInput
- CustomInputField
- ContextMenu
- Tabs

#### Each Component Page Includes:
1. Live interactive demo
2. Props table with TypeScript types
3. Usage examples (copy-paste ready)
4. Accessibility notes
5. Animation options

---

### 3. Pricing Page (`/pricing`)

#### Three Tiers

**Free / Open Source**
- All 200+ components
- All 95+ hooks
- Community support
- MIT License
- CTA: "Star on GitHub"

**Pro** ($49/month)
- Everything in Free
- Priority support
- Pro themes pack
- Advanced examples
- CTA: "Get Early Access"

**Enterprise** (Contact)
- Everything in Pro
- SSO/RBAC components
- Dedicated support
- Custom theming
- SLA guarantee
- CTA: "Contact Sales"

---

### 4. Contact Page (`/contact`)

**Contact Form Fields:**
- Name (required)
- Email (required)
- Company (optional)
- Message (required, textarea)
- Interest type: [Early Access / Enterprise Inquiry / Partnership / Other]

**Sends to:** info@codeclarity.ai

**Additional Contact Info:**
- Email: info@codeclarity.ai
- GitHub: github.com/christireid/Clarity-ai-chat-components

---

## Technical Implementation

### Dependencies to Add

```json
{
  "dependencies": {
    "@clarity-chat/react": "workspace:*",
    "framer-motion": "^12.23.25",
    "lucide-react": "latest",
    "resend": "existing"
  }
}
```

### Component Integration Strategy

Since the component library is in a separate repo, we have two options:

**Option A: NPM Package (Recommended for production)**
- Publish @clarity-chat/react to npm (private or public)
- Install as regular dependency

**Option B: Git Submodule / Monorepo (For development)**
- Link the packages locally during development
- Build demos that showcase actual components

**Option C: Copy Key Components (Quickest for MVP)**
- Copy essential demo components directly
- ~10 components for initial showcase
- Full library available on install

### Recommended Approach for MVP:
Use **Option C** initially - copy these specific components for demos:
1. `ClarityChat` - Main hero demo
2. `ThemeProvider` - Theme switching
3. `TokenBudgetBar` - Token visualization
4. `CodeBlock` - Code examples
5. `AnimatedList` - Animation demos
6. `FeedbackAnimation` - Interaction demos
7. `Toast` - Notifications
8. `Skeleton` - Loading states

---

## Design System

### Colors (Based on Library Themes)

```css
/* Primary palette */
--primary: 262.1 83.3% 57.8%;        /* Purple */
--secondary: 217.2 91.2% 59.8%;      /* Blue */
--accent: 142.1 76.2% 36.3%;         /* Green for success */

/* Dark mode (default) */
--background: 224 71% 4%;
--foreground: 213 31% 91%;

/* Gradients */
--hero-gradient: linear-gradient(135deg, hsl(262, 83%, 58%) 0%, hsl(217, 91%, 60%) 100%);
```

### Typography
- Headings: Inter or Geist Sans (bold)
- Body: Inter or Geist Sans (regular)
- Code: JetBrains Mono or Fira Code

### Motion
- Use library's animation presets
- Respect prefers-reduced-motion
- Stagger animations on scroll

---

## CTAs Implementation

### 1. Email Signup (Early Access)

**Component:** Modal or inline form
**Fields:** Email only (frictionless)
**Action:**
```typescript
// app/actions/subscribe.ts
'use server'
import { Resend } from 'resend'

export async function subscribeToEarlyAccess(email: string) {
  const resend = new Resend(process.env.RESEND_API_KEY)

  // Add to audience list
  await resend.contacts.create({
    email,
    audienceId: process.env.RESEND_AUDIENCE_ID,
  })

  // Send confirmation email
  await resend.emails.send({
    from: 'Code Clarity <noreply@codeclarity.ai>',
    to: email,
    subject: 'Welcome to Code Clarity Early Access',
    html: '...'
  })
}
```

**Success State:** Show animated success message with `<FeedbackAnimation variant="success" />`

### 2. Contact Form (info@codeclarity.ai)

**Component:** Full contact form
**Fields:** Name, Email, Company, Message, Interest Type
**Action:**
```typescript
// app/actions/contact.ts
'use server'
import { Resend } from 'resend'

export async function sendContactForm(data: ContactFormData) {
  const resend = new Resend(process.env.RESEND_API_KEY)

  await resend.emails.send({
    from: 'Code Clarity Contact Form <noreply@codeclarity.ai>',
    to: 'info@codeclarity.ai',
    replyTo: data.email,
    subject: `[${data.interestType}] New inquiry from ${data.name}`,
    html: formatContactEmail(data)
  })
}
```

---

## File Structure (New Site)

```
app/
├── layout.tsx              # Root layout with ThemeProvider
├── page.tsx                # Landing page
├── components/
│   ├── page.tsx            # Component showcase
│   └── [slug]/
│       └── page.tsx        # Individual component docs
├── pricing/
│   └── page.tsx            # Pricing page
├── contact/
│   └── page.tsx            # Contact form
├── docs/
│   └── page.tsx            # Quick start docs
└── actions/
    ├── subscribe.ts        # Email signup action
    └── contact.ts          # Contact form action

components/
├── landing/
│   ├── Hero.tsx            # Hero with live demo
│   ├── StatsBar.tsx        # Animated stats
│   ├── Features.tsx        # Feature cards
│   ├── Comparison.tsx      # Comparison table
│   └── CTASection.tsx      # Bottom CTAs
├── showcase/
│   ├── ComponentCard.tsx   # Component preview card
│   ├── LiveDemo.tsx        # Interactive demo wrapper
│   └── CodeExample.tsx     # Code snippets
├── forms/
│   ├── EmailSignup.tsx     # Email signup form/modal
│   └── ContactForm.tsx     # Full contact form
├── ui/                     # Copied from library
│   ├── clarity-chat.tsx
│   ├── token-budget-bar.tsx
│   ├── code-block.tsx
│   └── ...
└── layout/
    ├── Header.tsx
    ├── Footer.tsx
    └── Navigation.tsx
```

---

## Implementation Phases

### Phase 1: Foundation (Core Pages)
- [ ] Set up new site structure
- [ ] Implement landing page layout
- [ ] Create Header/Footer/Navigation
- [ ] Set up ThemeProvider with dark mode
- [ ] Configure Resend for email actions

### Phase 2: Hero & Stats
- [ ] Build Hero section with placeholder chat demo
- [ ] Implement animated StatsBar
- [ ] Create feature cards grid
- [ ] Build comparison table

### Phase 3: Component Demos
- [ ] Copy essential library components
- [ ] Create LiveDemo wrapper component
- [ ] Build component showcase page
- [ ] Implement 5-10 interactive demos

### Phase 4: CTAs & Forms
- [ ] Build EmailSignup component (modal + inline)
- [ ] Create ContactForm page
- [ ] Wire up Resend server actions
- [ ] Add success/error states with animations

### Phase 5: Polish
- [ ] Add scroll animations
- [ ] Implement accessibility features
- [ ] SEO optimization (meta tags, OG images)
- [ ] Performance optimization
- [ ] Mobile responsiveness

---

## SEO & Meta

```tsx
// app/layout.tsx
export const metadata = {
  title: 'Code Clarity - AI Chat Components for React',
  description: 'Ship AI chat UIs in minutes with 200+ production-ready React components. Built-in token optimization saves 60-90% on AI costs.',
  keywords: ['AI chat', 'React components', 'chat UI', 'LLM', 'token optimization'],
  openGraph: {
    title: 'Code Clarity - AI Chat Components',
    description: '200+ React components for AI chat interfaces',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Code Clarity',
    description: 'Ship AI Chat UIs in Minutes',
  },
}
```

---

## Key Differentiators to Emphasize

1. **"Not just a SDK - it's a complete UI platform"** - Unlike Vercel AI SDK which has 0 components
2. **"Save 60-90% on AI costs"** - Token optimization is unique
3. **"Zero-config memory"** - Built-in, not DIY
4. **"WCAG AAA out of the box"** - Accessibility leader
5. **"200+ components, 95+ hooks"** - Completeness

---

## Success Metrics

- Email signups (early access list growth)
- Contact form submissions
- Time on demo interactions
- Page scroll depth
- GitHub traffic from site

---

## Next Steps

1. Approve this plan
2. Clone the code-clarity-site repo
3. Begin Phase 1 implementation
4. Iterate based on feedback
