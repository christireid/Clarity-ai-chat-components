# Site Revamp Implementation

This folder contains the complete implementation for revamping the Code Clarity business site to showcase the Clarity Chat component library.

## How to Apply

Copy these files to your `code-clarity-site` repository:

```bash
# From the code-clarity-site directory:
cp -r site-revamp/app/* app/
cp site-revamp/*.tsx components/
```

Then delete the old unused components:
```bash
rm components/about-section.tsx
rm components/approach-section.tsx
rm components/faq-section.tsx
rm components/final-impact-section.tsx
rm components/problem-section.tsx
rm components/process-section.tsx
rm components/services-section.tsx
```

## New Site Structure

```
app/
├── layout.tsx              # Updated metadata for Clarity Chat
├── page.tsx                # New landing page
├── components/
│   └── page.tsx            # Component showcase page
├── pricing/
│   └── page.tsx            # Pricing page
└── actions/
    ├── send-email.tsx      # Existing contact form action
    └── subscribe.ts        # NEW: Email signup action

components/
├── hero-section.tsx        # Updated hero with chat demo
├── stats-section.tsx       # NEW: Animated stats bar
├── features-section.tsx    # NEW: 6 feature cards with demos
├── comparison-section.tsx  # NEW: Comparison table
├── cta-section.tsx         # NEW: Dual CTA section
├── contact-form.tsx        # Updated contact form
├── email-signup-modal.tsx  # NEW: Email signup modal
├── navigation.tsx          # Updated navigation
└── footer.tsx              # Updated footer
```

## Key Features

### Two CTAs
1. **Email Signup** - Modal + inline forms for early access list
2. **Contact Form** - Sends to info@codeclarity.ai

### Stats Displayed
- 200+ Components
- 95+ Hooks
- 15 Themes
- 60-90% Cost Savings

### Pages
- `/` - Landing page with hero demo, stats, features, comparison, CTAs
- `/components` - Component showcase with code examples
- `/pricing` - Free/Pro/Enterprise pricing tiers

## Environment Variables

For the email functionality to work in production, set these in your Vercel/deployment environment:

```env
RESEND_API_KEY=your_resend_api_key
RESEND_AUDIENCE_ID=your_audience_id  # Optional, for contact list
```

## Dependencies

No new dependencies required - the site uses existing:
- React 19
- Next.js 14
- Tailwind CSS 4
- Radix UI components
- Lucide React icons
- Resend (for email)
