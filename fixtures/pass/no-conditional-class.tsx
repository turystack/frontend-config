import { rowStyles } from './row.styles.js'

export function Row({ active }: { active: boolean }) {
  return <div className={rowStyles({ active })} />
}
