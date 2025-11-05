import * as React from 'react';
import type { UserSettings } from '@clarity-chat/types';
export interface SettingsPanelProps {
    settings: UserSettings;
    onUpdate: (settings: Partial<UserSettings>) => void;
    onReset?: () => void;
    className?: string;
}
export declare const SettingsPanel: React.NamedExoticComponent<SettingsPanelProps>;
//# sourceMappingURL=settings-panel.d.ts.map