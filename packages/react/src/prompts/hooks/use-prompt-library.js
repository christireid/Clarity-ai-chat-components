/**
 * usePromptLibrary Hook
 *
 * React hook for managing prompt templates, versions, and deployments.
 * Provides a complete interface for prompt lifecycle management.
 *
 * @packageDocumentation
 */
'use client';
import * as React from 'react';
/**
 * Generate a unique ID
 */
function generateId() {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}
/**
 * Generate semantic version number
 */
function generateVersion(versions) {
    if (versions.length === 0)
        return '1.0.0';
    const latest = versions[versions.length - 1];
    if (!latest)
        return '1.0.0';
    const parts = latest.version.split('.').map(Number);
    if (parts.length < 3)
        return '1.0.0';
    parts[2] = (parts[2] ?? 0) + 1;
    return parts.join('.');
}
/**
 * Simple diff algorithm for comparing versions
 */
function computeDiff(str1, str2) {
    const lines1 = str1.split('\n');
    const lines2 = str2.split('\n');
    const diff = [];
    const maxLen = Math.max(lines1.length, lines2.length);
    for (let i = 0; i < maxLen; i++) {
        const line1 = lines1[i];
        const line2 = lines2[i];
        if (line1 === line2) {
            diff.push(`  ${line1 ?? ''}`);
        }
        else {
            if (line1 !== undefined)
                diff.push(`- ${line1}`);
            if (line2 !== undefined)
                diff.push(`+ ${line2}`);
        }
    }
    return diff;
}
/**
 * usePromptLibrary Hook
 *
 * Comprehensive prompt library management with templates, versions,
 * deployments, and change history tracking.
 *
 * @example
 * ```tsx
 * const { templates, versions, deployments } = usePromptLibrary({
 *   persist: true,
 *   currentUser: { id: 'user-1', name: 'John Doe' },
 * })
 *
 * // Add a template
 * const template = templates.add({
 *   name: 'Code Review',
 *   template: 'Review this {{language}} code:\n\n{{code}}',
 *   variables: [
 *     { name: 'language', required: true },
 *     { name: 'code', required: true },
 *   ],
 * })
 *
 * // Create a new version
 * const version = versions.create(template.id, 'Updated template...', 'Added error handling')
 *
 * // Deploy to production
 * deployments.deploy(template.id, version.id, 'production')
 * ```
 */
