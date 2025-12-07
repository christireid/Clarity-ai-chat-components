import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Draggable } from '@clarity-chat/react';
import { useState } from 'react';
const meta = {
    title: 'Components/Navigation/Draggable',
    component: Draggable,
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: 'Make any element draggable with support for drag constraints, drop zones, and custom drag handlers. Built on Framer Motion.',
            },
        },
        layout: 'padded',
    },
};
export default meta;
export const Default = {
    render: () => (_jsx("div", { className: "p-8", children: _jsx(Draggable, { children: _jsx("div", { className: "w-32 h-32 bg-blue-500 rounded-lg cursor-grab active:cursor-grabbing flex items-center justify-center text-white font-semibold", children: "Drag me" }) }) })),
};
export const HorizontalOnly = {
    render: () => (_jsx("div", { className: "p-8", children: _jsx(Draggable, { axis: "x", children: _jsx("div", { className: "w-32 h-32 bg-green-500 rounded-lg cursor-grab active:cursor-grabbing flex items-center justify-center text-white font-semibold", children: "Drag X only" }) }) })),
};
export const VerticalOnly = {
    render: () => (_jsx("div", { className: "p-8", children: _jsx(Draggable, { axis: "y", children: _jsx("div", { className: "w-32 h-32 bg-purple-500 rounded-lg cursor-grab active:cursor-grabbing flex items-center justify-center text-white font-semibold", children: "Drag Y only" }) }) })),
};
export const WithCallbacks = {
    render: () => {
        const [status, setStatus] = useState('Ready to drag');
        return (_jsxs("div", { className: "space-y-4 p-8", children: [_jsx(Draggable, { onDragStart: () => setStatus('Dragging started'), onDragEnd: (info) => {
                        setStatus(`Drag ended at (${info.point.x.toFixed(0)}, ${info.point.y.toFixed(0)})`);
                    }, children: _jsx("div", { className: "w-32 h-32 bg-orange-500 rounded-lg cursor-grab active:cursor-grabbing flex items-center justify-center text-white font-semibold", children: "Drag me" }) }), _jsx("p", { className: "text-sm text-muted-foreground", children: status })] }));
    },
};
export const WithDropZone = {
    render: () => {
        const [dropped, setDropped] = useState(null);
        return (_jsxs("div", { className: "space-y-8 p-8", children: [_jsx(Draggable, { dragId: "item-1", onDrop: (targetId) => {
                        setDropped(targetId || 'outside');
                        alert(`Dropped in: ${targetId || 'outside zone'}`);
                    }, children: _jsx("div", { className: "w-32 h-32 bg-red-500 rounded-lg cursor-grab active:cursor-grabbing flex items-center justify-center text-white font-semibold", children: "Drag me" }) }), _jsxs("div", { className: "flex gap-4", children: [_jsx("div", { "data-drop-zone": "zone-1", className: "w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50", children: "Drop Zone 1" }), _jsx("div", { "data-drop-zone": "zone-2", className: "w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50", children: "Drop Zone 2" })] }), dropped && (_jsxs("p", { className: "text-sm text-muted-foreground", children: ["Last dropped in: ", dropped] }))] }));
    },
};
export const MultipleDraggables = {
    render: () => (_jsx("div", { className: "space-y-4 p-8", children: ['Item 1', 'Item 2', 'Item 3'].map((item, index) => (_jsx(Draggable, { dragId: `item-${index}`, children: _jsxs("div", { className: "w-full p-4 bg-blue-500 rounded-lg cursor-grab active:cursor-grabbing text-white font-semibold", children: [item, " - Drag me around"] }) }, index))) })),
};
export const Disabled = {
    render: () => (_jsx("div", { className: "p-8", children: _jsx(Draggable, { disabled: true, children: _jsx("div", { className: "w-32 h-32 bg-gray-400 rounded-lg cursor-not-allowed flex items-center justify-center text-white font-semibold opacity-50", children: "Disabled" }) }) })),
};
export const WithoutGhost = {
    render: () => (_jsx("div", { className: "p-8", children: _jsx(Draggable, { showGhost: false, children: _jsx("div", { className: "w-32 h-32 bg-indigo-500 rounded-lg cursor-grab active:cursor-grabbing flex items-center justify-center text-white font-semibold", children: "No ghost" }) }) })),
};
//# sourceMappingURL=Draggable.stories.js.map