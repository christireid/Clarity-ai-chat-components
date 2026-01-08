/**
 * Time-Travel Debugging Panel Component
 * Premium state debugging with visual timeline and diff visualization
 * React 19 component using useOptimistic for state snapshots
 */
'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { useTimeTravel } from '../hooks/use-time-travel';
import { TimeTravelDebugger } from '../../debug/time-travel';
import { ClockIcon, RewindIcon, FastForwardIcon, SkipBackIcon, SkipForwardIcon, TrashIcon, PlayIcon, PauseIcon, MessageSquareIcon, GitCommitIcon, HistoryIcon, } from './icons';
/**
 * Time-Travel Debugging Panel Component
 * Displays state snapshots with optimistic updates
 */
export function TimeTravelPanel({ className, timeTravelDebugger, compact = false, autoRecord = false, }) {
    const { snapshots, currentIndex, current, timeline, stats, record, jumpTo, goBack, goForward, clear, } = useTimeTravel(timeTravelDebugger);
    const [isPlaying, setIsPlaying] = React.useState(false);
    const [playbackSpeed, setPlaybackSpeed] = React.useState(1000); // ms between snapshots
    const playbackRef = React.useRef(null);
    // Auto-playback through snapshots
    React.useEffect(() => {
        if (isPlaying && snapshots.length > 0) {
            playbackRef.current = setInterval(() => {
                if (currentIndex < snapshots.length - 1) {
                    goForward(1);
                }
                else {
                    setIsPlaying(false);
                }
            }, playbackSpeed);
        }
        return () => {
            if (playbackRef.current) {
                clearInterval(playbackRef.current);
            }
        };
    }, [isPlaying, currentIndex, snapshots.length, goForward, playbackSpeed]);
    const togglePlayback = () => {
        setIsPlaying((prev) => !prev);
    };
    const handleJumpToStart = () => {
        if (snapshots.length > 0) {
            jumpTo(snapshots[0].id);
        }
        setIsPlaying(false);
    };
    const handleJumpToEnd = () => {
        if (snapshots.length > 0) {
            jumpTo(snapshots[snapshots.length - 1].id);
        }
        setIsPlaying(false);
    };
    // Calculate progress percentage
    const progressPercent = snapshots.length > 1 ? (currentIndex / (snapshots.length - 1)) * 100 : 0;
    return (_jsxs("div", { className: `time-travel-panel ${compact ? 'compact' : ''} ${className || ''}`, "data-testid": "time-travel-panel", children: [_jsxs("header", { className: "time-travel-header", children: [_jsxs("h2", { children: [_jsx(ClockIcon, { size: "lg" }), "Time Travel Debugger"] }), _jsx("div", { className: "time-travel-controls", children: _jsx("button", { className: "dt-btn dt-btn-ghost dt-btn-icon", onClick: clear, "aria-label": "Clear all snapshots", title: "Clear snapshots", children: _jsx(TrashIcon, {}) }) })] }), stats.totalSnapshots > 0 && (_jsxs("div", { className: "time-travel-stats", role: "region", "aria-label": "Time travel statistics", children: [_jsxs("div", { className: "stat", children: [_jsx("span", { className: "stat-label", children: "Snapshots" }), _jsx("span", { className: "stat-value", children: stats.totalSnapshots })] }), _jsxs("div", { className: "stat", children: [_jsx("span", { className: "stat-label", children: "Time Span" }), _jsx("span", { className: "stat-value", children: formatTimeSpan(stats.timeSpan) })] }), _jsxs("div", { className: "stat", children: [_jsx("span", { className: "stat-label", children: "Avg Messages" }), _jsx("span", { className: "stat-value", children: stats.averageMessageCount.toFixed(1) })] }), _jsxs("div", { className: "stat", children: [_jsx("span", { className: "stat-label", children: "Position" }), _jsx("span", { className: "stat-value", children: snapshots.length > 0
                                    ? `${currentIndex + 1} / ${snapshots.length}`
                                    : '0 / 0' })] })] })), snapshots.length > 0 && (_jsxs("div", { className: "time-travel-playback", role: "region", "aria-label": "Playback controls", children: [_jsxs("div", { className: "playback-controls", children: [_jsx("button", { className: "dt-btn dt-btn-ghost dt-btn-icon", onClick: handleJumpToStart, disabled: currentIndex === 0, "aria-label": "Jump to first snapshot", title: "First", children: _jsx(SkipBackIcon, {}) }), _jsx("button", { className: "dt-btn dt-btn-ghost dt-btn-icon", onClick: () => {
                                    goBack(1);
                                    setIsPlaying(false);
                                }, disabled: currentIndex <= 0, "aria-label": "Go back one snapshot", title: "Previous", children: _jsx(RewindIcon, {}) }), _jsx("button", { className: "dt-btn dt-btn-primary dt-btn-icon playback-btn", onClick: togglePlayback, "aria-label": isPlaying ? 'Pause playback' : 'Start playback', title: isPlaying ? 'Pause' : 'Play', children: isPlaying ? _jsx(PauseIcon, {}) : _jsx(PlayIcon, {}) }), _jsx("button", { className: "dt-btn dt-btn-ghost dt-btn-icon", onClick: () => {
                                    goForward(1);
                                    setIsPlaying(false);
                                }, disabled: currentIndex >= snapshots.length - 1, "aria-label": "Go forward one snapshot", title: "Next", children: _jsx(FastForwardIcon, {}) }), _jsx("button", { className: "dt-btn dt-btn-ghost dt-btn-icon", onClick: handleJumpToEnd, disabled: currentIndex === snapshots.length - 1, "aria-label": "Jump to last snapshot", title: "Last", children: _jsx(SkipForwardIcon, {}) })] }), _jsx("div", { className: "playback-progress", children: _jsxs("div", { className: "progress-track", role: "slider", "aria-label": "Timeline position", "aria-valuemin": 0, "aria-valuemax": snapshots.length - 1, "aria-valuenow": currentIndex, children: [_jsx("div", { className: "progress-fill", style: { width: `${progressPercent}%` } }), snapshots.map((snapshot, index) => (_jsx("button", { className: `progress-marker ${index === currentIndex ? 'active' : ''} ${index < currentIndex ? 'past' : ''}`, style: {
                                        left: `${snapshots.length > 1 ? (index / (snapshots.length - 1)) * 100 : 50}%`,
                                    }, onClick: () => {
                                        jumpTo(snapshot.id);
                                        setIsPlaying(false);
                                    }, "aria-label": `Jump to snapshot ${index + 1}: ${snapshot.label || 'Unlabeled'}`, title: snapshot.label || `Snapshot ${index + 1}` }, snapshot.id)))] }) }), _jsxs("div", { className: "playback-speed", children: [_jsx("label", { htmlFor: "playback-speed", children: "Speed:" }), _jsxs("select", { id: "playback-speed", value: playbackSpeed, onChange: (e) => setPlaybackSpeed(Number(e.target.value)), className: "speed-select", children: [_jsx("option", { value: 2000, children: "0.5x" }), _jsx("option", { value: 1000, children: "1x" }), _jsx("option", { value: 500, children: "2x" }), _jsx("option", { value: 250, children: "4x" })] })] })] })), _jsx("div", { className: "time-travel-timeline", role: "region", "aria-label": "Snapshot timeline", children: snapshots.length === 0 ? (_jsx(EmptyState, {})) : (_jsx("div", { className: "timeline-list", role: "list", children: timeline.map((entry, index) => (_jsx(TimelineItem, { entry: entry, index: index, isCurrent: index === currentIndex, isLast: index === snapshots.length - 1, onJump: () => {
                            jumpTo(entry.snapshot.id);
                            setIsPlaying(false);
                        } }, entry.snapshot.id))) })) }), current && (_jsxs("div", { className: "current-snapshot", role: "region", "aria-label": "Current snapshot details", children: [_jsxs("header", { className: "current-snapshot-header", children: [_jsx("h3", { children: "Current State" }), _jsxs("span", { className: "snapshot-position", children: ["Snapshot ", currentIndex + 1, " of ", snapshots.length] })] }), _jsxs("div", { className: "snapshot-details", children: [_jsxs("dl", { className: "snapshot-info", children: [_jsxs("div", { className: "info-item", children: [_jsx("dt", { children: "Label" }), _jsx("dd", { children: current.label || 'Unlabeled' })] }), _jsxs("div", { className: "info-item", children: [_jsx("dt", { children: "Messages" }), _jsx("dd", { className: "highlight", children: current.messages.length })] }), _jsxs("div", { className: "info-item", children: [_jsx("dt", { children: "Timestamp" }), _jsx("dd", { children: current.timestamp.toLocaleTimeString() })] }), timeline[currentIndex]?.transition && (_jsxs("div", { className: "info-item", children: [_jsx("dt", { children: "Action" }), _jsx("dd", { className: "action-badge", children: timeline[currentIndex].transition?.action })] }))] }), current.messages.length > 0 && (_jsxs("div", { className: "messages-preview", children: [_jsxs("h4", { children: ["Messages (", current.messages.length, ")"] }), _jsx("ul", { className: "messages-list", children: current.messages.slice(-5).map((msg, i) => (_jsxs("li", { className: `message-item ${msg.role}`, children: [_jsx("span", { className: "message-role", children: msg.role }), _jsx("span", { className: "message-content", children: typeof msg.content === 'string'
                                                        ? msg.content.substring(0, 100) +
                                                            (msg.content.length > 100 ? '...' : '')
                                                        : '[Complex content]' })] }, i))) }), current.messages.length > 5 && (_jsxs("p", { className: "messages-more", children: ["+ ", current.messages.length - 5, " more messages"] }))] }))] })] }))] }));
}
/**
 * Empty state component
 */
