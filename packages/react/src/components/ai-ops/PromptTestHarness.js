import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { Badge, Button, Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription, cn, } from '@clarity-chat/primitives';
import { SkeletonText } from '../skeleton';
const statusVariant = {
    pending: { label: 'Pending', variant: 'info' },
    running: { label: 'Running', variant: 'info' },
    pass: { label: 'Pass', variant: 'success' },
    fail: { label: 'Fail', variant: 'destructive' },
};
export const PromptTestHarness = ({ datasetName, datasets = [], variants, tests, onRunAll, onRunVariant, onSelectDataset, isRunning = false, className, }) => {
    const [selectedVariant, setSelectedVariant] = React.useState(() => variants[0]?.id);
    const [selectedDataset, setSelectedDataset] = React.useState(() => datasets[0]?.id);
    React.useEffect(() => {
        if (datasets.length > 0 && !selectedDataset) {
            setSelectedDataset(datasets[0].id);
        }
    }, [datasets, selectedDataset]);
    const handleDatasetChange = (value) => {
        setSelectedDataset(value);
        onSelectDataset?.(value);
    };
    const handleVariantChange = (value) => {
        setSelectedVariant(value);
        onRunVariant?.(value);
    };
    return (_jsxs(Card, { className: cn('border-border/60 bg-[hsl(var(--surface-elevated))] shadow-[0_22px_48px_rgba(15,23,42,0.16)]', className), children: [_jsxs(CardHeader, { className: "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(CardTitle, { className: "text-lg font-semibold text-foreground", children: "Prompt regression harness" }), _jsx(CardDescription, { className: "text-sm text-muted-foreground/80", children: "Compare prompt variants across curated datasets before shipping changes." }), datasetName && (_jsxs(Badge, { variant: "outline", className: "text-[11px]", children: ["Dataset \u2022 ", datasetName] }))] }), _jsxs("div", { className: "flex flex-col gap-3 sm:items-end", children: [datasets.length > 0 && (_jsx("select", { value: selectedDataset ?? '', onChange: (event) => handleDatasetChange(event.target.value), className: "min-w-[200px] rounded-lg border border-border/60 bg-background px-3 py-2 text-sm text-foreground shadow-[0_1px_2px_rgba(15,23,42,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40", children: datasets.map((ds) => (_jsx("option", { value: ds.id, children: ds.name }, ds.id))) })), _jsxs("div", { className: "flex flex-wrap gap-2", children: [_jsx(Button, { variant: "surface", size: "sm", onClick: onRunAll, disabled: isRunning, children: "Run all variants" }), _jsx("select", { value: selectedVariant ?? '', onChange: (event) => handleVariantChange(event.target.value), className: "min-w-[200px] rounded-lg border border-border/60 bg-background px-3 py-2 text-sm text-foreground shadow-[0_1px_2px_rgba(15,23,42,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40", children: variants.map((variant) => (_jsx("option", { value: variant.id, children: variant.label }, variant.id))) })] })] })] }), _jsx(CardContent, { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-[720px] text-sm", children: [_jsx("thead", { className: "text-left text-xs uppercase tracking-wide text-muted-foreground/70", children: _jsxs("tr", { children: [_jsx("th", { className: "w-[24px] py-2", children: "#" }), _jsx("th", { className: "py-2", children: "Input" }), _jsx("th", { className: "py-2", children: "Status" }), _jsx("th", { className: "py-2", children: "Output" }), _jsx("th", { className: "py-2", children: "Expected" }), _jsx("th", { className: "py-2", children: "Latency" }), _jsx("th", { className: "py-2", children: "Cost" })] }) }), _jsx("tbody", { children: tests.map((test, index) => {
                                const status = statusVariant[test.status];
                                return (_jsxs("tr", { "data-status": test.status, className: "align-top border-t border-border/40", children: [_jsx("td", { className: "px-2 py-3 font-medium text-muted-foreground/80", children: index + 1 }), _jsx("td", { className: "min-w-[180px] px-2 py-3 text-foreground", children: test.input }), _jsx("td", { className: "px-2 py-3", children: _jsx(Badge, { variant: status.variant, children: status.label }) }), _jsx("td", { className: "max-w-[220px] px-2 py-3", children: test.status === 'running' ? (_jsx(SkeletonText, { lines: 2 })) : (_jsx("pre", { className: "whitespace-pre-wrap text-xs text-muted-foreground/80", children: test.output || '—' })) }), _jsx("td", { className: "max-w-[220px] px-2 py-3", children: _jsx("pre", { className: "whitespace-pre-wrap text-xs text-muted-foreground/70", children: test.expected || '—' }) }), _jsx("td", { className: "px-2 py-3 text-xs text-muted-foreground/70", children: test.latencyMs ? `${test.latencyMs.toFixed(0)} ms` : '—' }), _jsx("td", { className: "px-2 py-3 text-xs text-muted-foreground/70", children: test.costUsd ? `$${test.costUsd.toFixed(4)}` : '—' })] }, test.id));
                            }) })] }) }), _jsxs(CardFooter, { className: "flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground/70", children: [_jsxs("span", { children: [tests.length, " test", tests.length === 1 ? '' : 's', " \u2022 ", variants.length, " variant", variants.length === 1 ? '' : 's'] }), isRunning && _jsx("span", { children: "Running\u2026 this may take a few minutes." })] })] }));
};
PromptTestHarness.displayName = 'PromptTestHarness';
//# sourceMappingURL=PromptTestHarness.js.map