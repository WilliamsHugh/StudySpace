export function FieldError({ id, message }: { id?: string; message?: string }) {
  return message ? (
    <span id={id} className="field-error" role="alert" aria-live="polite">
      {message}
    </span>
  ) : null
}
