import { useState } from 'react'
import { Modal } from '../../components/Modal'
import { useAppData } from '../../context/AppDataContext'
import type { Schedule } from '../../types'
import { ScheduleForm } from './ScheduleForm'

const days = [
  [1, 'THỨ HAI'], [2, 'THỨ BA'], [3, 'THỨ TƯ'], [4, 'THỨ NĂM'], [5, 'THỨ SÁU'], [6, 'THỨ BẢY'], [7, 'CHỦ NHẬT'],
] as const

export function SchedulePage() {
  const { courses, schedules, saveSchedule, deleteSchedule } = useAppData()
  const [editing, setEditing] = useState<Schedule | null | undefined>(undefined)

  return <main className="page">
    <div className="page-heading"><div><p className="eyebrow">LỊCH HỌC HÀNG TUẦN</p><h1>Thời khóa biểu</h1><p>Tổng quan các buổi học trong tuần.</p></div><button className="button" disabled={!courses.length} onClick={() => setEditing(null)}>+ Thêm lịch học</button></div>
    {!courses.length ? <section className="empty"><div className="empty-icon">□</div><h2>Cần có môn học trước</h2><p>Hãy thêm một môn học, sau đó quay lại để xếp lịch.</p></section> :
      <section className="week-grid" aria-label="Thời khóa biểu theo tuần">
        {days.map(([day, label]) => {
          const entries = schedules.filter(({ dayOfWeek }) => dayOfWeek === day).sort((a, b) => a.startTime.localeCompare(b.startTime))
          return <div className="day-column" key={day}><header><span>{label}</span><small>{entries.length} buổi</small></header><div className="day-content">{entries.length === 0 ? <p className="no-class">Trống</p> : entries.map((entry) => {
            const course = courses.find(({ id }) => id === entry.courseId)
            if (!course) return null
            return <article className="schedule-card" key={entry.id} style={{ '--course-color': course.color } as React.CSSProperties}><time>{entry.startTime} – {entry.endTime}</time><h3>{course.name}</h3><p>{entry.room || 'Chưa có phòng'}</p><div className="inline-actions"><button className="text-button" onClick={() => setEditing(entry)}>Sửa</button><button className="text-button danger" onClick={() => confirm(`Xóa lịch học “${course.name}”?`) && deleteSchedule(entry.id)}>Xóa</button></div></article>
          })}</div></div>
        })}
      </section>}
    {editing !== undefined && <Modal title={editing ? 'Chỉnh sửa lịch học' : 'Thêm lịch học'} onClose={() => setEditing(undefined)}><ScheduleForm schedule={editing ?? undefined} courses={courses} onCancel={() => setEditing(undefined)} onSave={(schedule) => { saveSchedule(schedule); setEditing(undefined) }} /></Modal>}
  </main>
}
