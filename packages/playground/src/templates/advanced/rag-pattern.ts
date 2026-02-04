/**
 * RAG Pattern Template
 *
 * Retrieval-Augmented Generation pattern demo
 */

import type { PlaygroundTemplate } from '../../types'

export const ragPattern: PlaygroundTemplate = {
  id: 'rag-pattern',
  name: 'RAG Pattern',
  description: 'Retrieval-Augmented Generation pattern demo',
  category: 'advanced',
  tags: ['rag', 'retrieval', 'knowledge-base'],
  code: `import React, { useState } from 'react'

function Component() {
  const [query, setQuery] = useState('')
  const [context, setContext] = useState('')
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Simulated knowledge base
  const knowledgeBase = [
    { id: 1, content: 'React is a JavaScript library for building user interfaces. It uses a component-based architecture.' },
    { id: 2, content: 'TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.' },
    { id: 3, content: 'Next.js is a React framework for building full-stack web applications.' },
  ]

  const handleQuery = async () => {
    if (!query.trim()) return

    setIsLoading(true)

    // Simulate retrieval delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // Simple keyword matching for demo
    const relevant = knowledgeBase.find(doc =>
      query.toLowerCase().split(' ').some(word =>
        doc.content.toLowerCase().includes(word)
      )
    )

    const retrievedContext = relevant?.content || 'No relevant context found in knowledge base.'
    setContext(retrievedContext)

    // Simulate generation delay
    await new Promise(resolve => setTimeout(resolve, 500))

    setResponse(\`Based on the retrieved context, here's my answer to "\${query}": \${retrievedContext}\`)
    setIsLoading(false)
  }

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '20px' }}>
      <h2>RAG Pattern Demo</h2>
      <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>
        Retrieval-Augmented Generation: Query → Retrieve → Generate
      </p>

      <div style={{ marginTop: '20px' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleQuery()}
          placeholder="Ask about React, TypeScript, or Next.js..."
          style={{
            width: '100%',
            padding: '12px',
            border: '2px solid #e0e0e0',
            borderRadius: '8px',
            fontSize: '14px'
          }}
        />

        <button
          onClick={handleQuery}
          disabled={!query.trim() || isLoading}
          style={{
            marginTop: '12px',
            padding: '10px 24px',
            background: (!query.trim() || isLoading) ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: (!query.trim() || isLoading) ? 'not-allowed' : 'pointer',
            fontWeight: 'bold'
          }}
        >
          {isLoading ? 'Processing...' : 'Retrieve & Generate'}
        </button>
      </div>

      {context && (
        <div style={{
          marginTop: '24px',
          padding: '16px',
          background: '#e7f3ff',
          border: '1px solid #b3d9ff',
          borderRadius: '8px'
        }}>
          <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', color: '#0066cc' }}>
            📚 RETRIEVED CONTEXT
          </div>
          <div style={{ fontSize: '14px', color: '#333' }}>
            {context}
          </div>
        </div>
      )}

      {response && (
        <div style={{
          marginTop: '16px',
          padding: '16px',
          background: '#f0f9f0',
          border: '1px solid #b3e6b3',
          borderRadius: '8px'
        }}>
          <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', color: '#28a745' }}>
            🤖 GENERATED RESPONSE
          </div>
          <div style={{ fontSize: '14px', color: '#333', lineHeight: 1.6 }}>
            {response}
          </div>
        </div>
      )}
    </div>
  )
}

export default Component`,
}
