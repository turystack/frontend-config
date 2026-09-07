declare function useMutation(options: unknown): unknown
declare function cancelOrder(id: string): Promise<void>
declare function applyLocally(id: string): unknown
declare function restore(snapshot: unknown): void

export const mutation = useMutation({
  mutationFn: cancelOrder,
  onMutate: (id: string) => applyLocally(id),
  onError: (_error: unknown, _id: string, snapshot: unknown) => restore(snapshot),
})
