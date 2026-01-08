'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
const ConsoleAlertContext = React.createContext({
    alerts: [],
    clearAlerts: () => { },
});
export function useConsoleAlerts() {
    return React.useContext(ConsoleAlertContext);
}
export function ConsoleAlertHandler({ enabled = true, maxAlerts = 100, types = ['warn', 'error'], onAlert, children, }) {
    const [alerts, setAlerts] = React.useState([]);
    const clearAlerts = React.useCallback(() => {
        setAlerts([]);
    }, []);
    React.useEffect(() => {
        if (!enabled)
            return;
        const originalConsole = {
            log: console.log,
            warn: console.warn,
            error: console.error,
            info: console.info,
        };
        const createHandler = (type) => (...args) => {
            originalConsole[type](...args);
            if (types.includes(type)) {
                const alert = {
                    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
                    type,
                    message: args
                        .map((arg) => typeof arg === 'object' ? JSON.stringify(arg) : String(arg))
                        .join(' '),
                    timestamp: new Date(),
                    stack: type === 'error' ? new Error().stack : undefined,
                };
                setAlerts((prev) => [...prev.slice(-maxAlerts + 1), alert]);
                onAlert?.(alert);
            }
        };
        if (types.includes('log'))
            console.log = createHandler('log');
        if (types.includes('warn'))
            console.warn = createHandler('warn');
        if (types.includes('error'))
            console.error = createHandler('error');
        if (types.includes('info'))
            console.info = createHandler('info');
        return () => {
            console.log = originalConsole.log;
            console.warn = originalConsole.warn;
            console.error = originalConsole.error;
            console.info = originalConsole.info;
        };
    }, [enabled, maxAlerts, types, onAlert]);
    return (_jsx(ConsoleAlertContext.Provider, { value: { alerts, clearAlerts }, children: children }));
}
//# sourceMappingURL=console-alert-handler.js.map