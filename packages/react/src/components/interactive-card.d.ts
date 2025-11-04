/**
 * Interactive Card Component
 *
 * Enhanced card component with hover states, focus rings, and visual transitions.
 * Demonstrates best practices for interactive elements.
 */
import * as React from 'react';
export interface InteractiveCardProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Whether card is clickable */
    interactive?: boolean;
    /** Whether card is selected */
    selected?: boolean;
    /** Whether card is disabled */
    disabled?: boolean;
    /** Hover effect intensity */
    hoverIntensity?: 'none' | 'subtle' | 'medium' | 'strong';
    /** Show focus ring */
    showFocusRing?: boolean;
    /** Show ripple effect on click */
    showRipple?: boolean;
    /** Callback when card is clicked */
    onCardClick?: () => void;
    /** Children */
    children: React.ReactNode;
}
/**
 * Card with enhanced interactivity
 */
export declare const InteractiveCard: React.MemoExoticComponent<React.ForwardRefExoticComponent<InteractiveCardProps & React.RefAttributes<HTMLDivElement>>>;
/**
 * Interactive button with enhanced states
 */
export interface InteractiveButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    /** Visual variant */
    variant?: 'default' | 'primary' | 'success' | 'destructive' | 'ghost';
    /** Size variant */
    size?: 'sm' | 'md' | 'lg';
    /** Loading state */
    loading?: boolean;
    /** Icon before text */
    icon?: React.ReactNode;
    /** Icon after text */
    iconRight?: React.ReactNode;
    /** Children */
    children?: React.ReactNode;
}
export declare const InteractiveButton: React.ForwardRefExoticComponent<InteractiveButtonProps & React.RefAttributes<HTMLButtonElement>>;
/**
 * Interactive list item
 */
export interface InteractiveListItemProps {
    /** Whether item is selected */
    selected?: boolean;
    /** Whether item is disabled */
    disabled?: boolean;
    /** Icon */
    icon?: React.ReactNode;
    /** Title */
    title: string;
    /** Description */
    description?: string;
    /** Badge */
    badge?: React.ReactNode;
    /** onClick handler */
    onClick?: () => void;
    /** Additional className */
    className?: string;
}
export declare const InteractiveListItem: React.FC<InteractiveListItemProps>;
//# sourceMappingURL=interactive-card.d.ts.map