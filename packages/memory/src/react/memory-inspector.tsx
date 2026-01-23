/**
 * Memory Inspector Component
 *
 * React component for inspecting and debugging memory state
 */

import { useState, useEffect } from 'react'
import type { Memory, MemoryType, MemoryScope } from '../types'
import type { ClarityMemory } from '../memory-service'

export interface MemoryInspectorProps {
  memory: ClarityMemory
  className?: string
  showStats?: boolean
  showMemories?: boolean
  filterByType?: MemoryType[]
  filterByScope?: MemoryScope[]
  onMemorySelect?: (memory: Memory) => void
}

export function MemoryInspector({
  memory,
  className = '',
  showStats = true,
  showMemories = true,
  filterByType,
  filterByScope,
  onMemorySelect,
}: MemoryInspectorProps) {
  const [stats, setStats] = useState<any>(null)
  const [memories, setMemories] = useState<Memory[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null)

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- loadData is stable, only re-run on filter changes
  }, [memory, filterByType, filterByScope])

  const loadData = async () => {
    setLoading(true)
    try {
      const [statsData, inspectionData] = await Promise.all([
        memory.getStats(),
        memory.inspect(),
      ])
      setStats(statsData)

      let mems = inspectionData.memories

      // Apply filters
      if (filterByType && filterByType.length > 0) {
        mems = mems.filter((m) => filterByType.includes(m.type))
      }
      if (filterByScope && filterByScope.length > 0) {
        mems = mems.filter((m) => filterByScope.includes(m.scope))
      }

      setMemories(mems)
    } catch (error) {
      console.error('Failed to load memory data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMemoryClick = (mem: Memory) => {
    setSelectedMemory(mem)
    onMemorySelect?.(mem)
  }

  return (
    <div
      className={`memory-inspector ${className}`}
      style={{ fontFamily: 'monospace', fontSize: '12px' }}
    >
      {showStats && stats && (
        <div
          className="memory-stats"
          style={{
            marginBottom: '16px',
            padding: '12px',
            background: '#f5f5f5',
            borderRadius: '4px',
          }}
        >
          <h3
            style={{
              margin: '0 0 8px 0',
              fontSize: '14px',
              fontWeight: 'bold',
            }}
          >
            Memory Statistics
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '8px',
            }}
          >
            <div>
              <strong>Total:</strong> {stats.totalMemories}
            </div>
            <div>
              <strong>Tokens:</strong> {stats.tokenUsage.toLocaleString()}
            </div>
            <div>
              <strong>Avg Importance:</strong>{' '}
              {stats.averageImportance.toFixed(2)}
            </div>
            <div>
              <strong>Compression:</strong>{' '}
              {(stats.compressionRatio * 100).toFixed(1)}%
            </div>
          </div>

          <div style={{ marginTop: '12px' }}>
            <strong>By Type:</strong>
            <div style={{ marginLeft: '12px', marginTop: '4px' }}>
              {Object.entries(stats.byType).map(([type, count]) => (
                <div key={type}>
                  {type}: {count as number}
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '12px' }}>
            <strong>By Scope:</strong>
            <div style={{ marginLeft: '12px', marginTop: '4px' }}>
              {Object.entries(stats.byScope).map(([scope, count]) => (
                <div key={scope}>
                  {scope}: {count as number}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showMemories && (
        <div className="memory-list">
          <h3
            style={{
              margin: '0 0 8px 0',
              fontSize: '14px',
              fontWeight: 'bold',
            }}
          >
            Memories ({memories.length})
          </h3>
          {loading ? (
            <div>Loading...</div>
          ) : memories.length === 0 ? (
            <div style={{ color: '#666', fontStyle: 'italic' }}>
              No memories found
            </div>
          ) : (
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {memories.map((mem) => (
                <div
                  key={mem.id}
                  onClick={() => handleMemoryClick(mem)}
                  style={{
                    padding: '8px',
                    marginBottom: '4px',
                    background:
                      selectedMemory?.id === mem.id ? '#e3f2fd' : '#fff',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '4px',
                    }}
                  >
                    <span style={{ fontWeight: 'bold', fontSize: '11px' }}>
                      {mem.type} / {mem.scope}
                    </span>
                    <span style={{ fontSize: '11px', color: '#666' }}>
                      {(mem.importance ?? 0.5).toFixed(2)} •{' '}
                      {new Date(
                        mem.timestamp ?? mem.createdAt
                      ).toLocaleTimeString()}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#333' }}>
                    {mem.content.length > 100
                      ? `${mem.content.slice(0, 100)}...`
                      : mem.content}
                  </div>
                  {mem.tags && mem.tags.length > 0 && (
                    <div style={{ marginTop: '4px' }}>
                      {mem.tags.map((tag) => (
                        <span
                          key={tag}
                          style={{
                            display: 'inline-block',
                            padding: '2px 6px',
                            marginRight: '4px',
                            background: '#e0e0e0',
                            borderRadius: '2px',
                            fontSize: '10px',
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {selectedMemory && (
        <div
          className="memory-detail"
          style={{
            marginTop: '16px',
            padding: '12px',
            background: '#f9f9f9',
            border: '1px solid #ddd',
            borderRadius: '4px',
          }}
        >
          <h4
            style={{
              margin: '0 0 8px 0',
              fontSize: '13px',
              fontWeight: 'bold',
            }}
          >
            Memory Details
          </h4>
          <div style={{ fontSize: '11px', lineHeight: '1.6' }}>
            <div>
              <strong>ID:</strong> {selectedMemory.id}
            </div>
            <div>
              <strong>Type:</strong> {selectedMemory.type}
            </div>
            <div>
              <strong>Scope:</strong> {selectedMemory.scope}
            </div>
            <div>
              <strong>Importance:</strong>{' '}
              {(selectedMemory.importance ?? 0.5).toFixed(2)}
            </div>
            <div>
              <strong>Created:</strong>{' '}
              {new Date(
                selectedMemory.timestamp ?? selectedMemory.createdAt
              ).toLocaleString()}
            </div>
            <div>
              <strong>Access Count:</strong> {selectedMemory.accessCount}
            </div>
            {selectedMemory.compressed && (
              <div>
                <strong>Compressed:</strong> Yes
              </div>
            )}
            <div style={{ marginTop: '8px' }}>
              <strong>Content:</strong>
              <div
                style={{
                  marginTop: '4px',
                  padding: '8px',
                  background: '#fff',
                  borderRadius: '2px',
                }}
              >
                {selectedMemory.content}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
