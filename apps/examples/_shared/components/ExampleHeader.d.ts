import React from 'react';
export interface ExampleHeaderProps {
    title: string;
    subtitle?: string;
    icon?: React.ReactNode;
    backLink?: string;
    backLabel?: string;
    actions?: React.ReactNode;
    variant?: 'light' | 'dark';
}
export declare function ExampleHeader({ title, subtitle, icon, backLink, backLabel, actions, variant, }: ExampleHeaderProps): any;
export default ExampleHeader;
//# sourceMappingURL=ExampleHeader.d.ts.map