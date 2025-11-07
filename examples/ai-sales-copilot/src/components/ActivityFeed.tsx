import { formatDistanceToNow } from 'date-fns'
import { Phone, Mail, Calendar } from 'lucide-react'

interface Activity {
  type: 'call' | 'email' | 'meeting'
  description: string
  time: Date
  user: string
}

interface ActivityFeedProps {
  activities: Activity[]
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'call': return <Phone className="w-4 h-4" />
      case 'email': return <Mail className="w-4 h-4" />
      case 'meeting': return <Calendar className="w-4 h-4" />
      default: return null
    }
  }

  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-xl p-4 border border-gray-200 dark:border-gray-700">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">📋 Activity Feed</h3>
      
      <div className="space-y-3">
        {activities.map((activity, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
              {getIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 dark:text-white">{activity.description}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {activity.user} • {formatDistanceToNow(activity.time, { addSuffix: true })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
