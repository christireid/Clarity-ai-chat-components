# Streamlined Docs Site

> **Content-empty, render-perfect documentation shell**
>
> This is a streamlined variant of the main Clarity Chat documentation site, created as a design-first, structure-first, rendering-first shell with zero documentation content.

## 🎯 Purpose

This site is a **complete documentation shell** with:

- ✅ Finalized information architecture
- ✅ Perfect navigation and routing
- ✅ Complete layout system
- ✅ Design system consistency
- ✅ Deterministic rendering behavior
- ✅ Zero layout shift
- ✅ WCAG AA accessibility
- ✅ Performance-optimized
- ❌ **No documentation content**

## 🚀 Technical Stack

- **Next.js 16** with App Router and React Server Components
- **React 19** with streaming and Server Components
- **TypeScript** throughout
- **Tailwind CSS** with glassmorphism design system
- **Framer Motion** for smooth animations
- **MDX** for future content integration

## 📁 Structure

```
apps/streamlined-docs/
├── app/                    # Next.js app directory
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Homepage
│   ├── providers.tsx       # Theme and MDX providers
│   ├── not-found.tsx       # Custom 404 page
│   └── [sections]/         # Section-specific routes
├── components/
│   ├── Layout/             # Page layouts and shells
│   ├── Navigation/         # Navigation components
│   └── MDX/                # MDX components (empty-state ready)
├── lib/                    # Utilities and navigation config
└── .streamlined-docs/      # Design and tracking docs
```

## 🛠️ Development

```bash
# Install dependencies (from root)
pnpm install

# Run development server
pnpm --filter @clarity-chat/streamlined-docs dev

# Build for production
pnpm --filter @clarity-chat/streamlined-docs build
```

The site will be available at `http://localhost:3000`

## 📋 Status

**Current Phase:** See `.streamlined-docs/progress.json`

All design decisions, information architecture, navigation design, layout system, and rendering validations are documented in the `.streamlined-docs/` directory.

## 🎨 Design Principles

1. **Design-First**: Visual and UX perfection before content
2. **Render-Correct**: Deterministic rendering in all modes (SSR/CSR/streaming)
3. **Zero Layout Shift**: Stable layout before, during, and after content load
4. **Performance-Aware**: Minimal re-renders, optimized bundle, instant navigation
5. **Accessibility-Mandatory**: WCAG AA compliance enforced

## 🚫 Constraints

- **No documentation content** - intentionally removed
- **No placeholder prose** - only structural scaffolding
- **No broken routes** - all invalid routes return styled 404
- **No layout drift** - consistent design system throughout
- **No render jank** - performance-optimized shell

## 🔮 Future

This shell is ready for content integration without structural or rendering changes. Content can be added dynamically without affecting layout stability or performance.

## 📄 License

MIT - See [LICENSE](../../LICENSE)
