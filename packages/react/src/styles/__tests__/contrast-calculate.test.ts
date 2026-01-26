/**
 * Calculate the correct lightness value for WCAG AA compliance
 */

import { describe, it } from 'vitest'

function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c = c / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

function getContrastRatio(
  color1: [number, number, number],
  color2: [number, number, number]
): number {
  const lum1 = getLuminance(...color1)
  const lum2 = getLuminance(...color2)
  const lighter = Math.max(lum1, lum2)
  const darker = Math.min(lum1, lum2)
  return (lighter + 0.05) / (darker + 0.05)
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  s /= 100
  l /= 100

  const k = (n: number) => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))

  return [
    Math.round(f(0) * 255),
    Math.round(f(8) * 255),
    Math.round(f(4) * 255),
  ]
}

describe('Find correct lightness value', () => {
  it('should find lightness that gives 4.5:1 contrast', () => {
    const white = hslToRgb(0, 0, 100)
    const hue = 214
    const saturation = 90

    if (process.env.NODE_ENV === 'development') {
      console.log('\nTesting different lightness values for hsl(214, 90%, L%):')
      console.log('========================================================')
    }

    // Test various lightness values
    for (let lightness = 30; lightness <= 60; lightness += 2) {
      const color = hslToRgb(hue, saturation, lightness)
      const ratio = getContrastRatio(white, color)
      const passes = ratio >= 4.5 ? '✓' : '✗'

      if (process.env.NODE_ENV === 'development') {
        console.log(`L=${lightness}%: ${ratio.toFixed(2)}:1 ${passes}`)

        if (Math.abs(ratio - 4.5) < 0.1) {
          console.log(`  ^^^ This is very close to 4.5:1!`)
        }
      }
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('\n' + '='.repeat(56))
      console.log('Current value: hsl(214, 90%, 55%) = 3.91:1 ✗')
      console.log('Recommended: hsl(214, 90%, 45%) for 4.5:1+ ratio ✓')
      console.log('='.repeat(56) + '\n')
    }
  })

  it('should test with and without opacity', () => {
    const white = hslToRgb(0, 0, 100)
    const lightBackground = hslToRgb(210, 20, 98)

    // Test lightness = 45 (our target)
    const targetLightness = 45
    const solidColor = hslToRgb(214, 90, targetLightness)
    const solidRatio = getContrastRatio(white, solidColor)

    if (process.env.NODE_ENV === 'development') {
      console.log('\n' + '='.repeat(56))
      console.log(`Solid color hsl(214, 90%, ${targetLightness}%):`)
      console.log(
        `  Contrast: ${solidRatio.toFixed(2)}:1 ${solidRatio >= 4.5 ? '✓' : '✗'}`
      )
    }

    // Test with 95% opacity
    const blendedColor95 = [
      Math.round(solidColor[0] * 0.95 + lightBackground[0] * 0.05),
      Math.round(solidColor[1] * 0.95 + lightBackground[1] * 0.05),
      Math.round(solidColor[2] * 0.95 + lightBackground[2] * 0.05),
    ] as [number, number, number]

    const blendedRatio95 = getContrastRatio(white, blendedColor95)

    if (process.env.NODE_ENV === 'development') {
      console.log(`With 95% opacity (blended with background):`)
      console.log(
        `  Contrast: ${blendedRatio95.toFixed(2)}:1 ${blendedRatio95 >= 4.5 ? '✓' : '✗'}`
      )

      // Test with 100% opacity (no blend)
      console.log(
        '\nRecommendation: Use 100% opacity (no transparency) to maintain contrast'
      )
      console.log('='.repeat(56) + '\n')
    }
  })
})
