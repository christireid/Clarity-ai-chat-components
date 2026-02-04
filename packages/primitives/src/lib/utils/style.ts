/**
 * Style and CSS utilities
 */

/**
 * Check if string is color
 */
export function isColorString(str: string): boolean {
  const colorRegex =
    /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$|^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$|^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*(0|1|0?\.\d+)\s*\)$|^hsl\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*\)$|^hsla\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*,\s*(0|1|0?\.\d+)\s*\)$/
  return colorRegex.test(str)
}

/**
 * Check if string is CSS unit
 */
export function isCssUnit(str: string): boolean {
  const cssUnitRegex =
    /^-?\d+(\.\d+)?(px|em|rem|%|vh|vw|vmin|vmax|ex|ch|cm|mm|in|pt|pc|fr)$/
  return cssUnitRegex.test(str)
}
