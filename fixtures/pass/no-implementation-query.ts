import { screen } from '@testing-library/react'

export function find() {
  return screen.getByRole('button', { name: 'Cancel order' })
}
