import * as React from 'react';
export interface LinkMetadata {
    url: string;
    title?: string;
    description?: string;
    image?: string;
    siteName?: string;
    favicon?: string;
}
export interface LinkPreviewProps {
    metadata: LinkMetadata;
    onClick?: () => void;
    onRemove?: () => void;
    loading?: boolean;
    className?: string;
}
export declare const LinkPreview: React.NamedExoticComponent<LinkPreviewProps>;
export declare function useLinkPreview(): {
    loading: boolean;
    metadata: LinkMetadata | null;
    error: string | null;
    fetchMetadata: (url: string) => Promise<LinkMetadata>;
    reset: () => void;
};
export interface InlineLinkProps {
    url: string;
    onPreview?: (url: string) => void;
    children?: React.ReactNode;
    className?: string;
}
export declare const InlineLink: React.NamedExoticComponent<InlineLinkProps>;
//# sourceMappingURL=link-preview.d.ts.map