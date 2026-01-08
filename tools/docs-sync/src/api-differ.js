/**
 * API Diff Detection
 *
 * Compares extracted APIs between versions to detect changes
 */
const DEFAULT_DIFF_OPTIONS = {
    signatureChangesAreBreaking: true,
    propTypeChangesAreBreaking: true,
    removedOptionalPropsAreBreaking: false,
    ignoreInternal: true,
};
/** Create a unique key for an API */
function getAPIKey(api) {
    return `${api.exportedFrom}:${api.name}`;
}
/** Check if a prop change is breaking */
function isPropChangeBreaking(oldProp, newProp, options) {
    // Making an optional prop required is breaking
    if (!oldProp.required && newProp.required) {
        return true;
    }
    // Type changes can be breaking
    if (options.propTypeChangesAreBreaking && oldProp.type !== newProp.type) {
        return true;
    }
    return false;
}
/** Compare props between old and new API */
function comparePropChanges(oldAPI, newAPI, options) {
    const oldProps = oldAPI.props ?? [];
    const newProps = newAPI.props ?? [];
    const changes = [];
    let isBreaking = false;
    const oldPropsMap = new Map(oldProps.map((p) => [p.name, p]));
    const newPropsMap = new Map(newProps.map((p) => [p.name, p]));
    // Check for removed props
    for (const [name, oldProp] of oldPropsMap) {
        if (!newPropsMap.has(name)) {
            changes.push(`Removed prop: ${name}`);
            if (oldProp.required || options.removedOptionalPropsAreBreaking) {
                isBreaking = true;
            }
        }
    }
    // Check for added and modified props
    for (const [name, newProp] of newPropsMap) {
        const oldProp = oldPropsMap.get(name);
        if (!oldProp) {
            changes.push(`Added prop: ${name} (${newProp.type})`);
            if (newProp.required) {
                // Adding a required prop is breaking
                isBreaking = true;
            }
        }
        else {
            // Check for modifications
            if (oldProp.type !== newProp.type) {
                changes.push(`Changed prop type: ${name} (${oldProp.type} → ${newProp.type})`);
                if (isPropChangeBreaking(oldProp, newProp, options)) {
                    isBreaking = true;
                }
            }
            if (oldProp.required !== newProp.required) {
                const change = newProp.required ? 'now required' : 'now optional';
                changes.push(`Changed prop: ${name} is ${change}`);
                if (!oldProp.required && newProp.required) {
                    isBreaking = true;
                }
            }
        }
    }
    return { changes, isBreaking };
}
/** Compare parameters between old and new API */
function compareParameterChanges(oldAPI, newAPI, _options) {
    const oldParams = oldAPI.parameters ?? [];
    const newParams = newAPI.parameters ?? [];
    const changes = [];
    let isBreaking = false;
    // Check for added required parameters (breaking)
    for (let i = 0; i < Math.max(oldParams.length, newParams.length); i++) {
        const oldParam = oldParams[i];
        const newParam = newParams[i];
        if (!oldParam && newParam) {
            changes.push(`Added parameter: ${newParam.name}`);
            if (newParam.required && !newParam.default) {
                isBreaking = true;
            }
        }
        else if (oldParam && !newParam) {
            changes.push(`Removed parameter: ${oldParam.name}`);
            if (oldParam.required) {
                isBreaking = true;
            }
        }
        else if (oldParam && newParam) {
            if (oldParam.type !== newParam.type) {
                changes.push(`Changed parameter type: ${oldParam.name} (${oldParam.type} → ${newParam.type})`);
                isBreaking = true;
            }
            if (!oldParam.required && newParam.required && !newParam.default) {
                changes.push(`Parameter now required: ${newParam.name}`);
                isBreaking = true;
            }
        }
    }
    return { changes, isBreaking };
}
/** Compare two APIs and detect changes */
function compareAPIs(oldAPI, newAPI, options) {
    const changes = [];
    let isBreaking = false;
    // Check signature changes
    if (oldAPI.signature !== newAPI.signature) {
        changes.push('Signature changed');
        if (options.signatureChangesAreBreaking) {
            isBreaking = true;
        }
    }
    // Check kind changes (rare but possible with refactoring)
    if (oldAPI.kind !== newAPI.kind) {
        changes.push(`Kind changed: ${oldAPI.kind} → ${newAPI.kind}`);
        isBreaking = true;
    }
    // Check prop changes for components/interfaces
    if (oldAPI.props || newAPI.props) {
        const propChanges = comparePropChanges(oldAPI, newAPI, options);
        changes.push(...propChanges.changes);
        if (propChanges.isBreaking) {
            isBreaking = true;
        }
    }
    // Check parameter changes for functions/hooks
    if (oldAPI.parameters || newAPI.parameters) {
        const paramChanges = compareParameterChanges(oldAPI, newAPI, options);
        changes.push(...paramChanges.changes);
        if (paramChanges.isBreaking) {
            isBreaking = true;
        }
    }
    // Check return type changes
    if (oldAPI.returns?.type !== newAPI.returns?.type) {
        changes.push(`Return type changed: ${oldAPI.returns?.type ?? 'void'} → ${newAPI.returns?.type ?? 'void'}`);
        // Return type changes are typically breaking
        isBreaking = true;
    }
    if (changes.length === 0) {
        return null;
    }
    return {
        type: isBreaking ? 'breaking' : 'modified',
        name: newAPI.name,
        kind: newAPI.kind,
        packageName: newAPI.exportedFrom,
        description: changes.join('; '),
        before: oldAPI.signature,
        after: newAPI.signature,
        isBreaking,
    };
}
/** Compare two sets of APIs and generate a diff */
export function diffAPIs(oldAPIs, newAPIs, options = {}) {
    const opts = { ...DEFAULT_DIFF_OPTIONS, ...options };
    const oldMap = new Map();
    const newMap = new Map();
    // Build maps
    for (const api of oldAPIs) {
        if (opts.ignoreInternal && api.name.startsWith('_'))
            continue;
        oldMap.set(getAPIKey(api), api);
    }
    for (const api of newAPIs) {
        if (opts.ignoreInternal && api.name.startsWith('_'))
            continue;
        newMap.set(getAPIKey(api), api);
    }
    const added = [];
    const removed = [];
    const modified = [];
    const breaking = [];
    // Find added APIs
    for (const [key, api] of newMap) {
        if (!oldMap.has(key)) {
            const change = {
                type: 'added',
                name: api.name,
                kind: api.kind,
                packageName: api.exportedFrom,
                description: `New ${api.kind}: ${api.name}`,
                after: api.signature,
                isBreaking: false,
            };
            added.push(change);
        }
    }
    // Find removed APIs
    for (const [key, api] of oldMap) {
        if (!newMap.has(key)) {
            const change = {
                type: 'removed',
                name: api.name,
                kind: api.kind,
                packageName: api.exportedFrom,
                description: `Removed ${api.kind}: ${api.name}`,
                before: api.signature,
                isBreaking: true, // Removals are always breaking
            };
            removed.push(change);
            breaking.push(change);
        }
    }
    // Find modified APIs
    for (const [key, newAPI] of newMap) {
        const oldAPI = oldMap.get(key);
        if (oldAPI) {
            const change = compareAPIs(oldAPI, newAPI, opts);
            if (change) {
                modified.push(change);
                if (change.isBreaking) {
                    breaking.push(change);
                }
            }
        }
    }
    return {
        added,
        removed,
        modified,
        breaking,
        summary: {
            totalAdded: added.length,
            totalRemoved: removed.length,
            totalModified: modified.length,
            totalBreaking: breaking.length,
            hasBreakingChanges: breaking.length > 0,
        },
    };
}
/** Format diff result as text */
export function formatDiffAsText(result) {
    const lines = [];
    lines.push('═'.repeat(50));
    lines.push('API Diff Report');
    lines.push('═'.repeat(50));
    lines.push('');
    // Summary
    lines.push('Summary:');
    lines.push(`  Added: ${result.summary.totalAdded}`);
    lines.push(`  Removed: ${result.summary.totalRemoved}`);
    lines.push(`  Modified: ${result.summary.totalModified}`);
    lines.push(`  Breaking Changes: ${result.summary.totalBreaking}`);
    lines.push('');
    // Breaking changes (most important)
    if (result.breaking.length > 0) {
        lines.push('⚠️  BREAKING CHANGES:');
        for (const change of result.breaking) {
            lines.push(`  [${change.kind}] ${change.packageName}:${change.name}`);
            lines.push(`    ${change.description}`);
        }
        lines.push('');
    }
    // Added
    if (result.added.length > 0) {
        lines.push('✨ Added:');
        for (const change of result.added) {
            lines.push(`  [${change.kind}] ${change.packageName}:${change.name}`);
        }
        lines.push('');
    }
    // Removed
    if (result.removed.length > 0) {
        lines.push('🗑️  Removed:');
        for (const change of result.removed) {
            lines.push(`  [${change.kind}] ${change.packageName}:${change.name}`);
        }
        lines.push('');
    }
    // Modified (non-breaking only, since breaking are shown above)
    const nonBreakingModified = result.modified.filter((c) => !c.isBreaking);
    if (nonBreakingModified.length > 0) {
        lines.push('📝 Modified (non-breaking):');
        for (const change of nonBreakingModified) {
            lines.push(`  [${change.kind}] ${change.packageName}:${change.name}`);
            lines.push(`    ${change.description}`);
        }
        lines.push('');
    }
    lines.push('═'.repeat(50));
    return lines.join('\n');
}
/** Format diff result as JSON */
export function formatDiffAsJSON(result) {
    return JSON.stringify(result, null, 2);
}
/** Format diff for changelog */
export function formatDiffForChangelog(result) {
    const lines = [];
    if (result.breaking.length > 0) {
        lines.push('### ⚠️ Breaking Changes');
        lines.push('');
        for (const change of result.breaking) {
            lines.push(`- **${change.name}** (${change.kind}): ${change.description}`);
        }
        lines.push('');
    }
    if (result.added.length > 0) {
        lines.push('### ✨ New APIs');
        lines.push('');
        for (const change of result.added) {
            lines.push(`- \`${change.name}\` (${change.kind}) in ${change.packageName}`);
        }
        lines.push('');
    }
    if (result.removed.length > 0) {
        lines.push('### 🗑️ Removed APIs');
        lines.push('');
        for (const change of result.removed) {
            lines.push(`- \`${change.name}\` (${change.kind}) from ${change.packageName}`);
        }
        lines.push('');
    }
    const nonBreakingModified = result.modified.filter((c) => !c.isBreaking);
    if (nonBreakingModified.length > 0) {
        lines.push('### 📝 Modified APIs');
        lines.push('');
        for (const change of nonBreakingModified) {
            lines.push(`- \`${change.name}\`: ${change.description}`);
        }
        lines.push('');
    }
    return lines.join('\n');
}
//# sourceMappingURL=api-differ.js.map