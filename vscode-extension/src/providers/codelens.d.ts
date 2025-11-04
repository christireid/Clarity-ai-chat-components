/**
 * CodeLens Provider for Clarity Chat
 *
 * Shows inline hints and quick actions for API calls
 */
import * as vscode from 'vscode';
export declare class CodeLensProvider implements vscode.CodeLensProvider {
    private codeLenses;
    private _onDidChangeCodeLenses;
    readonly onDidChangeCodeLenses: vscode.Event<void>;
    provideCodeLenses(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.CodeLens[] | Thenable<vscode.CodeLens[]>;
    private findAPIPattern;
    private getDocsUrl;
    refresh(): void;
}
//# sourceMappingURL=codelens.d.ts.map