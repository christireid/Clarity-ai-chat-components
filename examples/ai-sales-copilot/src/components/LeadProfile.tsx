import { Building, Mail, Phone, MapPin } from 'lucide-react'
import type { Lead } from '../types'

interface LeadProfileProps {
  lead: Lead
}

export function LeadProfile({ lead }: LeadProfileProps) {
  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-xl p-4 border border-gray-200 dark:border-gray-700">
      <div className="text-center mb-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-2">
          {lead.name.charAt(0)}
        </div>
        <h3 className="font-semibold text-gray-900 dark:text-white">{lead.name}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{lead.title}</p>
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <Building className="w-4 h-4" />
          <span>{lead.company}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <Mail className="w-4 h-4" />
          <span>{lead.email}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <Phone className="w-4 h-4" />
          <span>{lead.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <MapPin className="w-4 h-4" />
          <span>{lead.location}</span>
        </div>
      </div>
    </div>
  )
}
