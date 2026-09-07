export function canCancel(permissions: string[]) {
  return permissions.includes('order:cancel')
}
