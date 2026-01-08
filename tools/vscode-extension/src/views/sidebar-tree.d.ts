/**
 * Clarity Chat Sidebar Tree View
 * Provides quick access to components, hooks, and tools in the Activity Bar
 */
import * as vscode from 'vscode';
type TreeItemType = 'category' | 'component' | 'hook' | 'tool' | 'snippet' | 'help';
interface ClarityTreeItem {
    label: string;
    type: TreeItemType;
    icon?: string;
    command?: string;
    description?: string;
    children?: ClarityTreeItem[];
    tooltip?: string;
}
declare class ClarityTreeNode extends vscode.TreeItem {
    readonly data: ClarityTreeItem;
    readonly collapsibleState: vscode.TreeItemCollapsibleState;
    constructor(data: ClarityTreeItem, collapsibleState: vscode.TreeItemCollapsibleState);
}
export declare class ClarityTreeDataProvider implements vscode.TreeDataProvider<ClarityTreeNode> {
    private _context;
    private _onDidChangeTreeData;
    readonly onDidChangeTreeData: vscode.Event<ClarityTreeNode | undefined | null | void>;
    constructor(_context: vscode.ExtensionContext);
    refresh(): void;
    getTreeItem(element: ClarityTreeNode): vscode.TreeItem;
    getChildren(element?: ClarityTreeNode): Thenable<ClarityTreeNode[]>;
    private createNodes;
    getParent(_element: ClarityTreeNode): vscode.ProviderResult<ClarityTreeNode>;
}
export {};
//# sourceMappingURL=sidebar-tree.d.ts.map