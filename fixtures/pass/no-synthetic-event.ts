import userEvent from '@testing-library/user-event'
import { screen } from '@testing-library/react'

export async function click() {
  await userEvent.click(screen.getByRole('button'))
}
