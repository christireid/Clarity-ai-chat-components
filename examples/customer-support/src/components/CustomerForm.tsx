'use client'

import { useState, FormEvent } from 'react'

interface CustomerFormProps {
  onSubmit: (data: { email: string; name: string; subject: string }) => void
}

export function CustomerForm({ onSubmit }: CustomerFormProps) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [subject, setSubject] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (email && name && subject) {
      onSubmit({ email, name, subject })
    }
  }

  return (
    <div style={{
      maxWidth: '500px',
      margin: '0 auto',
      padding: '2rem',
    }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        Start a Support Conversation
      </h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
            Your Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid rgba(128, 128, 128, 0.3)',
              borderRadius: '6px',
              fontSize: '1rem',
            }}
            placeholder="John Doe"
          />
        </div>
        
        <div>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid rgba(128, 128, 128, 0.3)',
              borderRadius: '6px',
              fontSize: '1rem',
            }}
            placeholder="john@example.com"
          />
        </div>
        
        <div>
          <label htmlFor="subject" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
            Subject
          </label>
          <input
            id="subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid rgba(128, 128, 128, 0.3)',
              borderRadius: '6px',
              fontSize: '1rem',
            }}
            placeholder="How can we help you?"
          />
        </div>
        
        <button
          type="submit"
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Start Chat
        </button>
      </form>
    </div>
  )
}
