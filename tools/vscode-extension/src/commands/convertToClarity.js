/**
 * Convert to Clarity Chat Command
 * Helps migrate code from Vercel AI SDK or other chat libraries to Clarity Chat
 */
import * as vscode from 'vscode';
const IMPORT_CONVERSIONS = [
    {
        from: /import\s*{\s*useChat\s*}\s*from\s*['"]ai\/react['"]/g,
        to: "import { useClarityChat } from '@clarity-chat/react'",
        description: 'Import useChat from ai/react',
    },
    {
        from: /import\s*{\s*useChat\s*}\s*from\s*['"]ai['"]/g,
        to: "import { useClarityChat } from '@clarity-chat/react'",
        description: 'Import useChat from ai',
    },
    {
        from: /import\s*{\s*useCompletion\s*}\s*from\s*['"]ai\/react['"]/g,
        to: "import { useClarityChat } from '@clarity-chat/react'",
        description: 'Import useCompletion from ai/react',
    },
    {
        from: /import\s*{\s*Message\s*}\s*from\s*['"]ai['"]/g,
        to: "import type { CoreMessage } from '@clarity-chat/react'",
        description: 'Import Message type from ai',
    },
    {
        from: /import\s*{\s*StreamingTextResponse\s*}\s*from\s*['"]ai['"]/g,
        to: '// StreamingTextResponse is handled automatically by Clarity Chat API routes',
        description: 'Import StreamingTextResponse from ai',
    },
];
const HOOK_CONVERSIONS = [
    {
        from: /\buseChat\s*\(\s*\{/g,
        to: 'useClarityChat({',
        description: 'useChat hook',
    },
    {
        from: /\buseCompletion\s*\(\s*\{/g,
        to: 'useClarityChat({',
        description: 'useCompletion hook',
    },
];
const OPTION_CONVERSIONS = [
    {
        from: /onResponse\s*:/g,
        to: 'onStart:',
        description: 'onResponse option',
    },
    {
        from: /onFinish\s*:\s*\(\s*message\s*\)/g,
        to: 'onFinish: (message, context)',
        description: 'onFinish signature',
    },
    {
        from: /body\s*:\s*\{/g,
        to: 'requestBody: {',
        description: 'body option',
    },
    {
        from: /initialInput\s*:/g,
        to: 'initialValue:',
        description: 'initialInput option',
    },
];
const TYPE_CONVERSIONS = [
    {
        from: /:\s*Message\[\]/g,
        to: ': CoreMessage[]',
        description: 'Message[] type',
    },
    {
        from: /:\s*Message\b/g,
        to: ': CoreMessage',
        description: 'Message type',
    },
];
export async function convertToClarityCommand() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active editor found');
        return;
    }
    const document = editor.document;
    const text = document.getText();
    // Check if conversion is needed
    const hasVercelAI = text.includes("from 'ai") || text.includes('from "ai');
    const hasUseChat = text.includes('useChat');
    const hasAlreadyConverted = text.includes('@clarity-chat/react');
    if (!hasVercelAI && !hasUseChat) {
        const action = await vscode.window.showInformationMessage('No Vercel AI SDK usage detected in this file.', 'Show Migration Guide', 'Cancel');
        if (action === 'Show Migration Guide') {
            vscode.env.openExternal(vscode.Uri.parse('https://docs.claritychat.dev/migration'));
        }
        return;
    }
    if (hasAlreadyConverted) {
        const proceed = await vscode.window.showWarningMessage('This file already uses @clarity-chat/react. Continue with conversion?', 'Continue', 'Cancel');
        if (proceed !== 'Continue')
            return;
    }
    // Show preview of changes
    const changes = analyzeChanges(text);
    if (changes.length === 0) {
        vscode.window.showInformationMessage('No convertible patterns found in this file.');
        return;
    }
    // Show changes summary
    const changesSummary = changes.map((c) => `- ${c.description}`).join('\n');
    const proceed = await vscode.window.showInformationMessage(`Found ${changes.length} patterns to convert:\n\n${changesSummary.slice(0, 200)}${changesSummary.length > 200 ? '...' : ''}`, { modal: true }, 'Apply Changes', 'Preview Changes', 'Cancel');
    if (proceed === 'Cancel' || !proceed)
        return;
    if (proceed === 'Preview Changes') {
        await showPreview(document, changes);
        return;
    }
    // Apply changes
    await applyChanges(editor, text);
    // Show success message
    const action = await vscode.window.showInformationMessage(`Converted ${changes.length} patterns to Clarity Chat!`, 'View Migration Guide', 'Add Memory Support', 'Done');
    if (action === 'View Migration Guide') {
        vscode.env.openExternal(vscode.Uri.parse('https://docs.claritychat.dev/migration'));
    }
    else if (action === 'Add Memory Support') {
        // Insert memory configuration
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const snippet = new vscode.SnippetString(`
// Add memory support
memory: {
  enabled: true,
  strategy: '\${1|hybrid,sliding-window,summarization|}',
  maxTokens: \${2:2000},
},`);
            await editor.insertSnippet(snippet);
        }
    }
}
function analyzeChanges(text) {
    const changes = [];
    const allPatterns = [
        ...IMPORT_CONVERSIONS,
        ...HOOK_CONVERSIONS,
        ...OPTION_CONVERSIONS,
        ...TYPE_CONVERSIONS,
    ];
    for (const pattern of allPatterns) {
        if (pattern.from.test(text)) {
            changes.push(pattern);
        }
        // Reset regex lastIndex
        pattern.from.lastIndex = 0;
    }
    return changes;
}
async function applyChanges(editor, originalText) {
    let newText = originalText;
    // Apply all conversions
    const allPatterns = [
        ...IMPORT_CONVERSIONS,
        ...HOOK_CONVERSIONS,
        ...OPTION_CONVERSIONS,
        ...TYPE_CONVERSIONS,
    ];
    for (const pattern of allPatterns) {
        newText = newText.replace(pattern.from, pattern.to);
    }
    // Replace entire document
    const fullRange = new vscode.Range(editor.document.positionAt(0), editor.document.positionAt(originalText.length));
    await editor.edit((editBuilder) => {
        editBuilder.replace(fullRange, newText);
    });
}
async function showPreview(document, _changes) {
    const originalText = document.getText();
    let newText = originalText;
    // Apply all conversions
    const allPatterns = [
        ...IMPORT_CONVERSIONS,
        ...HOOK_CONVERSIONS,
        ...OPTION_CONVERSIONS,
        ...TYPE_CONVERSIONS,
    ];
    for (const pattern of allPatterns) {
        newText = newText.replace(pattern.from, pattern.to);
    }
    // Show diff
    const originalUri = document.uri;
    const modifiedUri = originalUri.with({ scheme: 'clarity-preview' });
    // Register content provider for preview
    const provider = new (class {
        provideTextDocumentContent() {
            return newText;
        }
    })();
    const disposable = vscode.workspace.registerTextDocumentContentProvider('clarity-preview', provider);
    // Show diff
    await vscode.commands.executeCommand('vscode.diff', originalUri, modifiedUri, `Migration Preview: ${document.fileName.split('/').pop()}`);
    // Show apply option
    const action = await vscode.window.showInformationMessage('Review the changes above. Apply them?', 'Apply Changes', 'Cancel');
    disposable.dispose();
    if (action === 'Apply Changes') {
        const editor = vscode.window.activeTextEditor;
        if (editor && editor.document.uri.toString() === document.uri.toString()) {
            await applyChanges(editor, originalText);
            vscode.window.showInformationMessage('Changes applied successfully!');
        }
    }
}
//# sourceMappingURL=convertToClarity.js.map