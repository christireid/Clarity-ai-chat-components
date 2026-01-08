/**
 * Clarity Chat - Base Theme Configuration
 *
 * Shared configuration used by all theme presets.
 * Contains typography, spacing, borders, shadows, and animations.
 */
import { fontFamilyTokens, fontWeightTokens } from '../tokens/typography';
import { radiusTokens } from '../tokens/radius';
import { lightShadows } from '../tokens/shadows';
import { durationTokens, easingTokens } from '../tokens/animations';
import { spacingTokens } from '../tokens/spacing';
/**
 * Base theme configuration shared by all presets
 * Provides default values for non-color properties
 */
export const baseThemeConfig = {
    typography: {
        fontFamily: {
            sans: fontFamilyTokens.sans,
            mono: fontFamilyTokens.mono,
        },
        fontSize: {
            xs: '0.75rem',
            sm: '0.875rem',
            base: '1rem',
            lg: '1.125rem',
            xl: '1.25rem',
            '2xl': '1.5rem',
            '3xl': '1.875rem',
            '4xl': '2.25rem',
        },
        fontWeight: {
            normal: fontWeightTokens.normal,
            medium: fontWeightTokens.medium,
            semibold: fontWeightTokens.semibold,
            bold: fontWeightTokens.bold,
        },
        lineHeight: {
            tight: 1.25,
            normal: 1.5,
            relaxed: 1.625,
        },
        letterSpacing: {
            tight: '-0.025em',
            normal: '0',
            wide: '0.025em',
        },
    },
    spacing: {
        0: spacingTokens[0],
        1: spacingTokens[1],
        2: spacingTokens[2],
        3: spacingTokens[3],
        4: spacingTokens[4],
        5: spacingTokens[5],
        6: spacingTokens[6],
        8: spacingTokens[8],
        10: spacingTokens[10],
        12: spacingTokens[12],
        16: spacingTokens[16],
        20: spacingTokens[20],
        24: spacingTokens[24],
    },
    borders: {
        width: {
            thin: '1px',
            normal: '2px',
            thick: '4px',
        },
        radius: radiusTokens,
    },
    shadows: lightShadows,
    animations: {
        duration: {
            fast: durationTokens.fast,
            normal: durationTokens.normal,
            slow: durationTokens.slow,
            slower: durationTokens.slower,
        },
        easing: {
            default: easingTokens.easeInOut,
            in: easingTokens.easeIn,
            out: easingTokens.easeOut,
            inOut: easingTokens.easeInOut,
            spring: easingTokens.spring,
        },
    },
};
export function createPreset(nameOrConfig, mode, colors, overrides) {
    // Handle object-based preset bundle creation
    if (typeof nameOrConfig === 'object') {
        return {
            light: nameOrConfig.light,
            dark: nameOrConfig.dark,
            metadata: nameOrConfig.metadata,
        };
    }
    // Handle traditional preset creation
    return {
        name: nameOrConfig,
        mode: mode,
        colors: colors,
        ...baseThemeConfig,
        ...overrides,
    };
}
//# sourceMappingURL=base.js.map