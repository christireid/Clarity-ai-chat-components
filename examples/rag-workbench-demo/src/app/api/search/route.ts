/**
 * Search API - Find relevant chunks
 */

import { NextRequest, NextResponse } from 'next/server'
import { searchChunks, extractSources } from '@/lib/rag'
import { getDocuments } from '../documents/route'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query, documentIds, topK = 3 } = body
    
    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      )
    }
    
    // Get documents
    const documents = getDocuments()
    
    if (documents.length === 0) {
      return NextResponse.json(
        { error: 'No documents uploaded yet' },
        { status: 404 }
      )
    }
    
    // Search for relevant chunks
    const searchResults = searchChunks(query, documents, topK, documentIds)
    
    if (searchResults.length === 0) {
      return NextResponse.json({
        results: [],
        message: 'No relevant chunks found'
      })
    }
    
    // Extract sources
    const sources = extractSources(searchResults)
    
    return NextResponse.json({
      results: searchResults.map((result, index) => ({
        documentId: result.document.id,
        documentName: result.document.name,
        chunkId: result.chunk.id,
        text: result.chunk.text,
        score: result.score,
        tokens: result.chunk.tokens,
        source: sources[index]
      })),
      total: searchResults.length
    })
    
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    )
  }
}
