/**
 * Beautiful spinner using Charm-style animations
 * Inspired by https://github.com/charmbracelet/bubbletea
 */
export declare class Spinner {
    private frames;
    private frameIndex;
    private interval;
    private text;
    private color;
    constructor(type?: 'dots' | 'arrow' | 'pulse' | 'default');
    start(text?: string): void;
    update(text: string): void;
    succeed(text?: string): void;
    fail(text?: string): void;
    warn(text?: string): void;
    info(text?: string): void;
    stop(): void;
    private render;
}
/**
 * Multi-spinner for parallel operations
 */
export declare class MultiSpinner {
    private spinners;
    private interval;
    private frameIndex;
    add(id: string, text: string): void;
    update(id: string, text: string): void;
    succeed(id: string, text?: string): void;
    fail(id: string, text?: string): void;
    private start;
    private render;
    private checkComplete;
    stop(): void;
}
/**
 * Progress bar with Charm-style visualization
 */
export declare class ProgressBar {
    private total;
    private current;
    private text;
    private width;
    constructor(total: number, text?: string);
    update(current: number, text?: string): void;
    increment(text?: string): void;
    complete(text?: string): void;
    private render;
}
//# sourceMappingURL=spinner.d.ts.map