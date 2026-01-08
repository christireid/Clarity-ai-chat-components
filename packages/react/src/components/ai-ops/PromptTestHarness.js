import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import * as React from 'react';
import { Badge, Button, Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription, cn, } from '@clarity-chat/primitives';
import { Skeleton, SkeletonText } from '../ui/skeleton';
const statusVariant = {
    pending: { label: 'Pending', variant: 'info' },
    running: { label: 'Running', variant: 'info' },
    pass: { label: 'Pass', variant: 'success' },
    fail: { label: 'Fail', variant: 'destructive' },
};
const TableSkeleton = () => (_jsx("tbody", { children: [1, 2, 3].map((i) => (_jsxs("tr", { className: "border-t border-border/40", children: [_jsx("td", { className: "px-2 py-3", children: _jsx(Skeleton, { width: 20, height: 16 }) }), _jsx("td", { className: "px-2 py-3", children: _jsx(Skeleton, { width: "80%", height: 16 }) }), _jsx("td", { className: "px-2 py-3", children: _jsx(Skeleton, { width: 60, height: 20 }) }), _jsx("td", { className: "px-2 py-3", children: _jsx(SkeletonText, { lines: 2 }) }), _jsx("td", { className: "px-2 py-3", children: _jsx(SkeletonText, { lines: 2 }) }), _jsx("td", { className: "px-2 py-3", children: _jsx(Skeleton, { width: 50, height: 16 }) }), _jsx("td", { className: "px-2 py-3", children: _jsx(Skeleton, { width: 60, height: 16 }) })] }, i))) }));
const EmptyState = ({ message }) => (_jsx("tbody", { children: _jsx("tr", { children: _jsx("td", { colSpan: 7, className: "px-2 py-12 text-center", children: _jsxs("div", { className: "flex flex-col items-center justify-center", children: [_jsx("div", { className: "mb-3 rounded-full bg-muted p-3", children: _jsx("svg", { className: "h-6 w-6 text-muted-foreground", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", "aria-hidden": "true", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" }) }) }), _jsx("p", { className: "text-sm text-muted-foreground", children: message })] }) }) }) }));
export const PromptTestHarness = ({ datasetName, datasets = [], variants, tests, onRunAll, onRunVariant, onSelectVariant, onSelectDataset, isRunning = false, isLoading = false, emptyMessage = 'No test cases available. Add test cases to your dataset to get started.', className, }) => {
    const [selectedVariant, setSelectedVariant] = React.useState(() => variants[0]?.id);
    const [selectedDataset, setSelectedDataset] = React.useState(() => datasets[0]?.id);
    // Sync with external variants changes
    React.useEffect(() => {
        if (variants.length > 0 &&
            !variants.find((v) => v.id === selectedVariant)) {
            setSelectedVariant(variants[0]?.id);
        }
    }, [variants, selectedVariant]);
    React.useEffect(() => {
        if (datasets.length > 0 && !selectedDataset && datasets[0]) {
            setSelectedDataset(datasets[0].id);
        }
    }, [datasets, selectedDataset]);
    const handleDatasetChange = (value) => {
        setSelectedDataset(value);
        onSelectDataset?.(value);
    };
    const handleVariantChange = (value) => {
        setSelectedVariant(value);
        onSelectVariant?.(value);
    };
    const handleRunSelectedVariant = () => {
        if (selectedVariant) {
            onRunVariant?.(selectedVariant);
        }
    };
    // Calculate test statistics
    const passCount = tests.filter((t) => t.status === 'pass').length;
    const failCount = tests.filter((t) => t.status === 'fail').length;
    const runningCount = tests.filter((t) => t.status === 'running').length;
    const progress = tests.length > 0 ? ((passCount + failCount) / tests.length) * 100 : 0;
    return (_jsxs(Card, { className: cn('border-border/60 bg-[hsl(var(--surface-elevated))] shadow-sm', className), "aria-busy": isLoading || isRunning, children: [_jsxs(CardHeader, { className: "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(CardTitle, { className: "text-lg font-semibold text-foreground", children: "Prompt regression harness" }), _jsx(CardDescription, { className: "text-sm text-muted-foreground/80", children: "Compare prompt variants across curated datasets before shipping changes." }), datasetName && (_jsxs(Badge, { variant: "outline", className: "text-[11px]", children: ["Dataset: ", datasetName] }))] }), _jsxs("div", { className: "flex flex-col gap-3 sm:items-end", children: [datasets.length > 0 && (_jsxs("div", { className: "flex flex-col gap-1", children: [_jsx("label", { htmlFor: "dataset-select", className: "text-xs font-medium text-muted-foreground", children: "Dataset" }), _jsx("select", { id: "dataset-select", value: selectedDataset ?? '', onChange: (event) => handleDatasetChange(event.target.value), disabled: isRunning, className: "min-w-[200px] rounded-lg border border-border/60 bg-background px-3 py-2 text-sm text-foreground shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-50", "aria-describedby": "dataset-description", children: datasets.map((ds) => (_jsx("option", { value: ds.id, children: ds.name }, ds.id))) }), _jsx("span", { id: "dataset-description", className: "sr-only", children: "Select a dataset to run tests against" })] })), _jsxs("div", { className: "flex flex-col gap-1", children: [_jsx("label", { htmlFor: "variant-select", className: "text-xs font-medium text-muted-foreground", children: "Variant" }), _jsxs("div", { className: "flex flex-wrap gap-2", children: [_jsx("select", { id: "variant-select", value: selectedVariant ?? '', onChange: (event) => handleVariantChange(event.target.value), disabled: isRunning, className: "min-w-[200px] rounded-lg border border-border/60 bg-background px-3 py-2 text-sm text-foreground shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-50", "aria-describedby": "variant-description", children: variants.map((variant) => (_jsx("option", { value: variant.id, children: variant.label }, variant.id))) }), _jsx("span", { id: "variant-description", className: "sr-only", children: "Select a prompt variant to test" }), _jsx(Button, { variant: "ghost", size: "sm", onClick: handleRunSelectedVariant, disabled: isRunning || !selectedVariant, "aria-label": `Run ${variants.find((v) => v.id === selectedVariant)?.label ?? 'selected'} variant`, children: "Run variant" }), _jsx(Button, { variant: "surface", size: "sm", onClick: onRunAll, disabled: isRunning, children: isRunning ? 'Running...' : 'Run all variants' })] })] })] })] }), isRunning && (_jsxs("div", { className: "px-6", children: [_jsxs("div", { className: "flex items-center justify-between text-xs text-muted-foreground/70", children: [_jsxs("span", { children: ["Running tests... ", passCount + failCount, "/", tests.length] }), _jsxs("span", { children: [Math.round(progress), "%"] })] }), _jsx("div", { role: "progressbar", "aria-label": "Test progress", "aria-valuemin": 0, "aria-valuemax": 100, "aria-valuenow": Math.round(progress), className: "mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted", children: _jsx("div", { className: "h-full rounded-full bg-primary transition-all duration-300", style: { width: `${progress}%` } }) })] })), _jsx(CardContent, { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-[720px] w-full text-sm", role: "table", "aria-label": "Prompt test results", children: [_jsx("thead", { className: "text-left text-xs uppercase tracking-wide text-muted-foreground/70", children: _jsxs("tr", { children: [_jsx("th", { scope: "col", className: "w-[48px] py-2 px-2", children: "#" }), _jsx("th", { scope: "col", className: "py-2 px-2", children: "Input" }), _jsx("th", { scope: "col", className: "py-2 px-2 w-[100px]", children: "Status" }), _jsx("th", { scope: "col", className: "py-2 px-2", children: "Output" }), _jsx("th", { scope: "col", className: "py-2 px-2", children: "Expected" }), _jsx("th", { scope: "col", className: "py-2 px-2 w-[80px]", children: "Latency" }), _jsx("th", { scope: "col", className: "py-2 px-2 w-[80px]", children: "Cost" })] }) }), isLoading ? (_jsx(TableSkeleton, {})) : tests.length === 0 ? (_jsx(EmptyState, { message: emptyMessage })) : (_jsx("tbody", { children: tests.map((test, index) => {
                                const status = statusVariant[test.status];
                                const isMatch = test.status === 'pass' ||
                                    (test.output &&
                                        test.expected &&
                                        test.output === test.expected);
                                return (_jsxs("tr", { "data-status": test.status, className: cn('align-top border-t border-border/40 transition-colors', test.status === 'fail' && 'bg-destructive/5'), children: [_jsx("td", { className: "px-2 py-3 font-medium text-muted-foreground/80", children: index + 1 }), _jsx("td", { className: "min-w-[180px] px-2 py-3 text-foreground", children: _jsx("p", { className: "line-clamp-3", children: test.input }) }), _jsx("td", { className: "px-2 py-3", children: _jsx(Badge, { variant: status.variant, className: cn(test.status === 'running' && 'animate-pulse'), children: status.label }) }), _jsx("td", { className: "max-w-[220px] px-2 py-3", children: test.status === 'running' ? (_jsx(SkeletonText, { lines: 2 })) : (_jsx("pre", { className: cn('whitespace-pre-wrap text-xs', isMatch
                                                    ? 'text-muted-foreground/80'
                                                    : 'text-foreground'), children: test.output || '—' })) }), _jsx("td", { className: "max-w-[220px] px-2 py-3", children: _jsx("pre", { className: "whitespace-pre-wrap text-xs text-muted-foreground/70", children: test.expected || '—' }) }), _jsx("td", { className: "px-2 py-3 text-xs text-muted-foreground/70 tabular-nums", children: test.latencyMs !== undefined
                                                ? `${test.latencyMs.toFixed(0)} ms`
                                                : '—' }), _jsx("td", { className: "px-2 py-3 text-xs text-muted-foreground/70 tabular-nums", children: test.costUsd !== undefined
                                                ? `$${test.costUsd.toFixed(4)}`
                                                : '—' })] }, test.id));
                            }) }))] }) }), _jsxs(CardFooter, { className: "flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground/70", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("span", { children: [tests.length, " test", tests.length === 1 ? '' : 's'] }), _jsx("span", { className: "text-border", children: "\u2022" }), _jsxs("span", { children: [variants.length, " variant", variants.length === 1 ? '' : 's'] }), (passCount > 0 || failCount > 0) && (_jsxs(_Fragment, { children: [_jsx("span", { className: "text-border", children: "\u2022" }), _jsxs("span", { className: "flex items-center gap-2", children: [passCount > 0 && (_jsxs("span", { className: "text-success", children: [passCount, " passed"] })), failCount > 0 && (_jsxs("span", { className: "text-destructive", children: [failCount, " failed"] }))] })] }))] }), runningCount > 0 && (_jsxs("span", { className: "flex items-center gap-2", "aria-live": "polite", children: [_jsx("span", { className: "inline-block h-2 w-2 animate-pulse rounded-full bg-primary" }), "Running ", runningCount, " test", runningCount === 1 ? '' : 's', "..."] }))] })] }));
};
PromptTestHarness.displayName = 'PromptTestHarness';
//# sourceMappingURL=PromptTestHarness.js.map