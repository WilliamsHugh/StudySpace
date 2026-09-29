import { useState, type FormEvent } from 'react'
import { validateSchedule, type ScheduleErrors } from '../../domain/schedule'
import type { Course, ScheduleDraft, ScheduleEntry, Weekday } from '../../domain/types'

const dayOptions = [
  [1, 'Thứ Hai'], [2, 'Thứ Ba'], [3, 'Thứ Tư'], [4, 'Thứ Năm'], [5, 'Thứ Sáu'], [6, 'Thứ Bảy'], [7, 'Chủ Nhật'],
] as const

type ScheduleFormProps = {
  schedule?: ScheduleEntry
  courses: Course[]
  onSave: (schedule: ScheduleDraft) => void
  onCancel: () => void
}

export function ScheduleForm({ schedule, courses, onSave, onCancel }: ScheduleFormProps) {
  const [form, setForm] = useState<ScheduleDraft>(schedule
    ? { courseId: schedule.courseId, dayOfWeek: schedule.dayOfWeek, startTime: schedule.startTime, endTime: schedule.endTime, room: schedule.room }
    : { courseId: '', dayOfWeek: 1, startTime: '08:00', endTime: '10:00', room: '' })
  const [errors, setErrors] = useState<ScheduleErrors>({})

  function submit(event: FormEvent) {
    event.preventDefault()
    const nextErrors = validateSchedule(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length === 0) onSave({ ...form, room: form.room.trim() })
  }

  return <form onSubmit={submit} noValidate>
    <div className="field"><label htmlFor="schedule-course">Môn học <span>*</span></label><select id="schedule-course" value={form.courseId} onChange={(event) => setForm({ ...form, courseId: event.target.value })} aria-invalid={Boolean(errors.courseId)}><option value="">Chọn môn học</option>{courses.map((course) => <option key={course.id} value={course.id}>{course.name}</option>)}</select>{errors.courseId && <small className="error">{errors.courseId}</small>}</div>
    <div className="field"><label htmlFor="day">Ngày học <span>*</span></label><select id="day" value={form.dayOfWeek} onChange={(event) => setForm({ ...form, dayOfWeek: Number(event.target.value) as Weekday })}>{dayOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
    <div className="field-row"><div className="field"><label htmlFor="start-time">Bắt đầu <span>*</span></label><input id="start-time" type="time" value={form.startTime} onChange={(event) => setForm({ ...form, startTime: event.target.value })} /></div><div className="field"><label htmlFor="end-time">Kết thúc <span>*</span></label><input id="end-time" type="time" value={form.endTime} onChange={(event) => setForm({ ...form, endTime: event.target.value })} aria-invalid={Boolean(errors.endTime)} />{errors.endTime && <small className="error">{errors.endTime}</small>}</div></div>
    <div className="field"><label htmlFor="room">Phòng học</label><input id="room" value={form.room} onChange={(event) => setForm({ ...form, room: event.target.value })} placeholder="Ví dụ: A2.04" /></div>
    <div className="form-actions"><button className="button secondary" type="button" onClick={onCancel}>Hủy</button><button className="button" type="submit">Lưu lịch học</button></div>
  </form>
}
