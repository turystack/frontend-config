export function Row({ active }: { active: boolean }) {
  return <div className={active ? 'bg-accent' : 'bg-surface'} />
}
