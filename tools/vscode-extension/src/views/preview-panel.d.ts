/**
 * Component Preview Panel
 * Shows live preview of Clarity Chat components in VSCode
 */
import * as vscode from 'vscode';
export declare class PreviewPanel {
    static currentPanel: PreviewPanel | undefined;
    private readonly panel;
    private disposables;
    private constructor();
    static createOrShow(extensionUri: vscode.Uri): void;
    static revive(panel: vscode.WebviewPanel, extensionUri: vscode.Uri): void;
    dispose(): void;
    private update;
    private getHtmlForWebview;
}
//# sourceMappingURL=preview-panel.d.ts.map