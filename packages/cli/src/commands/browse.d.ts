/**
 * Browse command - Interactive component browser using Bubble Tea
 * Utilizes Charm's Bubble Tea framework for beautiful TUI
 * https://github.com/charmbracelet/bubbletea
 */
/**
 * Display beautiful component browser in terminal
 */
export declare function browseCommand(): Promise<void>;
/**
 * Interactive component selector with filtering
 */
export declare function selectComponent(): Promise<string | null>;
/**
 * Show component details
 */
export declare function showComponentDetails(componentName: string): Promise<void>;
/**
 * Install component interactively
 */
export declare function installComponentInteractive(componentName: string): Promise<void>;
/**
 * Search components
 */
export declare function searchComponents(query: string): Promise<void>;
//# sourceMappingURL=browse.d.ts.map