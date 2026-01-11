'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { Trash } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'

interface Chart {
  chartType: string
  title: string
  data: any[]
}

interface ChartGalleryProps {
  charts: Chart[]
}

export function ChartGallery({ charts }: ChartGalleryProps) {
  const shouldReduceMotion = useReducedMotion()

  if (charts.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <span className="text-4xl opacity-50">📊</span>
        <p className="text-sm">No charts generated yet</p>
        <p className="text-xs mt-1">
          Ask a question to create your first chart
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {charts.map((chart, idx) => (
        <motion.div
          key={idx}
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={shouldReduceMotion ? { duration: 0 } : { delay: idx * 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-sm">{chart.title}</h4>
            <button className="text-gray-400 hover:text-red-500 transition-colors">
              <Trash className="w-4 h-4" />
            </button>
          </div>
          <div className="h-48">
            {chart.chartType === 'bar' && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chart.data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="region" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip />
                  <Bar dataKey="sales" fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
            )}
            {chart.chartType === 'line' && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chart.data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#6366f1"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
            {chart.chartType === 'pie' && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chart.data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chart.data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b'][
                            index % 4
                          ]
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
