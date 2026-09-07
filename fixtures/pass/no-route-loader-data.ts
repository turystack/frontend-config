export function Page() {
  const query = useListOrders()
  return query.data
}
