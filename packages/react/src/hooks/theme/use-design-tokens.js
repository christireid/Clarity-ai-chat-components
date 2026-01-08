/**
 * useDesignTokens Hook
 *
 * Provides access to design tokens and helper functions for
 * consistent styling across components.
 */
'use client';
import { useMemo } from 'react';
/**
 * Hook that provides design tokens
 */
export function useDesignTokens() {
    return useMemo(() => ({
        shadows: {
            xs: 'shadow-xs',
            sm: 'shadow-sm',
            md: 'shadow-md',
            lg: 'shadow-lg',
            xl: 'shadow-xl',
            '2xl': 'shadow-2xl',
        },
        radius: {
            sm: 'rounded-sm',
            md: 'rounded-md',
            lg: 'rounded-lg',
            xl: 'rounded-xl',
            full: 'rounded-full',
        },
        rings: {
            default: 'ring-1 ring-border/50',
            focus: 'ring-[3px] ring-ring/50 ring-offset-1',
            selected: 'ring-2 ring-primary/50',
        },
        opacity: {
            subtle: '/10',
            medium: '/30',
            strong: '/50',
        },
        duration: {
            instant: 'duration-150',
            fast: 'duration-200',
            normal: 'duration-300',
            slow: 'duration-500',
        },
    }), []);
}
/**
 * Helper to generate consistent interactive classes
 */
export function useInteractiveClasses(options = {}) {
    const { hover = true, focus = true, disabled = false } = options;
    return useMemo(() => {
        const classes = [
            'transition-all duration-200',
        ];
        if (hover && !disabled) {
            classes.push('hover:shadow-sm', 'hover:-translate-y-[2px]', 'cursor-pointer');
        }
        if (focus && !disabled) {
            classes.push('focus-visible:outline-none', 'focus-visible:ring-[3px]', 'focus-visible:ring-ring/50', 'focus-visible:ring-offset-1');
        }
        if (disabled) {
            classes.push('opacity-50', 'cursor-not-allowed', 'pointer-events-none');
        }
        return classes.join(' ');
    }, [hover, focus, disabled]);
}
/**
 * Helper to generate card classes
 */
export function useCardClasses(options = {}) {
    const { interactive = false, selected = false } = options;
    const interactiveClasses = useInteractiveClasses({
        hover: interactive,
        focus: interactive
    });
    return useMemo(() => {
        const classes = [
            'rounded-lg',
            'bg-card',
            'text-card-foreground',
            'ring-1',
            'ring-border/30',
            'shadow-xs',
        ];
        if (interactive) {
            classes.push(interactiveClasses);
        }
        if (selected) {
            classes.push('ring-2', 'ring-primary/50', 'shadow-sm');
        }
        return classes.join(' ');
    }, [interactive, selected, interactiveClasses]);
}
//# sourceMappingURL=use-design-tokens.js.map