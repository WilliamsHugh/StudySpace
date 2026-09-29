import { useMemo, useState } from 'react'
import { getOverdueAssignments, getUpcomingAssignments, statusLabels } from '../domain/assignment'
import { calculateGpa } from '../domain/gpa'
import type { Assignment } from '../domain/types'
import { useStudySpace } from '../state/StudySpaceContext'

type Page = 'dashboard' | 'courses' | 'schedule' | 'assignments' | 'gpa'

export function DashboardPage({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const { state } = useStudySpace()
  const [query, setQuery] = useState('')
  const now = new Date()
  const courseById = useMemo(() => new Map(state.courses.map((course) => [course.id, course])), [state.courses])
  const upcoming = getUpcomingAssignments(state.assignments, now, 5)
  const overdue = getOverdueAssignments(state.assignments, now)
  const completed = state.assignments.filter((item) => item.status === 'completed').length
  const inProgress = state.assignments.filter((item) => item.status === 'in_progress').length
  const todo = state.assignments.filter((item) => item.status === 'todo').length
  const gpa = calculateGpa(state.courses, state.gradeExpectations)
  const filtered = upcoming.filter((item) => {
    const course = courseById.get(item.courseId)?.name ?? ''
    return `${item.title} ${course}`.toLocaleLowerCase('vi').includes(query.trim().toLocaleLowerCase('vi'))
  })
  const completion = state.assignments.length ? Math.round(completed / state.assignments.length * 100) : 0
  const dateText = new Intl.DateTimeFormat('vi-VN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(now)

  return <main className="dash-page">
    <div className="dash-welcome"><div><p className="dash-date">{dateText}</p><h1>Chào Thuận, bắt đầu nhé!</h1><p>Một chút tập trung hôm nay sẽ giúp bạn tiến xa hơn.</p></div><button className="dash-primary" onClick={() => onNavigate('assignments')}>＋ Thêm công việc</button></div>
    <section className="dash-stats" aria-label="Tổng quan học tập">
      <article className="dash-stat"><span className="dash-stat-icon purple">▤</span><small>HỌC TẬP</small><strong>{state.courses.length}<em> môn học</em></strong><span>Đang theo dõi trong học kỳ</span></article>
      <article className="dash-stat"><span className="dash-stat-icon blue">☷</span><small>CÔNG VIỆC</small><strong>{state.assignments.length}<em> nhiệm vụ</em></strong><span><b>{completed} hoàn thành</b> · {state.assignments.length - completed} còn lại</span></article>
      <article className="dash-stat"><span className="dash-stat-icon orange">◷</span><small>CẦN LƯU Ý</small><strong>{overdue.length}<em> quá hạn</em></strong><span>Trong số công việc chưa hoàn thành</span></article>
      <article className="dash-stat"><span className="dash-stat-icon green">✧</span><small>MỤC TIÊU</small><strong>{gpa == null ? '—' : gpa.toFixed(2)}<em> / 4.00 GPA</em></strong><span>{gpa == null ? 'Nhập điểm dự kiến để xem GPA' : 'GPA dự kiến theo tín chỉ'}</span></article>
    </section>
    <div className="dash-columns">
      <section className="dash-panel"><header className="dash-panel-head"><div><h2>Deadline sắp tới</h2><p>Các việc cần hoàn thành tiếp theo</p></div><button onClick={() => onNavigate('assignments')}>Xem tất cả →</button></header>
        <label className="dash-search"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm công việc hoặc môn học" /></label>
        <div className="dash-list">{filtered.length === 0 ? <div className="dash-empty"><span>✓</span><strong>{upcoming.length ? 'Không tìm thấy công việc' : 'Chưa có deadline sắp tới'}</strong><small>{upcoming.length ? 'Thử từ khóa khác nhé.' : 'Thêm deadline để bắt đầu theo dõi.'}</small></div> : filtered.map((item: Assignment) => {
          const course = courseById.get(item.courseId)
          return <article className="dash-assignment" key={item.id}><i style={{ background: course?.color ?? '#a8aebd' }} /><div><strong>{item.title}</strong><small>{course?.name ?? 'Môn học đã xóa'}</small></div><span className={`dash-status ${item.status}`}>{statusLabels[item.status]}</span><time>{new Intl.DateTimeFormat('vi-VN', { day: 'numeric', month: 'short' }).format(new Date(item.dueDate))}</time></article>
        })}</div>
      </section>
      <section className="dash-panel dash-progress"><header className="dash-panel-head"><div><h2>Tiến độ học tập</h2><p>Tổng quan các công việc</p></div><span className="dash-spark">✧</span></header>
        <div className="dash-progress-number"><strong>{completion}<small>%</small></strong><span>đã hoàn thành</span></div><div className="dash-track"><span style={{ width: `${completion}%` }} /></div>
        <div className="dash-legend"><span className="legend-done"><i /> Hoàn thành <b>{completed}</b></span><span className="legend-progress"><i /> Đang thực hiện <b>{inProgress}</b></span><span className="legend-todo"><i /> Chưa làm <b>{todo}</b></span></div>
        <div className="dash-note">✓　{state.assignments.length ? `${inProgress} công việc đang được xử lý. Cứ tiếp tục từng bước!` : 'Thêm công việc để theo dõi tiến độ của bạn.'}</div>
      </section>
    </div>
    <section className="dash-panel dash-courses"><header className="dash-panel-head"><div><h2>Môn học của bạn</h2><p>Các môn đang theo dõi trong học kỳ này</p></div><button onClick={() => onNavigate('courses')}>Quản lý môn học →</button></header>
      {state.courses.length === 0 ? <div className="dash-course-empty"><span>▤</span><div><strong>Bắt đầu với môn học đầu tiên</strong><small>Thêm môn học để kết nối lịch học, deadline và điểm số.</small></div><button onClick={() => onNavigate('courses')}>＋ Thêm môn học</button></div> : <div className="dash-course-chips">{state.courses.slice(0, 6).map((course) => <button key={course.id} onClick={() => onNavigate('courses')}><i style={{ background: course.color }} />{course.name}<small>{course.credits} tín chỉ</small></button>)}</div>}
    </section><footer className="dash-footer"><span>Tiến độ bắt đầu từ một việc nhỏ.</span><span>Deadline Tracker</span></footer>
  </main>
}
