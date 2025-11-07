/**
 * init command - Initialize a new Clarity Chat project
 */
interface InitOptions {
    template?: string;
    framework?: string;
    install?: boolean;
    git?: boolean;
}
export declare function initCommand(options: InitOptions): Promise<void>;
export {};
//# sourceMappingURL=init.d.ts.map