import clsx from 'clsx'

export interface PropDefinition {
  name: string
  type: string
  required?: boolean
  default?: string
  description: string
}

interface ApiTableProps {
  title?: string
  data: PropDefinition[]
  className?: string
}

export function ApiTable({ title = 'Props', data, className }: ApiTableProps) {
  return (
    <div className={clsx('my-6 not-prose', className)}>
      {title && <h3 className="text-xl font-semibold mb-4">{title}</h3>}
      
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-bg-secondary">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary">
                  Default
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.map((prop) => (
                <tr
                  key={prop.name}
                  className="hover:bg-bg-secondary transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-mono text-brand-600 dark:text-brand-400">
                        {prop.name}
                      </code>
                      {prop.required && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 font-medium">
                          Required
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <code className="text-sm font-mono text-purple-600 dark:text-purple-400">
                      {prop.type}
                    </code>
                  </td>
                  <td className="px-4 py-3">
                    {prop.default ? (
                      <code className="text-sm font-mono text-text-secondary">
                        {prop.default}
                      </code>
                    ) : (
                      <span className="text-sm text-text-tertiary">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-text-secondary">
                    {prop.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
