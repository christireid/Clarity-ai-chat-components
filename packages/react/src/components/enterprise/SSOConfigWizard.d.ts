import * as React from 'react';
export interface SSOConfigStep {
    id: string;
    title: string;
    description: string;
    status?: 'pending' | 'in-progress' | 'complete';
}
export interface SSOConfigWizardProps {
    providerName?: string;
    steps: SSOConfigStep[];
    metadata?: {
        acsUrl: string;
        entityId: string;
    };
    notes?: string;
    onNotesChange?: (value: string) => void;
    onDownloadMetadata?: () => void;
    onSubmit?: () => void;
    className?: string;
}
export declare const SSOConfigWizard: React.FC<SSOConfigWizardProps>;
//# sourceMappingURL=SSOConfigWizard.d.ts.map