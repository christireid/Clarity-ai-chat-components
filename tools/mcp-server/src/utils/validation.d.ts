/**
 * Input validation utilities
 */
/**
 * Validate required parameters
 */
export declare function validateRequired<T extends Record<string, any>>(args: T, required: Array<keyof T>): void;
/**
 * Validate enum value
 */
export declare function validateEnum<T extends string>(value: unknown, enumValues: readonly T[], paramName: string): T;
/**
 * Validate string parameter
 */
export declare function validateString(value: unknown, paramName: string, minLength?: number): string;
/**
 * Validate number parameter
 */
export declare function validateNumber(value: unknown, paramName: string, min?: number, max?: number): number;
//# sourceMappingURL=validation.d.ts.map