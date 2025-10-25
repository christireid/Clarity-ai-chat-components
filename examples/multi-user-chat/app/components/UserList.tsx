interface User {
  id: string
  username: string
  room: string
  joinedAt: number
}

interface UserListProps {
  users: User[]
  currentUserId: string
}

export function UserList({ users, currentUserId }: UserListProps) {
  return (
    <div style={{
      width: '250px',
      borderLeft: '1px solid rgba(128, 128, 128, 0.2)',
      padding: '1rem',
      overflowY: 'auto',
    }}>
      <h3 style={{
        fontSize: '1rem',
        fontWeight: 600,
        marginBottom: '1rem',
      }}>
        Active Users ({users.length})
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {users.map((user) => (
          <div
            key={user.id}
            style={{
              padding: '0.5rem',
              borderRadius: '6px',
              backgroundColor: user.id === currentUserId 
                ? 'rgba(37, 99, 235, 0.1)' 
                : 'rgba(128, 128, 128, 0.05)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#10b981',
            }} />
            <span style={{
              fontSize: '0.875rem',
              fontWeight: user.id === currentUserId ? 600 : 400,
            }}>
              {user.username}
              {user.id === currentUserId && ' (You)'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
