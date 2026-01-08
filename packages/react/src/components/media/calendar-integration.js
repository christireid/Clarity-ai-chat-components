'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { logger } from '@clarity-chat/utils/logger';
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, Badge, Button, cn } from '@clarity-chat/primitives';
import { ClockIcon, RefreshIcon, CloseIcon } from '../ui/icons';
import { useIsMounted } from '../../hooks/ui/use-is-mounted';
/**
 * Format time
 */
function formatTime(date) {
    return new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    }).format(date);
}
/**
 * Format date
 */
function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
    }).format(date);
}
/**
 * Format duration
 */
function formatDuration(start, end) {
    const diffMs = end.getTime() - start.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    if (hours === 0)
        return `${minutes}m`;
    if (minutes === 0)
        return `${hours}h`;
    return `${hours}h ${minutes}m`;
}
/**
 * Get event color
 */
function getEventColor(event) {
    if (event.color)
        return event.color;
    switch (event.status) {
        case 'confirmed':
            return '#3b82f6';
        case 'tentative':
            return '#f59e0b';
        case 'cancelled':
            return '#ef4444';
        default:
            return '#6b7280';
    }
}
/**
 * Get priority color
 */
function getPriorityColor(priority) {
    switch (priority) {
        case 'high':
            return 'destructive';
        case 'medium':
            return 'default';
        case 'low':
            return 'secondary';
        default:
            return 'secondary';
    }
}
/**
 * CalendarIntegration Component
 *
 * Calendar integration for:
 * - Viewing and managing events
 * - Converting action items to events
 * - Checking availability
 * - Scheduling from conversation
 */
