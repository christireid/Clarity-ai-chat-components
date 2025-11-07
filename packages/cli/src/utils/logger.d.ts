/**
 * Simple logging utility
 */
export interface Logger {
    info: (message: string, ...args: any[]) => void;
    warn: (message: string, ...args: any[]) => void;
    error: (message: string | Error, ...args: any[]) => void;
    success: (message: string, ...args: any[]) => void;
    debug: (message: string, ...args: any[]) => void;
}
export declare function getLogger(namespace: string): Logger;
//# sourceMappingURL=logger.d.ts.map