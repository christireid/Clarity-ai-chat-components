import * as React from 'react';
export interface SeatInviteDialogProps {
    triggerLabel?: string;
    roles?: string[];
    defaultRole?: string;
    onInvite?: (invite: {
        email: string;
        role: string;
        sendWelcome: boolean;
    }) => void;
    className?: string;
}
export declare const SeatInviteDialog: React.FC<SeatInviteDialogProps>;
//# sourceMappingURL=SeatInviteDialog.d.ts.map