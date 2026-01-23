import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Agent Setup Guide - Clarity Chat',
  description: 'Guide to setting up AI agents with tools and custom behaviors.',
}

export default function AgentSetupGuidePage() {
  redirect('/guides/agents')
}
