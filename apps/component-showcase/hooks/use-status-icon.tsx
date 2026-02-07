'use client'

import React from 'react'
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  FileCode,
  FileText,
  File,
  Image,
} from 'lucide-react'

/**
 * Returns an icon component for a given status type.
 * Consolidates the repeated getIcon() pattern from feedback-status
 * and error-handling components.
 */
export function getStatusIcon(
  type: string,
  size: string = 'h-5 w-5'
): React.ReactNode {
  switch (type) {
    case 'success':
      return <CheckCircle className={`${size} text-green-500`} />
    case 'error':
      return <XCircle className={`${size} text-red-500`} />
    case 'warning':
      return <AlertTriangle className={`${size} text-yellow-500`} />
    case 'info':
      return <Info className={`${size} text-blue-500`} />
    default:
      return null
  }
}

/**
 * Returns an icon component for a given file name/extension.
 * Consolidates the repeated getFileIcon() pattern from media-files
 * and similar components.
 */
export function getFileIcon(
  name: string,
  size: string = 'h-4 w-4'
): React.ReactNode {
  if (name.endsWith('.tsx') || name.endsWith('.ts') || name.endsWith('.js') || name.endsWith('.jsx')) {
    return <FileCode className={`${size} text-blue-500`} />
  }
  if (name.endsWith('.md') || name.endsWith('.txt') || name.endsWith('.json')) {
    return <FileText className={`${size} text-gray-500`} />
  }
  if (
    name.endsWith('.png') ||
    name.endsWith('.jpg') ||
    name.endsWith('.jpeg') ||
    name.endsWith('.gif') ||
    name.endsWith('.svg')
  ) {
    return <Image className={`${size} text-purple-500`} />
  }
  return <File className={`${size} text-gray-400`} />
}
