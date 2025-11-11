# Theme Builder

Interactive tool for customizing and previewing the Clarity Chat Components theme.

## Features

- **Live Theme Editor** - Adjust colors, shadows, radius in real-time
- **Component Preview** - See changes across all components
- **Export Themes** - Generate CSS variables for your custom theme
- **Import/Export** - Save and share theme configurations
- **Presets** - Start with pre-built theme variations
- **Accessibility Check** - Validates color contrast ratios

## Running

```bash
npm install
npm run dev
```

Then open http://localhost:5175

## What You Can Customize

### Colors
- Primary color and shades
- Secondary colors
- Background colors
- Border colors
- Text colors

### Design Tokens
- Shadow scale (xs, sm, md, lg, xl)
- Border radius (sm, md, lg, full)
- Spacing scale
- Typography scale

### Component Styles
- Button variants
- Input styles
- Card styles
- And more...

## Exporting Your Theme

1. Customize your theme using the live editor
2. Click "Export Theme"
3. Copy the generated CSS variables
4. Add to your project's CSS file

```css
:root {
  /* Your custom theme variables */
  --primary: 221.2 83.2% 53.3%;
  --radius: 0.5rem;
  /* ... */
}
```

## Theme Presets

- **Default** - The standard Clarity theme
- **Ocean** - Blues and teals
- **Forest** - Greens and earth tones
- **Sunset** - Warm oranges and reds
- **Midnight** - Dark blues and purples
- **Monochrome** - Grayscale theme

## Accessibility

The theme builder automatically checks:
- Color contrast ratios (WCAG AA/AAA)
- Focus state visibility
- Text readability
- Interactive element contrast

Invalid combinations will be flagged with warnings.
