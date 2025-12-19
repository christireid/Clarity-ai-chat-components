import type { Metadata } from 'next'
import { StructuredInputBuilderWrapper } from './wrapper'

export const metadata: Metadata = {
  title: 'StructuredInputBuilder | Clarity Chat',
  description:
    'Build complex structured prompts with token optimization, field prioritization, validation, and automatic prompt formatting.',
}

export default function StructuredInputBuilderPage() {
  return <StructuredInputBuilderWrapper />
}
