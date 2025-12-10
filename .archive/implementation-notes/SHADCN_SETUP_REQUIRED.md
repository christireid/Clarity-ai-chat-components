# ⚠️ CRITICAL: Setup Requirements for shadcn/ui Components

## BEFORE YOU USE SHADCN COMPONENTS

The shadcn/ui components **will not work** without proper setup. You MUST complete these steps:

### 1. CSS Variables Required

Add these CSS variables to your global CSS file (e.g., `globals.css` or `app.css`):

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 48%;
  }
}
```

**Check:** Run this in your browser console after importing a component:
```javascript
getComputedStyle(document.documentElement).getPropertyValue('--primary')
// Should return a value like "221.2 83.2% 53.3%"
// If empty, CSS variables are not set up!
```

### 2. Tailwind Config Required

Your `tailwind.config.js` MUST include:

```javascript
module.exports = {
  darkMode: ['class'],
  content: [
    // Your content paths
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        // ... (see full config in /workspace/tailwind.config.js)
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
}
```

**Check:** Verify Tailwind processes your styles correctly.

### 3. TooltipProvider Required

Wrap your app with `ShadcnTooltipProvider` **once** at the root:

```tsx
import { ShadcnTooltipProvider } from '@clarity-chat/primitives'

function App() {
  return (
    <ShadcnTooltipProvider>
      {/* Your app */}
    </ShadcnTooltipProvider>
  )
}
```

**Without this:** Tooltips will throw errors or not work.

### 4. Peer Dependencies

Ensure these are installed:

```json
{
  "peerDependencies": {
    "react": ">=19.0.0",
    "react-dom": ">=19.0.0"
  }
}
```

**Check for conflicts:**
```bash
pnpm list @radix-ui/react-dialog
# If you see multiple versions, you have a conflict
```

## Common Errors

### Error: "Cannot read properties of undefined"

**Cause:** CSS variables not defined

**Fix:** Add CSS variables to your global CSS file

### Error: Tooltip doesn't appear

**Cause:** Missing `TooltipProvider`

**Fix:** Wrap your app in `<ShadcnTooltipProvider>`

### Error: Styles look broken

**Cause:** Tailwind config not set up correctly

**Fix:** Verify your tailwind.config.js includes the color extensions

### Error: Bundle size exploded

**Cause:** Tree-shaking not working or importing from wrong path

**Fix:** Import specific components, not `import * as`

## Verification Checklist

Before using shadcn/ui components in production:

- [ ] CSS variables added to global CSS
- [ ] Tailwind config updated with color extensions
- [ ] TooltipProvider wrapped at app root (if using tooltips)
- [ ] Tested one component renders correctly
- [ ] Checked browser console for errors
- [ ] Verified dark mode works (if needed)
- [ ] Measured bundle size impact
- [ ] No peer dependency warnings

## Testing a Component

Quick test to verify setup:

```tsx
import { ShadcnButton } from '@clarity-chat/primitives'

export function Test() {
  return (
    <div className="p-8">
      <ShadcnButton 
        variant="default" 
        onClick={() => console.log('Clicked!')}
      >
        Test Button
      </ShadcnButton>
      <ShadcnButton variant="outline" className="ml-2">
        Outline
      </ShadcnButton>
    </div>
  )
}
```

**Expected Result:**
- Button has proper colors (not invisible)
- Hover states work
- Click triggers console.log
- No errors in console

**If broken:**
- Check CSS variables are defined
- Check Tailwind is processing styles
- Check React DevTools for errors

## Need Help?

1. Check `/workspace/tailwind.config.js` for reference config
2. See shadcn/ui docs: https://ui.shadcn.com
3. File an issue with:
   - Browser console errors
   - Screenshot of broken component
   - Your tailwind.config.js
   - Your global CSS file
