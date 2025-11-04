import * as React from 'react';
import type { SavedPrompt, MessageAttachment } from '@clarity-chat/types';
export interface InputSuggestion {
    id: string;
    type: 'prompt' | 'command' | 'mention';
    label: string;
    description?: string;
    value: string;
    icon?: string;
}
export interface AdvancedChatInputProps {
    value: string;
    onChange: (value: string) => void;
    onSubmit: (value: string, attachments?: MessageAttachment[]) => void;
    suggestions?: InputSuggestion[];
    onSuggestionRequest?: (query: string, trigger: '@' | '/') => Promise<InputSuggestion[]>;
    onFileUpload?: (files: File[]) => Promise<MessageAttachment[]>;
    maxFiles?: number;
    acceptedFileTypes?: string[];
    onLinkPaste?: (url: string) => Promise<{
        title: string;
        description?: string;
        image?: string;
    }>;
    savedPrompts?: SavedPrompt[];
    onPromptSelect?: (prompt: SavedPrompt) => void;
    disabled?: boolean;
    placeholder?: string;
    maxLength?: number;
    className?: string;
}
export declare const AdvancedChatInput: React.ForwardRefExoticComponent<AdvancedChatInputProps & React.RefAttributes<HTMLTextAreaElement>>;
//# sourceMappingURL=advanced-chat-input.d.ts.map