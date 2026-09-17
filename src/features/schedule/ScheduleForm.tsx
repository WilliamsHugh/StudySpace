import { useState, type FormEvent } from 'react'
import type { Course, DayOfWeek, Schedule } from '../../types'
import { validateSchedule, type FieldErrors } from '../../utils/validation'

const dayOptions = [
  [1, 'Thứ Hai'], [2, 'Thứ Ba'], [3, 'Thứ Tư'], [4, 'Thứ Năm'], [5, 'Thứ Sáu'], [6, 'Thứ Bảy'], [7, 'Chủ Nhật'],
] as const

export function ScheduleForm({ schedule, courses, onSave, onCancel }: { schedule?: Schedule; courses: Course[]; onSave: (schedule: Schedule) => void; onCancel: () => void }) {
  const [form, setForm] = useState<Schedule>(schedule ?? { id: crypto.randomUUID(), courseId: '', dayOfWeek: 1, startTime: '08:00', endTime: '10:00', room: '' })
  const [errors, setErrors] = useState<FieldErrors<Schedule>>({})

  function submit(event: FormEvent) {
    event.preventDefault()
    const nextErrors = validateSchedule(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length === 0) onSave({ ...form, room: form.room.trim() })
  }

  return <form onSubmit={submit} noValidate>
    <div className="field"><label htmlFor="schedule-course">Môn học <span>*</span></label><select id="schedule-course" value={form.courseId} onChange={(e) => setForm({ ...form, courseId: e.target.value })} aria-invalid={!!errors.courseId}><option value="">Chọn môn học</option>{courses.map((course) => <option key={course.id} value={course.id}>{course.name}</option>)}</select>{errors.courseId && <small className="error">{errors.courseId}</small>}</div>
    <div className="field"><label htmlFor="day">Ngày học <span>*</span></label><select id="day" value={form.dayOfWeek} onChange={(e) => setForm({ ...form, dayOfWeek: Number(e.target.value) as DayOfWeek })}>{dayOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
    <div className="field-row"><div className="field"><label htmlFor="start-time">Bắt đầu <span>*</span></label><input id="start-time" type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} /></div><div className="field"><label htmlFor="end-time">Kết thúc <span>*</span></label><input id="end-time" type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} aria-invalid={!!errors.endTime} />{errors.endTime && <small className="error">{errors.endTime}</small>}</div></div>
    <div className="field"><label htmlFor="room">Phòng học</label><input id="room" value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })} placeholder="Ví dụ: A2.04" /></div>
    <div className="form-actions"><button className="button secondary" type="button" onClick={onCancel}>Hủy</button><button className="button" type="submit">Lưu lịch học</button></div>
  </form>
}
