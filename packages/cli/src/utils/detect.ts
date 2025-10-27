/**
 * Framework and environment detection utilities
 */

import fs from 'fs-extra'
import path from 'path'

export async function detectFramework(cwd: string): Promise<string | null> {
  try {
    const packageJsonPath = path.join(cwd, 'package.json')
    
    if (!await fs.pathExists(packageJsonPath)) {
      return null
    }

    const packageJson = await fs.readJson(packageJsonPath)
    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies }

    // Check for framework dependencies
    if (deps['next']) return 'nextjs'
    if (deps['@remix-run/react']) return 'remix'
    if (deps['astro']) return 'astro'
    if (deps['vite'] && deps['react']) return 'vite'

    return null
  } catch (error) {
    return null
  }
}

export async function detectPackageManager(cwd: string): Promise<string> {
  if (await fs.pathExists(path.join(cwd, 'pnpm-lock.yaml'))) return 'pnpm'
  if (await fs.pathExists(path.join(cwd, 'yarn.lock'))) return 'yarn'
  if (await fs.pathExists(path.join(cwd, 'package-lock.json'))) return 'npm'
  if (await fs.pathExists(path.join(cwd, 'bun.lockb'))) return 'bun'
  
  return 'npm' // default
}

export async function isTypeScriptProject(cwd: string): Promise<boolean> {
  return await fs.pathExists(path.join(cwd, 'tsconfig.json'))
}

export async function hasTailwind(cwd: string): Promise<boolean> {
  const configFiles = [
    'tailwind.config.js',
    'tailwind.config.ts',
    'tailwind.config.cjs',
    'tailwind.config.mjs',
  ]

  for (const file of configFiles) {
    if (await fs.pathExists(path.join(cwd, file))) {
      return true
    }
  }

  return false
}
