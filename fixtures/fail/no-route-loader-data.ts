export function Page() {
  const orders = useLoaderData({ from: '/orders' })
  return orders
}
