'use client'

import { Database, Table, Search } from 'lucide-react'
import { useState } from 'react'

export function DataExplorer() {
  const [selectedTable, setSelectedTable] = useState<string | null>(null)

  const tables = [
    { name: 'sales', columns: ['id', 'date', 'amount', 'region', 'product'], rowCount: 12450 },
    { name: 'users', columns: ['id', 'email', 'created_at', 'status'], rowCount: 8470 },
    { name: 'products', columns: ['id', 'name', 'category', 'price'], rowCount: 234 },
    { name: 'orders', columns: ['id', 'user_id', 'total', 'status', 'created_at'], rowCount: 15230 },
  ]

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Data Explorer</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Explore your data sources and schemas
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tables List */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="font-semibold flex items-center">
                <Database className="w-5 h-5 mr-2" />
                Data Sources
              </h2>
            </div>
            <div className="p-4">
              <div className="space-y-2">
                {tables.map((table) => (
                  <button
                    key={table.name}
                    onClick={() => setSelectedTable(table.name)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedTable === table.name
                        ? 'bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800'
                        : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Table className="w-4 h-4" />
                        <span className="font-medium">{table.name}</span>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {table.rowCount.toLocaleString()} rows
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Table Details */}
        <div className="lg:col-span-2">
          {selectedTable ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="font-semibold capitalize">{selectedTable}</h2>
              </div>
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Columns
                </h3>
                <div className="space-y-2">
                  {tables.find(t => t.name === selectedTable)?.columns.map((column, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded"
                    >
                      <code className="text-sm">{column}</code>
                      <span className="text-xs text-gray-500 dark:text-gray-400">string</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
              <Search className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 dark:text-gray-400">
                Select a table to view its schema
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
