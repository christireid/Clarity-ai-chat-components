/**
 * Ripple Effect Component
 *
 * Material Design-inspired ripple effect for buttons and clickable elements.
 * Provides tactile feedback on click/tap.
 */
import * as React from 'react';
interface RippleType {
    id: number;
    x: number;
    y: number;
    size: number;
}
export interface UseRippleProps {
    /** Duration of ripple animation in ms */
    duration?: number;
    /** Color of ripple (uses currentColor by default) */
    color?: string;
    /** Opacity of ripple */
    opacity?: number;
    /** Disabled state */
    disabled?: boolean;
}
/**
 * Hook to manage ripple effect state
 */
export declare function useRipple({ duration, color, opacity, disabled, }?: UseRippleProps): {
    ripples: RippleType[] | undefined;
    addRipple: (event: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => void;
    clearRipples: () => void;
    rippleProps: {
        color: string | undefined;
        opacity: number;
        duration: number;
    };
};
/**
 * Ripple component that renders individual ripples
 */
export interface RippleProps {
    /** Array of active ripples */
    ripples?: RippleType[];
    /** Color of ripples */
    color?: string;
    /** Opacity of ripples */
    opacity?: number;
    /** Animation duration in ms */
    duration?: number;
}
export declare const Ripple: React.FC<RippleProps>;
/**
 * Higher-order component to add ripple effect to any clickable element
 */
export interface WithRippleProps extends UseRippleProps {
    children: React.ReactNode;
    className?: string;
    onClick?: (event: React.MouseEvent<HTMLElement>) => void;
    onTouchStart?: (event: React.TouchEvent<HTMLElement>) => void;
}
export declare const WithRipple: React.FC<WithRippleProps>;
export {};
/**
 * Example usage:
 *
 * // With hook
 * const MyButton = () => {
 *   const { ripples, addRipple } = useRipple()
 *
 *   return (
 *     <button onClick={addRipple} className="relative overflow-hidden">
 *       Click me
 *       <Ripple ripples={ripples} />
 *     </button>
 *   )
 * }
 *
 * // With HOC
 * const MyButton = () => (
 *   <WithRipple onClick={() => console.log('clicked')}>
 *     <button>Click me</button>
 *   </WithRipple>
 * )
 */
//# sourceMappingURL=ripple.d.ts.map