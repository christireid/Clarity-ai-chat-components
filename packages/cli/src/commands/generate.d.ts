/**
 * generate command - Generate code (component, hook, adapter, test)
 */
interface GenerateOptions {
    name?: string;
    output?: string;
}
export declare function generateCommand(type: string, options: GenerateOptions): Promise<void>;
export {};
//# sourceMappingURL=generate.d.ts.map