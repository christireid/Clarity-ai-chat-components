/**
 * Zero-Dependency Animation Library for Clarity Chat
 *
 * Pure CSS-based animations that work without Framer Motion
 * Maintains the same API surface for easy migration
 */
// =============================================================================
// CSS KEYFRAMES DEFINITIONS
// =============================================================================
export const cssKeyframes = `
  /* Fade animations */
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
  
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes fadeInDown {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes fadeInScale {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
  
  /* Slide animations */
  @keyframes slideInLeft {
    from { opacity: 0; transform: translateX(-20px); }
    to { opacity: 1; transform: translateX(0); }
  }
  
  @keyframes slideInRight {
    from { opacity: 0; transform: translateX(20px); }
    to { opacity: 1; transform: translateX(0); }
  }
  
  /* Scale animations */
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
  
  @keyframes scaleOut {
    from { opacity: 1; transform: scale(1); }
    to { opacity: 0; transform: scale(0.95); }
  }
  
  /* Interactive animations */
  @keyframes buttonTap {
    0% { transform: scale(1); }
    50% { transform: scale(0.98); }
    100% { transform: scale(1.02); }
  }
  
  @keyframes cardHover {
    from { transform: scale(1) translateY(0); }
    to { transform: scale(1.02) translateY(-4px); }
  }
  
  @keyframes iconHover {
    from { transform: rotate(0deg) scale(1); }
    to { transform: rotate(15deg) scale(1.1); }
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(1.05); }
  }
  
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
    20%, 40%, 60%, 80% { transform: translateX(4px); }
  }
  
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  @keyframes glow {
    0%, 100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
    50% { box-shadow: 0 0 0 8px rgba(59, 130, 246, 0.1); }
  }
  
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  
  @keyframes typingDot {
    0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
    30% { transform: translateY(-8px); opacity: 1; }
  }
`;
// =============================================================================
// EASING CURVES (CSS FORMAT)
// =============================================================================
export const easings = {
    easeOut: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    easeOutQuick: 'cubic-bezier(0.22, 1, 0.36, 1)',
    easeInOut: 'cubic-bezier(0.65, 0, 0.35, 1)',
    anticipate: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    linear: 'linear',
    ease: 'ease',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeInOutQuad: 'cubic-bezier(0.455, 0.03, 0.515, 0.955)',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    springBouncy: 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
};
// =============================================================================
// DURATION STANDARDS
// =============================================================================
export const durations = {
    instant: '0.1s',
    fast: '0.15s',
    normal: '0.2s',
    moderate: '0.3s',
    slow: '0.5s',
    slower: '0.7s',
};
// =============================================================================
// CSS CLASS DEFINITIONS
// =============================================================================
export const animationClasses = {
    // Basic animations
    fadeIn: {
        animation: `fadeIn ${durations.normal} ${easings.easeOut} both`,
    },
    fadeOut: {
        animation: `fadeOut ${durations.fast} ${easings.easeIn} both`,
    },
    fadeInUp: {
        animation: `fadeInUp ${durations.normal} ${easings.easeOut} both`,
    },
    fadeInDown: {
        animation: `fadeInDown ${durations.normal} ${easings.easeOut} both`,
    },
    fadeInScale: {
        animation: `fadeInScale ${durations.normal} ${easings.easeOut} both`,
    },
    // Slide animations
    slideInLeft: {
        animation: `slideInLeft ${durations.normal} ${easings.easeOut} both`,
    },
    slideInRight: {
        animation: `slideInRight ${durations.normal} ${easings.easeOut} both`,
    },
    // Interactive
    buttonTap: {
        animation: `buttonTap 0.2s ${easings.spring} both`,
    },
    cardHover: {
        animation: `cardHover 0.3s ${easings.easeOut} both`,
    },
    iconHover: {
        animation: `iconHover 0.2s ${easings.springBouncy} both`,
    },
    // Effects
    pulse: {
        animation: `pulse 2s ${easings.easeInOut} infinite`,
    },
    shake: {
        animation: `shake 0.4s ${easings.easeInOut} both`,
    },
    bounce: {
        animation: `bounce 0.3s ${easings.easeInOut} both`,
    },
    spin: {
        animation: `spin 1s ${easings.linear} infinite`,
    },
    glow: {
        animation: `glow 1.5s ${easings.easeInOut} infinite`,
    },
    shimmer: {
        background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
        backgroundSize: '200% 100%',
        animation: `shimmer 2s ${easings.linear} infinite`,
    },
    typingDot: {
        animation: `typingDot 1.4s ${easings.easeInOut} infinite`,
    },
};
// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================
/**
 * Check if user prefers reduced motion
 */
export const prefersReducedMotion = () => {
    if (typeof window === 'undefined')
        return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};
/**
 * Get animation class with reduced motion fallback
 */
export const getAccessibleAnimation = (animationClass, reducedMotionClass = 'opacity-100') => {
    if (prefersReducedMotion()) {
        return reducedMotionClass;
    }
    return animationClass;
};
/**
 * Create custom animation style
 */
export const createAnimation = (keyframeName, duration = durations.normal, easing = easings.easeOut, delay = '0s', iterationCount = '1', direction = 'normal', fillMode = 'both') => ({
    animation: `${keyframeName} ${duration} ${easing} ${delay} ${iterationCount} ${direction} ${fillMode}`,
});
/**
 * Create transition style
 */
export const createTransition = (properties = 'all', duration = durations.normal, easing = easings.easeOut, delay = '0s') => ({
    transition: `${properties} ${duration} ${easing} ${delay}`,
});
/**
 * Insert CSS keyframes into document
 */
export const injectKeyframes = () => {
    if (typeof document === 'undefined')
        return;
    // Check if already injected
    if (document.getElementById('clarity-chat-animations'))
        return;
    const style = document.createElement('style');
    style.id = 'clarity-chat-animations';
    style.textContent = cssKeyframes;
    document.head.appendChild(style);
};
// =============================================================================
// PRESETS FOR COMMON COMPONENTS
// =============================================================================
export const buttonAnimation = {
    ...animationClasses.buttonTap,
    transition: createTransition('transform', durations.fast),
};
export const cardAnimation = {
    ...animationClasses.cardHover,
    transition: createTransition('all', durations.normal),
};
export const iconAnimation = {
    ...animationClasses.iconHover,
    transition: createTransition('all', durations.fast),
};
// =============================================================================
// REACT HOOKS
// =============================================================================
import { useEffect, useState } from 'react';
/**
 * Hook to detect reduced motion preference
 */
export const useReducedMotion = () => {
    const [reducedMotion, setReducedMotion] = useState(false);
    useEffect(() => {
        if (typeof window === 'undefined')
            return;
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setReducedMotion(mediaQuery.matches);
        const handleChange = (event) => {
            setReducedMotion(event.matches);
        };
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);
    return reducedMotion;
};
/**
 * Hook to inject keyframes on mount
 */
export const useAnimations = () => {
    useEffect(() => {
        injectKeyframes();
    }, []);
};
// =============================================================================
// DEFAULT EXPORT
// =============================================================================
export default {
    cssKeyframes,
    easings,
    durations,
    animationClasses,
    prefersReducedMotion,
    getAccessibleAnimation,
    createAnimation,
    createTransition,
    injectKeyframes,
    buttonAnimation,
    cardAnimation,
    iconAnimation,
    useReducedMotion,
    useAnimations,
};
//# sourceMappingURL=zero-dependency.js.map