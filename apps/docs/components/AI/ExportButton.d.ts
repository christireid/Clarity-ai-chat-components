import { type ExportMessage, type ExportMetadata } from '@/lib/ai/conversationExport';
export interface ExportButtonProps {
    messages: ExportMessage[];
    metadata?: Partial<ExportMetadata>;
    className?: string;
    variant?: 'compact' | 'full';
}
export declare function ExportButton({ messages, metadata, className, variant, }: ExportButtonProps): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=ExportButton.d.ts.map