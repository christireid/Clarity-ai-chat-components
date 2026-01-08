'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Badge, Button, cn, } from '@clarity-chat/primitives';
const defaultConfig = {
    trackClicks: true,
    trackHover: true,
    trackScroll: true,
    trackFeatureDiscovery: true,
    samplingRate: 1.0,
    sessionTimeout: 30 * 60 * 1000, // 30 minutes
    heatmapResolution: 10, // 10x10 grid
};
/**
 * UserInteractionAnalytics Component
 *
 * Tracks and visualizes user interactions including:
 * - Click patterns and heatmaps
 * - Feature discovery tracking
 * - User journey visualization
 * - Session analytics
 * - Engagement metrics
 */
export function UserInteractionAnalytics({ config: userConfig, initialEvents = [], onEventTracked, onAnalyticsGenerated, realtime = true, updateInterval = 5000, detailed = false, className, }) {
    const config = { ...defaultConfig, ...userConfig };
    const [events, setEvents] = React.useState(initialEvents);
    const [sessions, setSessions] = React.useState([]);
    const [metrics, setMetrics] = React.useState(null);
    const [heatmap, setHeatmap] = React.useState([]);
    const [isTracking, setIsTracking] = React.useState(true);
    const [selectedView, setSelectedView] = React.useState('overview');
    const currentSessionId = React.useRef(`session-${Date.now()}`);
    // Track interaction event
    const trackEvent = React.useCallback((event) => {
        if (!isTracking)
            return;
        if (Math.random() > config.samplingRate)
            return;
        const newEvent = {
            ...event,
            id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            timestamp: Date.now(),
            sessionId: currentSessionId.current,
        };
        setEvents(prev => [...prev, newEvent]);
        onEventTracked?.(newEvent);
        // Update heatmap for click events
        if (event.type === 'click' && event.position) {
            setHeatmap(prev => [
                ...prev,
                {
                    x: event.position.x,
                    y: event.position.y,
                    intensity: 1,
                    timestamp: Date.now(),
                },
            ]);
        }
    }, [isTracking, config.samplingRate, onEventTracked]);
    // Set up global event listeners
    React.useEffect(() => {
        if (!isTracking)
            return;
        const handleClick = (e) => {
            if (!config.trackClicks)
                return;
            const target = e.target;
            trackEvent({
                type: 'click',
                target: target.tagName,
                element: target.id || target.className || undefined,
                position: { x: e.clientX, y: e.clientY },
                metadata: {
                    button: e.button,
                    ctrlKey: e.ctrlKey,
                    shiftKey: e.shiftKey,
                },
            });
        };
        const handleScroll = () => {
            if (!config.trackScroll)
                return;
            trackEvent({
                type: 'scroll',
                target: 'window',
                metadata: {
                    scrollY: window.scrollY,
                    scrollX: window.scrollX,
                },
            });
        };
        let scrollTimeout;
        const throttledScroll = () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(handleScroll, 200);
        };
        if (config.trackClicks) {
            document.addEventListener('click', handleClick);
        }
        if (config.trackScroll) {
            window.addEventListener('scroll', throttledScroll);
        }
        return () => {
            document.removeEventListener('click', handleClick);
            window.removeEventListener('scroll', throttledScroll);
            clearTimeout(scrollTimeout);
        };
    }, [isTracking, config, trackEvent]);
    // Generate analytics from events
    const generateAnalytics = React.useCallback(() => {
        if (events.length === 0)
            return;
        // Calculate sessions
        const sessionMap = new Map();
        events.forEach(event => {
            const sessionId = event.sessionId || 'unknown';
            if (!sessionMap.has(sessionId)) {
                sessionMap.set(sessionId, {
                    sessionId,
                    userId: event.userId,
                    startTime: event.timestamp,
                    endTime: event.timestamp,
                    duration: 0,
                    pageViews: 0,
                    interactions: 0,
                    features: [],
                    journey: [],
                    bounced: false,
                    converted: false,
                });
            }
            const session = sessionMap.get(sessionId);
            session.endTime = Math.max(session.endTime || 0, event.timestamp);
            session.duration = session.endTime - session.startTime;
            session.interactions++;
            // Track feature usage
            if (event.type === 'feature_discovery' && event.metadata?.featureName) {
                if (!session.features.includes(event.metadata.featureName)) {
                    session.features.push(event.metadata.featureName);
                }
            }
            // Add to journey
            session.journey.push({
                id: event.id,
                action: event.type,
                target: event.target,
                timestamp: event.timestamp,
                metadata: event.metadata,
            });
        });
        const sessionsList = Array.from(sessionMap.values());
        setSessions(sessionsList);
        // Calculate engagement metrics
        const totalSessions = sessionsList.length;
        const avgSessionDuration = sessionsList.reduce((sum, s) => sum + s.duration, 0) / totalSessions;
        const avgInteractionsPerSession = sessionsList.reduce((sum, s) => sum + s.interactions, 0) / totalSessions;
        // Bounce rate (sessions with < 2 interactions or < 10 seconds)
        const bounces = sessionsList.filter(s => s.interactions < 2 || s.duration < 10000).length;
        const bounceRate = bounces / totalSessions;
        // Calculate feature interactions
        const featureMap = new Map();
        events.filter(e => e.type === 'feature_discovery').forEach(event => {
            const featureName = event.metadata?.featureName || 'unknown';
            if (!featureMap.has(featureName)) {
                featureMap.set(featureName, {
                    featureId: event.metadata?.featureId || featureName,
                    featureName,
                    interactionCount: 0,
                    uniqueUsers: new Set([event.userId]).size,
                    firstDiscovery: event.timestamp,
                    lastInteraction: event.timestamp,
                    avgTimeToDiscover: 0,
                    usageRate: 0,
                });
            }
            const feature = featureMap.get(featureName);
            feature.interactionCount++;
            feature.lastInteraction = Math.max(feature.lastInteraction, event.timestamp);
        });
        const topFeatures = Array.from(featureMap.values())
            .sort((a, b) => b.interactionCount - a.interactionCount)
            .slice(0, 10);
        // Calculate engagement score (0-100)
        const engagementScore = Math.min(100, Math.round((avgSessionDuration / 60000) * 20 + // 20 points for avg duration in minutes
            (avgInteractionsPerSession / 10) * 30 + // 30 points for interactions
            (1 - bounceRate) * 30 + // 30 points for low bounce rate
            (topFeatures.length / 10) * 20 // 20 points for feature diversity
        ));
        const metrics = {
            totalSessions,
            avgSessionDuration,
            avgInteractionsPerSession,
            bounceRate,
            conversionRate: 0, // Would need conversion tracking
            topFeatures,
            returnRate: 0, // Would need user ID tracking
            engagementScore,
        };
        setMetrics(metrics);
        onAnalyticsGenerated?.(metrics);
    }, [events, onAnalyticsGenerated]);
    // Auto-generate analytics
    React.useEffect(() => {
        if (!realtime)
            return;
        const interval = setInterval(() => {
            generateAnalytics();
        }, updateInterval);
        return () => clearInterval(interval);
    }, [realtime, updateInterval, generateAnalytics]);
    // Initial analytics generation
    React.useEffect(() => {
        if (events.length > 0) {
            generateAnalytics();
        }
    }, [events.length, generateAnalytics]);
    // Format duration
    const formatDuration = (ms) => {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        if (hours > 0) {
            return `${hours}h ${minutes % 60}m`;
        }
        else if (minutes > 0) {
            return `${minutes}m ${seconds % 60}s`;
        }
        else {
            return `${seconds}s`;
        }
    };
    // Render overview
    const renderOverview = () => (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [_jsxs(Card, { children: [_jsx(CardHeader, { className: "pb-2", children: _jsx(CardDescription, { children: "Total Sessions" }) }), _jsx(CardContent, { children: _jsx("div", { className: "text-2xl font-bold", children: metrics?.totalSessions || 0 }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { className: "pb-2", children: _jsx(CardDescription, { children: "Avg Duration" }) }), _jsx(CardContent, { children: _jsx("div", { className: "text-2xl font-bold", children: metrics ? formatDuration(metrics.avgSessionDuration) : '0s' }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { className: "pb-2", children: _jsx(CardDescription, { children: "Bounce Rate" }) }), _jsx(CardContent, { children: _jsx("div", { className: "text-2xl font-bold", children: metrics ? `${(metrics.bounceRate * 100).toFixed(1)}%` : '0%' }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { className: "pb-2", children: _jsx(CardDescription, { children: "Engagement Score" }) }), _jsx(CardContent, { children: _jsxs("div", { className: "text-2xl font-bold", children: [metrics?.engagementScore || 0, _jsx("span", { className: "text-sm text-muted-foreground", children: "/100" })] }) })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Session Analytics" }) }), _jsx(CardContent, { children: _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-sm text-muted-foreground", children: "Avg Interactions per Session" }), _jsx("span", { className: "font-medium", children: metrics ? metrics.avgInteractionsPerSession.toFixed(1) : '0' })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-sm text-muted-foreground", children: "Total Events Tracked" }), _jsx("span", { className: "font-medium", children: events.length })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-sm text-muted-foreground", children: "Active Sessions" }), _jsx("span", { className: "font-medium", children: sessions.length })] })] }) })] })] }));
    // Render feature discovery
    const renderFeatures = () => (_jsx("div", { className: "space-y-4", children: _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Top Features" }), _jsx(CardDescription, { children: "Most discovered and used features" })] }), _jsx(CardContent, { children: _jsxs("div", { className: "space-y-3", children: [metrics?.topFeatures.length === 0 && (_jsx("p", { className: "text-sm text-muted-foreground text-center py-4", children: "No feature interactions tracked yet" })), metrics?.topFeatures.map((feature, index) => (_jsxs(motion.div, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { delay: index * 0.05 }, className: "flex items-center justify-between p-3 border rounded-lg", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Badge, { variant: "outline", children: index + 1 }), _jsxs("div", { children: [_jsx("div", { className: "font-medium", children: feature.featureName }), _jsxs("div", { className: "text-sm text-muted-foreground", children: [feature.interactionCount, " interactions"] })] })] }), _jsx("div", { className: "text-right", children: _jsxs("div", { className: "text-sm font-medium", children: [feature.uniqueUsers, " users"] }) })] }, feature.featureId)))] }) })] }) }));
    // Render user journey
    const renderJourney = () => (_jsx("div", { className: "space-y-4", children: _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Recent User Journey" }), _jsx(CardDescription, { children: "Last 10 interactions" })] }), _jsx(CardContent, { children: _jsxs("div", { className: "space-y-2", children: [events.slice(-10).reverse().map((event, index) => (_jsxs(motion.div, { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, transition: { delay: index * 0.03 }, className: "flex items-start gap-3 p-2 border-l-2 border-primary/20 pl-3", children: [_jsx(Badge, { variant: "secondary", className: "mt-0.5", children: event.type }), _jsxs("div", { className: "flex-1", children: [_jsx("div", { className: "text-sm font-medium", children: event.target }), event.element && (_jsx("div", { className: "text-xs text-muted-foreground", children: event.element })), _jsx("div", { className: "text-xs text-muted-foreground", children: new Date(event.timestamp).toLocaleTimeString() })] })] }, event.id))), events.length === 0 && (_jsx("p", { className: "text-sm text-muted-foreground text-center py-4", children: "No interactions tracked yet" }))] }) })] }) }));
    // Render heatmap (simplified visualization)
    const renderHeatmap = () => (_jsx("div", { className: "space-y-4", children: _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Click Heatmap" }), _jsx(CardDescription, { children: "Click density visualization" })] }), _jsx(CardContent, { children: _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "text-sm text-muted-foreground", children: ["Total clicks: ", heatmap.length] }), heatmap.length === 0 && (_jsx("p", { className: "text-sm text-muted-foreground text-center py-4", children: "No clicks tracked yet. Click around to see the heatmap." })), heatmap.length > 0 && (_jsxs("div", { className: "text-sm", children: [_jsx("div", { className: "font-medium mb-2", children: "Recent Click Positions:" }), _jsx("div", { className: "space-y-1 max-h-60 overflow-auto", children: heatmap.slice(-20).map((point, index) => (_jsxs("div", { className: "flex justify-between text-xs", children: [_jsxs("span", { children: ["(", point.x, ", ", point.y, ")"] }), _jsx("span", { className: "text-muted-foreground", children: new Date(point.timestamp).toLocaleTimeString() })] }, index))) })] }))] }) })] }) }));
    return (_jsxs(Card, { className: cn('w-full', className), children: [_jsxs(CardHeader, { children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx(CardTitle, { children: "User Interaction Analytics" }), _jsx(CardDescription, { children: "Track and analyze user behavior patterns" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Button, { variant: isTracking ? 'default' : 'outline', size: "sm", onClick: () => setIsTracking(!isTracking), children: isTracking ? 'Tracking' : 'Paused' }), detailed && (_jsx(Button, { variant: "outline", size: "sm", onClick: generateAnalytics, children: "Refresh" }))] })] }), _jsxs("div", { className: "flex gap-2 mt-4", children: [_jsx(Button, { variant: selectedView === 'overview' ? 'default' : 'outline', size: "sm", onClick: () => setSelectedView('overview'), children: "Overview" }), _jsx(Button, { variant: selectedView === 'features' ? 'default' : 'outline', size: "sm", onClick: () => setSelectedView('features'), children: "Features" }), _jsx(Button, { variant: selectedView === 'journey' ? 'default' : 'outline', size: "sm", onClick: () => setSelectedView('journey'), children: "Journey" }), _jsx(Button, { variant: selectedView === 'heatmap' ? 'default' : 'outline', size: "sm", onClick: () => setSelectedView('heatmap'), children: "Heatmap" })] })] }), _jsx(CardContent, { children: _jsx(AnimatePresence, { mode: "wait", children: _jsxs(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, transition: {
                            // Framer Motion 12: Spring view transitions
                            type: 'spring',
                            damping: 25,
                            stiffness: 300,
                        }, children: [selectedView === 'overview' && renderOverview(), selectedView === 'features' && renderFeatures(), selectedView === 'journey' && renderJourney(), selectedView === 'heatmap' && renderHeatmap()] }, selectedView) }) })] }));
}
/**
 * Hook for tracking user interactions
 */
export function useInteractionTracking(config) {
    const [events, setEvents] = React.useState([]);
    const fullConfig = { ...defaultConfig, ...config };
    const trackInteraction = React.useCallback((type, target, metadata) => {
        const event = {
            id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            type,
            target,
            timestamp: Date.now(),
            metadata,
        };
        setEvents(prev => [...prev, event]);
        return event;
    }, []);
    const trackFeatureDiscovery = React.useCallback((featureName, featureId) => {
        return trackInteraction('feature_discovery', featureName, {
            featureName,
            featureId: featureId || featureName,
        });
    }, [trackInteraction]);
    const clearEvents = React.useCallback(() => {
        setEvents([]);
    }, []);
    return {
        events,
        trackInteraction,
        trackFeatureDiscovery,
        clearEvents,
    };
}
//# sourceMappingURL=user-interaction-analytics.js.map