import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Watermark Components
 *
 * Display watermarks for unlicensed usage of Clarity Chat Pro.
 *
 * @packageDocumentation
 */
import * as React from 'react';
/**
 * Get default message for license status
 */
function getDefaultMessage(status) {
    switch (status) {
        case 'Missing':
            return 'Unlicensed';
        case 'Invalid':
            return 'Invalid License';
        case 'Expired':
        case 'ExpiredForDevelopment':
            return 'License Expired';
        case 'GracePeriod':
            return 'Renewal Required';
        case 'PlanMismatch':
            return 'Upgrade Required';
        case 'OutOfScope':
            return 'Domain Not Licensed';
        default:
            return 'Unlicensed';
    }
}
/**
 * Get CSS styles for position
 */
function getPositionStyles(position) {
    const base = {
        position: 'absolute',
        zIndex: 9999,
        pointerEvents: 'none',
    };
    switch (position) {
        case 'top-left':
            return { ...base, top: 8, left: 8 };
        case 'top-right':
            return { ...base, top: 8, right: 8 };
        case 'bottom-left':
            return { ...base, bottom: 8, left: 8 };
        case 'bottom-right':
            return { ...base, bottom: 8, right: 8 };
        default:
            return { ...base, top: 8, right: 8 };
    }
}
/**
 * Watermark component for displaying license status.
 * Appears as a subtle indicator when license is invalid.
 *
 * @example
 * ```tsx
 * <div style={{ position: 'relative' }}>
 *   <MyProComponent />
 *   {!isLicensed && <Watermark status="Missing" />}
 * </div>
 * ```
 */
export function Watermark({ status, message, position = 'top-right', className, style, }) {
    const displayMessage = message ?? getDefaultMessage(status);
    const baseStyles = {
        ...getPositionStyles(position),
        padding: '4px 8px',
        backgroundColor: 'rgba(220, 38, 38, 0.1)', // red-600 with low opacity
        color: 'rgba(220, 38, 38, 0.8)',
        fontSize: '11px',
        fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, monospace',
        fontWeight: 500,
        borderRadius: '2px',
        textTransform: 'uppercase',
        letterSpacing: '0.025em',
        userSelect: 'none',
        ...style,
    };
    return (_jsx("div", { className: className, style: baseStyles, role: "status", "aria-label": displayMessage, children: displayMessage }));
}
/**
 * Wrapper component that adds a watermark overlay.
 *
 * @example
 * ```tsx
 * <WatermarkOverlay status={license.status}>
 *   <MyProComponent />
 * </WatermarkOverlay>
 * ```
 */
export function WatermarkOverlay({ children, status, ...watermarkProps }) {
    // Don't show watermark for valid licenses or during grace period
    if (status === 'Valid' || status === 'GracePeriod') {
        return _jsx(_Fragment, { children: children });
    }
    return (_jsxs("div", { style: { position: 'relative' }, children: [children, _jsx(Watermark, { status: status, ...watermarkProps })] }));
}
/**
 * ARIA live region for announcing license status changes to screen readers.
 *
 * @example
 * ```tsx
 * const { status } = useLicenseStatus();
 * return (
 *   <>
 *     <LicenseStatusAnnouncer status={status.status} />
 *     <MyApp />
 *   </>
 * );
 * ```
 */
export function LicenseStatusAnnouncer({ status, message, }) {
    const [announcement, setAnnouncement] = React.useState('');
    const previousStatus = React.useRef(null);
    React.useEffect(() => {
        // Only announce when status changes (not on initial mount)
        if (previousStatus.current !== null && previousStatus.current !== status) {
            const announceMessage = message ?? getAnnouncementMessage(status);
            setAnnouncement(announceMessage);
            // Clear announcement after it's been read
            const timeoutId = setTimeout(() => setAnnouncement(''), 1000);
            return () => clearTimeout(timeoutId);
        }
        previousStatus.current = status;
    }, [status, message]);
    return (_jsx("div", { role: "status", "aria-live": "polite", "aria-atomic": "true", style: {
            position: 'absolute',
            width: '1px',
            height: '1px',
            padding: 0,
            margin: '-1px',
            overflow: 'hidden',
            clip: 'rect(0, 0, 0, 0)',
            whiteSpace: 'nowrap',
            border: 0,
        }, children: announcement }));
}
/**
 * Get announcement message for screen readers
 */
function getAnnouncementMessage(status) {
    switch (status) {
        case 'Valid':
            return 'License validated successfully';
        case 'Missing':
            return 'No license key provided';
        case 'Invalid':
            return 'Invalid license key';
        case 'Expired':
        case 'ExpiredForDevelopment':
            return 'License has expired';
        case 'GracePeriod':
            return 'License expired but in grace period';
        case 'PlanMismatch':
            return 'License plan insufficient for this feature';
        case 'OutOfScope':
            return 'License not valid for this domain';
        default:
            return 'License status changed';
    }
}
LicenseStatusAnnouncer.displayName = 'LicenseStatusAnnouncer';
//# sourceMappingURL=Watermark.js.map