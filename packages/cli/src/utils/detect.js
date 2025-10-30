/**
 * Environment detection utilities
 */

import { existsSync } from 'fs'
import { join } from 'path'

export function detectPackageManager() {
  if (existsSync(join(process.cwd(), 'yarn.lock'))) {
    return 'yarn'
  }
  if (existsSync(join(process.cwd(), 'pnpm-lock.yaml'))) {
    return 'pnpm'
  }
  if (existsSync(join(process.cwd(), 'bun.lockb'))) {
    return 'bun'
  }
  return 'npm'
}

export function detectFramework() {
  const packageJsonPath = join(process.cwd(), 'package.json')
  
  if (!existsSync(packageJsonPath)) {
    return null
  }
  
  try {
    const packageJson = require(packageJsonPath)
    const deps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies
    }
    
    if (deps['next']) return 'nextjs'
    if (deps['@remix-run/react']) return 'remix'
    if (deps['vite']) return 'vite'
    if (deps['react-scripts']) return 'create-react-app'
    if (deps['gatsby']) return 'gatsby'
    
    return 'react'
  } catch {
    return null
  }
}

export function detectTypeScript() {
  return existsSync(join(process.cwd(), 'tsconfig.json'))
}

export default {
  detectPackageManager,
  detectFramework,
  detectTypeScript
}