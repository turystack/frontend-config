export function Note({ body }: { body: string }) {
  return <div dangerouslySetInnerHTML={{ __html: body }} />
}
