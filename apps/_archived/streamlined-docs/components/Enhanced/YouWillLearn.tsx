'use client'

import { CheckCircle2 } from 'lucide-react'
import { motion, type Variants } from 'framer-motion'

interface YouWillLearnProps {
  items: string[]
}

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1],
      staggerChildren: 0.08,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
}

export function YouWillLearn({ items }: YouWillLearnProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-50px' }}
      variants={containerVariants}
      className="my-8 p-6 rounded-xl bg-gradient-to-br from-brand-500/10 to-brand-600/5 border border-brand-500/20"
    >
      <motion.h3
        initial={{ opacity: 0, y: -10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3 }}
        className="text-lg font-semibold mb-4 text-text-primary flex items-center gap-2"
      >
        <motion.div
          whileHover={{ scale: 1.1, rotate: 10 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        >
          <CheckCircle2 className="w-5 h-5 text-brand-500" />
        </motion.div>
        You will learn
      </motion.h3>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <motion.li
            key={index}
            variants={itemVariants}
            whileHover={{ x: 4 }}
            transition={{ duration: 0.2 }}
            className="flex items-start gap-2 text-text-secondary"
          >
            <motion.div
              whileHover={{ scale: 1.15, rotate: 360 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            >
              <CheckCircle2 className="w-4 h-4 text-brand-500 mt-0.5 flex-shrink-0" />
            </motion.div>
            <span>{item}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  )
}
