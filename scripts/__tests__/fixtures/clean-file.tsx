// Test fixture: Clean file with no issues
'use client'

import { useState, useCallback } from 'react'

interface ButtonProps {
  label: string
  onClick: () => void
}

export function CleanButton({ label, onClick }: ButtonProps) {
  const [count, setCount] = useState(0)

  const handleClick = useCallback(() => {
    setCount((c) => c + 1)
    onClick()
  }, [onClick])

  return (
    <button
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      onClick={handleClick}
    >
      {label} ({count})
    </button>
  )
}
