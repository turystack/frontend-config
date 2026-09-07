export function InvoiceTable() {
  const outcome = useDataOutcome({
    query: useListInvoices(),
    select: (page) => page.data,
  })
  return outcome.status
}
