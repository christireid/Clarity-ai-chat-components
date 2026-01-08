/**
 * Clarity Chat - Typography Tokens
 *
 * Font families, sizes, weights, and line heights.
 * Designed for optimal readability in chat interfaces.
 */
/**
 * Default font family stack
 * System fonts for optimal performance and native feel
 */
export const fontFamilyTokens = {
    // Primary font for UI text
    sans: [
        'system-ui',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        '"Noto Sans"',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
        '"Noto Color Emoji"',
    ].join(', '),
    // Monospace for code blocks
    mono: [
        '"SF Mono"',
        'Monaco',
        '"Cascadia Code"',
        '"Roboto Mono"',
        'Consolas',
        '"Liberation Mono"',
        '"Courier New"',
        'monospace',
    ].join(', '),
};
export const fontSizeTokens = {
    xs: { size: '0.75rem', lineHeight: '1rem' }, // 12px / 16px
    sm: { size: '0.875rem', lineHeight: '1.25rem' }, // 14px / 20px
    base: { size: '1rem', lineHeight: '1.5rem' }, // 16px / 24px
    lg: { size: '1.125rem', lineHeight: '1.75rem' }, // 18px / 28px
    xl: { size: '1.25rem', lineHeight: '1.75rem' }, // 20px / 28px
    '2xl': { size: '1.5rem', lineHeight: '2rem' }, // 24px / 32px
    '3xl': { size: '1.875rem', lineHeight: '2.25rem' }, // 30px / 36px
    '4xl': { size: '2.25rem', lineHeight: '2.5rem' }, // 36px / 40px
    '5xl': { size: '3rem', lineHeight: '1' }, // 48px
    '6xl': { size: '3.75rem', lineHeight: '1' }, // 60px
};
export const fontWeightTokens = {
    thin: 100,
    extralight: 200,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
};
export const letterSpacingTokens = {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
};
export const lineHeightTokens = {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
};
/**
 * Semantic typography presets
 */
export const semanticTypography = {
    // Headings
    h1: {
        size: fontSizeTokens['4xl'].size,
        lineHeight: fontSizeTokens['4xl'].lineHeight,
        weight: fontWeightTokens.bold,
        letterSpacing: letterSpacingTokens.tight,
    },
    h2: {
        size: fontSizeTokens['3xl'].size,
        lineHeight: fontSizeTokens['3xl'].lineHeight,
        weight: fontWeightTokens.semibold,
        letterSpacing: letterSpacingTokens.tight,
    },
    h3: {
        size: fontSizeTokens['2xl'].size,
        lineHeight: fontSizeTokens['2xl'].lineHeight,
        weight: fontWeightTokens.semibold,
        letterSpacing: letterSpacingTokens.normal,
    },
    h4: {
        size: fontSizeTokens.xl.size,
        lineHeight: fontSizeTokens.xl.lineHeight,
        weight: fontWeightTokens.semibold,
        letterSpacing: letterSpacingTokens.normal,
    },
    h5: {
        size: fontSizeTokens.lg.size,
        lineHeight: fontSizeTokens.lg.lineHeight,
        weight: fontWeightTokens.semibold,
        letterSpacing: letterSpacingTokens.normal,
    },
    h6: {
        size: fontSizeTokens.base.size,
        lineHeight: fontSizeTokens.base.lineHeight,
        weight: fontWeightTokens.semibold,
        letterSpacing: letterSpacingTokens.normal,
    },
    // Body text
    bodyLg: {
        size: fontSizeTokens.lg.size,
        lineHeight: fontSizeTokens.lg.lineHeight,
        weight: fontWeightTokens.normal,
    },
    body: {
        size: fontSizeTokens.base.size,
        lineHeight: fontSizeTokens.base.lineHeight,
        weight: fontWeightTokens.normal,
    },
    bodySm: {
        size: fontSizeTokens.sm.size,
        lineHeight: fontSizeTokens.sm.lineHeight,
        weight: fontWeightTokens.normal,
    },
    bodyXs: {
        size: fontSizeTokens.xs.size,
        lineHeight: fontSizeTokens.xs.lineHeight,
        weight: fontWeightTokens.normal,
    },
    // UI labels
    label: {
        size: fontSizeTokens.sm.size,
        lineHeight: fontSizeTokens.sm.lineHeight,
        weight: fontWeightTokens.medium,
    },
    labelSm: {
        size: fontSizeTokens.xs.size,
        lineHeight: fontSizeTokens.xs.lineHeight,
        weight: fontWeightTokens.medium,
    },
    // Buttons
    button: {
        size: fontSizeTokens.sm.size,
        lineHeight: fontSizeTokens.sm.lineHeight,
        weight: fontWeightTokens.medium,
    },
    buttonSm: {
        size: fontSizeTokens.xs.size,
        lineHeight: fontSizeTokens.xs.lineHeight,
        weight: fontWeightTokens.medium,
    },
    buttonLg: {
        size: fontSizeTokens.base.size,
        lineHeight: fontSizeTokens.base.lineHeight,
        weight: fontWeightTokens.medium,
    },
    // Chat-specific
    message: {
        size: fontSizeTokens.base.size,
        lineHeight: '1.625', // Slightly relaxed for readability
        weight: fontWeightTokens.normal,
    },
    timestamp: {
        size: fontSizeTokens.xs.size,
        lineHeight: fontSizeTokens.xs.lineHeight,
        weight: fontWeightTokens.normal,
    },
    username: {
        size: fontSizeTokens.sm.size,
        lineHeight: fontSizeTokens.sm.lineHeight,
        weight: fontWeightTokens.semibold,
    },
    // Code
    code: {
        size: fontSizeTokens.sm.size,
        lineHeight: '1.7', // More relaxed for code readability
        weight: fontWeightTokens.normal,
        family: fontFamilyTokens.mono,
    },
};
//# sourceMappingURL=typography.js.map