export function FieldError({ message }: { message?: string }) {
  return message ? <span className="field-error">{message}</span> : null
}
