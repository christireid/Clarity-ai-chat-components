import { SandpackProps } from '@codesandbox/sandpack-react';
interface LiveDemoProps extends Partial<SandpackProps> {
    title?: string;
    code: string;
    dependencies?: Record<string, string>;
    showConsole?: boolean;
    height?: string;
}
export declare function LiveDemo({ title, code, dependencies, showConsole, height, ...props }: LiveDemoProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=LiveDemo.d.ts.map