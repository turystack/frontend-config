export function OrderTable() {
  const query = useListOrders()
  const [selected, setSelected] = useState<string>()
  return { orders: query.data, selected }
}