function EmptyState() {
    return (_jsxs("div", { className: "empty-state", role: "status", children: [_jsx("div", { className: "empty-state-icon", "aria-hidden": "true", children: _jsx(HistoryIcon, { size: "xl" }) }), _jsx("h3", { className: "empty-state-title", children: "No snapshots recorded" }), _jsx("p", { className: "empty-state-description", children: "State snapshots will appear here as you record them. Use the record function to capture conversation states." })] }));
}
function TimelineItem({ entry, index, isCurrent, isLast, onJump, }) {
    const { snapshot, transition } = entry;
    return (_jsxs("div", { className: `timeline-item ${isCurrent ? 'current' : ''}`, role: "listitem", "aria-current": isCurrent ? 'step' : undefined, children: [!isLast && _jsx("div", { className: "timeline-connector", "aria-hidden": "true" }), _jsx("div", { className: `timeline-marker ${isCurrent ? 'active' : ''}`, "aria-hidden": "true", children: isCurrent ? _jsx(PlayIcon, {}) : _jsx("span", { className: "marker-dot" }) }), _jsxs("div", { className: "timeline-content", onClick: onJump, onKeyDown: (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onJump();
                    }
                }, role: "button", tabIndex: 0, "aria-label": `Jump to snapshot ${index + 1}: ${snapshot.label || 'Unlabeled'}`, children: [_jsxs("header", { className: "timeline-header", children: [_jsxs("span", { className: "timeline-index", children: ["#", index + 1] }), _jsx("span", { className: "timeline-label", children: snapshot.label || `Snapshot ${snapshot.id.substring(0, 8)}` }), _jsx("span", { className: "timeline-time", children: snapshot.timestamp.toLocaleTimeString() })] }), _jsxs("div", { className: "timeline-info", children: [_jsxs("span", { className: "info-badge", children: [_jsx(MessageSquareIcon, { size: "sm" }), snapshot.messages.length, " messages"] }), transition && (_jsxs("span", { className: "info-badge action", children: [_jsx(GitCommitIcon, { size: "sm" }), transition.action] }))] })] })] }));
}
/**
 * Format time span for display
 */
function formatTimeSpan(ms) {
    if (ms < 1000)
        return `${ms}ms`;
    if (ms < 60000)
        return `${(ms / 1000).toFixed(1)}s`;
    if (ms < 3600000)
        return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`;
    return `${Math.floor(ms / 3600000)}h ${Math.floor((ms % 3600000) / 60000)}m`;
}
//# sourceMappingURL=time-travel-panel.js.map