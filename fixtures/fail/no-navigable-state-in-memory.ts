import { useState } from 'react'

export function useOrdersTable() {
  const [page, setPage] = useState(1)

  return { page, setPage }
}
