import { SecureLogger } from '@/lib/security/secureLogger';
/**
 * Test Suite Entry Point
 *
 * Discovers and runs all test files using Mocha
 */

import * as path from 'path'
import Mocha from 'mocha'
import { glob } from 'glob'

export async function run(): Promise<void> {
  const mocha = new Mocha({
    ui: 'bdd',
    color: true,
    timeout: 10000
  })

  const testsRoot = path.resolve(__dirname, '.')

  const files = await glob('**/*.test.js', { cwd: testsRoot })

  // Add files to the test suite
  files.forEach((f: string) => mocha.addFile(path.resolve(testsRoot, f)))

  return new Promise<void>((resolve, reject) => {
    try {
      mocha.run((failures: number) => {
        if (failures > 0) {
          reject(new Error(`${failures} tests failed.`))
        } else {
          resolve()
        }
      })
    } catch (err) {
      SecureLogger.error(err)
      reject(err)
    }
  })
}
