# Migration Guide: v1.x → v2.0

**Last Updated**: November 3, 2025  
**Breaking Changes**: Minimal  
**Estimated Migration Time**: 30-60 minutes

---

## Overview

Version 2.0 introduces a comprehensive design token system, enhanced animations, and improved component APIs. Most changes are **visual improvements** that require no code changes. This guide covers the few breaking changes and new features.

---

## ⚠️ Breaking Changes

### 1. Shadow Values Changed

**Before (v1.x):**
```tsx
<Card className="shadow-[0_18px_38px_rgba(15,23,42,0.16)]" />
```

**After (v2.0):**
```tsx
<Card className="shadow-lg" />
```

**Impact**: Visual only - no functional changes  
**Migration**: Replace hardcoded shadows with design system tokens

### 2. ChatWindow Props Added (Backward Compatible)

**New Optional Props:**
```typescript
showHeader?: boolean           // NEW - default: false
sessionTitle?: string          // NEW - default: 'Chat Session'
sessionSubtitle?: string       // NEW
showMessageCount?: boolean     // NEW - default: false
onExport?: () => void          // NEW
onClear?: () => void           // NEW
headerActions?: React.ReactNode // NEW
```

**Impact**: None if not used  
**Migration**: Optional - add if you want new features

### 3. Badge Props Enhanced

**New Optional Props:**
```typescript
size?: 'sm' | 'default' | 'lg'  // NEW - default: 'default'
pulse?: boolean                 // NEW - default: false
glow?: boolean                  // NEW - default: false
```

**Impact**: None if not used  
**Migration**: Optional - use new features if desired

### 4. Avatar Props Enhanced

**New Optional Props:**
```typescript
size?: 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl'  // Added 'xs' and '2xl'
hoverable?: boolean             // NEW - default: false
statusBadge?: React.ReactNode   // NEW
```

**Impact**: None if not used  
**Migration**: Optional - use new sizes/features if desired

---

## 🎨 Visual Changes (No Code Required)

### Automatically Improved

These improvements happen automatically when you upgrade to v2.0:

✅ **Better Focus States** - All inputs have ring-2 focus rings  
✅ **Colored Shadows** - Success/error states have colored shadows  
✅ **Smooth Animations** - Standard 200ms timing throughout  
✅ **Better Hover Effects** - Consistent lift + shadow enhancement  
✅ **Icon Consistency** - All icons updated to SVG  
✅ **Error Messages** - Now include warning icons  

### Components with Visual Improvements

| Component | v1.x | v2.0 |
|-----------|------|------|
| Badge | Basic | Pulse, glow, sizes |
| Avatar | Simple | Status pulse, hover |
| Input | Basic focus | Ring + colored shadow |
| Textarea | Basic | Ring + success variant |
| Dialog | Standard | Better backdrop blur |
| Drawer | Standard | Improved shadows |
| Message | Good | Enhanced feedback |
| ChatWindow | Basic | Rich header features |
| ToolInvocationCard | Hardcoded | Design system |
| CitationCard | Hardcoded shadows | Token-based |
| ContextCard | Emoji icons | SVG icons |
| SessionSummaryCard | Static | Stagger animations |
| CommandPalette | Good | Enhanced search |
| FollowUpSuggestions | Basic | Confidence badges |
| StreamingMessage | Hardcoded | Token-based |
| VoiceInput | Custom button | Button component |

---

## 🚀 New Features to Adopt

### ChatWindow Enhancements

**Enable the new header:**
```tsx
<ChatWindow
  messages={messages}
  isLoading={isLoading}
  onSendMessage={handleSend}
  // NEW FEATURES:
  showHeader
  sessionTitle="My Chat"
  sessionSubtitle="AI Assistant"
  showMessageCount
  onExport={handleExport}
  onClear={handleClear}
/>
```

**Benefits:**
- Professional appearance
- Built-in export functionality
- Clear conversation feature
- Message count at a glance

### Badge Pulse Animation

**Add pulse to live indicators:**
```tsx
<Badge variant="success" pulse>
  Online
</Badge>

<Badge variant="destructive" pulse>
  Alert
</Badge>
```

### Avatar Status Indicators

**Add status to avatars:**
```tsx
<Avatar
  src={user.avatar}
  status="online"  // or 'offline' | 'away' | 'busy'
  hoverable        // Adds scale effect
/>
```

### Input Focus Enhancements

**Now automatic - focus rings are enhanced:**
```tsx
<Input 
  variant="error"   // Red ring + shadow
  variant="success" // Green ring + shadow
  error="Invalid email" // Now shows icon + message
/>
```

---

## 📚 Design Token Usage

### Recommended Updates

**Replace Custom Shadows:**
```tsx
// Before
className="shadow-[0_10px_30px_rgba(0,0,0,0.1)]"

// After
className="shadow-lg"
```

**Use Semantic Colors:**
```tsx
// Before
className="bg-green-500 text-white"

// After  
className="bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))]"
// Or better:
<Badge variant="success">Status</Badge>
```

**Use Z-Index Tokens:**
```tsx
// Before
className="z-50"

// After
className="z-[var(--z-modal)]"
```

