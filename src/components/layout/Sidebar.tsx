import type { PageId } from '../../App'

const items: Array<{ id: PageId; label: string; icon: string }> = [
  { id: 'dashboard', label: 'Tổng quan', icon: '⌂' },
  { id: 'courses', label: 'Môn học', icon: '▤' },
  { id: 'schedule', label: 'Lịch học', icon: '▦' },
  { id: 'assignments', label: 'Bài tập', icon: '✓' },
  { id: 'gpa', label: 'GPA dự kiến', icon: '◇' },
]

interface SidebarProps {
  activePage: PageId
  onClose: () => void
  onNavigate: (page: PageId) => void
  open: boolean
}

export function Sidebar({ activePage, onClose, onNavigate, open }: SidebarProps) {
  return (
    <aside className={`sidebar ${open ? 'sidebar--open' : ''}`} id="primary-sidebar">
      <div className="brand"><span className="brand__mark">S</span><span>StudySpace</span><button aria-label="Đóng menu điều hướng" className="sidebar__close" onClick={onClose} type="button">×</button></div>
      <nav aria-label="Điều hướng chính" className="nav-list">
        {items.map((item) => (
          <button
            className={`nav-item ${activePage === item.id ? 'nav-item--active' : ''}`}
            aria-current={activePage === item.id ? 'page' : undefined}
            key={item.id}
            onClick={() => onNavigate(item.id)}
            type="button"
          >
            <span className="nav-item__icon" aria-hidden="true">{item.icon}</span>{item.label}
          </button>
        ))}
      </nav>
      <div className="sidebar__footer">
        <div className="avatar">MA</div>
        <div><strong>Minh Anh</strong><span>Sinh viên</span></div>
      </div>
    </aside>
  )
}
