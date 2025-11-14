/**
 * Configuration and environment errors
 */
import { ClarityError } from './base-error';
export declare class EnvVarMissingError extends ClarityError {
    constructor(varName: string, originalError?: Error);
}
export declare class InvalidConfigError extends ClarityError {
    constructor(configKey: string, expectedType: string, actualValue: any, originalError?: Error);
}
export declare class PortAlreadyInUseError extends ClarityError {
    constructor(port: number, originalError?: Error);
}
export declare class FileNotFoundError extends ClarityError {
    constructor(filePath: string, expectedLocation?: string, originalError?: Error);
}
export declare class DependencyMissingError extends ClarityError {
    constructor(packageName: string, originalError?: Error);
}
//# sourceMappingURL=config-errors.d.ts.map