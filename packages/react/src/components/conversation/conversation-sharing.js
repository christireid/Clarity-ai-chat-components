'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { logger } from '@clarity-chat/utils/logger';
import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, cn, } from '@clarity-chat/primitives';
/**
 * Generate share link
 */
function generateShareLink(config) {
    const baseUrl = config.customDomain || window.location.origin;
    return `${baseUrl}/share/${config.id}`;
}
/**
 * Generate QR code data URL
 */
function generateQRCode(text) {
    // Simple QR code generation (in production, use a library like qrcode)
    // For now, return a placeholder SVG
    const svg = `
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="white"/>
      <text x="100" y="100" text-anchor="middle" font-size="12" fill="black">
        QR Code for: ${text.substring(0, 20)}...
      </text>
    </svg>
  `;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
}
/**
 * Calculate expiration timestamp
 */
function calculateExpiration(expiration, customDate) {
    const now = Date.now();
    switch (expiration) {
        case 'never':
            return undefined;
        case '1hour':
            return now + 60 * 60 * 1000;
        case '24hours':
            return now + 24 * 60 * 60 * 1000;
        case '7days':
            return now + 7 * 24 * 60 * 60 * 1000;
        case '30days':
            return now + 30 * 24 * 60 * 60 * 1000;
        case 'custom':
            return customDate;
        default:
            return undefined;
    }
}
/**
 * ConversationSharing Component
 *
 * Share conversations with configurable permissions:
 * - Public/private/password-protected links
 * - Expiring shares
 * - View limits
 * - Analytics tracking
 * - QR code generation
 * - Social sharing
 */
