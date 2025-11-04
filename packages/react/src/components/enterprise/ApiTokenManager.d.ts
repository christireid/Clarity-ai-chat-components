import * as React from 'react';
export type TokenStatus = 'active' | 'expired' | 'revoked';
export interface ApiTokenRecord {
    id: string;
    label: string;
    createdAt: string;
    lastUsed?: string;
    scopes: string[];
    status: TokenStatus;
}
export interface ApiTokenManagerProps {
    tokens: ApiTokenRecord[];
    onCreate?: () => void;
    onRegenerate?: (token: ApiTokenRecord) => void;
    onRevoke?: (token: ApiTokenRecord) => void;
    className?: string;
}
export declare const ApiTokenManager: React.FC<ApiTokenManagerProps>;
//# sourceMappingURL=ApiTokenManager.d.ts.map