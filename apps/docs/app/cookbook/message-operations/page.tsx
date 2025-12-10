import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Message Operations - Clarity Chat Cookbook',
  description: 'Recipes for common message operations like editing, deleting, and branching.',
}

export default function MessageOperationsRecipePage() {
  redirect('/guides/message-operations')
}
