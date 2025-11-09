# 🔧 Troubleshooting Guide - v2.2

**Quick solutions to common issues**

---

## 🎯 **Quick Diagnostic**

**Run this first:**
```bash
node scripts/validate-v2.2-migration.js
```

This checks 30 things and tells you exactly what's wrong.

---

## ⚡ **Common Issues**

### **Issue 1: Components Look the Same as v2.1**

**Symptoms:**
- No visual changes after upgrade
- Shadows still heavy
- Borders still 2px
- Focus states still hard rings

**Causes:**
1. Not actually using v2.2.0
2. Build cache not cleared
3. Browser cache not cleared
4. Using old component copies

**Solutions:**

```bash
# 1. Verify version
npm list @clarity-chat/react
# Should show: @clarity-chat/react@2.2.0

# 2. Verify both packages if using primitives
npm list @clarity-chat/primitives
# Should show: @clarity-chat/primitives@2.2.0

# 3. Clear build cache
rm -rf .next/  # Next.js
# or
rm -rf dist/   # Vite
# or  
rm -rf build/  # CRA

# 4. Clear node_modules and reinstall
rm -rf node_modules
npm install

# 5. Clear browser cache
# Chrome: Cmd+Shift+Delete (Mac) or Ctrl+Shift+Delete (Windows)
# Or open DevTools > Network tab > Disable cache

# 6. Hard reload
# Chrome: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
```

**Verify Fix:**
```bash
# Check that theme.css has new variables
grep "shadow-xs" node_modules/@clarity-chat/react/dist/theme.css
# Should find: --shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.04);
```

---

### **Issue 2: Validation Script Fails**

**Symptoms:**
```
❌ @clarity-chat/react version is not 2.2.0
❌ Shadow tokens missing
❌ Component classes not updated
```

**Causes:**
1. Incomplete installation
2. Wrong package version
3. Corrupted node_modules

**Solutions:**

```bash
# 1. Clean install
rm -rf node_modules package-lock.json
npm install @clarity-chat/react@2.2.0 @clarity-chat/primitives@2.2.0
npm install

# 2. Verify package.json
cat package.json | grep "@clarity-chat"
# Should show: "@clarity-chat/react": "2.2.0"

# 3. Check actual installed version
npm list @clarity-chat/react
# If version mismatch, force install:
npm install @clarity-chat/react@2.2.0 --force

# 4. Re-run validation
node scripts/validate-v2.2-migration.js
```

**If still failing:**
```bash
# Ensure validation script exists
ls -la scripts/validate-v2.2-migration.js

# If missing, the script should be in your workspace
# Copy from documentation repository
```

---

### **Issue 3: Visual Tests Failing**

**Symptoms:**
- All visual regression tests show failures
- Screenshot diffs everywhere
- CI/CD pipeline red

**Causes:**
- v2.2 intentionally changed visuals
- Need to update baselines

**Solutions:**

**For Playwright:**
```bash
# Update all snapshots
npx playwright test --update-snapshots

# Or specific test
npx playwright test button.spec.ts --update-snapshots
```

**For Chromatic:**
```bash
# Run and accept changes
npm run chromatic -- --auto-accept-changes
```

**For Percy:**
```bash
# Approve via Percy dashboard
# Or run with auto-approve
npx percy snapshot --auto-approve
```

**For BackstopJS:**
```bash
# Update references
npm run backstop reference

# Then test
npm run backstop test
```

**See [`V2.2_VISUAL_REGRESSION_GUIDE.md`](./V2.2_VISUAL_REGRESSION_GUIDE.md) for complete instructions.**

---

### **Issue 4: Focus States Not Visible**

**Symptoms:**
- Tab through components, no focus indicator
- Focus states invisible or very faint
- Accessibility concerns

**Causes:**
1. Browser doesn't support :focus-visible
2. Custom CSS overriding focus styles
3. Wrong color scheme
4. OS accessibility settings

**Solutions:**

```bash
# 1. Check browser support
# All modern browsers support :focus-visible
# Update browser if needed

# 2. Check for CSS overrides
# Search your codebase for:
grep -r "focus-visible" src/
grep -r "outline: none" src/

# Remove any global focus-visible overrides
```

