import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { AppDataProvider, useAppData } from '../context/AppDataContext'
import { AssignmentsPage } from './AssignmentsPage'

function TestAssignmentsPage() {
  const appData = useAppData()
  const { updateData, saveCourse: _saveCourse, deleteCourse: _deleteCourse, saveSchedule: _saveSchedule, deleteSchedule: _deleteSchedule, ...data } = appData
  return <AssignmentsPage data={data} updateData={updateData} />
}

const courses = [
  { id: 'c1', name: 'Cơ sở dữ liệu', teacher: '', credits: 3, color: '#6558d3' },
  { id: 'c2', name: 'Lập trình web', teacher: '', credits: 3, color: '#0ea5e9' },
]

const assignments = [
  { id: 'a1', courseId: 'c1', title: 'Bài SQL', description: '', dueDate: '2026-10-03T10:00', status: 'todo' as const },
  { id: 'a2', courseId: 'c2', title: 'Bài React', description: '', dueDate: '2026-10-01T10:00', status: 'done' as const },
  { id: 'a3', courseId: 'c1', title: 'Bài thiết kế', description: '', dueDate: '2026-10-02T10:00', status: 'done' as const },
]

describe('AssignmentsPage filters and ordering', () => {
  it('filters by course and status, then restores all assignments', async () => {
    const user = userEvent.setup()
    render(<AppDataProvider initialData={{ courses, assignments }}><TestAssignmentsPage /></AppDataProvider>)

    expect(screen.getByRole('heading', { name: 'Bài SQL' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Bài React' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Bài thiết kế' })).toBeInTheDocument()

    await user.selectOptions(screen.getByRole('combobox', { name: 'Lọc theo môn' }), 'c1')
    expect(screen.getByRole('heading', { name: 'Bài SQL' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Bài thiết kế' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Bài React' })).not.toBeInTheDocument()

    await user.selectOptions(screen.getByRole('combobox', { name: 'Lọc theo trạng thái' }), 'done')
    expect(screen.getByRole('heading', { name: 'Bài thiết kế' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Bài SQL' })).not.toBeInTheDocument()

    await user.selectOptions(screen.getByRole('combobox', { name: 'Lọc theo môn' }), 'all')
    await user.selectOptions(screen.getByRole('combobox', { name: 'Lọc theo trạng thái' }), 'all')
    expect(screen.getByRole('heading', { name: 'Bài SQL' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Bài React' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Bài thiết kế' })).toBeInTheDocument()
  })

  it('sorts the visible list by nearest deadline first', () => {
    render(<AppDataProvider initialData={{ courses, assignments }}><TestAssignmentsPage /></AppDataProvider>)

    expect(screen.getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent)).toEqual([
      'Bài React',
      'Bài thiết kế',
      'Bài SQL',
    ])
  })
})
