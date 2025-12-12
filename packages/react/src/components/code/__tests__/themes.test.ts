import { describe, it, expect } from 'vitest'
import {
  CODE_THEMES,
  DEFAULT_DARK_THEME,
  DEFAULT_LIGHT_THEME,
  getDarkThemes,
  getLightThemes,
  getThemeDefinition,
  isValidTheme,
} from '../themes'

describe('CODE_THEMES', () => {
  it('contains popular dark themes', () => {
    expect(CODE_THEMES['github-dark']).toBeDefined()
    expect(CODE_THEMES['one-dark-pro']).toBeDefined()
    expect(CODE_THEMES['night-owl']).toBeDefined()
    expect(CODE_THEMES['dracula']).toBeDefined()
    expect(CODE_THEMES['tokyo-night']).toBeDefined()
  })

  it('contains popular light themes', () => {
    expect(CODE_THEMES['github-light']).toBeDefined()
    expect(CODE_THEMES['vitesse-light']).toBeDefined()
    expect(CODE_THEMES['catppuccin-latte']).toBeDefined()
  })

  it('has correct structure for each theme', () => {
    Object.entries(CODE_THEMES).forEach(([key, theme]) => {
      expect(theme).toHaveProperty('name')
      expect(theme).toHaveProperty('type')
      expect(theme).toHaveProperty('shikiTheme')
      expect(['dark', 'light']).toContain(theme.type)
    })
  })
})

describe('DEFAULT_DARK_THEME', () => {
  it('is a valid theme', () => {
    expect(isValidTheme(DEFAULT_DARK_THEME)).toBe(true)
  })

  it('is a dark theme', () => {
    const theme = CODE_THEMES[DEFAULT_DARK_THEME]
    expect(theme.type).toBe('dark')
  })
})

describe('DEFAULT_LIGHT_THEME', () => {
  it('is a valid theme', () => {
    expect(isValidTheme(DEFAULT_LIGHT_THEME)).toBe(true)
  })

  it('is a light theme', () => {
    const theme = CODE_THEMES[DEFAULT_LIGHT_THEME]
    expect(theme.type).toBe('light')
  })
})

describe('getDarkThemes', () => {
  it('returns only dark themes', () => {
    const darkThemes = getDarkThemes()
    darkThemes.forEach((themeName) => {
      expect(CODE_THEMES[themeName].type).toBe('dark')
    })
  })

  it('includes github-dark', () => {
    expect(getDarkThemes()).toContain('github-dark')
  })
})

describe('getLightThemes', () => {
  it('returns only light themes', () => {
    const lightThemes = getLightThemes()
    lightThemes.forEach((themeName) => {
      expect(CODE_THEMES[themeName].type).toBe('light')
    })
  })

  it('includes github-light', () => {
    expect(getLightThemes()).toContain('github-light')
  })
})

describe('getThemeDefinition', () => {
  it('returns theme definition', () => {
    const definition = getThemeDefinition('github-dark')
    expect(definition.name).toBe('GitHub Dark')
    expect(definition.type).toBe('dark')
    expect(definition.shikiTheme).toBe('github-dark')
  })
})

describe('isValidTheme', () => {
  it('returns true for valid themes', () => {
    expect(isValidTheme('github-dark')).toBe(true)
    expect(isValidTheme('one-dark-pro')).toBe(true)
    expect(isValidTheme('github-light')).toBe(true)
  })

  it('returns false for invalid themes', () => {
    expect(isValidTheme('invalid-theme')).toBe(false)
    expect(isValidTheme('')).toBe(false)
    expect(isValidTheme('random')).toBe(false)
  })
})
