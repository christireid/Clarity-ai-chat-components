import { Calendar, Mail, FileText, Activity } from 'lucide-react'

interface QuickActionsProps {
  onScheduleMeeting: () => void
  onSendEmail: () => void
  onCreateProposal: () => void
  onLogActivity: () => void
}

export function QuickActions({ onScheduleMeeting, onSendEmail, onCreateProposal, onLogActivity }: QuickActionsProps) {
  return (
    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
      <div className="grid grid-cols-4 gap-2">
        <button
          onClick={onScheduleMeeting}
          className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors text-xs font-medium flex flex-col items-center gap-1"
        >
          <Calendar className="w-4 h-4" />
          <span>Schedule</span>
        </button>
        <button
          onClick={onSendEmail}
          className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors text-xs font-medium flex flex-col items-center gap-1"
        >
          <Mail className="w-4 h-4" />
          <span>Email</span>
        </button>
        <button
          onClick={onCreateProposal}
          className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors text-xs font-medium flex flex-col items-center gap-1"
        >
          <FileText className="w-4 h-4" />
          <span>Proposal</span>
        </button>
        <button
          onClick={onLogActivity}
          className="p-3 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors text-xs font-medium flex flex-col items-center gap-1"
        >
          <Activity className="w-4 h-4" />
          <span>Log</span>
        </button>
      </div>
    </div>
  )
}
