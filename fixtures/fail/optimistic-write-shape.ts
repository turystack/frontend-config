declare function useMutation(options: unknown): unknown
declare function cancelOrder(id: string): Promise<void>
declare function applyLocally(id: string): unknown

export const mutation = useMutation({
  mutationFn: cancelOrder,
  onMutate: (id: string) => applyLocally(id),
})
