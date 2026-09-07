import { useEffect, useRef } from 'react'

export function Panel() {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeRef.current.focus()
  }, [])

  return null
}
