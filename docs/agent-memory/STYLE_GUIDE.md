# Clarity Docs Style Guide

## Design North Star
- Vercel Academy + shadcn/ui aesthetic
- TypingMind interaction confidence
- Prompt-Kit composability clarity
- ElevenLabs premium restraint

## Layout Grid
- **Container max-width:** 1280px
- **Content max-width:** 720px (for readability)
- **Sidebar width:** 280px
- **Spacing scale:** 4, 8, 12, 16, 24, 32, 48, 64, 96px

## Typography Tokens
- **Font family:** Inter (body), JetBrains Mono (code)
- **Heading 1:** 2.5rem/3rem, font-bold
- **Heading 2:** 2rem/2.5rem, font-semibold
- **Heading 3:** 1.5rem/2rem, font-semibold
- **Body:** 1rem/1.5rem, font-normal
- **Small:** 0.875rem/1.25rem
- **Code:** 0.875rem, font-mono

## Colors
- **Background:** slate-950 (dark), white (light)
- **Surface:** slate-900/80 (glassmorphism base)
- **Text primary:** slate-50 (dark), slate-900 (light)
- **Text secondary:** slate-400 (dark), slate-600 (light)
- **Accent:** blue-500
- **Success:** green-500
- **Warning:** amber-500
- **Error:** red-500

## Glassmorphism Rules
- **Blur:** 8-12px (subtle, never obscure content)
- **Border:** 1px solid rgba(255,255,255,0.1)
- **Background:** rgba(15,23,42,0.8) - slate-900 with opacity
- **Shadow:** subtle, diffuse (shadow-lg at most)

## Code Blocks
- **Background:** slate-900
- **Border:** 1px solid slate-800
- **Border radius:** 8px
- **Padding:** 16px
- **Line numbers:** optional, slate-600
- **Copy button:** top-right, subtle until hover
- **Overflow:** horizontal scroll, never wrap

## Component Patterns

### Demo Template
```
+----------------------------------+
| Tab Bar: Basic | Streaming | ... |
+----------------------------------+
| Preview Pane    |  Code Pane     |
| (left, 50%)     |  (right, 50%)  |
|                 |                |
+----------------------------------+
```

### Setup Required Card
- Clear icon
- Which keys needed
- Link to setup guide
- Graceful, not blocking

### Error States
- Human-readable message
- Suggested action
- Never technical jargon

## Animation Guidelines
- **Duration:** 150-200ms
- **Easing:** ease-out for enter, ease-in for exit
- **Purpose:** state change, attention guidance only
- **Never:** decorative loops, distracting motion

## Do Not
- Gratuitous gradients
- Heavy shadows
- Floating elements without containers
- Wall of content without breathing room
- Mystery meat UI
- Verbose copy
