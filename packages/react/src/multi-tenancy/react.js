import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import { MemoryTenantStorage, TenantManager } from './tenant-manager';
const MultiTenancyContext = React.createContext(null);
/**
 * Provides multi-tenancy helpers through React context.
 */
export function MultiTenancyProvider({ storage, initialContext, children, }) {
    const manager = React.useMemo(() => new TenantManager(storage ?? new MemoryTenantStorage()), [storage]);
    const [context, setContextState] = React.useState(() => {
        if (initialContext) {
            manager.setContext(initialContext);
        }
        return initialContext;
    });
    const setContext = React.useCallback((value) => {
        manager.setContext(value);
        setContextState(value);
    }, [manager]);
    const clearContext = React.useCallback(() => {
        manager.setContext(undefined);
        setContextState(undefined);
    }, [manager]);
    const ensureTenant = React.useCallback(async (tenant) => {
        await manager.updateTenant(tenant);
    }, [manager]);
    const isActive = React.useCallback(async (tenantId) => {
        const id = tenantId ?? context?.tenant.id;
        if (!id)
            return false;
        return manager.isActive(id);
    }, [manager, context]);
    const getNamespace = React.useCallback((tenantId) => {
        const id = tenantId ?? context?.tenant.id;
        return id ? manager.getNamespace(id) : null;
    }, [manager, context]);
    const getCachePrefix = React.useCallback((tenantId) => {
        const id = tenantId ?? context?.tenant.id;
        return id ? manager.getCachePrefix(id) : null;
    }, [manager, context]);
    const value = React.useMemo(() => ({
        manager,
        context,
        setContext,
        clearContext,
        ensureTenant,
        isActive,
        getNamespace,
        getCachePrefix,
    }), [
        manager,
        context,
        setContext,
        clearContext,
        ensureTenant,
        isActive,
        getNamespace,
        getCachePrefix,
    ]);
    return (_jsx(MultiTenancyContext.Provider, { value: value, children: children }));
}
/**
 * Hook exposing multi-tenancy utilities.
 */
export function useMultiTenancy() {
    const ctx = React.useContext(MultiTenancyContext);
    if (!ctx) {
        throw new Error('useMultiTenancy must be used within a MultiTenancyProvider');
    }
    return ctx;
}
//# sourceMappingURL=react.js.map