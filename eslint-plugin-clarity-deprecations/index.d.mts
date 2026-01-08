declare namespace _default {
    let rules: {
        /**
         * Rule: no-deprecated-hooks
         * Warns when importing deprecated hooks and suggests replacements.
         */
        'no-deprecated-hooks': {
            meta: {
                type: string;
                docs: {
                    description: string;
                    category: string;
                    recommended: boolean;
                };
                fixable: string;
                messages: {
                    deprecatedHook: string;
                };
                schema: never[];
            };
            create(context: any): {
                ImportDeclaration(node: any): void;
            };
        };
        /**
         * Rule: no-deprecated-hook-calls
         * Warns when calling deprecated hooks and suggests replacements.
         */
        'no-deprecated-hook-calls': {
            meta: {
                type: string;
                docs: {
                    description: string;
                    category: string;
                    recommended: boolean;
                };
                messages: {
                    deprecatedCall: string;
                };
                schema: never[];
            };
            create(context: any): {
                CallExpression(node: any): void;
            };
        };
    };
}
export default _default;
//# sourceMappingURL=index.d.mts.map