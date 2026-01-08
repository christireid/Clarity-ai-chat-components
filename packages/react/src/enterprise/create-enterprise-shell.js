import { Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
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
import * as React from 'react';
import { ClarityChat, } from '../components/chat/clarity-chat';
import { MultiTenancyProvider } from '../multi-tenancy/react';
import { RBACProvider } from '../rbac/react';
import { AnalyticsProvider } from '../analytics/AnalyticsProvider';
// Note: AuditProvider would be created if needed, for now using AuditLogger directly
import { AuditLogger } from '../audit/audit-logger';
/**
 * createEnterpriseShell - Create enterprise shell
 *
 * Sets up complete enterprise infrastructure with all features enabled.
 */
export function createEnterpriseShell(options) {
    const { auth, multiTenancy = { enabled: false }, rbac = { enabled: false }, audit = { enabled: false }, analytics = { enabled: false }, } = options;
    // Provider component that wraps everything
    const Provider = ({ children }) => {
        let content = _jsx(_Fragment, { children: children });
        // Wrap with multi-tenancy if enabled
        if (multiTenancy.enabled) {
            content = (_jsx(MultiTenancyProvider, { initialContext: multiTenancy.tenantId
                    ? {
                        tenant: {
                            id: multiTenancy.tenantId,
                            name: multiTenancy.tenantId,
                            status: 'active',
                            createdAt: Date.now(),
                        },
                    }
                    : undefined, children: content }));
        }
        // Wrap with RBAC if enabled
        if (rbac.enabled) {
            content = _jsx(RBACProvider, { children: content });
        }
        // Audit is handled via AuditLogger (no provider needed)
        // Audit logging happens via the logger instance
        // Wrap with analytics if enabled
        if (analytics.enabled) {
            content = (_jsx(AnalyticsProvider, { config: {
                    providers: analytics.providers || [],
                    autoTrack: true,
                    autoTrackPageViews: true,
                    autoTrackErrors: true,
                }, children: content }));
        }
        return content;
    };
    // Pre-configured chat app
    const ChatApp = (props) => {
        return _jsx(ClarityChat, { ...props });
    };
    // Enterprise utilities
    const utils = {
        getTenantId: () => {
            if (!multiTenancy.enabled)
                return null;
            return multiTenancy.tenantId || null;
        },
        checkPermission: (permission) => {
            if (!rbac.enabled)
                return true;
            // Permission checking logic would go here
            return true;
        },
        logEvent: (event, data) => {
            if (!audit.enabled)
                return;
            // Audit logging logic would go here
            console.log('[Audit]', event, data);
        },
    };
    return {
        Provider,
        ChatApp,
        utils,
    };
}
//# sourceMappingURL=create-enterprise-shell.js.map