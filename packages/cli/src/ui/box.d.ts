/**
 * Beautiful box drawing utilities
 * Inspired by https://github.com/charmbracelet/lipgloss
 */
export interface BoxOptions {
    title?: string;
    titleAlign?: 'left' | 'center' | 'right';
    padding?: number;
    margin?: number;
    borderStyle?: 'single' | 'double' | 'rounded' | 'bold' | 'none';
    borderColor?: (text: string) => string;
    width?: number;
    height?: number;
}
/**
 * Create a beautiful box around text
 */
export declare function box(content: string, options?: BoxOptions): string;
/**
 * Create a simple panel
 */
export declare function panel(content: string, title?: string): string;
/**
 * Create a success box
 */
export declare function successBox(content: string, title?: string): string;
/**
 * Create an error box
 */
export declare function errorBox(content: string, title?: string): string;
/**
 * Create a warning box
 */
export declare function warningBox(content: string, title?: string): string;
/**
 * Create an info box
 */
export declare function infoBox(content: string, title?: string): string;
/**
 * Create a horizontal rule
 */
export declare function hr(width?: number, char?: string): string;
/**
 * Create a table
 */
export interface TableColumn {
    header: string;
    width?: number;
    align?: 'left' | 'center' | 'right';
}
export declare function table(data: string[][], columns: TableColumn[]): string;
/**
 * Create a tree view
 */
export interface TreeNode {
    label: string;
    children?: TreeNode[];
    icon?: string;
}
export declare function tree(nodes: TreeNode[], prefix?: string): string;
/**
 * Create a list with bullets
 */
export declare function list(items: string[], bullet?: string): string;
/**
 * Create a numbered list
 */
export declare function numberedList(items: string[]): string;
//# sourceMappingURL=box.d.ts.map