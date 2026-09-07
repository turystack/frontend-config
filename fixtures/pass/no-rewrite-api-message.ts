declare const toast: { error: (message: string) => void }
declare function cancelOrder(): Promise<void>

export async function run() {
  try {
    await cancelOrder()
  } catch (error) {
    toast.error((error as Error).message)
  }
}
