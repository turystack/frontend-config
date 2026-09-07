import { useState } from 'react'

declare function useSearch(): { page: number }

export function useOrdersTable() {
  const { page } = useSearch()
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

  return { page, isConfirmOpen, setIsConfirmOpen }
}
