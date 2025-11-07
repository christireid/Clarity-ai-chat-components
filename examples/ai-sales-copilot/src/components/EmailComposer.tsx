import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import type { Lead } from '../types'

interface EmailComposerProps {
  lead: Lead | null
  onClose: () => void
  onSend: (email: { subject: string; body: string }) => void
}

export function EmailComposer({ lead, onClose, onSend }: EmailComposerProps) {
  const [subject, setSubject] = useState(`Following up on our conversation`)
  const [body, setBody] = useState(
    `Hi ${lead?.name},\n\nThanks for taking the time to discuss your needs today. Based on our conversation, I believe we can help you achieve your goals.\n\nWould you be available for a quick demo this week?\n\nBest regards,\nYour Name`
  )
  const [generating, setGenerating] = useState(false)

  const handleGenerate = async () => {
    setGenerating(true)
    
    // Simulate AI generation
    await new Promise((resolve) => setTimeout(resolve, 2000))
    
    setSubject(`Personalized solution for ${lead?.company}`)
    setBody(
      `Hi ${lead?.name},\n\nIt was great speaking with you about ${lead?.company}'s goals. I've been thinking about how our solution could specifically help you:\n\n• Increase efficiency by 40%\n• Reduce costs by $50K annually\n• Improve team collaboration\n\nI'd love to show you a quick 15-minute demo focused on your specific use case. Are you available Thursday at 2pm?\n\nLooking forward to helping ${lead?.company} succeed!\n\nBest,\nYour Name`
    )
    
    setGenerating(false)
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">✉️ Compose Email</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          ✕
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            To
          </label>
          <input
            type="text"
            value={`${lead?.name} <${lead?.email}>`}
            disabled
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Subject
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Message
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={10}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => onSend({ subject, body })}
            className="flex-1 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors"
          >
            📤 Send Email
          </button>
          
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="px-4 py-2 rounded-lg bg-purple-500 hover:bg-purple-600 text-white font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            {generating ? 'Generating...' : 'AI Generate'}
          </button>
        </div>
      </div>
    </div>
  )
}
