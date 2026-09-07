import { useEffect } from 'react'

export function Form({ form, order }: any) {
  useEffect(() => {
    form.reset(order)
  }, [order])
}
