import { Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface Message {
  role: string
  content: string
  timestamp?: Date
}

interface CommandHistoryProps {
  messages: Message[]
}

export function CommandHistory({ messages }: CommandHistoryProps) {
  const userMessages = messages
    .filter((m) => m.role === 'user')
    .slice(-5)
    .reverse()

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/10">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-4 h-4 text-gray-400" />
        <h3 className="font-semibold text-white text-sm">Recent Commands</h3>
      </div>
      
      <div className="space-y-2">
        {userMessages.length === 0 ? (
          <div className="text-sm text-gray-400 text-center py-4">
            No commands yet
          </div>
        ) : (
          userMessages.map((msg, i) => (
            <div
              key={i}
              className="p-2 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group"
            >
              <div className="text-xs text-white line-clamp-2 group-hover:line-clamp-none">
                {msg.content}
              </div>
              {msg.timestamp && (
                <div className="text-xs text-gray-500 mt-1">
                  {formatDistanceToNow(msg.timestamp, { addSuffix: true })}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
