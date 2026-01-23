/**
 * Night Owl Theme - Single Source of Truth
 *
 * This file contains the canonical Night Owl theme definition used across
 * all code rendering contexts in the docs site. This ensures consistent
 * theming between CodeBlock, InlineCode, Monaco Editor, and any other
 * syntax highlighting components.
 *
 * Based on Sarah Drasner's Night Owl theme for VS Code.
 */

/**
 * Monaco theme data interface (defined locally to avoid monaco-editor dependency)
 */
interface IStandaloneThemeData {
  base: 'vs' | 'vs-dark' | 'hc-black' | 'hc-light'
  inherit: boolean
  rules: Array<{
    token: string
    foreground?: string
    background?: string
    fontStyle?: string
  }>
  colors: Record<string, string>
}

/**
 * Night Owl Color Palette
 * Primary colors used throughout the theme
 */
export const NIGHT_OWL_COLORS = {
  // Background colors
  background: '#011627',
  backgroundSecondary: '#0b2942',
  backgroundTertiary: '#152a3d',

  // Foreground colors
  foreground: '#d6deeb',
  foregroundSecondary: '#7c8794',
  foregroundTertiary: '#5f7e97',

  // Accent colors
  accent: '#82aaff',
  accentSecondary: '#c792ea',
  accentTertiary: '#ffeb95',

  // Syntax highlighting colors
  keyword: '#c792ea',
  string: '#ecc48d',
  number: '#f78c6c',
  comment: '#637777',
  function: '#82aaff',
  variable: '#d6deeb',
  type: '#ffc98b',
  constant: '#ffcb8b',
  operator: '#7fdbca',

  // UI colors
  border: '#1e3a5f',
  selection: '#1d3b53',
  lineHighlight: '#0b2942',

  // Status colors
  success: '#addb67',
  error: '#ff5874',
  warning: '#ffcb8b',
  info: '#82aaff',
} as const

/**
 * Night Owl Syntax Token Colors
 * Maps syntax tokens to Night Owl colors
 */
export const NIGHT_OWL_TOKENS = {
  // Keywords
  keyword: NIGHT_OWL_COLORS.keyword,
  'keyword.control': NIGHT_OWL_COLORS.keyword,
  'keyword.operator': NIGHT_OWL_COLORS.operator,

  // Types
  type: NIGHT_OWL_COLORS.type,
  'type.builtin': NIGHT_OWL_COLORS.type,
  'type.parameter': NIGHT_OWL_COLORS.accent,
  'type.generic': NIGHT_OWL_COLORS.accentSecondary,

  // Functions
  'entity.name.function': NIGHT_OWL_COLORS.function,
  'entity.name.function.method': NIGHT_OWL_COLORS.function,

  // Variables
  variable: NIGHT_OWL_COLORS.variable,
  'variable.parameter': NIGHT_OWL_COLORS.accent,
  'variable.other': NIGHT_OWL_COLORS.foregroundSecondary,
  'variable.language': NIGHT_OWL_COLORS.keyword,

  // Constants
  constant: NIGHT_OWL_COLORS.constant,
  'constant.numeric': NIGHT_OWL_COLORS.number,
  'constant.language': NIGHT_OWL_COLORS.keyword,
  'constant.character': NIGHT_OWL_COLORS.string,

  // Strings
  string: NIGHT_OWL_COLORS.string,
  'string.quoted': NIGHT_OWL_COLORS.string,
  'string.template': NIGHT_OWL_COLORS.string,

  // Comments
  comment: NIGHT_OWL_COLORS.comment,
  'comment.line': NIGHT_OWL_COLORS.comment,
  'comment.block': NIGHT_OWL_COLORS.comment,

  // Punctuation
  punctuation: NIGHT_OWL_COLORS.foregroundSecondary,

  // Operators
  operator: NIGHT_OWL_COLORS.operator,

  // Markup (for HTML, JSX, etc.)
  'entity.name.tag': NIGHT_OWL_COLORS.accentSecondary,
  'entity.other.attribute-name': NIGHT_OWL_COLORS.accent,
  'string.quoted.double.html': NIGHT_OWL_COLORS.string,
} as const

/**
 * Monaco Editor Night Owl Theme
 * Compatible with Monaco Editor's theme API
 */
