import { useState, type FormEvent } from 'react'
import {
  defaultAssignmentFilters,
  filterAndSortAssignments,
  isOverdue,
  validateAssignment,
  type AssignmentErrors,
  type AssignmentStatusFilter,
} from '../domain/assignment'
import type { Assignment, AssignmentDraft, AssignmentStatus } from '../domain/types'
import { useStudySpace } from '../state/StudySpaceContext'

const statusLabels: Record<AssignmentStatus, string> = { todo: 'Cần làm', in_progress: 'Đang làm', completed: 'Hoàn thành' }
const emptyDraft = (courseId = ''): AssignmentDraft => ({ courseId, title: '', description: '', dueDate: '', status: 'todo' })
const formatDeadline = (value: string) => new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))

export function AssignmentsPage() {
  const { state, addAssignment, updateAssignment, deleteAssignment } = useStudySpace()
  const [draft, setDraft] = useState<AssignmentDraft>(() => emptyDraft(state.courses[0]?.id))
  const [editing, setEditing] = useState<string | null>(null)
  const [errors, setErrors] = useState<AssignmentErrors>({})
  const [courseFilter, setCourseFilter] = useState(defaultAssignmentFilters.courseId)
  const [statusFilter, setStatusFilter] = useState<AssignmentStatusFilter>(defaultAssignmentFilters.status)
  const assignments = filterAndSortAssignments(state.assignments, { courseId: courseFilter, status: statusFilter })
  const coursesById = new Map(state.courses.map((course) => [course.id, course]))
  const resetForm = () => { setDraft(emptyDraft(state.courses[0]?.id)); setEditing(null); setErrors({}) }
  const resetFilters = () => {
    setCourseFilter(defaultAssignmentFilters.courseId)
    setStatusFilter(defaultAssignmentFilters.status)
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const nextErrors = validateAssignment(draft, state.courses)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    if (editing) updateAssignment(editing, draft)
    else addAssignment(draft)
    resetForm()
  }

  const startEditing = (item: Assignment) => {
    setDraft({ courseId: item.courseId, title: item.title, description: item.description, dueDate: item.dueDate, status: item.status })
    setEditing(item.id)
    setErrors({})
  }
  const changeStatus = (item: Assignment, status: AssignmentStatus) => updateAssignment(item.id, { courseId: item.courseId, title: item.title, description: item.description, dueDate: item.dueDate, status })

  if (state.courses.length === 0) return <section className="panel empty-state"><div className="empty-state__icon">＋</div><h2>Hãy thêm môn học trước</h2><p>Mỗi bài tập phải thuộc một môn học. Tạo môn học ở mục “Môn học”, sau đó quay lại đây để thêm deadline.</p></section>

  return <div className="assignments-layout">
    <section className="panel">
      <div className="section-heading"><div><p className="eyebrow">DAY 4</p><h2>{editing ? 'Cập nhật bài tập' : 'Thêm bài tập'}</h2></div></div>
      <form className="assignment-form" onSubmit={submit} noValidate>
        <div className="form-field"><label htmlFor="assignment-course">Môn học</label><select id="assignment-course" aria-describedby={errors.courseId ? 'assignment-course-error' : undefined} aria-invalid={Boolean(errors.courseId)} value={draft.courseId} onChange={(event) => setDraft({ ...draft, courseId: event.target.value })}><option value="">Chọn môn học</option>{state.courses.map((course) => <option key={course.id} value={course.id}>{course.name}</option>)}</select>{errors.courseId && <small className="field-error" id="assignment-course-error" role="alert">{errors.courseId}</small>}</div>
        <div className="form-field"><label htmlFor="assignment-title">Tên bài tập</label><input id="assignment-title" aria-describedby={errors.title ? 'assignment-title-error' : undefined} aria-invalid={Boolean(errors.title)} value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} placeholder="Ví dụ: Báo cáo giữa kỳ" />{errors.title && <small className="field-error" id="assignment-title-error" role="alert">{errors.title}</small>}</div>
        <div className="form-field"><label htmlFor="assignment-description">Mô tả</label><textarea id="assignment-description" value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} rows={3} placeholder="Ghi chú hoặc yêu cầu bài tập" /></div>
        <div className="form-row">
          <div className="form-field"><label htmlFor="assignment-due-date">Hạn nộp</label><input id="assignment-due-date" aria-describedby={errors.dueDate ? 'assignment-due-date-error' : undefined} aria-invalid={Boolean(errors.dueDate)} type="datetime-local" value={draft.dueDate} onChange={(event) => setDraft({ ...draft, dueDate: event.target.value })} />{errors.dueDate && <small className="field-error" id="assignment-due-date-error" role="alert">{errors.dueDate}</small>}</div>
          <div className="form-field"><label htmlFor="assignment-status">Trạng thái</label><select id="assignment-status" value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value as AssignmentStatus })}>{Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
        </div>
        <div className="form-actions">{editing && <button className="button button--ghost" type="button" onClick={resetForm}>Hủy</button>}<button className="button button--primary" type="submit">{editing ? 'Lưu thay đổi' : 'Thêm bài tập'}</button></div>
      </form>
    </section>
    <section className="panel">
      <div className="section-heading"><div><p className="eyebrow">DEADLINE GẦN NHẤT</p><h2>Danh sách bài tập</h2></div><span className="count-badge">{assignments.length}</span></div>
      <div className="assignment-filters" aria-label="Bộ lọc bài tập">
        <label>Môn học<select aria-label="Lọc theo môn học" value={courseFilter} onChange={(event) => setCourseFilter(event.target.value)}><option value="all">Tất cả</option>{state.courses.map((course) => <option key={course.id} value={course.id}>{course.name}</option>)}</select></label>
        <label>Trạng thái<select aria-label="Lọc theo trạng thái" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as AssignmentStatusFilter)}><option value="all">Tất cả</option>{Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}<option value="overdue">Quá hạn</option></select></label>
        <button className="button button--ghost filter-reset" type="button" onClick={resetFilters} disabled={courseFilter === 'all' && statusFilter === 'all'}>Đặt lại bộ lọc</button>
      </div>
      {assignments.length === 0 ? <div className="list-empty">{state.assignments.length === 0 ? 'Chưa có bài tập. Hãy thêm deadline đầu tiên.' : 'Không có bài tập phù hợp với bộ lọc.'}</div> : <div className="assignment-list">{assignments.map((item) => {
        const course = coursesById.get(item.courseId)
        const overdue = isOverdue(item)
        return <article className={`assignment-item ${overdue ? 'assignment-item--overdue' : ''}`} key={item.id}>
          <span className="assignment-item__color" style={{ background: course?.color }} />
          <div className="assignment-item__body"><div className="assignment-item__title"><strong>{item.title}</strong>{overdue && <span className="status-chip status-chip--overdue">Quá hạn</span>}</div><span>{course?.name ?? 'Môn học đã xóa'} · {formatDeadline(item.dueDate)}</span>{item.description && <p>{item.description}</p>}</div>
          <div className="assignment-item__controls"><select aria-label={`Trạng thái của ${item.title}`} className={`status-select status-select--${item.status}`} value={item.status} onChange={(event) => changeStatus(item, event.target.value as AssignmentStatus)}>{Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><div className="course-item__actions"><button type="button" onClick={() => startEditing(item)}>Sửa</button><button className="danger-link" type="button" onClick={() => { if (window.confirm(`Xóa bài tập “${item.title}”?`)) deleteAssignment(item.id) }}>Xóa</button></div></div>
        </article>
      })}</div>}
    </section>
  </div>
}
