/**
 * Test utilities for codemod testing
 */

import jscodeshift, { API, FileInfo, Options } from 'jscodeshift'

/**
 * Creates a test API object for jscodeshift transforms
 */
export function createTestAPI(): API {
  return {
    jscodeshift: jscodeshift.withParser('tsx'),
    j: jscodeshift.withParser('tsx'),
    stats: () => {},
    report: () => {},
  } as unknown as API
}

/**
 * Creates a FileInfo object for testing
 */
export function createFileInfo(source: string, path: string = 'test.tsx'): FileInfo {
  return {
    path,
    source,
  }
}

/**
 * Default test options
 */
export function createTestOptions(): Options {
  return {}
}

/**
 * Helper to run a transform and normalize the output
 */
export function runTransform(
  transform: (file: FileInfo, api: API, options: Options) => string | null | undefined,
  source: string,
  path: string = 'test.tsx'
): string | null {
  const fileInfo = createFileInfo(source, path)
  const api = createTestAPI()
  const options = createTestOptions()

  const result = transform(fileInfo, api, options)

  // Handle different return types
  if (result === undefined) {
    return null
  }

  return result
}

/**
 * Normalize whitespace for comparison
 */
export function normalizeCode(code: string): string {
  return code
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}(),;:])\s*/g, '$1')
    .replace(/\s*=\s*/g, '=')
}

/**
 * Assert that transform produces expected output
 */
export function expectTransform(
  transform: (file: FileInfo, api: API, options: Options) => string | null | undefined,
  input: string,
  expected: string
): void {
  const result = runTransform(transform, input)

  if (result === null) {
    throw new Error('Transform returned null (no changes detected)')
  }

  const normalizedResult = normalizeCode(result)
  const normalizedExpected = normalizeCode(expected)

  if (normalizedResult !== normalizedExpected) {
    console.log('Expected:')
    console.log(expected)
    console.log('\nActual:')
    console.log(result)
    throw new Error('Transform output does not match expected')
  }
}

/**
 * Assert that transform makes no changes
 */
export function expectNoChange(
  transform: (file: FileInfo, api: API, options: Options) => string | null | undefined,
  input: string
): void {
  const result = runTransform(transform, input)

  if (result !== null) {
    console.log('Expected no changes, but got:')
    console.log(result)
    throw new Error('Transform should not have made changes')
  }
}

/**
 * Test multiple transform scenarios
 */
export function testTransformScenarios(
  transform: (file: FileInfo, api: API, options: Options) => string | null | undefined,
  scenarios: Array<{
    name: string
    input: string
    expected: string | null
  }>
): void {
  scenarios.forEach(({ name, input, expected }) => {
    if (expected === null) {
      expectNoChange(transform, input)
    } else {
      expectTransform(transform, input, expected)
    }
  })
}
