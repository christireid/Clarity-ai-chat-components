export interface InfrastructureMetrics {
  servers: {
    total: number
    active: number
    cpuUsage: number
    memoryUsage: number
    status: 'healthy' | 'warning' | 'critical'
  }
  database: {
    connections: number
    maxConnections: number
    queryTime: number
    storageUsed: number
    storageTotal: number
    status: 'healthy' | 'warning' | 'critical'
  }
  network: {
    bandwidth: string
    latency: number
    requestsPerSecond: number
  }
  cost: number
  costSaved: number
}
