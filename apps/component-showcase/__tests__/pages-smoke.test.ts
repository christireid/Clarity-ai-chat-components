import { describe, it, expect } from 'vitest'

const pageModules = [
  'chat/page',
  'core-chat/page',
  'messages/page',
  'ai-reasoning/page',
  'tools/page',
  'input/page',
  'search/page',
  'token-management/page',
  'dashboards/page',
  'code-data/page',
  'media-files/page',
  'navigation/page',
  'citations/page',
  'feedback-status/page',
  'suggestions/page',
  'theme/page',
  'loading-states/page',
  'features/page',
  'clones/page',
  'primitives/page',
  'hooks/page',
  'playground/page',
  'stats/page',
  'connected/page',
]

describe('Showcase Pages - Module Exports', () => {
  pageModules.forEach((modulePath) => {
    const pageName = modulePath.replace('/page', '')
    it(`${pageName} exports a default page component`, async () => {
      const mod = await import(`../app/${modulePath}`)
      expect(mod.default).toBeDefined()
      expect(typeof mod.default).toBe('function')
    })
  })
})

describe('Showcase Pages - Chat Demo Modules', () => {
  const demoModules = [
    'agentic-chat-demo',
    'approval-card-demo',
    'chain-of-thought-demo',
    'code-terminal-demo',
    'file-tree-demo',
    'model-search-date-demos',
    'retry-logic-demo',
    'safety-alerts-demo',
    'small-demos',
  ]

  demoModules.forEach((moduleName) => {
    it(`chat/demos/${moduleName} exports at least one component`, async () => {
      const mod = await import(`../app/chat/demos/${moduleName}`)
      const exportNames = Object.keys(mod)
      expect(exportNames.length).toBeGreaterThan(0)
      exportNames.forEach((name) => {
        expect(typeof mod[name]).toBe('function')
      })
    })
  })
})

describe('Showcase Pages - Hooks Demo Modules', () => {
  const hooksDemoModules = ['streaming-demos', 'provider-demos']

  hooksDemoModules.forEach((moduleName) => {
    it(`hooks/demos/${moduleName} exports at least one component`, async () => {
      const mod = await import(`../app/hooks/demos/${moduleName}`)
      const exportNames = Object.keys(mod)
      expect(exportNames.length).toBeGreaterThan(0)
      exportNames.forEach((name) => {
        expect(typeof mod[name]).toBe('function')
      })
    })
  })
})
