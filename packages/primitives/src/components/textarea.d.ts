import * as React from 'react';
import { type VariantProps } from 'class-variance-authority';
declare const textareaVariants: (props?: ({
    variant?: "error" | "default" | "success" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement>, VariantProps<typeof textareaVariants> {
    error?: string;
    autoResize?: boolean;
    maxRows?: number;
}
declare const Textarea: React.ForwardRefExoticComponent<TextareaProps & React.RefAttributes<HTMLTextAreaElement>>;
export { Textarea, textareaVariants };
//# sourceMappingURL=textarea.d.ts.map