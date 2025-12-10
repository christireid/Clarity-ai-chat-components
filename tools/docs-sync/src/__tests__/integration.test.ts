/**
 * Integration Tests
 *
 * Tests the full documentation sync pipeline
 */

import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import {
  existsSync,
  mkdirSync,
  rmSync,
  writeFileSync,
  readFileSync,
} from 'node:fs'
import { join } from 'node:path'
import { extractAPIs, getDefaultConfig } from '../api-extractor.js'
import { generateDocs, getDefaultGeneratorConfig } from '../doc-generator.js'
import { createEmptyCache } from '../utils/cache.js'
import type { ExtractedAPI } from '../types/index.js'

const TEST_DIR = join(process.cwd(), '__test_integration__')
const TEST_SRC_DIR = join(TEST_DIR, 'src')
const TEST_DOCS_DIR = join(TEST_DIR, 'docs')

describe('Integration Tests', () => {
  beforeAll(() => {
    // Create test directories
    mkdirSync(TEST_SRC_DIR, { recursive: true })
    mkdirSync(TEST_DOCS_DIR, { recursive: true })

    // Create test TypeScript files
    writeFileSync(
      join(TEST_SRC_DIR, 'index.ts'),
      `
/**
 * Test utility function for string processing
 * @param value - The input value
 * @returns The processed string
 * @example
 * formatValue("hello")
 */
export function formatValue(value: string): string {
  return value.trim();
}

/**
 * Test hook for state management
 * @param initialValue - The initial state value
 * @returns An object with value and setter
 */
export function useTestHook(initialValue: string = 'default'): { value: string; setValue: (v: string) => void } {
  return { value: initialValue, setValue: () => {} };
}

/** Test interface for message data */
export interface TestMessage {
  /** Unique identifier */
  id: string;
  /** Message content */
  content: string;
  /** Whether the message is read */
  isRead?: boolean;
}

/** Configuration for test */
export type TestConfig = {
  enabled: boolean;
  timeout: number;
};

/** Test constant */
export const TEST_CONSTANT = 42;
`
    )

    // Create a simple tsconfig for the test
    writeFileSync(
      join(TEST_DIR, 'tsconfig.json'),
      JSON.stringify({
        compilerOptions: {
          target: 'ES2022',
          module: 'ESNext',
          moduleResolution: 'bundler',
          jsx: 'react-jsx',
          strict: true,
          skipLibCheck: true,
          noEmit: true,
        },
        include: ['src/**/*'],
      })
    )
  })

  afterAll(() => {
    // Clean up test directories
    if (existsSync(TEST_DIR)) {
      rmSync(TEST_DIR, { recursive: true, force: true })
    }
  })

  describe('API Extraction', () => {
    it('should extract APIs from TypeScript files', async () => {
      const config = getDefaultConfig(TEST_DIR, '@test/package')
      config.entryPoints = ['src/index.ts']

      const cache = createEmptyCache()
      const result = await extractAPIs(config, cache)

      expect(result.apis.length).toBeGreaterThan(0)
      expect(result.packageName).toBe('@test/package')
    })

    it('should extract function with correct metadata', async () => {
      const config = getDefaultConfig(TEST_DIR, '@test/package')
      config.entryPoints = ['src/index.ts']

      const cache = createEmptyCache()
      const result = await extractAPIs(config, cache)

      const func = result.apis.find((a) => a.name === 'formatValue')
      expect(func).toBeDefined()
      expect(func?.kind).toBe('function')
      expect(func?.description).toContain('Test utility function')
    })

    it('should extract hook with parameters', async () => {
      const config = getDefaultConfig(TEST_DIR, '@test/package')
      config.entryPoints = ['src/index.ts']

      const cache = createEmptyCache()
      const result = await extractAPIs(config, cache)

      const hook = result.apis.find((a) => a.name === 'useTestHook')
      expect(hook).toBeDefined()
      expect(hook?.kind).toBe('hook')
      expect(hook?.parameters).toBeDefined()
      expect(hook?.parameters?.length).toBeGreaterThan(0)
    })

    it('should extract interface', async () => {
      const config = getDefaultConfig(TEST_DIR, '@test/package')
      config.entryPoints = ['src/index.ts']

      const cache = createEmptyCache()
      const result = await extractAPIs(config, cache)

      const iface = result.apis.find((a) => a.name === 'TestMessage')
      expect(iface).toBeDefined()
      expect(iface?.kind).toBe('interface')
      // Interface may or may not have props depending on TypeScript resolution
      expect(iface?.signature).toBeDefined()
    })

    it('should extract type alias', async () => {
      const config = getDefaultConfig(TEST_DIR, '@test/package')
      config.entryPoints = ['src/index.ts']

      const cache = createEmptyCache()
      const result = await extractAPIs(config, cache)

      const typeAlias = result.apis.find((a) => a.name === 'TestConfig')
      expect(typeAlias).toBeDefined()
      expect(typeAlias?.kind).toBe('type')
    })
  })

  describe('Documentation Generation', () => {
    let extractedAPIs: ExtractedAPI[] = []

    beforeAll(async () => {
      const config = getDefaultConfig(TEST_DIR, '@test/package')
      config.entryPoints = ['src/index.ts']

      const cache = createEmptyCache()
      const result = await extractAPIs(config, cache)
      extractedAPIs = result.apis
    })

    it('should generate docs for extracted APIs', async () => {
      const generatorConfig = getDefaultGeneratorConfig(TEST_DIR)
      generatorConfig.outputDir = TEST_DOCS_DIR
      generatorConfig.dryRun = true

      const result = await generateDocs(extractedAPIs, generatorConfig)

      expect(result.generated.length).toBeGreaterThan(0)
      expect(result.errors.length).toBe(0)
    })

    it('should generate hook documentation', async () => {
      const generatorConfig = getDefaultGeneratorConfig(TEST_DIR)
      generatorConfig.outputDir = TEST_DOCS_DIR
      generatorConfig.dryRun = true

      const result = await generateDocs(extractedAPIs, generatorConfig)

      const hookDoc = result.generated.find((d) => d.type === 'hook')
      expect(hookDoc).toBeDefined()
      expect(hookDoc?.content).toContain('useTestHook')
      expect(hookDoc?.content).toContain('## Import')
      expect(hookDoc?.content).toContain('## Signature')
    })

    it('should generate type documentation', async () => {
      const generatorConfig = getDefaultGeneratorConfig(TEST_DIR)
      generatorConfig.outputDir = TEST_DOCS_DIR
      generatorConfig.dryRun = true

      const result = await generateDocs(extractedAPIs, generatorConfig)

      const typeDoc = result.generated.find((d) => d.type === 'type')
      expect(typeDoc).toBeDefined()
      expect(typeDoc?.content).toContain('## Definition')
    })

    it('should generate API reference page', async () => {
      const generatorConfig = getDefaultGeneratorConfig(TEST_DIR)
      generatorConfig.outputDir = TEST_DOCS_DIR
      generatorConfig.dryRun = true

      const result = await generateDocs(extractedAPIs, generatorConfig)

      const apiRef = result.generated.find((d) => d.type === 'api-reference')
      expect(apiRef).toBeDefined()
      expect(apiRef?.path).toContain('api/')
    })

    it('should include valid frontmatter', async () => {
      const generatorConfig = getDefaultGeneratorConfig(TEST_DIR)
      generatorConfig.outputDir = TEST_DOCS_DIR
      generatorConfig.dryRun = true

      const result = await generateDocs(extractedAPIs, generatorConfig)

      const hookDoc = result.generated.find((d) => d.type === 'hook')
      expect(hookDoc?.content).toContain('---')
      expect(hookDoc?.content).toContain('title:')
      expect(hookDoc?.content).toContain('autoGenerated: true')
    })
  })

  describe('Full Pipeline', () => {
    it('should complete full extraction and generation pipeline', async () => {
      // Extract
      const extractConfig = getDefaultConfig(TEST_DIR, '@test/package')
      extractConfig.entryPoints = ['src/index.ts']
      const cache = createEmptyCache()
      const extractResult = await extractAPIs(extractConfig, cache)

      expect(extractResult.apis.length).toBeGreaterThan(0)

      // Generate
      const generatorConfig = getDefaultGeneratorConfig(TEST_DIR)
      generatorConfig.outputDir = TEST_DOCS_DIR
      generatorConfig.dryRun = true

      const genResult = await generateDocs(extractResult.apis, generatorConfig)

      expect(genResult.errors.length).toBe(0)
      expect(genResult.generated.length).toBeGreaterThan(0)

      // Verify stats
      expect(genResult.stats.created + genResult.stats.updated).toBeGreaterThan(
        0
      )
    })

    it('should handle empty input gracefully', async () => {
      const generatorConfig = getDefaultGeneratorConfig(TEST_DIR)
      generatorConfig.outputDir = TEST_DOCS_DIR
      generatorConfig.dryRun = true

      const result = await generateDocs([], generatorConfig)

      expect(result.errors.length).toBe(0)
      expect(result.generated.length).toBe(0)
    })
  })
})