export function CalendarIntegration({ initialEvents = [], actionItems: initialActionItems = [], dateRange, showActionItems = true, showAvailability = false, onEventCreate, onEventUpdate: _onEventUpdate, onEventDelete, onActionToEvent, fetchEvents, fetchAvailability, className, ref, ...props }) {
    const isMounted = useIsMounted();
    const [state, setState] = React.useState({
        events: initialEvents,
        actionItems: initialActionItems,
        availability: [],
        loading: false,
        error: null,
    });
    const [selectedDate, _setSelectedDate] = React.useState(new Date());
    // Clear error helper
    const clearError = React.useCallback(() => {
        setState((prev) => ({ ...prev, error: null }));
    }, []);
    // Calculate date range
    const range = React.useMemo(() => {
        if (dateRange)
            return dateRange;
        const start = new Date(selectedDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(selectedDate);
        end.setDate(end.getDate() + 7);
        end.setHours(23, 59, 59, 999);
        return { start, end };
    }, [dateRange, selectedDate]);
    // Load events
    const loadEvents = React.useCallback(async () => {
        if (!fetchEvents)
            return;
        setState((prev) => ({ ...prev, loading: true, error: null }));
        try {
            const events = await fetchEvents(range.start, range.end);
            if (isMounted.current) {
                setState((prev) => ({ ...prev, events, loading: false }));
            }
        }
        catch (error) {
            if (isMounted.current) {
                setState((prev) => ({
                    ...prev,
                    error: error instanceof Error ? error.message : 'Failed to load events',
                    loading: false,
                }));
            }
        }
    }, [fetchEvents, range, isMounted]);
    // Load availability
    const loadAvailability = React.useCallback(async () => {
        if (!fetchAvailability)
            return;
        try {
            const availability = await fetchAvailability(range.start, range.end);
            if (isMounted.current) {
                setState((prev) => ({ ...prev, availability }));
            }
        }
        catch (error) {
            // Silently fail for availability (non-critical)
            if (process.env.NODE_ENV === 'development') {
                logger.error('Failed to load availability:', error);
            }
        }
    }, [fetchAvailability, range, isMounted]);
    // Create event from action item
    const convertActionToEvent = React.useCallback(async (actionItem) => {
        if (!onActionToEvent)
            return;
        setState((prev) => ({ ...prev, loading: true }));
        try {
            const event = await onActionToEvent(actionItem);
            if (isMounted.current) {
                setState((prev) => ({
                    ...prev,
                    events: [...prev.events, event],
                    actionItems: prev.actionItems.map((a) => a.id === actionItem.id
                        ? { ...a, status: 'completed' }
                        : a),
                    loading: false,
                }));
            }
        }
        catch (error) {
            if (isMounted.current) {
                setState((prev) => ({
                    ...prev,
                    error: error instanceof Error ? error.message : 'Failed to create event',
                    loading: false,
                }));
            }
        }
    }, [onActionToEvent, isMounted]);
    // Delete event
    const deleteEvent = React.useCallback(async (eventId) => {
        if (!onEventDelete)
            return;
        setState((prev) => ({ ...prev, loading: true }));
        try {
            await onEventDelete(eventId);
            if (isMounted.current) {
                setState((prev) => ({
                    ...prev,
                    events: prev.events.filter((e) => e.id !== eventId),
                    loading: false,
                }));
            }
        }
        catch (error) {
            if (isMounted.current) {
                setState((prev) => ({
                    ...prev,
                    error: error instanceof Error ? error.message : 'Failed to delete event',
                    loading: false,
                }));
            }
        }
    }, [onEventDelete, isMounted]);
    // Group events by date
    const eventsByDate = React.useMemo(() => {
        const grouped = new Map();
        state.events
            .filter((e) => e.status !== 'cancelled')
            .sort((a, b) => a.start.getTime() - b.start.getTime())
            .forEach((event) => {
            const dateKey = formatDate(event.start);
            const existing = grouped.get(dateKey) || [];
            grouped.set(dateKey, [...existing, event]);
        });
        return grouped;
    }, [state.events]);
    // Load data on mount
    React.useEffect(() => {
        loadEvents();
        if (showAvailability) {
            loadAvailability();
        }
    }, [loadEvents, loadAvailability, showAvailability]);
    return (_jsxs("div", { ref: ref, className: cn('space-y-4', className), role: "region", "aria-label": "Calendar integration", ...props, children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h3", { className: "font-semibold", children: "Calendar" }), _jsxs("div", { className: "flex items-center gap-2", children: [fetchEvents && (_jsx(Button, { variant: "ghost", size: "sm", onClick: loadEvents, disabled: state.loading, "aria-label": "Refresh calendar", children: _jsx(RefreshIcon, { className: cn('w-4 h-4', state.loading && 'animate-spin') }) })), onEventCreate && (_jsx(Button, { size: "sm", disabled: state.loading, "aria-label": "Create new event", children: "New Event" }))] })] }), state.error && (_jsxs("div", { className: "p-3 bg-destructive/10 text-destructive rounded-lg text-sm flex items-center justify-between", role: "alert", children: [_jsx("span", { children: state.error }), _jsx(Button, { variant: "ghost", size: "sm", onClick: clearError, "aria-label": "Dismiss error", className: "ml-2 h-6 w-6 p-0", children: _jsx(CloseIcon, { className: "w-4 h-4" }) })] })), showActionItems && state.actionItems.length > 0 && (_jsx(Card, { children: _jsxs(CardContent, { className: "p-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsx("span", { className: "text-sm font-medium", children: "Action Items" }), _jsx(Badge, { variant: "secondary", children: state.actionItems.filter((a) => a.status !== 'completed')
                                        .length })] }), _jsx("div", { className: "space-y-2", children: _jsx(AnimatePresence, { children: state.actionItems
                                    .filter((a) => a.status !== 'completed')
                                    .map((item, index) => (_jsxs(motion.div, { initial: { opacity: 0, x: -10 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: 10 }, transition: { delay: index * 0.05 }, className: "flex items-center justify-between p-2 bg-muted/50 rounded-lg", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Badge, { variant: getPriorityColor(item.priority), children: item.priority }), _jsx("span", { className: "text-sm", children: item.title }), item.dueDate && (_jsxs("span", { className: "text-xs text-muted-foreground", children: ["Due ", formatDate(item.dueDate)] }))] }), onActionToEvent && (_jsx(Button, { variant: "ghost", size: "sm", onClick: () => convertActionToEvent(item), disabled: state.loading, children: "Schedule" }))] }, item.id))) }) })] }) })), !state.loading && eventsByDate.size > 0 && (_jsx("div", { className: "space-y-4", children: Array.from(eventsByDate.entries()).map(([dateKey, events]) => (_jsx(Card, { children: _jsxs(CardContent, { className: "p-4", children: [_jsx("div", { className: "text-sm font-medium mb-3", children: dateKey }), _jsx("div", { className: "space-y-2", children: events.map((event, index) => (_jsxs(motion.div, { initial: { opacity: 0, y: 5 }, animate: { opacity: 1, y: 0 }, transition: { delay: index * 0.03 }, className: "flex items-start gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors group", children: [_jsx("div", { className: "w-1 h-full rounded-full self-stretch min-h-[40px]", style: { backgroundColor: getEventColor(event) } }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("div", { className: "font-medium truncate", children: event.title }), _jsxs("div", { className: "text-xs text-muted-foreground flex items-center gap-2", children: [_jsx(ClockIcon, { className: "w-3 h-3" }), event.isAllDay ? ('All day') : (_jsxs(_Fragment, { children: [formatTime(event.start), " -", ' ', formatTime(event.end), _jsxs("span", { children: ["(", formatDuration(event.start, event.end), ")"] })] }))] }), event.location && (_jsx("div", { className: "text-xs text-muted-foreground truncate", children: event.location })), event.attendees && event.attendees.length > 0 && (_jsxs("div", { className: "flex items-center gap-1 mt-1", children: [event.attendees.slice(0, 3).map((attendee) => (_jsx("div", { className: "w-5 h-5 rounded-full bg-muted flex items-center justify-center text-xs", title: attendee.name || attendee.email, children: (attendee.name ||
                                                                attendee.email)[0].toUpperCase() }, attendee.email))), event.attendees.length > 3 && (_jsxs("span", { className: "text-xs text-muted-foreground", children: ["+", event.attendees.length - 3] }))] }))] }), onEventDelete && (_jsx(Button, { variant: "ghost", size: "sm", className: "opacity-0 group-hover:opacity-100 transition-opacity", onClick: () => deleteEvent(event.id), "aria-label": "Delete event", children: "Delete" }))] }, event.id))) })] }) }, dateKey))) })), state.loading && (_jsx("div", { className: "flex items-center justify-center p-8", children: _jsx(RefreshIcon, { className: "w-6 h-6 animate-spin text-muted-foreground" }) })), !state.loading && eventsByDate.size === 0 && (_jsxs("div", { className: "flex flex-col items-center justify-center p-8 text-center", children: [_jsx(ClockIcon, { className: "w-12 h-12 text-muted-foreground mb-3" }), _jsx("div", { className: "text-muted-foreground", children: "No events scheduled" })] })), showAvailability && state.availability.length > 0 && (_jsx(Card, { children: _jsxs(CardContent, { className: "p-4", children: [_jsx("div", { className: "text-sm font-medium mb-3", children: "Availability" }), _jsx("div", { className: "flex flex-wrap gap-2", role: "list", "aria-label": "Available time slots", children: state.availability
                                .filter((slot) => slot.status === 'free')
                                .slice(0, 6)
                                .map((slot, index) => (_jsxs(Badge, { variant: "outline", className: "cursor-pointer hover:bg-accent", role: "listitem", children: [formatDate(slot.start), " ", formatTime(slot.start)] }, index))) })] }) }))] }));
}
// Display name for debugging
CalendarIntegration.displayName = 'CalendarIntegration';
/**
 * Hook for calendar integration
 */
