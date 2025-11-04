import * as React from 'react';
import { type VariantProps } from 'class-variance-authority';
declare const inputVariants: (props?: ({
    variant?: "error" | "default" | "success" | null | undefined;
    inputSize?: "lg" | "sm" | "default" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>, VariantProps<typeof inputVariants> {
    error?: string;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
}
declare const Input: React.ForwardRefExoticComponent<InputProps & React.RefAttributes<HTMLInputElement>>;
export { Input, inputVariants };
//# sourceMappingURL=input.d.ts.map