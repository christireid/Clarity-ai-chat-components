'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import { cn } from '../lib/cn';
import { Card as ShadcnCard, CardHeader as ShadcnCardHeader, CardContent as ShadcnCardContent, CardFooter as ShadcnCardFooter, } from './ui/card';
const Card = React.forwardRef(({ className, hoverable = false, bordered = true, ...props }, ref) => (_jsx(ShadcnCard, { ref: ref, className: cn('rounded-xl shadow-xs transition-all duration-200', !bordered && 'border-0', hoverable && 'hover:shadow-sm hover:-translate-y-[1px] cursor-pointer', className), ...props })));
Card.displayName = 'Card';
// Re-export shadcn/ui components with custom styling where needed
const CardHeader = React.forwardRef(({ className, ...props }, ref) => (_jsx(ShadcnCardHeader, { ref: ref, className: className, ...props })));
CardHeader.displayName = 'CardHeader';
const CardTitle = React.forwardRef(({ className, ...props }, ref) => (_jsx("h3", { ref: ref, className: cn('text-lg font-semibold leading-none tracking-[0.13px]', className), ...props })));
CardTitle.displayName = 'CardTitle';
const CardDescription = React.forwardRef(({ className, ...props }, ref) => (_jsx("p", { ref: ref, className: cn('text-sm text-muted-foreground', className), ...props })));
CardDescription.displayName = 'CardDescription';
const CardContent = React.forwardRef(({ className, ...props }, ref) => (_jsx(ShadcnCardContent, { ref: ref, className: className, ...props })));
CardContent.displayName = 'CardContent';
const CardFooter = React.forwardRef(({ className, ...props }, ref) => (_jsx(ShadcnCardFooter, { ref: ref, className: className, ...props })));
CardFooter.displayName = 'CardFooter';
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
//# sourceMappingURL=card.js.map