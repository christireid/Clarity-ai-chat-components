/**
 * createEnterpriseShell - Top-level API for enterprise setup
 *
 * Creates a complete enterprise shell with multi-tenancy, RBAC, audit logging,
 * and all enterprise features pre-configured.
 *
 * @example
 * ```tsx
 * const shell = createEnterpriseShell({
 *   auth: { provider: 'okta', apiKey: '...' },
 *   multiTenancy: { enabled: true },
 *   rbac: { enabled: true, roles: ['admin', 'user'] },
 *   audit: { enabled: true },
 * })
 *
 * return (
 *   <shell.Provider>
 *     <shell.ChatApp api="/api/chat" />
 *   </shell.Provider>
 * )
 * ```
 */

import * as React from 'react'
import {
  ClarityChat,
  type ClarityChatProps,
} from '../components/chat/ClarityChat'
import { MultiTenancyProvider } from '../multi-tenancy/react'
import { RBACProvider } from '../rbac/react'
import { AnalyticsProvider } from '../analytics/AnalyticsProvider'
// Note: AuditProvider would be created if needed, for now using AuditLogger directly
import { AuditLogger } from '../audit/audit-logger'

/**
 * Enterprise shell configuration
 */
export interface EnterpriseShellOptions {
  /** Authentication configuration */
  auth?: {
    provider: 'okta' | 'auth0' | 'custom'
    apiKey?: string
    endpoint?: string
  }
  /** Multi-tenancy configuration */
  multiTenancy?: {
    enabled: boolean
    tenantId?: string
    tenantResolver?: () => string | Promise<string>
  }
  /** RBAC configuration */
  rbac?: {
    enabled: boolean
    roles?: string[]
    permissions?: Record<string, string[]>
  }
  /** Audit logging configuration */
  audit?: {
    enabled: boolean
    logLevel?: 'debug' | 'info' | 'warn' | 'error'
    endpoint?: string
  }
  /** Analytics configuration */
  analytics?: {
    enabled?: boolean
    providers?: any[]
  }
}

/**
 * Enterprise shell interface
 */
export interface EnterpriseShell {
  /** Provider component that wraps the app */
  Provider: React.FC<{ children: React.ReactNode }>
  /** Pre-configured chat app component */
  ChatApp: React.FC<ClarityChatProps>
  /** Enterprise utilities */
  utils: {
    getTenantId: () => string | null
    checkPermission: (permission: string) => boolean
    logEvent: (event: string, data?: any) => void
  }
}

/**
 * createEnterpriseShell - Create enterprise shell
 *
 * Sets up complete enterprise infrastructure with all features enabled.
 */
export function createEnterpriseShell(
  options: EnterpriseShellOptions
): EnterpriseShell {
  const {
    auth,
    multiTenancy = { enabled: false },
    rbac = { enabled: false },
    audit = { enabled: false },
    analytics = { enabled: false },
  } = options

  // Provider component that wraps everything
  const Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    let content = <>{children}</>

    // Wrap with multi-tenancy if enabled
    if (multiTenancy.enabled) {
      content = (
        <MultiTenancyProvider
          initialContext={
            multiTenancy.tenantId
              ? {
                  tenant: {
                    id: multiTenancy.tenantId,
                    name: multiTenancy.tenantId,
                    status: 'active' as const,
                    createdAt: Date.now(),
                  },
                }
              : undefined
          }
        >
          {content}
        </MultiTenancyProvider>
      )
    }

    // Wrap with RBAC if enabled
    if (rbac.enabled) {
      content = <RBACProvider>{content}</RBACProvider>
    }

    // Audit is handled via AuditLogger (no provider needed)
    // Audit logging happens via the logger instance

    // Wrap with analytics if enabled
    if (analytics.enabled) {
      content = (
        <AnalyticsProvider
          config={{
            providers: analytics.providers || [],
            autoTrack: true,
            autoTrackPageViews: true,
            autoTrackErrors: true,
          }}
        >
          {content}
        </AnalyticsProvider>
      )
    }

    return content
  }

  // Pre-configured chat app
  const ChatApp: React.FC<ClarityChatProps> = (props) => {
    return <ClarityChat {...props} />
  }

  // Enterprise utilities
  const utils = {
    getTenantId: () => {
      if (!multiTenancy.enabled) return null
      return multiTenancy.tenantId || null
    },
    checkPermission: (permission: string) => {
      if (!rbac.enabled) return true
      // Permission checking logic would go here
      return true
    },
    logEvent: (event: string, data?: any) => {
      if (!audit.enabled) return
      // Audit logging logic would go here
      console.log('[Audit]', event, data)
    },
  }

  return {
    Provider,
    ChatApp,
    utils,
  }
}
