'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { Activity, Zap } from 'lucide-react'

const mockData = [
  { time: '00:00', requests: 1200, latency: 200, errors: 5 },
  { time: '01:00', requests: 1350, latency: 245, errors: 8 },
  { time: '02:00', requests: 1100, latency: 180, errors: 3 },
  { time: '03:00', requests: 1450, latency: 280, errors: 12 },
  { time: '04:00', requests: 1300, latency: 220, errors: 6 },
  { time: '05:00', requests: 1500, latency: 250, errors: 9 },
]

export function RealTimeMonitor() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-xl font-semibold">Real-Time Monitoring</h2>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span>Live</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Request Rate */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            Request Rate (per hour)
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={mockData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="time" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Area type="monotone" dataKey="requests" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Latency */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            Average Latency (ms)
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={mockData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="time" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Line type="monotone" dataKey="latency" stroke="#8b5cf6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
