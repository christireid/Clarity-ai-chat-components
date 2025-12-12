'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { buttonAnimation, fadeInUp } from '@/lib/animations'
import { Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        className="text-center max-w-md"
      >
        <motion.h1
          className="text-9xl font-bold text-gray-200 dark:text-gray-800 mb-4"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          404
        </motion.h1>
        <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          Page Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/">
            <motion.button
              variants={buttonAnimation}
              whileHover="hover"
              whileTap="tap"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2"
            >
              <Home size={20} />
              Go Home
            </motion.button>
          </Link>
          <Link href="/learn/quick-start">
            <motion.button
              variants={buttonAnimation}
              whileHover="hover"
              whileTap="tap"
              className="px-6 py-3 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-700 flex items-center gap-2"
            >
              <Search size={20} />
              Browse Docs
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
