import { useState } from 'react'

export function Table() {
  const [row, setRow] = useState(selectedRowDefault)
  return row
}
