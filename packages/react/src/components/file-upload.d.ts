import * as React from 'react';
import type { MessageAttachment } from '@clarity-chat/types';
export interface FileUploadProps {
    onUpload: (files: File[]) => Promise<MessageAttachment[]>;
    maxFiles?: number;
    maxFileSize?: number;
    acceptedFileTypes?: string[];
    className?: string;
}
export declare const FileUpload: React.NamedExoticComponent<FileUploadProps>;
//# sourceMappingURL=file-upload.d.ts.map