import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Enhanced Skeleton Loaders with Transition System
 *
 * Advanced loading placeholder components with smooth transitions,
 * accessibility features, performance monitoring, and intelligent loading states.
 * Zero-dependency version - no Framer Motion required
 */
import * as React from 'react';
import { cn } from '../../utils/cn';
// Duration constants (local to avoid external dependencies)
const durations = {
    slower: 500,
    normal: 300,
    faster: 150,
};
// =============================================================================
// CSS ANIMATIONS
// =============================================================================
const EnhancedSkeletonStyles = () => (_jsx("style", { children: `
    /* Enhanced skeleton animations */
    @keyframes skeleton-pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }

    @keyframes skeleton-shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }

    @keyframes skeleton-wave {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }

    @keyframes skeleton-gradient {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    @keyframes skeleton-dots {
      0%, 20% { opacity: 0; }
      50% { opacity: 1; }
      80%, 100% { opacity: 0; }
    }

    /* Transition animations */
    @keyframes skeleton-fade-out {
      from { opacity: 1; transform: scale(1); }
      to { opacity: 0; transform: scale(0.98); }
    }

    @keyframes skeleton-slide-up-out {
      from { opacity: 1; transform: translateY(0) scale(1); }
      to { opacity: 0; transform: translateY(-10px) scale(0.98); }
    }

    @keyframes skeleton-slide-down-out {
      from { opacity: 1; transform: translateY(0) scale(1); }
      to { opacity: 0; transform: translateY(10px) scale(0.98); }
    }

    @keyframes skeleton-scale-out {
      from { opacity: 1; transform: scale(1); }
      to { opacity: 0; transform: scale(0.8); }
    }

    @keyframes skeleton-morph-out {
      from { 
        opacity: 1; 
        transform: scale(1); 
        filter: blur(0px);
      }
      to { 
        opacity: 0; 
        transform: scale(1.02); 
        filter: blur(4px);
      }
    }

    @keyframes content-fade-in {
      from { opacity: 0; transform: scale(0.98); }
      to { opacity: 1; transform: scale(1); }
    }

    @keyframes content-slide-up-in {
      from { opacity: 0; transform: translateY(10px) scale(0.98); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    @keyframes content-slide-down-in {
      from { opacity: 0; transform: translateY(-10px) scale(0.98); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    @keyframes content-scale-in {
      from { opacity: 0; transform: scale(0.8); }
      to { opacity: 1; transform: scale(1); }
    }

    @keyframes content-morph-in {
      from { 
        opacity: 0; 
        transform: scale(1.02); 
        filter: blur(4px);
      }
      to { 
        opacity: 1; 
        transform: scale(1); 
        filter: blur(0px);
      }
    }

    /* Performance monitoring */
    .skeleton-performance {
      position: relative;
    }

    .skeleton-performance::after {
      content: attr(data-performance-id);
      position: absolute;
      top: -20px;
      left: 0;
      font-size: 10px;
      color: #666;
      opacity: 0.5;
    }

    /* Accessibility improvements */
    .skeleton-accessible {
      position: relative;
    }

    .skeleton-accessible::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.2),
        transparent
      );
      animation: skeleton-shimmer 2s infinite;
    }

    /* Reduced motion support */
    @media (prefers-reduced-motion: reduce) {
      .skeleton-pulse,
      .skeleton-shimmer,
      .skeleton-wave,
      .skeleton-gradient,
      .skeleton-dots {
        animation: none;
        opacity: 0.6;
      }
    }

    /* Responsive skeleton sizing */
    .skeleton-responsive {
      container-type: inline-size;
    }

    @container (max-width: 640px) {
      .skeleton-responsive .skeleton-mobile-hide {
        display: none;
      }
    }

    @container (min-width: 641px) {
      .skeleton-responsive .skeleton-desktop-hide {
        display: none;
      }
    }
  ` }));
