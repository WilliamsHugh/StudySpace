import { useState } from 'react'
import { Modal } from '../../components/Modal'
import { useAppData } from '../../context/AppDataContext'
import type { Course } from '../../types'
import { CourseForm } from './CourseForm'

export function CoursesPage() {
  const { courses, schedules, saveCourse, deleteCourse } = useAppData()
  const [editing, setEditing] = useState<Course | null | undefined>(undefined)

  function remove(course: Course) {
    const count = schedules.filter(({ courseId }) => courseId === course.id).length
    const note = count ? ` và ${count} lịch học liên quan` : ''
    if (confirm(`Xóa môn “${course.name}”${note}?`)) deleteCourse(course.id)
  }

  return (
    <main className="page">
      <div className="page-heading"><div><p className="eyebrow">HỌC KỲ HIỆN TẠI</p><h1>Môn học</h1><p>Quản lý môn học, giảng viên và số tín chỉ.</p></div><button className="button" onClick={() => setEditing(null)}>+ Thêm môn học</button></div>
      {courses.length === 0 ? <section className="empty"><div className="empty-icon">◎</div><h2>Chưa có môn học</h2><p>Thêm môn đầu tiên để bắt đầu xếp thời khóa biểu.</p><button className="button" onClick={() => setEditing(null)}>Thêm môn học</button></section> :
        <section className="course-grid" aria-label="Danh sách môn học">
          {courses.map((course) => <article className="course-card" key={course.id} style={{ '--course-color': course.color } as React.CSSProperties}>
            <div className="course-color" /><div className="card-top"><span className="credit-pill">{course.credits} tín chỉ</span><div className="inline-actions"><button className="text-button" onClick={() => setEditing(course)}>Sửa</button><button className="text-button danger" onClick={() => remove(course)}>Xóa</button></div></div>
            <h2>{course.name}</h2><p>{course.teacher || 'Chưa có giảng viên'}</p><small>{schedules.filter(({ courseId }) => courseId === course.id).length} buổi / tuần</small>
          </article>)}
        </section>}
      {editing !== undefined && <Modal title={editing ? 'Chỉnh sửa môn học' : 'Thêm môn học'} onClose={() => setEditing(undefined)}><CourseForm course={editing ?? undefined} onCancel={() => setEditing(undefined)} onSave={(course) => { saveCourse(course); setEditing(undefined) }} /></Modal>}
    </main>
  )
}
