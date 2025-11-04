import * as React from 'react';
export type AttachmentType = 'image' | 'audio' | 'video' | 'file' | 'link';
export interface AttachmentPreview {
    id: string;
    type: AttachmentType;
    title: string;
    description?: string;
    thumbnailUrl?: string;
    status?: 'processing' | 'ready' | 'failed';
    durationMs?: number;
    sizeLabel?: string;
    metadata?: Array<{
        label: string;
        value: string;
    }>;
}
export interface MultiModalPreviewProps {
    attachments: AttachmentPreview[];
    onOpen?: (attachment: AttachmentPreview) => void;
    onRetry?: (attachment: AttachmentPreview) => void;
    onRemove?: (attachment: AttachmentPreview) => void;
    className?: string;
    title?: string;
    subtitle?: string;
}
export declare const MultiModalPreview: React.FC<MultiModalPreviewProps>;
//# sourceMappingURL=multi-modal-preview.d.ts.map