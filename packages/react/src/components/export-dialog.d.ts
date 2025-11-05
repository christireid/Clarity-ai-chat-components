import * as React from 'react';
import type { ExportOptions } from '@clarity-chat/types';
export interface ExportDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onExport: (options: ExportOptions) => Promise<void>;
    resourceType: 'chat' | 'project' | 'knowledge-base';
    resourceName: string;
    className?: string;
}
export declare const ExportDialog: React.NamedExoticComponent<ExportDialogProps>;
//# sourceMappingURL=export-dialog.d.ts.map