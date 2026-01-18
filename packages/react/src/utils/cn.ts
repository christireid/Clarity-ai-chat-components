/**
 * Local utility function to merge Tailwind CSS classes
 * Uses clsx for conditional classes and tailwind-merge to handle conflicts
 * This is a local version to avoid circular dependencies
 */
export function cn(...inputs: Array<string | number | boolean | undefined | null>) {
  return inputs
    .filter(Boolean)
    .map(String)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
}