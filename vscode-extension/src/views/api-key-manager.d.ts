/**
 * API Key Manager Webview
 * Secure API key management UI for VSCode
 */
import * as vscode from 'vscode';
export declare class ApiKeyManager {
    static currentPanel: ApiKeyManager | undefined;
    private readonly panel;
    private disposables;
    private constructor();
    static createOrShow(context: vscode.ExtensionContext): void;
    dispose(): void;
    private update;
    private saveApiKey;
    private deleteApiKey;
    private validateApiKey;
    private getHtmlForWebview;
}
//# sourceMappingURL=api-key-manager.d.ts.map