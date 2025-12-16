'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Check, Loader2, Mail } from 'lucide-react'

export default function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    
    // Simulate API call to Resend
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // In a real app, this would be a server action:
    // await subscribeToNewsletter(email)
    
    setStatus('success')
    setEmail('')
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-surface-900 border border-white/10 p-8 sm:p-12">
      {/* Background effects */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-clarity-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-cosmic-500/10 rounded-full blur-3xl" />
      
      <div className="relative z-10 grid gap-8 lg:grid-cols-2 lg:gap-16 items-center">
        <div>
            <h3 className="text-2xl font-bold text-white mb-3">
                Get the <span className="gradient-text">AI Chat Implementation Guide</span>
            </h3>
            <p className="text-gray-400 mb-6">
                Join 12,000+ developers receiving our weekly deep-dives on LLM streaming, token optimization, and UI/UX patterns. Plus, get our "Production Checklist" free.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>No spam</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Unsubscribe anytime</span>
                </div>
            </div>
        </div>

        <form onSubmit={handleSubmit} className="relative">
            <div className="relative flex items-center">
                <Mail className="absolute left-4 w-5 h-5 text-gray-500" />
                <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="engineer@company.com"
                    className="w-full bg-surface-800 border border-white/10 rounded-xl py-4 pl-12 pr-32 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-clarity-500/50 focus:border-clarity-500 transition-all"
                    disabled={status === 'loading' || status === 'success'}
                />
                <button
                    type="submit"
                    disabled={status === 'loading' || status === 'success'}
                    className="absolute right-2 top-2 bottom-2 px-4 rounded-lg bg-gradient-to-r from-clarity-500 to-cosmic-500 text-white font-semibold text-sm hover:shadow-lg hover:shadow-clarity-500/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {status === 'loading' ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : status === 'success' ? (
                        <>
                            <Check className="w-4 h-4" />
                            <span>Sent!</span>
                        </>
                    ) : (
                        <>
                            <span>Get Guide</span>
                            <ArrowRight className="w-3 h-3" />
                        </>
                    )}
                </button>
            </div>
            {status === 'success' && (
                <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -bottom-8 left-0 text-sm text-green-400"
                >
                    Thanks! Check your inbox for the guide.
                </motion.p>
            )}
        </form>
      </div>
    </div>
  )
}
