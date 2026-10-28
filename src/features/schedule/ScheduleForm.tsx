import { useMemo, useState, type FormEvent } from 'react'
import type { Course, DayOfWeek, Schedule } from '../../types'
import { validateSchedule, type FieldErrors } from '../../utils/validation'
import { findScheduleConflicts } from '../../domain/schedule'

const dayOptions = [
  [1, 'Thứ Hai'], [2, 'Thứ Ba'], [3, 'Thứ Tư'], [4, 'Thứ Năm'], [5, 'Thứ Sáu'], [6, 'Thứ Bảy'], [7, 'Chủ Nhật'],
] as const

export function ScheduleForm({
  schedule,
  courses,
  schedules,
  existingSchedules,
  onSave,
  onCancel,
}: {
  schedule?: Schedule
  courses: Course[]
  schedules?: Schedule[]
  existingSchedules?: Schedule[]
  onSave: (schedule: Schedule) => void
  onCancel: () => void
}) {
  const allSchedules = existingSchedules ?? schedules ?? []
  const [form, setForm] = useState<Schedule>(
    schedule ?? { id: crypto.randomUUID(), courseId: '', dayOfWeek: 1, startTime: '08:00', endTime: '10:00', room: '' },
  )
  const [errors, setErrors] = useState<FieldErrors<Schedule>>({})
  const [allowConflict, setAllowConflict] = useState(false)
  const [conflictBlocked, setConflictBlocked] = useState(false)

  const conflicts = useMemo(
    () => findScheduleConflicts(form, allSchedules, courses),
    [form, allSchedules, courses],
  )

  function submit(event: FormEvent) {
    event.preventDefault()
    const nextErrors = validateSchedule(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    if (conflicts.length > 0 && !allowConflict) {
      setConflictBlocked(true)
      return
    }

    onSave({ ...form, room: form.room.trim() })
  }

  return (
    <form onSubmit={submit} noValidate>
      <div className="field">
        <label htmlFor="schedule-course">Môn học <span>*</span></label>
        <select
          id="schedule-course"
          value={form.courseId}
          onChange={(e) => {
            setForm({ ...form, courseId: e.target.value })
            setConflictBlocked(false)
          }}
          aria-invalid={!!errors.courseId}
        >
          <option value="">Chọn môn học</option>
          {courses.map((course) => <option key={course.id} value={course.id}>{course.name}</option>)}
        </select>
        {errors.courseId && <small className="error">{errors.courseId}</small>}
      </div>
      <div className="field">
        <label htmlFor="day">Ngày học <span>*</span></label>
        <select
          id="day"
          value={form.dayOfWeek}
          onChange={(e) => {
            setForm({ ...form, dayOfWeek: Number(e.target.value) as DayOfWeek })
            setConflictBlocked(false)
          }}
        >
          {dayOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </div>
      <div className="field-row">
        <div className="field">
          <label htmlFor="start-time">Bắt đầu <span>*</span></label>
          <input
            id="start-time"
            type="time"
            value={form.startTime}
            onChange={(e) => {
              setForm({ ...form, startTime: e.target.value })
              setConflictBlocked(false)
            }}
          />
        </div>
        <div className="field">
          <label htmlFor="end-time">Kết thúc <span>*</span></label>
          <input
            id="end-time"
            type="time"
            value={form.endTime}
            onChange={(e) => {
              setForm({ ...form, endTime: e.target.value })
              setConflictBlocked(false)
            }}
            aria-invalid={!!errors.endTime}
          />
          {errors.endTime && <small className="error">{errors.endTime}</small>}
        </div>
      </div>
      <div className="field">
        <label htmlFor="room">Phòng học</label>
        <input
          id="room"
          value={form.room}
          onChange={(e) => setForm({ ...form, room: e.target.value })}
          placeholder="Ví dụ: A2.04"
        />
      </div>

      {conflicts.length > 0 && (
        <div className="conflict-warning" role="alert" aria-live="polite">
          <strong>⚠️ Cảnh báo trùng lịch học!</strong>
          <p>
            Khung giờ này ({form.startTime} – {form.endTime}) bị trùng với {conflicts.length} buổi học khác:
          </p>
          <ul>
            {conflicts.map((c, i) => (
              <li key={i}>
                {c.reason}
              </li>
            ))}
          </ul>
          {conflictBlocked && !allowConflict && (
            <p className="field-error" style={{ marginTop: '6px' }}>
              Lịch học bị trùng thời gian với buổi học khác. Vui lòng quay lại chỉnh sửa hoặc tích chọn xác nhận bên dưới.
            </p>
          )}
          <label className="checkbox-label">
            <input
              type="checkbox"
              aria-label="Xác nhận vẫn lưu buổi học này dù bị trùng"
              checked={allowConflict}
              onChange={(e) => {
                setAllowConflict(e.target.checked)
                if (e.target.checked) setConflictBlocked(false)
              }}
            />
            Xác nhận vẫn lưu buổi học này dù bị trùng
          </label>
        </div>
      )}

      <div className="form-actions">
        <button className="button secondary" type="button" onClick={onCancel}>
          Hủy
        </button>
        <button className="button" type="submit">
          Lưu lịch học
        </button>
      </div>
    </form>
  )
}