export function useCalendarIntegration(options) {
    const [events, setEvents] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    // Fetch events
    const fetchEvents = React.useCallback(async (start, end) => {
        if (!options.apiEndpoint)
            return [];
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams({
                start: start.toISOString(),
                end: end.toISOString(),
                ...(options.calendarId && { calendarId: options.calendarId }),
            });
            const response = await fetch(`${options.apiEndpoint}/events?${params}`, {
                headers: options.apiKey
                    ? { Authorization: `Bearer ${options.apiKey}` }
                    : {},
            });
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            const data = await response.json();
            const fetchedEvents = (data.events || []).map((e) => ({
                ...e,
                start: new Date(e.start),
                end: new Date(e.end),
            }));
            setEvents(fetchedEvents);
            return fetchedEvents;
        }
        catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to fetch events';
            setError(message);
            throw err;
        }
        finally {
            setLoading(false);
        }
    }, [options.apiEndpoint, options.apiKey, options.calendarId]);
    // Create event
    const createEvent = React.useCallback(async (event) => {
        if (!options.apiEndpoint) {
            throw new Error('No API endpoint configured');
        }
        const response = await fetch(`${options.apiEndpoint}/events`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(options.apiKey
                    ? { Authorization: `Bearer ${options.apiKey}` }
                    : {}),
            },
            body: JSON.stringify(event),
        });
        if (!response.ok) {
            throw new Error(`Failed to create event: HTTP ${response.status}`);
        }
        const created = await response.json();
        setEvents((prev) => [...prev, created]);
        return created;
    }, [options.apiEndpoint, options.apiKey]);
    // Delete event
    const deleteEvent = React.useCallback(async (eventId) => {
        if (!options.apiEndpoint) {
            throw new Error('No API endpoint configured');
        }
        const response = await fetch(`${options.apiEndpoint}/events/${eventId}`, {
            method: 'DELETE',
            headers: options.apiKey
                ? { Authorization: `Bearer ${options.apiKey}` }
                : {},
        });
        if (!response.ok) {
            throw new Error(`Failed to delete event: HTTP ${response.status}`);
        }
        setEvents((prev) => prev.filter((e) => e.id !== eventId));
    }, [options.apiEndpoint, options.apiKey]);
    return {
        events,
        loading,
        error,
        fetchEvents,
        createEvent,
        deleteEvent,
    };
}
/**
 * Hook for checking availability
 */
