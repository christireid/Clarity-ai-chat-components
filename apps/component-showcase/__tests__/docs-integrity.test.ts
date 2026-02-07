import { describe, it, expect } from 'vitest'

// Test that all doc data files export valid records
const docModules = [
  'chat-docs',
  'core-chat-docs',
  'messages-docs',
  'ai-reasoning-docs',
  'tools-docs',
  'input-docs',
  'search-docs',
  'token-management-docs',
  'dashboards-docs',
  'code-data-docs',
  'media-files-docs',
  'navigation-docs',
  'citations-docs',
  'feedback-status-docs',
  'suggestions-docs',
  'theme-docs',
  'loading-states-docs',
  'features-docs',
  'clones-docs',
  'primitives-docs',
  'hooks-docs',
]

describe('Documentation Data Files - Structure', () => {
  docModules.forEach((moduleName) => {
    it(`${moduleName} exports a valid docs record`, async () => {
      const mod = await import(`../data/docs/${moduleName}`)
      const exportKeys = Object.keys(mod)
      expect(exportKeys.length).toBeGreaterThan(0)

      // Get the first (and usually only) export
      const docsRecord = mod[exportKeys[0]]
      expect(typeof docsRecord).toBe('object')
      expect(docsRecord).not.toBeNull()

      // Each value should be an object or array with name/description
      for (const [, value] of Object.entries(docsRecord)) {
        if (Array.isArray(value)) {
          value.forEach((doc: Record<string, unknown>) => {
            expect(doc).toHaveProperty('name')
            expect(doc).toHaveProperty('description')
          })
        } else if (value && typeof value === 'object') {
          expect(value).toHaveProperty('name')
          expect(value).toHaveProperty('description')
        }
      }
    })
  })
})

describe('Documentation Data Files - Minimum Coverage', () => {
  const expectedMinKeys: Record<string, number> = {
    'chat-docs': 15,
    'core-chat-docs': 4,
    'messages-docs': 5,
    'ai-reasoning-docs': 4,
    'tools-docs': 6,
    'input-docs': 5,
    'search-docs': 3,
    'token-management-docs': 4,
    'dashboards-docs': 4,
    'code-data-docs': 4,
    'media-files-docs': 4,
    'navigation-docs': 4,
    'citations-docs': 4,
    'feedback-status-docs': 4,
    'suggestions-docs': 4,
    'theme-docs': 3,
    'loading-states-docs': 4,
    'features-docs': 70,
    'clones-docs': 5,
    'primitives-docs': 2,
    'hooks-docs': 28,
  }

  docModules.forEach((moduleName) => {
    it(`${moduleName} has at least ${expectedMinKeys[moduleName] ?? 1} documented sections`, async () => {
      const mod = await import(`../data/docs/${moduleName}`)
      const docsRecord = mod[Object.keys(mod)[0]]
      const keyCount = Object.keys(docsRecord).length
      expect(keyCount).toBeGreaterThanOrEqual(expectedMinKeys[moduleName] ?? 1)
    })
  })
})