**In your CSS:**
```css
/* BAD - Don't do this */
*:focus-visible {
  outline: none !important;
}

/* GOOD - Let v2.2 handle it */
/* Remove focus-visible overrides */
```

**Verify focus is working:**
```tsx
import { Button } from '@clarity-chat/primitives'

// Tab to this button - you should see a soft glow
<Button>Test Focus</Button>
```

**If still not visible:**
```bash
# Check your custom theme doesn't override focus
# Look in your tailwind.config.js or global CSS
```

---

### **Issue 5: Dark Mode Looks Wrong**

**Symptoms:**
- Dark mode shadows too light or too heavy
- Colors look off
- Contrast issues

**Causes:**
1. Dark mode class not applied
2. Custom theme overriding dark mode
3. Old v2.1 dark mode tokens cached

**Solutions:**

```bash
# 1. Verify dark mode class is applied
# Should see class="dark" on html or body element
# Check your theme toggle implementation

# 2. Clear all caches
rm -rf .next/ dist/ build/
npm run build

# 3. Hard reload browser (Cmd+Shift+R / Ctrl+Shift+R)
```

**In your app:**
```tsx
// Ensure dark mode is toggling correctly
<html className={isDark ? 'dark' : 'light'}>
  {/* Your app */}
</html>
```

**Check v2.2 dark mode variables:**
```bash
# Should see dark mode shadows with higher opacity
grep "\.dark" node_modules/@clarity-chat/react/dist/theme.css
# Look for: .dark { --shadow-xs: ... }
```

---

### **Issue 6: Animations Janky / Not Smooth**

**Symptoms:**
- Hover effects stutter
- Transitions look choppy
- Not hitting 60fps

**Causes:**
1. Browser GPU acceleration disabled
2. Too many DOM elements
3. Expensive CSS properties being animated
4. DevTools performance throttling enabled

**Solutions:**

```bash
# 1. Check Chrome DevTools
# Performance tab > CPU > No throttling
# Disable "6x slowdown" if enabled

# 2. Ensure GPU acceleration
# In browser settings, enable hardware acceleration
```

**Check for expensive animations:**
```bash
# v2.2 only animates GPU-friendly properties:
# - transform
# - opacity
# - box-shadow (for focus)

# If you added custom animations, check they use these only
```

**Verify 60fps:**
```bash
# Open Chrome DevTools
# Performance > Record > Hover over buttons
# Should see solid green 60fps line
```

**Force GPU acceleration:**
```css
/* Add to slow elements */
.your-component {
  will-change: transform, opacity;
  /* Use sparingly - has memory cost */
}
```

---

### **Issue 7: TypeScript Errors After Upgrade**

**Symptoms:**
```
Type error: Cannot find module '@clarity-chat/react'
Property 'variant' does not exist
```

**Causes:**
1. TypeScript cache
2. IDE not reloaded
3. Type definitions not updated

**Solutions:**

```bash
# 1. Clear TypeScript cache
rm -rf node_modules/.cache

# 2. Restart TypeScript server
# In VS Code: Cmd+Shift+P > "TypeScript: Restart TS Server"

# 3. Rebuild
npm run build

# 4. Verify types exist
ls node_modules/@clarity-chat/react/dist/*.d.ts
# Should see type definition files

# 5. Restart IDE completely
```

---

### **Issue 8: Bundle Size Increased**

**Symptoms:**
- Build output shows larger bundle
- Page load time slower
- Lighthouse score decreased

**Causes:**
- Measurement error (v2.2 bundle same as v2.1)
- Other dependencies added
- Build configuration issue

**Solutions:**

```bash
# 1. Measure accurately
npm run build
# Note the size

# 2. Compare to v2.1
# v2.2 should be within 1-2KB (CSS changes only)

# 3. Check for duplicate dependencies
npm dedupe

# 4. Analyze bundle
npx webpack-bundle-analyzer  # for webpack
# or
npx vite-bundle-visualizer    # for Vite

# 5. Verify no duplicate @clarity-chat packages
npm list @clarity-chat/react
# Should only show one version
```

