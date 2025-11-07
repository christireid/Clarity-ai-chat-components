export interface Document {
  id: string
  name: string
  type: string
  size: number
  uploadedAt: Date
  chunks: number
  tenant: string
  metadata?: Record<string, any>
}

export interface SearchFilters {
  types?: string[]
  dateRange?: string
  tags?: string[]
}

export interface Tenant {
  id: string
  name: string
  logo?: string
}

export interface Role {
  id: string
  name: string
  permissions: string[]
}
