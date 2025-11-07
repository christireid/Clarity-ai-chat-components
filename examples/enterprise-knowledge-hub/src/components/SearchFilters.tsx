import { Filter } from 'lucide-react'
import type { SearchFilters as IFilters } from '../types'

interface SearchFiltersProps {
  filters: IFilters
  onChange: (filters: IFilters) => void
}

export function SearchFilters({ filters, onChange }: SearchFiltersProps) {
  const documentTypes = ['PDF', 'Word', 'Excel', 'Text', 'Markdown']
  const dateRanges = ['Today', 'This Week', 'This Month', 'All Time']

  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-xl p-4 border border-gray-200 dark:border-gray-700">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Filter className="w-4 h-4" />
        Filters
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            Document Type
          </label>
          <div className="space-y-1">
            {documentTypes.map((type) => (
              <label key={type} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.types?.includes(type)}
                  onChange={(e) => {
                    const types = e.target.checked
                      ? [...(filters.types || []), type]
                      : filters.types?.filter((t) => t !== type) || []
                    onChange({ ...filters, types })
                  }}
                  className="rounded"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">{type}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            Date Range
          </label>
          <select
            value={filters.dateRange || 'All Time'}
            onChange={(e) => onChange({ ...filters, dateRange: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm"
          >
            {dateRanges.map((range) => (
              <option key={range} value={range}>
                {range}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
