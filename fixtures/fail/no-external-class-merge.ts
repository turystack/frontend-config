import { cn } from './support/utils.js'

export function classes(className?: string) {
  return cn('base', className)
}
