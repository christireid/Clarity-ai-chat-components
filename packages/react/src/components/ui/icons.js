import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Icon Components
 *
 * Centralized SVG icons for Clarity Chat.
 * These will eventually be replaced with Lucide React icons,
 * but provide immediate improvement over emojis.
 */
import * as React from 'react';
const getIconProps = (props) => {
    const { size, ...rest } = props;
    return {
        width: size ?? 20,
        height: size ?? 20,
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.5,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        ...rest,
    };
};
// Message & Chat Icons
export const SendIcon = (props) => (_jsxs("svg", { ...getIconProps(props), viewBox: "0 0 24 24", children: [_jsx("path", { d: "m22 2-7 20-4-9-9-4Z" }), _jsx("path", { d: "M22 2 11 13" })] }));
export const LoadingIcon = (props) => (_jsx("svg", { ...getIconProps(props), viewBox: "0 0 24 24", className: "animate-spin", children: _jsx("path", { d: "M21 12a9 9 0 1 1-6.219-8.56" }) }));
export const ThumbsUpIcon = (props) => (_jsxs("svg", { ...getIconProps(props), viewBox: "0 0 24 24", children: [_jsx("path", { d: "M7 10v12" }), _jsx("path", { d: "M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" })] }));
export const ThumbsDownIcon = (props) => (_jsxs("svg", { ...getIconProps(props), viewBox: "0 0 24 24", children: [_jsx("path", { d: "M17 14V2" }), _jsx("path", { d: "M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L14 22h0a3.13 3.13 0 0 1-3-3.88Z" })] }));
export const CopyIcon = (props) => (_jsxs("svg", { ...getIconProps(props), viewBox: "0 0 24 24", children: [_jsx("rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2" }), _jsx("path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" })] }));
export const CheckIcon = (props) => (_jsx("svg", { ...getIconProps(props), viewBox: "0 0 24 24", children: _jsx("polyline", { points: "20 6 9 17 4 12" }) }));
export const CloseIcon = (props) => (_jsxs("svg", { ...getIconProps(props), viewBox: "0 0 24 24", children: [_jsx("path", { d: "M18 6 6 18" }), _jsx("path", { d: "m6 6 12 12" })] }));
// File & Media Icons
export const PaperclipIcon = (props) => (_jsx("svg", { ...getIconProps(props), viewBox: "0 0 24 24", children: _jsx("path", { d: "m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" }) }));
export const ImageIcon = (props) => (_jsxs("svg", { ...getIconProps(props), viewBox: "0 0 24 24", children: [_jsx("rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", ry: "2" }), _jsx("circle", { cx: "9", cy: "9", r: "2" }), _jsx("path", { d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" })] }));
export const FileIcon = (props) => (_jsxs("svg", { ...getIconProps(props), viewBox: "0 0 24 24", children: [_jsx("path", { d: "M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" }), _jsx("polyline", { points: "14 2 14 8 20 8" })] }));
export const DownloadIcon = (props) => (_jsxs("svg", { ...getIconProps(props), viewBox: "0 0 24 24", children: [_jsx("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }), _jsx("polyline", { points: "7 10 12 15 17 10" }), _jsx("line", { x1: "12", x2: "12", y1: "15", y2: "3" })] }));
// Status & Feedback Icons
export const AlertCircleIcon = (props) => (_jsxs("svg", { ...getIconProps(props), viewBox: "0 0 24 24", children: [_jsx("circle", { cx: "12", cy: "12", r: "10" }), _jsx("line", { x1: "12", x2: "12", y1: "8", y2: "12" }), _jsx("line", { x1: "12", x2: "12.01", y1: "16", y2: "16" })] }));
export const InfoIcon = (props) => (_jsxs("svg", { ...getIconProps(props), viewBox: "0 0 24 24", children: [_jsx("circle", { cx: "12", cy: "12", r: "10" }), _jsx("path", { d: "M12 16v-4" }), _jsx("path", { d: "M12 8h.01" })] }));
export const CheckCircleIcon = (props) => (_jsxs("svg", { ...getIconProps(props), viewBox: "0 0 24 24", children: [_jsx("path", { d: "M22 11.08V12a10 10 0 1 1-5.93-9.14" }), _jsx("polyline", { points: "22 4 12 14.01 9 11.01" })] }));
export const XCircleIcon = (props) => (_jsxs("svg", { ...getIconProps(props), viewBox: "0 0 24 24", children: [_jsx("circle", { cx: "12", cy: "12", r: "10" }), _jsx("path", { d: "m15 9-6 6" }), _jsx("path", { d: "m9 9 6 6" })] }));
// Navigation Icons
export const ChevronDownIcon = (props) => (_jsx("svg", { ...getIconProps(props), viewBox: "0 0 24 24", children: _jsx("path", { d: "m6 9 6 6 6-6" }) }));
export const ChevronUpIcon = (props) => (_jsx("svg", { ...getIconProps(props), viewBox: "0 0 24 24", children: _jsx("path", { d: "m18 15-6-6-6 6" }) }));
export const ArrowDownIcon = (props) => (_jsxs("svg", { ...getIconProps(props), viewBox: "0 0 24 24", children: [_jsx("path", { d: "M12 5v14" }), _jsx("path", { d: "m19 12-7 7-7-7" })] }));
export const MoreHorizontalIcon = (props) => (_jsxs("svg", { ...getIconProps(props), viewBox: "0 0 24 24", children: [_jsx("circle", { cx: "12", cy: "12", r: "1" }), _jsx("circle", { cx: "19", cy: "12", r: "1" }), _jsx("circle", { cx: "5", cy: "12", r: "1" })] }));
// Settings & Tools Icons
export const SettingsIcon = (props) => (_jsxs("svg", { ...getIconProps(props), viewBox: "0 0 24 24", children: [_jsx("path", { d: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" }), _jsx("circle", { cx: "12", cy: "12", r: "3" })] }));
export const RefreshIcon = (props) => (_jsxs("svg", { ...getIconProps(props), viewBox: "0 0 24 24", children: [_jsx("path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" }), _jsx("path", { d: "M21 3v5h-5" }), _jsx("path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" }), _jsx("path", { d: "M3 21v-5h5" })] }));
export const EditIcon = (props) => (_jsxs("svg", { ...getIconProps(props), viewBox: "0 0 24 24", children: [_jsx("path", { d: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" }), _jsx("path", { d: "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" })] }));
export const TrashIcon = (props) => (_jsxs("svg", { ...getIconProps(props), viewBox: "0 0 24 24", children: [_jsx("path", { d: "M3 6h18" }), _jsx("path", { d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" }), _jsx("path", { d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" })] }));
export const SearchIcon = (props) => (_jsxs("svg", { ...getIconProps(props), viewBox: "0 0 24 24", children: [_jsx("circle", { cx: "11", cy: "11", r: "8" }), _jsx("path", { d: "m21 21-4.3-4.3" })] }));
// Theme Icons
export const SunIcon = (props) => (_jsxs("svg", { ...getIconProps(props), viewBox: "0 0 24 24", children: [_jsx("circle", { cx: "12", cy: "12", r: "5" }), _jsx("path", { d: "M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" })] }));
export const MoonIcon = (props) => (_jsx("svg", { ...getIconProps(props), viewBox: "0 0 24 24", children: _jsx("path", { d: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" }) }));
// AI & Chat Icons
export const BotIcon = (props) => (_jsxs("svg", { ...getIconProps(props), viewBox: "0 0 24 24", children: [_jsx("rect", { width: "18", height: "10", x: "3", y: "11", rx: "2" }), _jsx("circle", { cx: "12", cy: "5", r: "2" }), _jsx("path", { d: "M12 7v4" }), _jsx("line", { x1: "8", x2: "8", y1: "16", y2: "16" }), _jsx("line", { x1: "16", x2: "16", y1: "16", y2: "16" })] }));
export const UserIcon = (props) => (_jsxs("svg", { ...getIconProps(props), viewBox: "0 0 24 24", children: [_jsx("path", { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" }), _jsx("circle", { cx: "12", cy: "7", r: "4" })] }));
export const SparklesIcon = (props) => (_jsxs("svg", { ...getIconProps(props), viewBox: "0 0 24 24", children: [_jsx("path", { d: "m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" }), _jsx("path", { d: "M5 3v4" }), _jsx("path", { d: "M19 17v4" }), _jsx("path", { d: "M3 5h4" }), _jsx("path", { d: "M17 19h4" })] }));
// Aliases for common naming conventions
export const XIcon = CloseIcon;
export const LoaderIcon = LoadingIcon;
// Alert and Shield Icons
export const AlertTriangleIcon = (props) => (_jsxs("svg", { ...getIconProps(props), viewBox: "0 0 24 24", children: [_jsx("path", { d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" }), _jsx("path", { d: "M12 9v4" }), _jsx("path", { d: "M12 17h.01" })] }));
export const ShieldCheckIcon = (props) => (_jsxs("svg", { ...getIconProps(props), viewBox: "0 0 24 24", children: [_jsx("path", { d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" }), _jsx("path", { d: "m9 12 2 2 4-4" })] }));
export const ShieldCloseIcon = (props) => (_jsxs("svg", { ...getIconProps(props), viewBox: "0 0 24 24", children: [_jsx("path", { d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" }), _jsx("path", { d: "m14.5 9-5 5" }), _jsx("path", { d: "m9.5 9 5 5" })] }));
// Media Icons
export const MicIcon = (props) => (_jsxs("svg", { ...getIconProps(props), viewBox: "0 0 24 24", children: [_jsx("path", { d: "M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" }), _jsx("path", { d: "M19 10v2a7 7 0 0 1-14 0v-2" }), _jsx("line", { x1: "12", x2: "12", y1: "19", y2: "22" })] }));
export const LinkIcon = (props) => (_jsxs("svg", { ...getIconProps(props), viewBox: "0 0 24 24", children: [_jsx("path", { d: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" }), _jsx("path", { d: "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" })] }));
export const ClockIcon = (props) => (_jsxs("svg", { ...getIconProps(props), viewBox: "0 0 24 24", children: [_jsx("circle", { cx: "12", cy: "12", r: "10" }), _jsx("path", { d: "M12 6v6l4 2" })] }));
export const DollarSignIcon = (props) => (_jsxs("svg", { ...getIconProps(props), viewBox: "0 0 24 24", children: [_jsx("line", { x1: "12", y1: "1", x2: "12", y2: "23" }), _jsx("path", { d: "M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" })] }));
export const TrendingUpIcon = (props) => (_jsxs("svg", { ...getIconProps(props), viewBox: "0 0 24 24", children: [_jsx("polyline", { points: "22 7 13.5 15.5 8.5 10.5 2 17" }), _jsx("polyline", { points: "16 7 22 7 22 13" })] }));
export const ShieldIcon = (props) => (_jsx("svg", { ...getIconProps(props), viewBox: "0 0 24 24", children: _jsx("path", { d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" }) }));
export const FilterIcon = (props) => (_jsx("svg", { ...getIconProps(props), viewBox: "0 0 24 24", children: _jsx("polygon", { points: "22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" }) }));
export const PlayIcon = (props) => (_jsx("svg", { ...getIconProps(props), viewBox: "0 0 24 24", children: _jsx("polygon", { points: "5 3 19 12 5 21 5 3" }) }));
export const StopIcon = (props) => (_jsx("svg", { ...getIconProps(props), viewBox: "0 0 24 24", children: _jsx("rect", { x: "6", y: "6", width: "12", height: "12", rx: "2", ry: "2", fill: "currentColor" }) }));
export const PauseIcon = (props) => (_jsxs("svg", { ...getIconProps(props), viewBox: "0 0 24 24", children: [_jsx("rect", { x: "6", y: "4", width: "4", height: "16", rx: "1" }), _jsx("rect", { x: "14", y: "4", width: "4", height: "16", rx: "1" })] }));
export const CodeIcon = (props) => (_jsxs("svg", { ...getIconProps(props), viewBox: "0 0 24 24", children: [_jsx("polyline", { points: "16 18 22 12 16 6" }), _jsx("polyline", { points: "8 6 2 12 8 18" })] }));
export const MessageSquareIcon = (props) => (_jsx("svg", { ...getIconProps(props), viewBox: "0 0 24 24", children: _jsx("path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" }) }));
export const LightbulbIcon = (props) => (_jsxs("svg", { ...getIconProps(props), viewBox: "0 0 24 24", children: [_jsx("path", { d: "M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" }), _jsx("path", { d: "M9 18h6" }), _jsx("path", { d: "M10 22h4" })] }));
export const FlagIcon = (props) => (_jsxs("svg", { ...getIconProps(props), viewBox: "0 0 24 24", children: [_jsx("path", { d: "M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" }), _jsx("line", { x1: "4", x2: "4", y1: "22", y2: "15" })] }));
export const WrapTextIcon = (props) => (_jsxs("svg", { ...getIconProps(props), viewBox: "0 0 24 24", children: [_jsx("line", { x1: "3", x2: "21", y1: "6", y2: "6" }), _jsx("path", { d: "M3 12h15a3 3 0 1 1 0 6h-4" }), _jsx("polyline", { points: "16 16 14 18 16 20" })] }));
export const ExternalLinkIcon = (props) => (_jsxs("svg", { ...getIconProps(props), viewBox: "0 0 24 24", children: [_jsx("path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" }), _jsx("polyline", { points: "15 3 21 3 21 9" }), _jsx("line", { x1: "10", x2: "21", y1: "14", y2: "3" })] }));
//# sourceMappingURL=icons.js.map