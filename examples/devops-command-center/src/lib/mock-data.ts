import type { InfrastructureMetrics } from '../types'

export const mockInfrastructureData: InfrastructureMetrics = {
  servers: {
    total: 10,
    active: 8,
    cpuUsage: 65.4,
    memoryUsage: 72.1,
    status: 'healthy',
  },
  database: {
    connections: 45,
    maxConnections: 100,
    queryTime: 23,
    storageUsed: 245,
    storageTotal: 500,
    status: 'healthy',
  },
  network: {
    bandwidth: '850 Mbps',
    latency: 12,
    requestsPerSecond: 1250,
  },
  cost: 12450,
  costSaved: 2300,
}
