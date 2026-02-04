/**
 * String Utilities
 * String manipulation and validation functions
 */

/**
 * Generate random string
 */
export function randomString(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * Check if string includes substring
 */
export function includesSubstring(str: string, substring: string): boolean {
  return str.includes(substring)
}

/**
 * Check if string excludes substring
 */
export function excludesSubstring(str: string, substring: string): boolean {
  return !str.includes(substring)
}

/**
 * Check if string starts with substring
 */
export function startsWith(str: string, substring: string): boolean {
  return str.startsWith(substring)
}

/**
 * Check if string ends with substring
 */
export function endsWith(str: string, substring: string): boolean {
  return str.endsWith(substring)
}

/**
 * Check if string matches regex
 */
export function matches(str: string, regex: RegExp): boolean {
  return regex.test(str)
}

/**
 * Check if string does not match regex
 */
export function notMatches(str: string, regex: RegExp): boolean {
  return !regex.test(str)
}

/**
 * Check if string is numeric
 */
export function isNumeric(str: string): boolean {
  return !isNaN(Number(str))
}

/**
 * Check if string is alphabetic
 */
export function isAlphabetic(str: string): boolean {
  return /^[a-zA-Z]+$/.test(str)
}

/**
 * Check if string is alphanumeric
 */
export function isAlphanumeric(str: string): boolean {
  return /^[a-zA-Z0-9]+$/.test(str)
}

/**
 * Check if string is hexadecimal
 */
export function isHexadecimal(str: string): boolean {
  return /^[0-9a-fA-F]+$/.test(str)
}

/**
 * Check if string is base64
 */
export function isBase64(str: string): boolean {
  const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/
  return base64Regex.test(str) && str.length % 4 === 0
}

/**
 * Check if string is JSON
 */
export function isJsonString(str: string): boolean {
  try {
    JSON.parse(str)
    return true
  } catch {
    return false
  }
}

/**
 * Check if string is UUID
 */
export function isUuid(str: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(str)
}

/**
 * Check if string is IP address
 */
export function isIpAddress(str: string): boolean {
  const ipv4Regex =
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
  const ipv6Regex =
    /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/
  return ipv4Regex.test(str) || ipv6Regex.test(str)
}

/**
 * Check if string is port number
 */
export function isPortNumber(str: string): boolean {
  const port = Number(str)
  return Number.isInteger(port) && port >= 1 && port <= 65535
}

/**
 * Check if string is date
 */
export function isDateString(str: string): boolean {
  return !isNaN(Date.parse(str))
}

/**
 * Check if string is time
 */
export function isTimeString(str: string): boolean {
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/
  return timeRegex.test(str)
}
