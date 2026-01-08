'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, } from '@clarity-chat/primitives';
import { ExperimentCard } from './experiment-card';
/**
 * List of experiment cards with selection support.
 *
 * @example
 * ```tsx
 * <ExperimentList
 *   experiments={experiments.map(exp => ({
 *     experimentId: exp.experimentId,
 *     experimentName: exp.experimentName,
 *     description: exp.description,
 *     status: exp.status,
 *     variantCount: exp.variants.length,
 *     hasWinner: !!exp.winner,
 *   }))}
 *   selectedId={selectedExperiment?.experimentId}
 *   onSelect={handleSelectExperiment}
 * />
 * ```
 */
export function ExperimentList({ experiments, selectedId, onSelect, title = 'Experiments', emptyMessage = 'No experiments yet. Create your first A/B test to get started.', className, }) {
    return (_jsxs(Card, { className: className, children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-base", children: title }) }), _jsx(CardContent, { children: _jsxs("div", { className: "space-y-2", children: [experiments.map((experiment) => (_jsx(ExperimentCard, { id: experiment.experimentId, name: experiment.experimentName, description: experiment.description, status: experiment.status, variantCount: experiment.variantCount, hasWinner: experiment.hasWinner, isSelected: selectedId === experiment.experimentId, onSelect: () => onSelect?.(experiment) }, experiment.experimentId))), experiments.length === 0 && (_jsx("p", { className: "text-sm text-muted-foreground text-center py-8", children: emptyMessage }))] }) })] }));
}
ExperimentList.displayName = 'ExperimentList';
//# sourceMappingURL=experiment-list.js.map