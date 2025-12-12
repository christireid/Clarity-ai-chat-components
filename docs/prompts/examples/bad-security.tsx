// Example: Security Issues
// This file contains intentional security vulnerabilities for training purposes

'use server'

import { db } from '@/lib/db'

// ISSUE 1: No input validation on Server Action
export async function createUser(formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const role = formData.get('role') as string

  // Direct database insertion without validation
  await db.user.create({
    data: { name, email, role }
  })

  return { success: true }
}

// ISSUE 2: SQL injection vulnerability
export async function searchUsers(query: string) {
  // String concatenation in query - SQL injection!
  const users = await db.$queryRaw`
    SELECT * FROM users WHERE name LIKE '%${query}%'
  `
  return users
}

// ISSUE 3: Exposing secrets in client component
'use client'

import { useState } from 'react'

// Secret exposed to client bundle!
const API_KEY = process.env.OPENAI_API_KEY

export function ChatInterface() {
  const [messages, setMessages] = useState([])

  // ISSUE 4: dangerouslySetInnerHTML without sanitization
  const renderMessage = (content: string) => (
    <div dangerouslySetInnerHTML={{ __html: content }} />
  )

  // ISSUE 5: No CSRF consideration for sensitive action
  const deleteAccount = async () => {
    await fetch('/api/delete-account', { method: 'POST' })
  }

  return (
    <div>
      {messages.map((msg, i) => (
        <div key={i}>{renderMessage(msg.content)}</div>
      ))}
      <button onClick={deleteAccount}>Delete My Account</button>
    </div>
  )
}

// ISSUE 6: Environment variable without NEXT_PUBLIC prefix used client-side
export function ApiStatus() {
  // This will be undefined in browser, but indicates intent to use server secret
  const status = process.env.DATABASE_URL ? 'Connected' : 'Disconnected'
  return <div>{status}</div>
}
