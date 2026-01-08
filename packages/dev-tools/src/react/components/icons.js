import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Shared Icons Module
 * Centralized SVG icons for the dev-tools package
 * Eliminates duplication across components
 */
import * as React from 'react';
// Size presets
const sizeMap = {
    sm: 14,
    md: 16,
    lg: 18,
    xl: 48,
};
function getSize(size = 'md') {
    if (typeof size === 'number')
        return size;
    return sizeMap[size];
}
// Base SVG props for stroke-based icons
function getSvgProps(props, defaultSize = 16) {
    const size = props.size ? getSize(props.size) : defaultSize;
    return {
        width: size,
        height: size,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        className: props.className,
        'aria-label': props['aria-label'],
        'aria-hidden': !props['aria-label'],
    };
}
// ============================================================================
// Navigation & UI Icons
// ============================================================================
export function SearchIcon(props) {
    return (_jsxs("svg", { ...getSvgProps(props), children: [_jsx("circle", { cx: "11", cy: "11", r: "8" }), _jsx("path", { d: "m21 21-4.35-4.35" })] }));
}
export function ChevronDownIcon(props) {
    return (_jsx("svg", { ...getSvgProps(props), children: _jsx("polyline", { points: "6 9 12 15 18 9" }) }));
}
export function ArrowRightIcon(props) {
    return (_jsxs("svg", { ...getSvgProps(props, 14), children: [_jsx("line", { x1: "5", y1: "12", x2: "19", y2: "12" }), _jsx("polyline", { points: "12 5 19 12 12 19" })] }));
}
export function ArrowUpDownIcon(props) {
    return (_jsxs("svg", { ...getSvgProps(props, 14), children: [_jsx("path", { d: "m7 15 5 5 5-5" }), _jsx("path", { d: "m7 9 5-5 5 5" })] }));
}
export function KeyboardIcon(props) {
    return (_jsxs("svg", { ...getSvgProps(props, 14), children: [_jsx("rect", { width: "20", height: "16", x: "2", y: "4", rx: "2", ry: "2" }), _jsx("path", { d: "M6 8h.001" }), _jsx("path", { d: "M10 8h.001" }), _jsx("path", { d: "M14 8h.001" }), _jsx("path", { d: "M18 8h.001" }), _jsx("path", { d: "M8 12h.001" }), _jsx("path", { d: "M12 12h.001" }), _jsx("path", { d: "M16 12h.001" }), _jsx("path", { d: "M7 16h10" })] }));
}
export function CloseIcon(props) {
    return (_jsx("svg", { ...getSvgProps(props, 20), children: _jsx("path", { d: "M18 6L6 18M6 6l12 12" }) }));
}
// ============================================================================
// Status & Feedback Icons
// ============================================================================
export function CheckIcon(props) {
    return (_jsx("svg", { ...getSvgProps(props, 14), children: _jsx("polyline", { points: "20 6 9 17 4 12" }) }));
}
export function CheckCircleIcon(props) {
    return (_jsxs("svg", { ...getSvgProps(props), children: [_jsx("path", { d: "M22 11.08V12a10 10 0 1 1-5.93-9.14" }), _jsx("polyline", { points: "22 4 12 14.01 9 11.01" })] }));
}
export function AlertCircleIcon(props) {
    return (_jsxs("svg", { ...getSvgProps(props), children: [_jsx("circle", { cx: "12", cy: "12", r: "10" }), _jsx("line", { x1: "12", y1: "8", x2: "12", y2: "12" }), _jsx("line", { x1: "12", y1: "16", x2: "12.01", y2: "16" })] }));
}
export function AlertTriangleIcon(props) {
    return (_jsxs("svg", { ...getSvgProps(props), children: [_jsx("path", { d: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" }), _jsx("line", { x1: "12", y1: "9", x2: "12", y2: "13" }), _jsx("line", { x1: "12", y1: "17", x2: "12.01", y2: "17" })] }));
}
export function XCircleIcon(props) {
    return (_jsxs("svg", { ...getSvgProps(props), children: [_jsx("circle", { cx: "12", cy: "12", r: "10" }), _jsx("line", { x1: "15", y1: "9", x2: "9", y2: "15" }), _jsx("line", { x1: "9", y1: "9", x2: "15", y2: "15" })] }));
}
export function InfoIcon(props) {
    return (_jsxs("svg", { ...getSvgProps(props, 14), children: [_jsx("circle", { cx: "12", cy: "12", r: "10" }), _jsx("line", { x1: "12", y1: "16", x2: "12", y2: "12" }), _jsx("line", { x1: "12", y1: "8", x2: "12.01", y2: "8" })] }));
}
// ============================================================================
// Action Icons
// ============================================================================
export function TrashIcon(props) {
    return (_jsxs("svg", { ...getSvgProps(props), children: [_jsx("polyline", { points: "3 6 5 6 21 6" }), _jsx("path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" })] }));
}
export function CopyIcon(props) {
    return (_jsxs("svg", { ...getSvgProps(props, 14), children: [_jsx("rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2" }), _jsx("path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" })] }));
}
export function DownloadIcon(props) {
    return (_jsxs("svg", { ...getSvgProps(props), children: [_jsx("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }), _jsx("polyline", { points: "7 10 12 15 17 10" }), _jsx("line", { x1: "12", y1: "15", x2: "12", y2: "3" })] }));
}
// ============================================================================
// Media Control Icons
// ============================================================================
export function PlayIcon(props) {
    const size = props.size ? getSize(props.size) : 16;
    return (_jsx("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "currentColor", className: props.className, "aria-label": props['aria-label'], "aria-hidden": !props['aria-label'], children: _jsx("polygon", { points: "5 3 19 12 5 21 5 3" }) }));
}
export function PauseIcon(props) {
    const size = props.size ? getSize(props.size) : 16;
    return (_jsxs("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "currentColor", className: props.className, "aria-label": props['aria-label'], "aria-hidden": !props['aria-label'], children: [_jsx("rect", { x: "6", y: "4", width: "4", height: "16" }), _jsx("rect", { x: "14", y: "4", width: "4", height: "16" })] }));
}
export function RewindIcon(props) {
    return (_jsxs("svg", { ...getSvgProps(props), children: [_jsx("polygon", { points: "11 19 2 12 11 5 11 19" }), _jsx("polygon", { points: "22 19 13 12 22 5 22 19" })] }));
}
export function FastForwardIcon(props) {
    return (_jsxs("svg", { ...getSvgProps(props), children: [_jsx("polygon", { points: "13 19 22 12 13 5 13 19" }), _jsx("polygon", { points: "2 19 11 12 2 5 2 19" })] }));
}
export function SkipBackIcon(props) {
    return (_jsxs("svg", { ...getSvgProps(props), children: [_jsx("polygon", { points: "19 20 9 12 19 4 19 20" }), _jsx("line", { x1: "5", y1: "19", x2: "5", y2: "5" })] }));
}
export function SkipForwardIcon(props) {
    return (_jsxs("svg", { ...getSvgProps(props), children: [_jsx("polygon", { points: "5 4 15 12 5 20 5 4" }), _jsx("line", { x1: "19", y1: "5", x2: "19", y2: "19" })] }));
}
// ============================================================================
// Time & Clock Icons
// ============================================================================
export function ClockIcon(props) {
    return (_jsxs("svg", { ...getSvgProps(props), children: [_jsx("circle", { cx: "12", cy: "12", r: "10" }), _jsx("polyline", { points: "12 6 12 12 16 14" })] }));
}
export function HistoryIcon(props) {
    return (_jsxs("svg", { ...getSvgProps(props, 48), strokeWidth: 1.5, children: [_jsx("path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" }), _jsx("path", { d: "M3 3v5h5" }), _jsx("path", { d: "M12 7v5l4 2" })] }));
}
// ============================================================================
// Performance & Analytics Icons
// ============================================================================
export function ZapIcon(props) {
    return (_jsx("svg", { ...getSvgProps(props, 18), children: _jsx("path", { d: "M13 2L3 14h9l-1 8 10-12h-9l1-8z" }) }));
}
export function ActivityIcon(props) {
    return (_jsx("svg", { ...getSvgProps(props, 48), strokeWidth: 1.5, children: _jsx("polyline", { points: "22 12 18 12 15 21 9 3 6 12 2 12" }) }));
}
export function TrendingUpIcon(props) {
    return (_jsxs("svg", { ...getSvgProps(props), children: [_jsx("polyline", { points: "23 6 13.5 15.5 8.5 10.5 1 18" }), _jsx("polyline", { points: "17 6 23 6 23 12" })] }));
}
export function TrendingDownIcon(props) {
    return (_jsxs("svg", { ...getSvgProps(props), children: [_jsx("polyline", { points: "23 18 13.5 8.5 8.5 13.5 1 6" }), _jsx("polyline", { points: "17 18 23 18 23 12" })] }));
}
export function MemoryIcon(props) {
    return (_jsxs("svg", { ...getSvgProps(props), children: [_jsx("rect", { x: "4", y: "4", width: "16", height: "16", rx: "2" }), _jsx("rect", { x: "9", y: "9", width: "6", height: "6" }), _jsx("path", { d: "M9 1v3" }), _jsx("path", { d: "M15 1v3" }), _jsx("path", { d: "M9 20v3" }), _jsx("path", { d: "M15 20v3" }), _jsx("path", { d: "M20 9h3" }), _jsx("path", { d: "M20 14h3" }), _jsx("path", { d: "M1 9h3" }), _jsx("path", { d: "M1 14h3" })] }));
}
export function BarChartIcon(props) {
    return (_jsxs("svg", { ...getSvgProps(props, 48), strokeWidth: 1.5, children: [_jsx("line", { x1: "12", y1: "20", x2: "12", y2: "10" }), _jsx("line", { x1: "18", y1: "20", x2: "18", y2: "4" }), _jsx("line", { x1: "6", y1: "20", x2: "6", y2: "14" })] }));
}
// ============================================================================
// Communication Icons
// ============================================================================
export function MessageSquareIcon(props) {
    return (_jsx("svg", { ...getSvgProps(props, 14), children: _jsx("path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" }) }));
}
export function InboxIcon(props) {
    return (_jsxs("svg", { ...getSvgProps(props, 48), strokeWidth: 1.5, children: [_jsx("polyline", { points: "22 12 16 12 14 15 10 15 8 12 2 12" }), _jsx("path", { d: "M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" })] }));
}
// ============================================================================
// Git & Version Control Icons
// ============================================================================
export function GitCommitIcon(props) {
    return (_jsxs("svg", { ...getSvgProps(props, 14), children: [_jsx("circle", { cx: "12", cy: "12", r: "4" }), _jsx("line", { x1: "1.05", y1: "12", x2: "7", y2: "12" }), _jsx("line", { x1: "17.01", y1: "12", x2: "22.96", y2: "12" })] }));
}
// ============================================================================
// Feature/Panel Icons
// ============================================================================
export function InspectorIcon(props) {
    return (_jsxs("svg", { ...getSvgProps(props, 18), children: [_jsx("circle", { cx: "11", cy: "11", r: "8" }), _jsx("path", { d: "m21 21-4.35-4.35" })] }));
}
export function ProfilerIcon(props) {
    return (_jsx("svg", { ...getSvgProps(props, 18), children: _jsx("path", { d: "M13 2L3 14h9l-1 8 10-12h-9l1-8z" }) }));
}
export function ValidationIcon(props) {
    return (_jsxs("svg", { ...getSvgProps(props, 18), children: [_jsx("path", { d: "M9 11l3 3L22 4" }), _jsx("path", { d: "M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" })] }));
}
export function TimeTravelIcon(props) {
    return (_jsxs("svg", { ...getSvgProps(props, 18), children: [_jsx("circle", { cx: "12", cy: "12", r: "10" }), _jsx("polyline", { points: "12 6 12 12 16 14" })] }));
}
export function ComparisonIcon(props) {
    return (_jsxs("svg", { ...getSvgProps(props, 18), children: [_jsx("path", { d: "M16 3h5v5" }), _jsx("path", { d: "M8 3H3v5" }), _jsx("path", { d: "M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3" }), _jsx("path", { d: "m15 9 6-6" })] }));
}
export function ScaleIcon(props) {
    return (_jsxs("svg", { ...getSvgProps(props, 18), children: [_jsx("path", { d: "M16 3h5v5" }), _jsx("path", { d: "M8 3H3v5" }), _jsx("path", { d: "M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3" }), _jsx("path", { d: "m15 9 6-6" })] }));
}
// ============================================================================
// Settings & Configuration Icons
// ============================================================================
export function ShieldIcon(props) {
    return (_jsx("svg", { ...getSvgProps(props, 18), children: _jsx("path", { d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" }) }));
}
export function KeyIcon(props) {
    return (_jsx("svg", { ...getSvgProps(props), children: _jsx("path", { d: "m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4" }) }));
}
export function SettingsIcon(props) {
    return (_jsxs("svg", { ...getSvgProps(props), children: [_jsx("circle", { cx: "12", cy: "12", r: "3" }), _jsx("path", { d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" })] }));
}
export function GlobeIcon(props) {
    return (_jsxs("svg", { ...getSvgProps(props), children: [_jsx("circle", { cx: "12", cy: "12", r: "10" }), _jsx("line", { x1: "2", y1: "12", x2: "22", y2: "12" }), _jsx("path", { d: "M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" })] }));
}
// ============================================================================
// Misc Icons
// ============================================================================
export function DollarSignIcon(props) {
    return (_jsxs("svg", { ...getSvgProps(props), children: [_jsx("line", { x1: "12", y1: "1", x2: "12", y2: "23" }), _jsx("path", { d: "M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" })] }));
}
export function HashIcon(props) {
    return (_jsxs("svg", { ...getSvgProps(props), children: [_jsx("line", { x1: "4", y1: "9", x2: "20", y2: "9" }), _jsx("line", { x1: "4", y1: "15", x2: "20", y2: "15" }), _jsx("line", { x1: "10", y1: "3", x2: "8", y2: "21" }), _jsx("line", { x1: "16", y1: "3", x2: "14", y2: "21" })] }));
}
export function TrophyIcon(props) {
    return (_jsxs("svg", { ...getSvgProps(props), children: [_jsx("path", { d: "M6 9H4.5a2.5 2.5 0 0 1 0-5H6" }), _jsx("path", { d: "M18 9h1.5a2.5 2.5 0 0 0 0-5H18" }), _jsx("path", { d: "M4 22h16" }), _jsx("path", { d: "M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" }), _jsx("path", { d: "M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" }), _jsx("path", { d: "M18 2H6v7a6 6 0 0 0 12 0V2Z" })] }));
}
export function LightbulbIcon(props) {
    return (_jsxs("svg", { ...getSvgProps(props), children: [_jsx("path", { d: "M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" }), _jsx("path", { d: "M9 18h6" }), _jsx("path", { d: "M10 22h4" })] }));
}
// ============================================================================
// Legacy Icons object for backward compatibility during migration
// This allows gradual migration of existing components
// ============================================================================
/**
 * @deprecated Use individual icon components instead
 * This object provides backward compatibility during migration
 */
export const Icons = {
    // Navigation & UI
    Search: SearchIcon,
    ChevronDown: ChevronDownIcon,
    ArrowRight: ArrowRightIcon,
    ArrowUpDown: ArrowUpDownIcon,
    Keyboard: KeyboardIcon,
    Close: CloseIcon,
    // Status & Feedback
    Check: CheckIcon,
    CheckCircle: CheckCircleIcon,
    AlertCircle: AlertCircleIcon,
    AlertTriangle: AlertTriangleIcon,
    XCircle: XCircleIcon,
    Info: InfoIcon,
    // Actions
    Trash: TrashIcon,
    Copy: CopyIcon,
    Download: DownloadIcon,
    // Media Controls
    Play: PlayIcon,
    Pause: PauseIcon,
    Rewind: RewindIcon,
    FastForward: FastForwardIcon,
    SkipBack: SkipBackIcon,
    SkipForward: SkipForwardIcon,
    // Time & Clock
    Clock: ClockIcon,
    History: HistoryIcon,
    // Performance & Analytics
    Zap: ZapIcon,
    Activity: ActivityIcon,
    TrendingUp: TrendingUpIcon,
    TrendingDown: TrendingDownIcon,
    Memory: MemoryIcon,
    BarChart: BarChartIcon,
    // Communication
    MessageSquare: MessageSquareIcon,
    Inbox: InboxIcon,
    // Git
    GitCommit: GitCommitIcon,
    // Feature/Panel Icons
    Inspector: InspectorIcon,
    Profiler: ProfilerIcon,
    Validation: ValidationIcon,
    TimeTravel: TimeTravelIcon,
    Comparison: ComparisonIcon,
    Scale: ScaleIcon,
    // Settings & Configuration
    Shield: ShieldIcon,
    Key: KeyIcon,
    Settings: SettingsIcon,
    Globe: GlobeIcon,
    // Misc
    DollarSign: DollarSignIcon,
    Hash: HashIcon,
    Trophy: TrophyIcon,
    Lightbulb: LightbulbIcon,
};
//# sourceMappingURL=icons.js.map