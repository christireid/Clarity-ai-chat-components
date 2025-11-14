import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'useDebounce | Clarity Chat',
  description: 'Debounce values and callbacks for performance optimization.'
}

export default function UseDebouncePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">useDebounce</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Debounce values and callbacks to reduce unnecessary function calls and improve performance.
      </p>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Usage</h2>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
          <code>{`import { useDebounce, useDebouncedCallback } from '@clarity-chat/react'

// Debounce value
const [searchTerm, setSearchTerm] = useState('')
const debouncedSearch = useDebounce(searchTerm, 500)

useEffect(() => {
  searchAPI(debouncedSearch)
}, [debouncedSearch])

// Debounce callback
const debouncedSave = useDebouncedCallback(
  (value) => saveToAPI(value),
  1000
)

<input onChange={(e) => debouncedSave(e.target.value)} />`}</code>
        </pre>
      </section>

      <section>
        <h2 className="text-3xl font-semibold mb-4">Functions</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li><strong>useDebounce(value, delay):</strong> Returns debounced value</li>
          <li><strong>useDebouncedCallback(fn, delay):</strong> Returns debounced function</li>
        </ul>
      </section>
    </div>
  )
}
