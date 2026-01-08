import React from 'react';
interface ButtonProps {
    children: React.ReactNode;
    href?: string;
    className?: string;
    variant?: 'primary' | 'secondary' | 'ghost';
    onClick?: () => void;
    icon?: React.ReactNode;
}
export default function MagneticButton({ children, href, className, variant, onClick, icon, }: ButtonProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=MagneticButton.d.ts.map