---

## 🎯 Animation Updates

### Standard Timing

All components now use standard timing:
- **100ms** - Instant (micro-interactions)
- **150ms** - Fast (button taps)
- **200ms** - Normal (standard transitions) ← **DEFAULT**
- **300ms** - Slow (complex transitions)
- **500ms** - Slower (page transitions)

**No code changes needed** - this is automatic!

### Stagger Animations

Lists now stagger automatically in many components:
- FollowUpSuggestions
- SessionSummaryCard highlights
- CommandPalette groups
- MessageList (optional)

**No code changes needed** - this is automatic!

---

## ♿ Accessibility Improvements

### Automatically Enhanced

✅ **Focus Rings** - All interactive elements  
✅ **Keyboard Navigation** - Tab, Enter, Escape  
✅ **ARIA Labels** - Descriptive labels  
✅ **Error Messages** - Clear and visible  
✅ **Color Contrast** - WCAG AA compliant  

**No code changes needed** - built into components!

---

## 🔧 Troubleshooting

### Issue: Styles Look Different

**Cause**: New design tokens and shadows  
**Solution**: This is expected - v2.0 has a more polished appearance

### Issue: Animations Feel Different

**Cause**: Standard 200ms timing  
**Solution**: This is expected - consistent timing throughout

### Issue: Some Custom Styles Not Working

**Cause**: className props may be overridden by internal styles  
**Solution**: Use the component's variant props instead of custom classes

### Issue: TypeScript Errors on Props

**Cause**: New optional props added  
**Solution**: Update your TypeScript version to latest or ignore the error

---

## 📦 Step-by-Step Migration

### Step 1: Update Dependencies

```bash
npm install @clarity-chat/react@^2.0.0
npm install @clarity-chat/primitives@^2.0.0
npm install @clarity-chat/types@^2.0.0
```

### Step 2: Review Component Usage

Check if you're using any hardcoded shadows or colors:

```bash
# Find hardcoded shadows
grep -r "shadow-\[" your-app/

# Find hardcoded colors
grep -r "bg-blue-" your-app/
grep -r "text-red-" your-app/
```

### Step 3: Optional - Adopt New Features

Review new features and decide which to adopt:
- ChatWindow header
- Badge pulse animations
- Avatar status indicators
- Export/clear functionality

### Step 4: Test

```bash
npm run build
npm run test
```

### Step 5: Visual Review

- Check all pages in your app
- Verify animations are smooth
- Test dark mode
- Test mobile responsiveness

---

## 💡 Recommended Adoptions

### High Priority
1. ✅ Use ChatWindow showHeader for professional appearance
2. ✅ Add export/clear functionality
3. ✅ Use Badge pulse for live indicators
4. ✅ Replace any hardcoded shadows

### Medium Priority
1. ✅ Add Avatar status indicators
2. ✅ Use Input/Textarea success variants
3. ✅ Adopt stagger animations patterns

### Low Priority
1. ✅ Customize animation timing (if needed)
2. ✅ Add custom header actions
3. ✅ Explore new Badge sizes

---

## 📊 Migration Checklist

- [ ] Update package dependencies to v2.0
- [ ] Run build to check for TypeScript errors
- [ ] Replace hardcoded shadows with tokens (if any)
- [ ] Replace hardcoded colors with semantic variants (if any)
- [ ] Test all pages/features
- [ ] Review visual changes
- [ ] Test dark mode
- [ ] Test mobile responsiveness
- [ ] Update any custom styles that conflict
- [ ] Consider adopting new features
- [ ] Update documentation/examples
- [ ] Deploy to staging
- [ ] QA review
- [ ] Deploy to production

---

## 🎉 Benefits of Upgrading

### Visual Improvements
- ✨ More polished appearance
- ✨ Consistent animations
- ✨ Better feedback on interactions
- ✨ Professional-grade UI

### Developer Experience
- 🎯 Design token system
- 🎯 Better TypeScript types
- 🎯 Clear component APIs
- 🎯 Comprehensive documentation

### User Experience
- 💎 Smooth 60 FPS animations
- 💎 Better accessibility
- 💎 Clearer visual hierarchy
- 💎 Delightful micro-interactions

### Maintenance
- 🔧 Easier theming
- 🔧 Consistent codebase
- 🔧 Fewer bugs
- 🔧 Better long-term maintainability

---

## 🆘 Support

### Questions?
- Check component documentation
- Review Storybook examples
- See TROUBLESHOOTING.md

### Issues?
- File a GitHub issue
- Include version numbers
- Provide reproduction steps

### Need Help?
- Join our Discord community
- Check FAQ section
- Contact support team

---

## 🎯 Conclusion

Version 2.0 represents a **major leap forward** in quality, consistency, and developer experience. The migration is straightforward with minimal breaking changes.

**Estimated Migration Time**: 30-60 minutes for most applications

**Recommendation**: Upgrade to v2.0 as soon as possible to benefit from the improvements!

---

**Migration Guide Version**: 1.0  
**Last Updated**: November 3, 2025  
**For v2.0.0 Release**

