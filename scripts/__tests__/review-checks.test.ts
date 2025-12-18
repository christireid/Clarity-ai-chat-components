import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import * as fs from 'fs'
import * as path from 'path'
import { CHECKS, checkFile, parseSuppressions, isSuppressed } from '../review-checks'
import type { Options } from '../review-checks'

const fixturesDir = path.join(__dirname, 'fixtures')

const defaultOptions: Options = {
  staged: false,
  fix: false,
  output: 'console',
  help: false,
  files: [],
}

describe('review-checks', () => {
  describe('CHECKS configuration', () => {
    it('should have all expected check rules', () => {
      const expectedRules = [
        'arbitraryTailwind',
        'hardcodedColors',
        'missingUseClient',
        'explicitAny',
        'dangerousHtml',
        'dynamicUrl',
        'nativeImg',
        'inlineArrowJsx',
        'consoleLog',
        'todoComments',
      ]

      for (const rule of expectedRules) {
        expect(CHECKS).toHaveProperty(rule)
      }
    })

    it('should have valid severity levels for all checks', () => {
      for (const [name, check] of Object.entries(CHECKS)) {
        expect(['error', 'warning']).toContain(check.severity)
      }
    })

    it('should have messages for all checks', () => {
      for (const [name, check] of Object.entries(CHECKS)) {
        expect(check.message).toBeTruthy()
        expect(typeof check.message).toBe('string')
      }
    })
  })

  describe('parseSuppressions', () => {
    it('should parse line-level suppressions', () => {
      const content = `
const x = 1
// review-ignore: consoleLog
SecureLogger.debug('test')
`
      const result = parseSuppressions(content)

      expect(result.lineSuppressions.get(3)).toBeDefined()
      expect(result.lineSuppressions.get(3)?.has('consoleLog')).toBe(true)
    })

    it('should parse next-line suppressions', () => {
      const content = `
// review-ignore-next-line: explicitAny
const data: any = {}
`
      const result = parseSuppressions(content)

      expect(result.lineSuppressions.get(3)).toBeDefined()
      expect(result.lineSuppressions.get(3)?.has('explicitAny')).toBe(true)
    })

    it('should parse file-level suppressions', () => {
      const content = `
// review-ignore-file: todoComments, consoleLog
const x = 1
`
      const result = parseSuppressions(content)

      expect(result.fileSuppressions.has('todoComments')).toBe(true)
      expect(result.fileSuppressions.has('consoleLog')).toBe(true)
    })

    it('should parse multiple rules on one line', () => {
      const content = `
// review-ignore: consoleLog, explicitAny, todoComments
const x = 1
`
      const result = parseSuppressions(content)
      const suppressed = result.lineSuppressions.get(2)

      expect(suppressed?.has('consoleLog')).toBe(true)
      expect(suppressed?.has('explicitAny')).toBe(true)
      expect(suppressed?.has('todoComments')).toBe(true)
    })
  })

  describe('isSuppressed', () => {
    it('should return true for suppressed rules', () => {
      const suppressions = parseSuppressions(`
// review-ignore: consoleLog
SecureLogger.debug('test')
`)

      expect(isSuppressed(suppressions, 'consoleLog', 2)).toBe(true)
      expect(isSuppressed(suppressions, 'explicitAny', 2)).toBe(false)
    })

    it('should support "all" suppression', () => {
      const suppressions = parseSuppressions(`
// review-ignore: all
const data: any = {}
SecureLogger.debug('test')
`)

      expect(isSuppressed(suppressions, 'consoleLog', 2)).toBe(true)
      expect(isSuppressed(suppressions, 'explicitAny', 2)).toBe(true)
    })

    it('should support file-level "all" suppression', () => {
      const suppressions = parseSuppressions(`
// review-ignore-file: all
const data: any = {}
`)

      expect(isSuppressed(suppressions, 'consoleLog', 10)).toBe(true)
      expect(isSuppressed(suppressions, 'explicitAny', 20)).toBe(true)
    })
  })

  describe('checkFile', () => {
    it('should detect arbitrary Tailwind values', async () => {
      const filePath = path.join(fixturesDir, 'bad-tailwind.tsx')
      const result = await checkFile(filePath, defaultOptions)

      const tailwindIssues = result.issues.filter((i) => i.rule === 'arbitraryTailwind')
      expect(tailwindIssues.length).toBeGreaterThan(0)
    })

    it('should detect hardcoded colors', async () => {
      const filePath = path.join(fixturesDir, 'bad-tailwind.tsx')
      const result = await checkFile(filePath, defaultOptions)

      const colorIssues = result.issues.filter((i) => i.rule === 'hardcodedColors')
      expect(colorIssues.length).toBeGreaterThan(0)
    })

    it('should detect explicit any types', async () => {
      const filePath = path.join(fixturesDir, 'bad-typescript.ts')
      const result = await checkFile(filePath, defaultOptions)

      const anyIssues = result.issues.filter((i) => i.rule === 'explicitAny')
      expect(anyIssues.length).toBeGreaterThan(0)
    })

    it('should detect dangerouslySetInnerHTML', async () => {
      const filePath = path.join(fixturesDir, 'bad-security.tsx')
      const result = await checkFile(filePath, defaultOptions)

      const htmlIssues = result.issues.filter((i) => i.rule === 'dangerousHtml')
      expect(htmlIssues.length).toBeGreaterThan(0)
    })

    it('should respect suppression comments', async () => {
      const filePath = path.join(fixturesDir, 'with-suppressions.tsx')
      const result = await checkFile(filePath, defaultOptions)

      // consoleLog should be suppressed on line with comment
      const consoleIssues = result.issues.filter((i) => i.rule === 'consoleLog')
      expect(consoleIssues.length).toBe(0)

      // todoComments should be suppressed file-wide
      const todoIssues = result.issues.filter((i) => i.rule === 'todoComments')
      expect(todoIssues.length).toBe(0)
    })

    it('should pass clean files with no issues', async () => {
      const filePath = path.join(fixturesDir, 'clean-file.tsx')
      const result = await checkFile(filePath, defaultOptions)

      // Clean file should have no errors
      const errors = result.issues.filter((i) => i.severity === 'error')
      expect(errors.length).toBe(0)
    })

    it('should include correct line numbers', async () => {
      const filePath = path.join(fixturesDir, 'bad-tailwind.tsx')
      const result = await checkFile(filePath, defaultOptions)

      for (const issue of result.issues) {
        expect(issue.line).toBeGreaterThan(0)
        expect(typeof issue.line).toBe('number')
      }
    })

    it('should include fixable flag', async () => {
      const filePath = path.join(fixturesDir, 'bad-typescript.ts')
      const result = await checkFile(filePath, defaultOptions)

      const consoleIssues = result.issues.filter((i) => i.rule === 'consoleLog')
      for (const issue of consoleIssues) {
        expect(issue.fixable).toBe(true)
      }
    })
  })

  describe('auto-fix functionality', () => {
    const tempFile = path.join(fixturesDir, 'temp-fix-test.ts')

    beforeEach(() => {
      fs.writeFileSync(
        tempFile,
        `
// Test file for auto-fix
SecureLogger.debug('should be removed')
const x = 1
SecureLogger.debug('also removed')
`
      )
    })

    afterEach(() => {
      if (fs.existsSync(tempFile)) {
        fs.unlinkSync(tempFile)
      }
    })

    it('should remove console.log statements with --fix', async () => {
      const options = { ...defaultOptions, fix: true }
      const result = await checkFile(tempFile, options)

      expect(result.fixed.length).toBeGreaterThan(0)

      const content = fs.readFileSync(tempFile, 'utf-8')
      expect(content).not.toContain('console.log')
      expect(content).not.toContain('console.debug')
      expect(content).toContain('const x = 1')
    })
  })

  describe('edge cases', () => {
    it('should handle non-existent files gracefully', async () => {
      const result = await checkFile('/non/existent/file.ts', defaultOptions)
      expect(result.issues).toEqual([])
      expect(result.fixed).toEqual([])
    })

    it('should handle empty files', async () => {
      const tempFile = path.join(fixturesDir, 'temp-empty.ts')
      fs.writeFileSync(tempFile, '')

      try {
        const result = await checkFile(tempFile, defaultOptions)
        expect(result.issues).toEqual([])
      } finally {
        fs.unlinkSync(tempFile)
      }
    })

    it('should exclude files matching exclude patterns', async () => {
      // The consoleLog rule excludes scripts/ directory
      const result = await checkFile(__filename, defaultOptions)
      const consoleIssues = result.issues.filter((i) => i.rule === 'consoleLog')
      expect(consoleIssues.length).toBe(0)
    })
  })
})
