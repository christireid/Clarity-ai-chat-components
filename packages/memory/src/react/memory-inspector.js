import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Memory Inspector Component
 *
 * React component for inspecting and debugging memory state
 */
import { useState, useEffect } from 'react';
export function MemoryInspector({ memory, className = '', showStats = true, showMemories = true, filterByType, filterByScope, onMemorySelect, }) {
    const [stats, setStats] = useState(null);
    const [memories, setMemories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedMemory, setSelectedMemory] = useState(null);
    useEffect(() => {
        loadData();
    }, [memory, filterByType, filterByScope]);
    const loadData = async () => {
        setLoading(true);
        try {
            const [statsData, inspectionData] = await Promise.all([
                memory.getStats(),
                memory.inspect(),
            ]);
            setStats(statsData);
            let mems = inspectionData.memories;
            // Apply filters
            if (filterByType && filterByType.length > 0) {
                mems = mems.filter(m => filterByType.includes(m.type));
            }
            if (filterByScope && filterByScope.length > 0) {
                mems = mems.filter(m => filterByScope.includes(m.scope));
            }
            setMemories(mems);
        }
        catch (error) {
            console.error('Failed to load memory data:', error);
        }
        finally {
            setLoading(false);
        }
    };
    const handleMemoryClick = (mem) => {
        setSelectedMemory(mem);
        onMemorySelect?.(mem);
    };
    return (_jsxs("div", { className: `memory-inspector ${className}`, style: { fontFamily: 'monospace', fontSize: '12px' }, children: [showStats && stats && (_jsxs("div", { className: "memory-stats", style: { marginBottom: '16px', padding: '12px', background: '#f5f5f5', borderRadius: '4px' }, children: [_jsx("h3", { style: { margin: '0 0 8px 0', fontSize: '14px', fontWeight: 'bold' }, children: "Memory Statistics" }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }, children: [_jsxs("div", { children: [_jsx("strong", { children: "Total:" }), " ", stats.totalMemories] }), _jsxs("div", { children: [_jsx("strong", { children: "Tokens:" }), " ", stats.tokenUsage.toLocaleString()] }), _jsxs("div", { children: [_jsx("strong", { children: "Avg Importance:" }), " ", stats.averageImportance.toFixed(2)] }), _jsxs("div", { children: [_jsx("strong", { children: "Compression:" }), " ", (stats.compressionRatio * 100).toFixed(1), "%"] })] }), _jsxs("div", { style: { marginTop: '12px' }, children: [_jsx("strong", { children: "By Type:" }), _jsx("div", { style: { marginLeft: '12px', marginTop: '4px' }, children: Object.entries(stats.byType).map(([type, count]) => (_jsxs("div", { children: [type, ": ", count] }, type))) })] }), _jsxs("div", { style: { marginTop: '12px' }, children: [_jsx("strong", { children: "By Scope:" }), _jsx("div", { style: { marginLeft: '12px', marginTop: '4px' }, children: Object.entries(stats.byScope).map(([scope, count]) => (_jsxs("div", { children: [scope, ": ", count] }, scope))) })] })] })), showMemories && (_jsxs("div", { className: "memory-list", children: [_jsxs("h3", { style: { margin: '0 0 8px 0', fontSize: '14px', fontWeight: 'bold' }, children: ["Memories (", memories.length, ")"] }), loading ? (_jsx("div", { children: "Loading..." })) : memories.length === 0 ? (_jsx("div", { style: { color: '#666', fontStyle: 'italic' }, children: "No memories found" })) : (_jsx("div", { style: { maxHeight: '400px', overflowY: 'auto' }, children: memories.map(mem => (_jsxs("div", { onClick: () => handleMemoryClick(mem), style: {
                                padding: '8px',
                                marginBottom: '4px',
                                background: selectedMemory?.id === mem.id ? '#e3f2fd' : '#fff',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                cursor: 'pointer',
                            }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }, children: [_jsxs("span", { style: { fontWeight: 'bold', fontSize: '11px' }, children: [mem.type, " / ", mem.scope] }), _jsxs("span", { style: { fontSize: '11px', color: '#666' }, children: [(mem.importance ?? 0.5).toFixed(2), " \u2022 ", new Date(mem.timestamp ?? mem.createdAt).toLocaleTimeString()] })] }), _jsx("div", { style: { fontSize: '12px', color: '#333' }, children: mem.content.length > 100 ? `${mem.content.slice(0, 100)}...` : mem.content }), mem.tags && mem.tags.length > 0 && (_jsx("div", { style: { marginTop: '4px' }, children: mem.tags.map(tag => (_jsx("span", { style: {
                                            display: 'inline-block',
                                            padding: '2px 6px',
                                            marginRight: '4px',
                                            background: '#e0e0e0',
                                            borderRadius: '2px',
                                            fontSize: '10px',
                                        }, children: tag }, tag))) }))] }, mem.id))) }))] })), selectedMemory && (_jsxs("div", { className: "memory-detail", style: {
                    marginTop: '16px',
                    padding: '12px',
                    background: '#f9f9f9',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                }, children: [_jsx("h4", { style: { margin: '0 0 8px 0', fontSize: '13px', fontWeight: 'bold' }, children: "Memory Details" }), _jsxs("div", { style: { fontSize: '11px', lineHeight: '1.6' }, children: [_jsxs("div", { children: [_jsx("strong", { children: "ID:" }), " ", selectedMemory.id] }), _jsxs("div", { children: [_jsx("strong", { children: "Type:" }), " ", selectedMemory.type] }), _jsxs("div", { children: [_jsx("strong", { children: "Scope:" }), " ", selectedMemory.scope] }), _jsxs("div", { children: [_jsx("strong", { children: "Importance:" }), " ", (selectedMemory.importance ?? 0.5).toFixed(2)] }), _jsxs("div", { children: [_jsx("strong", { children: "Created:" }), " ", new Date(selectedMemory.timestamp ?? selectedMemory.createdAt).toLocaleString()] }), _jsxs("div", { children: [_jsx("strong", { children: "Access Count:" }), " ", selectedMemory.accessCount] }), selectedMemory.compressed && _jsxs("div", { children: [_jsx("strong", { children: "Compressed:" }), " Yes"] }), _jsxs("div", { style: { marginTop: '8px' }, children: [_jsx("strong", { children: "Content:" }), _jsx("div", { style: { marginTop: '4px', padding: '8px', background: '#fff', borderRadius: '2px' }, children: selectedMemory.content })] })] })] }))] }));
}
//# sourceMappingURL=memory-inspector.js.map