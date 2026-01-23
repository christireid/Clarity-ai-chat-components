'use client'

interface TemplateButtonProps {
  name: string
  description: string
}

export function TemplateButton({ name, description }: TemplateButtonProps) {
  return (
    <button
      onClick={() => {
        // In production, this would update the playground code
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }}
      className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-brand-300 dark:hover:border-brand-700 transition-all text-left group"
    >
      <h3 className="font-semibold mb-1 group-hover:text-brand-500 transition-colors">
        {name}
      </h3>
      <p className="text-sm text-neutral-600 dark:text-neutral-400">
        {description}
      </p>
    </button>
  )
}
