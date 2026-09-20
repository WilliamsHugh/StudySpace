import { calculateDashboardStats, getUpcomingAssignments, isOverdue } from '../domain/assignment'
import { useStudySpace } from '../state/StudySpaceContext'

const formatDeadline = (value: string) => new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))

export function DashboardPage() {
  const { state } = useStudySpace()
  const stats = calculateDashboardStats(state.courses, state.assignments)
  const upcoming = getUpcomingAssignments(state.assignments)
  const coursesById = new Map(state.courses.map((course) => [course.id, course]))

  return <div className="page-stack">
    <section className="welcome-card"><div><span className="pill">HỌC KỲ HIỆN TẠI</span><h2>Chào {state.settings.displayName}! 👋</h2><p>Theo dõi tiến độ và ưu tiên những deadline gần nhất của bạn.</p></div><div className="welcome-card__art" aria-hidden="true">✦</div></section>
    <section className="stats-grid stats-grid--dashboard" aria-label="Thống kê học tập">
      <article className="stat-card stat-card--purple"><span>Tổng môn học</span><strong>{stats.courses}</strong><small>đang theo học</small></article>
      <article className="stat-card stat-card--blue"><span>Tổng bài tập</span><strong>{stats.assignments}</strong><small>tất cả deadline</small></article>
      <article className="stat-card stat-card--orange"><span>Cần làm</span><strong>{stats.todo}</strong><small>chưa bắt đầu</small></article>
      <article className="stat-card stat-card--purple"><span>Đang làm</span><strong>{stats.inProgress}</strong><small>đang thực hiện</small></article>
      <article className="stat-card stat-card--green"><span>Hoàn thành</span><strong>{stats.completed}</strong><small>đã hoàn tất</small></article>
      <article className="stat-card stat-card--red"><span>Quá hạn</span><strong>{stats.overdue}</strong><small>chưa hoàn thành</small></article>
    </section>
    <section className="panel">
      <div className="section-heading"><div><p className="eyebrow">ƯU TIÊN</p><h2>Deadline gần nhất</h2></div><span className="count-badge">{upcoming.length}</span></div>
      {upcoming.length === 0 ? <div className="list-empty">Không có deadline đang chờ. Bạn đã hoàn thành mọi bài tập!</div> : <div className="deadline-list">{upcoming.map((item) => {
        const course = coursesById.get(item.courseId)
        return <article className="deadline-item" key={item.id}><span className="deadline-item__dot" style={{ background: course?.color }} /><div><strong>{item.title}</strong><span>{course?.name ?? 'Môn học đã xóa'}</span></div><time dateTime={item.dueDate}>{formatDeadline(item.dueDate)}</time>{isOverdue(item) && <span className="status-chip status-chip--overdue">Quá hạn</span>}</article>
      })}</div>}
    </section>
  </div>
}
