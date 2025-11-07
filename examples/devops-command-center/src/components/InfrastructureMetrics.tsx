import { Server, Database, Network, HardDrive } from 'lucide-react'
import type { InfrastructureMetrics as IMetrics } from '../types'

interface InfrastructureMetricsProps {
  metrics: IMetrics
}

export function InfrastructureMetrics({ metrics }: InfrastructureMetricsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-400 bg-green-500/20 border-green-500/30'
      case 'warning': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
      case 'critical': return 'text-red-400 bg-red-500/20 border-red-500/30'
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
    }
  }

  const getProgressColor = (value: number) => {
    if (value > 80) return 'bg-red-500'
    if (value > 60) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  return (
    <div className="space-y-4">
      {/* Servers */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-blue-400" />
            <h3 className="font-semibold text-white">Servers</h3>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(metrics.servers.status)}`}>
            {metrics.servers.status}
          </span>
        </div>
        
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-300">CPU Usage</span>
              <span className="text-white font-medium">{metrics.servers.cpuUsage.toFixed(1)}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className={`h-full ${getProgressColor(metrics.servers.cpuUsage)} transition-all duration-500`}
                style={{ width: `${metrics.servers.cpuUsage}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-300">Memory</span>
              <span className="text-white font-medium">{metrics.servers.memoryUsage.toFixed(1)}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className={`h-full ${getProgressColor(metrics.servers.memoryUsage)} transition-all duration-500`}
                style={{ width: `${metrics.servers.memoryUsage}%` }}
              />
            </div>
          </div>

          <div className="flex justify-between text-sm pt-2 border-t border-white/10">
            <span className="text-gray-400">Active</span>
            <span className="text-white font-medium">{metrics.servers.active}/{metrics.servers.total}</span>
          </div>
        </div>
      </div>

      {/* Database */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-purple-400" />
            <h3 className="font-semibold text-white">Database</h3>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(metrics.database.status)}`}>
            {metrics.database.status}
          </span>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Connections</span>
            <span className="text-white font-medium">{metrics.database.connections}/{metrics.database.maxConnections}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Query Time</span>
            <span className="text-white font-medium">{metrics.database.queryTime}ms</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Storage</span>
            <span className="text-white font-medium">{metrics.database.storageUsed}GB / {metrics.database.storageTotal}GB</span>
          </div>
        </div>
      </div>

      {/* Network */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Network className="w-5 h-5 text-cyan-400" />
            <h3 className="font-semibold text-white">Network</h3>
          </div>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Bandwidth</span>
            <span className="text-white font-medium">{metrics.network.bandwidth}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Latency</span>
            <span className="text-white font-medium">{metrics.network.latency}ms</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Requests/s</span>
            <span className="text-white font-medium">{metrics.network.requestsPerSecond}</span>
          </div>
        </div>
      </div>

      {/* Cost */}
      <div className="bg-gradient-to-br from-green-500/20 to-blue-500/20 backdrop-blur-lg rounded-xl p-4 border border-white/10">
        <div className="flex items-center gap-2 mb-3">
          <DollarSign className="w-5 h-5 text-green-400" />
          <h3 className="font-semibold text-white">This Month</h3>
        </div>
        
        <div className="text-3xl font-bold text-white mb-2">
          ${metrics.cost.toLocaleString()}
        </div>
        
        <div className="text-sm text-green-400">
          ↓ ${metrics.costSaved.toLocaleString()} saved
        </div>
      </div>
    </div>
  )
}

function DollarSign({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}
