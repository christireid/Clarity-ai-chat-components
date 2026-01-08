'use client';
import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { useErrorAnalyticsOptional } from '../hooks/useErrorAnalytics';
const DevToolsContext = React.createContext(null);
/**
 * Hook for error boundaries to register with dev tools
 */
export function useDevToolsRegistration(id, name) {
    const devTools = React.useContext(DevToolsContext);
    React.useEffect(() => {
        devTools?.register({
            id,
            name,
            hasError: false,
            retryCount: 0,
        });
        return () => devTools?.unregister(id);
    }, [id, name, devTools]);
    return React.useCallback((info) => {
        devTools?.update(id, info);
    }, [id, devTools]);
}
/**
 * Development tools panel for debugging error boundaries
 *
 * Only renders in development mode. Automatically excluded from production builds.
 *
 * @example
 * ```tsx
 * // Wrap your app
 * <ErrorBoundaryDevTools>
 *   <App />
 * </ErrorBoundaryDevTools>
 * ```
 */
export function ErrorBoundaryDevTools({ children, position = 'bottom-right', defaultOpen = false, }) {
    // Only render in development
    if (process.env['NODE_ENV'] !== 'development') {
        return _jsx(_Fragment, { children: children });
    }
    return (_jsx(DevToolsProvider, { position: position, defaultOpen: defaultOpen, children: children }));
}
function DevToolsProvider({ children, position, defaultOpen, }) {
    const [boundaries, setBoundaries] = React.useState(new Map());
    const [isOpen, setIsOpen] = React.useState(defaultOpen);
    const [isDragging, setIsDragging] = React.useState(false);
    const [panelPosition, setPanelPosition] = React.useState({ x: 0, y: 0 });
    const dragStartRef = React.useRef({ x: 0, y: 0 });
    const analytics = useErrorAnalyticsOptional();
    const register = React.useCallback((info) => {
        setBoundaries((prev) => new Map(prev).set(info.id, info));
    }, []);
    const unregister = React.useCallback((id) => {
        setBoundaries((prev) => {
            const next = new Map(prev);
            next.delete(id);
            return next;
        });
    }, []);
    const update = React.useCallback((id, info) => {
        setBoundaries((prev) => {
            const existing = prev.get(id);
            if (!existing)
                return prev;
            return new Map(prev).set(id, { ...existing, ...info });
        });
    }, []);
    const contextValue = React.useMemo(() => ({ register, unregister, update }), [register, unregister, update]);
    const positionStyles = {
        'top-right': { top: 16, right: 16 },
        'top-left': { top: 16, left: 16 },
        'bottom-right': { bottom: 16, right: 16 },
        'bottom-left': { bottom: 16, left: 16 },
    }[position];
    const handleMouseDown = (e) => {
        if (e.target.closest('button'))
            return;
        setIsDragging(true);
        dragStartRef.current = {
            x: e.clientX - panelPosition.x,
            y: e.clientY - panelPosition.y,
        };
    };
    const handleMouseMove = React.useCallback((e) => {
        if (!isDragging)
            return;
        setPanelPosition({
            x: e.clientX - dragStartRef.current.x,
            y: e.clientY - dragStartRef.current.y,
        });
    }, [isDragging]);
    const handleMouseUp = React.useCallback(() => {
        setIsDragging(false);
    }, []);
    React.useEffect(() => {
        if (!isDragging)
            return;
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, handleMouseMove, handleMouseUp]);
    const boundaryList = Array.from(boundaries.values());
    const errorsCount = boundaryList.filter((b) => b.hasError).length;
    const stats = analytics?.getStats();
    return (_jsxs(DevToolsContext.Provider, { value: contextValue, children: [children, _jsxs("div", { style: {
                    position: 'fixed',
                    ...positionStyles,
                    transform: `translate(${panelPosition.x}px, ${panelPosition.y}px)`,
                    zIndex: 99999,
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    fontSize: '12px',
                }, children: [!isOpen && (_jsxs("button", { onClick: () => setIsOpen(true), style: {
                            padding: '8px 12px',
                            backgroundColor: errorsCount > 0 ? '#ef4444' : '#374151',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        }, children: [_jsx("span", { children: "\uD83D\uDEE0\uFE0F" }), _jsx("span", { children: "Error DevTools" }), errorsCount > 0 && (_jsx("span", { style: {
                                    backgroundColor: 'white',
                                    color: '#ef4444',
                                    padding: '2px 6px',
                                    borderRadius: '10px',
                                    fontWeight: 'bold',
                                }, children: errorsCount }))] })), isOpen && (_jsxs("div", { onMouseDown: handleMouseDown, style: {
                            width: '360px',
                            maxHeight: '500px',
                            backgroundColor: '#1f2937',
                            color: '#f3f4f6',
                            borderRadius: '8px',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                            overflow: 'hidden',
                            cursor: isDragging ? 'grabbing' : 'default',
                        }, children: [_jsxs("div", { style: {
                                    padding: '12px',
                                    backgroundColor: '#111827',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    cursor: 'grab',
                                }, children: [_jsx("span", { style: { fontWeight: 600 }, children: "\uD83D\uDEE0\uFE0F Error Boundary DevTools" }), _jsx("button", { onClick: () => setIsOpen(false), style: {
                                            background: 'none',
                                            border: 'none',
                                            color: '#9ca3af',
                                            cursor: 'pointer',
                                            padding: '4px',
                                        }, children: "\u2715" })] }), stats && (_jsxs("div", { style: {
                                    padding: '12px',
                                    backgroundColor: '#374151',
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(3, 1fr)',
                                    gap: '8px',
                                }, children: [_jsx(StatBox, { label: "Total Errors", value: stats.totalErrors }), _jsx(StatBox, { label: "Retry Rate", value: `${stats.retrySuccessRate.toFixed(0)}%` }), _jsx(StatBox, { label: "Circuit Trips", value: stats.circuitBreakerTrips })] })), _jsx("div", { style: { maxHeight: '300px', overflow: 'auto' }, children: boundaryList.length === 0 ? (_jsx("div", { style: {
                                        padding: '24px',
                                        textAlign: 'center',
                                        color: '#9ca3af',
                                    }, children: "No error boundaries registered" })) : (boundaryList.map((boundary) => (_jsx(BoundaryItem, { boundary: boundary }, boundary.id)))) }), _jsxs("div", { style: {
                                    padding: '8px 12px',
                                    borderTop: '1px solid #374151',
                                    display: 'flex',
                                    gap: '8px',
                                }, children: [_jsx(ActionButton, { onClick: () => {
                                            const error = new Error('Test error from DevTools');
                                            throw error;
                                        }, children: "Trigger Test Error" }), analytics && (_jsx(ActionButton, { onClick: () => {
                                            const data = analytics.exportData();
                                            console.log('[DevTools] Exported data:', data);
                                            navigator.clipboard?.writeText(JSON.stringify(data, null, 2));
                                        }, children: "Export Data" }))] })] }))] })] }));
}
function StatBox({ label, value }) {
    return (_jsxs("div", { style: { textAlign: 'center' }, children: [_jsx("div", { style: { fontSize: '18px', fontWeight: 600 }, children: value }), _jsx("div", { style: { fontSize: '10px', color: '#9ca3af' }, children: label })] }));
}
function BoundaryItem({ boundary }) {
    return (_jsxs("div", { style: {
            padding: '12px',
            borderBottom: '1px solid #374151',
            backgroundColor: boundary.hasError
                ? 'rgba(239, 68, 68, 0.1)'
                : 'transparent',
        }, children: [_jsxs("div", { style: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '4px',
                }, children: [_jsx("span", { style: { fontWeight: 500 }, children: boundary.name }), _jsx(StatusBadge, { hasError: boundary.hasError, circuitState: boundary.circuitState })] }), boundary.hasError && boundary.error && (_jsx("div", { style: {
                    fontSize: '11px',
                    color: '#f87171',
                    marginTop: '4px',
                    padding: '4px 8px',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    borderRadius: '4px',
                }, children: boundary.error.message })), _jsxs("div", { style: {
                    display: 'flex',
                    gap: '12px',
                    marginTop: '8px',
                    fontSize: '10px',
                    color: '#9ca3af',
                }, children: [_jsxs("span", { children: ["Retries: ", boundary.retryCount] }), boundary.errorTime && _jsxs("span", { children: ["Last: ", boundary.errorTime] })] })] }));
}
function StatusBadge({ hasError, circuitState, }) {
    if (hasError) {
        return (_jsx("span", { style: {
                padding: '2px 6px',
                backgroundColor: '#ef4444',
                borderRadius: '4px',
                fontSize: '10px',
            }, children: "ERROR" }));
    }
    if (circuitState === 'open') {
        return (_jsx("span", { style: {
                padding: '2px 6px',
                backgroundColor: '#f59e0b',
                borderRadius: '4px',
                fontSize: '10px',
            }, children: "CIRCUIT OPEN" }));
    }
    return (_jsx("span", { style: {
            padding: '2px 6px',
            backgroundColor: '#10b981',
            borderRadius: '4px',
            fontSize: '10px',
        }, children: "OK" }));
}
function ActionButton({ children, onClick, }) {
    return (_jsx("button", { onClick: onClick, style: {
            padding: '6px 12px',
            backgroundColor: '#374151',
            color: '#f3f4f6',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '11px',
        }, children: children }));
}
//# sourceMappingURL=ErrorBoundaryDevTools.js.map