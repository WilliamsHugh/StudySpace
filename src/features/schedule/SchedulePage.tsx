import { useState, type CSSProperties } from 'react'
import { Modal } from '../../components/Modal'
import type { ScheduleEntry } from '../../domain/types'
import { useStudySpace } from '../../state/StudySpaceContext'
import { ScheduleForm } from './ScheduleForm'

const days = [
  [1, 'THỨ HAI'], [2, 'THỨ BA'], [3, 'THỨ TƯ'], [4, 'THỨ NĂM'], [5, 'THỨ SÁU'], [6, 'THỨ BẢY'], [7, 'CHỦ NHẬT'],
] as const

export function SchedulePage() {
  const { state, addSchedule, updateSchedule, deleteSchedule } = useStudySpace()
  const [editing, setEditing] = useState<ScheduleEntry | null | undefined>(undefined)

  return <main className="page">
    <div className="page-heading"><div><p className="eyebrow">LỊCH HỌC HÀNG TUẦN</p><h1>Thời khóa biểu</h1><p>Tổng quan các buổi học trong tuần.</p></div><button className="button" disabled={!state.courses.length} onClick={() => setEditing(null)}>+ Thêm lịch học</button></div>
    {!state.courses.length ? <section className="empty"><div className="empty-icon">□</div><h2>Cần có môn học trước</h2><p>Hãy thêm một môn học, sau đó quay lại để xếp lịch.</p></section> :
      <section className="week-grid" aria-label="Thời khóa biểu theo tuần">
        {days.map(([day, label]) => {
          const entries = state.schedule.filter((entry) => entry.dayOfWeek === day).sort((left, right) => left.startTime.localeCompare(right.startTime))
          return <div className="day-column" key={day}><header><span>{label}</span><small>{entries.length} buổi</small></header><div className="day-content">{entries.length === 0 ? <p className="no-class">Trống</p> : entries.map((entry) => {
            const course = state.courses.find((item) => item.id === entry.courseId)
            if (!course) return null
            return <article className="schedule-card" key={entry.id} style={{ '--course-color': course.color } as CSSProperties}><time>{entry.startTime} – {entry.endTime}</time><h3>{course.name}</h3><p>{entry.room || 'Chưa có phòng'}</p><div className="inline-actions"><button className="text-button" onClick={() => setEditing(entry)}>Sửa</button><button className="text-button danger" onClick={() => window.confirm(`Xóa lịch học “${course.name}”?`) && deleteSchedule(entry.id)}>Xóa</button></div></article>
          })}</div></div>
        })}
      </section>}
    {editing !== undefined && <Modal title={editing ? 'Chỉnh sửa lịch học' : 'Thêm lịch học'} onClose={() => setEditing(undefined)}><ScheduleForm schedule={editing ?? undefined} courses={state.courses} onCancel={() => setEditing(undefined)} onSave={(draft) => { if (editing) updateSchedule({ ...editing, ...draft }); else addSchedule(draft); setEditing(undefined) }} /></Modal>}
  </main>
}
