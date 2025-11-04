/**
 * Hover Provider for Clarity Chat
 *
 * Provides documentation on hover for AI models and APIs
 */
import * as vscode from 'vscode';
export declare class HoverProvider implements vscode.HoverProvider {
    provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Hover>;
    private createModelHover;
    private createEnvVarHover;
}
//# sourceMappingURL=hover.d.ts.map