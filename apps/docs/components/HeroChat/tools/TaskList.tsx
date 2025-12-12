'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Check, Circle, List, Sparkles } from 'lucide-react'
import { useState, useCallback, useMemo } from 'react'

interface Task {
  id: string
  text: string
  completed: boolean
  priority?: 'low' | 'medium' | 'high'
}

interface TaskListProps {
  title?: string
  description?: string
  tasks: Task[]
  showProgress?: boolean
}

const priorityColors = {
  low: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
  medium:
    'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400',
  high: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400',
}

export function TaskList({
  title,
  description,
  tasks: initialTasks,
  showProgress = true,
}: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [celebrateIndex, setCelebrateIndex] = useState<number | null>(null)

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) => {
      const taskIndex = prev.findIndex((t) => t.id === id)
      const wasCompleted = prev[taskIndex]?.completed

      if (!wasCompleted) {
        setCelebrateIndex(taskIndex)
        setTimeout(() => setCelebrateIndex(null), 600)
      }

      return prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    })
  }, [])

  const completedCount = useMemo(
    () => tasks.filter((t) => t.completed).length,
    [tasks]
  )
  const progress = useMemo(
    () => (completedCount / tasks.length) * 100,
    [completedCount, tasks.length]
  )
  const allComplete = completedCount === tasks.length

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="w-full max-w-sm overflow-hidden rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-700"
    >
      {/* Header */}
      <div className="p-5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <List className="w-5 h-5 text-indigo-500" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {title || 'Tasks'}
              </h3>
            </div>
            {description && (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {description}
              </p>
            )}
          </div>
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {completedCount}/{tasks.length}
          </span>
        </div>

        {/* Progress bar */}
        {showProgress && (
          <div className="mt-4">
            <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ type: 'spring', stiffness: 100, damping: 20 }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Task List */}
      <div className="p-3">
        <AnimatePresence>
          {tasks.map((task, index) => (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.05 }}
              className="relative"
            >
              <button
                onClick={() => toggleTask(task.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                  task.completed
                    ? 'bg-slate-50 dark:bg-slate-800/50'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                {/* Checkbox */}
                <motion.div
                  className={`relative flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    task.completed
                      ? 'bg-indigo-500 border-indigo-500'
                      : 'border-slate-300 dark:border-slate-600'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <AnimatePresence>
                    {task.completed && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{
                          type: 'spring',
                          stiffness: 500,
                          damping: 25,
                        }}
                      >
                        <Check className="w-4 h-4 text-white" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Task text */}
                <span
                  className={`flex-grow text-left transition-all ${
                    task.completed
                      ? 'text-slate-400 line-through'
                      : 'text-slate-700 dark:text-slate-200'
                  }`}
                >
                  {task.text}
                </span>

                {/* Priority badge */}
                {task.priority && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}
                  >
                    {task.priority}
                  </span>
                )}

                {/* Celebrate animation */}
                {celebrateIndex === index && (
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-indigo-500 rounded-full"
                        style={{
                          left: '12px',
                          top: '50%',
                        }}
                        initial={{ scale: 0 }}
                        animate={{
                          scale: [0, 1, 0],
                          x: Math.cos((i / 8) * Math.PI * 2) * 30,
                          y: Math.sin((i / 8) * Math.PI * 2) * 30,
                          opacity: [1, 1, 0],
                        }}
                        transition={{
                          duration: durations.slower,
                          ease: 'easeOut',
                        }}
                      />
                    ))}
                  </motion.div>
                )}
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* All complete celebration */}
      <AnimatePresence>
        {allComplete && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-slate-100 dark:border-slate-800"
          >
            <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
              <div className="flex items-center justify-center gap-2 text-indigo-600 dark:text-indigo-400">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: durations.slower, ease: 'easeOut' }}
                >
                  <Sparkles className="w-5 h-5" />
                </motion.div>
                <span className="font-medium">All tasks complete!</span>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: durations.slower, ease: 'easeOut' }}
                >
                  <Sparkles className="w-5 h-5" />
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
