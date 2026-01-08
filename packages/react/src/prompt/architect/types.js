/**
 * Architect Framework Types
 *
 * Type definitions for the Principal Software Architect & Engineering Lead
 * AI prompt engineering framework.
 *
 * @packageDocumentation
 */
/**
 * Default architect configuration
 */
export const DEFAULT_ARCHITECT_CONFIG = {
    styleGuide: {
        language: 'typescript',
        styleGuide: 'airbnb',
        naming: {
            variables: 'camelCase',
            functions: 'camelCase',
            classes: 'PascalCase',
            constants: 'SCREAMING_SNAKE_CASE',
            files: 'kebab-case',
        },
        preferImmutability: true,
        strictTyping: true,
        maxLineLength: 100,
        indentation: 'spaces',
        indentSize: 2,
    },
    documentation: {
        requirePublicDocs: true,
        requireParamDocs: true,
        requireReturnDocs: true,
        requireThrowsDocs: true,
        requireExamples: false,
    },
    enableSecurityScan: true,
    enableCodeSmellDetection: true,
    enableDebtAssessment: true,
    strictMode: false,
};
//# sourceMappingURL=types.js.map