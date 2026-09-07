export function InvoiceTable() {
  const query = useListInvoices()
  const invoices = query.data ?? []
  return invoices.length
}
