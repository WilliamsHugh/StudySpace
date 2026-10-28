import { useMemo, useState } from 'react'
import { getOverdueAssignments, getUpcomingAssignments, priorityLabels, statusLabels } from '../domain/assignments'
import { calculateWeightedGpa } from '../domain/gpa'
import { calculateWeeklyWorkload } from '../domain/workload'
import type { AppData, Assignment } from '../types'

type Page = 'dashboard' | 'courses' | 'schedule' | 'assignments' | 'gpa'

export function DashboardPage({ data, onNavigate }: { data: AppData; onNavigate: (page: Page) => void }) {
  const [query, setQuery] = useState('')
  const now = new Date()
  const courseById = useMemo(() => new Map(data.courses.map((course) => [course.id, course])), [data.courses])
  const upcoming = getUpcomingAssignments(data.assignments, now, 5)
  const overdue = getOverdueAssignments(data.assignments, now)
  const completed = data.assignments.filter((item) => item.status === 'done').length
  const inProgress = data.assignments.filter((item) => item.status === 'in-progress').length
  const todo = data.assignments.filter((item) => item.status === 'todo').length
  const gpa = calculateWeightedGpa(data.gpaEntries)
  const filtered = upcoming.filter((item) => {
    const course = courseById.get(item.courseId)?.name ?? ''
    return `${item.title} ${course}`.toLocaleLowerCase('vi').includes(query.trim().toLocaleLowerCase('vi'))
  })
  const completion = data.assignments.length ? Math.round(completed / data.assignments.length * 100) : 0
  const dateText = new Intl.DateTimeFormat('vi-VN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(now)

  const workload = useMemo(
    () => calculateWeeklyWorkload(data.schedules, data.assignments, data.courses, now),
    [data.schedules, data.assignments, data.courses],
  )

  return <main className="dash-page">
    <div className="dash-welcome"><div><p className="dash-date">{dateText}</p><h1>Chào Thuận, bắt đầu nhé!</h1><p>Một chút tập trung hôm nay sẽ giúp bạn tiến xa hơn.</p></div><button className="dash-primary" onClick={() => onNavigate('assignments')} aria-label="Thêm công việc mới">＋ Thêm công việc</button></div>
    <section className="dash-stats" aria-label="Tổng quan học tập">
      <article className="dash-stat"><span className="dash-stat-icon purple">▤</span><small>HỌC TẬP</small><strong>{data.courses.length}<em> môn học</em></strong><span>Đang theo dõi trong học kỳ</span></article>
      <article className="dash-stat"><span className="dash-stat-icon blue">☷</span><small>CÔNG VIỆC</small><strong>{data.assignments.length}<em> nhiệm vụ</em></strong><span><b>{completed} hoàn thành</b> · {data.assignments.length - completed} còn lại</span></article>
      <article className="dash-stat"><span className="dash-stat-icon orange">◷</span><small>CẦN LƯU Ý</small><strong>{overdue.length}<em> quá hạn</em></strong><span>Trong số công việc chưa hoàn thành</span></article>
      <article className="dash-stat"><span className="dash-stat-icon green">✧</span><small>MỤC TIÊU</small><strong>{gpa == null ? '—' : gpa.toFixed(2)}<em> / 4.00 GPA</em></strong><span>{gpa == null ? 'Nhập điểm dự kiến để xem GPA' : 'GPA dự kiến theo tín chỉ'}</span></article>
    </section>
    <div className="dash-columns">
      <section className="dash-panel"><header className="dash-panel-head"><div><h2>Deadline sắp tới</h2><p>Các việc cần hoàn thành tiếp theo</p></div><button onClick={() => onNavigate('assignments')} aria-label="Xem tất cả bài tập">Xem tất cả →</button></header>
        <label className="dash-search"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm công việc hoặc môn học" aria-label="Tìm công việc hoặc môn học" /></label>
        <div className="dash-list">{filtered.length === 0 ? <div className="dash-empty"><span>✓</span><strong>{upcoming.length ? 'Không tìm thấy công việc' : 'Chưa có deadline sắp tới'}</strong><small>{upcoming.length ? 'Thử từ khóa khác nhé.' : 'Thêm deadline để bắt đầu theo dõi.'}</small></div> : filtered.map((item: Assignment) => {
          const course = courseById.get(item.courseId)
          const priority = item.priority ?? 'medium'
          return <article className="dash-assignment" key={item.id}><i style={{ background: course?.color ?? '#a8aebd' }} /><div><strong>{item.title}</strong><small>{course?.name ?? 'Môn học đã xóa'}</small>{item.tags && item.tags.length > 0 && <div className="dash-tags">{item.tags.map((t) => <span key={t} className="dash-tag">#{t}</span>)}</div>}</div><div className="dash-assignment-badges"><span className={`dash-priority ${priority}`}>{priorityLabels[priority]}</span><span className={`dash-status ${item.status}`}>{statusLabels[item.status]}</span></div><time>{new Intl.DateTimeFormat('vi-VN', { day: 'numeric', month: 'short' }).format(new Date(item.dueDate))}</time></article>
        })}</div>
      </section>
      <section className="dash-panel dash-progress"><header className="dash-panel-head"><div><h2>Tiến độ học tập</h2><p>Tổng quan các công việc</p></div><span className="dash-spark">✧</span></header>
        <div className="dash-progress-number"><strong>{completion}<small>%</small></strong><span>đã hoàn thành</span></div><div className="dash-track"><span style={{ width: `${completion}%` }} /></div>
        <div className="dash-legend"><span className="legend-done"><i /> Hoàn thành <b>{completed}</b></span><span className="legend-progress"><i /> Đang thực hiện <b>{inProgress}</b></span><span className="legend-todo"><i /> Chưa làm <b>{todo}</b></span></div>
        <div className="dash-note">✓　{data.assignments.length ? `${inProgress} công việc đang được xử lý. Cứ tiếp tục từng bước!` : 'Thêm công việc để theo dõi tiến độ của bạn.'}</div>
      </section>
    </div>

    {/* Widget Tải học tập theo tuần */}
    <section className="dash-panel dash-workload" aria-label="Tải học tập theo tuần">
      <header className="dash-panel-head">
        <div>
          <h2>Tải học tập theo tuần</h2>
          <p>Phân bổ lịch học và hạn nộp bài tập theo từng ngày trong tuần</p>
        </div>
        <button onClick={() => onNavigate('schedule')}>Xem thời khóa biểu →</button>
      </header>
      <div className="workload-summary-bar">
        <span>Tổng cộng tuần này: <strong>{workload.totalClasses} buổi học</strong> · <strong>{workload.totalAssignments} deadline</strong></span>
        {workload.peakDay ? (
          <span className="peak-badge">Ngày bận rộn nhất: <b>{workload.peakDay.dayName} ({workload.peakDay.totalItems} việc)</b></span>
        ) : (
          <span>Tuần này chưa có lịch bận</span>
        )}
      </div>
      <div className="workload-grid">
        {workload.days.map((day) => (
          <div key={day.dayOfWeek} className={`workload-day-card workload-${day.level}`}>
            <div className="workload-day-header">
              <strong>{day.dayName}</strong>
              <span className={`workload-status-chip ${day.level}`}>{day.statusLabel}</span>
            </div>
            <div className="workload-day-metrics">
              <span>{day.classes.length} buổi</span> · <span>{day.assignments.length} hạn</span>
            </div>
            {day.totalItems > 0 ? (
              <ul className="workload-items-list">
                {day.classes.slice(0, 2).map((c) => (
                  <li key={c.scheduleId} title={`${c.courseName} (${c.time})`}>
                    <i style={{ background: c.color }} />
                    <span>{c.courseName}</span>
                    <small>{c.time}</small>
                  </li>
                ))}
                {day.assignments.slice(0, 2).map((a) => (
                  <li key={a.assignmentId} className="workload-assignment-item" title={a.title}>
                    <span>📝 {a.title}</span>
                  </li>
                ))}
                {day.totalItems > 4 && (
                  <li className="workload-more-items">+{day.totalItems - 4} việc khác</li>
                )}
              </ul>
            ) : (
              <div className="workload-empty-day">Trống lịch</div>
            )}
          </div>
        ))}
      </div>
    </section>

    <section className="dash-panel dash-courses"><header className="dash-panel-head"><div><h2>Môn học của bạn</h2><p>Các môn đang theo dõi trong học kỳ này</p></div><button onClick={() => onNavigate('courses')}>Quản lý môn học →</button></header>
      {data.courses.length === 0 ? <div className="dash-course-empty"><span>▤</span><div><strong>Bắt đầu với môn học đầu tiên</strong><small>Thêm môn học để kết nối lịch học, deadline và điểm số.</small></div><button onClick={() => onNavigate('courses')}>＋ Thêm môn học</button></div> : <div className="dash-course-chips">{data.courses.slice(0, 6).map((course) => <button key={course.id} onClick={() => onNavigate('courses')}><i style={{ background: course.color }} />{course.name}<small>{course.credits} tín chỉ</small></button>)}</div>}
    </section><footer className="dash-footer"><span>Tiến độ bắt đầu từ một việc nhỏ.</span><span>Deadline Tracker</span></footer>
  </main>
}
