/**
 * keys command - Manage API keys
 */
interface KeysOptions {
    add?: string;
    list?: boolean;
    remove?: string;
    validate?: boolean;
}
export declare function keysCommand(options: KeysOptions): Promise<void>;
export {};
//# sourceMappingURL=keys.d.ts.map