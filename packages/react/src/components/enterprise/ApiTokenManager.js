import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import * as React from 'react';
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, CardDescription, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, cn, } from '@clarity-chat/primitives';
import { Skeleton } from '../ui/skeleton';
const statusBadge = {
    active: { label: 'Active', variant: 'success' },
    expired: { label: 'Expired', variant: 'warning' },
    revoked: { label: 'Revoked', variant: 'destructive' },
};
const CopyIcon = () => (_jsx("svg", { className: "h-4 w-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", "aria-hidden": "true", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" }) }));
const CheckIcon = () => (_jsx("svg", { className: "h-4 w-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", "aria-hidden": "true", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }));
const TableSkeleton = () => (_jsx("tbody", { children: [1, 2, 3].map((i) => (_jsxs("tr", { className: "border-t border-border/40", children: [_jsx("td", { className: "px-2 py-3", children: _jsx(Skeleton, { width: 120, height: 16 }) }), _jsx("td", { className: "px-2 py-3", children: _jsxs("div", { className: "flex gap-1", children: [_jsx(Skeleton, { width: 60, height: 20 }), _jsx(Skeleton, { width: 60, height: 20 })] }) }), _jsx("td", { className: "px-2 py-3", children: _jsx(Skeleton, { width: 80, height: 16 }) }), _jsx("td", { className: "px-2 py-3", children: _jsx(Skeleton, { width: 80, height: 16 }) }), _jsx("td", { className: "px-2 py-3", children: _jsx(Skeleton, { width: 60, height: 20 }) }), _jsx("td", { className: "px-2 py-3", children: _jsxs("div", { className: "flex gap-2", children: [_jsx(Skeleton, { width: 80, height: 32 }), _jsx(Skeleton, { width: 60, height: 32 })] }) })] }, i))) }));
export const ApiTokenManager = ({ tokens, onCreate, onRegenerate, onRevoke, onCopy, isLoading = false, isProcessing = false, title = 'API access tokens', description = 'Rotate tokens regularly to maintain compliance and revoke unused credentials.', className, }) => {
    const [copiedTokenId, setCopiedTokenId] = React.useState(null);
    const [revokeToken, setRevokeToken] = React.useState(null);
    const [regenerateToken, setRegenerateToken] = React.useState(null);
    const handleCopy = React.useCallback(async (token) => {
        const textToCopy = token.token || token.maskedToken;
        if (!textToCopy)
            return;
        try {
            await navigator.clipboard.writeText(textToCopy);
            setCopiedTokenId(token.id);
            onCopy?.(token);
            setTimeout(() => setCopiedTokenId(null), 2000);
        }
        catch (err) {
            console.error('Failed to copy token:', err);
        }
    }, [onCopy]);
    const handleRevoke = (token) => {
        setRevokeToken(token);
    };
    const handleRegenerate = (token) => {
        setRegenerateToken(token);
    };
    const confirmRevoke = () => {
        if (revokeToken) {
            onRevoke?.(revokeToken);
            setRevokeToken(null);
        }
    };
    const confirmRegenerate = () => {
        if (regenerateToken) {
            onRegenerate?.(regenerateToken);
            setRegenerateToken(null);
        }
    };
    // Calculate stats
    const activeCount = tokens.filter((t) => t.status === 'active').length;
    const expiredCount = tokens.filter((t) => t.status === 'expired').length;
    return (_jsxs(_Fragment, { children: [_jsxs(Card, { className: cn('border-border/60 bg-[hsl(var(--surface-elevated))] shadow-sm', className), "aria-busy": isLoading || isProcessing, children: [_jsxs(CardHeader, { className: "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between", children: [_jsxs("div", { className: "space-y-1.5", children: [_jsx(CardTitle, { className: "text-lg font-semibold text-foreground", children: title }), _jsx(CardDescription, { className: "text-sm text-muted-foreground/80", children: description }), !isLoading && tokens.length > 0 && (_jsxs("div", { className: "flex items-center gap-2 pt-1", children: [_jsxs(Badge, { variant: "outline", className: "text-xs", children: [activeCount, " active"] }), expiredCount > 0 && (_jsxs(Badge, { variant: "warning", className: "text-xs", children: [expiredCount, " expired"] }))] }))] }), _jsx(Button, { variant: "surface", onClick: onCreate, disabled: isProcessing, children: "Generate new token" })] }), _jsx(CardContent, { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-[720px] w-full text-sm", role: "table", "aria-label": "API access tokens", children: [_jsx("thead", { className: "text-left text-xs uppercase tracking-wide text-muted-foreground/70", children: _jsxs("tr", { children: [_jsx("th", { scope: "col", className: "py-2 px-2", children: "Label" }), _jsx("th", { scope: "col", className: "py-2 px-2", children: "Scopes" }), _jsx("th", { scope: "col", className: "py-2 px-2", children: "Created" }), _jsx("th", { scope: "col", className: "py-2 px-2", children: "Last used" }), _jsx("th", { scope: "col", className: "py-2 px-2", children: "Status" }), _jsx("th", { scope: "col", className: "py-2 px-2", children: "Actions" })] }) }), isLoading ? (_jsx(TableSkeleton, {})) : (_jsxs("tbody", { children: [tokens.map((token) => {
                                            const status = statusBadge[token.status];
                                            const isCopied = copiedTokenId === token.id;
                                            const isExpiringSoon = token.expiresAt &&
                                                new Date(token.expiresAt) <=
                                                    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
                                            return (_jsxs("tr", { className: cn('border-t border-border/40 align-top transition-colors', token.status === 'expired' && 'bg-warning/5', token.status === 'revoked' && 'opacity-60'), "data-status": token.status, children: [_jsx("td", { className: "px-2 py-3", children: _jsxs("div", { className: "space-y-1", children: [_jsx("span", { className: "font-medium text-foreground", children: token.label }), (token.token || token.maskedToken) && (_jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx("code", { className: "rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground", children: token.maskedToken ||
                                                                                `${token.token?.slice(0, 8)}...` }), token.token && (_jsx(Button, { variant: "ghost", size: "sm", className: "h-6 w-6 p-0", onClick: () => handleCopy(token), "aria-label": isCopied ? 'Copied!' : 'Copy token', children: isCopied ? _jsx(CheckIcon, {}) : _jsx(CopyIcon, {}) }))] }))] }) }), _jsx("td", { className: "px-2 py-3 text-xs text-muted-foreground/70", children: _jsxs("div", { className: "flex flex-wrap gap-1", children: [token.scopes.map((scope) => (_jsx(Badge, { variant: "outline", className: "text-[11px]", children: scope }, scope))), token.scopes.length === 0 && (_jsx("span", { className: "text-muted-foreground/50", children: "No scopes" }))] }) }), _jsxs("td", { className: "px-2 py-3 text-xs text-muted-foreground/70 tabular-nums", children: [token.createdAt, token.expiresAt && (_jsxs("div", { className: cn('mt-0.5 text-[11px]', isExpiringSoon
                                                                    ? 'text-warning'
                                                                    : 'text-muted-foreground/50'), children: ["Expires: ", token.expiresAt] }))] }), _jsx("td", { className: "px-2 py-3 text-xs text-muted-foreground/70 tabular-nums", children: token.lastUsed ?? (_jsx("span", { className: "text-muted-foreground/50", children: "Never" })) }), _jsx("td", { className: "px-2 py-3", children: _jsx(Badge, { variant: status.variant, children: status.label }) }), _jsx("td", { className: "px-2 py-3", children: _jsxs("div", { className: "flex flex-wrap gap-2", children: [token.status === 'active' && (_jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleRegenerate(token), disabled: isProcessing, children: "Regenerate" })), token.status !== 'revoked' && (_jsx(Button, { variant: "ghost", size: "sm", className: "text-destructive hover:text-destructive", onClick: () => handleRevoke(token), disabled: isProcessing, children: "Revoke" }))] }) })] }, token.id));
                                        }), tokens.length === 0 && (_jsx("tr", { children: _jsx("td", { colSpan: 6, className: "px-2 py-12 text-center", children: _jsxs("div", { className: "flex flex-col items-center justify-center", children: [_jsx("div", { className: "mb-3 rounded-full bg-muted p-3", children: _jsx("svg", { className: "h-6 w-6 text-muted-foreground", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", "aria-hidden": "true", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" }) }) }), _jsx("p", { className: "text-sm font-medium text-foreground", children: "No API tokens" }), _jsx("p", { className: "mt-1 text-xs text-muted-foreground/70", children: "Generate your first API token to integrate with the platform." }), _jsx(Button, { variant: "surface", size: "sm", className: "mt-4", onClick: onCreate, children: "Generate token" })] }) }) }))] }))] }) })] }), _jsx(Dialog, { open: !!revokeToken, onOpenChange: () => setRevokeToken(null), children: _jsxs(DialogContent, { children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Revoke API token?" }), _jsxs(DialogDescription, { children: ["This will immediately revoke the token \"", revokeToken?.label, "\". Any applications using this token will no longer be able to authenticate. This action cannot be undone."] })] }), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "ghost", onClick: () => setRevokeToken(null), children: "Cancel" }), _jsx(Button, { variant: "destructive", onClick: confirmRevoke, children: "Revoke token" })] })] }) }), _jsx(Dialog, { open: !!regenerateToken, onOpenChange: () => setRegenerateToken(null), children: _jsxs(DialogContent, { children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Regenerate API token?" }), _jsxs(DialogDescription, { children: ["This will generate a new token for \"", regenerateToken?.label, "\" and invalidate the existing one. You'll need to update any applications using the current token. The new token will only be shown once."] })] }), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "ghost", onClick: () => setRegenerateToken(null), children: "Cancel" }), _jsx(Button, { onClick: confirmRegenerate, children: "Regenerate token" })] })] }) })] }));
};
ApiTokenManager.displayName = 'ApiTokenManager';
//# sourceMappingURL=ApiTokenManager.js.map