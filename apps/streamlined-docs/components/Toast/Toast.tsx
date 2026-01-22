'use client'

import { useEffect, useState, createContext, useContext, useCallback, ReactNode } from 'react'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

interface Toast {
  id: string
  message: string
  type: ToastType
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: (id: string) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(toast.id), 3000)
    return () => clearTimeout(timer)
  }, [toast.id, onClose])

  const bgColors: Record<ToastType, string> = {
    success: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800',
    error: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800',
    warning: 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 border-amber-200 dark:border-amber-800',
    info: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800',
  }

  const icons: Record<ToastType, ReactNode> = {
    success: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    warning: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    info: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  }

  return (
    <div
      className={`px-4 py-3 rounded-lg shadow-lg border flex items-center gap-3 animate-in slide-in-from-right-full ${bgColors[toast.type]}`}
      role="alert"
    >
      {icons[toast.type]}
      <span className="text-sm font-medium flex-1">{toast.message}</span>
      <button
        onClick={() => onClose(toast.id)}
        className="hover:opacity-70 transition-opacity"
        aria-label="Dismiss"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).slice(2, 9)
    setToasts((prev) => [...prev, { id, message, type }])
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

// Standalone toast function for simpler usage without provider
export function showStandaloneToast(message: string, type: ToastType = 'info') {
  // Create toast container if it doesn't exist
  let container = document.getElementById('standalone-toast-container')
  if (!container) {
    container = document.createElement('div')
    container.id = 'standalone-toast-container'
    container.className = 'fixed bottom-4 right-4 z-50 flex flex-col gap-2'
    document.body.appendChild(container)
  }

  const toastEl = document.createElement('div')
  const id = Math.random().toString(36).slice(2, 9)
  toastEl.id = `toast-${id}`

  const bgColors: Record<ToastType, string> = {
    success: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
    error: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200',
    warning: 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200',
    info: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
  }

  toastEl.className = `px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 ${bgColors[type]}`
  toastEl.setAttribute('role', 'alert')
  // SECURITY: Create elements safely to prevent XSS
  const messageSpan = document.createElement('span')
  messageSpan.className = 'text-sm font-medium'
  messageSpan.textContent = message // Use textContent to prevent XSS
  
  const closeButton = document.createElement('button')
  closeButton.className = 'ml-2 hover:opacity-70'
  closeButton.setAttribute('aria-label', 'Close notification')
  closeButton.innerHTML = `
    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
  `
  closeButton.addEventListener('click', () => toastEl.remove())
  
  toastEl.appendChild(messageSpan)
  toastEl.appendChild(closeButton)

  container.appendChild(toastEl)

  // Auto-remove after 3 seconds
  setTimeout(() => {
    toastEl.remove()
    // Clean up container if empty
    if (container && container.children.length === 0) {
      container.remove()
    }
  }, 3000)
}
