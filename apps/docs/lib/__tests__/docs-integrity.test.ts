/**
 * Documentation Integrity Tests
 *
 * Ensures documentation claims match actual implementation.
 * Catches drift between code and docs before it reaches production.
 */

import { describe, it, expect } from 'vitest'
import * as fs from 'fs'
import * as path from 'path'
import { glob } from 'glob'
import {
  LIBRARY_STATS,
  LIBRARY_STATS_EXACT,
  DEPRECATED_PATTERNS,
} from '../library-stats'

const DOCS_ROOT = path.resolve(__dirname, '../..')
const PACKAGES_ROOT = path.resolve(__dirname, '../../../../packages/react/src')

// Validate paths exist before running tests
const validatePaths = () => {
  if (!fs.existsSync(DOCS_ROOT)) {
    throw new Error(`DOCS_ROOT not found: ${DOCS_ROOT}`)
  }
  if (!fs.existsSync(PACKAGES_ROOT)) {
    throw new Error(
      `PACKAGES_ROOT not found: ${PACKAGES_ROOT}. ` +
        'Tests must be run from the monorepo root.'
    )
  }
}

describe('Documentation Integrity', () => {
  // Validate paths at test suite initialization
  validatePaths()
  describe('Library Stats Constants', () => {
    it('should have valid component count claim', () => {
      const claimedMin = parseInt(LIBRARY_STATS.components.replace('+', ''))
      expect(LIBRARY_STATS_EXACT.components).toBeGreaterThanOrEqual(claimedMin)
    })

    it('should have valid hook count claim', () => {
      const claimedMin = parseInt(LIBRARY_STATS.hooks.replace('+', ''))
      expect(LIBRARY_STATS_EXACT.hooks).toBeGreaterThanOrEqual(claimedMin)
    })

    it('should have exact theme count', () => {
      expect(LIBRARY_STATS.themes).toBe(LIBRARY_STATS_EXACT.themes)
    })
  })

  describe('Implementation Count Verification', () => {
    it('component files exceed documented minimum', async () => {
      const componentFiles = await glob('**/components/**/*.{ts,tsx}', {
        cwd: PACKAGES_ROOT,
        ignore: ['**/*.test.*', '**/*.stories.*', '**/*.spec.*', '**/index.ts'],
      })

      const claimedMin = parseInt(LIBRARY_STATS.components.replace('+', ''))
      expect(componentFiles.length).toBeGreaterThanOrEqual(claimedMin)
    })

    it('hook files exceed documented minimum', async () => {
      const hookFiles = await glob('**/hooks/**/use*.{ts,tsx}', {
        cwd: PACKAGES_ROOT,
        ignore: ['**/*.test.*'],
      })

      const claimedMin = parseInt(LIBRARY_STATS.hooks.replace('+', ''))
      expect(hookFiles.length).toBeGreaterThanOrEqual(claimedMin)
    })

    it('theme preset files match documented count', async () => {
      const themeFiles = await glob('theme/modern-presets/*.ts', {
        cwd: PACKAGES_ROOT,
        ignore: ['**/index.ts', '**/base.ts'],
      })

      expect(themeFiles.length).toBe(LIBRARY_STATS.themes)
    })
  })

  describe('No Deprecated Patterns in User-Facing Docs', () => {
    const userFacingDirs = [
      'app',
      'components',
      'public/llms.txt',
      'public/llms-full.txt',
    ]

    it.each(DEPRECATED_PATTERNS)(
      'should not contain deprecated pattern: %s',
      async (pattern) => {
        const violations: string[] = []

        for (const dir of userFacingDirs) {
          const fullPath = path.join(DOCS_ROOT, dir)

          if (!fs.existsSync(fullPath)) continue

          const stat = fs.statSync(fullPath)

          if (stat.isFile()) {
            const content = fs.readFileSync(fullPath, 'utf-8')
            if (pattern.test(content)) {
              violations.push(fullPath)
            }
          } else {
            const files = await glob('**/*.{tsx,ts,txt}', {
              cwd: fullPath,
              ignore: [
                '**/node_modules/**',
                '**/*.test.*',
                '**/SALES_DECK*',
                '**/content/blog/**',
              ],
            })

            for (const file of files) {
              const filePath = path.join(fullPath, file)
              const content = fs.readFileSync(filePath, 'utf-8')
              if (pattern.test(content)) {
                violations.push(filePath)
              }
            }
          }
        }

        expect(violations).toEqual([])
      }
    )
  })

  describe('SEO Metadata Consistency', () => {
    it('StructuredData.tsx contains correct counts', async () => {
      const structuredDataPath = path.join(
        DOCS_ROOT,
        'components/SEO/StructuredData.tsx'
      )

      // Handle missing file gracefully
      if (!fs.existsSync(structuredDataPath)) {
        throw new Error(
          `StructuredData.tsx not found at ${structuredDataPath}. ` +
            'Ensure the test is running from the correct directory.'
        )
      }

      const content = fs.readFileSync(structuredDataPath, 'utf-8')

      // Should contain current counts (using LIBRARY_STATS to stay in sync)
      expect(content).toContain(`${LIBRARY_STATS.components} components`)
      expect(content).toContain(`${LIBRARY_STATS.hooks} hooks`)
      expect(content).toContain(`${LIBRARY_STATS.themes} pre-built themes`)

      // Should NOT contain deprecated counts
      for (const pattern of DEPRECATED_PATTERNS) {
        expect(content).not.toMatch(pattern)
      }
    })
  })

  describe('AI Documentation Consistency', () => {
    it('llms.txt contains correct counts', () => {
      const llmsPath = path.join(DOCS_ROOT, 'public/llms.txt')

      // Handle missing file gracefully
      if (!fs.existsSync(llmsPath)) {
        throw new Error(
          `llms.txt not found at ${llmsPath}. ` +
            'Ensure the test is running from the correct directory.'
        )
      }

      const content = fs.readFileSync(llmsPath, 'utf-8')

      // Should contain current counts (using LIBRARY_STATS to stay in sync)
      expect(content).toContain(`${LIBRARY_STATS.components}`)
      expect(content).toContain(`${LIBRARY_STATS.hooks}`)
      expect(content).toContain(`${LIBRARY_STATS.themes}`)

      // Should NOT contain deprecated counts
      for (const pattern of DEPRECATED_PATTERNS) {
        expect(content).not.toMatch(pattern)
      }
    })
  })
})
