import type { DevOpsAgent } from '../agents'

interface AgentStatusPanelProps {
  agents: DevOpsAgent[]
}

export function AgentStatusPanel({ agents }: AgentStatusPanelProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'busy': return 'bg-yellow-500 animate-pulse'
      case 'idle': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/10">
      <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
        <span>🤖</span>
        <span>AI Agents</span>
      </h3>
      
      <div className="space-y-3">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className="p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">{agent.icon}</span>
                <div>
                  <div className="font-medium text-white text-sm">{agent.name}</div>
                  <div className="text-xs text-gray-400">{agent.description}</div>
                </div>
              </div>
              <div className={`w-2 h-2 rounded-full ${getStatusColor(agent.status)}`} />
            </div>
            
            {agent.lastAction && (
              <div className="text-xs text-gray-400 mt-2 pt-2 border-t border-white/10">
                Last: {agent.lastAction}
              </div>
            )}
            
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-400">Success Rate</span>
              <span className="text-xs text-green-400 font-medium">{agent.successRate}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
