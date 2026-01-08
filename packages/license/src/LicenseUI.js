import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * License UI Components
 *
 * Visual components for license status display, expiry warnings,
 * and upgrade prompts.
 *
 * @packageDocumentation
 */
import * as React from 'react';
import { useLicenseStatus, useIsHydrated } from './hooks';
/**
 * A subtle loading skeleton shown during SSR hydration.
 * Used as default loading state for LicenseGate when no custom loading is provided.
 *
 * @example
 * ```tsx
 * <LicenseGate requiredPlan="pro" loading={<LicenseLoadingSkeleton />}>
 *   <ProFeature />
 * </LicenseGate>
 * ```
 */
export function LicenseLoadingSkeleton({ width = '100%', height = '1rem', className = '', animate = true, }) {
    const animationStyle = animate
        ? {
            animation: 'license-skeleton-pulse 1.5s ease-in-out infinite',
        }
        : {};
    return (_jsxs(_Fragment, { children: [_jsx("style", { children: `
          @keyframes license-skeleton-pulse {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 0.7; }
          }
        ` }), _jsx("div", { className: className, style: {
                    width: typeof width === 'number' ? `${width}px` : width,
                    height: typeof height === 'number' ? `${height}px` : height,
                    backgroundColor: 'rgba(156, 163, 175, 0.2)',
                    borderRadius: '4px',
                    ...animationStyle,
                }, role: "status", "aria-label": "Loading..." })] }));
}
LicenseLoadingSkeleton.displayName = 'LicenseLoadingSkeleton';
const STATUS_COLORS = {
    Valid: { bg: '#dcfce7', text: '#166534', border: '#86efac' },
    GracePeriod: { bg: '#fef9c3', text: '#854d0e', border: '#fde047' },
    Expired: { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5' },
    ExpiredForDevelopment: { bg: '#fef9c3', text: '#854d0e', border: '#fde047' },
    Missing: { bg: '#f3f4f6', text: '#4b5563', border: '#d1d5db' },
    Invalid: { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5' },
    PlanMismatch: { bg: '#fef9c3', text: '#854d0e', border: '#fde047' },
    OutOfScope: { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5' },
    Loading: { bg: '#f3f4f6', text: '#6b7280', border: '#d1d5db' },
};
const STATUS_LABELS = {
    Valid: 'Licensed',
    GracePeriod: 'Grace Period',
    Expired: 'Expired',
    ExpiredForDevelopment: 'Expired (Dev)',
    Missing: 'Unlicensed',
    Invalid: 'Invalid',
    PlanMismatch: 'Upgrade Required',
    OutOfScope: 'Out of Scope',
    Loading: 'Loading...',
};
const STATUS_ICONS = {
    Valid: '✓',
    GracePeriod: '⚠',
    Expired: '✗',
    ExpiredForDevelopment: '⚠',
    Missing: '○',
    Invalid: '✗',
    PlanMismatch: '↑',
    OutOfScope: '✗',
    Loading: '…',
};
/**
 * A small badge showing current license status.
 * Can be placed in settings panels, footers, or admin areas.
 *
 * @example
 * ```tsx
 * <LicenseStatusBadge
 *   variant="badge"
 *   onClick={() => navigate('/settings/license')}
 * />
 * ```
 */
export function LicenseStatusBadge({ size = 'md', variant = 'badge', onClick, className = '', showTooltip = true, }) {
    const isHydrated = useIsHydrated();
    const status = useLicenseStatus();
    const currentStatus = isHydrated ? status.status : 'Loading';
    const colors = STATUS_COLORS[currentStatus];
    const label = STATUS_LABELS[currentStatus];
    const icon = STATUS_ICONS[currentStatus];
    const sizes = {
        sm: { padding: '2px 6px', fontSize: '11px', iconSize: '10px' },
        md: { padding: '4px 10px', fontSize: '12px', iconSize: '12px' },
        lg: { padding: '6px 14px', fontSize: '14px', iconSize: '14px' },
    };
    const sizeStyles = sizes[size];
    const tooltipText = isHydrated
        ? status.payload
            ? `${status.payload.licensee} - ${status.payload.plan} plan`
            : (status.reason ?? label)
        : 'Checking license...';
    const baseStyles = {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        borderRadius: '9999px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontWeight: 500,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.15s ease',
        border: `1px solid ${colors.border}`,
        backgroundColor: colors.bg,
        color: colors.text,
        ...sizeStyles,
        padding: sizeStyles.padding,
        fontSize: sizeStyles.fontSize,
    };
    const content = (_jsxs(_Fragment, { children: [_jsx("span", { style: { fontSize: sizeStyles.iconSize }, children: icon }), variant !== 'icon' && _jsx("span", { children: label }), variant === 'full' && status.payload && (_jsxs("span", { style: { opacity: 0.7, fontSize: '0.9em' }, children: ["(", status.payload.plan, ")"] }))] }));
    return (_jsx("button", { type: "button", className: className, style: baseStyles, onClick: onClick, title: showTooltip ? tooltipText : undefined, "aria-label": `License status: ${label}`, children: content }));
}
LicenseStatusBadge.displayName = 'LicenseStatusBadge';
/**
 * A banner warning when the license is approaching expiration.
 * Helps users renew proactively before losing access.
 *
 * @example
 * ```tsx
 * <LicenseExpiryWarning
 *   daysThreshold={30}
 *   renewUrl="https://claritychat.dev/renew"
 *   onDismiss={() => console.log('dismissed')}
 * />
 * ```
 */
export function LicenseExpiryWarning({ daysThreshold = 30, renewUrl = 'https://claritychat.dev/pricing', onDismiss, onRenew, className = '', position = 'top', persistDismiss = true, }) {
    const status = useLicenseStatus();
    const [dismissed, setDismissed] = React.useState(false);
    // Check localStorage for persistent dismissal
    React.useEffect(() => {
        if (persistDismiss && typeof window !== 'undefined') {
            const key = 'clarity-license-expiry-dismissed';
            const dismissedUntil = localStorage.getItem(key);
            if (dismissedUntil) {
                const until = parseInt(dismissedUntil, 10);
                if (Date.now() < until) {
                    setDismissed(true);
                }
                else {
                    localStorage.removeItem(key);
                }
            }
        }
    }, [persistDismiss]);
    // Calculate days until expiry
    const daysUntilExpiry = React.useMemo(() => {
        if (!status.payload?.expiresAt)
            return null;
        const now = Math.floor(Date.now() / 1000);
        const diff = status.payload.expiresAt - now;
        return Math.ceil(diff / (24 * 60 * 60));
    }, [status.payload?.expiresAt]);
    // Don't show if dismissed, not licensed, or not within threshold
    if (dismissed)
        return null;
    if (status.status !== 'Valid' && status.status !== 'GracePeriod')
        return null;
    if (daysUntilExpiry === null || daysUntilExpiry > daysThreshold)
        return null;
    const handleDismiss = () => {
        setDismissed(true);
        if (persistDismiss && typeof window !== 'undefined') {
            // Dismiss for 7 days
            const dismissUntil = Date.now() + 7 * 24 * 60 * 60 * 1000;
            localStorage.setItem('clarity-license-expiry-dismissed', dismissUntil.toString());
        }
        onDismiss?.();
    };
    const handleRenew = () => {
        if (onRenew) {
            onRenew();
        }
        else if (renewUrl) {
            window.open(renewUrl, '_blank', 'noopener,noreferrer');
        }
    };
    const isExpired = daysUntilExpiry <= 0;
    const isUrgent = daysUntilExpiry <= 7;
    const positionStyles = {
        top: { position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999 },
        bottom: { position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9999 },
        inline: { position: 'relative' },
    };
    return (_jsxs("div", { className: className, style: {
            ...positionStyles[position],
            backgroundColor: isExpired
                ? '#fef2f2'
                : isUrgent
                    ? '#fffbeb'
                    : '#f0fdf4',
            borderBottom: position === 'top'
                ? `1px solid ${isExpired ? '#fecaca' : isUrgent ? '#fde68a' : '#bbf7d0'}`
                : undefined,
            borderTop: position === 'bottom'
                ? `1px solid ${isExpired ? '#fecaca' : isUrgent ? '#fde68a' : '#bbf7d0'}`
                : undefined,
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: '14px',
        }, role: "alert", children: [_jsx("span", { style: {
                    color: isExpired ? '#dc2626' : isUrgent ? '#d97706' : '#16a34a',
                }, children: isExpired
                    ? '⚠️ Your license has expired'
                    : `⏰ Your license expires in ${daysUntilExpiry} day${daysUntilExpiry === 1 ? '' : 's'}` }), _jsx("button", { type: "button", onClick: handleRenew, style: {
                    backgroundColor: isExpired
                        ? '#dc2626'
                        : isUrgent
                            ? '#d97706'
                            : '#16a34a',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer',
                }, children: "Renew Now" }), _jsx("button", { type: "button", onClick: handleDismiss, style: {
                    background: 'none',
                    border: 'none',
                    color: '#6b7280',
                    cursor: 'pointer',
                    padding: '4px',
                    fontSize: '18px',
                    lineHeight: 1,
                }, "aria-label": "Dismiss", children: "\u00D7" })] }));
}
LicenseExpiryWarning.displayName = 'LicenseExpiryWarning';
const PLAN_DISPLAY_NAMES = {
    community: 'Community',
    pro: 'Pro',
    enterprise: 'Enterprise',
};
const DEFAULT_BENEFITS = {
    community: ['Basic features', 'Community support'],
    pro: [
        'All Community features',
        'Advanced components',
        'Priority support',
        'Commercial license',
    ],
    enterprise: [
        'All Pro features',
        'SSO integration',
        'Custom branding',
        'Dedicated support',
        'SLA guarantees',
    ],
};
/**
 * A prompt shown when users try to access features above their plan level.
 * Converts unlicensed usage into upgrade opportunities.
 *
 * @example
 * ```tsx
 * <LicenseGate
 *   requiredPlan="pro"
 *   fallback={
 *     <LicenseUpgradePrompt
 *       requiredPlan="pro"
 *       featureName="Advanced Analytics"
 *       benefits={['Real-time insights', 'Custom dashboards']}
 *     />
 *   }
 * >
 *   <AdvancedAnalytics />
 * </LicenseGate>
 * ```
 */
export function LicenseUpgradePrompt({ currentPlan, requiredPlan, featureName = 'This feature', upgradeUrl = 'https://claritychat.dev/pricing', onUpgrade, className = '', variant = 'card', benefits, }) {
    const status = useLicenseStatus();
    const detectedPlan = currentPlan ?? status.payload?.plan ?? 'community';
    const displayBenefits = benefits ?? DEFAULT_BENEFITS[requiredPlan];
    const handleUpgrade = () => {
        if (onUpgrade) {
            onUpgrade();
        }
        else if (upgradeUrl) {
            window.open(upgradeUrl, '_blank', 'noopener,noreferrer');
        }
    };
    if (variant === 'minimal') {
        return (_jsxs("div", { className: className, style: {
                padding: '12px 16px',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                fontSize: '14px',
                color: '#475569',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
            }, children: [_jsxs("span", { children: [featureName, " requires", ' ', _jsx("strong", { children: PLAN_DISPLAY_NAMES[requiredPlan] })] }), _jsx("button", { type: "button", onClick: handleUpgrade, style: {
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '6px 12px',
                        fontSize: '13px',
                        fontWeight: 500,
                        cursor: 'pointer',
                    }, children: "Upgrade" })] }));
    }
    if (variant === 'inline') {
        return (_jsx("div", { className: className, style: {
                padding: '16px 20px',
                backgroundColor: '#eff6ff',
                border: '1px solid #bfdbfe',
                borderRadius: '8px',
                fontFamily: 'system-ui, -apple-system, sans-serif',
            }, children: _jsxs("div", { style: {
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                }, children: [_jsx("span", { style: { fontSize: '24px' }, children: "\uD83D\uDD12" }), _jsxs("div", { style: { flex: 1 }, children: [_jsxs("h4", { style: {
                                    margin: '0 0 4px 0',
                                    fontSize: '15px',
                                    fontWeight: 600,
                                    color: '#1e40af',
                                }, children: [PLAN_DISPLAY_NAMES[requiredPlan], " Feature"] }), _jsxs("p", { style: {
                                    margin: '0 0 12px 0',
                                    fontSize: '14px',
                                    color: '#3b82f6',
                                }, children: [featureName, " is available on the", ' ', PLAN_DISPLAY_NAMES[requiredPlan], " plan."] }), _jsxs("button", { type: "button", onClick: handleUpgrade, style: {
                                    backgroundColor: '#3b82f6',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    padding: '8px 16px',
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                }, children: ["Upgrade to ", PLAN_DISPLAY_NAMES[requiredPlan]] })] })] }) }));
    }
    // Card variant (default)
    return (_jsxs("div", { className: className, style: {
            maxWidth: '400px',
            margin: '0 auto',
            padding: '24px',
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            textAlign: 'center',
        }, children: [_jsx("div", { style: {
                    width: '64px',
                    height: '64px',
                    margin: '0 auto 16px',
                    backgroundColor: '#eff6ff',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '28px',
                }, children: "\uD83D\uDD10" }), _jsxs("h3", { style: {
                    margin: '0 0 8px 0',
                    fontSize: '18px',
                    fontWeight: 600,
                    color: '#111827',
                }, children: ["Upgrade to ", PLAN_DISPLAY_NAMES[requiredPlan]] }), _jsxs("p", { style: {
                    margin: '0 0 20px 0',
                    fontSize: '14px',
                    color: '#6b7280',
                }, children: [featureName, " requires a ", PLAN_DISPLAY_NAMES[requiredPlan], " license.", detectedPlan !== 'community' &&
                        ` You're currently on ${PLAN_DISPLAY_NAMES[detectedPlan]}.`] }), displayBenefits.length > 0 && (_jsx("ul", { style: {
                    margin: '0 0 20px 0',
                    padding: '0',
                    listStyle: 'none',
                    textAlign: 'left',
                }, children: displayBenefits.map((benefit, index) => (_jsxs("li", { style: {
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '6px 0',
                        fontSize: '14px',
                        color: '#374151',
                    }, children: [_jsx("span", { style: { color: '#10b981' }, children: "\u2713" }), benefit] }, index))) })), _jsx("button", { type: "button", onClick: handleUpgrade, style: {
                    width: '100%',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 24px',
                    fontSize: '15px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'background-color 0.15s ease',
                }, onMouseOver: (e) => (e.currentTarget.style.backgroundColor = '#2563eb'), onMouseOut: (e) => (e.currentTarget.style.backgroundColor = '#3b82f6'), children: "Upgrade Now" }), _jsxs("p", { style: {
                    margin: '12px 0 0 0',
                    fontSize: '12px',
                    color: '#9ca3af',
                }, children: ["Need help?", ' ', _jsx("a", { href: "mailto:support@claritychat.dev", style: { color: '#6b7280', textDecoration: 'underline' }, children: "Contact Sales" })] })] }));
}
LicenseUpgradePrompt.displayName = 'LicenseUpgradePrompt';
//# sourceMappingURL=LicenseUI.js.map