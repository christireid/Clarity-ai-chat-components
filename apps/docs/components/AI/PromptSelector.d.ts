import { type PromptTemplate } from '@/lib/ai/promptTemplates';
export interface PromptSelectorProps {
    value?: string;
    onChange?: (templateId: string) => void;
    className?: string;
    variant?: 'dropdown' | 'tabs' | 'cards';
}
export declare function PromptSelector({ value, onChange, className, variant, }: PromptSelectorProps): import("react/jsx-runtime").JSX.Element;
/**
 * Compact mode selector (for toolbar)
 */
export declare function CompactPromptSelector({ value, onChange, className, }: Omit<PromptSelectorProps, 'variant'>): import("react/jsx-runtime").JSX.Element;
/**
 * Get current selected prompt template from localStorage
 */
export declare function useSelectedPrompt(): [PromptTemplate, (id: string) => void];
//# sourceMappingURL=PromptSelector.d.ts.map