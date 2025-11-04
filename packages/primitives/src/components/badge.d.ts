import * as React from 'react';
import { type VariantProps } from 'class-variance-authority';
declare const badgeVariants: (props?: ({
    variant?: "secondary" | "destructive" | "default" | "success" | "warning" | "info" | "outline" | "ghost" | "subtle" | null | undefined;
    size?: "lg" | "sm" | "default" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {
    /** Show animated dot indicator */
    dot?: boolean;
    /** Enable pulse animation for notifications */
    pulse?: boolean;
    /** Enable glow effect */
    glow?: boolean;
}
declare const Badge: React.ForwardRefExoticComponent<BadgeProps & React.RefAttributes<HTMLDivElement>>;
export { Badge, badgeVariants };
//# sourceMappingURL=badge.d.ts.map