# Quick Start Testing Guide

**Ready to test the integrated docs-site!**

## 🚀 Quick Start

### 1. Start Development Server
```bash
cd apps/docs-site
pnpm dev
```

Then visit:
- Blog: http://localhost:3000/blog
- Commercial: http://localhost:3000/commercial
- Guides: http://localhost:3000/guides

### 2. Test Key Pages

**Blog:**
- http://localhost:3000/blog
- http://localhost:3000/blog/ai-chat-ux-pain-points-and-solutions

**Commercial:**
- http://localhost:3000/commercial
- http://localhost:3000/commercial/pricing
- http://localhost:3000/commercial/enterprise

**Guides:**
- http://localhost:3000/guides/installation
- http://localhost:3000/guides/hooks
- http://localhost:3000/guides/error-handling

### 3. Verify Build
```bash
cd apps/docs-site
pnpm build
```

### 4. Test Production
```bash
cd apps/docs-site
pnpm start
```

## ✅ What to Check

- [ ] All pages load
- [ ] Navigation works
- [ ] Markdown renders correctly
- [ ] Code blocks work
- [ ] Links work
- [ ] Responsive design
- [ ] Dark mode

## 📝 See Also

- `apps/docs-site/VERIFICATION_CHECKLIST.md` - Complete checklist
- `FINAL_STATUS_COMPLETE.md` - Final status
