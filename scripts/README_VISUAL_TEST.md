# Visual Test Script for shadcn/ui Components

This script creates a visual test page to validate all shadcn/ui components in a browser.

## Quick Start

```bash
./scripts/visual-test-shadcn.sh
```

Then open http://localhost:5173 in your browser.

## What It Does

1. ✅ Installs dependencies
2. ✅ Builds the primitives package
3. ✅ Creates a test app (if it doesn't exist)
4. ✅ Starts a development server
5. ✅ Opens your browser

## What You'll See

A test page with all shadcn/ui components:

- **Buttons:** All variants and sizes
- **Loading Button:** Enhanced with loading state
- **Dialog:** Modal system
- **Dropdown Menu:** With items
- **Popover:** Click to open
- **Tooltip:** Hover to see
- **Checkbox:** Toggle on/off
- **Drawer:** Slide-in panel

## Visual Checklist

✓ All buttons render correctly  
✓ Loading button shows spinner  
✓ Dialog opens and closes  
✓ Dropdown menu works  
✓ Popover appears on click  
✓ Tooltip shows on hover  
✓ Checkbox toggles  
✓ Drawer slides in  

## Troubleshooting

### "Command not found"
Make the script executable:
```bash
chmod +x ./scripts/visual-test-shadcn.sh
```

### "Port 5173 already in use"
Kill the existing process:
```bash
lsof -ti:5173 | xargs kill -9
```

### Components don't render
Check that CSS variables are set up correctly (see SHADCN_SETUP_REQUIRED.md).

### Tooltip doesn't work
The test app includes TooltipProvider. If you see this issue, it's a bug.

## Test App Location

`apps/examples/shadcn-visual-test/`

The script creates this automatically if it doesn't exist.

## Manual Testing

If the script doesn't work, manually test:

```bash
cd apps/examples/shadcn-visual-test
pnpm install
pnpm dev
```

## What This Validates

✅ **Visual Appearance:** Components look correct  
✅ **Styling:** CSS and Tailwind work  
✅ **Interactivity:** Click, hover, toggle work  
✅ **Loading State:** Enhanced Button feature  
✅ **Dark Mode:** (if you toggle it)  
✅ **Layout:** Components positioned correctly  

## Not Validated

❌ **Accessibility:** Use automated tools separately  
❌ **Browser Compatibility:** Test in target browsers  
❌ **Performance:** Use performance profiling tools  
❌ **Bundle Size:** Already measured (56% reduction)  

## After Testing

If everything looks good:
- ✅ Migration is visually validated
- ✅ Ready for production
- ✅ Ship it! 🚀

If issues found:
- 📝 Document the issue
- 🔧 Fix it
- 🔄 Re-test
- ✅ Ship it!

## Quick Commands

```bash
# Start test server
./scripts/visual-test-shadcn.sh

# Stop test server
Ctrl+C

# Rebuild primitives
pnpm build --filter @clarity-chat/primitives

# Clean and rebuild test app
rm -rf apps/examples/shadcn-visual-test
./scripts/visual-test-shadcn.sh
```

## Success Criteria

✅ All 8 component sections render  
✅ All buttons clickable  
✅ Loading button shows spinner  
✅ All overlays open/close  
✅ No console errors  
✅ Styles look correct  

**If all checked → Migration validated!** 🎉

---

**Last Updated:** December 6, 2025  
**Status:** ✅ Ready to use
