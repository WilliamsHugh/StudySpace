import { useState, type FormEvent } from 'react'
import type { Course } from '../../types'
import { validateCourse, type FieldErrors } from '../../utils/validation'

const colors = ['#6558d3', '#e15c8b', '#1f9d8a', '#e0873c', '#3978c5', '#735c4d']

export function CourseForm({ course, onSave, onCancel }: { course?: Course; onSave: (course: Course) => void; onCancel: () => void }) {
  const [form, setForm] = useState<Course>(course ?? {
    id: crypto.randomUUID(), name: '', teacher: '', credits: 3, color: colors[0],
  })
  const [errors, setErrors] = useState<FieldErrors<Course>>({})

  function submit(event: FormEvent) {
    event.preventDefault()
    const nextErrors = validateCourse(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length === 0) onSave({ ...form, name: form.name.trim(), teacher: form.teacher.trim() })
  }

  return (
    <form onSubmit={submit} noValidate>
      <div className="field">
        <label htmlFor="course-name">Tên môn học <span>*</span></label>
        <input id="course-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} aria-invalid={!!errors.name} />
        {errors.name && <small className="error">{errors.name}</small>}
      </div>
      <div className="field">
        <label htmlFor="teacher">Giảng viên</label>
        <input id="teacher" value={form.teacher} onChange={(e) => setForm({ ...form, teacher: e.target.value })} />
      </div>
      <div className="field">
        <label htmlFor="credits">Số tín chỉ <span>*</span></label>
        <input id="credits" type="number" min="1" max="10" value={form.credits} onChange={(e) => setForm({ ...form, credits: Number(e.target.value) })} aria-invalid={!!errors.credits} />
        {errors.credits && <small className="error">{errors.credits}</small>}
      </div>
      <fieldset className="field color-field">
        <legend>Màu nhận diện</legend>
        <div className="color-options">
          {colors.map((color) => <label key={color} style={{ backgroundColor: color }} title={color}><input type="radio" name="color" value={color} checked={form.color === color} onChange={() => setForm({ ...form, color })} /><span className="sr-only">{color}</span></label>)}
        </div>
      </fieldset>
      <div className="form-actions"><button className="button secondary" type="button" onClick={onCancel}>Hủy</button><button className="button" type="submit">Lưu môn học</button></div>
    </form>
  )
}