**Expected bundle sizes:**
- v2.1: ~45KB gzipped (CSS + JS)
- v2.2: ~45KB gzipped (same)

---

### **Issue 9: Can't Find Validation Script**

**Symptoms:**
```
Error: Cannot find module './scripts/validate-v2.2-migration.js'
```

**Causes:**
- Script not in your project
- Wrong directory

**Solutions:**

```bash
# 1. Check if script exists
ls scripts/validate-v2.2-migration.js

# 2. If missing, create it
mkdir -p scripts
```

**Copy script from documentation:**

See the validation script in [`UI_UX_IMPROVEMENTS_COMPLETE.md`](./UI_UX_IMPROVEMENTS_COMPLETE.md) or create manually:

```bash
# Or skip validation and manually verify:
# 1. Check package version
npm list @clarity-chat/react  # Should be 2.2.0

# 2. Check components visually
# Hover, focus, interact - verify refinements

# 3. Run tests
npm test
```

---

### **Issue 10: Badges Look Broken**

**Symptoms:**
- Badges have no background
- Text is too light/hard to read
- Looks completely different

**Causes:**
- This is intentional! v2.2 redesigned badges
- Need to verify it's correct, not broken

**Solutions:**

**Verify badges are correct:**

```tsx
// v2.2 badges should look like:
<Badge variant="default">
  {/* 
    - No border ✅
    - Transparent background (10% opacity) ✅
    - Colored text (primary color) ✅
    - No shadow ✅
  */}
  New
</Badge>
```

**This is the correct appearance.**

**If text is illegible:**
1. Check your theme colors (primary should have good contrast)
2. Verify you're not overriding badge styles
3. Check dark mode is working correctly

**If you prefer old style:**
```tsx
// Use outline variant for bordered look
<Badge variant="outline">
  New
</Badge>
```

**Or customize:**
```tsx
// Add custom classes
<Badge className="border border-border bg-primary/90 text-white">
  Custom Old Style
</Badge>
```

---

## 🛠️ **Advanced Troubleshooting**

### **Build Process Issues**

**Next.js:**
```bash
# Clear Next.js cache
rm -rf .next
npm run build
npm run dev
```

**Vite:**
```bash
# Clear Vite cache
rm -rf node_modules/.vite
npm run build
npm run dev
```

**Create React App:**
```bash
# Clear CRA cache
rm -rf node_modules/.cache
npm run build
npm start
```

**Webpack:**
```bash
# Clear webpack cache
rm -rf node_modules/.cache/webpack
npm run build
```

---

### **Environment Issues**

**Check Node version:**
```bash
node -v
# Should be 16+ or 18+ LTS
```

**Check npm version:**
```bash
npm -v
# Should be 8+
```

**Check for conflicting packages:**
```bash
npm list | grep clarity-chat
# Should only show v2.2.0
```

---

### **CSS Loading Issues**

**Verify CSS is imported:**
```tsx
// In your root _app.tsx or main.tsx
import '@clarity-chat/react/dist/theme.css'
```

**Check CSS file exists:**
```bash
ls node_modules/@clarity-chat/react/dist/theme.css
# Should exist
```

**View CSS content:**
```bash
cat node_modules/@clarity-chat/react/dist/theme.css | grep "shadow-xs"
# Should find v2.2 shadow definitions
```

---

## 📊 **Diagnostic Checklist**

Run through this checklist:

### **Installation**
- [ ] `npm list @clarity-chat/react` shows 2.2.0
- [ ] `npm list @clarity-chat/primitives` shows 2.2.0 (if used)
- [ ] `package.json` has correct versions
- [ ] `node_modules` contains v2.2.0

### **Build**
- [ ] Build succeeds without errors
- [ ] Build cache cleared
- [ ] Output includes theme.css
- [ ] Bundle size reasonable

### **Browser**
- [ ] Hard reload performed (Cmd+Shift+R)
- [ ] Browser cache cleared
- [ ] DevTools console has no errors
- [ ] Using modern browser (Chrome/Firefox/Safari latest)

