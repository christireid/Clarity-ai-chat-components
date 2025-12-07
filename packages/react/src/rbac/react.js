import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import { RBACManager, MemoryRBACStorage } from './rbac-manager';
const RBACReactContext = React.createContext(null);
/**
 * Provides RBAC utilities via React context.
 */
export function RBACProvider({ storage, initialContext, children, }) {
    const storageInstance = React.useMemo(() => storage ?? new MemoryRBACStorage(), [storage]);
    const manager = React.useMemo(() => new RBACManager(storageInstance), [storageInstance]);
    const [context, setContextState] = React.useState(() => initialContext);
    React.useEffect(() => {
        if (initialContext) {
            setContextState(initialContext);
        }
    }, [initialContext]);
    const setContext = React.useCallback((value) => {
        setContextState(value);
    }, []);
    const clearContext = React.useCallback(() => {
        setContextState(undefined);
    }, []);
    const ensureRole = React.useCallback((role) => {
        // Type guard to check if storage has addRole method
        if (storageInstance &&
            'addRole' in storageInstance &&
            typeof storageInstance.addRole === 'function') {
            storageInstance.addRole(role);
            manager.clearCache();
        }
    }, [storageInstance, manager]);
    const hasPermission = React.useCallback(async (permission, contextOverride) => {
        const ctx = contextOverride ?? context;
        if (!ctx)
            return false;
        return manager.hasPermission(ctx, permission);
    }, [manager, context]);
    const hasAnyPermission = React.useCallback(async (permissions, contextOverride) => {
        const ctx = contextOverride ?? context;
        if (!ctx)
            return false;
        return manager.hasAnyPermission(ctx, permissions);
    }, [manager, context]);
    const hasAllPermissions = React.useCallback(async (permissions, contextOverride) => {
        const ctx = contextOverride ?? context;
        if (!ctx)
            return false;
        return manager.hasAllPermissions(ctx, permissions);
    }, [manager, context]);
    const getPermissions = React.useCallback(async (contextOverride) => {
        const ctx = contextOverride ?? context;
        if (!ctx)
            return [];
        return manager.getUserPermissions(ctx);
    }, [manager, context]);
    const resetRoleCache = React.useCallback(() => {
        manager.clearCache();
    }, [manager]);
    const value = React.useMemo(() => ({
        manager,
        context,
        setContext,
        clearContext,
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        getPermissions,
        ensureRole,
        resetRoleCache,
    }), [
        manager,
        context,
        setContext,
        clearContext,
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        getPermissions,
        ensureRole,
        resetRoleCache,
    ]);
    return (_jsx(RBACReactContext.Provider, { value: value, children: children }));
}
/**
 * Hook exposing RBAC helpers.
 */
export function useRBAC() {
    const ctx = React.useContext(RBACReactContext);
    if (!ctx) {
        throw new Error('useRBAC must be used within an RBACProvider');
    }
    return ctx;
}
//# sourceMappingURL=react.js.map