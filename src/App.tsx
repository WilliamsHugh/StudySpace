import { useState } from 'react'
import { AppDataProvider, useAppData } from './context/AppDataContext'
import { CoursesPage } from './features/courses/CoursesPage'
import { SchedulePage } from './features/schedule/SchedulePage'
import { AssignmentsPage } from './pages/AssignmentsPage'
import { DashboardPage } from './pages/DashboardPage'
import { GpaPage } from './pages/GpaPage'
import { BackupRestoreModal } from './components/BackupRestoreModal'
import './styles.css'
import './dashboard.css'

type Page = 'dashboard' | 'courses' | 'schedule' | 'assignments' | 'gpa'

const pageLabels: Record<Page, string> = {
  dashboard: 'Dashboard',
  courses: 'Môn học',
  schedule: 'Thời khóa biểu',
  assignments: 'Bài tập',
  gpa: 'GPA Simulator',
}

function AppContent() {
  const [page, setPage] = useState<Page>('dashboard')
  const [showBackupModal, setShowBackupModal] = useState(false)
  const appData = useAppData()
  const {
    storageError,
    clearStorageError,
    updateData,
    saveCourse: _saveCourse,
    deleteCourse: _deleteCourse,
    saveSchedule: _saveSchedule,
    deleteSchedule: _deleteSchedule,
    ...data
  } = appData

  return (
    <div className="app-shell">
      {storageError && (
        <div className="storage-error-banner" role="alert" aria-live="assertive">
          <div className="storage-error-content">
            <span className="storage-error-icon" aria-hidden="true">⚠️</span>
            <div className="storage-error-text">
              <strong>Cảnh báo lưu trữ:</strong> {storageError}
            </div>
            <button
              type="button"
              className="storage-error-dismiss"
              onClick={clearStorageError}
              aria-label="Đóng thông báo lỗi lưu trữ"
            >
              ✕
            </button>
          </div>
        </div>
      )}
      <header className="app-header">
        <div className="brand"><span>DT</span><div><strong>Deadline Tracker</strong><small>Học đúng kế hoạch</small></div></div>
        <nav aria-label="Điều hướng chính">
          {(Object.keys(pageLabels) as Page[]).map((item) => (
            <button key={item} className={page === item ? 'active' : ''} onClick={() => setPage(item)}>{pageLabels[item]}</button>
          ))}
        </nav>
        <button
          type="button"
          className="button secondary"
          style={{ marginLeft: '12px', fontSize: '0.82rem', padding: '7px 12px', background: 'rgba(255,255,255,0.15)', color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
          onClick={() => setShowBackupModal(true)}
          aria-label="Mở cửa sổ sao lưu và khôi phục dữ liệu"
        >
          💾 Sao lưu / Khôi phục
        </button>
      </header>
      {page === 'dashboard' && <DashboardPage data={data} onNavigate={setPage} />}
      {page === 'courses' && <CoursesPage />}
      {page === 'schedule' && <SchedulePage />}
      {(page === 'assignments' || page === 'gpa') && <main>
        <div className="page-title">
          <div><span className="eyebrow">Deadline Tracker</span><h1>{page === 'assignments' ? 'Bài tập & deadline' : 'GPA Simulator'}</h1></div>
          <p>{page === 'assignments' ? 'Sắp xếp ưu tiên, theo dõi tiến độ và không bỏ lỡ hạn nộp.' : 'Thử các mức điểm dự kiến và xem GPA có trọng số ngay lập tức.'}</p>
        </div>
        {page === 'assignments' ? <AssignmentsPage data={data} updateData={updateData} /> : <GpaPage data={data} updateData={updateData} />}
      </main>}
      {showBackupModal && (
        <BackupRestoreModal
          data={data}
          onRestore={(restored) => updateData(() => restored)}
          onClose={() => setShowBackupModal(false)}
        />
      )}
    </div>
  )
}

export default function App() {
  return <AppDataProvider><AppContent /></AppDataProvider>
}
