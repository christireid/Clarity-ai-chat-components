import { useState, FormEvent } from 'react'

interface JoinFormProps {
  onJoin: (data: { username: string; room: string }) => void
}

export function JoinForm({ onJoin }: JoinFormProps) {
  const [username, setUsername] = useState('')
  const [room, setRoom] = useState('general')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (username.trim()) {
      onJoin({ username: username.trim(), room })
    }
  }

  return (
    <div style={{
      maxWidth: '400px',
      margin: '0 auto',
      padding: '2rem',
    }}>
      <h2 style={{ 
        fontSize: '1.5rem', 
        fontWeight: 'bold', 
        marginBottom: '1rem',
        textAlign: 'center',
      }}>
        Join Multi-User Chat
      </h2>
      <form onSubmit={handleSubmit} style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '1rem',
      }}>
        <div>
          <label htmlFor="username" style={{ 
            display: 'block', 
            marginBottom: '0.5rem', 
            fontWeight: 500,
          }}>
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid rgba(128, 128, 128, 0.3)',
              borderRadius: '6px',
              fontSize: '1rem',
            }}
            placeholder="Enter your username"
          />
        </div>
        
        <div>
          <label htmlFor="room" style={{ 
            display: 'block', 
            marginBottom: '0.5rem', 
            fontWeight: 500,
          }}>
            Room
          </label>
          <select
            id="room"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid rgba(128, 128, 128, 0.3)',
              borderRadius: '6px',
              fontSize: '1rem',
            }}
          >
            <option value="general">General</option>
            <option value="tech">Tech Support</option>
            <option value="sales">Sales</option>
            <option value="random">Random</option>
          </select>
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
          Join Chat
        </button>
      </form>
    </div>
  )
}
