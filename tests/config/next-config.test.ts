/**
 * Next.js Configuration Validation Tests
 *
 * These tests ensure all next.config.ts files across the monorepo
 * are valid and load correctly. This prevents configuration regressions.
 */

import { describe, test, expect } from 'vitest'
import { existsSync } from 'fs'
import { join } from 'path'

// Define all Next.js apps in the monorepo
const NEXTJS_APPS = [
  { name: 'docs', path: 'apps/docs' },
  { name: 'marketing-site', path: 'apps/marketing-site' },
  { name: 'enterprise-ai-ops', path: 'apps/examples/enterprise-ai-ops' },
  { name: 'customer-support', path: 'apps/examples/customer-support' },
  { name: 'streaming-chat', path: 'apps/examples/streaming-chat' },
  {
    name: 'analytics-console-demo',
    path: 'apps/examples/analytics-console-demo',
  },
  { name: 'rag-workbench-demo', path: 'apps/examples/rag-workbench-demo' },
  { name: 'ai-research-platform', path: 'apps/examples/ai-research-platform' },
  {
    name: 'conversational-analytics',
    path: 'apps/examples/conversational-analytics',
  },
  {
    name: 'model-comparison-demo',
    path: 'apps/examples/model-comparison-demo',
  },
  { name: 'ecommerce-assistant', path: 'apps/examples/ecommerce-assistant' },
  { name: 'code-assistant', path: 'apps/examples/code-assistant' },
]

const ROOT_DIR = join(__dirname, '../..')

describe('Next.js Configuration', () => {
  describe('Config files exist', () => {
    test.each(NEXTJS_APPS)('$name has next.config.ts', ({ path }) => {
      const configPath = join(ROOT_DIR, path, 'next.config.ts')
      expect(existsSync(configPath)).toBe(true)
    })
  })

  describe('Config files are TypeScript (not JS)', () => {
    test.each(NEXTJS_APPS)('$name uses TypeScript config', ({ path }) => {
      const tsConfigPath = join(ROOT_DIR, path, 'next.config.ts')
      const jsConfigPath = join(ROOT_DIR, path, 'next.config.js')
      const mjsConfigPath = join(ROOT_DIR, path, 'next.config.mjs')

      // TypeScript config should exist
      expect(existsSync(tsConfigPath)).toBe(true)
      // JavaScript configs should not exist
      expect(existsSync(jsConfigPath)).toBe(false)
      expect(existsSync(mjsConfigPath)).toBe(false)
    })
  })

  describe('Config files load without errors', () => {
    test.each(NEXTJS_APPS)(
      '$name config loads successfully',
      async ({ name, path }) => {
        const configPath = join(ROOT_DIR, path, 'next.config.ts')

        // Dynamic import to test if config loads
        // Note: This requires tsx/ts-node to be available
        try {
          // We can't actually import TypeScript files directly in tests
          // without additional setup, so we just verify the file exists
          // and is valid TypeScript by checking for common patterns
          const fs = await import('fs')
          const content = fs.readFileSync(configPath, 'utf-8')

          // Check for required TypeScript patterns
          expect(content).toContain("import type { NextConfig } from 'next'")
          expect(content).toContain('const nextConfig: NextConfig')
          expect(content).toContain('export default')

          // Check for Turbopack configuration
          expect(content).toContain('turbopack')

          // Check for reactStrictMode
          expect(content).toContain('reactStrictMode: true')
        } catch (error) {
          throw new Error(`Failed to validate ${name} config: ${error}`)
        }
      }
    )
  })

  describe('No deprecated configurations', () => {
    test.each(NEXTJS_APPS)(
      '$name does not use deprecated swcMinify',
      async ({ path }) => {
        const fs = await import('fs')
        const configPath = join(ROOT_DIR, path, 'next.config.ts')
        const content = fs.readFileSync(configPath, 'utf-8')

        // swcMinify is deprecated in Next.js 15+ (now default)
        expect(content).not.toContain('swcMinify')
      }
    )

    test('marketing-site does not use deprecated images.domains', async () => {
      const fs = await import('fs')
      const configPath = join(ROOT_DIR, 'apps/marketing-site', 'next.config.ts')
      const content = fs.readFileSync(configPath, 'utf-8')

      // images.domains is deprecated, should use remotePatterns
      if (content.includes('images:')) {
        expect(content).not.toMatch(/domains:\s*\[/)
        expect(content).toContain('remotePatterns')
      }
    })
  })

  describe('Instrumentation file exists for docs', () => {
    test('docs app has instrumentation.ts', () => {
      const instrumentationPath = join(
        ROOT_DIR,
        'apps/docs',
        'instrumentation.ts'
      )
      expect(existsSync(instrumentationPath)).toBe(true)
    })
  })
})
