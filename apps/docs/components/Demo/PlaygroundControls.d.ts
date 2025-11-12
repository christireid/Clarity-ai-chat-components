export type ControlType = 'text' | 'number' | 'boolean' | 'select' | 'color';
export interface Control {
    name: string;
    label: string;
    type: ControlType;
    defaultValue: any;
    options?: string[];
    min?: number;
    max?: number;
    step?: number;
}
interface PlaygroundControlsProps {
    controls: Control[];
    onChange: (values: Record<string, any>) => void;
    className?: string;
}
export declare function PlaygroundControls({ controls, onChange, className, }: PlaygroundControlsProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=PlaygroundControls.d.ts.map