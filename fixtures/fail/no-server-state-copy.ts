export function OrderTable() {
  const query = useListOrders()
  const [orders, setOrders] = useState(query.data)
  return orders
}
