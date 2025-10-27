/**
 * Document management API
 * POST: Upload document
 * GET: List documents
 * DELETE: Delete document
 */

import { NextRequest, NextResponse } from 'next/server'
import { chunkDocument, approximateTokenCount } from '@/lib/rag'
import type { Document } from '@/types/document'

// In-memory storage (production should use database)
const documents: Document[] = []

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }
    
    // Validate file type
    const allowedTypes = ['text/plain', 'text/markdown', 'application/pdf']
    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(txt|md)$/)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload .txt or .md files' },
        { status: 400 }
      )
    }
    
    // Read file content
    const content = await file.text()
    
    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'File is empty' },
        { status: 400 }
      )
    }
    
    // Create document
    const documentId = `doc-${Date.now()}-${Math.random().toString(36).substring(7)}`
    const chunks = chunkDocument(content)
    
    // Set document ID on chunks
    chunks.forEach(chunk => {
      chunk.documentId = documentId
    })
    
    const document: Document = {
      id: documentId,
      name: file.name,
      content,
      createdAt: new Date(),
      size: content.length,
      chunks
    }
    
    documents.push(document)
    
    return NextResponse.json({
      success: true,
      documentId: document.id,
      name: document.name,
      chunks: chunks.length,
      tokens: approximateTokenCount(content),
      size: document.size
    })
    
  } catch (error) {
    console.error('Document upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload document' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Return document list without full content
    const documentList = documents.map(doc => ({
      id: doc.id,
      name: doc.name,
      createdAt: doc.createdAt,
      size: doc.size,
      chunks: doc.chunks.length,
      tokens: approximateTokenCount(doc.content)
    }))
    
    return NextResponse.json({
      documents: documentList,
      total: documents.length
    })
    
  } catch (error) {
    console.error('Document list error:', error)
    return NextResponse.json(
      { error: 'Failed to list documents' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const documentId = searchParams.get('id')
    
    if (!documentId) {
      return NextResponse.json(
        { error: 'Document ID required' },
        { status: 400 }
      )
    }
    
    const index = documents.findIndex(doc => doc.id === documentId)
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      )
    }
    
    documents.splice(index, 1)
    
    return NextResponse.json({
      success: true,
      message: 'Document deleted'
    })
    
  } catch (error) {
    console.error('Document delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete document' },
      { status: 500 }
    )
  }
}

// Export documents for other routes
export function getDocuments(): Document[] {
  return documents
}
