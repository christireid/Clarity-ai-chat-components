/**
 * add command - Add a component to your project
 */
interface AddOptions {
    path?: string;
    deps?: boolean;
}
export declare function addCommand(component: string, options: AddOptions): Promise<void>;
export {};
//# sourceMappingURL=add.d.ts.map