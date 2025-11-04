import * as React from 'react';
import { type VariantProps } from 'class-variance-authority';
declare const avatarVariants: (props?: ({
    size?: "2xl" | "lg" | "sm" | "default" | "xl" | "xs" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof avatarVariants> {
    src?: string;
    alt?: string;
    fallback?: string;
    status?: 'online' | 'offline' | 'away' | 'busy';
    /** Enable hover scale effect */
    hoverable?: boolean;
    /** Custom status badge content */
    statusBadge?: React.ReactNode;
}
declare const Avatar: React.MemoExoticComponent<React.ForwardRefExoticComponent<AvatarProps & React.RefAttributes<HTMLDivElement>>>;
export { Avatar, avatarVariants };
//# sourceMappingURL=avatar.d.ts.map