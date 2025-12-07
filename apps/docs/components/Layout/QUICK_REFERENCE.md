# AnimatedBackground - Quick Reference Card

## 🚀 Quick Start

```tsx
import { AnimatedBackground } from '@/components/Layout/AnimatedBackground'

<AnimatedBackground />
```

## 📊 Status

- **Version:** 1.0.0
- **Tests:** 13/13 passing ✅
- **Coverage:** 92.85% ✅
- **Status:** Production Ready ✅

## 🎨 Features

- Dark/Light mode auto-switch
- Accessibility (prefers-reduced-motion)
- 60fps performance
- Interactive particles
- SSR-safe

## 🔧 Commands

```bash
pnpm test              # Run tests
pnpm test:coverage     # Coverage report
pnpm lint              # Lint check
```

## 📁 Files

- Component: `AnimatedBackground.tsx`
- Tests: `__tests__/AnimatedBackground.test.tsx`
- Docs: See `README.md`

## ⚙️ Configuration

**Dark Mode:** 50 particles, opacity 0.1-0.4  
**Light Mode:** 40 particles, opacity 0.05-0.25  
**Colors:** Blue palette (#3b82f6, #60a5fa, etc.)

## 🐛 Troubleshooting

**Not rendering?**
- Check `mounted` state
- Check `reducedMotion` preference
- Check browser console

**Performance issues?**
- Reduce particle count
- Lower fpsLimit
- Check Page Visibility API

## 📚 Full Docs

See `README.md` for complete documentation.
