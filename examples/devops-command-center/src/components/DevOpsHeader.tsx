import { Activity, Settings, Shield, DollarSign, FileText } from 'lucide-react'

interface DevOpsHeaderProps {
  onThemeChange: (theme: string) => void
  currentTheme: string
  onShowTokens: () => void
  onShowAudit: () => void
  tokensSaved: number
}

export function DevOpsHeader({
  onThemeChange,
  currentTheme,
  onShowTokens,
  onShowAudit,
  tokensSaved,
}: DevOpsHeaderProps) {
  const themes = [
    { id: 'ocean', name: 'Ocean', gradient: 'from-blue-600 to-cyan-500' },
    { id: 'dark', name: 'Dark', gradient: 'from-gray-800 to-gray-900' },
    { id: 'glassmorphism', name: 'Glass', gradient: 'from-purple-500/50 to-pink-500/50' },
    { id: 'neon', name: 'Neon', gradient: 'from-green-500 to-purple-600' },
  ]

  return (
    <header className="bg-slate-900/80 backdrop-blur-lg border-b border-white/10 sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">DevOps Command Center</h1>
              <p className="text-xs text-gray-400">AI-Powered Infrastructure Management</p>
            </div>
          </div>

          {/* Center - Status */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm text-gray-300">All Systems Operational</span>
            </div>
            
            {tokensSaved > 0 && (
              <div className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
                <span className="text-xs font-medium text-green-300">
                  💰 {tokensSaved.toLocaleString()} tokens saved
                </span>
              </div>
            )}
          </div>

          {/* Right - Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Selector */}
            <div className="flex gap-1 bg-white/5 rounded-lg p-1">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => onThemeChange(theme.id)}
                  className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                    currentTheme === theme.id
                      ? 'bg-white/20 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                  title={theme.name}
                >
                  {theme.name}
                </button>
              ))}
            </div>

            {/* Token Dashboard Button */}
            <button
              onClick={onShowTokens}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
              title="Token Dashboard (⌘T)"
            >
              <DollarSign className="w-5 h-5" />
            </button>

            {/* Audit Log Button */}
            <button
              onClick={onShowAudit}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
              title="Audit Log (⌘L)"
            >
              <FileText className="w-5 h-5" />
            </button>

            {/* Security Status */}
            <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors">
              <Shield className="w-5 h-5" />
            </button>

            {/* Settings */}
            <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
