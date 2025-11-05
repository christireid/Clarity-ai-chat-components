import { Building2 } from 'lucide-react'

interface Tenant {
  id: string
  name: string
  logo?: string
}

interface TenantSelectorProps {
  currentTenant: Tenant
  onSwitch: (tenant: Tenant) => void
}

const mockTenants: Tenant[] = [
  { id: 'acme-corp', name: 'ACME Corp' },
  { id: 'marketing', name: 'Marketing Team' },
  { id: 'engineering', name: 'Engineering' },
]

export function TenantSelector({ currentTenant, onSwitch }: TenantSelectorProps) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-slate-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
      <Building2 className="w-4 h-4 text-gray-500" />
      <select
        value={currentTenant.id}
        onChange={(e) => {
          const tenant = mockTenants.find((t) => t.id === e.target.value)
          if (tenant) onSwitch(tenant)
        }}
        className="bg-transparent border-none text-sm font-medium text-gray-900 dark:text-white focus:outline-none"
      >
        {mockTenants.map((tenant) => (
          <option key={tenant.id} value={tenant.id}>
            {tenant.name}
          </option>
        ))}
      </select>
    </div>
  )
}