export function useAvailabilityCheck(options) {
    const [availability, setAvailability] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    // Check availability
    const checkAvailability = React.useCallback(async (start, end, attendees) => {
        if (!options.apiEndpoint)
            return [];
        const targetAttendees = attendees || options.attendees || [];
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${options.apiEndpoint}/availability`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(options.apiKey
                        ? { Authorization: `Bearer ${options.apiKey}` }
                        : {}),
                },
                body: JSON.stringify({
                    start: start.toISOString(),
                    end: end.toISOString(),
                    attendees: targetAttendees,
                }),
            });
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            const data = await response.json();
            const slots = (data.slots || []).map((s) => ({
                ...s,
                start: new Date(s.start),
                end: new Date(s.end),
            }));
            setAvailability(slots);
            return slots;
        }
        catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to check availability';
            setError(message);
            throw err;
        }
        finally {
            setLoading(false);
        }
    }, [options.apiEndpoint, options.apiKey, options.attendees]);
    // Find next available slot
    const findNextAvailable = React.useCallback((duration = 60 // minutes
    ) => {
        const durationMs = duration * 60 * 1000;
        for (const slot of availability) {
            if (slot.status === 'free') {
                const slotDuration = slot.end.getTime() - slot.start.getTime();
                if (slotDuration >= durationMs) {
                    return slot;
                }
            }
        }
        return null;
    }, [availability]);
    // Get busy times
    const getBusyTimes = React.useCallback(() => {
        return availability.filter((slot) => slot.status === 'busy');
    }, [availability]);
    // Get free times
    const getFreeTimes = React.useCallback(() => {
        return availability.filter((slot) => slot.status === 'free');
    }, [availability]);
    return {
        availability,
        loading,
        error,
        checkAvailability,
        findNextAvailable,
        getBusyTimes,
        getFreeTimes,
    };
}
//# sourceMappingURL=calendar-integration.js.map