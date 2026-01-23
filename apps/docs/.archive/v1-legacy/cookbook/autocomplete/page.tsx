import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Autocomplete - Clarity Chat Cookbook',
  description: 'Recipe for implementing autocomplete functionality in chat applications.',
}

export default function AutocompletePage() {
  redirect('/cookbook/streaming-setup')
}
