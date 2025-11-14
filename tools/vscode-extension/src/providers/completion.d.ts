/**
 * Completion Provider for Clarity Chat
 *
 * Provides intelligent code completion for AI SDKs
 */
import * as vscode from 'vscode';
export declare class CompletionProvider implements vscode.CompletionItemProvider {
    provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList>;
    private getOpenAICompletions;
    private getAnthropicCompletions;
    private getGoogleAICompletions;
    private getModelCompletions;
    private getEnvCompletions;
}
//# sourceMappingURL=completion.d.ts.map