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
    <div className={clsx('my-8 not-prose', className)}>
      {title && <h3 className="text-xl font-semibold mb-4">{title}</h3>}

      <div className="border-2 border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-bg-secondary/50">
              <tr>
                <th className="px-5 py-3 text-left text-sm font-semibold text-text-primary border-b-2 border-border">
                  Name
                </th>
                <th className="px-5 py-3 text-left text-sm font-semibold text-text-primary border-b-2 border-border">
                  Type
                </th>
                <th className="px-5 py-3 text-left text-sm font-semibold text-text-primary border-b-2 border-border">
                  Default
                </th>
                <th className="px-5 py-3 text-left text-sm font-semibold text-text-primary border-b-2 border-border">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.map((prop) => (
                <tr
                  key={prop.name}
                  className="hover:bg-bg-secondary/30 transition-all duration-150"
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-mono font-semibold text-brand-600 dark:text-brand-400">
                        {prop.name}
                      </code>
                      {prop.required && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 font-semibold border border-red-200 dark:border-red-800">
                          Required
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <code className="text-sm font-mono text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/30 px-2 py-1 rounded-lg">
                      {prop.type}
                    </code>
                  </td>
                  <td className="px-5 py-3">
                    {prop.default ? (
                      <code className="text-sm font-mono text-text-secondary bg-muted/50 px-2 py-1 rounded-lg">
                        {prop.default}
                      </code>
                    ) : (
                      <span className="text-sm text-text-tertiary">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-sm text-text-secondary leading-relaxed">
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
