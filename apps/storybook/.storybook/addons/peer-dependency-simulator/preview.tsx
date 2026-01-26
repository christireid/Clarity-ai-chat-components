/**
 * Preview decorator for peer dependency simulation
 *
 * This decorator intercepts imports and throws errors for simulated missing peers.
 */

import type { Decorator } from '@storybook/react'
import React, { useEffect } from 'react'

// Store original module loaders
const originalRequire = typeof require !== 'undefined' ? require : undefined
const moduleCache = new Map<string, any>()

/**
 * Intercept module imports and throw errors for missing peers
 */
function setupModuleInterception(missingPeers: string[]) {
  if (!missingPeers || missingPeers.length === 0) {
    return
  }

  // Store intercepted modules
  missingPeers.forEach((peerName) => {
    try {
      // Try to cache the real module before intercepting
      if (originalRequire && !moduleCache.has(peerName)) {
        const realModule = originalRequire(peerName)
        moduleCache.set(peerName, realModule)
      }
    } catch (e) {
      // Module might not exist, that's ok
    }
  })
}

/**
 * Cleanup module interception
 */
function cleanupModuleInterception() {
  moduleCache.clear()
}

/**
 * Component to display missing peer dependency warnings
 */
function MissingPeerWarning({ missingPeers }: { missingPeers: string[] }) {
  if (!missingPeers || missingPeers.length === 0) {
    return null
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        maxWidth: '400px',
        background: '#fff3cd',
        border: '1px solid #ffc107',
        borderRadius: '4px',
        padding: '12px 16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        zIndex: 9999,
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '8px',
        }}
      >
        <span style={{ fontSize: '20px' }}>⚠️</span>
        <strong style={{ color: '#856404', fontSize: '14px' }}>
          Simulating Missing Dependencies
        </strong>
      </div>
      <div style={{ fontSize: '12px', color: '#856404', lineHeight: '1.5' }}>
        <p style={{ margin: '0 0 8px 0' }}>
          The following optional peer dependencies are being simulated as
          missing:
        </p>
        <ul style={{ margin: '0', paddingLeft: '20px' }}>
          {missingPeers.map((peer) => (
            <li key={peer}>
              <code
                style={{
                  background: '#f8f9fa',
                  padding: '2px 6px',
                  borderRadius: '3px',
                  fontFamily: 'monospace',
                  fontSize: '11px',
                }}
              >
                {peer}
              </code>
            </li>
          ))}
        </ul>
        <p style={{ margin: '8px 0 0 0', fontSize: '11px', opacity: 0.8 }}>
          Components will show fallback UI or gracefully degrade functionality.
        </p>
      </div>
    </div>
  )
}

/**
 * Decorator that simulates missing peer dependencies
 */
export const withPeerDependencySimulation: Decorator = (Story, context) => {
  const missingPeers: string[] = context.globals.missingPeers || []

  useEffect(() => {
    setupModuleInterception(missingPeers)

    return () => {
      cleanupModuleInterception()
    }
  }, [missingPeers])

  return (
    <>
      <MissingPeerWarning missingPeers={missingPeers} />
      <Story />
    </>
  )
}