export const NIGHT_OWL_MONACO_THEME: IStandaloneThemeData = {
  base: 'vs-dark',
  inherit: true,
  rules: [
    // Keywords
    { token: 'keyword', foreground: NIGHT_OWL_COLORS.keyword.replace('#', '') },
    {
      token: 'keyword.control',
      foreground: NIGHT_OWL_COLORS.keyword.replace('#', ''),
    },
    {
      token: 'keyword.operator',
      foreground: NIGHT_OWL_COLORS.operator.replace('#', ''),
    },

    // Types
    { token: 'type', foreground: NIGHT_OWL_COLORS.type.replace('#', '') },
    {
      token: 'type.builtin',
      foreground: NIGHT_OWL_COLORS.type.replace('#', ''),
    },
    {
      token: 'type.parameter',
      foreground: NIGHT_OWL_COLORS.accent.replace('#', ''),
    },

    // Functions
    {
      token: 'entity.name.function',
      foreground: NIGHT_OWL_COLORS.function.replace('#', ''),
    },
    {
      token: 'entity.name.function.method',
      foreground: NIGHT_OWL_COLORS.function.replace('#', ''),
    },

    // Variables
    {
      token: 'variable',
      foreground: NIGHT_OWL_COLORS.variable.replace('#', ''),
    },
    {
      token: 'variable.parameter',
      foreground: NIGHT_OWL_COLORS.accent.replace('#', ''),
    },
    {
      token: 'variable.other',
      foreground: NIGHT_OWL_COLORS.foregroundSecondary.replace('#', ''),
    },

    // Constants
    {
      token: 'constant',
      foreground: NIGHT_OWL_COLORS.constant.replace('#', ''),
    },
    {
      token: 'constant.numeric',
      foreground: NIGHT_OWL_COLORS.number.replace('#', ''),
    },
    {
      token: 'constant.language',
      foreground: NIGHT_OWL_COLORS.keyword.replace('#', ''),
    },

    // Strings
    { token: 'string', foreground: NIGHT_OWL_COLORS.string.replace('#', '') },
    {
      token: 'string.quoted',
      foreground: NIGHT_OWL_COLORS.string.replace('#', ''),
    },

    // Comments
    { token: 'comment', foreground: NIGHT_OWL_COLORS.comment.replace('#', '') },

    // Operators
    {
      token: 'operator',
      foreground: NIGHT_OWL_COLORS.operator.replace('#', ''),
    },

    // Markup
    {
      token: 'entity.name.tag',
      foreground: NIGHT_OWL_COLORS.accentSecondary.replace('#', ''),
    },
    {
      token: 'entity.other.attribute-name',
      foreground: NIGHT_OWL_COLORS.accent.replace('#', ''),
    },
  ],
  colors: {
    'editor.background': NIGHT_OWL_COLORS.background,
    'editor.foreground': NIGHT_OWL_COLORS.foreground,
    'editor.selectionBackground': NIGHT_OWL_COLORS.selection,
    'editor.lineHighlightBackground': NIGHT_OWL_COLORS.lineHighlight,
    'editorCursor.foreground': NIGHT_OWL_COLORS.foreground,
    'editorWhitespace.foreground': NIGHT_OWL_COLORS.foregroundTertiary,
    'editorLineNumber.foreground': NIGHT_OWL_COLORS.foregroundTertiary,
    'editorLineNumber.activeForeground': NIGHT_OWL_COLORS.foregroundSecondary,
  },
}

/**
 * CSS Custom Properties for Night Owl Theme
 * Can be used in CSS-in-JS or manual CSS styling
 */
export const NIGHT_OWL_CSS_VARS = {
  '--night-owl-bg': NIGHT_OWL_COLORS.background,
  '--night-owl-bg-secondary': NIGHT_OWL_COLORS.backgroundSecondary,
  '--night-owl-bg-tertiary': NIGHT_OWL_COLORS.backgroundTertiary,
  '--night-owl-fg': NIGHT_OWL_COLORS.foreground,
  '--night-owl-fg-secondary': NIGHT_OWL_COLORS.foregroundSecondary,
  '--night-owl-fg-tertiary': NIGHT_OWL_COLORS.foregroundTertiary,
  '--night-owl-accent': NIGHT_OWL_COLORS.accent,
  '--night-owl-accent-secondary': NIGHT_OWL_COLORS.accentSecondary,
  '--night-owl-accent-tertiary': NIGHT_OWL_COLORS.accentTertiary,
  '--night-owl-keyword': NIGHT_OWL_COLORS.keyword,
  '--night-owl-string': NIGHT_OWL_COLORS.string,
  '--night-owl-number': NIGHT_OWL_COLORS.number,
  '--night-owl-comment': NIGHT_OWL_COLORS.comment,
  '--night-owl-function': NIGHT_OWL_COLORS.function,
  '--night-owl-variable': NIGHT_OWL_COLORS.variable,
  '--night-owl-type': NIGHT_OWL_COLORS.type,
  '--night-owl-constant': NIGHT_OWL_COLORS.constant,
  '--night-owl-operator': NIGHT_OWL_COLORS.operator,
  '--night-owl-border': NIGHT_OWL_COLORS.border,
  '--night-owl-selection': NIGHT_OWL_COLORS.selection,
  '--night-owl-line-highlight': NIGHT_OWL_COLORS.lineHighlight,
} as const

/**
 * Tailwind-compatible Night Owl colors
 * For use with Tailwind's arbitrary value syntax
 */
export const NIGHT_OWL_TAILWIND = {
  'night-owl-bg': NIGHT_OWL_COLORS.background,
  'night-owl-fg': NIGHT_OWL_COLORS.foreground,
  'night-owl-accent': NIGHT_OWL_COLORS.accent,
  'night-owl-keyword': NIGHT_OWL_COLORS.keyword,
  'night-owl-string': NIGHT_OWL_COLORS.string,
  'night-owl-comment': NIGHT_OWL_COLORS.comment,
} as const
