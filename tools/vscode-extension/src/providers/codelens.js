/**
 * CodeLens Provider for Clarity Chat
 *
 * Shows inline hints and quick actions for API calls
 */
import * as vscode from 'vscode';
export class CodeLensProvider {
    constructor() {
        this.codeLenses = [];
        this._onDidChangeCodeLenses = new vscode.EventEmitter();
        this.onDidChangeCodeLenses = this._onDidChangeCodeLenses.event;
    }
    provideCodeLenses(document, token) {
        this.codeLenses = [];
        const text = document.getText();
        // Find OpenAI API calls
        this.findAPIPattern(document, /openai\.chat\.completions\.create/g, 'OpenAI');
        // Find Anthropic API calls
        this.findAPIPattern(document, /anthropic\.messages\.create/g, 'Anthropic');
        // Find Google AI API calls
        this.findAPIPattern(document, /generateContent(Stream)?/g, 'Google AI');
        return this.codeLenses;
    }
    findAPIPattern(document, pattern, provider) {
        const text = document.getText();
        let match;
        while ((match = pattern.exec(text)) !== null) {
            const position = document.positionAt(match.index);
            const line = document.lineAt(position.line);
            const range = new vscode.Range(position, position);
            // Add info lens
            const infoLens = new vscode.CodeLens(range);
            infoLens.command = {
                title: `💡 ${provider} API Call`,
                command: '',
                tooltip: `This line makes a call to ${provider}`
            };
            this.codeLenses.push(infoLens);
            // Add documentation lens
            const docsLens = new vscode.CodeLens(range);
            docsLens.command = {
                title: '📖 View Docs',
                command: 'vscode.open',
                arguments: [vscode.Uri.parse(this.getDocsUrl(provider))],
                tooltip: `Open ${provider} documentation`
            };
            this.codeLenses.push(docsLens);
            // Add test lens
            const testLens = new vscode.CodeLens(range);
            testLens.command = {
                title: '🧪 Test Call',
                command: 'clarity-chat.testAPICall',
                arguments: [provider, line.text],
                tooltip: 'Test this API call'
            };
            this.codeLenses.push(testLens);
        }
    }
    getDocsUrl(provider) {
        const urls = {
            'OpenAI': 'https://platform.openai.com/docs/api-reference/chat',
            'Anthropic': 'https://docs.anthropic.com/claude/reference/messages_post',
            'Google AI': 'https://ai.google.dev/api/rest/v1/models/generateContent'
        };
        return urls[provider] || 'https://github.com/clarity-chat/clarity-chat';
    }
    refresh() {
        this._onDidChangeCodeLenses.fire();
    }
}
//# sourceMappingURL=codelens.js.map