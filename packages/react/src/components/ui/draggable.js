'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@clarity-chat/primitives';
import { ANIMATION_DURATION, EASING_FRAMER, DURATION_SECONDS as durations, } from '../../animations/constants';
export function Draggable({ children, onDragStart, onDragEnd, onDrop, dragId, disabled = false, axis = 'both', showGhost = true, className, ref, }) {
    const [isDragging, setIsDragging] = React.useState(false);
    const handleDragStart = () => {
        if (disabled)
            return;
        setIsDragging(true);
        onDragStart?.();
    };
    const handleDragEnd = (_event, info) => {
        setIsDragging(false);
        onDragEnd?.(info);
        // Detect drop target
        const element = document.elementFromPoint(info.point.x, info.point.y);
        const dropZone = element?.closest('[data-drop-zone]');
        const targetId = dropZone?.getAttribute('data-drop-zone') || null;
        onDrop?.(targetId);
    };
    const dragConstraints = React.useMemo(() => {
        if (axis === 'x')
            return { top: 0, bottom: 0 };
        if (axis === 'y')
            return { left: 0, right: 0 };
        return undefined;
    }, [axis]);
    return (_jsx(motion.div, { ref: ref, drag: !disabled, dragConstraints: dragConstraints, dragElastic: 0.1, dragMomentum: false, onDragStart: handleDragStart, onDragEnd: handleDragEnd, whileDrag: {
            scale: 1.05,
            opacity: showGhost ? 0.7 : 1,
            zIndex: 50,
            cursor: 'grabbing',
        }, animate: {
            scale: isDragging ? 1.05 : 1,
            rotate: isDragging ? 2 : 0,
        }, transition: {
            type: 'spring',
            stiffness: 300,
            damping: 20,
        }, className: cn('touch-none', !disabled && 'cursor-grab active:cursor-grabbing', isDragging && 'shadow-[0_24px_48px_rgba(15,23,42,0.32)]', className), "data-drag-id": dragId, children: children }));
}
Draggable.displayName = 'Draggable';
export function DropZone({ children, onDrop, dropId, className, activeClassName, ref, }) {
    const [isHovered, setIsHovered] = React.useState(false);
    const handleDragEnter = (e) => {
        e.preventDefault();
        setIsHovered(true);
    };
    const handleDragLeave = () => {
        setIsHovered(false);
    };
    const handleDragOver = (e) => {
        e.preventDefault();
    };
    const handleDrop = (e) => {
        e.preventDefault();
        setIsHovered(false);
        // Get the dragged element ID
        const dragId = e.dataTransfer.getData('text/plain');
        onDrop?.(dragId || null);
    };
    return (_jsxs(motion.div, { ref: ref, "data-drop-zone": dropId, onDragEnter: handleDragEnter, onDragLeave: handleDragLeave, onDragOver: handleDragOver, onDrop: handleDrop, animate: {
            scale: isHovered ? 1.02 : 1,
            borderColor: isHovered ? 'rgb(59, 130, 246)' : 'transparent',
        }, transition: {
            duration: ANIMATION_DURATION.fast / 1000,
            ease: EASING_FRAMER.out,
        }, className: cn('relative border-2 border-dashed rounded-lg transition-all', isHovered && (activeClassName || 'border-primary bg-primary/5'), className), children: [isHovered && (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "absolute inset-0 pointer-events-none", children: _jsx(motion.div, { animate: {
                        scale: [1, 1.05, 1],
                        opacity: [0.5, 0.8, 0.5],
                    }, transition: {
                        repeat: Infinity,
                        duration: durations.slower,
                        ease: 'easeInOut',
                    }, className: "absolute inset-0 rounded-lg bg-primary/10" }) })), children] }));
}
DropZone.displayName = 'DropZone';
export const useDragDrop = ({ items, onReorder, }) => {
    const [draggingId, setDraggingId] = React.useState(null);
    const [droppedOn, setDroppedOn] = React.useState(null);
    const handleDragStart = React.useCallback((id) => {
        setDraggingId(id);
    }, []);
    const handleDrop = React.useCallback((sourceId, targetId) => {
        setDraggingId(null);
        setDroppedOn(targetId);
        if (sourceId === targetId)
            return;
        const sourceIndex = items.findIndex((item) => item.id === sourceId);
        const targetIndex = items.findIndex((item) => item.id === targetId);
        if (sourceIndex === -1 || targetIndex === -1)
            return;
        const newItems = [...items];
        const [removed] = newItems.splice(sourceIndex, 1);
        if (removed !== undefined) {
            newItems.splice(targetIndex, 0, removed);
            onReorder?.(newItems);
        }
        // Clear dropped indicator after animation
        setTimeout(() => setDroppedOn(null), 500);
    }, [items, onReorder]);
    const handleDragCancel = React.useCallback(() => {
        setDraggingId(null);
    }, []);
    return {
        draggingId,
        droppedOn,
        handleDragStart,
        handleDrop,
        handleDragCancel,
    };
};
//# sourceMappingURL=draggable.js.map