export function ConversationSharing({ messages, conversationId, existingShares = [], defaultVisibility = 'private', enableQRCode = true, enableSocialSharing = true, onShareCreated, onLinkCopied, onShareRevoked, className, }) {
    const [shares, setShares] = React.useState(existingShares);
    const [isCreating, setIsCreating] = React.useState(false);
    const [selectedShare, setSelectedShare] = React.useState(null);
    // New share configuration
    const [visibility, setVisibility] = React.useState(defaultVisibility);
    const [expiration, setExpiration] = React.useState('7days');
    const [password, setPassword] = React.useState('');
    const [maxViews, setMaxViews] = React.useState();
    const [allowComments, setAllowComments] = React.useState(true);
    const [allowDownload, setAllowDownload] = React.useState(true);
    const [showMetadata, setShowMetadata] = React.useState(true);
    const createShareLink = () => {
        const config = {
            id: `share-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            conversationId,
            visibility,
            expiration,
            expiresAt: calculateExpiration(expiration),
            password: visibility === 'password-protected' ? password : undefined,
            maxViews,
            allowComments,
            allowDownload,
            showMetadata,
            trackAnalytics: true,
        };
        setShares((prev) => [...prev, config]);
        onShareCreated?.(config);
        setIsCreating(false);
        // Reset form
        setPassword('');
        setMaxViews(undefined);
    };
    const copyToClipboard = async (config) => {
        const link = generateShareLink(config);
        try {
            await navigator.clipboard.writeText(link);
            onLinkCopied?.(link);
        }
        catch (error) {
            logger.error('Failed to copy link:', error);
        }
    };
    const revokeShare = (shareId) => {
        setShares((prev) => prev.filter((s) => s.id !== shareId));
        onShareRevoked?.(shareId);
        if (selectedShare?.id === shareId) {
            setSelectedShare(null);
        }
    };
    const shareToSocial = (platform, link) => {
        const urls = {
            twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(link)}&text=${encodeURIComponent('Check out this conversation')}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(link)}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`,
            email: `mailto:?subject=${encodeURIComponent('Shared Conversation')}&body=${encodeURIComponent(`Check out this conversation: ${link}`)}`,
        };
        if (urls[platform]) {
            window.open(urls[platform], '_blank', 'width=600,height=400');
        }
    };
    const getVisibilityIcon = (vis) => {
        switch (vis) {
            case 'public':
                return '🌐';
            case 'private':
                return '🔒';
            case 'password-protected':
                return '🔐';
            case 'team-only':
                return '👥';
            default:
                return '🔗';
        }
    };
    const getExpirationLabel = (exp, expiresAt) => {
        if (exp === 'never')
            return 'Never expires';
        if (expiresAt) {
            const remaining = expiresAt - Date.now();
            if (remaining < 0)
                return 'Expired';
            const hours = Math.floor(remaining / (60 * 60 * 1000));
            const days = Math.floor(hours / 24);
            if (days > 0)
                return `Expires in ${days}d`;
            if (hours > 0)
                return `Expires in ${hours}h`;
            return 'Expires soon';
        }
        return 'Custom expiration';
    };
    return (_jsxs("div", { className: cn('space-y-4', className), children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsx(CardTitle, { children: "Share Conversation" }), _jsx(Button, { onClick: () => setIsCreating(!isCreating), size: "sm", children: isCreating ? 'Cancel' : '+ Create Share Link' })] }) }), isCreating && (_jsxs(CardContent, { className: "space-y-4 border-t pt-4", children: [_jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium mb-2 block", children: "Visibility" }), _jsx("div", { className: "grid grid-cols-2 gap-2", children: [
                                            'public',
                                            'private',
                                            'password-protected',
                                            'team-only',
                                        ].map((vis) => (_jsxs(Button, { variant: visibility === vis ? 'default' : 'outline', size: "sm", onClick: () => setVisibility(vis), className: "justify-start", children: [_jsx("span", { className: "mr-2", children: getVisibilityIcon(vis) }), vis.replace('-', ' ')] }, vis))) })] }), visibility === 'password-protected' && (_jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium mb-2 block", children: "Password" }), _jsx("input", { type: "password", value: password, onChange: (e) => setPassword(e.target.value), placeholder: "Enter password", className: "w-full px-3 py-2 border rounded" })] })), _jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium mb-2 block", children: "Expiration" }), _jsx("div", { className: "grid grid-cols-3 gap-2", children: [
                                            'never',
                                            '1hour',
                                            '24hours',
                                            '7days',
                                            '30days',
                                        ].map((exp) => (_jsx(Button, { variant: expiration === exp ? 'default' : 'outline', size: "sm", onClick: () => setExpiration(exp), children: exp === 'never'
                                                ? 'Never'
                                                : exp.replace('hour', 'h').replace('days', 'd') }, exp))) })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium mb-2 block", children: "Max Views (optional)" }), _jsx("input", { type: "number", value: maxViews || '', onChange: (e) => setMaxViews(e.target.value ? parseInt(e.target.value, 10) : undefined), placeholder: "Unlimited", className: "w-full px-3 py-2 border rounded" })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("label", { className: "flex items-center gap-2 text-sm", children: [_jsx("input", { type: "checkbox", checked: allowComments, onChange: (e) => setAllowComments(e.target.checked) }), "Allow comments"] }), _jsxs("label", { className: "flex items-center gap-2 text-sm", children: [_jsx("input", { type: "checkbox", checked: allowDownload, onChange: (e) => setAllowDownload(e.target.checked) }), "Allow download"] }), _jsxs("label", { className: "flex items-center gap-2 text-sm", children: [_jsx("input", { type: "checkbox", checked: showMetadata, onChange: (e) => setShowMetadata(e.target.checked) }), "Show metadata"] })] }), _jsx(Button, { onClick: createShareLink, className: "w-full", children: "Create Share Link" })] }))] }), shares.length > 0 && (_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { children: ["Active Share Links (", shares.length, ")"] }) }), _jsx(CardContent, { className: "space-y-3", children: shares.map((share) => {
                            const link = generateShareLink(share);
                            const isExpired = share.expiresAt && share.expiresAt < Date.now();
                            return (_jsxs("div", { className: cn('p-3 border rounded-lg space-y-2', isExpired && 'opacity-50'), children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-xl", children: getVisibilityIcon(share.visibility) }), _jsxs("div", { children: [_jsx("div", { className: "text-sm font-medium", children: share.visibility.replace('-', ' ') }), _jsx("div", { className: "text-xs text-muted-foreground", children: getExpirationLabel(share.expiration, share.expiresAt) })] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [isExpired && _jsx(Badge, { variant: "secondary", children: "Expired" }), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => setSelectedShare(selectedShare?.id === share.id ? null : share), children: selectedShare?.id === share.id ? 'Hide' : 'Details' })] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { type: "text", value: link, readOnly: true, className: "flex-1 px-3 py-1.5 text-sm border rounded bg-muted" }), _jsx(Button, { size: "sm", onClick: () => copyToClipboard(share), children: "\uD83D\uDCCB Copy" })] }), selectedShare?.id === share.id && (_jsxs("div", { className: "pt-2 border-t space-y-3", children: [_jsxs("div", { children: [_jsx("div", { className: "text-xs font-medium mb-1", children: "Permissions" }), _jsxs("div", { className: "flex gap-2", children: [share.allowComments && (_jsx(Badge, { variant: "outline", children: "Comments" })), share.allowDownload && (_jsx(Badge, { variant: "outline", children: "Download" })), share.showMetadata && (_jsx(Badge, { variant: "outline", children: "Metadata" })), share.maxViews && (_jsxs(Badge, { variant: "outline", children: [share.maxViews, " max views"] }))] })] }), enableQRCode && (_jsxs("div", { children: [_jsx("div", { className: "text-xs font-medium mb-2", children: "QR Code" }), _jsx("img", { src: generateQRCode(link), alt: "QR Code", className: "w-32 h-32 border rounded" })] })), enableSocialSharing && (_jsxs("div", { children: [_jsx("div", { className: "text-xs font-medium mb-2", children: "Share to" }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { variant: "outline", size: "sm", onClick: () => shareToSocial('twitter', link), children: "Twitter" }), _jsx(Button, { variant: "outline", size: "sm", onClick: () => shareToSocial('linkedin', link), children: "LinkedIn" }), _jsx(Button, { variant: "outline", size: "sm", onClick: () => shareToSocial('facebook', link), children: "Facebook" }), _jsx(Button, { variant: "outline", size: "sm", onClick: () => shareToSocial('email', link), children: "Email" })] })] })), _jsx("div", { className: "flex gap-2 pt-2", children: _jsx(Button, { variant: "destructive", size: "sm", onClick: () => revokeShare(share.id), children: "Revoke Share" }) })] }))] }, share.id));
                        }) })] })), shares.length === 0 && !isCreating && (_jsx(Card, { children: _jsxs(CardContent, { className: "text-center py-8", children: [_jsx("div", { className: "text-4xl mb-2", children: "\uD83D\uDD17" }), _jsx("div", { className: "text-sm text-muted-foreground mb-4", children: "No active share links. Create one to share this conversation." }), _jsx(Button, { onClick: () => setIsCreating(true), children: "Create Share Link" })] }) }))] }));
}
/**
 * Hook for managing conversation sharing
 */
