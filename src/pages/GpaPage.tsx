import { useState, type FormEvent } from 'react'
import { FieldError } from '../components/FieldError'
import { gpaRepository } from '../data/storage'
import {
  calculateWeightedGpa,
  convertGrade10To4,
  gradeScale,
  validateGpaEntry,
  type GpaValidationErrors,
} from '../domain/gpa'
import type { AppData, GpaEntry } from '../types'

type Props = {
  data: AppData
  updateData: (updater: (current: AppData) => AppData) => void
}

type GpaForm = { courseId: string; expectedGrade: string; credits: string }
const blankForm: GpaForm = { courseId: '', expectedGrade: '', credits: '' }

export function GpaPage({ data, updateData }: Props) {
  const [form, setForm] = useState<GpaForm>(blankForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [errors, setErrors] = useState<GpaValidationErrors>({})
  const gpa = calculateWeightedGpa(data.gpaEntries)
  const totalCredits = data.gpaEntries.reduce((sum, entry) => sum + entry.credits, 0)

  function submit(event: FormEvent) {
    event.preventDefault()
    const candidate = {
      courseId: form.courseId,
      expectedGrade: form.expectedGrade === '' ? Number.NaN : Number(form.expectedGrade),
      credits: form.credits === '' ? Number.NaN : Number(form.credits),
    }
    const nextErrors = validateGpaEntry(candidate)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    const entry: GpaEntry = { id: editingId ?? crypto.randomUUID(), ...candidate }
    updateData((current) => gpaRepository.upsert(current, entry))
    resetForm()
  }

  function resetForm() {
    setForm(blankForm)
    setEditingId(null)
    setErrors({})
  }

  function chooseCourse(courseId: string) {
    const course = data.courses.find((item) => item.id === courseId)
    setForm({ ...form, courseId, credits: course ? String(course.credits) : form.credits })
  }

  function edit(entry: GpaEntry) {
    setEditingId(entry.id)
    setForm({ courseId: entry.courseId, expectedGrade: String(entry.expectedGrade), credits: String(entry.credits) })
    setErrors({})
  }

  return (
    <div className="gpa-layout">
      <section className="gpa-summary">
        <span className="eyebrow light">Kết quả dự kiến</span>
        <div className="gpa-value">{gpa === null ? '—' : gpa.toFixed(2)}</div>
        <p>GPA hệ 4 · {totalCredits} tín chỉ</p>
        <div className="formula">Σ (điểm hệ 4 × tín chỉ) / Σ tín chỉ</div>
      </section>

      <section className="panel">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Mô phỏng kết quả</span>
            <h2>{editingId ? 'Cập nhật điểm' : 'Thêm điểm dự kiến'}</h2>
          </div>
        </div>
        {data.courses.length === 0 && <div className="notice">Cần có ít nhất một môn học để mô phỏng GPA.</div>}
        <form onSubmit={submit} noValidate>
          <label>
            Môn học
            <select value={form.courseId} onChange={(event) => chooseCourse(event.target.value)} disabled={data.courses.length === 0}>
              <option value="">Chọn môn học</option>
              {data.courses.map((course) => <option key={course.id} value={course.id}>{course.name}</option>)}
            </select>
            <FieldError message={errors.courseId} />
          </label>
          <div className="form-row">
            <label>
              Điểm dự kiến (hệ 10)
              <input type="number" min="0" max="10" step="0.1" value={form.expectedGrade} onChange={(event) => setForm({ ...form, expectedGrade: event.target.value })} />
              <FieldError message={errors.expectedGrade} />
            </label>
            <label>
              Số tín chỉ
              <input type="number" min="0.5" step="0.5" value={form.credits} onChange={(event) => setForm({ ...form, credits: event.target.value })} />
              <FieldError message={errors.credits} />
            </label>
          </div>
          <div className="button-row">
            <button className="primary" type="submit" disabled={data.courses.length === 0}>{editingId ? 'Lưu thay đổi' : 'Thêm vào mô phỏng'}</button>
            {editingId && <button type="button" onClick={resetForm}>Hủy</button>}
          </div>
        </form>
      </section>

      <section className="panel gpa-table-panel">
        <div className="section-heading">
          <div><span className="eyebrow">Chi tiết</span><h2>Các môn đã nhập</h2></div>
        </div>
        {data.gpaEntries.length === 0 ? (
          <div className="empty-state compact"><h3>Chưa có điểm dự kiến</h3><p>Nhập điểm và tín chỉ để bắt đầu tính GPA.</p></div>
        ) : (
          <div className="table-scroll">
            <table>
              <thead><tr><th>Môn học</th><th>Hệ 10</th><th>Hệ 4</th><th>Tín chỉ</th><th /></tr></thead>
              <tbody>
                {data.gpaEntries.map((entry) => (
                  <tr key={entry.id}>
                    <td>{data.courses.find((course) => course.id === entry.courseId)?.name ?? 'Môn học đã xóa'}</td>
                    <td>{entry.expectedGrade.toFixed(1)}</td>
                    <td>{convertGrade10To4(entry.expectedGrade)?.toFixed(1)}</td>
                    <td>{entry.credits}</td>
                    <td className="table-actions"><button onClick={() => edit(entry)}>Sửa</button><button className="danger-button" onClick={() => updateData((current) => gpaRepository.remove(current, entry.id))}>Xóa</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="panel scale-panel">
        <div className="section-heading"><div><span className="eyebrow">Quy ước MVP</span><h2>Bảng quy đổi</h2></div></div>
        <div className="scale-grid">
          {gradeScale.map((band, index) => {
            const upper = index === 0 ? 10 : gradeScale[index - 1].minimum - 0.1
            return <div key={band.minimum}><strong>{band.minimum.toFixed(1)}–{upper.toFixed(1)}</strong><span>{band.point.toFixed(1)}</span></div>
          })}
        </div>
      </section>
    </div>
  )
}
