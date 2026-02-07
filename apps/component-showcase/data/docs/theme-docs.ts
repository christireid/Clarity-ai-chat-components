import type { ComponentDoc } from '@/components/doc-panel'

export const themeDocs: Record<string, ComponentDoc | ComponentDoc[]> = {
  // ===========================================================================
  // Theme Switcher
  // ===========================================================================
  'Theme Switcher': {
    name: 'ThemeSwitcher',
    description:
      'Animated light/dark/system theme switcher with live color preview. Supports compact mode for toolbars and includes hover-activated preview with color swatches and sample UI elements.',
    importPath: '@clarity-chat/react',
    usageCode: `<ThemeSwitcher
  currentTheme={theme}
  onThemeChange={(newTheme) => setTheme(newTheme)}
  showPreview
  compact={false}
/>`,
    props: [
      {
        name: 'currentTheme',
        type: 'Theme',
        required: true,
        description: 'The currently active theme.',
        commonlyUsed: true,
      },
      {
        name: 'onThemeChange',
        type: '(theme: Theme) => void',
        required: true,
        description:
          'Callback invoked when the user selects a different theme.',
        commonlyUsed: true,
      },
      {
        name: 'showPreview',
        type: 'boolean',
        default: 'true',
        description:
          'Show a live color preview panel below the theme options. Displays color swatches and sample UI elements for the hovered or selected theme.',
        commonlyUsed: true,
      },
      {
        name: 'compact',
        type: 'boolean',
        default: 'false',
        description:
          'Enable compact mode which renders options as a horizontal row with smaller padding. Hides the preview panel.',
        commonlyUsed: true,
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS class names for the root container.',
      },
      {
        name: 'ref',
        type: 'React.Ref<HTMLDivElement>',
        description: 'Ref forwarded to the root div element.',
      },
    ],
    notes: [
      'The Theme type is exported as "light" | "dark" | "system" and can be imported alongside the component.',
      'Animations use Framer Motion with spring physics and automatically respect the prefers-reduced-motion media query.',
      'A useSimpleTheme hook is also exported for basic theme state management with localStorage persistence.',
      'The preview panel shows background, foreground, primary, secondary, and accent color swatches with sample UI buttons.',
    ],
    sourceFile: 'components/theme-components/ThemeSwitcher.tsx',
  },

  // ===========================================================================
  // Color Palette
  // ===========================================================================
  'Color Palette': [
    {
      name: 'ThemeSelector',
      description:
        'Theme preset selector that displays all built-in theme presets with color preview swatches. Supports horizontal and vertical orientations with accessible radiogroup keyboard navigation.',
      importPath: '@clarity-chat/react',
      usageCode: `<ThemeSelector
  showPreview
  orientation="vertical"
  onThemeChange={(theme) =>
    console.log('Theme changed:', theme)
  }
/>`,
      props: [
        {
          name: 'showPreview',
          type: 'boolean',
          default: 'true',
          description:
            'Show color preview circles for each theme option including primary, secondary, and background colors.',
          commonlyUsed: true,
        },
        {
          name: 'orientation',
          type: "'horizontal' | 'vertical'",
          default: '"vertical"',
          description:
            'Layout orientation. Horizontal shows a scrollable row with compact cards; vertical shows a full list with descriptions.',
          commonlyUsed: true,
        },
        {
          name: 'className',
          type: 'string',
          description: 'Additional CSS class names for the root container.',
        },
        {
          name: 'onThemeChange',
          type: '(theme: ThemePresetName) => void',
          description:
            'Callback invoked when a theme preset is selected. Receives the preset name string.',
          commonlyUsed: true,
        },
      ],
      notes: [
        'Requires a ThemeProvider ancestor in the component tree to read and set the active theme.',
        'Uses the radiogroup ARIA pattern with aria-checked for the active theme.',
        'In vertical orientation, each option shows display name, description, and up to three color preview circles.',
        'In horizontal orientation, each option shows a compact card with a single primary color circle and name.',
      ],
      sourceFile: 'components/clarity/color-picker.tsx',
    },
    {
      name: 'ThemeSelectorDropdown',
      description:
        'Compact dropdown variant of the theme selector. Shows the current theme name in a button and opens a dropdown listbox with all available presets.',
      importPath: '@clarity-chat/react',
      usageCode: `<ThemeSelectorDropdown
  onThemeChange={(theme) => console.log('Selected:', theme)}
  className="w-64"
/>`,
      props: [
        {
          name: 'className',
          type: 'string',
          description: 'Additional CSS class names for the root container.',
        },
        {
          name: 'onThemeChange',
          type: '(theme: ThemePresetName) => void',
          description:
            'Callback invoked when a theme is selected from the dropdown.',
          commonlyUsed: true,
        },
      ],
      notes: [
        'Requires a ThemeProvider ancestor in the component tree.',
        'Uses aria-expanded and aria-haspopup="listbox" for accessibility.',
        'Each option in the dropdown shows a color swatch, display name, and description.',
        'Clicking outside the dropdown or selecting an option closes it automatically.',
      ],
      sourceFile: 'components/theme-components/ThemeSelector.tsx',
    },
  ],

  // ===========================================================================
  // Theme Presets
  // ===========================================================================
  'Theme Presets': [
    {
      name: 'ThemePreviewThumbnail',
      description:
        "Visual miniature thumbnail preview of a theme. Renders a small card with the theme's background, card, primary, foreground, and status colors (destructive, warning, success). Supports preset names or custom theme configs.",
      importPath: '@clarity-chat/react',
      usageCode: `<ThemePreviewThumbnail
  preset="default"
  selected={isSelected}
  size="md"
  showLabel
  onClick={() => handleSelect('default')}
/>`,
      props: [
        {
          name: 'preset',
          type: 'ModernThemePresetName',
          description:
            'Preset name to preview. Used to look up the theme from the built-in modern themes registry.',
          commonlyUsed: true,
        },
        {
          name: 'theme',
          type: 'CompleteThemeConfig',
          description:
            'Custom theme config object to preview. Takes precedence over the preset prop when both are provided.',
          commonlyUsed: true,
        },
        {
          name: 'selected',
          type: 'boolean',
          default: 'false',
          description:
            'Whether this thumbnail is in the selected state. Adds a primary-colored border, ring, and shadow.',
          commonlyUsed: true,
        },
        {
          name: 'size',
          type: "'sm' | 'md' | 'lg'",
          default: '"md"',
          description:
            'Size of the thumbnail. sm: 64x48px, md: 96x72px, lg: 128x96px.',
          commonlyUsed: true,
        },
        {
          name: 'showLabel',
          type: 'boolean',
          default: 'true',
          description: 'Show the theme name label below the thumbnail.',
        },
        {
          name: 'onClick',
          type: '() => void',
          description:
            'Click handler. When provided, the thumbnail becomes interactive with cursor-pointer, button role, and keyboard support (Enter/Space).',
          commonlyUsed: true,
        },
        {
          name: 'className',
          type: 'string',
          default: '""',
          description: 'Additional CSS class names for the root container.',
        },
      ],
      notes: [
        'When no preset or theme is provided, defaults to the "default" modern theme.',
        'Uses CSS custom properties (--thumb-bg, --thumb-primary, etc.) for dynamic color rendering.',
        'The thumbnail renders a miniature UI including traffic-light dots (destructive, warning, success), text lines, and a primary-colored button.',
        'Accessible: uses aria-label with theme name and selection state, and aria-pressed when interactive.',
      ],
      sourceFile: 'components/theme-components/ThemePreviewThumbnail.tsx',
    },
    {
      name: 'ThemePreviewGrid',
      description:
        'Responsive grid of theme preview thumbnails with full keyboard navigation using the roving tabindex pattern. Supports filtering by light/dark themes and accessible radiogroup semantics.',
      importPath: '@clarity-chat/react',
      usageCode: `<ThemePreviewGrid
  selectedPreset="default"
  onSelect={(preset) => setTheme({ preset })}
  size="md"
  filter="all"
/>`,
      props: [
        {
          name: 'selectedPreset',
          type: 'ModernThemePresetName',
          description: 'Currently selected preset name for visual highlight.',
          commonlyUsed: true,
        },
        {
          name: 'onSelect',
          type: '(preset: ModernThemePresetName) => void',
          description:
            'Callback invoked when a theme thumbnail is clicked or activated via keyboard.',
          commonlyUsed: true,
        },
        {
          name: 'size',
          type: "'sm' | 'md' | 'lg'",
          default: '"md"',
          description: 'Size of each thumbnail in the grid.',
          commonlyUsed: true,
        },
        {
          name: 'filter',
          type: "'all' | 'light' | 'dark'",
          default: '"all"',
          description:
            'Filter to show only light themes, only dark themes (names ending with "-dark"), or all themes.',
          commonlyUsed: true,
        },
        {
          name: 'className',
          type: 'string',
          default: '""',
          description: 'Additional CSS class names for the grid container.',
        },
      ],
      notes: [
        'Keyboard navigation: Arrow keys move focus between thumbnails, Home/End jump to first/last, Enter/Space selects.',
        'Uses role="radiogroup" with individual items as role="radio" with aria-checked.',
        'Grid columns are auto-calculated based on thumbnail size using CSS grid auto-fill.',
        'Dark themes are identified by the "-dark" suffix in their preset name.',
      ],
      sourceFile: 'components/theme-components/ThemePreviewThumbnail.tsx',
    },
  ],

  // ===========================================================================
  // Appearance Settings
  // ===========================================================================
  'Appearance Settings': {
    name: 'ThemeCustomizer',
    description:
      'Comprehensive theme customization panel with preset selection, color editing, typography controls, accessibility analysis (WCAG contrast checking and color blindness simulation), and theme export. Supports localStorage persistence.',
    importPath: '@clarity-chat/react',
    usageCode: `<ThemeCustomizer
  showPresets
  showColors
  showTypography
  showAccessibility
  showExport
  compact={false}
  persistTheme
  storageKey="my-app-theme"
  onThemeChange={(theme) =>
    console.log('Theme updated:', theme)
  }
/>`,
    props: [
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS class names for the root container.',
      },
      {
        name: 'onThemeChange',
        type: '(theme: CompleteThemeConfig) => void',
        description:
          'Callback invoked whenever the theme changes, whether by preset selection, color editing, or typography adjustment.',
        commonlyUsed: true,
      },
      {
        name: 'showPresets',
        type: 'boolean',
        description:
          'Show the theme preset selector section with built-in theme cards.',
        commonlyUsed: true,
      },
      {
        name: 'showColors',
        type: 'boolean',
        description:
          'Show the color customization section with color pickers for primary, secondary, accent, success, and destructive roles.',
        commonlyUsed: true,
      },
      {
        name: 'showTypography',
        type: 'boolean',
        description:
          'Show typography controls for font family (system, Inter, Roboto, monospace) and size scale (compact, default, large).',
        commonlyUsed: true,
      },
      {
        name: 'showAccessibility',
        type: 'boolean',
        description:
          'Show the accessibility info panel with WCAG contrast ratio badges and color blindness simulation previews.',
        commonlyUsed: true,
      },
      {
        name: 'showExport',
        type: 'boolean',
        description:
          'Show the export options section for copying or downloading theme configuration as CSS variables, JSON, or Tailwind config.',
      },
      {
        name: 'compact',
        type: 'boolean',
        description:
          'Enable compact mode for embedding in sidebars or narrow panels.',
      },
      {
        name: 'persistTheme',
        type: 'boolean',
        description:
          'Enable automatic theme persistence to localStorage. Saves preset, custom colors, and typography settings.',
        commonlyUsed: true,
      },
      {
        name: 'storageKey',
        type: 'string',
        description:
          'Custom localStorage key for theme persistence. Allows multiple independent theme customizer instances.',
      },
    ],
    notes: [
      'Requires a ThemeProvider ancestor in the component tree.',
      'The color editor uses HSL color pickers and displays the hex value for each color role.',
      'Accessibility panel checks contrast ratios for all foreground/background pairs against WCAG AA (4.5:1) and AAA (7:1) standards.',
      'Color blindness simulation supports protanopia, deuteranopia, tritanopia, protanomaly, deuteranomaly, tritanomaly, achromatopsia, and achromatomaly.',
      'Typography settings support four font families (system, Inter, Roboto, monospace) and three size scales (compact at 0.875x, default at 1x, large at 1.125x).',
      'Export supports CSS custom properties, JSON config, and Tailwind CSS config formats.',
    ],
    sourceFile: 'components/theme-components/ThemeCustomizer/index.tsx',
  },
}
