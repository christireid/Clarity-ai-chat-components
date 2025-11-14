/**
 * Framework and environment detection utilities
 */

import fs from 'fs-extra'
import path from 'path'

/**
 * Detect the framework used in a project
 * 
 * @param cwd - Current working directory
 * @returns Framework name or null if not detected
 */
export async function detectFramework(cwd: string): Promise<string | null> {
  try {
    const packageJsonPath = path.join(cwd, 'package.json')
    
    if (!await fs.pathExists(packageJsonPath)) {
      return null
    }

    const packageJson = await fs.readJson(packageJsonPath)
    
    // Handle missing dependencies gracefully
    const deps = {
      ...(packageJson.dependencies || {}),
      ...(packageJson.devDependencies || {}),
    }

    // Check for framework dependencies (order matters - more specific first)
    if (deps['next']) return 'nextjs'
    if (deps['@remix-run/react']) return 'remix'
    if (deps['astro']) return 'astro'
    if (deps['vite'] && deps['react']) return 'vite'

    return null
  } catch (error) {
    // Silently fail - framework detection is not critical
    return null
  }
}

/**
 * Detect the package manager used in a project
 * 
 * @param cwd - Current working directory
 * @returns Package manager name (defaults to 'npm')
 */
export async function detectPackageManager(cwd: string): Promise<string> {
  try {
    // Check lock files in order of specificity
    if (await fs.pathExists(path.join(cwd, 'pnpm-lock.yaml'))) return 'pnpm'
    if (await fs.pathExists(path.join(cwd, 'yarn.lock'))) return 'yarn'
    if (await fs.pathExists(path.join(cwd, 'bun.lockb'))) return 'bun'
    if (await fs.pathExists(path.join(cwd, 'package-lock.json'))) return 'npm'
    
    return 'npm' // default fallback
  } catch {
    return 'npm' // default fallback on error
  }
}

/**
 * Check if project uses TypeScript
 * 
 * @param cwd - Current working directory
 * @returns True if TypeScript is detected
 */
export async function isTypeScriptProject(cwd: string): Promise<boolean> {
  try {
    return await fs.pathExists(path.join(cwd, 'tsconfig.json'))
  } catch {
    return false
  }
}

/**
 * Check if project has Tailwind CSS configured
 * 
 * @param cwd - Current working directory
 * @returns True if Tailwind is detected
 */
export async function hasTailwind(cwd: string): Promise<boolean> {
  const configFiles = [
    'tailwind.config.js',
    'tailwind.config.ts',
    'tailwind.config.cjs',
    'tailwind.config.mjs',
  ]

  try {
    for (const file of configFiles) {
      if (await fs.pathExists(path.join(cwd, file))) {
        return true
      }
    }
  } catch {
    // Silently fail
  }

  return false
}
