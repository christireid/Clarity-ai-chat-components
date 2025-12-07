/**
 * Conversation Branch Visualizer
 *
 * Provides a tree-based visualization for conversation branching,
 * similar to Claude's conversation branches feature.
 *
 * @blueprint Feature 2.3 - Conversation Branching
 * @priority HIGH
 * @status NEW - Implementation based on blueprint analysis
 */
'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@clarity-chat/primitives';
// ============================================================================
// Helper Functions
// ============================================================================
/**
 * Builds a tree structure from flat branch array
 */
function buildBranchTree(branches) {
    const branchMap = new Map();
    const rootNodes = [];
    // First pass: create all nodes
    branches.forEach(branch => {
        branchMap.set(branch.id, {
            ...branch,
            children: [],
            depth: 0,
        });
    });
    // Second pass: build tree structure and calculate depths
    branches.forEach(branch => {
        const node = branchMap.get(branch.id);
        if (branch.parentId === null) {
            rootNodes.push(node);
        }
        else {
            const parent = branchMap.get(branch.parentId);
            if (parent) {
                node.depth = parent.depth + 1;
                parent.children.push(node);
            }
        }
    });
    return rootNodes;
}
/**
 * Finds path from root to target branch
 */
function findBranchPath(nodes, targetId, path = []) {
    for (const node of nodes) {
        const currentPath = [...path, node.id];
        if (node.id === targetId) {
            return currentPath;
        }
        const found = findBranchPath(node.children, targetId, currentPath);
        if (found) {
            return found;
        }
    }
    return null;
}
function BranchNodeComponent({ node, isActive, isInActivePath, onSelect, onDelete, onRename, onCreateChild, compact = false, }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(node.title || 'Untitled Branch');
    const [isHovered, setIsHovered] = useState(false);
    const handleRename = () => {
        if (editTitle.trim() && editTitle !== node.title) {
            onRename?.(node.id, editTitle.trim());
        }
        setIsEditing(false);
    };
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleRename();
        }
        else if (e.key === 'Escape') {
            setEditTitle(node.title || 'Untitled Branch');
            setIsEditing(false);
        }
    };
    return (_jsxs("div", { className: "relative", children: [_jsxs(motion.div, { initial: { opacity: 0, x: -10 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: 10 }, className: cn('group relative flex items-center gap-2 p-2 rounded-lg border transition-all duration-150 ease-out', 'hover:shadow-[0_4px_6px_-1px_rgb(0_0_0_/_0.1),0_2px_4px_-2px_rgb(0_0_0_/_0.1)] cursor-pointer', isActive && 'border-blue-500 bg-blue-50 dark:bg-blue-900/20', isInActivePath && !isActive && 'border-blue-300 bg-blue-25 dark:bg-blue-900/10', !isActive && !isInActivePath && 'border-gray-200 dark:border-gray-700', compact ? 'text-sm' : 'text-base'), onMouseEnter: () => setIsHovered(true), onMouseLeave: () => setIsHovered(false), onClick: () => onSelect(node.id), children: [_jsx("div", { className: cn('flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center', isActive ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'), children: node.children.length > 0 ? '🌳' : '🌿' }), _jsx("div", { className: "flex-1 min-w-0", children: isEditing ? (_jsx("input", { type: "text", value: editTitle, onChange: (e) => setEditTitle(e.target.value), onBlur: handleRename, onKeyDown: handleKeyDown, className: cn('w-full px-2 py-1 border rounded', 'focus:outline-none focus:ring-2 focus:ring-blue-500'), autoFocus: true, onClick: (e) => e.stopPropagation() })) : (_jsxs("div", { children: [_jsx("div", { className: cn('font-medium truncate', isActive ? 'text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-gray-100'), children: node.title || 'Untitled Branch' }), !compact && node.metadata?.lastMessagePreview && (_jsx("div", { className: "text-xs text-gray-500 dark:text-gray-400 truncate", children: node.metadata.lastMessagePreview }))] })) }), !compact && (_jsxs("div", { className: "flex-shrink-0 text-xs text-gray-500 dark:text-gray-400", children: [node.metadata?.messageCount || 0, " msgs"] })), _jsx(AnimatePresence, { children: isHovered && (_jsxs(motion.div, { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.8 }, className: "flex gap-1", onClick: (e) => e.stopPropagation(), children: [onRename && (_jsx("button", { onClick: () => setIsEditing(true), className: "p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600", title: "Rename branch", "aria-label": "Rename branch", children: "\u270F\uFE0F" })), onCreateChild && (_jsx("button", { onClick: () => onCreateChild(node.id), className: "p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600", title: "Create child branch", "aria-label": "Create child branch", children: "\u2795" })), onDelete && node.children.length === 0 && (_jsx("button", { onClick: () => onDelete(node.id), className: "p-1 rounded hover:bg-red-200 dark:hover:bg-red-900", title: "Delete branch", "aria-label": "Delete branch", children: "\uD83D\uDDD1\uFE0F" }))] })) })] }), node.children.length > 0 && (_jsx("div", { className: cn('ml-6 mt-2 pl-4 border-l-2 border-gray-200 dark:border-gray-700 space-y-2'), children: node.children.map((child) => (_jsx(BranchNodeComponent, { node: child, isActive: isActive, isInActivePath: isInActivePath, onSelect: onSelect, onDelete: onDelete, onRename: onRename, onCreateChild: onCreateChild, compact: compact }, child.id))) }))] }));
}
// ============================================================================
// Main Component
// ============================================================================
export function ConversationBranchVisualizer({ branches, currentBranchId, onBranchSwitch, onBranchCreate, onBranchDelete, onBranchRename, maxDepth, compact = false, className, }) {
    // Build tree structure
    const branchTree = useMemo(() => buildBranchTree(branches), [branches]);
    // Find active path
    const activePath = useMemo(() => findBranchPath(branchTree, currentBranchId) || [], [branchTree, currentBranchId]);
    // Filter by max depth if specified
    const filteredTree = useMemo(() => {
        if (!maxDepth)
            return branchTree;
        function filterByDepth(nodes, currentDepth) {
            if (currentDepth >= maxDepth)
                return [];
            return nodes.map(node => ({
                ...node,
                children: filterByDepth(node.children, currentDepth + 1),
            }));
        }
        return filterByDepth(branchTree, 0);
    }, [branchTree, maxDepth]);
    // Render tree
    function renderTree(nodes) {
        return nodes.map((node) => (_jsx(BranchNodeComponent, { node: node, isActive: node.id === currentBranchId, isInActivePath: activePath.includes(node.id), onSelect: onBranchSwitch, onDelete: onBranchDelete, onRename: onBranchRename, onCreateChild: onBranchCreate, compact: compact }, node.id)));
    }
    return (_jsxs("div", { className: cn('conversation-branch-visualizer', className), children: [_jsxs("div", { className: "flex items-center justify-between mb-4 pb-2 border-b border-gray-200 dark:border-gray-700", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-gray-100", children: "Conversation Branches" }), _jsxs("div", { className: "text-sm text-gray-500 dark:text-gray-400", children: [branches.length, " ", branches.length === 1 ? 'branch' : 'branches'] })] }), _jsx("div", { className: "space-y-2", children: filteredTree.length > 0 ? (renderTree(filteredTree)) : (_jsx("div", { className: "text-center py-8 text-gray-500 dark:text-gray-400", children: "No branches found" })) }), !compact && (_jsx("div", { className: "mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400", children: _jsx("p", { children: "\uD83D\uDCA1 Click a branch to switch to it. Hover to see actions." }) }))] }));
}
export function useBranchManagement({ conversationId: _conversationId, onBranchChange }) {
    const [branches, setBranches] = useState([]);
    const [currentBranchId, setCurrentBranchId] = useState('main');
    // Create a new branch
    const createBranch = (parentBranchId, fromMessageId) => {
        const newBranch = {
            id: `branch-${Date.now()}`,
            parentId: parentBranchId,
            messageIds: fromMessageId ? [fromMessageId] : [],
            title: `Branch ${branches.length + 1}`,
            createdAt: new Date(),
            updatedAt: new Date(),
            metadata: {
                messageCount: fromMessageId ? 1 : 0,
            },
        };
        setBranches((prev) => [...prev, newBranch]);
        switchBranch(newBranch.id);
    };
    // Switch to a different branch
    const switchBranch = (branchId) => {
        setCurrentBranchId(branchId);
        onBranchChange?.(branchId);
    };
    // Delete a branch
    const deleteBranch = (branchId) => {
        setBranches((prev) => prev.filter((b) => b.id !== branchId));
        // If deleting current branch, switch to parent or main
        if (branchId === currentBranchId) {
            const branch = branches.find((b) => b.id === branchId);
            switchBranch(branch?.parentId || 'main');
        }
    };
    // Rename a branch
    const renameBranch = (branchId, newTitle) => {
        setBranches((prev) => prev.map((b) => b.id === branchId
            ? { ...b, title: newTitle, updatedAt: new Date() }
            : b));
    };
    return {
        branches,
        currentBranchId,
        createBranch,
        switchBranch,
        deleteBranch,
        renameBranch,
    };
}
export default ConversationBranchVisualizer;
//# sourceMappingURL=conversation-branch-visualizer.js.map