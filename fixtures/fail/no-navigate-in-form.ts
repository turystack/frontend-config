declare function handleSubmit(handler: (values: unknown) => void): () => void
declare function navigate(to: string): void
declare function save(values: unknown): Promise<void>

export const submit = handleSubmit(async (values) => {
  await save(values)
  navigate('/orders')
})
