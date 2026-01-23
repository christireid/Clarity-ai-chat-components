import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'RAG Integration - Clarity Chat Cookbook',
  description: 'Recipe for integrating RAG (Retrieval Augmented Generation) into your chat application.',
}

export default function RAGIntegrationPage() {
  redirect('/cookbook/rag-document-chat')
}