export function useConversationSharing(conversationId) {
    const [shares, setShares] = React.useState(new Map());
    const [analytics, setAnalytics] = React.useState(new Map());
    const createShare = React.useCallback((config) => {
        const shareConfig = {
            ...config,
            id: `share-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            conversationId,
        };
        setShares((prev) => new Map(prev).set(shareConfig.id, shareConfig));
        // Initialize analytics
        setAnalytics((prev) => new Map(prev).set(shareConfig.id, {
            shareId: shareConfig.id,
            views: 0,
            uniqueVisitors: 0,
            avgTimeOnPage: 0,
            referrers: new Map(),
            devices: new Map(),
            locations: new Map(),
            timeline: [],
        }));
        return shareConfig;
    }, [conversationId]);
    const revokeShare = React.useCallback((shareId) => {
        setShares((prev) => {
            const newShares = new Map(prev);
            newShares.delete(shareId);
            return newShares;
        });
    }, []);
    const trackView = React.useCallback((shareId, metadata) => {
        setAnalytics((prev) => {
            const newAnalytics = new Map(prev);
            const current = newAnalytics.get(shareId);
            if (current) {
                newAnalytics.set(shareId, {
                    ...current,
                    views: current.views + 1,
                    timeline: [
                        ...current.timeline,
                        {
                            timestamp: Date.now(),
                            event: 'view',
                            metadata,
                        },
                    ],
                });
            }
            return newAnalytics;
        });
    }, []);
    const getShareAnalytics = React.useCallback((shareId) => {
        return analytics.get(shareId);
    }, [analytics]);
    const isShareValid = React.useCallback((shareId) => {
        const share = shares.get(shareId);
        if (!share)
            return false;
        // Check expiration
        if (share.expiresAt && share.expiresAt < Date.now()) {
            return false;
        }
        // Check max views
        if (share.maxViews) {
            const stats = analytics.get(shareId);
            if (stats && stats.views >= share.maxViews) {
                return false;
            }
        }
        return true;
    }, [shares, analytics]);
    return {
        shares: Array.from(shares.values()),
        createShare,
        revokeShare,
        trackView,
        getShareAnalytics,
        isShareValid,
    };
}
/**
 * ShareAnalyticsDashboard Component
 *
 * Display analytics for shared conversations
 */
export function ShareAnalyticsDashboard({ shareId, analytics, shareConfig, className, }) {
    const topReferrers = React.useMemo(() => {
        return Array.from(analytics.referrers.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);
    }, [analytics.referrers]);
    const topDevices = React.useMemo(() => {
        return Array.from(analytics.devices.entries()).sort((a, b) => b[1] - a[1]);
    }, [analytics.devices]);
    return (_jsx("div", { className: cn('space-y-4', className), children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Share Analytics" }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-3 gap-4", children: [_jsxs("div", { children: [_jsx("div", { className: "text-2xl font-bold", children: analytics.views }), _jsx("div", { className: "text-xs text-muted-foreground", children: "Total Views" })] }), _jsxs("div", { children: [_jsx("div", { className: "text-2xl font-bold", children: analytics.uniqueVisitors }), _jsx("div", { className: "text-xs text-muted-foreground", children: "Unique Visitors" })] }), _jsxs("div", { children: [_jsxs("div", { className: "text-2xl font-bold", children: [Math.round(analytics.avgTimeOnPage / 1000), "s"] }), _jsx("div", { className: "text-xs text-muted-foreground", children: "Avg. Time" })] })] }), shareConfig.maxViews && (_jsxs("div", { children: [_jsxs("div", { className: "flex justify-between text-xs mb-1", children: [_jsx("span", { children: "View Limit" }), _jsxs("span", { children: [analytics.views, " / ", shareConfig.maxViews] })] }), _jsx("div", { className: "h-2 bg-accent rounded-full overflow-hidden", children: _jsx("div", { className: "h-full bg-primary", style: {
                                            width: `${(analytics.views / shareConfig.maxViews) * 100}%`,
                                        } }) })] })), topReferrers.length > 0 && (_jsxs("div", { children: [_jsx("div", { className: "text-sm font-medium mb-2", children: "Top Referrers" }), _jsx("div", { className: "space-y-1", children: topReferrers.map(([referrer, count]) => (_jsxs("div", { className: "flex justify-between text-xs", children: [_jsx("span", { className: "truncate", children: referrer }), _jsxs("span", { className: "text-muted-foreground", children: [count, " views"] })] }, referrer))) })] })), topDevices.length > 0 && (_jsxs("div", { children: [_jsx("div", { className: "text-sm font-medium mb-2", children: "Devices" }), _jsx("div", { className: "flex gap-2", children: topDevices.map(([device, count]) => (_jsxs(Badge, { variant: "outline", children: [device, ": ", count] }, device))) })] })), analytics.timeline.length > 0 && (_jsxs("div", { children: [_jsx("div", { className: "text-sm font-medium mb-2", children: "Recent Activity" }), _jsx("div", { className: "space-y-1 max-h-32 overflow-y-auto", children: analytics.timeline
                                        .slice(-10)
                                        .reverse()
                                        .map((event, idx) => (_jsxs("div", { className: "text-xs flex justify-between", children: [_jsx("span", { children: event.event }), _jsx("span", { className: "text-muted-foreground", children: new Date(event.timestamp).toLocaleString() })] }, idx))) })] }))] })] }) }));
}
//# sourceMappingURL=conversation-sharing.js.map