// =============================================================================
// PERFORMANCE MONITORING
// =============================================================================
class PerformanceMonitor {
    static instance;
    metrics = new Map();
    observers = new Map();
    static getInstance() {
        if (!PerformanceMonitor.instance) {
            PerformanceMonitor.instance = new PerformanceMonitor();
        }
        return PerformanceMonitor.instance;
    }
    startMonitoring(id) {
        if (typeof window === 'undefined')
            return;
        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            if (!this.metrics.has(id)) {
                this.metrics.set(id, []);
            }
            this.metrics.get(id).push(...entries);
        });
        observer.observe({ entryTypes: ['measure', 'navigation'] });
        this.observers.set(id, observer);
        // Start measurement
        performance.mark(`${id}-start`);
    }
    endMonitoring(id) {
        if (typeof window === 'undefined')
            return [];
        // End measurement
        performance.mark(`${id}-end`);
        performance.measure(id, `${id}-start`, `${id}-end`);
        // Clean up observer
        const observer = this.observers.get(id);
        if (observer) {
            observer.disconnect();
            this.observers.delete(id);
        }
        // Return metrics
        const metrics = this.metrics.get(id) || [];
        this.metrics.delete(id);
        return metrics;
    }
    getMetrics(id) {
        return this.metrics.get(id) || [];
    }
}
// =============================================================================
// SMART LOADING PREDICTION
// =============================================================================
class LoadingPredictor {
    static instance;
    history = [];
    maxHistory = 10;
    static getInstance() {
        if (!LoadingPredictor.instance) {
            LoadingPredictor.instance = new LoadingPredictor();
        }
        return LoadingPredictor.instance;
    }
    predictDuration() {
        if (this.history.length === 0)
            return 2000; // Default 2 seconds
        const recentHistory = this.history.slice(-this.maxHistory);
        const averageDuration = recentHistory.reduce((sum, item) => sum + item.duration, 0) /
            recentHistory.length;
        // Add some variance based on recent trends
        const trend = this.getTrend();
        return Math.max(500, averageDuration + trend * 200);
    }
    recordLoadingDuration(duration) {
        this.history.push({
            timestamp: Date.now(),
            duration,
        });
        // Keep only recent history
        if (this.history.length > this.maxHistory * 2) {
            this.history = this.history.slice(-this.maxHistory);
        }
    }
    getTrend() {
        if (this.history.length < 2)
            return 0;
        const recent = this.history.slice(-5);
        const older = this.history.slice(-10, -5);
        if (recent.length === 0 || older.length === 0)
            return 0;
        const recentAverage = recent.reduce((sum, item) => sum + item.duration, 0) / recent.length;
        const olderAverage = older.reduce((sum, item) => sum + item.duration, 0) / older.length;
        return (recentAverage - olderAverage) / olderAverage;
    }
}
// =============================================================================
// ENHANCED BASE SKELETON COMPONENT
// =============================================================================
export const EnhancedSkeleton = ({ variant = 'shimmer', width, height, rounded = 'md', enableTransition = true, transitionDuration = 300, transitionEasing = 'ease-out', performanceId, ariaLabel = 'Loading...', className, style, ...props }) => {
    const roundedClasses = {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        full: 'rounded-full',
    };
    const animationClasses = {
        pulse: 'skeleton-pulse',
        shimmer: 'skeleton-shimmer',
        wave: 'skeleton-wave',
        gradient: 'skeleton-gradient',
        dots: 'skeleton-dots',
        none: '',
    };
    const performanceClasses = performanceId ? 'skeleton-performance' : '';
    const accessibilityClasses = 'skeleton-accessible';
    const baseStyle = {
        width: width ?? '100%',
        height: height ?? '1rem',
        ...style,
    };
    // Performance monitoring
    React.useEffect(() => {
        if (performanceId && typeof window !== 'undefined') {
            const monitor = PerformanceMonitor.getInstance();
            monitor.startMonitoring(performanceId);
            return () => {
                const metrics = monitor.endMonitoring(performanceId);
                console.log(`Skeleton ${performanceId} performance:`, metrics);
            };
        }
        return undefined;
    }, [performanceId]);
    return (_jsxs(_Fragment, { children: [_jsx(EnhancedSkeletonStyles, {}), _jsx("div", { className: cn('bg-muted/60 backdrop-blur-sm', roundedClasses[rounded], animationClasses[variant], performanceClasses, accessibilityClasses, className), style: baseStyle, "data-performance-id": performanceId, "aria-label": ariaLabel, "aria-busy": "true", "aria-live": "polite", ...props })] }));
};
// =============================================================================
// SKELETON-TO-CONTENT TRANSITION SYSTEM
// =============================================================================
export const SkeletonTransition = ({ isLoading, children, skeleton, direction = 'fade', duration = 300, monitorPerformance = false, enablePrediction = false, accessibilityMode = 'polite', }) => {
    const [isTransitioning, setIsTransitioning] = React.useState(false);
    const [showContent, setShowContent] = React.useState(!isLoading);
    const [showSkeleton, setShowSkeleton] = React.useState(isLoading);
    const [predictedDuration, setPredictedDuration] = React.useState(duration);
    const loadingStartTime = React.useRef(0);
    const containerRef = React.useRef(null);
    // Smart loading prediction
    React.useEffect(() => {
        if (enablePrediction) {
            const predictor = LoadingPredictor.getInstance();
            const predicted = predictor.predictDuration();
            setPredictedDuration(predicted);
        }
    }, [enablePrediction]);
    // Performance monitoring
    React.useEffect(() => {
        if (monitorPerformance && typeof window !== 'undefined') {
            const monitor = PerformanceMonitor.getInstance();
            if (isLoading) {
                loadingStartTime.current = Date.now();
                monitor.startMonitoring('skeleton-transition');
            }
            else if (loadingStartTime.current > 0) {
                const loadingDuration = Date.now() - loadingStartTime.current;
                monitor.endMonitoring('skeleton-transition');
                if (enablePrediction) {
                    LoadingPredictor.getInstance().recordLoadingDuration(loadingDuration);
                }
            }
        }
    }, [isLoading, monitorPerformance, enablePrediction]);
    // Handle loading state changes
    React.useEffect(() => {
        if (isLoading) {
            setShowSkeleton(true);
            setShowContent(false);
            setIsTransitioning(false);
            loadingStartTime.current = Date.now();
        }
        else {
            setIsTransitioning(true);
            // Start transition
            setTimeout(() => {
                setShowContent(true);
                setTimeout(() => {
                    setShowSkeleton(false);
                    setIsTransitioning(false);
                }, duration);
            }, 50);
        }
    }, [isLoading, duration]);
    // Accessibility announcements
    React.useEffect(() => {
        if (accessibilityMode !== 'off' && containerRef.current) {
            const announcement = isLoading
                ? 'Loading content, please wait...'
                : 'Content loaded successfully';
            const liveRegion = document.createElement('div');
            liveRegion.setAttribute('aria-live', accessibilityMode);
            liveRegion.setAttribute('aria-atomic', 'true');
            liveRegion.textContent = announcement;
            liveRegion.style.position = 'absolute';
            liveRegion.style.left = '-10000px';
            liveRegion.style.width = '1px';
            liveRegion.style.height = '1px';
            liveRegion.style.overflow = 'hidden';
            document.body.appendChild(liveRegion);
            setTimeout(() => {
                document.body.removeChild(liveRegion);
            }, 1000);
        }
    }, [isLoading, accessibilityMode]);
    const getTransitionStyles = () => {
        const effectiveDuration = enablePrediction ? predictedDuration : duration;
        const skeletonExit = {
            fade: 'skeleton-fade-out',
            'slide-up': 'skeleton-slide-up-out',
            'slide-down': 'skeleton-slide-down-out',
            scale: 'skeleton-scale-out',
            morph: 'skeleton-morph-out',
        }[direction];
        const contentEnter = {
            fade: 'content-fade-in',
            'slide-up': 'content-slide-up-in',
            'slide-down': 'content-slide-down-in',
            scale: 'content-scale-in',
            morph: 'content-morph-in',
        }[direction];
        return {
            skeletonExit,
            contentEnter,
            duration: effectiveDuration,
        };
    };
    const { skeletonExit, contentEnter, duration: effectiveDuration, } = getTransitionStyles();
    return (_jsxs("div", { ref: containerRef, className: "relative overflow-hidden", style: { minHeight: showSkeleton ? '100px' : 'auto' }, children: [showSkeleton && (_jsx("div", { className: cn('absolute inset-0 z-10 transition-all', isTransitioning && skeletonExit), style: {
                    animationDuration: isTransitioning
                        ? `${effectiveDuration}ms`
                        : undefined,
                }, children: skeleton })), showContent && (_jsx("div", { className: cn('relative z-20 transition-all', isTransitioning && contentEnter), style: {
                    animationDuration: isTransitioning
                        ? `${effectiveDuration}ms`
                        : undefined,
                }, children: children })), isLoading && (_jsx("div", { className: "sr-only", role: "status", "aria-live": "polite", children: "Loading content..." }))] }));
};
export const EnhancedSkeletonText = ({ lines = 3, lineHeight = 16, gap = 8, lastLineWidth = 70, variant = 'shimmer', className, enableTransition = true, responsive = true, }) => {
    const [isMobile, setIsMobile] = React.useState(false);
    React.useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 640);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);
    const effectiveLines = responsive && isMobile ? Math.min(lines, 2) : lines;
    return (_jsx("div", { className: cn('space-y-2.5', className), style: { gap: `${gap}px` }, children: Array.from({ length: effectiveLines }).map((_, index) => (_jsx(EnhancedSkeleton, { variant: variant, height: lineHeight, width: index === effectiveLines - 1 ? `${lastLineWidth}%` : '100%', rounded: "sm", enableTransition: enableTransition }, index))) }));
};
export const EnhancedSkeletonAvatar = ({ size = 40, variant = 'shimmer', className, enableTransition = true, responsive = true, }) => {
    const [optimizedSize, setOptimizedSize] = React.useState(size);
    React.useEffect(() => {
        if (!responsive)
            return;
        const optimizeSize = () => {
            const viewportWidth = window.innerWidth;
            if (viewportWidth < 640) {
                setOptimizedSize(Math.min(size, 32));
            }
            else {
                setOptimizedSize(size);
            }
        };
        optimizeSize();
        window.addEventListener('resize', optimizeSize);
        return () => window.removeEventListener('resize', optimizeSize);
    }, [size, responsive]);
    return (_jsx(EnhancedSkeleton, { variant: variant, width: optimizedSize, height: optimizedSize, rounded: "full", enableTransition: enableTransition, className: className }));
};
export const SkeletonComposer = ({ composition, variant = 'shimmer', className, enableTransition = true, }) => {
    const renderComponent = (component, index) => {
        const { type, props = {}, gridArea } = component;
        const baseProps = {
            variant,
            enableTransition,
            ...props,
        };
        const style = gridArea ? { gridArea } : {};
        switch (type) {
            case 'skeleton':
                return _jsx(EnhancedSkeleton, { ...baseProps, style: style }, index);
            case 'text':
                return (_jsx(EnhancedSkeletonText, { ...baseProps, className: cn(props.className, 'skeleton-text') }, index));
            case 'avatar':
                return (_jsx(EnhancedSkeletonAvatar, { ...baseProps, style: style }, index));
            case 'button':
                return (_jsx(EnhancedSkeleton, { width: props.width || 100, height: props.height || 36, rounded: "md", ...baseProps, style: style }, index));
            case 'input':
                return (_jsx(EnhancedSkeleton, { width: props.width || '100%', height: props.height || 40, rounded: "md", ...baseProps, style: style }, index));
            default:
                return null;
        }
    };
    const getLayoutStyles = () => {
        switch (composition.layout) {
            case 'card':
                return 'grid grid-cols-1 gap-4 p-6 rounded-lg border border-border/40 bg-card';
            case 'list':
                return 'flex flex-col gap-4';
            case 'grid':
                return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4';
            case 'message':
                return 'flex gap-3.5 p-4';
            case 'form':
                return 'space-y-4';
            case 'custom':
                return composition.responsive ? 'skeleton-responsive' : '';
            default:
                return 'grid grid-cols-1 gap-4';
        }
    };
    return (_jsx("div", { className: cn(getLayoutStyles(), className), children: composition.components.map((component, index) => renderComponent(component, index)) }));
};
export const SkeletonThemeContext = React.createContext({});
export const SkeletonThemeProvider = ({ theme = {}, children, }) => {
    const effectiveTheme = React.useMemo(() => ({
        primaryColor: '#f1f5f9',
        secondaryColor: '#e2e8f0',
        animationSpeed: 1500,
        borderRadius: 4,
        reducedMotion: false,
        ...theme,
    }), [theme]);
    React.useEffect(() => {
        if (theme.reducedMotion && typeof window !== 'undefined') {
            document.documentElement.style.setProperty('--skeleton-reduced-motion', '1');
        }
    }, [theme.reducedMotion]);
    return (_jsx(SkeletonThemeContext.Provider, { value: effectiveTheme, children: children }));
};
export const useSkeletonTheme = () => React.useContext(SkeletonThemeContext);
export const AccessibleSkeleton = ({ children, isLoading, loadingMessage = 'Loading content, please wait...', loadedMessage = 'Content loaded successfully', progressIndicator = 'linear', estimatedTime, showProgress = true, }) => {
    const [progress, setProgress] = React.useState(0);
    const [announcement, setAnnouncement] = React.useState('');
    const startTime = React.useRef(0);
    React.useEffect(() => {
        if (isLoading) {
            startTime.current = Date.now();
            setAnnouncement(loadingMessage);
            if (showProgress && estimatedTime) {
                const interval = setInterval(() => {
                    const elapsed = Date.now() - startTime.current;
                    const newProgress = Math.min((elapsed / estimatedTime) * 100, 95);
                    setProgress(newProgress);
                }, 100);
                return () => clearInterval(interval);
            }
            return undefined;
        }
        else {
            setProgress(100);
            setAnnouncement(loadedMessage);
            setTimeout(() => setAnnouncement(''), 3000);
            return undefined;
        }
    }, [isLoading, estimatedTime, loadingMessage, loadedMessage, showProgress]);
    const renderProgressIndicator = () => {
        if (!showProgress || progressIndicator === 'none')
            return null;
        switch (progressIndicator) {
            case 'linear':
                return (_jsx("div", { role: "progressbar", "aria-valuenow": progress, "aria-valuemin": 0, "aria-valuemax": 100, "aria-label": "Loading progress", className: "w-full h-2 bg-gray-200 rounded-full overflow-hidden", children: _jsx("div", { className: "h-full bg-blue-500 transition-all duration-300", style: { width: `${progress}%` } }) }));
            case 'circular':
                return (_jsx("div", { className: "relative w-8 h-8", children: _jsx("svg", { className: "w-full h-full", viewBox: "0 0 24 24", children: _jsx("circle", { cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "2", fill: "none", strokeDasharray: 62.8, strokeDashoffset: 62.8 - (62.8 * progress) / 100, className: "transition-all duration-300" }) }) }));
            case 'dots':
                return (_jsx("div", { className: "flex gap-1", children: [0, 1, 2].map((i) => (_jsx("div", { className: "w-2 h-2 bg-gray-400 rounded-full animate-pulse", style: { animationDelay: `${i * 0.2}s` } }, i))) }));
            default:
                return null;
        }
    };
    return (_jsxs("div", { className: "relative", children: [_jsx("div", { className: "sr-only", role: "status", "aria-live": "polite", "aria-atomic": "true", children: announcement }), isLoading && _jsx("div", { className: "mb-4", children: renderProgressIndicator() }), _jsx("div", { className: cn('transition-opacity', isLoading ? 'opacity-30' : 'opacity-100'), children: children }), isLoading && (_jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm", children: _jsxs("div", { className: "text-center", children: [renderProgressIndicator(), _jsx("p", { className: "mt-2 text-sm text-gray-600", children: loadingMessage })] }) }))] }));
};
export const PerformanceSkeleton = ({ children, performanceId, onPerformanceReport, enableDetailedMetrics = false, }) => {
    React.useEffect(() => {
        if (typeof window === 'undefined')
            return;
        const monitor = PerformanceMonitor.getInstance();
        monitor.startMonitoring(performanceId);
        return () => {
            const metrics = monitor.endMonitoring(performanceId);
            if (enableDetailedMetrics) {
                console.log(`Performance metrics for ${performanceId}:`, {
                    metrics,
                    summary: {
                        totalEntries: metrics.length,
                        averageDuration: metrics.reduce((sum, entry) => sum + entry.duration, 0) /
                            metrics.length,
                        totalDuration: metrics.reduce((sum, entry) => sum + entry.duration, 0),
                    },
                });
            }
            if (onPerformanceReport) {
                onPerformanceReport(metrics);
            }
        };
    }, [performanceId, onPerformanceReport, enableDetailedMetrics]);
    return _jsx(_Fragment, { children: children });
};
export const SmartSkeleton = ({ children, isLoading, predictionMode = 'adaptive', onPredictionUpdate, enableLearning = true, }) => {
    const [predictedDuration, setPredictedDuration] = React.useState(2000);
    const [actualDuration, setActualDuration] = React.useState(0);
    const startTime = React.useRef(0);
    React.useEffect(() => {
        if (isLoading) {
            startTime.current = Date.now();
            const predictor = LoadingPredictor.getInstance();
            const predicted = predictor.predictDuration();
            // Adjust based on prediction mode
            let adjustedPrediction = predicted;
            switch (predictionMode) {
                case 'conservative':
                    adjustedPrediction = predicted * 1.2;
                    break;
                case 'aggressive':
                    adjustedPrediction = predicted * 0.8;
                    break;
                case 'adaptive':
                default:
                    adjustedPrediction = predicted;
            }
            setPredictedDuration(adjustedPrediction);
            if (onPredictionUpdate) {
                onPredictionUpdate(adjustedPrediction);
            }
        }
        else if (startTime.current > 0) {
            const duration = Date.now() - startTime.current;
            setActualDuration(duration);
            if (enableLearning) {
                LoadingPredictor.getInstance().recordLoadingDuration(duration);
            }
        }
    }, [isLoading, predictionMode, onPredictionUpdate, enableLearning]);
    return (_jsxs("div", { className: "smart-skeleton-container", children: [children, process.env.NODE_ENV === 'development' && (_jsxs("div", { className: "fixed bottom-4 right-4 bg-black/80 text-white text-xs p-2 rounded", children: [_jsxs("div", { children: ["Predicted: ", predictedDuration, "ms"] }), _jsxs("div", { children: ["Actual: ", actualDuration, "ms"] })] }))] }));
};
export const MicroInteractionSkeleton = ({ children, interactions = [
    { type: 'hover', effect: 'pulse', duration: durations.slower },
    { type: 'focus', effect: 'glow', duration: durations.slower },
], enableSound = false, enableHaptics = false, }) => {
    const elementRef = React.useRef(null);
    React.useEffect(() => {
        if (!elementRef.current)
            return;
        const element = elementRef.current;
        const eventListeners = [];
        interactions.forEach(({ type, effect, duration = 200 }) => {
            const handler = () => {
                // Apply visual effect
                element.classList.add(`skeleton-micro-${effect}`);
                // Apply sound effect
                if (enableSound) {
                    playInteractionSound(effect);
                }
                // Apply haptic feedback
                if (enableHaptics && navigator.vibrate) {
                    navigator.vibrate(duration);
                }
                // Remove effect after duration
                setTimeout(() => {
                    element.classList.remove(`skeleton-micro-${effect}`);
                }, duration);
            };
            const eventName = type === 'hover' ? 'mouseenter' : type;
            element.addEventListener(eventName, handler);
            eventListeners.push({ event: eventName, listener: handler });
        });
        return () => {
            eventListeners.forEach(({ event, listener }) => {
                element.removeEventListener(event, listener);
            });
        };
    }, [interactions, enableSound, enableHaptics]);
    const playInteractionSound = (effect) => {
        if (!enableSound)
            return;
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        // Different frequencies for different effects
        const frequencies = {
            pulse: 440,
            glow: 523,
            scale: 659,
            shake: 294,
        };
        oscillator.frequency.setValueAtTime(frequencies[effect] || 440, audioContext.currentTime);
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
    };
    return (_jsx("div", { ref: elementRef, className: "skeleton-micro-interactions", children: children }));
};
// =============================================================================
// EXPORT ALL ENHANCED COMPONENTS
// =============================================================================
// Re-export original skeleton components for backward compatibility
export { Skeleton, SkeletonText, SkeletonAvatar, SkeletonMessage, SkeletonCard, SkeletonList, SkeletonButton, SkeletonInput, SkeletonChatWindow, } from './skeleton';
//# sourceMappingURL=skeleton-enhanced.js.map