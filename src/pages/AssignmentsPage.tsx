import { useMemo, useState, type FormEvent } from 'react'
import { assignmentRepository } from '../data/storage'
import {
  filterAssignments,
  isOverdue,
  parseTags,
  priorityLabels,
  sortAssignmentsByDeadline,
  statusLabels,
  validateAssignment,
  type AssignmentErrors,
  type AssignmentInput,
} from '../domain/assignments'
import type { AppData, Assignment, AssignmentPriority, AssignmentStatus, Course } from '../types'
import { FieldError } from '../components/FieldError'

type Props = {
  data: AppData
  updateData: (updater: (current: AppData) => AppData) => void
}

const blankForm: AssignmentInput = {
  courseId: '',
  title: '',
  description: '',
  dueDate: '',
  status: 'todo',
  priority: 'medium',
  tags: [],
}

const dateFormatter = new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium', timeStyle: 'short' })

function courseName(courses: Course[], courseId: string) {
  return courses.find((course) => course.id === courseId)?.name ?? 'Môn học đã xóa'
}

export function AssignmentsPage({ data, updateData }: Props) {
  const [form, setForm] = useState<AssignmentInput>(blankForm)
  const [tagsInput, setTagsInput] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [errors, setErrors] = useState<AssignmentErrors>({})
  const [courseFilter, setCourseFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState<'all' | AssignmentStatus>('all')
  const [priorityFilter, setPriorityFilter] = useState<'all' | AssignmentPriority>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const visibleAssignments = useMemo(
    () =>
      filterAssignments(sortAssignmentsByDeadline(data.assignments), {
        courseId: courseFilter,
        status: statusFilter,
        priority: priorityFilter,
        searchQuery,
      }),
    [courseFilter, data.assignments, priorityFilter, searchQuery, statusFilter],
  )

  const isFiltered = courseFilter !== 'all' || statusFilter !== 'all' || priorityFilter !== 'all' || searchQuery.trim() !== ''

  function clearAllFilters() {
    setCourseFilter('all')
    setStatusFilter('all')
    setPriorityFilter('all')
    setSearchQuery('')
  }

  function submit(event: FormEvent) {
    event.preventDefault()
    const nextErrors = validateAssignment(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    const assignment: Assignment = {
      ...form,
      id: editingId ?? crypto.randomUUID(),
      priority: form.priority ?? 'medium',
      tags: parseTags(tagsInput),
    }

    updateData((current) =>
      editingId
        ? assignmentRepository.update(current, assignment)
        : assignmentRepository.create(current, assignment),
    )
    resetForm()
  }

  function resetForm() {
    setForm(blankForm)
    setTagsInput('')
    setEditingId(null)
    setErrors({})
  }

  function edit(assignment: Assignment) {
    setEditingId(assignment.id)
    setForm({
      courseId: assignment.courseId,
      title: assignment.title,
      description: assignment.description,
      dueDate: assignment.dueDate.slice(0, 16),
      status: assignment.status,
      priority: assignment.priority ?? 'medium',
      tags: assignment.tags ?? [],
    })
    setTagsInput(assignment.tags?.join(', ') ?? '')
    setErrors({})
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function remove(assignment: Assignment) {
    if (!window.confirm(`Xóa bài tập “${assignment.title}”?`)) return
    updateData((current) => assignmentRepository.remove(current, assignment.id))
    if (editingId === assignment.id) resetForm()
  }

  return (
    <div className="page-grid">
      <section className="panel form-panel">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Công việc học tập</span>
            <h2>{editingId ? 'Cập nhật bài tập' : 'Thêm bài tập'}</h2>
          </div>
        </div>

        {data.courses.length === 0 && (
          <div className="notice">Chưa có môn học. Hãy thêm môn ở màn hình Courses trước khi tạo bài tập.</div>
        )}

        <form onSubmit={submit} noValidate>
          <label>
            Môn học
            <select
              value={form.courseId}
              onChange={(event) => setForm({ ...form, courseId: event.target.value })}
              disabled={data.courses.length === 0}
            >
              <option value="">Chọn môn học</option>
              {data.courses.map((course) => (
                <option key={course.id} value={course.id}>{course.name}</option>
              ))}
            </select>
            <FieldError message={errors.courseId} />
          </label>

          <label>
            Tiêu đề
            <input
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
              placeholder="Ví dụ: Nộp báo cáo chương 2"
            />
            <FieldError message={errors.title} />
          </label>

          <label>
            Mô tả
            <textarea
              rows={3}
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              placeholder="Ghi chú, yêu cầu hoặc đường dẫn liên quan"
            />
          </label>

          <div className="form-row">
            <label>
              Hạn nộp
              <input
                type="datetime-local"
                value={form.dueDate}
                onChange={(event) => setForm({ ...form, dueDate: event.target.value })}
              />
              <FieldError message={errors.dueDate} />
            </label>
            <label>
              Trạng thái
              <select
                value={form.status}
                onChange={(event) => setForm({ ...form, status: event.target.value as AssignmentStatus })}
              >
                {Object.entries(statusLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="form-row">
            <label>
              Mức ưu tiên
              <select
                aria-label="Mức ưu tiên bài tập"
                value={form.priority ?? 'medium'}
                onChange={(event) => setForm({ ...form, priority: event.target.value as AssignmentPriority })}
              >
                {Object.entries(priorityLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </label>
            <label>
              Nhãn (tags)
              <input
                value={tagsInput}
                onChange={(event) => setTagsInput(event.target.value)}
                placeholder="Ví dụ: Báo cáo, Đồ án"
                aria-label="Nhãn bài tập"
              />
            </label>
          </div>

          <div className="button-row">
            <button className="primary" type="submit" disabled={data.courses.length === 0}>
              {editingId ? 'Lưu thay đổi' : 'Thêm bài tập'}
            </button>
            {editingId && <button type="button" onClick={resetForm}>Hủy</button>}
          </div>
        </form>
      </section>

      <section className="panel list-panel">
        <div className="section-heading wrap">
          <div>
            <span className="eyebrow">Theo deadline</span>
            <h2>Danh sách bài tập</h2>
          </div>
          <div className="filters">
            <input
              type="search"
              className="filter-search"
              aria-label="Tìm kiếm bài tập"
              placeholder="Tìm theo tiêu đề, mô tả hoặc nhãn..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
            <select aria-label="Lọc theo môn" value={courseFilter} onChange={(event) => setCourseFilter(event.target.value)}>
              <option value="all">Tất cả môn</option>
              {data.courses.map((course) => <option key={course.id} value={course.id}>{course.name}</option>)}
            </select>
            <select
              aria-label="Lọc theo trạng thái"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as 'all' | AssignmentStatus)}
            >
              <option value="all">Tất cả trạng thái</option>
              {Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
            <select
              aria-label="Lọc theo mức ưu tiên"
              value={priorityFilter}
              onChange={(event) => setPriorityFilter(event.target.value as 'all' | AssignmentPriority)}
            >
              <option value="all">Tất cả ưu tiên</option>
              {Object.entries(priorityLabels).map(([value, label]) => (
                <option key={value} value={value}>Ưu tiên {label}</option>
              ))}
            </select>
            {isFiltered && (
              <button
                type="button"
                className="button secondary"
                onClick={clearAllFilters}
                aria-label="Đặt lại"
                style={{ fontSize: '0.78rem', padding: '6px 10px', whiteSpace: 'nowrap' }}
              >
                Đặt lại
              </button>
            )}
          </div>
        </div>

        {visibleAssignments.length === 0 ? (
          <div className="empty-state">
            <span>✓</span>
            <h3>Chưa có bài tập phù hợp</h3>
            <p>{isFiltered ? 'Không tìm thấy bài tập nào khớp với tiêu chí tìm kiếm và bộ lọc.' : 'Thêm bài tập mới để theo dõi tiến độ học tập.'}</p>
            {isFiltered && (
              <button type="button" onClick={clearAllFilters} style={{ marginTop: '10px' }}>
                Xóa toàn bộ điều kiện lọc
              </button>
            )}
          </div>
        ) : (
          <div className="assignment-list">
            {visibleAssignments.map((assignment) => {
              const overdue = isOverdue(assignment)
              const course = data.courses.find((item) => item.id === assignment.courseId)
              const priority = assignment.priority ?? 'medium'
              return (
                <article className={`assignment-card ${overdue ? 'overdue' : ''}`} key={assignment.id}>
                  <div className="color-mark" style={{ background: course?.color ?? '#94a3b8' }} />
                  <div className="assignment-body">
                    <div className="assignment-title-row">
                      <div>
                        <span className="course-name">{courseName(data.courses, assignment.courseId)}</span>
                        <h3>{assignment.title}</h3>
                      </div>
                      <div className="badges">
                        {overdue && <span className="badge danger">Quá hạn</span>}
                        <span className={`badge priority-${priority}`}>
                          {priorityLabels[priority]}
                        </span>
                        <span className={`badge status-${assignment.status}`}>{statusLabels[assignment.status]}</span>
                      </div>
                    </div>
                    {assignment.description && <p>{assignment.description}</p>}
                    {assignment.tags && assignment.tags.length > 0 && (
                      <div className="assignment-tags" aria-label="Nhãn bài tập">
                        {assignment.tags.map((tag) => (
                          <span key={tag} className="tag-chip">#{tag}</span>
                        ))}
                      </div>
                    )}
                    <div className="assignment-footer">
                      <time dateTime={assignment.dueDate}>Hạn: {dateFormatter.format(new Date(assignment.dueDate))}</time>
                      <div className="inline-actions">
                        <button type="button" onClick={() => edit(assignment)}>Sửa</button>
                        <button className="danger-button" type="button" onClick={() => remove(assignment)}>Xóa</button>
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
