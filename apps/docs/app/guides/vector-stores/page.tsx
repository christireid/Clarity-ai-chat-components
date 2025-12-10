import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Vector Stores Guide - Clarity Chat',
  description: 'Guide to using vector stores for semantic search and RAG applications.',
}

export default function VectorStoresGuidePage() {
  redirect('/guides/rag')
}
