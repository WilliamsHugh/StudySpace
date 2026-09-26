import { useState, type FormEvent } from 'react'
import { validateCourse, type CourseErrors } from '../domain/course'
import type { Course, CourseDraft } from '../domain/types'
import { useStudySpace } from '../state/StudySpaceContext'

const emptyDraft: CourseDraft = { name: '', teacher: '', credits: 3, color: '#6657d9' }

export function CoursesPage() {
  const { state, addCourse, updateCourse, deleteCourse } = useStudySpace()
  const [draft, setDraft] = useState<CourseDraft>(emptyDraft)
  const [editing, setEditing] = useState<string | null>(null)
  const [errors, setErrors] = useState<CourseErrors>({})

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const nextErrors = validateCourse(draft)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    if (editing) updateCourse(editing, draft)
    else addCourse(draft)
    setDraft(emptyDraft)
    setEditing(null)
  }

  const startEditing = (course: Course) => {
    setDraft({ name: course.name, teacher: course.teacher, credits: course.credits, color: course.color })
    setEditing(course.id)
    setErrors({})
  }

  return (
    <div className="courses-layout">
      <section className="panel">
        <div className="section-heading"><div><p className="eyebrow">DAY 2</p><h2>{editing ? 'Cập nhật môn học' : 'Thêm môn học'}</h2></div></div>
        <form className="course-form" onSubmit={submit} noValidate>
          <div className="form-field"><label htmlFor="course-name">Tên môn học</label><input id="course-name" aria-describedby={errors.name ? 'course-name-error' : undefined} aria-invalid={Boolean(errors.name)} value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="Ví dụ: Cấu trúc dữ liệu" />{errors.name && <small className="field-error" id="course-name-error" role="alert">{errors.name}</small>}</div>
          <div className="form-field"><label htmlFor="course-teacher">Giảng viên</label><input id="course-teacher" value={draft.teacher} onChange={(e) => setDraft({ ...draft, teacher: e.target.value })} placeholder="Tên giảng viên" /></div>
          <div className="form-row">
            <div className="form-field"><label htmlFor="course-credits">Số tín chỉ</label><input id="course-credits" aria-describedby={errors.credits ? 'course-credits-error' : undefined} aria-invalid={Boolean(errors.credits)} type="number" min="1" max="15" value={draft.credits} onChange={(e) => setDraft({ ...draft, credits: Number(e.target.value) })} />{errors.credits && <small className="field-error" id="course-credits-error" role="alert">{errors.credits}</small>}</div>
            <div className="form-field"><label htmlFor="course-color">Màu nhận diện</label><input id="course-color" className="color-input" type="color" value={draft.color} onChange={(e) => setDraft({ ...draft, color: e.target.value })} /></div>
          </div>
          <div className="form-actions">
            {editing && <button className="button button--ghost" type="button" onClick={() => { setEditing(null); setDraft(emptyDraft) }}>Hủy</button>}
            <button className="button button--primary" type="submit">{editing ? 'Lưu thay đổi' : 'Thêm môn học'}</button>
          </div>
        </form>
      </section>
      <section className="panel">
        <div className="section-heading"><div><p className="eyebrow">DANH SÁCH</p><h2>Môn học của bạn</h2></div><span className="count-badge">{state.courses.length}</span></div>
        {state.courses.length === 0 ? <div className="list-empty">Chưa có môn học. Hãy tạo môn đầu tiên ở biểu mẫu bên cạnh.</div> : (
          <div className="course-list">{state.courses.map((course) => (
            <article className="course-item" key={course.id}>
              <span className="course-item__color" style={{ background: course.color }} />
              <div className="course-item__body"><strong>{course.name}</strong><span>{course.teacher || 'Chưa có giảng viên'} · {course.credits} tín chỉ</span></div>
              <div className="course-item__actions"><button type="button" onClick={() => startEditing(course)}>Sửa</button><button className="danger-link" type="button" onClick={() => { if (window.confirm(`Xóa môn “${course.name}”?`)) deleteCourse(course.id) }}>Xóa</button></div>
            </article>
          ))}</div>
        )}
      </section>
    </div>
  )
}
