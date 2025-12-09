# Visual Verification Guide - Animated Background

## Quick Visual Check

### What to Look For

1. **Home Page Load**
   - Navigate to the home page (`/`)
   - Animated background should appear behind all content
   - Particles should be moving smoothly

2. **Dark Mode**
   - Switch to dark mode
   - Particles should be **bright blue** (brand-400: #60a5fa)
   - Connecting lines should be **blue** (brand-500: #3b82f6)
   - Should see ~50 glowing nodes with connections
   - Particles should **repulse** when you hover over them

3. **Light Mode**
   - Switch to light mode
   - Particles should be **lighter blue** (brand-300: #93c5fd)
   - Connecting lines should be **very light blue** (brand-200: #bfdbfe)
   - Should see ~40 subtle nodes with soft connections
   - Particles should **grab** (connect) when you hover

4. **Interactivity**
   - **Hover**: Particles should react (repulse in dark, grab in light)
   - **Click**: Should add new particles (push mode)
   - **Resize**: Should adapt to window size changes

5. **Performance**
   - Animation should be smooth (60fps)
   - No jank or stuttering
   - CPU usage should be reasonable
   - Animation should pause when tab is hidden

6. **Accessibility**
   - Enable "Reduce Motion" in OS settings
   - Background should **not appear** (returns null)
   - Content should still be fully accessible

## Browser Testing Checklist

### Chrome/Edge
- [ ] Background renders correctly
- [ ] Dark mode works
- [ ] Light mode works
- [ ] Interactions work (hover, click)
- [ ] Performance is smooth
- [ ] No console errors

### Firefox
- [ ] Background renders correctly
- [ ] Theme switching works
- [ ] Interactions work
- [ ] Performance acceptable

### Safari
- [ ] Background renders correctly
- [ ] Theme switching works
- [ ] Interactions work
- [ ] No visual glitches

### Mobile (iOS Safari / Chrome Mobile)
- [ ] Background renders (may be simplified)
- [ ] Touch interactions work
- [ ] Performance acceptable
- [ ] No layout issues

## Visual Aesthetics

### Dark Mode Should Show
- ✨ Glowing blue nodes (cyberpunk/tech aesthetic)
- 🔗 Connecting lines between nearby particles
- 🌊 Smooth flowing motion
- 💫 Particles that pulse and glow

### Light Mode Should Show
- 🌸 Subtle light blue nodes
- 🕸️ Soft connecting mesh
- 🌊 Gentle flowing motion
- ✨ Delicate particle effects

## Performance Indicators

### Good Performance ✅
- Smooth 60fps animation
- No frame drops
- Low CPU usage (<10% on modern devices)
- Responsive interactions
- No memory leaks (check DevTools)

### Performance Issues ⚠️
- Stuttering animation
- High CPU usage (>20%)
- Delayed interactions
- Memory growth over time

## Common Issues & Solutions

### Background Not Showing
1. Check browser console for errors
2. Verify `@tsparticles` packages installed
3. Check if `prefers-reduced-motion` is enabled
4. Verify theme provider is set up

### Performance Issues
1. Check particle count (should be 50 dark / 40 light)
2. Verify 60fps limit is active
3. Check if Page Visibility API is working
4. Monitor memory in DevTools

### Theme Not Switching
1. Verify `next-themes` is configured
2. Check ThemeProvider wraps the app
3. Verify theme detection logic

### Visual Glitches
1. Check z-index (-z-10)
2. Verify pointer-events: none
3. Check for CSS conflicts
4. Verify fixed positioning

## Verification Commands

```bash
# Run tests
cd apps/docs
pnpm test components/Layout/__tests__/AnimatedBackground.test.tsx

# Check types
pnpm typecheck

# Lint
pnpm lint

# Start dev server
pnpm dev
```

## Expected Behavior

### Initial Load
1. Component mounts
2. Checks for reduced motion preference
3. Initializes particle engine (async)
4. Renders particles after initialization
5. Sets up event listeners

### Theme Switch
1. Theme changes detected
2. Config switches (dark ↔ light)
3. Particles update colors/behavior
4. Smooth transition

### Tab Hidden/Visible
1. Tab hidden → Animation pauses
2. Tab visible → Animation resumes
3. No performance impact when hidden

### Reduced Motion
1. Preference detected
2. Component returns null
3. No animation rendered
4. Content remains accessible

## Success Criteria

✅ **Visual Verification Passes If:**
- Background appears on home page
- Dark mode shows glowing blue particles
- Light mode shows subtle particles
- Interactions work (hover, click)
- Performance is smooth (60fps)
- Reduced motion disables animation
- No console errors
- No visual glitches

---

**Last Verified**: 2025-01-27  
**Status**: Ready for Visual Verification
