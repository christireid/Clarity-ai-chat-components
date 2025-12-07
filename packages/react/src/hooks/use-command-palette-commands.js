/**
 * Hook to generate command palette items for message operations
 *
 * This hook provides a convenient way to add message operation commands
 * to the CommandPalette component, including keyboard shortcuts and
 * proper integration with useMessageOperations.
 */
'use client';
import { useMemo } from 'react';
/**
 * Generate command palette items for message operations
 *
 * @example
 * ```tsx
 * const commands = useCommandPaletteCommands({
 *   selectedMessageId: currentMessageId,
 *   isUserMessage: currentMessage?.role === 'user',
 *   isAssistantMessage: currentMessage?.role === 'assistant',
 *   onEdit: handleEdit,
 *   onRegenerate: handleRegenerate,
 *   onDelete: handleDelete,
 *   undo,
 *   redo,
 *   canUndo,
 *   canRedo,
 * })
 *
 * <CommandPalette items={commands} open={open} onClose={onClose} />
 * ```
 */
export function useCommandPaletteCommands(options) {
    const { selectedMessageId, isUserMessage = false, isAssistantMessage = false, onEdit, onRegenerate, onDelete, undo, redo, canUndo = false, canRedo = false, additionalCommands = [], includeMessageOperations = true, includeUndoRedo = true, } = options;
    return useMemo(() => {
        const commands = [];
        // Message operation commands
        if (includeMessageOperations && selectedMessageId) {
            // Edit command (user messages only)
            if (isUserMessage && onEdit) {
                commands.push({
                    id: 'edit-message',
                    label: 'Edit Message',
                    description: 'Edit the selected message',
                    shortcut: ['Ctrl', 'E'],
                    category: 'Message',
                    onSelect: () => {
                        onEdit(selectedMessageId);
                    },
                });
            }
            // Regenerate command (assistant messages only)
            if (isAssistantMessage && onRegenerate) {
                commands.push({
                    id: 'regenerate-message',
                    label: 'Regenerate Response',
                    description: 'Regenerate the AI response',
                    shortcut: ['Ctrl', 'R'],
                    category: 'Message',
                    onSelect: () => {
                        onRegenerate(selectedMessageId);
                    },
                });
            }
            // Delete command (all messages)
            if (onDelete) {
                commands.push({
                    id: 'delete-message',
                    label: 'Delete Message',
                    description: 'Delete the selected message',
                    shortcut: ['Ctrl', 'D'],
                    category: 'Message',
                    onSelect: () => {
                        onDelete(selectedMessageId);
                    },
                });
            }
        }
        // Undo/Redo commands
        if (includeUndoRedo) {
            if (undo) {
                commands.push({
                    id: 'undo',
                    label: 'Undo',
                    description: 'Undo last operation',
                    shortcut: ['Ctrl', 'Z'],
                    category: 'Edit',
                    onSelect: () => {
                        if (canUndo)
                            undo();
                    },
                });
            }
            if (redo) {
                commands.push({
                    id: 'redo',
                    label: 'Redo',
                    description: 'Redo last undone operation',
                    shortcut: ['Ctrl', 'Y'],
                    category: 'Edit',
                    onSelect: () => {
                        if (canRedo)
                            redo();
                    },
                });
            }
        }
        // Add additional custom commands
        if (additionalCommands.length > 0) {
            commands.push(...additionalCommands);
        }
        return commands;
    }, [
        selectedMessageId,
        isUserMessage,
        isAssistantMessage,
        onEdit,
        onRegenerate,
        onDelete,
        undo,
        redo,
        canUndo,
        canRedo,
        includeMessageOperations,
        includeUndoRedo,
        additionalCommands,
    ]);
}
//# sourceMappingURL=use-command-palette-commands.js.map