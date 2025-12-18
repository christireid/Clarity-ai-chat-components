'use client'

import { useEffect } from 'react'
import { toast } from '@/lib/toast'
import { buttonAnimation } from '@/lib/animations'
import { motion } from 'framer-motion'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    logger.error('Application error:', error)
    toast.error('Something went wrong', {
      description: error.message || 'An unexpected error occurred',
      action: { label: 'Try again', onClick: reset },
      persistent: true,
    })
  }, [error, reset])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-2xl font-bold mb-4 text-red-600 dark:text-red-400">
          Oops! Something went wrong
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {error.message || 'An unexpected error occurred'}
        </p>
        <motion.button
          onClick={reset}
          variants={buttonAnimation}
          whileHover="hover"
          whileTap="tap"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
        >
          Try again
        </motion.button>
      </motion.div>
    </div>
  )
}
