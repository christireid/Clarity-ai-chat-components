# Site Revamp - Merged Implementation

This folder contains the complete merged implementation combining:
1. The awwwards-worthy UI refactor with 3D particle animations
2. Component library focused content and stats

## Key Features

### Visual Enhancements
- 3D particle field animation with React Three Fiber
- Premium glassmorphism design system
- Framer Motion animations throughout
- Smooth scroll with Lenis
- Increased contrast for hero animations

### Component Library Focus
- Stats: 200+ Components, 95+ Hooks, 15 Themes, 60-90% Cost Savings
- Removed testimonials (replaced with library highlights)
- WCAG AAA accessibility emphasis
- 100% TypeScript highlight

### Two CTAs
1. **Email Signup** - For early access notifications
2. **Contact Form** - Sends to info@codeclarity.ai

## How to Apply

Copy these files to your `code-clarity-site` repository:

```bash
# From the code-clarity-site directory:
cp -r site-revamp-merged/app/* app/
cp -r site-revamp-merged/components/* components/
cp -r site-revamp-merged/lib/* lib/
cp site-revamp-merged/package.json package.json
npm install
```

## New Dependencies

The UI refactor added these dependencies:
- `@react-three/fiber` - React renderer for Three.js
- `@react-three/drei` - Useful helpers for R3F
- `three` - 3D library
- `framer-motion` - Animation library
- `gsap` - Animation library
- `lenis` - Smooth scroll

## Animation Contrast Changes

The hero animation contrast was increased for better visibility:
- Gradient orbs: opacity 0.4 → 0.7, blur 80px → 60px
- Particles: size 0.08 → 0.12, opacity 0.8 → 1
- Connection lines: opacity 0.15 → 0.3
- Glowing orbs: opacity 0.1 → 0.25

## Pages Structure

```
app/
├── page.tsx                    # Landing page with all sections
├── pricing/page.tsx            # Dedicated pricing page
├── services/
│   ├── page.tsx               # Services overview
│   ├── ai-development/        # AI development service
│   ├── token-optimization/    # Token optimization service
│   └── documentation/         # Documentation service

components/
├── marketing/
│   ├── hero-section.tsx       # 3D particle hero
│   ├── trust-block.tsx        # Stats (no testimonials)
│   ├── features-bento.tsx     # Feature grid
│   ├── chat-demo-section.tsx  # Interactive demo
│   ├── pricing-section.tsx    # Pricing table
│   ├── contact-section.tsx    # Contact form
│   └── final-cta-section.tsx  # Bottom CTA
├── three/
│   └── particle-field.tsx     # 3D particle system
└── providers/
    └── smooth-scroll-provider.tsx
```