export function usePromptLibrary(options = {}) {
    const { initialTemplates = [], storageKey = 'clarity-prompt-library', persist = false, currentUser = { id: 'system', name: 'System' }, onChange, } = options;
    // Initialize state
    const [state, setState] = React.useState(() => {
        // Try to load from storage
        if (persist && typeof window !== 'undefined') {
            try {
                const stored = localStorage.getItem(storageKey);
                if (stored) {
                    const parsed = JSON.parse(stored);
                    return {
                        ...parsed,
                        isLoading: false,
                        error: undefined,
                    };
                }
            }
            catch {
                // Ignore storage errors
            }
        }
        return {
            templates: initialTemplates,
            versions: {},
            deployments: {
                development: [],
                staging: [],
                production: [],
            },
            abTests: [],
            analytics: {},
            history: [],
            isLoading: false,
            error: undefined,
        };
    });
    // Persist to storage
    React.useEffect(() => {
        if (persist && typeof window !== 'undefined') {
            try {
                localStorage.setItem(storageKey, JSON.stringify(state));
            }
            catch {
                // Ignore storage errors
            }
        }
        onChange?.(state);
    }, [state, persist, storageKey, onChange]);
    // Add history entry
    const addHistoryEntry = React.useCallback((entry) => {
        setState((prev) => ({
            ...prev,
            history: [
                ...prev.history,
                {
                    ...entry,
                    id: generateId(),
                    changedAt: Date.now(),
                    changedBy: currentUser,
                },
            ],
        }));
    }, [currentUser]);
    // Template operations
    const templateOps = React.useMemo(() => ({
        getAll: () => state.templates,
        get: (id) => state.templates.find((t) => t.id === id),
        getByName: (name) => state.templates.find((t) => t.name === name),
        search: (query) => {
            const lowerQuery = query.toLowerCase();
            return state.templates.filter((t) => t.name.toLowerCase().includes(lowerQuery) ||
                t.description?.toLowerCase().includes(lowerQuery) ||
                t.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery)));
        },
        getByTag: (tag) => state.templates.filter((t) => t.tags?.includes(tag)),
        add: (template) => {
            const newTemplate = {
                ...template,
                id: template.id || generateId(),
            };
            setState((prev) => ({
                ...prev,
                templates: [...prev.templates, newTemplate],
            }));
            addHistoryEntry({
                templateId: newTemplate.id,
                changeType: 'created',
                description: `Created template "${newTemplate.name}"`,
            });
            return newTemplate;
        },
        update: (id, updates) => {
            setState((prev) => {
                const template = prev.templates.find((t) => t.id === id);
                if (!template)
                    return prev;
                return {
                    ...prev,
                    templates: prev.templates.map((t) => t.id === id ? { ...t, ...updates } : t),
                };
            });
            addHistoryEntry({
                templateId: id,
                changeType: 'updated',
                description: `Updated template`,
            });
        },
        remove: (id) => {
            const template = state.templates.find((t) => t.id === id);
            if (!template)
                return;
            setState((prev) => ({
                ...prev,
                templates: prev.templates.filter((t) => t.id !== id),
                versions: Object.fromEntries(Object.entries(prev.versions).filter(([key]) => key !== id)),
            }));
            addHistoryEntry({
                templateId: id,
                changeType: 'deleted',
                description: `Deleted template "${template.name}"`,
            });
        },
        duplicate: (id, newName) => {
            const template = state.templates.find((t) => t.id === id);
            if (!template)
                return undefined;
            const duplicated = {
                ...template,
                id: generateId(),
                name: newName || `${template.name} (Copy)`,
            };
            setState((prev) => ({
                ...prev,
                templates: [...prev.templates, duplicated],
            }));
            addHistoryEntry({
                templateId: duplicated.id,
                changeType: 'created',
                description: `Duplicated from "${template.name}"`,
            });
            return duplicated;
        },
    }), [state.templates, addHistoryEntry]);
    // Helper function for creating versions (extracted to avoid self-reference)
    const createVersion = React.useCallback((templateId, template, notes) => {
        const newVersion = {
            id: generateId(),
            templateId,
            version: '0.0.0', // Placeholder, will be computed in setState
            template,
            createdAt: Date.now(),
            notes,
            isActive: true,
        };
        setState((prev) => {
            const existingVersions = prev.versions[templateId] || [];
            const computedVersion = generateVersion(existingVersions);
            const versionWithNumber = { ...newVersion, version: computedVersion };
            return {
                ...prev,
                versions: {
                    ...prev.versions,
                    [templateId]: [
                        ...existingVersions.map((v) => ({ ...v, isActive: false })),
                        versionWithNumber,
                    ],
                },
            };
        });
        // Use setTimeout to avoid calling setState during render
        setTimeout(() => {
            addHistoryEntry({
                templateId,
                changeType: 'version-created',
                description: `Created version`,
                versionId: newVersion.id,
                newValue: template,
            });
        }, 0);
        return newVersion;
    }, [addHistoryEntry]);
    // Version operations
    const versionOps = React.useMemo(() => ({
        getAll: (templateId) => state.versions[templateId] || [],
        get: (templateId, versionId) => state.versions[templateId]?.find((v) => v.id === versionId),
        getActive: (templateId) => {
            const versions = state.versions[templateId] || [];
            return versions.find((v) => v.isActive) || versions[versions.length - 1];
        },
        create: createVersion,
        setActive: (templateId, versionId) => {
            setState((prev) => ({
                ...prev,
                versions: {
                    ...prev.versions,
                    [templateId]: (prev.versions[templateId] || []).map((v) => ({
                        ...v,
                        isActive: v.id === versionId,
                    })),
                },
            }));
        },
        compare: (templateId, versionId1, versionId2) => {
            const versions = state.versions[templateId] || [];
            const version1 = versions.find((v) => v.id === versionId1);
            const version2 = versions.find((v) => v.id === versionId2);
            if (!version1 || !version2)
                return undefined;
            return {
                version1,
                version2,
                diff: computeDiff(version1.template, version2.template),
            };
        },
        rollback: (templateId, versionId) => {
            const version = state.versions[templateId]?.find((v) => v.id === versionId);
            if (!version)
                return;
            // Create a new version from the rollback target
            createVersion(templateId, version.template, `Rolled back to version ${version.version}`);
        },
    }), [state.versions, createVersion]);
    // Deployment operations
    const deploymentOps = React.useMemo(() => ({
        getByEnvironment: (env) => state.deployments[env] || [],
        getActive: (templateId, env) => state.deployments[env]?.find((d) => d.templateId === templateId && d.status === 'active'),
        deploy: (templateId, versionId, env, trafficPercentage = 100) => {
            // Find previous active deployment for rollback target
            const previousActive = state.deployments[env]?.find((d) => d.templateId === templateId && d.status === 'active');
            const deployment = {
                id: generateId(),
                templateId,
                versionId,
                environment: env,
                status: 'active',
                deployedAt: Date.now(),
                deployedBy: currentUser.id,
                rollbackTarget: previousActive?.versionId,
                trafficPercentage,
            };
            setState((prev) => ({
                ...prev,
                deployments: {
                    ...prev.deployments,
                    [env]: [
                        ...(prev.deployments[env] || []).map((d) => d.templateId === templateId && d.status === 'active'
                            ? { ...d, status: 'archived' }
                            : d),
                        deployment,
                    ],
                },
            }));
            addHistoryEntry({
                templateId,
                changeType: 'deployed',
                description: `Deployed to ${env}`,
                versionId,
                environment: env,
            });
            return deployment;
        },
        rollback: (deploymentId) => {
            // First, find the target deployment from current state
            const envs = [
                'development',
                'staging',
                'production',
            ];
            let targetDeployment;
            let targetEnv;
            for (const env of envs) {
                const deployment = state.deployments[env]?.find((d) => d.id === deploymentId);
                if (deployment) {
                    targetDeployment = deployment;
                    targetEnv = env;
                    break;
                }
            }
            if (!targetDeployment || !targetEnv)
                return;
            // Update state
            setState((prev) => ({
                ...prev,
                deployments: {
                    ...prev.deployments,
                    [targetEnv]: prev.deployments[targetEnv]?.map((d) => d.id === deploymentId
                        ? { ...d, status: 'rolled-back' }
                        : d) || [],
                },
            }));
            // Add history entry after state update
            addHistoryEntry({
                templateId: targetDeployment.templateId,
                changeType: 'rolled-back',
                description: `Rolled back deployment in ${targetDeployment.environment}`,
                versionId: targetDeployment.versionId,
                environment: targetDeployment.environment,
            });
        },
        updateTraffic: (deploymentId, percentage) => {
            setState((prev) => {
                const envs = [
                    'development',
                    'staging',
                    'production',
                ];
                let updatedDeployments = { ...prev.deployments };
                for (const env of envs) {
                    const idx = prev.deployments[env]?.findIndex((d) => d.id === deploymentId);
                    if (idx !== undefined && idx >= 0 && prev.deployments[env]) {
                        updatedDeployments = {
                            ...updatedDeployments,
                            [env]: prev.deployments[env]?.map((d, i) => i === idx
                                ? {
                                    ...d,
                                    trafficPercentage: Math.min(100, Math.max(0, percentage)),
                                }
                                : d) || [],
                        };
                        break;
                    }
                }
                return { ...prev, deployments: updatedDeployments };
            });
        },
    }), [state.deployments, currentUser.id, addHistoryEntry]);
    // History operations
    const historyOps = React.useMemo(() => ({
        getAll: () => state.history,
        getForTemplate: (templateId) => state.history.filter((h) => h.templateId === templateId),
        clear: () => {
            setState((prev) => ({ ...prev, history: [] }));
        },
    }), [state.history]);
    // Export/Import
    const exportLibrary = React.useCallback(() => {
        return JSON.stringify({
            templates: state.templates,
            versions: state.versions,
            deployments: state.deployments,
            history: state.history,
            exportedAt: Date.now(),
        }, null, 2);
    }, [state]);
    const importLibrary = React.useCallback((json) => {
        try {
            // Validate JSON size to prevent DoS
            if (json.length > 10_000_000) {
                return false;
            }
            const data = JSON.parse(json);
            // Validate required structure
            if (!data.templates || !Array.isArray(data.templates)) {
                return false;
            }
            // Validate template count limit
            if (data.templates.length > 1000) {
                return false;
            }
            // Validate ID format (alphanumeric, dashes, underscores only)
            const isValidId = (id) => typeof id === 'string' && /^[\w-]+$/.test(id) && id.length <= 128;
            // Validate each template has required fields with proper types
            const isValidTemplate = (t) => {
                if (!t || typeof t !== 'object')
                    return false;
                const template = t;
                return (typeof template.id === 'string' &&
                    isValidId(template.id) &&
                    typeof template.name === 'string' &&
                    template.name.length <= 256 &&
                    typeof template.template === 'string' &&
                    template.template.length <= 100_000 &&
                    (template.description === undefined ||
                        typeof template.description === 'string') &&
                    (template.tags === undefined ||
                        (Array.isArray(template.tags) &&
                            template.tags.every((tag) => typeof tag === 'string' && tag.length <= 64))));
            };
            if (!data.templates.every(isValidTemplate)) {
                return false;
            }
            // Validate versions structure if present
            if (data.versions) {
                if (typeof data.versions !== 'object' || data.versions === null) {
                    return false;
                }
                // Validate each version entry
                const isValidVersion = (v) => {
                    if (!v || typeof v !== 'object')
                        return false;
                    const version = v;
                    return (typeof version.id === 'string' &&
                        isValidId(version.id) &&
                        typeof version.templateId === 'string' &&
                        isValidId(version.templateId) &&
                        typeof version.version === 'string' &&
                        /^\d+\.\d+\.\d+$/.test(version.version) &&
                        typeof version.template === 'string' &&
                        version.template.length <= 100_000 &&
                        typeof version.createdAt === 'number' &&
                        version.createdAt > 0 &&
                        version.createdAt <= Date.now() + 86400000 // Allow 1 day future tolerance
                    );
                };
                for (const [templateId, versions] of Object.entries(data.versions)) {
                    if (!isValidId(templateId))
                        return false;
                    if (!Array.isArray(versions))
                        return false;
                    if (!versions.every(isValidVersion))
                        return false;
                }
            }
            // Validate deployments structure if present
            if (data.deployments) {
                const validEnvs = ['development', 'staging', 'production'];
                const deploymentKeys = Object.keys(data.deployments);
                if (!deploymentKeys.every((key) => validEnvs.includes(key))) {
                    return false;
                }
                // Validate each deployment entry
                const isValidDeployment = (d) => {
                    if (!d || typeof d !== 'object')
                        return false;
                    const deployment = d;
                    return (typeof deployment.id === 'string' &&
                        isValidId(deployment.id) &&
                        typeof deployment.templateId === 'string' &&
                        isValidId(deployment.templateId) &&
                        typeof deployment.versionId === 'string' &&
                        isValidId(deployment.versionId) &&
                        typeof deployment.environment === 'string' &&
                        validEnvs.includes(deployment.environment));
                };
                for (const env of validEnvs) {
                    const envDeployments = data.deployments[env];
                    if (envDeployments !== undefined) {
                        if (!Array.isArray(envDeployments))
                            return false;
                        if (!envDeployments.every(isValidDeployment))
                            return false;
                    }
                }
            }
            // Validate history if present
            if (data.history !== undefined) {
                if (!Array.isArray(data.history))
                    return false;
                if (data.history.length > 10000)
                    return false;
            }
            setState((prev) => ({
                ...prev,
                templates: data.templates,
                versions: data.versions || prev.versions,
                deployments: data.deployments || prev.deployments,
                history: data.history || prev.history,
            }));
            addHistoryEntry({
                templateId: 'library',
                changeType: 'updated',
                description: 'Imported library from file',
            });
            return true;
        }
        catch {
            return false;
        }
    }, [addHistoryEntry]);
    // Reset
    const reset = React.useCallback(() => {
        setState({
            templates: initialTemplates,
            versions: {},
            deployments: {
                development: [],
                staging: [],
                production: [],
            },
            abTests: [],
            analytics: {},
            history: [],
            isLoading: false,
            error: undefined,
        });
    }, [initialTemplates]);
    return {
        state,
        templates: templateOps,
        versions: versionOps,
        deployments: deploymentOps,
        history: historyOps,
        export: exportLibrary,
        import: importLibrary,
        reset,
    };
}
export default usePromptLibrary;
//# sourceMappingURL=use-prompt-library.js.map