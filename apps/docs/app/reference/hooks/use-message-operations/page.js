import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const metadata = {
    title: 'useMessageOperations | Clarity Chat',
    description: 'CRUD operations for messages with undo/redo, branching, and versioning.'
};
export default function UseMessageOperationsPage() {
    return (_jsxs("div", { className: "max-w-5xl mx-auto px-4 py-8", children: [_jsx("h1", { className: "text-4xl font-bold mb-4", children: "useMessageOperations" }), _jsx("p", { className: "text-xl text-muted-foreground mb-8", children: "Complete message management with CRUD operations, undo/redo, conversation branching, and edit history." }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Usage" }), _jsx("pre", { className: "bg-muted p-4 rounded-lg overflow-x-auto", children: _jsx("code", { children: `import { useMessageOperations } from '@clarity-chat/react'

const {
  messages,
  addMessage,
  editMessage,
  deleteMessage,
  regenerateMessage,
  branchConversation,
  undo,
  redo,
  canUndo,
  canRedo
} = useMessageOperations({
  initialMessages: [],
  onEdit: (id, content) => console.log('Edited:', id)
})

// Add message
const id = addMessage({
  role: 'user',
  content: 'Hello'
})

// Edit with version tracking
editMessage(id, 'Hello, world!')

// Undo/redo
<button onClick={undo} disabled={!canUndo}>Undo</button>
<button onClick={redo} disabled={!canRedo}>Redo</button>` }) })] }), _jsxs("section", { children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Features" }), _jsxs("ul", { className: "list-disc list-inside space-y-2 text-muted-foreground", children: [_jsx("li", { children: "Add, edit, delete messages" }), _jsx("li", { children: "Regenerate AI responses" }), _jsx("li", { children: "Branch conversations" }), _jsx("li", { children: "Undo/redo with history" }), _jsx("li", { children: "Message versioning" }), _jsx("li", { children: "Editing mode tracking" })] })] })] }));
}
//# sourceMappingURL=page.js.map