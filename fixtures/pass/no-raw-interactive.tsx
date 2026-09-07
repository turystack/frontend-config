export function Row({ onSelect }: { onSelect: () => void }) {
  return (
    <button onClick={onSelect} type="button">
      Open
    </button>
  )
}
