import * as React from 'react';
export interface DragInfo {
    point: {
        x: number;
        y: number;
    };
    offset: {
        x: number;
        y: number;
    };
    velocity: {
        x: number;
        y: number;
    };
}
export interface DraggableProps {
    children: React.ReactNode;
    onDragStart?: () => void;
    onDragEnd?: (info: DragInfo) => void;
    onDrop?: (targetId: string | null) => void;
    dragId?: string;
    disabled?: boolean;
    axis?: 'x' | 'y' | 'both';
    showGhost?: boolean;
    className?: string;
}
export declare const Draggable: React.ForwardRefExoticComponent<DraggableProps & React.RefAttributes<HTMLDivElement>>;
export interface DropZoneProps {
    children: React.ReactNode;
    onDrop?: (dragId: string | null) => void;
    dropId: string;
    acceptTypes?: string[];
    isOver?: boolean;
    className?: string;
    activeClassName?: string;
}
export declare const DropZone: React.ForwardRefExoticComponent<DropZoneProps & React.RefAttributes<HTMLDivElement>>;
export interface UseDragDropOptions<T> {
    items: T[];
    onReorder?: (items: T[]) => void;
}
export declare const useDragDrop: <T extends {
    id: string;
}>({ items, onReorder, }: UseDragDropOptions<T>) => {
    draggingId: string | null;
    droppedOn: string | null;
    handleDragStart: (id: string) => void;
    handleDrop: (sourceId: string, targetId: string) => void;
    handleDragCancel: () => void;
};
//# sourceMappingURL=draggable.d.ts.map