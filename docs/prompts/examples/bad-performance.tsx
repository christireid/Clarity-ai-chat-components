// Example: Performance Issues
// This file contains intentional performance problems for training purposes

'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns' // ISSUE: Could use lighter alternative

interface User {
  id: string
  name: string
  email: string
  createdAt: Date
}

interface UserListProps {
  users: User[]
  onSelect: (user: User) => void
}

// ISSUE 1: Component not memoized, receives object props
export function UserList({ users, onSelect }: UserListProps) {
  // ISSUE 2: Sorting on every render without memoization
  const sortedUsers = users.sort((a, b) => a.name.localeCompare(b.name))

  // ISSUE 3: Creating new function on every render
  const handleClick = (user: User) => {
    console.log('Selected:', user.name)
    onSelect(user)
  }

  return (
    <ul>
      {sortedUsers.map((user) => (
        // ISSUE 4: UserCard not memoized
        <UserCard key={user.id} user={user} onClick={() => handleClick(user)} />
      ))}
    </ul>
  )
}

// ISSUE 5: Not using React.memo
function UserCard({ user, onClick }: { user: User; onClick: () => void }) {
  return (
    <li onClick={onClick} className="p-4 border rounded">
      {/* ISSUE 6: Not using next/image */}
      <img src={`/avatars/${user.id}.png`} alt={user.name} />
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      <span>{format(user.createdAt, 'PPP')}</span>
    </li>
  )
}

// ISSUE 7: Heavy component not code-split
import { HeavyChartLibrary } from 'heavy-chart-library'

export function Dashboard() {
  const [data, setData] = useState([])

  // ISSUE 8: Object in dependency array (unstable reference)
  const options = { limit: 10, sort: 'desc' }

  useEffect(() => {
    fetchData(options).then(setData)
  }, [options]) // Will run on every render!

  // ISSUE 9: Derived state instead of computing during render
  const [filteredData, setFilteredData] = useState([])

  useEffect(() => {
    setFilteredData(data.filter((item) => item.active))
  }, [data])

  return (
    <div>
      <HeavyChartLibrary data={filteredData} />
    </div>
  )
}

// ISSUE 10: Not using next/font
export function Header() {
  return (
    <header style={{ fontFamily: 'Inter, sans-serif' }}>
      <h1>Dashboard</h1>
    </header>
  )
}
