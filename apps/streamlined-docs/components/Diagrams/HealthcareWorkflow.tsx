/**
 * Healthcare Workflow Diagram
 * 
 * Patient journey through healthcare chatbot
 */

'use client'

import { motion } from 'framer-motion'
import { User, MessageCircle, FileText, Calendar, Heart, Check } from 'lucide-react'

export function HealthcareWorkflow() {
  const journey = [
    {
      icon: <User className="w-6 h-6" />,
      title: 'Patient Query',
      description: 'Describes symptoms or asks medical question',
      color: 'from-blue-500 to-blue-600',
      example: '"I have a headache and fever"',
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: 'AI Analysis',
      description: 'Interprets symptoms, retrieves medical knowledge',
      color: 'from-purple-500 to-purple-600',
      example: 'Analyzes symptom patterns',
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: 'Record Check',
      description: 'Reviews patient history, medications, allergies',
      color: 'from-green-500 to-green-600',
      example: 'Checks medical records',
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: 'Recommendation',
      description: 'Provides educational health information',
      color: 'from-pink-500 to-pink-600',
      example: 'Suggests rest, fluids, monitor',
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: 'Follow-up',
      description: 'Schedules appointment if needed',
      color: 'from-orange-500 to-orange-600',
      example: 'Book with Dr. Smith',
    },
    {
      icon: <Check className="w-6 h-6" />,
      title: 'Documentation',
      description: 'Logs interaction for continuity of care',
      color: 'from-cyan-500 to-cyan-600',
      example: 'Audit trail created',
    },
  ]

  return (
    <div className="not-prose my-12">
      <div className="bg-gradient-to-br from-slate-50 to-cyan-50 dark:from-slate-900 dark:to-cyan-950 p-8 rounded-2xl border-2 border-slate-200 dark:border-slate-700">
        <h3 className="text-2xl font-bold mb-3 text-center">
          <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
            Patient Care Workflow
          </span>
        </h3>
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-8">
          HIPAA-compliant healthcare interaction flow
        </p>

        {/* Journey Map */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {journey.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
              className="relative"
            >
              {/* Step card */}
              <div className="p-6 bg-white dark:bg-slate-800 rounded-xl border-2 border-slate-200 dark:border-slate-700 shadow-lg h-full">
                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} text-white flex items-center justify-center shadow-lg mb-4`}>
                  {step.icon}
                </div>

                {/* Title */}
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${step.color} text-white flex items-center justify-center text-xs font-bold shadow`}>
                    {index + 1}
                  </div>
                  <h4 className="font-bold text-sm">{step.title}</h4>
                </div>

                {/* Description */}
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                  {step.description}
                </p>

                {/* Example */}
                <div className="bg-slate-100 dark:bg-slate-900 rounded-lg p-2 text-xs font-mono text-gray-700 dark:text-gray-300">
                  {step.example}
                </div>
              </div>

              {/* Connector arrow (except last) */}
              {index < journey.length - 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.15 + 0.2 }}
                  className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24">
                    <path d="M 0 12 L 18 12" stroke="#3b82f6" strokeWidth="2" />
                    <path d="M 14 8 L 22 12 L 14 16" fill="#3b82f6" />
                  </svg>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Key Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="mt-8 grid md:grid-cols-3 gap-4"
        >
          <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-800 text-center">
            <div className="text-2xl mb-1">🔒</div>
            <div className="font-semibold text-sm mb-1">HIPAA Compliant</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Encrypted, audited, secure
            </div>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-xl border border-green-200 dark:border-green-800 text-center">
            <div className="text-2xl mb-1">🎯</div>
            <div className="font-semibold text-sm mb-1">Context-Aware</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Uses patient history
            </div>
          </div>
          <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-xl border border-purple-200 dark:border-purple-800 text-center">
            <div className="text-2xl mb-1">⚡</div>
            <div className="font-semibold text-sm mb-1">Real-time</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Instant responses
            </div>
          </div>
        </motion.div>

        {/* Compliance Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-950/30 border-l-4 border-yellow-500 rounded-r-xl text-sm"
        >
          <div className="flex items-start gap-2">
            <span className="text-yellow-600 dark:text-yellow-400 text-lg">⚠️</span>
            <div>
              <div className="font-semibold text-yellow-900 dark:text-yellow-100 mb-1">
                Compliance Requirements
              </div>
              <div className="text-yellow-800 dark:text-yellow-200 text-xs">
                All interactions are encrypted (TLS 1.3), logged for audit trails, and include automatic PII detection. Every step maintains HIPAA compliance.
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

