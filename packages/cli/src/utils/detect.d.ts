/**
 * Framework and environment detection utilities
 */
export declare function detectFramework(cwd: string): Promise<string | null>;
export declare function detectPackageManager(cwd: string): Promise<string>;
export declare function isTypeScriptProject(cwd: string): Promise<boolean>;
export declare function hasTailwind(cwd: string): Promise<boolean>;
//# sourceMappingURL=detect.d.ts.map