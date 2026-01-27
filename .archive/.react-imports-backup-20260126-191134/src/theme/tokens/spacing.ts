/**
 * Clarity Chat - Spacing Tokens
 *
 * Consistent spacing scale based on 4px base unit.
 * Uses rem for accessibility (respects user font size preferences).
 */

/**
 * Spacing scale values
 * Based on 4px (0.25rem) increments
 */
export interface SpacingTokens {
  0: string
  px: string
  0.5: string
  1: string
  1.5: string
  2: string
  2.5: string
  3: string
  3.5: string
  4: string
  5: string
  6: string
  7: string
  8: string
  9: string
  10: string
  11: string
  12: string
  14: string
  16: string
  20: string
  24: string
  28: string
  32: string
  36: string
  40: string
  44: string
  48: string
  52: string
  56: string
  60: string
  64: string
  72: string
  80: string
  96: string
}

/**
 * Default spacing scale
 * Compatible with Tailwind CSS spacing utilities
 */
export const spacingTokens: SpacingTokens = {
  0: '0',
  px: '1px',
  0.5: '0.125rem', // 2px
  1: '0.25rem', // 4px
  1.5: '0.375rem', // 6px
  2: '0.5rem', // 8px
  2.5: '0.625rem', // 10px
  3: '0.75rem', // 12px
  3.5: '0.875rem', // 14px
  4: '1rem', // 16px
  5: '1.25rem', // 20px
  6: '1.5rem', // 24px
  7: '1.75rem', // 28px
  8: '2rem', // 32px
  9: '2.25rem', // 36px
  10: '2.5rem', // 40px
  11: '2.75rem', // 44px
  12: '3rem', // 48px
  14: '3.5rem', // 56px
  16: '4rem', // 64px
  20: '5rem', // 80px
  24: '6rem', // 96px
  28: '7rem', // 112px
  32: '8rem', // 128px
  36: '9rem', // 144px
  40: '10rem', // 160px
  44: '11rem', // 176px
  48: '12rem', // 192px
  52: '13rem', // 208px
  56: '14rem', // 224px
  60: '15rem', // 240px
  64: '16rem', // 256px
  72: '18rem', // 288px
  80: '20rem', // 320px
  96: '24rem', // 384px
}

/**
 * Semantic spacing aliases for common use cases
 */
export const semanticSpacing = {
  // Component internal padding
  componentPaddingXs: spacingTokens[1], // 4px
  componentPaddingSm: spacingTokens[2], // 8px
  componentPaddingMd: spacingTokens[3], // 12px
  componentPaddingLg: spacingTokens[4], // 16px
  componentPaddingXl: spacingTokens[6], // 24px

  // Gap between elements
  gapXs: spacingTokens[1], // 4px
  gapSm: spacingTokens[2], // 8px
  gapMd: spacingTokens[4], // 16px
  gapLg: spacingTokens[6], // 24px
  gapXl: spacingTokens[8], // 32px

  // Section spacing
  sectionSm: spacingTokens[8], // 32px
  sectionMd: spacingTokens[12], // 48px
  sectionLg: spacingTokens[16], // 64px
  sectionXl: spacingTokens[24], // 96px

  // Chat-specific spacing
  messagePadding: spacingTokens[3], // 12px
  messageGap: spacingTokens[4], // 16px
  inputPadding: spacingTokens[3], // 12px
  avatarSize: spacingTokens[10], // 40px
} as const

export type SemanticSpacingKey = keyof typeof semanticSpacing
