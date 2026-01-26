/**
 * Tests for Peer Dependencies Installation Helper
 */

import { describe, it, expect } from 'vitest'
import {
  FEATURES,
  detectPackageManager,
  generateInstallCommand,
  calculateTotalSize,
} from './install-peers.js'

describe('FEATURES', () => {
  it('should have core features defined', () => {
    expect(FEATURES.core).toBeDefined()
    expect(FEATURES.core.required).toBe(true)
    expect(FEATURES.core.dependencies).toBeDefined()
  })

  it('should have all required fields for each feature', () => {
    Object.entries(FEATURES).forEach(([key, feature]) => {
      expect(feature.name).toBeDefined()
      expect(feature.description).toBeDefined()
      expect(feature.dependencies).toBeDefined()
      expect(feature.bundleSize).toBeDefined()
      expect(typeof feature.bundleSize).toBe('string')
    })
  })

  it('should have valid version ranges', () => {
    Object.values(FEATURES).forEach((feature) => {
      Object.values(feature.dependencies).forEach((version) => {
        expect(typeof version).toBe('string')
        expect(version.length).toBeGreaterThan(0)
      })
    })
  })
})

describe('detectPackageManager', () => {
  it('should return a valid package manager', () => {
    const pm = detectPackageManager()
    expect(['npm', 'yarn', 'pnpm', 'bun']).toContain(pm)
  })

  it('should default to npm if user agent is unknown', () => {
    const originalUserAgent = process.env.npm_config_user_agent
    delete process.env.npm_config_user_agent

    const pm = detectPackageManager()
    expect(pm).toBe('npm')

    // Restore
    if (originalUserAgent) {
      process.env.npm_config_user_agent = originalUserAgent
    }
  })
})

describe('generateInstallCommand', () => {
  it('should generate valid npm install command', () => {
    const features = [FEATURES.core]
    const command = generateInstallCommand(features, 'npm')

    expect(command).toContain('npm install')
    expect(command).toContain('react@')
    expect(command).toContain('framer-motion@')
    expect(command).toContain('lucide-react@')
    expect(command).toContain('zod@')
  })

  it('should generate valid pnpm install command', () => {
    const features = [FEATURES.core]
    const command = generateInstallCommand(features, 'pnpm')

    expect(command).toContain('pnpm add')
    expect(command).toContain('react@')
  })

  it('should generate valid yarn install command', () => {
    const features = [FEATURES.core]
    const command = generateInstallCommand(features, 'yarn')

    expect(command).toContain('yarn add')
    expect(command).toContain('react@')
  })

  it('should generate valid bun install command', () => {
    const features = [FEATURES.core]
    const command = generateInstallCommand(features, 'bun')

    expect(command).toContain('bun add')
    expect(command).toContain('react@')
  })

  it('should include all dependencies from multiple features', () => {
    const features = [FEATURES.core, FEATURES.markdown]
    const command = generateInstallCommand(features, 'npm')

    expect(command).toContain('react@')
    expect(command).toContain('react-markdown@')
    expect(command).toContain('remark-gfm@')
  })

  it('should deduplicate dependencies', () => {
    const features = [FEATURES.core, FEATURES.reactDom]
    const command = generateInstallCommand(features, 'npm')

    // Count occurrences of 'react@'
    const matches = command.match(/react@/g) || []
    expect(matches.length).toBe(2) // react and react-dom, not duplicated
  })
})

describe('calculateTotalSize', () => {
  it('should calculate size in KB for small bundles', () => {
    const features = [FEATURES.core]
    const size = calculateTotalSize(features)

    expect(size).toContain('KB')
    expect(parseInt(size, 10)).toBeGreaterThan(0)
  })

  it('should calculate size in MB for large bundles', () => {
    const features = Object.values(FEATURES)
    const size = calculateTotalSize(features)

    expect(size).toContain('MB')
    expect(parseFloat(size)).toBeGreaterThan(1)
  })

  it('should sum sizes correctly', () => {
    const features = [FEATURES.core, FEATURES.reactDom]
    // Core: 450 KB, React DOM: 130 KB = 580 KB
    const size = calculateTotalSize(features)
    const totalKB = parseInt(size.replace(/[^\d]/g, ''), 10)

    expect(totalKB).toBe(580)
  })

  it('should handle empty features array', () => {
    const size = calculateTotalSize([])
    expect(size).toBe('0 KB')
  })
})

describe('Integration Tests', () => {
  it('should generate complete workflow for minimal preset', () => {
    const features = [FEATURES.core, FEATURES.reactDom]
    const pm = 'npm'
    const command = generateInstallCommand(features, pm)
    const size = calculateTotalSize(features)

    expect(command).toBeTruthy()
    expect(size).toBe('580 KB')
    expect(command).toContain('npm install')
  })

  it('should generate complete workflow for standard preset', () => {
    const features = [
      FEATURES.core,
      FEATURES.reactDom,
      FEATURES.markdown,
      FEATURES.codeHighlighting,
    ]
    const pm = 'pnpm'
    const command = generateInstallCommand(features, pm)
    const size = calculateTotalSize(features)

    expect(command).toBeTruthy()
    expect(size).toBe('860 KB')
    expect(command).toContain('pnpm add')
  })

  it('should generate complete workflow for full preset', () => {
    const features = Object.values(FEATURES)
    const pm = 'yarn'
    const command = generateInstallCommand(features, pm)
    const size = calculateTotalSize(features)

    expect(command).toBeTruthy()
    expect(size).toContain('MB')
    expect(command).toContain('yarn add')
  })
})

describe('Feature Validation', () => {
  it('should have non-zero bundle sizes', () => {
    Object.values(FEATURES).forEach((feature) => {
      const sizeMatch = feature.bundleSize.match(/(\d+)\s*(KB|MB)/)
      expect(sizeMatch).toBeTruthy()

      const size = parseInt(sizeMatch[1], 10)
      expect(size).toBeGreaterThan(0)
    })
  })

  it('should have at least one dependency per feature', () => {
    Object.values(FEATURES).forEach((feature) => {
      expect(Object.keys(feature.dependencies).length).toBeGreaterThan(0)
    })
  })

  it('should have description for each feature', () => {
    Object.values(FEATURES).forEach((feature) => {
      expect(feature.description.length).toBeGreaterThan(10)
    })
  })
})
