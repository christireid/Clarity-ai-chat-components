export let rules: {
    /**
     * Rule: no-hardcoded-duration
     * Prevents hardcoded animation duration values.
     * Enforces use of duration tokens from animation library.
     */
    'no-hardcoded-duration': {
        meta: {
            type: string;
            docs: {
                description: string;
                category: string;
                recommended: boolean;
            };
            fixable: string;
            messages: {
                useTokens: string;
            };
            schema: never[];
        };
        create(context: any): {
            Property(node: any): void;
        };
    };
    /**
     * Rule: no-layout-animation
     * Prevents animating layout-triggering properties (width, height, top, left).
     * Enforces GPU-accelerated properties (transform, opacity) for 60fps performance.
     */
    'no-layout-animation': {
        meta: {
            type: string;
            docs: {
                description: string;
                category: string;
                recommended: boolean;
            };
            messages: {
                useTransform: string;
            };
            schema: never[];
        };
        create(context: any): {
            Property(node: any): void;
        };
    };
    /**
     * Rule: prefer-animation-library
     * Suggests using animation library variants instead of inline animations.
     */
    'prefer-animation-library': {
        meta: {
            type: string;
            docs: {
                description: string;
                category: string;
                recommended: boolean;
            };
            messages: {
                useLibrary: string;
            };
            schema: never[];
        };
        create(context: any): {
            JSXAttribute(node: any): void;
        };
    };
    /**
     * Rule: require-reduced-motion
     * Ensures animations respect prefers-reduced-motion accessibility preference.
     */
    'require-reduced-motion': {
        meta: {
            type: string;
            docs: {
                description: string;
                category: string;
                recommended: boolean;
            };
            messages: {
                addReducedMotion: string;
            };
            schema: never[];
        };
        create(context: any): {
            JSXOpeningElement(node: any): void;
        };
    };
};
//# sourceMappingURL=index.d.ts.map