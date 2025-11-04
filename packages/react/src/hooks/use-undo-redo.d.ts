export interface UndoRedoState<T> {
    past: T[];
    present: T;
    future: T[];
}
export interface UndoRedoActions<T> {
    set: (newPresent: T, clearFuture?: boolean) => void;
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;
    clear: () => void;
}
export interface UseUndoRedoOptions<T> {
    initialState: T;
    maxHistory?: number;
    onUndo?: (state: T) => void;
    onRedo?: (state: T) => void;
}
export declare const useUndoRedo: <T>({ initialState, maxHistory, onUndo, onRedo, }: UseUndoRedoOptions<T>) => [T, UndoRedoActions<T>];
export declare const useUndoRedoShortcuts: (undo: () => void, redo: () => void, enabled?: boolean) => void;
//# sourceMappingURL=use-undo-redo.d.ts.map