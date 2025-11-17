/**
 * Diagnostics Provider
 * Provides real-time error detection and quick fixes for Clarity Chat code
 */
import * as vscode from 'vscode';
export declare class DiagnosticsProvider {
    private diagnosticCollection;
    constructor();
    /**
     * Update diagnostics for a document
     */
    updateDiagnostics(document: vscode.TextDocument): void;
    /**
     * Clear diagnostics for a document
     */
    clearDiagnostics(document: vscode.TextDocument): void;
    /**
     * Dispose
     */
    dispose(): void;
    private hasProviderImport;
    private hasApiKeyConfig;
    private hasAsyncChatCall;
    private hasTryCatch;
    private hasMultipleSequentialCalls;
    private hasHardcodedApiKey;
}
/**
 * Code Action Provider for Quick Fixes
 */
export declare class QuickFixProvider implements vscode.CodeActionProvider {
    provideCodeActions(document: vscode.TextDocument, range: vscode.Range | vscode.Selection, context: vscode.CodeActionContext): vscode.CodeAction[];
    private createDeprecationFix;
    private createErrorHandlingFix;
    private createApiKeyFix;
    private createAddApiKeyFix;
}
//# sourceMappingURL=diagnostics.d.ts.map