import * as React from 'react';
import type { SavedPrompt, PromptCategory } from '@clarity-chat/types';
export interface PromptLibraryProps {
    prompts: SavedPrompt[];
    categories?: PromptCategory[];
    onUsePrompt: (prompt: SavedPrompt) => void;
    onSave?: (prompt: Omit<SavedPrompt, 'id' | 'createdAt' | 'updatedAt'>) => void;
    onEdit?: (promptId: string, updates: Partial<SavedPrompt>) => void;
    onDelete?: (promptId: string) => void;
    onToggleFavorite?: (promptId: string) => void;
    className?: string;
}
export declare const PromptLibrary: React.NamedExoticComponent<PromptLibraryProps>;
//# sourceMappingURL=prompt-library.d.ts.map