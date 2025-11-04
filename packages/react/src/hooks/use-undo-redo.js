import * as React from 'react';
export const useUndoRedo = ({ initialState, maxHistory = 50, onUndo, onRedo, }) => {
    const [state, setState] = React.useState({
        past: [],
        present: initialState,
        future: [],
    });
    const set = React.useCallback((newPresent, clearFuture = true) => {
        setState(currentState => {
            const newPast = [...currentState.past, currentState.present].slice(-maxHistory);
            return {
                past: newPast,
                present: newPresent,
                future: clearFuture ? [] : currentState.future,
            };
        });
    }, [maxHistory]);
    const undo = React.useCallback(() => {
        setState(currentState => {
            if (currentState.past.length === 0)
                return currentState;
            const previous = currentState.past[currentState.past.length - 1];
            const newPast = currentState.past.slice(0, currentState.past.length - 1);
            onUndo?.(previous);
            return {
                past: newPast,
                present: previous,
                future: [currentState.present, ...currentState.future],
            };
        });
    }, [onUndo]);
    const redo = React.useCallback(() => {
        setState(currentState => {
            if (currentState.future.length === 0)
                return currentState;
            const next = currentState.future[0];
            const newFuture = currentState.future.slice(1);
            onRedo?.(next);
            return {
                past: [...currentState.past, currentState.present],
                present: next,
                future: newFuture,
            };
        });
    }, [onRedo]);
    const clear = React.useCallback(() => {
        setState({
            past: [],
            present: initialState,
            future: [],
        });
    }, [initialState]);
    const canUndo = state.past.length > 0;
    const canRedo = state.future.length > 0;
    return [
        state.present,
        {
            set,
            undo,
            redo,
            canUndo,
            canRedo,
            clear,
        },
    ];
};
// Keyboard shortcuts for undo/redo
export const useUndoRedoShortcuts = (undo, redo, enabled = true) => {
    React.useEffect(() => {
        if (!enabled)
            return;
        const handleKeyDown = (e) => {
            const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
            const modifier = isMac ? e.metaKey : e.ctrlKey;
            if (modifier && e.key === 'z' && !e.shiftKey) {
                e.preventDefault();
                undo();
            }
            else if (modifier && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
                e.preventDefault();
                redo();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [undo, redo, enabled]);
};
//# sourceMappingURL=use-undo-redo.js.map