### **Visual**
- [ ] Shadows are softer than v2.1
- [ ] Borders are lighter (1px)
- [ ] Focus states glow softly
- [ ] Hover lifts 1px
- [ ] Badges borderless with transparent bg

### **Functional**
- [ ] All unit tests pass
- [ ] All interactions work
- [ ] Accessibility maintained
- [ ] Performance good (60fps)

**All checked?** → v2.2 is working correctly! ✅

---

## 🚨 **Emergency Rollback**

**If you need to revert to v2.1:**

```bash
# Install previous version
npm install @clarity-chat/react@2.1.x @clarity-chat/primitives@2.1.x

# Clear caches
rm -rf .next/ dist/ build/ node_modules/.cache

# Rebuild
npm run build

# Restart dev server
npm run dev
```

**Then:**
1. Document what went wrong
2. File a GitHub issue with details
3. We'll help you fix it for v2.2

---

## 💬 **Getting Help**

### **Self-Service Resources**

**First, check these:**
1. [`❓_FAQ.md`](./❓_FAQ.md) - Frequently asked questions
2. [`UPGRADE_GUIDE_V2.2.md`](./UPGRADE_GUIDE_V2.2.md) - Complete upgrade guide
3. [`V2.2_TESTING_CHECKLIST.md`](./V2.2_TESTING_CHECKLIST.md) - Testing guide
4. Run `node scripts/validate-v2.2-migration.js` - Automated diagnostics

### **Community Support**

**Still stuck?**
- GitHub Discussions - Ask the community
- GitHub Issues - Report bugs
- Discord - Real-time help (if available)
- Stack Overflow - Tag with `clarity-chat`

### **Bug Reports**

**When filing an issue, include:**
```markdown
**Environment:**
- Clarity Chat version: 2.2.0
- React version: X.X.X
- Node version: X.X.X
- Browser: Chrome X.X.X
- OS: macOS / Windows / Linux

**Issue:**
[Clear description]

**Steps to Reproduce:**
1. ...
2. ...
3. ...

**Expected:**
[What should happen]

**Actual:**
[What actually happens]

**Screenshots:**
[If applicable]

**Validation Script Output:**
[Run and paste output]
```

---

## ✅ **Most Common Solutions**

**90% of issues are solved by:**

1. **Clear all caches:**
   ```bash
   rm -rf .next/ dist/ build/ node_modules/.cache
   ```

2. **Verify correct version:**
   ```bash
   npm list @clarity-chat/react  # Should be 2.2.0
   ```

3. **Hard reload browser:**
   ```bash
   Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
   ```

4. **Update visual test baselines:**
   ```bash
   npx playwright test --update-snapshots
   ```

5. **Read the FAQ:**
   [`❓_FAQ.md`](./❓_FAQ.md)

---

## 🎯 **Quick Reference**

| Problem | Solution |
|---------|----------|
| Looks same as v2.1 | Clear cache + hard reload |
| Validation fails | Verify version + reinstall |
| Tests failing | Update snapshots (expected) |
| Focus invisible | Check CSS overrides |
| Dark mode wrong | Check dark class applied |
| Animations janky | Enable GPU acceleration |
| TypeScript errors | Restart TS server |
| Bundle bigger | Verify measurement (should be same) |
| Missing script | Copy from docs or skip |
| Badges "broken" | Intentional redesign (correct) |

---

## 📞 **Still Stuck?**

**We're here to help!**

- **Documentation:** [`V2.2_MASTER_INDEX.md`](./V2.2_MASTER_INDEX.md)
- **FAQ:** [`❓_FAQ.md`](./❓_FAQ.md)
- **Testing:** [`V2.2_TESTING_CHECKLIST.md`](./V2.2_TESTING_CHECKLIST.md)
- **GitHub:** Open an issue with diagnostic details

**99% of issues are covered above.** Good luck! 🚀

---

**Remember:** v2.2 has zero breaking changes. If something doesn't work, it's likely a cache or installation issue, not a real bug. Clear caches, verify versions, and you'll be good! ✅
