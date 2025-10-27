/**
 * In-memory document storage
 * Production should use a database (PostgreSQL, MongoDB, etc.)
 */

import type { Document } from '../types/document'

// In-memory storage
const documents: Document[] = []

export function getDocuments(): Document[] {
  return documents
}

export function addDocument(document: Document): void {
  documents.push(document)
}

export function removeDocument(documentId: string): boolean {
  const index = documents.findIndex(doc => doc.id === documentId)
  if (index === -1) return false
  
  documents.splice(index, 1)
  return true
}

export function getDocumentById(documentId: string): Document | undefined {
  return documents.find(doc => doc.id === documentId)
}
