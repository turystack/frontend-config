declare function handleSubmit(handler: (values: unknown) => void): () => void
declare function save(values: unknown): Promise<void>

export function makeSubmit(onSuccess?: () => void) {
  return handleSubmit(async (values) => {
    await save(values)
    onSuccess?.()
  })
}
