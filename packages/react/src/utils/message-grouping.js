/**
 * Message Grouping Utilities
 *
 * Utilities for grouping consecutive messages from the same sender
 * to reduce visual clutter and improve readability.
 */
/**
 * Time threshold for grouping messages (5 minutes)
 * Messages further apart than this will not be grouped
 */
const GROUP_TIME_THRESHOLD_MS = 5 * 60 * 1000; // 5 minutes
/**
 * Calculate message grouping information
 *
 * Groups consecutive messages from the same sender that are close in time.
 * First message in a group shows avatar and metadata, subsequent messages
 * in the group are more compact.
 *
 * @param messages - Array of messages
 * @param index - Index of the current message
 * @returns Grouping information for the message
 *
 * @example
 * ```tsx
 * const messages = [...]
 * const grouping = getMessageGrouping(messages, 0)
 *
 * <Message
 *   message={messages[0]}
 *   showAvatar={grouping.isGroupStart}
 *   {...grouping}
 * />
 * ```
 */
export function getMessageGrouping(messages, index) {
    const currentMessage = messages[index];
    const previousMessage = messages[index - 1];
    const nextMessage = messages[index + 1];
    if (!currentMessage) {
        return {
            isGroupStart: true,
            isGroupEnd: true,
            isGrouped: false,
            showTimestamp: true,
        };
    }
    // Check if previous message is from the same sender
    const hasPreviousSameSender = previousMessage &&
        previousMessage.role === currentMessage.role &&
        isWithinTimeThreshold(previousMessage, currentMessage);
    // Check if next message is from the same sender
    const hasNextSameSender = nextMessage &&
        nextMessage.role === currentMessage.role &&
        isWithinTimeThreshold(currentMessage, nextMessage);
    const isGroupStart = !hasPreviousSameSender;
    const isGroupEnd = !hasNextSameSender;
    const isGrouped = hasPreviousSameSender || hasNextSameSender;
    // Show timestamp on:
    // - Group start (first message in group)
    // - Group end (last message in group)
    // - Standalone messages (not grouped)
    const showTimestamp = isGroupStart || isGroupEnd || !isGrouped;
    return {
        isGroupStart,
        isGroupEnd,
        isGrouped,
        showTimestamp,
    };
}
/**
 * Check if two messages are within the time threshold for grouping
 *
 * @param message1 - First message
 * @param message2 - Second message
 * @returns Whether messages are close enough in time to be grouped
 */
function isWithinTimeThreshold(message1, message2) {
    // If either message doesn't have a createdAt, don't group
    if (!message1.createdAt || !message2.createdAt) {
        return false;
    }
    const time1 = new Date(message1.createdAt).getTime();
    const time2 = new Date(message2.createdAt).getTime();
    const timeDiff = Math.abs(time2 - time1);
    return timeDiff <= GROUP_TIME_THRESHOLD_MS;
}
/**
 * Calculate grouping for all messages in a list
 *
 * @param messages - Array of messages
 * @returns Array of grouping information for each message
 *
 * @example
 * ```tsx
 * const messages = [...]
 * const groupings = getMessageGroupings(messages)
 *
 * messages.map((message, index) => (
 *   <Message
 *     key={message.id}
 *     message={message}
 *     {...groupings[index]}
 *   />
 * ))
 * ```
 */
export function getMessageGroupings(messages) {
    return messages.map((_, index) => getMessageGrouping(messages, index));
}
/**
 * Format time separator for message groups
 *
 * Creates friendly time separators like "Today", "Yesterday", "Last Week"
 *
 * @param timestamp - ISO timestamp string
 * @returns Formatted time separator text
 *
 * @example
 * ```tsx
 * const separator = getTimeSeparator(message.timestamp)
 * // Returns: "Today", "Yesterday", "Monday", "Last Week", etc.
 * ```
 */
export function getTimeSeparator(timestamp) {
    const messageDate = new Date(timestamp);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    const messageDay = new Date(messageDate.getFullYear(), messageDate.getMonth(), messageDate.getDate());
    // Same day
    if (messageDay.getTime() === today.getTime()) {
        return 'Today';
    }
    // Yesterday
    if (messageDay.getTime() === yesterday.getTime()) {
        return 'Yesterday';
    }
    // Within last week
    if (messageDay >= lastWeek) {
        const days = [
            'Sunday',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
        ];
        return days[messageDay.getDay()];
    }
    // Older than a week
    const options = {
        month: 'short',
        day: 'numeric',
    };
    // Add year if not current year
    if (messageDay.getFullYear() !== now.getFullYear()) {
        options.year = 'numeric';
    }
    return messageDay.toLocaleDateString(undefined, options);
}
/**
 * Check if a time separator should be shown between two messages
 *
 * @param previousMessage - Previous message (or undefined if first)
 * @param currentMessage - Current message
 * @returns Whether to show a time separator
 *
 * @example
 * ```tsx
 * const showSeparator = shouldShowTimeSeparator(
 *   messages[index - 1],
 *   messages[index]
 * )
 *
 * {showSeparator && (
 *   <TimeSeparator>
 *     {getTimeSeparator(messages[index].timestamp)}
 *   </TimeSeparator>
 * )}
 * ```
 */
export function shouldShowTimeSeparator(previousMessage, currentMessage) {
    // Always show for first message
    if (!previousMessage) {
        return true;
    }
    // Don't show if either message lacks createdAt
    if (!previousMessage.createdAt || !currentMessage.createdAt) {
        return false;
    }
    const prevDate = new Date(previousMessage.createdAt);
    const currDate = new Date(currentMessage.createdAt);
    // Show separator if messages are on different days
    const prevDay = new Date(prevDate.getFullYear(), prevDate.getMonth(), prevDate.getDate());
    const currDay = new Date(currDate.getFullYear(), currDate.getMonth(), currDate.getDate());
    return prevDay.getTime() !== currDay.getTime();
}
//# sourceMappingURL=message-grouping.js.map