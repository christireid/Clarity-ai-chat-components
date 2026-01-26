/**
 * Array Utilities
 * Array manipulation and type-safe operations
 */

/**
 * Remove duplicates from array
 */
export function unique<T>(array: T[]): T[] {
  return [...new Set(array)]
}

/**
 * Remove duplicates from array by key
 */
export function uniqueBy<T>(array: T[], key: keyof T): T[] {
  const seen = new Set()
  return array.filter((item) => {
    const value = item[key]
    if (seen.has(value)) {
      return false
    }
    seen.add(value)
    return true
  })
}

/**
 * Group array items by key
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce(
    (groups, item) => {
      const group = String(item[key])
      if (!groups[group]) {
        groups[group] = []
      }
      groups[group].push(item)
      return groups
    },
    {} as Record<string, T[]>
  )
}

/**
 * Sort array by key
 */
export function sortBy<T>(
  array: T[],
  key: keyof T,
  order: 'asc' | 'desc' = 'asc'
): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[key]
    const bVal = b[key]

    if (aVal < bVal) return order === 'asc' ? -1 : 1
    if (aVal > bVal) return order === 'asc' ? 1 : -1
    return 0
  })
}

/**
 * Chunk array into smaller arrays
 */
export function chunk<T>(array: T[], size: number): T[][] {
  const result: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size))
  }
  return result
}

/**
 * Flatten nested arrays
 */
export function flatten<T>(array: (T | T[])[]): T[] {
  return array.reduce<T[]>((flat, item) => {
    return flat.concat(Array.isArray(item) ? flatten(item) : item)
  }, [])
}

/**
 * Check if value is in array
 */
export function includes<T>(array: T[], value: T): boolean {
  return array.includes(value)
}

/**
 * Check if value is not in array
 */
export function excludes<T>(array: T[], value: T): boolean {
  return !array.includes(value)
}

/**
 * Find first match in array
 */
export function find<T>(
  array: T[],
  predicate: (item: T) => boolean
): T | undefined {
  return array.find(predicate)
}

/**
 * Find all matches in array
 */
export function filter<T>(array: T[], predicate: (item: T) => boolean): T[] {
  return array.filter(predicate)
}

/**
 * Check if any item matches predicate
 */
export function some<T>(array: T[], predicate: (item: T) => boolean): boolean {
  return array.some(predicate)
}

/**
 * Check if all items match predicate
 */
export function every<T>(array: T[], predicate: (item: T) => boolean): boolean {
  return array.every(predicate)
}

/**
 * Check if array includes any of the values
 */
export function includesAny<T>(array: T[], values: T[]): boolean {
  return values.some((value) => array.includes(value))
}

/**
 * Check if array includes all of the values
 */
export function includesAll<T>(array: T[], values: T[]): boolean {
  return values.every((value) => array.includes(value))
}

/**
 * Check if array excludes all of the values
 */
export function excludesAll<T>(array: T[], values: T[]): boolean {
  return values.every((value) => !array.includes(value))
}
