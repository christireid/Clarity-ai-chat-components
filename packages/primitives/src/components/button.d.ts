import * as React from 'react';
import { type VariantProps } from 'class-variance-authority';
declare const buttonVariants: (props?: ({
    variant?: "error" | "link" | "secondary" | "destructive" | "default" | "success" | "outline" | "ghost" | "surface" | null | undefined;
    size?: "lg" | "sm" | "default" | "icon" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
type ButtonState = 'idle' | 'loading' | 'success' | 'error';
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    loading?: boolean;
    state?: ButtonState;
    /** Show ripple effect on click (default: true for non-link variants) */
    ripple?: boolean;
    /** Ripple color (default: based on variant) */
    rippleColor?: string;
    /** Success message to show (default: checkmark icon) */
    successMessage?: React.ReactNode;
    /** Error message to show (default: X icon) */
    errorMessage?: React.ReactNode;
    /** Duration for success/error state before returning to idle (ms, default: 2000) */
    stateDuration?: number;
}
declare const Button: React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLButtonElement>>;
export { Button, buttonVariants };
export type { ButtonState };
//# sourceMappingURL=button.d.ts.map