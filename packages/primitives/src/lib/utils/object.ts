/**
 * Object Utilities
 * Object manipulation and type-safe operations
 */

/**
 * Get nested object value safely
 */
export function getNestedValue(
  obj: any,
  path: string,
  defaultValue?: any
): any {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : defaultValue
  }, obj)
}

/**
 * Set nested object value safely
 */
export function setNestedValue(obj: any, path: string, value: any): any {
  const keys = path.split('.')
  const lastKey = keys.pop()!

  let current = obj
  for (const key of keys) {
    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = {}
    }
    current = current[key]
  }

  current[lastKey] = value
  return obj
}

/**
 * Check if object has property
 */
export function hasProperty<T extends object>(
  obj: T,
  key: PropertyKey
): key is keyof T {
  return Object.prototype.hasOwnProperty.call(obj, key)
}

/**
 * Get object keys
 */
export function keys<T extends object>(obj: T): Array<keyof T> {
  return Object.keys(obj) as Array<keyof T>
}

/**
 * Get object values
 */
export function values<T extends object>(obj: T): Array<T[keyof T]> {
  return Object.values(obj)
}

/**
 * Get object entries
 */
export function entries<T extends object>(
  obj: T
): Array<[keyof T, T[keyof T]]> {
  return Object.entries(obj) as Array<[keyof T, T[keyof T]]>
}
