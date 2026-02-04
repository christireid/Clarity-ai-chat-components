# ThemeCustomizer Component Structure

This directory contains the modular implementation of the ThemeCustomizer component, split from a single 1,653-line file into focused, maintainable modules.

## File Structure

```
ThemeCustomizer/
├── index.tsx           # Main ThemeCustomizer component (653 lines)
├── types.ts            # Type definitions and constants (163 lines)
├── ColorPicker.tsx     # Color selection components (194 lines)
├── PresetSelector.tsx  # Theme preset preview cards (107 lines)
├── Preview.tsx         # Accessibility and export panels (478 lines)
└── README.md          # This file
```

**Total**: 1,595 lines (vs original 1,653 lines)

## Component Breakdown

### `types.ts`
Centralized type definitions and constants:
- `ThemeCustomizerProps` - Main component props
- `ColorPickerProps`, `ContrastBadgeProps`, etc. - Sub-component props
- `FontFamily`, `SizeScale`, `TypographySettings` - Typography types
- `PersistentThemeState` - LocalStorage state shape
- Constants: `FONT_FAMILIES`, `SIZE_SCALES`, `ALL_COLOR_BLINDNESS_TYPES`, `COLOR_ROLE_MAPPING`

### `ColorPicker.tsx`
Color selection and palette generation:
- `ColorPicker` - HSL/hex color input with visual swatch
- `SmartPaletteGenerator` - Generates harmonious color palettes (complementary, analogous, triadic, etc.)

### `PresetSelector.tsx`
Theme preset visualization:
- `ThemePreviewCard` - Interactive theme preview with color swatches, keyboard navigation, and accessibility support

### `Preview.tsx`
Accessibility testing and export functionality:
- `ContrastBadge` - WCAG contrast ratio checker (AA/AAA compliance)
- `ColorBlindnessPreview` - Quick preview of color blindness simulation
- `ColorBlindnessPanelFull` - Comprehensive 8-type color blindness simulator
- `EnhancedExportPanel` - Multi-format theme export (CSS, SCSS, Tailwind, JSON, Figma Tokens)

### `index.tsx`
Main orchestration component:
- Tab navigation (Presets, Colors, Typography, Accessibility, Export)
- State management with localStorage persistence
- Theme application and typography control
- Keyboard navigation support
- Reduced motion preferences

## Usage

The component maintains full backward compatibility. Import as before:

```tsx
import { ThemeCustomizer } from '@clarity-chat/react'
// or
import ThemeCustomizer from '@clarity-chat/react/components/theme-components/ThemeCustomizer'
```

## Key Features

1. **Preset Management**: Browse and select from categorized theme presets
2. **Color Customization**: Fine-tune brand and UI colors with live preview
3. **Typography Controls**: Adjust font family and size scale
4. **Accessibility Testing**:
   - WCAG contrast ratio checking
   - 8 types of color blindness simulation
5. **Theme Export**: Export to CSS, SCSS, Tailwind, JSON, or Figma Tokens
6. **Persistence**: Optional localStorage persistence of customizations
7. **Keyboard Navigation**: Full keyboard accessibility with arrow key tab switching
8. **Reduced Motion**: Respects `prefers-reduced-motion` preference

## Architecture Benefits

### Before
- Single 1,653-line file
- Difficult to navigate and maintain
- All types, constants, and components mixed together
- Hard to test individual features

### After
- 5 focused modules
- Clear separation of concerns
- Easy to locate and modify specific features
- Individual components can be tested in isolation
- Shared types prevent duplication
- Better code organization for future enhancements

## Development Guidelines

### Adding a New Color Harmony Type
Edit `ColorPicker.tsx` - add to the `harmonies` array in `SmartPaletteGenerator`

### Adding a New Export Format
Edit `Preview.tsx` - add format to `EnhancedExportPanel` and implement generator function

### Adding New Typography Options
Edit `types.ts` - update `FONT_FAMILIES` or `SIZE_SCALES` constants

### Adding a New Tab
Edit `index.tsx` - add tab to the `tabs` array and create corresponding tab panel in `AnimatePresence`

## Testing Considerations

Each module can be tested independently:
- `ColorPicker.tsx` - Test color conversion, palette generation
- `PresetSelector.tsx` - Test theme preview rendering
- `Preview.tsx` - Test contrast calculations, export formats
- `types.ts` - Test type safety and constant values
- `index.tsx` - Test state management, tab navigation, integration

## Future Enhancements

Potential improvements now easier to implement:
1. **Lazy loading**: Load export/accessibility panels on-demand
2. **Component splitting**: Further split if individual files grow too large
3. **Testing**: Add unit tests for each module
4. **Documentation**: Generate API docs from types
5. **Storybook**: Create stories for each sub-component
