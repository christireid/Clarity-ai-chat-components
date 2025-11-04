import * as React from 'react';
import type { KnowledgeBase, KnowledgeSection } from '@clarity-chat/types';
export interface KnowledgeBaseViewerProps {
    knowledgeBase: KnowledgeBase;
    onUpdate?: (sectionId: string, updates: Partial<KnowledgeSection>) => void;
    onDelete?: (sectionId: string) => void;
    onExport?: (format: 'pdf' | 'docx' | 'markdown') => void;
    editable?: boolean;
    className?: string;
}
export declare const KnowledgeBaseViewer: React.NamedExoticComponent<KnowledgeBaseViewerProps>;
//# sourceMappingURL=knowledge-base-viewer.d.ts.map