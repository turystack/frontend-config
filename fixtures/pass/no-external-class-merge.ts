import { cn } from './support/utils.js'

export function classes(loading: boolean) {
  return cn('base', loading && 'opacity-50')
}
