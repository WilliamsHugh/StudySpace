import { useState } from 'react'
import { AppShell } from './components/layout/AppShell'
import { AssignmentsPage } from './pages/AssignmentsPage'
import { CoursesPage } from './pages/CoursesPage'
import { DashboardPage } from './pages/DashboardPage'
import { GpaPage } from './pages/GpaPage'
import { SchedulePage } from './features/schedule/SchedulePage'

export type PageId = 'dashboard' | 'courses' | 'schedule' | 'assignments' | 'gpa'

const titles: Record<PageId, string> = {
  dashboard: 'Tổng quan', courses: 'Môn học', schedule: 'Lịch học', assignments: 'Bài tập', gpa: 'GPA dự kiến',
}

export default function App() {
  const [page, setPage] = useState<PageId>('dashboard')
  const content = page === 'dashboard' ? <DashboardPage onNavigate={setPage} />
    : page === 'courses' ? <CoursesPage />
    : page === 'schedule' ? <SchedulePage />
    : page === 'assignments' ? <AssignmentsPage />
    : <GpaPage />

  return <AppShell activePage={page} title={titles[page]} onNavigate={setPage}>{content}</AppShell>
}
