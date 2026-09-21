import { useState } from 'react'
import { AppDataProvider, useAppData } from './context/AppDataContext'
import { AppShell } from './components/layout/AppShell'
import { CoursesPage } from './features/courses/CoursesPage'
import { SchedulePage } from './features/schedule/SchedulePage'
import { AssignmentsPage } from './pages/AssignmentsPage'
import { DashboardPage } from './pages/DashboardPage'
import { GpaPage } from './pages/GpaPage'
import './styles.css'
import './dashboard.css'

export type PageId = 'dashboard' | 'courses' | 'schedule' | 'assignments' | 'gpa'

const pageTitles: Record<PageId, string> = {
  dashboard: 'Dashboard',
  courses: 'Môn học',
  schedule: 'Thời khóa biểu',
  assignments: 'Bài tập',
  gpa: 'GPA Simulator',
}

function AppContent() {
  const [page, setPage] = useState<PageId>('dashboard')
  const appData = useAppData()
  const { updateData, saveCourse: _saveCourse, deleteCourse: _deleteCourse, saveSchedule: _saveSchedule, deleteSchedule: _deleteSchedule, ...data } = appData

  return (
    <AppShell activePage={page} title={pageTitles[page]} onNavigate={setPage}>
      {page === 'dashboard' && <DashboardPage data={data} onNavigate={setPage} />}
      {page === 'courses' && <CoursesPage />}
      {page === 'schedule' && <SchedulePage />}
      {(page === 'assignments' || page === 'gpa') && (
        <main>
          <div className="page-title">
            <div>
              <span className="eyebrow">Deadline Tracker</span>
              <h1>{page === 'assignments' ? 'Bài tập & deadline' : 'GPA Simulator'}</h1>
            </div>
            <p>{page === 'assignments' ? 'Sắp xếp ưu tiên, theo dõi tiến độ và không bỏ lỡ hạn nộp.' : 'Thử các mức điểm dự kiến và xem GPA có trọng số ngay lập tức.'}</p>
          </div>
          {page === 'assignments' ? <AssignmentsPage data={data} updateData={updateData} /> : <GpaPage data={data} updateData={updateData} />}
        </main>
      )}
    </AppShell>
  )
}

export default function App() {
  return <AppDataProvider><AppContent /></AppDataProvider>
}
