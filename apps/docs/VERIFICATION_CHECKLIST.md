# Content Integration Verification Checklist

**Date:** November 11, 2025  
**Status:** Ready for Testing

---

## ✅ Pre-Build Checks

- [x] All blog pages created
- [x] All commercial pages created
- [x] All guide pages created (36 guides)
- [x] Navigation updated
- [x] No linting errors
- [x] Temporary scripts cleaned up
- [x] Content files verified

---

## 🧪 Testing Checklist

### Development Server
- [ ] Start dev server: `cd apps/docs-site && pnpm dev`
- [ ] Test blog index: `http://localhost:3000/blog`
- [ ] Test blog posts:
  - [ ] `/blog/ai-chat-ux-pain-points-and-solutions`
  - [ ] `/blog/the-7-ux-disasters-killing-ai-chat-apps`
  - [ ] `/blog/the-7-ux-disasters-killing-ai-chat-apps-v2`
  - [ ] `/blog/viral-strategies-research`
- [ ] Test commercial index: `http://localhost:3000/commercial`
- [ ] Test commercial pages:
  - [ ] `/commercial/pricing`
  - [ ] `/commercial/case-studies`
  - [ ] `/commercial/terms`
  - [ ] `/commercial/privacy`
  - [ ] `/commercial/enterprise`
- [ ] Test guide pages (sample):
  - [ ] `/guides/installation`
  - [ ] `/guides/hooks`
  - [ ] `/guides/error-handling`
  - [ ] `/guides/memory`
  - [ ] `/guides/theming`
  - [ ] `/guides/components`

### Navigation
- [ ] Main navigation shows Blog and Commercial links
- [ ] Blog link works
- [ ] Commercial link works
- [ ] Guide links in sidebar work
- [ ] Breadcrumbs appear on all pages
- [ ] Back navigation works

### Content Rendering
- [ ] Markdown renders correctly (headings, paragraphs, lists)
- [ ] Code blocks render with syntax highlighting
- [ ] Callout components work
- [ ] Links work (internal and external)
- [ ] Images load (if any)
- [ ] Tables render correctly

### Responsive Design
- [ ] Pages work on mobile
- [ ] Pages work on tablet
- [ ] Pages work on desktop
- [ ] Navigation menu works on mobile

### Dark Mode
- [ ] Pages render correctly in light mode
- [ ] Pages render correctly in dark mode
- [ ] Theme toggle works

### Build Verification
- [ ] Run: `cd apps/docs-site && pnpm build`
- [ ] Build completes without errors
- [ ] All pages generate successfully
- [ ] No TypeScript errors
- [ ] No missing dependencies

### Production Build
- [ ] Run: `cd apps/docs-site && pnpm start`
- [ ] Test pages in production mode
- [ ] Verify all routes work
- [ ] Check console for errors

---

## 🐛 Common Issues to Check

### Missing Content Files
If a page shows "Content not available":
- Check if markdown file exists in `content/` directory
- Verify file path matches the slug
- Check file permissions

### MDX Rendering Issues
If markdown doesn't render:
- Check for syntax errors in markdown
- Verify MDX components are imported correctly
- Check console for parsing errors

### Navigation Issues
If links don't work:
- Verify href paths match actual routes
- Check navigation.ts for correct paths
- Verify route structure matches file structure

### Build Errors
If build fails:
- Check for TypeScript errors
- Verify all imports are correct
- Check for missing dependencies
- Verify file paths are correct

---

## 📝 Notes

### File Paths
- Blog content: `content/blog/[slug].md`
- Commercial content: `content/commercial/[filename].md`
- Enterprise content: `content/guides-migration/enterprise/[filename].md`
- Guide content: `content/vitepress-migration/guide/[guide-name].md`

### Route Structure
- Blog: `/blog` (index), `/blog/[slug]` (posts)
- Commercial: `/commercial` (index), `/commercial/[slug]` (pages)
- Guides: `/guides/[guide-name]` (all guides)

### Dependencies
- `next-mdx-remote` - For MDX rendering
- `@mdx-js/react` - MDX support
- `@next/mdx` - Next.js MDX integration

---

## ✅ After Verification

Once all tests pass:
1. ✅ Mark verification complete
2. ✅ Document any issues found
3. ✅ Fix any bugs
4. ✅ Re-test
5. ✅ Proceed with cleanup (see `CLEANUP_PLAN.md`)

---

**Ready for testing!** 🚀
