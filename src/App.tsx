import { useState } from 'react'
import { AppShell } from './components/layout/AppShell'
import { AssignmentsPage } from './pages/AssignmentsPage'
import { CoursesPage } from './pages/CoursesPage'
import { DashboardPage } from './pages/DashboardPage'
import { FoundationPage } from './pages/FoundationPage'
import { GpaPage } from './pages/GpaPage'

export type PageId = 'dashboard' | 'courses' | 'schedule' | 'assignments' | 'gpa'

const titles: Record<PageId, string> = {
  dashboard: 'Tổng quan', courses: 'Môn học', schedule: 'Lịch học', assignments: 'Bài tập', gpa: 'GPA dự kiến',
}

export default function App() {
  const [page, setPage] = useState<PageId>('dashboard')
  const content = page === 'dashboard' ? <DashboardPage />
    : page === 'courses' ? <CoursesPage />
    : page === 'schedule' ? <FoundationPage title="Lịch học" description="Quản lý thời khóa biểu theo tuần và từng môn học." />
    : page === 'assignments' ? <AssignmentsPage />
    : <GpaPage />

  return <AppShell activePage={page} title={titles[page]} onNavigate={setPage}>{content}</AppShell>
}
