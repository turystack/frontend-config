import { fireEvent, screen } from '@testing-library/react'

export function click() {
  fireEvent.click(screen.getByRole('button'))
}
