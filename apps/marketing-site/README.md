# Clarity Chat - Marketing Website

**Professional marketing site for Clarity Chat commercial product**

This Next.js application serves as the main marketing website for Clarity Chat, including:
- Landing page with hero, features, and CTAs
- Pricing page with tier comparison
- Interactive demos and examples
- Case studies and testimonials
- Documentation access
- Purchase flows

---

## Features

- **Modern Design** - Clean, professional UI with animations
- **SEO Optimized** - Meta tags, sitemap, structured data
- **Fast Performance** - Static generation where possible
- **Mobile Responsive** - Works on all devices
- **Conversion Focused** - Clear CTAs and purchase flows
- **Analytics Ready** - Google Analytics, PostHog integration

---

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Visit: [http://localhost:3001](http://localhost:3001)

---

## Pages

- `/` - Landing page (hero, features, social proof)
- `/pricing` - Pricing tiers and comparison
- `/features` - Detailed feature showcase
- `/case-studies` - Customer success stories
- `/docs` - Link to documentation
- `/demo` - Interactive demo
- `/enterprise` - Enterprise solutions
- `/about` - About the team
- `/contact` - Contact and support

---

## Environment Variables

```bash
# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_POSTHOG_KEY=phc_xxxxxxxxxxxx

# Email capture
NEXT_PUBLIC_CONVERTKIT_FORM_ID=xxxxx

# Demo/playground
NEXT_PUBLIC_DEMO_API_URL=https://api.clarity-chat.dev

# Feature flags
NEXT_PUBLIC_ENABLE_CHAT_WIDGET=true
NEXT_PUBLIC_ENABLE_BLOG=false
```

---

## Deployment

Optimized for Vercel:

```bash
# Deploy to Vercel
vercel --prod

# Or connect GitHub repo for automatic deployments
```

Also works with:
- Netlify
- Cloudflare Pages
- AWS Amplify
- Self-hosted (Docker)

---

## Content Management

Content is managed through:
- MDX files in `/content` directory
- Type-safe frontmatter
- Automatic sitemap generation
- RSS feed for blog

---

## Performance

- Lighthouse score: 95+
- First Contentful Paint: <1.5s
- Time to Interactive: <3s
- Static generation for most pages
- Image optimization with Next.js Image
- Code splitting and lazy loading

---

## SEO

- Dynamic meta tags per page
- Open Graph images
- Twitter Card support
- Sitemap.xml auto-generated
- Robots.txt configured
- Structured data (JSON-LD)

---

## Analytics Events Tracked

- Page views
- CTA clicks
- Pricing tier selections
- Demo interactions
- Documentation visits
- Email signups
- Purchase initiations

---

## License

MIT © 2024 Code & Clarity

