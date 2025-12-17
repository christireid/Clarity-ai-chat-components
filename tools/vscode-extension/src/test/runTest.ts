import { SecureLogger } from '@/lib/security/secureLogger';
/**
 * VS Code Extension Test Runner
 *
 * Uses @vscode/test-electron to run tests in VS Code environment
 */

import * as path from 'path'
import { runTests } from '@vscode/test-electron'

async function main() {
  try {
    // The folder containing the Extension Manifest package.json
    const extensionDevelopmentPath = path.resolve(__dirname, '../../')

    // The path to the extension test script
    const extensionTestsPath = path.resolve(__dirname, './suite/index')

    // Download VS Code, unzip it and run the integration test
    await runTests({
      extensionDevelopmentPath,
      extensionTestsPath,
      launchArgs: [
        '--disable-extensions', // Disable other extensions
        '--disable-gpu' // Faster in CI
      ]
    })
  } catch (err) {
    SecureLogger.error('Failed to run tests:', err)
    process.exit(1)
  }
}

main()
