'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Badge, ScrollArea, cn, } from '@clarity-chat/primitives';
import { useReducedMotion, getMotionSafePreset, getMotionSafeTransition, } from '../../animations';
/**
 * Format timestamp to readable date
 */
function formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}
/**
 * Format relative time
 */
function formatRelativeTime(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (days > 0)
        return `${days}d ago`;
    if (hours > 0)
        return `${hours}h ago`;
    if (minutes > 0)
        return `${minutes}m ago`;
    return 'Just now';
}
/**
 * PromptVersionHistory Component
 *
 * Displays version history for a prompt template with comparison and rollback capabilities.
 * Shows active/deployed status and allows version management.
 *
 * Features:
 * - Version timeline with notes
 * - Active version indicator
 * - Deployment status per environment
 * - Version comparison selection
 * - Rollback functionality
 * - Deploy to environment
 *
 * @example
 * ```tsx
 * <PromptVersionHistory
 *   templateId="template-1"
 *   templateName="Code Review"
 *   versions={versions}
 *   activeVersionId="v-3"
 *   deployedVersions={{ production: 'v-2', staging: 'v-3' }}
 *   onRollback={(id) => rollbackToVersion(id)}
 *   onDeploy={(id, env) => deployVersion(id, env)}
 *   enableComparison
 * />
 * ```
 */
export function PromptVersionHistory({ templateId, templateName, versions, activeVersionId, deployedVersions = {}, onSelectVersion, onSetActive, onRollback, onDeploy, onCompare, enableComparison = true, showDeployment = true, maxHeight = 500, className, }) {
    const [selectedForComparison, setSelectedForComparison] = React.useState([]);
    const [expandedVersionId, setExpandedVersionId] = React.useState(null);
    const prefersReducedMotion = useReducedMotion();
    // Sort versions by creation date (newest first)
    const sortedVersions = React.useMemo(() => [...versions].sort((a, b) => b.createdAt - a.createdAt), [versions]);
    // Toggle version selection for comparison
    const toggleComparisonSelection = React.useCallback((versionId) => {
        setSelectedForComparison((prev) => {
            if (prev.includes(versionId)) {
                return prev.filter((id) => id !== versionId);
            }
            if (prev.length >= 2) {
                return [prev[1], versionId];
            }
            return [...prev, versionId];
        });
    }, []);
    // Handle compare action
    const handleCompare = React.useCallback(() => {
        if (selectedForComparison.length === 2) {
            onCompare?.(selectedForComparison[0], selectedForComparison[1]);
        }
    }, [selectedForComparison, onCompare]);
    // Get environment badge for version
    const getEnvironmentBadges = React.useCallback((versionId) => {
        const badges = [];
        if (deployedVersions.production === versionId) {
            badges.push({ env: 'production', color: 'bg-green-500' });
        }
        if (deployedVersions.staging === versionId) {
            badges.push({ env: 'staging', color: 'bg-yellow-500' });
        }
        if (deployedVersions.development === versionId) {
            badges.push({ env: 'development', color: 'bg-blue-500' });
        }
        return badges;
    }, [deployedVersions]);
    return (_jsxs(Card, { className: cn('flex flex-col', className), children: [_jsxs(CardHeader, { className: "flex-shrink-0 pb-3", children: [_jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: ["Version History", _jsx(Badge, { variant: "secondary", children: versions.length })] }), _jsx(CardDescription, { children: templateName
                                            ? `History for "${templateName}"`
                                            : `Template ${templateId}` })] }), enableComparison && selectedForComparison.length === 2 && (_jsx(Button, { size: "sm", onClick: handleCompare, children: "Compare Selected" }))] }), enableComparison && selectedForComparison.length > 0 && (_jsx("div", { className: "mt-2 text-sm text-muted-foreground", children: selectedForComparison.length === 1
                            ? 'Select one more version to compare'
                            : 'Two versions selected for comparison' }))] }), _jsx(CardContent, { className: "flex-1 overflow-hidden p-0", children: _jsx(ScrollArea, { className: "h-full px-4", style: {
                        maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight,
                    }, children: sortedVersions.length === 0 ? (_jsxs("div", { className: "flex flex-col items-center justify-center py-12 text-center", children: [_jsx("div", { className: "text-5xl mb-3", children: "\uD83D\uDCDC" }), _jsx("p", { className: "text-sm font-medium", children: "No versions yet" }), _jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Versions will appear here when created" })] })) : (_jsxs("div", { className: "relative py-4", children: [_jsx("div", { className: "absolute left-4 top-8 bottom-8 w-0.5 bg-border" }), _jsx(AnimatePresence, { children: sortedVersions.map((version, index) => {
                                    const isActive = version.isActive || version.id === activeVersionId;
                                    const isExpanded = expandedVersionId === version.id;
                                    const isSelectedForComparison = selectedForComparison.includes(version.id);
                                    const envBadges = getEnvironmentBadges(version.id);
                                    return (_jsxs(motion.div, { ...getMotionSafePreset(prefersReducedMotion, 'slideRight'), transition: getMotionSafeTransition(prefersReducedMotion, 'normal', 'out', { delay: index * 0.05 }), className: "relative pl-10 pb-6 last:pb-0", children: [_jsx("div", { "aria-hidden": "true", className: cn('absolute left-2.5 w-3 h-3 rounded-full border-2', 'transition-all duration-200', isActive
                                                    ? 'bg-primary border-primary scale-125'
                                                    : 'bg-background border-muted-foreground', isSelectedForComparison &&
                                                    'ring-2 ring-primary ring-offset-2') }), _jsx(Card, { role: "button", tabIndex: 0, "aria-label": `Version ${version.version}${isActive ? ', Active' : ''}${version.notes ? `, ${version.notes}` : ''}`, className: cn('cursor-pointer transition-all duration-200', 'hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary', isActive && 'border-primary/50', isSelectedForComparison &&
                                                    'border-primary ring-1 ring-primary/30'), onClick: () => onSelectVersion?.(version), onKeyDown: (e) => {
                                                    if (e.key === 'Enter' || e.key === ' ') {
                                                        e.preventDefault();
                                                        onSelectVersion?.(version);
                                                    }
                                                }, children: _jsxs(CardContent, { className: "p-4", children: [_jsxs("div", { className: "flex items-start justify-between mb-2", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("span", { className: "font-semibold text-sm", children: ["v", version.version] }), isActive && (_jsx(Badge, { variant: "default", className: "text-xs", children: "Active" })), envBadges.map(({ env, color }) => (_jsxs(Badge, { variant: "outline", className: "text-xs capitalize", children: [_jsx("span", { className: cn('w-1.5 h-1.5 rounded-full mr-1.5', color) }), env] }, env)))] }), _jsx("span", { className: "text-xs text-muted-foreground", children: formatRelativeTime(version.createdAt) })] }), version.notes && (_jsx("p", { className: "text-sm text-muted-foreground mb-3", children: version.notes })), _jsx("p", { className: "text-xs text-muted-foreground mb-3", children: formatDate(version.createdAt) }), _jsx(AnimatePresence, { children: isExpanded && (_jsx(motion.div, { ...getMotionSafePreset(prefersReducedMotion, 'fadeIn'), transition: getMotionSafeTransition(prefersReducedMotion, 'fast', 'out'), className: "mt-3 pt-3 border-t", children: _jsx("pre", { className: "text-xs bg-muted/50 p-3 rounded overflow-auto max-h-40", children: version.template }) })) }), _jsxs("div", { className: "flex items-center gap-2 pt-2 border-t mt-2", children: [_jsxs(Button, { variant: "ghost", size: "sm", onClick: (e) => {
                                                                        e.stopPropagation();
                                                                        setExpandedVersionId(isExpanded ? null : version.id);
                                                                    }, "aria-expanded": isExpanded, "aria-label": `${isExpanded ? 'Hide' : 'Show'} template for version ${version.version}`, children: [isExpanded ? '▲ Hide' : '▼ Show', " Template"] }), enableComparison && (_jsx(Button, { variant: isSelectedForComparison
                                                                        ? 'secondary'
                                                                        : 'outline', size: "sm", onClick: (e) => {
                                                                        e.stopPropagation();
                                                                        toggleComparisonSelection(version.id);
                                                                    }, "aria-pressed": isSelectedForComparison, "aria-label": `${isSelectedForComparison ? 'Deselect' : 'Select'} version ${version.version} for comparison`, children: isSelectedForComparison
                                                                        ? '✓ Selected'
                                                                        : 'Compare' })), !isActive && onSetActive && (_jsx(Button, { variant: "outline", size: "sm", onClick: (e) => {
                                                                        e.stopPropagation();
                                                                        onSetActive(version.id);
                                                                    }, "aria-label": `Set version ${version.version} as active`, children: "Set Active" })), !isActive && onRollback && (_jsx(Button, { variant: "outline", size: "sm", onClick: (e) => {
                                                                        e.stopPropagation();
                                                                        onRollback(version.id);
                                                                    }, "aria-label": `Rollback to version ${version.version}`, children: "Rollback" })), showDeployment && onDeploy && (_jsx("div", { className: "ml-auto flex gap-1", role: "group", "aria-label": "Deploy to environment", children: [
                                                                        'development',
                                                                        'staging',
                                                                        'production',
                                                                    ].map((env) => {
                                                                        const isDeployed = deployedVersions[env] === version.id;
                                                                        return (_jsx(Button, { variant: isDeployed ? 'secondary' : 'ghost', size: "sm", className: "text-xs px-2", onClick: (e) => {
                                                                                e.stopPropagation();
                                                                                if (!isDeployed) {
                                                                                    onDeploy(version.id, env);
                                                                                }
                                                                            }, disabled: isDeployed, "aria-label": isDeployed
                                                                                ? `Already deployed to ${env}`
                                                                                : `Deploy version ${version.version} to ${env}`, children: env[0]?.toUpperCase() }, env));
                                                                    }) }))] })] }) })] }, version.id));
                                }) })] })) }) })] }));
}
PromptVersionHistory.displayName = 'PromptVersionHistory';
//# sourceMappingURL=prompt-version-history.js.map